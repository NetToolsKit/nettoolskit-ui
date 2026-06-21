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

async function submitRuntimeLogin(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  await page.locator('input[aria-label="Email input"]').fill('ops@nettoolskit.dev')
  await page.locator('input[aria-label="Password input"]').fill('demo-password')
  await page.getByRole('button', { name: 'Submit login form' }).click()
}

test.describe('template runtime auth flow', () => {
  test.beforeEach(async ({ page }) => {
    await resetRuntimeState(page)
  })

  test('preserves the intended destination when a guest is redirected to login', async ({ page }) => {
    await page.goto(`${RUNTIME_BASE}#/orders`)

    await expect(page).toHaveURL(/template-runtime=1#\/auth\/login\?redirect=\/orders$/)
    await submitRuntimeLogin(page)

    await expect(page).toHaveURL(/template-runtime=1#\/orders$/)
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
  })

  test('redirects authenticated users away from login using the requested target or dashboard fallback', async ({ page }) => {
    await page.goto(RUNTIME_LOGIN_URL)
    await submitRuntimeLogin(page)

    await expect(page).toHaveURL(/template-runtime=1#\/?$/)
    await expect(page.locator('.ntk-template-dashboard__title')).toBeVisible()

    await page.goto(`${RUNTIME_BASE}#/auth/login?redirect=/settings`)
    await expect(page).toHaveURL(/template-runtime=1#\/settings$/)
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    await page.goto(RUNTIME_LOGIN_URL)
    await expect(page).toHaveURL(/template-runtime=1#\/?$/)
    await expect(page.locator('.ntk-template-dashboard__title')).toBeVisible()
  })

  test('reset runtime clears auth and keeps protected routes blocked afterwards', async ({ page }) => {
    await page.goto(RUNTIME_LOGIN_URL)
    await submitRuntimeLogin(page)

    await page.goto(`${RUNTIME_BASE}#/settings`)
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    await page.getByRole('button', { name: 'Reset runtime' }).click()

    await expect(page).toHaveURL(/template-runtime=1#\/auth\/login$/)
    await expect.poll(async () => {
      return await page.evaluate(() => ({
        token: window.localStorage.getItem('ntk_runtime_token'),
        user: window.localStorage.getItem('ntk_runtime_user'),
      }))
    }).toEqual({
      token: null,
      user: null,
    })

    await page.goBack()
    await expect(page).toHaveURL(/template-runtime=1#\/auth\/login(?:\?redirect=.*)?$/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

    await page.reload()
    await expect(page).toHaveURL(/template-runtime=1#\/auth\/login(?:\?redirect=.*)?$/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })
})
