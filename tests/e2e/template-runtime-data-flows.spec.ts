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
        name: 'Cliente Atlas',
        owner: 'Ana Lima',
        segment: 'Distribuicao',
        city: 'Recife',
        status: 'active',
        monthlyRevenue: 18000,
        lastOrderAt: '2026-04-10T09:00:00.000Z',
        tags: ['nordeste', 'vip'],
      },
      {
        id: 'client-seed-2',
        name: 'Cliente Boreal',
        owner: 'Bruno Serra',
        segment: 'Industria',
        city: 'Curitiba',
        status: 'onboarding',
        monthlyRevenue: 9400,
        lastOrderAt: '2026-04-08T15:30:00.000Z',
        tags: ['novo'],
      },
    ],
    orders: [
      {
        id: 'order-seed-1',
        number: 'PED-2001',
        clientId: 'client-seed-1',
        clientName: 'Cliente Atlas',
        category: 'Eletronicos',
        total: 7200,
        status: 'pending',
        createdAt: '2026-04-10T09:00:00.000Z',
        updatedAt: '2026-04-10T09:00:00.000Z',
      },
      {
        id: 'order-seed-2',
        number: 'PED-2002',
        clientId: 'client-seed-2',
        clientName: 'Cliente Boreal',
        category: 'Industria',
        total: 5400,
        status: 'in_progress',
        createdAt: '2026-04-09T12:00:00.000Z',
        updatedAt: '2026-04-10T11:00:00.000Z',
      },
      {
        id: 'order-seed-3',
        number: 'PED-2003',
        clientId: 'client-seed-1',
        clientName: 'Cliente Atlas',
        category: 'Servicos',
        total: 3100,
        status: 'completed',
        createdAt: '2026-04-06T08:45:00.000Z',
        updatedAt: '2026-04-07T08:45:00.000Z',
      },
    ],
    settings: {
      workspaceName: 'Atlas Seed',
      operatorName: 'Operadora Seed',
      supportEmail: 'seed@atlas.local',
      locale: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notificationsEnabled: true,
      compactTables: true,
      autoCreateFollowUp: false,
    },
    wiki: {
      categories: [
        {
          id: 'operations',
          name: 'Operacoes',
          count: 1,
          expanded: true,
          children: [
            { id: 'operations-orders', name: 'Pedidos', count: 1 },
          ],
        },
      ],
      documents: [
        {
          id: 'doc-seed-1',
          name: 'Fluxo local.md',
          fileType: 'md',
          size: '12 KB',
          category: 'Operacoes',
          categoryId: 'operations',
          subCategory: 'Pedidos',
          subCategoryId: 'operations-orders',
          tags: ['runtime'],
          status: 'processed',
          uploadDate: '10/04',
          description: 'Documento seed para manter o runtime estavel durante os testes.',
        },
      ],
      suggestions: [
        { id: 'sug-seed-1', text: 'Quais pedidos estao em aberto?', icon: 'help' },
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
  await expect(page.getByRole('heading', { name: 'Entrar no sistema' })).toBeVisible()

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

    const clientsTable = page.locator('table[aria-label="Tabela de clientes"]')
    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
    await expect(clientsTable).toBeVisible()

    await page.getByLabel('Buscar clientes').fill('Atlas')
    await expect(clientsTable.locator('tbody tr')).toHaveCount(1)
    await expect(clientsTable.locator('tbody tr').first()).toContainText('Cliente Atlas')

    await page.getByLabel('Buscar clientes').fill('')
    await page.locator('.ntk-template-crud-list__filter', { hasText: 'Onboarding' }).click()
    await expect(clientsTable.locator('tbody tr')).toHaveCount(1)
    await expect(clientsTable.locator('tbody tr').first()).toContainText('Cliente Boreal')

    await page.locator('.ntk-template-crud-list__filter', { hasText: 'Todos' }).click()
    await page.getByRole('button', { name: 'Novo cliente' }).click()
    await expect(clientsTable).toContainText('Novo Cliente 3')

    const atlasRow = clientsTable.locator('tbody tr', { hasText: 'Cliente Atlas' })
    await atlasRow.getByRole('button', { name: 'Duplicar cliente' }).click()
    await expect(clientsTable).toContainText('Cliente Atlas Copy')

    const borealRow = clientsTable.locator('tbody tr', { hasText: 'Cliente Boreal' })
    await borealRow.getByRole('button', { name: 'Atualizar status do cliente' }).click()
    await expect(borealRow).toContainText('Ativo')

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
    await expect(clientsTable).toContainText('Novo Cliente 3')
    await expect(clientsTable).toContainText('Cliente Atlas Copy')
    await expect(clientsTable.locator('tbody tr', { hasText: 'Cliente Boreal' })).toContainText('Ativo')

    const snapshot = await readRuntimeSnapshot(page)
    expect(snapshot.clients).toHaveLength(4)
    expect(snapshot.clients.find(client => client.name === 'Cliente Boreal')?.status).toBe('active')
    expect(snapshot.clients.some(client => client.name === 'Novo Cliente 3')).toBeTruthy()
    expect(snapshot.clients.some(client => client.name === 'Cliente Atlas Copy')).toBeTruthy()
  })

  test('persists meaningful order flows with search, filter, row actions and bulk updates', async ({ page }) => {
    await loginToRuntime(page)
    await page.goto(`${RUNTIME_BASE}#/orders`)

    const ordersTable = page.locator('table[aria-label="Tabela de pedidos"]')
    await expect(page.getByRole('heading', { name: 'Pedidos' })).toBeVisible()
    await expect(ordersTable).toBeVisible()

    await page.getByLabel('Buscar pedidos').fill('PED-2002')
    await expect(ordersTable.locator('tbody tr')).toHaveCount(1)
    await expect(ordersTable.locator('tbody tr').first()).toContainText('PED-2002')

    await page.getByLabel('Buscar pedidos').fill('')
    await page.locator('.ntk-template-crud-list__filter', { hasText: 'Pendentes' }).click()
    await expect(ordersTable.locator('tbody tr')).toHaveCount(1)
    await expect(ordersTable.locator('tbody tr').first()).toContainText('PED-2001')

    await page.locator('.ntk-template-crud-list__filter', { hasText: 'Todos' }).click()
    await page.getByRole('button', { name: 'Novo pedido' }).click()
    await expect(ordersTable).toContainText('PED-2004')
    await expect(ordersTable.locator('tbody tr', { hasText: 'PED-2004' })).toContainText('Pendente')

    const pendingRow = ordersTable.locator('tbody tr', { hasText: 'PED-2001' })
    await pendingRow.getByRole('button', { name: 'Avançar status do pedido' }).click()
    await expect(pendingRow).toContainText('Em progresso')

    const inProgressRow = ordersTable.locator('tbody tr', { hasText: 'PED-2002' })
    await inProgressRow.getByRole('button', { name: 'Cancelar pedido' }).click()
    await expect(inProgressRow).toContainText('Cancelado')

    await ordersTable.locator('tbody tr', { hasText: 'PED-2003' }).getByRole('checkbox').click()
    await ordersTable.locator('tbody tr', { hasText: 'PED-2004' }).getByRole('checkbox').click()
    await expect(page.locator('.ntk-template-crud-list__bulk-label')).toHaveText('2 pedidos selecionados')

    await page.getByRole('button', { name: 'Concluir' }).click()
    await expect(ordersTable.locator('tbody tr', { hasText: 'PED-2003' })).toContainText('Concluído')
    await expect(ordersTable.locator('tbody tr', { hasText: 'PED-2004' })).toContainText('Concluído')

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Pedidos' })).toBeVisible()
    await expect(ordersTable).toContainText('PED-2004')
    await expect(ordersTable.locator('tbody tr', { hasText: 'PED-2001' })).toContainText('Em progresso')
    await expect(ordersTable.locator('tbody tr', { hasText: 'PED-2002' })).toContainText('Cancelado')
    await expect(ordersTable.locator('tbody tr', { hasText: 'PED-2004' })).toContainText('Concluído')

    const snapshot = await readRuntimeSnapshot(page)
    expect(snapshot.orders).toHaveLength(4)
    expect(snapshot.orders.find(order => order.number === 'PED-2001')?.status).toBe('in_progress')
    expect(snapshot.orders.find(order => order.number === 'PED-2002')?.status).toBe('cancelled')
    expect(snapshot.orders.find(order => order.number === 'PED-2004')?.status).toBe('completed')
  })

  test('persists settings changes and applies compact table preferences across runtime pages', async ({ page }) => {
    await loginToRuntime(page)
    await page.goto(`${RUNTIME_BASE}#/settings`)

    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible()
    await page.getByLabel('Nome do workspace').fill('Atlas Prime Runtime')
    await page.getByLabel('Nome do operador').fill('Marina Campos')
    await page.getByLabel('E-mail de suporte').fill('marina@atlas.local')
    await page.getByLabel('Locale').fill('en-US')
    await page.getByLabel('Timezone').fill('UTC')
    await page.locator('input[name="runtime-notifications-enabled"]').uncheck()
    await page.locator('input[name="runtime-compact-tables"]').uncheck()
    await page.locator('input[name="runtime-auto-follow-up"]').check()

    await page.getByRole('button', { name: 'Salvar alterações' }).click()

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
    await expect(page.getByLabel('Nome do workspace')).toHaveValue('Atlas Prime Runtime')
    await expect(page.getByLabel('Nome do operador')).toHaveValue('Marina Campos')
    await expect(page.getByLabel('E-mail de suporte')).toHaveValue('marina@atlas.local')
    await expect(page.getByLabel('Locale')).toHaveValue('en-US')
    await expect(page.getByLabel('Timezone')).toHaveValue('UTC')

    await page.goto(`${RUNTIME_BASE}#/clients`)
    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
    await expect(page.locator('[aria-label="Cards de clientes"]')).toBeVisible()
    await expect(page.locator('table[aria-label="Tabela de clientes"]')).toHaveCount(0)

    await page.goto(`${RUNTIME_BASE}#/profile`)
    await expect(page.getByRole('heading', { name: 'Marina Campos' })).toBeVisible()
  })
})
