/**
 * Tests/e2e/cms settings flow spec module.
 */

import { expect, test, type Locator, type Page } from '@playwright/test'

const CMS_TENANT_PROFILES_STORAGE_KEY = 'ntk.cms.whiteLabel.profiles.v1'
const CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY = 'ntk.cms.whiteLabel.settings.v1'
const CMS_DRAFT_RECOVERY_STORAGE_KEY = 'ntk.cms.whiteLabel.recovery.v1'
const DEFAULT_TENANT_NAME = 'Default Tenant'
const BLUE_TENANT_NAME = 'Blue Tenant'
const HEADER_ACTIONS_HOVER_LABEL = 'Header actions hover background (hover only)'
const SEARCH_BACKGROUND_LABEL = 'Search background'
const DARK_PRESET_NAME = 'Dark'
const SECTION_BADGE_LETTER_SPACING_LABEL = 'Section badge letter spacing'
const CTA_SUBTITLE_LINE_HEIGHT_LABEL = 'CTA subtitle line height'
const FOOTER_LINK_TITLE_LETTER_SPACING_LABEL = 'Footer link title letter spacing'
const IMAGE_ASSET_LABEL = 'Image asset'

const cmsAuthoringPalette = {
  drawerBackground: '#ffffff',
  drawerTextColor: '#5f6c7b',
  groupCaptionColor: '#6b7a8c',
  pageTextColor: '#16202b',
}

interface NotificationPalette {
  badgeColor: string
  badgeTextColor: string
  bellIconColor: string
  actionHoverColor: string
}

const defaultTenantPalette: NotificationPalette = {
  badgeColor: '#ef4444',
  badgeTextColor: '#ffffff',
  bellIconColor: '#64748b',
  actionHoverColor: '#9f1414',
}

const blueTenantPalette: NotificationPalette = {
  badgeColor: '#2563eb',
  badgeTextColor: '#ffffff',
  bellIconColor: '#1d4ed8',
  actionHoverColor: '#1d4ed8',
}

/**
 * Handles hex to rgb regex.
 */
function hexToRgbRegex(hexColor: string): RegExp {
  const normalized = hexColor.trim().replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map(item => `${item}${item}`).join('')
    : normalized

  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)

  return new RegExp(`rgb\\(${red},\\s*${green},\\s*${blue}\\)`, 'i')
}

/**
 * Normalizes media picker option labels where tests append the asset kind in
 * parentheses but the rendered picker splits kind into a separate badge.
 */
function normalizeMediaPickerOptionLabel(optionLabel: string): string {
  return optionLabel.replace(/\s+\([^)]+\)\s*$/, '').trim()
}

async function fillTextInput(input: Locator, value: string): Promise<void> {
  try {
    await input.click({ clickCount: 3, timeout: 5000 })
    await input.fill(value, { timeout: 5000 })
    await input.press('Tab')
    return
  } catch {
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
}

/**
 * Forces a Quasar text control value through the resolved locator when actionability is unstable.
 */
async function fillTextInputDirect(input: Locator, value: string): Promise<void> {
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
 * Lists current values for visible textbox controls sharing the same accessible name.
 */
async function listTextboxValues(page: Page, name: string): Promise<string[]> {
  return page
    .getByRole('textbox', { name })
    .evaluateAll(inputs => inputs.map(input => (input as HTMLInputElement).value))
}

/**
 * Selects the first option in a Quasar select field identified by label.
 */
async function selectFirstOptionByFieldLabel(page: Page, label: string): Promise<void> {
  const mediaPickerField = page
    .locator('.cms-media-asset-picker', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
  if (await mediaPickerField.count() > 0) {
    const mediaPickerControl = mediaPickerField.locator('.cms-media-asset-picker__select .q-field__control').first()
    await mediaPickerControl.scrollIntoViewIfNeeded()
    await mediaPickerControl.click()
    await page.locator('.q-menu:visible').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined)
  } else {
    const selectField = page
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: label }) })
      .first()
    await selectField.click()
  }

  const mediaPickerOption = page.locator('.q-menu:visible .cms-media-asset-picker__option').first()
  if (await mediaPickerOption.count() > 0) {
    await mediaPickerOption.click()
    return
  }

  const optionByRole = page.getByRole('option').first()
  if (await optionByRole.count() > 0) {
    await optionByRole.click()
    return
  }

  await page.locator('.q-menu:visible .q-item').first().click()
}

/**
 * Selects a specific option in a Quasar select field identified by label.
 */
async function selectOptionByFieldLabel(page: Page, label: string, optionLabel: string): Promise<void> {
  const mediaPickerField = page
    .locator('.cms-media-asset-picker', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
  if (await mediaPickerField.count() > 0) {
    const mediaPickerControl = mediaPickerField.locator('.cms-media-asset-picker__select .q-field__control').first()
    await mediaPickerControl.scrollIntoViewIfNeeded()
    await mediaPickerControl.click()
    await page.locator('.q-menu:visible').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined)

    const normalizedLabel = normalizeMediaPickerOptionLabel(optionLabel)
    const mediaPickerRoleOption = page.locator('.q-menu:visible [role=\"option\"]', { hasText: normalizedLabel }).first()
    if (await mediaPickerRoleOption.count() > 0) {
      await mediaPickerRoleOption.click()
      return
    }

    const mediaPickerOption = page.locator('.q-menu:visible .cms-media-asset-picker__option', { hasText: normalizedLabel }).first()
    if (await mediaPickerOption.count() > 0) {
      await mediaPickerOption.click()
      return
    }
  } else {
    const selectField = page
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: label }) })
      .first()
    await selectField.click()
  }

  const optionByRole = page.locator('.q-menu:visible [role="option"]', { hasText: optionLabel }).first()
  if (await optionByRole.count() > 0) {
    await optionByRole.click()
    return
  }

  await page.locator('.q-menu:visible .q-item', { hasText: optionLabel }).first().click()
}

/**
 * Selects a specific option in a Quasar select field identified by a multilingual label pattern.
 */
async function selectOptionByFieldLabelPattern(page: Page, label: RegExp, optionLabel: string): Promise<void> {
  const mediaPickerField = page
    .locator('.cms-media-asset-picker', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
  if (await mediaPickerField.count() > 0) {
    const mediaPickerControl = mediaPickerField.locator('.cms-media-asset-picker__select .q-field__control').first()
    await mediaPickerControl.scrollIntoViewIfNeeded()
    await mediaPickerControl.click()
    await page.locator('.q-menu:visible').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined)

    const normalizedLabel = normalizeMediaPickerOptionLabel(optionLabel)
    const mediaPickerRoleOption = page.locator('.q-menu:visible [role=\"option\"]', { hasText: normalizedLabel }).first()
    if (await mediaPickerRoleOption.count() > 0) {
      await mediaPickerRoleOption.click()
      return
    }

    const mediaPickerOption = page.locator('.q-menu:visible .cms-media-asset-picker__option', { hasText: normalizedLabel }).first()
    if (await mediaPickerOption.count() > 0) {
      await mediaPickerOption.click()
      return
    }
  } else {
    const selectField = page
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: label }) })
      .first()
    await selectField.click()
  }

  const optionByRole = page.locator('.q-menu:visible [role="option"]', { hasText: optionLabel }).first()
  if (await optionByRole.count() > 0) {
    await optionByRole.click()
    return
  }

  await page.locator('.q-menu:visible .q-item', { hasText: optionLabel }).first().click()
}

/**
 * Commits the currently focused Quasar select so action buttons receive the next keyboard/click event.
 */
async function commitFocusedSelect(page: Page): Promise<void> {
  await page.keyboard.press('Escape').catch(() => undefined)
  await page.keyboard.press('Tab')
  await expect(page.locator('.q-menu:visible')).toHaveCount(0)
}

/**
 * Handles cms input by label.
 */
function cmsInputByLabel(page: Page, label: string): Locator {
  return page
    .locator('.q-field', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
    .locator('input, textarea')
    .first()
}

/**
 * Handles color token input by label.
 */
function colorTokenInputByLabel(page: Page, label: string): Locator {
  return page
    .locator('.cms-color-field', { has: page.locator('label', { hasText: label }) })
    .first()
    .locator('.q-field input')
    .first()
}

/**
 * Handles settings toolbar action button by visible label.
 */
function settingsActionButton(page: Page, label: string): Locator {
  return page
    .locator('.cms-designer-card--settings')
    .getByRole('button', { name: new RegExp(label, 'i') })
    .first()
}

async function openDrawerModule(page: Page, moduleName: RegExp): Promise<void> {
  const moduleItem = page
    .locator('.ntk-app-shell__drawer .ntk-app-shell__item', {
      has: page.locator('.q-item__label', { hasText: moduleName }),
    })
    .first()

  await moduleItem.click()
}

async function openSettingsModule(page: Page): Promise<void> {
  await openDrawerModule(page, /^(Settings|Configuracoes)$/)
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Settings|Configuracoes)$/)
}

async function openSettingsTab(page: Page, tabName: RegExp): Promise<void> {
  const sidebarButton = page.getByRole('button', { name: tabName }).first()
  if (await sidebarButton.count() > 0) {
    await sidebarButton.click()
    return
  }

  const roleTab = page.getByRole('tab', { name: tabName }).first()
  if (await roleTab.count() > 0) {
    await roleTab.click()
    return
  }

  const fallbackTab = page.locator('.q-tab', { hasText: tabName }).first()
  await fallbackTab.click()
}

async function selectTenantProfile(page: Page, tenantName: string): Promise<void> {
  const selector = page
    .locator('[aria-label="Tenant profile selector"], .cms-toolbar-card__select, .cms-settings__tenant-select')
    .first()
  await selector.click()

  const optionByRole = page.getByRole('option', { name: tenantName, exact: true }).first()
  if (await optionByRole.count() > 0) {
    await optionByRole.click()
  } else {
    await page.locator('.q-menu .q-item', { hasText: tenantName }).first().click()
  }
}

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

  await page.locator('.q-menu .q-item', { hasText: presetName }).first().click()
}

async function expectDesignerShellStatus(page: Page, selector: string, options?: { requireRail?: boolean }): Promise<void> {
  await expect(page.locator(`${selector} .cms-designer-card__stage`).first()).toBeVisible()
  if (options?.requireRail !== false) {
    await expect(page.locator(`${selector} .cms-designer-card__rail`).first()).toBeVisible()
  }
  await expect(page.locator(`${selector} .cms-designer-card__statusbar`).first()).toBeVisible()
  await expect(page.locator(`${selector} .cms-designer-card__status-text`).first()).toBeVisible()
}

async function openCmsWorkspaceTab(page: Page, label: RegExp): Promise<void> {
  const tab = page.getByRole('tab', { name: label }).first()
  await expect(tab).toBeVisible()
  await tab.click()
  await expect(tab).toHaveAttribute('aria-selected', 'true')
}

async function enableAdvancedThemeOverrides(page: Page): Promise<void> {
  const advancedToggle = page.locator('.cms-settings__advanced-toggle .q-toggle').first()
  await expect(advancedToggle).toBeVisible()
  const isEnabled = (await advancedToggle.getAttribute('aria-checked')) === 'true'
  if (!isEnabled) {
    await advancedToggle.click()
  }
}

async function configureNotificationPalette(page: Page, palette: NotificationPalette): Promise<void> {
  await fillTextInput(colorTokenInputByLabel(page, 'Notification badge color'), palette.badgeColor)
  await fillTextInput(colorTokenInputByLabel(page, 'Notification badge text color'), palette.badgeTextColor)
  await fillTextInput(colorTokenInputByLabel(page, 'Notification bell icon color'), palette.bellIconColor)
  await fillTextInput(colorTokenInputByLabel(page, HEADER_ACTIONS_HOVER_LABEL), palette.actionHoverColor)
}

async function assertHeaderNotificationPalette(page: Page, palette: NotificationPalette): Promise<void> {
  const notificationAction = page.getByRole('button', { name: /notifications/i }).first()
  const notificationBadge = notificationAction.locator('.q-badge').first()
  const notificationIcon = notificationAction.locator('.q-icon').first()

  await expect(notificationBadge).toHaveCSS('background-color', hexToRgbRegex(palette.badgeColor))
  await expect(notificationBadge).toHaveCSS('color', hexToRgbRegex(palette.badgeTextColor))
  await expect(notificationIcon).toHaveCSS('color', hexToRgbRegex(palette.bellIconColor))
}

async function assertActionHoverPalette(page: Page, palette: NotificationPalette): Promise<void> {
  const expectedBackground = hexToRgbRegex(palette.actionHoverColor)

  const headerActions = page.locator('.ntk-app-shell__header .ntk-app-shell__actions .q-btn')
  const headerActionCount = await headerActions.count()
  expect(headerActionCount).toBeGreaterThan(0)
  for (let index = 0; index < headerActionCount; index += 1) {
    const action = headerActions.nth(index)
    await action.hover()
    await expect(action).toHaveCSS('background-color', expectedBackground)
  }

  const headerPreviewAction = page.locator('.cms-preview-header__action').first()
  await headerPreviewAction.hover()
  await expect(headerPreviewAction).toHaveCSS('background-color', expectedBackground)

  const notificationPreviewAction = page.locator('.cms-notification-actions-preview__action').first()
  await notificationPreviewAction.hover()
  await expect(notificationPreviewAction).toHaveCSS('background-color', expectedBackground)
}

async function expectTenantSnapshots(page: Page, snapshotId: string): Promise<void> {
  await expect(page.locator('.ntk-app-shell__header')).toHaveScreenshot(`cms-header-${snapshotId}.png`)

  const notificationGroup = page
    .locator('.cms-color-group', { has: page.locator('.cms-section-header strong', { hasText: 'Notifications and Actions' }) })
    .first()

  await expect(notificationGroup).toHaveScreenshot(`cms-notifications-${snapshotId}.png`)
}

test.describe('CMS settings white-label flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      window.localStorage.clear()
      window.sessionStorage.clear()
    })
  })

  test('renders the designer shell chrome across Settings, Pages and Blocks', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)

    const settingsShell = page.locator('.cms-designer-card--settings').first()
    await expect(settingsShell).toBeVisible()
    await expectDesignerShellStatus(page, '.cms-designer-card--settings')
    await expect(settingsShell.locator('.cms-designer-card__toolbar-header').first()).toBeVisible()
    await expect(settingsShell.locator('.cms-designer-card__toolbar-row--actions').first()).toBeVisible()
    await expect(settingsShell.locator('.cms-designer-card__toolbar-row--info').first()).toBeVisible()
    await expect(settingsShell.locator('.cms-designer-card__info-strip').first()).toContainText(/Default Tenant/i)
    await expect(settingsShell.locator('.cms-designer-card__toolbar-group--preview').first()).toContainText(/Preview/i)
    await expect(settingsShell.locator('.cms-designer-card__ruler').first()).toBeVisible()
    const workspaceMetrics = await page.evaluate(() => {
      const workspace = document.querySelector('.ntk-app-shell__workspace') as HTMLElement | null
      const shellPage = document.querySelector('.ntk-app-shell__page') as HTMLElement | null
      if (!workspace || !shellPage) {
        return null
      }

      const workspaceRect = workspace.getBoundingClientRect()
      const shellPageRect = shellPage.getBoundingClientRect()
      const workspaceStyles = window.getComputedStyle(workspace)

      return {
        width: workspaceRect.width,
        shellPageWidth: shellPageRect.width,
        maxWidth: workspaceStyles.maxWidth,
        marginLeft: workspaceStyles.marginLeft,
        marginRight: workspaceStyles.marginRight,
      }
    })
    expect(workspaceMetrics).not.toBeNull()
    expect(workspaceMetrics?.maxWidth).toBe('none')
    expect(workspaceMetrics?.marginLeft).toBe('0px')
    expect(workspaceMetrics?.marginRight).toBe('0px')
    expect(Math.abs((workspaceMetrics?.shellPageWidth ?? 0) - (workspaceMetrics?.width ?? 0))).toBeLessThanOrEqual(40)

    const contentWorkbenchButton = page
      .locator('.cms-settings__sidebar')
      .getByRole('button', { name: /content/i })
      .first()
    await expect(contentWorkbenchButton).toBeVisible()
    await contentWorkbenchButton.click()
    await expect(contentWorkbenchButton).toHaveClass(/cms-designer-card__nav-button--active/)
    await expect(page.locator('.cms-settings__rail .cms-designer-card__rail-card').first()).toContainText(
      /(Designer rail|Rail do designer)/i
    )

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Pages|Paginas)$/)
    await expectDesignerShellStatus(page, '.cms-designer-card--pages')
    await expect(page.locator('.cms-designer-card--pages .cms-designer-card__toolbar-row--actions').first()).toBeVisible()
    await expect(page.locator('.cms-designer-card--pages .cms-designer-card__toolbar-row--info').first()).toBeVisible()
    await expect(page.locator('.cms-designer-card--pages .cms-designer-card__toolbar-header').first()).toBeVisible()
    await expect(page.locator('.cms-designer-card--pages .cms-designer-card__ruler').first()).toBeVisible()
    await expect(page.locator('.cms-pages__sidebar .cms-designer-card__metrics').first()).toContainText(
      /(Template|Pages in tenant|Paginas no tenant)/i
    )
    await expect(page.locator('.cms-pages__sidebar .cms-pages__sidebar-section').first()).toContainText(
      /(Workspace actions|Acoes do workspace)/i
    )
    await expect(page.locator('.cms-pages__rail .cms-designer-card__rail-card').first()).toContainText(
      /(Reusable content rail|Rail de conteudo reutilizavel)/i
    )

    await openDrawerModule(page, /^(Blocks|Blocos)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await expectDesignerShellStatus(page, '.cms-designer-card--blocks')
    await expect(page.locator('.cms-designer-card--blocks .cms-designer-card__toolbar-row--actions').first()).toBeVisible()
    await expect(page.locator('.cms-designer-card--blocks .cms-designer-card__toolbar-row--info').first()).toBeVisible()
    await expect(page.locator('.cms-designer-card--blocks .cms-designer-card__toolbar-header').first()).toBeVisible()
    await expect(page.locator('.cms-designer-card--blocks .cms-designer-card__ruler').first()).toBeVisible()
    await expect(page.locator('.cms-blocks__sidebar .cms-designer-card__metrics').first()).toContainText(
      /(Page|Pagina)/i
    )
    await expect(page.locator('.cms-blocks__rail .cms-designer-card__rail-card').last()).toContainText(
      /(Selection rail|Rail da selecao)/i
    )
  })

  test('exposes accessible controls for settings toolbar and tabs', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)

    await expect(page.locator('.cms-toolbar-card__saved-at[role="status"][aria-live="polite"], .cms-settings__saved-at[role="status"][aria-live="polite"]')).toBeVisible()
    await expect(page.locator('[aria-label="Tenant profile selector"]')).toBeVisible()
    await expect(page.locator('[aria-label="Create tenant profile"]').first()).toBeVisible()
    await expect(page.locator('[aria-label="Export active tenant as JSON"]').first()).toBeVisible()
    await expect(page.locator('[aria-label="Import tenant settings from JSON"]').first()).toBeVisible()
    await expect(page.locator('.cms-settings__sidebar .cms-designer-card__nav-button')).toHaveCount(7)
    await expect(page.locator('input[aria-label="Import tenant JSON file"]')).toBeAttached()

    const openButton = settingsActionButton(page, 'open')
    const createTenantButton = page.locator('[aria-label="Create tenant profile"]').first()
    await openButton.focus()
    await page.keyboard.press('Tab')
    await expect(createTenantButton).toBeFocused()

    await openSettingsTab(page, /colors/i)
    await expect(page.locator('input[type="color"][aria-label$="picker"]').first()).toBeVisible()
  })

  test('keeps the authoring shell readable after applying the dark preset', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /colors/i)
    await selectThemePreset(page, DARK_PRESET_NAME)

    const drawer = page.locator('.ntk-app-shell__drawer').first()
    await expect(drawer).toHaveCSS('background-color', hexToRgbRegex(cmsAuthoringPalette.drawerBackground))
    await expect(drawer).toHaveCSS('color', hexToRgbRegex(cmsAuthoringPalette.drawerTextColor))

    const inactiveCaption = page
      .locator('.ntk-app-shell__item:not(.ntk-app-shell__item--active) .q-item__label--caption')
      .first()
    await expect(inactiveCaption).toHaveCSS('color', hexToRgbRegex(cmsAuthoringPalette.groupCaptionColor))

    const titleApp = page.locator('.ntk-app-shell__header .ntk-app-shell__title-app').first()
    await expect(titleApp).toHaveCSS('color', hexToRgbRegex(cmsAuthoringPalette.pageTextColor))

    const firstFieldInput = page.locator('.cms-shell-page .q-field__native, .cms-shell-page .q-field__input').first()
    await expect(firstFieldInput).toHaveCSS('color', hexToRgbRegex(cmsAuthoringPalette.pageTextColor))
  })

  test('opens Pages preview in the workspace tab from the designer toolbar', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)

    await page.locator('.cms-designer-card--pages .cms-designer-card__toolbar-group--preview .q-btn').first().click()
    await expect(page.getByRole('tab', { name: /^(Preview)$/i }).first()).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('.cms-pages__preview').first()).toBeVisible()
  })

  test('persists advanced landing layout tokens and applies them on landing runtime', async ({ page }) => {
    const tokenValues = {
      sectionBadgeLetterSpacing: '0.12em',
      ctaSubtitleLineHeight: '1.95',
      footerLinkTitleLetterSpacing: '0.18em',
    }

    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /colors/i)
    await enableAdvancedThemeOverrides(page)

    await fillTextInput(colorTokenInputByLabel(page, SECTION_BADGE_LETTER_SPACING_LABEL), tokenValues.sectionBadgeLetterSpacing)
    await fillTextInput(colorTokenInputByLabel(page, CTA_SUBTITLE_LINE_HEIGHT_LABEL), tokenValues.ctaSubtitleLineHeight)
    await fillTextInput(colorTokenInputByLabel(page, FOOTER_LINK_TITLE_LETTER_SPACING_LABEL), tokenValues.footerLinkTitleLetterSpacing)
    await settingsActionButton(page, 'Save').click()

    await expect(colorTokenInputByLabel(page, SECTION_BADGE_LETTER_SPACING_LABEL)).toHaveValue(tokenValues.sectionBadgeLetterSpacing)
    await expect(colorTokenInputByLabel(page, CTA_SUBTITLE_LINE_HEIGHT_LABEL)).toHaveValue(tokenValues.ctaSubtitleLineHeight)
    await expect(colorTokenInputByLabel(page, FOOTER_LINK_TITLE_LETTER_SPACING_LABEL)).toHaveValue(tokenValues.footerLinkTitleLetterSpacing)

    await page.reload()
    await openSettingsModule(page)
    await openSettingsTab(page, /colors/i)
    await enableAdvancedThemeOverrides(page)
    await expect(colorTokenInputByLabel(page, SECTION_BADGE_LETTER_SPACING_LABEL)).toHaveValue(tokenValues.sectionBadgeLetterSpacing)
    await expect(colorTokenInputByLabel(page, CTA_SUBTITLE_LINE_HEIGHT_LABEL)).toHaveValue(tokenValues.ctaSubtitleLineHeight)
    await expect(colorTokenInputByLabel(page, FOOTER_LINK_TITLE_LETTER_SPACING_LABEL)).toHaveValue(tokenValues.footerLinkTitleLetterSpacing)

    const persistedLayoutTokens = await page.evaluate((storageKey: string) => {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        return null
      }
      const parsed = JSON.parse(raw) as {
        activeProfileId: string
        profiles: Array<{
          id: string
          settings: {
            theme: {
              landingLayoutSectionBadgeLetterSpacing?: string
              landingLayoutCtaSubtitleLineHeight?: string
              landingLayoutFooterLinkTitleLetterSpacing?: string
            }
          }
        }>
      }
      const activeProfile = parsed.profiles.find(profile => profile.id === parsed.activeProfileId) ?? parsed.profiles[0]
      return activeProfile?.settings.theme ?? null
    }, CMS_TENANT_PROFILES_STORAGE_KEY)

    expect(persistedLayoutTokens).not.toBeNull()
    expect(persistedLayoutTokens?.landingLayoutSectionBadgeLetterSpacing).toBe(tokenValues.sectionBadgeLetterSpacing)
    expect(persistedLayoutTokens?.landingLayoutCtaSubtitleLineHeight).toBe(tokenValues.ctaSubtitleLineHeight)
    expect(persistedLayoutTokens?.landingLayoutFooterLinkTitleLetterSpacing).toBe(tokenValues.footerLinkTitleLetterSpacing)

    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('.cms-mode-btn')).toBeVisible()
  })

  test('edits, saves, reloads and preserves notification tokens by tenant', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)

    await openSettingsTab(page, /branding/i)
    await fillTextInput(cmsInputByLabel(page, 'Product name'), 'Default Tenant CMS')
    await settingsActionButton(page, 'Save').click()
    await expect(page.locator('.cms-toolbar-card__saved-at, .cms-settings__saved-at')).toContainText('Saved at')

    await openSettingsTab(page, /colors/i)
    await configureNotificationPalette(page, defaultTenantPalette)
    await expect(colorTokenInputByLabel(page, SEARCH_BACKGROUND_LABEL)).not.toHaveValue(defaultTenantPalette.actionHoverColor)
    await settingsActionButton(page, 'Save').click()
    await assertHeaderNotificationPalette(page, defaultTenantPalette)
    await assertActionHoverPalette(page, defaultTenantPalette)
    await expectTenantSnapshots(page, 'default-tenant')

    page.once('dialog', dialog => dialog.accept(BLUE_TENANT_NAME))
    await page.locator('[aria-label="Create tenant profile"]').first().click()
    await openSettingsModule(page)

    await openSettingsTab(page, /branding/i)
    await fillTextInput(cmsInputByLabel(page, 'Product name'), 'Blue Tenant CMS')
    await openSettingsTab(page, /colors/i)
    await configureNotificationPalette(page, blueTenantPalette)
    await expect(colorTokenInputByLabel(page, SEARCH_BACKGROUND_LABEL)).not.toHaveValue(blueTenantPalette.actionHoverColor)
    await settingsActionButton(page, 'Save').click()
    await assertHeaderNotificationPalette(page, blueTenantPalette)
    await assertActionHoverPalette(page, blueTenantPalette)
    await expectTenantSnapshots(page, 'blue-tenant')

    await selectTenantProfile(page, DEFAULT_TENANT_NAME)
    await openSettingsModule(page)
    await openSettingsTab(page, /branding/i)
    await expect(cmsInputByLabel(page, 'Product name')).toHaveValue('Default Tenant CMS')
    await openSettingsTab(page, /colors/i)
    await expect(colorTokenInputByLabel(page, 'Notification badge color')).toHaveValue(defaultTenantPalette.badgeColor)
    await expect(colorTokenInputByLabel(page, HEADER_ACTIONS_HOVER_LABEL)).toHaveValue(defaultTenantPalette.actionHoverColor)
    await assertHeaderNotificationPalette(page, defaultTenantPalette)
    await assertActionHoverPalette(page, defaultTenantPalette)

    await page.reload()
    await openSettingsModule(page)
    await openSettingsTab(page, /branding/i)
    await expect(cmsInputByLabel(page, 'Product name')).toHaveValue('Default Tenant CMS')

    await selectTenantProfile(page, BLUE_TENANT_NAME)
    await openSettingsModule(page)
    await openSettingsTab(page, /branding/i)
    await expect(cmsInputByLabel(page, 'Product name')).toHaveValue('Blue Tenant CMS')
    await openSettingsTab(page, /colors/i)
    await expect(colorTokenInputByLabel(page, 'Notification badge color')).toHaveValue(blueTenantPalette.badgeColor)
    await expect(colorTokenInputByLabel(page, HEADER_ACTIONS_HOVER_LABEL)).toHaveValue(blueTenantPalette.actionHoverColor)
    await assertHeaderNotificationPalette(page, blueTenantPalette)
    await assertActionHoverPalette(page, blueTenantPalette)

    const persistedState = await page.evaluate((storageKey: string) => {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        return null
      }
      return JSON.parse(raw) as {
        profiles: Array<{
          name: string
          settings: {
            theme: { notificationBadgeColor: string; actionHoverBackground: string }
            governance: { workflow: { status: string; version: number } }
          }
        }>
      }
    }, CMS_TENANT_PROFILES_STORAGE_KEY)

    expect(persistedState).not.toBeNull()
    expect(persistedState?.profiles).toHaveLength(2)

    const paletteByTenant = Object.fromEntries(
      persistedState?.profiles.map(profile => [profile.name, profile.settings.theme.notificationBadgeColor]) ?? []
    ) as Record<string, string>
    const actionHoverByTenant = Object.fromEntries(
      persistedState?.profiles.map(profile => [profile.name, profile.settings.theme.actionHoverBackground]) ?? []
    ) as Record<string, string>
    const governanceByTenant = Object.fromEntries(
      persistedState?.profiles.map(profile => [profile.name, profile.settings.governance.workflow]) ?? []
    ) as Record<string, { status: string; version: number }>

    expect(paletteByTenant[DEFAULT_TENANT_NAME]).toBe(defaultTenantPalette.badgeColor)
    expect(paletteByTenant[BLUE_TENANT_NAME]).toBe(blueTenantPalette.badgeColor)
    expect(actionHoverByTenant[DEFAULT_TENANT_NAME]).toBe(defaultTenantPalette.actionHoverColor)
    expect(actionHoverByTenant[BLUE_TENANT_NAME]).toBe(blueTenantPalette.actionHoverColor)
    expect(governanceByTenant[DEFAULT_TENANT_NAME]?.version).toBeGreaterThanOrEqual(2)
    expect(governanceByTenant[BLUE_TENANT_NAME]?.version).toBeGreaterThanOrEqual(2)
    expect(governanceByTenant[DEFAULT_TENANT_NAME]?.status).toBe('draft')
    expect(governanceByTenant[BLUE_TENANT_NAME]?.status).toBe('draft')
  })

  test('imports and exports domain snapshots independently', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)

    const readStoredSettings = async (): Promise<Record<string, unknown> | null> => {
      return page.evaluate((storageKey: string) => {
        const raw = window.localStorage.getItem(storageKey)
        if (!raw) {
          return null
        }

        const parsed = JSON.parse(raw)
        return parsed?.settings ?? null
      }, CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY)
    }

    const initialSettings = await page.evaluate((storageKey: string) => {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)
      return parsed?.settings ?? null
    }, CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY)

    expect(initialSettings).not.toBeNull()
    const initialMediaName = initialSettings?.mediaAssets?.[0]?.name ?? null
    const initialEnvironment = initialSettings?.releases?.activeEnvironment ?? 'dev'

    const contentFileName = await page.evaluate(() => {
      const exportButton = document.querySelector(
        'button[aria-label="Exportar pacote do dominio selecionado"], button[aria-label="Export selected domain package"]'
      )

      if (!exportButton) {
        return null
      }

      ;(exportButton as HTMLButtonElement).click()
      return (window as Window & {
        __NTK_CMS_LAST_DOWNLOAD__?: { fileName: string }
      }).__NTK_CMS_LAST_DOWNLOAD__?.fileName ?? null
    })
    expect(contentFileName).toMatch(/^ntk-cms-content-/i)

    const importedContentName = 'Imported Content Tenant'
    const contentPayload = {
      kind: 'ntk-cms-domain-snapshot',
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: {
        id: 'source-content',
        name: 'Source Content',
      },
      domain: 'content',
      snapshot: {
        branding: {
          ...initialSettings?.branding,
          appName: importedContentName,
        },
        layout: initialSettings?.layout,
        content: initialSettings?.content,
        pages: initialSettings?.pages,
        reusableSections: initialSettings?.reusableSections,
        reusableBlocks: initialSettings?.reusableBlocks,
        authoredContentModels: initialSettings?.authoredContentModels,
        authoredContentModelFieldPresets: initialSettings?.authoredContentModelFieldPresets,
        authoredBlockPresets: initialSettings?.authoredBlockPresets,
        themePresetId: initialSettings?.themePresetId,
        themePresetOverrides: initialSettings?.themePresetOverrides,
        theme: initialSettings?.theme,
        navGroups: initialSettings?.navGroups,
        items: initialSettings?.items,
        toolbarActions: initialSettings?.toolbarActions,
        governance: initialSettings?.governance,
      },
    }

    await page
      .locator('input[type="file"][aria-label="Importar arquivo JSON do dominio"], input[type="file"][aria-label="Import domain JSON file"]')
      .setInputFiles({
        name: 'content-domain.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(contentPayload, null, 2)),
      })

    await expect.poll(async () => {
      const parsed = await readStoredSettings()
      if (!parsed) {
        return null
      }

      return {
        appName: (parsed.branding as Record<string, unknown> | undefined)?.appName ?? null,
        mediaName: Array.isArray(parsed.mediaAssets) ? (parsed.mediaAssets[0] as Record<string, unknown> | undefined)?.name ?? null : null,
        activeEnvironment: (parsed.releases as Record<string, unknown> | undefined)?.activeEnvironment ?? null,
      }
    }).toEqual({
      appName: importedContentName,
      mediaName: initialMediaName,
      activeEnvironment: initialEnvironment,
    })

    const afterContentImport = await readStoredSettings()

    await selectOptionByFieldLabelPattern(page, /^(Domain package|Pacote de dominio)$/, 'Assets')
    const assetsFileName = await page.evaluate(() => {
      const exportButton = document.querySelector(
        'button[aria-label="Exportar pacote do dominio selecionado"], button[aria-label="Export selected domain package"]'
      )

      if (!exportButton) {
        return null
      }

      ;(exportButton as HTMLButtonElement).click()
      return (window as Window & {
        __NTK_CMS_LAST_DOWNLOAD__?: { fileName: string }
      }).__NTK_CMS_LAST_DOWNLOAD__?.fileName ?? null
    })
    expect(assetsFileName).toMatch(/^ntk-cms-assets-/i)

    const importedAssetName = 'Imported Asset Domain'
    const assetsPayload = {
      kind: 'ntk-cms-domain-snapshot',
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: {
        id: 'source-assets',
        name: 'Source Assets',
      },
      domain: 'assets',
      snapshot: {
        mediaAssets: Array.isArray(afterContentImport?.mediaAssets) && afterContentImport.mediaAssets.length > 0
          ? afterContentImport.mediaAssets.map((asset: Record<string, unknown>, index: number) => (
            index === 0
              ? {
                ...asset,
                name: importedAssetName,
              }
              : asset
          ))
          : [],
      },
    }

    await page
      .locator('input[type="file"][aria-label="Importar arquivo JSON do dominio"], input[type="file"][aria-label="Import domain JSON file"]')
      .setInputFiles({
        name: 'assets-domain.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(assetsPayload, null, 2)),
      })

    await expect.poll(async () => {
      const parsed = await readStoredSettings()
      if (!parsed) {
        return null
      }

      return {
        appName: (parsed.branding as Record<string, unknown> | undefined)?.appName ?? null,
        mediaName: Array.isArray(parsed.mediaAssets) ? (parsed.mediaAssets[0] as Record<string, unknown> | undefined)?.name ?? null : null,
        activeEnvironment: (parsed.releases as Record<string, unknown> | undefined)?.activeEnvironment ?? null,
      }
    }).toEqual({
      appName: importedContentName,
      mediaName: importedAssetName,
      activeEnvironment: initialEnvironment,
    })

    const afterAssetImport = await readStoredSettings()

    await selectOptionByFieldLabelPattern(page, /^(Domain package|Pacote de dominio)$/, 'Releases')
    const releasesFileName = await page.evaluate(() => {
      const exportButton = document.querySelector(
        'button[aria-label="Exportar pacote do dominio selecionado"], button[aria-label="Export selected domain package"]'
      )

      if (!exportButton) {
        return null
      }

      ;(exportButton as HTMLButtonElement).click()
      return (window as Window & {
        __NTK_CMS_LAST_DOWNLOAD__?: { fileName: string }
      }).__NTK_CMS_LAST_DOWNLOAD__?.fileName ?? null
    })
    expect(releasesFileName).toMatch(/^ntk-cms-releases-/i)

    const releasesPayload = {
      kind: 'ntk-cms-domain-snapshot',
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: {
        id: 'source-releases',
        name: 'Source Releases',
      },
      domain: 'releases',
      snapshot: {
        releases: {
          ...afterAssetImport?.releases,
          activeEnvironment: 'production',
        },
      },
    }

    await page
      .locator('input[type="file"][aria-label="Importar arquivo JSON do dominio"], input[type="file"][aria-label="Import domain JSON file"]')
      .setInputFiles({
        name: 'releases-domain.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(releasesPayload, null, 2)),
      })

    await expect.poll(async () => {
      const parsed = await readStoredSettings()
      if (!parsed) {
        return null
      }

      return {
        appName: (parsed.branding as Record<string, unknown> | undefined)?.appName ?? null,
        mediaName: Array.isArray(parsed.mediaAssets) ? (parsed.mediaAssets[0] as Record<string, unknown> | undefined)?.name ?? null : null,
        activeEnvironment: (parsed.releases as Record<string, unknown> | undefined)?.activeEnvironment ?? null,
      }
    }).toEqual({
      appName: importedContentName,
      mediaName: importedAssetName,
      activeEnvironment: 'production',
    })
  })

  test('restores the latest autosave after a destructive reset', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)

    const activeProfileId = await page.evaluate((profilesKey: string) => {
      const raw = window.localStorage.getItem(profilesKey)
      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)
      return parsed?.activeProfileId ?? null
    }, CMS_TENANT_PROFILES_STORAGE_KEY)

    expect(activeProfileId).toBeTruthy()

    const productNameInput = cmsInputByLabel(page, 'Product name')
    const recoveredName = 'Recovered Draft Tenant'
    await fillTextInput(productNameInput, recoveredName)

    await expect.poll(async () => page.evaluate(({ recoveryKey, profileId }: { recoveryKey: string; profileId: string }) => {
      const raw = window.localStorage.getItem(recoveryKey)
      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)
      return parsed?.entries?.[profileId]?.latest?.settings?.branding?.appName ?? null
    }, {
      recoveryKey: CMS_DRAFT_RECOVERY_STORAGE_KEY,
      profileId: String(activeProfileId),
    })).toBe(recoveredName)

    await page.getByRole('button', { name: /^(Reset tenant settings to defaults|Resetar configuracoes do tenant para o padrao)$/ }).first().click()
    await expect(productNameInput).not.toHaveValue(recoveredName)

    await page.getByRole('button', { name: /^(Restore auto-save|Restaurar auto-save)$/ }).first().click()
    await expect(productNameInput).toHaveValue(recoveredName)
  })

  test('navigates from pages to blocks and keeps block props editors in sync', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    const sectionOpenBlocksButton = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="header"]') })
      .first()
      .locator('.q-btn', { hasText: 'Open blocks' })
      .first()

    if (await sectionOpenBlocksButton.count() > 0) {
      await sectionOpenBlocksButton.click()
    } else {
      await page
        .locator('.cms-page-item__actions .q-btn', { hasText: 'Open blocks' })
        .first()
        .click()
    }

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Blocks')
    const blockSelectButton = page
      .locator('.cms-block-row .q-btn', { hasText: 'Select' })
      .first()
    await expect(blockSelectButton).toBeVisible()
    await blockSelectButton.click()
    await expect(page.locator('.cms-block-row--active').first()).toBeVisible()

    const structuredTextInput = page
      .locator('.cms-blocks-fields .q-field', {
        has: page.locator('input[type="text"]:not([readonly]), textarea'),
      })
      .first()
      .locator('input[type="text"]:not([readonly]), textarea')
      .first()
    const blockPropsInput = cmsInputByLabel(page, 'Block props JSON')
    await expect(structuredTextInput).toBeVisible()
    await expect(blockPropsInput).toBeVisible()

    const structuredMarker = 'Structured Sync Marker'
    const jsonMarker = 'JSON Sync Marker'
    await fillTextInput(structuredTextInput, structuredMarker)
    await expect(blockPropsInput).toHaveValue(new RegExp(structuredMarker))

    const currentProps = await blockPropsInput.inputValue()
    const updatedProps = currentProps.replace(structuredMarker, jsonMarker)
    expect(updatedProps).not.toBe(currentProps)

    await fillTextInput(blockPropsInput, updatedProps)
    await page
      .locator('.cms-blocks-props__actions .q-btn', { hasText: 'Apply props' })
      .first()
      .click()

    await expect(structuredTextInput).toHaveValue(jsonMarker)
    await expect(blockPropsInput).toHaveValue(new RegExp(jsonMarker))

    const reusableName = 'Reusable Hero QA'
    const reusableDescription = 'Saved from E2E regression'
    const blockCountBeforeReusableInsert = await page.locator('.cms-block-row').count()

    await fillTextInput(cmsInputByLabel(page, 'Reusable block name'), reusableName)
    await fillTextInput(cmsInputByLabel(page, 'Reusable description'), reusableDescription)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save selection' }).first().click()

    await expect(page.locator('.cms-reusable-block-row', { hasText: reusableName }).first()).toBeVisible()
    await page.getByRole('button', { name: /^(Insert detached|Inserir desvinculado)$/ }).first().click()
    await expect(page.locator('.cms-block-row')).toHaveCount(blockCountBeforeReusableInsert + 1)
  })

  test('imports and exports schema packages independently from authored page content', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)

    const initialSettings = await page.evaluate((storageKey: string) => {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)
      return parsed?.settings ?? null
    }, CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY)

    expect(initialSettings).not.toBeNull()
    const initialPageTitle = initialSettings?.pages?.[0]?.title ?? null

    await page.getByRole('button', { name: /^(Export schema package|Exportar pacote de schema)$/ }).first().click()
    let exportFileName: string | null = null
    await expect.poll(async () => {
      exportFileName = await page.evaluate(() => (
        window as Window & {
          __NTK_CMS_LAST_DOWNLOAD__?: { fileName: string }
        }
      ).__NTK_CMS_LAST_DOWNLOAD__?.fileName ?? null)

      return exportFileName
    }).not.toBeNull()
    expect(exportFileName).toMatch(/^ntk-cms-schema-/i)

    const schemaPayload = {
      kind: 'ntk-cms-schema-package',
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: {
        id: 'source-schema',
        name: 'Source Schema',
      },
      snapshot: {
        authoredContentModels: [
          {
            id: 'authored:imported-schema-package',
            name: 'Imported schema package',
            description: 'Imported schema',
            defaultPageTitle: 'Imported schema page',
            defaultPageDescription: '',
            defaultPagePathPrefix: '/imported-schema',
            allowedPresets: ['hero', 'footer'],
            requiredPresets: [],
            starterPresets: ['hero', 'footer'],
            recommendedPresets: ['hero'],
            maxSections: null,
            sectionPresetLimits: {},
            fields: [],
          },
        ],
        authoredContentModelFieldPresets: [],
        authoredBlockPresets: [],
      },
    }

    await page
      .locator('input[type=\"file\"][aria-label=\"Importar arquivo JSON do schema\"], input[type=\"file\"][aria-label=\"Import schema JSON file\"]')
      .setInputFiles({
        name: 'schema-package.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(schemaPayload, null, 2)),
      })

    await expect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: /^(Content model library|Biblioteca de modelos de conteudo)$/ }) })
    ).toContainText('Imported schema package')

    await expect.poll(async () => {
      const parsed = await page.evaluate((storageKey: string) => {
        const raw = window.localStorage.getItem(storageKey)
        if (!raw) {
          return null
        }

        const stored = JSON.parse(raw)
        return stored?.settings ?? null
      }, CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY)

      return {
        firstPageTitle: parsed?.pages?.[0]?.title ?? null,
        authoredModelName: parsed?.authoredContentModels?.[0]?.name ?? null,
      }
    }).toEqual({
      firstPageTitle: initialPageTitle,
      authoredModelName: 'Imported schema package',
    })
  })

  test('supports content models and section presets in pages builder', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    const initialSectionRows = page.locator('.cms-page-section-row')
    const initialCount = await initialSectionRows.count()

    await selectOptionByFieldLabel(page, 'Content model', 'Marketing page')
    await expect(page.locator('.cms-page-preview__chips .q-chip', { hasText: 'Marketing page' }).first()).toBeVisible()

    await selectOptionByFieldLabel(page, 'Section preset', 'Metrics')
    await page.locator('.cms-page-item__sections-actions .q-btn', { hasText: 'Add section' }).first().click()

    await expect.poll(async () => listTextboxValues(page, 'Section ID')).toContain('metrics')
    await expect(initialSectionRows).toHaveCount(initialCount + 1)
  })

  test('saves reusable sections and reinserts them in pages builder', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    const sectionRows = page.locator('.cms-page-section-row')
    const initialCount = await sectionRows.count()
    const heroSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero"]') })
      .first()

    await heroSectionRow.locator('.q-btn', { hasText: 'Save reusable' }).first().click()
    await expect(page.locator('.cms-pages__reusable-library .cms-reusable-block-row', { hasText: 'Main Landing · Hero' }).first()).toBeVisible()

    await page.getByRole('button', { name: /^(Insert detached|Inserir desvinculado)$/ }).first().click()
    await expect.poll(async () => listTextboxValues(page, 'Section ID')).toContain('hero-2')
    await expect(sectionRows).toHaveCount(initialCount + 1)

    await heroSectionRow.locator('.q-btn', { hasText: 'Duplicate' }).first().click()
    await expect.poll(async () => listTextboxValues(page, 'Section ID')).toContain('hero-3')
    await expect(sectionRows).toHaveCount(initialCount + 2)
  })

  test('supports linked reusable sections with explicit detach flow and linked block readonly authoring', async ({ page }) => {
    const reusableBlockName = 'Linked Hero Block QA'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    const sectionRows = page.locator('.cms-page-section-row')
    const initialSectionCount = await sectionRows.count()
    const heroSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero"]') })
      .first()

    await heroSectionRow.locator('.q-btn', { hasText: 'Save reusable' }).first().click()
    await page.getByRole('button', { name: /^(Insert linked|Inserir vinculado)$/ }).first().click()
    await expect(sectionRows).toHaveCount(initialSectionCount + 1)

    const linkedSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero-2"]') })
      .first()
    await expect(linkedSectionRow.locator('.q-chip', { hasText: /^(Linked|Vinculado)/ })).toBeVisible()

    await linkedSectionRow.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })
    await expect(page.locator('.cms-banner')).toContainText(/linked to the reusable library|vinculad/i)

    await openDrawerModule(page, /^Pages$/)
    const detachedSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero-2"]') })
      .first()
    await detachedSectionRow.getByRole('button', { name: /^(Detach|Desvincular)$/ }).first().click({ force: true })
    await expect.poll(async () => listTextboxValues(page, 'Section ID')).toContain('hero-2')
    const detachedSectionRowAfterDetach = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero-2"]') })
      .first()
    await expect(detachedSectionRowAfterDetach.locator('.q-chip', { hasText: /^(Detached|Desvinculado)/ })).toBeVisible()

    await detachedSectionRowAfterDetach.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })
    await expect(page.locator('.cms-banner')).toHaveCount(0)

    const titleInput = page
      .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
      .first()
      .locator('input, textarea')
      .first()
    await expect(titleInput).toBeEnabled()

    const initialBlockCount = await page.locator('.cms-block-row').count()
    await fillTextInput(cmsInputByLabel(page, 'Reusable block name'), reusableBlockName)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save selection' }).first().click()
    await expect(page.locator('.cms-reusable-block-row', { hasText: reusableBlockName }).first()).toBeVisible()

    await page.getByRole('button', { name: /^(Insert linked|Inserir vinculado)$/ }).first().click()
    await expect(page.locator('.cms-block-row')).toHaveCount(initialBlockCount + 1)
    await expect(page.locator('.cms-banner')).toContainText(/Detach it before editing props|Desvincule-o antes de editar props/i)

    const linkedBlockRow = page.locator('.cms-block-row', { hasText: reusableBlockName }).first()
    await expect(linkedBlockRow.locator('.q-chip', { hasText: /^(Linked|Vinculado)/ })).toBeVisible()
  })

  test('branches linked reusable sections and blocks into variant library entries', async ({ page }) => {
    const reusableBlockName = 'Variant Hero Block QA'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)

    const heroSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero"]') })
      .first()

    await heroSectionRow.locator('.q-btn', { hasText: 'Save reusable' }).first().click()
    await page.getByRole('button', { name: /^(Insert linked|Inserir vinculado)$/ }).first().click()

    const linkedSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero-2"]') })
      .first()

    await linkedSectionRow.getByRole('button', { name: /^(Branch variant|Ramificar variante)$/ }).first().click({ force: true })
    await expect(linkedSectionRow.locator('.q-chip', { hasText: /Variant|Variante/i })).toBeVisible()
    await expect(
      page.locator('.cms-pages__reusable-library .cms-reusable-block-row', { hasText: 'Main Landing · Hero Variant' }).first()
    ).toContainText(/Variant of Main Landing · Hero|Variante de Main Landing · Hero/i)

    await linkedSectionRow.getByRole('button', { name: /^(Detach|Desvincular)$/ }).first().click({ force: true })
    await expect.poll(async () => listTextboxValues(page, 'Section ID')).toContain('hero-2')
    const detachedVariantSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero-2"]') })
      .first()
    await expect(detachedVariantSectionRow.locator('.q-chip', { hasText: /^(Detached|Desvinculado)/ })).toBeVisible()
    await detachedVariantSectionRow.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })

    await fillTextInput(cmsInputByLabel(page, 'Reusable block name'), reusableBlockName)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save selection' }).first().click()
    await page.getByRole('button', { name: /^(Insert linked|Inserir vinculado)$/ }).first().click()

    const linkedBlockRow = page.locator('.cms-block-row', { hasText: reusableBlockName }).first()
    await linkedBlockRow.getByRole('button', { name: /^(Branch variant|Ramificar variante)$/ }).first().click({ force: true })

    const variantReusableBlockRow = page.locator('.cms-blocks-library .cms-reusable-block-row', { hasText: `${reusableBlockName} Variant` }).first()
    await expect(variantReusableBlockRow).toContainText(/Variant of Variant Hero Block QA|Variante de Variant Hero Block QA/i)
    await expect(linkedBlockRow.locator('.q-chip', { hasText: /Variant|Variante/i })).toBeVisible()
  })

  test('surfaces usage summaries and blocks deletes for in-use reusable entities', async ({ page }) => {
    const reusableBlockName = 'Protected Hero Block'
    const presetName = 'Protected Hero Preset'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    const heroSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero"]') })
      .first()

    await heroSectionRow.locator('.q-btn', { hasText: 'Save reusable' }).first().click()

    const reusableSectionRow = page
      .locator('.cms-pages__reusable-library .cms-reusable-block-row', { hasText: 'Main Landing · Hero' })
      .first()

    await page.getByRole('button', { name: /^(Insert linked|Inserir vinculado)$/ }).first().click()
    await expect(reusableSectionRow).toContainText('1 uses')
    await expect(reusableSectionRow).toContainText(/1 page refs|1 refs em paginas/i)
    await expect(reusableSectionRow.getByRole('button', { name: /^(Delete|Excluir)$/ })).toHaveCount(0)
    await expect(reusableSectionRow.getByRole('button', { name: /^(Archive|Arquivar)$/ })).toBeEnabled()
    await reusableSectionRow.getByRole('button', { name: /^(Inspect reusable section usage|Inspecionar uso da secao reutilizavel)$/ }).click()
    await expect(page.locator('.cms-usage-drawer')).toBeVisible()
    await expect(page.locator('.cms-usage-drawer')).toContainText('Main Landing · Hero')
    await expect(page.locator('.cms-usage-drawer__reference')).toContainText(/Main Landing -> Hero|page:landing-main/i)
    await page.keyboard.press('Escape')
    await expect.poll(async () => page.locator('.q-dialog:visible').count()).toBe(0)

    await heroSectionRow.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await selectOptionByFieldLabelPattern(page, /^(Target block|Bloco alvo)$/, 'Landing Hero (hero-block-1)')

    await fillTextInput(cmsInputByLabel(page, 'Preset name'), presetName)
    await page.locator('.cms-form-grid.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save as preset' }).first().click()

    const presetRow = page
      .locator('.cms-blocks-library .cms-reusable-block-row', { hasText: presetName })
      .first()

    await expect(presetRow).toBeVisible()
    await page.locator('.cms-form-grid.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Apply preset' }).first().click()
    await expect(presetRow).toContainText('1 uses')
    await expect(presetRow).toContainText(/1 page refs|1 refs em paginas/i)
    await expect(presetRow.getByRole('button', { name: /^(Delete|Excluir)$/ })).toHaveCount(0)
    await expect(presetRow.getByRole('button', { name: /^(Archive|Arquivar)$/ })).toBeEnabled()

    await fillTextInput(cmsInputByLabel(page, 'Reusable block name'), reusableBlockName)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save selection' }).first().click()

    const reusableBlockRow = page
      .locator('.cms-blocks-library .cms-reusable-block-row', { hasText: reusableBlockName })
      .first()

    await expect(reusableBlockRow).toBeVisible()
    await reusableBlockRow.locator('.cms-reusable-block-row__actions .q-btn').first().click()
    await page.getByRole('button', { name: /^(Insert linked|Inserir vinculado)$/ }).first().click()

    await expect(reusableBlockRow).toContainText('1 uses')
    await expect(reusableBlockRow).toContainText(/1 page refs|1 refs em paginas/i)
    await expect(reusableBlockRow.getByRole('button', { name: /^(Delete|Excluir)$/ })).toHaveCount(0)
    await expect(reusableBlockRow.getByRole('button', { name: /^(Archive|Arquivar)$/ })).toBeEnabled()
    await reusableBlockRow.getByRole('button', { name: /^(Inspect reusable block usage|Inspecionar uso do bloco reutilizavel)$/ }).click()
    await expect(page.locator('.cms-usage-drawer')).toBeVisible()
    await expect(page.locator('.cms-usage-drawer')).toContainText(reusableBlockName)
    await expect(page.locator('.cms-usage-drawer__reference')).toContainText(/page:landing-main|Main Landing/i)
  })

  test('archives reusable entities and authored presets without breaking restore flows', async ({ page }) => {
    const presetName = 'Archived Hero Preset QA'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    const heroSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero"]') })
      .first()

    await heroSectionRow.locator('.q-btn', { hasText: 'Save reusable' }).first().click()

    const reusableSectionLibrary = page.locator('.cms-pages__reusable-library').first()
    const reusableSectionRow = reusableSectionLibrary
      .locator('.cms-reusable-block-row', { hasText: 'Main Landing · Hero' })
      .first()

    await expect(reusableSectionRow).toBeVisible()
    await reusableSectionRow.getByRole('button', { name: /^(Archive|Arquivar)$/ }).click()
    await expect(reusableSectionLibrary.locator('.cms-reusable-block-row', { hasText: 'Main Landing · Hero' })).toHaveCount(0)

    await reusableSectionLibrary.getByLabel(/^(Show archived|Mostrar arquivados)$/).click()
    await expect(reusableSectionRow).toBeVisible()
    await expect(reusableSectionRow.locator('small').filter({ hasText: /^(Archived|Arquivada|Arquivado)$/ })).toBeVisible()
    await reusableSectionRow.getByRole('button', { name: /^(Restore|Restaurar)$/ }).click()
    await reusableSectionLibrary.getByLabel(/^(Show archived|Mostrar arquivados)$/).click()
    await expect(reusableSectionLibrary.locator('.cms-reusable-block-row', { hasText: 'Main Landing · Hero' })).toBeVisible()

    await heroSectionRow.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await selectOptionByFieldLabelPattern(page, /^(Target block|Bloco alvo)$/, 'Landing Hero (hero-block-1)')

    await fillTextInput(cmsInputByLabel(page, 'Preset name'), presetName)
    await page.locator('.cms-form-grid.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save as preset' }).first().click()

    const presetLibrary = page
      .locator('.cms-blocks-library', { has: page.getByText(/^(Authored preset library|Biblioteca de presets authored)$/) })
      .first()
    const presetRow = presetLibrary.locator('.cms-reusable-block-row', { hasText: presetName }).first()

    await expect(presetRow).toBeVisible()
    await presetRow.getByRole('button', { name: /^(Archive|Arquivar)$/ }).click()
    await expect(presetLibrary.locator('.cms-reusable-block-row', { hasText: presetName })).toHaveCount(0)

    await presetLibrary.getByLabel(/^(Show archived|Mostrar arquivados)$/).click()
    await expect(presetRow).toBeVisible()
    await expect(presetRow.locator('small').filter({ hasText: /^(Archived|Arquivado)$/ })).toBeVisible()
    await expect(presetRow.getByRole('button', { name: /^(Use|Usar)$/ })).toBeDisabled()
    await presetRow.getByRole('button', { name: /^(Restore|Restaurar)$/ }).click()
    await expect(presetRow.getByRole('button', { name: /^(Use|Usar)$/ })).toBeEnabled()
  })

  test('keeps authored page and block copy isolated by cms locale', async ({ page }) => {
    const localizedPageTitle = 'Landing Principal QA'
    const localizedHeroTitle = 'Construa interfaces QA'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Pages|Paginas)$/)

    const firstPage = page.locator('.cms-page-item').first()
    const pageTitleInput = firstPage
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    const basePageTitle = await pageTitleInput.inputValue()

    await firstPage.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await selectOptionByFieldLabelPattern(page, /^(Target block|Bloco alvo)$/, 'Landing Hero (hero-block-1)')
    const heroTitleInput = page
      .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
      .first()
      .locator('input, textarea')
      .first()
    const baseHeroTitle = await heroTitleInput.inputValue()

    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Language', 'Portuguese (Brazil)')

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    const localizedPageTitleInput = page
      .locator('.cms-page-item')
      .first()
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(localizedPageTitleInput, localizedPageTitle)
    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    await expect(page.locator('.cms-pages__preview').getByText(localizedPageTitle, { exact: true })).toBeVisible()
    await openCmsWorkspaceTab(page, /^(Editor)$/i)

    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await selectOptionByFieldLabelPattern(page, /^(Target block|Bloco alvo)$/, 'Landing Hero (hero-block-1)')
    const localizedHeroTitleInput = page
      .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(localizedHeroTitleInput, localizedHeroTitle)
    await expect(localizedHeroTitleInput).toHaveValue(localizedHeroTitle)

    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Idioma', 'English')

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(
      page
        .locator('.cms-page-item')
        .first()
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(basePageTitle)

    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await selectOptionByFieldLabelPattern(page, /^(Target block|Bloco alvo)$/, 'Landing Hero (hero-block-1)')
    await expect(
      page
        .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(baseHeroTitle)

    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Language', 'Portuguese (Brazil)')

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(
      page
        .locator('.cms-page-item')
        .first()
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(localizedPageTitle)

    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await selectOptionByFieldLabelPattern(page, /^(Target block|Bloco alvo)$/, 'Landing Hero (hero-block-1)')
    await expect(
      page
        .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(localizedHeroTitle)
  })

  test('authors custom content models and constrains page section presets', async ({ page }) => {
    const authoredModelName = 'Campaign schema QA'
    const authoredModelDescription = 'Only hero, features and footer'
    const initialMigrationNotes = 'Initial schema rollout'
    const updatedMigrationNotes = 'Added supporting eyebrow field'
    const defaultPageTitle = 'Campaign default page'
    const defaultPageDescription = 'Campaign default description'
    const defaultPagePathPrefix = '/campaign-default'
    const customFieldId = 'campaignHeadline'
    const customFieldLabel = 'Campaign headline'
    const customFieldDefaultValue = 'Launch campaign headline'
    const customFieldGroup = 'Campaign'
    const repeatableFieldId = 'bulletPoints'
    const repeatableFieldLabel = 'Bullet points'
    const repeatableFieldDefaultValue = ['Fast setup', 'Safe rollout']
    const repeatableFieldGroup = 'Content'

    await page.setViewportSize({ width: 1600, height: 2200 })
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)

    await expect(page.getByRole('button', { name: /^(New content model|Novo modelo de conteudo)$/ }).first()).toBeVisible()
    const contentModelNameInput = cmsInputByLabel(page, 'Content model name')
    const contentModelDescriptionInput = cmsInputByLabel(page, 'Content model description')
    await expect(contentModelNameInput).toBeVisible()
    await page.waitForTimeout(200)
    await fillTextInputDirect(contentModelNameInput, authoredModelName)
    await fillTextInputDirect(contentModelDescriptionInput, authoredModelDescription)
    await fillTextInputDirect(cmsInputByLabel(page, 'Default page title'), defaultPageTitle)
    await fillTextInputDirect(cmsInputByLabel(page, 'Default page description'), defaultPageDescription)
    await fillTextInputDirect(cmsInputByLabel(page, 'Default page path prefix'), defaultPagePathPrefix)
    await fillTextInputDirect(cmsInputByLabel(page, 'Migration notes'), initialMigrationNotes)
    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).last().locator('input, textarea').first(),
      customFieldId
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).last().locator('input, textarea').first(),
      customFieldLabel
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field description' }) }).last().locator('input, textarea').first(),
      'Primary campaign headline'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field group' }) }).last().locator('input, textarea').first(),
      customFieldGroup
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field order' }) }).last().locator('input, textarea').first(),
      '2'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).last().locator('input, textarea').first(),
      customFieldDefaultValue
    )
    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).last().locator('input, textarea').first(),
      repeatableFieldId
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).last().locator('input, textarea').first(),
      repeatableFieldLabel
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field description' }) }).last().locator('input, textarea').first(),
      'One bullet per line'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field group' }) }).last().locator('input, textarea').first(),
      repeatableFieldGroup
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field order' }) }).last().locator('input, textarea').first(),
      '1'
    )
    await page.getByRole('switch', { name: /^(Repeatable|Multiplo)$/ }).last().click()
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: /^(Default values \(one per line\)|Valores padrao \(um por linha\))$/ }) }).last().locator('textarea').first(),
      repeatableFieldDefaultValue.join('\n')
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: /^(Minimum items|Minimo de itens)$/ }) }).last().locator('input, textarea').first(),
      '2'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: /^(Maximum items|Maximo de itens)$/ }) }).last().locator('input, textarea').first(),
      '4'
    )

    const clearAllowedPresetsButton = page.getByRole('button', { name: /^(Clear allowed presets|Limpar presets permitidos)$/ }).first()
    await expect(clearAllowedPresetsButton).toBeVisible()
    await clearAllowedPresetsButton.evaluate(element => {
      ;(element as HTMLButtonElement).click()
    })
    await page.locator('.cms-preset-toggle-grid .q-btn', { hasText: 'Hero' }).first().click()
    await page.locator('.cms-preset-toggle-grid .q-btn', { hasText: 'Features' }).first().click()
    await page.locator('.cms-preset-toggle-grid .q-btn', { hasText: 'Footer' }).first().click()
    await selectOptionByFieldLabel(page, 'Required presets', 'Footer')
    await commitFocusedSelect(page)
    await fillTextInputDirect(cmsInputByLabel(page, 'Maximum enabled sections'), '4')
    await fillTextInputDirect(cmsInputByLabel(page, 'Hero max instances'), '1')
    const starterScaffoldField = page
      .locator('.q-field', {
        has: page.locator('.q-field__label', { hasText: /^(Starter page scaffold|Scaffold inicial da pagina)$/ }),
      })
      .first()
    await starterScaffoldField.click()

    const heroStarterOption = page.getByRole('option', { name: 'Hero', exact: true }).first()
    if (await heroStarterOption.count() > 0) {
      await heroStarterOption.click()
      await page.getByRole('option', { name: 'Features', exact: true }).first().click()
      await page.getByRole('option', { name: 'Footer', exact: true }).first().click()
    } else {
      await page.locator('.q-menu .q-item', { hasText: 'Hero' }).first().click()
      await page.locator('.q-menu .q-item', { hasText: 'Features' }).first().click()
      await page.locator('.q-menu .q-item', { hasText: 'Footer' }).first().click()
    }
    await commitFocusedSelect(page)

    await page.getByRole('button', { name: /^(Save content model|Salvar modelo de conteudo)$/ }).first().click()
    const contentModelPreviewCard = page
      .locator('.cms-config-section', {
        has: page.getByText(/^(Content model example|Exemplo de modelo de conteudo)$/),
      })
      .locator('.cms-preview-card--content')
      .first()
    await expect(contentModelPreviewCard).toContainText(authoredModelName)
    await expect(contentModelPreviewCard).toContainText(authoredModelDescription)
    await expect(contentModelPreviewCard).toContainText('Default page title')
    await expect(contentModelPreviewCard).toContainText(defaultPageTitle)
    await expect(contentModelPreviewCard).toContainText('Default page description')
    await expect(contentModelPreviewCard).toContainText(defaultPageDescription)
    await expect(contentModelPreviewCard).toContainText('Default page path prefix')
    await expect(contentModelPreviewCard).toContainText(defaultPagePathPrefix)
    await expect(contentModelPreviewCard).toContainText('Starter scaffold')
    await expect(contentModelPreviewCard).toContainText('Features, Footer')
    await expect(contentModelPreviewCard).toContainText('Schema version')
    await expect(contentModelPreviewCard).toContainText('1')
    await expect(contentModelPreviewCard).toContainText('Migration notes')
    await expect(contentModelPreviewCard).toContainText(initialMigrationNotes)
    await expect(contentModelPreviewCard).toContainText('Schema fields')
    await expect(contentModelPreviewCard).toContainText(customFieldLabel)
    await expect(contentModelPreviewCard).toContainText(repeatableFieldLabel)
    await expect(contentModelPreviewCard).toContainText('Required presets')
    await expect(contentModelPreviewCard).toContainText('Footer')
    await expect(contentModelPreviewCard).toContainText('Maximum enabled sections')
    await expect(contentModelPreviewCard).toContainText('4')
    await expect(contentModelPreviewCard).toContainText('Preset limits')
    await expect(contentModelPreviewCard).toContainText('Hero x1')

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Pages|Paginas)$/)

    await selectOptionByFieldLabel(page, 'Content model', authoredModelName)
    await expect(page.locator('.cms-page-preview__chips .q-chip', { hasText: authoredModelName }).first()).toBeVisible()
    await page.getByRole('button', { name: /^(Apply model scaffold|Aplicar scaffold do modelo)$/ }).first().click()
    await page.getByRole('button', { name: /^(Apply model defaults|Aplicar defaults do modelo)$/ }).first().click()

    const firstPage = page.locator('.cms-page-item').first()
    await expect(
      firstPage
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(defaultPageTitle)
    await expect(
      firstPage
        .locator('.cms-page-item__description')
        .first()
        .locator('textarea')
        .first()
    ).toHaveValue(defaultPageDescription)
    await expect(
      firstPage
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Path|Caminho)$/ }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(defaultPagePathPrefix)
    await expect(
      firstPage
        .locator('.cms-page-item__custom-fields .q-field', { has: page.locator('.q-field__label', { hasText: customFieldLabel }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(customFieldDefaultValue)
    await expect(
      firstPage
        .locator('.cms-page-item__custom-fields .q-field', { has: page.locator('.q-field__label', { hasText: repeatableFieldLabel }) })
        .first()
        .locator('textarea')
        .first()
    ).toHaveValue(repeatableFieldDefaultValue.join('\n'))
    await expect(firstPage.locator('.cms-page-item__custom-fields-group-header strong').nth(0)).toHaveText(repeatableFieldGroup)
    await expect(firstPage.locator('.cms-page-item__custom-fields-group-header strong').nth(1)).toHaveText(customFieldGroup)

    const sectionPresetField = page
      .locator('.cms-page-item__sections-actions .q-field', {
        has: page.locator('.q-field__label', { hasText: /^(Section preset|Preset de secao)$/ }),
      })
      .first()
    await sectionPresetField.click()

    const featuresOption = page.getByRole('option', { name: 'Features', exact: true }).first()
    if (await featuresOption.count() > 0) {
      await expect(featuresOption).toBeVisible()
      await expect(page.getByRole('option', { name: 'Installation', exact: true })).toHaveCount(0)
      await featuresOption.click()
    } else {
      await expect(page.locator('.q-menu .q-item', { hasText: 'Features' }).first()).toBeVisible()
      await expect(page.locator('.q-menu .q-item', { hasText: 'Installation' })).toHaveCount(0)
      await page.locator('.q-menu .q-item', { hasText: 'Features' }).first().click()
    }
    await commitFocusedSelect(page)

    const pageSectionIds = await page
      .locator('.cms-page-item')
      .first()
      .locator('.cms-page-section-row .q-field', {
        has: page.locator('.q-field__label', { hasText: /^(Section ID|ID da secao)$/ }),
      })
      .locator('input, textarea')
      .evaluateAll(inputs => inputs.map(input => (input as HTMLInputElement).value))

    expect(pageSectionIds).toEqual(['features', 'footer'])

    const addSectionButton = page.getByRole('button', { name: /^(Add section|Adicionar secao)$/ }).first()
    await expect(addSectionButton).toBeVisible()

    await selectOptionByFieldLabel(page, 'Section preset', 'Hero')
    await commitFocusedSelect(page)
    await expect(addSectionButton).toBeEnabled()
    await addSectionButton.click()
    await expect.poll(async () => listTextboxValues(page, 'Section ID')).toContain('hero')
    await expect(addSectionButton).toBeDisabled()

    await selectOptionByFieldLabel(page, 'Section preset', 'Features')
    await commitFocusedSelect(page)
    await expect(addSectionButton).toBeEnabled()
    await addSectionButton.click()
    await expect.poll(async () => listTextboxValues(page, 'Section ID')).toContain('features-2')
    await expect(addSectionButton).toBeDisabled()

    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await fillTextInputDirect(cmsInputByLabel(page, 'Migration notes'), updatedMigrationNotes)
    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).last().locator('input, textarea').first(),
      'campaignEyebrow'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).last().locator('input, textarea').first(),
      'Campaign eyebrow'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field description' }) }).last().locator('input, textarea').first(),
      'Short support label above the headline'
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).last().locator('input, textarea').first(),
      'New'
    )
    await page.getByRole('button', { name: /^(Save content model|Salvar modelo de conteudo)$/ }).first().click()
    await expect(contentModelPreviewCard).toContainText('Schema version')
    await expect(contentModelPreviewCard).toContainText('2')
    await expect(contentModelPreviewCard).toContainText(updatedMigrationNotes)

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    const schemaMigrationSummary = page.locator('.cms-page-migration-summary').first()
    await expect(schemaMigrationSummary).toContainText(/Schema migration review|Revisao de migracao de schema/)
    await expect(schemaMigrationSummary).toContainText(/Pending: 1|Pendentes: 1/)
    const schemaChip = page.locator('.cms-page-preview__chips .q-chip', { hasText: 'schema v1 / v2' }).first()
    await expect(schemaChip).toBeVisible()
    const diagnosticsList = page.locator('.cms-page-preview .cms-diagnostics-list').first()
    await expect(diagnosticsList).toContainText('pages.content_model.version.stale')
    await expect(diagnosticsList).toContainText(updatedMigrationNotes)
    const schemaUpgradeReport = firstPage.locator('.cms-page-item__schema-migration').first()
    await expect(schemaUpgradeReport).toContainText(/Schema upgrade report|Relatorio de upgrade do schema/)
    await expect(schemaUpgradeReport).toContainText(updatedMigrationNotes)
    await expect(schemaUpgradeReport).toContainText('Campaign eyebrow')
    await expect(schemaUpgradeReport).toContainText('customFields.campaigneyebrow')
    await expect(schemaUpgradeReport).toContainText('Next: New')
    await page.getByRole('button', { name: /^(Sync schema version|Sincronizar versao do schema)$/ }).first().click()
    await expect(page.locator('.cms-page-preview__chips .q-chip', { hasText: 'schema v2 / v2' }).first()).toBeVisible()
    await expect(page.locator('.cms-page-preview .cms-diagnostics-item', { hasText: 'pages.content_model.version.stale' })).toHaveCount(0)
    await expect(firstPage.locator('.cms-page-item__schema-migration')).toHaveCount(0)

    await firstPage.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Footer (1)')

    const paletteBlockField = page
      .locator('.q-field', {
        has: page.locator('.q-field__label', { hasText: /^(Palette block|Bloco da paleta)$/ }),
      })
      .first()
    await paletteBlockField.click()

    const footerPaletteOption = page.getByRole('option', { name: 'Landing Footer (layout)', exact: true }).first()
    if (await footerPaletteOption.count() > 0) {
      await expect(footerPaletteOption).toBeVisible()
      await expect(page.getByRole('option', { name: 'Landing Hero (layout)', exact: true })).toHaveCount(0)
      await page.keyboard.press('Escape')
    } else {
      await expect(page.locator('.q-menu .q-item', { hasText: 'Landing Footer (layout)' }).first()).toBeVisible()
      await expect(page.locator('.q-menu .q-item', { hasText: 'Landing Hero (layout)' })).toHaveCount(0)
      await page.keyboard.press('Escape')
    }

    const addBlockButton = page.getByRole('button', { name: /^(Add block|Adicionar bloco)$/ }).first()
    await expect(addBlockButton).toBeDisabled()
  })

  test('authors rich schema field types and renders them in Pages builder', async ({ page }) => {
    const contentModelName = 'Rich field types QA'
    const urlFieldId = 'ctaUrl'
    const urlFieldLabel = 'CTA URL'
    const urlDefaultValue = '/demo'
    const dateFieldId = 'launchDate'
    const dateFieldLabel = 'Launch date'
    const dateDefaultValue = '2026-03-10'
    const mediaFieldId = 'heroAsset'
    const mediaFieldLabel = 'Hero asset'
    const defaultMediaOptionLabel = 'Brand logo'
    const referenceFieldId = 'relatedModel'
    const referenceFieldLabel = 'Related model'
    const objectFieldId = 'seoConfig'
    const objectFieldLabel = 'SEO config'
    const objectNestedFieldsJson = JSON.stringify([
      {
        id: 'title',
        type: 'text',
        label: 'SEO title',
        required: true,
        defaultValue: 'Launch title',
      },
      {
        id: 'canonicalUrl',
        type: 'url',
        label: 'Canonical URL',
        defaultValue: '/launch',
      },
    ], null, 2)
    const objectDefaultJson = JSON.stringify({
      title: 'Launch title',
      canonicalurl: '/launch',
    }, null, 2)
    const groupFieldId = 'faqItems'
    const groupFieldLabel = 'FAQ items'
    const groupNestedFieldsJson = JSON.stringify([
      {
        id: 'question',
        type: 'text',
        label: 'Question',
        required: true,
        defaultValue: '',
      },
      {
        id: 'answer',
        type: 'textarea',
        label: 'Answer',
        defaultValue: '',
      },
    ], null, 2)
    const groupDefaultJson = JSON.stringify([
      {
        question: 'What is NetToolsKit?',
        answer: 'A CMS engine.',
      },
    ], null, 2)

    await page.setViewportSize({ width: 1600, height: 1900 })
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)

    await fillTextInputDirect(cmsInputByLabel(page, 'Content model name'), contentModelName)
    await fillTextInputDirect(cmsInputByLabel(page, 'Content model description'), 'Schema with URL, date and media asset fields')

    const clearAllowedPresetsButton = page.getByRole('button', { name: /^(Clear allowed presets|Limpar presets permitidos)$/ }).first()
    await clearAllowedPresetsButton.evaluate(element => {
      ;(element as HTMLButtonElement).click()
    })
    await page.locator('.cms-preset-toggle-grid .q-btn', { hasText: 'Hero' }).first().click()
    await page.locator('.cms-preset-toggle-grid .q-btn', { hasText: 'Footer' }).first().click()

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const urlFieldRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      urlFieldId
    )
    await fillTextInputDirect(
      urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      urlFieldLabel
    )
    await urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
    await page.getByRole('option', { name: 'URL', exact: true }).first().click()
    await fillTextInputDirect(
      urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).first().locator('input').first(),
      urlDefaultValue
    )

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const dateFieldRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      dateFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      dateFieldId
    )
    await fillTextInputDirect(
      dateFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      dateFieldLabel
    )
    await dateFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
    await page.getByRole('option', { name: 'Date', exact: true }).first().click()
    await fillTextInputDirect(
      dateFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).first().locator('input').first(),
      dateDefaultValue
    )

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const mediaFieldRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      mediaFieldId
    )
    await fillTextInputDirect(
      mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      mediaFieldLabel
    )
    await mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
    await page.getByRole('option', { name: 'Media asset', exact: true }).first().click()
    await mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Allowed media kinds' }) }).first().click()
    await page.getByRole('option', { name: 'Image', exact: true }).first().click()
    await commitFocusedSelect(page)
    const defaultAssetPicker = mediaFieldRow.locator('.cms-media-asset-picker').first()
    await defaultAssetPicker.locator('.q-field').first().click()
    const brandLogoOption = page.locator('.q-menu:visible .q-item', { hasText: defaultMediaOptionLabel }).first()
    await expect(brandLogoOption).toBeVisible()
    await brandLogoOption.click()
    await commitFocusedSelect(page)
    await expect(defaultAssetPicker.locator('.cms-media-asset-picker__selection').first()).toContainText(defaultMediaOptionLabel)

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const referenceFieldRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      referenceFieldId
    )
    await fillTextInputDirect(
      referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      referenceFieldLabel
    )
    await referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
    await page.getByRole('option', { name: 'Reference', exact: true }).first().click()
    await referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Allowed reference kinds' }) }).first().click()
    await page.getByRole('option', { name: 'Content model', exact: true }).first().click()
    await commitFocusedSelect(page)

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const objectFieldRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      objectFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      objectFieldId
    )
    await fillTextInputDirect(
      objectFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      objectFieldLabel
    )
    await objectFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
    await page.getByRole('option', { name: 'Object', exact: true }).first().click()
    await fillTextInputDirect(
      objectFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Nested fields JSON' }) }).first().locator('textarea').first(),
      objectNestedFieldsJson
    )
    await fillTextInputDirect(
      objectFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default JSON value' }) }).first().locator('textarea').first(),
      objectDefaultJson
    )

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const groupFieldRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      groupFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      groupFieldId
    )
    await fillTextInputDirect(
      groupFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      groupFieldLabel
    )
    await groupFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
    await page.getByRole('option', { name: 'Repeatable group', exact: true }).first().click()
    await fillTextInputDirect(
      groupFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Nested fields JSON' }) }).first().locator('textarea').first(),
      groupNestedFieldsJson
    )
    await fillTextInputDirect(
      groupFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default JSON value' }) }).first().locator('textarea').first(),
      groupDefaultJson
    )

    await page.getByRole('button', { name: /^(Save content model|Salvar modelo de conteudo)$/ }).first().click()

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await selectOptionByFieldLabel(page, 'Content model', contentModelName)

    const customFieldsCard = page.locator('.cms-page-item__custom-fields').first()
    await expect(
      customFieldsCard.locator('.q-field', { has: page.locator('.q-field__label', { hasText: urlFieldLabel }) }).first().locator('input').first()
    ).toHaveValue(urlDefaultValue)
    await expect(
      customFieldsCard.locator('.q-field', { has: page.locator('.q-field__label', { hasText: dateFieldLabel }) }).first().locator('input').first()
    ).toHaveValue(dateDefaultValue)

    const mediaFieldSelect = customFieldsCard
      .locator('.cms-media-asset-picker', { has: page.locator('.q-field__label', { hasText: mediaFieldLabel }) })
      .first()
    await expect(mediaFieldSelect).toContainText('Brand logo')
    await expect(mediaFieldSelect.locator('.cms-media-asset-picker__selection').first()).toContainText('Brand logo')
    await mediaFieldSelect.locator('.q-field').first().click()
    await expect(page.locator('.q-menu:visible .q-item', { hasText: defaultMediaOptionLabel }).first()).toBeVisible()
    const incompatibleAssetOption = page.locator('.q-menu:visible .q-item', { hasText: 'Favicon' }).first()
    await expect(incompatibleAssetOption).toBeVisible()
    await expect(incompatibleAssetOption).toContainText(/Not allowed for this field|Nao permitido para este campo/)
    await commitFocusedSelect(page)

    const referenceFieldSelect = customFieldsCard
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: referenceFieldLabel }) })
      .first()
    await referenceFieldSelect.click()
    const currentModelReferenceOption = page.getByRole('option', { name: new RegExp(contentModelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first()
    if (await currentModelReferenceOption.count() > 0) {
      await expect(currentModelReferenceOption).toBeVisible()
    } else {
      await expect(page.locator('.q-menu:visible .q-item', { hasText: contentModelName }).first()).toBeVisible()
    }
    await commitFocusedSelect(page)

    const objectFieldTextarea = customFieldsCard
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: objectFieldLabel }) })
      .first()
      .locator('textarea')
      .first()
    await expect(objectFieldTextarea).toHaveValue(objectDefaultJson)

    const groupFieldTextarea = customFieldsCard
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: groupFieldLabel }) })
      .first()
      .locator('textarea')
      .first()
    await expect(groupFieldTextarea).toHaveValue(groupDefaultJson)
  })

  test('authors localized schema field metadata and renders locale-specific labels in Pages builder', async ({ page }) => {
    const contentModelName = 'Localized schema metadata QA'
    const baseFieldId = 'campaignHeadline'
    const baseFieldLabel = 'Campaign headline'
    const baseFieldGroup = 'Campaign'
    const baseFieldDescription = 'Primary campaign headline'
    const baseFieldPlaceholder = 'Type the campaign headline'
    const baseFieldDefaultValue = 'Launch campaign'
    const localizedFieldLabel = 'Titulo da campanha'
    const localizedFieldGroup = 'Campanha'
    const localizedFieldDescription = 'Titulo principal da pagina'
    const localizedFieldPlaceholder = 'Digite o titulo da campanha'

    await page.setViewportSize({ width: 1600, height: 1900 })
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)

    await fillTextInputDirect(cmsInputByLabel(page, 'Content model name'), contentModelName)
    await fillTextInputDirect(cmsInputByLabel(page, 'Content model description'), 'Localized schema metadata smoke test')

    const clearAllowedPresetsButton = page.getByRole('button', { name: /^(Clear allowed presets|Limpar presets permitidos)$/ }).first()
    await clearAllowedPresetsButton.evaluate(element => {
      ;(element as HTMLButtonElement).click()
    })
    await page.locator('.cms-preset-toggle-grid .q-btn', { hasText: 'Hero' }).first().click()
    await page.locator('.cms-preset-toggle-grid .q-btn', { hasText: 'Footer' }).first().click()

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const fieldRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      baseFieldId
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      baseFieldLabel
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field group' }) }).first().locator('input, textarea').first(),
      baseFieldGroup
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field description' }) }).first().locator('input, textarea').first(),
      baseFieldDescription
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Placeholder' }) }).first().locator('input, textarea').first(),
      baseFieldPlaceholder
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).first().locator('input, textarea').first(),
      baseFieldDefaultValue
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'PT-BR label' }) }).first().locator('input, textarea').first(),
      localizedFieldLabel
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'PT-BR group' }) }).first().locator('input, textarea').first(),
      localizedFieldGroup
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'PT-BR description' }) }).first().locator('input, textarea').first(),
      localizedFieldDescription
    )
    await fillTextInputDirect(
      fieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'PT-BR placeholder' }) }).first().locator('input, textarea').first(),
      localizedFieldPlaceholder
    )

    await page.getByRole('button', { name: /^(Save content model|Salvar modelo de conteudo)$/ }).first().click()
    await page.reload()
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Content model library', contentModelName)

    const reloadedFieldRow = page.locator('.cms-content-model-fields__item').first()
    await expect(
      reloadedFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first()
    ).toHaveValue(baseFieldLabel)
    await expect(
      reloadedFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'PT-BR label' }) }).first().locator('input, textarea').first()
    ).toHaveValue(localizedFieldLabel)

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await selectOptionByFieldLabel(page, 'Content model', contentModelName)

    const customFieldsCard = page.locator('.cms-page-item__custom-fields').first()
    await expect(
      customFieldsCard.locator('.cms-page-item__custom-fields-group-header strong', { hasText: baseFieldGroup }).first()
    ).toBeVisible()
    await expect(
      customFieldsCard.locator('.q-field', { has: page.locator('.q-field__label', { hasText: baseFieldLabel }) }).first()
    ).toBeVisible()

    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Language', 'Portuguese (Brazil)')
    await openDrawerModule(page, /^(Pages|Paginas)$/)

    const localizedCustomFieldsCard = page.locator('.cms-page-item__custom-fields').first()
    await expect(
      localizedCustomFieldsCard.locator('.cms-page-item__custom-fields-group-header strong', { hasText: localizedFieldGroup }).first()
    ).toBeVisible()
    await expect(
      localizedCustomFieldsCard.locator('.q-field', { has: page.locator('.q-field__label', { hasText: localizedFieldLabel }) }).first()
    ).toBeVisible()
  })

  test('authors section-level custom fields in Blocks builder and preserves them after Pages edits', async ({ page }) => {
    const anchorIdValue = 'hero-anchor-qa'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await expect(page.locator('.cms-blocks-section-fields')).toBeVisible()

    const anchorIdInput = page
      .locator('.cms-blocks-section-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Anchor ID' }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(anchorIdInput, anchorIdValue)
    await selectOptionByFieldLabel(page, 'Theme variant', 'Contrast')

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    const pageTitleInput = page
      .locator('.cms-page-item')
      .first()
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    const pageTitleValue = await pageTitleInput.inputValue()
    await fillTextInput(pageTitleInput, `${pageTitleValue} QA`)

    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')

    await expect(
      page
        .locator('.cms-blocks-section-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Anchor ID' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(anchorIdValue)
    await expect(
      page.locator('.cms-blocks-section-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Theme variant' }) }).first()
    ).toContainText('Contrast')

    await expect.poll(async () => page.evaluate((storageKey: string) => {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)
      const settings = parsed?.settings ?? parsed
      const heroSection = settings?.pages?.[0]?.sections?.find((section: { id?: string }) => section.id === 'hero')

      return heroSection
        ? {
          anchorid: heroSection.customFields?.anchorid ?? null,
          themevariant: heroSection.customFields?.themevariant ?? null,
        }
        : null
    }, CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY)).toEqual({
      anchorid: anchorIdValue,
      themevariant: 'contrast',
    })
  })

  test('saves reusable schema-field presets and reapplies them across authored content models', async ({ page }) => {
    const fieldId = 'campaignCode'
    const fieldLabel = 'Campaign code'
    const fieldDescription = 'Unique campaign identifier'
    const fieldGroup = 'Campaign'
    const fieldDefaultValue = 'CMP-001'

    await page.setViewportSize({ width: 1600, height: 1800 })
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).last().locator('input, textarea').first(),
      fieldId
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).last().locator('input, textarea').first(),
      fieldLabel
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field description' }) }).last().locator('input, textarea').first(),
      fieldDescription
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field group' }) }).last().locator('input, textarea').first(),
      fieldGroup
    )
    await fillTextInputDirect(
      page.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).last().locator('input, textarea').first(),
      fieldDefaultValue
    )

    await page.getByRole('button', { name: /^(Save as preset|Salvar como preset)$/ }).first().click()

    const fieldPresetLibrary = page
      .locator('.cms-blocks-library', {
        has: page.getByText(/^(Field preset library|Biblioteca de presets de campo)$/),
      })
      .first()
    await expect(fieldPresetLibrary).toContainText(fieldLabel)
    await expect(fieldPresetLibrary).toContainText(fieldDescription)

    await page.getByRole('button', { name: /^(New content model|Novo modelo de conteudo)$/ }).first().click()
    await expect(page.locator('.cms-content-model-fields__item')).toHaveCount(0)

    await page.getByRole('button', { name: /^(Insert preset|Inserir preset)$/ }).first().click()

    const insertedFieldRow = page.locator('.cms-content-model-fields__item').last()
    await expect(
      insertedFieldRow
        .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(fieldId)
    await expect(
      insertedFieldRow
        .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(fieldLabel)
    await expect(
      insertedFieldRow
        .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field group' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(fieldGroup)
  })

  test('deprecates field presets with replacement guidance and reuses the replacement preset', async ({ page }) => {
    const legacyFieldId = 'legacyCampaignCode'
    const legacyFieldLabel = 'Legacy campaign code'
    const replacementFieldId = 'campaignCodeV2'
    const replacementFieldLabel = 'Campaign code v2'

    await page.setViewportSize({ width: 1600, height: 1800 })
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const authoredFieldRow = page.locator('.cms-content-model-fields__item').last()

    await fillTextInputDirect(
      authoredFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      legacyFieldId
    )
    await fillTextInputDirect(
      authoredFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      legacyFieldLabel
    )
    await page.getByRole('button', { name: /^(Save as preset|Salvar como preset)$/ }).first().click()

    await fillTextInputDirect(
      authoredFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      replacementFieldId
    )
    await fillTextInputDirect(
      authoredFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      replacementFieldLabel
    )
    await page.getByRole('button', { name: /^(Save as preset|Salvar como preset)$/ }).first().click()

    const fieldPresetLibrary = page
      .locator('.cms-blocks-library', {
        has: page.getByText(/^(Field preset library|Biblioteca de presets de campo)$/),
      })
      .first()
    const legacyPresetRow = fieldPresetLibrary.locator('.cms-reusable-block-row', { hasText: legacyFieldLabel }).first()

    await expect(legacyPresetRow).toBeVisible()
    await legacyPresetRow.getByRole('button', { name: /^(Deprecate|Descontinuar)$/ }).click()
    await selectOptionByFieldLabelPattern(page, /^(Replacement preset|Preset substituto)$/, replacementFieldLabel)
    await fillTextInput(
      legacyPresetRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: /^(Deprecation note|Nota de descontinuacao)$/ }) }).first().locator('input, textarea').first(),
      'Use the v2 field preset.'
    )

    await expect(legacyPresetRow).toContainText('Deprecated')
    await expect(legacyPresetRow).toContainText(replacementFieldLabel)
    await expect(legacyPresetRow).toContainText('Use the v2 field preset.')
    await expect(legacyPresetRow.getByRole('button', { name: /^(Use|Usar)$/ })).toBeDisabled()
    await expect(legacyPresetRow.getByRole('button', { name: /^(Use replacement|Usar substituto)$/ })).toBeVisible()

    await page.getByRole('button', { name: /^(New content model|Novo modelo de conteudo)$/ }).first().click()
    await expect(page.locator('.cms-content-model-fields__item')).toHaveCount(0)

    await legacyPresetRow.getByRole('button', { name: /^(Use replacement|Usar substituto)$/ }).click()
    await page.getByRole('button', { name: /^(Insert preset|Inserir preset)$/ }).first().click()

    const insertedFieldRow = page.locator('.cms-content-model-fields__item').last()
    await expect(
      insertedFieldRow
        .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(replacementFieldId)
    await expect(
      insertedFieldRow
        .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(replacementFieldLabel)
  })

  test('applies deprecated reusable block replacements across linked authoring references', async ({ page }) => {
    const legacyReusableBlockName = 'Legacy Swap Block'
    const replacementReusableBlockName = 'Replacement Swap Block'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Pages|Paginas)$/)

    const heroSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="hero"]') })
      .first()

    await heroSectionRow.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)

    await fillTextInput(cmsInputByLabel(page, 'Reusable block name'), legacyReusableBlockName)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save selection' }).first().click()
    await fillTextInput(cmsInputByLabel(page, 'Reusable block name'), replacementReusableBlockName)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save selection' }).first().click()

    const reusableBlockLibrary = page
      .locator('.cms-blocks-library', { has: page.getByText(/^(Reusable block library|Biblioteca de blocos reutilizaveis)$/) })
      .first()
    const legacyReusableBlockRow = reusableBlockLibrary
      .locator('.cms-reusable-block-row')
      .filter({ has: page.locator('.cms-blocks-library__header strong', { hasText: legacyReusableBlockName }) })
      .first()
    const replacementReusableBlockRow = reusableBlockLibrary
      .locator('.cms-reusable-block-row')
      .filter({ has: page.locator('.cms-blocks-library__header strong', { hasText: replacementReusableBlockName }) })
      .first()

    await expect(legacyReusableBlockRow).toBeVisible()
    await expect(replacementReusableBlockRow).toBeVisible()

    await legacyReusableBlockRow.locator('.cms-reusable-block-row__actions .q-btn').first().click()
    await page.getByRole('button', { name: /^(Insert linked|Inserir vinculado)$/ }).first().click()

    await expect(legacyReusableBlockRow).toContainText('1 uses')
    await legacyReusableBlockRow.getByRole('button', { name: /^(Deprecate|Descontinuar)$/ }).click()
    await selectOptionByFieldLabelPattern(page, /^(Replacement block|Bloco substituto)$/, replacementReusableBlockName)

    await expect(legacyReusableBlockRow).toContainText(/Will update 1 page refs|Vai atualizar 1 refs em paginas/i)
    await legacyReusableBlockRow.getByRole('button', { name: /^(Apply replacement|Aplicar substituto)$/ }).click()

    await expect(legacyReusableBlockRow).toContainText(/No engine usage detected|Nenhum uso no engine detectado/i)
    await expect(replacementReusableBlockRow).toContainText('1 uses')
    await expect(replacementReusableBlockRow).toContainText(/1 page refs|1 refs em paginas/i)
  })

  test('shows conditional page schema fields only when their visibility rule matches', async ({ page }) => {
    const contentModelName = 'Conditional schema QA'

    await page.setViewportSize({ width: 1600, height: 1900 })
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)

    await fillTextInputDirect(cmsInputByLabel(page, 'Content model name'), contentModelName)
    await fillTextInputDirect(cmsInputByLabel(page, 'Content model description'), 'Shows promo fields only when the layout mode is promo')

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const layoutModeRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      layoutModeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      'layoutMode'
    )
    await fillTextInputDirect(
      layoutModeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      'Layout mode'
    )
    await layoutModeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
    await page.getByRole('option', { name: 'Select', exact: true }).first().click()
    await fillTextInputDirect(
      layoutModeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Options (one per line)' }) }).first().locator('textarea').first(),
      'default\npromo'
    )
    await fillTextInputDirect(
      layoutModeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).first().locator('input, textarea').first(),
      'default'
    )

    await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
    const promoBadgeRow = page.locator('.cms-content-model-fields__item').last()
    await fillTextInputDirect(
      promoBadgeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
      'promoBadge'
    )
    await fillTextInputDirect(
      promoBadgeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
      'Promo badge'
    )
    await promoBadgeRow.getByRole('switch', { name: /^(Conditional visibility|Visibilidade condicional)$/ }).click()
    await promoBadgeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Depends on field' }) }).first().click()
    await page.getByRole('option', { name: 'Layout mode', exact: true }).first().click()
    await promoBadgeRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Expected value' }) }).first().locator('input, textarea').first().fill('promo')

    await page.getByRole('button', { name: /^(Save content model|Salvar modelo de conteudo)$/ }).first().click()

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await selectOptionByFieldLabel(page, 'Content model', contentModelName)

    const customFieldsCard = page.locator('.cms-page-item__custom-fields').first()
    await expect(customFieldsCard.locator('.q-field__label', { hasText: 'Layout mode' })).toBeVisible()
    await expect(customFieldsCard.locator('.q-field__label', { hasText: 'Promo badge' })).toHaveCount(0)

    await selectOptionByFieldLabel(page, 'Layout mode', 'promo')
    await expect(customFieldsCard.locator('.q-field__label', { hasText: 'Promo badge' })).toBeVisible()
  })

  test('seeds localized block presets in the builder and keeps English base content intact', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Language', 'Portuguese (Brazil)')

    await openDrawerModule(page, /^(Blocks|Blocos)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)

    const initialBlockCount = await page.locator('.cms-block-row').count()
    await selectOptionByFieldLabelPattern(page, /^(Target section|Secao alvo)$/, 'Hero (1)')
    await selectOptionByFieldLabelPattern(page, /^(Palette block|Bloco da paleta)$/, 'Landing Hero (layout)')
    await selectOptionByFieldLabelPattern(page, /^(Block preset|Preset de bloco)$/, 'Hero · Showcase em video')
    await commitFocusedSelect(page)
    await page.getByRole('button', { name: /^(Add block|Adicionar bloco)$/ }).first().click()
    await expect(page.locator('.cms-block-row')).toHaveCount(initialBlockCount + 1)

    const localizedTitleInput = page
      .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
      .first()
      .locator('input, textarea')
      .first()

    await expect(localizedTitleInput).toHaveValue('Mostre o produto em movimento')
    await expect(page.locator('.cms-blocks-props__header small').first()).toContainText('Hero · Showcase em video')

    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Idioma', 'English')

    await openDrawerModule(page, /^(Blocks|Blocos)$/)
    await expect(
      page
        .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue('Show the product in motion')
    await expect(page.locator('.cms-blocks-props__header small').first()).toContainText('Hero · Video showcase')
  })

  test('offers guided page quick-start workflows in Pages builder', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)

    const quickStarts = page.locator('.cms-pages__rail .cms-pages__sidebar-section', {
      has: page.locator('.cms-pages__quick-starts-header strong', { hasText: /^(Quick-start workflows|Fluxos de quick-start)$/ }),
    }).first()
    await expect(quickStarts).toBeVisible()
    await expect(quickStarts.locator('.cms-pages__quick-starts-header strong').first()).toHaveText(
      /^(Quick-start workflows|Fluxos de quick-start)$/
    )

    const initialPageCount = await page.locator('.cms-page-item').count()
    const blankQuickStart = quickStarts.locator('.cms-page-quick-start-card', { hasText: /(Blank page|Pagina em branco)/ }).first()
    await expect(blankQuickStart).toContainText('Minimal scaffold')
    await blankQuickStart.getByRole('button', { name: /^(Create page|Criar pagina)$/ }).click()
    await expect(page.locator('.cms-page-item')).toHaveCount(initialPageCount + 1)

    const marketingQuickStart = quickStarts.locator('.cms-page-quick-start-card', { hasText: /(Marketing funnel|Funil de marketing)/ }).first()
    await marketingQuickStart.getByRole('button', { name: /^(Create \+ open blocks|Criar \+ abrir blocos)$/ }).click()

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    const targetPageField = page.locator('.q-field', {
      has: page.locator('.q-field__label', { hasText: /^(Target page|Pagina alvo)$/ }),
    }).first()
    await expect(targetPageField).toContainText('Marketing Page (/marketing)')

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(page.locator('.cms-page-item')).toHaveCount(initialPageCount + 2)
  })

  test('installs starter-kit bundles and opens Blocks with seeded reusable libraries', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)

    const initialSettings = await page.evaluate((storageKey: string) => {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)
      return parsed?.settings ?? null
    }, CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY)

    const starterKits = page.locator('.cms-pages__rail .cms-pages__starter-kits').first()
    await expect(starterKits).toBeVisible()
    await expect(starterKits.locator('.cms-pages__quick-starts-header strong').first()).toHaveText(
      /^(Starter-kit bundles|Bundles de starter kit)$/
    )

    const productLaunchKit = starterKits.locator('.cms-page-quick-start-card', {
      hasText: /(Starter kit · Product launch|Starter kit · Lancamento de produto)/,
    }).first()

    await expect(productLaunchKit).toContainText(/Landing \((default|padrao)\)/)
    await expect(productLaunchKit).toContainText(/Landing page/)
    await productLaunchKit.getByRole('button', { name: /^(Install \+ open blocks|Instalar \+ abrir blocos)$/ }).click()

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    const targetPageField = page.locator('.q-field', {
      has: page.locator('.q-field__label', { hasText: /^(Target page|Pagina alvo)$/ }),
    }).first()
    await expect(targetPageField).toContainText(/Landing Page/)

    await expect.poll(async () => {
      const parsed = await page.evaluate((storageKey: string) => {
        const raw = window.localStorage.getItem(storageKey)
        if (!raw) {
          return null
        }

        const stored = JSON.parse(raw)
        return stored?.settings ?? null
      }, CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY)

      return {
        pages: parsed?.pages?.length ?? 0,
        reusableSections: parsed?.reusableSections?.length ?? 0,
        reusableBlocks: parsed?.reusableBlocks?.length ?? 0,
        blockPresets: parsed?.authoredBlockPresets?.length ?? 0,
        fieldPresets: parsed?.authoredContentModelFieldPresets?.length ?? 0,
      }
    }).toEqual({
      pages: (initialSettings?.pages?.length ?? 0) + 1,
      reusableSections: (initialSettings?.reusableSections?.length ?? 0) + 3,
      reusableBlocks: (initialSettings?.reusableBlocks?.length ?? 0) + 3,
      blockPresets: (initialSettings?.authoredBlockPresets?.length ?? 0) + 3,
      fieldPresets: (initialSettings?.authoredContentModelFieldPresets?.length ?? 0) + 3,
    })
  })

  test('surfaces starter-kit impact analysis and archive restore flows for seeded reusable blocks', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)

    const starterKits = page.locator('.cms-pages__starter-kits').first()
    const productLaunchKit = starterKits.locator('.cms-page-quick-start-card', {
      hasText: /(Starter kit · Product launch|Starter kit · Lancamento de produto)/,
    }).first()

    await productLaunchKit.getByRole('button', { name: /^(Install \+ open blocks|Instalar \+ abrir blocos)$/ }).click()
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)

    const reusableBlockLibrary = page
      .locator('.cms-blocks-library', { has: page.getByText(/^(Reusable block library|Biblioteca de blocos reutilizaveis)$/) })
      .first()
    const starterReusableBlockRow = reusableBlockLibrary
      .locator('.cms-reusable-block-row', { hasText: /(Launch hero block|Bloco hero de lancamento)/ })
      .first()

    await expect(starterReusableBlockRow).toBeVisible()
    await expect(starterReusableBlockRow).toContainText(/uses|usos/i)

    await starterReusableBlockRow.getByRole('button', { name: /^(Inspect reusable block usage|Inspecionar uso do bloco reutilizavel)$/ }).click()
    const usageDrawer = page.locator('.cms-usage-drawer')
    const usageDialog = page.locator('.q-dialog', { has: page.locator('.cms-usage-drawer') })
    await expect(usageDrawer).toBeVisible()
    await expect(usageDrawer).toContainText(/(Launch hero block|Bloco hero de lancamento)/)
    await expect(usageDrawer).toContainText(/(No usage references found|Nenhuma referencia de uso encontrada)/)
    await usageDrawer.locator('.cms-usage-drawer__close').click()
    await expect(usageDialog).toBeHidden()

    await starterReusableBlockRow.getByRole('button', { name: /^(Archive|Arquivar)$/ }).click()
    await expect(reusableBlockLibrary.locator('.cms-reusable-block-row', { hasText: /(Launch hero block|Bloco hero de lancamento)/ })).toHaveCount(0)

    await reusableBlockLibrary.getByLabel(/^(Show archived|Mostrar arquivados)$/).click()
    await expect(starterReusableBlockRow).toBeVisible()
    await expect(starterReusableBlockRow.locator('small').filter({ hasText: /^(Archived|Arquivado)$/ })).toBeVisible()
    await expect(starterReusableBlockRow.getByRole('button', { name: /^(Use|Usar)$/ })).toBeDisabled()

    await starterReusableBlockRow.getByRole('button', { name: /^(Restore|Restaurar)$/ }).click()
    await expect(starterReusableBlockRow.getByRole('button', { name: /^(Use|Usar)$/ })).toBeEnabled()
  })

  test('uses shared builder search and quick commands across Pages and Blocks', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)

    await selectOptionByFieldLabelPattern(page, /^(Page template|Template de pagina)$/, 'Marketing funnel')
    await fillTextInput(page.getByPlaceholder('Search module').first(), 'funnel')

    const quickStartSection = page
      .locator('.cms-pages__rail .cms-pages__sidebar-section', { has: page.getByText(/^(Quick-start workflows|Fluxos de quick-start)$/) })
      .first()

    await expect(quickStartSection.locator('.cms-page-quick-start-card')).toHaveCount(1)
    await expect(quickStartSection.locator('.cms-page-quick-start-card').first()).toContainText('Marketing funnel')
    await expect(page.locator('.cms-page-item')).toHaveCount(0)

    await selectOptionByFieldLabelPattern(page, /^(Quick command|Comando rapido)$/, 'Create and open blocks')
    await page.getByRole('button', { name: /^(Run|Executar)$/ }).first().click()

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    const targetPageField = page.locator('.q-field', {
      has: page.locator('.q-field__label', { hasText: /^(Target page|Pagina alvo)$/ }),
    }).first()
    await expect(targetPageField).toContainText('Marketing Page (/marketing)')

    await fillTextInput(page.getByPlaceholder('Search module').first(), 'hero')
    await expect(page.locator('.cms-blocks-list .cms-block-item')).toHaveCount(1)
    await expect(page.locator('.cms-blocks-list .cms-block-item .cms-block-item__meta strong').first()).toHaveText('Hero')

    await selectOptionByFieldLabelPattern(page, /^(Quick command|Comando rapido)$/, 'Focus section: Hero')
    await page.getByRole('button', { name: /^(Run|Executar)$/ }).first().click()

    const targetSectionField = page.locator('.q-field', {
      has: page.locator('.q-field__label', { hasText: /^(Target section|Secao alvo)$/ }),
    }).first()
    await expect(targetSectionField).toContainText('Hero')
  })

  test('authors localized block presets and uses them as section starter presets', async ({ page }) => {
    const authoredPresetNameEn = 'Hero Authored EN'
    const authoredPresetNamePt = 'Hero Authored PT'
    const authoredPresetDescriptionEn = 'Authored preset from hero block'
    const authoredPresetDescriptionPt = 'Preset authored localizado'
    const localizedHeroTitle = 'Hero authored em portugues'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Pages|Paginas)$/)

    await page.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).nth(1).click({ force: true })
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)

    await fillTextInput(cmsInputByLabel(page, 'Preset name'), authoredPresetNameEn)
    await fillTextInput(cmsInputByLabel(page, 'Preset description'), authoredPresetDescriptionEn)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Save as preset' }).first().click()
    await expect(page.locator('.cms-blocks-library .cms-reusable-block-row', { hasText: authoredPresetNameEn }).first()).toBeVisible()

    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteudo)$/)
    await selectOptionByFieldLabel(page, 'Language', 'Portuguese (Brazil)')

    await openDrawerModule(page, /^(Blocks|Blocos)$/)
    const localizedHeroTitleInput = page
      .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(localizedHeroTitleInput, localizedHeroTitle)
    await fillTextInput(cmsInputByLabel(page, 'Nome do preset'), authoredPresetNamePt)
    await fillTextInput(cmsInputByLabel(page, 'Descricao do preset'), authoredPresetDescriptionPt)
    await page.locator('.cms-blocks-reusable-toolbar .q-btn', { hasText: 'Atualizar preset' }).first().click()
    await expect(page.locator('.cms-blocks-library .cms-reusable-block-row', { hasText: authoredPresetNamePt }).first()).toBeVisible()

    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Pages|Paginas)$/)
    await selectOptionByFieldLabelPattern(page, /^(Page template|Template de pagina)$/, 'Pagina em branco')
    await commitFocusedSelect(page)
    await page.getByRole('button', { name: /^(Add page|Adicionar pagina)$/ }).first().click({ force: true })

    const authoredPage = page.locator('.cms-pages__editor .cms-page-item').last()
    await fillTextInput(
      authoredPage
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
        .first()
        .locator('input, textarea')
        .first(),
      'Authored Preset Page'
    )

    const starterField = authoredPage
      .locator('.cms-page-item__sections-actions .q-field', {
        has: page.locator('.q-field__label', { hasText: /^(Starter preset|Preset inicial)$/ }),
      })
      .first()
    await starterField.click()
    const starterOption = page.getByRole('option', { name: authoredPresetNamePt, exact: true }).first()
    if (await starterOption.count() > 0) {
      await starterOption.click()
    } else {
      await page.locator('.q-menu .q-item', { hasText: authoredPresetNamePt }).first().click()
    }
    await commitFocusedSelect(page)

    await authoredPage.getByRole('button', { name: /^(Add section|Adicionar secao)$/ }).first().click({ force: true })

    const authoredSectionRow = authoredPage.locator('.cms-page-section-row').last()
    await expect(authoredSectionRow).toBeVisible()
    await authoredSectionRow.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await expect(page.locator('.cms-blocks-props__header small').first()).toContainText(authoredPresetNamePt)
    await expect(
      page
        .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue(localizedHeroTitle)
  })

  test('shows starter preset variants in Pages and seeds sections from the selected variant', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^(Pages|Paginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Pages|Paginas)$/)

    await selectOptionByFieldLabelPattern(page, /^(Page template|Template de pagina)$/, 'Blank page')
    await commitFocusedSelect(page)
    await page.getByRole('button', { name: /^(Add page|Adicionar pagina)$/ }).first().click({ force: true })

    const variantPage = page.locator('.cms-pages__editor .cms-page-item').last()
    await fillTextInput(
      variantPage
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
        .first()
        .locator('input, textarea')
        .first(),
      'Variant Cards Page'
    )

    const videoVariantCard = variantPage
      .locator('.cms-page-item__starter-card', { hasText: 'Hero · Video showcase' })
      .first()
    await expect(videoVariantCard).toBeVisible()
    await videoVariantCard.click()
    await expect(videoVariantCard).toHaveClass(/cms-page-item__starter-card--active/)

    await variantPage.getByRole('button', { name: /^(Add section|Adicionar secao)$/ }).first().click({ force: true })

    const variantSectionRow = variantPage.locator('.cms-page-section-row').last()
    await variantSectionRow.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).first().click({ force: true })

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await expect(page.locator('.cms-blocks-props__header small').first()).toContainText('Hero · Video showcase')
    await expect(
      page
        .locator('.cms-blocks-fields .q-field', { has: page.locator('.q-field__label', { hasText: 'Title' }) })
        .first()
        .locator('input, textarea')
        .first()
    ).toHaveValue('Show the product in motion')
  })

  test('surfaces shared content diagnostics in pages and blocks modules', async ({ page }) => {
    const diagnosticsPageTitle = 'Content Diagnostics Page'
    const diagnosticsCode = 'pages.sections.label.required'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    await page.locator('.cms-pages__header-actions .q-btn', { hasText: 'Add page' }).first().click()
    const secondPage = page.locator('.cms-page-item').nth(1)
    await expect(secondPage).toBeVisible()

    const pageGridFields = secondPage.locator('.cms-page-item__grid .q-field')
    const pageTitleInput = pageGridFields.nth(2).locator('input, textarea').first()
    await fillTextInput(pageTitleInput, diagnosticsPageTitle)

    const firstSectionRow = secondPage.locator('.cms-page-section-row').first()
    const firstSectionLabelInput = firstSectionRow
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Section label' }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(firstSectionLabelInput, '')

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    await expect(
      page.locator('.cms-pages__preview .cms-diagnostics-item', { hasText: diagnosticsCode }).first()
    ).toBeVisible()

    await openDrawerModule(page, /^Blocks$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Blocks')
    const targetPageField = page
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Target page' }) })
      .first()
    await targetPageField.click()
    await page.locator('.q-menu .q-item', { hasText: diagnosticsPageTitle }).first().click()
    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    await expect(
      page.locator('.cms-blocks__preview .cms-diagnostics-item', { hasText: diagnosticsCode }).first()
    ).toBeVisible()
  })

  test('supports drag-and-drop for page sections and block rows', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')

    const footerSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="footer"]') })
      .first()
    const headerSectionRow = page
      .locator('.cms-page-section-row', { has: page.locator('input[value="header"]') })
      .first()

    await footerSectionRow.dragTo(headerSectionRow, {
      targetPosition: { x: 24, y: 8 },
    })
    await expect(page.locator('.cms-page-section-row').first().locator('input').first()).toHaveValue('footer')

    await page
      .locator('.cms-page-section-row', { has: page.locator('input[value="header"]') })
      .first()
      .locator('.q-btn', { hasText: 'Open blocks' })
      .first()
      .click()

    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Blocks')

    const heroBlockRow = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    const featuresSection = page
      .locator('.cms-block-item', { has: page.locator('.cms-block-item__meta strong', { hasText: 'Features' }) })
      .first()
    const heroSection = page
      .locator('.cms-block-item', { has: page.locator('.cms-block-item__meta strong', { hasText: 'Hero' }) })
      .first()
    const draggedBlockId = await heroSection.locator('.cms-block-row__meta small').first().innerText()

    await heroBlockRow.dragTo(featuresSection, {
      targetPosition: { x: 24, y: 8 },
    })

    await expect(featuresSection.locator('.cms-block-row', { hasText: 'landing.hero' })).toHaveCount(1)
    await expect(featuresSection.locator('.cms-block-row__meta small', { hasText: draggedBlockId })).toHaveCount(1)
    await expect(heroSection.locator('.cms-block-row__meta small', { hasText: draggedBlockId })).toHaveCount(0)
  })

  test('supports authoring undo redo plus block duplication and bulk cleanup', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)

    const productNameInput = cmsInputByLabel(page, 'Product name')
    const originalProductName = await productNameInput.inputValue()
    await fillTextInput(productNameInput, 'History Driven Tenant')

    await settingsActionButton(page, 'Undo').click()
    await expect(productNameInput).toHaveValue(originalProductName)

    await settingsActionButton(page, 'Redo').click()
    await expect(productNameInput).toHaveValue('History Driven Tenant')

    await openDrawerModule(page, /^Blocks$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Blocks')

    const heroSection = page
      .locator('.cms-block-item', { has: page.locator('.cms-block-item__meta strong', { hasText: 'Hero' }) })
      .first()
    const heroRow = heroSection.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()
    await heroRow.locator('.q-btn[aria-label=\"Duplicate block\"]').first().click()
    await expect(heroSection.locator('.cms-block-row')).toHaveCount(2)

    await page.locator('.cms-blocks-toolbar__bulk .q-btn', { hasText: 'Disable all blocks' }).first().click()
    await page.locator('.cms-blocks-toolbar__bulk .q-btn', { hasText: 'Remove disabled blocks' }).first().click()
    await expect(heroSection.locator('.cms-block-row')).toHaveCount(1)
  })

  test('manages media library assets and applies branding bindings', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Media$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Media')

    await page.locator('.cms-media__actions .q-btn', { hasText: 'New asset' }).first().click()
    await fillTextInput(cmsInputByLabel(page, 'Asset name'), 'Docs Cover')
    await fillTextInput(cmsInputByLabel(page, 'Asset URL'), 'https://example.com/assets/docs-cover.png')
    await fillTextInput(cmsInputByLabel(page, 'Asset alt text'), 'Docs cover preview')
    await fillTextInput(cmsInputByLabel(page, 'Tags (comma separated)'), 'docs, hero')
    await fillTextInput(cmsInputByLabel(page, 'Usage tags (comma separated)'), 'branding.favicon, content.hero')
    await page.locator('.cms-media__actions .q-btn', { hasText: 'Save asset' }).first().click()

    const createdAssetRow = page.locator('.cms-media-preview-item', { hasText: 'Docs Cover' }).first()
    await expect(createdAssetRow).toBeVisible()

    await page.locator('.cms-media__actions--secondary .q-btn', { hasText: 'Apply as favicon' }).first().click()
    const faviconBinding = page.locator('.cms-media-preview-item--binding', { hasText: 'Favicon binding' }).first()
    await expect(faviconBinding).toContainText('Docs Cover')
    await expect(faviconBinding).toContainText('https://example.com/assets/docs-cover.png')

    await page.reload()
    await openDrawerModule(page, /^Media$/)
    await expect(page.locator('.cms-media-preview-item', { hasText: 'Docs Cover' }).first()).toBeVisible()
    await expect(page.locator('.cms-media-preview-item--binding', { hasText: 'Favicon binding' }).first()).toContainText('Docs Cover')
  })

  test('binds media-library assets into block schemas and resolves them in preview', async ({ page }) => {
    const assetUrl = 'https://example.com/assets/hero-image-reference.png'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Media$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Media')

    await page.locator('.cms-media__actions .q-btn', { hasText: 'New asset' }).first().click()
    await fillTextInput(cmsInputByLabel(page, 'Asset name'), 'Hero Image Asset')
    await fillTextInput(cmsInputByLabel(page, 'Asset URL'), assetUrl)
    await fillTextInput(cmsInputByLabel(page, 'Asset alt text'), 'Hero image asset alt')
    await page.locator('.cms-media__actions .q-btn', { hasText: 'Save asset' }).first().click()
    await expect(page.locator('.cms-media-preview-item', { hasText: 'Hero Image Asset' }).first()).toBeVisible()

    await openDrawerModule(page, /^Blocks$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Blocks')

    const heroRow = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await expect(heroRow).toBeVisible()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()

    await selectOptionByFieldLabel(page, IMAGE_ASSET_LABEL, 'Hero Image Asset (Image)')
    await expect(page.locator('img.cms-landing-hero-media__image').first()).toHaveAttribute('src', assetUrl)
    await expect(page.locator('img.cms-landing-hero-media__image').first()).toHaveAttribute('alt', 'Hero image asset alt')

    await page.reload()

    await openDrawerModule(page, /^Blocks$/)
    const reloadedHeroRow = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await reloadedHeroRow.locator('.q-btn', { hasText: 'Select' }).first().click()
    await expect(page.locator('img.cms-landing-hero-media__image').first()).toHaveAttribute('src', assetUrl)
  })

  test('surfaces diagnostics when a block references a deleted media asset', async ({ page }) => {
    const assetUrl = 'https://example.com/assets/deleted-reference.png'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Media$/)
    await page.locator('.cms-media__actions .q-btn', { hasText: 'New asset' }).first().click()
    await fillTextInput(cmsInputByLabel(page, 'Asset name'), 'Deleted Hero Asset')
    await fillTextInput(cmsInputByLabel(page, 'Asset URL'), assetUrl)
    await fillTextInput(cmsInputByLabel(page, 'Asset alt text'), 'Deleted hero asset alt')
    await page.locator('.cms-media__actions .q-btn', { hasText: 'Save asset' }).first().click()

    await openDrawerModule(page, /^Blocks$/)
    const heroRow = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()
    await selectOptionByFieldLabel(page, IMAGE_ASSET_LABEL, 'Deleted Hero Asset (Image)')
    await expect(page.locator('img.cms-landing-hero-media__image').first()).toHaveAttribute('src', assetUrl)

    await openDrawerModule(page, /^Media$/)
    await selectOptionByFieldLabel(page, 'Media library asset', 'Deleted Hero Asset (Image)')
    await page.locator('.cms-media__actions .q-btn', { hasText: 'Delete asset' }).first().click()
    await expect(page.locator('.cms-media-preview-item', { hasText: 'Deleted Hero Asset' })).toHaveCount(0)

    await openDrawerModule(page, /^Blocks$/)
    const heroRowAfterDelete = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await heroRowAfterDelete.locator('.q-btn', { hasText: 'Select' }).first().click()
    await expect(page.locator('.cms-diagnostics-item', { hasText: 'media_asset_missing' }).first()).toContainText('missing asset')
  })

  test('replaces managed media references across branding and block bindings', async ({ page }) => {
    const originalAssetUrl = 'https://example.com/assets/original-managed-hero.png'
    const replacementAssetUrl = 'https://example.com/assets/replacement-managed-hero.png'

    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Media$/)

    await page.locator('.cms-media__actions .q-btn', { hasText: 'New asset' }).first().click()
    await fillTextInput(cmsInputByLabel(page, 'Asset name'), 'Original Managed Hero')
    await fillTextInput(cmsInputByLabel(page, 'Asset URL'), originalAssetUrl)
    await fillTextInput(cmsInputByLabel(page, 'Asset alt text'), 'Original managed hero alt')
    await page.locator('.cms-media__actions .q-btn', { hasText: 'Save asset' }).first().click()
    await expect(page.locator('.cms-media-preview-item', { hasText: 'Original Managed Hero' }).first()).toBeVisible()

    await openDrawerModule(page, /^Blocks$/)
    const heroRow = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()
    await selectOptionByFieldLabel(page, IMAGE_ASSET_LABEL, 'Original Managed Hero (Image)')
    await expect(page.locator('img.cms-landing-hero-media__image').first()).toHaveAttribute('src', originalAssetUrl)

    await openDrawerModule(page, /^Media$/)
    await selectOptionByFieldLabel(page, 'Media library asset', 'Original Managed Hero (Image)')
    await page.locator('.cms-media__actions--secondary .q-btn', { hasText: 'Apply as brand logo' }).first().click()
    await expect(page.locator('.cms-media-preview-item--binding', { hasText: 'Brand logo binding' }).first()).toContainText('Original Managed Hero')

    await page.locator('.cms-media__actions .q-btn', { hasText: 'New asset' }).first().click()
    await fillTextInput(cmsInputByLabel(page, 'Asset name'), 'Replacement Managed Hero')
    await fillTextInput(cmsInputByLabel(page, 'Asset URL'), replacementAssetUrl)
    await fillTextInput(cmsInputByLabel(page, 'Asset alt text'), 'Replacement managed hero alt')
    await page.locator('.cms-media__actions .q-btn', { hasText: 'Save asset' }).first().click()
    await expect(page.locator('.cms-media-preview-item', { hasText: 'Replacement Managed Hero' }).first()).toBeVisible()

    await selectOptionByFieldLabel(page, 'Media library asset', 'Original Managed Hero (Image)')
    const replaceTargetField = page
      .locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Replace target asset' }) })
      .first()
    await replaceTargetField.scrollIntoViewIfNeeded()
    await replaceTargetField.click()
    await expect(page.locator('.q-menu:visible')).toHaveCount(1)
    await page.locator('.q-menu:visible [role="option"]', { hasText: 'Replacement Managed Hero' }).first().click()
    await expect(replaceTargetField).toContainText('Replacement Managed Hero')
    await commitFocusedSelect(page)
    await expect(page.locator('.cms-media__actions .q-btn', { hasText: 'Replace references' }).first()).toBeEnabled()
    await page.locator('.cms-media__actions .q-btn', { hasText: 'Replace references' }).first().click()

    await expect(page.locator('.cms-media-preview-item', { hasText: 'Original Managed Hero' })).toHaveCount(0)
    await expect(page.locator('.cms-media-preview-item--binding', { hasText: 'Brand logo binding' }).first()).toContainText('Replacement Managed Hero')

    await openDrawerModule(page, /^Blocks$/)
    const heroRowAfterReplace = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await heroRowAfterReplace.locator('.q-btn', { hasText: 'Select' }).first().click()
    await expect(page.locator('img.cms-landing-hero-media__image').first()).toHaveAttribute('src', replacementAssetUrl)
    await expect(page.locator('img.cms-landing-hero-media__image').first()).toHaveAttribute('alt', 'Replacement managed hero alt')
  })

  test('executes release orchestration flow: draft, validate, publish and rollback', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Releases$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Releases')

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Publish now' }).first().click()
    await expect(page.locator('.cms-release-item .q-chip', { hasText: 'published' }).first()).toBeVisible()

    await openSettingsModule(page)
    await openSettingsTab(page, /branding/i)
    await fillTextInput(cmsInputByLabel(page, 'Product name'), 'Release Candidate B')

    await openDrawerModule(page, /^Releases$/)
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Publish now' }).first().click()

    await selectFirstOptionByFieldLabel(page, 'Rollback target')
    await releasesEditor.locator('.q-btn', { hasText: 'Rollback' }).first().click()
    await expect(page.locator('.cms-release-item .q-chip', { hasText: 'rolled_back' }).first()).toBeVisible()
  })

  test('surfaces a release candidate checklist and updates it after validation', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Releases$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Releases')

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()

    const checklist = page.locator('.cms-release-checklist').first()
    const validationItem = checklist.locator('[data-cms-checklist-item="validation"]').first()
    const workflowItem = checklist.locator('[data-cms-checklist-item="workflow"]').first()

    await expect(checklist).toBeVisible()
    await expect(validationItem).toHaveAttribute('data-cms-checklist-status', 'blocking')
    await expect(workflowItem).toHaveAttribute('data-cms-checklist-status', 'warning')

    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()

    await expect(validationItem).toHaveAttribute('data-cms-checklist-status', 'ready')
    await expect(checklist).toContainText('Release candidate checklist')
  })

  test('navigates from release checklist findings to authoring surfaces and shortcuts validation', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Releases$/)

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()

    const checklist = page.locator('.cms-release-checklist').first()
    const validationItem = checklist.locator('[data-cms-checklist-item="validation"]').first()

    await expect(validationItem).toHaveAttribute('data-cms-checklist-status', 'blocking')
    await validationItem.getByRole('button', { name: /^(Run Validate|Executar validar)$/ }).click()
    await expect(validationItem).toHaveAttribute('data-cms-checklist-status', 'ready')

    await openDrawerModule(page, /^Pages$/)
    const pageTitleInput = page
      .locator('.cms-page-item')
      .first()
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(pageTitleInput, '')

    await openDrawerModule(page, /^Releases$/)
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()

    const contentIntegrityItem = checklist.locator('[data-cms-checklist-item="content_integrity"]').first()
    await expect(contentIntegrityItem).toHaveAttribute('data-cms-checklist-status', 'blocking')
    await contentIntegrityItem.getByRole('button', { name: /^(Open Pages|Abrir paginas)/ }).first().click()
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')
  })

  test('surfaces accessibility and content QA findings in the release checklist', async ({ page }) => {
    await page.goto('/?cms=1')

    await openDrawerModule(page, /^Pages$/)
    const firstPage = page.locator('.cms-page-item').first()
    const pageDescriptionInput = firstPage
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Description|Descricao)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(pageDescriptionInput, '')

    await openDrawerModule(page, /^Releases$/)
    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()

    const checklist = page.locator('.cms-release-checklist').first()
    const contentQaItem = checklist.locator('[data-cms-checklist-item="content_qa"]').first()

    await expect(contentQaItem).toHaveAttribute('data-cms-checklist-status', 'warning')
    await expect(contentQaItem).toContainText(/Accessibility and content QA|Acessibilidade e QA de conteudo/)
    await expect(contentQaItem).toContainText(/missing a description|descricao/)
    await contentQaItem.getByRole('button', { name: /^(Open Pages|Abrir paginas)/ }).first().click()
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Pages')
  })

  test('surfaces a unified release review hub in Releases', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Releases$/)

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Publish now' }).first().click()
    await expect(page.locator('.cms-release-item .q-chip', { hasText: 'published' }).first()).toBeVisible()

    await openDrawerModule(page, /^Pages$/)
    const firstPage = page.locator('.cms-page-item').first()
    const pageTitleInput = firstPage
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(pageTitleInput, 'Landing release hub')

    await openDrawerModule(page, /^Releases$/)
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()

    const reviewHub = page.locator('[data-cms-release-review-hub]').first()
    await expect(reviewHub).toBeVisible()
    await expect(reviewHub).toContainText('Unified release review')

    const changesCard = reviewHub.locator('[data-cms-review-card="changes"]').first()
    const localesCard = reviewHub.locator('[data-cms-review-card="locales"]').first()
    const checklistCard = reviewHub.locator('[data-cms-review-card="checklist"]').first()

    await expect(changesCard).toHaveAttribute('data-cms-review-status', 'warning')
    await expect(changesCard).toContainText('Landing release hub')
    await expect(localesCard).toHaveAttribute('data-cms-review-status', 'warning')
    await expect(checklistCard).toHaveAttribute('data-cms-review-status', 'warning')
    await expect(checklistCard).toContainText('Checklist')
  })

  test('surfaces governance workflow and audit signals in Releases', async ({ page }) => {
    await page.goto('/?cms=1')

    const saveButton = page.getByRole('button', { name: /^(Save tenant settings|Salvar configuracoes do tenant)$/ }).first()
    await saveButton.click()

    await openDrawerModule(page, /^Releases$/)

    const governanceHub = page.locator('[data-cms-governance-hub]').first()
    await expect(governanceHub).toBeVisible()
    await expect(governanceHub).toContainText('Governance')

    const workflowCard = governanceHub.locator('[data-cms-governance-card="workflow"]').first()
    const auditCard = governanceHub.locator('[data-cms-governance-card="audit"]').first()
    const rolesCard = governanceHub.locator('[data-cms-governance-card="roles"]').first()

    await expect(workflowCard).toHaveAttribute('data-cms-governance-status', 'warning')
    await expect(auditCard).toHaveAttribute('data-cms-governance-status', 'ready')
    await expect(rolesCard).toContainText('Role policies')

    await expect(governanceHub.locator('[data-cms-governance-revision]').first()).toBeVisible()
    await expect(governanceHub.locator('[data-cms-governance-audit]').first()).toContainText(/Save draft|Salvar rascunho/)
    await expect(governanceHub.locator('[data-cms-governance-role]').first()).toBeVisible()
  })

  test('supports draft vs published preview with viewport and locale controls', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Pages$/)
    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()

    const heroSection = page
      .locator('.cms-block-item', { has: page.locator('.cms-block-item__meta strong', { hasText: 'Hero' }) })
      .first()
    const heroRow = heroSection.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await expect(heroRow).toBeVisible()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    const blocksPreview = page.locator('.cms-blocks__preview').first()
    const previewCard = blocksPreview.locator('.cms-preview-card--content').first()

    await expect(previewCard).toContainText('Build page experiences faster')

    await openDrawerModule(page, /^Releases$/)
    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Publish now' }).first().click()
    await expect(page.locator('.cms-release-item .q-chip', { hasText: 'published' }).first()).toBeVisible()

    await openDrawerModule(page, /^Pages$/)
    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    await openCmsWorkspaceTab(page, /^(Editor)$/i)
    const reopenedBlocksEditor = page.locator('.cms-blocks__editor').first()
    await expect(reopenedBlocksEditor).toBeVisible()
    await reopenedBlocksEditor.evaluate(node => {
      node.scrollTop = 0
    })
    const reopenedHeroSection = reopenedBlocksEditor
      .locator('.cms-block-item')
      .filter({ has: page.locator('.cms-block-item__meta strong', { hasText: 'Hero' }) })
      .first()
    const reopenedHeroRow = reopenedHeroSection
      .locator('.cms-block-row')
      .filter({ hasText: 'landing.hero' })
      .first()
    await reopenedHeroRow.scrollIntoViewIfNeeded()
    await expect(reopenedHeroRow).toBeVisible()
    await reopenedHeroRow.locator('.q-btn', { hasText: 'Select' }).first().click()
    await fillTextInput(cmsInputByLabel(page, 'Title'), 'Draft preview title')
    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    await expect(previewCard).toContainText('Draft preview title')

    await selectOptionByFieldLabel(page, 'Preview source', 'Published')
    await expect(blocksPreview.locator('.cms-preview-toolbar')).toHaveAttribute('data-cms-preview-source', 'published')
    await expect(previewCard).not.toContainText('Draft preview title')
    await expect(previewCard).toContainText('Build page experiences faster')

    await selectOptionByFieldLabel(page, 'Preview locale', 'Portuguese (Brazil)')
    await expect(previewCard).toContainText('Monte paginas mais rapido')

    await selectOptionByFieldLabel(page, 'Preview viewport', 'Mobile')
    await expect(blocksPreview.locator('.cms-preview-toolbar')).toHaveAttribute('data-cms-preview-viewport', 'mobile')
    await expect(blocksPreview.locator('.cms-runtime-preview__frame').first()).toHaveAttribute('data-preview-viewport', 'mobile')
  })

  test('surfaces draft vs published review summaries in Pages and Blocks preview', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Releases$/)

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Publish now' }).first().click()
    await expect(page.locator('.cms-release-item .q-chip', { hasText: 'published' }).first()).toBeVisible()

    await openDrawerModule(page, /^Pages$/)
    const firstPage = page.locator('.cms-page-item').first()
    const pageTitleInput = firstPage
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(pageTitleInput, 'Landing diff review')

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    const pagesPreview = page.locator('.cms-pages__preview').first()
    await expect(pagesPreview.locator('.cms-review-summary').first()).toContainText('Draft vs published review')
    await expect(pagesPreview.locator('.cms-review-summary').first()).toContainText('Changes detected')
    await expect(pagesPreview.locator('.cms-review-summary').first()).toContainText('Landing diff review')

    await firstPage.getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()
    const heroSection = page
      .locator('.cms-block-item', { has: page.locator('.cms-block-item__meta strong', { hasText: 'Hero' }) })
      .first()
    const heroRow = heroSection.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await expect(heroRow).toBeVisible()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    const blocksPreview = page.locator('.cms-blocks__preview').first()
    await expect(blocksPreview.locator('.cms-review-summary').first()).toContainText('Draft vs published review')
    await expect(blocksPreview.locator('.cms-review-summary').first()).toContainText('Landing diff review')
    await expect(blocksPreview.locator('.cms-review-summary').first()).toContainText('Changed')
  })

  test('exports a draft comparison review package from Releases', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Releases$/)

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Publish now' }).first().click()
    await expect(page.locator('.cms-release-item .q-chip', { hasText: 'published' }).first()).toBeVisible()

    await openDrawerModule(page, /^Pages$/)
    const firstPage = page.locator('.cms-page-item').first()
    const pageTitleInput = firstPage
      .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Titulo)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    await fillTextInput(pageTitleInput, 'Review package diff')

    await openDrawerModule(page, /^Releases$/)
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()
    const exportReviewButton = page.getByRole('button', { name: /^(Export review package|Exportar pacote de revisao)$/ }).first()
    await expect(exportReviewButton).toBeVisible()
    await exportReviewButton.click()

    const download = await page.evaluate(() => {
      const result = (window as Window & {
        __NTK_CMS_LAST_DOWNLOAD__?: { fileName: string, payload: string }
      }).__NTK_CMS_LAST_DOWNLOAD__

      return result
        ? {
            fileName: result.fileName,
            payload: JSON.parse(result.payload) as {
              kind: string
              review: {
                summary: {
                  hasChanges: boolean
                  changedPages: number
                }
                localeCoverage: Array<{ locale: string }>
              }
            },
          }
        : null
    })

    expect(download).not.toBeNull()
    expect(download?.fileName).toMatch(/^ntk-cms-review-/i)
    expect(download?.payload.kind).toBe('ntk-cms-draft-comparison-package')
    expect(download?.payload.review.summary.hasChanges).toBe(true)
    expect(download?.payload.review.summary.changedPages).toBeGreaterThanOrEqual(1)
    expect(download?.payload.review.localeCoverage.map(entry => entry.locale)).toEqual(
      expect.arrayContaining(['en', 'pt-BR'])
    )

    const reviewHistory = page.locator('[data-cms-release-history]').first()
    await expect(reviewHistory).toBeVisible()
    const reviewHistoryItem = reviewHistory.locator('[data-cms-review-history-item]').first()
    await expect(reviewHistoryItem).toContainText('ntk-cms-review-')
    await expect(reviewHistoryItem).toContainText('Release v')
    await expect(reviewHistoryItem).toContainText('Pages')
    await expect(reviewHistoryItem).toContainText('Locale gaps')
  })

  test('records release review acknowledgements in Releases', async ({ page }) => {
    await page.goto('/?cms=1')
    await openDrawerModule(page, /^Releases$/)

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releasesEditor.locator('.q-btn', { hasText: 'New draft' }).first().click()
    await releasesEditor.locator('.q-btn', { hasText: 'Validate' }).first().click()

    await selectOptionByFieldLabel(page, 'Decision', 'Approved')
    await fillTextInput(
      cmsInputByLabel(page, 'Acknowledgement note'),
      'Reviewed for release readiness'
    )
    await page.getByRole('button', { name: /^(Add acknowledgement|Adicionar reconhecimento)$/ }).first().click()

    const acknowledgements = page.locator('[data-cms-release-acks]').first()
    await expect(acknowledgements).toBeVisible()
    await expect(acknowledgements).toContainText('1 approved')

    const firstEntry = acknowledgements.locator('[data-cms-release-ack-item]').first()
    await expect(firstEntry).toContainText('Approved')
    await expect(firstEntry).toContainText('Reviewed for release readiness')
    await expect(firstEntry).toContainText('CMS Admin')
  })

  test('surfaces locale coverage matrix in Pages and Blocks preview', async ({ page }) => {
    await page.goto('/?cms=1')

    await openDrawerModule(page, /^Pages$/)
    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    const pagesPreview = page.locator('.cms-pages__preview').first()
    const pagesLocaleCoverage = pagesPreview.locator('.cms-review-summary--locale').first()

    await expect(pagesLocaleCoverage).toBeVisible()
    await expect(pagesLocaleCoverage).toContainText('Locale coverage matrix')
    await expect(pagesLocaleCoverage).toContainText('EN')
    await expect(pagesLocaleCoverage).toContainText('PT-BR')
    await expect(pagesLocaleCoverage).toContainText('Pages')
    await expect(pagesLocaleCoverage).toContainText('Fields')
    await expect(pagesLocaleCoverage).toContainText('Reusable content')

    await page.locator('.cms-page-item').first().getByRole('button', { name: /^(Open blocks|Abrir blocos)$/ }).last().click()

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    const blocksPreview = page.locator('.cms-blocks__preview').first()
    const blocksLocaleCoverage = blocksPreview.locator('.cms-review-summary--locale').first()

    await expect(blocksLocaleCoverage).toBeVisible()
    await expect(blocksLocaleCoverage).toContainText('Locale coverage matrix')
    await expect(blocksLocaleCoverage).toContainText('EN')
    await expect(blocksLocaleCoverage).toContainText('PT-BR')
    await expect(blocksLocaleCoverage).toContainText('Pages')
    await expect(blocksLocaleCoverage).toContainText('Fields')
    await expect(blocksLocaleCoverage).toContainText('Reusable content')
  })
})