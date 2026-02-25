import { describe, it, expect } from 'vitest'
import { validateCmsPageSchema } from '../../../../src/modules/cms'
import { createLandingRegistry } from '../../../../landing-page/cms/landing.registry'
import { landingPageSchema } from '../../../../landing-page/cms/landing.schema'

describe('Landing CMS integration', () => {
  it('should keep landing schema valid against landing registry', () => {
    const registry = createLandingRegistry()
    const validation = validateCmsPageSchema(landingPageSchema, { registry })

    expect(validation.valid).toBe(true)
    expect(validation.issues).toHaveLength(0)
  })

  it('should have all block types registered', () => {
    const registry = createLandingRegistry()
    const allBlocks = landingPageSchema.sections.flatMap(section => section.blocks)

    for (const block of allBlocks) {
      expect(registry.has(block.type)).toBe(true)
    }
  })
})
