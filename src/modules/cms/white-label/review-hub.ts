/**
 * Unified release-review hub helpers.
 * Aggregate draft diff, locale coverage and release checklist signals into one
 * deterministic summary that authoring UIs can render without duplicating
 * review logic.
 */

import type {
  CmsReleaseCandidateChecklist,
  CmsReleaseCandidateChecklistStatus,
} from '../releases/orchestration'
import type { CmsLocaleCoverageEntry, CmsLocaleCoverageSummary } from './locale-coverage'
import type { CmsPreviewDraftPublishedDiff } from './preview-diff'

/**
 * Shared semantic status used by the release review hub.
 */
export type CmsReleaseReviewHubStatus = CmsReleaseCandidateChecklistStatus

/**
 * Stable identifiers for the top-level review cards.
 */
export type CmsReleaseReviewHubCardId = 'changes' | 'locales' | 'checklist'

/**
 * Compact metric rendered inside one review card.
 */
export interface CmsReleaseReviewHubMetric {
  id: string
  value: number
}

/**
 * One review card summary exposed to the Releases module.
 */
export interface CmsReleaseReviewHubCard {
  id: CmsReleaseReviewHubCardId
  status: CmsReleaseReviewHubStatus
  issueCount: number
  metrics: CmsReleaseReviewHubMetric[]
}

/**
 * Aggregate release diff summary for the review hub.
 */
export interface CmsReleaseReviewHubDiffSummary {
  status: CmsReleaseReviewHubStatus
  hasPublishedBaseline: boolean
  hasChanges: boolean
  changedPages: number
  changedSections: number
  changedBlocks: number
  topChangedPageTitles: string[]
}

/**
 * Aggregate locale coverage summary for the review hub.
 */
export interface CmsReleaseReviewHubLocaleSummary {
  status: CmsReleaseReviewHubStatus
  localeCount: number
  completeCount: number
  reviewCount: number
  missingEntries: number
  topMissingEntries: CmsLocaleCoverageEntry[]
}

/**
 * Aggregate release checklist summary for the review hub.
 */
export interface CmsReleaseReviewHubChecklistSummary {
  status: CmsReleaseReviewHubStatus
  allowed: boolean
  readyCount: number
  warningCount: number
  blockingCount: number
  topIssueMessages: string[]
}

/**
 * Unified release review summary combining all release-prep sources.
 */
export interface CmsReleaseReviewHubSummary {
  status: CmsReleaseReviewHubStatus
  cards: CmsReleaseReviewHubCard[]
  diff: CmsReleaseReviewHubDiffSummary
  locales: CmsReleaseReviewHubLocaleSummary
  checklist: CmsReleaseReviewHubChecklistSummary
}

const MAX_REVIEW_HUB_CHANGED_PAGE_TITLES = 3
const MAX_REVIEW_HUB_MISSING_LOCALE_ENTRIES = 5
const MAX_REVIEW_HUB_ISSUES = 4

/**
 * Counts meaningful changes from one diff entity family.
 */
function getChangedEntityCount(summary: {
  added: number
  removed: number
  changed: number
}): number {
  return summary.added + summary.removed + summary.changed
}

/**
 * Merges semantic statuses using the same precedence expected by authoring UIs.
 */
function mergeReviewHubStatus(
  left: CmsReleaseReviewHubStatus,
  right: CmsReleaseReviewHubStatus
): CmsReleaseReviewHubStatus {
  if (left === 'blocking' || right === 'blocking') {
    return 'blocking'
  }

  if (left === 'warning' || right === 'warning') {
    return 'warning'
  }

  return 'ready'
}

/**
 * Resolves the diff portion of the review hub from the preview diff engine.
 */
function createDiffSummary(
  diff: CmsPreviewDraftPublishedDiff | null | undefined
): CmsReleaseReviewHubDiffSummary {
  if (!diff) {
    return {
      status: 'warning',
      hasPublishedBaseline: false,
      hasChanges: false,
      changedPages: 0,
      changedSections: 0,
      changedBlocks: 0,
      topChangedPageTitles: [],
    }
  }

  const changedPages = getChangedEntityCount(diff.pageSummary)
  const changedSections = getChangedEntityCount(diff.sectionSummary)
  const changedBlocks = getChangedEntityCount(diff.blockSummary)

  return {
    status: diff.hasChanges ? 'warning' : 'ready',
    hasPublishedBaseline: true,
    hasChanges: diff.hasChanges,
    changedPages,
    changedSections,
    changedBlocks,
    topChangedPageTitles: diff.pages
      .filter(page => page.status !== 'unchanged')
      .map(page => page.draftTitle || page.publishedTitle || page.draftPath || page.publishedPath || page.pageId)
      .slice(0, MAX_REVIEW_HUB_CHANGED_PAGE_TITLES),
  }
}

/**
 * Resolves the locale portion of the review hub from the locale coverage matrix.
 */
function createLocaleSummary(
  localeCoverage: CmsLocaleCoverageSummary[] | null | undefined
): CmsReleaseReviewHubLocaleSummary {
  const matrix = Array.isArray(localeCoverage)
    ? localeCoverage
    : []

  const missingEntries = matrix.flatMap(summary => summary.missingEntries)
  const completeCount = matrix.filter(summary => summary.status === 'complete').length
  const reviewCount = matrix.filter(summary => summary.status === 'partial' || summary.status === 'empty').length

  return {
    status: missingEntries.length > 0 ? 'warning' : 'ready',
    localeCount: matrix.length,
    completeCount,
    reviewCount,
    missingEntries: missingEntries.length,
    topMissingEntries: missingEntries.slice(0, MAX_REVIEW_HUB_MISSING_LOCALE_ENTRIES),
  }
}

/**
 * Resolves the checklist portion of the review hub from release orchestration.
 */
function createChecklistSummary(
  checklist: CmsReleaseCandidateChecklist | null | undefined
): CmsReleaseReviewHubChecklistSummary {
  if (!checklist) {
    return {
      status: 'warning',
      allowed: false,
      readyCount: 0,
      warningCount: 0,
      blockingCount: 0,
      topIssueMessages: [],
    }
  }

  const status = checklist.summary.blockingCount > 0
    ? 'blocking'
    : checklist.summary.warningCount > 0
      ? 'warning'
      : 'ready'

  return {
    status,
    allowed: checklist.allowed,
    readyCount: checklist.summary.readyCount,
    warningCount: checklist.summary.warningCount,
    blockingCount: checklist.summary.blockingCount,
    topIssueMessages: checklist.items
      .flatMap(item => item.issues.map(issue => issue.message))
      .slice(0, MAX_REVIEW_HUB_ISSUES),
  }
}

/**
 * Builds the unified review hub summary consumed by the Releases module.
 */
export function createCmsReleaseReviewHubSummary(input: {
  diff?: CmsPreviewDraftPublishedDiff | null
  localeCoverage?: CmsLocaleCoverageSummary[] | null
  checklist?: CmsReleaseCandidateChecklist | null
}): CmsReleaseReviewHubSummary {
  const diff = createDiffSummary(input.diff)
  const locales = createLocaleSummary(input.localeCoverage)
  const checklist = createChecklistSummary(input.checklist)

  const cards: CmsReleaseReviewHubCard[] = [
    {
      id: 'changes',
      status: diff.status,
      issueCount: diff.changedPages + diff.changedSections + diff.changedBlocks,
      metrics: [
        { id: 'pages', value: diff.changedPages },
        { id: 'sections', value: diff.changedSections },
        { id: 'blocks', value: diff.changedBlocks },
      ],
    },
    {
      id: 'locales',
      status: locales.status,
      issueCount: locales.missingEntries,
      metrics: [
        { id: 'locales', value: locales.localeCount },
        { id: 'complete', value: locales.completeCount },
        { id: 'missing', value: locales.missingEntries },
      ],
    },
    {
      id: 'checklist',
      status: checklist.status,
      issueCount: checklist.warningCount + checklist.blockingCount,
      metrics: [
        { id: 'ready', value: checklist.readyCount },
        { id: 'warning', value: checklist.warningCount },
        { id: 'blocking', value: checklist.blockingCount },
      ],
    },
  ]

  return {
    status: cards.reduce<CmsReleaseReviewHubStatus>((current, card) => mergeReviewHubStatus(current, card.status), 'ready'),
    cards,
    diff,
    locales,
    checklist,
  }
}