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
    // Contrast depends on the active theme tokens; it is governed at the token
    // layer. Keep this DOM/role/label-focused and deterministic.
    .disableRules(['color-contrast'])
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