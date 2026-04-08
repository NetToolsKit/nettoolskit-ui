/**
 * Tests/unit/modules/cms/landing block fields catalog module.
 */

import { describe, expect, it } from 'vitest'
import {
  getLandingBlockFieldDefinitions,
  getLandingBlockMediaBindingDefinitions,
} from '../../../../src/modules/cms/presets/landing'

const LANDING_BLOCK_TYPES = [
  'landing.header',
  'landing.hero',
  'landing.stats',
  'landing.features',
  'landing.cta',
  'landing.footer',
]

describe('Landing block fields catalog', () => {
  it('returns definitions for every supported landing block type', () => {
    for (const blockType of LANDING_BLOCK_TYPES) {
      const definitions = getLandingBlockFieldDefinitions(blockType)
      expect(definitions.length).toBeGreaterThan(0)
    }
  })

  it('returns empty list for unknown block types', () => {
    expect(getLandingBlockFieldDefinitions('landing.unknown')).toEqual([])
  })

  it('includes premium hero video field definitions', () => {
    const heroFields = getLandingBlockFieldDefinitions('landing.hero')
    const heroFieldPaths = heroFields.map(field => field.path)

    expect(heroFieldPaths).toEqual(expect.arrayContaining([
      'imageAssetId',
      'videoWebm',
      'videoWebmAssetId',
      'videoMp4',
      'videoMp4AssetId',
      'videoPoster',
      'videoPosterAssetId',
      'videoAutoplay',
      'videoLoop',
      'videoMuted',
      'videoPlaysinline',
      'videoControls',
      'revealOnScroll',
      'revealMask',
      'revealOnce',
      'parallaxEnabled',
      'parallaxStrength',
      'videoPreload',
    ]))
  })

  it('declares media bindings for hero asset references', () => {
    const bindings = getLandingBlockMediaBindingDefinitions('landing.hero')

    expect(bindings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourcePath: 'imageAssetId',
        targetPath: 'image',
        altTargetPath: 'imageAlt',
      }),
      expect.objectContaining({
        sourcePath: 'videoPosterAssetId',
        targetPath: 'videoPoster',
      }),
    ]))
  })

  it('includes cinematic feature card field definitions', () => {
    const featureFields = getLandingBlockFieldDefinitions('landing.features')
    const featureFieldPaths = featureFields.map(field => field.path)

    expect(featureFieldPaths).toEqual(expect.arrayContaining([
      'cinematicCardsEnabled',
      'cinematicCardsTilt',
      'cinematicCardsGlow',
      'cinematicCardsPerspective',
    ]))
  })

  it('keeps field paths unique per block type', () => {
    for (const blockType of LANDING_BLOCK_TYPES) {
      const definitions = getLandingBlockFieldDefinitions(blockType)
      const uniquePaths = new Set(definitions.map(field => field.path))
      expect(uniquePaths.size).toBe(definitions.length)
    }
  })
})