/**
 * Tests/unit/modules/cms/Release Candidate Checklist spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  buildCmsReleaseCandidateChecklist,
  createCmsReleaseDraft,
  createCmsReleaseSnapshot,
  createDefaultCmsReleaseSettings,
  validateCmsRelease,
} from '../../../../src/modules/cms/releases'

describe('cms.releases.candidate-checklist', () => {
  it('surfaces validation and workflow readiness separately for a fresh draft', () => {
    const settings = createDefaultWhiteLabelSettings()
    const draft = createCmsReleaseDraft(
      createDefaultCmsReleaseSettings(),
      {
        snapshot: createCmsReleaseSnapshot(settings),
        workflowVersion: settings.governance.workflow.version,
        workflowStatus: settings.governance.workflow.status,
      },
      {
        actorId: 'editor',
      }
    )

    const checklist = buildCmsReleaseCandidateChecklist(
      draft.settings,
      draft.releaseId ?? '',
      {
        actorId: 'publisher',
      }
    )

    expect(checklist).not.toBeNull()
    expect(checklist?.summary.blockingCount).toBeGreaterThan(0)
    expect(checklist?.items.find(item => item.id === 'candidate_state')?.status).toBe('ready')
    expect(checklist?.items.find(item => item.id === 'validation')?.status).toBe('blocking')
    expect(checklist?.items.find(item => item.id === 'workflow')?.status).toBe('warning')
    expect(checklist?.items.find(item => item.id === 'permissions')?.status).toBe('ready')
    expect(checklist?.items.find(item => item.id === 'content_integrity')?.status).toBe('ready')
  })

  it('blocks production readiness when required brand assets are missing', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.brandLogo = ''
    settings.branding.faviconUrl = ''
    settings.governance.workflow.status = 'approved'

    const draft = createCmsReleaseDraft(
      createDefaultCmsReleaseSettings(),
      {
        snapshot: createCmsReleaseSnapshot(settings),
        workflowVersion: settings.governance.workflow.version,
        workflowStatus: settings.governance.workflow.status,
      },
      {
        actorId: 'publisher',
        environment: 'production',
      }
    )
    const validated = validateCmsRelease(draft.settings, draft.releaseId ?? '', 'publisher', undefined, 'publisher')
    const checklist = buildCmsReleaseCandidateChecklist(
      validated.settings,
      draft.releaseId ?? '',
      {
        actorId: 'publisher',
        actorRole: 'publisher',
      }
    )

    expect(checklist).not.toBeNull()
    expect(checklist?.allowed).toBe(false)
    expect(checklist?.items.find(item => item.id === 'validation')?.status).toBe('ready')
    expect(checklist?.items.find(item => item.id === 'workflow')?.status).toBe('ready')
    expect(checklist?.items.find(item => item.id === 'brand_assets')?.status).toBe('blocking')
    expect(checklist?.items.find(item => item.id === 'brand_assets')?.issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining(['assets.logo.required', 'assets.favicon.required'])
    )
  })
})