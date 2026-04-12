import { describe, expect, it } from 'vitest'

import { templateVisualFamilies } from '../../../samples/template-showcase/families/template-visual-families'
import { templateShowcaseExampleRegistry } from '../../../samples/template-showcase/template-showcase.examples'

describe('templateVisualFamilies', () => {
  it('defines the original reference plus five curated config-driven variations', () => {
    expect(templateVisualFamilies).toHaveLength(6)
    expect(templateVisualFamilies.filter(family => family.kind === 'original')).toHaveLength(1)
    expect(templateVisualFamilies.filter(family => family.kind === 'variation')).toHaveLength(5)
    expect(templateShowcaseExampleRegistry).toHaveLength(6)
  })

  it('resolves whitelabel vars and one curated example for every family', () => {
    for (const family of templateVisualFamilies) {
      expect(family.example.id.length).toBeGreaterThan(0)
      expect(family.sectionStyleVars).toHaveProperty('--ntk-primary')
      expect(family.sectionStyleVars).toHaveProperty('--ntk-template-layout-drawer-bg')
      expect(family.variants).toHaveLength(2)

      for (const variant of family.variants) {
        expect(variant.styleVars).toHaveProperty('--ntk-primary')
        expect(variant.styleVars).toHaveProperty('--ntk-template-layout-drawer-bg')
        expect(variant.preset.brand.name.length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps light and dark variants available for every curated family', () => {
    expect(templateVisualFamilies.some(family => family.id === 'approved-reference')).toBe(true)
    expect(templateVisualFamilies.some(family => family.id === 'service-command')).toBe(true)

    for (const family of templateVisualFamilies) {
      expect(new Set(family.variants.map(variant => variant.tone))).toEqual(new Set(['light', 'dark']))
    }
  })
})
