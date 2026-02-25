import type { AppShellConfig, AppShellTheme } from './app-shell.types'
import { semanticColors } from '../../config/colors/semantic.config'

const APP_SHELL_COLOR_TOKENS = {
  white: 'var(--ntk-bg-card)',
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
  actionHoverBackground: 'var(--ntk-bg-hover)',
  groupCaptionMiniBackground: 'var(--ntk-bg-hover)',
  itemHoverBackground: 'var(--ntk-bg-hover)',
  itemActiveBackground: 'var(--ntk-bg-active)',
  drawerFooterShadow: 'var(--ntk-shadow-sm)',
} as const

export const APP_SHELL_DEFAULT_THEME: AppShellTheme = {
  fontFamily: 'var(--ntk-font-family)',
  transitionFast: 'var(--ntk-transition-base)',
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
  searchBackground: APP_SHELL_COLOR_TOKENS.white,
  searchTextColor: APP_SHELL_COLOR_TOKENS.neutral700,
  searchIconColor: APP_SHELL_COLOR_TOKENS.neutral600,
  searchBorder: APP_SHELL_EFFECT_TOKENS.searchBorder,
  searchBorderHover: APP_SHELL_EFFECT_TOKENS.searchBorderHover,
  focusColor: APP_SHELL_COLOR_TOKENS.accent,
  actionHoverBackground: APP_SHELL_EFFECT_TOKENS.actionHoverBackground,
  notificationBadgeTextColor: APP_SHELL_COLOR_TOKENS.textInverse,
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
  pageBackground: 'var(--ntk-bg-primary)',
  pageTextColor: APP_SHELL_COLOR_TOKENS.pageText,
}

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

export function createAppShellConfig(partial: Partial<AppShellConfig> = {}): AppShellConfig {
  return mergeShellConfig(APP_SHELL_DEFAULTS, partial)
}

export function sentinelaLikePreset(partial: Partial<AppShellConfig> = {}): AppShellConfig {
  return createAppShellConfig(partial)
}
