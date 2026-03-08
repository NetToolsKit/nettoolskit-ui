/**
 * Tests/unit/modules/cms/Block Presets spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  createCmsAuthoredBlockPresetFromBlock,
  createCmsPageBlockFromPreset,
  getCmsBlockPresetLabel,
  getDefaultCmsBlockPresetIdForSectionPreset,
  isCmsBlockPresetAllowedForType,
  listCmsBlockPresetOptions,
  resolveCmsBlockPresetId,
  updateCmsAuthoredBlockPreset,
} from '../../../../src/modules/cms/white-label/block-presets'

describe('block-presets', () => {
  it('lists localized starter presets per block type', () => {
    const englishOptions = listCmsBlockPresetOptions('en', 'landing.hero')
    const portugueseOptions = listCmsBlockPresetOptions('pt-BR', 'landing.hero')

    expect(englishOptions[0]?.value).toBe('landing-hero-product-launch')
    expect(englishOptions.some(option => option.label === 'Hero · Product launch')).toBe(true)
    expect(portugueseOptions.some(option => option.label === 'Hero · Lancamento de produto')).toBe(true)
    expect(englishOptions.at(-1)?.value).toBe('custom')
  })

  it('creates localized block payloads from preset ids', () => {
    const block = createCmsPageBlockFromPreset({
      presetId: 'landing-cta-final-prompt',
      blockId: 'cta-block-7',
      enabled: false,
    })

    expect(block.id).toBe('cta-block-7')
    expect(block.type).toBe('landing.cta')
    expect(block.presetId).toBe('landing-cta-final-prompt')
    expect(block.enabled).toBe(false)
    expect(block.props).toMatchObject({
      title: 'Ship your next frontend faster',
    })
    expect(block.localization?.props?.['pt-BR']).toMatchObject({
      title: 'Entregue seu proximo frontend mais rapido',
    })
  })

  it('keeps section defaults aligned with block preset defaults', () => {
    expect(getDefaultCmsBlockPresetIdForSectionPreset('hero')).toBe('landing-hero-product-launch')
    expect(getDefaultCmsBlockPresetIdForSectionPreset('installation')).toBe('landing-cta-installation-guide')
    expect(resolveCmsBlockPresetId('invalid')).toBe('custom')
    expect(getCmsBlockPresetLabel('en', 'custom')).toBe('Custom')
    expect(isCmsBlockPresetAllowedForType('landing.hero', 'landing-hero-video-showcase')).toBe(true)
    expect(isCmsBlockPresetAllowedForType('landing.hero', 'landing-stats-proof-strip')).toBe(false)
  })

  it('creates localized authored presets from live blocks and exposes them in preset options', () => {
    const authoredPreset = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Build page experiences faster',
          subtitle: 'English subtitle',
        },
        localization: {
          props: {
            'pt-BR': {
              title: 'Monte paginas mais rapido',
              subtitle: 'Legenda localizada',
            },
          },
        },
      },
      existingPresets: [],
      localeInput: 'pt-BR',
      displayName: 'Landing Hero',
      name: 'Hero QA PT',
      description: 'Preset localizado',
      category: 'layout',
      starterSectionPresets: ['hero', 'cta'],
    })

    expect(authoredPreset.id).toBe('authored:hero-qa-pt')
    expect(authoredPreset.name).toBe('Landing Hero')
    expect(authoredPreset.localization?.name?.['pt-BR']).toBe('Hero QA PT')
    expect(authoredPreset.localization?.description?.['pt-BR']).toBe('Preset localizado')
    expect(authoredPreset.localization?.props?.['pt-BR']).toMatchObject({
      title: 'Monte paginas mais rapido',
      subtitle: 'Legenda localizada',
    })
    expect(authoredPreset.starterSectionPresets).toEqual(['hero', 'cta'])

    const portugueseOptions = listCmsBlockPresetOptions('pt-BR', 'landing.hero', [authoredPreset])
    expect(portugueseOptions.some(option => option.value === authoredPreset.id && option.label === 'Hero QA PT')).toBe(true)
    expect(getCmsBlockPresetLabel('pt-BR', authoredPreset.id, [authoredPreset])).toBe('Hero QA PT')
    expect(isCmsBlockPresetAllowedForType('landing.hero', authoredPreset.id, [authoredPreset])).toBe(true)
  })

  it('updates authored presets per locale without discarding the base english metadata', () => {
    const authoredPreset = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Build page experiences faster',
        },
      },
      existingPresets: [],
      localeInput: 'en',
      displayName: 'Landing Hero',
      name: 'Hero QA EN',
      description: 'English preset',
      category: 'layout',
    })

    const localizedUpdate = updateCmsAuthoredBlockPreset({
      preset: authoredPreset,
      localeInput: 'pt-BR',
      name: 'Hero QA PT',
      description: 'Preset em portugues',
      starterSectionPresets: ['hero'],
    })

    expect(localizedUpdate.name).toBe('Hero QA EN')
    expect(localizedUpdate.description).toBe('English preset')
    expect(localizedUpdate.localization?.name?.['pt-BR']).toBe('Hero QA PT')
    expect(localizedUpdate.localization?.description?.['pt-BR']).toBe('Preset em portugues')
    expect(localizedUpdate.starterSectionPresets).toEqual(['hero'])
  })

  it('updates authored preset localized props from the visible locale-specific block content', () => {
    const authoredPreset = createCmsAuthoredBlockPresetFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Build page experiences faster',
          subtitle: 'English subtitle',
        },
      },
      existingPresets: [],
      localeInput: 'en',
      displayName: 'Landing Hero',
      name: 'Hero QA EN',
      description: 'English preset',
      category: 'layout',
    })

    const localizedUpdate = updateCmsAuthoredBlockPreset({
      preset: authoredPreset,
      localeInput: 'pt-BR',
      name: 'Hero QA PT',
      description: 'Preset em portugues',
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: authoredPreset.id,
        enabled: true,
        props: {
          title: 'Build page experiences faster',
          subtitle: 'English subtitle',
        },
        localization: {
          props: {
            'pt-BR': {
              title: 'Hero authored em portugues',
              subtitle: 'Legenda authored em portugues',
            },
          },
        },
      },
      starterSectionPresets: ['hero'],
    })

    expect(localizedUpdate.props).toMatchObject({
      title: 'Build page experiences faster',
      subtitle: 'English subtitle',
    })
    expect(localizedUpdate.localization?.props?.['pt-BR']).toMatchObject({
      title: 'Hero authored em portugues',
      subtitle: 'Legenda authored em portugues',
    })
  })
})