import { expect, test, type Locator, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const RUNTIME_STORAGE_KEY = 'ntk_template_runtime_data_v1'
const WIKI_CHAT_STORAGE_KEY = 'ntk_template_runtime_wiki_chat_v1'

const PRESET_MATRIX = [
  { id: 'revolut', label: 'Revolut', dark: false },
  { id: 'claude', label: 'Claude', dark: false },
  { id: 'warp', label: 'Warp', dark: true },
  { id: 'resend', label: 'Resend', dark: true },
] as const

type PresetMatrixEntry = typeof PRESET_MATRIX[number]

interface RuntimeScreenshotSeedSnapshot {
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

function createRuntimeSeed(): RuntimeScreenshotSeedSnapshot {
  return {
    clients: [
      {
        id: 'client-shot-1',
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
        id: 'client-shot-2',
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
        id: 'order-shot-1',
        number: 'ORD-4001',
        clientId: 'client-shot-1',
        clientName: 'Atlas Client',
        category: 'Electronics',
        total: 7200,
        status: 'pending',
        createdAt: '2026-04-10T09:00:00.000Z',
        updatedAt: '2026-04-10T09:00:00.000Z',
      },
      {
        id: 'order-shot-2',
        number: 'ORD-4002',
        clientId: 'client-shot-2',
        clientName: 'Boreal Client',
        category: 'Industry',
        total: 5400,
        status: 'in_progress',
        createdAt: '2026-04-09T12:00:00.000Z',
        updatedAt: '2026-04-10T11:00:00.000Z',
      },
    ],
    settings: {
      workspaceName: 'Atlas Screenshot',
      operatorName: 'Admin NetToolsKit',
      supportEmail: 'screenshots@atlas.local',
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
          id: 'doc-shot-1',
          name: 'Operational Manual.md',
          fileType: 'md',
          size: '12 KB',
          category: 'Operations',
          categoryId: 'operations',
          subCategory: 'Orders',
          subCategoryId: 'operations-orders',
          tags: ['runtime'],
          status: 'processed',
          uploadDate: '10/04',
          description: 'Seed document used to validate runtime screenshots.',
        },
      ],
      suggestions: [
        { id: 'sug-shot-1', text: 'Which orders are still open?', icon: 'help' },
      ],
    },
  }
}

function createSeededChatSnapshot(): ChatSnapshotSeed {
  return {
    version: 1,
    selectedConversationId: 'conv-screenshot-1',
    lastConversationNumber: 1,
    lastMessageNumber: 2,
    conversations: [
      {
        id: 'conv-screenshot-1',
        title: 'Screenshot matrix',
        createdAt: '2026-04-16T12:00:00.000Z',
        updatedAt: '2026-04-16T12:00:00.000Z',
        messages: [
          {
            id: 'msg-screenshot-1',
            role: 'user',
            content: 'Validate template runtime screenshots',
            createdAt: '2026-04-16T12:00:00.000Z',
          },
          {
            id: 'msg-screenshot-2',
            role: 'assistant',
            content: 'Local summary saved for this conversation: Validate template runtime screenshots. Review Operational Manual.md and confirm critical surfaces.',
            createdAt: '2026-04-16T12:00:00.000Z',
            fromCache: false,
            sources: [
              {
                documentName: 'Operational Manual.md',
                chunkContent: 'Local service flow for clients, orders, and workspace tasks.',
                relevance: 0.96,
              },
            ],
          },
        ],
      },
    ],
  }
}

async function resetRuntimeState(page: Page, preset: PresetMatrixEntry): Promise<void> {
  await page.goto('/')
  await page.evaluate(({ themeId, runtimeStorageKey, runtimeSnapshot, chatStorageKey, chatSnapshot }) => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem('ntk-theme', themeId)
    window.localStorage.setItem(runtimeStorageKey, JSON.stringify(runtimeSnapshot))
    window.localStorage.setItem(chatStorageKey, JSON.stringify(chatSnapshot))
  }, {
    themeId: preset.id,
    runtimeStorageKey: RUNTIME_STORAGE_KEY,
    runtimeSnapshot: createRuntimeSeed(),
    chatStorageKey: WIKI_CHAT_STORAGE_KEY,
    chatSnapshot: createSeededChatSnapshot(),
  })
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

async function assertPresetContract(page: Page, preset: PresetMatrixEntry): Promise<void> {
  await expect.poll(async () => {
    return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
  }).toBe(preset.id)

  await expect.poll(async () => {
    return await page.evaluate(() => document.body.classList.contains('body--dark'))
  }).toBe(preset.dark)

  await expect.poll(async () => {
    return await page.evaluate(() => document.body.classList.contains('body--light'))
  }).toBe(!preset.dark)

  await expect.poll(async () => {
    return await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--ntk-dark-scheme').trim()
    })
  }).toBe(preset.dark ? '1' : '0')
}

async function assertNoHorizontalOverflow(page: Page, context: string): Promise<void> {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth - root.clientWidth
  })

  expect(overflow, `${context} should not introduce page-level horizontal overflow`).toBeLessThanOrEqual(2)
}

async function expectRuntimeScreenshot(
  locator: Locator,
  preset: PresetMatrixEntry,
  surface: string
): Promise<void> {
  await expect(locator, `${preset.label} ${surface} should be visible before capture`).toBeVisible()
  await expect(locator).toHaveScreenshot(`template-runtime-${preset.id}-${surface}.png`, {
    animations: 'disabled',
    caret: 'hide',
  })
}

async function assertUserAvatarInitials(userMenuTrigger: Locator): Promise<void> {
  const avatar = userMenuTrigger.locator('.ntk-template-user-menu__avatar').first()

  await expect(avatar, 'user menu trigger should render the configured initials').toHaveText('AN')
  await expect(
    avatar.locator('img, svg, .q-icon, i.material-icons'),
    'user menu trigger should render initials instead of an icon or image'
  ).toHaveCount(0)
}

async function assertDashboardChartsStructure(page: Page): Promise<void> {
  const charts = page.locator('.ntk-reference-dashboard-charts')

  await expect(charts.locator('.ntk-reference-dashboard-charts__card')).toHaveCount(2)
  await expect(charts.locator('.ntk-reference-dashboard-charts__chart--donut .highcharts-container')).toBeVisible()
  await expect(charts.locator('.ntk-reference-dashboard-charts__chart--bars .highcharts-container')).toBeVisible()
  await expect(charts.locator('.ntk-reference-dashboard-charts__chart--donut .highcharts-pie-series .highcharts-point')).toHaveCount(4)
  expect(
    await charts.locator('.ntk-reference-dashboard-charts__chart--bars .highcharts-bar-series .highcharts-point').count(),
    'dashboard bar chart should render the seeded reference category series'
  ).toBeGreaterThanOrEqual(2)
  await expect(charts.locator('.highcharts-credits')).toHaveCount(0)
}

async function capturePresetMatrix(page: Page, preset: PresetMatrixEntry): Promise<void> {
  await resetRuntimeState(page, preset)
  await loginToRuntime(page)
  await assertPresetContract(page, preset)

  await page.goto(`${RUNTIME_BASE}#/`)
  await expect(page.locator('.ntk-template-main-layout__header')).toBeVisible()
  await expectRuntimeScreenshot(page.locator('.ntk-template-main-layout__header'), preset, 'header')
  await expectRuntimeScreenshot(page.locator('.ntk-template-dashboard__card').first(), preset, 'dashboard-card')
  await assertDashboardChartsStructure(page)
  await expectRuntimeScreenshot(page.locator('.ntk-reference-dashboard-charts'), preset, 'charts')

  await page.goto(`${RUNTIME_BASE}#/clients`)
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible()
  await expectRuntimeScreenshot(page.locator('.ntk-template-crud-list__table-wrap'), preset, 'clients-table')

  await page.goto(`${RUNTIME_BASE}#/orders`)
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
  await expectRuntimeScreenshot(page.locator('.ntk-template-crud-list__table-wrap'), preset, 'orders-table')

  await page.goto(`${RUNTIME_BASE}#/settings`)
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expectRuntimeScreenshot(page.locator('.ntk-template-runtime-settings__card').first(), preset, 'settings-card')

  await page.goto(`${RUNTIME_BASE}#/`)
  const userMenuTrigger = page.locator('.ntk-template-user-menu__trigger').first()
  await expect(userMenuTrigger).toBeVisible()
  await assertUserAvatarInitials(userMenuTrigger)
  await userMenuTrigger.click()

  const userMenu = page.locator('.ntk-template-user-menu').last()
  await expect(userMenu).toBeVisible()
  await expectRuntimeScreenshot(userMenu, preset, 'user-menu')

  await page.keyboard.press('Escape')
  await expect(userMenu).not.toBeVisible()
  await assertNoHorizontalOverflow(page, preset.label)
}

test.describe('template runtime screenshot baselines', () => {
  for (const preset of PRESET_MATRIX) {
    test(`matches screenshot baselines for ${preset.label}`, async ({ page }) => {
      await capturePresetMatrix(page, preset)
    })
  }
})
