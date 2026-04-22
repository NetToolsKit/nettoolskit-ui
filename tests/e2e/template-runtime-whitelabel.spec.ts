import { expect, test, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`

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

test.describe('template runtime whitelabel', () => {
  test.beforeEach(async ({ page }) => {
    await resetRuntimeState(page)
  })

  test('supports login, preset switching and runtime route navigation', async ({ page }) => {
    await loginToRuntime(page)

    const themeDots = page.locator('.ntk-template-theme-dots__dot')
    await expect(themeDots).toHaveCount(6)

    await page.locator('.ntk-template-theme-dots__dot[title="Claude"]').click()

    await expect.poll(async () => {
      return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    }).toBe('claude')

    await expect.poll(async () => {
      return await page.evaluate(() => window.localStorage.getItem('ntk-theme') ?? '')
    }).toBe('claude')

    await page.getByLabel(/open assistant/i).click()
    await expect(page.getByRole('dialog', { name: /assistant drawer/i })).toBeVisible()
    await page.getByRole('button', { name: /close drawer/i }).click()

    await page.goto(`${RUNTIME_BASE}#/clients`)
    await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible()

    await page.goto(`${RUNTIME_BASE}#/orders`)
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()

    await page.goto(`${RUNTIME_BASE}#/knowledge`)
    await expect(page.getByRole('heading', { name: 'Knowledge base' })).toBeVisible()
    await page.getByRole('button', { name: 'Export' }).click()
    await expect(page).toHaveURL(/template-runtime=1#\/knowledge\/chat$/)
    await expect(page.getByRole('heading', { name: 'Knowledge assistant' })).toBeVisible()

    await page.goto(`${RUNTIME_BASE}#/settings`)
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    await page.goto(`${RUNTIME_BASE}#/profile`)
    await expect(page.getByRole('heading', { name: 'Admin NetToolsKit' })).toBeVisible()
  })

  test('persists the selected preset after reload in runtime settings', async ({ page }) => {
    await loginToRuntime(page)

    await page.locator('.ntk-template-theme-dots__dot[title="Kraken"]').click()

    await expect.poll(async () => {
      return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    }).toBe('kraken')

    await page.goto(`${RUNTIME_BASE}#/settings`)
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    await page.reload()

    await expect.poll(async () => {
      return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    }).toBe('kraken')

    await expect.poll(async () => {
      return await page.evaluate(() => window.localStorage.getItem('ntk-theme') ?? '')
    }).toBe('kraken')
  })
})
