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
  badgeTextColor?: string
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
  fontFamily?: string
  transitionFast?: string
  shellBackground?: string
  headerBackground?: string
  headerTextColor?: string
  headerShadow?: string
  toolbarButtonColor?: string
  titleAppColor?: string
  titleTextColor?: string
  titleSeparatorColor?: string
  drawerShadow?: string
  drawerBackground?: string
  drawerTextColor?: string
  drawerFooterBackground?: string
  dividerColor?: string
  searchBackground?: string
  searchTextColor?: string
  searchIconColor?: string
  searchBorder?: string
  searchBorderHover?: string
  focusColor?: string
  actionHoverBackground?: string
  notificationBadgeTextColor?: string
  notificationSuccessColor?: string
  notificationWarningColor?: string
  notificationErrorColor?: string
  notificationInfoColor?: string
  notificationSuccessTextColor?: string
  notificationWarningTextColor?: string
  notificationErrorTextColor?: string
  notificationInfoTextColor?: string
  brandTitleColor?: string
  brandSubtitleColor?: string
  groupCaptionColor?: string
  groupCaptionMiniBackground?: string
  itemTextColor?: string
  itemHoverBackground?: string
  itemHoverColor?: string
  itemIconColor?: string
  itemIconHoverColor?: string
  itemActiveBackground?: string
  itemActiveColor?: string
  drawerFooterShadow?: string
  pageBackground?: string
  pageTextColor?: string
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
