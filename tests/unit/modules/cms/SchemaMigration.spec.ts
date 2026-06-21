/**
 * Tests/unit/modules/cms/Schema Migration spec module.
 */

import { describe, expect, it } from 'vitest'
import {
  createCmsAuthoredContentModel,
  createCmsPageSectionFromPreset,
  updateCmsAuthoredContentModel,
} from '../../../../src/modules/cms/white-label/content-models'
import {
  applyCmsPageSchemaMigration,
  createCmsPageSchemaMigrationReport,
  createCmsSchemaMigrationBatchReport,
} from '../../../../src/modules/cms/white-label/schema-migration'
import type { CmsPageSettings } from '../../../../src/modules/cms/white-label/types'

function createVersionedContentModelPair() {
  const initialModel = createCmsAuthoredContentModel({
    existingModels: [],
    localeInput: 'en',
    name: 'Schema migration model',
    description: 'Initial authored schema',
    migrationNotes: 'Initial contract',
    allowedPresets: ['hero', 'footer'],
    requiredPresets: ['hero'],
    starterPresets: ['hero', 'footer'],
    recommendedPresets: ['hero'],
    fields: [
      {
        id: 'campaignHeadline',
        type: 'text',
        label: 'Campaign headline',
        description: 'Primary campaign headline',
        placeholder: 'Type the main headline',
        required: true,
        defaultValue: 'Launch campaign',
      },
    ],
  })

  const upgradedModel = updateCmsAuthoredContentModel({
    model: initialModel,
    localeInput: 'en',
    name: 'Schema migration model',
    description: 'Initial authored schema',
    migrationNotes: 'Adds eyebrow support',
    allowedPresets: ['hero', 'footer'],
    requiredPresets: ['hero'],
    starterPresets: ['hero', 'footer'],
    recommendedPresets: ['hero'],
    fields: [
      ...initialModel.fields,
      {
        id: 'campaignEyebrow',
        type: 'text',
        label: 'Campaign eyebrow',
        description: 'Short supporting text',
        placeholder: 'New',
        required: false,
        defaultValue: 'New',
      },
    ],
  })

  return {
    initialModel,
    upgradedModel,
  }
}

describe('schema-migration', () => {
  it('builds a dry-run report for pages that require a schema upgrade', () => {
    const { upgradedModel } = createVersionedContentModelPair()
    const page: CmsPageSettings = {
      id: 'migration-page',
      contentModelId: upgradedModel.id,
      contentModelVersion: 1,
      title: 'Migration page',
      path: '/migration-page',
      status: 'draft',
      description: 'Schema migration preview',
      customFields: {
        campaignheadline: 'Existing launch headline',
      },
      sections: [
        createCmsPageSectionFromPreset({
          presetId: 'hero',
          existingSections: [],
          localeInput: 'en',
        }),
      ],
    }

    const report = createCmsPageSchemaMigrationReport({
      page,
      localeInput: 'en',
      authoredContentModels: [upgradedModel],
    })

    expect(report.status).toBe('upgrade-required')
    expect(report.appliedVersion).toBe(1)
    expect(report.targetVersion).toBe(2)
    expect(report.canApply).toBe(true)
    expect(report.migrationNotes).toBe('Adds eyebrow support')
    expect(report.summary).toEqual({
      addCount: 1,
      removeCount: 0,
      updateCount: 0,
      total: 1,
    })
    expect(report.nextCustomFields).toMatchObject({
      campaignheadline: 'Existing launch headline',
      campaigneyebrow: 'New',
    })
    expect(report.changes).toEqual([
      expect.objectContaining({
        kind: 'add',
        locale: null,
        fieldId: 'campaigneyebrow',
        path: 'customFields.campaigneyebrow',
        nextValue: 'New',
      }),
    ])
  })

  it('applies schema upgrades to page custom fields and localized overrides', () => {
    const { upgradedModel } = createVersionedContentModelPair()
    const page: CmsPageSettings = {
      id: 'localized-migration-page',
      contentModelId: upgradedModel.id,
      contentModelVersion: 1,
      title: 'Localized migration page',
      path: '/localized-migration-page',
      status: 'draft',
      description: 'Localized schema migration preview',
      customFields: {
        campaignheadline: 'Launch headline',
      },
      localization: {
        fields: {
          'pt-BR': {
            campaignheadline: 'Título do lançamento',
          },
        },
      },
      sections: [
        createCmsPageSectionFromPreset({
          presetId: 'hero',
          existingSections: [],
          localeInput: 'en',
        }),
      ],
    }

    const upgradedPage = applyCmsPageSchemaMigration({
      page,
      localeInput: 'en',
      authoredContentModels: [upgradedModel],
    })

    expect(upgradedPage).not.toBe(page)
    expect(upgradedPage.contentModelVersion).toBe(2)
    expect(upgradedPage.customFields).toMatchObject({
      campaignheadline: 'Launch headline',
      campaigneyebrow: 'New',
    })
    expect(upgradedPage.localization?.fields?.['pt-BR']).toMatchObject({
      campaignheadline: 'Título do lançamento',
      campaigneyebrow: 'New',
    })
  })

  it('tracks invalid, missing, stale and ahead schema versions in the batch report and keeps blocked pages untouched', () => {
    const { upgradedModel } = createVersionedContentModelPair()
    const stalePage: CmsPageSettings = {
      id: 'stale-page',
      contentModelId: upgradedModel.id,
      contentModelVersion: 1,
      title: 'Stale page',
      path: '/stale-page',
      status: 'draft',
      description: 'Needs a schema upgrade',
      customFields: {
        campaignheadline: 'Launch headline',
      },
      sections: [],
    }
    const missingVersionPage: CmsPageSettings = {
      id: 'missing-version-page',
      contentModelId: upgradedModel.id,
      title: 'Missing version page',
      path: '/missing-version-page',
      status: 'draft',
      description: 'Missing applied schema version',
      customFields: {
        campaignheadline: 'Missing version headline',
      },
      sections: [],
    }
    const invalidModelPage: CmsPageSettings = {
      id: 'invalid-model-page',
      contentModelId: 'missing-authored-model' as never,
      contentModelVersion: 1,
      title: 'Invalid model page',
      path: '/invalid-model-page',
      status: 'draft',
      description: 'References a deleted model',
      customFields: {
        campaignheadline: 'Invalid model headline',
      },
      sections: [],
    }
    const aheadPage: CmsPageSettings = {
      id: 'ahead-page',
      contentModelId: upgradedModel.id,
      contentModelVersion: 99,
      title: 'Ahead page',
      path: '/ahead-page',
      status: 'draft',
      description: 'Ahead of current schema version',
      customFields: {
        campaignheadline: 'Ahead headline',
        campaigneyebrow: 'Ahead eyebrow',
      },
      sections: [],
    }

    const batch = createCmsSchemaMigrationBatchReport({
      pages: [stalePage, missingVersionPage, invalidModelPage, aheadPage],
      localeInput: 'en',
      authoredContentModels: [upgradedModel],
    })
    const invalidModelReport = batch.pages.find(page => page.pageId === 'invalid-model-page')
    const missingVersionReport = batch.pages.find(page => page.pageId === 'missing-version-page')
    const aheadReport = batch.pages.find(page => page.pageId === 'ahead-page')
    const untouchedInvalidModelPage = applyCmsPageSchemaMigration({
      page: invalidModelPage,
      localeInput: 'en',
      authoredContentModels: [upgradedModel],
    })
    const untouchedAheadPage = applyCmsPageSchemaMigration({
      page: aheadPage,
      localeInput: 'en',
      authoredContentModels: [upgradedModel],
    })

    expect(batch.summary).toMatchObject({
      pageCount: 4,
      currentCount: 0,
      upgradeRequiredCount: 1,
      versionMissingCount: 1,
      aheadCount: 1,
      invalidModelCount: 1,
      changedPageCount: 2,
      addCount: 2,
      removeCount: 0,
      updateCount: 0,
    })
    expect(invalidModelReport?.status).toBe('invalid-model')
    expect(invalidModelReport?.targetVersion).toBeNull()
    expect(invalidModelReport?.canApply).toBe(false)
    expect(missingVersionReport?.status).toBe('version-missing')
    expect(missingVersionReport?.canApply).toBe(true)
    expect(aheadReport?.status).toBe('ahead')
    expect(aheadReport?.canApply).toBe(false)
    expect(aheadReport?.hasChanges).toBe(false)
    expect(untouchedInvalidModelPage).toEqual(invalidModelPage)
    expect(untouchedInvalidModelPage).not.toBe(invalidModelPage)
    expect(untouchedAheadPage).toEqual(aheadPage)
    expect(untouchedAheadPage).not.toBe(aheadPage)
  })
})