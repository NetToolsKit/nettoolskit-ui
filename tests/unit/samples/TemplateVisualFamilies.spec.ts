import { describe, expect, it } from 'vitest'

import { templateVisualFamilies } from '../../../samples/template-showcase/families/template-visual-families'

describe('templateVisualFamilies', () => {
  it('defines at least five distinct config-driven families', () => {
    expect(templateVisualFamilies.length).toBeGreaterThanOrEqual(5)
    expect(new Set(templateVisualFamilies.map(family => family.layout)).size).toBeGreaterThanOrEqual(5)
  })

  it('resolves whitelabel vars and reusable examples for every family', () => {
    for (const family of templateVisualFamilies) {
      expect(family.examples.length).toBeGreaterThan(0)
      expect(family.styleVars).toHaveProperty('--ntk-primary')
      expect(family.styleVars).toHaveProperty('--ntk-template-layout-drawer-bg')
      expect(family.preset.brand.name.length).toBeGreaterThan(0)
    }
  })

  it('keeps the approved dashboard baseline available across every family variation', () => {
    expect(templateVisualFamilies.some(family => family.id === 'approved-reference')).toBe(true)

    for (const family of templateVisualFamilies) {
      expect(family.examples.some(example => example.id === 'layout-dashboard')).toBe(true)
    }
  })
})
