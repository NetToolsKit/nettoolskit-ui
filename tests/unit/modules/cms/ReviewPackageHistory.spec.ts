/**
 * Tests/unit/modules/cms/Review package history spec module.
 */

import { describe, expect, it } from 'vitest'
import {
  appendCmsReviewPackageHistory,
  CMS_REVIEW_PACKAGE_HISTORY_MAX_ENTRIES,
  createCmsReviewPackageHistoryEntry,
} from '../../../../src/modules/cms/white-label/review-package-history'
import { createCmsDraftComparisonExportPayload } from '../../../../src/modules/cms/white-label/review-package'
import type { CmsReleaseCandidateChecklist } from '../../../../src/modules/cms/releases/orchestration'
import type { CmsLocaleCoverageSummary } from '../../../../src/modules/cms/white-label/locale-coverage'
import type { CmsPreviewDraftPublishedDiff } from '../../../../src/modules/cms/white-label/preview-diff'

function createSampleDiff(): CmsPreviewDraftPublishedDiff {
  return {
    releaseId: 'release-123',
    releaseName: 'Release 123',
    releaseEnvironment: 'staging',
    publishedAt: '2026-03-12T12:00:00.000Z',
    pageSummary: {
      added: 1,
      removed: 0,
      changed: 2,
      unchanged: 3,
      totalDraft: 6,
      totalPublished: 5,
    },
    sectionSummary: {
      added: 2,
      removed: 1,
      changed: 1,
      unchanged: 5,
      totalDraft: 8,
      totalPublished: 7,
    },
    blockSummary: {
      added: 3,
      removed: 1,
      changed: 2,
      unchanged: 10,
      totalDraft: 16,
      totalPublished: 13,
    },
    pages: [],
    hasChanges: true,
  }
}

function createLocaleCoverage(): CmsLocaleCoverageSummary[] {
  return [
    {
      locale: 'en',
      status: 'complete',
      percentage: 100,
      missing: 0,
      categories: [],
    },
    {
      locale: 'pt-BR',
      status: 'partial',
      percentage: 62,
      missing: 3,
      categories: [],
    },
  ]
}

function createChecklist(): CmsReleaseCandidateChecklist {
  return {
    allowed: false,
    generatedAt: '2026-03-12T12:15:00.000Z',
    releaseId: 'release-123',
    releaseName: 'Release 123',
    environment: 'staging',
    summary: {
      readyCount: 3,
      warningCount: 1,
      blockingCount: 2,
    },
    items: [],
  }
}

describe('review-package-history', () => {
  it('creates persisted history metadata from one review package export', () => {
    const payload = createCmsDraftComparisonExportPayload({
      profile: {
        id: 'tenant-alpha',
        name: 'Tenant Alpha',
      },
      diff: createSampleDiff(),
      localeCoverage: createLocaleCoverage(),
      checklist: createChecklist(),
    })

    const entry = createCmsReviewPackageHistoryEntry({
      fileName: 'ntk-cms-review-tenant-alpha.json',
      payload,
    })

    expect(entry.fileName).toBe('ntk-cms-review-tenant-alpha.json')
    expect(entry.releaseId).toBe('release-123')
    expect(entry.environment).toBe('staging')
    expect(entry.changedPages).toBe(3)
    expect(entry.changedSections).toBe(4)
    expect(entry.changedBlocks).toBe(6)
    expect(entry.localeCoverage).toEqual([
      {
        locale: 'en',
        status: 'complete',
        percentage: 100,
        missing: 0,
      },
      {
        locale: 'pt-BR',
        status: 'partial',
        percentage: 62,
        missing: 3,
      },
    ])
    expect(entry.checklistBlockingCount).toBe(2)
  })

  it('prepends new entries and enforces the history cap', () => {
    const basePayload = createCmsDraftComparisonExportPayload({
      profile: {
        id: 'tenant-alpha',
        name: 'Tenant Alpha',
      },
      diff: createSampleDiff(),
      localeCoverage: createLocaleCoverage(),
      checklist: createChecklist(),
    })

    const baseEntry = createCmsReviewPackageHistoryEntry({
      fileName: 'ntk-cms-review-tenant-alpha.json',
      payload: basePayload,
    })

    const history = Array.from({ length: CMS_REVIEW_PACKAGE_HISTORY_MAX_ENTRIES }, (_, index) => ({
      ...baseEntry,
      id: `history-${index + 1}`,
      exportedAt: `2026-03-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`,
      fileName: `history-${index + 1}.json`,
    }))

    const next = appendCmsReviewPackageHistory(history, {
      ...baseEntry,
      id: 'history-latest',
      fileName: 'history-latest.json',
    })

    expect(next).toHaveLength(CMS_REVIEW_PACKAGE_HISTORY_MAX_ENTRIES)
    expect(next[0]?.id).toBe('history-latest')
    expect(next.some(entry => entry.id === 'history-20')).toBe(false)
  })
})