/**
 * Template runtime router module.
 *
 * Provides route-level adoption for template layouts, navigation, pages and
 * feature templates using the scaffolding contracts.
 * The runtime is backed by local persisted data so the template stays usable
 * without a backend while still exercising real flows.
 */

import { computed, defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import {
  RouterView,
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
  type Router,
  useRoute,
  useRouter,
} from 'vue-router'

import {
  LoginTemplate,
  WikiChatDrawerTemplate,
  WikiChatTemplate,
  WikiTemplate,
} from '../features'
import { templateWikiChatService } from '../features/wiki/wiki-chat-service.template'
import { createTemplateWikiChatStore } from '../features/wiki/wiki-chat-store.template'
import { AuthLayoutTemplate, MainLayoutTemplate } from '../layouts'
import { clearTemplateLayoutPersistence } from '../layouts/MainLayoutTemplate.vue'
import {
  CrudListTemplate,
  DashboardTemplate,
  ErrorNotFoundTemplate,
  PlaceholderTemplate,
  ProfileTemplate,
} from '../pages'
import ReferenceDashboardCharts from '../pages/dashboard/ReferenceDashboardCharts.vue'
import type {
  TemplateCrudViewMode,
  TemplateProfileGroup,
} from '../pages/page-template.types'
import ThemeDotsSwitcher from '../navigation/ThemeDotsSwitcher.vue'
import UserMenuTemplate from '../navigation/UserMenuTemplate.vue'
import {
  createDefaultTemplateLayoutShells,
  createTemplateMenuFromScaffoldRoutes,
  createTemplateRouteScaffold,
  type TemplateScaffoldRouteNode,
} from '../scaffolding'
import { createTemplateAuthStore } from '../scaffolding/auth-store.template'
import { templateAuthService } from '../scaffolding/auth-service.template'
import {
  resetThemePreference,
  themeOptions,
  useThemeSwitcher,
} from '../../composables/useThemeSwitcher'
import RuntimeSettingsSurface from './RuntimeSettingsSurface.vue'
import {
  templateRuntimeData,
  type TemplateRuntimeSettings,
} from './runtime-data.template'

/* ------------------------------------------------------------------ */
/*  Auth store — shared across all runtime components                 */
/* ------------------------------------------------------------------ */

const runtimeAuthStore = createTemplateAuthStore({
  persist: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* noop */ } },
  remove: (key) => { try { localStorage.removeItem(key) } catch { /* noop */ } },
  read: <T>(key: string): T | null => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : null } catch { return null } },
  tokenKey: 'ntk_runtime_token',
  userKey: 'ntk_runtime_user',
})

const RUNTIME_LOGIN_ROUTE_NAME = 'TemplateRuntimeLogin'
const RUNTIME_DASHBOARD_ROUTE_NAME = 'TemplateRuntimeDashboard'
const RUNTIME_LOGIN_REDIRECT_QUERY_KEY = 'redirect'
const RUNTIME_LAYOUT_STORAGE_PREFIX = 'ntk-template-runtime-layout'

const runtimeWikiChatStore = createTemplateWikiChatStore({
  ask: (question) => templateWikiChatService.ask({ question }),
  continueConversation: (conversationId, question) =>
    templateWikiChatService.continueConversation(conversationId, { question }),
  listConversations: () => templateWikiChatService.listConversations(),
  getConversation: (conversationId) => templateWikiChatService.getConversation(conversationId),
  deleteConversation: (conversationId) => templateWikiChatService.deleteConversation(conversationId),
  readPersistedState: () => templateWikiChatService.readPersistedState(),
  persistActiveConversation: (conversationId) =>
    templateWikiChatService.persistActiveConversation(conversationId),
})

/* ------------------------------------------------------------------ */
/*  Greeting helpers (reference parity)                                */
/* ------------------------------------------------------------------ */

function getGreetingText(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getGreetingIcon(): string {
  const hour = new Date().getHours()
  if (hour < 6) return '🌙'
  if (hour < 12) return '☀️'
  if (hour < 18) return '🌤️'
  return '🌙'
}

function getFirstName(): string {
  const name = runtimeAuthStore.state.user?.name ?? 'User'
  const first = name.split(' ')[0] ?? name
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

function getDefaultCrudViewMode(): TemplateCrudViewMode {
  return templateRuntimeData.state.settings.compactTables ? 'table' : 'cards'
}

function ensureRuntimeConversationsLoaded(): void {
  if (runtimeWikiChatStore.state.loading || runtimeWikiChatStore.state.conversations.length > 0) {
    return
  }

  void runtimeWikiChatStore.loadConversations()
}

function buildRuntimeDocumentBody(documentName: string, documentDescription: string): string {
  return [
    `Document: ${documentName}`,
    '',
    documentDescription,
    '',
    `Workspace: ${templateRuntimeData.state.settings.workspaceName}`,
    `Operator: ${templateRuntimeData.state.settings.operatorName}`,
  ].join('\n')
}

function previewRuntimeTextDocument(content: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

function downloadRuntimeTextDocument(fileName: string, content: string): void {
  if (typeof document === 'undefined') {
    return
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

function getRuntimeChatMessages() {
  return runtimeWikiChatStore.state.messages.map(message => ({
    ...message,
    sources: message.sources?.map(source => ({ ...source })),
  }))
}

function normalizeRuntimeRedirectTarget(candidate: unknown): string | null {
  const rawValue = Array.isArray(candidate) ? candidate[0] : candidate
  if (typeof rawValue !== 'string') {
    return null
  }

  const value = rawValue.trim()
  if (!value.startsWith('/') || value.startsWith('//')) {
    return null
  }

  if (
    value === '/login'
    || value.startsWith('/login?')
    || value === '/auth/login'
    || value.startsWith('/auth/login?')
  ) {
    return null
  }

  return value
}

function resolveRuntimePostLoginLocation(candidate: unknown) {
  return normalizeRuntimeRedirectTarget(candidate) ?? { name: RUNTIME_DASHBOARD_ROUTE_NAME }
}

function createRuntimeLoginRedirect(toFullPath: string) {
  const redirectTarget = normalizeRuntimeRedirectTarget(toFullPath)

  if (!redirectTarget) {
    return { name: RUNTIME_LOGIN_ROUTE_NAME }
  }

  return {
    name: RUNTIME_LOGIN_ROUTE_NAME,
    query: {
      [RUNTIME_LOGIN_REDIRECT_QUERY_KEY]: redirectTarget,
    },
  }
}

function clearRuntimeAuthSession(): void {
  runtimeAuthStore.logout()
}

function clearRuntimeWikiChatWorkspace(): void {
  templateWikiChatService.resetPersistence()
  runtimeWikiChatStore.resetState()
}

function clearRuntimeLayoutWorkspace(): void {
  clearTemplateLayoutPersistence(RUNTIME_LAYOUT_STORAGE_PREFIX)
}

function clearRuntimeThemeWorkspace(): void {
  resetThemePreference()
}

function resetRuntimeWorkspace(): void {
  clearRuntimeWikiChatWorkspace()
  clearRuntimeLayoutWorkspace()
  clearRuntimeThemeWorkspace()
  templateRuntimeData.reset()
  clearRuntimeAuthSession()
}

/* ------------------------------------------------------------------ */
/*  Runtime page components                                           */
/* ------------------------------------------------------------------ */

const RuntimeDashboardPage = defineComponent({
  name: 'TemplateRuntimeDashboardPage',
  setup() {
    const dashboardSnapshot = computed(() => templateRuntimeData.dashboardSnapshot.value)
    const title = computed(() => `${getGreetingText()}, ${getFirstName()}`)
    const subtitle = computed(() => {
      const d = new Date()
      const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' }
      return d.toLocaleDateString('en-US', opts)
    })
    const icon = computed(() => getGreetingIcon())

    return () => h(DashboardTemplate, {
      title: title.value,
      subtitle: subtitle.value,
      greetingIcon: icon.value,
      chips: dashboardSnapshot.value.chips,
      metrics: dashboardSnapshot.value.metrics,
      activities: dashboardSnapshot.value.activities,
      topItems: dashboardSnapshot.value.topItems,
      activityTitle: 'Activity',
      activityTitleIcon: 'insights',
      topItemsTitle: 'Top Clients',
      topItemsTitleIcon: 'star',
    }, {
      charts: () => h(ReferenceDashboardCharts, {
        statusSegments: dashboardSnapshot.value.statusSegments,
        categorySeries: dashboardSnapshot.value.categorySeries,
      }),
    })
  },
})

const RuntimeClientsPage = defineComponent({
  name: 'TemplateRuntimeClientsPage',
  setup() {
    const searchValue = ref('')
    const activeFilterId = ref('all')
    const viewMode = ref<TemplateCrudViewMode>(getDefaultCrudViewMode())

    return () => h(CrudListTemplate, {
      title: 'Clients',
      subtitle: 'Active portfolio, onboarding, and reactivation with local persistence.',
      columns: templateRuntimeData.clientColumns,
      records: templateRuntimeData.clientRecords.value,
      filters: templateRuntimeData.clientFilters.value,
      metrics: templateRuntimeData.clientMetrics.value,
      actions: [
        {
          id: 'create-client',
          label: 'New client',
          icon: 'person_add',
        },
      ],
      rowActions: [
        {
          id: 'duplicate-client',
          icon: 'content_copy',
          label: 'Duplicate client',
          ariaLabel: 'Duplicate client',
        },
        {
          id: 'cycle-client-status',
          icon: 'sync_alt',
          label: 'Update status',
          ariaLabel: 'Update client status',
        },
      ],
      searchValue: searchValue.value,
      activeFilterId: activeFilterId.value,
      viewMode: viewMode.value,
      selectable: false,
      showBulkActions: false,
      searchPlaceholder: 'Search client, segment, or city...',
      searchAriaLabel: 'Search clients',
      tableAriaLabel: 'Clients table',
      cardsAriaLabel: 'Client cards',
      metricsAriaLabel: 'Client indicators',
      tableViewAriaLabel: 'Switch to clients table',
      cardsViewAriaLabel: 'Switch to client cards',
      tableStatusLabel: 'Status',
      tableActionsLabel: 'Shortcuts',
      emptyTitle: 'No clients found',
      emptySubtitle: 'Adjust filters or create a new local client.',
      emptyIcon: 'people',
      'onUpdate:searchValue': (value: string) => { searchValue.value = value },
      'onUpdate:activeFilterId': (value: string) => { activeFilterId.value = value },
      'onUpdate:viewMode': (value: TemplateCrudViewMode) => { viewMode.value = value },
      onActionClick: (actionId: string) => {
        if (actionId === 'create-client') {
          templateRuntimeData.createClient()
        }
      },
      onRowActionClick: (payload: { actionId: string; recordId: string }) => {
        if (payload.actionId === 'duplicate-client') {
          templateRuntimeData.duplicateClient(payload.recordId)
        }
        if (payload.actionId === 'cycle-client-status') {
          templateRuntimeData.cycleClientStatus(payload.recordId)
        }
      },
    })
  },
})

const RuntimeOrdersPage = defineComponent({
  name: 'TemplateRuntimeOrdersPage',
  setup() {
    const searchValue = ref('')
    const activeFilterId = ref('all')
    const viewMode = ref<TemplateCrudViewMode>(getDefaultCrudViewMode())
    const selectedIds = ref<string[]>([])

    return () => h(CrudListTemplate, {
      title: 'Orders',
      subtitle: 'Operational pipeline with persisted status changes and bulk actions.',
      columns: templateRuntimeData.orderColumns,
      records: templateRuntimeData.orderRecords.value,
      filters: templateRuntimeData.orderFilters.value,
      metrics: templateRuntimeData.orderMetrics.value,
      actions: [
        {
          id: 'create-order',
          label: 'New order',
          icon: 'add_shopping_cart',
        },
      ],
      rowActions: [
        {
          id: 'advance-order',
          icon: 'arrow_forward',
          label: 'Advance order',
          ariaLabel: 'Advance order status',
        },
        {
          id: 'cancel-order',
          icon: 'block',
          label: 'Cancel order',
          ariaLabel: 'Cancel order',
        },
      ],
      bulkActions: [
        {
          id: 'bulk-progress',
          label: 'In progress',
          icon: 'pending_actions',
          outline: true,
        },
        {
          id: 'bulk-complete',
          label: 'Complete',
          icon: 'task_alt',
          outline: true,
        },
        {
          id: 'bulk-cancel',
          label: 'Cancel',
          icon: 'cancel',
          outline: true,
        },
      ],
      searchValue: searchValue.value,
      activeFilterId: activeFilterId.value,
      viewMode: viewMode.value,
      selectedIds: selectedIds.value,
      selectable: true,
      showBulkActions: true,
      searchPlaceholder: 'Search order, client, or category...',
      searchAriaLabel: 'Search orders',
      tableAriaLabel: 'Orders table',
      cardsAriaLabel: 'Order cards',
      metricsAriaLabel: 'Order indicators',
      bulkAriaLabel: 'Bulk actions for orders',
      tableViewAriaLabel: 'Switch to orders table',
      cardsViewAriaLabel: 'Switch to order cards',
      tableStatusLabel: 'Status',
      tableActionsLabel: 'Shortcuts',
      selectedCountLabel: '{count} selected orders',
      emptyTitle: 'No orders found',
      emptySubtitle: 'Adjust the search or generate a new local order.',
      emptyIcon: 'shopping_cart',
      'onUpdate:searchValue': (value: string) => { searchValue.value = value },
      'onUpdate:activeFilterId': (value: string) => { activeFilterId.value = value },
      'onUpdate:viewMode': (value: TemplateCrudViewMode) => { viewMode.value = value },
      'onUpdate:selectedIds': (value: string[]) => { selectedIds.value = value },
      onActionClick: (actionId: string) => {
        if (actionId === 'create-order') {
          templateRuntimeData.createOrder()
        }
      },
      onRowActionClick: (payload: { actionId: string; recordId: string }) => {
        if (payload.actionId === 'advance-order') {
          templateRuntimeData.advanceOrderStatus(payload.recordId)
        }
        if (payload.actionId === 'cancel-order') {
          templateRuntimeData.cancelOrder(payload.recordId)
        }
      },
      onBulkActionClick: (payload: { actionId: string; selectedIds: string[] }) => {
        if (payload.selectedIds.length === 0) {
          return
        }

        if (payload.actionId === 'bulk-progress') {
          templateRuntimeData.bulkUpdateOrderStatus(payload.selectedIds, 'in_progress')
        }
        if (payload.actionId === 'bulk-complete') {
          templateRuntimeData.bulkUpdateOrderStatus(payload.selectedIds, 'completed')
        }
        if (payload.actionId === 'bulk-cancel') {
          templateRuntimeData.bulkUpdateOrderStatus(payload.selectedIds, 'cancelled')
        }

        selectedIds.value = []
      },
    })
  },
})

const RuntimeWikiPage = defineComponent({
  name: 'TemplateRuntimeWikiPage',
  setup() {
    const router = useRouter()

    ensureRuntimeConversationsLoaded()

    return () => h(WikiTemplate, {
      title: 'Knowledge base',
      subtitle: 'Local documentation, playbooks, and operational materials persisted in the runtime.',
      categories: templateRuntimeData.wikiCategories.value,
      documents: templateRuntimeData.wikiDocuments.value,
      onAskDocument: (documentItem: { name: string; description?: string }) => {
        runtimeWikiChatStore.openDrawer(documentItem.name)
      },
      onViewDocument: (documentItem: { name: string; description?: string }) => {
        previewRuntimeTextDocument(
          buildRuntimeDocumentBody(documentItem.name, documentItem.description ?? 'No additional description.')
        )
      },
      onDownloadDocument: (documentItem: { name: string; description?: string }) => {
        downloadRuntimeTextDocument(
          `${documentItem.name.replace(/[^\w.-]+/g, '_')}.txt`,
          buildRuntimeDocumentBody(documentItem.name, documentItem.description ?? 'No additional description.')
        )
      },
      onBulkDownload: (documents: Array<{ name: string; description?: string }>) => {
        const content = documents.length > 0
          ? documents
              .map(documentItem => buildRuntimeDocumentBody(
                documentItem.name,
                documentItem.description ?? 'No additional description.'
              ))
              .join('\n\n---\n\n')
          : 'No documents selected.'

        downloadRuntimeTextDocument('atlas-flow-knowledge-bundle.txt', content)
      },
      onExportClick: () => {
        void router.push({ name: 'TemplateRuntimeKnowledgeChat' })
      },
    })
  },
})

const RuntimeWikiChatPage = defineComponent({
  name: 'TemplateRuntimeWikiChatPage',
  setup() {
    onMounted(() => {
      ensureRuntimeConversationsLoaded()
    })

    return () => h(WikiChatTemplate, {
      title: 'Knowledge assistant',
      subtitle: 'Chat with the local base to accelerate support, playbooks, and service workflows.',
      conversations: runtimeWikiChatStore.sortedConversations.value,
      messages: getRuntimeChatMessages(),
      activeConversationId: runtimeWikiChatStore.state.activeConversationId,
      suggestions: templateRuntimeData.wikiSuggestions.value,
      loading: runtimeWikiChatStore.state.loading,
      sending: runtimeWikiChatStore.state.sending,
      onStartNewConversation: () => {
        runtimeWikiChatStore.startNewConversation()
      },
      onSelectConversation: (conversationId: string) => {
        void runtimeWikiChatStore.loadConversation(conversationId)
      },
      onDeleteConversation: (conversationId: string) => {
        void runtimeWikiChatStore.deleteConversation(conversationId)
      },
      onSendQuestion: (question: string) => {
        void runtimeWikiChatStore.sendMessage(question)
      },
    })
  },
})

const RuntimeSettingsPage = defineComponent({
  name: 'TemplateRuntimeSettingsPage',
  setup() {
    const router = useRouter()
    const { activeTheme } = useThemeSwitcher()
    const activeThemeLabel = computed(() => {
      return themeOptions.find(option => option.id === activeTheme.value)?.label ?? activeTheme.value
    })

    return () => h(RuntimeSettingsSurface, {
      settings: { ...templateRuntimeData.state.settings },
      clientCount: templateRuntimeData.state.clients.length,
      orderCount: templateRuntimeData.state.orders.length,
      activeThemeLabel: activeThemeLabel.value,
      onSave: (settings: TemplateRuntimeSettings) => {
        const updatedSettings = templateRuntimeData.updateSettings(settings)
        runtimeAuthStore.updateUserName(updatedSettings.operatorName)
      },
      onResetRuntimeData: async () => {
        resetRuntimeWorkspace()
        await router.replace({ name: RUNTIME_LOGIN_ROUTE_NAME })
      },
    })
  },
})

const RuntimeReportsPage = defineComponent({
  name: 'TemplateRuntimeReportsPage',
  setup() {
    const router = useRouter()

    return () => h(PlaceholderTemplate, {
      title: 'Reports in preparation',
      subtitle: 'Reference reports route is available inside the reusable runtime shell.',
      description: 'Use this placeholder to keep route parity with the source reference while the final report workspace is connected.',
      icon: 'assessment',
      statusLabel: 'Connected',
      hints: [
        {
          id: 'reports-route-parity',
          text: 'The /reports route mirrors the source reference route contract.',
          icon: 'route',
        },
        {
          id: 'reports-shell-parity',
          text: 'The page keeps the same layout, theme tokens and navigation chrome.',
          icon: 'dashboard_customize',
        },
      ],
      primaryAction: {
        id: 'reports-open-dashboard',
        label: 'Back to dashboard',
        icon: 'dashboard',
      },
      secondaryAction: {
        id: 'reports-open-settings',
        label: 'Open settings',
        icon: 'settings',
        outline: true,
      },
      onActionClick: (actionId: string) => {
        if (actionId === 'reports-open-dashboard') {
          void router.push({ name: RUNTIME_DASHBOARD_ROUTE_NAME })
        }

        if (actionId === 'reports-open-settings') {
          void router.push({ name: 'TemplateRuntimeSettings' })
        }
      },
    })
  },
})

const RuntimeProfilePage = defineComponent({
  name: 'TemplateRuntimeProfilePage',
  setup() {
    const router = useRouter()
    const profile = computed(() => ({
      name: runtimeAuthStore.state.user?.name ?? templateRuntimeData.state.settings.operatorName,
      email: runtimeAuthStore.state.user?.email ?? templateRuntimeData.state.settings.supportEmail,
      role: runtimeAuthStore.state.user?.role ?? 'Operations',
      initials: runtimeAuthStore.userInitials.value,
    }))
    const groups = computed<TemplateProfileGroup[]>(() => [
      {
        id: 'workspace',
        title: 'Workspace',
        fields: [
          {
            id: 'workspace-name',
            label: 'Workspace name',
            value: templateRuntimeData.state.settings.workspaceName,
          },
          {
            id: 'operator-name',
            label: 'Default operator',
            value: templateRuntimeData.state.settings.operatorName,
          },
          {
            id: 'support-email',
            label: 'Support contact',
            value: templateRuntimeData.state.settings.supportEmail,
          },
        ],
      },
      {
        id: 'preferences',
        title: 'Local preferences',
        fields: [
          {
            id: 'locale',
            label: 'Locale',
            value: templateRuntimeData.state.settings.locale,
          },
          {
            id: 'timezone',
            label: 'Timezone',
            value: templateRuntimeData.state.settings.timezone,
          },
          {
            id: 'notifications',
            label: 'Notifications',
            value: templateRuntimeData.state.settings.notificationsEnabled ? 'Enabled' : 'Disabled',
          },
        ],
      },
    ])

    return () => h(ProfileTemplate, {
      profile: profile.value,
      groups: groups.value,
      sectionTitle: 'Profile and preferences',
      showLogoutAction: true,
      onLogoutClick: () => {
        clearRuntimeAuthSession()
        void router.replace({ name: RUNTIME_LOGIN_ROUTE_NAME })
      },
    })
  },
})

const RuntimeLoginPage = defineComponent({
  name: 'TemplateRuntimeLoginPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)

    return () => h(LoginTemplate, {
      email: email.value,
      password: password.value,
      loading: loading.value,
      formTitle: 'Sign in',
      formSubtitle: 'Use your credentials to access the platform.',
      submitLabel: 'Continue',
      emailLabel: 'E-mail',
      passwordLabel: 'Password',
      brandTitle: `Welcome to ${templateRuntimeData.workspaceName.value}`,
      brandSubtitle: 'Access operations, dashboards, and local knowledge with browser persistence.',
      emailRequiredMessage: 'E-mail is required.',
      emailInvalidMessage: 'Invalid e-mail.',
      passwordRequiredMessage: 'Password is required.',
      'onUpdate:email': (v: string) => { email.value = v },
      'onUpdate:password': (v: string) => { password.value = v },
      onSubmit: async (payload: { email: string; password: string }) => {
        loading.value = true
        try {
          const result = await templateAuthService.login(payload.email, payload.password)
          runtimeAuthStore.setAuth(
            {
              ...result.user,
              name: templateRuntimeData.state.settings.operatorName,
            },
            result.token,
          )
          await router.push(
            resolveRuntimePostLoginLocation(route.query[RUNTIME_LOGIN_REDIRECT_QUERY_KEY]),
          )
        } finally {
          loading.value = false
        }
      },
    })
  },
})

const RuntimeNotFoundPage = defineComponent({
  name: 'TemplateRuntimeNotFoundPage',
  setup() {
    return () => h(ErrorNotFoundTemplate, {
      title: 'Page not found',
      description: 'Use the side menu to navigate the available features.',
      primaryAction: {
        id: 'go-dashboard',
        label: 'Back to dashboard',
        icon: 'home',
        to: '/',
      },
    })
  },
})

/* ------------------------------------------------------------------ */
/*  Route nodes — reference menu structure                            */
/* ------------------------------------------------------------------ */

const templateRuntimeRouteNodes: TemplateScaffoldRouteNode[] = [
  {
    id: 'dashboard',
    path: '',
    name: 'TemplateRuntimeDashboard',
    component: RuntimeDashboardPage,
    layoutId: 'main',
    menu: {
      text: 'Dashboard',
      icon: 'dashboard',
      order: 10,
    },
  },
  {
    id: 'clients',
    path: 'clients',
    name: 'TemplateRuntimeClients',
    component: RuntimeClientsPage,
    layoutId: 'main',
    menu: {
      text: 'Clients',
      icon: 'people',
      order: 20,
    },
  },
  {
    id: 'orders',
    path: 'orders',
    name: 'TemplateRuntimeOrders',
    component: RuntimeOrdersPage,
    layoutId: 'main',
    menu: {
      text: 'Orders',
      icon: 'shopping_cart',
      order: 30,
    },
  },
  {
    id: 'knowledge',
    path: 'knowledge',
    name: 'TemplateRuntimeKnowledge',
    component: RuntimeWikiPage,
    layoutId: 'main',
    menu: {
      text: 'Wiki',
      icon: 'menu_book',
      order: 40,
    },
  },
  {
    id: 'knowledge-chat',
    path: 'knowledge/chat',
    name: 'TemplateRuntimeKnowledgeChat',
    component: RuntimeWikiChatPage,
    layoutId: 'main',
    menu: {
      text: 'Assistant',
      icon: 'chat',
      order: 41,
    },
  },
  {
    id: 'settings',
    path: 'settings',
    name: 'TemplateRuntimeSettings',
    component: RuntimeSettingsPage,
    alias: 'configurations',
    layoutId: 'main',
    menu: {
      text: 'Settings',
      icon: 'settings',
      order: 90,
      stickyBottom: true,
    },
  },
  {
    id: 'reports',
    path: 'reports',
    name: 'TemplateRuntimeReports',
    component: RuntimeReportsPage,
    layoutId: 'main',
    menu: false,
  },
  {
    id: 'profile',
    path: 'profile',
    name: 'TemplateRuntimeProfile',
    component: RuntimeProfilePage,
    layoutId: 'main',
    menu: false,
  },
  {
    id: 'auth-login',
    path: 'login',
    name: 'TemplateRuntimeLogin',
    component: RuntimeLoginPage,
    layoutId: 'auth',
    menu: false,
  },
  {
    id: 'not-found',
    path: '404',
    name: 'TemplateRuntimeNotFound',
    component: RuntimeNotFoundPage,
    layoutId: 'blank',
    menu: false,
  },
]

export const templateRuntimeMenuItems = createTemplateMenuFromScaffoldRoutes(templateRuntimeRouteNodes, {
  defaultIcon: 'radio_button_unchecked',
})

/* ------------------------------------------------------------------ */
/*  Layout shells                                                     */
/* ------------------------------------------------------------------ */

const TemplateRuntimeMainLayoutShell = defineComponent({
  name: 'TemplateRuntimeMainLayoutShell',
  setup() {
    const router = useRouter()

    onMounted(() => {
      ensureRuntimeConversationsLoaded()
    })

    return () => h(
      MainLayoutTemplate,
      {
        appName: templateRuntimeData.workspaceName.value,
        userName: runtimeAuthStore.userName.value,
        userInitials: runtimeAuthStore.userInitials.value,
        menuItems: templateRuntimeMenuItems,
        useRouterView: true,
        persistMode: true,
        storageKeyPrefix: RUNTIME_LAYOUT_STORAGE_PREFIX,
        showBreadcrumb: true,
        showHeader: true,
        showDrawer: true,
      },
      {
        'header-actions': ({ layoutControls }: {
          layoutControls: {
            horizontalMode: boolean
            setHorizontalMode: (value: boolean) => void
            showLabelsInMini: boolean
            setShowLabelsInMini: (value: boolean) => void
            sideMenuVariant: 'vercel' | 'reference'
            setSideMenuVariant: (value: 'vercel' | 'reference') => void
          }
        }) => [
          h(ThemeDotsSwitcher),
          h(UserMenuTemplate, {
            modelValue: layoutControls.horizontalMode,
            showLabelsInMini: layoutControls.showLabelsInMini,
            sideMenuVariant: layoutControls.sideMenuVariant,
            appName: templateRuntimeData.workspaceName.value,
            profileName: runtimeAuthStore.userName.value,
            profileInitials: runtimeAuthStore.userInitials.value,
            signOutLabel: 'Sign out',
            accountLabel: 'View account',
            preferencesLabel: 'Preferences',
            horizontalMenuLabel: 'Horizontal menu',
            horizontalMenuCaption: 'Toggle between side and top navigation',
            miniLabelsLabel: 'Labels in mini menu',
            miniLabelsCaption: 'Show labels below icons in compact mode',
            showSideMenuStyleToggle: false,
            'onUpdate:modelValue': (value: boolean) => { layoutControls.setHorizontalMode(value) },
            'onUpdate:showLabelsInMini': (value: boolean) => { layoutControls.setShowLabelsInMini(value) },
            'onUpdate:sideMenuVariant': (value: 'vercel' | 'reference') => { layoutControls.setSideMenuVariant(value) },
            onAccountClick: () => { void router.push({ name: 'TemplateRuntimeProfile' }) },
            onLogoutClick: () => {
              clearRuntimeAuthSession()
              void router.replace({ name: RUNTIME_LOGIN_ROUTE_NAME })
            },
          }),
        ],
        floating: () => [
          h('button', {
            class: 'ntk-runtime-chat-fab',
            'aria-label': 'Open assistant',
            onClick: () => { runtimeWikiChatStore.toggleDrawer() },
          }, [
            h('span', { class: 'material-icons', style: 'font-size:22px;color:var(--ntk-template-runtime-chat-fab-icon, var(--ntk-text-on-primary, currentColor))' }, runtimeWikiChatStore.state.drawerOpen ? 'close' : 'smart_toy'),
          ]),
          h(WikiChatDrawerTemplate, {
            modelValue: runtimeWikiChatStore.state.drawerOpen,
            title: 'Assistant',
            contextHint: runtimeWikiChatStore.state.contextHint || 'Knowledge base',
            messages: getRuntimeChatMessages(),
            suggestions: templateRuntimeData.wikiSuggestions.value,
            sending: runtimeWikiChatStore.state.sending,
            hasActiveConversation: runtimeWikiChatStore.hasActiveConversation.value,
            'onUpdate:modelValue': (value: boolean) => {
              if (value) {
                runtimeWikiChatStore.openDrawer(runtimeWikiChatStore.state.contextHint ?? undefined)
                return
              }

              runtimeWikiChatStore.closeDrawer()
            },
            onSendQuestion: (question: string) => {
              void runtimeWikiChatStore.sendMessage(question)
            },
            onStartNewConversation: () => {
              runtimeWikiChatStore.startNewConversation()
            },
            onOpenFullscreen: () => {
              runtimeWikiChatStore.closeDrawer()
              void router.push({ name: 'TemplateRuntimeKnowledgeChat' })
            },
          }),
        ],
      },
    )
  },
})

const TemplateRuntimeAuthLayoutShell = defineComponent({
  name: 'TemplateRuntimeAuthLayoutShell',
  setup() {
    return () => h(AuthLayoutTemplate, { centerContent: true }, {
      default: () => h(RouterView),
    })
  },
})

const TemplateRuntimeBlankLayoutShell = defineComponent({
  name: 'TemplateRuntimeBlankLayoutShell',
  setup() {
    return () => {
      const QLayout = resolveComponent('QLayout')
      const QPageContainer = resolveComponent('QPageContainer')
      return h(QLayout as any, { view: 'hHh lpr fFf' }, () =>
        h(QPageContainer as any, null, () => h(RouterView)),
      )
    }
  },
})

export function createTemplateRuntimeRoutes(): RouteRecordRaw[] {
  const layouts = createDefaultTemplateLayoutShells(
    TemplateRuntimeMainLayoutShell,
    TemplateRuntimeAuthLayoutShell,
    TemplateRuntimeBlankLayoutShell
  )

  return createTemplateRouteScaffold({
    layouts,
    routes: templateRuntimeRouteNodes,
    defaultLayoutId: 'main',
    appendCatchAll: true,
    catchAllRedirectName: 'TemplateRuntimeNotFound',
  })
}

/* ------------------------------------------------------------------ */
/*  Auth guard                                                        */
/* ------------------------------------------------------------------ */

function installAuthGuard(router: Router): void {
  router.beforeEach((to) => {
    const isLoginRoute = to.name === RUNTIME_LOGIN_ROUTE_NAME
    const isAuthenticated = runtimeAuthStore.isAuthenticated.value || runtimeAuthStore.checkAuth()

    if (!isAuthenticated && !isLoginRoute) {
      return createRuntimeLoginRedirect(to.fullPath)
    }
    if (isAuthenticated && isLoginRoute) {
      return resolveRuntimePostLoginLocation(to.query[RUNTIME_LOGIN_REDIRECT_QUERY_KEY])
    }
  })
}

/**
 * Runs on mount — restores session from localStorage if available.
 */
export function bootRuntimeAuth(): void {
  runtimeAuthStore.checkAuth()
}

export function createTemplateRuntimeRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: createTemplateRuntimeRoutes(),
    scrollBehavior() {
      return {
        top: 0,
        left: 0,
      }
    },
  })

  installAuthGuard(router)

  return router
}
