import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  TEMPLATE_WIKI_CHAT_STORAGE_KEY,
  templateWikiChatService,
} from '../../../src/templates/features/wiki/wiki-chat-service.template'
import { createTemplateWikiChatStore } from '../../../src/templates/features/wiki/wiki-chat-store.template'

const FIXED_NOW = new Date('2026-04-16T15:00:00.000Z')

function createRuntimeWikiAdapter() {
  return {
    ask: (question: string) => templateWikiChatService.ask({ question }),
    continueConversation: (conversationId: string, question: string) =>
      templateWikiChatService.continueConversation(conversationId, { question }),
    listConversations: () => templateWikiChatService.listConversations(),
    getConversation: (conversationId: string) =>
      templateWikiChatService.getConversation(conversationId),
    deleteConversation: (conversationId: string) =>
      templateWikiChatService.deleteConversation(conversationId),
    readPersistedState: () => templateWikiChatService.readPersistedState(),
    persistActiveConversation: (conversationId: string | null) =>
      templateWikiChatService.persistActiveConversation(conversationId),
  }
}

function readPersistedSnapshot() {
  return JSON.parse(localStorage.getItem(TEMPLATE_WIKI_CHAT_STORAGE_KEY) ?? 'null')
}

describe('template runtime wiki chat persistence', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)
    localStorage.clear()
    templateWikiChatService.resetPersistence()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('persists deterministic conversations, titles and message history in local storage', async () => {
    const firstReply = await templateWikiChatService.ask({
      question: 'Como configurar relatorios?',
    })

    vi.setSystemTime(new Date('2026-04-16T15:05:00.000Z'))

    const followUpReply = await templateWikiChatService.continueConversation(
      firstReply.conversationId,
      { question: 'Como exportar os dados?' }
    )

    const conversations = await templateWikiChatService.listConversations()
    const detail = await templateWikiChatService.getConversation(firstReply.conversationId)
    const hydrated = templateWikiChatService.readPersistedState()
    const persisted = readPersistedSnapshot()

    expect(firstReply.fromCache).toBe(false)
    expect(followUpReply.fromCache).toBe(true)
    expect(conversations).toEqual([
      {
        id: firstReply.conversationId,
        title: 'Como configurar relatorios',
        updatedAt: '2026-04-16T15:05:00.000Z',
        messageCount: 4,
      },
    ])
    expect(detail.messages.map(message => message.role)).toEqual([
      'user',
      'assistant',
      'user',
      'assistant',
    ])
    expect(detail.messages[1]?.content).toContain('Local summary saved for this conversation')
    expect(detail.messages[3]?.content).toContain('Local update for this conversation')
    expect(hydrated.activeConversationId).toBe(firstReply.conversationId)
    expect(hydrated.messages).toHaveLength(4)
    expect(persisted.selectedConversationId).toBe(firstReply.conversationId)
    expect(persisted.lastConversationNumber).toBe(1)
    expect(persisted.lastMessageNumber).toBe(4)
  })

  it('hydrates the store from persisted chat state and keeps selection across reload', async () => {
    const store = createTemplateWikiChatStore(createRuntimeWikiAdapter())

    await store.sendMessage('Quais pedidos precisam de atencao?')

    vi.setSystemTime(new Date('2026-04-16T15:03:00.000Z'))
    await store.sendMessage('What is the next step?')

    const activeConversationId = store.state.activeConversationId

    expect(store.state.conversations).toHaveLength(1)
    expect(store.state.messages).toHaveLength(4)
    expect(store.state.conversations[0]?.title).toBe('Quais pedidos precisam de atencao')

    const reloadedStore = createTemplateWikiChatStore(createRuntimeWikiAdapter())

    expect(reloadedStore.state.conversations).toHaveLength(1)
    expect(reloadedStore.state.activeConversationId).toBe(activeConversationId)
    expect(reloadedStore.state.messages).toHaveLength(4)
    expect(reloadedStore.sortedConversations.value[0]?.messageCount).toBe(4)

    reloadedStore.startNewConversation()

    const afterResetSelectionStore = createTemplateWikiChatStore(createRuntimeWikiAdapter())

    expect(afterResetSelectionStore.state.conversations).toHaveLength(1)
    expect(afterResetSelectionStore.state.activeConversationId).toBeNull()
    expect(afterResetSelectionStore.state.messages).toEqual([])
  })

  it('persists delete and manual conversation selection across reloads', async () => {
    const store = createTemplateWikiChatStore(createRuntimeWikiAdapter())

    await store.sendMessage('Primeira conversa local')
    const firstConversationId = store.state.activeConversationId

    store.startNewConversation()
    vi.setSystemTime(new Date('2026-04-16T15:04:00.000Z'))
    await store.sendMessage('Segunda conversa local')
    const secondConversationId = store.state.activeConversationId

    expect(store.sortedConversations.value.map(conversation => conversation.id)).toEqual([
      secondConversationId,
      firstConversationId,
    ])

    await store.deleteConversation(secondConversationId!)

    expect(store.state.activeConversationId).toBeNull()
    expect(store.state.messages).toEqual([])
    expect(store.state.conversations.map(conversation => conversation.id)).toEqual([
      firstConversationId,
    ])

    const reloadedStore = createTemplateWikiChatStore(createRuntimeWikiAdapter())

    expect(reloadedStore.state.conversations).toHaveLength(1)
    expect(reloadedStore.state.conversations[0]?.id).toBe(firstConversationId)
    expect(reloadedStore.state.activeConversationId).toBeNull()

    await reloadedStore.loadConversation(firstConversationId!)

    expect(templateWikiChatService.readPersistedState().activeConversationId).toBe(
      firstConversationId
    )
    expect(reloadedStore.state.messages).toHaveLength(2)
  })
})
