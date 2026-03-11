/**
 * Visual regression coverage for the CMS engine.
 *
 * The suite is intentionally maintained on Windows because the existing
 * baseline snapshots in this repository are Windows-specific and the Quasar
 * rendering stack differs enough across platforms to create noisy diffs.
 */
import { expect, test, type Page } from '@playwright/test'

const CMS_URL = '/?cms=1'
const CMS_TENANT_PROFILES_STORAGE_KEY = 'ntk.cms.whiteLabel.profiles.v1'
const CMS_DRAFT_RECOVERY_STORAGE_KEY = 'ntk.cms.whiteLabel.recovery.v1'
const VISUAL_BASELINE_PLATFORM = process.platform === 'win32'

/**
 * Resets browser storage before each visual scenario.
 */
async function resetCmsState(page: Page): Promise<void> {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })
}

/**
 * Opens one drawer module using the visible module title.
 */
async function openDrawerModule(page: Page, moduleName: RegExp): Promise<void> {
  const moduleItem = page
    .locator('.ntk-app-shell__drawer .ntk-app-shell__item', {
      has: page.locator('.q-item__label', { hasText: moduleName }),
    })
    .first()

  await moduleItem.click()
}

/**
 * Opens the settings module and waits until the hero title is ready.
 */
async function openSettingsModule(page: Page): Promise<void> {
  await openDrawerModule(page, /^(Settings|Configuracoes)$/)
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Settings|Configuracoes)$/)
}

/**
 * Opens a specific settings tab.
 */
async function openSettingsTab(page: Page, tabName: RegExp): Promise<void> {
  const roleTab = page.getByRole('tab', { name: tabName }).first()
  if (await roleTab.count() > 0) {
    await roleTab.click()
    return
  }

  await page.locator('.q-tab', { hasText: tabName }).first().click()
}

/**
 * Selects one option in a Quasar select field identified by label.
 */
async function selectOptionByFieldLabel(page: Page, label: string, optionLabel: string): Promise<void> {
  const selectField = page
    .locator('.q-field', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
  await selectField.click()

  const optionByRole = page.getByRole('option', { name: optionLabel, exact: true }).first()
  if (await optionByRole.count() > 0) {
    await optionByRole.click()
    return
  }

  await page.locator('.q-menu:visible .q-item', { hasText: optionLabel }).first().click()
}

/**
 * Selects one theme preset in the settings colors tab.
 */
async function selectThemePreset(page: Page, presetName: string): Promise<void> {
  const selector = page
    .locator('.cms-theme-presets .q-select, .cms-theme-presets [aria-label="Theme preset"]')
    .first()
  await selector.click()

  const optionByRole = page.getByRole('option', { name: presetName, exact: true }).first()
  if (await optionByRole.count() > 0) {
    await optionByRole.click()
    return
  }

  await page.locator('.q-menu:visible .q-item', { hasText: presetName }).first().click()
}

/**
 * Resolves one CMS input by its visible field label.
 */
function cmsInputByLabel(page: Page, label: string) {
  return page
    .locator('.q-field', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
    .locator('input, textarea')
    .first()
}

/**
 * Forces one Quasar text control value when actionability is unstable.
 */
async function fillTextInputDirect(input: ReturnType<typeof cmsInputByLabel>, value: string): Promise<void> {
  await input.scrollIntoViewIfNeeded()
  await input.evaluate((element, nextValue) => {
    const target = element as HTMLInputElement | HTMLTextAreaElement
    const prototype = target instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value')

    descriptor?.set?.call(target, String(nextValue))
    target.dispatchEvent(new Event('input', { bubbles: true }))
    target.dispatchEvent(new Event('change', { bubbles: true }))
    target.blur()
  }, value)
}

/**
 * Waits until one autosave snapshot contains the expected app name.
 */
async function expectDraftRecoverySnapshot(page: Page, expectedAppName: string): Promise<void> {
  const activeProfileId = await page.evaluate((profilesKey: string) => {
    const raw = window.localStorage.getItem(profilesKey)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    return parsed?.activeProfileId ?? null
  }, CMS_TENANT_PROFILES_STORAGE_KEY)

  expect(activeProfileId).toBeTruthy()

  await expect.poll(async () => page.evaluate(({ recoveryKey, profileId }) => {
    const raw = window.localStorage.getItem(recoveryKey)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    return parsed?.entries?.[profileId]?.latest?.settings?.branding?.appName ?? null
  }, {
    recoveryKey: CMS_DRAFT_RECOVERY_STORAGE_KEY,
    profileId: String(activeProfileId),
  })).toBe(expectedAppName)
}

/**
 * Publishes one deterministic release so published preview mode has a stable
 * snapshot source.
 */
async function publishRelease(page: Page): Promise<void> {
  await openDrawerModule(page, /^Releases$/)
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^Releases$/)

  const releasesEditor = page.locator('.cms-releases__editor').first()
  await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
  await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
  await releasesEditor.locator('.q-btn', { hasText: 'Publish now' }).first().click()
  await expect(page.locator('.cms-release-item .q-chip', { hasText: 'published' }).first()).toBeVisible()
}

/**
 * Removes volatile UI details such as timestamps and active focus before a
 * screenshot is captured.
 */
async function stabilizeVisualState(page: Page): Promise<void> {
  await page.keyboard.press('Escape').catch(() => undefined)
  await page.evaluate(() => {
    window.scrollTo(0, 0)
    document.querySelectorAll('.cms-toolbar-card__saved-at, .cms-settings__saved-at').forEach(element => {
      element.textContent = 'Saved at 00:00:00'
    })
    document.querySelectorAll('.cms-toolbar-card__autosave .q-chip').forEach(element => {
      element.textContent = 'Auto-save state'
    })
    document.querySelectorAll('.cms-toolbar-card__autosave-meta').forEach((element, index) => {
      element.textContent = index === 0
        ? 'Latest auto-save: 00:00:00'
        : 'Recovery candidate: 00:00:00'
    })
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  })
  await expect(page.locator('.q-menu:visible')).toHaveCount(0)
}

/**
 * Captures one deterministic viewport-level screenshot.
 */
async function expectVisualSnapshot(page: Page, snapshotName: string): Promise<void> {
  await stabilizeVisualState(page)
  await expect(page).toHaveScreenshot(snapshotName, { caret: 'hide' })
}

test.describe('CMS engine visual regression', () => {
  test.skip(!VISUAL_BASELINE_PLATFORM, 'Visual baselines are maintained on Windows for deterministic rendering.')

  test.beforeEach(async ({ page }) => {
    await resetCmsState(page)
  })

  test('captures settings shell in light preset', async ({ page }) => {
    await page.goto(CMS_URL)
    await openSettingsModule(page)
    await openSettingsTab(page, /branding/i)
    await expectVisualSnapshot(page, 'cms-engine-settings-light-shell.png')
  })

  test('captures settings shell in dark preset', async ({ page }) => {
    await page.goto(CMS_URL)
    await openSettingsModule(page)
    await openSettingsTab(page, /colors/i)
    await selectThemePreset(page, 'Dark')
    await expectVisualSnapshot(page, 'cms-engine-settings-dark-shell.png')
  })

  test('captures settings shell in monochrome preset', async ({ page }) => {
    await page.goto(CMS_URL)
    await openSettingsModule(page)
    await openSettingsTab(page, /colors/i)
    await selectThemePreset(page, 'Monochrome')
    await expectVisualSnapshot(page, 'cms-engine-settings-monochrome-shell.png')
  })

  test('captures pages preview in published tablet pt-BR mode', async ({ page }) => {
    await page.goto(CMS_URL)
    await publishRelease(page)
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^Pages$/)
    await selectOptionByFieldLabel(page, 'Preview source', 'Published')
    await selectOptionByFieldLabel(page, 'Preview locale', 'Portuguese (Brazil)')
    await selectOptionByFieldLabel(page, 'Preview viewport', 'Tablet')
    await stabilizeVisualState(page)
    await expect(page.locator('.cms-pages__preview').first()).toHaveScreenshot(
      'cms-engine-pages-preview-published-tablet-ptbr.png',
      { caret: 'hide' }
    )
  })

  test('captures blocks preview in published mobile pt-BR mode', async ({ page }) => {
    await page.goto(CMS_URL)
    await publishRelease(page)
    await openDrawerModule(page, /^Blocks$/)

    const heroRow = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()

    await selectOptionByFieldLabel(page, 'Preview source', 'Published')
    await selectOptionByFieldLabel(page, 'Preview locale', 'Portuguese (Brazil)')
    await selectOptionByFieldLabel(page, 'Preview viewport', 'Mobile')
    await stabilizeVisualState(page)
    await expect(page.locator('.cms-blocks__preview').first()).toHaveScreenshot(
      'cms-engine-blocks-preview-published-mobile-ptbr.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 3 content-model authoring surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 2200 })
    await page.goto(CMS_URL)
    await openSettingsModule(page)
    await openSettingsTab(page, /content/i)

    await fillTextInputDirect(cmsInputByLabel(page, 'Content model name'), 'Campaign schema visual')
    await fillTextInputDirect(cmsInputByLabel(page, 'Content model description'), 'Phase 3 schema authoring regression')
    await fillTextInputDirect(cmsInputByLabel(page, 'Migration notes'), 'Phase 3 baseline')

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).last().locator('input, textarea').first(),
      'campaignHeadline'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).last().locator('input, textarea').first(),
      'Campaign headline'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field group' }) }).last().locator('input, textarea').first(),
      'Campaign'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field order' }) }).last().locator('input, textarea').first(),
      '1'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).last().locator('input, textarea').first(),
      'Launch campaign headline'
    )
    await page.getByRole('button', { name: /^(Save as preset|Salvar como preset)$/ }).first().click()
    await expect(page.locator('.cms-blocks-library .cms-reusable-block-row', { hasText: 'Campaign headline' }).first()).toBeVisible()

    await stabilizeVisualState(page)
    await expect(
      page.locator('.cms-config-section', {
        has: page.locator('.q-field__label', { hasText: /^(Content model library|Biblioteca de modelos de conteudo)$/ }),
      }).first()
    ).toHaveScreenshot('cms-engine-phase3-content-model-authoring.png', { caret: 'hide' })
  })

  test('captures phase 3 pages quick-start and command surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto(CMS_URL)
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^Pages$/)

    await selectOptionByFieldLabel(page, 'Quick command', 'Create and open blocks')
    await page.getByRole('textbox', { name: 'Search modules' }).fill('landing')

    await stabilizeVisualState(page)
    await expect(page).toHaveScreenshot('cms-engine-phase3-pages-quickstart-command-surface.png', { caret: 'hide' })
  })

  test('captures phase 3 autosave recovery toolbar state', async ({ page }) => {
    const recoveredName = 'Recovered Visual Tenant'

    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto(CMS_URL)
    await openSettingsModule(page)

    await fillTextInputDirect(cmsInputByLabel(page, 'Product name'), recoveredName)
    await expectDraftRecoverySnapshot(page, recoveredName)

    await page.getByRole('button', { name: /^(Reset tenant settings to defaults|Resetar configuracoes do tenant para o padrao)$/ }).first().click()
    await expect(page.getByRole('button', { name: /^(Restore auto-save|Restaurar auto-save)$/ }).first()).toBeEnabled()

    await stabilizeVisualState(page)
    await expect(page.locator('.cms-toolbar-card').first()).toHaveScreenshot(
      'cms-engine-phase3-settings-autosave-recovery-toolbar.png',
      { caret: 'hide' }
    )
  })
})