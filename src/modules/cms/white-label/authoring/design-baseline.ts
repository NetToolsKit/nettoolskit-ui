/**
 * Reusable CMS authoring-shell design baseline helpers.
 *
 * The baseline intentionally stays close to restrained monochrome systems:
 * - Vercel: precise spacing and neutral shells
 * - Uber: pill/radius discipline and black/white hierarchy
 * - Ollama: calm soft-neutral work surfaces
 */
import type { AppShellTheme } from '../../../../components/layout/app-shell.types'
import { resolveAppShellTheme } from '../../../../components/layout/app-shell.theme'
import {
  CMS_THEME_PRESET_DEFAULT_ID,
  getCmsThemePresetTheme,
} from '../theme-presets'

/**
 * Default preset used by CMS white-label bootstrapping and authoring surfaces.
 */
export const CMS_AUTHORING_DEFAULT_THEME_PRESET_ID = CMS_THEME_PRESET_DEFAULT_ID

/**
 * Resolves the default enterprise monochrome baseline for newly created CMS states.
 */
export function createCmsDefaultEnterpriseTheme(defaultTheme: AppShellTheme): AppShellTheme {
  const presetTheme = getCmsThemePresetTheme(defaultTheme, CMS_AUTHORING_DEFAULT_THEME_PRESET_ID)
  return resolveAppShellTheme(presetTheme, defaultTheme)
}

/**
 * Applies authoring-surface structure on top of the active CMS theme without
 * forcing a separate color language inside the editor runtime.
 */
export function createCmsAuthoringShellTheme(
  activeTheme: Partial<AppShellTheme>,
  defaultTheme: AppShellTheme
): AppShellTheme {
  const resolved = resolveAppShellTheme(activeTheme, defaultTheme)
  const pageBackground = resolved.pageBackground || defaultTheme.pageBackground || 'var(--ntk-cms-page-bg)'
  const drawerBackground = resolved.drawerBackground || defaultTheme.drawerBackground || 'var(--ntk-cms-card-bg)'
  const searchBackground = resolved.searchBackground || drawerBackground
  const accent = resolved.itemActiveColor || defaultTheme.itemActiveColor || 'var(--ntk-cms-accent)'
  const hoverBackground = resolved.itemHoverBackground
    || defaultTheme.itemHoverBackground
    || 'var(--ntk-cms-item-hover-bg)'
  const activeBackground = resolved.itemActiveBackground
    || defaultTheme.itemActiveBackground
    || 'var(--ntk-cms-item-active-bg)'

  return {
    ...resolved,
    shellBackground: pageBackground,
    pageBackground,
    drawerBackground,
    drawerFooterBackground: resolved.drawerFooterBackground || drawerBackground,
    searchBackground,
    searchBorder: resolved.searchBorder
      || resolved.dividerColor
      || defaultTheme.searchBorder
      || defaultTheme.dividerColor
      || 'var(--ntk-cms-shell-border)',
    searchBorderHover: resolved.searchBorderHover
      || resolved.dividerColor
      || defaultTheme.searchBorderHover
      || defaultTheme.dividerColor
      || 'var(--ntk-cms-shell-border-hover)',
    itemActiveColor: accent,
    itemHoverColor: resolved.itemHoverColor || accent,
    itemIconHoverColor: resolved.itemIconHoverColor || accent,
    itemHoverBackground: hoverBackground,
    itemActiveBackground: activeBackground,
    groupCaptionMiniBackground: resolved.groupCaptionMiniBackground
      || defaultTheme.groupCaptionMiniBackground
      || 'var(--ntk-cms-group-caption-mini-bg)',
    actionBackground: resolved.actionBackground || 'transparent',
    actionHoverBackground: resolved.actionHoverBackground
      || defaultTheme.actionHoverBackground
      || 'var(--ntk-cms-action-hover-bg)',
    headerShadow: resolved.headerShadow || defaultTheme.headerShadow || 'var(--ntk-cms-header-shadow, var(--ntk-shadow-sm))',
    headerBlur: resolved.headerBlur || 'blur(0px)',
    drawerShadow: resolved.drawerShadow || defaultTheme.drawerShadow || 'var(--ntk-cms-drawer-shadow, var(--ntk-shadow-sm))',
    drawerFooterShadow: resolved.drawerFooterShadow
      || defaultTheme.drawerFooterShadow
      || 'var(--ntk-cms-drawer-footer-shadow, var(--ntk-shadow-xs))',
    radiusSm: resolved.radiusSm || '10px',
    radiusMd: resolved.radiusMd || '14px',
    radiusLg: resolved.radiusLg || '18px',
    radiusItem: resolved.radiusItem || '14px',
    workspaceMaxWidth: resolved.workspaceMaxWidth || 'none',
  }
}
