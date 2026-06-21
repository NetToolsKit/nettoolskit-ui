/**
 * Governance hub helpers.
 * Aggregate workflow, revision, audit and role-policy signals into one stable
 * summary for Releases without duplicating workflow logic in the Vue layer.
 */

import type {
  CmsWhiteLabelAuditEntry,
  CmsWhiteLabelGovernance,
  CmsWhiteLabelRevision,
  CmsWhiteLabelRolePolicy,
  CmsWhiteLabelWorkflowStatus,
} from './types'

/**
 * Shared semantic status for the governance hub surface.
 */
export type CmsGovernanceHubStatus = 'ready' | 'warning'

/**
 * Stable identifiers for the top-level governance cards.
 */
export type CmsGovernanceHubCardId = 'workflow' | 'revisions' | 'audit' | 'roles'

/**
 * Compact metric rendered inside one governance card.
 */
export interface CmsGovernanceHubMetric {
  id: string
  value: number
}

/**
 * Card summary exposed to Releases.
 */
export interface CmsGovernanceHubCard {
  id: CmsGovernanceHubCardId
  status: CmsGovernanceHubStatus
  issueCount: number
  metrics: CmsGovernanceHubMetric[]
}

/**
 * Compact workflow summary.
 */
export interface CmsGovernanceHubWorkflowSummary {
  status: CmsGovernanceHubStatus
  workflowStatus: CmsWhiteLabelWorkflowStatus
  version: number
  publishedVersion: number | null
  lastActionAt: string
  lastActionBy: string
  lastActionRole: CmsWhiteLabelRolePolicy['role']
}

/**
 * Compact revision row rendered in the governance timeline.
 */
export interface CmsGovernanceHubRevisionSummary {
  version: number
  status: CmsWhiteLabelWorkflowStatus
  action: CmsWhiteLabelRevision['action']
  at: string
  by: string
  byRole: CmsWhiteLabelRolePolicy['role']
  summary: string
}

/**
 * Compact audit row rendered in the governance timeline.
 */
export interface CmsGovernanceHubAuditSummary {
  id: string
  action: CmsWhiteLabelAuditEntry['action']
  at: string
  actorId: string
  actorRole: CmsWhiteLabelRolePolicy['role']
  fromStatus: CmsWhiteLabelWorkflowStatus
  toStatus: CmsWhiteLabelWorkflowStatus
  fromVersion: number
  toVersion: number
  summary: string
  metadataCount: number
}

/**
 * Compact role-policy summary for governance visibility.
 */
export interface CmsGovernanceHubRoleSummary {
  role: CmsWhiteLabelRolePolicy['role']
  label: string
  groupsCount: number
  allowCount: number
  denyCount: number
}

/**
 * Aggregate governance summary consumed by Releases.
 */
export interface CmsGovernanceHubSummary {
  status: CmsGovernanceHubStatus
  cards: CmsGovernanceHubCard[]
  workflow: CmsGovernanceHubWorkflowSummary
  revisions: {
    count: number
    publishedCount: number
    recent: CmsGovernanceHubRevisionSummary[]
  }
  audit: {
    count: number
    recent: CmsGovernanceHubAuditSummary[]
    topActions: Array<{ action: CmsWhiteLabelAuditEntry['action']; count: number }>
  }
  roles: {
    count: number
    publishCapableCount: number
    reviewCapableCount: number
    policies: CmsGovernanceHubRoleSummary[]
  }
}

const MAX_RECENT_REVISIONS = 5
const MAX_RECENT_AUDIT_ENTRIES = 6
const MAX_TOP_AUDIT_ACTIONS = 4

/**
 * Resolves governance status from the current workflow stage.
 */
function resolveGovernanceStatus(status: CmsWhiteLabelWorkflowStatus): CmsGovernanceHubStatus {
  return status === 'approved' || status === 'scheduled' || status === 'published'
    ? 'ready'
    : 'warning'
}

/**
 * Maps recent revisions into a lightweight UI summary.
 */
function mapRecentRevisions(revisions: CmsWhiteLabelRevision[]): CmsGovernanceHubRevisionSummary[] {
  return [...revisions]
    .slice(-MAX_RECENT_REVISIONS)
    .reverse()
    .map(revision => ({
      version: revision.version,
      status: revision.status,
      action: revision.action,
      at: revision.at,
      by: revision.by,
      byRole: revision.byRole,
      summary: revision.summary,
    }))
}

/**
 * Maps recent audit entries into a lightweight UI summary.
 */
function mapRecentAuditEntries(auditTrail: CmsWhiteLabelAuditEntry[]): CmsGovernanceHubAuditSummary[] {
  return [...auditTrail]
    .slice(-MAX_RECENT_AUDIT_ENTRIES)
    .reverse()
    .map(entry => ({
      id: entry.id,
      action: entry.action,
      at: entry.at,
      actorId: entry.actorId,
      actorRole: entry.actorRole,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      fromVersion: entry.fromVersion,
      toVersion: entry.toVersion,
      summary: entry.summary,
      metadataCount: Object.keys(entry.metadata ?? {}).length,
    }))
}

/**
 * Counts the most frequent audit actions for compact Releases chips.
 */
function countTopAuditActions(auditTrail: CmsWhiteLabelAuditEntry[]): Array<{ action: CmsWhiteLabelAuditEntry['action']; count: number }> {
  const counts = new Map<CmsWhiteLabelAuditEntry['action'], number>()

  for (const entry of auditTrail) {
    counts.set(entry.action, (counts.get(entry.action) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1]
      }

      return left[0].localeCompare(right[0])
    })
    .slice(0, MAX_TOP_AUDIT_ACTIONS)
    .map(([action, count]) => ({ action, count }))
}

/**
 * Builds compact role-policy summaries for Releases.
 */
function mapRolePolicies(rolePolicies: CmsWhiteLabelRolePolicy[]): CmsGovernanceHubRoleSummary[] {
  return rolePolicies.map(policy => ({
    role: policy.role,
    label: policy.label,
    groupsCount: policy.groups.length,
    allowCount: policy.allowActions.length,
    denyCount: policy.denyActions.length,
  }))
}

/**
 * Builds the governance hub summary consumed by Releases.
 */
export function createCmsGovernanceHubSummary(governance: CmsWhiteLabelGovernance): CmsGovernanceHubSummary {
  const workflowStatus = resolveGovernanceStatus(governance.workflow.status)
  const publishedCount = governance.revisions.filter(revision => revision.status === 'published').length
  const recentRevisions = mapRecentRevisions(governance.revisions)
  const recentAuditEntries = mapRecentAuditEntries(governance.auditTrail)
  const topAuditActions = countTopAuditActions(governance.auditTrail)
  const rolePolicies = mapRolePolicies(governance.rolePolicies)
  const publishCapableCount = governance.rolePolicies.filter(policy => policy.allowActions.includes('publish')).length
  const reviewCapableCount = governance.rolePolicies.filter(policy => policy.allowActions.includes('approve')).length

  const cards: CmsGovernanceHubCard[] = [
    {
      id: 'workflow',
      status: workflowStatus,
      issueCount: workflowStatus === 'warning' ? 1 : 0,
      metrics: [
        { id: 'version', value: governance.workflow.version },
        { id: 'publishedVersion', value: governance.workflow.publishedVersion ?? 0 },
        { id: 'status', value: governance.workflow.status === 'published' ? 1 : 0 },
      ],
    },
    {
      id: 'revisions',
      status: governance.revisions.length > 1 ? 'ready' : workflowStatus,
      issueCount: 0,
      metrics: [
        { id: 'count', value: governance.revisions.length },
        { id: 'published', value: publishedCount },
        { id: 'recent', value: recentRevisions.length },
      ],
    },
    {
      id: 'audit',
      status: governance.auditTrail.length > 0 ? 'ready' : workflowStatus,
      issueCount: governance.auditTrail.length === 0 ? 1 : 0,
      metrics: [
        { id: 'count', value: governance.auditTrail.length },
        { id: 'actions', value: topAuditActions.length },
        { id: 'recent', value: recentAuditEntries.length },
      ],
    },
    {
      id: 'roles',
      status: publishCapableCount > 0 && reviewCapableCount > 0 ? 'ready' : 'warning',
      issueCount: publishCapableCount > 0 && reviewCapableCount > 0 ? 0 : 1,
      metrics: [
        { id: 'count', value: governance.rolePolicies.length },
        { id: 'publish', value: publishCapableCount },
        { id: 'review', value: reviewCapableCount },
      ],
    },
  ]

  return {
    status: cards.some(card => card.status === 'warning') ? 'warning' : 'ready',
    cards,
    workflow: {
      status: workflowStatus,
      workflowStatus: governance.workflow.status,
      version: governance.workflow.version,
      publishedVersion: governance.workflow.publishedVersion,
      lastActionAt: governance.workflow.lastActionAt,
      lastActionBy: governance.workflow.lastActionBy,
      lastActionRole: governance.workflow.lastActionRole,
    },
    revisions: {
      count: governance.revisions.length,
      publishedCount,
      recent: recentRevisions,
    },
    audit: {
      count: governance.auditTrail.length,
      recent: recentAuditEntries,
      topActions: topAuditActions,
    },
    roles: {
      count: governance.rolePolicies.length,
      publishCapableCount,
      reviewCapableCount,
      policies: rolePolicies,
    },
  }
}