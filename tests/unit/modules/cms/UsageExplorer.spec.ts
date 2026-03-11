/**
 * Tests/unit/modules/cms/UsageExplorer spec module.
 */
import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import { collectCmsEntityUsageIndex } from '../../../../src/modules/cms/white-label/usage-explorer'

describe('white-label.usage-explorer', () => {
  it('tracks authored content-model usage across pages and reusable sections', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.authoredContentModels = [
      {
        id: 'authored-model:campaign',
        name: 'Campaign',
        description: 'Campaign schema',
        defaultPageTitle: 'Campaign page',
        defaultPageDescription: 'Campaign page description',
        defaultPagePathPrefix: '/campaign',
        schemaVersion: 1,
        allowedPresets: ['hero', 'cta'],
        requiredPresets: [],
        starterPresets: ['hero'],
        recommendedPresets: ['hero'],
        maxSections: null,
        sectionPresetLimits: {},
      },
    ]

    settings.pages = [
      {
        ...settings.pages[0]!,
        id: 'campaign-page',
        title: 'Campaign page',
        path: '/campaign-page',
        contentModelId: 'authored-model:campaign',
      },
    ]

    settings.reusableSections = [
      {
        id: 'campaign-hero',
        name: 'Campaign hero',
        description: 'Reusable hero section',
        category: 'hero',
        contentModelId: 'authored-model:campaign',
        presetId: 'hero',
        label: 'Campaign Hero',
        enabled: true,
        blocks: [],
      },
    ]

    const usageIndex = collectCmsEntityUsageIndex(settings)
    const summary = usageIndex.contentModels.get('authored-model:campaign')

    expect(summary).toMatchObject({
      pageReferences: 1,
      reusableSectionReferences: 1,
      totalReferences: 2,
    })
    expect(summary?.references.map(reference => reference.source)).toEqual([
      'page',
      'reusable-section',
    ])
  })

  it('tracks authored preset, reusable block and reusable section impact together', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.authoredBlockPresets = [
      {
        id: 'authored:preset-base',
        name: 'Base preset',
        description: 'Base preset',
        category: 'hero',
        type: 'landing.hero',
        starterSectionPresets: ['hero'],
        props: {},
      },
      {
        id: 'authored:preset-derived',
        name: 'Derived preset',
        description: 'Derived preset',
        category: 'hero',
        type: 'landing.hero',
        sourcePresetId: 'authored:preset-base',
        sourceReusableBlockId: 'reusable-hero',
        starterSectionPresets: ['hero'],
        props: {},
      },
    ]

    settings.reusableBlocks = [
      {
        id: 'reusable-hero',
        name: 'Reusable hero',
        description: 'Reusable hero block',
        category: 'hero',
        type: 'landing.hero',
        presetId: 'authored:preset-base',
        props: {},
      },
    ]

    settings.reusableSections = [
      {
        id: 'reusable-section-hero',
        name: 'Reusable section hero',
        description: 'Reusable section',
        category: 'hero',
        contentModelId: 'landing-page',
        presetId: 'hero',
        label: 'Hero',
        enabled: true,
        blocks: [
          {
            id: 'section-linked-block',
            type: 'landing.hero',
            presetId: 'authored:preset-base',
            enabled: true,
            reusableMode: 'linked',
            reusableSourceId: 'reusable-hero',
            props: {},
          },
        ],
      },
    ]

    settings.pages = [
      {
        ...settings.pages[0]!,
        id: 'landing-page-1',
        title: 'Landing page 1',
        path: '/landing-1',
        contentModelId: 'landing-page',
        sections: [
          {
            id: 'hero-1',
            presetId: 'hero',
            label: 'Hero',
            enabled: true,
            reusableMode: 'linked',
            reusableSourceId: 'reusable-section-hero',
            blocks: [
              {
                id: 'page-linked-block',
                type: 'landing.hero',
                presetId: 'authored:preset-base',
                enabled: true,
                reusableMode: 'linked',
                reusableSourceId: 'reusable-hero',
                props: {},
              },
            ],
          },
        ],
      },
    ]

    const usageIndex = collectCmsEntityUsageIndex(settings)
    const presetSummary = usageIndex.authoredBlockPresets.get('authored:preset-base')
    const reusableBlockSummary = usageIndex.reusableBlocks.get('reusable-hero')
    const reusableSectionSummary = usageIndex.reusableSections.get('reusable-section-hero')

    expect(presetSummary).toMatchObject({
      pageReferences: 1,
      reusableSectionReferences: 1,
      reusableBlockReferences: 1,
      authoredPresetReferences: 1,
      totalReferences: 4,
    })
    expect(reusableBlockSummary).toMatchObject({
      pageReferences: 1,
      reusableSectionReferences: 1,
      authoredPresetReferences: 1,
      totalReferences: 3,
    })
    expect(reusableSectionSummary).toMatchObject({
      pageReferences: 1,
      totalReferences: 1,
    })
  })
})