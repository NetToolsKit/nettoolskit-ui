import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const RUNTIME_LOGIN_URL = '/?template-runtime=1#/auth/login'
const BLOCKING_IMPACTS = new Set(['critical', 'serious'])

function formatBlockingViolations(violations: Array<{ id: string; impact: string | null; nodes: Array<{ target: string[] }> }>) {
  return violations
    .filter(violation => violation.impact && BLOCKING_IMPACTS.has(violation.impact))
    .map(violation => {
      const targets = violation.nodes
        .flatMap(node => node.target)
        .slice(0, 3)
        .join(', ')

      return `${violation.id} (${violation.impact}) ${targets}`
    })
}

test.describe('design-system accessibility gate', () => {
  test('runtime login surface passes axe and keyboard focus checks', async ({ page }) => {
    await page.goto(RUNTIME_LOGIN_URL)

    const formShell = page.locator('.ntk-template-login__form-shell')
    await expect(formShell).toBeVisible()

    const axeResults = await new AxeBuilder({ page })
      .include('.ntk-template-login__form-shell')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(formatBlockingViolations(axeResults.violations)).toEqual([])

    const emailInput = page.locator('input[aria-label="Email input"]')
    const passwordInput = page.locator('input[aria-label="Password input"]')
    const submitButton = page.getByRole('button', { name: 'Submit login form' })

    await emailInput.focus()
    await expect(emailInput).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(passwordInput).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(submitButton).toBeFocused()
  })
})