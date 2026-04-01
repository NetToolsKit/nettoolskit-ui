import type { CSSProperties } from 'vue'

import { findReferenceWhitelabelPreset, referenceWhitelabelPresets } from './presets'
import type { ReferenceWhitelabelPreset } from './types'

export const REFERENCE_WHITELABEL_STORAGE_KEY = 'ntk.reference.whitelabel.preset'

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
    '--ntk-template-layout-header-bg': palette.surface,
    '--ntk-template-layout-header-text': palette.text,
    '--ntk-template-layout-title-color': palette.text,
    '--ntk-template-layout-horizontal-bg': `linear-gradient(90deg, ${palette.secondary} 0%, ${palette.primaryDark} 100%)`,
    '--ntk-template-layout-horizontal-text': palette.surface,
    '--ntk-template-layout-drawer-bg': `linear-gradient(180deg, ${palette.secondary} 0%, ${palette.primaryDark} 100%)`,
    '--ntk-template-layout-drawer-text': palette.surface,
    '--ntk-template-layout-page-bg': palette.background,
    '--ntk-template-auth-layout-bg': palette.background,
    '--ntk-template-login-page-bg': palette.background,
    '--ntk-template-login-brand-bg': gradients.hero,
    '--ntk-template-login-brand-text': palette.surface,
    '--ntk-template-login-brand-subtitle': 'rgba(255, 255, 255, 0.78)',
    '--ntk-template-login-brand-feature-text': 'rgba(255, 255, 255, 0.92)',
    '--ntk-template-login-brand-feature-bg': 'rgba(255, 255, 255, 0.14)',
    '--ntk-template-login-brand-footer': 'rgba(255, 255, 255, 0.64)',
    '--ntk-template-login-form-bg': gradients.panel,
    '--ntk-template-login-form-border': palette.border,
    '--ntk-template-login-form-card-bg': palette.surface,
    '--ntk-template-login-form-title': palette.text,
    '--ntk-template-login-form-subtitle': palette.textMuted,
    '--ntk-template-login-version': palette.textMuted,
    '--ntk-template-wiki-bg': palette.background,
    '--ntk-template-wiki-icon-bg': palette.primaryDark,
    '--ntk-template-wiki-icon-text': palette.surface,
    '--ntk-template-wiki-chat-bg': palette.background,
    '--ntk-template-placeholder-bg': gradients.hero,
    '--ntk-template-placeholder-shadow': shadow.soft,
    '--ntk-template-placeholder-icon-color': palette.info,
    '--ntk-template-placeholder-icon-bg': 'rgba(59, 130, 246, 0.12)',
    '--ntk-template-profile-hero-bg': gradients.panel,
    '--ntk-template-profile-avatar-bg': gradients.accent,
    '--ntk-template-profile-avatar-border': palette.surface,
    '--ntk-template-profile-avatar-shadow': 'rgba(15, 23, 42, 0.2)',
    '--ntk-template-notification-bg': palette.surface,
    '--ntk-template-notification-border': palette.border,
    '--ntk-template-notification-radius': radius.md,
    '--ntk-template-notification-shadow': shadow.medium,
    '--ntk-template-notification-message': palette.text,
    '--ntk-template-notification-positive': palette.success,
    '--ntk-template-notification-negative': palette.error,
    '--ntk-template-notification-warning': palette.warning,
    '--ntk-template-notification-info': palette.info,
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