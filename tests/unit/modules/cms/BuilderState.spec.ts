/**
 * Tests/unit/modules/cms/Builder State spec module.
 */

import { describe, expect, it } from 'vitest'
import { createLandingRegistry } from '../../../../landing-page/cms/landing.registry'
import { landingPageSchema } from '../../../../landing-page/cms/landing.schema'
import {
  createCmsBuilderState,
  insertCmsBuilderBlock,
  listCmsBuilderPalette,
  moveCmsBuilderBlock,
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
})