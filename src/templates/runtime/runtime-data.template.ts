import { computed, reactive, readonly } from 'vue'

import type {
  TemplateDashboardActivityItem,
  TemplateDashboardChip,
  TemplateDashboardMetric,
  TemplateDashboardTopItem,
  TemplateCrudFilterOption,
  TemplateCrudListColumn,
  TemplateCrudListRecord,
  TemplateCrudMetricChip,
} from '../pages/page-template.types'
import type {
  TemplateWikiCategoryNode,
  TemplateWikiDocument,
  TemplateWikiSuggestion,
} from '../features/wiki/wiki-template.types'

export type TemplateRuntimeClientStatus = 'active' | 'onboarding' | 'inactive'
export type TemplateRuntimeOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface TemplateRuntimeClient {
  id: string
  name: string
  owner: string
  segment: string
  city: string
  status: TemplateRuntimeClientStatus
  monthlyRevenue: number
  lastOrderAt: string
  tags: string[]
}

export interface TemplateRuntimeOrder {
  id: string
  number: string
  clientId: string
  clientName: string
  category: string
  total: number
  status: TemplateRuntimeOrderStatus
  createdAt: string
  updatedAt: string
}

export interface TemplateRuntimeSettings {
  workspaceName: string
  operatorName: string
  supportEmail: string
  locale: string
  timezone: string
  notificationsEnabled: boolean
  compactTables: boolean
  autoCreateFollowUp: boolean
}

export interface TemplateRuntimeWikiData {
  categories: TemplateWikiCategoryNode[]
  documents: TemplateWikiDocument[]
  suggestions: TemplateWikiSuggestion[]
}

export interface TemplateRuntimeDataSnapshot {
  clients: TemplateRuntimeClient[]
  orders: TemplateRuntimeOrder[]
  settings: TemplateRuntimeSettings
  wiki: TemplateRuntimeWikiData
}

export interface TemplateRuntimeDashboardSnapshot {
  chips: TemplateDashboardChip[]
  metrics: TemplateDashboardMetric[]
  activities: TemplateDashboardActivityItem[]
  topItems: TemplateDashboardTopItem[]
  statusSegments: Array<{ id: string; label: string; value: number; color: string }>
  categorySeries: Array<{ id: string; label: string; value: number; color: string }>
}

const TEMPLATE_RUNTIME_STORAGE_KEY = 'ntk_template_runtime_data_v1'

const CLIENT_STATUS_META: Record<
  TemplateRuntimeClientStatus,
  { label: string; tone: 'success' | 'warning' | 'neutral' }
> = {
  active: { label: 'Ativo', tone: 'success' },
  onboarding: { label: 'Onboarding', tone: 'warning' },
  inactive: { label: 'Inativo', tone: 'neutral' },
}

const ORDER_STATUS_META: Record<
  TemplateRuntimeOrderStatus,
  { label: string; tone: 'info' | 'warning' | 'success' | 'danger' }
> = {
  pending: { label: 'Pendente', tone: 'warning' },
  in_progress: { label: 'Em progresso', tone: 'info' },
  completed: { label: 'Concluído', tone: 'success' },
  cancelled: { label: 'Cancelado', tone: 'danger' },
}

const ORDER_STATUS_COLORS: Record<TemplateRuntimeOrderStatus, string> = {
  pending: 'var(--ntk-warning)',
  in_progress: 'var(--ntk-info)',
  completed: 'var(--ntk-success)',
  cancelled: 'var(--ntk-text-muted)',
}

const CATEGORY_COLORS = [
  'var(--ntk-info)',
  'var(--ntk-accent)',
  'var(--ntk-warning)',
  'var(--ntk-success)',
  'var(--semantic-info-primary, var(--ntk-info))',
]

const CLIENT_COLUMNS: TemplateCrudListColumn[] = [
  { id: 'name', label: 'Cliente', emphasize: true },
  { id: 'owner', label: 'Responsável' },
  { id: 'segment', label: 'Segmento' },
  { id: 'city', label: 'Cidade' },
  { id: 'monthlyRevenue', label: 'Receita mensal', align: 'right' },
]

const ORDER_COLUMNS: TemplateCrudListColumn[] = [
  { id: 'number', label: 'Pedido', emphasize: true },
  { id: 'clientName', label: 'Cliente' },
  { id: 'category', label: 'Categoria' },
  { id: 'updatedAt', label: 'Atualizado em' },
  { id: 'total', label: 'Total', align: 'right' },
]

function addDays(base: Date, offset: number): string {
  const value = new Date(base)
  value.setDate(value.getDate() + offset)
  return value.toISOString()
}

function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR')}`
}

function formatShortDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

function cloneRuntimeSnapshot(snapshot: TemplateRuntimeDataSnapshot): TemplateRuntimeDataSnapshot {
  return {
    clients: snapshot.clients.map(client => ({
      ...client,
      tags: [...client.tags],
    })),
    orders: snapshot.orders.map(order => ({ ...order })),
    settings: { ...snapshot.settings },
    wiki: {
      categories: snapshot.wiki.categories.map(category => ({
        ...category,
        children: category.children?.map(child => ({ ...child })),
      })),
      documents: snapshot.wiki.documents.map(documentItem => ({
        ...documentItem,
        tags: documentItem.tags ? [...documentItem.tags] : undefined,
      })),
      suggestions: snapshot.wiki.suggestions.map(suggestion => ({ ...suggestion })),
    },
  }
}

function createDefaultTemplateRuntimeData(): TemplateRuntimeDataSnapshot {
  const now = new Date()

  const clients: TemplateRuntimeClient[] = [
    {
      id: 'client-1',
      name: 'Distribuidora Alfa',
      owner: 'Ana Costa',
      segment: 'Distribuição',
      city: 'São Paulo',
      status: 'active',
      monthlyRevenue: 32500,
      lastOrderAt: addDays(now, -1),
      tags: ['vip', 'sudeste'],
    },
    {
      id: 'client-2',
      name: 'Comércio Beta',
      owner: 'Bruno Melo',
      segment: 'Varejo',
      city: 'Campinas',
      status: 'active',
      monthlyRevenue: 28900,
      lastOrderAt: addDays(now, -2),
      tags: ['varejo'],
    },
    {
      id: 'client-3',
      name: 'Indústria Gamma',
      owner: 'Carla Nunes',
      segment: 'Indústria',
      city: 'Curitiba',
      status: 'onboarding',
      monthlyRevenue: 24100,
      lastOrderAt: addDays(now, -6),
      tags: ['novo'],
    },
    {
      id: 'client-4',
      name: 'Atacado Delta',
      owner: 'Diego Silva',
      segment: 'Atacado',
      city: 'Belo Horizonte',
      status: 'active',
      monthlyRevenue: 19800,
      lastOrderAt: addDays(now, -4),
      tags: ['atacado'],
    },
    {
      id: 'client-5',
      name: 'Varejo Epsilon',
      owner: 'Erika Sousa',
      segment: 'Varejo',
      city: 'Rio de Janeiro',
      status: 'inactive',
      monthlyRevenue: 15600,
      lastOrderAt: addDays(now, -15),
      tags: ['reativacao'],
    },
    {
      id: 'client-6',
      name: 'Farmácia Zeta',
      owner: 'Felipe Rocha',
      segment: 'Saúde',
      city: 'Salvador',
      status: 'active',
      monthlyRevenue: 21450,
      lastOrderAt: addDays(now, 0),
      tags: ['saude', 'nordeste'],
    },
  ]

  const orders: TemplateRuntimeOrder[] = [
    { id: 'order-1', number: 'PED-1041', clientId: 'client-1', clientName: 'Distribuidora Alfa', category: 'Eletrônicos', total: 8400, status: 'completed', createdAt: addDays(now, -18), updatedAt: addDays(now, -1) },
    { id: 'order-2', number: 'PED-1042', clientId: 'client-2', clientName: 'Comércio Beta', category: 'Alimentos', total: 5900, status: 'in_progress', createdAt: addDays(now, -9), updatedAt: addDays(now, 0) },
    { id: 'order-3', number: 'PED-1043', clientId: 'client-1', clientName: 'Distribuidora Alfa', category: 'Eletrônicos', total: 12100, status: 'pending', createdAt: addDays(now, -3), updatedAt: addDays(now, -3) },
    { id: 'order-4', number: 'PED-1044', clientId: 'client-3', clientName: 'Indústria Gamma', category: 'Vestuário', total: 4300, status: 'completed', createdAt: addDays(now, -12), updatedAt: addDays(now, -7) },
    { id: 'order-5', number: 'PED-1045', clientId: 'client-4', clientName: 'Atacado Delta', category: 'Higiene', total: 6900, status: 'completed', createdAt: addDays(now, -5), updatedAt: addDays(now, -2) },
    { id: 'order-6', number: 'PED-1046', clientId: 'client-6', clientName: 'Farmácia Zeta', category: 'Saúde', total: 7350, status: 'in_progress', createdAt: addDays(now, -2), updatedAt: addDays(now, 0) },
    { id: 'order-7', number: 'PED-1047', clientId: 'client-2', clientName: 'Comércio Beta', category: 'Alimentos', total: 5100, status: 'completed', createdAt: addDays(now, -14), updatedAt: addDays(now, -6) },
    { id: 'order-8', number: 'PED-1048', clientId: 'client-4', clientName: 'Atacado Delta', category: 'Eletrônicos', total: 9800, status: 'cancelled', createdAt: addDays(now, -1), updatedAt: addDays(now, -1) },
    { id: 'order-9', number: 'PED-1049', clientId: 'client-6', clientName: 'Farmácia Zeta', category: 'Saúde', total: 4600, status: 'pending', createdAt: addDays(now, 0), updatedAt: addDays(now, 0) },
    { id: 'order-10', number: 'PED-1050', clientId: 'client-1', clientName: 'Distribuidora Alfa', category: 'Alimentos', total: 3820, status: 'completed', createdAt: addDays(now, -20), updatedAt: addDays(now, -10) },
  ]

  const wikiCategories: TemplateWikiCategoryNode[] = [
    {
      id: 'operations',
      name: 'Operações',
      count: 3,
      expanded: true,
      children: [
        { id: 'operations-orders', name: 'Pedidos', count: 2 },
        { id: 'operations-clients', name: 'Clientes', count: 1 },
      ],
    },
    {
      id: 'playbooks',
      name: 'Playbooks',
      count: 2,
      expanded: true,
      children: [
        { id: 'playbooks-recovery', name: 'Recuperação', count: 1 },
        { id: 'playbooks-support', name: 'Suporte', count: 1 },
      ],
    },
  ]

  const wikiDocuments: TemplateWikiDocument[] = [
    {
      id: 'doc-1',
      name: 'Checklist de onboarding.pdf',
      fileType: 'pdf',
      size: '2.1 MB',
      category: 'Operações',
      categoryId: 'operations',
      subCategory: 'Clientes',
      subCategoryId: 'operations-clients',
      tags: ['clientes', 'onboarding'],
      status: 'processed',
      uploadDate: formatShortDate(addDays(now, -8)),
      description: 'Passo a passo para ativar novos clientes no runtime local.',
    },
    {
      id: 'doc-2',
      name: 'Fluxo de aprovação de pedidos.md',
      fileType: 'md',
      size: '48 KB',
      category: 'Operações',
      categoryId: 'operations',
      subCategory: 'Pedidos',
      subCategoryId: 'operations-orders',
      tags: ['pedidos', 'aprovacao'],
      status: 'processed',
      uploadDate: formatShortDate(addDays(now, -4)),
      description: 'Estados e SLAs para pedidos pendentes, em progresso e concluídos.',
    },
    {
      id: 'doc-3',
      name: 'Guia de atendimento premium.doc',
      fileType: 'doc',
      size: '310 KB',
      category: 'Playbooks',
      categoryId: 'playbooks',
      subCategory: 'Suporte',
      subCategoryId: 'playbooks-support',
      tags: ['suporte', 'vip'],
      status: 'pending',
      uploadDate: formatShortDate(addDays(now, -1)),
      description: 'Script operacional para contas estratégicas.',
    },
  ]

  return {
    clients,
    orders,
    settings: {
      workspaceName: 'Atlas Flow',
      operatorName: 'Admin NetToolsKit',
      supportEmail: 'ops@atlasflow.local',
      locale: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notificationsEnabled: true,
      compactTables: false,
      autoCreateFollowUp: true,
    },
    wiki: {
      categories: wikiCategories,
      documents: wikiDocuments,
      suggestions: [
        { id: 'sug-1', text: 'Como reativar um cliente inativo?', icon: 'help' },
        { id: 'sug-2', text: 'Quais pedidos estão pendentes hoje?', icon: 'pending_actions' },
        { id: 'sug-3', text: 'Onde encontro o fluxo de aprovação?', icon: 'menu_book' },
      ],
    },
  }
}

function normalizeTemplateRuntimeData(raw: unknown): TemplateRuntimeDataSnapshot {
  const defaults = createDefaultTemplateRuntimeData()

  if (!raw || typeof raw !== 'object') {
    return defaults
  }

  const candidate = raw as Partial<TemplateRuntimeDataSnapshot>

  return {
    clients: Array.isArray(candidate.clients) && candidate.clients.length > 0
      ? candidate.clients.map(client => ({
          ...client,
          tags: Array.isArray(client.tags) ? [...client.tags] : [],
        })) as TemplateRuntimeClient[]
      : defaults.clients,
    orders: Array.isArray(candidate.orders) && candidate.orders.length > 0
      ? candidate.orders.map(order => ({ ...order })) as TemplateRuntimeOrder[]
      : defaults.orders,
    settings: {
      ...defaults.settings,
      ...(candidate.settings ?? {}),
    },
    wiki: {
      categories: Array.isArray(candidate.wiki?.categories) && candidate.wiki.categories.length > 0
        ? candidate.wiki.categories.map(category => ({
            ...category,
            children: category.children?.map(child => ({ ...child })),
          }))
        : defaults.wiki.categories,
      documents: Array.isArray(candidate.wiki?.documents) && candidate.wiki.documents.length > 0
        ? candidate.wiki.documents.map(documentItem => ({
            ...documentItem,
            tags: documentItem.tags ? [...documentItem.tags] : undefined,
          }))
        : defaults.wiki.documents,
      suggestions: Array.isArray(candidate.wiki?.suggestions) && candidate.wiki.suggestions.length > 0
        ? candidate.wiki.suggestions.map(suggestion => ({ ...suggestion }))
        : defaults.wiki.suggestions,
    },
  }
}

function loadTemplateRuntimeData(): TemplateRuntimeDataSnapshot {
  try {
    const raw = localStorage.getItem(TEMPLATE_RUNTIME_STORAGE_KEY)
    return normalizeTemplateRuntimeData(raw ? JSON.parse(raw) : null)
  } catch {
    return createDefaultTemplateRuntimeData()
  }
}

function persistTemplateRuntimeData(snapshot: TemplateRuntimeDataSnapshot): void {
  try {
    localStorage.setItem(
      TEMPLATE_RUNTIME_STORAGE_KEY,
      JSON.stringify(snapshot)
    )
  } catch {
    // Ignore persistence failures to keep the runtime usable in restricted environments.
  }
}

function isWithinLastDays(value: string, days: number): boolean {
  const current = Date.now()
  const target = new Date(value).getTime()
  const difference = current - target
  return difference <= days * 24 * 60 * 60 * 1000
}

const runtimeState = reactive<TemplateRuntimeDataSnapshot>(loadTemplateRuntimeData())

function commitRuntimeSnapshot(snapshot: TemplateRuntimeDataSnapshot): void {
  runtimeState.clients = snapshot.clients
  runtimeState.orders = snapshot.orders
  runtimeState.settings = snapshot.settings
  runtimeState.wiki = snapshot.wiki
  persistTemplateRuntimeData(snapshot)
}

function patchRuntimeState(mutator: (draft: TemplateRuntimeDataSnapshot) => void): void {
  const draft = cloneRuntimeSnapshot(runtimeState)
  mutator(draft)
  commitRuntimeSnapshot(draft)
}

function nextClientId(snapshot: TemplateRuntimeDataSnapshot): string {
  return `client-${snapshot.clients.length + 1}`
}

function nextOrderId(snapshot: TemplateRuntimeDataSnapshot): string {
  return `order-${snapshot.orders.length + 1}`
}

function nextOrderNumber(snapshot: TemplateRuntimeDataSnapshot): string {
  const maxValue = snapshot.orders.reduce((current, order) => {
    const numeric = Number(order.number.replace(/\D+/g, ''))
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current
  }, 1050)

  return `PED-${maxValue + 1}`
}

function buildDashboardSnapshot(snapshot: TemplateRuntimeDataSnapshot): TemplateRuntimeDashboardSnapshot {
  const totalRevenue = snapshot.orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)

  const statusCount = {
    pending: snapshot.orders.filter(order => order.status === 'pending').length,
    inProgress: snapshot.orders.filter(order => order.status === 'in_progress').length,
    completed: snapshot.orders.filter(order => order.status === 'completed').length,
    cancelled: snapshot.orders.filter(order => order.status === 'cancelled').length,
  }

  const activityToday = snapshot.orders.filter(order => isWithinLastDays(order.updatedAt, 1)).length
  const activityWeek = snapshot.orders.filter(order => isWithinLastDays(order.updatedAt, 7)).length
  const activityMonth = snapshot.orders.filter(order => isWithinLastDays(order.updatedAt, 30)).length
  const activeClients = snapshot.clients.filter(client => client.status === 'active').length

  const topClients = [...snapshot.clients]
    .map(client => {
      const clientOrders = snapshot.orders.filter(order => order.clientId === client.id)
      const revenue = clientOrders
        .filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0)

      return {
        id: client.id,
        name: client.name,
        avatar: client.name
          .split(' ')
          .slice(0, 2)
          .map(word => word.charAt(0).toUpperCase())
          .join(''),
        value: clientOrders.length,
        valueCaption: 'pedidos',
        secondaryValue: formatCurrency(revenue),
        secondaryCaption: 'fatur.',
        barPercent: Math.round((revenue / Math.max(totalRevenue, 1)) * 100),
      }
    })
    .sort((left, right) => Number(right.barPercent ?? 0) - Number(left.barPercent ?? 0))
    .slice(0, 5)

  const categoryEntries = [...new Set(snapshot.orders.map(order => order.category))]
    .map((category, index) => ({
      id: `category-${category.toLowerCase().replace(/\s+/g, '-')}`,
      label: category,
      value: snapshot.orders
        .filter(order => order.category === category && order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0),
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] ?? 'var(--ntk-accent)',
    }))
    .sort((left, right) => right.value - left.value)

  return {
    chips: [
      { id: 'clients', text: `${snapshot.clients.length} clientes`, icon: 'people' },
      { id: 'revenue', text: `${formatCurrency(totalRevenue)} no período`, icon: 'payments' },
    ],
    metrics: [
      { id: 'orders-total', label: 'Total pedidos', value: snapshot.orders.length, icon: 'shopping_cart', tone: 'neutral' },
      { id: 'orders-pending', label: 'Pendentes', value: statusCount.pending, icon: 'pending_actions', tone: 'warning' },
      { id: 'orders-progress', label: 'Em progresso', value: statusCount.inProgress, icon: 'autorenew', tone: 'info' },
      { id: 'orders-completed', label: 'Concluídos', value: statusCount.completed, icon: 'task_alt', tone: 'success' },
      { id: 'orders-cancelled', label: 'Cancelados', value: statusCount.cancelled, icon: 'cancel', tone: 'danger' },
    ],
    activities: [
      { id: 'activity-today', label: 'Pedidos hoje', value: activityToday, icon: 'today', iconTone: 'blue' },
      { id: 'activity-week', label: 'Pedidos na semana', value: activityWeek, icon: 'date_range', iconTone: 'indigo' },
      { id: 'activity-month', label: 'Pedidos no mês', value: activityMonth, icon: 'calendar_month', iconTone: 'violet' },
      { id: 'activity-revenue', label: 'Receita ativa', value: formatCurrency(totalRevenue), icon: 'payments', iconTone: 'green' },
      { id: 'activity-clients', label: 'Clientes ativos', value: activeClients, icon: 'person_add', iconTone: 'amber' },
    ],
    topItems: topClients,
    statusSegments: [
      { id: 'status-pending', label: 'Pendentes', value: statusCount.pending, color: ORDER_STATUS_COLORS.pending },
      { id: 'status-progress', label: 'Em progresso', value: statusCount.inProgress, color: ORDER_STATUS_COLORS.in_progress },
      { id: 'status-completed', label: 'Concluídos', value: statusCount.completed, color: ORDER_STATUS_COLORS.completed },
      { id: 'status-cancelled', label: 'Cancelados', value: statusCount.cancelled, color: ORDER_STATUS_COLORS.cancelled },
    ],
    categorySeries: categoryEntries,
  }
}

export const templateRuntimeData = {
  state: readonly(runtimeState),
  workspaceName: computed(() => runtimeState.settings.workspaceName),
  clientColumns: CLIENT_COLUMNS,
  orderColumns: ORDER_COLUMNS,
  dashboardSnapshot: computed(() => buildDashboardSnapshot(runtimeState)),
  clientRecords: computed<TemplateCrudListRecord[]>(() =>
    runtimeState.clients.map(client => ({
      id: client.id,
      title: client.name,
      subtitle: `${client.segment} · ${client.city}`,
      values: {
        name: client.name,
        owner: client.owner,
        segment: client.segment,
        city: client.city,
        monthlyRevenue: formatCurrency(client.monthlyRevenue),
      },
      status: {
        value: client.status,
        label: CLIENT_STATUS_META[client.status].label,
        tone: CLIENT_STATUS_META[client.status].tone,
      },
      tags: client.tags,
      filterKeys: [client.status, client.segment.toLowerCase()],
    }))
  ),
  clientFilters: computed<TemplateCrudFilterOption[]>(() => [
    { id: 'all', label: 'Todos', count: runtimeState.clients.length },
    { id: 'active', label: 'Ativos', count: runtimeState.clients.filter(client => client.status === 'active').length },
    { id: 'onboarding', label: 'Onboarding', count: runtimeState.clients.filter(client => client.status === 'onboarding').length },
    { id: 'inactive', label: 'Inativos', count: runtimeState.clients.filter(client => client.status === 'inactive').length },
  ]),
  clientMetrics: computed<TemplateCrudMetricChip[]>(() => [
    { id: 'clients-total', label: 'Clientes', value: runtimeState.clients.length, icon: 'people', tone: 'info' },
    { id: 'clients-active', label: 'Ativos', value: runtimeState.clients.filter(client => client.status === 'active').length, icon: 'verified_user', tone: 'success' },
    { id: 'clients-revenue', label: 'Receita potencial', value: formatCurrency(runtimeState.clients.reduce((sum, client) => sum + client.monthlyRevenue, 0)), icon: 'payments', tone: 'primary' },
  ]),
  orderRecords: computed<TemplateCrudListRecord[]>(() =>
    runtimeState.orders.map(order => ({
      id: order.id,
      title: order.number,
      subtitle: `${order.clientName} · ${order.category}`,
      values: {
        number: order.number,
        clientName: order.clientName,
        category: order.category,
        updatedAt: formatShortDate(order.updatedAt),
        total: formatCurrency(order.total),
      },
      status: {
        value: order.status,
        label: ORDER_STATUS_META[order.status].label,
        tone: ORDER_STATUS_META[order.status].tone,
      },
      tags: [order.category],
      filterKeys: [order.status, order.category.toLowerCase()],
    }))
  ),
  orderFilters: computed<TemplateCrudFilterOption[]>(() => [
    { id: 'all', label: 'Todos', count: runtimeState.orders.length },
    { id: 'pending', label: 'Pendentes', count: runtimeState.orders.filter(order => order.status === 'pending').length },
    { id: 'in_progress', label: 'Em progresso', count: runtimeState.orders.filter(order => order.status === 'in_progress').length },
    { id: 'completed', label: 'Concluídos', count: runtimeState.orders.filter(order => order.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelados', count: runtimeState.orders.filter(order => order.status === 'cancelled').length },
  ]),
  orderMetrics: computed<TemplateCrudMetricChip[]>(() => [
    { id: 'orders-total', label: 'Pedidos', value: runtimeState.orders.length, icon: 'shopping_cart', tone: 'info' },
    { id: 'orders-open', label: 'Em aberto', value: runtimeState.orders.filter(order => order.status === 'pending' || order.status === 'in_progress').length, icon: 'pending_actions', tone: 'warning' },
    { id: 'orders-revenue', label: 'Receita ativa', value: formatCurrency(runtimeState.orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)), icon: 'paid', tone: 'success' },
  ]),
  wikiCategories: computed(() => runtimeState.wiki.categories),
  wikiDocuments: computed(() => runtimeState.wiki.documents),
  wikiSuggestions: computed(() => runtimeState.wiki.suggestions),
  createClient(): TemplateRuntimeClient {
    const draft = cloneRuntimeSnapshot(runtimeState)
    const suffix = draft.clients.length + 1
    const client: TemplateRuntimeClient = {
      id: nextClientId(draft),
      name: `Novo Cliente ${suffix}`,
      owner: draft.settings.operatorName,
      segment: 'Expansão',
      city: 'Remoto',
      status: 'onboarding',
      monthlyRevenue: 12500 + suffix * 320,
      lastOrderAt: new Date().toISOString(),
      tags: ['novo'],
    }

    draft.clients.unshift(client)
    commitRuntimeSnapshot(draft)
    return client
  },
  duplicateClient(clientId: string): TemplateRuntimeClient | null {
    const source = runtimeState.clients.find(client => client.id === clientId)
    if (!source) {
      return null
    }

    const draft = cloneRuntimeSnapshot(runtimeState)
    const client: TemplateRuntimeClient = {
      ...source,
      id: nextClientId(draft),
      name: `${source.name} Copy`,
      status: 'onboarding',
      tags: [...source.tags, 'copia'],
      lastOrderAt: new Date().toISOString(),
    }

    draft.clients.unshift(client)
    commitRuntimeSnapshot(draft)
    return client
  },
  cycleClientStatus(clientId: string): TemplateRuntimeClientStatus | null {
    let nextStatus: TemplateRuntimeClientStatus | null = null

    patchRuntimeState((draft) => {
      const client = draft.clients.find(entry => entry.id === clientId)
      if (!client) {
        return
      }

      if (client.status === 'onboarding') {
        client.status = 'active'
      } else if (client.status === 'active') {
        client.status = 'inactive'
      } else {
        client.status = 'active'
      }

      nextStatus = client.status
    })

    return nextStatus
  },
  createOrder(): TemplateRuntimeOrder {
    const draft = cloneRuntimeSnapshot(runtimeState)
    const client = draft.clients.find(entry => entry.status !== 'inactive') ?? draft.clients[0]!
    const order: TemplateRuntimeOrder = {
      id: nextOrderId(draft),
      number: nextOrderNumber(draft),
      clientId: client.id,
      clientName: client.name,
      category: 'Operações',
      total: 4800 + draft.orders.length * 190,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    draft.orders.unshift(order)
    commitRuntimeSnapshot(draft)
    return order
  },
  advanceOrderStatus(orderId: string): TemplateRuntimeOrderStatus | null {
    let nextStatus: TemplateRuntimeOrderStatus | null = null

    patchRuntimeState((draft) => {
      const order = draft.orders.find(entry => entry.id === orderId)
      if (!order) {
        return
      }

      if (order.status === 'pending') {
        order.status = 'in_progress'
      } else if (order.status === 'in_progress') {
        order.status = 'completed'
      } else if (order.status === 'cancelled') {
        order.status = 'pending'
      }

      order.updatedAt = new Date().toISOString()
      nextStatus = order.status
    })

    return nextStatus
  },
  cancelOrder(orderId: string): TemplateRuntimeOrderStatus | null {
    let nextStatus: TemplateRuntimeOrderStatus | null = null

    patchRuntimeState((draft) => {
      const order = draft.orders.find(entry => entry.id === orderId)
      if (!order) {
        return
      }

      order.status = 'cancelled'
      order.updatedAt = new Date().toISOString()
      nextStatus = order.status
    })

    return nextStatus
  },
  bulkUpdateOrderStatus(orderIds: string[], status: TemplateRuntimeOrderStatus): void {
    patchRuntimeState((draft) => {
      draft.orders.forEach(order => {
        if (orderIds.includes(order.id)) {
          order.status = status
          order.updatedAt = new Date().toISOString()
        }
      })
    })
  },
  updateSettings(patch: Partial<TemplateRuntimeSettings>): TemplateRuntimeSettings {
    let nextSettings = runtimeState.settings

    patchRuntimeState((draft) => {
      draft.settings = {
        ...draft.settings,
        ...patch,
      }
      nextSettings = draft.settings
    })

    return nextSettings
  },
  reset(): void {
    commitRuntimeSnapshot(createDefaultTemplateRuntimeData())
  },
  hydrate(): void {
    commitRuntimeSnapshot(loadTemplateRuntimeData())
  },
}

export function resetTemplateRuntimeData(): void {
  templateRuntimeData.reset()
}

export function getTemplateRuntimeDashboardSnapshot(): TemplateRuntimeDashboardSnapshot {
  return templateRuntimeData.dashboardSnapshot.value
}
