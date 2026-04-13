/**
 * Template runtime router module — reference-parity edition.
 *
 * Provides route-level adoption for template layouts, navigation, pages and
 * feature templates using the scaffolding contracts.
 * Menu items, fake data and auth flow mirror the approved reference project.
 */

import { computed, defineComponent, h, ref } from 'vue'
import {
  RouterView,
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
  type Router,
} from 'vue-router'

import {
  LoginTemplate,
  WikiChatDrawerTemplate,
  WikiChatTemplate,
  WikiTemplate,
} from '../features'
import { AuthLayoutTemplate, MainLayoutTemplate } from '../layouts'
import {
  DashboardTemplate,
  ErrorNotFoundTemplate,
  PlaceholderTemplate,
  ProfileTemplate,
} from '../pages'
import {
  createDefaultTemplateLayoutShells,
  createTemplateMenuFromScaffoldRoutes,
  createTemplateRouteScaffold,
  type TemplateScaffoldRouteNode,
} from '../scaffolding'
import { createTemplateAuthStore } from '../scaffolding/auth-store.template'
import { templateAuthService } from '../scaffolding/auth-service.template'
import type {
  TemplateDashboardActivityItem,
  TemplateDashboardChip,
  TemplateDashboardMetric,
  TemplateDashboardTopItem,
} from '../pages/page-template.types'

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

/* ------------------------------------------------------------------ */
/*  Greeting helpers (reference parity)                                */
/* ------------------------------------------------------------------ */

function getGreetingText(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getGreetingIcon(): string {
  const hour = new Date().getHours()
  if (hour < 6) return '🌙'
  if (hour < 12) return '☀️'
  if (hour < 18) return '🌤️'
  return '🌙'
}

function getFirstName(): string {
  const name = runtimeAuthStore.state.user?.name ?? 'Usuário'
  const first = name.split(' ')[0] ?? name
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

/* ------------------------------------------------------------------ */
/*  Fake reference data                                               */
/* ------------------------------------------------------------------ */

const fakeDashboard = {
  totalClients: 247,
  ordersToday: 18,
  ordersWeek: 87,
  ordersMonth: 342,
  revenueMonth: 156780,
  newClientsMonth: 23,
  totalOrders: 1847,
  pendingOrders: 34,
  inProgressOrders: 52,
  completedOrders: 1680,
  cancelledOrders: 81,
}

const fakeTopClients: TemplateDashboardTopItem[] = [
  { id: 'c1', name: 'Distribuidora Alfa Ltda', avatar: 'DA', value: 45, valueCaption: 'pedidos', secondaryValue: 'R$ 32.500', secondaryCaption: 'fatur.', barPercent: 100 },
  { id: 'c2', name: 'Comércio Beta SA', avatar: 'CB', value: 38, valueCaption: 'pedidos', secondaryValue: 'R$ 28.900', secondaryCaption: 'fatur.', barPercent: 84 },
  { id: 'c3', name: 'Indústria Gamma ME', avatar: 'IG', value: 32, valueCaption: 'pedidos', secondaryValue: 'R$ 24.100', secondaryCaption: 'fatur.', barPercent: 71 },
  { id: 'c4', name: 'Atacado Delta Eireli', avatar: 'AD', value: 27, valueCaption: 'pedidos', secondaryValue: 'R$ 19.800', secondaryCaption: 'fatur.', barPercent: 60 },
  { id: 'c5', name: 'Varejo Epsilon Ltda', avatar: 'VE', value: 21, valueCaption: 'pedidos', secondaryValue: 'R$ 15.600', secondaryCaption: 'fatur.', barPercent: 47 },
]

const fakeMetrics: TemplateDashboardMetric[] = [
  { id: 'm1', label: 'Total Pedidos', value: fakeDashboard.totalOrders, icon: 'shopping_cart', tone: 'neutral' },
  { id: 'm2', label: 'Pendentes', value: fakeDashboard.pendingOrders, icon: 'inbox', tone: 'info' },
  { id: 'm3', label: 'Em Progresso', value: fakeDashboard.inProgressOrders, icon: 'pending_actions', tone: 'warning' },
  { id: 'm4', label: 'Concluídos', value: fakeDashboard.completedOrders, icon: 'task_alt', tone: 'success' },
  { id: 'm5', label: 'Cancelados', value: fakeDashboard.cancelledOrders, icon: 'cancel', tone: 'danger' },
]

const fakeChips: TemplateDashboardChip[] = [
  { id: 'chip-clients', text: `${fakeDashboard.totalClients} clientes`, icon: 'people' },
  { id: 'chip-orders', text: `${fakeDashboard.ordersToday} pedidos hoje`, icon: 'shopping_cart' },
]

const fakeActivities: TemplateDashboardActivityItem[] = [
  { id: 'a1', label: 'Pedidos hoje', value: fakeDashboard.ordersToday, icon: 'today', iconTone: 'blue' },
  { id: 'a2', label: 'Pedidos na semana', value: fakeDashboard.ordersWeek, icon: 'date_range', iconTone: 'indigo' },
  { id: 'a3', label: 'Pedidos no mês', value: fakeDashboard.ordersMonth, icon: 'calendar_month', iconTone: 'violet' },
  { id: 'a4', label: 'Faturamento do mês', value: `R$ ${fakeDashboard.revenueMonth.toLocaleString('pt-BR')}`, icon: 'attach_money', iconTone: 'green' },
  { id: 'a5', label: 'Novos clientes no mês', value: fakeDashboard.newClientsMonth, icon: 'person_add', iconTone: 'amber' },
]

/* ------------------------------------------------------------------ */
/*  Runtime page components                                           */
/* ------------------------------------------------------------------ */

const RuntimeDashboardPage = defineComponent({
  name: 'TemplateRuntimeDashboardPage',
  setup() {
    const title = computed(() => `${getGreetingText()}, ${getFirstName()}`)
    const subtitle = computed(() => {
      const d = new Date()
      const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' }
      return d.toLocaleDateString('pt-BR', opts)
    })
    const icon = computed(() => getGreetingIcon())

    return () => h(DashboardTemplate, {
      title: title.value,
      subtitle: subtitle.value,
      greetingIcon: icon.value,
      chips: fakeChips,
      metrics: fakeMetrics,
      activities: fakeActivities,
      topItems: fakeTopClients,
      activityTitle: 'Atividade',
      activityTitleIcon: 'insights',
      topItemsTitle: 'Top Clientes',
      topItemsTitleIcon: 'star',
    })
  },
})

const RuntimeClientsPage = defineComponent({
  name: 'TemplateRuntimeClientsPage',
  setup() {
    return () => h(PlaceholderTemplate, {
      title: 'Clientes',
      subtitle: 'Gestão de clientes e contatos comerciais.',
      icon: 'people',
      statusLabel: 'Em breve',
    })
  },
})

const RuntimeOrdersPage = defineComponent({
  name: 'TemplateRuntimeOrdersPage',
  setup() {
    return () => h(PlaceholderTemplate, {
      title: 'Pedidos',
      subtitle: 'Acompanhamento de pedidos e entregas.',
      icon: 'shopping_cart',
      statusLabel: 'Em breve',
    })
  },
})

const RuntimeWikiPage = defineComponent({
  name: 'TemplateRuntimeWikiPage',
  setup() {
    return () => h(WikiTemplate, {
      title: 'Base de conhecimento',
      subtitle: 'Documentação, procedimentos e referências de suporte.',
    })
  },
})

const RuntimeWikiChatPage = defineComponent({
  name: 'TemplateRuntimeWikiChatPage',
  setup() {
    return () => h(WikiChatTemplate, {
      title: 'Assistente de conhecimento',
      subtitle: 'Chat com IA para dúvidas e suporte operacional.',
    })
  },
})

const RuntimeSettingsPage = defineComponent({
  name: 'TemplateRuntimeSettingsPage',
  setup() {
    return () => h(PlaceholderTemplate, {
      title: 'Configurações',
      subtitle: 'Preferências do sistema e parâmetros gerais.',
      icon: 'settings',
      statusLabel: 'Em breve',
    })
  },
})

const RuntimeProfilePage = defineComponent({
  name: 'TemplateRuntimeProfilePage',
  setup() {
    const profile = computed(() => ({
      name: runtimeAuthStore.state.user?.name ?? 'Usuário',
      email: runtimeAuthStore.state.user?.email ?? '',
      role: runtimeAuthStore.state.user?.role ?? 'Usuário',
      initials: runtimeAuthStore.userInitials.value,
    }))

    return () => h(ProfileTemplate, {
      profile: profile.value,
      sectionTitle: 'Perfil e preferências',
      showLogoutAction: true,
      onLogoutClick: () => {
        runtimeAuthStore.logout()
        window.location.hash = '#/login'
      },
    })
  },
})

const RuntimeLoginPage = defineComponent({
  name: 'TemplateRuntimeLoginPage',
  setup() {
    const email = ref('')
    const password = ref('')
    const loading = ref(false)

    return () => h(LoginTemplate, {
      email: email.value,
      password: password.value,
      loading: loading.value,
      formTitle: 'Entrar no sistema',
      formSubtitle: 'Use suas credenciais para acessar a plataforma.',
      submitLabel: 'Continuar',
      emailLabel: 'E-mail',
      passwordLabel: 'Senha',
      brandTitle: 'Bem-vindo ao seu workspace',
      brandSubtitle: 'Acesse suas operações, dashboards e ferramentas de colaboração em um portal seguro.',
      emailRequiredMessage: 'E-mail é obrigatório.',
      emailInvalidMessage: 'E-mail inválido.',
      passwordRequiredMessage: 'Senha é obrigatória.',
      'onUpdate:email': (v: string) => { email.value = v },
      'onUpdate:password': (v: string) => { password.value = v },
      onSubmit: async (payload: { email: string; password: string }) => {
        loading.value = true
        try {
          const result = await templateAuthService.login(payload.email, payload.password)
          runtimeAuthStore.setAuth(result.user, result.token)
          window.location.hash = '#/'
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
      title: 'Página não encontrada',
      description: 'Use o menu lateral para navegar pelas funcionalidades disponíveis.',
      primaryAction: {
        id: 'go-dashboard',
        label: 'Voltar ao dashboard',
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
      text: 'Clientes',
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
      text: 'Pedidos',
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
    children: [
      {
        id: 'knowledge-chat',
        path: 'chat',
        name: 'TemplateRuntimeKnowledgeChat',
        component: RuntimeWikiChatPage,
        menu: {
          text: 'Assistente',
          icon: 'chat',
          order: 1,
        },
      },
    ],
  },
  {
    id: 'settings',
    path: 'settings',
    name: 'TemplateRuntimeSettings',
    component: RuntimeSettingsPage,
    layoutId: 'main',
    menu: {
      text: 'Configurações',
      icon: 'settings',
      order: 90,
      stickyBottom: true,
    },
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
/*  Chat drawer state (shared)                                        */
/* ------------------------------------------------------------------ */

const chatDrawerOpen = ref(false)

/* ------------------------------------------------------------------ */
/*  Layout shells                                                     */
/* ------------------------------------------------------------------ */

const TemplateRuntimeMainLayoutShell = defineComponent({
  name: 'TemplateRuntimeMainLayoutShell',
  setup() {
    return () => h(
      MainLayoutTemplate,
      {
        appName: 'Template Runtime',
        userName: runtimeAuthStore.userName.value,
        userInitials: runtimeAuthStore.userInitials.value,
        menuItems: templateRuntimeMenuItems,
        useRouterView: true,
        persistMode: true,
        storageKeyPrefix: 'ntk-template-runtime-layout',
        showBreadcrumb: true,
        showHeader: true,
        showDrawer: true,
      },
      {
        floating: () => [
          h('button', {
            class: 'ntk-runtime-chat-fab',
            'aria-label': 'Abrir assistente',
            onClick: () => { chatDrawerOpen.value = !chatDrawerOpen.value },
          }, [
            h('span', { class: 'material-icons', style: 'font-size:22px;color:#fff' }, chatDrawerOpen.value ? 'close' : 'smart_toy'),
          ]),
          h(WikiChatDrawerTemplate, {
            modelValue: chatDrawerOpen.value,
            title: 'Assistente',
            contextHint: 'Base de conhecimento',
            'onUpdate:modelValue': (v: boolean) => { chatDrawerOpen.value = v },
            onOpenFullscreen: () => { window.location.hash = '#/knowledge/chat' },
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
    return () => h(RouterView)
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
    const isLoginRoute = to.name === 'TemplateRuntimeLogin'
    const isAuthenticated = runtimeAuthStore.isAuthenticated.value || runtimeAuthStore.checkAuth()

    if (!isAuthenticated && !isLoginRoute) {
      return { name: 'TemplateRuntimeLogin' }
    }
    if (isAuthenticated && isLoginRoute) {
      return { name: 'TemplateRuntimeDashboard' }
    }
  })
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