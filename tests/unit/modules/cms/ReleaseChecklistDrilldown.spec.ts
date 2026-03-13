/**
 * Tests/unit/modules/cms/Release Checklist Drilldown spec module.
 */

import { describe, expect, it } from 'vitest'
import { resolveCmsReleaseChecklistDrilldownActions } from '../../../../src/modules/cms/white-label/release-drilldown'
import type { CmsReleaseCandidateChecklistItem } from '../../../../src/modules/cms/releases/orchestration'

describe('cms.release-checklist-drilldown', () => {
  it('maps page, block, content, branding and releases issues to deterministic drill-down actions', () => {
    const contentIntegrityItem = {
      id: 'content_integrity',
      status: 'blocking',
      issueCount: 5,
      issues: [
        {
          code: 'pages.title.required',
          severity: 'error',
          path: 'pages.page-1.title',
          message: 'Page title is required.',
        },
        {
          code: 'pages.sections.blocks.props.invalid',
          severity: 'error',
          path: 'pages.page-1.sections.hero.blocks[0].props.title',
          message: 'Block props are invalid.',
        },
        {
          code: 'authoredContentModels.schema.invalid',
          severity: 'error',
          path: 'authoredContentModels.authored:landing.fields[0].label',
          message: 'Schema is invalid.',
        },
        {
          code: 'assets.logo.required',
          severity: 'error',
          path: 'branding.brandLogo',
          message: 'Logo is required.',
        },
        {
          code: 'pages.sections.blocks.props.invalid',
          severity: 'error',
          path: 'pages.page-1.sections.hero.blocks[0].props.title',
          message: 'Duplicate drilldown should be deduped.',
        },
      ],
    } as CmsReleaseCandidateChecklistItem

    const actions = resolveCmsReleaseChecklistDrilldownActions(contentIntegrityItem)

    expect(actions).toEqual([
      expect.objectContaining({
        checklistItemId: 'content_integrity',
        target: 'pages',
        pageId: 'page-1',
        sectionId: null,
        issueCode: 'pages.title.required',
      }),
      expect.objectContaining({
        checklistItemId: 'content_integrity',
        target: 'blocks',
        pageId: 'page-1',
        sectionId: 'hero',
        issueCode: 'pages.sections.blocks.props.invalid',
      }),
      expect.objectContaining({
        checklistItemId: 'content_integrity',
        target: 'content',
        pageId: null,
        sectionId: null,
        issueCode: 'authoredContentModels.schema.invalid',
      }),
      expect.objectContaining({
        checklistItemId: 'content_integrity',
        target: 'branding',
        issueCode: 'assets.logo.required',
      }),
    ])
  })

  it('routes validation, workflow and permission issues back to Releases', () => {
    const item = {
      id: 'validation',
      status: 'blocking',
      issueCount: 3,
      issues: [
        {
          code: 'release.validation.required',
          severity: 'error',
          path: 'releases.items.release-1.validation',
          message: 'Run validation.',
        },
        {
          code: 'workflow.status.not_ready',
          severity: 'warning',
          path: 'releases.items.release-1.workflow',
          message: 'Workflow not approved.',
        },
        {
          code: 'permissions.publish.denied',
          severity: 'error',
          path: 'releases.environmentPolicies.production',
          message: 'Publisher role missing.',
        },
      ],
    } as CmsReleaseCandidateChecklistItem

    const actions = resolveCmsReleaseChecklistDrilldownActions(item)

    expect(actions).toHaveLength(3)
    expect(actions.every(action => action.target === 'releases')).toBe(true)
  })
})