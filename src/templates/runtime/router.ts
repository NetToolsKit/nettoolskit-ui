/**
 * Landing page template runtime router module.
 *
 * Provides route-level adoption for template layouts, navigation, pages and
 * feature templates using the scaffolding contracts.
 */

import { defineComponent, h } from 'vue'
import {
  RouterView,
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'

import {
  ApprovalQueueTemplate,
  AuditTimelineTemplate,
  EnterpriseCommandCenterTemplate,
  LoginTemplate,
  WikiChatTemplate,
  WikiTemplate,
} from '../features'
import { AuthLayoutTemplate, MainLayoutTemplate } from '../layouts'
import {
  CrudListTemplate,
  DashboardWorkspaceTemplate,
  EditorWorkbenchTemplate,
  ErrorNotFoundTemplate,
  ProfileTemplate,
} from '../pages'
import {
  createDefaultTemplateLayoutShells,
  createTemplateMenuFromScaffoldRoutes,
  createTemplateRouteScaffold,
  type TemplateScaffoldRouteNode,
} from '../scaffolding'

const RuntimeDashboardPage = defineComponent({
  name: 'TemplateRuntimeDashboardPage',
  setup() {
    return () => h(DashboardWorkspaceTemplate, {
      title: 'Operations dashboard',
      subtitle: 'Route-ready template runtime using generic dashboard workspace contracts.',
    })
  },
})

const RuntimeCrudListPage = defineComponent({
  name: 'TemplateRuntimeCrudListPage',
  setup() {
    return () => h(CrudListTemplate, {
      title: 'CRUD list workspace',
      subtitle: 'Template runtime for reusable list/table/cards flows.',
    })
  },
})

const RuntimeEditorPage = defineComponent({
  name: 'TemplateRuntimeEditorPage',
  setup() {
    return () => h(EditorWorkbenchTemplate, {
      documentTitle: 'Template editor',
      documentSubtitle: 'Reusable editor shell with top, side and bottom control bars.',
    })
  },
})

const RuntimeWikiPage = defineComponent({
  name: 'TemplateRuntimeWikiPage',
  setup() {
    return () => h(WikiTemplate, {
      title: 'Knowledge center',
      subtitle: 'Generic template page for docs, runbooks and support references.',
    })
  },
})

const RuntimeWikiChatPage = defineComponent({
  name: 'TemplateRuntimeWikiChatPage',
  setup() {
    return () => h(WikiChatTemplate, {
      title: 'Knowledge assistant',
      subtitle: 'Template chat workspace routed through runtime scaffolding.',
    })
  },
})

const RuntimeCommandCenterPage = defineComponent({
  name: 'TemplateRuntimeCommandCenterPage',
  setup() {
    return () => h(EnterpriseCommandCenterTemplate, {
      title: 'Command center',
      subtitle: 'Enterprise template route for incidents, health and operational signals.',
    })
  },
})

const RuntimeApprovalsPage = defineComponent({
  name: 'TemplateRuntimeApprovalsPage',
  setup() {
    return () => h(ApprovalQueueTemplate, {
      title: 'Approvals',
      subtitle: 'Generic enterprise approval queue route template.',
    })
  },
})

const RuntimeAuditPage = defineComponent({
  name: 'TemplateRuntimeAuditPage',
  setup() {
    return () => h(AuditTimelineTemplate, {
      title: 'Audit timeline',
      subtitle: 'Template-first governance and compliance timeline route.',
    })
  },
})

const RuntimeProfilePage = defineComponent({
  name: 'TemplateRuntimeProfilePage',
  setup() {
    return () => h(ProfileTemplate, {
      profile: {
        name: 'Template Admin',
        email: 'admin@template-runtime.local',
        role: 'Platform Admin',
        initials: 'TA',
      },
      sectionTitle: 'Profile and preferences',
      showLogoutAction: true,
    })
  },
})

const RuntimeLoginPage = defineComponent({
  name: 'TemplateRuntimeLoginPage',
  setup() {
    return () => h(LoginTemplate, {
      formTitle: 'Template runtime sign in',
      formSubtitle: 'Router-enabled auth route powered by generic template contracts.',
      submitLabel: 'Continue',
    })
  },
})

const RuntimeNotFoundPage = defineComponent({
  name: 'TemplateRuntimeNotFoundPage',
  setup() {
    return () => h(ErrorNotFoundTemplate, {
      title: 'Template route not found',
      description: 'Use the menu entries to navigate through routed template surfaces.',
      primaryAction: {
        id: 'go-dashboard',
        label: 'Back to dashboard',
        icon: 'home',
        to: '/',
      },
    })
  },
})

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
    id: 'crud-lists',
    path: 'operations',
    name: 'TemplateRuntimeCrud',
    component: RuntimeCrudListPage,
    layoutId: 'main',
    menu: {
      text: 'CRUD Lists',
      icon: 'table_view',
      order: 20,
    },
  },
  {
    id: 'editor',
    path: 'editor',
    name: 'TemplateRuntimeEditor',
    component: RuntimeEditorPage,
    layoutId: 'main',
    menu: {
      text: 'Editor',
      icon: 'design_services',
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
      text: 'Knowledge',
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
          text: 'Assistant',
          icon: 'chat',
          order: 1,
        },
      },
    ],
  },
  {
    id: 'command-center',
    path: 'command-center',
    name: 'TemplateRuntimeCommandCenter',
    component: RuntimeCommandCenterPage,
    layoutId: 'main',
    menu: {
      text: 'Command Center',
      icon: 'monitoring',
      order: 50,
    },
  },
  {
    id: 'approvals',
    path: 'approvals',
    name: 'TemplateRuntimeApprovals',
    component: RuntimeApprovalsPage,
    layoutId: 'main',
    menu: {
      text: 'Approvals',
      icon: 'task_alt',
      order: 60,
    },
  },
  {
    id: 'audit',
    path: 'audit',
    name: 'TemplateRuntimeAudit',
    component: RuntimeAuditPage,
    layoutId: 'main',
    menu: {
      text: 'Audit',
      icon: 'history_edu',
      order: 70,
    },
  },
  {
    id: 'profile',
    path: 'profile',
    name: 'TemplateRuntimeProfile',
    component: RuntimeProfilePage,
    layoutId: 'main',
    menu: {
      text: 'Profile',
      icon: 'manage_accounts',
      order: 80,
    },
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

const TemplateRuntimeMainLayoutShell = defineComponent({
  name: 'TemplateRuntimeMainLayoutShell',
  setup() {
    return () => h(MainLayoutTemplate, {
      appName: 'Template Runtime',
      userName: 'Template Admin',
      userInitials: 'TA',
      menuItems: templateRuntimeMenuItems,
      useRouterView: true,
      persistMode: true,
      storageKeyPrefix: 'ntk-template-runtime-layout',
      showBreadcrumb: true,
      showHeader: true,
      showDrawer: true,
    })
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

export function createTemplateRuntimeRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: createTemplateRuntimeRoutes(),
    scrollBehavior() {
      return {
        top: 0,
        left: 0,
      }
    },
  })
}