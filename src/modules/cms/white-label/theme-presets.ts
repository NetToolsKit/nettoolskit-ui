/**
 * Theme preset catalog and detection helpers used by CMS white-label settings.
 */
import type { AppShellTheme } from '../../../components/layout/app-shell.types'
import type { ThemeColorPalette } from '../../../config/colors/theme-mode.config'
import { themeColors } from '../../../config/colors/theme-mode.config'

/**
 * Complete list of preset ids accepted by CMS theme selectors.
 */
export const CMS_THEME_PRESET_IDS = [
  'default',
  'dark',
  'darkLanding',
  'enterpriseMinimal',
  'monochrome',
  'custom',
] as const

/**
 * Preset ids backed by predefined palettes/themes (excluding custom).
 */
export const CMS_THEME_BASE_PRESET_IDS = [
  'default',
  'dark',
  'darkLanding',
  'enterpriseMinimal',
  'monochrome',
] as const

/**
 * Preset ids treated as dark families for readability normalization.
 */
export const CMS_THEME_DARK_BASE_PRESET_IDS = [
  'dark',
  'darkLanding',
] as const

export type CmsThemePresetId = (typeof CMS_THEME_PRESET_IDS)[number]
export type CmsThemeBasePresetId = (typeof CMS_THEME_BASE_PRESET_IDS)[number]
export const CMS_THEME_PRESET_DEFAULT_ID: Exclude<CmsThemePresetId, 'custom'> = 'enterpriseMinimal'

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
    toolbarButtonColor: palette.textSecondary,
    titleAppColor: palette.textPrimary,
    titleTextColor: palette.textSecondary,
    titleSeparatorColor: palette.border,
    drawerBackground: palette.menuBackground,
    drawerFooterBackground: palette.menuBackground,
    drawerTextColor: palette.textSecondary,
    dividerColor: palette.border,
    searchBackground: palette.backgroundCard,
    searchTextColor: palette.textPrimary,
    searchIconColor: palette.textSecondary,
    searchBorder: palette.border,
    searchBorderHover: palette.borderFocus,
    pageBackground: palette.backgroundTertiary,
    pageTextColor: palette.textPrimary,
    brandTitleColor: palette.textPrimary,
    brandSubtitleColor: palette.textSecondary,
    groupCaptionColor: palette.textSecondary,
    itemTextColor: palette.textSecondary,
    itemIconColor: palette.textSecondary,
    itemActiveColor: accent,
    itemHoverColor: accent,
    itemIconHoverColor: accent,
    itemHoverBackground: accentSoft,
    itemActiveBackground: accentActive,
    groupCaptionMiniBackground: palette.backgroundCard,
    actionBackground: 'transparent',
    actionHoverBackground: palette.chipBackground,
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
 * Builds a dark preset aligned with landing GitHub-like dark surfaces.
 */
function createLandingDarkTheme(): Partial<AppShellTheme> {
  const accent = '#6e7681'
  const accentSoft = hexToRgba(accent, 0.2)
  const accentActive = hexToRgba(accent, 0.3)

  return {
    shellBackground: 'linear-gradient(135deg, #010409 0%, #0d1117 100%)',
    headerBackground: '#010409',
    headerTextColor: '#8b949e',
    toolbarButtonColor: '#8b949e',
    titleAppColor: '#c9d1d9',
    titleTextColor: '#8b949e',
    titleSeparatorColor: '#30363d',
    drawerBackground: '#0d1117',
    drawerFooterBackground: '#0d1117',
    drawerTextColor: '#c9d1d9',
    dividerColor: '#30363d',
    searchBackground: '#161b22',
    searchTextColor: '#c9d1d9',
    searchIconColor: '#8b949e',
    searchBorder: '#30363d',
    searchBorderHover: '#6e7681',
    pageBackground: '#0d1117',
    pageTextColor: '#c9d1d9',
    brandTitleColor: '#c9d1d9',
    brandSubtitleColor: '#8b949e',
    groupCaptionColor: '#7d8590',
    itemTextColor: '#c9d1d9',
    itemIconColor: '#8b949e',
    itemActiveColor: '#c9d1d9',
    itemHoverColor: '#c9d1d9',
    itemIconHoverColor: '#c9d1d9',
    itemHoverBackground: accentSoft,
    itemActiveBackground: accentActive,
    groupCaptionMiniBackground: '#161b22',
    actionBackground: 'transparent',
    actionHoverBackground: '#21262d',
    notificationSuccessColor: '#22c55e',
    notificationWarningColor: '#f59e0b',
    notificationErrorColor: '#ef4444',
    notificationInfoColor: '#3b82f6',
    notificationBadgeColor: '#ef4444',
    notificationBadgeTextColor: '#ffffff',
    notificationIconColor: '#8b949e',
    notificationSuccessTextColor: '#ffffff',
    notificationWarningTextColor: '#111827',
    notificationErrorTextColor: '#ffffff',
    notificationInfoTextColor: '#ffffff',
  }
}

/**
 * Builds a monochrome app-shell partial theme.
 */
function createMonochromeTheme(): Partial<AppShellTheme> {
  const accent = '#64748b'
  const accentSoft = hexToRgba(accent, 0.14)
  const accentActive = hexToRgba(accent, 0.22)

  return {
    shellBackground: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    headerBackground: '#f8fafc',
    headerTextColor: '#475569',
    toolbarButtonColor: '#64748b',
    titleAppColor: '#334155',
    titleTextColor: '#64748b',
    titleSeparatorColor: '#dbe3ee',
    drawerBackground: '#f8fafc',
    drawerFooterBackground: '#f8fafc',
    drawerTextColor: '#64748b',
    dividerColor: '#dbe3ee',
    searchBackground: '#ffffff',
    searchTextColor: '#1e293b',
    searchIconColor: '#64748b',
    searchBorder: '#cbd5e1',
    searchBorderHover: '#94a3b8',
    pageBackground: '#eef2f7',
    pageTextColor: '#1e293b',
    brandTitleColor: '#334155',
    brandSubtitleColor: '#64748b',
    groupCaptionColor: '#64748b',
    itemTextColor: '#64748b',
    itemIconColor: '#64748b',
    itemActiveColor: accent,
    itemHoverColor: '#334155',
    itemIconHoverColor: '#334155',
    itemHoverBackground: accentSoft,
    itemActiveBackground: accentActive,
    groupCaptionMiniBackground: '#e2e8f0',
    actionBackground: 'transparent',
    actionHoverBackground: '#e2e8f0',
    notificationSuccessColor: '#22c55e',
    notificationWarningColor: '#f59e0b',
    notificationErrorColor: '#ef4444',
    notificationInfoColor: '#3b82f6',
    notificationBadgeColor: '#ef4444',
    notificationBadgeTextColor: '#ffffff',
    notificationIconColor: '#64748b',
    notificationSuccessTextColor: '#ffffff',
    notificationWarningTextColor: '#111827',
    notificationErrorTextColor: '#ffffff',
    notificationInfoTextColor: '#ffffff',
  }
}

/**
 * Builds a monochrome enterprise shell inspired by Vercel, Uber, and Ollama.
 */
function createEnterpriseMinimalTheme(): Partial<AppShellTheme> {
  const accent = '#111111'
  const accentSoft = hexToRgba(accent, 0.06)
  const accentActive = hexToRgba(accent, 0.1)

  return {
    shellBackground: '#ffffff',
    headerBackground: '#ffffff',
    headerTextColor: '#1f1f1f',
    toolbarButtonColor: '#525252',
    titleAppColor: '#111111',
    titleTextColor: '#525252',
    titleSeparatorColor: '#d4d4d4',
    drawerBackground: '#ffffff',
    drawerFooterBackground: '#ffffff',
    drawerTextColor: '#404040',
    dividerColor: '#e5e5e5',
    searchBackground: '#fafafa',
    searchTextColor: '#111111',
    searchIconColor: '#737373',
    searchBorder: '#e5e5e5',
    searchBorderHover: '#d4d4d4',
    pageBackground: '#fafafa',
    pageTextColor: '#171717',
    brandTitleColor: '#111111',
    brandSubtitleColor: '#525252',
    groupCaptionColor: '#737373',
    itemTextColor: '#404040',
    itemIconColor: '#525252',
    itemActiveColor: accent,
    itemHoverColor: accent,
    itemIconHoverColor: accent,
    itemHoverBackground: accentSoft,
    itemActiveBackground: accentActive,
    groupCaptionMiniBackground: '#f5f5f5',
    actionBackground: 'transparent',
    actionHoverBackground: '#f3f4f6',
    notificationSuccessColor: '#16a34a',
    notificationWarningColor: '#ca8a04',
    notificationErrorColor: '#dc2626',
    notificationInfoColor: '#2563eb',
    notificationBadgeColor: '#111111',
    notificationBadgeTextColor: '#ffffff',
    notificationIconColor: '#525252',
    notificationSuccessTextColor: '#ffffff',
    notificationWarningTextColor: '#111827',
    notificationErrorTextColor: '#ffffff',
    notificationInfoTextColor: '#ffffff',
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
      label: 'Light',
      description: 'Default light shell with brand accents.',
      theme: { ...defaultTheme },
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'Preload dark palette values into shell tokens.',
      theme: createThemeFromMode(themeColors.dark),
    },
    {
      id: 'darkLanding',
      label: 'Dark (Landing)',
      description: 'Dark shell aligned with landing GitHub-like surfaces.',
      theme: createLandingDarkTheme(),
    },
    {
      id: 'enterpriseMinimal',
      label: 'Enterprise Minimal',
      description: 'Uber, Vercel, and Ollama-inspired monochrome enterprise shell.',
      theme: createEnterpriseMinimalTheme(),
    },
    {
      id: 'monochrome',
      label: 'Monochrome',
      description: 'Neutral grayscale palette for minimal interfaces.',
      theme: createMonochromeTheme(),
    },
  ]
}

/**
 * Resolves one preset theme by id returning an empty object when not found.
 */
export function getCmsThemePresetTheme(
  defaultTheme: AppShellTheme,
  presetId: Exclude<CmsThemePresetId, 'custom'>
): Partial<AppShellTheme> {
  return buildCmsThemePresets(defaultTheme).find(preset => preset.id === presetId)?.theme ?? {}
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