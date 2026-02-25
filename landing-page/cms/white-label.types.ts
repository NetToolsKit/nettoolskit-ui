import type {
  AppShellAction,
  AppShellConfig,
  AppShellGroup,
  AppShellItem,
  AppShellTheme,
} from '../../src/components/layout/app-shell.types'

export interface CmsBrandingSettings {
  appName: string
  appSubtitle: string
  brandLogo: string
  brandLogoAlt: string
  faviconUrl: string
  userAvatar: string
  userTooltip: string
  notificationsTooltip: string
  notificationCount: number
}

export interface CmsLayoutSettings {
  menuIcon: string
  menuAriaLabel: string
  showSearch: boolean
  searchPlaceholder: string
  showGroupCaptions: boolean
  collapseLabel: string
  expandLabel: string
  drawerWidth: number
  miniWidth: number
  breakpoint: number
  headerHeight: number
  defaultDrawerOpen: boolean
  defaultMini: boolean
}

export interface CmsContentSettings {
  tabBrandingLabel: string
  tabColorsLabel: string
  tabMenuLabel: string
  tabTopbarLabel: string
  tabContentLabel: string
  moduleFallbackDescription: string
  brandingBannerText: string
  colorsBannerText: string
  previewSuccessLabel: string
  previewWarningLabel: string
  previewErrorLabel: string
  previewInfoLabel: string
  statusTitle: string
  statusChipLabel: string
  statusThemeText: string
  statusBrandingText: string
  statusMenuText: string
  statusTopbarText: string
  howToTitle: string
  howToBody: string
  howToNextStep: string
}

export interface CmsWhiteLabelSettings {
  branding: CmsBrandingSettings
  layout: CmsLayoutSettings
  content: CmsContentSettings
  theme: AppShellTheme
  navGroups: AppShellGroup[]
  items: AppShellItem[]
  toolbarActions: AppShellAction[]
}

export interface CmsWhiteLabelState {
  activeItem: string
  searchValue: string
  settings: CmsWhiteLabelSettings
}

export interface CmsShellSnapshot {
  shellConfig: AppShellConfig
  filteredItems: AppShellItem[]
}
