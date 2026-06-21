/**
 * Shared CMS theme authoring/runtime helpers.
 *
 * Keeps theme editor behavior and authoring-shell style token projection out of
 * app-level runtime files such as landing-page/CmsApp.vue.
 */
import type { AppShellTheme } from '../../../../components/layout/app-shell.types'
import {
  detectCmsThemePresetId,
  isCmsThemeBasePresetId,
  isCmsThemePresetId,
  type CmsThemeBasePresetId,
  type CmsThemePreset,
  type CmsThemePresetId,
} from '../theme-presets'
import type { CmsWhiteLabelSettings } from '../types'
import type { ThemeField, ThemeFieldKey } from './theme-field-catalog'

/**
 * Parses rgb() colors into hex.
 */
function rgbStringToHex(value: string): string | null {
  const match = value.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (!match) {
    return null
  }

  const clamp = (channel: string): number => Math.max(0, Math.min(255, Number.parseInt(channel, 10) || 0))
  const channels = [clamp(match[1]), clamp(match[2]), clamp(match[3])]
  return `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Normalizes hex color values.
 */
function normalizeHexColor(value: string): string | null {
  const normalized = value.trim().toLowerCase()
  if (/^#[0-9a-f]{3}$/i.test(normalized)) {
    const channels = normalized.slice(1).split('')
    return `#${channels.map(channel => `${channel}${channel}`).join('')}`
  }

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return normalized
  }

  return null
}

/**
 * Resolves a color-like token into hex when possible.
 */
function resolveColorValueToHex(value: string): string | null {
  const directHex = normalizeHexColor(value)
  if (directHex) {
    return directHex
  }

  const rgbHex = rgbStringToHex(value)
  if (rgbHex) {
    return rgbHex
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const probe = document.createElement('span')
  probe.style.color = ''
  probe.style.color = value
  if (!probe.style.color) {
    return null
  }

  probe.style.display = 'none'
  document.body.appendChild(probe)
  const computedColor = window.getComputedStyle(probe).color
  probe.remove()
  return rgbStringToHex(computedColor) ?? normalizeHexColor(computedColor)
}

/**
 * Resolves a color picker value for one theme field.
 */
export function getCmsThemeFieldPickerValue(
  field: ThemeField,
  theme: CmsWhiteLabelSettings['theme'],
  fallbackColor: string
): string {
  const explicitValue = String(theme[field.key] ?? '')
  const explicitColor = resolveColorValueToHex(explicitValue)
  if (explicitColor) {
    return explicitColor
  }

  const placeholderColor = resolveColorValueToHex(field.placeholder ?? '')
  if (placeholderColor) {
    return placeholderColor
  }

  return resolveColorValueToHex(fallbackColor) ?? fallbackColor
}

/**
 * Applies one theme field update directly to CMS settings and preset overrides.
 */
export function applyCmsThemeFieldValue(
  settings: CmsWhiteLabelSettings,
  field: ThemeField,
  value: string | number | null,
  selectedThemePreset: CmsThemePresetId
): void {
  const normalized = String(value ?? '')
  settings.theme[field.key] = normalized

  for (const alias of field.aliases ?? []) {
    settings.theme[alias] = normalized
  }

  settings.themePresetId = selectedThemePreset
  if (!isCmsThemeBasePresetId(selectedThemePreset)) {
    return
  }

  const presetId: CmsThemeBasePresetId = selectedThemePreset
  const presetOverrides: Partial<Record<ThemeFieldKey, string>> = {
    ...(settings.themePresetOverrides[presetId] as Partial<Record<ThemeFieldKey, string>> | undefined),
  }

  presetOverrides[field.key] = normalized
  for (const alias of field.aliases ?? []) {
    presetOverrides[alias] = normalized
  }

  settings.themePresetOverrides = {
    ...settings.themePresetOverrides,
    [presetId]: presetOverrides,
  }
}

/**
 * Applies one selected preset theme onto current settings.
 */
export function applyCmsThemePreset(
  settings: CmsWhiteLabelSettings,
  presets: CmsThemePreset[],
  presetId: Exclude<CmsThemePresetId, 'custom'>
): boolean {
  const preset = presets.find(item => item.id === presetId)
  if (!preset) {
    return false
  }

  settings.theme = {
    ...settings.theme,
    ...preset.theme,
  }

  settings.themePresetId = presetId
  return true
}

/**
 * Resolves the selected preset id from persisted settings/current theme.
 */
export function resolveCmsSelectedThemePresetId(
  settings: CmsWhiteLabelSettings,
  presets: CmsThemePreset[],
  defaultTheme: AppShellTheme
): CmsThemePresetId {
  return isCmsThemePresetId(settings.themePresetId)
    ? settings.themePresetId
    : detectCmsThemePresetId(settings.theme, presets, defaultTheme)
}

export interface CmsAuthoringNotificationStyleInput {
  notificationBadgeColor: string
  notificationBadgeTextColor: string
  notificationErrorColor: string
  notificationErrorTextColor: string
  notificationIconColor: string
  notificationInfoColor: string
  notificationInfoTextColor: string
  notificationSuccessColor: string
  notificationSuccessTextColor: string
  notificationWarningColor: string
  notificationWarningTextColor: string
}

export interface CmsAuthoringStyleVarInput extends CmsAuthoringNotificationStyleInput {
  authoringTheme: AppShellTheme
  defaultTheme: AppShellTheme
  headerHeight: number
  layoutBreakpointLgPx: number
  layoutBreakpointMdPx: number
}

/**
 * Builds CSS variables consumed by the shared CMS authoring stylesheet.
 */
export function createCmsAuthoringStyleVars(input: CmsAuthoringStyleVarInput): Record<string, string> {
  const { authoringTheme, defaultTheme } = input

  return {
    '--ntk-shell-header-height': `${input.headerHeight || 60}px`,
    '--ntk-shell-viewport-height': '100vh',
    '--ntk-cms-font-family': authoringTheme.fontFamily || defaultTheme.fontFamily || '',
    '--ntk-cms-font-display': authoringTheme.fontFamilyDisplay || authoringTheme.fontFamily || defaultTheme.fontFamilyDisplay || defaultTheme.fontFamily || '',
    '--ntk-cms-font-style-base': authoringTheme.fontStyleBase || defaultTheme.fontStyleBase || 'normal',
    '--ntk-cms-font-weight-regular': authoringTheme.fontWeightRegular || defaultTheme.fontWeightRegular || '400',
    '--ntk-cms-font-weight-medium': authoringTheme.fontWeightMedium || defaultTheme.fontWeightMedium || authoringTheme.fontWeightRegular || defaultTheme.fontWeightRegular || '500',
    '--ntk-cms-font-weight-semibold': authoringTheme.fontWeightSemibold || defaultTheme.fontWeightSemibold || authoringTheme.fontWeightMedium || defaultTheme.fontWeightMedium || '600',
    '--ntk-cms-font-weight-bold': authoringTheme.fontWeightBold || defaultTheme.fontWeightBold || authoringTheme.fontWeightSemibold || defaultTheme.fontWeightSemibold || '700',
    '--ntk-cms-font-size-base': authoringTheme.fontSizeBase || defaultTheme.fontSizeBase || '0.925rem',
    '--ntk-cms-font-size-title': authoringTheme.fontSizeTitle || defaultTheme.fontSizeTitle || authoringTheme.fontSizeBase || defaultTheme.fontSizeBase || '0.925rem',
    '--ntk-cms-font-size-title-app': authoringTheme.fontSizeTitleApp || defaultTheme.fontSizeTitleApp || authoringTheme.fontSizeTitle || defaultTheme.fontSizeTitle || '1.05rem',
    '--ntk-cms-font-size-brand-title': authoringTheme.fontSizeBrandTitle || defaultTheme.fontSizeBrandTitle || authoringTheme.fontSizeBase || defaultTheme.fontSizeBase || '0.9rem',
    '--ntk-cms-font-size-brand-subtitle': authoringTheme.fontSizeBrandSubtitle || defaultTheme.fontSizeBrandSubtitle || '0.72rem',
    '--ntk-cms-font-size-item-label': authoringTheme.fontSizeItemLabel || defaultTheme.fontSizeItemLabel || '13px',
    '--ntk-cms-font-size-item-caption': authoringTheme.fontSizeItemCaption || defaultTheme.fontSizeItemCaption || '11px',
    '--ntk-cms-font-size-group-caption': authoringTheme.fontSizeGroupCaption || defaultTheme.fontSizeGroupCaption || '0.68rem',
    '--ntk-cms-font-size-group-caption-mini': authoringTheme.fontSizeGroupCaptionMini || defaultTheme.fontSizeGroupCaptionMini || '0.62rem',
    '--ntk-cms-letter-spacing-group-caption': authoringTheme.letterSpacingGroupCaption || defaultTheme.letterSpacingGroupCaption || '0.08em',
    '--ntk-cms-letter-spacing-group-caption-mini': authoringTheme.letterSpacingGroupCaptionMini || defaultTheme.letterSpacingGroupCaptionMini || '0.06em',
    '--ntk-cms-line-height-item-label': authoringTheme.lineHeightItemLabel || defaultTheme.lineHeightItemLabel || '1.25',
    '--ntk-cms-line-height-item-caption': authoringTheme.lineHeightItemCaption || defaultTheme.lineHeightItemCaption || '1.2',
    '--ntk-cms-item-caption-offset': authoringTheme.itemCaptionOffset || defaultTheme.itemCaptionOffset || 'calc(var(--ntk-cms-space-xs) * 0.6)',
    '--ntk-cms-radius-sm': authoringTheme.radiusSm || defaultTheme.radiusSm || '6px',
    '--ntk-cms-radius-md': authoringTheme.radiusMd || defaultTheme.radiusMd || '8px',
    '--ntk-cms-radius-lg': authoringTheme.radiusLg || defaultTheme.radiusLg || '10px',
    '--ntk-cms-radius-item': authoringTheme.radiusItem || defaultTheme.radiusItem || '0 28px 28px 0',
    '--ntk-cms-group-caption-mini-radius': authoringTheme.groupCaptionMiniRadius || defaultTheme.groupCaptionMiniRadius || '999px',
    '--ntk-cms-space-xs': authoringTheme.spacingXs || defaultTheme.spacingXs || '0.25rem',
    '--ntk-cms-space-sm': authoringTheme.spacingSm || defaultTheme.spacingSm || '0.5rem',
    '--ntk-cms-space-md': authoringTheme.spacingMd || defaultTheme.spacingMd || '0.75rem',
    '--ntk-cms-space-lg': authoringTheme.spacingLg || defaultTheme.spacingLg || '1rem',
    '--ntk-cms-border-width': authoringTheme.borderWidth || defaultTheme.borderWidth || '1px',
    '--ntk-cms-text-primary': authoringTheme.pageTextColor || defaultTheme.pageTextColor || '',
    '--ntk-cms-text-secondary': authoringTheme.drawerTextColor || defaultTheme.drawerTextColor || '',
    '--ntk-cms-border-color': authoringTheme.dividerColor || defaultTheme.dividerColor || '',
    '--ntk-cms-bg-card': authoringTheme.drawerBackground || defaultTheme.drawerBackground || '',
    '--ntk-cms-page-bg': authoringTheme.pageBackground || defaultTheme.pageBackground || 'var(--ntk-template-layout-page-bg, var(--ntk-bg-primary))',
    '--ntk-cms-card-bg': authoringTheme.drawerBackground || defaultTheme.drawerBackground || 'var(--ntk-template-page-card-bg, var(--ntk-bg-card))',
    '--ntk-cms-shell-border': authoringTheme.dividerColor || defaultTheme.dividerColor || 'var(--ntk-template-page-border, var(--ntk-border-color))',
    '--ntk-cms-shell-text': authoringTheme.pageTextColor || defaultTheme.pageTextColor || 'var(--ntk-template-page-title, var(--ntk-text-primary))',
    '--ntk-cms-shell-text-muted': authoringTheme.drawerTextColor || defaultTheme.drawerTextColor || 'var(--ntk-template-page-subtitle, var(--ntk-text-secondary))',
    '--ntk-cms-shell-accent': authoringTheme.itemActiveColor || defaultTheme.itemActiveColor || 'var(--ntk-accent, var(--ntk-primary))',
    '--ntk-cms-tab-active': authoringTheme.itemActiveColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-accent': authoringTheme.itemActiveColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-accent-soft': authoringTheme.itemHoverBackground || defaultTheme.itemHoverBackground || '',
    '--ntk-cms-accent-text': authoringTheme.itemHoverColor || authoringTheme.itemActiveColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-active-bg': authoringTheme.itemActiveBackground || defaultTheme.itemActiveBackground || '',
    '--ntk-cms-header-bg': authoringTheme.headerBackground || defaultTheme.headerBackground || '',
    '--ntk-cms-header-text': authoringTheme.headerTextColor || defaultTheme.headerTextColor || '',
    '--ntk-cms-header-shadow': authoringTheme.headerShadow || defaultTheme.headerShadow || '',
    '--ntk-cms-header-blur': authoringTheme.headerBlur || defaultTheme.headerBlur || 'blur(calc(var(--ntk-cms-space-sm) * 2))',
    '--ntk-template-layout-header-bg': authoringTheme.headerBackground || defaultTheme.headerBackground || 'var(--ntk-header-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-card)))',
    '--ntk-template-layout-header-text': authoringTheme.headerTextColor || defaultTheme.headerTextColor || 'var(--ntk-template-page-title, var(--ntk-text-primary))',
    '--ntk-template-layout-header-shadow': authoringTheme.headerShadow || defaultTheme.headerShadow || 'var(--ntk-shadow-md)',
    '--ntk-template-layout-title-color': authoringTheme.titleTextColor || authoringTheme.headerTextColor || defaultTheme.titleTextColor || defaultTheme.headerTextColor || 'var(--ntk-template-page-title, var(--ntk-text-primary))',
    '--ntk-cms-drawer-shadow': authoringTheme.drawerShadow || defaultTheme.drawerShadow || '',
    '--ntk-cms-drawer-footer-bg': authoringTheme.drawerFooterBackground || authoringTheme.drawerBackground || defaultTheme.drawerFooterBackground || defaultTheme.drawerBackground || '',
    '--ntk-cms-drawer-footer-shadow': authoringTheme.drawerFooterShadow || defaultTheme.drawerFooterShadow || '',
    '--ntk-template-layout-horizontal-bg': authoringTheme.drawerBackground || defaultTheme.drawerBackground || 'var(--ntk-drawer-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-card)))',
    '--ntk-template-layout-horizontal-text': authoringTheme.drawerTextColor || defaultTheme.drawerTextColor || 'var(--ntk-drawer-text, var(--ntk-template-page-title, var(--ntk-text-primary)))',
    '--ntk-template-layout-drawer-bg': authoringTheme.drawerBackground || defaultTheme.drawerBackground || 'var(--ntk-drawer-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-card)))',
    '--ntk-template-layout-drawer-text': authoringTheme.drawerTextColor || defaultTheme.drawerTextColor || 'var(--ntk-drawer-text, var(--ntk-template-page-title, var(--ntk-text-primary)))',
    '--ntk-template-layout-page-bg': authoringTheme.pageBackground || defaultTheme.pageBackground || 'var(--ntk-template-layout-page-bg, var(--ntk-bg-primary))',
    '--ntk-cms-search-bg': authoringTheme.searchBackground || defaultTheme.searchBackground || '',
    '--ntk-cms-search-text': authoringTheme.searchTextColor || defaultTheme.searchTextColor || '',
    '--ntk-cms-search-icon': authoringTheme.searchIconColor || authoringTheme.headerTextColor || defaultTheme.searchIconColor || defaultTheme.headerTextColor || '',
    '--ntk-cms-search-border': authoringTheme.searchBorder || defaultTheme.searchBorder || '',
    '--ntk-cms-search-border-hover': authoringTheme.searchBorderHover || defaultTheme.searchBorderHover || '',
    '--ntk-cms-transition': authoringTheme.transitionFast || defaultTheme.transitionFast || '',
    '--ntk-cms-focus-color': authoringTheme.focusColor || authoringTheme.itemActiveColor || defaultTheme.focusColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-action-bg': authoringTheme.actionBackground || defaultTheme.actionBackground || 'transparent',
    '--ntk-cms-action-hover': authoringTheme.actionHoverBackground || defaultTheme.actionHoverBackground || '',
    '--ntk-cms-shell-bg': authoringTheme.shellBackground || defaultTheme.shellBackground || '',
    '--ntk-cms-title-app': authoringTheme.titleAppColor || authoringTheme.itemActiveColor || defaultTheme.titleAppColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-title-text': authoringTheme.titleTextColor || authoringTheme.headerTextColor || defaultTheme.titleTextColor || defaultTheme.headerTextColor || '',
    '--ntk-cms-title-separator': authoringTheme.titleSeparatorColor || authoringTheme.dividerColor || defaultTheme.titleSeparatorColor || defaultTheme.dividerColor || '',
    '--ntk-cms-title-separator-size': authoringTheme.titleSeparatorSize || defaultTheme.titleSeparatorSize || 'calc(var(--ntk-cms-font-size-title-app) + var(--ntk-cms-space-xs))',
    '--ntk-cms-toolbar-icon': authoringTheme.toolbarButtonColor || authoringTheme.headerTextColor || defaultTheme.toolbarButtonColor || defaultTheme.headerTextColor || '',
    '--ntk-cms-brand-title': authoringTheme.brandTitleColor || authoringTheme.itemActiveColor || defaultTheme.brandTitleColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-brand-subtitle': authoringTheme.brandSubtitleColor || authoringTheme.drawerTextColor || defaultTheme.brandSubtitleColor || defaultTheme.drawerTextColor || '',
    '--ntk-template-user-menu-avatar-bg': authoringTheme.itemActiveColor || defaultTheme.itemActiveColor || 'var(--ntk-accent, var(--ntk-primary))',
    '--ntk-template-user-menu-avatar-border': 'var(--ntk-template-page-card-bg, var(--ntk-bg-card))',
    '--ntk-template-user-menu-avatar-color': input.notificationBadgeTextColor,
    '--ntk-template-user-menu-header-bg': 'color-mix(in srgb, var(--ntk-template-page-title, var(--ntk-text-primary)) 4%, transparent)',
    '--ntk-template-user-menu-profile-bg': 'var(--ntk-template-page-card-bg, var(--ntk-bg-card))',
    '--ntk-cms-group-caption': authoringTheme.groupCaptionColor || authoringTheme.drawerTextColor || defaultTheme.groupCaptionColor || defaultTheme.drawerTextColor || '',
    '--ntk-cms-group-caption-mini-bg': authoringTheme.groupCaptionMiniBackground || authoringTheme.itemHoverBackground || defaultTheme.groupCaptionMiniBackground || defaultTheme.itemHoverBackground || '',
    '--ntk-cms-item-text': authoringTheme.itemTextColor || authoringTheme.drawerTextColor || defaultTheme.itemTextColor || defaultTheme.drawerTextColor || '',
    '--ntk-cms-item-icon': authoringTheme.itemIconColor || authoringTheme.drawerTextColor || defaultTheme.itemIconColor || defaultTheme.drawerTextColor || '',
    '--ntk-cms-item-hover-color': authoringTheme.itemHoverColor || authoringTheme.itemActiveColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-item-icon-hover': authoringTheme.itemIconHoverColor || authoringTheme.itemHoverColor || authoringTheme.itemActiveColor || defaultTheme.itemIconHoverColor || defaultTheme.itemHoverColor || defaultTheme.itemActiveColor || '',
    '--ntk-cms-preview-search-width': authoringTheme.searchWidth || defaultTheme.searchWidth || '220px',
    '--ntk-cms-preview-search-height': authoringTheme.searchControlHeight || defaultTheme.searchControlHeight || '36px',
    '--ntk-cms-preview-user-avatar-size': authoringTheme.userAvatarSize || defaultTheme.userAvatarSize || 'calc(var(--ntk-cms-preview-search-height) - (var(--ntk-cms-space-xs) * 2))',
    '--ntk-cms-preview-action-hover-translate-y': authoringTheme.actionHoverTranslateY || defaultTheme.actionHoverTranslateY || 'calc(var(--ntk-cms-space-xs) * -0.5)',
    '--ntk-cms-preview-action-min-width': authoringTheme.menuSlotWidth || defaultTheme.menuSlotWidth || '30px',
    '--ntk-cms-preview-action-min-height': authoringTheme.searchControlHeight || defaultTheme.searchControlHeight || '28px',
    '--ntk-cms-preview-brand-logo-size': authoringTheme.brandLogoSize || defaultTheme.brandLogoSize || '40px',
    '--ntk-cms-layout-breakpoint-lg': `${input.layoutBreakpointLgPx}px`,
    '--ntk-cms-layout-breakpoint-md': `${input.layoutBreakpointMdPx}px`,
    '--ntk-cms-layout-side-min-width': 'calc(var(--ntk-cms-preview-search-width) + (var(--ntk-cms-space-lg) * 5))',
    '--ntk-cms-layout-config-example-min-width': 'calc(var(--ntk-cms-preview-search-width) + (var(--ntk-cms-space-lg) * 3.5))',
    '--ntk-cms-editor-min-height': 'calc(100vh - (var(--ntk-shell-header-height) + (var(--ntk-cms-space-lg) * 8)))',
    '--ntk-cms-editor-max-height': 'calc(100vh - (var(--ntk-shell-header-height) + (var(--ntk-cms-space-lg) * 8)))',
    '--ntk-cms-preview-icon-size-lg': authoringTheme.itemIconSize || defaultTheme.itemIconSize || '22px',
    '--ntk-cms-preview-icon-size-md': 'calc(var(--ntk-cms-preview-icon-size-lg) - var(--ntk-cms-space-xs))',
    '--ntk-cms-preview-icon-size-sm': 'calc(var(--ntk-cms-preview-icon-size-md) - var(--ntk-cms-space-xs))',
    '--ntk-cms-preview-icon-size-xs': 'calc(var(--ntk-cms-preview-icon-size-sm) - (var(--ntk-cms-space-xs) / 2))',
    '--ntk-cms-preview-avatar-icon-size': 'var(--ntk-cms-preview-action-min-height)',
    '--ntk-cms-preview-mini-caption-min-width': authoringTheme.groupCaptionMiniMinWidth || defaultTheme.groupCaptionMiniMinWidth || '34px',
    '--ntk-cms-preview-mini-caption-height': authoringTheme.groupCaptionMiniHeight || defaultTheme.groupCaptionMiniHeight || '18px',
    '--ntk-cms-preview-badge-min-size': authoringTheme.groupCaptionMiniHeight || defaultTheme.groupCaptionMiniHeight || '16px',
    '--ntk-cms-preview-badge-font-size': authoringTheme.fontSizeGroupCaptionMini || defaultTheme.fontSizeGroupCaptionMini || '0.62rem',
    '--ntk-cms-preview-badge-letter-spacing': authoringTheme.letterSpacingGroupCaptionMini || defaultTheme.letterSpacingGroupCaptionMini || '0.06em',
    '--ntk-cms-notification-success': input.notificationSuccessColor,
    '--ntk-cms-notification-warning': input.notificationWarningColor,
    '--ntk-cms-notification-error': input.notificationErrorColor,
    '--ntk-cms-notification-info': input.notificationInfoColor,
    '--ntk-cms-notification-badge-bg': input.notificationBadgeColor,
    '--ntk-cms-notification-badge-text': input.notificationBadgeTextColor,
    '--ntk-cms-notification-icon': input.notificationIconColor,
  }
}

/**
 * Creates one bordered neutral accent surface style used by banners and chips.
 */
export function createCmsAccentSurfaceStyle(input: {
  accentColor: string
  accentSoftBackground: string
  accentTextColor: string
  borderWidth: string
}): Record<string, string> {
  return {
    background: input.accentSoftBackground,
    color: input.accentTextColor,
    border: `${input.borderWidth} solid ${input.accentColor}`,
  }
}

/**
 * Creates one filled primary action style.
 */
export function createCmsPrimaryActionStyle(input: {
  accentColor: string
  textColor: string
}): Record<string, string> {
  return {
    background: input.accentColor,
    color: input.textColor,
  }
}

/**
 * Creates one text-first action style.
 */
export function createCmsTextActionStyle(color: string): Record<string, string> {
  return { color }
}

/**
 * Creates the semantic notification chip palette used by CMS previews.
 */
export function createCmsNotificationChipStyles(
  input: CmsAuthoringNotificationStyleInput
): Record<'success' | 'warning' | 'error' | 'info', Record<string, string>> {
  return {
    success: {
      background: input.notificationSuccessColor,
      color: input.notificationSuccessTextColor,
    },
    warning: {
      background: input.notificationWarningColor,
      color: input.notificationWarningTextColor,
    },
    error: {
      background: input.notificationErrorColor,
      color: input.notificationErrorTextColor,
    },
    info: {
      background: input.notificationInfoColor,
      color: input.notificationInfoTextColor,
    },
  }
}
