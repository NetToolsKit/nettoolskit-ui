/**
 * Tests/unit/modules/cms/Preview Diff spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import { resolveCmsPreviewDraftPublishedDiff } from '../../../../src/modules/cms/white-label/preview-diff'
import {
  createCmsReleaseDraft,
  createCmsReleaseSnapshot,
  createDefaultCmsReleaseSettings,
  publishCmsRelease,
  validateCmsRelease,
} from '../../../../src/modules/cms/releases'
import type { CmsReleaseEnvironment, CmsWhiteLabelSettings } from '../../../../src/modules/cms/white-label/types'

/**
 * Publishes one release snapshot into the supplied tenant settings.
 */
function publishPreviewRelease(
  settings: CmsWhiteLabelSettings,
  name: string,
  environment: CmsReleaseEnvironment,
  publishedAt: string
): string {
  const draft = createCmsReleaseDraft(
    settings.releases,
    {
      snapshot: createCmsReleaseSnapshot(settings),
      workflowVersion: settings.governance.workflow.version,
      workflowStatus: settings.governance.workflow.status,
    },
    {
      actorId: 'owner',
      name,
      environment,
      at: publishedAt,
    }
  )

  const releaseId = draft.releaseId ?? ''
  const validated = validateCmsRelease(draft.settings, releaseId, 'owner', publishedAt)
  const published = publishCmsRelease(validated.settings, releaseId, 'owner', publishedAt)

  settings.releases = published.settings
  return releaseId
}

describe('cms.preview-diff', () => {
  it('returns null when no published release exists', () => {
    const settings = createDefaultWhiteLabelSettings()

    expect(resolveCmsPreviewDraftPublishedDiff(settings)).toBeNull()
  })

  it('summarizes page, section and block changes against the selected published release', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.releases = createDefaultCmsReleaseSettings()

    settings.pages[0]!.title = 'Published Landing'
    const releaseId = publishPreviewRelease(settings, 'Release A', 'dev', '2026-03-11T10:00:00.000Z')

    settings.pages[0]!.title = 'Draft Landing'
    settings.pages[0]!.sections[0]!.label = 'Updated hero'
    settings.pages[0]!.sections[0]!.blocks.push({
      id: 'hero-extra',
      type: 'landing.metrics',
      enabled: true,
      props: {},
    })
    settings.pages.push({
      id: 'new-page',
      contentModelId: 'landing-page',
      title: 'New Draft Page',
      path: '/draft-extra',
      status: 'draft',
      description: 'New page added after publish',
      sections: [],
    })

    const diff = resolveCmsPreviewDraftPublishedDiff(settings, {
      selectedReleaseId: releaseId,
      activeEnvironment: 'dev',
    })

    expect(diff).not.toBeNull()
    expect(diff?.hasChanges).toBe(true)
    expect(diff?.pageSummary.added).toBe(1)
    expect(diff?.pageSummary.changed).toBe(1)
    expect(diff?.sectionSummary.changed).toBe(1)
    expect(diff?.blockSummary.added).toBe(1)

    const changedPage = diff?.pages.find(page => page.pageId === settings.pages[0]?.id)
    expect(changedPage?.status).toBe('changed')
    expect(changedPage?.draftTitle).toBe('Draft Landing')
    expect(changedPage?.publishedTitle).toBe('Published Landing')

    const changedSection = changedPage?.sections.find(section => section.sectionId === settings.pages[0]?.sections[0]?.id)
    expect(changedSection?.status).toBe('changed')
    expect(changedSection?.blockSummary.added).toBe(1)

    const addedPage = diff?.pages.find(page => page.pageId === 'new-page')
    expect(addedPage?.status).toBe('added')
  })
})