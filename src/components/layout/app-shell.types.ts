/**
 * Src/components/layout/app shell types module.
 */

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
  fontFamilyDisplay?: string
  fontStyleBase?: string
  fontWeightRegular?: string
  fontWeightMedium?: string
  fontWeightSemibold?: string
  fontWeightBold?: string
  fontSizeBase?: string
  fontSizeTitle?: string
  fontSizeTitleApp?: string
  fontSizeBrandTitle?: string
  fontSizeBrandSubtitle?: string
  fontSizeItemLabel?: string
  fontSizeItemCaption?: string
  fontSizeGroupCaption?: string
  fontSizeGroupCaptionMini?: string
  letterSpacingGroupCaption?: string
  letterSpacingGroupCaptionMini?: string
  lineHeightBrandText?: string
  lineHeightItemLabel?: string
  lineHeightItemCaption?: string
  menuSlotWidth?: string
  searchWidth?: string
  searchControlHeight?: string
  searchPrependPaddingRight?: string
  drawerHeaderMinHeight?: string
  brandLogoSize?: string
  groupCaptionMinHeight?: string
  groupCaptionPadding?: string
  groupCaptionMiniPadding?: string
  groupCaptionMiniMinWidth?: string
  groupCaptionMiniHeight?: string
  groupCaptionMiniHorizontalPadding?: string
  itemMinHeight?: string
  itemIconSize?: string
  itemHoverTranslateX?: string
  itemActiveBorderWidth?: string
  drawerScrollPaddingBottom?: string
  workspaceMaxWidth?: string
  miniItemMarginRight?: string
  miniItemAvatarMinWidth?: string
  radiusSm?: string
  radiusMd?: string
  radiusLg?: string
  radiusItem?: string
  spacingXs?: string
  spacingSm?: string
  spacingMd?: string
  spacingLg?: string
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
  actionBackground?: string
  actionHoverBackground?: string
  notificationBadgeColor?: string
  notificationBadgeTextColor?: string
  notificationIconColor?: string
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

export interface AppShellTelemetryEvent {
  type: 'navigation-select' | 'search-update' | 'toolbar-action' | 'menu-toggle'
  component: 'NtkAppShell'
  payload: Record<string, unknown>
  timestamp: string
}

export interface NtkAppShellProps {
  appName?: string
  appSubtitle?: string
  brandLogo?: string
  brandLogoAlt?: string
  menuIcon?: string
  menuAriaLabel?: string
  navGroups?: AppShellGroup[]
  items?: AppShellItem[]
  activeItem?: string
  searchValue?: string
  searchPlaceholder?: string
  showSearch?: boolean
  showGroupCaptions?: boolean
  toolbarActions?: AppShellAction[]
  theme?: AppShellTheme
  showNotifications?: boolean
  notificationsTooltip?: string
  notificationCount?: number
  showUserAvatar?: boolean
  userAvatar?: string
  userTooltip?: string
  collapsible?: boolean
  collapseLabel?: string
  expandLabel?: string
  drawerWidth?: number
  miniWidth?: number
  breakpoint?: number
  headerHeight?: number
  defaultDrawerOpen?: boolean
  defaultMini?: boolean
  searchAriaLabel?: string
  navigationAriaLabel?: string
  navigationItemsAriaLabel?: string
  toolbarAriaLabel?: string
  notificationsAriaLabel?: string
  userAriaLabel?: string
  itemAriaLabelPrefix?: string
  actionAriaLabelPrefix?: string
}

export interface NtkAppShellEmits {
  (e: 'update:active-item', value: string): void
  (e: 'update:search-value', value: string): void
  (e: 'item-click', value: AppShellItem): void
  (e: 'notifications-click'): void
  (e: 'user-click'): void
  (e: 'toolbar-action', value: AppShellAction): void
  (e: 'toggle-menu', value: { mini: boolean; open: boolean }): void
  (e: 'telemetry', value: AppShellTelemetryEvent): void
}