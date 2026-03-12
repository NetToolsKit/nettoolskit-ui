/**
 * Tests/unit/modules/cms/Locale Coverage spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  createCmsAuthoredContentModel,
  createCmsPageSectionFromPreset,
  getCmsContentModelSchemaVersion,
  updateCmsAuthoredContentModel,
} from '../../../../src/modules/cms/white-label/content-models'
import { resolveCmsLocaleCoverageMatrix } from '../../../../src/modules/cms/white-label/locale-coverage'
import { resolveCmsPreviewSnapshot } from '../../../../src/modules/cms/white-label/preview'
import { createCmsReusableBlockFromBlock } from '../../../../src/modules/cms/white-label/reusable-blocks'
import { createCmsReusableSectionFromSection } from '../../../../src/modules/cms/white-label/reusable-sections'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelFieldPresetSettings,
} from '../../../../src/modules/cms/white-label/types'

describe('cms.locale-coverage', () => {
  it('returns a locale coverage matrix with complete english coverage and partial pt-BR coverage', () => {
    const settings = createDefaultWhiteLabelSettings()

    const englishModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Campaign page',
      description: 'Campaign-focused landing model',
      defaultPageTitle: 'Campaign page',
      defaultPageDescription: 'English campaign description',
      defaultPagePathPrefix: '/campaign',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Campaign headline',
          description: 'Primary campaign headline',
          placeholder: 'Type the campaign headline',
          group: 'Campaign',
          order: 1,
          required: true,
          defaultValue: 'Spring launch',
        },
        {
          id: 'campaignSlug',
          type: 'url',
          label: 'Campaign slug',
          description: 'Canonical campaign path',
          placeholder: '/spring-launch',
          group: 'SEO',
          order: 2,
          required: true,
          defaultValue: '/spring-launch',
        },
      ],
    })

    const localizedModel = updateCmsAuthoredContentModel({
      model: englishModel,
      localeInput: 'pt-BR',
      name: 'Pagina de campanha',
      description: 'Modelo de landing para campanha',
      defaultPageTitle: 'Pagina de campanha',
      defaultPageDescription: '',
      defaultPagePathPrefix: '/campanha',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Titulo da campanha',
          description: 'Titulo principal da campanha',
          placeholder: 'Digite o titulo da campanha',
          group: 'Campanha',
          order: 1,
          required: true,
          defaultValue: 'Spring launch',
        },
        {
          id: 'campaignSlug',
          type: 'url',
          label: 'Campaign slug',
          description: 'Canonical campaign path',
          placeholder: '/spring-launch',
          group: 'SEO',
          order: 2,
          required: true,
          defaultValue: '/spring-launch',
        },
      ],
    })

    const heroSection = createCmsPageSectionFromPreset({
      presetId: 'hero',
      existingSections: [],
      localeInput: 'en',
    })
    heroSection.customFields = {
      anchorid: 'hero-main',
    }
    heroSection.localization = {
      label: {
        'pt-BR': 'Hero principal',
      },
    }

    settings.authoredContentModels = [localizedModel]
    settings.pages = [{
      id: 'campaign-page',
      contentModelId: localizedModel.id,
      contentModelVersion: getCmsContentModelSchemaVersion(localizedModel.id, [localizedModel]),
      title: 'Campaign page',
      path: '/campaign',
      status: 'draft',
      description: 'English authored page description',
      customFields: {
        campaignheadline: 'Spring launch',
        campaignslug: '/spring-launch',
      },
      localization: {
        title: {
          'pt-BR': 'Pagina de campanha',
        },
        fields: {
          'pt-BR': {
            campaignheadline: 'Lancamento de primavera',
          },
        },
      },
      sections: [heroSection],
    }]

    const authoredFieldPreset: CmsAuthoredContentModelFieldPresetSettings = {
      id: 'field-preset:campaign-slug',
      name: 'Campaign slug preset',
      description: 'Reusable slug field',
      category: 'seo',
      field: {
        id: 'campaignSlug',
        type: 'url',
        label: 'Campaign slug',
        description: 'Canonical campaign path',
        placeholder: '/spring-launch',
        group: 'SEO',
        order: 1,
        required: true,
        repeatable: false,
        defaultValue: '/spring-launch',
        localization: {
          label: {
            'pt-BR': 'Slug da campanha',
          },
        },
      },
      localization: {
        name: {
          'pt-BR': 'Preset slug da campanha',
        },
      },
      archivedAt: null,
    }

    const authoredBlockPreset: CmsAuthoredBlockPresetSettings = {
      id: 'authored:hero-proof',
      name: 'Hero proof preset',
      description: 'Reusable hero proof block preset',
      category: 'hero',
      type: 'landing.hero',
      starterSectionPresets: ['hero'],
      props: {
        title: 'Hero proof',
      },
      localization: {
        name: {
          'pt-BR': 'Preset hero prova',
        },
      },
      archivedAt: null,
    }

    settings.authoredContentModelFieldPresets = [authoredFieldPreset]
    settings.authoredBlockPresets = [authoredBlockPreset]

    const reusableBlock = createCmsReusableBlockFromBlock({
      block: heroSection.blocks[0]!,
      existingBlocks: [],
      displayName: 'Reusable hero block',
      category: 'hero',
    })
    reusableBlock.description = 'Reusable block for campaign hero'

    const reusableSection = createCmsReusableSectionFromSection({
      page: settings.pages[0]!,
      section: heroSection,
      existingSections: [],
    })
    reusableSection.name = 'Reusable hero section'
    reusableSection.description = 'Reusable hero section for campaigns'
    reusableSection.customFields = {
      anchorid: 'reusable-hero',
    }
    reusableSection.localization = {
      label: {
        'pt-BR': 'Secao hero reutilizavel',
      },
    }

    settings.reusableBlocks = [reusableBlock]
    settings.reusableSections = [reusableSection]

    const preview = resolveCmsPreviewSnapshot(settings, {
      source: 'draft',
      localeInput: 'en',
    })
    const matrix = resolveCmsLocaleCoverageMatrix(preview)

    expect(matrix).toHaveLength(2)

    const englishCoverage = matrix.find(entry => entry.locale === 'en')
    const portugueseCoverage = matrix.find(entry => entry.locale === 'pt-BR')

    expect(englishCoverage).toEqual(expect.objectContaining({
      status: 'complete',
      missing: 0,
    }))

    expect(portugueseCoverage).toBeDefined()
    expect(portugueseCoverage?.status).toBe('partial')
    expect(portugueseCoverage?.categories.pages.missing).toBeGreaterThan(0)
    expect(portugueseCoverage?.categories.fields.missing).toBeGreaterThan(0)
    expect(portugueseCoverage?.categories['reusable-content'].missing).toBeGreaterThan(0)
    expect(portugueseCoverage?.missingEntries).toEqual(expect.arrayContaining([
      expect.objectContaining({
        label: 'Campaign page',
        fieldLabel: 'Description',
      }),
      expect.objectContaining({
        label: 'Reusable hero block',
        fieldLabel: 'Reusable block description',
      }),
      expect.objectContaining({
        label: 'Campaign page',
        fieldLabel: 'Default page description',
      }),
    ]))
  })

  it('returns an empty matrix when no preview snapshot is available', () => {
    expect(resolveCmsLocaleCoverageMatrix(null)).toEqual([])
  })
})