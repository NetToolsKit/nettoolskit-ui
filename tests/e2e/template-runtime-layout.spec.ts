import { expect, test, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const LAYOUT_STORAGE_PREFIX = 'ntk-template-runtime-layout'

type LayoutStorageSnapshot = {
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
  await expect(page.getByRole('heading', { name: 'Entrar no sistema' })).toBeVisible()

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

async function readLayoutStorage(page: Page): Promise<LayoutStorageSnapshot> {
  return await page.evaluate((prefix) => ({
    horizontalMode: window.localStorage.getItem(`${prefix}:horizontal-mode`),
    miniMode: window.localStorage.getItem(`${prefix}:mini-mode`),
    miniLabels: window.localStorage.getItem(`${prefix}:mini-labels`),
    sideMenuVariant: window.localStorage.getItem(`${prefix}:side-menu-variant`),
  }), LAYOUT_STORAGE_PREFIX)
}

test.describe('template runtime layout persistence', () => {
  test.beforeEach(async ({ page }) => {
    await resetRuntimeState(page)
  })

  test('persists horizontal navigation through the user menu and keeps sidebar variant unexposed in the runtime shell', async ({ page }) => {
    await loginToRuntime(page)

    await expect(page.locator('.ntk-template-main-layout__drawer')).toBeVisible()
    await expect(page.locator('.ntk-template-main-layout__horizontal-nav')).toHaveCount(0)

    await openUserMenu(page)
    await expect(page.getByText('Sidebar style')).toHaveCount(0)
    await toggleUserMenuPreference(page, 'Horizontal menu')

    await expect(page.locator('.ntk-template-main-layout__horizontal-nav')).toBeVisible()
    await expect(page.locator('.ntk-template-main-layout__drawer')).toHaveCount(0)
    await expect(page.locator('.ntk-template-main-layout__menu-btn')).toHaveClass(/ntk-template-main-layout__menu-btn--hidden/)
    await expect(page.locator('.ntk-template-main-layout--side-vercel')).toHaveCount(1)

    await expect.poll(async () => await readLayoutStorage(page)).toEqual({
      horizontalMode: 'true',
      miniMode: null,
      miniLabels: null,
      sideMenuVariant: null,
    })

    await page.reload()

    await expect(page.locator('.ntk-template-main-layout__horizontal-nav')).toBeVisible()
    await expect(page.locator('.ntk-template-main-layout__drawer')).toHaveCount(0)
    await expect(page.locator('.ntk-template-main-layout__menu-btn')).toHaveClass(/ntk-template-main-layout__menu-btn--hidden/)
    await expect(page.locator('.ntk-template-main-layout--side-vercel')).toHaveCount(1)
    await expect.poll(async () => await readLayoutStorage(page)).toEqual({
      horizontalMode: 'true',
      miniMode: null,
      miniLabels: null,
      sideMenuVariant: null,
    })
  })

  test('persists mini mode and labels in mini menu across reloads', async ({ page }) => {
    await loginToRuntime(page)

    const drawer = page.locator('.ntk-template-main-layout__drawer')
    const menuButton = page.getByRole('button', { name: 'Collapse side menu' })

    await expect(drawer).toBeVisible()
    await expect(menuButton).toBeVisible()

    await menuButton.click()

    await expect(page.getByRole('button', { name: 'Expand side menu' })).toBeVisible()
    await expect(drawer).toHaveClass(/ntk-template-main-layout__drawer--mini/)

    await openUserMenu(page)
    await toggleUserMenuPreference(page, 'Labels in mini menu')

    await expect(page.getByRole('button', { name: 'Expand side menu' })).toBeVisible()
    await expect(drawer).not.toHaveClass(/ntk-template-main-layout__drawer--mini/)

    await expect.poll(async () => await readLayoutStorage(page)).toEqual({
      horizontalMode: null,
      miniMode: 'true',
      miniLabels: 'true',
      sideMenuVariant: null,
    })

    await page.reload()

    await expect(page.locator('.ntk-template-main-layout__drawer')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Expand side menu' })).toBeVisible()
    await expect(page.locator('.ntk-template-main-layout__drawer')).not.toHaveClass(/ntk-template-main-layout__drawer--mini/)
    await expect.poll(async () => await readLayoutStorage(page)).toEqual({
      horizontalMode: null,
      miniMode: 'true',
      miniLabels: 'true',
      sideMenuVariant: null,
    })
  })
})
