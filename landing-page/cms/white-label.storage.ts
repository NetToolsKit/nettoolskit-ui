import { CMS_WHITE_LABEL_STORAGE_KEY, createDefaultWhiteLabelSettings } from './white-label.config'
import type { CmsWhiteLabelSettings } from './white-label.types'
import { semanticColors } from '../../src/config/colors/semantic.config'
import type { AppShellTheme } from '../../src/components/layout/app-shell.types'

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
  const allColorsFilled = notificationValues.every(value => value.length > 0)
  const allColorsEqual = allColorsFilled && notificationValues.every(value => value === notificationValues[0])
  const allColorsMatchBadgeText = allColorsEqual && badgeTextColor.length > 0 && notificationValues[0] === badgeTextColor

  if (allColorsMatchBadgeText) {
    nextTheme.notificationSuccessColor = semanticColors.successPrimary
    nextTheme.notificationWarningColor = semanticColors.warningPrimary
    nextTheme.notificationErrorColor = semanticColors.errorPrimary
    nextTheme.notificationInfoColor = semanticColors.infoPrimary
  }

  nextTheme.notificationSuccessColor = nextTheme.notificationSuccessColor || semanticColors.successPrimary
  nextTheme.notificationWarningColor = nextTheme.notificationWarningColor || semanticColors.warningPrimary
  nextTheme.notificationErrorColor = nextTheme.notificationErrorColor || semanticColors.errorPrimary
  nextTheme.notificationInfoColor = nextTheme.notificationInfoColor || semanticColors.infoPrimary
  nextTheme.notificationBadgeTextColor = nextTheme.notificationBadgeTextColor || 'var(--ntk-text-inverse)'
  nextTheme.notificationSuccessTextColor = nextTheme.notificationSuccessTextColor || nextTheme.notificationBadgeTextColor
  nextTheme.notificationWarningTextColor = nextTheme.notificationWarningTextColor || 'var(--ntk-text-primary)'
  nextTheme.notificationErrorTextColor = nextTheme.notificationErrorTextColor || nextTheme.notificationBadgeTextColor
  nextTheme.notificationInfoTextColor = nextTheme.notificationInfoTextColor || nextTheme.notificationBadgeTextColor

  return nextTheme
}

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

export function saveCmsWhiteLabelSettings(settings: CmsWhiteLabelSettings): void {
  if (!isBrowserRuntime()) {
    return
  }

  const serialized = JSON.stringify(settings)
  window.localStorage.setItem(CMS_WHITE_LABEL_STORAGE_KEY, serialized)
}

export function loadCmsWhiteLabelSettings(): CmsWhiteLabelSettings {
  const defaults = createDefaultWhiteLabelSettings()

  if (!isBrowserRuntime()) {
    return defaults
  }

  const rawValue = window.localStorage.getItem(CMS_WHITE_LABEL_STORAGE_KEY)
  if (!rawValue) {
    return defaults
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CmsWhiteLabelSettings>
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
      theme: {
        ...defaults.theme,
        ...(parsed.theme ?? {}),
      },
      navGroups: parsed.navGroups ?? cloneValue(defaults.navGroups),
      items: parsed.items ?? cloneValue(defaults.items),
      toolbarActions: parsed.toolbarActions ?? cloneValue(defaults.toolbarActions),
    }
    merged.theme = normalizeNotificationColors(merged.theme)
    return merged
  } catch {
    return defaults
  }
}

export function resetCmsWhiteLabelSettings(): CmsWhiteLabelSettings {
  const defaults = createDefaultWhiteLabelSettings()

  if (isBrowserRuntime()) {
    window.localStorage.removeItem(CMS_WHITE_LABEL_STORAGE_KEY)
  }

  return defaults
}
