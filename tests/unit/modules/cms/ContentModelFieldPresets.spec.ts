/**
 * Tests/unit/modules/cms/Content Model Field Presets spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  createCmsAuthoredContentModelFieldPreset,
  getCmsContentModelFieldPresetDefinition,
  listCmsContentModelFieldPresetOptions,
  normalizeCmsAuthoredContentModelFieldPresets,
  updateCmsAuthoredContentModelFieldPreset,
} from '../../../../src/modules/cms/white-label/schema-field-presets'

describe('content-model-field-presets', () => {
  it('normalizes malformed preset ids and field payloads into stable reusable presets', () => {
    const presets = normalizeCmsAuthoredContentModelFieldPresets([
      {
        id: 'campaign headline',
        name: 'Campaign headline',
        description: 'Primary campaign title',
        category: 'Campaign',
        field: {
          id: 'Campaign Headline',
          type: 'text',
          label: 'Campaign headline',
          description: 'Primary campaign title',
          placeholder: 'Type the headline',
          group: 'Campaign',
          order: 2,
          required: true,
        },
      },
    ])

    expect(presets).toHaveLength(1)
    expect(presets[0]?.id).toBe('field-preset:campaign-headline')
    expect(presets[0]?.field.id).toBe('campaign-headline')
    expect(presets[0]?.field.order).toBe(2)
  })

  it('creates authored field presets from live schema fields and resolves locale-aware options', () => {
    const preset = createCmsAuthoredContentModelFieldPreset({
      field: {
        id: 'campaignCode',
        type: 'text',
        label: 'Campaign code',
        description: 'Unique campaign code',
        placeholder: 'CMP-001',
        group: 'Campaign',
        order: 1,
        required: true,
      },
      existingPresets: [],
      localeInput: 'pt-BR',
      name: 'Codigo da campanha',
      description: 'Codigo unico da campanha',
      category: 'Campanha',
    })

    const options = listCmsContentModelFieldPresetOptions('pt-BR', [preset])
    expect(options[0]?.label).toBe('Codigo da campanha')
    expect(options[0]?.description).toBe('Codigo unico da campanha')

    const resolved = getCmsContentModelFieldPresetDefinition('pt-BR', preset.id, [preset])
    expect(resolved?.name).toBe('Codigo da campanha')
    expect(resolved?.field.label).toBe('Campaign code')
  })

  it('updates localized preset metadata while preserving the reusable field contract', () => {
    const preset = createCmsAuthoredContentModelFieldPreset({
      field: {
        id: 'campaignCode',
        type: 'text',
        label: 'Campaign code',
        description: 'Unique campaign code',
        placeholder: 'CMP-001',
        group: 'Campaign',
        order: 1,
        required: true,
      },
      existingPresets: [],
      localeInput: 'en',
      name: 'Campaign code',
      description: 'Unique campaign code',
      category: 'Campaign',
    })

    const updated = updateCmsAuthoredContentModelFieldPreset({
      preset,
      localeInput: 'pt-BR',
      name: 'Codigo da campanha',
      description: 'Codigo unico da campanha',
      category: 'Campanha',
    })

    expect(updated.name).toBe('Campaign code')
    expect(updated.localization?.name?.['pt-BR']).toBe('Codigo da campanha')
    expect(updated.localization?.description?.['pt-BR']).toBe('Codigo unico da campanha')
    expect(updated.field.id).toBe('campaignCode')
  })
})