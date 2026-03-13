/**
 * Tests/unit/modules/cms/Replacement Assistant spec module.
 */
import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  applyCmsDeprecatedEntityReplacement,
  previewCmsDeprecatedEntityReplacement,
} from '../../../../src/modules/cms/white-label/replacement-assistant'

describe('white-label.replacement-assistant', () => {
  it('applies reusable-block replacements across pages, reusable sections and authored presets', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.authoredBlockPresets = [
      {
        id: 'authored:preset-derived',
        name: 'Derived preset',
        description: 'Derived preset',
        category: 'hero',
        type: 'landing.hero',
        sourceReusableBlockId: 'reusable-block:legacy',
        starterSectionPresets: ['hero'],
        props: {},
      },
    ]
    settings.reusableBlocks = [
      {
        id: 'reusable-block:legacy',
        name: 'Legacy linked block',
        description: 'Legacy block',
        category: 'hero',
        type: 'landing.hero',
        props: {},
      },
      {
        id: 'reusable-block:replacement',
        name: 'Replacement linked block',
        description: 'Replacement block',
        category: 'hero',
        type: 'landing.hero',
        props: {},
      },
    ]
    settings.reusableSections = [
      {
        id: 'reusable-section:hero',
        name: 'Reusable hero',
        description: 'Hero section',
        category: 'hero',
        contentModelId: 'landing-page',
        presetId: 'hero',
        label: 'Hero',
        enabled: true,
        blocks: [
          {
            id: 'section-block-1',
            type: 'landing.hero',
            enabled: true,
            reusableMode: 'linked',
            reusableSourceId: 'reusable-block:legacy',
            props: {},
          },
        ],
      },
    ]
    settings.pages = [
      {
        ...settings.pages[0]!,
        id: 'landing-main',
        title: 'Landing main',
        path: '/landing-main',
        sections: [
          {
            id: 'hero-1',
            presetId: 'hero',
            label: 'Hero',
            enabled: true,
            blocks: [
              {
                id: 'page-block-1',
                type: 'landing.hero',
                enabled: true,
                reusableMode: 'linked',
                reusableSourceId: 'reusable-block:legacy',
                props: {},
              },
            ],
          },
        ],
      },
    ]

    const preview = previewCmsDeprecatedEntityReplacement({
      targetKind: 'reusable-block',
      entityId: 'reusable-block:legacy',
      replacementEntityId: 'reusable-block:replacement',
      pages: settings.pages,
      authoredContentModels: settings.authoredContentModels,
      authoredBlockPresets: settings.authoredBlockPresets,
      reusableBlocks: settings.reusableBlocks,
      reusableSections: settings.reusableSections,
    })

    expect(preview).toMatchObject({
      canApply: true,
      pageReferences: 1,
      reusableSectionReferences: 1,
      authoredPresetReferences: 1,
      totalReferences: 3,
    })

    const result = applyCmsDeprecatedEntityReplacement({
      targetKind: 'reusable-block',
      entityId: 'reusable-block:legacy',
      replacementEntityId: 'reusable-block:replacement',
      pages: settings.pages,
      authoredContentModels: settings.authoredContentModels,
      authoredBlockPresets: settings.authoredBlockPresets,
      reusableBlocks: settings.reusableBlocks,
      reusableSections: settings.reusableSections,
    })

    expect(result.pages[0]?.sections[0]?.blocks[0]?.reusableSourceId).toBe('reusable-block:replacement')
    expect(result.reusableSections[0]?.blocks[0]?.reusableSourceId).toBe('reusable-block:replacement')
    expect(result.authoredBlockPresets[0]?.sourceReusableBlockId).toBe('reusable-block:replacement')
    expect(result.totalReferences).toBe(3)
  })

  it('applies authored block preset replacements across page, reusable and authored preset references', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.authoredBlockPresets = [
      {
        id: 'authored:preset-legacy',
        name: 'Legacy preset',
        description: 'Legacy preset',
        category: 'hero',
        type: 'landing.hero',
        starterSectionPresets: ['hero'],
        props: {},
      },
      {
        id: 'authored:preset-replacement',
        name: 'Replacement preset',
        description: 'Replacement preset',
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
        sourcePresetId: 'authored:preset-legacy',
        starterSectionPresets: ['hero'],
        props: {},
      },
    ]
    settings.reusableBlocks = [
      {
        id: 'reusable-block:hero',
        name: 'Reusable hero',
        description: 'Reusable hero block',
        category: 'hero',
        type: 'landing.hero',
        presetId: 'authored:preset-legacy',
        props: {},
      },
    ]
    settings.reusableSections = [
      {
        id: 'reusable-section:hero',
        name: 'Reusable hero',
        description: 'Hero section',
        category: 'hero',
        contentModelId: 'landing-page',
        presetId: 'hero',
        label: 'Hero',
        enabled: true,
        blocks: [
          {
            id: 'section-block-1',
            type: 'landing.hero',
            presetId: 'authored:preset-legacy',
            enabled: true,
            props: {},
          },
        ],
      },
    ]
    settings.pages = [
      {
        ...settings.pages[0]!,
        id: 'landing-main',
        title: 'Landing main',
        path: '/landing-main',
        sections: [
          {
            id: 'hero-1',
            presetId: 'hero',
            label: 'Hero',
            enabled: true,
            blocks: [
              {
                id: 'page-block-1',
                type: 'landing.hero',
                presetId: 'authored:preset-legacy',
                enabled: true,
                props: {},
              },
            ],
          },
        ],
      },
    ]

    const result = applyCmsDeprecatedEntityReplacement({
      targetKind: 'authored-block-preset',
      entityId: 'authored:preset-legacy',
      replacementEntityId: 'authored:preset-replacement',
      pages: settings.pages,
      authoredContentModels: settings.authoredContentModels,
      authoredBlockPresets: settings.authoredBlockPresets,
      reusableBlocks: settings.reusableBlocks,
      reusableSections: settings.reusableSections,
    })

    expect(result.pages[0]?.sections[0]?.blocks[0]?.presetId).toBe('authored:preset-replacement')
    expect(result.reusableSections[0]?.blocks[0]?.presetId).toBe('authored:preset-replacement')
    expect(result.reusableBlocks[0]?.presetId).toBe('authored:preset-replacement')
    expect(result.authoredBlockPresets[2]?.sourcePresetId).toBe('authored:preset-replacement')
    expect(result).toMatchObject({
      pageReferences: 1,
      reusableSectionReferences: 1,
      reusableBlockReferences: 1,
      authoredPresetReferences: 1,
      totalReferences: 4,
    })
  })

  it('returns a non-applicable summary when replacement is missing or unchanged', () => {
    const settings = createDefaultWhiteLabelSettings()

    expect(previewCmsDeprecatedEntityReplacement({
      targetKind: 'reusable-section',
      entityId: 'reusable-section:legacy',
      replacementEntityId: '',
      pages: settings.pages,
      authoredContentModels: settings.authoredContentModels,
      authoredBlockPresets: settings.authoredBlockPresets,
      reusableBlocks: settings.reusableBlocks,
      reusableSections: settings.reusableSections,
    })).toMatchObject({
      canApply: false,
      totalReferences: 0,
    })

    expect(previewCmsDeprecatedEntityReplacement({
      targetKind: 'reusable-section',
      entityId: 'reusable-section:legacy',
      replacementEntityId: 'reusable-section:legacy',
      pages: settings.pages,
      authoredContentModels: settings.authoredContentModels,
      authoredBlockPresets: settings.authoredBlockPresets,
      reusableBlocks: settings.reusableBlocks,
      reusableSections: settings.reusableSections,
    })).toMatchObject({
      canApply: false,
      totalReferences: 0,
    })
  })
})