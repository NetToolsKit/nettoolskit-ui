/**
 * Tests/unit/modules/cms/Reusable Blocks spec module.
 */
import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  cloneCmsReusableBlockIntoPageBlock,
  createCmsReusableBlockFromBlock,
  createDefaultCmsReusableBlocks,
  detachCmsPageBlockFromReusable,
  normalizeCmsReusableBlocks,
  resolveCmsReusableBlockReference,
} from '../../../../src/modules/cms/white-label/reusable-blocks'

describe('reusable-blocks', () => {
  it('creates localized reusable block seeds for the CMS engine', () => {
    const english = createDefaultCmsReusableBlocks('en')
    const portuguese = createDefaultCmsReusableBlocks('pt-BR')

    expect(english.some(block => block.name === 'Hero · Product launch')).toBe(true)
    expect(portuguese.some(block => block.name === 'Hero · Lancamento de produto')).toBe(true)
    expect(english[0]?.presetId).toBe('landing-hero-product-launch')
  })

  it('creates reusable templates from authored blocks with cloned props', () => {
    const reusableBlock = createCmsReusableBlockFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Tenant hero',
        },
        localization: {
          props: {
            'pt-BR': {
              title: 'Hero do tenant',
            },
          },
        },
      },
      existingBlocks: [],
      displayName: 'Landing Hero',
      category: 'layout',
    })

    expect(reusableBlock.id).toBe('landing-hero')
    expect(reusableBlock.name).toBe('Landing Hero')
    expect(reusableBlock.category).toBe('layout')

    const clonedBlock = cloneCmsReusableBlockIntoPageBlock({
      reusableBlock,
      blockId: 'landing-hero-3',
    })

    expect(clonedBlock.id).toBe('landing-hero-3')
    expect(clonedBlock.type).toBe('landing.hero')
    expect(clonedBlock.presetId).toBe('landing-hero-product-launch')
    expect(clonedBlock.props).toEqual({ title: 'Tenant hero' })
    expect(clonedBlock.localization?.props?.['pt-BR']).toEqual({ title: 'Hero do tenant' })
    expect(clonedBlock.props).not.toBe(reusableBlock.props)
  })

  it('normalizes malformed reusable payloads back to safe defaults', () => {
    const defaults = createDefaultCmsReusableBlocks('en')
    const normalized = normalizeCmsReusableBlocks([
      {
        id: '',
        name: '',
        description: 42,
        category: '',
        presetId: 'landing-hero-product-launch',
        type: '',
        props: [],
      },
    ], defaults)

    expect(normalized[0]?.id).toBe('reusable-block-1')
    expect(normalized[0]?.name).toBe('Reusable Block 1')
    expect(normalized[0]?.type).toBe('landing.hero')
    expect(normalized[0]?.presetId).toBe('landing-hero-product-launch')
    expect(normalized[0]?.props).toEqual({})
  })

  it('normalizes reactive Vue objects without throwing clone errors', () => {
    const defaults = createDefaultCmsReusableBlocks('en')
    const reactiveReusableBlocks = reactive([
      {
        id: 'hero-reactive',
        name: 'Reactive Hero',
        description: 'Proxy-backed reusable block',
        category: 'layout',
        type: 'landing.hero',
        props: reactive({
          title: 'Reactive title',
          primaryAction: reactive({
            label: 'Open builder',
            href: '#builder',
          }),
        }),
      },
    ])

    const normalized = normalizeCmsReusableBlocks(reactiveReusableBlocks, defaults)

    expect(normalized).toHaveLength(1)
    expect(normalized[0]?.name).toBe('Reactive Hero')
    expect(normalized[0]?.props).toEqual({
      title: 'Reactive title',
      primaryAction: {
        label: 'Open builder',
        href: '#builder',
      },
    })
  })

  it('resolves linked reusable blocks and detaches them into local snapshots', () => {
    const reusableBlock = createCmsReusableBlockFromBlock({
      block: {
        id: 'hero-block-1',
        type: 'landing.hero',
        presetId: 'landing-hero-product-launch',
        enabled: true,
        props: {
          title: 'Reusable source title',
        },
      },
      existingBlocks: [],
      displayName: 'Reusable Hero',
      category: 'hero',
    })

    const linkedBlock = cloneCmsReusableBlockIntoPageBlock({
      reusableBlock,
      blockId: 'hero-block-linked',
      mode: 'linked',
    })

    linkedBlock.props = {
      title: 'Stale local copy',
    }

    const resolvedBlock = resolveCmsReusableBlockReference({
      block: linkedBlock,
      reusableBlocks: [reusableBlock],
    })

    expect(resolvedBlock.reusableMode).toBe('linked')
    expect(resolvedBlock.reusableSourceId).toBe(reusableBlock.id)
    expect(resolvedBlock.props).toEqual({
      title: 'Reusable source title',
    })

    const detachedBlock = detachCmsPageBlockFromReusable({
      block: linkedBlock,
      reusableBlocks: [reusableBlock],
    })

    expect(detachedBlock.reusableMode).toBe('detached')
    expect(detachedBlock.reusableSourceId).toBe(reusableBlock.id)
    expect(detachedBlock.props).toEqual({
      title: 'Reusable source title',
    })
  })
})