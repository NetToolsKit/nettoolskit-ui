/**
 * Wiki chat service scaffold.
 * Persists deterministic local-first conversations for the runtime templates.
 */

import type {
  TemplateWikiChatMessage,
  TemplateWikiConversation,
  TemplateWikiSourceReference,
} from './wiki-template.types'

export interface TemplateWikiChatRequest {
  question: string
}

export interface TemplateWikiChatResponse {
  conversationId: string
  answer: string
  sources: TemplateWikiSourceReference[]
  fromCache: boolean
}

export interface TemplateWikiConversationDetail {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: TemplateWikiChatMessage[]
}

export interface TemplateWikiChatHydratedState {
  conversations: TemplateWikiConversation[]
  activeConversationId: string | null
  messages: TemplateWikiChatMessage[]
}

interface TemplateWikiChatSnapshot {
  version: 1
  selectedConversationId: string | null
  lastConversationNumber: number
  lastMessageNumber: number
  conversations: TemplateWikiConversationDetail[]
}

const TEMPLATE_WIKI_CHAT_STORAGE_KEY = 'ntk_template_runtime_wiki_chat_v1'

const SOURCE_CATALOG: TemplateWikiSourceReference[] = [
  {
    documentName: 'Operational Manual.md',
    chunkContent: 'Local service flow for clients, orders, and workspace tasks.',
    relevance: 0.96,
  },
  {
    documentName: 'Settings Guide.md',
    chunkContent: 'Locally persisted preferences are reapplied when the runtime reloads.',
    relevance: 0.91,
  },
  {
    documentName: 'Commercial Playbook.md',
    chunkContent: 'Validate the current status, confirm the next step, and record the owner.',
    relevance: 0.89,
  },
  {
    documentName: 'Knowledge Base.md',
    chunkContent: 'Document the decision and share the relevant conversation context.',
    relevance: 0.87,
  },
]

function createEmptySnapshot(): TemplateWikiChatSnapshot {
  return {
    version: 1,
    selectedConversationId: null,
    lastConversationNumber: 0,
    lastMessageNumber: 0,
    conversations: [],
  }
}

function readStorageItem(): string | null {
  try {
    return globalThis.localStorage?.getItem(TEMPLATE_WIKI_CHAT_STORAGE_KEY) ?? null
  } catch {
    return null
  }
}

function writeStorageItem(snapshot: TemplateWikiChatSnapshot): void {
  try {
    globalThis.localStorage?.setItem(
      TEMPLATE_WIKI_CHAT_STORAGE_KEY,
      JSON.stringify(snapshot)
    )
  } catch {
    /* noop */
  }
}

function removeStorageItem(): void {
  try {
    globalThis.localStorage?.removeItem(TEMPLATE_WIKI_CHAT_STORAGE_KEY)
  } catch {
    /* noop */
  }
}

function normalizeText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : fallback
}

function toIsoString(value: unknown, fallback = new Date().toISOString()): string {
  if (typeof value !== 'string') {
    return fallback
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString()
}

function normalizeSources(value: unknown): TemplateWikiSourceReference[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const documentName = normalizeText((item as { documentName?: unknown }).documentName)
    const chunkContent = normalizeText((item as { chunkContent?: unknown }).chunkContent)
    const relevance = Number((item as { relevance?: unknown }).relevance)

    if (!documentName || !chunkContent || !Number.isFinite(relevance)) {
      return []
    }

    return [{
      documentName,
      chunkContent,
      relevance,
    }]
  })
}

function normalizeMessages(value: unknown, createdAtFallback: string): TemplateWikiChatMessage[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const rawRole = normalizeText((item as { role?: unknown }).role)
    const role = rawRole === 'assistant' || rawRole === 'system' || rawRole === 'user'
      ? rawRole
      : 'assistant'
    const content = normalizeText((item as { content?: unknown }).content)

    if (!content) {
      return []
    }

    const id = normalizeText((item as { id?: unknown }).id, `msg-hydrated-${index + 1}`)
    const createdAt = toIsoString(
      (item as { createdAt?: unknown }).createdAt,
      createdAtFallback
    )

    return [{
      id,
      role,
      content,
      createdAt,
      fromCache: Boolean((item as { fromCache?: unknown }).fromCache),
      sources: normalizeSources((item as { sources?: unknown }).sources),
    }]
  })
}

function normalizeConversation(value: unknown, index: number): TemplateWikiConversationDetail | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const createdAt = toIsoString(
    (value as { createdAt?: unknown }).createdAt,
    new Date().toISOString()
  )
  const id = normalizeText((value as { id?: unknown }).id, `conv-hydrated-${index + 1}`)
  const title = normalizeText((value as { title?: unknown }).title, 'New conversation')
  const messages = normalizeMessages((value as { messages?: unknown }).messages, createdAt)

  return {
    id,
    title,
    createdAt,
    updatedAt: toIsoString(
      (value as { updatedAt?: unknown }).updatedAt,
      messages[messages.length - 1]?.createdAt ?? createdAt
    ),
    messages,
  }
}

function deriveCounter(values: string[], prefix: string): number {
  return values.reduce((maxValue, value) => {
    const match = value.match(new RegExp(`^${prefix}-(\\d+)$`))
    const parsed = Number(match?.[1] ?? 0)
    return Number.isFinite(parsed) ? Math.max(maxValue, parsed) : maxValue
  }, 0)
}

function normalizeSnapshot(snapshotLike: unknown): TemplateWikiChatSnapshot {
  if (!snapshotLike || typeof snapshotLike !== 'object') {
    return createEmptySnapshot()
  }

  const conversationsInput = Array.isArray(
    (snapshotLike as { conversations?: unknown }).conversations
  )
    ? (snapshotLike as { conversations: unknown[] }).conversations
    : []

  const conversations = conversationsInput.flatMap((conversation, index) => {
    const normalized = normalizeConversation(conversation, index)
    return normalized ? [normalized] : []
  })

  const conversationIds = conversations.map(conversation => conversation.id)
  const messageIds = conversations.flatMap(conversation =>
    conversation.messages.map(message => message.id)
  )

  const selectedConversationId = normalizeText(
    (snapshotLike as { selectedConversationId?: unknown }).selectedConversationId,
    ''
  )

  const rawLastConversationNumber = Number(
    (snapshotLike as { lastConversationNumber?: unknown }).lastConversationNumber
  )
  const rawLastMessageNumber = Number(
    (snapshotLike as { lastMessageNumber?: unknown }).lastMessageNumber
  )

  return {
    version: 1,
    selectedConversationId: conversationIds.includes(selectedConversationId)
      ? selectedConversationId
      : null,
    lastConversationNumber: Math.max(
      Number.isFinite(rawLastConversationNumber) ? rawLastConversationNumber : 0,
      deriveCounter(conversationIds, 'conv')
    ),
    lastMessageNumber: Math.max(
      Number.isFinite(rawLastMessageNumber) ? rawLastMessageNumber : 0,
      deriveCounter(messageIds, 'msg')
    ),
    conversations,
  }
}

function readSnapshot(): TemplateWikiChatSnapshot {
  const raw = readStorageItem()

  if (!raw) {
    return createEmptySnapshot()
  }

  try {
    return normalizeSnapshot(JSON.parse(raw))
  } catch {
    return createEmptySnapshot()
  }
}

function writeSnapshot(snapshot: TemplateWikiChatSnapshot): TemplateWikiChatSnapshot {
  const normalized = normalizeSnapshot(snapshot)
  writeStorageItem(normalized)
  return normalized
}

function nextConversationId(snapshot: TemplateWikiChatSnapshot): string {
  snapshot.lastConversationNumber += 1
  return `conv-${snapshot.lastConversationNumber}`
}

function nextMessageId(snapshot: TemplateWikiChatSnapshot): string {
  snapshot.lastMessageNumber += 1
  return `msg-${snapshot.lastMessageNumber}`
}

function summarizeConversation(
  conversation: TemplateWikiConversationDetail
): TemplateWikiConversation {
  return {
    id: conversation.id,
    title: conversation.title,
    updatedAt: conversation.updatedAt,
    messageCount: conversation.messages.length,
  }
}

function buildConversationTitle(question: string): string {
  const cleaned = normalizeText(question).replace(/[!?.,;:]+$/g, '')
  if (!cleaned) {
    return 'New conversation'
  }

  const title = cleaned.length > 56
    ? `${cleaned.slice(0, 53).trimEnd()}...`
    : cleaned

  return title.charAt(0).toUpperCase() + title.slice(1)
}

function selectSources(question: string): TemplateWikiSourceReference[] {
  const hash = Array.from(question).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const firstIndex = hash % SOURCE_CATALOG.length
  const secondIndex = (firstIndex + 1) % SOURCE_CATALOG.length

  return [SOURCE_CATALOG[firstIndex]!, SOURCE_CATALOG[secondIndex]!].map((source, index) => ({
    ...source,
    relevance: Number((source.relevance - index * 0.03).toFixed(2)),
  }))
}

function buildAnswer(question: string, turnNumber: number, sources: TemplateWikiSourceReference[]): string {
  const normalizedQuestion = normalizeText(question)
  const subject = normalizedQuestion.endsWith('?')
    ? normalizedQuestion.slice(0, -1)
    : normalizedQuestion

  const prefix = turnNumber <= 1
    ? 'Local summary saved for this conversation'
    : 'Local update for this conversation'

  return `${prefix}: ${subject}. Review ${sources[0]?.documentName ?? 'the knowledge base'} and confirm the next step before completing the action.`
}

function createUserMessage(
  snapshot: TemplateWikiChatSnapshot,
  question: string,
  createdAt: string
): TemplateWikiChatMessage {
  return {
    id: nextMessageId(snapshot),
    role: 'user',
    content: normalizeText(question),
    createdAt,
  }
}

function createAssistantMessage(
  snapshot: TemplateWikiChatSnapshot,
  answer: string,
  sources: TemplateWikiSourceReference[],
  createdAt: string,
  fromCache: boolean
): TemplateWikiChatMessage {
  return {
    id: nextMessageId(snapshot),
    role: 'assistant',
    content: answer,
    sources,
    fromCache,
    createdAt,
  }
}

function sortConversationsByUpdatedAt(
  conversations: TemplateWikiConversationDetail[]
): TemplateWikiConversationDetail[] {
  return [...conversations].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  )
}

function buildHydratedState(snapshot: TemplateWikiChatSnapshot): TemplateWikiChatHydratedState {
  const selectedConversation = snapshot.conversations.find(
    conversation => conversation.id === snapshot.selectedConversationId
  )

  return {
    conversations: sortConversationsByUpdatedAt(snapshot.conversations).map(summarizeConversation),
    activeConversationId: selectedConversation?.id ?? null,
    messages: selectedConversation?.messages ?? [],
  }
}

export const templateWikiChatService = {
  async ask(request: TemplateWikiChatRequest): Promise<TemplateWikiChatResponse> {
    const snapshot = readSnapshot()
    const createdAt = new Date().toISOString()
    const conversationId = nextConversationId(snapshot)
    const sources = selectSources(request.question)
    const answer = buildAnswer(request.question, 1, sources)

    const conversation: TemplateWikiConversationDetail = {
      id: conversationId,
      title: buildConversationTitle(request.question),
      createdAt,
      updatedAt: createdAt,
      messages: [],
    }

    conversation.messages.push(
      createUserMessage(snapshot, request.question, createdAt),
      createAssistantMessage(snapshot, answer, sources, createdAt, false)
    )

    snapshot.selectedConversationId = conversationId
    snapshot.conversations = sortConversationsByUpdatedAt([
      conversation,
      ...snapshot.conversations,
    ])
    writeSnapshot(snapshot)

    return {
      conversationId,
      answer,
      sources,
      fromCache: false,
    }
  },

  async continueConversation(
    conversationId: string,
    request: TemplateWikiChatRequest
  ): Promise<TemplateWikiChatResponse> {
    const snapshot = readSnapshot()
    const conversation = snapshot.conversations.find(item => item.id === conversationId)

    if (!conversation) {
      return this.ask(request)
    }

    const createdAt = new Date().toISOString()
    const sources = selectSources(request.question)
    const turnNumber = conversation.messages.filter(message => message.role === 'user').length + 1
    const answer = buildAnswer(request.question, turnNumber, sources)

    conversation.messages.push(
      createUserMessage(snapshot, request.question, createdAt),
      createAssistantMessage(snapshot, answer, sources, createdAt, true)
    )
    conversation.updatedAt = createdAt
    snapshot.selectedConversationId = conversation.id
    snapshot.conversations = sortConversationsByUpdatedAt(snapshot.conversations)
    writeSnapshot(snapshot)

    return {
      conversationId: conversation.id,
      answer,
      sources,
      fromCache: true,
    }
  },

  async listConversations(): Promise<TemplateWikiConversation[]> {
    return buildHydratedState(readSnapshot()).conversations
  },

  async getConversation(conversationId: string): Promise<TemplateWikiConversationDetail> {
    const snapshot = readSnapshot()
    const conversation = snapshot.conversations.find(item => item.id === conversationId)

    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`)
    }

    return conversation
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const snapshot = readSnapshot()
    snapshot.conversations = snapshot.conversations.filter(
      conversation => conversation.id !== conversationId
    )
    if (snapshot.selectedConversationId === conversationId) {
      snapshot.selectedConversationId = null
    }
    writeSnapshot(snapshot)
  },

  readPersistedState(): TemplateWikiChatHydratedState {
    return buildHydratedState(readSnapshot())
  },

  persistActiveConversation(conversationId: string | null): void {
    const snapshot = readSnapshot()
    snapshot.selectedConversationId = snapshot.conversations.some(
      conversation => conversation.id === conversationId
    )
      ? conversationId
      : null
    writeSnapshot(snapshot)
  },

  resetPersistence(): void {
    removeStorageItem()
  },
}

export { TEMPLATE_WIKI_CHAT_STORAGE_KEY }
