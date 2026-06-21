import { expect, test, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const RUNTIME_STORAGE_KEY = 'ntk_template_runtime_data_v1'

interface RuntimeSeedSnapshot {
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

function createRuntimeSeed(): RuntimeSeedSnapshot {
  return {
    clients: [
      {
        id: 'client-seed-1',
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
        id: 'client-seed-2',
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
        id: 'order-seed-1',
        number: 'ORD-2001',
        clientId: 'client-seed-1',
        clientName: 'Atlas Client',
        category: 'Electronics',
        total: 7200,
        status: 'pending',
        createdAt: '2026-04-10T09:00:00.000Z',
        updatedAt: '2026-04-10T09:00:00.000Z',
      },
      {
        id: 'order-seed-2',
        number: 'ORD-2002',
        clientId: 'client-seed-2',
        clientName: 'Boreal Client',
        category: 'Industry',
        total: 5400,
        status: 'in_progress',
        createdAt: '2026-04-09T12:00:00.000Z',
        updatedAt: '2026-04-10T11:00:00.000Z',
      },
      {
        id: 'order-seed-3',
        number: 'ORD-2003',
        clientId: 'client-seed-1',
        clientName: 'Atlas Client',
        category: 'Services',
        total: 3100,
        status: 'completed',
        createdAt: '2026-04-06T08:45:00.000Z',
        updatedAt: '2026-04-07T08:45:00.000Z',
      },
    ],
    settings: {
      workspaceName: 'Atlas Seed',
      operatorName: 'Seed Operator',
      supportEmail: 'seed@atlas.local',
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
          id: 'doc-seed-1',
          name: 'Local flow.md',
          fileType: 'md',
          size: '12 KB',
          category: 'Operations',
          categoryId: 'operations',
          subCategory: 'Orders',
          subCategoryId: 'operations-orders',
          tags: ['runtime'],
          status: 'processed',
          uploadDate: '10/04',
          description: 'Seed document used to keep the runtime stable during tests.',
        },
      ],
      suggestions: [
        { id: 'sug-seed-1', text: 'Which orders are still open?', icon: 'help' },
      ],
    },
  }
}

async function resetAndSeedRuntimeState(page: Page, snapshot: RuntimeSeedSnapshot = createRuntimeSeed()): Promise<void> {
  await page.goto('/')
  await page.evaluate(({ storageKey, seed }) => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem(storageKey, JSON.stringify(seed))
  }, { storageKey: RUNTIME_STORAGE_KEY, seed: snapshot })
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

async function readRuntimeSnapshot(page: Page): Promise<RuntimeSeedSnapshot> {
  return await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey)
    return JSON.parse(raw ?? '{}')
  }, RUNTIME_STORAGE_KEY)
}

test.describe('template runtime data flows', () => {
  test.beforeEach(async ({ page }) => {
    await resetAndSeedRuntimeState(page)
  })

  test('persists meaningful client flows with search, filter, create and status changes', async ({ page }) => {
    await loginToRuntime(page)
    await page.goto(`${RUNTIME_BASE}#/clients`)

    const clientsTable = page.locator('.ntk-data-table[aria-label="Clients table"]')
    await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible()
    await expect(clientsTable).toBeVisible()

    await page.getByLabel('Search clients').fill('Atlas')
    await expect(clientsTable.locator('tbody tr')).toHaveCount(1)
    await expect(clientsTable.locator('tbody tr').first()).toContainText('Atlas Client')

    await page.getByLabel('Search clients').fill('')
    await page.locator('.ntk-template-crud-list__filter', { hasText: 'Onboarding' }).click()
    await expect(clientsTable.locator('tbody tr')).toHaveCount(1)
    await expect(clientsTable.locator('tbody tr').first()).toContainText('Boreal Client')

    await page.locator('.ntk-template-crud-list__filter', { hasText: 'All' }).click()
    await page.getByRole('button', { name: 'New client' }).click()
    await expect(clientsTable).toContainText('New Client 3')

    const atlasRow = clientsTable.locator('tbody tr', { hasText: 'Atlas Client' })
    await atlasRow.getByRole('button', { name: 'Duplicate client' }).click()
    await expect(clientsTable).toContainText('Atlas Client Copy')

    const borealRow = clientsTable.locator('tbody tr', { hasText: 'Boreal Client' })
    await borealRow.getByRole('button', { name: 'Update client status' }).click()
    await expect(borealRow).toContainText('Active')

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible()
    await expect(clientsTable).toContainText('New Client 3')
    await expect(clientsTable).toContainText('Atlas Client Copy')
    await expect(clientsTable.locator('tbody tr', { hasText: 'Boreal Client' })).toContainText('Active')

    const snapshot = await readRuntimeSnapshot(page)
    expect(snapshot.clients).toHaveLength(4)
    expect(snapshot.clients.find(client => client.name === 'Boreal Client')?.status).toBe('active')
    expect(snapshot.clients.some(client => client.name === 'New Client 3')).toBeTruthy()
    expect(snapshot.clients.some(client => client.name === 'Atlas Client Copy')).toBeTruthy()
  })

  test('persists meaningful order flows with search, filter, row actions and bulk updates', async ({ page }) => {
    await loginToRuntime(page)
    await page.goto(`${RUNTIME_BASE}#/orders`)

    const ordersTable = page.locator('.ntk-data-table[aria-label="Orders table"]')
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
    await expect(ordersTable).toBeVisible()

    await page.getByLabel('Search orders').fill('ORD-2002')
    await expect(ordersTable.locator('tbody tr')).toHaveCount(1)
    await expect(ordersTable.locator('tbody tr').first()).toContainText('ORD-2002')

    await page.getByLabel('Search orders').fill('')
    await page.locator('.ntk-template-crud-list__filter', { hasText: 'Pending' }).click()
    await expect(ordersTable.locator('tbody tr')).toHaveCount(1)
    await expect(ordersTable.locator('tbody tr').first()).toContainText('ORD-2001')

    await page.locator('.ntk-template-crud-list__filter', { hasText: 'All' }).click()
    await page.getByRole('button', { name: 'New order' }).click()
    await expect(ordersTable).toContainText('ORD-2004')
    await expect(ordersTable.locator('tbody tr', { hasText: 'ORD-2004' })).toContainText('Pending')

    const pendingRow = ordersTable.locator('tbody tr', { hasText: 'ORD-2001' })
    await pendingRow.getByRole('button', { name: 'Advance order status' }).click()
    await expect(pendingRow).toContainText('In progress')

    const inProgressRow = ordersTable.locator('tbody tr', { hasText: 'ORD-2002' })
    await inProgressRow.getByRole('button', { name: 'Cancel order' }).click()
    await expect(inProgressRow).toContainText('Cancelled')

    await ordersTable.locator('tbody tr', { hasText: 'ORD-2003' }).getByRole('checkbox').click()
    await ordersTable.locator('tbody tr', { hasText: 'ORD-2004' }).getByRole('checkbox').click()
    await expect(page.locator('.ntk-template-crud-list__bulk-label')).toHaveText('2 selected orders')

    await page.getByRole('button', { name: 'Complete', exact: true }).click()
    await expect(ordersTable.locator('tbody tr', { hasText: 'ORD-2003' })).toContainText('Completed')
    await expect(ordersTable.locator('tbody tr', { hasText: 'ORD-2004' })).toContainText('Completed')

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
    await expect(ordersTable).toContainText('ORD-2004')
    await expect(ordersTable.locator('tbody tr', { hasText: 'ORD-2001' })).toContainText('In progress')
    await expect(ordersTable.locator('tbody tr', { hasText: 'ORD-2002' })).toContainText('Cancelled')
    await expect(ordersTable.locator('tbody tr', { hasText: 'ORD-2004' })).toContainText('Completed')

    const snapshot = await readRuntimeSnapshot(page)
    expect(snapshot.orders).toHaveLength(4)
    expect(snapshot.orders.find(order => order.number === 'ORD-2001')?.status).toBe('in_progress')
    expect(snapshot.orders.find(order => order.number === 'ORD-2002')?.status).toBe('cancelled')
    expect(snapshot.orders.find(order => order.number === 'ORD-2004')?.status).toBe('completed')
  })

  test('persists settings changes and applies compact table preferences across runtime pages', async ({ page }) => {
    await loginToRuntime(page)
    await page.goto(`${RUNTIME_BASE}#/settings`)

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await page.getByLabel('Workspace name').fill('Atlas Prime Runtime')
    await page.getByLabel('Operator name').fill('Marina Campos')
    await page.getByLabel('Support e-mail').fill('marina@atlas.local')
    await page.getByLabel('Locale').fill('en-US')
    await page.getByLabel('Timezone').fill('UTC')
    await page.locator('input[name="runtime-notifications-enabled"]').uncheck()
    await page.locator('input[name="runtime-compact-tables"]').uncheck()
    await page.locator('input[name="runtime-auto-follow-up"]').check()

    await page.getByRole('button', { name: 'Save changes' }).click()

    const snapshotAfterSave = await readRuntimeSnapshot(page)
    expect(snapshotAfterSave.settings).toMatchObject({
      workspaceName: 'Atlas Prime Runtime',
      operatorName: 'Marina Campos',
      supportEmail: 'marina@atlas.local',
      locale: 'en-US',
      timezone: 'UTC',
      notificationsEnabled: false,
      compactTables: false,
      autoCreateFollowUp: true,
    })

    await page.reload()
    await expect(page.getByLabel('Workspace name')).toHaveValue('Atlas Prime Runtime')
    await expect(page.getByLabel('Operator name')).toHaveValue('Marina Campos')
    await expect(page.getByLabel('Support e-mail')).toHaveValue('marina@atlas.local')
    await expect(page.getByLabel('Locale')).toHaveValue('en-US')
    await expect(page.getByLabel('Timezone')).toHaveValue('UTC')

    await page.goto(`${RUNTIME_BASE}#/clients`)
    await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible()
    await expect(page.locator('[aria-label="Client cards"]')).toBeVisible()
    await expect(page.locator('.ntk-data-table[aria-label="Clients table"]')).toHaveCount(0)

    await page.goto(`${RUNTIME_BASE}#/profile`)
    await expect(page.getByRole('heading', { name: 'Marina Campos' })).toBeVisible()
  })
})
