/**
 * Review-package history helpers for the Releases authoring surface.
 */

import type {
  CmsReviewPackageHistoryEntry,
  CmsReviewPackageHistoryLocaleEntry,
} from './types'
import type { CmsDraftComparisonExportPayload } from './review-package'

/**
 * Maximum amount of review package export metadata retained per tenant.
 */
export const CMS_REVIEW_PACKAGE_HISTORY_MAX_ENTRIES = 20

function normalizeHistoryEnvironment(value: string): CmsReviewPackageHistoryEntry['environment'] {
  return value === 'staging' || value === 'production' ? value : 'dev'
}

function normalizeHistoryLocaleStatus(
  value: string
): CmsReviewPackageHistoryLocaleEntry['status'] {
  return value === 'complete'
    || value === 'missing'
    || value === 'empty'
    || value === 'not-applicable'
      ? value
      : 'partial'
}

function buildReviewPackageHistoryEntryId(exportedAt: string, releaseId: string): string {
  const safeReleaseId = String(releaseId ?? '').trim() || 'release'
  const safeTimestamp = String(exportedAt ?? '').replace(/[^0-9]/g, '').slice(0, 14) || '0'
  return `review-package-${safeReleaseId}-${safeTimestamp}`
}

function cloneLocaleCoverage(
  entries: CmsDraftComparisonExportPayload['review']['summary']['localeCoverage']
): CmsReviewPackageHistoryLocaleEntry[] {
  return entries.map(entry => ({
    locale: entry.locale,
    status: normalizeHistoryLocaleStatus(entry.status),
    percentage: entry.percentage,
    missing: entry.missing,
  }))
}

/**
 * Creates one persisted metadata row from a full exported review package.
 */
export function createCmsReviewPackageHistoryEntry(input: {
  fileName: string
  payload: CmsDraftComparisonExportPayload
}): CmsReviewPackageHistoryEntry {
  const exportedAt = String(input.payload.exportedAt ?? '').trim() || new Date().toISOString()
  const summary = input.payload.review.summary
  const comparedRelease = input.payload.review.comparedRelease
  const checklist = summary.checklist

  return {
    id: buildReviewPackageHistoryEntryId(exportedAt, comparedRelease.id),
    exportedAt,
    fileName: String(input.fileName ?? '').trim() || 'ntk-cms-review.json',
    releaseId: comparedRelease.id,
    releaseName: comparedRelease.name,
    environment: normalizeHistoryEnvironment(comparedRelease.environment),
    publishedAt: comparedRelease.publishedAt ?? null,
    hasChanges: summary.hasChanges,
    changedPages: summary.changedPages,
    changedSections: summary.changedSections,
    changedBlocks: summary.changedBlocks,
    localeCoverage: cloneLocaleCoverage(summary.localeCoverage),
    checklistAllowed: checklist?.allowed ?? true,
    checklistReadyCount: checklist?.readyCount ?? 0,
    checklistWarningCount: checklist?.warningCount ?? 0,
    checklistBlockingCount: checklist?.blockingCount ?? 0,
  }
}

/**
 * Prepends one exported review metadata row while enforcing the history cap.
 */
export function appendCmsReviewPackageHistory(
  history: readonly CmsReviewPackageHistoryEntry[],
  entry: CmsReviewPackageHistoryEntry,
  maxEntries = CMS_REVIEW_PACKAGE_HISTORY_MAX_ENTRIES
): CmsReviewPackageHistoryEntry[] {
  const safeMaxEntries = Number.isFinite(maxEntries) && maxEntries > 0
    ? Math.floor(maxEntries)
    : CMS_REVIEW_PACKAGE_HISTORY_MAX_ENTRIES

  const nextHistory = [
    entry,
    ...history.filter(candidate => candidate.id !== entry.id),
  ]

  return nextHistory.slice(0, safeMaxEntries)
}