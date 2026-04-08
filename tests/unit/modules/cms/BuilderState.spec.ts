/**
 * Tests/unit/modules/cms/Builder State spec module.
 */

import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { createLandingRegistry, landingPageSchema } from '../../../../src/modules/cms/presets/landing'
import {
  createCmsBuilderState,
  insertCmsBuilderBlock,
  listCmsBuilderPalette,
  moveCmsBuilderBlock,
  moveCmsBuilderBlockToIndex,
  moveCmsBuilderSectionToIndex,
  removeCmsBuilderBlock,
  selectCmsBuilderNode,
} from '../../../../src/modules/cms/white-label/builder.state'

describe('builder.state', () => {
  it('creates an editable state with first section/block selected', () => {
    const state = createCmsBuilderState(landingPageSchema)

    expect(state.selection?.sectionId).toBe(landingPageSchema.sections[0]?.id)
    expect(state.selection?.blockId).toBe(landingPageSchema.sections[0]?.blocks[0]?.id)
    expect(state.page).not.toBe(landingPageSchema)
  })

  it('lists palette items from registry definitions', () => {
    const registry = createLandingRegistry()
    const palette = listCmsBuilderPalette(registry)

    expect(palette.length).toBeGreaterThan(0)
    expect(palette.some(item => item.type === 'landing.hero')).toBe(true)
    expect(palette.every(item => item.displayName.length > 0)).toBe(true)
  })

  it('inserts a new block into selected section', () => {
    const registry = createLandingRegistry()
    const initial = createCmsBuilderState(landingPageSchema)
    const targetSectionId = initial.page.sections.find(section => section.id === 'features')?.id ?? initial.page.sections[0].id

    const next = insertCmsBuilderBlock(initial, registry, {
      sectionId: targetSectionId,
      type: 'landing.hero',
    })

    const section = next.page.sections.find(entry => entry.id === targetSectionId)
    expect(section?.blocks.some(block => block.type === 'landing.hero')).toBe(true)
    expect(next.selection?.sectionId).toBe(targetSectionId)
    expect(next.selection?.blockId).toBeDefined()
  })

  it('moves blocks up and down within a section', () => {
    const registry = createLandingRegistry()
    const initial = createCmsBuilderState(landingPageSchema)
    const sectionId = 'features'

    const withInserted = insertCmsBuilderBlock(initial, registry, {
      sectionId,
      type: 'landing.hero',
      index: 0,
    })

    const insertedBlockId = withInserted.selection?.blockId
    expect(insertedBlockId).toBeDefined()

    const movedDown = moveCmsBuilderBlock(withInserted, {
      sectionId,
      blockId: String(insertedBlockId),
      direction: 'down',
    })
    const movedSection = movedDown.page.sections.find(section => section.id === sectionId)
    expect(movedSection?.blocks[1]?.id).toBe(insertedBlockId)

    const movedUp = moveCmsBuilderBlock(movedDown, {
      sectionId,
      blockId: String(insertedBlockId),
      direction: 'up',
    })
    const movedUpSection = movedUp.page.sections.find(section => section.id === sectionId)
    expect(movedUpSection?.blocks[0]?.id).toBe(insertedBlockId)
  })

  it('repositions sections by index for drag-and-drop flows', () => {
    const initial = createCmsBuilderState(landingPageSchema)

    const moved = moveCmsBuilderSectionToIndex(initial, {
      sectionId: 'footer',
      targetIndex: 1,
    })

    expect(moved.page.sections[1]?.id).toBe('footer')
    expect(moved.selection?.sectionId).toBe(initial.selection?.sectionId)
  })

  it('moves blocks across sections by index for drag-and-drop flows', () => {
    const initial = createCmsBuilderState(landingPageSchema)
    const moved = moveCmsBuilderBlockToIndex(initial, {
      sourceSectionId: 'hero',
      blockId: 'hero-main',
      targetSectionId: 'features',
      targetIndex: 1,
    })

    const heroSection = moved.page.sections.find(section => section.id === 'hero')
    const featuresSection = moved.page.sections.find(section => section.id === 'features')

    expect(heroSection?.blocks.some(block => block.id === 'hero-main')).toBe(false)
    expect(featuresSection?.blocks[1]?.id).toBe('hero-main')
    expect(moved.selection?.sectionId).toBe('features')
    expect(moved.selection?.blockId).toBe('hero-main')
  })

  it('removes a block and keeps selection on neighbor', () => {
    const initial = createCmsBuilderState(landingPageSchema)
    const sectionId = 'hero'
    const blockId = initial.page.sections.find(section => section.id === sectionId)?.blocks[0]?.id

    expect(blockId).toBeDefined()

    const next = removeCmsBuilderBlock(initial, {
      sectionId,
      blockId: String(blockId),
    })

    const section = next.page.sections.find(entry => entry.id === sectionId)
    expect(section?.blocks.length).toBe(0)
    expect(next.selection?.sectionId).toBe(sectionId)
    expect(next.selection?.blockId).toBeUndefined()
  })

  it('validates section/block selection consistency', () => {
    const initial = createCmsBuilderState(landingPageSchema)
    const selected = selectCmsBuilderNode(initial, {
      sectionId: 'features',
      blockId: 'features-main',
    })

    expect(selected.selection?.sectionId).toBe('features')
    expect(selected.selection?.blockId).toBe('features-main')
  })

  it('clones schemas containing reactive nested props without throwing', () => {
    const reactiveSchema = reactive({
      version: 1,
      id: 'page-1',
      slug: '/',
      title: 'Landing',
      status: 'draft' as const,
      sections: [
        {
          id: 'hero',
          layout: 'single' as const,
          settings: {
            label: 'Hero',
            enabled: true,
            presetId: 'hero',
          },
          blocks: [
            {
              id: 'hero-block-1',
              type: 'landing.hero',
              props: {
                title: 'Reactive hero',
                items: reactive([
                  { label: 'One', value: '1' },
                  { label: 'Two', value: '2' },
                ]),
              },
              settings: {
                enabled: true,
                presetId: 'landing-hero-product-launch',
              },
            },
          ],
        },
      ],
    })

    const state = createCmsBuilderState(reactiveSchema)

    expect(state.page.sections[0]?.blocks[0]?.id).toBe('hero-block-1')
    expect(Array.isArray((state.page.sections[0]?.blocks[0]?.props as { items?: unknown[] })?.items)).toBe(true)
  })
})