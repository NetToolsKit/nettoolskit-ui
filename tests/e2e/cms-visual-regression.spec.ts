/**
 * Visual regression coverage for the CMS engine.
 *
 * The suite is intentionally maintained on Windows because the existing
 * baseline snapshots in this repository are Windows-specific and the Quasar
 * rendering stack differs enough across platforms to create noisy diffs.
 */
import { expect, test, type Locator, type Page } from '@playwright/test'
import { createDefaultWhiteLabelSettings } from '../../src/modules/cms/white-label/config'
import { buildCmsThemePresets } from '../../src/modules/cms/white-label/theme-presets'

const CMS_URL = '/internal-cms.html'
const CMS_TENANT_PROFILES_STORAGE_KEY = 'ntk.cms.whiteLabel.profiles.v1'
const CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY = 'ntk.cms.whiteLabel.settings.v1'
const CMS_DRAFT_RECOVERY_STORAGE_KEY = 'ntk.cms.whiteLabel.recovery.v1'
const VISUAL_BASELINE_PLATFORM = process.platform === 'win32'
const CMS_THEME_PRESETS = buildCmsThemePresets(createDefaultWhiteLabelSettings().theme)

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
  const moduleText = new RegExp(moduleName.source.replace(/^\^/, '').replace(/\$$/, ''), moduleName.flags)
  const moduleItem = await resolveVisible(page
    .getByRole('complementary')
    .first()
    .getByRole('listitem')
    .filter({
      hasText: moduleText,
    })
  )

  await clickVisible(moduleItem)

  const editorTab = page.locator('.cms-workspace-tabs:visible .cms-workspace-tab', { hasText: /^(Editor)$/i }).first()
  if (await editorTab.count() > 0) {
    const isSelected = (await editorTab.getAttribute('aria-selected')) === 'true'
    if (!isSelected) {
      await clickVisible(editorTab)
    }
  }
}

/**
 * Opens the settings module and waits until the hero title is ready.
 */
async function openSettingsModule(page: Page): Promise<void> {
  await openDrawerModule(page, /^(Settings|Configura\u00e7\u00f5es)$/)
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Settings|Configura\u00e7\u00f5es)$/)
}

/**
 * Opens a specific settings tab.
 */
async function openSettingsTab(page: Page, tabName: RegExp): Promise<void> {
  const source = tabName.source.toLowerCase()
  const normalizedTabName = source.includes('content') || source.includes('conteu')
    ? /content|conteúdo/i
    : source.includes('color') || source.includes('cor')
      ? /colors|cores/i
      : source.includes('brand')
        ? /branding/i
        : tabName

  const sidebarButton = page.locator('.cms-settings__sidebar .cms-designer-card__nav-button:visible', { hasText: normalizedTabName }).first()
  if (await sidebarButton.count() > 0 && await sidebarButton.isVisible().catch(() => false)) {
    await clickVisible(sidebarButton)
    return
  }

  const roleTab = page.locator('.cms-settings__tabs [role="tab"]:visible', { hasText: normalizedTabName }).first()
  if (await roleTab.count() > 0 && await roleTab.isVisible().catch(() => false)) {
    await clickVisible(roleTab)
    return
  }

  await clickVisible(page.locator('.cms-settings__tabs .q-tab:visible', { hasText: normalizedTabName }).first())
}

/**
 * Switches one CMS module workspace between Editor and Preview.
 */
async function openCmsWorkspaceTab(page: Page, label: RegExp): Promise<void> {
  const tab = await resolveVisible(page.locator('.cms-workspace-tabs:visible .cms-workspace-tab', { hasText: label }))
  await clickVisible(tab)
  await expect(tab).toHaveAttribute('aria-selected', 'true')
}

/**
 * Expands known English option labels into bilingual candidates so selectors
 * remain stable when the runtime locale switches.
 */
function resolveOptionLabelCandidates(optionLabel: string): string[] {
  const normalized = optionLabel.trim()
  const candidates = [normalized]

  switch (normalized) {
    case 'Published':
      candidates.push('Publicado')
      break
    case 'Draft':
      candidates.push('Rascunho')
      break
    case 'Portuguese (Brazil)':
      candidates.push('Portugues (Brasil)', 'Português (Brasil)', 'pt-BR', 'pt-br')
      break
    case 'English':
      candidates.push('Ingles', 'Inglês', 'en')
      break
    case 'Dark':
      candidates.push('Escuro')
      break
    case 'Monochrome':
      candidates.push('Monocromatico', 'Monocromático')
      break
    case 'Mobile':
      candidates.push('Celular')
      break
    default:
      break
  }

  return Array.from(new Set(candidates.filter(Boolean)))
}

/**
 * Resolves one preset payload from the shared CMS preset catalog.
 */
function resolveThemePresetTheme(presetName: string): Record<string, unknown> | null {
  const normalized = presetName.trim().toLowerCase()
  const preset = CMS_THEME_PRESETS.find(entry => {
    const label = entry.label.trim().toLowerCase()
    if (label === normalized) {
      return true
    }
    if (normalized.includes('dark') && label.includes('dark') && !label.includes('landing')) {
      return true
    }
    if (normalized.includes('mono') && label.includes('mono')) {
      return true
    }
    return false
  })

  if (!preset) {
    return null
  }

  return { ...preset.theme } as Record<string, unknown>
}

/**
 * Applies one theme preset directly in storage as a fallback when the
 * interactive Quasar select surface cannot be opened in automation.
 */
async function applyThemePresetInStorage(page: Page, presetName: string): Promise<boolean> {
  const presetTheme = resolveThemePresetTheme(presetName)
  if (!presetTheme) {
    return false
  }

  const didApply = await page.evaluate((input: {
    profilesKey: string
    settingsKey: string
    presetTheme: Record<string, unknown>
  }) => {
    const profilesRaw = window.localStorage.getItem(input.profilesKey)
    if (!profilesRaw) {
      return false
    }

    const parsedProfiles = JSON.parse(profilesRaw) as {
      activeProfileId?: string
      profiles?: Array<{
        id: string
        settings?: Record<string, unknown>
      }>
    }

    const profiles = Array.isArray(parsedProfiles.profiles) ? parsedProfiles.profiles : []
    if (profiles.length === 0) {
      return false
    }

    const activeProfileId = parsedProfiles.activeProfileId ?? profiles[0].id
    const activeProfile = profiles.find(profile => profile.id === activeProfileId) ?? profiles[0]
    if (!activeProfile) {
      return false
    }

    const currentSettings = (activeProfile.settings ?? {}) as Record<string, unknown>
    const currentTheme = (currentSettings.theme ?? {}) as Record<string, unknown>
    const nextSettings = {
      ...currentSettings,
      theme: {
        ...currentTheme,
        ...input.presetTheme,
      },
    }

    activeProfile.settings = nextSettings
    parsedProfiles.activeProfileId = activeProfile.id
    window.localStorage.setItem(input.profilesKey, JSON.stringify(parsedProfiles))
    window.localStorage.setItem(input.settingsKey, JSON.stringify({
      profileId: activeProfile.id,
      settings: nextSettings,
      updatedAt: new Date().toISOString(),
    }))
    return true
  }, {
    profilesKey: CMS_TENANT_PROFILES_STORAGE_KEY,
    settingsKey: CMS_WHITE_LABEL_SETTINGS_STORAGE_KEY,
    presetTheme,
  })

  if (!didApply) {
    return false
  }

  await page.reload()
  await openSettingsModule(page)
  await openSettingsTab(page, /colors|cores/i)
  return true
}

/**
 * Selects one option in a Quasar select field identified by label.
 */
async function selectOptionByFieldLabel(page: Page, label: string, optionLabel: string): Promise<void> {
  await page.keyboard.press('Escape').catch(() => undefined)
  await expect(page.locator('.q-menu:visible')).toHaveCount(0)

  const selectField = await resolveVisible(
    page.locator('.q-field:visible', { has: page.locator('.q-field__label', { hasText: label }) })
  )
  await clickVisible(selectField)
  const menu = page.locator('.q-menu:visible').first()
  const menuWasOpened = await menu.isVisible().catch(() => false)
  if (!menuWasOpened) {
    await page.keyboard.press('ArrowDown').catch(() => undefined)
  }
  await menu.waitFor({ state: 'visible', timeout: 4000 }).catch(() => undefined)

  const optionCandidates = resolveOptionLabelCandidates(optionLabel)
  for (const candidate of optionCandidates) {
    const optionByRole = page.locator('.q-menu:visible [role="option"]', { hasText: candidate }).first()
    if (await optionByRole.count() > 0) {
      await clickVisible(optionByRole)
      await expect(page.locator('.q-menu:visible')).toHaveCount(0)
      return
    }

    const menuItem = page.locator('.q-menu:visible .q-item', { hasText: candidate }).first()
    if (await menuItem.count() > 0) {
      await clickVisible(menuItem)
      await expect(page.locator('.q-menu:visible')).toHaveCount(0)
      return
    }
  }

  await clickVisible(page.locator('.q-menu:visible [role="option"], .q-menu:visible .q-item').first())
  await expect(page.locator('.q-menu:visible')).toHaveCount(0)
}

/**
 * Selects one theme preset in the settings colors tab.
 */
async function selectThemePreset(page: Page, presetName: string): Promise<void> {
  const selector = await resolveVisible(page.locator('.cms-theme-presets .q-select, .cms-theme-presets .q-field__control'))
  await clickVisible(selector)
  const menu = page.locator('.q-menu:visible').first()
  const menuWasOpened = await menu.isVisible().catch(() => false)
  if (!menuWasOpened) {
    await page.keyboard.press('ArrowDown').catch(() => undefined)
  }
  await menu.waitFor({ state: 'visible', timeout: 4000 }).catch(() => undefined)

  const optionCandidates = resolveOptionLabelCandidates(presetName)
  for (const candidate of optionCandidates) {
    const optionByRole = page.locator('.q-menu:visible [role="option"]', { hasText: candidate }).first()
    if (await optionByRole.count() > 0) {
      await clickVisible(optionByRole)
      return
    }

    const menuItem = page.locator('.q-menu:visible .q-item', { hasText: candidate }).first()
    if (await menuItem.count() > 0) {
      await clickVisible(menuItem)
      return
    }
  }

  const appliedByStorage = await applyThemePresetInStorage(page, presetName)
  if (appliedByStorage) {
    return
  }

  await clickVisible(page.locator('.q-menu:visible [role="option"], .q-menu:visible .q-item').first())
}

/**
 * Resolves one CMS input by its visible field label.
 */
function cmsInputByLabel(page: Page, label: string) {
  return page
    .locator('.q-field:visible', { has: page.locator('.q-field__label', { hasText: label }) })
    .first()
    .locator('input, textarea')
    .first()
}

/**
 * Resolves the first visible locator candidate, falling back to the first
 * match when no visible candidate is immediately available.
 */
async function resolveVisible(locator: Locator): Promise<Locator> {
  const count = await locator.count()
  if (count === 0) {
    return locator.first()
  }

  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index)
    const isCandidateVisible = await candidate.isVisible().catch(() => false)
    if (!isCandidateVisible) {
      continue
    }

    const isInViewport = await candidate.evaluate(element => {
      const rect = element.getBoundingClientRect()
      return rect.width > 2
        && rect.height > 2
        && rect.bottom > 0
        && rect.right > 0
        && rect.left < window.innerWidth
        && rect.top < window.innerHeight
    }).catch(() => false)
    if (isInViewport) {
      return candidate
    }
  }

  return locator.first()
}

/**
 * Clicks one visible locator candidate.
 */
async function clickVisible(locator: Locator): Promise<void> {
  const target = await resolveVisible(locator)
  await expect(target).toBeVisible({ timeout: 10000 })
  await target.scrollIntoViewIfNeeded().catch(() => undefined)
  try {
    await target.click({ timeout: 5000 })
  } catch {
    await target.click({ force: true })
  }
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
 * Authors one deterministic phase-4 content model used by the richer schema
 * visual regression scenarios.
 */
async function authorPhase4VisualContentModel(page: Page, contentModelName: string): Promise<void> {
  await openSettingsModule(page)
  await openSettingsTab(page, /^(Content|Conteúdo)$/)

  await page.getByRole('button', { name: /^(New content model|Novo modelo de conteúdo)$/ }).first().click()
  await fillTextInputDirect(cmsInputByLabel(page, 'Content model name'), contentModelName)
  await fillTextInputDirect(cmsInputByLabel(page, 'Content model description'), 'Phase 4 schema authoring regression')
  await fillTextInputDirect(cmsInputByLabel(page, 'Migration notes'), 'Phase 4 baseline')

  await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
  const urlFieldRow = page.locator('.cms-content-model-fields__item').last()
  await fillTextInputDirect(
    urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
    'ctaUrl'
  )
  await fillTextInputDirect(
    urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
    'CTA URL'
  )
  await fillTextInputDirect(
    urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'PT-BR label' }) }).first().locator('input, textarea').first(),
    'URL do CTA'
  )
  await fillTextInputDirect(
    urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field group' }) }).first().locator('input, textarea').first(),
    'Campaign'
  )
  await fillTextInputDirect(
    urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'PT-BR group' }) }).first().locator('input, textarea').first(),
    'Campanha'
  )
  await urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
  await page.getByRole('option', { name: 'URL', exact: true }).first().click()
  await fillTextInputDirect(
    urlFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Default value' }) }).first().locator('input, textarea').first(),
    '/demo'
  )

  await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
  const mediaFieldRow = page.locator('.cms-content-model-fields__item').last()
  await fillTextInputDirect(
    mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
    'heroAsset'
  )
  await fillTextInputDirect(
    mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
    'Hero asset'
  )
  await mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
  await page.getByRole('option', { name: 'Media asset', exact: true }).first().click()
  await mediaFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Allowed media kinds' }) }).first().click()
  await page.getByRole('option', { name: 'Image', exact: true }).first().click()
  await page.keyboard.press('Escape')
  const defaultAssetPicker = mediaFieldRow.locator('.cms-media-asset-picker').first()
  await defaultAssetPicker.locator('.q-field').first().click()
  await page.locator('.q-menu:visible .q-item', { hasText: 'Brand logo' }).first().click()
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: /^(Add field|Adicionar campo)$/ }).first().click()
  const referenceFieldRow = page.locator('.cms-content-model-fields__item').last()
  await fillTextInputDirect(
    referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field ID' }) }).first().locator('input, textarea').first(),
    'relatedModel'
  )
  await fillTextInputDirect(
    referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field label' }) }).first().locator('input, textarea').first(),
    'Related model'
  )
  await referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Field type' }) }).first().click()
  await page.getByRole('option', { name: 'Reference', exact: true }).first().click()
  await referenceFieldRow.locator('.q-field', { has: page.locator('.q-field__label', { hasText: 'Allowed reference kinds' }) }).first().click()
  await page.getByRole('option', { name: 'Content model', exact: true }).first().click()
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: /^(Save content model|Salvar modelo de conteúdo)$/ }).first().click()
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

const RELEASE_NEW_DRAFT_BUTTON = /^(New draft|Novo rascunho)$/i
const RELEASE_VALIDATE_BUTTON = /^(Validate|Validar)$/i
const RELEASE_PUBLISH_NOW_BUTTON = /^(Publish now|Publicar agora)$/i

function releaseActionButton(releasesEditor: Locator, name: RegExp): Locator {
  return releasesEditor.getByRole('button', { name }).first()
}

/**
 * Publishes one deterministic release so published preview mode has a stable
 * snapshot source.
 */
async function publishRelease(page: Page): Promise<void> {
  await openDrawerModule(page, /^Releases$/)
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^Releases$/)

  const releasesEditor = page.locator('.cms-releases__editor').first()
  await releaseActionButton(releasesEditor, RELEASE_NEW_DRAFT_BUTTON).click()
  await releaseActionButton(releasesEditor, RELEASE_VALIDATE_BUTTON).click()
  await releaseActionButton(releasesEditor, RELEASE_PUBLISH_NOW_BUTTON).click()
  await expect(page.locator('.cms-release-item .q-chip', { hasText: 'published' }).first()).toBeVisible()
}

/**
 * Removes volatile UI details such as timestamps and active focus before a
 * screenshot is captured.
 */
async function stabilizeVisualState(page: Page, options: { readonly closeFloatingOverlays?: boolean } = {}): Promise<void> {
  if (options.closeFloatingOverlays ?? true) {
    await page.keyboard.press('Escape').catch(() => undefined)
  }
  await page.mouse.move(0, 0)
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

/**
 * Installs the product-launch starter kit and opens Blocks.
 */
async function installProductLaunchStarterKit(page: Page): Promise<void> {
  await openDrawerModule(page, /^(Pages|Páginas)$/)
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^Pages$/)

  const starterKits = page.locator('.cms-pages__starter-kits').first()
  const productLaunchKit = starterKits.locator('.cms-page-quick-start-card', {
    hasText: /(Starter kit · Product launch|Starter kit · Lançamento de produto)/,
  }).first()

  await productLaunchKit.getByRole('button', { name: /^(Install \+ open blocks|Instalar \+ abrir blocos)$/ }).click()
  await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
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
    await openDrawerModule(page, /^(Pages|Páginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^Pages$/)
    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    const previewToolbar = page.locator('.cms-pages__preview .cms-preview-toolbar').first()
    await selectOptionByFieldLabel(page, 'Preview source', 'Published')
    await selectOptionByFieldLabel(page, 'Preview locale', 'Portuguese (Brazil)')
    await expect(previewToolbar).toHaveAttribute('data-cms-preview-locale', 'pt-BR')
    await selectOptionByFieldLabel(page, 'Preview viewport', 'Tablet')
    await stabilizeVisualState(page)
    await expect(previewToolbar).toHaveAttribute('data-cms-preview-source', 'published')
    await expect(previewToolbar).toHaveAttribute('data-cms-preview-locale', 'pt-BR')
    await expect(previewToolbar).toHaveAttribute('data-cms-preview-viewport', 'tablet')
    await expect(page.locator('.cms-pages__preview .cms-runtime-preview__frame[data-preview-viewport="tablet"]').first()).toHaveScreenshot(
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

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
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
        has: page.locator('.q-field__label', { hasText: /^(Content model library|Biblioteca de modelos de conteúdo)$/ }),
      }).first()
    ).toHaveScreenshot('cms-engine-phase3-content-model-authoring.png', { caret: 'hide' })
  })

  test('captures phase 3 pages quick-start and command surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto(CMS_URL)
    await openDrawerModule(page, /^(Pages|Páginas)$/)
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^Pages$/)

    await selectOptionByFieldLabel(page, 'Quick command', 'Create and open blocks')
    await page.getByRole('textbox', { name: /^Search modules?$/ }).first().fill('landing')

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

    await page.getByRole('button', { name: /^(Reset tenant settings to defaults|Resetar configura\u00e7\u00f5es do tenant para o padr\u00e3o)$/ }).first().click()
    await expect(page.getByRole('button', { name: /^(Restore auto-save|Restaurar auto-save)$/ }).first()).toBeEnabled()

    await stabilizeVisualState(page)
    await expect(page.locator('.cms-toolbar-card').first()).toHaveScreenshot(
      'cms-engine-phase3-settings-autosave-recovery-toolbar.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 4 schema authoring surface', async ({ page }) => {
    const contentModelName = 'Phase 4 visual schema'

    await page.setViewportSize({ width: 1600, height: 2200 })
    await page.goto(CMS_URL)
    await authorPhase4VisualContentModel(page, contentModelName)

    await stabilizeVisualState(page)
    await expect(
      page.locator('.cms-config-section', {
        has: page.locator('.q-field__label', { hasText: /^(Content model library|Biblioteca de modelos de conteúdo)$/ }),
      }).first()
    ).toHaveScreenshot('cms-engine-phase4-content-schema-authoring.png', { caret: 'hide' })
  })

  test('captures phase 4 page custom fields with localized rich schema metadata', async ({ page }) => {
    const contentModelName = 'Phase 4 localized page fields'

    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await authorPhase4VisualContentModel(page, contentModelName)
    await openDrawerModule(page, /^(Pages|Páginas)$/)
    await selectOptionByFieldLabel(page, 'Content model', contentModelName)
    await openSettingsModule(page)
    await openSettingsTab(page, /^(Content|Conteúdo)$/)
    await selectOptionByFieldLabel(page, 'Language', 'Portuguese (Brazil)')
    await openDrawerModule(page, /^(Pages|Páginas)$/)

    await stabilizeVisualState(page)
    await expect(page.locator('.cms-page-item__custom-fields').first()).toHaveScreenshot(
      'cms-engine-phase4-pages-rich-fields-ptbr.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 4 blocks section field surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto(CMS_URL)
    await openDrawerModule(page, /^(Pages|Páginas)$/)
    await page.locator('.cms-page-item').first().getByRole('button', { name: /open blocks|abrir blocos/i }).first().click({ force: true })
    await expect(page.locator('.cms-shell-page__hero h1')).toHaveText(/^(Blocks|Blocos)$/)
    await selectOptionByFieldLabel(page, 'Target section', 'Hero (1)')

    await stabilizeVisualState(page)
    await expect(page.locator('.cms-blocks-section-fields').first()).toHaveScreenshot(
      'cms-engine-phase4-blocks-section-fields.png',
      {
        caret: 'hide',
        maxDiffPixels: 3000,
      }
    )
  })

  test('captures phase 5 starter-kit bundles surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await openDrawerModule(page, /^(Pages|Páginas)$/)
    await stabilizeVisualState(page)
    await expect(page.locator('.cms-pages__starter-kits').first()).toHaveScreenshot(
      'cms-engine-phase5-pages-starter-kits.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 5 reusable block impact drawer', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await installProductLaunchStarterKit(page)

    const reusableBlockLibrary = page
      .locator('.cms-blocks-library', { has: page.getByText(/^(Reusable block library|Biblioteca de blocos reutilizáveis)$/) })
      .first()
    const starterReusableBlockRow = reusableBlockLibrary
      .locator('.cms-reusable-block-row', { hasText: /(Launch hero block|Bloco hero de lançamento)/ })
      .first()

    await starterReusableBlockRow.getByRole('button', { name: /^(Inspect reusable block usage|Inspecionar uso do bloco reutilizável)$/ }).click()
    await stabilizeVisualState(page, { closeFloatingOverlays: false })
    const usageDrawer = page.locator('.cms-usage-drawer').first()
    await expect(usageDrawer).toBeVisible()
    await usageDrawer.scrollIntoViewIfNeeded()
    await expect(usageDrawer).toHaveScreenshot(
      'cms-engine-phase5-reusable-block-impact-drawer.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 5 archived authored preset library state', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await installProductLaunchStarterKit(page)

    const presetLibrary = page
      .locator('.cms-blocks-library', { has: page.getByText(/^(Authored preset library|Biblioteca de presets authored)$/) })
      .first()
    const starterPresetRow = presetLibrary
      .locator('.cms-reusable-block-row', { hasText: /(Preset · Product launch hero|Preset · Hero de lançamento de produto)/ })
      .first()

    await starterPresetRow.getByRole('button', { name: /^(Archive|Arquivar)$/ }).click()
    await presetLibrary.getByRole('switch', { name: /^(Show archived|Mostrar arquivados)$/ }).first().click()
    await stabilizeVisualState(page)
    await expect(presetLibrary).toHaveScreenshot(
      'cms-engine-phase5-authored-preset-archive-library.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 6 releases review surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await publishRelease(page)

    await openDrawerModule(page, /^(Pages|Páginas)$/)
    const firstPage = page.locator('.cms-page-item').first()
    await fillTextInputDirect(
      firstPage
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Título)$/ }) })
        .first()
        .locator('input, textarea')
        .first(),
      'Phase 6 release review'
    )

    await openDrawerModule(page, /^Releases$/)
    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releaseActionButton(releasesEditor, RELEASE_NEW_DRAFT_BUTTON).click()
    await releaseActionButton(releasesEditor, RELEASE_VALIDATE_BUTTON).click()

    await stabilizeVisualState(page)
    await expect(releasesEditor).toHaveScreenshot(
      'cms-engine-phase6-releases-review-surface.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 6 pages review summary surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await publishRelease(page)

    await openDrawerModule(page, /^(Pages|Páginas)$/)
    const firstPage = page.locator('.cms-page-item').first()
    await fillTextInputDirect(
      firstPage
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Título)$/ }) })
        .first()
        .locator('input, textarea')
        .first(),
      'Phase 6 pages review'
    )

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    await stabilizeVisualState(page)
    await expect(page.locator('.cms-pages__preview').first()).toHaveScreenshot(
      'cms-engine-phase6-pages-review-summary.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 6 blocks review summary surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await publishRelease(page)

    await openDrawerModule(page, /^Blocks$/)
    const heroRow = page.locator('.cms-block-row', { hasText: 'landing.hero' }).first()
    await heroRow.locator('.q-btn', { hasText: 'Select' }).first().click()
    const blocksTitleInput = page
      .locator('.cms-blocks-fields .q-field:visible', { has: page.locator('.q-field__label', { hasText: /^(Title|Título)$/ }) })
      .first()
      .locator('input, textarea')
      .first()
    if (await blocksTitleInput.count() > 0) {
      await fillTextInputDirect(blocksTitleInput, 'Phase 6 blocks review')
    }

    await openCmsWorkspaceTab(page, /^(Preview)$/i)
    await stabilizeVisualState(page)
    await expect(page.locator('.cms-blocks__preview').first()).toHaveScreenshot(
      'cms-engine-phase6-blocks-review-summary.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 7 review acknowledgements surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await openDrawerModule(page, /^Releases$/)

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releaseActionButton(releasesEditor, RELEASE_NEW_DRAFT_BUTTON).click()
    await releaseActionButton(releasesEditor, RELEASE_VALIDATE_BUTTON).click()

    await selectOptionByFieldLabel(page, 'Decision', 'Approved')
    await fillTextInputDirect(cmsInputByLabel(page, 'Acknowledgement note'), 'Reviewed for release readiness')
    await page.getByRole('button', { name: /^(Add acknowledgement|Adicionar reconhecimento)$/ }).first().click()

    await stabilizeVisualState(page)
    await expect(page.locator('[data-cms-release-acks]').first()).toHaveScreenshot(
      'cms-engine-phase7-release-acknowledgements-surface.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 7 review package history surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 })
    await page.goto(CMS_URL)
    await publishRelease(page)

    await openDrawerModule(page, /^(Pages|Páginas)$/)
    const firstPage = page.locator('.cms-page-item').first()
    await fillTextInputDirect(
      firstPage
        .locator('.cms-page-item__grid .q-field', { has: page.locator('.q-field__label', { hasText: /^(Title|Título)$/ }) })
        .first()
        .locator('input, textarea')
        .first(),
      'Phase 7 review package'
    )

    await openDrawerModule(page, /^Releases$/)
    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releaseActionButton(releasesEditor, RELEASE_NEW_DRAFT_BUTTON).click()
    await releaseActionButton(releasesEditor, RELEASE_VALIDATE_BUTTON).click()
    await page.getByRole('button', { name: /^(Export review package|Exportar pacote de revisão)$/ }).first().click()

    await stabilizeVisualState(page)
    await expect(page.locator('[data-cms-release-history]').first()).toHaveScreenshot(
      'cms-engine-phase7-review-package-history-surface.png',
      { caret: 'hide' }
    )
  })

  test('captures phase 7 release checklist drill-down surface', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1500 })
    await page.goto(CMS_URL)
    await openDrawerModule(page, /^Releases$/)

    const releasesEditor = page.locator('.cms-releases__editor').first()
    await releaseActionButton(releasesEditor, RELEASE_NEW_DRAFT_BUTTON).click()
    await releaseActionButton(releasesEditor, RELEASE_VALIDATE_BUTTON).click()

    await stabilizeVisualState(page)
    await expect(releasesEditor).toHaveScreenshot(
      'cms-engine-phase7-release-checklist-drilldown-surface.png',
      { caret: 'hide' }
    )
  })
})