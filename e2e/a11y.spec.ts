/**
 * Library browser + accessibility gate over the design-system sample catalog.
 *
 * Proves the rendered DOM (real browser, not jsdom) is accessible and that key
 * `Ds*` interactions behave: landmarks, an axe scan, keyboard focus, and the
 * dialog open/close/focus lifecycle. Scope is the sample host only — no product,
 * CMS, template, or network flows.
 *
 * The samples' default landing surface is the standalone Design System showcase
 * (`samples/DesignSystemShowcase.vue`). The existing PlaTEA-shell demo apps stay
 * reachable from the showcase top bar via "Aplicações de exemplo"; the demo-app
 * and dialog tests open that view first.
 */

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const expectNoAxeViolations = async (page: Page): Promise<void> => {
  // Real WCAG AA contrast is enforced against the rendered, styled DOM: the
  // styled Ds* components must meet 4.5:1 with token-only color pairs.
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const summary = results.violations
    .map((v) => `${v.id} (${v.nodes.length}): ${v.help}`)
    .join('\n')
  expect(results.violations, summary).toEqual([])
}

// Switch from the default showcase landing into the demo-apps host (PlaTEA
// shell). The apps host defaults to the "Catálogo" view.
const openAppsHost = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Aplicações de exemplo' }).click()
  await expect(page.getByRole('navigation', { name: 'Aplicações' })).toBeVisible()
}

// Within the apps host, navigate to a specific demo app via the left sidebar.
const switchToApp = async (page: Page, navName: string): Promise<void> => {
  await page
    .getByRole('navigation', { name: 'Aplicações' })
    .getByRole('button', { name: navName, exact: true })
    .click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // The showcase renders a "Clientes" heading (its real-screen proof section);
  // wait for it so the a11y scan covers the fully rendered DOM.
  await expect(page.getByRole('heading', { name: 'Clientes', exact: true })).toBeVisible()
})

test('showcase exposes a main landmark and a top-level heading', async ({ page }) => {
  // The standalone showcase provides a <main> landmark and a single <h1>.
  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
})

test('showcase has no detectable WCAG violations (axe)', async ({ page }) => {
  // Full WCAG AA scan (including color-contrast) over the default showcase,
  // proving the token-only Ds* surface clears the gate in the default theme.
  await expectNoAxeViolations(page)
})

test('keyboard focus reaches an interactive control', async ({ page }) => {
  await page.keyboard.press('Tab')
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? '')
  expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedTag)
})

test('catalog exposes a main landmark and DsDialog lifecycle', async ({ page }) => {
  await openAppsHost(page)

  // The apps host (Catálogo default) provides page-level <main> landmarks.
  await expect(page.locator('main').first()).toBeVisible()

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
// Each demo app is reachable from the showcase via "Aplicações de exemplo", then
// the host's left sidebar. For every app we switch to its tab, smoke-assert a key
// element renders, then run an axe scan with WCAG AA contrast enabled asserting
// zero violations.

test('Industrial app renders and has no WCAG violations (axe)', async ({ page }) => {
  await openAppsHost(page)
  await switchToApp(page, 'Industrial')

  // Smoke: the ribbon tablist renders with its command tabs.
  const ribbonTablist = page.getByRole('tablist', { name: 'Studio commands' })
  await expect(ribbonTablist).toBeVisible()
  await expect(ribbonTablist.getByRole('tab', { name: 'Home' })).toBeVisible()

  await expectNoAxeViolations(page)
})

test('Users app renders and has no WCAG violations (axe)', async ({ page }) => {
  await openAppsHost(page)
  await switchToApp(page, 'Usuários')

  // Smoke: the users data table (DsCrudPage → DsTable) renders. It hydrates
  // asynchronously; the aria-label disambiguates it.
  await expect(page.getByRole('table', { name: 'Usuários' })).toBeVisible()

  await expectNoAxeViolations(page)
})

test('E-commerce app renders, cart drawer opens, no WCAG violations (axe)', async ({ page }) => {
  await openAppsHost(page)
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