/**
 * Tests/unit/modules/cms/Reusable Sections spec module.
 */
import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  cloneCmsReusableSectionIntoPageSection,
  createCmsReusableSectionFromSection,
  createDefaultCmsReusableSections,
  detachCmsPageSectionFromReusable,
  normalizeCmsReusableSections,
  resolveCmsReusableSectionReference,
} from '../../../../src/modules/cms/white-label/reusable-sections'

describe('reusable-sections', () => {
  it('starts with an empty reusable section library by default', () => {
    expect(createDefaultCmsReusableSections()).toEqual([])
  })

  it('creates reusable templates from authored sections with cloned blocks', () => {
    const reusableSection = createCmsReusableSectionFromSection({
      page: {
        id: 'landing-main',
        contentModelId: 'landing-page',
        title: 'Main Landing',
        path: '/',
        status: 'published',
        description: '',
        localization: {
          title: {
            'pt-BR': 'Landing Principal',
          },
        },
        sections: [],
      },
      section: {
        id: 'hero',
        presetId: 'hero',
        label: 'Hero',
        enabled: true,
        localization: {
          label: {
            'pt-BR': 'Hero PT',
          },
        },
        blocks: [{
          id: 'hero-block-1',
          type: 'landing.hero',
          presetId: 'landing-hero-product-launch',
          enabled: true,
          props: {
            title: 'Reusable hero',
          },
          localization: {
            props: {
              'pt-BR': {
                title: 'Hero reutilizavel',
              },
            },
          },
        }],
      },
      existingSections: [],
    })

    expect(reusableSection.id).toBe('main-landing-hero')
    expect(reusableSection.name).toBe('Main Landing · Hero')
    expect(reusableSection.contentModelId).toBe('landing-page')
    expect(reusableSection.localization?.label?.['pt-BR']).toBe('Hero PT')
    expect(reusableSection.blocks[0]?.presetId).toBe('landing-hero-product-launch')
    expect(reusableSection.blocks[0]?.props).toEqual({ title: 'Reusable hero' })
    expect(reusableSection.blocks[0]?.localization?.props?.['pt-BR']).toEqual({ title: 'Hero reutilizavel' })

    const clonedSection = cloneCmsReusableSectionIntoPageSection({
      reusableSection,
      existingSections: [{
        id: 'hero',
        presetId: 'hero',
        label: 'Hero',
        enabled: true,
        blocks: [{
          id: 'hero-block-1',
          type: 'landing.hero',
          presetId: 'landing-hero-product-launch',
          enabled: true,
          props: {},
        }],
      }],
    })

    expect(clonedSection.id).toBe('hero-2')
    expect(clonedSection.blocks[0]?.id).toBe('hero-2-block-1')
    expect(clonedSection.blocks[0]?.presetId).toBe('landing-hero-product-launch')
    expect(clonedSection.blocks[0]?.props).toEqual({ title: 'Reusable hero' })
    expect(clonedSection.localization?.label?.['pt-BR']).toBe('Hero PT')
    expect(clonedSection.blocks[0]?.localization?.props?.['pt-BR']).toEqual({ title: 'Hero reutilizavel' })
    expect(clonedSection.blocks[0]?.props).not.toBe(reusableSection.blocks[0]?.props)
  })

  it('normalizes malformed reusable section payloads back to safe defaults', () => {
    const normalized = normalizeCmsReusableSections([{
      id: '',
      name: '',
      description: 42,
      category: '',
      contentModelId: 'invalid',
      presetId: 'invalid',
      label: '',
      enabled: 'yes',
      blocks: 'invalid',
    }], [])

    expect(normalized[0]?.id).toBe('reusable-section-1')
    expect(normalized[0]?.name).toBe('Reusable Section 1')
    expect(normalized[0]?.contentModelId).toBe('landing-page')
    expect(normalized[0]?.presetId).toBe('custom')
    expect(normalized[0]?.blocks[0]?.type).toBe('landing.hero')
    expect(normalized[0]?.blocks[0]?.presetId).toBe('custom')
  })

  it('normalizes reactive Vue section payloads without clone errors', () => {
    const reactiveSections = reactive([{
      id: 'hero-proxy',
      name: 'Proxy Hero',
      description: 'Proxy section',
      category: 'hero',
      contentModelId: 'landing-page',
      presetId: 'hero',
      label: 'Hero',
      enabled: true,
      blocks: reactive([{
        id: 'hero-proxy-block-1',
        type: 'landing.hero',
        enabled: true,
        props: reactive({
          title: 'Proxy title',
          primaryAction: reactive({
            label: 'Edit',
            href: '#builder',
          }),
        }),
      }]),
    }])

    const normalized = normalizeCmsReusableSections(reactiveSections, [])

    expect(normalized).toHaveLength(1)
    expect(normalized[0]?.blocks[0]?.props).toEqual({
      title: 'Proxy title',
      primaryAction: {
        label: 'Edit',
        href: '#builder',
      },
    })
  })

  it('resolves linked reusable sections and detaches them into local snapshots', () => {
    const reusableSection = createCmsReusableSectionFromSection({
      page: {
        id: 'landing-main',
        contentModelId: 'landing-page',
        title: 'Main Landing',
        path: '/',
        status: 'published',
        description: '',
        sections: [],
      },
      section: {
        id: 'hero',
        presetId: 'hero',
        label: 'Hero',
        enabled: true,
        blocks: [{
          id: 'hero-block-1',
          type: 'landing.hero',
          presetId: 'landing-hero-product-launch',
          enabled: true,
          props: {
            title: 'Reusable section title',
          },
        }],
      },
      existingSections: [],
    })

    const linkedSection = cloneCmsReusableSectionIntoPageSection({
      reusableSection,
      existingSections: [],
      mode: 'linked',
    })
    linkedSection.label = 'Stale local label'
    if (linkedSection.blocks[0]) {
      linkedSection.blocks[0].props = {
        title: 'Stale local block',
      }
    }

    const resolvedSection = resolveCmsReusableSectionReference({
      section: linkedSection,
      reusableSections: [reusableSection],
    })

    expect(resolvedSection.reusableMode).toBe('linked')
    expect(resolvedSection.reusableSourceId).toBe(reusableSection.id)
    expect(resolvedSection.label).toBe('Hero')
    expect(resolvedSection.blocks[0]?.id).toBe(linkedSection.blocks[0]?.id)
    expect(resolvedSection.blocks[0]?.props).toEqual({
      title: 'Reusable section title',
    })

    const detachedSection = detachCmsPageSectionFromReusable({
      section: linkedSection,
      reusableSections: [reusableSection],
    })

    expect(detachedSection.reusableMode).toBe('detached')
    expect(detachedSection.reusableSourceId).toBe(reusableSection.id)
    expect(detachedSection.label).toBe('Hero')
    expect(detachedSection.blocks[0]?.props).toEqual({
      title: 'Reusable section title',
    })
  })
})