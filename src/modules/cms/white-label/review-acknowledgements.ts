/**
 * Lightweight release-review acknowledgement helpers.
 * These helpers intentionally stay snapshot-based and provider-agnostic so
 * backend workflows can consume the same persisted metadata later.
 */

import type {
  CmsReleaseEnvironment,
  CmsReleaseReviewAcknowledgementDecision,
  CmsReleaseReviewAcknowledgementEntry,
  CmsWhiteLabelActorRole,
} from './types'

export const CMS_REVIEW_ACKNOWLEDGEMENT_MAX_ENTRIES = 50

/**
 * Filter contract used by acknowledgement listing and summary helpers.
 */
export interface CmsReleaseReviewAcknowledgementFilter {
  releaseId: string
  environment?: CmsReleaseEnvironment | null
}

/**
 * Aggregate counts rendered by the Releases acknowledgement surface.
 */
export interface CmsReleaseReviewAcknowledgementSummary {
  total: number
  approvedCount: number
  notedCount: number
  changesRequestedCount: number
  latestAcknowledgedAt: string | null
}

function toIsoTimestamp(value?: string): string {
  const parsed = new Date(String(value ?? '').trim())
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }
  return new Date().toISOString()
}

function buildReviewAcknowledgementId(at: string): string {
  const compact = at.replace(/[-:.TZ]/g, '').slice(0, 14)
  const random = Math.random().toString(36).slice(2, 8)
  return `review-ack-${compact}-${random}`
}

function normalizeDecision(
  value: unknown
): CmsReleaseReviewAcknowledgementDecision {
  return value === 'approved'
    || value === 'changes_requested'
      ? value
      : 'noted'
}

function normalizeActorRole(value: unknown): CmsWhiteLabelActorRole {
  return value === 'owner'
    || value === 'admin'
    || value === 'editor'
    || value === 'reviewer'
    || value === 'publisher'
    || value === 'viewer'
    || value === 'system'
      ? value
      : 'system'
}

/**
 * Creates one acknowledgement row for the selected release review surface.
 */
export function createCmsReleaseReviewAcknowledgementEntry(input: {
  releaseId: string
  releaseName: string
  environment: CmsReleaseEnvironment
  decision?: CmsReleaseReviewAcknowledgementDecision | null
  note?: string | null
  actorId: string
  actorRole: CmsWhiteLabelActorRole
  actorName?: string | null
  at?: string
}): CmsReleaseReviewAcknowledgementEntry {
  const acknowledgedAt = toIsoTimestamp(input.at)
  return {
    id: buildReviewAcknowledgementId(acknowledgedAt),
    releaseId: String(input.releaseId ?? '').trim() || 'unknown',
    releaseName: String(input.releaseName ?? '').trim() || 'Release',
    environment: input.environment,
    decision: normalizeDecision(input.decision),
    note: String(input.note ?? '').trim() || null,
    acknowledgedAt,
    actorId: String(input.actorId ?? '').trim() || 'system',
    actorRole: normalizeActorRole(input.actorRole),
    actorName: String(input.actorName ?? '').trim() || null,
  }
}

/**
 * Keeps acknowledgement history bounded and ordered by most-recent first.
 */
export function appendCmsReleaseReviewAcknowledgement(
  entries: CmsReleaseReviewAcknowledgementEntry[] | null | undefined,
  nextEntry: CmsReleaseReviewAcknowledgementEntry,
  maxEntries = CMS_REVIEW_ACKNOWLEDGEMENT_MAX_ENTRIES
): CmsReleaseReviewAcknowledgementEntry[] {
  const safeMax = Number.isFinite(maxEntries) && maxEntries > 0
    ? Math.floor(maxEntries)
    : CMS_REVIEW_ACKNOWLEDGEMENT_MAX_ENTRIES

  return [nextEntry, ...(entries ?? [])]
    .slice(0, safeMax)
}

/**
 * Filters acknowledgement history for one release/environment scope and keeps
 * the newest entries first.
 */
export function listCmsReleaseReviewAcknowledgements(
  entries: CmsReleaseReviewAcknowledgementEntry[] | null | undefined,
  filter: CmsReleaseReviewAcknowledgementFilter
): CmsReleaseReviewAcknowledgementEntry[] {
  const releaseId = String(filter.releaseId ?? '').trim()
  const environment = filter.environment ?? null

  return (entries ?? [])
    .filter(entry => entry.releaseId === releaseId && (!environment || entry.environment === environment))
    .slice()
    .sort((left, right) => new Date(right.acknowledgedAt).getTime() - new Date(left.acknowledgedAt).getTime())
}

/**
 * Summarizes acknowledgement decisions for one release/environment scope.
 */
export function summarizeCmsReleaseReviewAcknowledgements(
  entries: CmsReleaseReviewAcknowledgementEntry[] | null | undefined,
  filter: CmsReleaseReviewAcknowledgementFilter
): CmsReleaseReviewAcknowledgementSummary {
  const scopedEntries = listCmsReleaseReviewAcknowledgements(entries, filter)

  return scopedEntries.reduce<CmsReleaseReviewAcknowledgementSummary>((summary, entry, index) => {
    if (entry.decision === 'approved') {
      summary.approvedCount += 1
    } else if (entry.decision === 'changes_requested') {
      summary.changesRequestedCount += 1
    } else {
      summary.notedCount += 1
    }

    if (index === 0) {
      summary.latestAcknowledgedAt = entry.acknowledgedAt
    }

    summary.total += 1
    return summary
  }, {
    total: 0,
    approvedCount: 0,
    notedCount: 0,
    changesRequestedCount: 0,
    latestAcknowledgedAt: null,
  })
}