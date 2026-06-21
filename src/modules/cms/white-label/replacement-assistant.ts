/**
 * Replacement assistant helpers for deprecated reusable CMS entities.
 * Provides impact previews and safe reference rewrites without coupling the
 * authoring engine to any backend workflow.
 */
import {
  collectCmsEntityUsageIndex,
  getCmsEntityUsageSummary,
  type CmsEntityUsageExplorerInput,
  type CmsEntityUsageReference,
  type CmsEntityUsageTargetKind,
} from './usage-explorer'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsBlockPresetId,
  CmsPageBlockSettings,
  CmsPageSettings,
  CmsReusableBlockSettings,
  CmsReusableSectionSettings,
} from './types'

/**
 * Deprecated entity families that support assisted replacement today.
 */
export type CmsReplacementAssistantTargetKind = Extract<
  CmsEntityUsageTargetKind,
  'authored-block-preset' | 'reusable-block' | 'reusable-section'
>

/**
 * Shared engine payload used to preview or apply one replacement.
 */
export interface CmsReplacementAssistantInput extends CmsEntityUsageExplorerInput {
  targetKind: CmsReplacementAssistantTargetKind
  entityId: string
  replacementEntityId?: string | null
}

/**
 * Impact summary returned before or after replacement execution.
 */
export interface CmsReplacementAssistantSummary {
  targetKind: CmsReplacementAssistantTargetKind
  entityId: string
  replacementEntityId: string | null
  canApply: boolean
  pageReferences: number
  reusableSectionReferences: number
  reusableBlockReferences: number
  authoredPresetReferences: number
  totalReferences: number
  references: CmsEntityUsageReference[]
}

/**
 * Full result returned after applying the replacement to the current draft.
 */
export interface CmsReplacementAssistantResult extends CmsReplacementAssistantSummary {
  pages: CmsPageSettings[]
  reusableSections: CmsReusableSectionSettings[]
  reusableBlocks: CmsReusableBlockSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Vue proxies and devtool-marked objects fall back to JSON below.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function normalizeReplacementId(value: string | null | undefined): string | null {
  const normalized = String(value ?? '').trim()
  return normalized || null
}

function createEmptySummary(input: CmsReplacementAssistantInput): CmsReplacementAssistantSummary {
  return {
    targetKind: input.targetKind,
    entityId: input.entityId,
    replacementEntityId: normalizeReplacementId(input.replacementEntityId),
    canApply: false,
    pageReferences: 0,
    reusableSectionReferences: 0,
    reusableBlockReferences: 0,
    authoredPresetReferences: 0,
    totalReferences: 0,
    references: [],
  }
}

function cloneBlockWithPresetReplacement(
  block: CmsPageBlockSettings,
  sourcePresetId: string,
  replacementPresetId: CmsBlockPresetId,
  counters: { value: number }
): CmsPageBlockSettings {
  if (block.presetId !== sourcePresetId) {
    return block
  }

  counters.value += 1
  return {
    ...block,
    presetId: replacementPresetId,
  }
}

function cloneBlockWithReusableReplacement(
  block: CmsPageBlockSettings,
  sourceReusableBlockId: string,
  replacementReusableBlockId: string,
  counters: { value: number }
): CmsPageBlockSettings {
  if (
    block.reusableMode !== 'linked'
    || block.reusableSourceId !== sourceReusableBlockId
  ) {
    return block
  }

  counters.value += 1
  return {
    ...block,
    reusableSourceId: replacementReusableBlockId,
  }
}

/**
 * Builds a deterministic impact preview for one deprecated entity replacement.
 */
export function previewCmsDeprecatedEntityReplacement(
  input: CmsReplacementAssistantInput
): CmsReplacementAssistantSummary {
  const replacementEntityId = normalizeReplacementId(input.replacementEntityId)
  if (!replacementEntityId || replacementEntityId === input.entityId) {
    return createEmptySummary(input)
  }

  const usageIndex = collectCmsEntityUsageIndex(input)
  const usageSummary = getCmsEntityUsageSummary(usageIndex, input.targetKind, input.entityId)
  if (!usageSummary || usageSummary.totalReferences === 0) {
    return createEmptySummary({
      ...input,
      replacementEntityId,
    })
  }

  return {
    targetKind: input.targetKind,
    entityId: input.entityId,
    replacementEntityId,
    canApply: true,
    pageReferences: usageSummary.pageReferences,
    reusableSectionReferences: usageSummary.reusableSectionReferences,
    reusableBlockReferences: usageSummary.reusableBlockReferences,
    authoredPresetReferences: usageSummary.authoredPresetReferences,
    totalReferences: usageSummary.totalReferences,
    references: [...usageSummary.references],
  }
}

/**
 * Applies one deprecated-entity replacement across authored CMS references.
 */
export function applyCmsDeprecatedEntityReplacement(
  input: CmsReplacementAssistantInput
): CmsReplacementAssistantResult {
  const preview = previewCmsDeprecatedEntityReplacement(input)
  const pages = cloneValue(input.pages)
  const reusableSections = cloneValue(input.reusableSections ?? [])
  const reusableBlocks = cloneValue(input.reusableBlocks ?? [])
  const authoredBlockPresets = cloneValue(input.authoredBlockPresets ?? [])

  if (!preview.canApply || !preview.replacementEntityId) {
    return {
      ...preview,
      pages,
      reusableSections,
      reusableBlocks,
      authoredBlockPresets,
    }
  }

  const replacementEntityId = preview.replacementEntityId

  const pageCounter = { value: 0 }
  const reusableSectionCounter = { value: 0 }
  const reusableBlockCounter = { value: 0 }
  const authoredPresetCounter = { value: 0 }

  switch (preview.targetKind) {
    case 'reusable-section':
      for (const page of pages) {
        page.sections = page.sections.map(section => {
          if (
            section.reusableMode !== 'linked'
            || section.reusableSourceId !== preview.entityId
          ) {
            return section
          }

          pageCounter.value += 1
          return {
            ...section,
            reusableSourceId: replacementEntityId,
          }
        })
      }
      break

    case 'reusable-block':
      for (const page of pages) {
        page.sections = page.sections.map(section => ({
          ...section,
          blocks: section.blocks.map(block => cloneBlockWithReusableReplacement(
            block,
            preview.entityId,
            replacementEntityId,
            pageCounter
          )),
        }))
      }

      for (const reusableSection of reusableSections) {
        reusableSection.blocks = reusableSection.blocks.map(block => cloneBlockWithReusableReplacement(
          block,
          preview.entityId,
          replacementEntityId,
          reusableSectionCounter
        ))
      }

      for (const preset of authoredBlockPresets) {
        if (preset.sourceReusableBlockId !== preview.entityId) {
          continue
        }

        preset.sourceReusableBlockId = replacementEntityId
        authoredPresetCounter.value += 1
      }
      break

    case 'authored-block-preset':
      for (const page of pages) {
        page.sections = page.sections.map(section => ({
          ...section,
          blocks: section.blocks.map(block => cloneBlockWithPresetReplacement(
            block,
            preview.entityId,
            replacementEntityId as CmsBlockPresetId,
            pageCounter
          )),
        }))
      }

      for (const reusableSection of reusableSections) {
        reusableSection.blocks = reusableSection.blocks.map(block => cloneBlockWithPresetReplacement(
          block,
          preview.entityId,
          replacementEntityId as CmsBlockPresetId,
          reusableSectionCounter
        ))
      }

      for (const reusableBlock of reusableBlocks) {
        if (reusableBlock.presetId !== preview.entityId) {
          continue
        }

        reusableBlock.presetId = replacementEntityId as CmsBlockPresetId
        reusableBlockCounter.value += 1
      }

      for (const preset of authoredBlockPresets) {
        if (preset.sourcePresetId !== preview.entityId) {
          continue
        }

        preset.sourcePresetId = replacementEntityId as CmsBlockPresetId
        authoredPresetCounter.value += 1
      }
      break
  }

  const totalReferences = (
    pageCounter.value
    + reusableSectionCounter.value
    + reusableBlockCounter.value
    + authoredPresetCounter.value
  )

  return {
    targetKind: preview.targetKind,
    entityId: preview.entityId,
    replacementEntityId: preview.replacementEntityId,
    canApply: totalReferences > 0,
    pageReferences: pageCounter.value,
    reusableSectionReferences: reusableSectionCounter.value,
    reusableBlockReferences: reusableBlockCounter.value,
    authoredPresetReferences: authoredPresetCounter.value,
    totalReferences,
    references: [...preview.references],
    pages,
    reusableSections,
    reusableBlocks,
    authoredBlockPresets,
  }
}