/**
 * Tests/unit/modules/cms/PageTemplates spec module.
 */
import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  createCmsPageFromTemplate,
  listCmsPageTemplateOptions,
  resolveCmsPageTemplateId,
} from '../../../../src/modules/cms/white-label/page-templates'

describe('page-templates', () => {
  it('lists localized template options', () => {
    const english = listCmsPageTemplateOptions('en')
    const portuguese = listCmsPageTemplateOptions('pt-BR')

    expect(english.some(option => option.label === 'Landing (default)')).toBe(true)
    expect(portuguese.some(option => option.label === 'Landing (padrao)')).toBe(true)
  })

  it('falls back to default template id when value is unknown', () => {
    expect(resolveCmsPageTemplateId('invalid-template-id')).toBe('landing-default')
    expect(resolveCmsPageTemplateId('marketing')).toBe('marketing')
  })

  it('creates unique ids and paths when template base already exists', () => {
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

    const page = createCmsPageFromTemplate({
      templateId: 'landing-default',
      existingPages: settings.pages,
      localeInput: 'en',
    })

    expect(page.id).toBe('landing-page-2')
    expect(page.contentModelId).toBe('landing-page')
    expect(page.path).toBe('/landing-2')
    expect(page.title).toBe('Landing Page 2')
    expect(page.sections.length).toBeGreaterThan(0)
    expect(page.sections[0]?.presetId).toBe('header')
  })

  it('builds marketing template with localized copy and expected sections', () => {
    const page = createCmsPageFromTemplate({
      templateId: 'marketing',
      existingPages: [],
      localeInput: 'pt-BR',
    })

    expect(page.title).toBe('Marketing Page')
    expect(page.localization?.title?.['pt-BR']).toBe('Pagina de Marketing')
    expect(page.contentModelId).toBe('marketing-page')
    expect(page.description).toBe('Campaign-oriented page focused on conversion.')
    expect(page.localization?.description?.['pt-BR']).toBe('Pagina orientada a campanha com foco em conversao.')
    expect(page.sections.some(section => section.id === 'metrics')).toBe(true)
    expect(page.sections.some(section => section.presetId === 'metrics')).toBe(true)
    expect(page.sections.some(section => section.id === 'cta')).toBe(true)
    expect(page.sections.some(section => section.localization?.label?.['pt-BR'] === 'Metricas')).toBe(true)
    expect(page.sections.every(section => section.blocks.length === 1)).toBe(true)
  })
})