/**
 * Src/components/layout/app shell config module.
 */

import type { AppShellConfig, AppShellTheme } from './app-shell.types'
import { semanticColors } from '../../config/colors/semantic.config'
import { resolveAppShellTheme } from './app-shell.theme'

const APP_SHELL_COLOR_TOKENS = {
  white: 'var(--ntk-bg-card)',
  secondarySurface: 'var(--ntk-bg-hover)',
  textInverse: 'var(--ntk-text-inverse)',
  neutral500: 'var(--ntk-text-secondary)',
  neutral600: 'var(--ntk-text-muted)',
  neutral700: 'var(--ntk-text-primary)',
  neutral300: 'var(--ntk-border-dark)',
  neutral200: 'var(--ntk-text-muted)',
  neutral100: 'var(--ntk-border-light)',
  accent: 'var(--ntk-primary)',
  danger: `var(--semantic-error, ${semanticColors.errorPrimary})`,
  success: `var(--semantic-success, ${semanticColors.successPrimary})`,
  warning: `var(--semantic-warning, ${semanticColors.warningPrimary})`,
  info: `var(--semantic-info, ${semanticColors.infoPrimary})`,
  pageText: 'var(--ntk-text-primary)',
} as const

const APP_SHELL_EFFECT_TOKENS = {
  shellBackground: 'var(--ntk-gradient-subtle, var(--ntk-gradient-hero))',
  headerShadow: 'var(--ntk-shadow-sm)',
  drawerShadow: 'var(--ntk-shadow-sm)',
  searchBorder: 'var(--ntk-border-input)',
  searchBorderHover: 'var(--ntk-border-input-hover)',
  actionBackground: 'transparent',
  actionHoverBackground: 'var(--ntk-bg-hover)',
  groupCaptionMiniBackground: 'var(--ntk-bg-hover)',
  itemHoverBackground: 'var(--ntk-bg-hover)',
  itemActiveBackground: 'var(--ntk-bg-active)',
  drawerFooterShadow: 'var(--ntk-shadow-sm)',
} as const

const APP_SHELL_BASE_THEME: AppShellTheme = {
  fontFamily: 'var(--ntk-font-family)',
  fontFamilyDisplay: 'var(--ntk-font-family-display)',
  fontStyleBase: 'normal',
  fontWeightRegular: 'var(--ntk-font-weight-normal)',
  fontWeightMedium: 'var(--ntk-font-weight-medium)',
  fontWeightSemibold: 'var(--ntk-font-weight-semibold)',
  fontWeightBold: 'var(--ntk-font-weight-bold)',
  fontSizeBase: '0.95rem',
  fontSizeTitle: '1rem',
  fontSizeTitleApp: '1.18rem',
  fontSizeBrandTitle: '0.9rem',
  fontSizeBrandSubtitle: '0.72rem',
  fontSizeItemLabel: '13px',
  fontSizeItemCaption: '11px',
  fontSizeGroupCaption: '0.68rem',
  fontSizeGroupCaptionMini: '0.62rem',
  letterSpacingGroupCaption: '0.08em',
  letterSpacingGroupCaptionMini: '0.06em',
  lineHeightBrandText: '1.1',
  lineHeightItemLabel: '1.25',
  lineHeightItemCaption: '1.2',
  borderWidth: '1px',
  menuSlotWidth: '30px',
  searchWidth: '320px',
  searchControlHeight: '36px',
  searchPrependPaddingRight: '12px',
  drawerHeaderMinHeight: '64px',
  brandLogoSize: '34px',
  groupCaptionMinHeight: '24px',
  groupCaptionPadding: '0.45rem 1rem 0.25rem',
  groupCaptionMiniPadding: '0.45rem 0',
  groupCaptionMiniMinWidth: '34px',
  groupCaptionMiniHeight: '18px',
  groupCaptionMiniHorizontalPadding: '0.35rem',
  groupCaptionMiniRadius: '999px',
  itemMinHeight: '52px',
  itemIconSize: '22px',
  itemHoverTranslateX: '4px',
  itemActiveBorderWidth: '4px',
  drawerScrollPaddingBottom: '80px',
  workspaceMaxWidth: '1280px',
  viewportHeight: '100vh',
  compactBreakpoint: '500',
  compactPagePadding: 'var(--ntk-shell-space-md)',
  compactWorkspaceCardPadding: 'var(--ntk-shell-space-md)',
  cmsLayoutBreakpointLg: '1280',
  cmsLayoutBreakpointMd: '1024',
  miniItemMarginRight: '12px',
  miniItemAvatarMinWidth: '28px',
  radiusSm: '6px',
  radiusMd: '8px',
  radiusLg: '10px',
  radiusItem: '0 28px 28px 0',
  spacingXs: '0.25rem',
  spacingSm: '0.5rem',
  spacingMd: '0.75rem',
  spacingLg: '1rem',
  transitionFast: 'var(--ntk-transition-base)',
  titleSeparatorSize: 'calc(var(--ntk-shell-font-size-title-app) + var(--ntk-shell-space-xs))',
  userAvatarSize: 'calc(var(--ntk-shell-search-control-height) - (var(--ntk-shell-space-xs) * 2))',
  headerBlur: 'blur(calc(var(--ntk-shell-space-sm) * 2))',
  actionHoverTranslateY: 'calc(var(--ntk-shell-space-xs) * -0.5)',
  itemCaptionOffset: 'calc(var(--ntk-shell-space-xs) * 0.6)',
  headerZIndex: '3000',
  drawerZIndex: '2000',
  groupSeparatorOpacity: '0.12',
  badgePulseScale: '1.1',
  shellBackground: APP_SHELL_EFFECT_TOKENS.shellBackground,
  headerBackground: APP_SHELL_COLOR_TOKENS.white,
  headerTextColor: APP_SHELL_COLOR_TOKENS.neutral500,
  headerShadow: APP_SHELL_EFFECT_TOKENS.headerShadow,
  toolbarButtonColor: APP_SHELL_COLOR_TOKENS.neutral500,
  titleAppColor: APP_SHELL_COLOR_TOKENS.neutral700,
  titleTextColor: APP_SHELL_COLOR_TOKENS.neutral600,
  titleSeparatorColor: APP_SHELL_COLOR_TOKENS.neutral300,
  drawerBackground: APP_SHELL_COLOR_TOKENS.white,
  drawerTextColor: APP_SHELL_COLOR_TOKENS.neutral500,
  drawerShadow: APP_SHELL_EFFECT_TOKENS.drawerShadow,
  drawerFooterBackground: APP_SHELL_COLOR_TOKENS.white,
  dividerColor: APP_SHELL_COLOR_TOKENS.neutral100,
  searchBackground: APP_SHELL_COLOR_TOKENS.secondarySurface,
  searchTextColor: APP_SHELL_COLOR_TOKENS.neutral700,
  searchIconColor: APP_SHELL_COLOR_TOKENS.neutral600,
  searchBorder: APP_SHELL_EFFECT_TOKENS.searchBorder,
  searchBorderHover: APP_SHELL_EFFECT_TOKENS.searchBorderHover,
  focusColor: APP_SHELL_COLOR_TOKENS.accent,
  actionBackground: APP_SHELL_EFFECT_TOKENS.actionBackground,
  actionHoverBackground: APP_SHELL_EFFECT_TOKENS.actionHoverBackground,
  // Keep the default equal to error, but as a concrete color to avoid implicit coupling.
  notificationBadgeColor: semanticColors.errorPrimary,
  notificationBadgeTextColor: APP_SHELL_COLOR_TOKENS.textInverse,
  notificationIconColor: APP_SHELL_COLOR_TOKENS.neutral500,
  notificationSuccessColor: APP_SHELL_COLOR_TOKENS.success,
  notificationWarningColor: APP_SHELL_COLOR_TOKENS.warning,
  notificationErrorColor: APP_SHELL_COLOR_TOKENS.danger,
  notificationInfoColor: APP_SHELL_COLOR_TOKENS.info,
  notificationSuccessTextColor: APP_SHELL_COLOR_TOKENS.textInverse,
  notificationWarningTextColor: APP_SHELL_COLOR_TOKENS.neutral700,
  notificationErrorTextColor: APP_SHELL_COLOR_TOKENS.textInverse,
  notificationInfoTextColor: APP_SHELL_COLOR_TOKENS.textInverse,
  brandTitleColor: APP_SHELL_COLOR_TOKENS.neutral700,
  brandSubtitleColor: APP_SHELL_COLOR_TOKENS.neutral600,
  groupCaptionColor: APP_SHELL_COLOR_TOKENS.neutral200,
  groupCaptionMiniBackground: APP_SHELL_EFFECT_TOKENS.groupCaptionMiniBackground,
  itemTextColor: APP_SHELL_COLOR_TOKENS.neutral500,
  itemHoverBackground: APP_SHELL_EFFECT_TOKENS.itemHoverBackground,
  itemHoverColor: APP_SHELL_COLOR_TOKENS.accent,
  itemIconColor: APP_SHELL_COLOR_TOKENS.neutral500,
  itemIconHoverColor: APP_SHELL_COLOR_TOKENS.accent,
  itemActiveBackground: APP_SHELL_EFFECT_TOKENS.itemActiveBackground,
  itemActiveColor: APP_SHELL_COLOR_TOKENS.accent,
  drawerFooterShadow: APP_SHELL_EFFECT_TOKENS.drawerFooterShadow,
  pageBackground: APP_SHELL_COLOR_TOKENS.secondarySurface,
  pageTextColor: APP_SHELL_COLOR_TOKENS.pageText,
}

export const APP_SHELL_DEFAULT_THEME: AppShellTheme = resolveAppShellTheme(APP_SHELL_BASE_THEME)

export const SENTINELA_LIKE_THEME: AppShellTheme = {
  ...APP_SHELL_DEFAULT_THEME,
}

export const APP_SHELL_DEFAULTS: AppShellConfig = {
  appName: 'NetToolsKit',
  appSubtitle: 'NTK CMS',
  brandLogo: '/favicon.png',
  brandLogoAlt: 'NTK',
  menuIcon: 'menu',
  menuAriaLabel: 'Toggle menu',
  navGroups: [],
  items: [],
  activeItem: '',
  searchValue: '',
  searchPlaceholder: 'Search module',
  showSearch: true,
  showGroupCaptions: true,
  toolbarActions: [],
  theme: APP_SHELL_DEFAULT_THEME,
  showNotifications: true,
  notificationsTooltip: 'Notifications',
  notificationCount: 0,
  showUserAvatar: true,
  userAvatar: '',
  userTooltip: 'Account',
  collapsible: true,
  collapseLabel: 'Collapse menu',
  expandLabel: 'Expand menu',
  drawerWidth: 200,
  miniWidth: 64,
  breakpoint: 1024,
  headerHeight: 64,
  defaultDrawerOpen: true,
  defaultMini: false,
}

/**
 * Handles merge shell config.
 */
function mergeShellConfig(base: AppShellConfig, partial: Partial<AppShellConfig>): AppShellConfig {
  return {
    ...base,
    ...partial,
    navGroups: partial.navGroups ?? base.navGroups,
    items: partial.items ?? base.items,
    toolbarActions: partial.toolbarActions ?? base.toolbarActions,
    theme: {
      ...(base.theme ?? APP_SHELL_DEFAULT_THEME),
      ...(partial.theme ?? {}),
    },
  }
}

/**
 * Creates app shell config.
 */
export function createAppShellConfig(partial: Partial<AppShellConfig> = {}): AppShellConfig {
  return mergeShellConfig(APP_SHELL_DEFAULTS, partial)
}

/**
 * Handles sentinela like preset.
 */
export function sentinelaLikePreset(partial: Partial<AppShellConfig> = {}): AppShellConfig {
  return createAppShellConfig(partial)
}