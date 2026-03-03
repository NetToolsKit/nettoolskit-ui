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
  'monochrome',
  'custom',
] as const

/**
 * Preset ids backed by predefined palettes/themes (excluding custom).
 */
export const CMS_THEME_BASE_PRESET_IDS = [
  'default',
  'dark',
  'monochrome',
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
      label: 'Purple',
      description: 'Light shell with purple accents.',
      theme: { ...defaultTheme },
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'Preload dark palette values into shell tokens.',
      theme: createThemeFromMode(themeColors.dark),
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