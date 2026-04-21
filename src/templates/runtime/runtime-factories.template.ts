import type {
  TemplateWikiCategoryNode,
  TemplateWikiDocument,
  TemplateWikiSuggestion,
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
  return new Date(value).toLocaleDateString('pt-BR', {
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
      uploadDate: formatTemplateRuntimeShortDate(addDays(now, -8)),
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
      uploadDate: formatTemplateRuntimeShortDate(addDays(now, -4)),
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
      uploadDate: formatTemplateRuntimeShortDate(addDays(now, -1)),
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

  return `PED-${maxValue + 1}`
}
