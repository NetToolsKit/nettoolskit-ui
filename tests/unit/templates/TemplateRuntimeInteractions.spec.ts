import { nextTick, type Component } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import type { RouteRecordRaw, Router } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.unmock('vue-router')

const runtimeInteractionMocks = vi.hoisted(() => {
  const layoutControls = {
    horizontalMode: false,
    showLabelsInMini: false,
    sideMenuVariant: 'reference' as const,
    setHorizontalMode: vi.fn(),
    setShowLabelsInMini: vi.fn(),
    setSideMenuVariant: vi.fn(),
  }

  return {
    loginPayload: {
      email: 'ops@nettoolskit.dev',
      password: 'demo-password',
    },
    settingsSavePayload: null as null | Record<string, unknown>,
    layoutControls,
    reset() {
      this.loginPayload = {
        email: 'ops@nettoolskit.dev',
        password: 'demo-password',
      }
      this.settingsSavePayload = null
      this.layoutControls.horizontalMode = false
      this.layoutControls.showLabelsInMini = false
      this.layoutControls.sideMenuVariant = 'reference'
      this.layoutControls.setHorizontalMode.mockReset()
      this.layoutControls.setShowLabelsInMini.mockReset()
      this.layoutControls.setSideMenuVariant.mockReset()
    },
  }
})

vi.mock('../../../src/templates/layouts', async () => {
  const { defineComponent, h } = await vi.importActual<typeof import('vue')>('vue')

  return {
    clearTemplateLayoutPersistence: vi.fn((storageKeyPrefix = 'ntk-template-layout') => {
      const keysToRemove = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
        .filter((key): key is string => Boolean(key?.startsWith(`${storageKeyPrefix}:`)))

      for (const key of keysToRemove) {
        localStorage.removeItem(key)
      }
    }),
    AuthLayoutTemplate: defineComponent({
      name: 'AuthLayoutTemplate',
      setup(_props, { slots }) {
        return () => h('section', { class: 'mock-auth-layout' }, slots.default?.())
      },
    }),
    MainLayoutTemplate: defineComponent({
      name: 'MainLayoutTemplate',
      props: {
        appName: String,
        userName: String,
        userInitials: String,
        menuItems: Array,
      },
      setup(props, { slots }) {
        return () => h('section', { class: 'mock-main-layout' }, [
          h('strong', { class: 'mock-main-layout__app-name' }, String(props.appName ?? '')),
          h('span', { class: 'mock-main-layout__user-name' }, String(props.userName ?? '')),
          h('span', { class: 'mock-main-layout__user-initials' }, String(props.userInitials ?? '')),
          h(
            'nav',
            { class: 'mock-main-layout__header-actions' },
            slots['header-actions']?.({ layoutControls: runtimeInteractionMocks.layoutControls })
          ),
          h('main', { class: 'mock-main-layout__content' }, slots.default?.()),
          h('div', { class: 'mock-main-layout__floating' }, slots.floating?.()),
        ])
      },
    }),
  }
})

vi.mock('../../../src/templates/features', async () => {
  const { defineComponent, h } = await vi.importActual<typeof import('vue')>('vue')

  return {
    LoginTemplate: defineComponent({
      name: 'LoginTemplate',
      props: {
        email: String,
        password: String,
        loading: Boolean,
      },
      emits: ['submit', 'update:email', 'update:password'],
      setup(_props, { emit }) {
        return () => h('section', { class: 'mock-login-template' }, [
          h('button', {
            class: 'mock-login-template__submit',
            type: 'button',
            onClick: () => emit('submit', runtimeInteractionMocks.loginPayload),
          }, 'login'),
        ])
      },
    }),
    WikiChatDrawerTemplate: defineComponent({
      name: 'WikiChatDrawerTemplate',
      props: {
        modelValue: Boolean,
        contextHint: String,
        messages: Array,
      },
      emits: [
        'update:modelValue',
        'send-question',
        'start-new-conversation',
        'open-fullscreen',
      ],
      setup(props, { emit }) {
        return () => h('aside', {
          class: 'mock-wiki-chat-drawer',
          'data-open': String(props.modelValue),
          'data-context': props.contextHint ?? '',
        }, [
          h('button', {
            class: 'mock-wiki-chat-drawer__close',
            type: 'button',
            onClick: () => emit('update:modelValue', false),
          }, 'close'),
          h('button', {
            class: 'mock-wiki-chat-drawer__fullscreen',
            type: 'button',
            onClick: () => emit('open-fullscreen'),
          }, 'fullscreen'),
          h('button', {
            class: 'mock-wiki-chat-drawer__send',
            type: 'button',
            onClick: () => emit('send-question', 'Resumo operacional'),
          }, 'send'),
        ])
      },
    }),
    WikiChatTemplate: defineComponent({
      name: 'WikiChatTemplate',
      emits: ['start-new-conversation', 'select-conversation', 'delete-conversation', 'send-question'],
      setup(_props, { emit }) {
        return () => h('section', { class: 'mock-wiki-chat-template' }, [
          h('button', {
            class: 'mock-wiki-chat-template__send',
            type: 'button',
            onClick: () => emit('send-question', 'Pergunta local'),
          }, 'send'),
        ])
      },
    }),
    WikiTemplate: defineComponent({
      name: 'WikiTemplate',
      emits: ['ask-document', 'view-document', 'download-document', 'bulk-download', 'export-click'],
      setup(_props, { emit }) {
        return () => h('section', { class: 'mock-wiki-template' }, [
          h('button', {
            class: 'mock-wiki-template__export',
            type: 'button',
            onClick: () => emit('export-click'),
          }, 'export'),
        ])
      },
    }),
  }
})

vi.mock('../../../src/templates/navigation/UserMenuTemplate.vue', async () => {
  const { defineComponent, h } = await vi.importActual<typeof import('vue')>('vue')

  return {
    default: defineComponent({
      name: 'UserMenuTemplate',
      props: {
        profileName: String,
        profileInitials: String,
      },
      emits: [
        'account-click',
        'logout-click',
        'update:modelValue',
        'update:showLabelsInMini',
        'update:sideMenuVariant',
      ],
      setup(props, { emit }) {
        return () => h('section', { class: 'mock-user-menu-template' }, [
          h('span', { class: 'mock-user-menu-template__name' }, String(props.profileName ?? '')),
          h('span', { class: 'mock-user-menu-template__initials' }, String(props.profileInitials ?? '')),
          h('button', {
            class: 'mock-user-menu-template__account',
            type: 'button',
            onClick: () => emit('account-click'),
          }, 'account'),
          h('button', {
            class: 'mock-user-menu-template__logout',
            type: 'button',
            onClick: () => emit('logout-click'),
          }, 'logout'),
          h('button', {
            class: 'mock-user-menu-template__horizontal',
            type: 'button',
            onClick: () => emit('update:modelValue', true),
          }, 'horizontal'),
          h('button', {
            class: 'mock-user-menu-template__mini-labels',
            type: 'button',
            onClick: () => emit('update:showLabelsInMini', true),
          }, 'mini labels'),
        ])
      },
    }),
  }
})

vi.mock('../../../src/templates/runtime/RuntimeSettingsSurface.vue', async () => {
  const { defineComponent, h } = await vi.importActual<typeof import('vue')>('vue')

  return {
    default: defineComponent({
      name: 'RuntimeSettingsSurface',
      props: {
        settings: Object,
        clientCount: Number,
        orderCount: Number,
        activeThemeLabel: String,
      },
      emits: ['save', 'reset-runtime-data'],
      setup(props, { emit }) {
        return () => h('section', { class: 'mock-runtime-settings-surface' }, [
          h('span', { class: 'mock-runtime-settings-surface__theme' }, String(props.activeThemeLabel ?? '')),
          h('button', {
            class: 'mock-runtime-settings-surface__save',
            type: 'button',
            onClick: () => emit('save', runtimeInteractionMocks.settingsSavePayload ?? props.settings),
          }, 'save'),
          h('button', {
            class: 'mock-runtime-settings-surface__reset',
            type: 'button',
            onClick: () => emit('reset-runtime-data'),
          }, 'reset'),
        ])
      },
    }),
  }
})

vi.mock('../../../src/templates/pages', async () => {
  const { defineComponent, h } = await vi.importActual<typeof import('vue')>('vue')

  const PageStub = defineComponent({
    name: 'TemplateRuntimePageStub',
    setup(_props, { slots }) {
      return () => h('section', { class: 'mock-page-template' }, slots.default?.())
    },
  })

  return {
    CrudListTemplate: PageStub,
    DashboardTemplate: PageStub,
    ErrorNotFoundTemplate: PageStub,
    ProfileTemplate: PageStub,
  }
})

vi.mock('../../../src/templates/pages/dashboard/ReferenceDashboardCharts.vue', async () => {
  const { defineComponent, h } = await vi.importActual<typeof import('vue')>('vue')

  return {
    default: defineComponent({
      name: 'ReferenceDashboardCharts',
      setup() {
        return () => h('section', { class: 'mock-reference-dashboard-charts' })
      },
    }),
  }
})

type RuntimeRouterModule = typeof import('../../../src/templates/runtime/router')
type RuntimeDataModule = typeof import('../../../src/templates/runtime/runtime-data.template')
type ThemeSwitcherModule = typeof import('../../../src/composables/useThemeSwitcher')
type WikiChatServiceModule = typeof import('../../../src/templates/features/wiki/wiki-chat-service.template')

interface RuntimeModules {
  runtime: RuntimeRouterModule
  data: RuntimeDataModule
  theme: ThemeSwitcherModule
  wikiChatService: WikiChatServiceModule
}

async function importRuntimeModules(): Promise<RuntimeModules> {
  vi.resetModules()

  const runtime = await import('../../../src/templates/runtime/router')
  const data = await import('../../../src/templates/runtime/runtime-data.template')
  const theme = await import('../../../src/composables/useThemeSwitcher')
  const wikiChatService = await import('../../../src/templates/features/wiki/wiki-chat-service.template')

  return {
    runtime,
    data,
    theme,
    wikiChatService,
  }
}

function resetThemeDomState(): void {
  document.documentElement.removeAttribute('data-theme')
  document.body.removeAttribute('data-theme')
  document.documentElement.classList.remove('dark')
  document.body.classList.remove('body--dark', 'body--light')
  document.documentElement.style.cssText = ''
  document.body.style.cssText = ''
}

function seedRuntimeAuth(userName = 'Admin NetToolsKit'): void {
  localStorage.setItem('ntk_runtime_token', JSON.stringify('ntk-local-auth-test'))
  localStorage.setItem('ntk_runtime_user', JSON.stringify({
    id: 'runtime-test',
    name: userName,
    email: 'ops@nettoolskit.dev',
    role: 'Operations Lead',
  }))
}

function findRouteRecord(routes: RouteRecordRaw[], name: string): RouteRecordRaw {
  const queue = [...routes]

  while (queue.length > 0) {
    const route = queue.shift()!
    if (route.name === name) {
      return route
    }

    if (route.children) {
      queue.push(...route.children)
    }
  }

  throw new Error(`Route ${name} was not registered in the template runtime.`)
}

function findRuntimeComponent(runtime: RuntimeRouterModule, routeName: string): Component {
  const component = findRouteRecord(runtime.createTemplateRuntimeRoutes(), routeName).component

  if (!component) {
    throw new Error(`Route ${routeName} does not expose a component.`)
  }

  return component as Component
}

async function createReadyRuntimeRouter(
  runtime: RuntimeRouterModule,
  initialLocation: string
): Promise<Router> {
  const router = runtime.createTemplateRuntimeRouter()

  await router.push(initialLocation)
  await flushPromises()

  return router
}

describe('template runtime interactions', () => {
  beforeEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    runtimeInteractionMocks.reset()
    localStorage.clear()
    sessionStorage.clear()
    resetThemeDomState()
    window.location.hash = ''
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('redirects protected runtime routes to login while preserving a safe target', async () => {
    const { runtime } = await importRuntimeModules()

    const router = await createReadyRuntimeRouter(runtime, '/settings')

    expect(router.currentRoute.value.name).toBe('TemplateRuntimeLogin')
    expect(router.currentRoute.value.query.redirect).toBe('/settings')
  })

  it('hydrates stored runtime auth before guarded navigation when bootRuntimeAuth runs', async () => {
    const { runtime } = await importRuntimeModules()

    seedRuntimeAuth('Stored Operator')
    runtime.bootRuntimeAuth()

    const router = await createReadyRuntimeRouter(runtime, '/settings')

    expect(router.currentRoute.value.name).toBe('TemplateRuntimeSettings')
  })

  it('submits the seeded login and returns to the preserved redirect target', async () => {
    vi.useFakeTimers()

    const { runtime } = await importRuntimeModules()
    const router = await createReadyRuntimeRouter(runtime, '/auth/login?redirect=/settings')
    const LoginPage = findRuntimeComponent(runtime, 'TemplateRuntimeLogin')

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router],
      },
    })

    await wrapper.find('.mock-login-template__submit').trigger('click')
    await vi.advanceTimersByTimeAsync(250)
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('TemplateRuntimeSettings')
    expect(JSON.parse(localStorage.getItem('ntk_runtime_token') ?? 'null')).toBe(
      'ntk-local-auth-runtime-ops'
    )
    expect(JSON.parse(localStorage.getItem('ntk_runtime_user') ?? 'null')).toMatchObject({
      email: 'ops@nettoolskit.dev',
      name: 'Admin NetToolsKit',
    })
  })

  it('wires header actions to theme switching, layout controls, account navigation and logout', async () => {
    seedRuntimeAuth('Header Operator')

    const { runtime, theme } = await importRuntimeModules()
    const router = await createReadyRuntimeRouter(runtime, '/')
    const MainLayoutShell = findRuntimeComponent(runtime, 'template-main-layout')

    const wrapper = mount(MainLayoutShell, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('.mock-main-layout__user-name').text()).toBe('Header Operator')
    expect(wrapper.find('.ntk-template-theme-dots').exists()).toBe(true)

    await wrapper.find('button[aria-label="Switch to Warp theme"]').trigger('click')
    await nextTick()

    expect(localStorage.getItem(theme.THEME_SWITCHER_STORAGE_KEY)).toBe('warp')
    expect(document.documentElement.dataset.theme).toBe('warp')

    await wrapper.find('.mock-user-menu-template__horizontal').trigger('click')
    await wrapper.find('.mock-user-menu-template__mini-labels').trigger('click')

    expect(runtimeInteractionMocks.layoutControls.setHorizontalMode).toHaveBeenCalledWith(true)
    expect(runtimeInteractionMocks.layoutControls.setShowLabelsInMini).toHaveBeenCalledWith(true)

    await wrapper.find('.mock-user-menu-template__account').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('TemplateRuntimeProfile')

    await wrapper.find('.mock-user-menu-template__logout').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('TemplateRuntimeLogin')
    expect(localStorage.getItem('ntk_runtime_token')).toBeNull()
    expect(localStorage.getItem('ntk_runtime_user')).toBeNull()
  })

  it('toggles the runtime chat FAB and opens the fullscreen assistant route', async () => {
    seedRuntimeAuth()

    const { runtime } = await importRuntimeModules()
    const router = await createReadyRuntimeRouter(runtime, '/')
    const MainLayoutShell = findRuntimeComponent(runtime, 'template-main-layout')

    const wrapper = mount(MainLayoutShell, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('.mock-wiki-chat-drawer').attributes('data-open')).toBe('false')
    expect(wrapper.find('.ntk-runtime-chat-fab').text()).toContain('smart_toy')

    await wrapper.find('.ntk-runtime-chat-fab').trigger('click')
    await nextTick()

    expect(wrapper.find('.mock-wiki-chat-drawer').attributes('data-open')).toBe('true')
    expect(wrapper.find('.ntk-runtime-chat-fab').text()).toContain('close')

    await wrapper.find('.mock-wiki-chat-drawer__fullscreen').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('TemplateRuntimeKnowledgeChat')
    expect(wrapper.find('.mock-wiki-chat-drawer').attributes('data-open')).toBe('false')
  })

  it('saves runtime settings and reset clears workspace, auth, theme, chat and layout persistence', async () => {
    seedRuntimeAuth()

    const { runtime, data, theme, wikiChatService } = await importRuntimeModules()
    const { setTheme } = theme.useThemeSwitcher()
    setTheme('kraken')

    data.templateRuntimeData.createClient()
    await wikiChatService.templateWikiChatService.ask({ question: 'Como resetar o workspace?' })
    localStorage.setItem('ntk-template-runtime-layout:horizontal-mode', 'true')

    const router = await createReadyRuntimeRouter(runtime, '/settings')
    const SettingsPage = findRuntimeComponent(runtime, 'TemplateRuntimeSettings')
    const nextSettings = {
      ...data.templateRuntimeData.state.settings,
      workspaceName: 'Tenant Echo',
      operatorName: 'Bea Runtime',
      compactTables: true,
    }
    runtimeInteractionMocks.settingsSavePayload = nextSettings

    const wrapper = mount(SettingsPage, {
      global: {
        plugins: [router],
      },
    })

    await wrapper.find('.mock-runtime-settings-surface__save').trigger('click')
    await nextTick()

    expect(data.templateRuntimeData.workspaceName.value).toBe('Tenant Echo')
    expect(data.templateRuntimeData.state.settings.compactTables).toBe(true)
    expect(JSON.parse(localStorage.getItem('ntk_runtime_user') ?? 'null')).toMatchObject({
      name: 'Bea Runtime',
    })

    await wrapper.find('.mock-runtime-settings-surface__reset').trigger('click')
    await flushPromises()
    await nextTick()

    expect(router.currentRoute.value.name).toBe('TemplateRuntimeLogin')
    expect(data.templateRuntimeData.workspaceName.value).toBe('Atlas Flow')
    expect(data.templateRuntimeData.state.settings.compactTables).toBe(false)
    expect(localStorage.getItem('ntk_runtime_token')).toBeNull()
    expect(localStorage.getItem('ntk_runtime_user')).toBeNull()
    expect(localStorage.getItem(theme.THEME_SWITCHER_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem(wikiChatService.TEMPLATE_WIKI_CHAT_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('ntk-template-runtime-layout:horizontal-mode')).toBeNull()
  })
})
