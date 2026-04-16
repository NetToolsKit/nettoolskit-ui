import type { CSSProperties } from 'vue'

import { findReferenceWhitelabelPreset, referenceWhitelabelPresets } from './presets'
import type { ReferenceWhitelabelPreset } from './types'

export const REFERENCE_WHITELABEL_STORAGE_KEY = 'ntk.reference.whitelabel.preset'

function mixWithTransparent(color: string, percentage: number): string {
  return `color-mix(in srgb, ${color} ${percentage}%, transparent)`
}

function createShadow(offsets: string, color: string, percentage: number): string {
  return `${offsets} ${mixWithTransparent(color, percentage)}`
}

export function listReferenceWhitelabelPresets(): ReferenceWhitelabelPreset[] {
  return [...referenceWhitelabelPresets]
}

export function resolveReferenceWhitelabelPreset(presetId?: string | null): ReferenceWhitelabelPreset {
  if (!presetId) {
    return referenceWhitelabelPresets[0]
  }

  return findReferenceWhitelabelPreset(presetId)
}

export function createReferenceWhitelabelStyleVars(preset: ReferenceWhitelabelPreset): CSSProperties {
  const { palette, typography, radius, shadow, gradients, brand } = preset
  const isDarkShell = preset.id !== 'reference-light'
  const shellContrastText = isDarkShell ? palette.text : palette.surface
  const shellContrastTextVar = 'var(--ntk-text-on-accent)'
  const shellHeaderBackground = palette.surface
  const shellHeaderShadow = isDarkShell
    ? createShadow('0 4px 16px', 'var(--ntk-secondary)', 24)
    : createShadow('0 1px 3px', 'var(--ntk-secondary)', 4)
  const shellDrawerBackground = `linear-gradient(180deg, ${palette.secondary} 0%, ${palette.primaryDark} 100%)`
  const shellNavText = mixWithTransparent(shellContrastTextVar, isDarkShell ? 84 : 86)
  const shellNavHoverBackground = mixWithTransparent(shellContrastTextVar, isDarkShell ? 4 : 8)
  const shellNavActiveBackground = `linear-gradient(90deg, color-mix(in srgb, ${palette.accent} 24%, transparent) 0%, color-mix(in srgb, ${palette.accent} 8%, transparent) 100%)`
  const shellNavActiveBorder = `color-mix(in srgb, ${palette.accent} 72%, ${palette.primaryLight})`
  const shellGroupText = mixWithTransparent(shellContrastTextVar, isDarkShell ? 74 : 82)
  const shellGroupPill = `color-mix(in srgb, ${palette.accent} 18%, transparent)`
  const shellSubmenuHover = `color-mix(in srgb, ${palette.accent} 8%, ${palette.surfaceAlt})`
  const shellSubmenuActive = `color-mix(in srgb, ${palette.accent} 14%, ${palette.surfaceAlt})`
  const shellChromeBackground = palette.surface
  const shellChromeBorder = isDarkShell
    ? mixWithTransparent('var(--ntk-text-muted)', 14)
    : mixWithTransparent('var(--ntk-secondary)', 8)
  const referencePanelBackground = isDarkShell
    ? palette.surface
    : palette.surface
  const referencePanelMutedBackground = isDarkShell
    ? palette.surfaceAlt
    : palette.surfaceAlt
  const referenceBadgeBackground = `color-mix(in srgb, var(--ntk-reference-accent) 16%, ${isDarkShell ? 'var(--ntk-reference-panel-muted-bg)' : 'var(--ntk-bg-card)'})`
  const referenceHeroBackground = isDarkShell
    ? palette.background
    : palette.background
  const loginBrandText = 'var(--ntk-text-light)'
  const loginBrandSubtitle = mixWithTransparent('var(--ntk-template-login-brand-text)', 78)
  const loginBrandFeatureText = mixWithTransparent('var(--ntk-template-login-brand-text)', 92)
  const loginBrandFeatureBackground = mixWithTransparent('var(--ntk-template-login-brand-text)', 14)
  const loginBrandFooter = mixWithTransparent('var(--ntk-template-login-brand-text)', 64)
  const profileAvatarShadow = mixWithTransparent('var(--ntk-secondary)', 20)
  const referenceShellGlow = isDarkShell
    ? createShadow('0 10px 24px', 'var(--ntk-secondary)', 24)
    : createShadow('0 1px 3px', 'var(--ntk-secondary)', 5)

  return {
    '--ntk-primary': palette.primary,
    '--ntk-primary-dark': palette.primaryDark,
    '--ntk-primary-light': palette.primaryLight,
    '--ntk-secondary': palette.secondary,
    '--ntk-accent': palette.accent,
    '--ntk-bg-primary': palette.background,
    '--ntk-bg-secondary': palette.backgroundMuted,
    '--ntk-bg-tertiary': palette.surfaceAlt,
    '--ntk-bg-card': palette.surface,
    '--ntk-bg-hover': palette.surfaceAlt,
    '--ntk-text-primary': palette.text,
    '--ntk-text-secondary': palette.textMuted,
    '--ntk-text-muted': palette.textMuted,
    '--ntk-text-dark': palette.text,
    '--ntk-text-light': palette.surface,
    '--ntk-text-on-accent': shellContrastText,
    '--ntk-text-on-primary': palette.surface,
    '--ntk-border-color': palette.border,
    '--ntk-border-light': palette.border,
    '--ntk-border-dark': palette.border,
    '--ntk-success': palette.success,
    '--ntk-warning': palette.warning,
    '--ntk-error': palette.error,
    '--ntk-info': palette.info,
    '--ntk-gradient-hero': gradients.hero,
    '--ntk-gradient-loading': gradients.panel,
    '--ntk-gradient-accent': gradients.accent,
    '--ntk-primary-gradient': gradients.accent,
    '--ntk-gradient-subtle': `linear-gradient(180deg, ${palette.surface} 0%, ${palette.surfaceAlt} 100%)`,
    '--ntk-font-family': typography.body,
    '--ntk-font-family-display': typography.display,
    '--ntk-radius-sm': radius.sm,
    '--ntk-radius-md': radius.md,
    '--ntk-radius-lg': radius.lg,
    '--ntk-radius-xl': radius.xl,
    '--ntk-radius-pill': radius.pill,
    '--ntk-shadow-soft': shadow.soft,
    '--ntk-shadow-md': shadow.medium,
    '--ntk-shadow-lg': shadow.strong,
    '--ntk-template-page-bg': palette.background,
    '--ntk-template-page-card-bg': palette.surface,
    '--ntk-template-page-border': palette.border,
    '--ntk-template-page-title': palette.text,
    '--ntk-template-page-subtitle': palette.textMuted,
    '--ntk-template-page-text': palette.text,
    '--ntk-template-page-row-bg': palette.surfaceAlt,
    '--ntk-template-page-chip-bg': palette.surfaceAlt,
    '--ntk-template-page-chip-border': palette.border,
    '--ntk-template-page-chip-text': palette.textMuted,
    '--ntk-template-layout-header-bg': shellHeaderBackground,
    '--ntk-template-layout-header-text': palette.text,
    '--ntk-template-layout-header-border': palette.border,
    '--ntk-template-layout-header-shadow': shellHeaderShadow,
    '--ntk-template-layout-shell-bg': palette.background,
    '--ntk-template-layout-page-text': palette.text,
    '--ntk-template-layout-title-color': palette.text,
    '--ntk-template-layout-horizontal-bg': shellDrawerBackground,
    '--ntk-template-layout-horizontal-text': shellNavText,
    '--ntk-template-layout-drawer-bg': shellDrawerBackground,
    '--ntk-template-layout-drawer-text': shellNavText,
    '--ntk-template-layout-drawer-border': palette.border,
    '--ntk-template-layout-page-bg': palette.background,
    '--ntk-template-layout-toolbar-surface': palette.surfaceAlt,
    '--ntk-template-layout-toolbar-border': palette.border,
    '--ntk-template-layout-brand-subtitle': palette.textMuted,
    '--ntk-template-layout-brand-kicker': brand.kicker,
    '--ntk-template-layout-brand-kicker-color': palette.primaryLight,
    '--ntk-template-layout-nav-text': shellNavText,
    '--ntk-template-layout-nav-hover-bg': shellNavHoverBackground,
    '--ntk-template-layout-nav-active-bg': shellNavActiveBackground,
    '--ntk-template-layout-nav-active-border': shellNavActiveBorder,
    '--ntk-template-layout-nav-active-text': 'var(--ntk-text-on-accent)',
    '--ntk-template-layout-nav-group-text': shellGroupText,
    '--ntk-template-layout-nav-group-pill-bg': shellGroupPill,
    '--ntk-template-layout-submenu-hover-bg': shellSubmenuHover,
    '--ntk-template-layout-submenu-active-bg': shellSubmenuActive,
    '--ntk-template-layout-submenu-active-border': shellNavActiveBorder,
    '--ntk-template-auth-layout-bg': palette.background,
    '--ntk-template-login-page-bg': palette.background,
    '--ntk-template-login-brand-bg': gradients.hero,
    '--ntk-template-login-brand-text': loginBrandText,
    '--ntk-template-login-brand-subtitle': loginBrandSubtitle,
    '--ntk-template-login-brand-feature-text': loginBrandFeatureText,
    '--ntk-template-login-brand-feature-bg': loginBrandFeatureBackground,
    '--ntk-template-login-brand-footer': loginBrandFooter,
    '--ntk-template-login-form-bg': gradients.panel,
    '--ntk-template-login-form-border': palette.border,
    '--ntk-template-login-form-card-bg': palette.surface,
    '--ntk-template-login-form-title': palette.text,
    '--ntk-template-login-form-subtitle': palette.textMuted,
    '--ntk-template-login-version': palette.textMuted,
    '--ntk-template-user-menu-header-bg': shellChromeBackground,
    '--ntk-template-user-menu-profile-bg': palette.surface,
    '--ntk-template-user-menu-avatar-bg': gradients.accent,
    '--ntk-template-user-menu-avatar-border': palette.surface,
    '--ntk-template-user-menu-avatar-color': palette.surface,
    '--ntk-template-user-menu-border': palette.border,
    '--ntk-template-user-menu-text': palette.text,
    '--ntk-template-user-menu-muted': palette.textMuted,
    '--ntk-template-user-menu-shadow': shadow.medium,
    '--ntk-template-user-menu-radius': radius.lg,
    '--ntk-template-wiki-bg': palette.background,
    '--ntk-template-wiki-icon-bg': palette.primaryDark,
    '--ntk-template-wiki-icon-text': palette.surface,
    '--ntk-template-wiki-chat-bg': palette.background,
    '--ntk-template-placeholder-bg': gradients.hero,
    '--ntk-template-placeholder-shadow': shadow.soft,
    '--ntk-template-placeholder-icon-color': palette.info,
    '--ntk-template-placeholder-icon-bg': `color-mix(in srgb, ${palette.accent} 16%, transparent)`,
    '--ntk-template-profile-hero-bg': gradients.panel,
    '--ntk-template-profile-avatar-bg': gradients.accent,
    '--ntk-template-profile-avatar-border': palette.surface,
    '--ntk-template-profile-avatar-shadow': profileAvatarShadow,
    '--ntk-template-notification-bg': palette.surface,
    '--ntk-template-notification-border': palette.border,
    '--ntk-template-notification-radius': radius.md,
    '--ntk-template-notification-shadow': shadow.medium,
    '--ntk-template-notification-message': palette.text,
    '--ntk-template-notification-positive': palette.success,
    '--ntk-template-notification-negative': palette.error,
    '--ntk-template-notification-warning': palette.warning,
    '--ntk-template-notification-info': palette.info,
    '--ntk-reference-topbar-control-bg': palette.surfaceAlt,
    '--ntk-reference-topbar-control-border': palette.border,
    '--ntk-reference-topbar-control-text': palette.text,
    '--ntk-reference-topbar-control-muted': palette.textMuted,
    '--ntk-reference-topbar-surface': palette.surface,
    '--ntk-reference-topbar-border': palette.border,
    '--ntk-reference-topbar-action-bg': shellChromeBackground,
    '--ntk-reference-border': palette.border,
    '--ntk-reference-page-bg': referenceHeroBackground,
    '--ntk-reference-panel-bg': referencePanelBackground,
    '--ntk-reference-panel-muted-bg': referencePanelMutedBackground,
    '--ntk-reference-accent': palette.accent,
    '--ntk-reference-accent-soft': `color-mix(in srgb, ${palette.accent} 16%, transparent)`,
    '--ntk-reference-badge-bg': referenceBadgeBackground,
    '--ntk-reference-badge-text': palette.accent,
    '--ntk-reference-hero-bg': referenceHeroBackground,
    '--ntk-reference-shell-chrome-bg': shellChromeBackground,
    '--ntk-reference-shell-chrome-border': shellChromeBorder,
    '--ntk-reference-shell-glow': referenceShellGlow,
    '--ntk-template-horizontal-link-color': shellNavText,
    '--ntk-template-horizontal-link-hover-color': 'var(--ntk-text-on-accent)',
    '--ntk-template-horizontal-link-hover-bg': shellNavHoverBackground,
    '--ntk-template-horizontal-link-active-color': 'var(--ntk-text-on-accent)',
    '--ntk-template-horizontal-link-active-border': shellNavActiveBorder,
    '--ntk-template-horizontal-link-active-bg': shellNavActiveBackground,
    '--ntk-template-horizontal-link-submenu-hover-bg': shellSubmenuHover,
    '--ntk-template-horizontal-link-submenu-active-border': shellNavActiveBorder,
    '--ntk-template-horizontal-link-submenu-active-bg': shellSubmenuActive,
    '--ntk-template-horizontal-link-submenu-active-color': palette.primary,
    '--reference-brand-name': brand.name,
    '--reference-brand-subtitle': brand.subtitle,
    '--reference-brand-kicker': brand.kicker,
  } as CSSProperties
}

export function loadStoredReferenceWhitelabelPreset(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(REFERENCE_WHITELABEL_STORAGE_KEY)
  } catch {
    return null
  }
}

export function persistReferenceWhitelabelPreset(presetId: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(REFERENCE_WHITELABEL_STORAGE_KEY, presetId)
  } catch {
    // Intentional no-op: private mode or storage restrictions should not break the runtime.
  }
}
