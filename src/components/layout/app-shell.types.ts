export interface AppShellGroup {
  id: string
  label: string
}

export interface AppShellItem {
  id: string
  group: string
  label: string
  icon: string
  caption?: string
  description?: string
  badge?: string | number
  badgeColor?: string
}

export interface AppShellAction {
  id: string
  icon?: string
  label?: string
  tooltip?: string
  href?: string
  external?: boolean
  color?: string
  textColor?: string
  badge?: string | number
  badgeColor?: string
  badgeTextColor?: string
  flat?: boolean
  dense?: boolean
  round?: boolean
  unelevated?: boolean
  outline?: boolean
  noCaps?: boolean
  showLabel?: boolean
  className?: string
}

export interface AppShellTheme {
  shellBackground?: string
  headerShadow?: string
  drawerShadow?: string
  dividerColor?: string
  searchBorder?: string
  searchBorderHover?: string
  actionHoverBackground?: string
  itemTextColor?: string
  itemHoverBackground?: string
  itemActiveBackground?: string
  itemActiveColor?: string
}

export interface AppShellConfig {
  appName: string
  appSubtitle: string
  brandLogo: string
  brandLogoAlt: string
  menuIcon: string
  menuAriaLabel: string
  navGroups: AppShellGroup[]
  items: AppShellItem[]
  activeItem: string
  searchValue: string
  searchPlaceholder: string
  showSearch: boolean
  showGroupCaptions: boolean
  toolbarActions: AppShellAction[]
  theme: AppShellTheme
  showNotifications: boolean
  notificationsTooltip: string
  notificationCount: number
  showUserAvatar: boolean
  userAvatar: string
  userTooltip: string
  collapsible: boolean
  collapseLabel: string
  expandLabel: string
  drawerWidth: number
  miniWidth: number
  breakpoint: number
  headerHeight: number
  defaultDrawerOpen: boolean
  defaultMini: boolean
}
