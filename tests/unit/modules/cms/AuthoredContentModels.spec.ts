/**
 * Tests/unit/modules/cms/Authored Content Models spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  createCmsAuthoredContentModel,
  detectCmsContentModelIdForPage,
  getCmsContentModelFieldDefinitions,
  getCmsContentModelDefaultPageDescription,
  getCmsContentModelDefaultPagePathPrefix,
  getCmsContentModelDefaultPageTitle,
  getCmsContentModelDescription,
  getCmsContentModelLastSchemaChangeAt,
  getCmsContentModelLabel,
  getCmsContentModelMaxSections,
  getCmsContentModelMigrationNotes,
  getCmsContentModelSchemaVersion,
  getCmsContentModelSectionPresetLimitMap,
  getCmsRequiredSectionPresetIds,
  getCmsStarterSectionPresetIds,
  getDefaultCmsSectionPresetId,
  listCmsContentModelOptions,
  listCmsSectionPresetOptions,
  normalizeCmsAuthoredContentModels,
  updateCmsAuthoredContentModel,
} from '../../../../src/modules/cms/white-label/content-models'

describe('authored-content-models', () => {
  it('creates authored content models and exposes them in the content model catalog', () => {
    const model = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Commerce landing',
      description: 'Focused on hero, features and footer',
      allowedPresets: ['hero', 'features', 'footer'],
      requiredPresets: ['hero', 'footer'],
      starterPresets: ['features', 'hero', 'footer'],
      recommendedPresets: ['hero', 'footer'],
      maxSections: 2,
      sectionPresetLimits: {
        hero: 1,
        footer: 1,
      },
      defaultPageTitle: 'Commerce Landing Page',
      defaultPageDescription: 'Default commerce narrative.',
      defaultPagePathPrefix: '/commerce',
    })

    const contentModelOptions = listCmsContentModelOptions('en', [model])
    const sectionPresetOptions = listCmsSectionPresetOptions('en', model.id, [model])

    expect(model.id).toMatch(/^authored-model:/)
    expect(contentModelOptions).toContainEqual(expect.objectContaining({
      value: model.id,
      label: 'Commerce landing',
      description: 'Focused on hero, features and footer',
    }))
    expect(sectionPresetOptions.map(option => option.value)).toEqual(['hero', 'features', 'footer'])
    expect(getCmsRequiredSectionPresetIds(model.id, [model])).toEqual(['hero', 'footer'])
    expect(getCmsStarterSectionPresetIds(model.id, [model])).toEqual(['features', 'hero'])
    expect(getCmsContentModelMaxSections(model.id, [model])).toBe(2)
    expect(getCmsContentModelSectionPresetLimitMap(model.id, [model])).toEqual({
      hero: 1,
      footer: 1,
    })
    expect(getDefaultCmsSectionPresetId(model.id, [model])).toBe('hero')
    expect(getCmsContentModelDefaultPageTitle('en', model.id, [model])).toBe('Commerce Landing Page')
    expect(getCmsContentModelDefaultPageDescription('en', model.id, [model])).toBe('Default commerce narrative.')
    expect(getCmsContentModelDefaultPagePathPrefix(model.id, [model])).toBe('/commerce')
  })

  it('updates localized authored content model copy without overwriting english base values', () => {
    const initialModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Commerce landing',
      description: 'Focused on hero, features and footer',
      allowedPresets: ['hero', 'features', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero', 'footer'],
      maxSections: 3,
      sectionPresetLimits: {
        hero: 1,
      },
      defaultPageTitle: 'Commerce Landing Page',
      defaultPageDescription: 'English commerce narrative.',
      defaultPagePathPrefix: '/commerce',
    })

    const localizedModel = updateCmsAuthoredContentModel({
      model: initialModel,
      localeInput: 'pt-BR',
      name: 'Landing comercial',
      description: 'Focada em hero, features e rodape',
      allowedPresets: ['hero', 'features', 'footer'],
      requiredPresets: ['features', 'footer'],
      starterPresets: ['features', 'footer'],
      recommendedPresets: ['features'],
      maxSections: 1,
      sectionPresetLimits: {
        features: 2,
        footer: 1,
      },
      defaultPageTitle: 'Página comercial',
      defaultPageDescription: 'Narrativa comercial em português.',
      defaultPagePathPrefix: '/campanha-comercial',
    })

    expect(getCmsContentModelLabel('en', localizedModel.id, [localizedModel])).toBe('Commerce landing')
    expect(getCmsContentModelDescription('en', localizedModel.id, [localizedModel])).toBe('Focused on hero, features and footer')
    expect(getCmsContentModelLabel('pt-BR', localizedModel.id, [localizedModel])).toBe('Landing comercial')
    expect(getCmsContentModelDescription('pt-BR', localizedModel.id, [localizedModel])).toBe('Focada em hero, features e rodape')
    expect(getCmsContentModelDefaultPageTitle('en', localizedModel.id, [localizedModel])).toBe('Commerce Landing Page')
    expect(getCmsContentModelDefaultPageDescription('en', localizedModel.id, [localizedModel])).toBe('English commerce narrative.')
    expect(getCmsContentModelDefaultPageTitle('pt-BR', localizedModel.id, [localizedModel])).toBe('Página comercial')
    expect(getCmsContentModelDefaultPageDescription('pt-BR', localizedModel.id, [localizedModel])).toBe('Narrativa comercial em português.')
    expect(getCmsContentModelDefaultPagePathPrefix(localizedModel.id, [localizedModel])).toBe('/campanha-comercial')
    expect(getCmsRequiredSectionPresetIds(localizedModel.id, [localizedModel])).toEqual(['features', 'footer'])
    expect(getCmsStarterSectionPresetIds(localizedModel.id, [localizedModel])).toEqual(['features', 'footer'])
    expect(getCmsContentModelMaxSections(localizedModel.id, [localizedModel])).toBe(2)
    expect(getCmsContentModelSectionPresetLimitMap(localizedModel.id, [localizedModel])).toEqual({
      hero: 1,
      features: 2,
      footer: 1,
    })
    expect(getDefaultCmsSectionPresetId(localizedModel.id, [localizedModel])).toBe('features')
  })

  it('keeps authored schema field metadata localized per locale without overwriting english base values', () => {
    const initialModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Schema landing',
      description: 'Schema with localized fields',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Campaign headline',
          description: 'Primary page headline',
          placeholder: 'Type the campaign headline',
          group: 'Campaign',
          order: 2,
          required: true,
          repeatable: false,
          min: 5,
          max: 80,
          defaultValue: 'Launch campaign',
        },
      ],
    })

    const localizedModel = updateCmsAuthoredContentModel({
      model: initialModel,
      localeInput: 'pt-BR',
      name: 'Schema landing',
      description: 'Schema with localized fields',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Título da campanha',
          description: 'Título principal da página',
          placeholder: 'Digite o título da campanha',
          group: 'Campanha',
          order: 2,
          required: true,
          repeatable: false,
          min: 5,
          max: 80,
          defaultValue: 'Launch campaign',
        },
      ],
    })

    expect(getCmsContentModelFieldDefinitions('en', localizedModel.id, [localizedModel])).toEqual([
      expect.objectContaining({
        id: 'campaignheadline',
        label: 'Campaign headline',
        description: 'Primary page headline',
        placeholder: 'Type the campaign headline',
        group: 'Campaign',
        order: 2,
        repeatable: false,
        min: 5,
        max: 80,
      }),
    ])
    expect(getCmsContentModelFieldDefinitions('pt-BR', localizedModel.id, [localizedModel])).toEqual([
      expect.objectContaining({
        id: 'campaignheadline',
        label: 'Título da campanha',
        description: 'Título principal da página',
        placeholder: 'Digite o título da campanha',
        group: 'Campanha',
        order: 2,
        repeatable: false,
        min: 5,
        max: 80,
      }),
    ])
  })

  it('starts authored models at schema version 1 and only bumps on structural schema changes', () => {
    const initialModel = createCmsAuthoredContentModel({
      existingModels: [],
      localeInput: 'en',
      name: 'Versioned schema',
      description: 'Schema version test',
      migrationNotes: 'Initial schema',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
      defaultPageTitle: 'Versioned page',
      defaultPageDescription: 'Initial description',
      defaultPagePathPrefix: '/versioned',
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

    expect(getCmsContentModelSchemaVersion(initialModel.id, [initialModel])).toBe(1)
    expect(getCmsContentModelMigrationNotes('en', initialModel.id, [initialModel])).toBe('Initial schema')
    expect(getCmsContentModelLastSchemaChangeAt(initialModel.id, [initialModel])).toMatch(
      /^\d{4}-\d{2}-\d{2}T/
    )

    const initialSchemaChangeAt = getCmsContentModelLastSchemaChangeAt(initialModel.id, [initialModel])

    const copyOnlyUpdate = updateCmsAuthoredContentModel({
      model: initialModel,
      localeInput: 'en',
      name: 'Versioned schema',
      description: 'Updated copy only',
      migrationNotes: 'Clarified copy only',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
      defaultPageTitle: 'Versioned page',
      defaultPageDescription: 'Updated description only',
      defaultPagePathPrefix: '/versioned',
      fields: initialModel.fields,
    })

    expect(getCmsContentModelSchemaVersion(copyOnlyUpdate.id, [copyOnlyUpdate])).toBe(1)
    expect(getCmsContentModelMigrationNotes('en', copyOnlyUpdate.id, [copyOnlyUpdate])).toBe('Clarified copy only')
    expect(getCmsContentModelLastSchemaChangeAt(copyOnlyUpdate.id, [copyOnlyUpdate])).toBe(initialSchemaChangeAt)

    const localizedCopyUpdate = updateCmsAuthoredContentModel({
      model: copyOnlyUpdate,
      localeInput: 'pt-BR',
      name: 'Schema versionado',
      description: 'Atualizacao de copia',
      migrationNotes: 'Notas da migração em português',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
      defaultPageTitle: 'Página versionada',
      defaultPageDescription: 'Descricao em português',
      defaultPagePathPrefix: '/versioned',
      fields: [
        {
          id: 'campaignHeadline',
          type: 'text',
          label: 'Título da campanha',
          description: 'Título principal',
          placeholder: 'Digite o título',
          required: true,
          defaultValue: 'Launch campaign',
        },
      ],
    })

    expect(getCmsContentModelSchemaVersion(localizedCopyUpdate.id, [localizedCopyUpdate])).toBe(1)
    expect(getCmsContentModelMigrationNotes('pt-BR', localizedCopyUpdate.id, [localizedCopyUpdate])).toBe(
      'Notas da migração em português'
    )
    expect(getCmsContentModelMigrationNotes('en', localizedCopyUpdate.id, [localizedCopyUpdate])).toBe(
      'Clarified copy only'
    )

    const schemaUpdate = updateCmsAuthoredContentModel({
      model: localizedCopyUpdate,
      localeInput: 'en',
      name: 'Versioned schema',
      description: 'Updated copy only',
      migrationNotes: 'Added footer requirement',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero', 'footer'],
      starterPresets: ['hero', 'footer'],
      recommendedPresets: ['hero'],
      defaultPageTitle: 'Versioned page',
      defaultPageDescription: 'Updated description only',
      defaultPagePathPrefix: '/versioned',
      fields: localizedCopyUpdate.fields,
    })

    expect(getCmsContentModelSchemaVersion(schemaUpdate.id, [schemaUpdate])).toBe(2)
    expect(getCmsContentModelMigrationNotes('en', schemaUpdate.id, [schemaUpdate])).toBe('Added footer requirement')
    expect(getCmsContentModelLastSchemaChangeAt(schemaUpdate.id, [schemaUpdate])).not.toBe(initialSchemaChangeAt)
  })

  it('normalizes malformed authored model payloads and preserves explicit authored ids on persisted pages', () => {
    const normalizedModels = normalizeCmsAuthoredContentModels([
      {
        id: 'authored-model:commerce',
        name: 'Commerce landing',
        description: 'Normalized model',
        allowedPresets: ['hero', 'hero', 'footer', 'unknown'],
        requiredPresets: ['hero', 'footer', 'metrics'],
        starterPresets: ['footer', 'footer', 'hero', 'metrics'],
        recommendedPresets: ['footer'],
        maxSections: 1,
        sectionPresetLimits: {
          hero: 0,
          footer: 1,
          metrics: 2,
        },
        defaultPageTitle: '',
        defaultPageDescription: ' Normalized description ',
        defaultPagePathPrefix: 'Commerce Landing',
      },
      {
        id: 'authored-model:commerce',
        name: '',
        description: '',
      },
    ])

    expect(normalizedModels).toHaveLength(2)
    expect(normalizedModels[0]).toMatchObject({
      id: 'authored-model:commerce',
      allowedPresets: ['hero', 'footer'],
      requiredPresets: ['hero', 'footer'],
      starterPresets: ['footer', 'hero'],
      recommendedPresets: ['footer'],
      maxSections: 2,
      sectionPresetLimits: {
        footer: 1,
      },
      defaultPageTitle: 'Commerce landing',
      defaultPageDescription: 'Normalized description',
      defaultPagePathPrefix: '/commerce-landing',
    })
    expect(normalizedModels[1]?.id).toMatch(/^authored-model:commerce-/)

    const detectedModelId = detectCmsContentModelIdForPage({
      id: 'commerce-page',
      title: 'Commerce landing',
      path: '/commerce',
      status: 'draft',
      description: '',
      contentModelId: normalizedModels[0]?.id,
      sections: [],
    }, normalizedModels)

    expect(detectedModelId).toBe(normalizedModels[0]?.id)
  })
})