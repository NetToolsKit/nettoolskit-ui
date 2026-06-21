/**
 * Tests/unit/modules/cms/Media Library spec module.
 */
import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  collectCmsBrandingMediaBindingReferences,
  collectCmsMediaBindingReferences,
  collectCmsMediaDiagnostics,
  collectCmsMediaUsageSummary,
  createCmsMediaAsset,
  createDefaultCmsMediaAssets,
  normalizeCmsMediaAssets,
  replaceCmsMediaAssetReferences,
  resolveCmsMediaBindingProps,
} from '../../../../src/modules/cms/white-label/media-library'
import { getLandingBlockMediaBindingDefinitions } from '../../../../src/modules/cms/presets/landing'

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
          focalPoint: null,
          replaceTargetAssetId: null,
          tags: ['branding'],
          usage: ['branding.logo'],
        },
      ],
      name: 'Brand logo',
      description: 'Alternative dark logo',
      kind: 'image',
      url: '/assets/logo-dark.svg',
      alt: 'Dark logo',
      focalPoint: { x: 50, y: 40 },
      replaceTargetAssetId: 'brand-logo',
      tags: 'branding, dark',
      usage: 'branding.logo, landing.hero',
    })

    expect(asset.id).toBe('brand-logo-2')
    expect(asset.focalPoint).toEqual({ x: 50, y: 40 })
    expect(asset.replaceTargetAssetId).toBe('brand-logo')
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
    expect(normalized[0]?.focalPoint).toBeNull()
    expect(normalized[0]?.replaceTargetAssetId).toBeNull()
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
          focalPoint: null,
          replaceTargetAssetId: null,
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
          focalPoint: null,
          replaceTargetAssetId: null,
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
        focalPoint: { x: 120, y: -5 },
        replaceTargetAssetId: 'wrong-kind',
        tags: [],
        usage: [],
      },
      {
        id: 'orphan-image',
        name: 'Orphan image',
        description: '',
        kind: 'image',
        url: '/assets/orphan.png',
        alt: '',
        focalPoint: null,
        replaceTargetAssetId: 'missing-target',
        tags: [],
        usage: [],
      },
    ]

    const diagnostics = collectCmsMediaDiagnostics({
      pages: settings.pages,
      branding: settings.branding,
      mediaAssets: settings.mediaAssets,
      resolveBindings: getLandingBlockMediaBindingDefinitions,
    })

    expect(diagnostics.some(item => item.code === 'media_asset_missing' && item.assetId === 'missing-image')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_kind_mismatch' && item.assetId === 'wrong-kind')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_url_missing' && item.assetId === 'wrong-kind')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_focal_point_invalid' && item.assetId === 'wrong-kind')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_alt_missing' && item.assetId === 'orphan-image')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_replace_target_self' && item.assetId === 'wrong-kind')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_replace_target_missing' && item.assetId === 'orphan-image')).toBe(true)
    expect(diagnostics.some(item => item.code === 'media_asset_unused' && item.assetId === 'orphan-image')).toBe(true)
  })

  it('counts block, branding and static usage for one asset', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.faviconUrl = 'https://example.com/assets/favicon-managed.png'
    settings.mediaAssets = [
      {
        id: 'favicon-managed',
        name: 'Managed favicon',
        description: '',
        kind: 'icon',
        url: 'https://example.com/assets/favicon-managed.png',
        alt: 'Managed favicon',
        focalPoint: null,
        replaceTargetAssetId: null,
        tags: ['branding'],
        usage: ['branding.favicon'],
      },
    ]

    const brandingReferences = collectCmsBrandingMediaBindingReferences({
      branding: settings.branding,
      mediaAssets: settings.mediaAssets,
    })
    const summary = collectCmsMediaUsageSummary({
      pages: settings.pages,
      branding: settings.branding,
      mediaAssets: settings.mediaAssets,
      resolveBindings: getLandingBlockMediaBindingDefinitions,
    })

    expect(brandingReferences[0]?.assetId).toBe('favicon-managed')
    expect(summary.get('favicon-managed')).toEqual({
      assetId: 'favicon-managed',
      blockReferences: 0,
      brandingReferences: 1,
      usageTags: 1,
      totalReferences: 1,
    })
  })

  it('replaces media references across blocks and branding bindings', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.faviconUrl = 'https://example.com/assets/original-favicon.png'
    settings.mediaAssets = [
      {
        id: 'hero-image',
        name: 'Hero image',
        description: '',
        kind: 'image',
        url: 'https://example.com/assets/hero-image.png',
        alt: 'Hero image alt',
        focalPoint: { x: 42, y: 54 },
        replaceTargetAssetId: null,
        tags: [],
        usage: [],
      },
      {
        id: 'replacement-image',
        name: 'Replacement image',
        description: '',
        kind: 'image',
        url: 'https://example.com/assets/replacement-image.png',
        alt: 'Replacement image alt',
        focalPoint: null,
        replaceTargetAssetId: null,
        tags: [],
        usage: [],
      },
      {
        id: 'favicon-original',
        name: 'Favicon original',
        description: '',
        kind: 'icon',
        url: 'https://example.com/assets/original-favicon.png',
        alt: 'Original favicon',
        focalPoint: null,
        replaceTargetAssetId: null,
        tags: [],
        usage: [],
      },
      {
        id: 'favicon-next',
        name: 'Favicon next',
        description: '',
        kind: 'icon',
        url: 'https://example.com/assets/next-favicon.png',
        alt: 'Next favicon',
        focalPoint: null,
        replaceTargetAssetId: null,
        tags: [],
        usage: [],
      },
    ]

    settings.pages[0]!.sections = [{
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
            imageAssetId: 'hero-image',
            imageAlt: 'Hero image alt',
          },
        },
      ],
    }]

    const replacedHero = replaceCmsMediaAssetReferences({
      pages: settings.pages,
      branding: settings.branding,
      mediaAssets: settings.mediaAssets,
      sourceAssetId: 'hero-image',
      replacementAssetId: 'replacement-image',
      resolveBindings: getLandingBlockMediaBindingDefinitions,
    })

    const replacedFavicon = replaceCmsMediaAssetReferences({
      pages: replacedHero.pages,
      branding: replacedHero.branding,
      mediaAssets: settings.mediaAssets,
      sourceAssetId: 'favicon-original',
      replacementAssetId: 'favicon-next',
      resolveBindings: getLandingBlockMediaBindingDefinitions,
    })

    expect(replacedHero.replacedBlockReferences).toBe(1)
    expect(replacedHero.pages[0]?.sections[0]?.blocks[0]?.props.imageAssetId).toBe('replacement-image')
    expect(replacedHero.pages[0]?.sections[0]?.blocks[0]?.props.imageAlt).toBe('Replacement image alt')
    expect(replacedFavicon.replacedBrandingReferences).toBe(1)
    expect(replacedFavicon.branding.faviconUrl).toBe('https://example.com/assets/next-favicon.png')
  })

  it('ignores unsafe media binding target paths', () => {
    const props = {
      imageAssetId: 'hero-image',
    }

    const resolved = resolveCmsMediaBindingProps({
      props,
      bindings: [
        {
          sourcePath: 'imageAssetId',
          targetPath: '__proto__.polluted',
          altTargetPath: 'constructor.prototype.pollutedAlt',
        },
      ],
      mediaAssets: [
        {
          id: 'hero-image',
          name: 'Hero image',
          description: '',
          kind: 'image',
          url: 'https://example.com/assets/hero-image.png',
          alt: 'Hero image alt',
          focalPoint: null,
          replaceTargetAssetId: null,
          tags: [],
          usage: [],
        },
      ],
    })

    expect(resolved).toEqual(props)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(({} as Record<string, unknown>).pollutedAlt).toBeUndefined()
  })
})
