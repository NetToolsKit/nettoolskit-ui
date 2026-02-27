/**
 * Theme preset catalog and detection helpers used by CMS white-label settings.
 */
import type { AppShellTheme } from '../../src/components/layout/app-shell.types'
import type { ThemeColorPalette } from '../../src/config/colors/theme-mode.config'
import { themeColors } from '../../src/config/colors/theme-mode.config'
import type { ThemeConfig } from '../../src/config/theme/theme.config'
import { themes } from '../../src/config/theme/theme.config'

/**
 * Complete list of preset ids accepted by CMS theme selectors.
 */
export const CMS_THEME_PRESET_IDS = [
  'default',
  'light',
  'dark',
  'sentinela',
  'platea',
  'nettoolskit',
  'custom',
] as const

/**
 * Preset ids backed by predefined palettes/themes (excluding custom).
 */
export const CMS_THEME_BASE_PRESET_IDS = [
  'default',
  'light',
  'dark',
  'sentinela',
  'platea',
  'nettoolskit',
] as const

export type CmsThemePresetId = (typeof CMS_THEME_PRESET_IDS)[number]
export type CmsThemeBasePresetId = (typeof CMS_THEME_BASE_PRESET_IDS)[number]

/**
 * Type guard for all supported preset ids.
 */
export function isCmsThemePresetId(value: unknown): value is CmsThemePresetId {
  return typeof value === 'string' && (CMS_THEME_PRESET_IDS as readonly string[]).includes(value)
}

/**
 * Type guard for base preset ids that can receive persisted overrides.
 */
export function isCmsThemeBasePresetId(value: unknown): value is CmsThemeBasePresetId {
  return typeof value === 'string' && (CMS_THEME_BASE_PRESET_IDS as readonly string[]).includes(value)
}

/**
 * Serializable descriptor of a CMS theme preset entry.
 */
export interface CmsThemePreset {
  id: Exclude<CmsThemePresetId, 'custom'>
  label: string
  description: string
  theme: Partial<AppShellTheme>
}

/**
 * Converts an hex color into rgba preserving original value on invalid input.
 */
function hexToRgba(value: string, alpha: number): string {
  const normalized = value.trim().replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return value
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Builds an app-shell partial theme from a mode color palette.
 */
function createThemeFromMode(palette: ThemeColorPalette): Partial<AppShellTheme> {
  const accent = palette.primary
  const accentSoft = hexToRgba(accent, 0.12)
  const accentActive = hexToRgba(accent, 0.18)

  return {
    shellBackground: `linear-gradient(135deg, ${palette.background} 0%, ${palette.backgroundSecondary} 100%)`,
    headerBackground: palette.background,
    headerTextColor: palette.textSecondary,
    drawerBackground: palette.menuBackground,
    drawerTextColor: palette.textSecondary,
    dividerColor: palette.border,
    searchBackground: palette.backgroundCard,
    searchTextColor: palette.textPrimary,
    searchBorder: palette.border,
    searchBorderHover: palette.borderFocus,
    pageBackground: palette.backgroundTertiary,
    pageTextColor: palette.textPrimary,
    itemActiveColor: accent,
    itemHoverBackground: accentSoft,
    itemActiveBackground: accentActive,
    groupCaptionMiniBackground: palette.chipBackground,
    notificationSuccessColor: '#22c55e',
    notificationWarningColor: '#f59e0b',
    notificationErrorColor: '#ef4444',
    notificationInfoColor: '#3b82f6',
    notificationBadgeColor: '#ef4444',
    notificationBadgeTextColor: palette.textInverse,
    notificationIconColor: palette.textSecondary,
    notificationSuccessTextColor: palette.textInverse,
    notificationWarningTextColor: palette.textPrimary,
    notificationErrorTextColor: palette.textInverse,
    notificationInfoTextColor: palette.textInverse,
  }
}

/**
 * Builds an app-shell partial theme from a branded theme configuration.
 */
function createThemeFromBrand(config: ThemeConfig): Partial<AppShellTheme> {
  const accent = config.colors.primary
  const accentSoft = hexToRgba(accent, 0.12)
  const accentActive = hexToRgba(accent, 0.2)

  return {
    fontFamily: `${config.fonts.body}, sans-serif`,
    shellBackground: config.gradients.hero,
    headerBackground: config.colors.background,
    headerTextColor: config.colors.textLight,
    drawerBackground: config.colors.background,
    drawerTextColor: config.colors.textLight,
    dividerColor: config.colors.border,
    searchBackground: config.colors.backgroundLight,
    searchTextColor: config.colors.text,
    searchBorder: config.colors.border,
    searchBorderHover: accent,
    pageBackground: config.colors.backgroundLight,
    pageTextColor: config.colors.text,
    itemActiveColor: accent,
    itemHoverBackground: accentSoft,
    itemActiveBackground: accentActive,
    groupCaptionMiniBackground: config.colors.backgroundLight,
    notificationSuccessColor: config.colors.success,
    notificationWarningColor: config.colors.warning,
    notificationErrorColor: config.colors.error,
    notificationInfoColor: config.colors.info,
    notificationBadgeColor: config.colors.error,
    notificationBadgeTextColor: 'var(--ntk-text-inverse)',
    notificationIconColor: config.colors.textLight,
    notificationSuccessTextColor: 'var(--ntk-text-inverse)',
    notificationWarningTextColor: config.colors.text,
    notificationErrorTextColor: 'var(--ntk-text-inverse)',
    notificationInfoTextColor: 'var(--ntk-text-inverse)',
  }
}

/**
 * Normalizes token values for case/whitespace-insensitive comparisons.
 */
function normalizeThemeValue(value: string | undefined): string {
  return String(value ?? '').trim().toLowerCase()
}

/**
 * Checks whether current theme matches a preset considering default fallbacks.
 */
function themeMatchesPreset(
  currentTheme: AppShellTheme,
  presetTheme: Partial<AppShellTheme>,
  defaultTheme: AppShellTheme
): boolean {
  const currentResolved: AppShellTheme = { ...defaultTheme, ...currentTheme }
  const presetResolved: AppShellTheme = { ...defaultTheme, ...presetTheme }
  const keys = Object.keys(presetTheme) as Array<keyof AppShellTheme>

  return keys.every(key => normalizeThemeValue(currentResolved[key]) === normalizeThemeValue(presetResolved[key]))
}

/**
 * Builds the full list of selectable CMS theme presets.
 */
export function buildCmsThemePresets(defaultTheme: AppShellTheme): CmsThemePreset[] {
  return [
    {
      id: 'default',
      label: 'Default shell',
      description: 'Base values from AppShell default theme.',
      theme: { ...defaultTheme },
    },
    {
      id: 'light',
      label: 'Light mode',
      description: 'Preload light palette values into shell tokens.',
      theme: createThemeFromMode(themeColors.light),
    },
    {
      id: 'dark',
      label: 'Dark mode',
      description: 'Preload dark palette values into shell tokens.',
      theme: createThemeFromMode(themeColors.dark),
    },
    {
      id: 'sentinela',
      label: 'Sentinela',
      description: 'Blue enterprise visual identity.',
      theme: createThemeFromBrand(themes.sentinela),
    },
    {
      id: 'platea',
      label: 'PlaTEA',
      description: 'Warm accessibility-first visual identity.',
      theme: createThemeFromBrand(themes.platea),
    },
    {
      id: 'nettoolskit',
      label: 'NetToolsKit',
      description: 'Official product visual identity values.',
      theme: createThemeFromBrand(themes.nettoolskit),
    },
  ]
}

/**
 * Detects which preset id best matches the current theme payload.
 */
export function detectCmsThemePresetId(
  currentTheme: AppShellTheme,
  presets: CmsThemePreset[],
  defaultTheme: AppShellTheme
): CmsThemePresetId {
  for (const preset of presets) {
    if (themeMatchesPreset(currentTheme, preset.theme, defaultTheme)) {
      return preset.id
    }
  }
  return 'custom'
}