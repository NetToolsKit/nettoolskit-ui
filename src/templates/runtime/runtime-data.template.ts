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
import {
  cloneRuntimeSnapshot,
  createDefaultTemplateRuntimeData,
  formatTemplateRuntimeShortDate,
  nextTemplateRuntimeClientId,
  nextTemplateRuntimeOrderId,
  nextTemplateRuntimeOrderNumber,
} from './runtime-factories.template'
import {
  loadTemplateRuntimeData,
  persistTemplateRuntimeData,
} from './runtime-storage.template'

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

const CLIENT_STATUS_META: Record<
  TemplateRuntimeClientStatus,
  { label: string; tone: 'success' | 'warning' | 'neutral' }
> = {
  active: { label: 'Active', tone: 'success' },
  onboarding: { label: 'Onboarding', tone: 'warning' },
  inactive: { label: 'Inactive', tone: 'neutral' },
}

const ORDER_STATUS_META: Record<
  TemplateRuntimeOrderStatus,
  { label: string; tone: 'info' | 'warning' | 'success' | 'danger' }
> = {
  pending: { label: 'Pending', tone: 'warning' },
  in_progress: { label: 'In progress', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
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
  { id: 'name', label: 'Client', emphasize: true },
  { id: 'owner', label: 'Owner' },
  { id: 'segment', label: 'Segment' },
  { id: 'city', label: 'City' },
  { id: 'monthlyRevenue', label: 'Monthly revenue', align: 'right' },
]

const ORDER_COLUMNS: TemplateCrudListColumn[] = [
  { id: 'number', label: 'Order', emphasize: true },
  { id: 'clientName', label: 'Client' },
  { id: 'category', label: 'Category' },
  { id: 'updatedAt', label: 'Updated at' },
  { id: 'total', label: 'Total', align: 'right' },
]

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US')}`
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
        valueCaption: 'orders',
        secondaryValue: formatCurrency(revenue),
        secondaryCaption: 'revenue',
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
      { id: 'clients', text: `${snapshot.clients.length} clients`, icon: 'people' },
      { id: 'revenue', text: `${formatCurrency(totalRevenue)} in period`, icon: 'payments' },
    ],
    metrics: [
      { id: 'orders-total', label: 'Total orders', value: snapshot.orders.length, icon: 'shopping_cart', tone: 'neutral' },
      { id: 'orders-pending', label: 'Pending', value: statusCount.pending, icon: 'pending_actions', tone: 'warning' },
      { id: 'orders-progress', label: 'In progress', value: statusCount.inProgress, icon: 'autorenew', tone: 'info' },
      { id: 'orders-completed', label: 'Completed', value: statusCount.completed, icon: 'task_alt', tone: 'success' },
      { id: 'orders-cancelled', label: 'Cancelled', value: statusCount.cancelled, icon: 'cancel', tone: 'danger' },
    ],
    activities: [
      { id: 'activity-today', label: 'Orders today', value: activityToday, icon: 'today', iconTone: 'blue' },
      { id: 'activity-week', label: 'Orders this week', value: activityWeek, icon: 'date_range', iconTone: 'indigo' },
      { id: 'activity-month', label: 'Orders this month', value: activityMonth, icon: 'calendar_month', iconTone: 'violet' },
      { id: 'activity-revenue', label: 'Active revenue', value: formatCurrency(totalRevenue), icon: 'payments', iconTone: 'green' },
      { id: 'activity-clients', label: 'Active clients', value: activeClients, icon: 'person_add', iconTone: 'amber' },
    ],
    topItems: topClients,
    statusSegments: [
      { id: 'status-pending', label: 'Pending', value: statusCount.pending, color: ORDER_STATUS_COLORS.pending },
      { id: 'status-progress', label: 'In progress', value: statusCount.inProgress, color: ORDER_STATUS_COLORS.in_progress },
      { id: 'status-completed', label: 'Completed', value: statusCount.completed, color: ORDER_STATUS_COLORS.completed },
      { id: 'status-cancelled', label: 'Cancelled', value: statusCount.cancelled, color: ORDER_STATUS_COLORS.cancelled },
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
    { id: 'all', label: 'All', count: runtimeState.clients.length },
    { id: 'active', label: 'Active', count: runtimeState.clients.filter(client => client.status === 'active').length },
    { id: 'onboarding', label: 'Onboarding', count: runtimeState.clients.filter(client => client.status === 'onboarding').length },
    { id: 'inactive', label: 'Inactive', count: runtimeState.clients.filter(client => client.status === 'inactive').length },
  ]),
  clientMetrics: computed<TemplateCrudMetricChip[]>(() => [
    { id: 'clients-total', label: 'Clients', value: runtimeState.clients.length, icon: 'people', tone: 'info' },
    { id: 'clients-active', label: 'Active', value: runtimeState.clients.filter(client => client.status === 'active').length, icon: 'verified_user', tone: 'success' },
    { id: 'clients-revenue', label: 'Potential revenue', value: formatCurrency(runtimeState.clients.reduce((sum, client) => sum + client.monthlyRevenue, 0)), icon: 'payments', tone: 'primary' },
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
        updatedAt: formatTemplateRuntimeShortDate(order.updatedAt),
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
    { id: 'all', label: 'All', count: runtimeState.orders.length },
    { id: 'pending', label: 'Pending', count: runtimeState.orders.filter(order => order.status === 'pending').length },
    { id: 'in_progress', label: 'In progress', count: runtimeState.orders.filter(order => order.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: runtimeState.orders.filter(order => order.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: runtimeState.orders.filter(order => order.status === 'cancelled').length },
  ]),
  orderMetrics: computed<TemplateCrudMetricChip[]>(() => [
    { id: 'orders-total', label: 'Orders', value: runtimeState.orders.length, icon: 'shopping_cart', tone: 'info' },
    { id: 'orders-open', label: 'Open', value: runtimeState.orders.filter(order => order.status === 'pending' || order.status === 'in_progress').length, icon: 'pending_actions', tone: 'warning' },
    { id: 'orders-revenue', label: 'Active revenue', value: formatCurrency(runtimeState.orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)), icon: 'paid', tone: 'success' },
  ]),
  wikiCategories: computed(() => runtimeState.wiki.categories),
  wikiDocuments: computed(() => runtimeState.wiki.documents),
  wikiSuggestions: computed(() => runtimeState.wiki.suggestions),
  createClient(): TemplateRuntimeClient {
    const draft = cloneRuntimeSnapshot(runtimeState)
    const suffix = draft.clients.length + 1
    const client: TemplateRuntimeClient = {
      id: nextTemplateRuntimeClientId(draft),
      name: `New Client ${suffix}`,
      owner: draft.settings.operatorName,
      segment: 'Expansion',
      city: 'Remote',
      status: 'onboarding',
      monthlyRevenue: 12500 + suffix * 320,
      lastOrderAt: new Date().toISOString(),
      tags: ['new'],
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
      id: nextTemplateRuntimeClientId(draft),
      name: `${source.name} Copy`,
      status: 'onboarding',
      tags: [...source.tags, 'copy'],
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
      id: nextTemplateRuntimeOrderId(draft),
      number: nextTemplateRuntimeOrderNumber(draft),
      clientId: client.id,
      clientName: client.name,
      category: 'Operations',
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
