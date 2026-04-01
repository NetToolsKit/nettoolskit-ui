import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkAppSidebar from '../../../../src/components/builders/NtkAppSidebar.vue'
import NtkNotificationCenter from '../../../../src/components/builders/NtkNotificationCenter.vue'

const routerStub = { useRoute: () => ({ path: '/dashboard' }) }

const sidebarGlobal = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-avatar': { template: '<div class="avatar"><slot /></div>' },
      'q-separator': true,
      'q-list': { template: '<ul><slot /></ul>' },
      'q-item': { template: '<li class="q-item" v-bind="$attrs" @click="$emit(\'click\')"><slot /></li>' },
      'q-item-section': { template: '<div><slot /></div>' },
      'q-item-label': { template: '<span><slot /></span>' },
      'q-icon': { template: '<span class="icon" />' },
      'q-badge': { template: '<span class="badge"><slot /></span>' },
      'q-expansion-item': { template: '<div class="expansion"><slot /></div>' },
    },
    mocks: {
      $route: { path: '/dashboard' },
    },
  },
}

// ─── NtkAppSidebar ─────────────────────────────────────────────────────────

describe('NtkAppSidebar', () => {
  it('renders menu items', () => {
    const wrapper = shallowMount(NtkAppSidebar, {
      ...sidebarGlobal,
      props: {
        menuItems: [
          { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
          { label: 'Settings', icon: 'settings', to: '/settings' },
        ],
      },
    })

    const items = wrapper.findAll('.q-item')
    expect(items.length).toBeGreaterThanOrEqual(2)
  })

  it('renders section header and separator items', () => {
    const wrapper = shallowMount(NtkAppSidebar, {
      ...sidebarGlobal,
      props: {
        menuItems: [
          { type: 'header', label: 'Admin' },
          { type: 'separator', label: '' },
          { label: 'Users', icon: 'people', to: '/users' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Admin')
    expect(wrapper.find('q-separator-stub').exists()).toBe(true)
  })

  it('renders user profile when showUserProfile is true', () => {
    const wrapper = shallowMount(NtkAppSidebar, {
      ...sidebarGlobal,
      props: {
        menuItems: [],
        showUserProfile: true,
        userProfile: { name: 'Ana Lima', email: 'ana@corp.com' },
      },
    })

    expect(wrapper.find('.sidebar-profile').exists()).toBe(true)
    expect(wrapper.text()).toContain('Ana Lima')
    expect(wrapper.text()).toContain('ana@corp.com')
  })

  it('does not render user profile when showUserProfile is false', () => {
    const wrapper = shallowMount(NtkAppSidebar, {
      ...sidebarGlobal,
      props: {
        menuItems: [],
        showUserProfile: false,
      },
    })

    expect(wrapper.find('.sidebar-profile').exists()).toBe(false)
  })

  it('computes initials from userProfile name', () => {
    const wrapper = shallowMount(NtkAppSidebar, {
      ...sidebarGlobal,
      props: {
        menuItems: [],
        showUserProfile: true,
        userProfile: { name: 'João Silva', email: 'joao@corp.com' },
      },
    })

    expect(wrapper.find('.avatar').text()).toBe('JS')
  })

  it('emits item-click when handleItemClick is called', () => {
    const item = { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' }
    const wrapper = shallowMount(NtkAppSidebar, {
      ...sidebarGlobal,
      props: { menuItems: [item] },
    })

    ;(wrapper.vm as unknown as { handleItemClick: (i: typeof item) => void }).handleItemClick(item)
    expect(wrapper.emitted('item-click')).toHaveLength(1)
    expect((wrapper.emitted('item-click')?.[0] as unknown[])[0]).toMatchObject({ label: 'Dashboard' })
  })

  it('calls item onClick callback when handleItemClick is called', () => {
    const onClick = vi.fn()
    const item = { label: 'Logout', onClick }
    const wrapper = shallowMount(NtkAppSidebar, {
      ...sidebarGlobal,
      props: { menuItems: [item] },
    })

    ;(wrapper.vm as unknown as { handleItemClick: (i: typeof item) => void }).handleItemClick(item)
    expect(onClick).toHaveBeenCalled()
  })
})

// ─── NtkNotificationCenter ─────────────────────────────────────────────────

const notificationGlobal = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-btn': { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' },
      'q-badge': { template: '<span class="badge"><slot /></span>' },
      'q-menu': { template: '<div v-if="modelValue" class="menu"><slot /></div>', props: ['modelValue'] },
      'q-card': { template: '<div><slot /></div>' },
      'q-card-section': { template: '<div><slot /></div>' },
      'q-separator': true,
      'q-scroll-area': { template: '<div><slot /></div>' },
      'q-list': { template: '<ul><slot /></ul>' },
      'q-item': { template: '<li v-bind="$attrs" @click="$emit(\'click\')"><slot /></li>' },
      'q-item-section': { template: '<div><slot /></div>' },
      'q-item-label': { template: '<span><slot /></span>' },
      'q-avatar': { template: '<div class="avatar"><slot /></div>' },
      'q-icon': { template: '<span class="icon" />' },
    },
  },
}

describe('NtkNotificationCenter', () => {
  const notifications = [
    { id: '1', type: 'info' as const, title: 'Build done', message: 'Deploy succeeded', timestamp: new Date(), read: false },
    { id: '2', type: 'error' as const, title: 'Deploy failed', message: 'Check logs', timestamp: new Date(), read: true },
    { id: '3', type: 'success' as const, title: 'Backup complete', message: 'All files backed up', timestamp: new Date(), read: false },
  ]

  it('shows unread badge count', () => {
    const wrapper = shallowMount(NtkNotificationCenter, {
      ...notificationGlobal,
      props: { notifications },
    })

    // 2 unread (ids 1 and 3)
    expect(wrapper.find('.badge').text()).toBe('2')
  })

  it('does not show badge when all notifications are read', () => {
    const wrapper = shallowMount(NtkNotificationCenter, {
      ...notificationGlobal,
      props: {
        notifications: notifications.map(n => ({ ...n, read: true })),
      },
    })

    expect(wrapper.find('.badge').exists()).toBe(false)
  })

  it('emits mark-all-as-read when markAllAsRead is called internally', () => {
    const wrapper = shallowMount(NtkNotificationCenter, {
      ...notificationGlobal,
      props: { notifications },
    })

    // Call the internal method directly via vm
    ;(wrapper.vm as unknown as { markAllAsRead: () => void }).markAllAsRead()
    expect(wrapper.emitted('mark-all-as-read')).toHaveLength(1)
  })

  it('emits view-all when viewAll is called internally', () => {
    const wrapper = shallowMount(NtkNotificationCenter, {
      ...notificationGlobal,
      props: { notifications },
    })

    ;(wrapper.vm as unknown as { viewAll: () => void }).viewAll()
    expect(wrapper.emitted('view-all')).toHaveLength(1)
  })

  it('emits notification-click when a notification is clicked', () => {
    const wrapper = shallowMount(NtkNotificationCenter, {
      ...notificationGlobal,
      props: { notifications },
    })

    const n = notifications[0]!
    ;(wrapper.vm as unknown as { handleNotificationClick: (n: typeof notifications[0]) => void }).handleNotificationClick(n)
    expect(wrapper.emitted('notification-click')?.[0]).toEqual([n])
  })
})