/**
 * Review-package payload helpers for draft vs published comparison exports.
 */

import type { CmsReleaseCandidateChecklist } from '../releases/orchestration'
import type { CmsLocaleCoverageSummary } from './locale-coverage'
import type { CmsPreviewDraftPublishedDiff } from './preview-diff'

/**
 * Known payload kind for draft comparison export files.
 */
export const CMS_DRAFT_COMPARISON_PACKAGE_KIND = 'ntk-cms-draft-comparison-package'

/**
 * Current payload version used for draft comparison exports.
 */
export const CMS_DRAFT_COMPARISON_PACKAGE_VERSION = 1

const MAX_TENANT_ID_LENGTH = 80
const MAX_TENANT_NAME_LENGTH = 64

/**
 * Lightweight locale summary stored in the exported review package.
 */
export interface CmsDraftComparisonLocaleSummary {
  locale: string
  status: CmsLocaleCoverageSummary['status']
  percentage: number
  missing: number
}

/**
 * Export-friendly aggregate summary for the review package.
 */
export interface CmsDraftComparisonReviewSummary {
  hasChanges: boolean
  changedPages: number
  changedSections: number
  changedBlocks: number
  localeCoverage: CmsDraftComparisonLocaleSummary[]
  checklist?: {
    allowed: boolean
    readyCount: number
    warningCount: number
    blockingCount: number
  }
}

/**
 * Versioned review payload shape persisted to JSON files.
 */
export interface CmsDraftComparisonExportPayload {
  kind: typeof CMS_DRAFT_COMPARISON_PACKAGE_KIND
  version: typeof CMS_DRAFT_COMPARISON_PACKAGE_VERSION
  exportedAt: string
  profile: {
    id: string
    name: string
  }
  review: {
    comparedRelease: {
      id: string
      name: string
      environment: string
      publishedAt: string | null
    }
    summary: CmsDraftComparisonReviewSummary
    diff: CmsPreviewDraftPublishedDiff
    localeCoverage: CmsLocaleCoverageSummary[]
    checklist: CmsReleaseCandidateChecklist | null
  }
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Vue proxies can still leak into export flows.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Sanitizes id-like values while preserving deterministic slug semantics.
 */
function sanitizeTenantId(value: unknown, fallback: string): string {
  const seed = String(value ?? '').trim() || String(fallback ?? '').trim() || 'tenant'
  const normalized = seed
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_TENANT_ID_LENGTH)

  return normalized || 'tenant'
}

/**
 * Sanitizes tenant display names to a bounded readable value.
 */
function sanitizeTenantName(value: unknown, fallback: string): string {
  const normalized = String(value ?? fallback).trim().slice(0, MAX_TENANT_NAME_LENGTH)
  return normalized || fallback
}

/**
 * Creates the top-level summary stored alongside the detailed review payload.
 */
export function createCmsDraftComparisonReviewSummary(input: {
  diff: CmsPreviewDraftPublishedDiff
  localeCoverage: CmsLocaleCoverageSummary[]
  checklist?: CmsReleaseCandidateChecklist | null
}): CmsDraftComparisonReviewSummary {
  return {
    hasChanges: input.diff.hasChanges,
    changedPages: input.diff.pageSummary.added + input.diff.pageSummary.removed + input.diff.pageSummary.changed,
    changedSections: input.diff.sectionSummary.added + input.diff.sectionSummary.removed + input.diff.sectionSummary.changed,
    changedBlocks: input.diff.blockSummary.added + input.diff.blockSummary.removed + input.diff.blockSummary.changed,
    localeCoverage: input.localeCoverage.map(entry => ({
      locale: entry.locale,
      status: entry.status,
      percentage: entry.percentage,
      missing: entry.missing,
    })),
    checklist: input.checklist
      ? {
          allowed: input.checklist.allowed,
          readyCount: input.checklist.summary.readyCount,
          warningCount: input.checklist.summary.warningCount,
          blockingCount: input.checklist.summary.blockingCount,
        }
      : undefined,
  }
}

/**
 * Builds a versioned review package from the current diff/checklist/locale review state.
 */
export function createCmsDraftComparisonExportPayload(input: {
  profile: {
    id: string
    name: string
  }
  diff: CmsPreviewDraftPublishedDiff
  localeCoverage: CmsLocaleCoverageSummary[]
  checklist?: CmsReleaseCandidateChecklist | null
}): CmsDraftComparisonExportPayload {
  return {
    kind: CMS_DRAFT_COMPARISON_PACKAGE_KIND,
    version: CMS_DRAFT_COMPARISON_PACKAGE_VERSION,
    exportedAt: new Date().toISOString(),
    profile: {
      id: sanitizeTenantId(input.profile.id, input.profile.name),
      name: sanitizeTenantName(input.profile.name, input.profile.id),
    },
    review: {
      comparedRelease: {
        id: input.diff.releaseId,
        name: input.diff.releaseName,
        environment: input.diff.releaseEnvironment,
        publishedAt: input.diff.publishedAt ?? null,
      },
      summary: createCmsDraftComparisonReviewSummary({
        diff: input.diff,
        localeCoverage: input.localeCoverage,
        checklist: input.checklist ?? null,
      }),
      diff: cloneValue(input.diff),
      localeCoverage: cloneValue(input.localeCoverage),
      checklist: input.checklist ? cloneValue(input.checklist) : null,
    },
  }
}