/**
 * Cross-entity usage helpers for the CMS engine.
 * Centralizes impact analysis so authoring surfaces can block destructive
 * actions and explain where reusable content is currently consumed.
 */
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsPageSettings,
  CmsReusableBlockSettings,
  CmsReusableSectionSettings,
} from './types'

export type CmsEntityUsageSource =
  | 'page'
  | 'reusable-section'
  | 'reusable-block'
  | 'authored-block-preset'

export interface CmsEntityUsageReference {
  source: CmsEntityUsageSource
  label: string
  description: string
  pageId?: string
  sectionId?: string
  blockId?: string
}

export interface CmsEntityUsageSummary {
  entityId: string
  pageReferences: number
  reusableSectionReferences: number
  reusableBlockReferences: number
  authoredPresetReferences: number
  totalReferences: number
  references: CmsEntityUsageReference[]
}

export interface CmsEntityUsageIndex {
  contentModels: Map<string, CmsEntityUsageSummary>
  authoredBlockPresets: Map<string, CmsEntityUsageSummary>
  reusableBlocks: Map<string, CmsEntityUsageSummary>
  reusableSections: Map<string, CmsEntityUsageSummary>
}

export interface CmsEntityUsageExplorerInput {
  pages: CmsPageSettings[]
  authoredContentModels?: CmsAuthoredContentModelSettings[]
  authoredBlockPresets?: CmsAuthoredBlockPresetSettings[]
  reusableBlocks?: CmsReusableBlockSettings[]
  reusableSections?: CmsReusableSectionSettings[]
}

function createEmptySummary(entityId: string): CmsEntityUsageSummary {
  return {
    entityId,
    pageReferences: 0,
    reusableSectionReferences: 0,
    reusableBlockReferences: 0,
    authoredPresetReferences: 0,
    totalReferences: 0,
    references: [],
  }
}

function createSummaryMap(ids: Iterable<string>): Map<string, CmsEntityUsageSummary> {
  const map = new Map<string, CmsEntityUsageSummary>()
  for (const id of ids) {
    map.set(id, createEmptySummary(id))
  }
  return map
}

function pushReference(
  map: Map<string, CmsEntityUsageSummary>,
  entityId: string,
  source: CmsEntityUsageSource,
  reference: Omit<CmsEntityUsageReference, 'source'>
): void {
  const summary = map.get(entityId)
  if (!summary) {
    return
  }

  switch (source) {
    case 'page':
      summary.pageReferences += 1
      break
    case 'reusable-section':
      summary.reusableSectionReferences += 1
      break
    case 'reusable-block':
      summary.reusableBlockReferences += 1
      break
    case 'authored-block-preset':
      summary.authoredPresetReferences += 1
      break
  }

  summary.totalReferences += 1
  summary.references.push({
    source,
    ...reference,
  })
}

/**
 * Builds one engine-wide usage index for authored content models, authored
 * block presets and reusable content libraries.
 */
export function collectCmsEntityUsageIndex(input: CmsEntityUsageExplorerInput): CmsEntityUsageIndex {
  const contentModelIds = new Set<string>((input.authoredContentModels ?? []).map(model => model.id))
  const authoredBlockPresetIds = new Set<string>((input.authoredBlockPresets ?? []).map(preset => preset.id))
  const reusableBlockIds = new Set<string>((input.reusableBlocks ?? []).map(block => block.id))
  const reusableSectionIds = new Set<string>((input.reusableSections ?? []).map(section => section.id))

  const usageIndex: CmsEntityUsageIndex = {
    contentModels: createSummaryMap(contentModelIds),
    authoredBlockPresets: createSummaryMap(authoredBlockPresetIds),
    reusableBlocks: createSummaryMap(reusableBlockIds),
    reusableSections: createSummaryMap(reusableSectionIds),
  }

  for (const page of input.pages) {
    if (contentModelIds.has(page.contentModelId)) {
      pushReference(usageIndex.contentModels, page.contentModelId, 'page', {
        label: page.title,
        description: page.path,
        pageId: page.id,
      })
    }

    for (const section of page.sections) {
      if (
        section.reusableMode === 'linked'
        && section.reusableSourceId
        && reusableSectionIds.has(section.reusableSourceId)
      ) {
        pushReference(usageIndex.reusableSections, section.reusableSourceId, 'page', {
          label: `${page.title} -> ${section.label}`,
          description: page.path,
          pageId: page.id,
          sectionId: section.id,
        })
      }

      for (const block of section.blocks) {
        if (block.presetId && authoredBlockPresetIds.has(block.presetId)) {
          pushReference(usageIndex.authoredBlockPresets, block.presetId, 'page', {
            label: `${page.title} -> ${section.label} -> ${block.id}`,
            description: block.type,
            pageId: page.id,
            sectionId: section.id,
            blockId: block.id,
          })
        }

        if (
          block.reusableMode === 'linked'
          && block.reusableSourceId
          && reusableBlockIds.has(block.reusableSourceId)
        ) {
          pushReference(usageIndex.reusableBlocks, block.reusableSourceId, 'page', {
            label: `${page.title} -> ${section.label} -> ${block.id}`,
            description: block.type,
            pageId: page.id,
            sectionId: section.id,
            blockId: block.id,
          })
        }
      }
    }
  }

  for (const reusableSection of input.reusableSections ?? []) {
    if (contentModelIds.has(reusableSection.contentModelId)) {
      pushReference(usageIndex.contentModels, reusableSection.contentModelId, 'reusable-section', {
        label: reusableSection.name,
        description: reusableSection.presetId,
        sectionId: reusableSection.id,
      })
    }

    for (const block of reusableSection.blocks) {
      if (block.presetId && authoredBlockPresetIds.has(block.presetId)) {
        pushReference(usageIndex.authoredBlockPresets, block.presetId, 'reusable-section', {
          label: `${reusableSection.name} -> ${block.id}`,
          description: block.type,
          sectionId: reusableSection.id,
          blockId: block.id,
        })
      }

      if (
        block.reusableMode === 'linked'
        && block.reusableSourceId
        && reusableBlockIds.has(block.reusableSourceId)
      ) {
        pushReference(usageIndex.reusableBlocks, block.reusableSourceId, 'reusable-section', {
          label: `${reusableSection.name} -> ${block.id}`,
          description: block.type,
          sectionId: reusableSection.id,
          blockId: block.id,
        })
      }
    }
  }

  for (const reusableBlock of input.reusableBlocks ?? []) {
    if (reusableBlock.presetId && authoredBlockPresetIds.has(reusableBlock.presetId)) {
      pushReference(usageIndex.authoredBlockPresets, reusableBlock.presetId, 'reusable-block', {
        label: reusableBlock.name,
        description: reusableBlock.type,
        blockId: reusableBlock.id,
      })
    }
  }

  for (const preset of input.authoredBlockPresets ?? []) {
    if (preset.sourcePresetId && authoredBlockPresetIds.has(preset.sourcePresetId)) {
      pushReference(usageIndex.authoredBlockPresets, preset.sourcePresetId, 'authored-block-preset', {
        label: preset.name,
        description: preset.type,
      })
    }

    if (preset.sourceReusableBlockId && reusableBlockIds.has(preset.sourceReusableBlockId)) {
      pushReference(usageIndex.reusableBlocks, preset.sourceReusableBlockId, 'authored-block-preset', {
        label: preset.name,
        description: preset.type,
      })
    }
  }

  return usageIndex
}