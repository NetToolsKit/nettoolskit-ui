/**
 * Tests/unit/modules/cms/Preview spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  resolveCmsPreviewPublishedRelease,
  resolveCmsPreviewSnapshot,
} from '../../../../src/modules/cms/white-label/preview'
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

describe('cms.preview', () => {
  it('resolves a cloned draft preview snapshot with explicit locale', () => {
    const settings = createDefaultWhiteLabelSettings()
    const preview = resolveCmsPreviewSnapshot(settings, {
      source: 'draft',
      localeInput: 'pt-BR',
    })

    expect(preview).not.toBeNull()
    expect(preview?.source).toBe('draft')
    expect(preview?.locale).toBe('pt-BR')
    expect(preview?.releaseId).toBeNull()

    preview?.pages[0] && (preview.pages[0].title = 'Changed in preview only')
    expect(settings.pages[0]?.title).toBe('Main Landing')
  })

  it('prefers the selected published release before environment fallbacks', () => {
    const settings = createDefaultWhiteLabelSettings()

    settings.pages[0]!.title = 'Dev Release'
    const devReleaseId = publishPreviewRelease(settings, 'Release Dev', 'dev', '2026-03-01T10:00:00.000Z')

    settings.pages[0]!.title = 'Staging Release'
    publishPreviewRelease(settings, 'Release Staging', 'staging', '2026-03-02T10:00:00.000Z')

    const selectedRelease = resolveCmsPreviewPublishedRelease(settings, {
      selectedReleaseId: devReleaseId,
      activeEnvironment: 'staging',
    })

    expect(selectedRelease?.id).toBe(devReleaseId)
    expect(selectedRelease?.environment).toBe('dev')
  })

  it('falls back to the latest published release in the active environment and then globally', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.releases = createDefaultCmsReleaseSettings()

    settings.pages[0]!.title = 'Older Dev Release'
    publishPreviewRelease(settings, 'Release Dev A', 'dev', '2026-03-01T08:00:00.000Z')

    settings.pages[0]!.title = 'Newer Dev Release'
    const latestDevReleaseId = publishPreviewRelease(settings, 'Release Dev B', 'dev', '2026-03-03T08:00:00.000Z')

    settings.pages[0]!.title = 'Latest Staging Release'
    const latestStagingReleaseId = publishPreviewRelease(settings, 'Release Staging', 'staging', '2026-03-04T08:00:00.000Z')

    const environmentPreview = resolveCmsPreviewSnapshot(settings, {
      source: 'published',
      activeEnvironment: 'dev',
      localeInput: 'en',
    })

    expect(environmentPreview?.releaseId).toBe(latestDevReleaseId)
    expect(environmentPreview?.pages[0]?.title).toBe('Newer Dev Release')

    const globalFallbackPreview = resolveCmsPreviewSnapshot(settings, {
      source: 'published',
      activeEnvironment: 'production',
      localeInput: 'en',
    })

    expect(globalFallbackPreview?.releaseId).toBe(latestStagingReleaseId)
    expect(globalFallbackPreview?.pages[0]?.title).toBe('Latest Staging Release')
  })

  it('returns null for published preview when no published release exists', () => {
    const settings = createDefaultWhiteLabelSettings()

    const preview = resolveCmsPreviewSnapshot(settings, {
      source: 'published',
      activeEnvironment: 'dev',
      localeInput: 'en',
    })

    expect(preview).toBeNull()
  })
})