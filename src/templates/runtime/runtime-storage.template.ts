import { createDefaultTemplateRuntimeData } from './runtime-factories.template'
import type {
  TemplateRuntimeClient,
  TemplateRuntimeDataSnapshot,
  TemplateRuntimeOrder,
} from './runtime-data.template'

export const TEMPLATE_RUNTIME_STORAGE_KEY = 'ntk_template_runtime_data_v1'

function getTemplateRuntimeStorage(): Storage | null {
  try {
    return localStorage
  } catch {
    return null
  }
}

export function normalizeTemplateRuntimeData(raw: unknown): TemplateRuntimeDataSnapshot {
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

export function loadTemplateRuntimeData(): TemplateRuntimeDataSnapshot {
  try {
    const storage = getTemplateRuntimeStorage()
    const raw = storage?.getItem(TEMPLATE_RUNTIME_STORAGE_KEY)
    return normalizeTemplateRuntimeData(raw ? JSON.parse(raw) : null)
  } catch {
    return createDefaultTemplateRuntimeData()
  }
}

export function persistTemplateRuntimeData(snapshot: TemplateRuntimeDataSnapshot): void {
  try {
    getTemplateRuntimeStorage()?.setItem(
      TEMPLATE_RUNTIME_STORAGE_KEY,
      JSON.stringify(snapshot)
    )
  } catch {
    // Ignore persistence failures to keep the runtime usable in restricted environments.
  }
}
