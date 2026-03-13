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
 * Locales supported by CMS copy presets.
 */
export type CmsLocale = 'en' | 'pt-BR'

/**
 * Locale-to-string map used for authored CMS copy overrides.
 */
export type CmsLocalizedTextRecord = Partial<Record<CmsLocale, string>>

/**
 * Locale-to-props map used for authored block payload overrides.
 */
export type CmsLocalizedPropsRecord = Partial<Record<CmsLocale, Record<string, unknown>>>

/**
 * Localized page-level authored values.
 */
export interface CmsPageLocalizationSettings {
  title?: CmsLocalizedTextRecord
  description?: CmsLocalizedTextRecord
  fields?: CmsLocalizedPropsRecord
}

/**
 * Localized section-level authored values.
 */
export interface CmsPageSectionLocalizationSettings {
  label?: CmsLocalizedTextRecord
  fields?: CmsLocalizedPropsRecord
}

/**
 * Localized block-level authored values.
 */
export interface CmsPageBlockLocalizationSettings {
  props?: CmsLocalizedPropsRecord
}

/**
 * Reusable authoring mode for page content sourced from the reusable libraries.
 */
export type CmsReusableReferenceMode = 'linked' | 'detached'

/**
 * Built-in content model families shipped by the CMS engine.
 */
export type CmsBuiltinContentModelId = 'landing-page' | 'marketing-page' | 'blank-page'

/**
 * User-authored content model identifiers persisted by the CMS engine.
 */
export type CmsAuthoredContentModelId = `authored-model:${string}`

/**
 * High-level content model families supported by the CMS pages builder.
 */
export type CmsContentModelId = CmsBuiltinContentModelId | CmsAuthoredContentModelId

/**
 * Canonical section presets supported by the CMS engine.
 * Presets act as reusable builder blueprints for new sections.
 */
export type CmsSectionPresetId =
  | 'header'
  | 'hero'
  | 'stats'
  | 'metrics'
  | 'features'
  | 'benefits'
  | 'installation'
  | 'cta'
  | 'footer'
  | 'custom'

/**
 * Canonical block presets supported by the CMS engine starter catalog.
 */
export type CmsBuiltinBlockPresetId =
  | 'landing-header-docs'
  | 'landing-header-product'
  | 'landing-hero-product-launch'
  | 'landing-hero-video-showcase'
  | 'landing-stats-proof-strip'
  | 'landing-stats-dashboard-kpis'
  | 'landing-features-component-library'
  | 'landing-features-enterprise-readiness'
  | 'landing-cta-installation-guide'
  | 'landing-cta-final-prompt'
  | 'landing-footer-docs'
  | 'landing-footer-product'

/**
 * User-authored block preset ids persisted by the CMS engine.
 */
export type CmsAuthoredBlockPresetId = `authored:${string}`

/**
 * Canonical block preset identifiers, including user-authored presets.
 */
export type CmsBlockPresetId =
  | 'custom'
  | CmsBuiltinBlockPresetId
  | CmsAuthoredBlockPresetId

/**
 * Localized authored values for block preset metadata and props.
 */
export interface CmsBlockPresetLocalizationSettings {
  name?: CmsLocalizedTextRecord
  description?: CmsLocalizedTextRecord
  props?: CmsLocalizedPropsRecord
}

/**
 * Field kinds supported by authored content-model schemas.
 */
export type CmsContentModelFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'toggle'
  | 'select'
  | 'url'
  | 'date'
  | 'media-asset'
  | 'reference'

/**
 * Primitive field values supported by content-model schemas.
 */
export type CmsContentModelFieldPrimitiveValue = string | number | boolean | null

/**
 * Supported field payload values, including repeatable arrays.
 */
export type CmsContentModelFieldValue =
  | CmsContentModelFieldPrimitiveValue
  | CmsContentModelFieldPrimitiveValue[]

/**
 * Localized authored values for one schema-field metadata payload.
 */
export interface CmsContentModelFieldLocalizationSettings {
  label?: CmsLocalizedTextRecord
  description?: CmsLocalizedTextRecord
  placeholder?: CmsLocalizedTextRecord
  group?: CmsLocalizedTextRecord
}

/**
 * One selectable option inside a `select` content-model field.
 */
export interface CmsContentModelFieldOptionSettings {
  value: string
  label: string
}

/**
 * Resolved select option contract exposed by the CMS engine at runtime.
 */
export interface CmsContentModelFieldOptionDefinition {
  value: string
  label: string
}

/**
 * Internal entity catalogs that one reference-style schema field can point to.
 * The engine keeps these catalogs backend-agnostic so applications can later
 * map them to remote repositories without changing authoring contracts.
 */
export type CmsSchemaReferenceKind =
  | 'content-model'
  | 'block-preset'
  | 'reusable-block'
  | 'reusable-section'

/**
 * Supported visibility sources for one schema field.
 */
export type CmsContentModelFieldVisibilitySource =
  | 'field'
  | 'page-status'

/**
 * Supported conditional operators for one schema field visibility rule.
 */
export type CmsContentModelFieldVisibilityOperator =
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'is-empty'
  | 'is-not-empty'
  | 'is-true'
  | 'is-false'

/**
 * One authored visibility rule persisted inside a content-model field definition.
 */
export interface CmsContentModelFieldVisibilitySettings {
  source: CmsContentModelFieldVisibilitySource
  fieldId?: string
  operator: CmsContentModelFieldVisibilityOperator
  value?: CmsContentModelFieldPrimitiveValue
}

/**
 * Resolved visibility rule exposed at runtime for schema-field rendering.
 */
export interface CmsContentModelFieldVisibilityDefinition {
  source: CmsContentModelFieldVisibilitySource
  fieldId: string | null
  operator: CmsContentModelFieldVisibilityOperator
  value: CmsContentModelFieldPrimitiveValue
}

/**
 * One authored field definition persisted inside a content model.
 */
export interface CmsContentModelFieldSettings {
  id: string
  type: CmsContentModelFieldType
  label: string
  description: string
  placeholder: string
  group: string
  order?: number
  required: boolean
  repeatable?: boolean
  min?: number | null
  max?: number | null
  defaultValue?: CmsContentModelFieldValue
  options?: CmsContentModelFieldOptionSettings[]
  mediaKinds?: CmsMediaAssetKind[]
  referenceKinds?: CmsSchemaReferenceKind[]
  visibility?: CmsContentModelFieldVisibilitySettings | null
  localization?: CmsContentModelFieldLocalizationSettings
}

/**
 * Resolved field definition returned by the CMS engine for builder rendering.
 */
export interface CmsContentModelFieldDefinition {
  id: string
  type: CmsContentModelFieldType
  label: string
  description: string
  placeholder: string
  group: string
  order: number
  required: boolean
  repeatable: boolean
  min: number | null
  max: number | null
  defaultValue: CmsContentModelFieldValue
  options: CmsContentModelFieldOptionDefinition[]
  mediaKinds: CmsMediaAssetKind[]
  referenceKinds: CmsSchemaReferenceKind[]
  visibility: CmsContentModelFieldVisibilityDefinition | null
}

/**
 * User-authored schema-field preset ids persisted by the CMS engine.
 */
export type CmsAuthoredContentModelFieldPresetId = `field-preset:${string}`

/**
 * Localized authored values for schema-field preset metadata.
 */
export interface CmsContentModelFieldPresetLocalizationSettings {
  name?: CmsLocalizedTextRecord
  description?: CmsLocalizedTextRecord
}

/**
 * User-authored schema-field preset persisted by the CMS engine for reusable content-model authoring.
 */
export interface CmsAuthoredContentModelFieldPresetSettings {
  id: CmsAuthoredContentModelFieldPresetId
  name: string
  description: string
  category: string
  field: CmsContentModelFieldSettings
  localization?: CmsContentModelFieldPresetLocalizationSettings
  archivedAt?: string | null
}

/**
 * User-authored block preset persisted by the CMS engine for block and section composition.
 */
export interface CmsAuthoredBlockPresetSettings {
  id: CmsAuthoredBlockPresetId
  name: string
  description: string
  category: string
  type: string
  sourcePresetId?: CmsBlockPresetId
  sourceReusableBlockId?: string
  starterSectionPresets: CmsSectionPresetId[]
  props: Record<string, unknown>
  localization?: CmsBlockPresetLocalizationSettings
  archivedAt?: string | null
}

/**
 * Localized authored values for custom content model metadata.
 */
export interface CmsContentModelLocalizationSettings {
  name?: CmsLocalizedTextRecord
  description?: CmsLocalizedTextRecord
  pageTitle?: CmsLocalizedTextRecord
  pageDescription?: CmsLocalizedTextRecord
  migrationNotes?: CmsLocalizedTextRecord
}

/**
 * Optional per-preset repetition limits used by one authored content model.
 * Missing entries mean "unlimited".
 */
export type CmsSectionPresetLimitMap = Partial<Record<CmsSectionPresetId, number>>

/**
 * User-authored content model persisted by the CMS engine for page/schema composition.
 */
export interface CmsAuthoredContentModelSettings {
  id: CmsAuthoredContentModelId
  name: string
  description: string
  defaultPageTitle: string
  defaultPageDescription: string
  defaultPagePathPrefix: string
  schemaVersion?: number
  migrationNotes?: string
  lastSchemaChangeAt?: string | null
  fields?: CmsContentModelFieldSettings[]
  allowedPresets: CmsSectionPresetId[]
  requiredPresets: CmsSectionPresetId[]
  starterPresets: CmsSectionPresetId[]
  recommendedPresets: CmsSectionPresetId[]
  maxSections: number | null
  sectionPresetLimits: CmsSectionPresetLimitMap
  localization?: CmsContentModelLocalizationSettings
}

/**
 * Media asset kinds supported by the CMS engine media library.
 */
export type CmsMediaAssetKind = 'image' | 'video' | 'icon' | 'document' | 'other'

/**
 * Optional focal-point coordinates used by hosts/renderers to crop visual assets consistently.
 * Values are stored as percentages in the range `0..100`.
 */
export interface CmsMediaAssetFocalPointSettings {
  x: number
  y: number
}

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
  locale: CmsLocale
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
  presetId: CmsSectionPresetId
  label: string
  enabled: boolean
  customFields?: Record<string, unknown>
  reusableMode?: CmsReusableReferenceMode
  reusableSourceId?: string
  localization?: CmsPageSectionLocalizationSettings
  blocks: CmsPageBlockSettings[]
}

/**
 * Block definition editable in CMS blocks manager.
 */
export interface CmsPageBlockSettings {
  id: string
  type: string
  presetId?: CmsBlockPresetId
  enabled: boolean
  reusableMode?: CmsReusableReferenceMode
  reusableSourceId?: string
  props: Record<string, unknown>
  localization?: CmsPageBlockLocalizationSettings
}

/**
 * Reusable block template persisted by the CMS engine for fast re-authoring.
 */
export interface CmsReusableBlockSettings {
  id: string
  name: string
  description: string
  category: string
  type: string
  presetId?: CmsBlockPresetId
  props: Record<string, unknown>
  localization?: CmsPageBlockLocalizationSettings
  archivedAt?: string | null
}

/**
 * Reusable section template persisted by the CMS engine for page-level authoring.
 */
export interface CmsReusableSectionSettings {
  id: string
  name: string
  description: string
  category: string
  contentModelId: CmsContentModelId
  presetId: CmsSectionPresetId
  label: string
  enabled: boolean
  customFields?: Record<string, unknown>
  localization?: CmsPageSectionLocalizationSettings
  blocks: CmsPageBlockSettings[]
  archivedAt?: string | null
}

/**
 * Media asset reference persisted by the CMS engine for branding and future content usage.
 */
export interface CmsMediaAssetSettings {
  id: string
  name: string
  description: string
  kind: CmsMediaAssetKind
  url: string
  alt: string
  focalPoint: CmsMediaAssetFocalPointSettings | null
  replaceTargetAssetId: string | null
  tags: string[]
  usage: string[]
}

/**
 * Page definition editable in CMS page builder.
 */
export interface CmsPageSettings {
  id: string
  contentModelId: CmsContentModelId
  contentModelVersion?: number | null
  title: string
  path: string
  status: 'draft' | 'published'
  description: string
  customFields?: Record<string, unknown>
  localization?: CmsPageLocalizationSettings
  sections: CmsPageSectionSettings[]
}

/**
 * Allowed release lifecycle states for CMS release orchestration.
 */
export type CmsReleaseStatus =
  | 'draft'
  | 'validated'
  | 'scheduled'
  | 'published'
  | 'rolled_back'
  | 'canceled'

/**
 * Runtime environments currently supported by CMS release management.
 */
export type CmsReleaseEnvironment = 'dev' | 'staging' | 'production'

/**
 * Promotion event status values emitted by release promotion operations.
 */
export type CmsReleasePromotionStatus = 'promoted' | 'blocked'

/**
 * Severity levels for release calendar conflict diagnostics.
 */
export type CmsReleaseConflictSeverity = 'warning' | 'error'

/**
 * Conflict categories tracked by release calendar checks.
 */
export type CmsReleaseConflictType = 'schedule_overlap' | 'invalid_transition' | 'stale_draft'

/**
 * Severity levels produced by release validation checks.
 */
export type CmsReleaseValidationSeverity = 'error' | 'warning'

/**
 * Individual validation issue emitted while validating a release snapshot.
 */
export interface CmsReleaseValidationIssue {
  code: string
  severity: CmsReleaseValidationSeverity
  message: string
  path?: string
}

/**
 * Validation report persisted per release entry.
 */
export interface CmsReleaseValidationReport {
  valid: boolean
  generatedAt: string
  errorCount: number
  warningCount: number
  issues: CmsReleaseValidationIssue[]
}

/**
 * Stable tenant snapshot bundled inside releases for publish/rollback operations.
 */
export interface CmsReleaseSnapshot {
  branding: CmsBrandingSettings
  layout: CmsLayoutSettings
  content: CmsContentSettings
  pages: CmsPageSettings[]
  reusableSections: CmsReusableSectionSettings[]
  reusableBlocks: CmsReusableBlockSettings[]
  authoredContentModels: CmsAuthoredContentModelSettings[]
  authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
  mediaAssets: CmsMediaAssetSettings[]
  themePresetId: CmsThemePresetId
  themePresetOverrides: Partial<Record<CmsThemeBasePresetId, Partial<AppShellTheme>>>
  theme: AppShellTheme
  navGroups: AppShellGroup[]
  items: AppShellItem[]
  toolbarActions: AppShellAction[]
}

/**
 * Release entity managed by the CMS release orchestration module.
 */
export interface CmsReleaseEntry {
  id: string
  name: string
  summary: string
  status: CmsReleaseStatus
  environment: CmsReleaseEnvironment
  sourceVersion: number
  sourceWorkflowStatus: CmsWhiteLabelWorkflowStatus
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  scheduledAt: string | null
  publishedAt: string | null
  rolledBackAt: string | null
  rollbackTargetReleaseId: string | null
  validation: CmsReleaseValidationReport
  snapshot: CmsReleaseSnapshot
}

/**
 * Environment-level policy controls for authoring, publishing and promotion access.
 */
export interface CmsReleaseEnvironmentPolicy {
  environment: CmsReleaseEnvironment
  allowedAuthorRoles: CmsWhiteLabelActorRole[]
  allowedPublisherRoles: CmsWhiteLabelActorRole[]
  allowedRuntimeReadRoles: CmsWhiteLabelActorRole[]
  promoteTo: CmsReleaseEnvironment[]
}

/**
 * Audit row for release promotions across environments.
 */
export interface CmsReleasePromotionEntry {
  id: string
  releaseId: string
  sourceEnvironment: CmsReleaseEnvironment
  targetEnvironment: CmsReleaseEnvironment
  status: CmsReleasePromotionStatus
  at: string
  by: string
  byRole: CmsWhiteLabelActorRole
  reason?: string
}

/**
 * Lightweight locale summary persisted for exported review package history.
 */
export interface CmsReviewPackageHistoryLocaleEntry {
  locale: string
  status: 'complete' | 'partial' | 'missing' | 'empty' | 'not-applicable'
  percentage: number
  missing: number
}

/**
 * Metadata stored after exporting one review package from Releases.
 */
export interface CmsReviewPackageHistoryEntry {
  id: string
  exportedAt: string
  fileName: string
  releaseId: string
  releaseName: string
  environment: CmsReleaseEnvironment
  publishedAt: string | null
  hasChanges: boolean
  changedPages: number
  changedSections: number
  changedBlocks: number
  localeCoverage: CmsReviewPackageHistoryLocaleEntry[]
  checklistAllowed: boolean
  checklistReadyCount: number
  checklistWarningCount: number
  checklistBlockingCount: number
}

/**
 * Release calendar diagnostic row for scheduled conflicts and stale drafts.
 */
export interface CmsReleaseCalendarConflict {
  id: string
  type: CmsReleaseConflictType
  severity: CmsReleaseConflictSeverity
  message: string
  environment: CmsReleaseEnvironment
  releaseIds: string[]
  at: string
}

/**
 * Aggregated release state persisted per tenant.
 */
export interface CmsReleaseSettings {
  schemaVersion: number
  maxEntries: number
  activeReleaseId: string | null
  activeEnvironment: CmsReleaseEnvironment
  /**
   * When false, CMS release engine runs in pure mode and skips role-based environment guards.
   * Permission checks can then be enforced by an external application layer.
   */
  enforceEnvironmentPolicies: boolean
  environmentPolicies: CmsReleaseEnvironmentPolicy[]
  promotions: CmsReleasePromotionEntry[]
  reviewPackages: CmsReviewPackageHistoryEntry[]
  items: CmsReleaseEntry[]
}

/**
 * Supported actor roles for white-label governance workflow.
 */
export type CmsWhiteLabelActorRole =
  | 'owner'
  | 'admin'
  | 'editor'
  | 'reviewer'
  | 'publisher'
  | 'viewer'
  | 'system'

/**
 * Allowed lifecycle statuses for white-label publication workflow.
 */
export type CmsWhiteLabelWorkflowStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'

/**
 * Supported workflow actions for white-label governance transitions.
 */
export type CmsWhiteLabelWorkflowAction =
  | 'save_draft'
  | 'submit_review'
  | 'approve'
  | 'request_changes'
  | 'schedule_publish'
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
 * Role policy template with explicit allow/deny action sets.
 */
export interface CmsWhiteLabelRolePolicy {
  role: CmsWhiteLabelActorRole
  label: string
  description: string
  groups: string[]
  allowActions: CmsWhiteLabelWorkflowAction[]
  denyActions: CmsWhiteLabelWorkflowAction[]
}

/**
 * Governance envelope that stores workflow, revisions and audit trail.
 */
export interface CmsWhiteLabelGovernance {
  workflow: CmsWhiteLabelWorkflowState
  revisions: CmsWhiteLabelRevision[]
  auditTrail: CmsWhiteLabelAuditEntry[]
  rolePolicies: CmsWhiteLabelRolePolicy[]
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
  reusableSections: CmsReusableSectionSettings[]
  reusableBlocks: CmsReusableBlockSettings[]
  authoredContentModels: CmsAuthoredContentModelSettings[]
  authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
  mediaAssets: CmsMediaAssetSettings[]
  releases: CmsReleaseSettings
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

/**
 * Preview source modes supported by the CMS engine.
 */
export type CmsPreviewSource = 'draft' | 'published'

/**
 * Preview viewport presets supported by the CMS engine.
 */
export type CmsPreviewViewport = 'desktop' | 'tablet' | 'mobile'

/**
 * Resolved preview snapshot returned by the CMS engine for builder/runtime previews.
 */
export interface CmsPreviewSnapshot {
  source: CmsPreviewSource
  locale: CmsLocale
  branding: CmsBrandingSettings
  pages: CmsPageSettings[]
  authoredContentModels: CmsAuthoredContentModelSettings[]
  authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
  reusableSections: CmsReusableSectionSettings[]
  reusableBlocks: CmsReusableBlockSettings[]
  mediaAssets: CmsMediaAssetSettings[]
  releaseId: string | null
  releaseName: string | null
  releaseEnvironment: CmsReleaseEnvironment | null
  publishedAt: string | null
}