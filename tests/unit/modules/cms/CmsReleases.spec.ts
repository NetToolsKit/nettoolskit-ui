/**
 * Tests/unit/modules/cms/Cms Releases orchestration spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  applyCmsReleaseSnapshot,
  createCmsReleaseDraft,
  createCmsReleaseSnapshot,
  createDefaultCmsReleaseSettings,
  normalizeCmsReleaseSettings,
  processDueScheduledCmsReleases,
  publishCmsRelease,
  rollbackCmsRelease,
  scheduleCmsRelease,
  validateCmsRelease,
  validateCmsReleaseSnapshot,
} from '../../../../src/modules/cms/releases'

describe('cms.releases.orchestration', () => {
  it('creates default release settings scaffold', () => {
    const releases = createDefaultCmsReleaseSettings()

    expect(releases.schemaVersion).toBe(2)
    expect(releases.maxEntries).toBeGreaterThan(0)
    expect(releases.activeReleaseId).toBeNull()
    expect(releases.activeEnvironment).toBe('dev')
    expect(releases.enforceEnvironmentPolicies).toBe(false)
    expect(releases.environmentPolicies).toHaveLength(3)
    expect(releases.promotions).toHaveLength(0)
    expect(releases.items).toHaveLength(0)
  })

  it('validates default tenant snapshot with no release errors', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.reusableSections.push({
      id: 'hero-library',
      name: 'Hero Library',
      description: '',
      category: 'hero',
      contentModelId: 'landing-page',
      presetId: 'hero',
      label: 'Hero',
      enabled: true,
      blocks: [{
        id: 'hero-library-block-1',
        type: 'landing.hero',
        enabled: true,
        props: {},
      }],
    })
    const snapshot = createCmsReleaseSnapshot(settings)
    const report = validateCmsReleaseSnapshot(snapshot)

    expect(report.valid).toBe(true)
    expect(report.errorCount).toBe(0)
    expect(snapshot.reusableSections).toHaveLength(settings.reusableSections.length)
    expect(snapshot.mediaAssets).toHaveLength(settings.mediaAssets.length)
  })

  it('reuses content validator diagnostics inside release snapshot validation', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.pages.push({
      id: 'duplicate-page',
      contentModelId: 'landing-page',
      title: 'Duplicate Page',
      path: '/',
      status: 'draft',
      description: 'Conflicting path',
      sections: [],
    })

    const report = validateCmsReleaseSnapshot(createCmsReleaseSnapshot(settings))

    expect(report.valid).toBe(false)
    expect(report.issues.map(issue => issue.code)).toContain('pages.path.duplicate')
    expect(report.issues.map(issue => issue.code)).toContain('pages.sections.empty')
  })

  it('creates, validates, schedules and publishes due releases', () => {
    const settings = createDefaultWhiteLabelSettings()
    const snapshot = createCmsReleaseSnapshot(settings)
    const now = new Date()
    const future = new Date(now.getTime() + (1000 * 60 * 30)).toISOString()
    const dueNow = new Date(now.getTime() + (1000 * 60 * 45)).toISOString()

    const draftResult = createCmsReleaseDraft(
      createDefaultCmsReleaseSettings(),
      {
        snapshot,
        workflowVersion: settings.governance.workflow.version,
        workflowStatus: settings.governance.workflow.status,
      },
      {
        actorId: 'tester',
      }
    )
    expect(draftResult.ok).toBe(true)
    expect(draftResult.releaseId).toBeTruthy()

    const validated = validateCmsRelease(
      draftResult.settings,
      draftResult.releaseId ?? '',
      'reviewer'
    )
    expect(validated.ok).toBe(true)
    expect(validated.settings.items[0]?.status).toBe('validated')

    const scheduled = scheduleCmsRelease(
      validated.settings,
      draftResult.releaseId ?? '',
      future,
      'publisher',
      now.toISOString()
    )
    expect(scheduled.ok).toBe(true)
    expect(scheduled.settings.items[0]?.status).toBe('scheduled')
    expect(scheduled.settings.items[0]?.scheduledAt).toBeTruthy()

    const earlyPublish = publishCmsRelease(
      scheduled.settings,
      draftResult.releaseId ?? '',
      'publisher',
      now.toISOString()
    )
    expect(earlyPublish.ok).toBe(false)

    const dueResult = processDueScheduledCmsReleases(
      scheduled.settings,
      'system',
      dueNow
    )
    expect(dueResult.ok).toBe(true)
    expect(dueResult.publishedReleaseIds).toContain(draftResult.releaseId)
    expect(dueResult.settings.items[0]?.status).toBe('published')
  })

  it('rolls back to a previous published release snapshot', () => {
    const baseSettings = createDefaultWhiteLabelSettings()
    baseSettings.branding.appName = 'Release A'

    const releaseAResult = createCmsReleaseDraft(
      createDefaultCmsReleaseSettings(),
      {
        snapshot: createCmsReleaseSnapshot(baseSettings),
        workflowVersion: baseSettings.governance.workflow.version,
        workflowStatus: baseSettings.governance.workflow.status,
      },
      {
        actorId: 'owner',
        name: 'Release A',
      }
    )
    const releaseAId = releaseAResult.releaseId ?? ''
    const releaseAValidated = validateCmsRelease(releaseAResult.settings, releaseAId, 'owner')
    const releaseAPublished = publishCmsRelease(releaseAValidated.settings, releaseAId, 'owner')
    expect(releaseAPublished.ok).toBe(true)

    const nextSettings = createDefaultWhiteLabelSettings()
    nextSettings.branding.appName = 'Release B'
    const releaseBResult = createCmsReleaseDraft(
      releaseAPublished.settings,
      {
        snapshot: createCmsReleaseSnapshot(nextSettings),
        workflowVersion: nextSettings.governance.workflow.version + 1,
        workflowStatus: nextSettings.governance.workflow.status,
      },
      {
        actorId: 'owner',
        name: 'Release B',
      }
    )
    const releaseBId = releaseBResult.releaseId ?? ''
    const releaseBValidated = validateCmsRelease(releaseBResult.settings, releaseBId, 'owner')
    const releaseBPublished = publishCmsRelease(releaseBValidated.settings, releaseBId, 'owner')
    expect(releaseBPublished.ok).toBe(true)

    const rollback = rollbackCmsRelease(
      releaseBPublished.settings,
      releaseBId,
      releaseAId,
      'owner'
    )
    expect(rollback.ok).toBe(true)
    expect(rollback.snapshot?.branding.appName).toBe('Release A')
    expect(rollback.settings.activeReleaseId).toBe(releaseAId)
    expect(rollback.settings.items.find(item => item.id === releaseBId)?.status).toBe('rolled_back')
    expect(rollback.settings.items.find(item => item.id === releaseAId)?.status).toBe('published')

    const applied = applyCmsReleaseSnapshot(nextSettings, rollback.snapshot!)
    expect(applied.branding.appName).toBe('Release A')
    expect(applied.reusableSections).toEqual(rollback.snapshot?.reusableSections)
    expect(applied.mediaAssets).toEqual(rollback.snapshot?.mediaAssets)
  })

  it('normalizes malformed release payloads with safe defaults', () => {
    const settings = createDefaultWhiteLabelSettings()
    const normalized = normalizeCmsReleaseSettings({
      schemaVersion: 99,
      maxEntries: -10,
      activeReleaseId: 'unknown',
      items: [
        {
          id: '',
          status: 'invalid',
          sourceVersion: -2,
          sourceWorkflowStatus: 'invalid',
        },
      ],
    } as never, {
      snapshot: createCmsReleaseSnapshot(settings),
      workflowVersion: settings.governance.workflow.version,
      workflowStatus: settings.governance.workflow.status,
    })

    expect(normalized.schemaVersion).toBe(2)
    expect(normalized.items).toHaveLength(0)
    expect(normalized.activeReleaseId).toBeNull()
    expect(normalized.activeEnvironment).toBe('dev')
    expect(normalized.enforceEnvironmentPolicies).toBe(false)
    expect(normalized.environmentPolicies).toHaveLength(3)
    expect(normalized.promotions).toHaveLength(0)
  })
})