/**
 * Tests/unit/modules/cms/Media Library spec module.
 */
import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  collectCmsMediaBindingReferences,
  collectCmsMediaDiagnostics,
  createCmsMediaAsset,
  createDefaultCmsMediaAssets,
  normalizeCmsMediaAssets,
  resolveCmsMediaBindingProps,
} from '../../../../src/modules/cms/white-label/media-library'
import { getLandingBlockMediaBindingDefinitions } from '../../../../landing-page/cms/landing.block-fields'

describe('media-library', () => {
  it('creates branding-aware default media assets for both supported locales', () => {
    const settings = createDefaultWhiteLabelSettings()

    const english = createDefaultCmsMediaAssets(settings.branding, 'en')
    const portuguese = createDefaultCmsMediaAssets(settings.branding, 'pt-BR')

    expect(english[0]?.name).toBe('Brand logo')
    expect(portuguese[0]?.name).toBe('Logo da marca')
    expect(english[1]?.url).toBe(settings.branding.faviconUrl || settings.branding.brandLogo)
  })

  it('creates collision-safe media asset ids from authoring drafts', () => {
    const asset = createCmsMediaAsset({
      existingAssets: [
        {
          id: 'brand-logo',
          name: 'Brand logo',
          description: '',
          kind: 'image',
          url: '/assets/logo.svg',
          alt: 'Logo',
          tags: ['branding'],
          usage: ['branding.logo'],
        },
      ],
      name: 'Brand logo',
      description: 'Alternative dark logo',
      kind: 'image',
      url: '/assets/logo-dark.svg',
      alt: 'Dark logo',
      tags: 'branding, dark',
      usage: 'branding.logo, landing.hero',
    })

    expect(asset.id).toBe('brand-logo-2')
    expect(asset.tags).toEqual(['branding', 'dark'])
    expect(asset.usage).toEqual(['branding.logo', 'landing.hero'])
  })

  it('normalizes malformed media assets into safe serializable records', () => {
    const defaults = createDefaultCmsMediaAssets(createDefaultWhiteLabelSettings().branding)
    const normalized = normalizeCmsMediaAssets([
      null,
      {
        id: '',
        name: '',
        description: 7,
        kind: 'invalid',
        url: {},
        alt: [],
        tags: 'invalid',
        usage: null,
      },
    ], defaults)

    expect(normalized[0]?.id).toBe('media-asset-2')
    expect(normalized[0]?.name).toBe('Media Asset 2')
    expect(normalized[0]?.kind).toBe('other')
    expect(normalized[0]?.url).toBe('[object Object]')
    expect(normalized[0]?.tags).toEqual([])
    expect(normalized[0]?.usage).toEqual([])
  })

  it('resolves asset references into runtime-ready block props', () => {
    const resolved = resolveCmsMediaBindingProps({
      props: {
        imageAssetId: 'hero-image',
        image: '',
        imageAlt: '',
        videoPosterAssetId: 'hero-poster',
      },
      bindings: [
        {
          sourcePath: 'imageAssetId',
          targetPath: 'image',
          altTargetPath: 'imageAlt',
          allowedKinds: ['image'],
        },
        {
          sourcePath: 'videoPosterAssetId',
          targetPath: 'videoPoster',
          allowedKinds: ['image'],
        },
      ],
      mediaAssets: [
        {
          id: 'hero-image',
          name: 'Hero image',
          description: '',
          kind: 'image',
          url: '/assets/hero.png',
          alt: 'Hero visual',
          tags: [],
          usage: ['content.hero'],
        },
        {
          id: 'hero-poster',
          name: 'Hero poster',
          description: '',
          kind: 'image',
          url: '/assets/hero-poster.png',
          alt: 'Poster visual',
          tags: [],
          usage: ['content.hero'],
        },
      ],
    })

    expect(resolved.image).toBe('/assets/hero.png')
    expect(resolved.imageAlt).toBe('Hero visual')
    expect(resolved.videoPoster).toBe('/assets/hero-poster.png')
  })

  it('collects media references from authored page blocks', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.pages[0]?.sections[0]?.blocks[0]?.props && Object.assign(
      settings.pages[0].sections[0].blocks[0].props,
      {
        imageAssetId: 'hero-image',
      }
    )
    settings.pages[0]!.sections[0]!.blocks[0]!.type = 'landing.hero'

    const references = collectCmsMediaBindingReferences({
      pages: settings.pages,
      resolveBindings: getLandingBlockMediaBindingDefinitions,
    })

    expect(references).toHaveLength(1)
    expect(references[0]?.assetId).toBe('hero-image')
    expect(references[0]?.blockType).toBe('landing.hero')
  })

  it('reports missing, invalid and unused media assets', () => {
    const settings = createDefaultWhiteLabelSettings()
    const heroPage = settings.pages[0]
    expect(heroPage).toBeDefined()

    heroPage!.sections = [{
      id: 'hero',
      presetId: 'hero',
      label: 'Hero',
      enabled: true,
      blocks: [
        {
          id: 'hero-main',
          type: 'landing.hero',
          enabled: true,
          props: {
            imageAssetId: 'missing-image',
            videoPosterAssetId: 'wrong-kind',
          },
        },
      ],
    }]

    settings.mediaAssets = [
      {
        id: 'wrong-kind',
        name: 'Wrong kind asset',
        description: '',
        kind: 'document',
        url: '',
        alt: '',
        tags: [],
        usage: [],
      },
      {
        id: 'orphan-image',
        name: 'Orphan image',
        description: '',
        kind: 'image',
        url: '/assets/orphan.png',
        alt: 'Orphan',
        tags: [],
        usage: [],
      },
    ]

    const diagnostics = collectCmsMediaDiagnostics({
      pages: settings.pages,
      mediaAssets: settings.mediaAssets,
      resolveBindings: getLandingBlockMediaBindingDefinitions,
    })

    expect(diagnostics.some(item => item.code === 'media_asset_missing' && item.assetId === 'missing-image')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_kind_mismatch' && item.assetId === 'wrong-kind')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_url_missing' && item.assetId === 'wrong-kind')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_unused' && item.assetId === 'orphan-image')).toBe(true)
  })
})