/**
 * Shared type contracts for CMS white-label state, settings and shell snapshots.
 */
import type {
  AppShellAction,
  AppShellConfig,
  AppShellGroup,
  AppShellItem,
  AppShellTheme,
} from '../../src/components/layout/app-shell.types'
import type { CmsThemeBasePresetId, CmsThemePresetId } from './theme-presets'

/**
 * Branding values editable in CMS white-label settings.
 */
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

/**
 * Layout and behavior flags for the CMS app shell.
 */
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

/**
 * Text/copy values rendered by CMS settings screens and previews.
 */
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

/**
 * Section metadata for a CMS managed page.
 */
export interface CmsPageSectionSettings {
  id: string
  label: string
  enabled: boolean
}

/**
 * Page definition editable in CMS page builder.
 */
export interface CmsPageSettings {
  id: string
  title: string
  path: string
  status: 'draft' | 'published'
  description: string
  sections: CmsPageSectionSettings[]
}

/**
 * Aggregate white-label settings persisted per tenant profile.
 */
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

/**
 * In-memory CMS white-label editing state.
 */
export interface CmsWhiteLabelState {
  activeItem: string
  searchValue: string
  settings: CmsWhiteLabelSettings
}

/**
 * Render snapshot returned by config mapping helpers.
 */
export interface CmsShellSnapshot {
  shellConfig: AppShellConfig
  filteredItems: AppShellItem[]
}

/**
 * Tenant profile wrapper containing settings and metadata.
 */
export interface CmsTenantProfile {
  id: string
  name: string
  settings: CmsWhiteLabelSettings
  updatedAt: string
}

/**
 * Persisted collection of tenant profiles with active pointer.
 */
export interface CmsTenantProfilesState {
  activeProfileId: string
  profiles: CmsTenantProfile[]
}