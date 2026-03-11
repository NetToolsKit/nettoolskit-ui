/**
 * Tests/unit/modules/cms/StarterKits spec module.
 */
import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  createCmsStarterKitBundle,
  listCmsStarterKitOptions,
} from '../../../../src/modules/cms/white-label/starter-kits'

describe('starter-kits', () => {
  it('lists localized starter-kit options with seeded counts', () => {
    const english = listCmsStarterKitOptions('en')
    const portuguese = listCmsStarterKitOptions('pt-BR')

    const launchEn = english.find(option => option.value === 'starter-product-launch')
    const launchPt = portuguese.find(option => option.value === 'starter-product-launch')

    expect(english).toHaveLength(3)
    expect(launchEn).toBeDefined()
    expect(launchEn?.label).toBe('Starter kit · Product launch')
    expect(launchEn?.contentModelLabel).toBe('Landing page')
    expect(launchEn?.reusableSectionCount).toBeGreaterThan(0)
    expect(launchEn?.reusableBlockCount).toBeGreaterThan(0)
    expect(launchEn?.blockPresetCount).toBeGreaterThan(0)
    expect(launchEn?.fieldPresetCount).toBeGreaterThan(0)

    expect(launchPt).toBeDefined()
    expect(launchPt?.label).toBe('Starter kit · Lancamento de produto')
    expect(launchPt?.description).toContain('landing')
  })

  it('creates a starter-kit bundle with seeded reusable libraries and presets', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.pages.push({
      id: 'landing-page',
      contentModelId: 'landing-page',
      title: 'Landing Page',
      path: '/landing',
      status: 'draft',
      description: '',
      sections: [],
    })

    const bundle = createCmsStarterKitBundle({
      kitId: 'starter-product-launch',
      settings,
      localeInput: 'pt-BR',
    })

    expect(bundle.kitId).toBe('starter-product-launch')
    expect(bundle.templateId).toBe('landing-default')
    expect(bundle.page.id).toBe('landing-page-2')
    expect(bundle.page.path).toBe('/landing-2')
    expect(bundle.page.sections.length).toBeGreaterThan(0)
    expect(bundle.page.contentModelId).toBe('landing-page')
    expect(bundle.reusableSections.length).toBeGreaterThan(0)
    expect(bundle.reusableBlocks.length).toBeGreaterThan(0)
    expect(bundle.authoredBlockPresets.length).toBeGreaterThan(0)
    expect(bundle.authoredContentModelFieldPresets.length).toBeGreaterThan(0)
    expect(bundle.reusableSections.some(section => section.name === 'Secao hero de lancamento')).toBe(true)
    expect(bundle.reusableBlocks.some(block => block.name === 'Bloco hero de lancamento')).toBe(true)
    expect(bundle.authoredBlockPresets.some(preset => preset.localization?.name?.['pt-BR'] === 'Preset · Hero de lancamento de produto')).toBe(true)
    expect(bundle.authoredContentModelFieldPresets[0]?.name).toBe('Launch date')
    expect(bundle.authoredContentModelFieldPresets[0]?.localization?.name?.['pt-BR']).toBe('Data de lancamento')
  })
})