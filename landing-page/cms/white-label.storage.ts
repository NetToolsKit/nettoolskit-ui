import { CMS_WHITE_LABEL_STORAGE_KEY, createDefaultWhiteLabelSettings } from './white-label.config'
import type { CmsPageSettings, CmsWhiteLabelSettings } from './white-label.types'
import { semanticColors } from '../../src/config/colors/semantic.config'
import type { AppShellTheme } from '../../src/components/layout/app-shell.types'
import { APP_SHELL_DEFAULT_THEME } from '../../src/components/layout/app-shell.config'
import { resolveAppShellTheme } from '../../src/components/layout/app-shell.theme'
import {
  buildCmsThemePresets,
  detectCmsThemePresetId,
  isCmsThemeBasePresetId,
  isCmsThemePresetId,
} from './theme-presets'

/**
 * Provides persistence and normalization helpers for the CMS white-label settings payload.
 * All loaded values are merged with defaults so legacy/partial snapshots remain usable.
 */

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

function isBrowserRuntime(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

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

export function normalizeCmsWhiteLabelSettings(
  parsed: Partial<CmsWhiteLabelSettings> | null | undefined
): CmsWhiteLabelSettings {
  const defaults = createDefaultWhiteLabelSettings()
  if (!parsed) {
    return defaults
  }

  const themePresetOverrides = normalizeThemePresetOverrides(parsed.themePresetOverrides)
  const mergedTheme = normalizeNotificationColors({
    ...defaults.theme,
    ...(parsed.theme ?? {}),
  })

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
    navGroups: parsed.navGroups ?? cloneValue(defaults.navGroups),
    items: parsed.items ?? cloneValue(defaults.items),
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