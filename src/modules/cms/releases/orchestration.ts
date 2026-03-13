
/**
 * CMS release orchestration helpers.
 * Provides drafting, validation, promotion, scheduling, publishing, rollback and calendar diagnostics.
 */

import type {
  CmsReleaseCalendarConflict,
  CmsReleaseEntry,
  CmsReleaseEnvironment,
  CmsReleaseEnvironmentPolicy,
  CmsReleasePromotionEntry,
  CmsReleaseSettings,
  CmsReleaseSnapshot,
  CmsReleaseStatus,
  CmsReleaseValidationIssue,
  CmsReleaseValidationReport,
  CmsReleaseValidationSeverity,
  CmsWhiteLabelActorRole,
  CmsWhiteLabelSettings,
  CmsWhiteLabelWorkflowStatus,
} from '../white-label/types'
import { validateCmsContentPages } from '../white-label/content-validation'

/**
 * Persisted schema version for release settings payloads.
 */
export const CMS_RELEASE_SETTINGS_SCHEMA_VERSION = 4

/**
 * Default cap for release entries retained per tenant.
 */
export const CMS_RELEASE_DEFAULT_MAX_ENTRIES = 40

/**
 * Default cap for release promotion audit entries retained per tenant.
 */
export const CMS_RELEASE_DEFAULT_MAX_PROMOTION_AUDIT_ENTRIES = 120

/**
 * Canonical environment order used by release filters and promotion checks.
 */
export const CMS_RELEASE_ENVIRONMENTS: readonly CmsReleaseEnvironment[] = ['dev', 'staging', 'production']

const RELEASE_STATUS_VALUES: ReadonlySet<CmsReleaseStatus> = new Set([
  'draft',
  'validated',
  'scheduled',
  'published',
  'rolled_back',
  'canceled',
])

const RELEASE_WORKFLOW_STATUS_VALUES: ReadonlySet<CmsWhiteLabelWorkflowStatus> = new Set([
  'draft',
  'in_review',
  'approved',
  'scheduled',
  'published',
])

const RELEASE_ENVIRONMENT_VALUES: ReadonlySet<CmsReleaseEnvironment> = new Set(CMS_RELEASE_ENVIRONMENTS)

const WHITE_LABEL_ROLE_VALUES: ReadonlySet<CmsWhiteLabelActorRole> = new Set([
  'owner',
  'admin',
  'editor',
  'reviewer',
  'publisher',
  'viewer',
  'system',
])

const REQUIRED_MODULE_IDS = new Set(['settings', 'pages', 'blocks', 'media', 'releases'])
const PRODUCTION_READY_WORKFLOW_STATUSES = new Set<CmsWhiteLabelWorkflowStatus>([
  'approved',
  'scheduled',
  'published',
])

const DEFAULT_RELEASE_ENVIRONMENT_POLICIES: ReadonlyArray<CmsReleaseEnvironmentPolicy> = [
  {
    environment: 'dev',
    allowedAuthorRoles: ['owner', 'admin', 'editor', 'reviewer', 'publisher', 'system'],
    allowedPublisherRoles: ['owner', 'admin', 'publisher', 'system'],
    allowedRuntimeReadRoles: ['owner', 'admin', 'editor', 'reviewer', 'publisher', 'viewer', 'system'],
    promoteTo: ['staging', 'production'],
  },
  {
    environment: 'staging',
    allowedAuthorRoles: ['owner', 'admin', 'editor', 'reviewer', 'publisher', 'system'],
    allowedPublisherRoles: ['owner', 'admin', 'publisher', 'system'],
    allowedRuntimeReadRoles: ['owner', 'admin', 'editor', 'reviewer', 'publisher', 'viewer', 'system'],
    promoteTo: ['production'],
  },
  {
    environment: 'production',
    allowedAuthorRoles: ['owner', 'admin', 'publisher', 'system'],
    allowedPublisherRoles: ['owner', 'admin', 'publisher', 'system'],
    allowedRuntimeReadRoles: ['owner', 'admin', 'viewer', 'system'],
    promoteTo: [],
  },
]

function normalizeReviewPackageLocaleStatus(
  value: unknown
): 'complete' | 'partial' | 'missing' | 'empty' | 'not-applicable' {
  return value === 'complete'
    || value === 'missing'
    || value === 'empty'
    || value === 'not-applicable'
      ? value
      : 'partial'
}

function normalizeReviewAcknowledgementDecision(
  value: unknown
): 'noted' | 'approved' | 'changes_requested' {
  return value === 'approved'
    || value === 'changes_requested'
      ? value
      : 'noted'
}

type ReleaseSnapshotSource = Pick<
  CmsWhiteLabelSettings,
  | 'branding'
  | 'layout'
  | 'content'
  | 'pages'
  | 'reusableSections'
  | 'reusableBlocks'
  | 'authoredContentModels'
  | 'authoredContentModelFieldPresets'
  | 'authoredBlockPresets'
  | 'mediaAssets'
  | 'themePresetId'
  | 'themePresetOverrides'
  | 'theme'
  | 'navGroups'
  | 'items'
  | 'toolbarActions'
>

/**
 * Runtime context used to normalize release payloads.
 */
export interface CmsReleaseNormalizationContext {
  snapshot: CmsReleaseSnapshot
  workflowVersion: number
  workflowStatus: CmsWhiteLabelWorkflowStatus
}

/**
 * Generic release command result returned by orchestration operations.
 */
export interface CmsReleaseCommandResult {
  ok: boolean
  settings: CmsReleaseSettings
  error?: string
  releaseId?: string
  snapshot?: CmsReleaseSnapshot
  diagnostics?: CmsReleaseValidationIssue[]
  conflicts?: CmsReleaseCalendarConflict[]
  publishedReleaseIds?: string[]
}

/**
 * Input options for creating release drafts.
 */
export interface CmsReleaseDraftOptions {
  actorId: string
  actorRole?: CmsWhiteLabelActorRole
  at?: string
  name?: string
  summary?: string
  environment?: CmsReleaseEnvironment
}

/**
 * Input options for release pre-publish gate checks.
 */
export interface CmsReleaseGateOptions {
  actorId: string
  actorRole?: CmsWhiteLabelActorRole
  at?: string
}

/**
 * Result payload for pre-publish validation checks.
 */
export interface CmsReleaseGateResult {
  allowed: boolean
  generatedAt: string
  issues: CmsReleaseValidationIssue[]
}

/**
 * Stable identifiers for publish-review checklist rows.
 */
export type CmsReleaseCandidateChecklistItemId =
  | 'candidate_state'
  | 'validation'
  | 'workflow'
  | 'permissions'
  | 'content_integrity'
  | 'brand_assets'

/**
 * Semantic states used by the release review checklist.
 */
export type CmsReleaseCandidateChecklistStatus = 'ready' | 'warning' | 'blocking'

/**
 * One checklist row derived from release validation and publish gate data.
 */
export interface CmsReleaseCandidateChecklistItem {
  id: CmsReleaseCandidateChecklistItemId
  status: CmsReleaseCandidateChecklistStatus
  issueCount: number
  issues: CmsReleaseValidationIssue[]
  releaseStatus?: CmsReleaseStatus
  workflowStatus?: CmsWhiteLabelWorkflowStatus
  environment?: CmsReleaseEnvironment
  validationValid?: boolean
  validationGeneratedAt?: string
  scheduledAt?: string | null
  productionOnly?: boolean
}

/**
 * Aggregated checklist result used by authoring UIs before publish.
 */
export interface CmsReleaseCandidateChecklist {
  allowed: boolean
  generatedAt: string
  releaseId: string
  releaseName: string
  environment: CmsReleaseEnvironment
  items: CmsReleaseCandidateChecklistItem[]
  summary: {
    readyCount: number
    warningCount: number
    blockingCount: number
  }
}

/**
 * Converts arbitrary values into valid ISO timestamps.
 */
function toIsoTimestamp(value?: string): string {
  const parsed = new Date(String(value ?? '').trim())
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }
  return new Date().toISOString()
}

/**
 * Checks whether a timestamp string represents a valid date.
 */
function isValidTimestamp(value: string | null | undefined): boolean {
  if (!value) {
    return false
  }
  return !Number.isNaN(new Date(value).getTime())
}

/**
 * Creates a deep clone for release payloads.
 */
function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fallback for reactive proxies/non-cloneable browser values.
    }
  }
  try {
    return JSON.parse(JSON.stringify(value)) as T
  } catch {
    return value
  }
}

/**
 * Generates stable release identifiers.
 */
function buildReleaseId(seedAt: string): string {
  const timestamp = seedAt.replace(/[^0-9]/g, '').slice(0, 14) || Date.now().toString()
  const random = Math.random().toString(36).slice(2, 8)
  return `rel-${timestamp}-${random}`
}

/**
 * Normalizes persisted release status values.
 */
function normalizeReleaseStatus(value: unknown): CmsReleaseStatus {
  const normalized = String(value ?? '').trim().toLowerCase() as CmsReleaseStatus
  return RELEASE_STATUS_VALUES.has(normalized) ? normalized : 'draft'
}

/**
 * Normalizes persisted workflow status values.
 */
function normalizeWorkflowStatus(value: unknown, fallback: CmsWhiteLabelWorkflowStatus): CmsWhiteLabelWorkflowStatus {
  const normalized = String(value ?? '').trim().toLowerCase() as CmsWhiteLabelWorkflowStatus
  return RELEASE_WORKFLOW_STATUS_VALUES.has(normalized) ? normalized : fallback
}

/**
 * Normalizes persisted environment values.
 */
function normalizeEnvironment(value: unknown, fallback: CmsReleaseEnvironment): CmsReleaseEnvironment {
  const normalized = String(value ?? '').trim().toLowerCase() as CmsReleaseEnvironment
  return RELEASE_ENVIRONMENT_VALUES.has(normalized) ? normalized : fallback
}

/**
 * Normalizes persisted actor role values.
 */
function normalizeActorRole(value: unknown, fallback: CmsWhiteLabelActorRole = 'system'): CmsWhiteLabelActorRole {
  const normalized = String(value ?? '').trim().toLowerCase() as CmsWhiteLabelActorRole
  return WHITE_LABEL_ROLE_VALUES.has(normalized) ? normalized : fallback
}

/**
 * Resolves runtime actor role from explicit role or actor id compatibility fallback.
 */
function resolveActorRole(actorId: string, role?: CmsWhiteLabelActorRole): CmsWhiteLabelActorRole {
  return normalizeActorRole(role ?? actorId, 'system')
}

/**
 * Creates an empty validation report scaffold.
 */
function createEmptyValidationReport(at: string): CmsReleaseValidationReport {
  return {
    valid: false,
    generatedAt: at,
    errorCount: 0,
    warningCount: 0,
    issues: [],
  }
}

/**
 * Builds a normalized validation report from issue rows.
 */
function buildValidationReport(at: string, issues: CmsReleaseValidationIssue[]): CmsReleaseValidationReport {
  const errorCount = issues.filter(issue => issue.severity === 'error').length
  const warningCount = issues.filter(issue => issue.severity === 'warning').length
  return {
    valid: errorCount === 0,
    generatedAt: at,
    errorCount,
    warningCount,
    issues,
  }
}

/**
 * Resolves checklist status from grouped release issues.
 */
function resolveChecklistStatusFromIssues(
  issues: readonly CmsReleaseValidationIssue[]
): CmsReleaseCandidateChecklistStatus {
  if (issues.some(issue => issue.severity === 'error')) {
    return 'blocking'
  }
  if (issues.length > 0) {
    return 'warning'
  }
  return 'ready'
}

/**
 * Creates a synthetic checklist issue for publish review rows.
 */
function createSyntheticChecklistIssue(
  code: string,
  severity: CmsReleaseValidationSeverity,
  message: string,
  path?: string
): CmsReleaseValidationIssue {
  return {
    code,
    severity,
    message,
    path,
  }
}

/**
 * Builds a publish-review checklist from the current release gate diagnostics.
 */
export function buildCmsReleaseCandidateChecklist(
  settings: CmsReleaseSettings,
  releaseId: string,
  options: CmsReleaseGateOptions
): CmsReleaseCandidateChecklist | null {
  const normalizedId = String(releaseId ?? '').trim()
  const target = getCmsReleaseById(settings, normalizedId)
  if (!target) {
    return null
  }

  const gate = validateCmsReleasePrePublishGate(settings, normalizedId, options)
  const gateIssues = gate.issues
  const permissionIssues = gateIssues.filter(issue => issue.code === 'permissions.publish.denied')
  const workflowIssues = gateIssues.filter(issue => issue.code === 'workflow.status.not_ready')
  const brandAssetIssues = gateIssues.filter(issue => issue.code.startsWith('assets.'))
  const contentIssues = gateIssues.filter(issue => {
    if (permissionIssues.includes(issue) || workflowIssues.includes(issue) || brandAssetIssues.includes(issue)) {
      return false
    }
    return true
  })

  const candidateStateIssues: CmsReleaseValidationIssue[] = []
  let candidateStateStatus: CmsReleaseCandidateChecklistStatus = 'ready'
  if (target.status === 'rolled_back' || target.status === 'canceled') {
    candidateStateIssues.push(
      createSyntheticChecklistIssue(
        'release.status.not_publishable',
        'error',
        `Release status "${target.status}" cannot be published without creating a new draft.`,
        `releases.items.${target.id}.status`
      )
    )
    candidateStateStatus = 'blocking'
  } else if (target.status === 'published') {
    candidateStateIssues.push(
      createSyntheticChecklistIssue(
        'release.status.already_published',
        'warning',
        'Release is already published. Review data is informational until a new draft is created.',
        `releases.items.${target.id}.status`
      )
    )
    candidateStateStatus = 'warning'
  } else if (
    target.status === 'scheduled'
    && target.scheduledAt
    && new Date(target.scheduledAt).getTime() > new Date(gate.generatedAt).getTime()
  ) {
    candidateStateIssues.push(
      createSyntheticChecklistIssue(
        'release.status.scheduled_future',
        'warning',
        'Release is scheduled for a future date and cannot be published early.',
        `releases.items.${target.id}.scheduledAt`
      )
    )
    candidateStateStatus = 'warning'
  }

  const validationIssues: CmsReleaseValidationIssue[] = target.validation.valid
    ? []
    : [...target.validation.issues]
  let validationStatus: CmsReleaseCandidateChecklistStatus = 'ready'
  if (!target.validation.valid) {
    if (validationIssues.length === 0) {
      validationIssues.push(
        createSyntheticChecklistIssue(
          'release.validation.required',
          'error',
          'Run validation on this draft before publishing.',
          `releases.items.${target.id}.validation`
        )
      )
    }
    validationStatus = 'blocking'
  }

  const items: CmsReleaseCandidateChecklistItem[] = [
    {
      id: 'candidate_state',
      status: candidateStateStatus,
      issueCount: candidateStateIssues.length,
      issues: candidateStateIssues,
      releaseStatus: target.status,
      environment: target.environment,
      scheduledAt: target.scheduledAt,
    },
    {
      id: 'validation',
      status: validationStatus,
      issueCount: validationIssues.length,
      issues: validationIssues,
      validationValid: target.validation.valid,
      validationGeneratedAt: target.validation.generatedAt,
    },
    {
      id: 'workflow',
      status: resolveChecklistStatusFromIssues(workflowIssues),
      issueCount: workflowIssues.length,
      issues: workflowIssues,
      workflowStatus: target.sourceWorkflowStatus,
    },
    {
      id: 'permissions',
      status: resolveChecklistStatusFromIssues(permissionIssues),
      issueCount: permissionIssues.length,
      issues: permissionIssues,
      environment: target.environment,
    },
    {
      id: 'content_integrity',
      status: resolveChecklistStatusFromIssues(contentIssues),
      issueCount: contentIssues.length,
      issues: contentIssues,
    },
    {
      id: 'brand_assets',
      status: target.environment === 'production'
        ? resolveChecklistStatusFromIssues(brandAssetIssues)
        : 'ready',
      issueCount: brandAssetIssues.length,
      issues: brandAssetIssues,
      environment: target.environment,
      productionOnly: true,
    },
  ]

  const summary = items.reduce(
    (accumulator, item) => {
      if (item.status === 'ready') {
        accumulator.readyCount += 1
      } else if (item.status === 'warning') {
        accumulator.warningCount += 1
      } else {
        accumulator.blockingCount += 1
      }
      return accumulator
    },
    {
      readyCount: 0,
      warningCount: 0,
      blockingCount: 0,
    }
  )

  return {
    allowed: gate.allowed,
    generatedAt: gate.generatedAt,
    releaseId: target.id,
    releaseName: target.name,
    environment: target.environment,
    items,
    summary,
  }
}

/**
 * Indicates whether release engine should enforce environment/role guards internally.
 * When disabled, authorization is expected to be handled by the host application layer.
 */
function shouldEnforceEnvironmentPolicies(settings: CmsReleaseSettings): boolean {
  return settings.enforceEnvironmentPolicies === true
}

/**
 * Normalizes persisted validation reports.
 */
function normalizeValidationReport(
  value: unknown,
  at: string,
  snapshot: CmsReleaseSnapshot
): CmsReleaseValidationReport {
  if (!value || typeof value !== 'object') {
    return validateCmsReleaseSnapshot(snapshot, at)
  }

  const report = value as Partial<CmsReleaseValidationReport>
  const issues = Array.isArray(report.issues)
    ? report.issues
      .filter((issue): issue is CmsReleaseValidationIssue => Boolean(issue && typeof issue === 'object'))
      .map((issue): CmsReleaseValidationIssue => ({
        code: String(issue.code ?? '').trim() || 'release.validation.unknown',
        severity: issue.severity === 'warning' ? 'warning' : 'error',
        message: String(issue.message ?? '').trim() || 'Validation issue detected.',
        path: issue.path ? String(issue.path).trim() : undefined,
      }))
    : []

  return buildValidationReport(
    isValidTimestamp(report.generatedAt ?? '') ? toIsoTimestamp(report.generatedAt) : at,
    issues
  )
}

/**
 * Creates default environment policies for release authoring/publishing boundaries.
 */
export function createDefaultCmsReleaseEnvironmentPolicies(): CmsReleaseEnvironmentPolicy[] {
  return DEFAULT_RELEASE_ENVIRONMENT_POLICIES.map(policy => ({
    environment: policy.environment,
    allowedAuthorRoles: [...policy.allowedAuthorRoles],
    allowedPublisherRoles: [...policy.allowedPublisherRoles],
    allowedRuntimeReadRoles: [...policy.allowedRuntimeReadRoles],
    promoteTo: [...policy.promoteTo],
  }))
}

/**
 * Normalizes role arrays against known role ids.
 */
function normalizeRoleList(
  roles: unknown,
  fallback: readonly CmsWhiteLabelActorRole[]
): CmsWhiteLabelActorRole[] {
  if (!Array.isArray(roles)) {
    return [...fallback]
  }

  const normalized = roles
    .map(role => normalizeActorRole(role, 'viewer'))
    .filter((role, index, list) => list.indexOf(role) === index)

  return normalized.length > 0 ? normalized : [...fallback]
}

/**
 * Normalizes environment arrays against known environment ids.
 */
function normalizeEnvironmentList(
  environments: unknown,
  fallback: readonly CmsReleaseEnvironment[]
): CmsReleaseEnvironment[] {
  if (!Array.isArray(environments)) {
    return [...fallback]
  }

  const normalized = environments
    .map(environment => normalizeEnvironment(environment, 'dev'))
    .filter((environment, index, list) => list.indexOf(environment) === index)

  return normalized.length > 0 ? normalized : [...fallback]
}

/**
 * Normalizes persisted environment policies and merges missing defaults.
 */
function normalizeEnvironmentPolicies(value: unknown): CmsReleaseEnvironmentPolicy[] {
  const defaults = createDefaultCmsReleaseEnvironmentPolicies()
  const normalizedByEnvironment = new Map<CmsReleaseEnvironment, CmsReleaseEnvironmentPolicy>(
    defaults.map(policy => [policy.environment, policy])
  )

  if (Array.isArray(value)) {
    for (const rawPolicy of value) {
      if (!rawPolicy || typeof rawPolicy !== 'object') {
        continue
      }

      const environment = normalizeEnvironment((rawPolicy as { environment?: unknown }).environment, 'dev')
      const defaultPolicy = normalizedByEnvironment.get(environment)
      if (!defaultPolicy) {
        continue
      }

      normalizedByEnvironment.set(environment, {
        environment,
        allowedAuthorRoles: normalizeRoleList(
          (rawPolicy as { allowedAuthorRoles?: unknown }).allowedAuthorRoles,
          defaultPolicy.allowedAuthorRoles
        ),
        allowedPublisherRoles: normalizeRoleList(
          (rawPolicy as { allowedPublisherRoles?: unknown }).allowedPublisherRoles,
          defaultPolicy.allowedPublisherRoles
        ),
        allowedRuntimeReadRoles: normalizeRoleList(
          (rawPolicy as { allowedRuntimeReadRoles?: unknown }).allowedRuntimeReadRoles,
          defaultPolicy.allowedRuntimeReadRoles
        ),
        promoteTo: normalizeEnvironmentList(
          (rawPolicy as { promoteTo?: unknown }).promoteTo,
          defaultPolicy.promoteTo
        ).filter(target => target !== environment),
      })
    }
  }

  return CMS_RELEASE_ENVIRONMENTS.map(environment => {
    return normalizedByEnvironment.get(environment) ?? defaults.find(policy => policy.environment === environment)!
  })
}

/**
 * Resolves one environment policy from persisted settings.
 */
export function getCmsReleaseEnvironmentPolicy(
  settings: CmsReleaseSettings,
  environment: CmsReleaseEnvironment
): CmsReleaseEnvironmentPolicy {
  const policies = settings.environmentPolicies?.length
    ? settings.environmentPolicies
    : createDefaultCmsReleaseEnvironmentPolicies()
  return policies.find(policy => policy.environment === environment)
    ?? createDefaultCmsReleaseEnvironmentPolicies().find(policy => policy.environment === environment)!
}

/**
 * Checks whether actor role can author releases in the target environment.
 */
export function canAuthorReleaseInEnvironment(
  settings: CmsReleaseSettings,
  role: CmsWhiteLabelActorRole,
  environment: CmsReleaseEnvironment
): boolean {
  if (!shouldEnforceEnvironmentPolicies(settings)) {
    return true
  }
  const policy = getCmsReleaseEnvironmentPolicy(settings, environment)
  return policy.allowedAuthorRoles.includes(role)
}

/**
 * Checks whether actor role can publish/schedule/rollback releases in the target environment.
 */
export function canPublishReleaseInEnvironment(
  settings: CmsReleaseSettings,
  role: CmsWhiteLabelActorRole,
  environment: CmsReleaseEnvironment
): boolean {
  if (!shouldEnforceEnvironmentPolicies(settings)) {
    return true
  }
  const policy = getCmsReleaseEnvironmentPolicy(settings, environment)
  return policy.allowedPublisherRoles.includes(role)
}

/**
 * Checks whether actor role can read published runtime content for one environment.
 */
export function canReadReleaseEnvironment(
  settings: CmsReleaseSettings,
  role: CmsWhiteLabelActorRole,
  environment: CmsReleaseEnvironment
): boolean {
  if (!shouldEnforceEnvironmentPolicies(settings)) {
    return true
  }
  const policy = getCmsReleaseEnvironmentPolicy(settings, environment)
  return policy.allowedRuntimeReadRoles.includes(role)
}

/**
 * Checks whether actor role can promote releases between two environments.
 */
export function canPromoteReleaseBetweenEnvironments(
  settings: CmsReleaseSettings,
  role: CmsWhiteLabelActorRole,
  fromEnvironment: CmsReleaseEnvironment,
  toEnvironment: CmsReleaseEnvironment
): boolean {
  if (!shouldEnforceEnvironmentPolicies(settings)) {
    return true
  }
  const sourcePolicy = getCmsReleaseEnvironmentPolicy(settings, fromEnvironment)
  if (!sourcePolicy.promoteTo.includes(toEnvironment)) {
    return false
  }

  return canPublishReleaseInEnvironment(settings, role, toEnvironment)
    && canReadReleaseEnvironment(settings, role, fromEnvironment)
}

/**
 * Validates release snapshots and emits actionable diagnostics.
 */
export function validateCmsReleaseSnapshot(snapshot: CmsReleaseSnapshot, at?: string): CmsReleaseValidationReport {
  const generatedAt = toIsoTimestamp(at)
  const issues: CmsReleaseValidationIssue[] = []

  if (String(snapshot.branding.appName ?? '').trim().length === 0) {
    issues.push({
      code: 'branding.app_name.required',
      severity: 'error',
      message: 'Product name cannot be empty.',
      path: 'branding.appName',
    })
  }

  if (String(snapshot.branding.brandLogo ?? '').trim().length === 0) {
    issues.push({
      code: 'branding.logo.required',
      severity: 'warning',
      message: 'Brand logo is empty; preview and runtime identity may be degraded.',
      path: 'branding.brandLogo',
    })
  }

  if (String(snapshot.branding.faviconUrl ?? '').trim().length === 0) {
    issues.push({
      code: 'branding.favicon.required',
      severity: 'warning',
      message: 'Favicon URL is empty; browsers may show default favicon.',
      path: 'branding.faviconUrl',
    })
  }

  const contentValidation = validateCmsContentPages({
    pages: snapshot.pages,
    authoredContentModels: snapshot.authoredContentModels,
    authoredBlockPresets: snapshot.authoredBlockPresets,
    mediaAssets: snapshot.mediaAssets,
    reusableSections: snapshot.reusableSections,
    reusableBlocks: snapshot.reusableBlocks,
  })
  issues.push(...contentValidation.issues.map(issue => ({
    code: issue.code,
    severity: issue.severity,
    message: issue.message,
    path: issue.path,
  })))

  const moduleIds = new Set(snapshot.items.map(item => String(item.id ?? '').trim()))
  for (const requiredModuleId of REQUIRED_MODULE_IDS) {
    if (!moduleIds.has(requiredModuleId)) {
      issues.push({
        code: 'shell.module.required',
        severity: 'error',
        message: `Required CMS module "${requiredModuleId}" is missing from sidebar items.`,
        path: 'items',
      })
    }
  }

  const groupIds = new Set(snapshot.navGroups.map(group => String(group.id ?? '').trim()))
  for (const item of snapshot.items) {
    if (!groupIds.has(String(item.group ?? '').trim())) {
      issues.push({
        code: 'shell.group.missing',
        severity: 'warning',
        message: `Sidebar item "${item.id}" references missing group "${item.group}".`,
        path: `items.${item.id}.group`,
      })
    }
  }

  return buildValidationReport(generatedAt, issues)
}

/**
 * Creates a stable release snapshot from tenant white-label settings.
 */
export function createCmsReleaseSnapshot(settings: ReleaseSnapshotSource): CmsReleaseSnapshot {
  return {
    branding: cloneValue(settings.branding),
    layout: cloneValue(settings.layout),
    content: cloneValue(settings.content),
    pages: cloneValue(settings.pages),
    reusableSections: cloneValue(settings.reusableSections),
    reusableBlocks: cloneValue(settings.reusableBlocks),
    authoredContentModels: cloneValue(settings.authoredContentModels),
    authoredContentModelFieldPresets: cloneValue(settings.authoredContentModelFieldPresets),
    authoredBlockPresets: cloneValue(settings.authoredBlockPresets),
    mediaAssets: cloneValue(settings.mediaAssets),
    themePresetId: settings.themePresetId,
    themePresetOverrides: cloneValue(settings.themePresetOverrides),
    theme: cloneValue(settings.theme),
    navGroups: cloneValue(settings.navGroups),
    items: cloneValue(settings.items),
    toolbarActions: cloneValue(settings.toolbarActions),
  }
}

/**
 * Applies a release snapshot into current settings while preserving governance/releases envelopes.
 */
export function applyCmsReleaseSnapshot(settings: CmsWhiteLabelSettings, snapshot: CmsReleaseSnapshot): CmsWhiteLabelSettings {
  return {
    ...settings,
    branding: cloneValue(snapshot.branding),
    layout: cloneValue(snapshot.layout),
    content: cloneValue(snapshot.content),
    pages: cloneValue(snapshot.pages),
    reusableSections: cloneValue(snapshot.reusableSections),
    reusableBlocks: cloneValue(snapshot.reusableBlocks),
    authoredContentModels: cloneValue(snapshot.authoredContentModels),
    authoredContentModelFieldPresets: cloneValue(snapshot.authoredContentModelFieldPresets),
    authoredBlockPresets: cloneValue(snapshot.authoredBlockPresets),
    mediaAssets: cloneValue(snapshot.mediaAssets),
    themePresetId: snapshot.themePresetId,
    themePresetOverrides: cloneValue(snapshot.themePresetOverrides),
    theme: cloneValue(snapshot.theme),
    navGroups: cloneValue(snapshot.navGroups),
    items: cloneValue(snapshot.items),
    toolbarActions: cloneValue(snapshot.toolbarActions),
  }
}

/**
 * Creates a clean default release container.
 */
export function createDefaultCmsReleaseSettings(): CmsReleaseSettings {
  return {
    schemaVersion: CMS_RELEASE_SETTINGS_SCHEMA_VERSION,
    maxEntries: CMS_RELEASE_DEFAULT_MAX_ENTRIES,
    activeReleaseId: null,
    activeEnvironment: 'dev',
    enforceEnvironmentPolicies: false,
    environmentPolicies: createDefaultCmsReleaseEnvironmentPolicies(),
    promotions: [],
    reviewPackages: [],
    reviewAcknowledgements: [],
    items: [],
  }
}

/**
 * Enforces release history cap while keeping ordering deterministic.
 */
function enforceReleaseCap(items: CmsReleaseEntry[], maxEntries: number): CmsReleaseEntry[] {
  const safeMax = Number.isFinite(maxEntries) && maxEntries > 0
    ? Math.floor(maxEntries)
    : CMS_RELEASE_DEFAULT_MAX_ENTRIES
  return items.slice(0, safeMax)
}

/**
 * Enforces promotion audit history cap while keeping ordering deterministic.
 */
function enforcePromotionCap(entries: CmsReleasePromotionEntry[]): CmsReleasePromotionEntry[] {
  return entries.slice(0, CMS_RELEASE_DEFAULT_MAX_PROMOTION_AUDIT_ENTRIES)
}

/**
 * Gets a release entry by id.
 */
export function getCmsReleaseById(settings: CmsReleaseSettings, releaseId: string): CmsReleaseEntry | null {
  const normalizedId = String(releaseId ?? '').trim()
  if (!normalizedId) {
    return null
  }
  return settings.items.find(item => item.id === normalizedId) ?? null
}

/**
 * Builds release calendar conflict diagnostics (overlaps, invalid transitions and stale drafts).
 */
export function detectCmsReleaseCalendarConflicts(
  settings: CmsReleaseSettings,
  now?: string
): CmsReleaseCalendarConflict[] {
  const generatedAt = toIsoTimestamp(now)
  const nowTime = new Date(generatedAt).getTime()
  const conflicts: CmsReleaseCalendarConflict[] = []

  const scheduledBySlot = new Map<string, CmsReleaseEntry[]>()
  for (const release of settings.items) {
    if (release.status !== 'scheduled' || !release.scheduledAt || !isValidTimestamp(release.scheduledAt)) {
      continue
    }

    const slotKey = `${release.environment}|${release.scheduledAt}`
    const list = scheduledBySlot.get(slotKey) ?? []
    list.push(release)
    scheduledBySlot.set(slotKey, list)
  }

  for (const [slotKey, releases] of scheduledBySlot.entries()) {
    if (releases.length < 2) {
      continue
    }

    const [environment = 'dev', at = generatedAt] = slotKey.split('|')
    conflicts.push({
      id: `conflict-${slotKey}`,
      type: 'schedule_overlap',
      severity: 'error',
      message: `Scheduled overlap detected (${releases.length} releases) for ${environment} at ${at}.`,
      environment: normalizeEnvironment(environment, 'dev'),
      releaseIds: releases.map(release => release.id),
      at,
    })
  }

  for (const release of settings.items) {
    if (release.status === 'scheduled' && !PRODUCTION_READY_WORKFLOW_STATUSES.has(release.sourceWorkflowStatus)) {
      conflicts.push({
        id: `conflict-transition-${release.id}`,
        type: 'invalid_transition',
        severity: 'warning',
        message: `Release "${release.name}" is scheduled without approved workflow status.`,
        environment: release.environment,
        releaseIds: [release.id],
        at: release.updatedAt,
      })
    }

    if (release.status === 'draft') {
      const createdAt = new Date(release.createdAt).getTime()
      if (Number.isFinite(createdAt) && nowTime - createdAt > (1000 * 60 * 60 * 24 * 14)) {
        conflicts.push({
          id: `conflict-stale-${release.id}`,
          type: 'stale_draft',
          severity: 'warning',
          message: `Release "${release.name}" has stayed in draft for over 14 days.`,
          environment: release.environment,
          releaseIds: [release.id],
          at: release.createdAt,
        })
      }
    }
  }

  return conflicts
}

/**
 * Evaluates publish gate checks (permissions, workflow readiness, schema/references/assets).
 */
export function validateCmsReleasePrePublishGate(
  settings: CmsReleaseSettings,
  releaseId: string,
  options: CmsReleaseGateOptions
): CmsReleaseGateResult {
  const generatedAt = toIsoTimestamp(options.at)
  const issues: CmsReleaseValidationIssue[] = []

  const target = getCmsReleaseById(settings, releaseId)
  if (!target) {
    issues.push({
      code: 'release.not_found',
      severity: 'error',
      message: 'Release not found.',
      path: 'releases.items',
    })
    return {
      allowed: false,
      generatedAt,
      issues,
    }
  }

  const actorRole = resolveActorRole(options.actorId, options.actorRole)
  if (!canPublishReleaseInEnvironment(settings, actorRole, target.environment)) {
    issues.push({
      code: 'permissions.publish.denied',
      severity: 'error',
      message: `Role "${actorRole}" cannot publish releases in environment "${target.environment}".`,
      path: 'releases.environmentPolicies',
    })
  }

  if (!PRODUCTION_READY_WORKFLOW_STATUSES.has(target.sourceWorkflowStatus)) {
    issues.push({
      code: 'workflow.status.not_ready',
      severity: target.environment === 'production' ? 'error' : 'warning',
      message: `Workflow status "${target.sourceWorkflowStatus}" is not production-ready for publish gate.`,
      path: `releases.items.${target.id}.sourceWorkflowStatus`,
    })
  }

  const snapshotReport = validateCmsReleaseSnapshot(target.snapshot, generatedAt)
  issues.push(...snapshotReport.issues)

  if (target.environment === 'production') {
    if (!String(target.snapshot.branding.brandLogo ?? '').trim()) {
      issues.push({
        code: 'assets.logo.required',
        severity: 'error',
        message: 'Production release requires a brand logo URL.',
        path: 'branding.brandLogo',
      })
    }

    if (!String(target.snapshot.branding.faviconUrl ?? '').trim()) {
      issues.push({
        code: 'assets.favicon.required',
        severity: 'error',
        message: 'Production release requires a favicon URL.',
        path: 'branding.faviconUrl',
      })
    }
  }

  const hasErrors = issues.some(issue => issue.severity === 'error')
  return {
    allowed: !hasErrors,
    generatedAt,
    issues,
  }
}

/**
 * Normalizes persisted release payloads against schema defaults.
 */
export function normalizeCmsReleaseSettings(
  parsed: Partial<CmsReleaseSettings> | null | undefined,
  context: CmsReleaseNormalizationContext
): CmsReleaseSettings {
  const defaults = createDefaultCmsReleaseSettings()
  if (!parsed || typeof parsed !== 'object') {
    return defaults
  }

  const parsedSchemaVersion = Number.parseInt(String(parsed.schemaVersion ?? ''), 10)
  if (Number.isFinite(parsedSchemaVersion) && parsedSchemaVersion > CMS_RELEASE_SETTINGS_SCHEMA_VERSION) {
    return defaults
  }

  const maxEntries = Number.parseInt(String(parsed.maxEntries ?? ''), 10)
  const safeMaxEntries = Number.isFinite(maxEntries) && maxEntries > 0
    ? maxEntries
    : defaults.maxEntries

  const activeEnvironment = normalizeEnvironment(parsed.activeEnvironment, defaults.activeEnvironment)
  const enforceEnvironmentPolicies = parsed.enforceEnvironmentPolicies === true
  const environmentPolicies = normalizeEnvironmentPolicies(parsed.environmentPolicies)

  const rawItems = Array.isArray(parsed.items) ? (parsed.items as unknown[]) : []
  const normalizedItems: CmsReleaseEntry[] = rawItems
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
    .map((rawEntry, index) => {
      const entry = rawEntry as Partial<CmsReleaseEntry>
      const createdAt = toIsoTimestamp(entry.createdAt)
      const updatedAt = toIsoTimestamp(entry.updatedAt ?? createdAt)
      const snapshot = entry.snapshot && typeof entry.snapshot === 'object'
        ? cloneValue(entry.snapshot as CmsReleaseSnapshot)
        : cloneValue(context.snapshot)
      const generatedValidationAt = toIsoTimestamp(entry.validation?.generatedAt ?? updatedAt)
      const normalizedValidation = normalizeValidationReport(entry.validation, generatedValidationAt, snapshot)
      const environment = normalizeEnvironment(entry.environment, activeEnvironment)

      return {
        id: String(entry.id ?? '').trim() || `rel-legacy-${index + 1}`,
        name: String(entry.name ?? '').trim() || `Legacy Release ${index + 1}`,
        summary: String(entry.summary ?? '').trim() || 'Migrated legacy release snapshot.',
        status: normalizeReleaseStatus(entry.status),
        environment,
        sourceVersion: Number.isFinite(entry.sourceVersion) && Number(entry.sourceVersion) > 0
          ? Math.floor(Number(entry.sourceVersion))
          : Math.max(1, Math.floor(context.workflowVersion || 1)),
        sourceWorkflowStatus: normalizeWorkflowStatus(entry.sourceWorkflowStatus, context.workflowStatus),
        createdAt,
        createdBy: String(entry.createdBy ?? 'system').trim() || 'system',
        updatedAt,
        updatedBy: String(entry.updatedBy ?? 'system').trim() || 'system',
        scheduledAt: isValidTimestamp(entry.scheduledAt) ? toIsoTimestamp(entry.scheduledAt ?? undefined) : null,
        publishedAt: isValidTimestamp(entry.publishedAt) ? toIsoTimestamp(String(entry.publishedAt ?? '')) : null,
        rolledBackAt: isValidTimestamp(entry.rolledBackAt) ? toIsoTimestamp(entry.rolledBackAt ?? undefined) : null,
        rollbackTargetReleaseId: String(entry.rollbackTargetReleaseId ?? '').trim() || null,
        validation: normalizedValidation,
        snapshot,
      }
    })

  const items = enforceReleaseCap(normalizedItems, safeMaxEntries)
  const activeReleaseId = String(parsed.activeReleaseId ?? '').trim()
  const normalizedActiveReleaseId = items.some(item => item.id === activeReleaseId)
    ? activeReleaseId
    : (items[0]?.id ?? null)

  const promotions = Array.isArray(parsed.promotions)
    ? enforcePromotionCap(
      parsed.promotions
        .map((rawEntry, index): CmsReleasePromotionEntry => {
          const entry = (rawEntry ?? {}) as Partial<CmsReleasePromotionEntry> & Record<string, unknown>
          const sourceEnvironment = normalizeEnvironment(entry.sourceEnvironment, 'dev')
          const targetEnvironment = normalizeEnvironment(entry.targetEnvironment, 'staging')
          return {
            id: String(entry.id ?? '').trim() || `promotion-${index + 1}`,
            releaseId: String(entry.releaseId ?? '').trim() || 'unknown',
            sourceEnvironment,
            targetEnvironment,
            status: String(entry.status ?? '').trim() === 'blocked' ? 'blocked' : 'promoted',
            at: toIsoTimestamp(String(entry.at ?? '')),
            by: String(entry.by ?? 'system').trim() || 'system',
            byRole: normalizeActorRole(entry.byRole, 'system'),
            reason: String(entry.reason ?? '').trim() || undefined,
          }
        })
    )
    : []

  const rawReviewPackages = Array.isArray(parsed.reviewPackages)
    ? (parsed.reviewPackages as unknown[])
    : []

  const reviewPackages = rawReviewPackages
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
    .map((entry, index) => ({
        id: String(entry.id ?? '').trim() || `review-package-${index + 1}`,
        exportedAt: toIsoTimestamp(String(entry.exportedAt ?? '')),
        fileName: String(entry.fileName ?? '').trim() || `ntk-cms-review-${index + 1}.json`,
        releaseId: String(entry.releaseId ?? '').trim() || 'unknown',
        releaseName: String(entry.releaseName ?? '').trim() || `Release ${index + 1}`,
        environment: normalizeEnvironment(String(entry.environment ?? ''), activeEnvironment),
        publishedAt:
          isValidTimestamp(typeof entry.publishedAt === 'string' ? entry.publishedAt : null)
            ? toIsoTimestamp(String(entry.publishedAt ?? ''))
            : null,
        hasChanges: entry.hasChanges !== false,
        changedPages: Math.max(0, Number.parseInt(String(entry.changedPages ?? '0'), 10) || 0),
        changedSections: Math.max(0, Number.parseInt(String(entry.changedSections ?? '0'), 10) || 0),
        changedBlocks: Math.max(0, Number.parseInt(String(entry.changedBlocks ?? '0'), 10) || 0),
        localeCoverage: Array.isArray(entry.localeCoverage)
          ? (entry.localeCoverage as unknown[])
            .filter((localeEntry): localeEntry is Record<string, unknown> => Boolean(localeEntry && typeof localeEntry === 'object'))
            .map(localeEntry => ({
              locale: String(localeEntry.locale ?? '').trim() || 'en',
              status: normalizeReviewPackageLocaleStatus(String(localeEntry.status ?? '')),
              percentage: Math.max(0, Math.min(100, Number.parseInt(String(localeEntry.percentage ?? '0'), 10) || 0)),
              missing: Math.max(0, Number.parseInt(String(localeEntry.missing ?? '0'), 10) || 0),
            }))
          : [],
        checklistAllowed: entry.checklistAllowed !== false,
        checklistReadyCount: Math.max(0, Number.parseInt(String(entry.checklistReadyCount ?? '0'), 10) || 0),
        checklistWarningCount: Math.max(0, Number.parseInt(String(entry.checklistWarningCount ?? '0'), 10) || 0),
        checklistBlockingCount: Math.max(0, Number.parseInt(String(entry.checklistBlockingCount ?? '0'), 10) || 0),
      }))
    .slice(0, 20)

  const rawReviewAcknowledgements = Array.isArray(parsed.reviewAcknowledgements)
    ? (parsed.reviewAcknowledgements as unknown[])
    : []

  const reviewAcknowledgements = rawReviewAcknowledgements
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
    .map((entry, index) => ({
      id: String(entry.id ?? '').trim() || `review-ack-${index + 1}`,
      releaseId: String(entry.releaseId ?? '').trim() || 'unknown',
      releaseName: String(entry.releaseName ?? '').trim() || `Release ${index + 1}`,
      environment: normalizeEnvironment(String(entry.environment ?? ''), activeEnvironment),
      decision: normalizeReviewAcknowledgementDecision(entry.decision),
      note: String(entry.note ?? '').trim() || null,
      acknowledgedAt: toIsoTimestamp(String(entry.acknowledgedAt ?? '')),
      actorId: String(entry.actorId ?? 'system').trim() || 'system',
      actorRole: normalizeActorRole(entry.actorRole, 'system'),
      actorName: String(entry.actorName ?? '').trim() || null,
    }))
    .slice(0, 50)

  return {
    schemaVersion: CMS_RELEASE_SETTINGS_SCHEMA_VERSION,
    maxEntries: safeMaxEntries,
    activeReleaseId: normalizedActiveReleaseId,
    activeEnvironment,
    enforceEnvironmentPolicies,
    environmentPolicies,
    promotions,
    reviewPackages,
    reviewAcknowledgements,
    items,
  }
}

/**
 * Creates a draft release from the current tenant snapshot.
 */
export function createCmsReleaseDraft(
  settings: CmsReleaseSettings,
  context: CmsReleaseNormalizationContext,
  options: CmsReleaseDraftOptions
): CmsReleaseCommandResult {
  const at = toIsoTimestamp(options.at)
  const actorId = String(options.actorId ?? '').trim() || 'system'
  const actorRole = resolveActorRole(actorId, options.actorRole)
  const targetEnvironment = normalizeEnvironment(options.environment, settings.activeEnvironment)

  if (!canAuthorReleaseInEnvironment(settings, actorRole, targetEnvironment)) {
    const issue: CmsReleaseValidationIssue = {
      code: 'permissions.author.denied',
      severity: 'error',
      message: `Role "${actorRole}" cannot author releases in environment "${targetEnvironment}".`,
      path: 'releases.environmentPolicies',
    }
    return {
      ok: false,
      error: issue.message,
      diagnostics: [issue],
      settings,
    }
  }

  const id = buildReleaseId(at)
  const version = Number.isFinite(context.workflowVersion) && context.workflowVersion > 0
    ? Math.floor(context.workflowVersion)
    : 1
  const name = String(options.name ?? '').trim() || `Release v${version}`
  const summary = String(options.summary ?? '').trim() || `Snapshot generated from workflow version ${version}.`
  const snapshot = createCmsReleaseSnapshot(context.snapshot)
  const validation = createEmptyValidationReport(at)

  const nextEntry: CmsReleaseEntry = {
    id,
    name,
    summary,
    status: 'draft',
    environment: targetEnvironment,
    sourceVersion: version,
    sourceWorkflowStatus: normalizeWorkflowStatus(context.workflowStatus, 'draft'),
    createdAt: at,
    createdBy: actorId,
    updatedAt: at,
    updatedBy: actorId,
    scheduledAt: null,
    publishedAt: null,
    rolledBackAt: null,
    rollbackTargetReleaseId: null,
    validation,
    snapshot,
  }

  const nextSettings: CmsReleaseSettings = {
    ...settings,
    schemaVersion: CMS_RELEASE_SETTINGS_SCHEMA_VERSION,
    activeReleaseId: nextEntry.id,
    activeEnvironment: targetEnvironment,
    environmentPolicies: normalizeEnvironmentPolicies(settings.environmentPolicies),
    promotions: enforcePromotionCap(settings.promotions ?? []),
    items: enforceReleaseCap([nextEntry, ...settings.items], settings.maxEntries),
  }

  return {
    ok: true,
    settings: nextSettings,
    releaseId: nextEntry.id,
  }
}

/**
 * Validates an existing release snapshot and updates its lifecycle state.
 */
export function validateCmsRelease(
  settings: CmsReleaseSettings,
  releaseId: string,
  actorId: string,
  at?: string,
  actorRole?: CmsWhiteLabelActorRole
): CmsReleaseCommandResult {
  const normalizedId = String(releaseId ?? '').trim()
  const target = getCmsReleaseById(settings, normalizedId)
  if (!target) {
    return {
      ok: false,
      error: 'Release not found.',
      settings,
    }
  }

  const role = resolveActorRole(actorId, actorRole)
  if (!canAuthorReleaseInEnvironment(settings, role, target.environment)) {
    const issue: CmsReleaseValidationIssue = {
      code: 'permissions.author.denied',
      severity: 'error',
      message: `Role "${role}" cannot validate releases in environment "${target.environment}".`,
      path: `releases.items.${target.id}`,
    }
    return {
      ok: false,
      error: issue.message,
      diagnostics: [issue],
      settings,
      releaseId: normalizedId,
    }
  }

  const timestamp = toIsoTimestamp(at)
  const validation = validateCmsReleaseSnapshot(target.snapshot, timestamp)
  const nextStatus: CmsReleaseStatus = validation.valid ? 'validated' : 'draft'
  const nextActorId = String(actorId ?? '').trim() || 'system'

  const nextSettings: CmsReleaseSettings = {
    ...settings,
    activeReleaseId: normalizedId,
    activeEnvironment: target.environment,
    items: settings.items.map(item => {
      if (item.id !== normalizedId) {
        return item
      }
      return {
        ...item,
        status: nextStatus,
        validation,
        updatedAt: timestamp,
        updatedBy: nextActorId,
      }
    }),
  }

  if (!validation.valid) {
    return {
      ok: false,
      error: 'Release validation failed. Resolve errors before scheduling or publishing.',
      settings: nextSettings,
      diagnostics: validation.issues,
      releaseId: normalizedId,
    }
  }

  return {
    ok: true,
    settings: nextSettings,
    releaseId: normalizedId,
  }
}

/**
 * Schedules a validated release for future publication.
 */
export function scheduleCmsRelease(
  settings: CmsReleaseSettings,
  releaseId: string,
  scheduledAt: string,
  actorId: string,
  at?: string,
  actorRole?: CmsWhiteLabelActorRole
): CmsReleaseCommandResult {
  const normalizedId = String(releaseId ?? '').trim()
  const target = getCmsReleaseById(settings, normalizedId)
  if (!target) {
    return {
      ok: false,
      error: 'Release not found.',
      settings,
    }
  }

  const role = resolveActorRole(actorId, actorRole)
  if (!canPublishReleaseInEnvironment(settings, role, target.environment)) {
    const issue: CmsReleaseValidationIssue = {
      code: 'permissions.schedule.denied',
      severity: 'error',
      message: `Role "${role}" cannot schedule releases in environment "${target.environment}".`,
      path: `releases.items.${target.id}`,
    }
    return {
      ok: false,
      error: issue.message,
      diagnostics: [issue],
      settings,
      releaseId: normalizedId,
    }
  }

  if (!target.validation.valid) {
    return {
      ok: false,
      error: 'Release must be valid before scheduling.',
      diagnostics: target.validation.issues,
      settings,
      releaseId: normalizedId,
    }
  }

  const timestamp = toIsoTimestamp(at)
  const gate = validateCmsReleasePrePublishGate(settings, normalizedId, {
    actorId,
    actorRole: role,
    at: timestamp,
  })
  if (!gate.allowed) {
    return {
      ok: false,
      error: 'Release failed pre-publish gate. Resolve diagnostics before scheduling.',
      diagnostics: gate.issues,
      settings,
      releaseId: normalizedId,
    }
  }

  const scheduledIso = toIsoTimestamp(scheduledAt)
  const now = new Date(timestamp).getTime()
  const scheduledTime = new Date(scheduledIso).getTime()
  if (scheduledTime <= now) {
    return {
      ok: false,
      error: 'Scheduled date must be in the future.',
      settings,
      releaseId: normalizedId,
    }
  }

  const nextActorId = String(actorId ?? '').trim() || 'system'
  const nextSettings: CmsReleaseSettings = {
    ...settings,
    activeReleaseId: normalizedId,
    activeEnvironment: target.environment,
    items: settings.items.map(item => {
      if (item.id !== normalizedId) {
        return item
      }
      return {
        ...item,
        status: 'scheduled',
        sourceWorkflowStatus: item.sourceWorkflowStatus === 'approved'
          ? 'scheduled'
          : item.sourceWorkflowStatus,
        scheduledAt: scheduledIso,
        updatedAt: timestamp,
        updatedBy: nextActorId,
      }
    }),
  }

  return {
    ok: true,
    settings: nextSettings,
    releaseId: normalizedId,
    conflicts: detectCmsReleaseCalendarConflicts(nextSettings, timestamp),
  }
}

/**
 * Publishes a release immediately and returns its snapshot for runtime apply.
 */
export function publishCmsRelease(
  settings: CmsReleaseSettings,
  releaseId: string,
  actorId: string,
  at?: string,
  actorRole?: CmsWhiteLabelActorRole
): CmsReleaseCommandResult {
  const normalizedId = String(releaseId ?? '').trim()
  const target = getCmsReleaseById(settings, normalizedId)
  if (!target) {
    return {
      ok: false,
      error: 'Release not found.',
      settings,
    }
  }

  const role = resolveActorRole(actorId, actorRole)
  const timestamp = toIsoTimestamp(at)
  const gate = validateCmsReleasePrePublishGate(settings, normalizedId, {
    actorId,
    actorRole: role,
    at: timestamp,
  })

  if (!gate.allowed) {
    return {
      ok: false,
      error: 'Release failed pre-publish gate. Resolve diagnostics before publish.',
      diagnostics: gate.issues,
      settings,
      releaseId: normalizedId,
    }
  }

  if (target.status === 'scheduled' && target.scheduledAt && new Date(target.scheduledAt).getTime() > new Date(timestamp).getTime()) {
    return {
      ok: false,
      error: 'Scheduled release cannot be published before its scheduled date.',
      settings,
      releaseId: normalizedId,
    }
  }

  const nextActorId = String(actorId ?? '').trim() || 'system'
  const nextSettings: CmsReleaseSettings = {
    ...settings,
    activeReleaseId: normalizedId,
    activeEnvironment: target.environment,
    items: settings.items.map(item => {
      if (item.id !== normalizedId) {
        return item
      }
      return {
        ...item,
        status: 'published',
        sourceWorkflowStatus: 'published',
        scheduledAt: item.scheduledAt,
        publishedAt: timestamp,
        rolledBackAt: null,
        rollbackTargetReleaseId: null,
        updatedAt: timestamp,
        updatedBy: nextActorId,
      }
    }),
  }

  return {
    ok: true,
    settings: nextSettings,
    releaseId: normalizedId,
    snapshot: cloneValue(target.snapshot),
  }
}

/**
 * Publishes all scheduled releases that reached due date.
 */
export function processDueScheduledCmsReleases(
  settings: CmsReleaseSettings,
  actorId: string,
  now?: string,
  actorRole?: CmsWhiteLabelActorRole
): CmsReleaseCommandResult {
  const timestamp = toIsoTimestamp(now)
  const nowTime = new Date(timestamp).getTime()
  const role = resolveActorRole(actorId, actorRole)

  const dueReleaseIds = settings.items
    .filter(item => {
      if (item.status !== 'scheduled' || !item.validation.valid || !item.scheduledAt) {
        return false
      }

      if (!canPublishReleaseInEnvironment(settings, role, item.environment)) {
        return false
      }

      const scheduledTime = new Date(item.scheduledAt).getTime()
      return Number.isFinite(scheduledTime) && scheduledTime <= nowTime
    })
    .sort((left, right) => new Date(left.scheduledAt ?? '').getTime() - new Date(right.scheduledAt ?? '').getTime())
    .map(item => item.id)

  if (dueReleaseIds.length === 0) {
    return {
      ok: false,
      error: 'No scheduled releases are due.',
      settings,
    }
  }

  const nextActorId = String(actorId ?? '').trim() || 'system'
  let activeReleaseId: string | null = settings.activeReleaseId
  let activeEnvironment: CmsReleaseEnvironment = settings.activeEnvironment
  const publishedSet = new Set(dueReleaseIds)
  const nextItems = settings.items.map(item => {
    if (!publishedSet.has(item.id)) {
      return item
    }

    activeReleaseId = item.id
    activeEnvironment = item.environment
    return {
      ...item,
      status: 'published' as CmsReleaseStatus,
      sourceWorkflowStatus: 'published' as CmsWhiteLabelWorkflowStatus,
      publishedAt: timestamp,
      updatedAt: timestamp,
      updatedBy: nextActorId,
      rolledBackAt: null,
      rollbackTargetReleaseId: null,
    }
  })

  const nextSettings: CmsReleaseSettings = {
    ...settings,
    activeReleaseId,
    activeEnvironment,
    items: nextItems,
  }

  return {
    ok: true,
    settings: nextSettings,
    releaseId: activeReleaseId ?? undefined,
    publishedReleaseIds: dueReleaseIds,
    conflicts: detectCmsReleaseCalendarConflicts(nextSettings, timestamp),
  }
}

/**
 * Rolls back from one release to another already stored snapshot.
 */
export function rollbackCmsRelease(
  settings: CmsReleaseSettings,
  sourceReleaseId: string,
  targetReleaseId: string,
  actorId: string,
  at?: string,
  actorRole?: CmsWhiteLabelActorRole
): CmsReleaseCommandResult {
  const sourceId = String(sourceReleaseId ?? '').trim()
  const targetId = String(targetReleaseId ?? '').trim()
  if (!sourceId || !targetId) {
    return {
      ok: false,
      error: 'Source and target releases are required for rollback.',
      settings,
    }
  }

  if (sourceId === targetId) {
    return {
      ok: false,
      error: 'Rollback target must be different from source release.',
      settings,
    }
  }

  const source = getCmsReleaseById(settings, sourceId)
  const target = getCmsReleaseById(settings, targetId)
  if (!source || !target) {
    return {
      ok: false,
      error: 'Release not found.',
      settings,
    }
  }

  const role = resolveActorRole(actorId, actorRole)
  if (!canPublishReleaseInEnvironment(settings, role, source.environment)
    || !canPublishReleaseInEnvironment(settings, role, target.environment)
  ) {
    const issue: CmsReleaseValidationIssue = {
      code: 'permissions.rollback.denied',
      severity: 'error',
      message: `Role "${role}" cannot rollback across environments "${source.environment}" -> "${target.environment}".`,
      path: 'releases.environmentPolicies',
    }
    return {
      ok: false,
      error: issue.message,
      diagnostics: [issue],
      settings,
    }
  }

  const timestamp = toIsoTimestamp(at)
  const nextActorId = String(actorId ?? '').trim() || 'system'
  const nextSettings: CmsReleaseSettings = {
    ...settings,
    activeReleaseId: targetId,
    activeEnvironment: target.environment,
    items: settings.items.map(item => {
      if (item.id === sourceId) {
        return {
          ...item,
          status: 'rolled_back',
          rolledBackAt: timestamp,
          rollbackTargetReleaseId: targetId,
          updatedAt: timestamp,
          updatedBy: nextActorId,
        }
      }
      if (item.id === targetId) {
        return {
          ...item,
          status: 'published',
          sourceWorkflowStatus: 'published',
          publishedAt: timestamp,
          rolledBackAt: null,
          rollbackTargetReleaseId: null,
          updatedAt: timestamp,
          updatedBy: nextActorId,
        }
      }
      return item
    }),
  }

  return {
    ok: true,
    settings: nextSettings,
    releaseId: targetId,
    snapshot: cloneValue(target.snapshot),
  }
}

/**
 * Promotes one published release to another environment as a new release draft/validated artifact.
 */
export function promoteCmsReleaseEnvironment(
  settings: CmsReleaseSettings,
  releaseId: string,
  targetEnvironment: CmsReleaseEnvironment,
  actorId: string,
  at?: string,
  actorRole?: CmsWhiteLabelActorRole
): CmsReleaseCommandResult {
  const source = getCmsReleaseById(settings, releaseId)
  if (!source) {
    return {
      ok: false,
      error: 'Release not found.',
      settings,
    }
  }

  const normalizedTargetEnvironment = normalizeEnvironment(targetEnvironment, settings.activeEnvironment)
  const role = resolveActorRole(actorId, actorRole)
  const timestamp = toIsoTimestamp(at)

  if (source.environment === normalizedTargetEnvironment) {
    return {
      ok: false,
      error: 'Target environment must be different from source environment.',
      settings,
      releaseId: source.id,
    }
  }

  if (source.status !== 'published') {
    return {
      ok: false,
      error: 'Only published releases can be promoted to another environment.',
      settings,
      releaseId: source.id,
    }
  }

  if (!canPromoteReleaseBetweenEnvironments(settings, role, source.environment, normalizedTargetEnvironment)) {
    const issue: CmsReleaseValidationIssue = {
      code: 'permissions.promote.denied',
      severity: 'error',
      message: `Role "${role}" cannot promote from "${source.environment}" to "${normalizedTargetEnvironment}".`,
      path: 'releases.environmentPolicies',
    }

    const blockedPromotion: CmsReleasePromotionEntry = {
      id: `promotion-${buildReleaseId(timestamp)}`,
      releaseId: source.id,
      sourceEnvironment: source.environment,
      targetEnvironment: normalizedTargetEnvironment,
      status: 'blocked',
      at: timestamp,
      by: actorId,
      byRole: role,
      reason: issue.message,
    }

    return {
      ok: false,
      error: issue.message,
      diagnostics: [issue],
      settings: {
        ...settings,
        promotions: enforcePromotionCap([blockedPromotion, ...(settings.promotions ?? [])]),
      },
      releaseId: source.id,
    }
  }

  const promotedSnapshot = cloneValue(source.snapshot)
  const validation = validateCmsReleaseSnapshot(promotedSnapshot, timestamp)
  if (!validation.valid) {
    return {
      ok: false,
      error: 'Promotion blocked: source snapshot failed validation checks.',
      diagnostics: validation.issues,
      settings,
      releaseId: source.id,
    }
  }

  const promotedReleaseId = buildReleaseId(timestamp)
  const nextActorId = String(actorId ?? '').trim() || 'system'
  const promotedEntry: CmsReleaseEntry = {
    ...source,
    id: promotedReleaseId,
    name: `${source.name} -> ${normalizedTargetEnvironment}`,
    summary: `Promoted from ${source.environment} to ${normalizedTargetEnvironment}.`,
    status: 'validated',
    environment: normalizedTargetEnvironment,
    sourceWorkflowStatus: 'approved',
    createdAt: timestamp,
    createdBy: nextActorId,
    updatedAt: timestamp,
    updatedBy: nextActorId,
    scheduledAt: null,
    publishedAt: null,
    rolledBackAt: null,
    rollbackTargetReleaseId: null,
    validation,
    snapshot: promotedSnapshot,
  }

  const promotionEntry: CmsReleasePromotionEntry = {
    id: `promotion-${promotedReleaseId}`,
    releaseId: promotedReleaseId,
    sourceEnvironment: source.environment,
    targetEnvironment: normalizedTargetEnvironment,
    status: 'promoted',
    at: timestamp,
    by: nextActorId,
    byRole: role,
  }

  const nextSettings: CmsReleaseSettings = {
    ...settings,
    activeReleaseId: promotedReleaseId,
    activeEnvironment: normalizedTargetEnvironment,
    promotions: enforcePromotionCap([promotionEntry, ...(settings.promotions ?? [])]),
    items: enforceReleaseCap([promotedEntry, ...settings.items], settings.maxEntries),
  }

  return {
    ok: true,
    settings: nextSettings,
    releaseId: promotedReleaseId,
    conflicts: detectCmsReleaseCalendarConflicts(nextSettings, timestamp),
  }
}