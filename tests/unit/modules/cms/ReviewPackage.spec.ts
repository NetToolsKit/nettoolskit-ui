/**
 * Tests/unit/modules/cms/Review Package spec module.
 */

import { describe, expect, it } from 'vitest'
import type { CmsReleaseCandidateChecklist } from '../../../../src/modules/cms/releases/orchestration'
import type { CmsLocaleCoverageSummary } from '../../../../src/modules/cms/white-label/locale-coverage'
import type { CmsPreviewDraftPublishedDiff } from '../../../../src/modules/cms/white-label/preview-diff'
import {
  CMS_DRAFT_COMPARISON_PACKAGE_KIND,
  CMS_DRAFT_COMPARISON_PACKAGE_VERSION,
  createCmsDraftComparisonExportPayload,
  createCmsDraftComparisonReviewSummary,
} from '../../../../src/modules/cms/white-label/review-package'

function createSampleDiff(): CmsPreviewDraftPublishedDiff {
  return {
    releaseId: 'release-123',
    releaseName: 'Release 123',
    releaseEnvironment: 'dev',
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
    environment: 'dev',
    summary: {
      readyCount: 3,
      warningCount: 1,
      blockingCount: 2,
    },
    items: [
      {
        id: 'validation',
        status: 'blocking',
        issueCount: 2,
        issues: [],
        validationValid: false,
      },
    ],
  }
}

describe('review-package', () => {
  it('creates an aggregate review summary from diff, locale coverage and checklist', () => {
    const summary = createCmsDraftComparisonReviewSummary({
      diff: createSampleDiff(),
      localeCoverage: createLocaleCoverage(),
      checklist: createChecklist(),
    })

    expect(summary.hasChanges).toBe(true)
    expect(summary.changedPages).toBe(3)
    expect(summary.changedSections).toBe(4)
    expect(summary.changedBlocks).toBe(6)
    expect(summary.localeCoverage).toEqual([
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
    expect(summary.checklist).toEqual({
      allowed: false,
      readyCount: 3,
      warningCount: 1,
      blockingCount: 2,
    })
  })

  it('creates a versioned draft comparison export payload', () => {
    const payload = createCmsDraftComparisonExportPayload({
      profile: {
        id: ' Tenant Alpha / Review ',
        name: 'Tenant Alpha Review',
      },
      diff: createSampleDiff(),
      localeCoverage: createLocaleCoverage(),
      checklist: createChecklist(),
    })

    expect(payload.kind).toBe(CMS_DRAFT_COMPARISON_PACKAGE_KIND)
    expect(payload.version).toBe(CMS_DRAFT_COMPARISON_PACKAGE_VERSION)
    expect(payload.profile.id).toBe('tenant-alpha-review')
    expect(payload.profile.name).toBe('Tenant Alpha Review')
    expect(payload.review.comparedRelease).toEqual({
      id: 'release-123',
      name: 'Release 123',
      environment: 'dev',
      publishedAt: '2026-03-12T12:00:00.000Z',
    })
    expect(payload.review.summary.changedPages).toBe(3)
    expect(payload.review.localeCoverage).toHaveLength(2)
    expect(payload.review.checklist?.summary.blockingCount).toBe(2)
  })
})