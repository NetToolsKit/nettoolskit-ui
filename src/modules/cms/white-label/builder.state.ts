/**
 * CMS builder state helpers for landing-page editing flows.
 * Provides immutable operations over page schema, block palette and selection.
 */

import type { CmsBlockNode, CmsPageSchema, CmsSectionNode } from '..'
import type { CmsBlockRegistry } from '..'

export type CmsBuilderMoveDirection = 'up' | 'down'

export interface CmsBuilderSectionPositionInput {
  sectionId: string
  targetIndex: number
}

export interface CmsBuilderBlockPositionInput {
  sourceSectionId: string
  blockId: string
  targetSectionId: string
  targetIndex: number
}

export interface CmsBuilderSelection {
  sectionId: string
  blockId?: string
}

export interface CmsBuilderPaletteItem {
  type: string
  displayName: string
  category: string
  description?: string
  acceptsChildren: boolean
}

export interface CmsBuilderState {
  page: CmsPageSchema
  selection: CmsBuilderSelection | null
}

/**
 * Creates a defensive clone for schema objects.
 */
function clonePageSchema(schema: CmsPageSchema): CmsPageSchema {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(schema)
    } catch {
      return JSON.parse(JSON.stringify(schema)) as CmsPageSchema
    }
  }
  return JSON.parse(JSON.stringify(schema)) as CmsPageSchema
}

/**
 * Resolves the first valid section/block selection from a schema.
 */
function resolveInitialSelection(page: CmsPageSchema): CmsBuilderSelection | null {
  const firstSection = page.sections[0]
  if (!firstSection) {
    return null
  }

  return {
    sectionId: firstSection.id,
    blockId: firstSection.blocks[0]?.id,
  }
}

/**
 * Finds a section by id or throws a descriptive error.
 */
function findSectionById(page: CmsPageSchema, sectionId: string): CmsSectionNode {
  const section = page.sections.find(entry => entry.id === sectionId)
  if (!section) {
    throw new Error(`Section "${sectionId}" was not found in CMS page schema.`)
  }
  return section
}

/**
 * Finds a section index by id or throws a descriptive error.
 */
function findSectionIndexById(page: CmsPageSchema, sectionId: string): number {
  const sectionIndex = page.sections.findIndex(entry => entry.id === sectionId)
  if (sectionIndex < 0) {
    throw new Error(`Section "${sectionId}" was not found in CMS page schema.`)
  }
  return sectionIndex
}

/**
 * Ensures a unique block id based on type and current page content.
 */
function createUniqueBlockId(page: CmsPageSchema, blockType: string): string {
  const normalized = blockType.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'block'
  const ids = new Set(
    page.sections.flatMap(section => section.blocks.map(block => block.id))
  )

  let suffix = 1
  let candidate = `${normalized}-${suffix}`
  while (ids.has(candidate)) {
    suffix += 1
    candidate = `${normalized}-${suffix}`
  }
  return candidate
}

/**
 * Creates builder state from a runtime schema.
 */
export function createCmsBuilderState(schema: CmsPageSchema): CmsBuilderState {
  const page = clonePageSchema(schema)
  return {
    page,
    selection: resolveInitialSelection(page),
  }
}

/**
 * Returns a flat block palette from registry definitions.
 */
export function listCmsBuilderPalette(registry: CmsBlockRegistry): CmsBuilderPaletteItem[] {
  return registry
    .list()
    .map(definition => ({
      type: definition.type,
      displayName: definition.displayName,
      category: definition.category,
      description: definition.description,
      acceptsChildren: Boolean(definition.acceptsChildren),
    }))
    .sort((left, right) => {
      if (left.category === right.category) {
        return left.displayName.localeCompare(right.displayName)
      }
      return left.category.localeCompare(right.category)
    })
}

/**
 * Selects a section/block in builder state.
 */
export function selectCmsBuilderNode(
  state: CmsBuilderState,
  selection: CmsBuilderSelection | null
): CmsBuilderState {
  if (!selection) {
    return {
      ...state,
      selection: null,
    }
  }

  const page = clonePageSchema(state.page)
  const section = findSectionById(page, selection.sectionId)

  if (selection.blockId && !section.blocks.some(block => block.id === selection.blockId)) {
    throw new Error(`Block "${selection.blockId}" was not found in section "${selection.sectionId}".`)
  }

  return {
    page,
    selection,
  }
}

/**
 * Inserts a new block instance from registry into a section.
 */
export function insertCmsBuilderBlock(
  state: CmsBuilderState,
  registry: CmsBlockRegistry,
  input: {
    sectionId: string
    type: string
    index?: number
  }
): CmsBuilderState {
  const page = clonePageSchema(state.page)
  const section = findSectionById(page, input.sectionId)
  const blockId = createUniqueBlockId(page, input.type)
  const block = registry.createBlockInstance(input.type, { id: blockId })
  const index = typeof input.index === 'number'
    ? Math.max(0, Math.min(input.index, section.blocks.length))
    : section.blocks.length

  section.blocks.splice(index, 0, block)

  return {
    page,
    selection: {
      sectionId: input.sectionId,
      blockId: block.id,
    },
  }
}

/**
 * Removes a block from a section and keeps selection coherent.
 */
export function removeCmsBuilderBlock(
  state: CmsBuilderState,
  input: {
    sectionId: string
    blockId: string
  }
): CmsBuilderState {
  const page = clonePageSchema(state.page)
  const section = findSectionById(page, input.sectionId)
  const index = section.blocks.findIndex(block => block.id === input.blockId)

  if (index < 0) {
    throw new Error(`Block "${input.blockId}" was not found in section "${input.sectionId}".`)
  }

  section.blocks.splice(index, 1)

  const fallbackBlock = section.blocks[index] ?? section.blocks[index - 1]
  return {
    page,
    selection: {
      sectionId: input.sectionId,
      blockId: fallbackBlock?.id,
    },
  }
}

/**
 * Moves a block one position up or down inside a section.
 */
export function moveCmsBuilderBlock(
  state: CmsBuilderState,
  input: {
    sectionId: string
    blockId: string
    direction: CmsBuilderMoveDirection
  }
): CmsBuilderState {
  const page = clonePageSchema(state.page)
  const section = findSectionById(page, input.sectionId)
  const index = section.blocks.findIndex(block => block.id === input.blockId)

  if (index < 0) {
    throw new Error(`Block "${input.blockId}" was not found in section "${input.sectionId}".`)
  }

  const targetIndex = input.direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= section.blocks.length) {
    return {
      page,
      selection: {
        sectionId: input.sectionId,
        blockId: input.blockId,
      },
    }
  }

  const [block] = section.blocks.splice(index, 1)
  section.blocks.splice(targetIndex, 0, block as CmsBlockNode)

  return {
    page,
    selection: {
      sectionId: input.sectionId,
      blockId: input.blockId,
    },
  }
}

/**
 * Repositions a section to a specific index for drag-and-drop flows.
 */
export function moveCmsBuilderSectionToIndex(
  state: CmsBuilderState,
  input: CmsBuilderSectionPositionInput
): CmsBuilderState {
  const page = clonePageSchema(state.page)
  const sourceIndex = findSectionIndexById(page, input.sectionId)
  const sectionCount = page.sections.length
  const targetIndex = Math.max(0, Math.min(input.targetIndex, sectionCount - 1))

  if (sourceIndex === targetIndex) {
    return {
      page,
      selection: state.selection
        ? { ...state.selection }
        : null,
    }
  }

  const [section] = page.sections.splice(sourceIndex, 1)
  page.sections.splice(targetIndex, 0, section as CmsSectionNode)

  return {
    page,
    selection: state.selection
      ? { ...state.selection }
      : resolveInitialSelection(page),
  }
}

/**
 * Repositions a block inside the same section or across sections for drag-and-drop flows.
 */
export function moveCmsBuilderBlockToIndex(
  state: CmsBuilderState,
  input: CmsBuilderBlockPositionInput
): CmsBuilderState {
  const page = clonePageSchema(state.page)
  const sourceSection = findSectionById(page, input.sourceSectionId)
  const blockIndex = sourceSection.blocks.findIndex(block => block.id === input.blockId)

  if (blockIndex < 0) {
    throw new Error(`Block "${input.blockId}" was not found in section "${input.sourceSectionId}".`)
  }

  const targetSection = findSectionById(page, input.targetSectionId)
  const targetIndexBase = Math.max(0, Math.min(input.targetIndex, targetSection.blocks.length))

  if (input.sourceSectionId === input.targetSectionId) {
    const clampedTargetIndex = targetIndexBase >= sourceSection.blocks.length
      ? sourceSection.blocks.length - 1
      : targetIndexBase

    if (blockIndex === clampedTargetIndex) {
      return {
        page,
        selection: {
          sectionId: input.sourceSectionId,
          blockId: input.blockId,
        },
      }
    }

    const [block] = sourceSection.blocks.splice(blockIndex, 1)
    sourceSection.blocks.splice(clampedTargetIndex, 0, block as CmsBlockNode)

    return {
      page,
      selection: {
        sectionId: input.sourceSectionId,
        blockId: input.blockId,
      },
    }
  }

  const [block] = sourceSection.blocks.splice(blockIndex, 1)
  const targetIndex = Math.max(0, Math.min(targetIndexBase, targetSection.blocks.length))
  targetSection.blocks.splice(targetIndex, 0, block as CmsBlockNode)

  return {
    page,
    selection: {
      sectionId: input.targetSectionId,
      blockId: input.blockId,
    },
  }
}