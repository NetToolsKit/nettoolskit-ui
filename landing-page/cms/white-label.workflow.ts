/**
 * White-label governance workflow helpers (RBAC, status transitions, audit trail and versioning).
 */
import type {
  CmsWhiteLabelActor,
  CmsWhiteLabelActorRole,
  CmsWhiteLabelAuditEntry,
  CmsWhiteLabelGovernance,
  CmsWhiteLabelRevision,
  CmsWhiteLabelWorkflowAction,
  CmsWhiteLabelWorkflowStatus,
} from './white-label.types'

/**
 * Default max number of audit entries retained per tenant profile.
 */
export const CMS_WHITE_LABEL_DEFAULT_MAX_AUDIT_ENTRIES = 200

const MIN_AUDIT_ENTRIES = 20
const MAX_AUDIT_ENTRIES = 1000
const WORKFLOW_ACTIONS: readonly CmsWhiteLabelWorkflowAction[] = [
  'save_draft',
  'submit_review',
  'approve',
  'request_changes',
  'publish',
  'rollback',
  'reset_defaults',
  'import_settings',
]

const STATUS_TRANSITIONS: Record<CmsWhiteLabelWorkflowAction, CmsWhiteLabelWorkflowStatus> = {
  save_draft: 'draft',
  submit_review: 'in_review',
  approve: 'approved',
  request_changes: 'draft',
  publish: 'published',
  rollback: 'draft',
  reset_defaults: 'draft',
  import_settings: 'draft',
}

const STATUS_ALLOWED_ACTIONS: Record<CmsWhiteLabelWorkflowStatus, readonly CmsWhiteLabelWorkflowAction[]> = {
  draft: ['save_draft', 'submit_review', 'reset_defaults', 'import_settings'],
  in_review: ['approve', 'request_changes', 'save_draft', 'reset_defaults', 'import_settings'],
  approved: ['publish', 'request_changes', 'save_draft', 'reset_defaults', 'import_settings'],
  published: ['save_draft', 'rollback', 'reset_defaults', 'import_settings'],
}

const ROLE_ALLOWED_ACTIONS: Record<CmsWhiteLabelActorRole, readonly CmsWhiteLabelWorkflowAction[]> = {
  owner: WORKFLOW_ACTIONS,
  admin: WORKFLOW_ACTIONS,
  editor: ['save_draft', 'submit_review', 'import_settings'],
  reviewer: ['approve', 'request_changes'],
  viewer: [],
  system: WORKFLOW_ACTIONS,
}

const VERSION_BUMP_ACTIONS = new Set<CmsWhiteLabelWorkflowAction>([
  'save_draft',
  'rollback',
  'reset_defaults',
  'import_settings',
])

/**
 * Validates workflow status string values.
 */
function isWorkflowStatus(value: unknown): value is CmsWhiteLabelWorkflowStatus {
  return value === 'draft' || value === 'in_review' || value === 'approved' || value === 'published'
}

/**
 * Validates workflow action string values.
 */
function isWorkflowAction(value: unknown): value is CmsWhiteLabelWorkflowAction {
  return WORKFLOW_ACTIONS.includes(value as CmsWhiteLabelWorkflowAction)
}

/**
 * Validates actor role string values.
 */
function isActorRole(value: unknown): value is CmsWhiteLabelActorRole {
  return value === 'owner'
    || value === 'admin'
    || value === 'editor'
    || value === 'reviewer'
    || value === 'viewer'
    || value === 'system'
}

/**
 * Clamps max audit entries to a safe range.
 */
function normalizeMaxAuditEntries(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) {
    return CMS_WHITE_LABEL_DEFAULT_MAX_AUDIT_ENTRIES
  }
  return Math.min(MAX_AUDIT_ENTRIES, Math.max(MIN_AUDIT_ENTRIES, parsed))
}

/**
 * Normalizes numeric workflow versions.
 */
function normalizeVersion(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }
  return parsed
}

/**
 * Resolves the fallback action that best represents the given status.
 */
function fallbackActionByStatus(status: CmsWhiteLabelWorkflowStatus): CmsWhiteLabelWorkflowAction {
  if (status === 'in_review') {
    return 'submit_review'
  }
  if (status === 'approved') {
    return 'approve'
  }
  if (status === 'published') {
    return 'publish'
  }
  return 'save_draft'
}

/**
 * Creates a deterministic summary for audit/revision rows when no custom text is provided.
 */
function buildActionSummary(action: CmsWhiteLabelWorkflowAction, toStatus: CmsWhiteLabelWorkflowStatus): string {
  const actionLabel = action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, chunk => chunk.toUpperCase())

  return `${actionLabel} -> ${toStatus}`
}

/**
 * Returns the allowed actions for a role in the current workflow status.
 */
export function getAllowedWhiteLabelWorkflowActions(
  status: CmsWhiteLabelWorkflowStatus,
  role: CmsWhiteLabelActorRole
): CmsWhiteLabelWorkflowAction[] {
  const statusActions = STATUS_ALLOWED_ACTIONS[status]
  const roleActions = ROLE_ALLOWED_ACTIONS[role]
  return statusActions.filter(action => roleActions.includes(action))
}

/**
 * Checks if the actor role can execute an action for the current workflow state.
 */
export function canApplyWhiteLabelWorkflowAction(
  governance: CmsWhiteLabelGovernance,
  action: CmsWhiteLabelWorkflowAction,
  role: CmsWhiteLabelActorRole
): boolean {
  const allowed = getAllowedWhiteLabelWorkflowActions(governance.workflow.status, role)
  return allowed.includes(action)
}

/**
 * Creates the default workflow/audit envelope for new tenant settings.
 */
export function createDefaultWhiteLabelGovernance(now: string = new Date().toISOString()): CmsWhiteLabelGovernance {
  return {
    workflow: {
      status: 'draft',
      version: 1,
      publishedVersion: null,
      lastActionAt: now,
      lastActionBy: 'system',
      lastActionRole: 'system',
    },
    revisions: [
      {
        version: 1,
        status: 'draft',
        action: 'save_draft',
        at: now,
        by: 'system',
        byRole: 'system',
        summary: 'Initial draft created',
      },
    ],
    auditTrail: [],
    maxAuditEntries: CMS_WHITE_LABEL_DEFAULT_MAX_AUDIT_ENTRIES,
  }
}

/**
 * Applies one governance action and returns the next immutable governance state.
 */
export function applyWhiteLabelWorkflowAction(
  governance: CmsWhiteLabelGovernance,
  action: CmsWhiteLabelWorkflowAction,
  actor: CmsWhiteLabelActor,
  options?: {
    at?: string
    summary?: string
    metadata?: Record<string, string>
  }
): CmsWhiteLabelGovernance {
  if (!canApplyWhiteLabelWorkflowAction(governance, action, actor.role)) {
    throw new Error(`Action "${action}" is not allowed for role "${actor.role}" in status "${governance.workflow.status}".`)
  }

  const at = options?.at ?? new Date().toISOString()
  const fromWorkflow = governance.workflow
  const toStatus = STATUS_TRANSITIONS[action]
  const toVersion = VERSION_BUMP_ACTIONS.has(action)
    ? fromWorkflow.version + 1
    : fromWorkflow.version
  const summary = options?.summary?.trim() || buildActionSummary(action, toStatus)
  const publishedVersion = action === 'publish'
    ? toVersion
    : fromWorkflow.publishedVersion

  const revision: CmsWhiteLabelRevision = {
    version: toVersion,
    status: toStatus,
    action,
    at,
    by: actor.id,
    byRole: actor.role,
    summary,
  }

  const auditEntry: CmsWhiteLabelAuditEntry = {
    id: `${at}-${action}-${toVersion}-${governance.auditTrail.length + 1}`,
    action,
    actorId: actor.id,
    actorRole: actor.role,
    at,
    fromStatus: fromWorkflow.status,
    toStatus,
    fromVersion: fromWorkflow.version,
    toVersion,
    summary,
    metadata: options?.metadata,
  }

  const nextAuditTrail = [...governance.auditTrail, auditEntry]
  const maxAuditEntries = normalizeMaxAuditEntries(governance.maxAuditEntries)
  const cappedAuditTrail = nextAuditTrail.slice(Math.max(0, nextAuditTrail.length - maxAuditEntries))

  return {
    ...governance,
    workflow: {
      status: toStatus,
      version: toVersion,
      publishedVersion,
      lastActionAt: at,
      lastActionBy: actor.id,
      lastActionRole: actor.role,
    },
    revisions: [...governance.revisions, revision],
    auditTrail: cappedAuditTrail,
    maxAuditEntries,
  }
}

/**
 * Normalizes persisted governance payloads while preserving valid historical data.
 */
export function normalizeWhiteLabelGovernance(
  payload: Partial<CmsWhiteLabelGovernance> | null | undefined,
  now: string = new Date().toISOString()
): CmsWhiteLabelGovernance {
  const defaults = createDefaultWhiteLabelGovernance(now)
  if (!payload) {
    return defaults
  }

  const version = normalizeVersion(payload.workflow?.version)
  const status = isWorkflowStatus(payload.workflow?.status)
    ? payload.workflow.status
    : defaults.workflow.status
  const lastActionRole = isActorRole(payload.workflow?.lastActionRole)
    ? payload.workflow.lastActionRole
    : defaults.workflow.lastActionRole
  const lastActionBy = String(payload.workflow?.lastActionBy ?? defaults.workflow.lastActionBy).trim() || defaults.workflow.lastActionBy
  const lastActionAt = String(payload.workflow?.lastActionAt ?? now).trim() || now
  const publishedVersionRaw = payload.workflow?.publishedVersion
  const parsedPublishedVersion = normalizeVersion(publishedVersionRaw)
  const publishedVersion = publishedVersionRaw == null || parsedPublishedVersion > version
    ? null
    : parsedPublishedVersion

  const normalizedRevisions = Array.isArray(payload.revisions)
    ? payload.revisions
      .map((rawRevision): CmsWhiteLabelRevision | null => {
        if (!rawRevision || typeof rawRevision !== 'object') {
          return null
        }

        const revisionVersion = normalizeVersion(rawRevision.version)
        if (revisionVersion > version) {
          return null
        }

        const revisionStatus = isWorkflowStatus(rawRevision.status)
          ? rawRevision.status
          : status
        const revisionAction = isWorkflowAction(rawRevision.action)
          ? rawRevision.action
          : fallbackActionByStatus(revisionStatus)
        const revisionRole = isActorRole(rawRevision.byRole)
          ? rawRevision.byRole
          : lastActionRole

        return {
          version: revisionVersion,
          status: revisionStatus,
          action: revisionAction,
          at: String(rawRevision.at ?? now).trim() || now,
          by: String(rawRevision.by ?? 'system').trim() || 'system',
          byRole: revisionRole,
          summary: String(rawRevision.summary ?? '').trim() || buildActionSummary(revisionAction, revisionStatus),
        }
      })
      .filter((revision): revision is CmsWhiteLabelRevision => revision !== null)
    : []

  if (normalizedRevisions.length === 0) {
    normalizedRevisions.push({
      version,
      status,
      action: fallbackActionByStatus(status),
      at: lastActionAt,
      by: lastActionBy,
      byRole: lastActionRole,
      summary: 'State normalized from persisted payload',
    })
  }

  const normalizedAuditTrail = Array.isArray(payload.auditTrail)
    ? payload.auditTrail
      .map((rawAudit): CmsWhiteLabelAuditEntry | null => {
        if (!rawAudit || typeof rawAudit !== 'object') {
          return null
        }

        const auditFromStatus = isWorkflowStatus(rawAudit.fromStatus)
          ? rawAudit.fromStatus
          : status
        const auditToStatus = isWorkflowStatus(rawAudit.toStatus)
          ? rawAudit.toStatus
          : status
        const auditAction = isWorkflowAction(rawAudit.action)
          ? rawAudit.action
          : fallbackActionByStatus(auditToStatus)
        const actorRole = isActorRole(rawAudit.actorRole)
          ? rawAudit.actorRole
          : lastActionRole

        return {
          id: String(rawAudit.id ?? '').trim() || `${now}-${auditAction}-${normalizedRevisions.length}`,
          action: auditAction,
          actorId: String(rawAudit.actorId ?? 'system').trim() || 'system',
          actorRole,
          at: String(rawAudit.at ?? now).trim() || now,
          fromStatus: auditFromStatus,
          toStatus: auditToStatus,
          fromVersion: normalizeVersion(rawAudit.fromVersion),
          toVersion: normalizeVersion(rawAudit.toVersion),
          summary: String(rawAudit.summary ?? '').trim() || buildActionSummary(auditAction, auditToStatus),
          metadata: rawAudit.metadata && typeof rawAudit.metadata === 'object'
            ? Object.fromEntries(
              Object.entries(rawAudit.metadata as Record<string, unknown>)
                .filter(([key]) => key.trim().length > 0)
                .map(([key, value]) => [key, String(value)])
            )
            : undefined,
        }
      })
      .filter((entry): entry is CmsWhiteLabelAuditEntry => entry !== null)
    : []

  const maxAuditEntries = normalizeMaxAuditEntries(payload.maxAuditEntries)

  return {
    workflow: {
      status,
      version,
      publishedVersion,
      lastActionAt,
      lastActionBy,
      lastActionRole,
    },
    revisions: normalizedRevisions,
    auditTrail: normalizedAuditTrail.slice(Math.max(0, normalizedAuditTrail.length - maxAuditEntries)),
    maxAuditEntries,
  }
}