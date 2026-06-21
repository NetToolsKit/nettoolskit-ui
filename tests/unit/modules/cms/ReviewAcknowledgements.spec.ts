/**
 * Tests/unit/modules/cms/Review acknowledgements spec module.
 */

import { describe, expect, it } from 'vitest'
import {
  appendCmsReleaseReviewAcknowledgement,
  CMS_REVIEW_ACKNOWLEDGEMENT_MAX_ENTRIES,
  createCmsReleaseReviewAcknowledgementEntry,
  listCmsReleaseReviewAcknowledgements,
  summarizeCmsReleaseReviewAcknowledgements,
} from '../../../../src/modules/cms/white-label/review-acknowledgements'
import type { CmsReleaseReviewAcknowledgementEntry } from '../../../../src/modules/cms/white-label/types'

function createEntry(
  id: string,
  releaseId: string,
  environment: 'dev' | 'staging' | 'production',
  decision: 'noted' | 'approved' | 'changes_requested',
  acknowledgedAt: string
): CmsReleaseReviewAcknowledgementEntry {
  return {
    id,
    releaseId,
    releaseName: `Release ${releaseId}`,
    environment,
    decision,
    note: null,
    acknowledgedAt,
    actorId: 'cms-admin',
    actorRole: 'admin',
    actorName: 'CMS Admin',
  }
}

describe('review-acknowledgements', () => {
  it('creates normalized acknowledgement entries', () => {
    const entry = createCmsReleaseReviewAcknowledgementEntry({
      releaseId: 'release-1',
      releaseName: 'Release 1',
      environment: 'staging',
      decision: null,
      note: '  Reviewed and ready.  ',
      actorId: 'admin-1',
      actorRole: 'admin',
      actorName: 'Release Admin',
      at: '2026-03-12T12:00:00.000Z',
    })

    expect(entry.id).toMatch(/^review-ack-/)
    expect(entry.releaseId).toBe('release-1')
    expect(entry.releaseName).toBe('Release 1')
    expect(entry.environment).toBe('staging')
    expect(entry.decision).toBe('noted')
    expect(entry.note).toBe('Reviewed and ready.')
    expect(entry.acknowledgedAt).toBe('2026-03-12T12:00:00.000Z')
    expect(entry.actorId).toBe('admin-1')
    expect(entry.actorRole).toBe('admin')
    expect(entry.actorName).toBe('Release Admin')
  })

  it('prepends entries and respects the max cap', () => {
    const baseEntry = createEntry(
      'review-1',
      'release-1',
      'dev',
      'noted',
      '2026-03-12T12:00:00.000Z'
    )
    const entries = Array.from({ length: CMS_REVIEW_ACKNOWLEDGEMENT_MAX_ENTRIES }, (_, index) => ({
      ...baseEntry,
      id: `review-${index + 1}`,
      acknowledgedAt: `2026-03-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`,
    }))

    const next = appendCmsReleaseReviewAcknowledgement(entries, {
      ...baseEntry,
      id: 'review-latest',
    })

    expect(next).toHaveLength(CMS_REVIEW_ACKNOWLEDGEMENT_MAX_ENTRIES)
    expect(next[0]?.id).toBe('review-latest')
    expect(next.some(entry => entry.id === `review-${CMS_REVIEW_ACKNOWLEDGEMENT_MAX_ENTRIES}`)).toBe(false)
  })

  it('lists entries for one release/environment scope newest first', () => {
    const entries = [
      createEntry('review-dev-old', 'release-1', 'dev', 'noted', '2026-03-12T10:00:00.000Z'),
      createEntry('review-dev-new', 'release-1', 'dev', 'approved', '2026-03-12T11:00:00.000Z'),
      createEntry('review-staging', 'release-1', 'staging', 'changes_requested', '2026-03-12T12:00:00.000Z'),
      createEntry('review-other-release', 'release-2', 'dev', 'approved', '2026-03-12T13:00:00.000Z'),
    ]

    const scoped = listCmsReleaseReviewAcknowledgements(entries, {
      releaseId: 'release-1',
      environment: 'dev',
    })

    expect(scoped.map(entry => entry.id)).toEqual(['review-dev-new', 'review-dev-old'])
  })

  it('summarizes acknowledgement decisions for one release scope', () => {
    const entries = [
      createEntry('review-1', 'release-1', 'dev', 'approved', '2026-03-12T11:00:00.000Z'),
      createEntry('review-2', 'release-1', 'dev', 'noted', '2026-03-12T10:00:00.000Z'),
      createEntry('review-3', 'release-1', 'dev', 'changes_requested', '2026-03-12T09:00:00.000Z'),
      createEntry('review-4', 'release-2', 'dev', 'approved', '2026-03-12T08:00:00.000Z'),
    ]

    const summary = summarizeCmsReleaseReviewAcknowledgements(entries, {
      releaseId: 'release-1',
      environment: 'dev',
    })

    expect(summary.total).toBe(3)
    expect(summary.approvedCount).toBe(1)
    expect(summary.notedCount).toBe(1)
    expect(summary.changesRequestedCount).toBe(1)
    expect(summary.latestAcknowledgedAt).toBe('2026-03-12T11:00:00.000Z')
  })
})