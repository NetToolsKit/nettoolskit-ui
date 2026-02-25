import type { AppShellConfig, AppShellTheme } from './app-shell.types'

const APP_SHELL_DEFAULTS: AppShellConfig = {
  appName: 'NetToolsKit',
  appSubtitle: 'NTK CMS',
  brandLogo: '/favicon.png',
  brandLogoAlt: 'NTK',
  menuIcon: 'menu',
  menuAriaLabel: 'Alternar menu',
  navGroups: [],
  items: [],
  activeItem: '',
  searchValue: '',
  searchPlaceholder: 'Buscar',
  showSearch: true,
  showGroupCaptions: true,
  toolbarActions: [],
  theme: {},
  showNotifications: true,
  notificationsTooltip: 'Notificacoes',
  notificationCount: 0,
  showUserAvatar: true,
  userAvatar: '',
  userTooltip: 'Conta',
  collapsible: true,
  collapseLabel: 'Comprimir menu',
  expandLabel: 'Expandir menu',
  drawerWidth: 200,
  miniWidth: 64,
  breakpoint: 1024,
  headerHeight: 64,
  defaultDrawerOpen: true,
  defaultMini: false,
}

export const SENTINELA_LIKE_THEME: AppShellTheme = {
  shellBackground: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  headerShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  drawerShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
  dividerColor: '#f0f0f0',
  searchBorder: 'rgba(0, 0, 0, 0.24)',
  searchBorderHover: 'rgba(0, 0, 0, 0.87)',
  actionHoverBackground: 'rgba(25, 118, 210, 0.08)',
  itemTextColor: '#5f6368',
  itemHoverBackground: 'rgba(25, 118, 210, 0.08)',
  itemActiveBackground: 'linear-gradient(90deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.05) 100%)',
  itemActiveColor: '#1976d2',
}

const SENTINELA_LIKE_DEFAULTS: Partial<AppShellConfig> = {
  menuIcon: 'menu',
  menuAriaLabel: 'Alternar menu',
  showSearch: true,
  showGroupCaptions: true,
  collapsible: true,
  collapseLabel: 'Comprimir menu',
  expandLabel: 'Expandir menu',
  drawerWidth: 200,
  miniWidth: 64,
  breakpoint: 1024,
  headerHeight: 64,
  defaultDrawerOpen: true,
  defaultMini: false,
  theme: SENTINELA_LIKE_THEME,
}

function mergeShellConfig(base: AppShellConfig, partial: Partial<AppShellConfig>): AppShellConfig {
  return {
    ...base,
    ...partial,
    navGroups: partial.navGroups ?? base.navGroups,
    items: partial.items ?? base.items,
    toolbarActions: partial.toolbarActions ?? base.toolbarActions,
    theme: {
      ...(base.theme ?? {}),
      ...(partial.theme ?? {}),
    },
  }
}

export function createAppShellConfig(partial: Partial<AppShellConfig>): AppShellConfig {
  return mergeShellConfig(APP_SHELL_DEFAULTS, partial)
}

export function sentinelaLikePreset(partial: Partial<AppShellConfig>): AppShellConfig {
  const basePreset = mergeShellConfig(APP_SHELL_DEFAULTS, SENTINELA_LIKE_DEFAULTS)
  return mergeShellConfig(basePreset, partial)
}
