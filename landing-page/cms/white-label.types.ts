import type {
  AppShellAction,
  AppShellConfig,
  AppShellGroup,
  AppShellItem,
  AppShellTheme,
} from '../../src/components/layout/app-shell.types'
import type { CmsThemeBasePresetId, CmsThemePresetId } from './theme-presets'

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
  showNotifications: boolean
  showUserAvatar: boolean
  searchPlaceholder: string
  showGroupCaptions: boolean
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

export interface CmsPageSectionSettings {
  id: string
  label: string
  enabled: boolean
}

export interface CmsPageSettings {
  id: string
  title: string
  path: string
  status: 'draft' | 'published'
  description: string
  sections: CmsPageSectionSettings[]
}

export interface CmsWhiteLabelSettings {
  branding: CmsBrandingSettings
  layout: CmsLayoutSettings
  content: CmsContentSettings
  pages: CmsPageSettings[]
  themePresetId: CmsThemePresetId
  themePresetOverrides: Partial<Record<CmsThemeBasePresetId, Partial<AppShellTheme>>>
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

export interface CmsTenantProfile {
  id: string
  name: string
  settings: CmsWhiteLabelSettings
  updatedAt: string
}

export interface CmsTenantProfilesState {
  activeProfileId: string
  profiles: CmsTenantProfile[]
}