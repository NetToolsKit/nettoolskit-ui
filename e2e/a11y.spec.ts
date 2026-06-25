/**
 * Library browser + accessibility gate over the design-system sample catalog.
 *
 * Proves the rendered DOM (real browser, not jsdom) is accessible and that key
 * `Ds*` interactions behave: landmarks, an axe scan, keyboard focus, and the
 * dialog open/close/focus lifecycle. Scope is the sample host only — no product,
 * CMS, template, or network flows.
 */

import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // The CRUD recipe hydrates its table asynchronously; wait for the catalog to
  // settle so the a11y scan covers the fully rendered DOM.
  await expect(page.getByRole('heading', { name: 'Clientes', exact: true })).toBeVisible()
})

test('catalog exposes a main landmark and a top-level heading', async ({ page }) => {
  // Page-level recipes (DsCrudPage/DsFormPage) provide <main> landmarks.
  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
})

test('catalog has no detectable WCAG violations (axe)', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    // Real WCAG AA contrast is enforced against the rendered, styled catalog:
    // the styled Ds* components must meet 4.5:1 with token-only color pairs.
    .analyze()

  const summary = results.violations
    .map((v) => `${v.id} (${v.nodes.length}): ${v.help}`)
    .join('\n')
  expect(results.violations, summary).toEqual([])
})

test('keyboard focus reaches an interactive control', async ({ page }) => {
  await page.keyboard.press('Tab')
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? '')
  expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedTag)
})

test('DsDialog opens, holds focus, and closes on Escape', async ({ page }) => {
  await page.getByRole('button', { name: 'Editar perfil' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('Editar perfil')

  // Native <dialog> modal moves focus inside; it must stay within the dialog.
  const focusInside = await dialog.evaluate((el) => el.contains(document.activeElement))
  expect(focusInside).toBe(true)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

// --- Demo apps (fully-mocked, front-only) -------------------------------------
// Each demo app is reachable from the host's top-level tab switcher. For every
// app we switch to its tab, smoke-assert a key element renders, then run an axe
// scan with WCAG AA contrast enabled (same tags as the catalog scan) asserting
// zero violations. These prove the apps build real screens with token-only,
// library-component styling that still clears the a11y gate.

const switchToApp = async (
  page: import('@playwright/test').Page,
  tabName: string,
): Promise<void> => {
  await page.getByRole('tab', { name: tabName, exact: true }).click()
}

const expectNoAxeViolations = async (
  page: import('@playwright/test').Page,
): Promise<void> => {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const summary = results.violations
    .map((v) => `${v.id} (${v.nodes.length}): ${v.help}`)
    .join('\n')
  expect(results.violations, summary).toEqual([])
}

test('Industrial app renders and has no WCAG violations (axe)', async ({ page }) => {
  await switchToApp(page, 'Industrial')

  // Smoke: the ribbon tablist renders with its command tabs.
  const ribbonTablist = page.getByRole('tablist', { name: 'Studio commands' })
  await expect(ribbonTablist).toBeVisible()
  await expect(ribbonTablist.getByRole('tab', { name: 'Home' })).toBeVisible()

  await expectNoAxeViolations(page)
})

test('Users app renders and has no WCAG violations (axe)', async ({ page }) => {
  await switchToApp(page, 'Usuários')

  // Smoke: the CRUD page (DsCrudPage) heading + the users data table render.
  // The page lives in a <main> landmark; scope to it to disambiguate from the
  // app's own <h1> in the header banner. The table hydrates asynchronously.
  await expect(page.getByRole('main').getByRole('heading', { name: 'Usuários' })).toBeVisible()
  await expect(page.getByRole('table', { name: 'Usuários' })).toBeVisible()

  await expectNoAxeViolations(page)
})

test('E-commerce app renders, cart drawer opens, no WCAG violations (axe)', async ({ page }) => {
  await switchToApp(page, 'E-commerce')

  // Smoke: the product grid (category tablist + an Add to cart button) renders.
  await expect(page.getByRole('tablist', { name: 'Categorias de produtos' })).toBeVisible()
  const addButton = page.getByRole('button', { name: 'Add to cart' }).first()
  await expect(addButton).toBeVisible()

  // Add an item and open the cart drawer so the scan also covers it.
  await addButton.click()
  await page.getByRole('button', { name: /^Carrinho/ }).click()
  const drawer = page.getByRole('dialog', { name: 'Carrinho' })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('table', { name: 'Itens do carrinho' })).toBeVisible()

  await expectNoAxeViolations(page)
})