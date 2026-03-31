import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { INotificationService } from '../../../src/services/NotificationService'
import {
  createDefaultTemplateLayoutShells,
  createTemplateAuthStore,
  createTemplateLayoutStore,
  createTemplateMenuConstants,
  createTemplateMenuFromScaffoldRoutes,
  createTemplateNotificationBridge,
  createTemplateRouteScaffold,
  createTemplateUseAuth,
  type TemplateScaffoldRouteNode,
} from '../../../src/templates/scaffolding'

const routeComponentStub = () => null

describe('template scaffolding helpers', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMemoryStorage(),
      configurable: true,
      writable: true,
    })
  })

  it('creates route scaffold grouped by layout shells with catch-all route', () => {
    const layouts = createDefaultTemplateLayoutShells(
      routeComponentStub,
      routeComponentStub,
      routeComponentStub
    )

    const routes: TemplateScaffoldRouteNode[] = [
      {
        id: 'dashboard',
        path: 'dashboard',
        name: 'DashboardRoute',
        component: routeComponentStub,
        layoutId: 'main',
        menu: {
          text: 'Dashboard',
          icon: 'dashboard',
          order: 2,
        },
      },
      {
        id: 'login',
        path: 'login',
        name: 'LoginRoute',
        component: routeComponentStub,
        layoutId: 'auth',
        menu: false,
      },
    ]

    const scaffold = createTemplateRouteScaffold({
      layouts,
      routes,
      appendCatchAll: true,
      catchAllRedirectName: 'DashboardRoute',
    })

    expect(scaffold).toHaveLength(4)
    expect(scaffold[0]?.name).toBe('template-main-layout')
    expect(scaffold[0]?.children).toHaveLength(1)
    expect(scaffold[1]?.name).toBe('template-auth-layout')
    expect(scaffold[1]?.children).toHaveLength(1)
    expect(scaffold[3]?.path).toBe('/:pathMatch(.*)*')
  })

  it('derives menu constants from route scaffold nodes', () => {
    const routes: TemplateScaffoldRouteNode[] = [
      {
        id: 'admin',
        path: '/admin',
        name: 'AdminRoute',
        component: routeComponentStub,
        menu: {
          text: 'Admin',
          order: 1,
        },
        children: [
          {
            id: 'users',
            path: 'users',
            name: 'UsersRoute',
            component: routeComponentStub,
            menu: {
              text: 'Users',
              order: 1,
            },
          },
        ],
      },
      {
        id: 'dashboard',
        path: 'dashboard',
        name: 'DashboardRoute',
        component: routeComponentStub,
        menu: {
          text: 'Dashboard',
          icon: 'dashboard',
          order: 2,
        },
      },
      {
        id: 'hidden',
        path: '/hidden',
        name: 'HiddenRoute',
        component: routeComponentStub,
        menu: false,
      },
    ]

    const menu = createTemplateMenuFromScaffoldRoutes(routes, {
      defaultIcon: 'folder',
    })

    expect(menu).toHaveLength(2)
    expect(menu[0]?.id).toBe('admin')
    expect(menu[0]?.icon).toBe('folder')
    expect(menu[0]?.children).toEqual([
      {
        id: 'users',
        text: 'Users',
        icon: undefined,
        to: '/admin/users',
        routeName: 'UsersRoute',
        disabled: undefined,
      },
    ])
    expect(menu[1]?.id).toBe('dashboard')
    expect(menu[1]?.icon).toBe('dashboard')
  })

  it('maps explicit menu definitions into template menu constants', () => {
    const menu = createTemplateMenuConstants([
      {
        id: 'reports',
        text: 'Reports',
        icon: 'analytics',
        to: '/reports',
        order: 2,
      },
      {
        id: 'home',
        text: 'Home',
        icon: 'home',
        to: '/',
        order: 1,
        children: [
          {
            id: 'overview',
            text: 'Overview',
            routeName: 'OverviewRoute',
            order: 1,
          },
        ],
      },
    ])

    expect(menu.map(item => item.id)).toEqual(['home', 'reports'])
    expect(menu[0]?.children).toEqual([
      {
        id: 'overview',
        text: 'Overview',
        icon: undefined,
        to: undefined,
        routeName: 'OverviewRoute',
        disabled: undefined,
      },
    ])
  })

  it('creates a layout store scaffold with persistence and computed contracts', () => {
    const store = createTemplateLayoutStore({
      storageKeyPrefix: 'ntk-template-test-layout',
      persist: true,
    })

    expect(store.drawerWidth.value).toBe(250)
    expect(store.showDrawer.value).toBe(true)
    expect(store.showHeader.value).toBe(true)

    store.toggleMiniMode()
    expect(store.drawerWidth.value).toBe(56)

    store.toggleShowLabelsInMini()
    expect(store.drawerWidth.value).toBe(90)

    store.toggleMenuMode()
    expect(store.state.menuMode).toBe('horizontal')
    expect(store.showDrawer.value).toBe(false)

    expect(localStorage.getItem('ntk-template-test-layout:menuMode')).toBe('horizontal')
    expect(localStorage.getItem('ntk-template-test-layout:miniMode')).toBe('true')
  })

  it('hydrates layout store state from localStorage when persistence is enabled', () => {
    localStorage.setItem('ntk-template-hydrate:menuMode', 'horizontal')
    localStorage.setItem('ntk-template-hydrate:miniMode', 'true')
    localStorage.setItem('ntk-template-hydrate:showLabelsInMini', 'true')
    localStorage.setItem('ntk-template-hydrate:isFullscreen', 'false')
    localStorage.setItem('ntk-template-hydrate:leftDrawerOpen', 'false')
    localStorage.setItem('ntk-template-hydrate:rightDrawerOpen', 'true')

    const store = createTemplateLayoutStore({
      storageKeyPrefix: 'ntk-template-hydrate',
      persist: true,
    })

    expect(store.state.menuMode).toBe('horizontal')
    expect(store.state.miniMode).toBe(true)
    expect(store.state.showLabelsInMini).toBe(true)
    expect(store.state.leftDrawerOpen).toBe(false)
    expect(store.state.rightDrawerOpen).toBe(true)
  })

  it('creates a notification bridge with defaults and preset support', () => {
    const success = vi.fn()
    const error = vi.fn()
    const warning = vi.fn()
    const info = vi.fn()
    const notify = vi.fn()
    const loading = vi.fn(() => ({
      dismiss: vi.fn(),
    }))

    const service: INotificationService = {
      success,
      error,
      warning,
      info,
      notify,
      loading,
    }

    const bridge = createTemplateNotificationBridge({
      service,
      defaultPosition: 'bottom-right',
      defaultTimeout: 4200,
      presets: [
        {
          id: 'approved',
          message: 'Approved successfully',
          type: 'success',
          icon: 'check_circle',
        },
      ],
    })

    bridge.success('Saved')
    bridge.error('Something failed')
    bridge.warning('Please review')
    bridge.info('Heads up')
    bridge.notify({
      message: 'Custom notification',
      type: 'warning',
    })
    bridge.notifyPreset('approved', {
      timeout: 1200,
    })
    bridge.notifyPreset('missing-preset')
    bridge.loading('Fetching data...')

    expect(success).toHaveBeenCalledWith(
      'Saved',
      expect.objectContaining({
        position: 'bottom-right',
        timeout: 4200,
      })
    )
    expect(success.mock.calls[0]?.[1]).not.toHaveProperty('message')
    expect(error).toHaveBeenCalledTimes(1)
    expect(warning).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledTimes(1)
    expect(notify).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        message: 'Custom notification',
        type: 'warning',
        position: 'bottom-right',
        timeout: 4200,
      })
    )
    expect(notify).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        message: 'Approved successfully',
        type: 'success',
        icon: 'check_circle',
        position: 'bottom-right',
        timeout: 1200,
      })
    )
    expect(notify).toHaveBeenCalledTimes(2)
    expect(loading).toHaveBeenCalledWith('Fetching data...')
  })

  it('auth store: sets, reads and clears user + token state', () => {
    const storage = new Map<string, string>()
    const store = createTemplateAuthStore({
      persist: (key, value) => storage.set(key, JSON.stringify(value)),
      remove: (key) => storage.delete(key),
      read: <T>(key: string): T | null => {
        const raw = storage.get(key)
        return raw !== undefined ? (JSON.parse(raw) as T) : null
      },
    })

    expect(store.isAuthenticated.value).toBe(false)
    expect(store.userName.value).toBe('')
    expect(store.userInitials.value).toBe('')
    expect(store.userRole.value).toBeNull()

    store.setAuth({ id: '1', name: 'Ana Lima', email: 'ana@example.com', role: 'Admin' }, 'tok-abc')

    expect(store.isAuthenticated.value).toBe(true)
    expect(store.userName.value).toBe('Ana Lima')
    expect(store.userInitials.value).toBe('AL')
    expect(store.userRole.value).toBe('Admin')
    expect(storage.has('auth_token')).toBe(true)

    store.logout()

    expect(store.isAuthenticated.value).toBe(false)
    expect(storage.has('auth_token')).toBe(false)
    expect(storage.has('auth_user')).toBe(false)
  })

  it('auth store: checkAuth restores state from persistence', () => {
    const user = { id: '2', name: 'Carlos Melo', email: 'carlos@example.com' }
    const storage = new Map<string, string>([
      ['auth_token', JSON.stringify('tok-xyz')],
      ['auth_user', JSON.stringify(user)],
    ])

    const store = createTemplateAuthStore({
      read: <T>(key: string): T | null => {
        const raw = storage.get(key)
        return raw !== undefined ? (JSON.parse(raw) as T) : null
      },
    })

    expect(store.isAuthenticated.value).toBe(true)
    expect(store.userName.value).toBe('Carlos Melo')
    expect(store.userInitials.value).toBe('CM')
  })

  it('auth store: single-word name produces two-char initials', () => {
    const store = createTemplateAuthStore()
    store.setAuth({ id: '3', name: 'Bruno', email: 'b@b.com' }, 'tok')
    expect(store.userInitials.value).toBe('BR')
  })

  it('auth store: updateUserName mutates name and re-persists', () => {
    const storage = new Map<string, string>()
    const store = createTemplateAuthStore({
      persist: (key, value) => storage.set(key, JSON.stringify(value)),
      read: <T>(key: string): T | null => {
        const raw = storage.get(key)
        return raw !== undefined ? (JSON.parse(raw) as T) : null
      },
    })

    store.setAuth({ id: '4', name: 'Old Name', email: 'x@x.com' }, 'tok')
    store.updateUserName('New Name')

    expect(store.userName.value).toBe('New Name')
    const persisted = JSON.parse(storage.get('auth_user')!) as { name: string }
    expect(persisted.name).toBe('New Name')
  })

  it('createTemplateUseAuth: logout calls store.logout and navigate', async () => {
    const store = createTemplateAuthStore()
    store.setAuth({ id: '5', name: 'Dev User', email: 'd@d.com' }, 'tok')

    const navigate = vi.fn().mockResolvedValue(undefined)
    const auth = createTemplateUseAuth(store, navigate)

    expect(auth.isAuthenticated.value).toBe(true)
    await auth.logout()

    expect(store.isAuthenticated.value).toBe(false)
    expect(navigate).toHaveBeenCalledTimes(1)
  })
})

function createMemoryStorage(): Storage {
  const memory = new Map<string, string>()

  return {
    get length() {
      return memory.size
    },
    clear() {
      memory.clear()
    },
    getItem(key: string) {
      return memory.has(key) ? (memory.get(key) ?? null) : null
    },
    key(index: number) {
      return Array.from(memory.keys())[index] ?? null
    },
    removeItem(key: string) {
      memory.delete(key)
    },
    setItem(key: string, value: string) {
      memory.set(key, value)
    },
  }
}