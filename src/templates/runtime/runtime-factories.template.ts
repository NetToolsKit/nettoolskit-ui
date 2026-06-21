import type {
  TemplateWikiCategoryNode,
  TemplateWikiDocument,
} from '../features/wiki/wiki-template.types'
import type {
  TemplateRuntimeClient,
  TemplateRuntimeDataSnapshot,
  TemplateRuntimeOrder,
} from './runtime-data.template'

function addDays(base: Date, offset: number): string {
  const value = new Date(base)
  value.setDate(value.getDate() + offset)
  return value.toISOString()
}

export function formatTemplateRuntimeShortDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function cloneRuntimeSnapshot(snapshot: TemplateRuntimeDataSnapshot): TemplateRuntimeDataSnapshot {
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

export function createDefaultTemplateRuntimeData(): TemplateRuntimeDataSnapshot {
  const now = new Date()

  const clients: TemplateRuntimeClient[] = [
    {
      id: 'client-1',
      name: 'Alfa Distribution',
      owner: 'Ana Costa',
      segment: 'Distribution',
      city: 'New York',
      status: 'active',
      monthlyRevenue: 32500,
      lastOrderAt: addDays(now, -1),
      tags: ['vip', 'northeast'],
    },
    {
      id: 'client-2',
      name: 'Beta Commerce',
      owner: 'Bruno Melo',
      segment: 'Retail',
      city: 'Austin',
      status: 'active',
      monthlyRevenue: 28900,
      lastOrderAt: addDays(now, -2),
      tags: ['retail'],
    },
    {
      id: 'client-3',
      name: 'Gamma Industries',
      owner: 'Carla Nunes',
      segment: 'Industry',
      city: 'Chicago',
      status: 'onboarding',
      monthlyRevenue: 24100,
      lastOrderAt: addDays(now, -6),
      tags: ['new'],
    },
    {
      id: 'client-4',
      name: 'Delta Wholesale',
      owner: 'Diego Silva',
      segment: 'Wholesale',
      city: 'Denver',
      status: 'active',
      monthlyRevenue: 19800,
      lastOrderAt: addDays(now, -4),
      tags: ['wholesale'],
    },
    {
      id: 'client-5',
      name: 'Epsilon Retail',
      owner: 'Erika Sousa',
      segment: 'Retail',
      city: 'Seattle',
      status: 'inactive',
      monthlyRevenue: 15600,
      lastOrderAt: addDays(now, -15),
      tags: ['reactivation'],
    },
    {
      id: 'client-6',
      name: 'Zeta Pharmacy',
      owner: 'Felipe Rocha',
      segment: 'Health',
      city: 'Miami',
      status: 'active',
      monthlyRevenue: 21450,
      lastOrderAt: addDays(now, 0),
      tags: ['health', 'southeast'],
    },
  ]

  const orders: TemplateRuntimeOrder[] = [
    { id: 'order-1', number: 'ORD-1041', clientId: 'client-1', clientName: 'Alfa Distribution', category: 'Electronics', total: 8400, status: 'completed', createdAt: addDays(now, -18), updatedAt: addDays(now, -1) },
    { id: 'order-2', number: 'ORD-1042', clientId: 'client-2', clientName: 'Beta Commerce', category: 'Food', total: 5900, status: 'in_progress', createdAt: addDays(now, -9), updatedAt: addDays(now, 0) },
    { id: 'order-3', number: 'ORD-1043', clientId: 'client-1', clientName: 'Alfa Distribution', category: 'Electronics', total: 12100, status: 'pending', createdAt: addDays(now, -3), updatedAt: addDays(now, -3) },
    { id: 'order-4', number: 'ORD-1044', clientId: 'client-3', clientName: 'Gamma Industries', category: 'Fashion', total: 4300, status: 'completed', createdAt: addDays(now, -12), updatedAt: addDays(now, -7) },
    { id: 'order-5', number: 'ORD-1045', clientId: 'client-4', clientName: 'Delta Wholesale', category: 'Hygiene', total: 6900, status: 'completed', createdAt: addDays(now, -5), updatedAt: addDays(now, -2) },
    { id: 'order-6', number: 'ORD-1046', clientId: 'client-6', clientName: 'Zeta Pharmacy', category: 'Health', total: 7350, status: 'in_progress', createdAt: addDays(now, -2), updatedAt: addDays(now, 0) },
    { id: 'order-7', number: 'ORD-1047', clientId: 'client-2', clientName: 'Beta Commerce', category: 'Food', total: 5100, status: 'completed', createdAt: addDays(now, -14), updatedAt: addDays(now, -6) },
    { id: 'order-8', number: 'ORD-1048', clientId: 'client-4', clientName: 'Delta Wholesale', category: 'Electronics', total: 9800, status: 'cancelled', createdAt: addDays(now, -1), updatedAt: addDays(now, -1) },
    { id: 'order-9', number: 'ORD-1049', clientId: 'client-6', clientName: 'Zeta Pharmacy', category: 'Health', total: 4600, status: 'pending', createdAt: addDays(now, 0), updatedAt: addDays(now, 0) },
    { id: 'order-10', number: 'ORD-1050', clientId: 'client-1', clientName: 'Alfa Distribution', category: 'Food', total: 3820, status: 'completed', createdAt: addDays(now, -20), updatedAt: addDays(now, -10) },
  ]

  const wikiCategories: TemplateWikiCategoryNode[] = [
    {
      id: 'operations',
      name: 'Operations',
      count: 3,
      expanded: true,
      children: [
        { id: 'operations-orders', name: 'Orders', count: 2 },
        { id: 'operations-clients', name: 'Clients', count: 1 },
      ],
    },
    {
      id: 'playbooks',
      name: 'Playbooks',
      count: 2,
      expanded: true,
      children: [
        { id: 'playbooks-recovery', name: 'Recovery', count: 1 },
        { id: 'playbooks-support', name: 'Support', count: 1 },
      ],
    },
  ]

  const wikiDocuments: TemplateWikiDocument[] = [
    {
      id: 'doc-1',
      name: 'Onboarding checklist.pdf',
      fileType: 'pdf',
      size: '2.1 MB',
      category: 'Operations',
      categoryId: 'operations',
      subCategory: 'Clients',
      subCategoryId: 'operations-clients',
      tags: ['clients', 'onboarding'],
      status: 'processed',
      uploadDate: formatTemplateRuntimeShortDate(addDays(now, -8)),
      description: 'Step-by-step guide to activate new clients in the local runtime.',
    },
    {
      id: 'doc-2',
      name: 'Order approval flow.md',
      fileType: 'md',
      size: '48 KB',
      category: 'Operations',
      categoryId: 'operations',
      subCategory: 'Orders',
      subCategoryId: 'operations-orders',
      tags: ['orders', 'approval'],
      status: 'processed',
      uploadDate: formatTemplateRuntimeShortDate(addDays(now, -4)),
      description: 'States and SLAs for pending, in-progress, and completed orders.',
    },
    {
      id: 'doc-3',
      name: 'Premium support guide.doc',
      fileType: 'doc',
      size: '310 KB',
      category: 'Playbooks',
      categoryId: 'playbooks',
      subCategory: 'Support',
      subCategoryId: 'playbooks-support',
      tags: ['support', 'vip'],
      status: 'pending',
      uploadDate: formatTemplateRuntimeShortDate(addDays(now, -1)),
      description: 'Operational script for strategic accounts.',
    },
  ]

  return {
    clients,
    orders,
    settings: {
      workspaceName: 'Atlas Flow',
      operatorName: 'Admin NetToolsKit',
      supportEmail: 'ops@atlasflow.local',
      locale: 'en-US',
      timezone: 'America/New_York',
      notificationsEnabled: true,
      compactTables: false,
      autoCreateFollowUp: true,
    },
    wiki: {
      categories: wikiCategories,
      documents: wikiDocuments,
      suggestions: [
        { id: 'sug-1', text: 'How do I reactivate an inactive client?', icon: 'help' },
        { id: 'sug-2', text: 'Which orders are pending today?', icon: 'pending_actions' },
        { id: 'sug-3', text: 'Where can I find the approval flow?', icon: 'menu_book' },
      ],
    },
  }
}

export function nextTemplateRuntimeClientId(snapshot: TemplateRuntimeDataSnapshot): string {
  return `client-${snapshot.clients.length + 1}`
}

export function nextTemplateRuntimeOrderId(snapshot: TemplateRuntimeDataSnapshot): string {
  return `order-${snapshot.orders.length + 1}`
}

export function nextTemplateRuntimeOrderNumber(snapshot: TemplateRuntimeDataSnapshot): string {
  const maxValue = snapshot.orders.reduce((current, order) => {
    const numeric = Number(order.number.replace(/\D+/g, ''))
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current
  }, 1050)

  return `ORD-${maxValue + 1}`
}
