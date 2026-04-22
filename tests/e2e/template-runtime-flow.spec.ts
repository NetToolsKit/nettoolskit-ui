import { expect, test, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const RUNTIME_STORAGE_KEY = 'ntk_template_runtime_data_v1'
const WIKI_CHAT_STORAGE_KEY = 'ntk_template_runtime_wiki_chat_v1'
const LAYOUT_STORAGE_PREFIX = 'ntk-template-runtime-layout'

interface RuntimeFlowSeedSnapshot {
  clients: Array<{
    id: string
    name: string
    owner: string
    segment: string
    city: string
    status: 'active' | 'onboarding' | 'inactive'
    monthlyRevenue: number
    lastOrderAt: string
    tags: string[]
  }>
  orders: Array<{
    id: string
    number: string
    clientId: string
    clientName: string
    category: string
    total: number
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    createdAt: string
    updatedAt: string
  }>
  settings: {
    workspaceName: string
    operatorName: string
    supportEmail: string
    locale: string
    timezone: string
    notificationsEnabled: boolean
    compactTables: boolean
    autoCreateFollowUp: boolean
  }
  wiki: {
    categories: Array<{
      id: string
      name: string
      count: number
      expanded: boolean
      children?: Array<{ id: string; name: string; count: number }>
    }>
    documents: Array<{
      id: string
      name: string
      fileType: string
      size: string
      category: string
      categoryId: string
      subCategory?: string
      subCategoryId?: string
      tags?: string[]
      status: 'processed' | 'pending' | 'failed'
      uploadDate: string
      description?: string
    }>
    suggestions: Array<{
      id: string
      text: string
      icon?: string
    }>
  }
}

interface ChatSnapshotSeed {
  version: 1
  selectedConversationId: string | null
  lastConversationNumber: number
  lastMessageNumber: number
  conversations: Array<{
    id: string
    title: string
    createdAt: string
    updatedAt: string
    messages: Array<{
      id: string
      role: 'user' | 'assistant'
      content: string
      createdAt: string
      fromCache?: boolean
      sources?: Array<{
        documentName: string
        chunkContent: string
        relevance: number
      }>
    }>
  }>
}

function createRuntimeSeed(): RuntimeFlowSeedSnapshot {
  return {
    clients: [
      {
        id: 'client-flow-1',
        name: 'Atlas Client',
        owner: 'Ana Lima',
        segment: 'Distribution',
        city: 'Recife',
        status: 'active',
        monthlyRevenue: 18000,
        lastOrderAt: '2026-04-10T09:00:00.000Z',
        tags: ['northeast', 'vip'],
      },
      {
        id: 'client-flow-2',
        name: 'Boreal Client',
        owner: 'Bruno Serra',
        segment: 'Industry',
        city: 'Curitiba',
        status: 'onboarding',
        monthlyRevenue: 9400,
        lastOrderAt: '2026-04-08T15:30:00.000Z',
        tags: ['new'],
      },
    ],
    orders: [
      {
        id: 'order-flow-1',
        number: 'ORD-3001',
        clientId: 'client-flow-1',
        clientName: 'Atlas Client',
        category: 'Electronics',
        total: 7200,
        status: 'pending',
        createdAt: '2026-04-10T09:00:00.000Z',
        updatedAt: '2026-04-10T09:00:00.000Z',
      },
      {
        id: 'order-flow-2',
        number: 'ORD-3002',
        clientId: 'client-flow-2',
        clientName: 'Boreal Client',
        category: 'Industry',
        total: 5400,
        status: 'in_progress',
        createdAt: '2026-04-09T12:00:00.000Z',
        updatedAt: '2026-04-10T11:00:00.000Z',
      },
    ],
    settings: {
      workspaceName: 'Atlas Runtime',
      operatorName: 'Runtime Operator',
      supportEmail: 'runtime@atlas.local',
      locale: 'en-US',
      timezone: 'America/Sao_Paulo',
      notificationsEnabled: true,
      compactTables: true,
      autoCreateFollowUp: false,
    },
    wiki: {
      categories: [
        {
          id: 'operations',
          name: 'Operations',
          count: 1,
          expanded: true,
          children: [
            { id: 'operations-orders', name: 'Orders', count: 1 },
          ],
        },
      ],
      documents: [
        {
          id: 'doc-flow-1',
          name: 'Integrated flow.md',
          fileType: 'md',
          size: '12 KB',
          category: 'Operations',
          categoryId: 'operations',
          subCategory: 'Orders',
          subCategoryId: 'operations-orders',
          tags: ['runtime'],
          status: 'processed',
          uploadDate: '10/04',
          description: 'Seed document used to validate the integrated runtime journey.',
        },
      ],
      suggestions: [
        { id: 'sug-flow-1', text: 'Which orders are still open?', icon: 'help' },
      ],
    },
  }
}

function buildConversationTitle(question: string): string {
  const cleaned = question.trim().replace(/\s+/g, ' ').replace(/[!?.,;:]+$/g, '')
  if (!cleaned) {
    return 'New conversation'
  }

  const title = cleaned.length > 56
    ? `${cleaned.slice(0, 53).trimEnd()}...`
    : cleaned

  return title.charAt(0).toUpperCase() + title.slice(1)
}

async function resetAndSeedRuntimeState(page: Page): Promise<void> {
  await page.goto('/')
  await page.evaluate(({ runtimeStorageKey, seed }) => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem(runtimeStorageKey, JSON.stringify(seed))
  }, { runtimeStorageKey: RUNTIME_STORAGE_KEY, seed: createRuntimeSeed() })
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

async function selectTheme(page: Page, label: string, id: string): Promise<void> {
  await page.locator(`.ntk-template-theme-dots__dot[title="${label}"]`).click()

  await expect.poll(async () => {
    return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
  }).toBe(id)

  await expect.poll(async () => {
    return await page.evaluate(() => window.localStorage.getItem('ntk-theme') ?? '')
  }).toBe(id)
}

async function openUserMenu(page: Page): Promise<void> {
  await page.locator('button').filter({ has: page.locator('.ntk-template-user-menu__avatar') }).first().click()
  await expect(page.locator('.ntk-template-user-menu')).toBeVisible()
}

async function readRuntimeSnapshot(page: Page): Promise<RuntimeFlowSeedSnapshot> {
  return await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey)
    return JSON.parse(raw ?? '{}')
  }, RUNTIME_STORAGE_KEY)
}

async function readChatSnapshot(page: Page): Promise<ChatSnapshotSeed | null> {
  return await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : null
  }, WIKI_CHAT_STORAGE_KEY)
}

test.describe('template runtime end-to-end flow', () => {
  test.beforeEach(async ({ page }) => {
    await resetAndSeedRuntimeState(page)
  })

  test('keeps a local-first operator journey consistent across routes, theme, layout and reloads', async ({ page }) => {
    await loginToRuntime(page)
    await selectTheme(page, 'Claude', 'claude')

    await page.goto(`${RUNTIME_BASE}#/clients`)
    const clientsTable = page.locator('.ntk-data-table[aria-label="Clients table"]')
    await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible()
    await expect(clientsTable).toContainText('Atlas Client')

    await page.getByRole('button', { name: 'New client' }).click()
    await expect(clientsTable).toContainText('New Client 3')

    const borealRow = clientsTable.locator('tbody tr', { hasText: 'Boreal Client' })
    await borealRow.getByRole('button', { name: 'Update client status' }).click()
    await expect(borealRow).toContainText('Active')

    await page.goto(`${RUNTIME_BASE}#/orders`)
    const ordersTable = page.locator('.ntk-data-table[aria-label="Orders table"]')
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
    await ordersTable.locator('tbody tr', { hasText: 'ORD-3001' }).getByRole('checkbox').click()
    await expect(page.locator('.ntk-template-crud-list__bulk-label')).toHaveText('1 selected orders')
    await page.getByRole('button', { name: 'Complete', exact: true }).click()
    await expect(ordersTable.locator('tbody tr', { hasText: 'ORD-3001' })).toContainText('Completed')

    await page.goto(`${RUNTIME_BASE}#/settings`)
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await page.getByLabel('Workspace name').fill('Atlas Prime Runtime')
    await page.getByLabel('Operator name').fill('Marina Campos')
    await page.locator('input[name="runtime-compact-tables"]').uncheck()
    await page.getByRole('button', { name: 'Save changes' }).click()

    await page.goto(`${RUNTIME_BASE}#/clients`)
    await expect(page.locator('[aria-label="Client cards"]')).toBeVisible()
    await expect(page.locator('.ntk-data-table[aria-label="Clients table"]')).toHaveCount(0)

    await openUserMenu(page)
    await page.locator('.q-item', { hasText: 'Horizontal menu' }).first().locator('.q-toggle').click()
    await expect(page.locator('.ntk-template-main-layout__horizontal-nav')).toBeVisible()
    await expect(page.locator('.ntk-template-main-layout__drawer')).toHaveCount(0)

    const question = 'How should we continue the integrated local order?'
    const expectedTitle = buildConversationTitle(question)
    await page.getByLabel('Open assistant').click()
    const drawer = page.getByRole('dialog', { name: 'Assistant drawer' })
    await expect(drawer).toBeVisible()
    await drawer.locator('textarea').fill(question)
    await drawer.getByRole('button', { name: 'Send question' }).click()
    await expect(drawer.locator('.ntk-template-wiki-chat-drawer__message')).toHaveCount(2)

    const fullscreenButton = drawer.getByRole('button', { name: 'Open full screen' })
    if (await fullscreenButton.isVisible()) {
      await fullscreenButton.click()
    } else {
      await page.goto(`${RUNTIME_BASE}#/knowledge/chat`)
    }

    await expect(page).toHaveURL(/template-runtime=1#\/knowledge\/chat$/)
    await expect(page.locator('.ntk-template-wiki-chat__chat-title')).toHaveText(expectedTitle)

    await page.reload()
    await expect(page.locator('.ntk-template-main-layout__horizontal-nav')).toBeVisible()
    await expect(page.locator('.ntk-template-wiki-chat__chat-title')).toHaveText(expectedTitle)
    await expect.poll(async () => {
      return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    }).toBe('claude')
    await expect.poll(async () => {
      return await page.evaluate((prefix) => window.localStorage.getItem(`${prefix}:horizontal-mode`), LAYOUT_STORAGE_PREFIX)
    }).toBe('true')

    await page.goto(`${RUNTIME_BASE}#/profile`)
    await expect(page.getByRole('heading', { name: 'Marina Campos' })).toBeVisible()

    const runtimeSnapshot = await readRuntimeSnapshot(page)
    expect(runtimeSnapshot.clients.find(client => client.name === 'Boreal Client')?.status).toBe('active')
    expect(runtimeSnapshot.clients.some(client => client.name === 'New Client 3')).toBeTruthy()
    expect(runtimeSnapshot.orders.find(order => order.number === 'ORD-3001')?.status).toBe('completed')
    expect(runtimeSnapshot.settings).toMatchObject({
      workspaceName: 'Atlas Prime Runtime',
      operatorName: 'Marina Campos',
      compactTables: false,
    })

    const chatSnapshot = await readChatSnapshot(page)
    expect(chatSnapshot?.conversations[0]?.title).toBe(expectedTitle)
  })
})
