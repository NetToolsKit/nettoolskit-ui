/**
 * Wiki chat store scaffold.
 * Provides a reactive chat state manager for template/demo integration.
 * Mirrors the reference `chatStore.ts` pattern with framework-agnostic API.
 */

import { computed, reactive, type DeepReadonly } from 'vue'

import type {
  TemplateWikiChatMessage,
  TemplateWikiConversation,
} from './wiki-template.types'
import type {
  TemplateWikiChatHydratedState,
  TemplateWikiChatResponse,
  TemplateWikiConversationDetail,
} from './wiki-chat-service.template'

export interface TemplateWikiChatState {
  conversations: TemplateWikiConversation[]
  activeConversationId: string | null
  messages: TemplateWikiChatMessage[]
  loading: boolean
  sending: boolean
  drawerOpen: boolean
  contextHint: string | null
}

export interface TemplateWikiChatServiceAdapter {
  ask: (question: string) => Promise<TemplateWikiChatResponse>
  continueConversation: (conversationId: string, question: string) => Promise<TemplateWikiChatResponse>
  listConversations: () => Promise<TemplateWikiConversation[]>
  getConversation: (conversationId: string) => Promise<TemplateWikiConversationDetail>
  deleteConversation: (conversationId: string) => Promise<void>
  readPersistedState?: () => TemplateWikiChatHydratedState | null
  persistActiveConversation?: (conversationId: string | null) => void
}

export interface TemplateWikiChatStore {
  state: DeepReadonly<TemplateWikiChatState>
  hasActiveConversation: Readonly<{ value: boolean }>
  sortedConversations: Readonly<{ value: TemplateWikiConversation[] }>
  openDrawer: (contextHint?: string) => void
  closeDrawer: () => void
  toggleDrawer: () => void
  loadConversations: () => Promise<void>
  loadConversation: (conversationId: string) => Promise<void>
  sendMessage: (question: string) => Promise<TemplateWikiChatResponse>
  deleteConversation: (conversationId: string) => Promise<void>
  startNewConversation: () => void
  resetState: () => void
}

export function createTemplateWikiChatStore(
  service: TemplateWikiChatServiceAdapter
): TemplateWikiChatStore {
  const hydratedState = service.readPersistedState?.()

  const state = reactive<TemplateWikiChatState>({
    conversations: hydratedState?.conversations ?? [],
    activeConversationId: hydratedState?.activeConversationId ?? null,
    messages: hydratedState?.messages ?? [],
    loading: false,
    sending: false,
    drawerOpen: false,
    contextHint: null,
  })

  const hasActiveConversation = computed(() => !!state.activeConversationId)
  const sortedConversations = computed(() =>
    [...state.conversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  )

  function openDrawer(contextHint?: string): void {
    state.drawerOpen = true
    state.contextHint = contextHint ?? null
  }

  function closeDrawer(): void {
    state.drawerOpen = false
    state.contextHint = null
  }

  function toggleDrawer(): void {
    state.drawerOpen = !state.drawerOpen
    if (!state.drawerOpen) {
      state.contextHint = null
    }
  }

  async function loadConversations(): Promise<void> {
    state.loading = true
    try {
      state.conversations = await service.listConversations()
      if (
        state.activeConversationId &&
        !state.conversations.some(conversation => conversation.id === state.activeConversationId)
      ) {
        state.activeConversationId = null
        state.messages = []
        service.persistActiveConversation?.(null)
      }
    } finally {
      state.loading = false
    }
  }

  async function loadConversation(conversationId: string): Promise<void> {
    state.loading = true
    try {
      const detail = await service.getConversation(conversationId)
      state.activeConversationId = detail.id
      state.messages = detail.messages
      service.persistActiveConversation?.(detail.id)
    } finally {
      state.loading = false
    }
  }

  async function sendMessage(question: string): Promise<TemplateWikiChatResponse> {
    state.sending = true
    const previousMessages = [...state.messages]
    const previousActiveConversationId = state.activeConversationId

    const userMsg: TemplateWikiChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    }
    state.messages.push(userMsg)

    try {
      let response: TemplateWikiChatResponse

      if (state.activeConversationId) {
        response = await service.continueConversation(
          state.activeConversationId,
          question
        )
      } else {
        response = await service.ask(question)
        state.activeConversationId = response.conversationId
      }

      await loadConversation(response.conversationId)
      await loadConversations()

      return response
    } catch (err) {
      state.activeConversationId = previousActiveConversationId
      state.messages = previousMessages
      service.persistActiveConversation?.(previousActiveConversationId)
      throw err
    } finally {
      state.sending = false
    }
  }

  async function deleteConversationById(conversationId: string): Promise<void> {
    await service.deleteConversation(conversationId)
    state.conversations = await service.listConversations()
    if (state.activeConversationId === conversationId) {
      state.activeConversationId = null
      state.messages = []
      service.persistActiveConversation?.(null)
    }
  }

  function startNewConversation(): void {
    state.activeConversationId = null
    state.messages = []
    service.persistActiveConversation?.(null)
  }

  function resetState(): void {
    state.conversations = []
    state.activeConversationId = null
    state.messages = []
    state.loading = false
    state.sending = false
    state.drawerOpen = false
    state.contextHint = null
  }

  return {
    state: reactive(state) as unknown as DeepReadonly<TemplateWikiChatState>,
    hasActiveConversation,
    sortedConversations,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    loadConversations,
    loadConversation,
    sendMessage,
    deleteConversation: deleteConversationById,
    startNewConversation,
    resetState,
  }
}
