/**
 * CMS white-label persistence and migration helpers.
 * This module loads/saves tenant settings and normalizes legacy payloads.
 */
import { CMS_WHITE_LABEL_STORAGE_KEY, createDefaultWhiteLabelSettings } from './white-label.config'
import type { CmsPageSettings, CmsWhiteLabelSettings } from './white-label.types'
import { semanticColors } from '../../src/config/colors/semantic.config'
import type { AppShellGroup, AppShellItem, AppShellTheme } from '../../src/components/layout/app-shell.types'
import { APP_SHELL_DEFAULT_THEME } from '../../src/components/layout/app-shell.config'
import { resolveAppShellTheme } from '../../src/components/layout/app-shell.theme'
import {
  buildCmsThemePresets,
  detectCmsThemePresetId,
  isCmsThemeBasePresetId,
  isCmsThemePresetId,
} from './theme-presets'

const LEGACY_CMS_ITEM_IDS = new Set(['dashboard', 'pages', 'blocks', 'media', 'users'])
const LEGACY_PAGE_BACKGROUND_TOKEN = 'var(--ntk-bg-primary)'
const LEGACY_SURFACE_BACKGROUND_TOKEN = 'var(--ntk-bg-card)'

/**
 * Creates a deep clone for plain objects used in settings payloads.
 */
function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Checks if current runtime supports browser storage APIs.
 */
function isBrowserRuntime(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * Normalizes notification semantic colors and decouples legacy badge expressions.
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

  // Legacy snapshots used a semantic CSS expression for badge color, coupling it to error token changes.
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
 * Migrates legacy flat page/surface/search backgrounds to modern contrasting defaults.
 */
function normalizeLegacySurfaceContrast(theme: AppShellTheme): AppShellTheme {
  const normalizedPageBackground = String(theme.pageBackground ?? '').trim().toLowerCase()
  const normalizedSearchBackground = String(theme.searchBackground ?? '').trim().toLowerCase()
  const normalizedDrawerBackground = String(theme.drawerBackground ?? '').trim().toLowerCase()

  const isLegacyPageBackground = normalizedPageBackground === LEGACY_PAGE_BACKGROUND_TOKEN
    || normalizedPageBackground === LEGACY_SURFACE_BACKGROUND_TOKEN
  const isLegacySearchBackground = normalizedSearchBackground === LEGACY_SURFACE_BACKGROUND_TOKEN
    || normalizedSearchBackground.length === 0
  const isLegacyDrawerBackground = normalizedDrawerBackground === LEGACY_SURFACE_BACKGROUND_TOKEN

  if (!isLegacyPageBackground || !isLegacySearchBackground || !isLegacyDrawerBackground) {
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
 * Normalizes menu items by removing invalid/legacy entries and restoring required defaults.
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
    if (!id || LEGACY_CMS_ITEM_IDS.has(id)) {
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

  const settingsDefaultItem = defaults.find(item => item.id === 'settings')
  if (settingsDefaultItem && !itemMap.has(settingsDefaultItem.id)) {
    itemMap.set(settingsDefaultItem.id, cloneValue(settingsDefaultItem))
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
function normalizePagesSettings(pages: unknown, defaults: CmsPageSettings[]): CmsPageSettings[] {
  if (!Array.isArray(pages)) {
    return cloneValue(defaults)
  }

  const normalized = pages
    .map((rawPage, index) => {
      if (!rawPage || typeof rawPage !== 'object') {
        return null
      }

      const page = rawPage as Partial<CmsPageSettings>
      const id = String(page.id ?? '').trim() || `page-${index + 1}`
      const sections = Array.isArray(page.sections)
        ? page.sections
          .map((rawSection, sectionIndex) => {
            if (!rawSection || typeof rawSection !== 'object') {
              return null
            }
            const section = rawSection as Partial<CmsPageSettings['sections'][number]>
            return {
              id: String(section.id ?? '').trim() || `${id}-section-${sectionIndex + 1}`,
              label: String(section.label ?? '').trim() || `Section ${sectionIndex + 1}`,
              enabled: Boolean(section.enabled),
            }
          })
          .filter((section): section is CmsPageSettings['sections'][number] => section !== null)
        : []

      return {
        id,
        title: String(page.title ?? '').trim() || `Page ${index + 1}`,
        path: String(page.path ?? '').trim() || `/${id}`,
        status: page.status === 'published' ? 'published' : 'draft',
        description: String(page.description ?? '').trim(),
        sections,
      } satisfies CmsPageSettings
    })
    .filter((page): page is CmsPageSettings => page !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Merges partial/legacy settings with defaults and returns a stable CMS white-label payload.
 */
export function normalizeCmsWhiteLabelSettings(
  parsed: Partial<CmsWhiteLabelSettings> | null | undefined
): CmsWhiteLabelSettings {
  const defaults = createDefaultWhiteLabelSettings()
  if (!parsed) {
    return defaults
  }

  const themePresetOverrides = normalizeThemePresetOverrides(parsed.themePresetOverrides)
  const mergedTheme = normalizeLegacySurfaceContrast(normalizeNotificationColors({
    ...defaults.theme,
    ...(parsed.theme ?? {}),
  }))
  const normalizedItems = normalizeMenuItems(parsed.items, defaults.items)
  const normalizedNavGroups = normalizeNavGroups(parsed.navGroups, defaults.navGroups, normalizedItems)

  const merged: CmsWhiteLabelSettings = {
    branding: {
      ...defaults.branding,
      ...(parsed.branding ?? {}),
    },
    layout: {
      ...defaults.layout,
      ...(parsed.layout ?? {}),
    },
    content: {
      ...defaults.content,
      ...(parsed.content ?? {}),
    },
    pages: normalizePagesSettings(parsed.pages, defaults.pages),
    themePresetId: defaults.themePresetId,
    themePresetOverrides,
    theme: mergedTheme,
    navGroups: normalizedNavGroups,
    items: normalizedItems,
    toolbarActions: parsed.toolbarActions ?? cloneValue(defaults.toolbarActions),
  }

  const themePresets = buildThemePresetsWithOverrides(defaults.theme, themePresetOverrides)
  merged.themePresetId = isCmsThemePresetId(parsed.themePresetId)
    ? parsed.themePresetId
    : detectCmsThemePresetId(merged.theme, themePresets, defaults.theme)

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
 * Persists the full normalized white-label settings object.
 */
export function saveCmsWhiteLabelSettings(settings: CmsWhiteLabelSettings): void {
  if (!isBrowserRuntime()) {
    return
  }

  const serialized = JSON.stringify(settings)
  window.localStorage.setItem(CMS_WHITE_LABEL_STORAGE_KEY, serialized)
}

/**
 * Loads settings from storage and returns a normalized object with defaults.
 */
export function loadCmsWhiteLabelSettings(): CmsWhiteLabelSettings {
  const defaults = normalizeCmsWhiteLabelSettings(undefined)

  if (!isBrowserRuntime()) {
    return defaults
  }

  const rawValue = window.localStorage.getItem(CMS_WHITE_LABEL_STORAGE_KEY)
  if (!rawValue) {
    return defaults
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CmsWhiteLabelSettings>
    return normalizeCmsWhiteLabelSettings(parsed)
  } catch {
    return defaults
  }
}

/**
 * Clears persisted settings and returns current defaults.
 */
export function resetCmsWhiteLabelSettings(): CmsWhiteLabelSettings {
  const defaults = createDefaultWhiteLabelSettings()

  if (isBrowserRuntime()) {
    window.localStorage.removeItem(CMS_WHITE_LABEL_STORAGE_KEY)
  }

  return defaults
}