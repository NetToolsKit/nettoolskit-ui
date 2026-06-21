import { expect, test, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const RUNTIME_DATA_STORAGE_KEY = 'ntk_template_runtime_data_v1'
const RUNTIME_WIKI_CHAT_STORAGE_KEY = 'ntk_template_runtime_wiki_chat_v1'
const RUNTIME_LAYOUT_STORAGE_PREFIX = 'ntk-template-runtime-layout'

type RuntimeWorkspaceStorageSnapshot = {
  runtimeData: { settings?: { workspaceName?: string } } | null
  runtimeToken: string | null
  runtimeUser: string | null
  wikiChat: string | null
  theme: string | null
  horizontalMode: string | null
  miniMode: string | null
  miniLabels: string | null
  sideMenuVariant: string | null
}

async function resetRuntimeState(page: Page): Promise<void> {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
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

async function openUserMenu(page: Page): Promise<void> {
  await page.locator('button').filter({ has: page.locator('.ntk-template-user-menu__avatar') }).first().click()
  await expect(page.locator('.ntk-template-user-menu')).toBeVisible()
}

async function toggleUserMenuPreference(page: Page, label: string): Promise<void> {
  const row = page.locator('.q-item', { hasText: label }).first()
  await expect(row).toBeVisible()
  await row.locator('.q-toggle').click()
}

async function readWorkspaceStorage(page: Page): Promise<RuntimeWorkspaceStorageSnapshot> {
  return await page.evaluate(({ runtimeDataKey, wikiChatKey, layoutPrefix }) => {
    const runtimeDataRaw = window.localStorage.getItem(runtimeDataKey)

    return {
      runtimeData: runtimeDataRaw ? JSON.parse(runtimeDataRaw) : null,
      runtimeToken: window.localStorage.getItem('ntk_runtime_token'),
      runtimeUser: window.localStorage.getItem('ntk_runtime_user'),
      wikiChat: window.localStorage.getItem(wikiChatKey),
      theme: window.localStorage.getItem('ntk-theme'),
      horizontalMode: window.localStorage.getItem(`${layoutPrefix}:horizontal-mode`),
      miniMode: window.localStorage.getItem(`${layoutPrefix}:mini-mode`),
      miniLabels: window.localStorage.getItem(`${layoutPrefix}:mini-labels`),
      sideMenuVariant: window.localStorage.getItem(`${layoutPrefix}:side-menu-variant`),
    }
  }, {
    runtimeDataKey: RUNTIME_DATA_STORAGE_KEY,
    wikiChatKey: RUNTIME_WIKI_CHAT_STORAGE_KEY,
    layoutPrefix: RUNTIME_LAYOUT_STORAGE_PREFIX,
  })
}

test.describe('template runtime workspace reset', () => {
  test.beforeEach(async ({ page }) => {
    await resetRuntimeState(page)
  })

  test('reset runtime clears runtime data customizations, auth, chat, theme and layout persistence', async ({ page }) => {
    await loginToRuntime(page)

    await page.getByRole('button', { name: 'Switch to Kraken theme' }).click()
    await expect.poll(async () => {
      return await page.evaluate(() => ({
        theme: window.localStorage.getItem('ntk-theme'),
        datasetTheme: document.documentElement.dataset.theme ?? null,
      }))
    }).toEqual({
      theme: 'kraken',
      datasetTheme: 'kraken',
    })

    await openUserMenu(page)
    await toggleUserMenuPreference(page, 'Horizontal menu')
    await expect(page.locator('.ntk-template-main-layout__horizontal-nav')).toBeVisible()

    await page.getByRole('button', { name: 'Open assistant' }).click()
    const drawer = page.getByRole('dialog', { name: /assistant drawer/i })
    await expect(drawer).toBeVisible()
    await drawer.locator('.ntk-template-wiki-chat-drawer__input').fill('How do I reset the local workspace?')
    await drawer.getByRole('button', { name: 'Send question' }).click()
    await expect(drawer).toContainText('How do I reset the local workspace?')
    await expect.poll(async () => {
      const snapshot = await readWorkspaceStorage(page)
      return snapshot.wikiChat
    }).not.toBeNull()

    await page.goto(`${RUNTIME_BASE}#/settings`)
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await page.locator('input[name="runtime-workspace-name"]').fill('Workspace Reset Test')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.locator('.ntk-template-runtime-settings__summary-card').first()).toContainText('Workspace Reset Test')

    await expect.poll(async () => {
      const snapshot = await readWorkspaceStorage(page)
      return {
        workspaceName: snapshot.runtimeData?.settings?.workspaceName ?? null,
        theme: snapshot.theme,
        horizontalMode: snapshot.horizontalMode,
        wikiChatPresent: snapshot.wikiChat !== null,
        runtimeTokenPresent: snapshot.runtimeToken !== null,
      }
    }).toEqual({
      workspaceName: 'Workspace Reset Test',
      theme: 'kraken',
      horizontalMode: 'true',
      wikiChatPresent: true,
      runtimeTokenPresent: true,
    })

    await page.getByRole('button', { name: 'Reset runtime' }).click()

    await expect(page).toHaveURL(/template-runtime=1#\/auth\/login$/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

    await expect.poll(async () => {
      const snapshot = await readWorkspaceStorage(page)
      return {
        workspaceName: snapshot.runtimeData?.settings?.workspaceName ?? null,
        runtimeToken: snapshot.runtimeToken,
        runtimeUser: snapshot.runtimeUser,
        wikiChat: snapshot.wikiChat,
        theme: snapshot.theme,
        horizontalMode: snapshot.horizontalMode,
        miniMode: snapshot.miniMode,
        miniLabels: snapshot.miniLabels,
        sideMenuVariant: snapshot.sideMenuVariant,
        datasetTheme: await page.evaluate(() => document.documentElement.dataset.theme ?? null),
      }
    }).toEqual({
      workspaceName: 'Atlas Flow',
      runtimeToken: null,
      runtimeUser: null,
      wikiChat: null,
      theme: null,
      horizontalMode: null,
      miniMode: null,
      miniLabels: null,
      sideMenuVariant: null,
      datasetTheme: 'revolut',
    })

    await loginToRuntime(page)
    await expect(page.locator('.ntk-template-main-layout__drawer')).toBeVisible()
    await expect(page.locator('.ntk-template-main-layout__horizontal-nav')).toHaveCount(0)

    await page.getByRole('button', { name: 'Open assistant' }).click()
    await expect(page.getByRole('dialog', { name: /assistant drawer/i })).toContainText('Ask your first question')
    await expect(page.locator('.ntk-template-dashboard__title')).toBeVisible()
  })
})
