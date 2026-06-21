import { expect, test, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const WIKI_CHAT_STORAGE_KEY = 'ntk_template_runtime_wiki_chat_v1'

interface ChatSourceSeed {
  documentName: string
  chunkContent: string
  relevance: number
}

interface ChatMessageSeed {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  fromCache?: boolean
  sources?: ChatSourceSeed[]
}

interface ChatConversationSeed {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessageSeed[]
}

interface ChatSnapshotSeed {
  version: 1
  selectedConversationId: string | null
  lastConversationNumber: number
  lastMessageNumber: number
  conversations: ChatConversationSeed[]
}

const SEEDED_SOURCES: ChatSourceSeed[] = [
  {
    documentName: 'Operational Manual.md',
    chunkContent: 'Local support flow for customers, orders, and workspace tasks.',
    relevance: 0.96,
  },
  {
    documentName: 'Guia de Configuracoes.md',
    chunkContent: 'Preferencias persistidas localmente sao reaplicadas ao recarregar o runtime.',
    relevance: 0.91,
  },
]

function buildConversationTitle(question: string): string {
  const cleaned = question.trim().replace(/\s+/g, ' ').replace(/[!?.,;:]+$/g, '')
  if (!cleaned) {
    return 'Nova conversa'
  }

  const title = cleaned.length > 56
    ? `${cleaned.slice(0, 53).trimEnd()}...`
    : cleaned

  return title.charAt(0).toUpperCase() + title.slice(1)
}

function createSeededChatSnapshot(): ChatSnapshotSeed {
  return {
    version: 1,
    selectedConversationId: 'conv-1',
    lastConversationNumber: 1,
    lastMessageNumber: 2,
    conversations: [
      {
        id: 'conv-1',
        title: 'Checklist seed',
        createdAt: '2026-04-16T12:00:00.000Z',
        updatedAt: '2026-04-16T12:00:00.000Z',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Checklist seed?',
            createdAt: '2026-04-16T12:00:00.000Z',
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Local summary saved for this conversation: Checklist seed. Review Operational Manual.md and confirm the next step before completing the action.',
            createdAt: '2026-04-16T12:00:00.000Z',
            fromCache: false,
            sources: SEEDED_SOURCES,
          },
        ],
      },
    ],
  }
}

async function resetRuntimeState(
  page: Page,
  chatSnapshot?: ChatSnapshotSeed
): Promise<void> {
  await page.goto('/')
  await page.evaluate(({ storageKey, snapshot }) => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    if (snapshot) {
      window.localStorage.setItem(storageKey, JSON.stringify(snapshot))
    }
  }, { storageKey: WIKI_CHAT_STORAGE_KEY, snapshot: chatSnapshot ?? null })
}

async function loginToRuntime(page: Page): Promise<void> {
  await page.goto(RUNTIME_LOGIN_URL)
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  await page.locator('input[aria-label="Email input"]').fill('ops@nettoolskit.dev')
  await page.locator('input[aria-label="Password input"]').fill('demo-password')
  await page.getByRole('button', { name: 'Submit login form' }).click()

  await expect(page).toHaveURL(/template-runtime=1#\/?$/)
  await expect(page.locator('.ntk-template-dashboard__title')).toBeVisible()
}

async function readChatSnapshot(page: Page): Promise<ChatSnapshotSeed | null> {
  return await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : null
  }, WIKI_CHAT_STORAGE_KEY)
}

test.describe('template runtime wiki chat', () => {
  test('opens the runtime drawer, sends a question and opens fullscreen chat when available', async ({ page }) => {
    await resetRuntimeState(page)
    await loginToRuntime(page)

    const question = 'How does the local flow work?'
    const expectedTitle = buildConversationTitle(question)
    const assistantAnswer = 'Local summary saved for this conversation: How does the local flow work. Review'

    await page.getByLabel('Open assistant').click()

    const drawer = page.getByRole('dialog', { name: 'Assistant drawer' })
    await expect(drawer).toBeVisible()

    await drawer.locator('textarea').fill(question)
    await drawer.getByRole('button', { name: 'Send question' }).click()

    await expect(drawer.locator('.ntk-template-wiki-chat-drawer__message')).toHaveCount(2)
    await expect(drawer).toContainText(question)
    await expect(drawer).toContainText(assistantAnswer)
    await expect(drawer.getByRole('button', { name: 'Start new conversation' })).toBeVisible()

    const persistedAfterSend = await readChatSnapshot(page)
    expect(persistedAfterSend?.conversations).toHaveLength(1)
    expect(persistedAfterSend?.conversations[0]?.title).toBe(expectedTitle)
    expect(persistedAfterSend?.selectedConversationId).toBe(
      persistedAfterSend?.conversations[0]?.id ?? null
    )

    const fullscreenButton = drawer.getByRole('button', { name: 'Open full screen' })
    if (await fullscreenButton.isVisible()) {
      await fullscreenButton.click()
      await expect(page).toHaveURL(/template-runtime=1#\/knowledge\/chat$/)
      await expect(page.locator('.ntk-template-wiki-chat__chat-subtitle')).toContainText(
        'Chat with the local base'
      )
      await expect(page.locator('.ntk-template-wiki-chat__chat-title')).toHaveText(expectedTitle)
      await expect(
        page.locator('.ntk-template-wiki-chat__conversation', { hasText: expectedTitle })
      ).toBeVisible()
      await expect(page.locator('.ntk-template-wiki-chat__message')).toHaveCount(2)
      await expect(page.locator('.ntk-template-wiki-chat__message-body')).toContainText([
        question,
        assistantAnswer,
      ])
    }
  })

  test('creates a new conversation, deletes a seeded one and keeps the runtime chat persisted after reload', async ({ page }) => {
    await resetRuntimeState(page, createSeededChatSnapshot())
    await loginToRuntime(page)
    await page.goto(`${RUNTIME_BASE}#/knowledge/chat`)

    const seededTitle = 'Checklist seed'
    const newQuestion = 'What is the next step for the local order?'
    const expectedNewTitle = buildConversationTitle(newQuestion)

    await expect(page.locator('.ntk-template-wiki-chat__chat-subtitle')).toContainText(
      'Chat with the local base'
    )
    await expect(page.locator('.ntk-template-wiki-chat__chat-title')).toHaveText(seededTitle)
    await expect(
      page.locator('.ntk-template-wiki-chat__conversation', { hasText: seededTitle })
    ).toBeVisible()
    await expect(page.locator('.ntk-template-wiki-chat__message')).toHaveCount(2)

    await page.getByRole('button', { name: 'Start new conversation' }).click()
    await expect(page.locator('.ntk-template-wiki-chat__message')).toHaveCount(0)

    await page.locator('.ntk-template-wiki-chat__input').fill(newQuestion)
    await page.getByRole('button', { name: 'Send question' }).click()

    await expect(page.locator('.ntk-template-wiki-chat__message')).toHaveCount(2)
    await expect(
      page.locator('.ntk-template-wiki-chat__conversation', { hasText: expectedNewTitle })
    ).toBeVisible()
    await expect(page.locator('.ntk-template-wiki-chat__message-body')).toContainText([
      newQuestion,
      'Local summary saved for this conversation: What is the next step for the local order. Review',
    ])

    const seededConversation = page.locator('.ntk-template-wiki-chat__conversation', {
      hasText: seededTitle,
    })
    await seededConversation.getByRole('button', { name: 'Delete conversation' }).click()
    await expect(
      page.locator('.ntk-template-wiki-chat__conversation', { hasText: seededTitle })
    ).toHaveCount(0)

    await page.reload()
    await expect(page.locator('.ntk-template-wiki-chat__chat-subtitle')).toContainText(
      'Chat with the local base'
    )
    await expect(page.locator('.ntk-template-wiki-chat__chat-title')).toHaveText(expectedNewTitle)
    await expect(
      page.locator('.ntk-template-wiki-chat__conversation', { hasText: expectedNewTitle })
    ).toBeVisible()
    await expect(
      page.locator('.ntk-template-wiki-chat__conversation', { hasText: seededTitle })
    ).toHaveCount(0)
    await expect(page.locator('.ntk-template-wiki-chat__message')).toHaveCount(2)

    const persistedAfterReload = await readChatSnapshot(page)
    expect(persistedAfterReload?.conversations).toHaveLength(1)
    expect(persistedAfterReload?.conversations[0]?.title).toBe(expectedNewTitle)
    expect(persistedAfterReload?.selectedConversationId).toBe(
      persistedAfterReload?.conversations[0]?.id ?? null
    )
  })
})
