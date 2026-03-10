/**
 * Tests/unit/modules/cms/Content Models spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  filterCmsVisibleContentModelFields,
  coerceCmsContentModelFieldValue,
  createCmsAuthoredContentModel,
  createCmsPageCustomFieldsFromContentModel,
  createCmsPageSectionsFromContentModel,
  createCmsPageSectionFromPreset,
  detectCmsContentModelIdForPage,
  detectCmsSectionPresetId,
  getCmsContentModelFieldDefinitions,
  getCmsContentModelLastSchemaChangeAt,
  getCmsContentModelMigrationNotes,
  getCmsContentModelSchemaVersion,
  getCmsContentModelDefaultPageDescription,
  getCmsContentModelDefaultPagePathPrefix,
  getCmsContentModelDefaultPageTitle,
  getCmsContentModelMaxSections,
  getCmsContentModelSectionPresetLimitMap,
  getCmsSectionPresetAllowedBlockTypes,
  getCmsSectionPresetBlockLimits,
  getCmsSectionPresetDefinition,
  getDefaultCmsSectionPresetId,
  getCmsRequiredSectionPresetIds,
  getCmsStarterSectionPresetIds,
  isCmsBlockPresetAllowedForSectionPreset,
  isCmsBlockTypeAllowedForSectionPreset,
  listCmsSectionStarterPresetOptions,
  listCmsSectionPresetOptions,
  normalizeCmsPageCustomFieldsForContentModel,
  resolveDefaultCmsBlockTypeForSection,
  updateCmsAuthoredContentModel,
} from '../../../../src/modules/cms/white-label/content-models'
import {
  createCmsAuthoredBlockPresetFromBlock,
  getDefaultCmsBlockPresetIdForSectionPreset,
} from '../../../../src/modules/cms/white-label/block-presets'

describe('content-models', () => {
  it('filters section presets according to the selected content model', () => {
    const landingPresetIds = listCmsSectionPresetOptions('en', 'landing-page').map(option => option.value)
    const marketingPresetIds = listCmsSectionPresetOptions('en', 'marketing-page').map(option => option.value)

    expect(landingPresetIds).toContain('installation')
    expect(landingPresetIds).not.toContain('benefits')
    expect(marketingPresetIds).toContain('metrics')
    expect(marketingPresetIds).toContain('benefits')
    expect(marketingPresetIds).not.toContain('installation')
  })

  it('creates unique preset-based sections with deterministic block types', () => {
    const firstSection = createCmsPageSectionFromPreset({
      presetId: 'hero',
      existingSections: [],
      localeInput: 'en',
    })

    const secondSection = createCmsPageSectionFromPreset({
      presetId: 'hero',
      existingSections: [firstSection],
      localeInput: 'en',
    })

    expect(firstSection.id).toBe('hero')
    expect(firstSection.presetId).toBe('hero')
    expect(firstSection.blocks[0]?.type).toBe('landing.hero')
    expect(firstSection.blocks[0]?.presetId).toBe('landing-hero-product-launch')
    expect(firstSection.blocks[0]?.props).toMatchObject({
      title: 'Build page experiences faster',
    })
    expect(firstSection.blocks[0]?.localization?.props?.['pt-BR']).toMatchObject({
      title: 'Monte paginas mais rapido',
    })
    expect(secondSection.id).toBe('hero-2')
    expect(secondSection.blocks[0]?.id).toBe('hero-2-block-1')
  })

  it('detects presets and content models from persisted payloads', () => {
    const presetId = detectCmsSectionPresetId({
      sectionId: 'metrics',
      blockType: 'landing.stats',
    })

    const contentModelId = detectCmsContentModelIdForPage({
      title: 'Marketing',
      path: '/marketing',
      status: 'draft',
      description: '',
      sections: [
        {
          id: 'hero',
          presetId: 'hero',
          label: 'Hero',
          enabled: true,
          blocks: [{ id: 'hero-block-1', type: 'landing.hero', enabled: true, props: {} }],
        },
        {
          id: 'metrics',
          presetId: 'metrics',
          label: 'Metrics',
          enabled: true,
          blocks: [{ id: 'metrics-block-1', type: 'landing.stats', enabled: true, props: {} }],
        },
      ],
    })

    expect(presetId).toBe('metrics')
    expect(contentModelId).toBe('marketing-page')
  })

  it('keeps default preset/block helpers aligned for blank pages', () => {
    expect(getDefaultCmsSectionPresetId('blank-page')).toBe('hero')
    expect(getCmsRequiredSectionPresetIds('landing-page')).toEqual(['header', 'hero', 'footer'])
    expect(getCmsRequiredSectionPresetIds('marketing-page')).toEqual(['header', 'hero', 'cta', 'footer'])
    expect(getCmsRequiredSectionPresetIds('blank-page')).toEqual([])
    expect(getCmsStarterSectionPresetIds('landing-page')).toEqual(['header', 'hero', 'features', 'installation', 'footer'])
    expect(getCmsContentModelMaxSections('landing-page')).toBeNull()
    expect(getCmsContentModelSchemaVersion('landing-page')).toBe(1)
    expect(getCmsContentModelMigrationNotes('en', 'landing-page')).toBe('')
    expect(getCmsContentModelLastSchemaChangeAt('landing-page')).toBeNull()
    expect(getCmsContentModelDefaultPageTitle('en', 'landing-page')).toBe('Landing Page')
    expect(getCmsContentModelDefaultPageDescription('en', 'landing-page')).toBe('Primary public landing page.')
    expect(getCmsContentModelDefaultPagePathPrefix('landing-page')).toBe('/landing')
    expect(getCmsContentModelSectionPresetLimitMap('landing-page')).toEqual({
      header: 1,
      hero: 1,
      installation: 1,
      footer: 1,
    })
    expect(resolveDefaultCmsBlockTypeForSection('unknown', 'footer')).toBe('landing.footer')
  })

  it('creates starter section scaffolds from authored content models in declared order', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Campaign schema',
      description: 'A custom starter scaffold',
      allowedPresets: ['hero', 'features', 'footer'],
      requiredPresets: ['hero', 'footer'],
      starterPresets: ['features', 'hero', 'footer'],
      recommendedPresets: ['hero'],
      maxSections: 2,
      sectionPresetLimits: {
        hero: 1,
      },
      defaultPageTitle: 'Campaign default page',
      defaultPageDescription: 'Campaign default description.',
      defaultPagePathPrefix: '/campaign-default',
    })

    const sections = createCmsPageSectionsFromContentModel({
      contentModelId: authoredModel.id,
      localeInput: 'en',
      authoredModels: [authoredModel],
    })

    expect(sections.map(section => section.presetId)).toEqual(['features', 'hero'])
    expect(sections[0]?.blocks[0]?.presetId).toBe(getDefaultCmsBlockPresetIdForSectionPreset('features'))
    expect(sections[1]?.blocks[0]?.presetId).toBe(getDefaultCmsBlockPresetIdForSectionPreset('hero'))
    expect(getCmsContentModelDefaultPageTitle('en', authoredModel.id, [authoredModel])).toBe('Campaign default page')
    expect(getCmsContentModelDefaultPageDescription('en', authoredModel.id, [authoredModel])).toBe('Campaign default description.')
    expect(getCmsContentModelDefaultPagePathPrefix(authoredModel.id, [authoredModel])).toBe('/campaign-default')
  })

  it('resolves authored schema fields with group labels and explicit order', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Grouped schema',
      description: 'Groups fields for backend-oriented authoring',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Campaign headline',
          description: 'Primary campaign message',
          placeholder: 'Type a headline',
          group: 'Campaign',
          order: 2,
          required: true,
          defaultValue: 'Launch campaign',
        },
        {
          id: 'bulletPoints',
          type: 'textarea',
          label: 'Bullet points',
          description: 'Support copy',
          placeholder: 'One point per line',
          group: 'Content',
          order: 1,
          repeatable: true,
          defaultValue: ['Fast setup'],
        },
      ],
    })

    const fields = getCmsContentModelFieldDefinitions('en', authoredModel.id, [authoredModel])

    expect(fields.map(field => `${field.group}:${field.id}:${field.order}`)).toEqual([
      'Content:bulletpoints:1',
      'Campaign:campaignheadline:2',
    ])
  })

  it('filters schema fields using conditional visibility rules', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Conditional schema',
      description: 'Shows fields only when conditions match',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'layoutMode',
          type: 'select',
          label: 'Layout mode',
          description: 'Controls dependent fields',
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
          description: 'Shown only for promo pages',
          placeholder: '',
          required: false,
          defaultValue: '',
          visibility: {
            source: 'field',
            fieldId: 'layoutmode',
            operator: 'equals',
            value: 'promo',
          },
        },
        {
          id: 'publishNotes',
          type: 'textarea',
          label: 'Publish notes',
          description: 'Shown only after publication',
          placeholder: '',
          required: false,
          defaultValue: '',
          visibility: {
            source: 'page-status',
            operator: 'equals',
            value: 'published',
          },
        },
      ],
    })

    const fields = getCmsContentModelFieldDefinitions('en', authoredModel.id, [authoredModel])

    expect(filterCmsVisibleContentModelFields(fields, {
      pageStatus: 'draft',
      customFields: { layoutmode: 'default' },
    }).map(field => field.id)).toEqual(['layoutmode'])

    expect(filterCmsVisibleContentModelFields(fields, {
      pageStatus: 'draft',
      customFields: { layoutmode: 'promo' },
    }).map(field => field.id)).toEqual(['layoutmode', 'promobadge'])

    expect(filterCmsVisibleContentModelFields(fields, {
      pageStatus: 'published',
      customFields: { layoutmode: 'default' },
    }).map(field => field.id)).toEqual(['layoutmode', 'publishnotes'])
  })

  it('resolves authored schema version and migration metadata with locale-aware notes', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Versioned campaign',
      description: 'Campaign schema metadata',
      migrationNotes: 'Initial rollout',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
    })

    const localizedModel = updateCmsAuthoredContentModel({
      model: authoredModel,
      localeInput: 'pt-BR',
      name: 'Campanha versionada',
      description: 'Metadados da campanha',
      migrationNotes: 'Lancamento inicial',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
    })

    expect(getCmsContentModelSchemaVersion(localizedModel.id, [localizedModel])).toBe(1)
    expect(getCmsContentModelMigrationNotes('en', localizedModel.id, [localizedModel])).toBe('Initial rollout')
    expect(getCmsContentModelMigrationNotes('pt-BR', localizedModel.id, [localizedModel])).toBe('Lancamento inicial')
    expect(getCmsContentModelLastSchemaChangeAt(localizedModel.id, [localizedModel])).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('filters starter preset options by section compatibility and authored preset links', () => {
    const compatiblePreset = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Authored Hero',
        },
      },
      existingPresets: [],
      localeInput: 'en',
      displayName: 'Landing Hero',
      name: 'Authored Hero Preset',
      category: 'layout',
      starterSectionPresets: ['hero'],
    })

    const incompatiblePreset = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-2',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'CTA only Hero',
        },
      },
      existingPresets: [compatiblePreset],
      localeInput: 'en',
      displayName: 'Landing Hero',
      name: 'CTA Hero Preset',
      category: 'layout',
      starterSectionPresets: ['cta'],
    })

    const starterOptions = listCmsSectionStarterPresetOptions('en', 'hero', [compatiblePreset, incompatiblePreset])

    expect(starterOptions.some(option => option.value === compatiblePreset.id)).toBe(true)
    expect(starterOptions.some(option => option.value === incompatiblePreset.id)).toBe(false)
    expect(starterOptions.find(option => option.value === compatiblePreset.id)).toMatchObject({
      source: 'authored',
      category: 'layout',
      isDefault: false,
    })
    expect(starterOptions.find(option => option.value === 'landing-hero-product-launch')).toMatchObject({
      source: 'builtin',
      isDefault: true,
    })
    expect(starterOptions.at(-1)?.value).toBe('custom')
  })

  it('exposes section composition contracts for allowed block types and limits', () => {
    const featuresDefinition = getCmsSectionPresetDefinition('en', 'features')
    const footerDefinition = getCmsSectionPresetDefinition('en', 'footer')

    expect(featuresDefinition.allowedBlockTypes).toEqual([
      'landing.features',
      'landing.stats',
      'landing.cta',
    ])
    expect(featuresDefinition.slots).toEqual([
      expect.objectContaining({
        id: 'main',
        minBlocks: 1,
        maxBlocks: 4,
        allowedBlockTypes: ['landing.features', 'landing.stats', 'landing.cta'],
      }),
    ])
    expect(getCmsSectionPresetAllowedBlockTypes('footer')).toEqual(['landing.footer'])
    expect(getCmsSectionPresetBlockLimits('footer')).toEqual({
      minBlocks: 1,
      maxBlocks: 1,
    })
    expect(isCmsBlockTypeAllowedForSectionPreset('features', 'landing.stats')).toBe(true)
    expect(isCmsBlockTypeAllowedForSectionPreset('features', 'landing.hero')).toBe(false)
    expect(isCmsBlockPresetAllowedForSectionPreset('features', 'landing-features-component-library')).toBe(true)
    expect(isCmsBlockPresetAllowedForSectionPreset('features', 'landing-hero-product-launch')).toBe(false)
    expect(footerDefinition.maxBlocks).toBe(1)
  })

  it('creates sections seeded from authored starter presets', () => {
    const authoredPreset = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Authored Hero Title',
          subtitle: 'Authored Hero Subtitle',
        },
      },
      existingPresets: [],
      localeInput: 'en',
      displayName: 'Landing Hero',
      name: 'Authored Hero Preset',
      category: 'layout',
      starterSectionPresets: ['hero'],
    })

    const authoredSection = createCmsPageSectionFromPreset({
      presetId: 'hero',
      existingSections: [],
      localeInput: 'en',
      starterPresetId: authoredPreset.id,
      authoredPresets: [authoredPreset],
    })

    expect(authoredSection.blocks[0]?.presetId).toBe(authoredPreset.id)
    expect(authoredSection.blocks[0]?.props).toMatchObject({
      title: 'Authored Hero Title',
      subtitle: 'Authored Hero Subtitle',
    })
  })

  it('resolves content-model schema fields and seeds normalized page custom field defaults', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Schema page',
      description: 'Model with page-level schema fields',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Campaign headline',
          description: 'Primary page headline',
          placeholder: 'Type the campaign headline',
          required: true,
          defaultValue: 'Launch campaign',
        },
        {
          id: 'showBanner',
          type: 'toggle',
          label: 'Show banner',
          description: 'Controls visibility',
          placeholder: '',
          required: false,
          defaultValue: 'true' as never,
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

    const fieldDefinitions = getCmsContentModelFieldDefinitions('en', authoredModel.id, [authoredModel])
    const defaults = createCmsPageCustomFieldsFromContentModel(authoredModel.id, 'en', [authoredModel])
    const normalized = normalizeCmsPageCustomFieldsForContentModel({
      campaignheadline: 'Custom launch',
      showbanner: 'false',
      audience: 'startup',
      unknownField: 'ignored',
    }, authoredModel.id, 'en', [authoredModel])

    expect(fieldDefinitions).toEqual([
      expect.objectContaining({
        id: 'campaignheadline',
        type: 'text',
        defaultValue: 'Launch campaign',
      }),
      expect.objectContaining({
        id: 'showbanner',
        type: 'toggle',
        defaultValue: true,
      }),
      expect.objectContaining({
        id: 'audience',
        type: 'select',
        defaultValue: 'enterprise',
        options: [
          { value: 'enterprise', label: 'Enterprise' },
          { value: 'startup', label: 'Startup' },
        ],
      }),
    ])
    expect(defaults).toEqual({
      campaignheadline: 'Launch campaign',
      showbanner: true,
      audience: 'enterprise',
    })
    expect(normalized).toEqual({
      campaignheadline: 'Custom launch',
      showbanner: false,
      audience: 'startup',
    })
    expect(coerceCmsContentModelFieldValue(fieldDefinitions[1]!, 'true')).toBe(true)
    expect(coerceCmsContentModelFieldValue(fieldDefinitions[2]!, 'invalid')).toBe('enterprise')
  })

  it('supports repeatable field defaults, constraints and locale-aware metadata resolution', () => {
    const authoredModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Localized schema',
      description: 'Model with repeatable fields',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'bulletPoints',
          type: 'text',
          label: 'Bullet points',
          description: 'Key benefits',
          placeholder: 'One point per line',
          required: true,
          repeatable: true,
          min: 2,
          max: 4,
          defaultValue: ['Fast', 'Flexible'],
        },
        {
          id: 'score',
          type: 'number',
          label: 'Score',
          description: 'Confidence score',
          placeholder: '10',
          required: false,
          repeatable: false,
          min: 1,
          max: 10,
          defaultValue: '7',
        },
      ],
    })

    const localizedModel = updateCmsAuthoredContentModel({
      model: authoredModel,
      localeInput: 'pt-BR',
      name: authoredModel.name,
      description: authoredModel.description,
      allowedPresets: authoredModel.allowedPresets,
      requiredPresets: authoredModel.requiredPresets,
      starterPresets: authoredModel.starterPresets,
      recommendedPresets: authoredModel.recommendedPresets,
      maxSections: authoredModel.maxSections,
      sectionPresetLimits: authoredModel.sectionPresetLimits,
      defaultPageTitle: authoredModel.defaultPageTitle,
      defaultPageDescription: authoredModel.defaultPageDescription,
      defaultPagePathPrefix: authoredModel.defaultPagePathPrefix,
      fields: [
        {
          id: 'bulletPoints',
          type: 'text',
          label: 'Pontos principais',
          description: 'Beneficios chave',
          placeholder: 'Um ponto por linha',
          required: true,
          repeatable: true,
          min: 2,
          max: 4,
          defaultValue: ['Fast', 'Flexible'],
        },
        {
          id: 'score',
          type: 'number',
          label: 'Pontuacao',
          description: 'Pontuacao de confianca',
          placeholder: '10',
          required: false,
          repeatable: false,
          min: 1,
          max: 10,
          defaultValue: '7',
        },
      ],
    })

    const englishFields = getCmsContentModelFieldDefinitions('en', localizedModel.id, [localizedModel])
    const portugueseFields = getCmsContentModelFieldDefinitions('pt-BR', localizedModel.id, [localizedModel])
    const defaults = createCmsPageCustomFieldsFromContentModel(localizedModel.id, 'pt-BR', [localizedModel])
    const normalized = normalizeCmsPageCustomFieldsForContentModel({
      bulletpoints: ['Fast', 'Flexible', 'Accessible'],
      score: '11',
      rogue: 'ignored',
    }, localizedModel.id, 'pt-BR', [localizedModel])

    expect(englishFields[0]).toEqual(expect.objectContaining({
      id: 'bulletpoints',
      label: 'Bullet points',
      description: 'Key benefits',
      placeholder: 'One point per line',
      repeatable: true,
      min: 2,
      max: 4,
      defaultValue: ['Fast', 'Flexible'],
    }))
    expect(portugueseFields[0]).toEqual(expect.objectContaining({
      id: 'bulletpoints',
      label: 'Pontos principais',
      description: 'Beneficios chave',
      placeholder: 'Um ponto por linha',
      repeatable: true,
      min: 2,
      max: 4,
      defaultValue: ['Fast', 'Flexible'],
    }))
    expect(defaults).toEqual({
      bulletpoints: ['Fast', 'Flexible'],
      score: 7,
    })
    expect(normalized).toEqual({
      bulletpoints: ['Fast', 'Flexible', 'Accessible'],
      score: 11,
    })
    expect(coerceCmsContentModelFieldValue(portugueseFields[0]!, 'Single value')).toEqual(['Single value'])
    expect(coerceCmsContentModelFieldValue(portugueseFields[0]!, ['Fast', '', 'Flexible'])).toEqual(['Fast', 'Flexible'])
  })

  it('keeps authored starter preset localized props when seeding sections for another locale', () => {
    const authoredPreset = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Authored Hero Title',
          subtitle: 'Authored Hero Subtitle',
        },
        localization: {
          props: {
            'pt-BR': {
              title: 'Titulo authored',
              subtitle: 'Subtitulo authored',
            },
          },
        },
      },
      existingPresets: [],
      localeInput: 'en',
      displayName: 'Landing Hero',
      name: 'Authored Hero Preset',
      category: 'layout',
      starterSectionPresets: ['hero'],
    })

    const authoredSection = createCmsPageSectionFromPreset({
      presetId: 'hero',
      existingSections: [],
      localeInput: 'pt-BR',
      starterPresetId: authoredPreset.id,
      authoredPresets: [authoredPreset],
    })

    expect(authoredSection.blocks[0]?.props).toMatchObject({
      title: 'Authored Hero Title',
      subtitle: 'Authored Hero Subtitle',
    })
    expect(authoredSection.blocks[0]?.localization?.props?.['pt-BR']).toMatchObject({
      title: 'Titulo authored',
      subtitle: 'Subtitulo authored',
    })
  })
})