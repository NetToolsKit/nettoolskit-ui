import { describe, expect, it } from 'vitest'

import { templateVisualFamilies } from '../../../samples/template-showcase/families/template-visual-families'

describe('templateVisualFamilies', () => {
  it('defines exactly five curated config-driven families', () => {
    expect(templateVisualFamilies).toHaveLength(5)
    expect(new Set(templateVisualFamilies.map(family => family.layout)).size).toBe(5)
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

    for (const family of templateVisualFamilies) {
      expect(new Set(family.variants.map(variant => variant.tone))).toEqual(new Set(['light', 'dark']))
    }
  })
})
