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
  const pageBackground = resolved.pageBackground || '#fafafa'
  const drawerBackground = resolved.drawerBackground || '#ffffff'
  const searchBackground = resolved.searchBackground || drawerBackground
  const accent = resolved.itemActiveColor || '#111111'
  const hoverBackground = resolved.itemHoverBackground || 'rgba(17, 17, 17, 0.05)'
  const activeBackground = resolved.itemActiveBackground || 'rgba(17, 17, 17, 0.08)'

  return {
    ...resolved,
    shellBackground: pageBackground,
    pageBackground,
    drawerBackground,
    drawerFooterBackground: resolved.drawerFooterBackground || drawerBackground,
    searchBackground,
    searchBorder: resolved.searchBorder || resolved.dividerColor || '#e5e5e5',
    searchBorderHover: resolved.searchBorderHover || resolved.dividerColor || '#d4d4d4',
    itemActiveColor: accent,
    itemHoverColor: resolved.itemHoverColor || accent,
    itemIconHoverColor: resolved.itemIconHoverColor || accent,
    itemHoverBackground: hoverBackground,
    itemActiveBackground: activeBackground,
    groupCaptionMiniBackground: resolved.groupCaptionMiniBackground || '#f5f5f5',
    actionBackground: resolved.actionBackground || 'transparent',
    actionHoverBackground: resolved.actionHoverBackground || '#f5f5f5',
    headerShadow: resolved.headerShadow || '0 8px 24px rgba(0, 0, 0, 0.05)',
    headerBlur: resolved.headerBlur || 'blur(0px)',
    drawerShadow: resolved.drawerShadow || '0 8px 24px rgba(0, 0, 0, 0.04)',
    drawerFooterShadow: resolved.drawerFooterShadow || 'inset 0 1px 0 rgba(0, 0, 0, 0.06)',
    radiusSm: resolved.radiusSm || '10px',
    radiusMd: resolved.radiusMd || '14px',
    radiusLg: resolved.radiusLg || '18px',
    radiusItem: resolved.radiusItem || '14px',
    workspaceMaxWidth: resolved.workspaceMaxWidth || 'none',
  }
}