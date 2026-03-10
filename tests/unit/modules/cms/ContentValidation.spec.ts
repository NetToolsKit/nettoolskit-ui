/**
 * Tests/unit/modules/cms/Content Validation spec module.
 */
import { describe, expect, it } from 'vitest'
import { CmsBlockRegistry } from '../../../../src/modules/cms'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  createCmsAuthoredContentModel,
  createCmsPageSectionFromPreset,
  updateCmsAuthoredContentModel,
} from '../../../../src/modules/cms/white-label/content-models'
import { validateCmsContentPages } from '../../../../src/modules/cms/white-label/content-validation'
import { createCmsAuthoredBlockPresetFromBlock } from '../../../../src/modules/cms/white-label/block-presets'
import type { CmsPageSettings } from '../../../../src/modules/cms/white-label/types'
import { createLandingRegistry } from '../../../../landing-page/cms/landing.registry'

function clonePages(pages: CmsPageSettings[]): CmsPageSettings[] {
  return JSON.parse(JSON.stringify(pages)) as CmsPageSettings[]
}

describe('content-validation', () => {
  it('accepts the default page scaffold as valid content', () => {
    const settings = createDefaultWhiteLabelSettings()

    const result = validateCmsContentPages({
      pages: settings.pages,
      registry: createLandingRegistry(),
    })

    expect(result.valid).toBe(true)
    expect(result.errorCount).toBe(0)
    expect(result.summary.pageCount).toBe(1)
    expect(result.summary.publishedPagesCount).toBe(1)
    expect(result.summary.enabledSectionsCount).toBeGreaterThan(0)
    expect(result.summary.enabledBlocksCount).toBeGreaterThan(0)
  })

  it('flags duplicate paths and disallowed section presets', () => {
    const settings = createDefaultWhiteLabelSettings()
    const pages = clonePages(settings.pages)

    pages[0]?.sections.push(createCmsPageSectionFromPreset({
      presetId: 'metrics',
      existingSections: pages[0]?.sections ?? [],
      localeInput: 'en',
    }))

    pages.push({
      id: 'marketing-duplicate',
      contentModelId: 'landing-page',
      title: 'Marketing Duplicate',
      path: '/',
      status: 'draft',
      description: 'Duplicate route path',
      sections: [
        createCmsPageSectionFromPreset({
          presetId: 'hero',
          existingSections: [],
          localeInput: 'en',
        }),
      ],
    })

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.path.duplicate')
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.preset.not_allowed')
  })

  it('uses registry contracts to detect unregistered blocks and invalid props schemas', () => {
    const registry = new CmsBlockRegistry([
      {
        type: 'custom.hero',
        displayName: 'Custom Hero',
        category: 'content',
        validateProps: (props): props is { headline: string } => {
          return typeof props.headline === 'string' && props.headline.trim().length > 0
        },
      },
    ])

    const pages: CmsPageSettings[] = [
      {
        id: 'custom-page',
        contentModelId: 'blank-page',
        title: 'Custom Page',
        path: '/',
        status: 'published',
        description: 'Custom schema test',
        sections: [
          {
            id: 'hero',
            presetId: 'hero',
            label: 'Hero',
            enabled: true,
            blocks: [
              {
                id: 'hero-validity',
                type: 'custom.hero',
                enabled: true,
                props: { headline: '' },
              },
              {
                id: 'hero-missing',
                type: 'custom.unknown',
                enabled: true,
                props: {},
              },
            ],
          },
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry,
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.props.schema_invalid')
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.type.unregistered')
  })

  it('flags invalid and incompatible block presets', () => {
    const pages: CmsPageSettings[] = [
      {
        id: 'preset-page',
        contentModelId: 'landing-page',
        title: 'Preset Page',
        path: '/preset-page',
        status: 'draft',
        description: 'Preset validation',
        sections: [
          {
            id: 'hero',
            presetId: 'hero',
            label: 'Hero',
            enabled: true,
            blocks: [
              {
                id: 'hero-invalid-preset',
                type: 'landing.hero',
                presetId: 'not-registered' as never,
                enabled: true,
                props: {},
              },
              {
                id: 'hero-mismatched-preset',
                type: 'landing.hero',
                presetId: 'landing-footer-docs',
                enabled: true,
                props: {},
              },
            ],
          },
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.preset.invalid')
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.preset.type_mismatch')
  })

  it('flags pages that miss required section presets from their content model', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Campaign schema',
      description: 'Hero, features and footer are allowed',
      allowedPresets: ['hero', 'features', 'footer'],
      requiredPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
    })

    const pages: CmsPageSettings[] = [
      {
        id: 'campaign-page',
        contentModelId: authoredModel.id,
        title: 'Campaign Page',
        path: '/campaign',
        status: 'draft',
        description: 'Missing footer on purpose',
        sections: [
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
      authoredContentModels: [authoredModel],
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.required_preset.missing')
    expect(result.issues.some(issue => issue.message.includes('"footer"'))).toBe(true)
  })

  it('flags missing, stale and ahead content-model schema versions on pages', () => {
    const authoredModelV1 = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Versioned schema',
      description: 'Version diagnostics test',
      migrationNotes: 'Initial rollout',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Campaign headline',
          description: 'Primary headline',
          placeholder: 'Type the headline',
          required: true,
          defaultValue: 'Launch campaign',
        },
      ],
    })

    const authoredModelV2 = updateCmsAuthoredContentModel({
      model: authoredModelV1,
      localeInput: 'en',
      name: 'Versioned schema',
      description: 'Version diagnostics test',
      migrationNotes: 'Added footer requirement',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero', 'footer'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
      fields: authoredModelV1.fields,
    })

    const pages: CmsPageSettings[] = [
      {
        id: 'missing-version-page',
        contentModelId: authoredModelV2.id,
        title: 'Missing version page',
        path: '/missing-version',
        status: 'draft',
        description: 'Missing version field',
        sections: [
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
          createCmsPageSectionFromPreset({
            presetId: 'footer',
            existingSections: [],
            localeInput: 'en',
          }),
        ],
      },
      {
        id: 'stale-version-page',
        contentModelId: authoredModelV2.id,
        contentModelVersion: 1,
        title: 'Stale version page',
        path: '/stale-version',
        status: 'draft',
        description: 'Uses old schema version',
        sections: [
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
        ],
      },
      {
        id: 'ahead-version-page',
        contentModelId: authoredModelV2.id,
        contentModelVersion: 99,
        title: 'Ahead version page',
        path: '/ahead-version',
        status: 'draft',
        description: 'Uses schema version ahead of model',
        sections: [
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
          createCmsPageSectionFromPreset({
            presetId: 'footer',
            existingSections: [],
            localeInput: 'en',
          }),
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
      authoredContentModels: [authoredModelV2],
    })

    expect(result.issues.map(issue => issue.code)).toContain('pages.content_model.version.missing')
    expect(result.issues.map(issue => issue.code)).toContain('pages.content_model.version.stale')
    expect(result.issues.map(issue => issue.code)).toContain('pages.content_model.version.ahead')
    expect(result.issues.some(issue => issue.message.includes('Added footer requirement'))).toBe(true)
  })

  it('flags pages that exceed content-model composition limits', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Strict campaign schema',
      description: 'Only two enabled sections and one hero allowed',
      allowedPresets: ['hero', 'features', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'features'],
      recommendedPresets: ['hero'],
      maxSections: 2,
      sectionPresetLimits: {
        hero: 1,
      },
    })

    const pages: CmsPageSettings[] = [
      {
        id: 'strict-campaign-page',
        contentModelId: authoredModel.id,
        title: 'Strict Campaign Page',
        path: '/strict-campaign',
        status: 'published',
        description: 'Too many enabled sections on purpose',
        sections: [
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
          createCmsPageSectionFromPreset({
            presetId: 'features',
            existingSections: [],
            localeInput: 'en',
          }),
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
      authoredContentModels: [authoredModel],
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.limit.exceeded')
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.preset.limit.exceeded')
  })

  it('flags blocks that violate section preset contracts', () => {
    const heroPresetForCtaOnly = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'CTA scoped hero',
        },
      },
      existingPresets: [],
      localeInput: 'en',
      displayName: 'Hero preset',
      name: 'Hero preset scoped to CTA',
      category: 'layout',
      starterSectionPresets: ['cta'],
    })

    const pages: CmsPageSettings[] = [
      {
        id: 'section-contracts',
        contentModelId: 'landing-page',
        title: 'Section contracts',
        path: '/section-contracts',
        status: 'draft',
        description: 'Section contract violations',
        sections: [
          {
            id: 'footer',
            presetId: 'footer',
            label: 'Footer',
            enabled: true,
            blocks: [
              {
                id: 'footer-block-1',
                type: 'landing.footer',
                presetId: 'landing-footer-docs',
                enabled: true,
                props: {},
              },
              {
                id: 'footer-block-2',
                type: 'landing.footer',
                presetId: 'landing-footer-docs',
                enabled: true,
                props: {},
              },
            ],
          },
          {
            id: 'features',
            presetId: 'features',
            label: 'Features',
            enabled: true,
            blocks: [
              {
                id: 'features-block-1',
                type: 'landing.hero',
                presetId: heroPresetForCtaOnly.id,
                enabled: true,
                props: {},
              },
            ],
          },
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
      authoredBlockPresets: [heroPresetForCtaOnly],
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.limit.exceeded')
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.type.not_allowed_for_preset')
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.preset.not_allowed_for_section')
  })

  it('flags invalid custom field payloads against the authored content-model schema', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Schema validation',
      description: 'Model with custom field validation',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Campaign headline',
          description: 'Required headline',
          placeholder: 'Headline',
          required: true,
          defaultValue: 'Launch',
        },
        {
          id: 'audience',
          type: 'select',
          label: 'Audience',
          description: 'Target audience',
          placeholder: '',
          required: true,
          defaultValue: 'enterprise',
          options: [
            { value: 'enterprise', label: 'Enterprise' },
            { value: 'startup', label: 'Startup' },
          ],
        },
      ],
    })

    const pages: CmsPageSettings[] = [
      {
        id: 'schema-page',
        contentModelId: authoredModel.id,
        title: 'Schema Page',
        path: '/schema-page',
        status: 'draft',
        description: 'Broken schema fields on purpose',
        customFields: {
          audience: 'invalid-option',
          rogue: 'unexpected',
        },
        sections: [
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
      authoredContentModels: [authoredModel],
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.custom_fields.required')
    expect(result.issues.map(issue => issue.code)).toContain('pages.custom_fields.select.invalid')
    expect(result.issues.map(issue => issue.code)).toContain('pages.custom_fields.unknown')
  })

  it('validates repeatable field payloads and min/max constraints against the authored schema', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Advanced schema validation',
      description: 'Model with repeatable and constrained fields',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'bulletPoints',
          type: 'text',
          label: 'Bullet points',
          description: 'Key bullets',
          placeholder: 'One bullet per line',
          required: true,
          repeatable: true,
          min: 2,
          max: 3,
          defaultValue: ['Fast', 'Reliable'],
        },
        {
          id: 'audiences',
          type: 'select',
          label: 'Audiences',
          description: 'Target audiences',
          placeholder: '',
          required: false,
          repeatable: true,
          min: 1,
          max: 2,
          defaultValue: ['enterprise'],
          options: [
            { value: 'enterprise', label: 'Enterprise' },
            { value: 'startup', label: 'Startup' },
          ],
        },
        {
          id: 'headline',
          type: 'text',
          label: 'Headline',
          description: 'Primary headline',
          placeholder: '',
          required: false,
          repeatable: false,
          min: 5,
          max: 10,
          defaultValue: 'Launch',
        },
        {
          id: 'score',
          type: 'number',
          label: 'Score',
          description: 'Relevance score',
          placeholder: '',
          required: false,
          repeatable: false,
          min: 10,
          max: 20,
          defaultValue: '12',
        },
      ],
    })

    const pages: CmsPageSettings[] = [
      {
        id: 'advanced-schema-page',
        contentModelId: authoredModel.id,
        title: 'Advanced Schema Page',
        path: '/advanced-schema-page',
        status: 'draft',
        description: 'Broken constrained schema fields on purpose',
        customFields: {
          bulletpoints: ['Only one'],
          audiences: ['enterprise', 'invalid', 'startup'],
          headline: 'Tiny',
          score: 30,
        },
        sections: [
          createCmsPageSectionFromPreset({
            presetId: 'hero',
            existingSections: [],
            localeInput: 'en',
          }),
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
      authoredContentModels: [authoredModel],
    })

    expect(result.valid).toBe(false)
    expect(result.issues.some(issue => issue.code === 'pages.custom_fields.min' && issue.message.includes('Bullet points'))).toBe(true)
    expect(result.issues.some(issue => issue.code === 'pages.custom_fields.select.invalid' && issue.message.includes('Audiences'))).toBe(true)
    expect(result.issues.some(issue => issue.code === 'pages.custom_fields.max' && issue.message.includes('Audiences'))).toBe(true)
    expect(result.issues.some(issue => issue.code === 'pages.custom_fields.min' && issue.message.includes('Headline'))).toBe(true)
    expect(result.issues.some(issue => issue.code === 'pages.custom_fields.max' && issue.message.includes('Score'))).toBe(true)
  })

  it('requires conditional fields only when their visibility rule matches', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Conditional validation',
      description: 'Conditional required field validation',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'layoutMode',
          type: 'select',
          label: 'Layout mode',
          description: 'Controls promo visibility',
          placeholder: '',
          required: true,
          defaultValue: 'default',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'promo', label: 'Promo' },
          ],
        },
        {
          id: 'promoBadge',
          type: 'text',
          label: 'Promo badge',
          description: 'Required only on promo pages',
          placeholder: '',
          required: true,
          defaultValue: '',
          visibility: {
            source: 'field',
            fieldId: 'layoutmode',
            operator: 'equals',
            value: 'promo',
          },
        },
      ],
    })

    const basePage = {
      id: 'conditional-page',
      contentModelId: authoredModel.id,
      title: 'Conditional page',
      path: '/conditional-page',
      status: 'draft' as const,
      description: 'Conditional validation page',
      sections: [
        createCmsPageSectionFromPreset({
          presetId: 'hero',
          existingSections: [],
          localeInput: 'en',
        }),
      ],
    }

    const hiddenResult = validateCmsContentPages({
      pages: [
        {
          ...basePage,
          customFields: {
            layoutmode: 'default',
          },
        },
      ],
      registry: createLandingRegistry(),
      authoredContentModels: [authoredModel],
    })

    const visibleResult = validateCmsContentPages({
      pages: [
        {
          ...basePage,
          customFields: {
            layoutmode: 'promo',
          },
        },
      ],
      registry: createLandingRegistry(),
      authoredContentModels: [authoredModel],
    })

    expect(hiddenResult.issues.some(issue => issue.code === 'pages.custom_fields.required' && issue.message.includes('Promo badge'))).toBe(false)
    expect(visibleResult.issues.some(issue => issue.code === 'pages.custom_fields.required' && issue.message.includes('Promo badge'))).toBe(true)
  })

  it('flags missing linked reusable section and block references', () => {
    const pages: CmsPageSettings[] = [
      {
        id: 'missing-linked-section',
        contentModelId: 'landing-page',
        title: 'Missing linked section',
        path: '/missing-linked-section',
        status: 'draft',
        description: 'Broken linked section',
        sections: [
          {
            id: 'hero',
            presetId: 'hero',
            label: 'Hero',
            enabled: true,
            reusableMode: 'linked',
            reusableSourceId: 'missing-section',
            blocks: [],
          },
        ],
      },
      {
        id: 'missing-linked-block',
        contentModelId: 'landing-page',
        title: 'Missing linked block',
        path: '/missing-linked-block',
        status: 'draft',
        description: 'Broken linked block',
        sections: [
          {
            id: 'hero',
            presetId: 'hero',
            label: 'Hero',
            enabled: true,
            blocks: [
              {
                id: 'hero-block-1',
                type: 'landing.hero',
                enabled: true,
                reusableMode: 'linked',
                reusableSourceId: 'missing-block',
                props: {},
              },
            ],
          },
        ],
      },
    ]

    const result = validateCmsContentPages({
      pages,
      registry: createLandingRegistry(),
      reusableSections: [],
      reusableBlocks: [],
    })

    expect(result.valid).toBe(false)
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.reusable.link.not_found')
    expect(result.issues.map(issue => issue.code)).toContain('pages.sections.blocks.reusable.link.not_found')
  })
})