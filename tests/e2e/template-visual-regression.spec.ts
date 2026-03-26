/**
 * Visual regression coverage for the template showcase runtime (`?templates=1`).
 */
import { expect, test, type Page } from '@playwright/test'

const TEMPLATE_SHOWCASE_URL = '/?templates=1'
const VISUAL_BASELINE_PLATFORM = process.platform === 'win32'

/**
 * Resets browser storage to keep screenshots deterministic across runs.
 */
async function resetTemplatePreviewState(page: Page): Promise<void> {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })
}

/**
 * Removes transient focus/menu states before screenshot capture.
 */
async function stabilizeTemplatePreview(page: Page): Promise<void> {
  await page.keyboard.press('Escape').catch(() => undefined)
  await page.mouse.move(0, 0)
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  })
  await expect(page.locator('.q-menu:visible')).toHaveCount(0)
}

/**
 * Captures one deterministic surface-level screenshot by surface id.
 */
async function expectSurfaceSnapshot(
  page: Page,
  surfaceId: string,
  snapshotName: string
): Promise<void> {
  const surface = page.locator(`[data-template-surface="${surfaceId}"]`).first()
  await surface.scrollIntoViewIfNeeded()
  await expect(surface).toBeVisible()
  await stabilizeTemplatePreview(page)
  await expect(surface).toHaveScreenshot(snapshotName, { caret: 'hide' })
}

test.describe('Template showcase visual regression', () => {
  test.skip(!VISUAL_BASELINE_PLATFORM, 'Visual baselines are maintained on Windows for deterministic rendering.')

  test.beforeEach(async ({ page }) => {
    await resetTemplatePreviewState(page)
    await page.goto(TEMPLATE_SHOWCASE_URL)
    await expect(page.locator('.ntk-template-showcase__title')).toBeVisible()
  })

  test('captures template catalog hero and area summary', async ({ page }) => {
    await expectSurfaceSnapshot(page, 'catalog', 'template-showcase-catalog.png')
  })

  test('captures layout and dashboard template surface', async ({ page }) => {
    await expectSurfaceSnapshot(page, 'layout-dashboard', 'template-showcase-layout-dashboard.png')
  })

  test('captures CRUD and enterprise template surfaces', async ({ page }) => {
    await expectSurfaceSnapshot(page, 'crud-profile-placeholder', 'template-showcase-crud-profile-placeholder.png')
    await expectSurfaceSnapshot(page, 'editor-workbench', 'template-showcase-editor-workbench.png')
    await expectSurfaceSnapshot(page, 'enterprise', 'template-showcase-enterprise.png')
  })

  test('captures wiki and assistant template surface', async ({ page }) => {
    await expectSurfaceSnapshot(page, 'wiki', 'template-showcase-wiki.png')
  })
})