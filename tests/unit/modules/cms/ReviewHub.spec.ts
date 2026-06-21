/**
 * Tests/unit/modules/cms/Review Hub spec module.
 */

import { describe, expect, it } from 'vitest'
import { createCmsReleaseReviewHubSummary } from '../../../../src/modules/cms/white-label/review-hub'
import type { CmsLocaleCoverageSummary } from '../../../../src/modules/cms/white-label/locale-coverage'
import type { CmsPreviewDraftPublishedDiff } from '../../../../src/modules/cms/white-label/preview-diff'
import type { CmsReleaseCandidateChecklist } from '../../../../src/modules/cms/releases/orchestration'

describe('cms.review-hub', () => {
  it('aggregates warning and blocking signals into one unified review summary', () => {
    const diff = {
      releaseId: 'release-1',
      releaseName: 'Release 1',
      releaseEnvironment: 'staging',
      publishedAt: '2026-03-12T12:00:00.000Z',
      pageSummary: { added: 1, removed: 0, changed: 1, unchanged: 0, totalDraft: 2, totalPublished: 1 },
      sectionSummary: { added: 0, removed: 0, changed: 2, unchanged: 0, totalDraft: 2, totalPublished: 2 },
      blockSummary: { added: 1, removed: 0, changed: 1, unchanged: 0, totalDraft: 3, totalPublished: 2 },
      pages: [
        {
          pageId: 'landing',
          draftTitle: 'Landing draft',
          publishedTitle: 'Landing published',
          draftPath: '/',
          publishedPath: '/',
          status: 'changed',
          sectionSummary: { added: 0, removed: 0, changed: 1, unchanged: 0, totalDraft: 1, totalPublished: 1 },
          blockSummary: { added: 1, removed: 0, changed: 0, unchanged: 0, totalDraft: 2, totalPublished: 1 },
          sections: [],
        },
      ],
      hasChanges: true,
    } as CmsPreviewDraftPublishedDiff

    const localeCoverage = [
      {
        locale: 'en',
        total: 6,
        covered: 6,
        missing: 0,
        percentage: 100,
        status: 'complete',
        categories: {
          pages: { category: 'pages', total: 2, covered: 2, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
          fields: { category: 'fields', total: 2, covered: 2, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
          'reusable-content': { category: 'reusable-content', total: 2, covered: 2, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
        },
        missingEntries: [],
      },
      {
        locale: 'pt-BR',
        total: 6,
        covered: 4,
        missing: 2,
        percentage: 67,
        status: 'partial',
        categories: {
          pages: { category: 'pages', total: 2, covered: 1, missing: 1, percentage: 50, status: 'partial', missingEntries: [] },
          fields: { category: 'fields', total: 2, covered: 1, missing: 1, percentage: 50, status: 'partial', missingEntries: [] },
          'reusable-content': { category: 'reusable-content', total: 2, covered: 2, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
        },
        missingEntries: [
          {
            id: 'pt-BR:pages:page:landing:title',
            locale: 'pt-BR',
            category: 'pages',
            entityKind: 'page',
            entityId: 'landing',
            label: 'Landing draft',
            fieldLabel: 'Title',
          },
          {
            id: 'pt-BR:fields:content-model:landing-page:description',
            locale: 'pt-BR',
            category: 'fields',
            entityKind: 'content-model',
            entityId: 'landing-page',
            label: 'Landing model',
            fieldLabel: 'Description',
          },
        ],
      },
    ] as CmsLocaleCoverageSummary[]

    const checklist = {
      allowed: false,
      generatedAt: '2026-03-12T12:05:00.000Z',
      releaseId: 'release-1',
      releaseName: 'Release 1',
      environment: 'staging',
      items: [
        {
          id: 'validation',
          status: 'ready',
          issueCount: 0,
          issues: [],
        },
        {
          id: 'permissions',
          status: 'blocking',
          issueCount: 1,
          issues: [
            {
              code: 'permissions.publish.forbidden',
              severity: 'error',
              path: 'releases.current',
              message: 'Publisher role is missing.',
            },
          ],
        },
      ],
      summary: {
        readyCount: 1,
        warningCount: 0,
        blockingCount: 1,
      },
    } as CmsReleaseCandidateChecklist

    const summary = createCmsReleaseReviewHubSummary({
      diff,
      localeCoverage,
      checklist,
    })

    expect(summary.status).toBe('blocking')
    expect(summary.diff.status).toBe('warning')
    expect(summary.locales.status).toBe('warning')
    expect(summary.checklist.status).toBe('blocking')
    expect(summary.cards.map(card => card.id)).toEqual(['changes', 'locales', 'checklist'])
    expect(summary.cards.find(card => card.id === 'changes')?.issueCount).toBe(6)
    expect(summary.locales.topMissingEntries).toHaveLength(2)
    expect(summary.checklist.topIssueMessages).toContain('Publisher role is missing.')
  })

  it('marks the hub ready when diff, locales and checklist are fully clean', () => {
    const diff = {
      releaseId: 'release-2',
      releaseName: 'Release 2',
      releaseEnvironment: 'production',
      publishedAt: '2026-03-12T14:00:00.000Z',
      pageSummary: { added: 0, removed: 0, changed: 0, unchanged: 1, totalDraft: 1, totalPublished: 1 },
      sectionSummary: { added: 0, removed: 0, changed: 0, unchanged: 2, totalDraft: 2, totalPublished: 2 },
      blockSummary: { added: 0, removed: 0, changed: 0, unchanged: 3, totalDraft: 3, totalPublished: 3 },
      pages: [],
      hasChanges: false,
    } as CmsPreviewDraftPublishedDiff

    const localeCoverage = [
      {
        locale: 'en',
        total: 4,
        covered: 4,
        missing: 0,
        percentage: 100,
        status: 'complete',
        categories: {
          pages: { category: 'pages', total: 2, covered: 2, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
          fields: { category: 'fields', total: 1, covered: 1, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
          'reusable-content': { category: 'reusable-content', total: 1, covered: 1, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
        },
        missingEntries: [],
      },
      {
        locale: 'pt-BR',
        total: 4,
        covered: 4,
        missing: 0,
        percentage: 100,
        status: 'complete',
        categories: {
          pages: { category: 'pages', total: 2, covered: 2, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
          fields: { category: 'fields', total: 1, covered: 1, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
          'reusable-content': { category: 'reusable-content', total: 1, covered: 1, missing: 0, percentage: 100, status: 'complete', missingEntries: [] },
        },
        missingEntries: [],
      },
    ] as CmsLocaleCoverageSummary[]

    const checklist = {
      allowed: true,
      generatedAt: '2026-03-12T14:05:00.000Z',
      releaseId: 'release-2',
      releaseName: 'Release 2',
      environment: 'production',
      items: [],
      summary: {
        readyCount: 6,
        warningCount: 0,
        blockingCount: 0,
      },
    } as CmsReleaseCandidateChecklist

    const summary = createCmsReleaseReviewHubSummary({
      diff,
      localeCoverage,
      checklist,
    })

    expect(summary.status).toBe('ready')
    expect(summary.cards.every(card => card.status === 'ready')).toBe(true)
    expect(summary.diff.hasPublishedBaseline).toBe(true)
    expect(summary.locales.missingEntries).toBe(0)
    expect(summary.checklist.allowed).toBe(true)
  })
})