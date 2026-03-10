/**
 * CMS white-label persistence and migration helpers.
 * This module loads/saves tenant settings and normalizes compatibility payloads.
 */
import { CMS_WHITE_LABEL_STORAGE_KEY, createDefaultWhiteLabelSettings } from './config'
import type {
  CmsAuthoredContentModelSettings,
  CmsPageSettings,
  CmsWhiteLabelSettings,
} from './types'
import { semanticColors } from '../../../config/colors/semantic.config'
import type { AppShellGroup, AppShellItem, AppShellTheme } from '../../../components/layout/app-shell.types'
import { APP_SHELL_DEFAULT_THEME } from '../../../components/layout/app-shell.config'
import { resolveAppShellTheme } from '../../../components/layout/app-shell.theme'
import {
  CMS_THEME_DARK_BASE_PRESET_IDS,
  buildCmsThemePresets,
  detectCmsThemePresetId,
  isCmsThemeBasePresetId,
  isCmsThemePresetId,
} from './theme-presets'
import { normalizeWhiteLabelGovernance } from './workflow'
import {
  createCmsReleaseSnapshot,
  normalizeCmsReleaseSettings,
} from '../releases/orchestration'
import { resolveCmsLocale } from './i18n'
import {
  applyCmsAssetRepositorySnapshot,
  applyCmsContentRepositorySnapshot,
  applyCmsReleaseRepositorySnapshot,
  createCmsAssetRepositorySnapshot,
  createCmsContentRepositorySnapshot,
  createCmsReleaseRepositorySnapshot,
  resolveCmsPersistenceStore,
  type CmsAssetRepositorySnapshot,
  type CmsContentRepositorySnapshot,
  type CmsPersistenceOptions,
  type CmsReleaseRepositorySnapshot,
} from './providers'
import {
  detectCmsContentModelIdForPage,
  getCmsContentModelSchemaVersion,
  detectCmsSectionPresetId,
  normalizeCmsAuthoredContentModels,
  normalizeCmsPageCustomFieldsForContentModel,
  resolveDefaultCmsBlockTypeForSection,
} from './content-models'
import {
  createCmsPageBlockFromPreset,
  getDefaultCmsBlockPresetIdForSectionPreset,
  normalizeCmsAuthoredBlockPresets,
  resolveCmsBlockPresetId,
} from './block-presets'
import { normalizeCmsAuthoredContentModelFieldPresets } from './schema-field-presets'
import {
  normalizeCmsPageBlockLocalizationSettings,
  normalizeCmsPageLocalizationSettings,
  normalizeCmsPageSectionLocalizationSettings,
} from './localized-content'
import { createDefaultCmsMediaAssets, normalizeCmsMediaAssets } from './media-library'
import { normalizeCmsReusableBlocks } from './reusable-blocks'
import { normalizeCmsReusableSections } from './reusable-sections'

const REMOVED_CMS_ITEM_IDS = new Set(['dashboard', 'users'])
const REQUIRED_CMS_ITEM_IDS = new Set(['settings', 'pages', 'blocks', 'media', 'releases'])
const COMPAT_PAGE_BACKGROUND_TOKEN = 'var(--ntk-bg-primary)'
const COMPAT_SURFACE_BACKGROUND_TOKEN = 'var(--ntk-bg-card)'
const CMS_WHITE_LABEL_SETTINGS_SCHEMA_VERSION = 10
const THEME_RUNTIME_TOKEN_PATTERN = /^var\(--ntk-(text|bg|border)-/i

type ThemeReadablePair = {
  foreground: keyof AppShellTheme
  background: keyof AppShellTheme
}

const DARK_THEME_READABLE_PAIRS: ReadonlyArray<ThemeReadablePair> = [
  { foreground: 'titleAppColor', background: 'headerBackground' },
  { foreground: 'titleTextColor', background: 'headerBackground' },
  { foreground: 'headerTextColor', background: 'headerBackground' },
  { foreground: 'toolbarButtonColor', background: 'headerBackground' },
  { foreground: 'drawerTextColor', background: 'drawerBackground' },
  { foreground: 'itemTextColor', background: 'drawerBackground' },
  { foreground: 'itemIconColor', background: 'drawerBackground' },
  { foreground: 'brandTitleColor', background: 'drawerBackground' },
  { foreground: 'brandSubtitleColor', background: 'drawerBackground' },
  { foreground: 'groupCaptionColor', background: 'drawerBackground' },
  { foreground: 'itemHoverColor', background: 'itemHoverBackground' },
  { foreground: 'itemIconHoverColor', background: 'itemHoverBackground' },
  { foreground: 'searchTextColor', background: 'searchBackground' },
  { foreground: 'searchIconColor', background: 'searchBackground' },
  { foreground: 'pageTextColor', background: 'pageBackground' },
  { foreground: 'notificationIconColor', background: 'headerBackground' },
]

/**
 * Checks whether a value is still bound to generic runtime ntk tokens.
 * These expressions can resolve to light palette values in CMS context and hurt contrast.
 */
function isRuntimeThemeToken(value: string | undefined): boolean {
  const normalized = String(value ?? '').trim()
  return THEME_RUNTIME_TOKEN_PATTERN.test(normalized)
}

/**
 * Parses css color values in hex/rgb formats into channel tuples.
 */
function parseColorChannels(value: string | undefined): [number, number, number] | null {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (!normalized) {
    return null
  }

  const compactHex = normalized.replace('#', '')
  if (/^[0-9a-f]{3}$/i.test(compactHex)) {
    const [r, g, b] = compactHex.split('').map(channel => Number.parseInt(`${channel}${channel}`, 16))
    return [r, g, b]
  }

  if (/^[0-9a-f]{6}$/i.test(compactHex)) {
    const r = Number.parseInt(compactHex.slice(0, 2), 16)
    const g = Number.parseInt(compactHex.slice(2, 4), 16)
    const b = Number.parseInt(compactHex.slice(4, 6), 16)
    return [r, g, b]
  }

  const rgbMatch = normalized.match(/^rgba?\(([^)]+)\)$/i)
  if (!rgbMatch) {
    return null
  }

  const channels = rgbMatch[1]
    .split(',')
    .slice(0, 3)
    .map(channel => Number.parseFloat(channel.trim()))
    .map(channel => Number.isFinite(channel) ? Math.max(0, Math.min(255, channel)) : Number.NaN)

  if (channels.length !== 3 || channels.some(channel => Number.isNaN(channel))) {
    return null
  }

  return [channels[0], channels[1], channels[2]]
}

/**
 * Computes WCAG contrast ratio between two colors.
 */
function getContrastRatio(foreground: string | undefined, background: string | undefined): number | null {
  const fg = parseColorChannels(foreground)
  const bg = parseColorChannels(background)
  if (!fg || !bg) {
    return null
  }

  const toLinear = (value: number): number => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }

  const luminance = ([r, g, b]: [number, number, number]): number => (
    (0.2126 * toLinear(r)) +
    (0.7152 * toLinear(g)) +
    (0.0722 * toLinear(b))
  )

  const fgLuminance = luminance(fg)
  const bgLuminance = luminance(bg)
  const light = Math.max(fgLuminance, bgLuminance)
  const dark = Math.min(fgLuminance, bgLuminance)
  return (light + 0.05) / (dark + 0.05)
}

/**
 * Gets the concrete dark preset theme used as readability fallback.
 */
function getDarkPresetTheme(defaultTheme: AppShellTheme, presetId: string): Partial<AppShellTheme> {
  const presets = buildCmsThemePresets(defaultTheme)
  return (
    presets.find(preset => preset.id === presetId)?.theme
    ?? presets.find(preset => preset.id === 'dark')?.theme
    ?? {}
  )
}

/**
 * Checks whether the selected preset id belongs to the dark family.
 */
function isDarkPresetId(presetId: string): boolean {
  return (CMS_THEME_DARK_BASE_PRESET_IDS as readonly string[]).includes(presetId)
}

/**
 * Normalizes dark preset overrides that still point to generic runtime tokens or unreadable pairs.
 */
function normalizeDarkPresetOverrides(
  overrides: CmsWhiteLabelSettings['themePresetOverrides'],
  defaultTheme: AppShellTheme
): CmsWhiteLabelSettings['themePresetOverrides'] {
  const normalizedOverrides: CmsWhiteLabelSettings['themePresetOverrides'] = {
    ...overrides,
  }

  for (const presetId of CMS_THEME_DARK_BASE_PRESET_IDS) {
    const darkOverrides = normalizedOverrides[presetId]
    if (!darkOverrides) {
      continue
    }

    const darkPresetTheme = getDarkPresetTheme(defaultTheme, presetId)
    const normalizedDarkOverrides: Partial<AppShellTheme> = { ...darkOverrides }

    for (const { foreground } of DARK_THEME_READABLE_PAIRS) {
      const currentValue = String(normalizedDarkOverrides[foreground] ?? '').trim()
      const presetValue = String(darkPresetTheme[foreground] ?? '').trim()
      if (!currentValue || !presetValue) {
        continue
      }

      if (isRuntimeThemeToken(currentValue)) {
        normalizedDarkOverrides[foreground] = presetValue
      }
    }

    for (const { foreground, background } of DARK_THEME_READABLE_PAIRS) {
      const foregroundValue = String(normalizedDarkOverrides[foreground] ?? darkPresetTheme[foreground] ?? '').trim()
      const backgroundValue = String(normalizedDarkOverrides[background] ?? darkPresetTheme[background] ?? '').trim()
      const contrast = getContrastRatio(foregroundValue, backgroundValue)
      const presetValue = String(darkPresetTheme[foreground] ?? '').trim()

      if (contrast !== null && contrast < 3.5 && presetValue) {
        normalizedDarkOverrides[foreground] = presetValue
      }
    }

    normalizedOverrides[presetId] = normalizedDarkOverrides
  }

  return normalizedOverrides
}

/**
 * Normalizes active dark themes so legacy token expressions cannot degrade readability.
 */
function normalizeDarkThemeReadability(theme: AppShellTheme, presetId: string, defaultTheme: AppShellTheme): AppShellTheme {
  if (!isDarkPresetId(presetId)) {
    return theme
  }

  const darkPresetTheme = getDarkPresetTheme(defaultTheme, presetId)
  const normalizedTheme: AppShellTheme = { ...theme }

  for (const { foreground } of DARK_THEME_READABLE_PAIRS) {
    const currentValue = String(normalizedTheme[foreground] ?? '').trim()
    const presetValue = String(darkPresetTheme[foreground] ?? '').trim()
    if (!currentValue || !presetValue) {
      continue
    }

    if (isRuntimeThemeToken(currentValue)) {
      normalizedTheme[foreground] = presetValue
    }
  }

  for (const { foreground, background } of DARK_THEME_READABLE_PAIRS) {
    const foregroundValue = String(normalizedTheme[foreground] ?? '').trim()
    const backgroundValue = String(normalizedTheme[background] ?? '').trim()
    const contrast = getContrastRatio(foregroundValue, backgroundValue)
    const presetValue = String(darkPresetTheme[foreground] ?? '').trim()

    if (contrast !== null && contrast < 3.5 && presetValue) {
      normalizedTheme[foreground] = presetValue
    }
  }

  return resolveAppShellTheme(normalizedTheme, APP_SHELL_DEFAULT_THEME)
}

/**
 * Creates a deep clone for plain objects used in settings payloads.
 */
function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fallback for reactive proxies or non-cloneable browser objects.
    }
  }
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Normalizes positive integer schema versions loaded from persistence.
 */
function resolveStoredSchemaVersion(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim().length > 0 ? Number(value) : Number.NaN)
  return Number.isFinite(parsed) && parsed > 0
    ? Math.max(1, Math.floor(parsed))
    : Math.max(1, Math.floor(fallback))
}

/**
 * Checks if current runtime supports browser storage APIs.
 */
function isBrowserRuntime(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Normalizes notification semantic colors and decouples compatibility badge expressions.
 */
function normalizeNotificationColors(theme: AppShellTheme): AppShellTheme {
  const nextTheme: AppShellTheme = { ...theme }
  const notificationKeys: Array<keyof AppShellTheme> = [
    'notificationSuccessColor',
    'notificationWarningColor',
    'notificationErrorColor',
    'notificationInfoColor',
  ]

  const notificationValues = notificationKeys.map(key => String(nextTheme[key] ?? '').trim().toLowerCase())
  const badgeTextColor = String(nextTheme.notificationBadgeTextColor ?? '').trim().toLowerCase()
  const badgeColor = String(nextTheme.notificationBadgeColor ?? '').trim().toLowerCase()
  const allColorsFilled = notificationValues.every(value => value.length > 0)
  const allColorsEqual = allColorsFilled && notificationValues.every(value => value === notificationValues[0])
  const allColorsMatchBadgeText = allColorsEqual && badgeTextColor.length > 0 && notificationValues[0] === badgeTextColor

  // Older snapshots used a semantic CSS expression for badge color, coupling it to error token changes.
  // Convert it to a concrete value so badge can be tuned independently from notification error color.
  if (
    badgeColor === 'var(--semantic-error)'
    || badgeColor.startsWith('var(--semantic-error')
  ) {
    nextTheme.notificationBadgeColor = String(nextTheme.notificationErrorColor ?? semanticColors.errorPrimary)
  }

  if (allColorsMatchBadgeText) {
    nextTheme.notificationSuccessColor = semanticColors.successPrimary
    nextTheme.notificationWarningColor = semanticColors.warningPrimary
    nextTheme.notificationErrorColor = semanticColors.errorPrimary
    nextTheme.notificationInfoColor = semanticColors.infoPrimary
    nextTheme.notificationBadgeColor = semanticColors.errorPrimary
  }

  return resolveAppShellTheme(nextTheme, APP_SHELL_DEFAULT_THEME)
}

/**
 * Migrates old flat page/surface/search backgrounds to modern contrasting defaults.
 */
function normalizeSurfaceContrast(theme: AppShellTheme): AppShellTheme {
  const normalizedPageBackground = String(theme.pageBackground ?? '').trim().toLowerCase()
  const normalizedSearchBackground = String(theme.searchBackground ?? '').trim().toLowerCase()
  const normalizedDrawerBackground = String(theme.drawerBackground ?? '').trim().toLowerCase()

  const isCompatPageBackground = normalizedPageBackground === COMPAT_PAGE_BACKGROUND_TOKEN
    || normalizedPageBackground === COMPAT_SURFACE_BACKGROUND_TOKEN
  const isCompatSearchBackground = normalizedSearchBackground === COMPAT_SURFACE_BACKGROUND_TOKEN
    || normalizedSearchBackground.length === 0
  const isCompatDrawerBackground = normalizedDrawerBackground === COMPAT_SURFACE_BACKGROUND_TOKEN

  if (!isCompatPageBackground || !isCompatSearchBackground || !isCompatDrawerBackground) {
    return theme
  }

  return {
    ...theme,
    pageBackground: APP_SHELL_DEFAULT_THEME.pageBackground,
    searchBackground: APP_SHELL_DEFAULT_THEME.searchBackground,
  }
}

/**
 * Keeps only valid theme preset overrides known by the base preset catalog.
 */
function normalizeThemePresetOverrides(overrides: unknown): CmsWhiteLabelSettings['themePresetOverrides'] {
  const normalized: CmsWhiteLabelSettings['themePresetOverrides'] = {}
  if (!overrides || typeof overrides !== 'object') {
    return normalized
  }

  for (const [presetId, value] of Object.entries(overrides as Record<string, unknown>)) {
    if (!isCmsThemeBasePresetId(presetId) || !value || typeof value !== 'object') {
      continue
    }

    normalized[presetId] = { ...(value as Partial<AppShellTheme>) }
  }

  return normalized
}

/**
 * Builds theme presets while applying persisted override patches.
 */
function buildThemePresetsWithOverrides(
  defaultTheme: AppShellTheme,
  overrides: CmsWhiteLabelSettings['themePresetOverrides']
) {
  return buildCmsThemePresets(defaultTheme).map(preset => ({
    ...preset,
    theme: {
      ...preset.theme,
      ...(overrides[preset.id] ?? {}),
    },
  }))
}

/**
 * Converts a group id into a readable fallback label.
 */
function toTitleCaseFromId(value: string): string {
  const normalized = value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) {
    return 'Group'
  }

  return normalized
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * Normalizes menu items by removing invalid/deprecated entries and restoring required defaults.
 */
function normalizeMenuItems(items: unknown, defaults: AppShellItem[]): AppShellItem[] {
  const source = Array.isArray(items) ? items : defaults
  const itemMap = new Map<string, AppShellItem>()

  for (const rawItem of source) {
    if (!rawItem || typeof rawItem !== 'object') {
      continue
    }

    const item = rawItem as Partial<AppShellItem>
    const id = String(item.id ?? '').trim()
    if (!id || REMOVED_CMS_ITEM_IDS.has(id)) {
      continue
    }

    const fallback = defaults.find(defaultItem => defaultItem.id === id)
    const group = String(item.group ?? fallback?.group ?? '').trim()
    const label = String(item.label ?? fallback?.label ?? '').trim()
    const icon = String(item.icon ?? fallback?.icon ?? '').trim()
    if (!group || !label || !icon) {
      continue
    }

    itemMap.set(id, {
      id,
      group,
      label,
      icon,
      caption: typeof item.caption === 'string' ? item.caption : fallback?.caption,
      description: typeof item.description === 'string' ? item.description : fallback?.description,
      badge: item.badge ?? fallback?.badge,
      badgeColor: typeof item.badgeColor === 'string' ? item.badgeColor : fallback?.badgeColor,
      badgeTextColor: typeof item.badgeTextColor === 'string' ? item.badgeTextColor : fallback?.badgeTextColor,
    })
  }

  for (const defaultItem of defaults) {
    if (!REQUIRED_CMS_ITEM_IDS.has(defaultItem.id) || itemMap.has(defaultItem.id)) {
      continue
    }
    itemMap.set(defaultItem.id, cloneValue(defaultItem))
  }

  const normalizedItems = Array.from(itemMap.values())
  return normalizedItems.length > 0 ? normalizedItems : cloneValue(defaults)
}

/**
 * Ensures navigation groups match the current menu items and contain unique ids.
 */
function normalizeNavGroups(
  groups: unknown,
  defaults: AppShellGroup[],
  items: AppShellItem[]
): AppShellGroup[] {
  const source = Array.isArray(groups) ? groups : defaults
  const usedGroupIds = new Set(
    items
      .map(item => String(item.group ?? '').trim())
      .filter(groupId => groupId.length > 0)
  )

  const normalizedGroups: AppShellGroup[] = []
  const seenGroupIds = new Set<string>()

  for (const rawGroup of source) {
    if (!rawGroup || typeof rawGroup !== 'object') {
      continue
    }

    const group = rawGroup as Partial<AppShellGroup>
    const id = String(group.id ?? '').trim()
    if (!id || !usedGroupIds.has(id) || seenGroupIds.has(id)) {
      continue
    }

    normalizedGroups.push({
      id,
      label: String(group.label ?? '').trim() || toTitleCaseFromId(id),
    })
    seenGroupIds.add(id)
  }

  for (const groupId of usedGroupIds) {
    if (seenGroupIds.has(groupId)) {
      continue
    }

    normalizedGroups.push({
      id: groupId,
      label: defaults.find(group => group.id === groupId)?.label ?? toTitleCaseFromId(groupId),
    })
    seenGroupIds.add(groupId)
  }

  return normalizedGroups.length > 0
    ? normalizedGroups
    : cloneValue(defaults).filter(group => usedGroupIds.has(group.id))
}

/**
 * Normalizes page builder settings and section collections for CMS pages.
 */
function normalizePagesSettings(
  pages: unknown,
  defaults: CmsPageSettings[],
  authoredContentModels: CmsAuthoredContentModelSettings[] = []
): CmsPageSettings[] {
  if (!Array.isArray(pages)) {
    return cloneValue(defaults)
  }

  const normalized = pages
    .map<CmsPageSettings | null>((rawPage, index) => {
      if (!rawPage || typeof rawPage !== 'object') {
        return null
      }

      const page = rawPage as Partial<CmsPageSettings>
      const id = String(page.id ?? '').trim() || `page-${index + 1}`
      const sections = Array.isArray(page.sections)
        ? page.sections
          .map<CmsPageSettings['sections'][number] | null>((rawSection, sectionIndex) => {
            if (!rawSection || typeof rawSection !== 'object') {
              return null
            }
            const section = rawSection as Partial<CmsPageSettings['sections'][number]>
            const resolvedSectionId = String(section.id ?? '').trim() || `${id}-section-${sectionIndex + 1}`
            const sectionPresetId = detectCmsSectionPresetId({
              presetId: section.presetId,
              sectionId: resolvedSectionId,
              blockType: section.blocks?.[0]?.type,
            })
            const defaultBlockType = resolveDefaultCmsBlockTypeForSection(resolvedSectionId, sectionPresetId)
            const blocks = Array.isArray(section.blocks)
              ? section.blocks
                .map<CmsPageSettings['sections'][number]['blocks'][number] | null>((rawBlock, blockIndex) => {
                  if (!rawBlock || typeof rawBlock !== 'object') {
                    return null
                  }
                  const block = rawBlock as Partial<CmsPageSettings['sections'][number]['blocks'][number]>
                  const blockType = String(block.type ?? '').trim() || defaultBlockType
                  return {
                    id: String(block.id ?? '').trim() || `${resolvedSectionId}-block-${blockIndex + 1}`,
                    type: blockType,
                    presetId: resolveCmsBlockPresetId(block.presetId),
                    enabled: typeof block.enabled === 'boolean' ? block.enabled : Boolean(section.enabled),
                    reusableMode: block.reusableMode === 'linked' || block.reusableMode === 'detached'
                      ? block.reusableMode
                      : undefined,
                    reusableSourceId: String(block.reusableSourceId ?? '').trim() || undefined,
                    props: block.props && typeof block.props === 'object'
                      ? cloneValue(block.props)
                      : {},
                    localization: normalizeCmsPageBlockLocalizationSettings(block.localization),
                  }
                })
                .filter((block): block is CmsPageSettings['sections'][number]['blocks'][number] => block !== null)
              : []

            const normalizedBlocks = blocks.length > 0
              ? blocks
              : (() => {
                const blockId = `${resolvedSectionId}-block-1`
                const presetId = getDefaultCmsBlockPresetIdForSectionPreset(sectionPresetId)
                return presetId === 'custom'
                  ? [{
                    id: blockId,
                    type: defaultBlockType,
                    presetId: 'custom' as const,
                    enabled: Boolean(section.enabled),
                    props: {},
                  }]
                  : [createCmsPageBlockFromPreset({
                    presetId,
                    blockId,
                    enabled: Boolean(section.enabled),
                  })]
              })()

            return {
              id: resolvedSectionId,
              presetId: sectionPresetId,
              label: String(section.label ?? '').trim() || `Section ${sectionIndex + 1}`,
              enabled: Boolean(section.enabled),
              reusableMode: section.reusableMode === 'linked' || section.reusableMode === 'detached'
                ? section.reusableMode
                : undefined,
              reusableSourceId: String(section.reusableSourceId ?? '').trim() || undefined,
              localization: normalizeCmsPageSectionLocalizationSettings(section.localization),
              blocks: normalizedBlocks,
            }
          })
          .filter((section): section is CmsPageSettings['sections'][number] => section !== null)
        : []

      const contentModelId = detectCmsContentModelIdForPage({
        contentModelId: page.contentModelId,
        id,
        path: page.path,
        sections,
      }, authoredContentModels)
      const contentModelVersion = resolveStoredSchemaVersion(
        page.contentModelVersion,
        getCmsContentModelSchemaVersion(contentModelId, authoredContentModels)
      )

      const normalizedPage = {
        id,
        contentModelId,
        contentModelVersion,
        title: String(page.title ?? '').trim() || `Page ${index + 1}`,
        path: String(page.path ?? '').trim() || `/${id}`,
        status: page.status === 'published' ? 'published' : 'draft',
        description: String(page.description ?? '').trim(),
        customFields: normalizeCmsPageCustomFieldsForContentModel(
          page.customFields,
          contentModelId,
          'en',
          authoredContentModels
        ),
        localization: normalizeCmsPageLocalizationSettings(page.localization),
        sections,
      } satisfies CmsPageSettings

      return normalizedPage
    })
    .filter((page): page is CmsPageSettings => page !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Merges partial/compatibility settings with defaults and returns a stable CMS white-label payload.
 */
export function normalizeCmsWhiteLabelSettings(
  parsed: Partial<CmsWhiteLabelSettings> | null | undefined
): CmsWhiteLabelSettings {
  const defaults = createDefaultWhiteLabelSettings()
  if (!parsed) {
    return defaults
  }

  const themePresetOverrides = normalizeDarkPresetOverrides(
    normalizeThemePresetOverrides(parsed.themePresetOverrides),
    defaults.theme
  )
  const mergedTheme = normalizeSurfaceContrast(normalizeNotificationColors({
    ...defaults.theme,
    ...(parsed.theme ?? {}),
  }))
  const normalizedItems = normalizeMenuItems(parsed.items, defaults.items)
  const normalizedNavGroups = normalizeNavGroups(parsed.navGroups, defaults.navGroups, normalizedItems)
  const normalizedBranding = {
    ...defaults.branding,
    ...(parsed.branding ?? {}),
  }
  const normalizedLayout = {
    ...defaults.layout,
    ...(parsed.layout ?? {}),
  }
  const normalizedContent = {
    ...defaults.content,
    ...(parsed.content ?? {}),
    locale: resolveCmsLocale(parsed.content?.locale ?? defaults.content.locale),
  }
  const normalizedAuthoredContentModels = normalizeCmsAuthoredContentModels(
    parsed.authoredContentModels,
    defaults.authoredContentModels
  )
  const normalizedAuthoredContentModelFieldPresets = normalizeCmsAuthoredContentModelFieldPresets(
    parsed.authoredContentModelFieldPresets,
    defaults.authoredContentModelFieldPresets
  )
  const defaultMediaAssets = createDefaultCmsMediaAssets(
    normalizedBranding,
    normalizedContent.locale
  )

  const mergedBase: Omit<CmsWhiteLabelSettings, 'releases'> = {
    branding: normalizedBranding,
    layout: normalizedLayout,
    content: normalizedContent,
    pages: normalizePagesSettings(
      parsed.pages,
      defaults.pages,
      normalizedAuthoredContentModels
    ),
    reusableSections: normalizeCmsReusableSections(parsed.reusableSections, defaults.reusableSections),
    reusableBlocks: normalizeCmsReusableBlocks(parsed.reusableBlocks, defaults.reusableBlocks),
    authoredContentModels: normalizedAuthoredContentModels,
    authoredContentModelFieldPresets: normalizedAuthoredContentModelFieldPresets,
    authoredBlockPresets: normalizeCmsAuthoredBlockPresets(
      parsed.authoredBlockPresets,
      defaults.authoredBlockPresets
    ),
    mediaAssets: normalizeCmsMediaAssets(parsed.mediaAssets, defaultMediaAssets),
    themePresetId: defaults.themePresetId,
    themePresetOverrides,
    theme: mergedTheme,
    navGroups: normalizedNavGroups,
    items: normalizedItems,
    toolbarActions: parsed.toolbarActions ?? cloneValue(defaults.toolbarActions),
    governance: normalizeWhiteLabelGovernance(parsed.governance),
  }

  const merged: CmsWhiteLabelSettings = {
    ...mergedBase,
    releases: normalizeCmsReleaseSettings(parsed.releases, {
      snapshot: createCmsReleaseSnapshot(mergedBase),
      workflowVersion: mergedBase.governance.workflow.version,
      workflowStatus: mergedBase.governance.workflow.status,
    }),
  }

  const themePresets = buildThemePresetsWithOverrides(defaults.theme, themePresetOverrides)
  merged.themePresetId = isCmsThemePresetId(parsed.themePresetId)
    ? parsed.themePresetId
    : detectCmsThemePresetId(merged.theme, themePresets, defaults.theme)
  merged.theme = normalizeDarkThemeReadability(merged.theme, merged.themePresetId, defaults.theme)

  return merged
}

/**
 * Applies favicon updates to all supported link rel variants used by browsers.
 */
export function applyCmsFavicon(faviconUrl: string): void {
  if (!isBrowserRuntime()) {
    return
  }

  const href = faviconUrl.trim() || '/favicon.png'
  const iconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
  ]

  for (const selector of iconSelectors) {
    const links = document.querySelectorAll<HTMLLinkElement>(selector)
    if (links.length === 0) {
      continue
    }
    links.forEach(link => {
      link.href = href
    })
  }
}

/**
 * Persists the full normalized white-label settings object using the active persistence provider.
 */
export function saveCmsWhiteLabelSettings(
  settings: CmsWhiteLabelSettings,
  options: CmsPersistenceOptions = {}
): void {
  const store = resolveCmsPersistenceStore(options.store)
  if (!store) {
    return
  }

  const serialized = JSON.stringify({
    version: CMS_WHITE_LABEL_SETTINGS_SCHEMA_VERSION,
    settings: normalizeCmsWhiteLabelSettings(settings),
  })
  store.setItem(CMS_WHITE_LABEL_STORAGE_KEY, serialized)
}

/**
 * Loads settings from the active persistence provider and returns a normalized object with defaults.
 */
export function loadCmsWhiteLabelSettings(options: CmsPersistenceOptions = {}): CmsWhiteLabelSettings {
  const defaults = normalizeCmsWhiteLabelSettings(undefined)
  const store = resolveCmsPersistenceStore(options.store)
  if (!store) {
    return defaults
  }

  const rawValue = store.getItem(CMS_WHITE_LABEL_STORAGE_KEY)
  if (!rawValue) {
    return defaults
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown
    if (!parsed || typeof parsed !== 'object') {
      return defaults
    }

    const root = parsed as Record<string, unknown>
    if ('settings' in root) {
      const version = Number.parseInt(String(root.version ?? ''), 10)
      if (Number.isFinite(version) && version > CMS_WHITE_LABEL_SETTINGS_SCHEMA_VERSION) {
        return defaults
      }

      const wrappedSettings = root.settings
      if (!wrappedSettings || typeof wrappedSettings !== 'object') {
        return defaults
      }
      return normalizeCmsWhiteLabelSettings(wrappedSettings as Partial<CmsWhiteLabelSettings>)
    }

    return normalizeCmsWhiteLabelSettings(root as Partial<CmsWhiteLabelSettings>)
  } catch {
    return defaults
  }
}

/**
 * Loads only the content-domain repository snapshot from the active persistence provider.
 * This lets external application layers integrate content storage separately from assets and releases.
 */
export function loadCmsContentRepositorySnapshot(
  options: CmsPersistenceOptions = {}
): CmsContentRepositorySnapshot {
  return createCmsContentRepositorySnapshot(loadCmsWhiteLabelSettings(options))
}

/**
 * Persists only the content-domain repository snapshot through the active persistence provider.
 * Internally this merges the snapshot into current white-label settings and saves the normalized aggregate.
 */
export function saveCmsContentRepositorySnapshot(
  snapshot: CmsContentRepositorySnapshot,
  options: CmsPersistenceOptions = {}
): CmsWhiteLabelSettings {
  const nextSettings = applyCmsContentRepositorySnapshot(
    loadCmsWhiteLabelSettings(options),
    snapshot
  )
  saveCmsWhiteLabelSettings(nextSettings, options)
  return nextSettings
}

/**
 * Loads only the asset-domain repository snapshot from the active persistence provider.
 */
export function loadCmsAssetRepositorySnapshot(
  options: CmsPersistenceOptions = {}
): CmsAssetRepositorySnapshot {
  return createCmsAssetRepositorySnapshot(loadCmsWhiteLabelSettings(options))
}

/**
 * Persists only the asset-domain repository snapshot through the active persistence provider.
 */
export function saveCmsAssetRepositorySnapshot(
  snapshot: CmsAssetRepositorySnapshot,
  options: CmsPersistenceOptions = {}
): CmsWhiteLabelSettings {
  const nextSettings = applyCmsAssetRepositorySnapshot(
    loadCmsWhiteLabelSettings(options),
    snapshot
  )
  saveCmsWhiteLabelSettings(nextSettings, options)
  return nextSettings
}

/**
 * Loads only the release-domain repository snapshot from the active persistence provider.
 */
export function loadCmsReleaseRepositorySnapshot(
  options: CmsPersistenceOptions = {}
): CmsReleaseRepositorySnapshot {
  return createCmsReleaseRepositorySnapshot(loadCmsWhiteLabelSettings(options))
}

/**
 * Persists only the release-domain repository snapshot through the active persistence provider.
 */
export function saveCmsReleaseRepositorySnapshot(
  snapshot: CmsReleaseRepositorySnapshot,
  options: CmsPersistenceOptions = {}
): CmsWhiteLabelSettings {
  const nextSettings = applyCmsReleaseRepositorySnapshot(
    loadCmsWhiteLabelSettings(options),
    snapshot
  )
  saveCmsWhiteLabelSettings(nextSettings, options)
  return nextSettings
}

/**
 * Clears persisted settings through the active persistence provider and returns current defaults.
 */
export function resetCmsWhiteLabelSettings(options: CmsPersistenceOptions = {}): CmsWhiteLabelSettings {
  const defaults = createDefaultWhiteLabelSettings()
  const store = resolveCmsPersistenceStore(options.store)
  if (store) {
    store.removeItem(CMS_WHITE_LABEL_STORAGE_KEY)
  }

  return defaults
}