/**
 * Library browser + accessibility gate over the living design-system catalog.
 *
 * The default sample host is the catalog (CatalogApp): a sticky top control bar,
 * a fixed side-menu TOC, the hero, fundamentals, component galleries and the
 * example screens. This gate proves the rendered DOM (real browser, not jsdom) is
 * accessible and that key Ds* interactions behave: landmarks, an axe scan,
 * keyboard focus, and a dialog open/close lifecycle. Scope is the sample host
 * only — no product, CMS, template, or network flows.
 */

import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // The catalog renders its hero first; wait for the title so the a11y scan
  // covers the fully-rendered catalog.
  await expect(page.getByRole('heading', { name: /Sistema de Design/ }).first()).toBeVisible()
})

test('catalog exposes a main landmark and a top-level heading', async ({ page }) => {
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

test('DsDialog opens from the Modais gallery and closes on Escape', async ({ page }) => {
  // The Modais section exposes size triggers ("Abrir · SM/MD/LG/XL/Full").
  await page.getByRole('button', { name: /Abrir.*MD/ }).first().click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})