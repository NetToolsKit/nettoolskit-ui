/**
 * Shared type contracts for CMS white-label state, settings and shell snapshots.
 */
import type {
  AppShellAction,
  AppShellConfig,
  AppShellGroup,
  AppShellItem,
  AppShellTheme,
} from '../../../components/layout/app-shell.types'
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
  tabTypographyLabel: string
  tabLayoutLabel: string
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
 * Supported actor roles for white-label governance workflow.
 */
export type CmsWhiteLabelActorRole =
  | 'owner'
  | 'admin'
  | 'editor'
  | 'reviewer'
  | 'viewer'
  | 'system'

/**
 * Allowed lifecycle statuses for white-label publication workflow.
 */
export type CmsWhiteLabelWorkflowStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'published'

/**
 * Supported workflow actions for white-label governance transitions.
 */
export type CmsWhiteLabelWorkflowAction =
  | 'save_draft'
  | 'submit_review'
  | 'approve'
  | 'request_changes'
  | 'publish'
  | 'rollback'
  | 'reset_defaults'
  | 'import_settings'

/**
 * Actor metadata used in governance and audit operations.
 */
export interface CmsWhiteLabelActor {
  id: string
  role: CmsWhiteLabelActorRole
  name?: string
}

/**
 * Workflow runtime state persisted for white-label lifecycle control.
 */
export interface CmsWhiteLabelWorkflowState {
  status: CmsWhiteLabelWorkflowStatus
  version: number
  publishedVersion: number | null
  lastActionAt: string
  lastActionBy: string
  lastActionRole: CmsWhiteLabelActorRole
}

/**
 * Lightweight revision metadata for version tracking per tenant.
 */
export interface CmsWhiteLabelRevision {
  version: number
  status: CmsWhiteLabelWorkflowStatus
  action: CmsWhiteLabelWorkflowAction
  at: string
  by: string
  byRole: CmsWhiteLabelActorRole
  summary: string
}

/**
 * Immutable audit row for governance events and compliance tracking.
 */
export interface CmsWhiteLabelAuditEntry {
  id: string
  action: CmsWhiteLabelWorkflowAction
  actorId: string
  actorRole: CmsWhiteLabelActorRole
  at: string
  fromStatus: CmsWhiteLabelWorkflowStatus
  toStatus: CmsWhiteLabelWorkflowStatus
  fromVersion: number
  toVersion: number
  summary: string
  metadata?: Record<string, string>
}

/**
 * Governance envelope that stores workflow, revisions and audit trail.
 */
export interface CmsWhiteLabelGovernance {
  workflow: CmsWhiteLabelWorkflowState
  revisions: CmsWhiteLabelRevision[]
  auditTrail: CmsWhiteLabelAuditEntry[]
  maxAuditEntries: number
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
  governance: CmsWhiteLabelGovernance
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