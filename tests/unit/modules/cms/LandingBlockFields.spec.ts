/**
 * Tests/unit/modules/cms/landing block fields catalog module.
 */

import { describe, expect, it } from 'vitest'
import { getLandingBlockFieldDefinitions } from '../../../../landing-page/cms/landing.block-fields'

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

  it('keeps field paths unique per block type', () => {
    for (const blockType of LANDING_BLOCK_TYPES) {
      const definitions = getLandingBlockFieldDefinitions(blockType)
      const uniquePaths = new Set(definitions.map(field => field.path))
      expect(uniquePaths.size).toBe(definitions.length)
    }
  })
})