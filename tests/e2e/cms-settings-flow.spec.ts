import { expect, test, type Locator, type Page } from '@playwright/test'

const CMS_TENANT_PROFILES_STORAGE_KEY = 'ntk.cms.whiteLabel.profiles.v1'
const DEFAULT_TENANT_NAME = 'Default Tenant'
const BLUE_TENANT_NAME = 'Blue Tenant'
const HEADER_ACTIONS_HOVER_LABEL = 'Neutral background (page/actions)'
const SEARCH_BACKGROUND_LABEL = 'Search background'

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

async function fillTextInput(input: Locator, value: string): Promise<void> {
  await input.click({ clickCount: 3 })
  await input.fill(value)
  await input.press('Tab')
}

function cmsInputByLabel(page: Page, label: string): Locator {
  return page
    .locator('.q-field', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
    .locator('input, textarea')
    .first()
}

function colorTokenInputByLabel(page: Page, label: string): Locator {
  return page
    .locator('.cms-color-field', { has: page.locator('label', { hasText: label }) })
    .first()
    .locator('.q-field input')
    .first()
}

async function openSettingsModule(page: Page): Promise<void> {
  const settingsItem = page
    .locator('.ntk-app-shell__drawer .ntk-app-shell__item', {
      has: page.locator('.q-item__label', { hasText: /^Settings$/ }),
    })
    .first()

  await settingsItem.click()
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText('Settings')
}

async function openSettingsTab(page: Page, tabName: RegExp): Promise<void> {
  const roleTab = page.getByRole('tab', { name: tabName }).first()
  if (await roleTab.count() > 0) {
    await roleTab.click()
    return
  }

  const fallbackTab = page.locator('.q-tab', { hasText: tabName }).first()
  await fallbackTab.click()
}

async function selectTenantProfile(page: Page, tenantName: string): Promise<void> {
  const selector = page.locator('.cms-settings__tenant-select').first()
  await selector.click()

  const optionByRole = page.getByRole('option', { name: tenantName, exact: true }).first()
  if (await optionByRole.count() > 0) {
    await optionByRole.click()
  } else {
    await page.locator('.q-menu .q-item', { hasText: tenantName }).first().click()
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

  const headerNotificationAction = page.getByRole('button', { name: /notifications/i }).first()
  await headerNotificationAction.hover()
  await expect(headerNotificationAction).toHaveCSS('background-color', expectedBackground)

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
  test('edits, saves, reloads and preserves notification tokens by tenant', async ({ page }) => {
    await page.goto('/?cms=1')
    await openSettingsModule(page)

    await openSettingsTab(page, /branding/i)
    await fillTextInput(cmsInputByLabel(page, 'Product name'), 'Default Tenant CMS')
    await page.getByRole('button', { name: /^Save settings$/i }).click()
    await expect(page.locator('.cms-settings__saved-at')).toContainText('Saved at')

    await openSettingsTab(page, /colors/i)
    await configureNotificationPalette(page, defaultTenantPalette)
    await expect(colorTokenInputByLabel(page, SEARCH_BACKGROUND_LABEL)).not.toHaveValue(defaultTenantPalette.actionHoverColor)
    await page.getByRole('button', { name: /^Save settings$/i }).click()
    await assertHeaderNotificationPalette(page, defaultTenantPalette)
    await assertActionHoverPalette(page, defaultTenantPalette)
    await expectTenantSnapshots(page, 'default-tenant')

    page.once('dialog', dialog => dialog.accept(BLUE_TENANT_NAME))
    await page.getByRole('button', { name: /^New tenant$/i }).click()
    await openSettingsModule(page)

    await openSettingsTab(page, /branding/i)
    await fillTextInput(cmsInputByLabel(page, 'Product name'), 'Blue Tenant CMS')
    await openSettingsTab(page, /colors/i)
    await configureNotificationPalette(page, blueTenantPalette)
    await expect(colorTokenInputByLabel(page, SEARCH_BACKGROUND_LABEL)).not.toHaveValue(blueTenantPalette.actionHoverColor)
    await page.getByRole('button', { name: /^Save settings$/i }).click()
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
          settings: { theme: { notificationBadgeColor: string; actionHoverBackground: string } }
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

    expect(paletteByTenant[DEFAULT_TENANT_NAME]).toBe(defaultTenantPalette.badgeColor)
    expect(paletteByTenant[BLUE_TENANT_NAME]).toBe(blueTenantPalette.badgeColor)
    expect(actionHoverByTenant[DEFAULT_TENANT_NAME]).toBe(defaultTenantPalette.actionHoverColor)
    expect(actionHoverByTenant[BLUE_TENANT_NAME]).toBe(blueTenantPalette.actionHoverColor)
  })
})