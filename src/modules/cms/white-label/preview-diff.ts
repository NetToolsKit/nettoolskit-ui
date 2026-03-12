/**
 * CMS preview diff helpers.
 * Compare the in-memory draft against the best available published snapshot so
 * authors can review meaningful changes before publishing.
 */

import { createCmsReleaseSnapshot } from '../releases/orchestration'
import { resolveCmsPreviewPublishedRelease } from './preview'
import type {
  CmsPageBlockSettings,
  CmsPageSectionSettings,
  CmsPageSettings,
  CmsReleaseEnvironment,
  CmsWhiteLabelSettings,
} from './types'

/**
 * Entity-level review statuses exposed by the preview diff engine.
 */
export type CmsPreviewDiffStatus = 'added' | 'removed' | 'changed' | 'unchanged'

/**
 * Aggregate counts for one diff entity family.
 */
export interface CmsPreviewDiffCounterSummary {
  added: number
  removed: number
  changed: number
  unchanged: number
  totalDraft: number
  totalPublished: number
}

/**
 * Block-level draft/published comparison summary.
 */
export interface CmsPreviewBlockDiffSummary {
  pageId: string
  sectionId: string
  blockId: string
  draftType: string | null
  publishedType: string | null
  status: CmsPreviewDiffStatus
}

/**
 * Section-level draft/published comparison summary.
 */
export interface CmsPreviewSectionDiffSummary {
  pageId: string
  sectionId: string
  draftLabel: string | null
  publishedLabel: string | null
  status: CmsPreviewDiffStatus
  blockSummary: CmsPreviewDiffCounterSummary
  blocks: CmsPreviewBlockDiffSummary[]
}

/**
 * Page-level draft/published comparison summary.
 */
export interface CmsPreviewPageDiffSummary {
  pageId: string
  draftTitle: string | null
  publishedTitle: string | null
  draftPath: string | null
  publishedPath: string | null
  status: CmsPreviewDiffStatus
  sectionSummary: CmsPreviewDiffCounterSummary
  blockSummary: CmsPreviewDiffCounterSummary
  sections: CmsPreviewSectionDiffSummary[]
}

/**
 * Whole-preview diff summary used by Pages and Blocks review surfaces.
 */
export interface CmsPreviewDraftPublishedDiff {
  releaseId: string
  releaseName: string
  releaseEnvironment: CmsReleaseEnvironment
  publishedAt: string | null
  pageSummary: CmsPreviewDiffCounterSummary
  sectionSummary: CmsPreviewDiffCounterSummary
  blockSummary: CmsPreviewDiffCounterSummary
  pages: CmsPreviewPageDiffSummary[]
  hasChanges: boolean
}

/**
 * Options for resolving the draft/published review snapshot pair.
 */
export interface ResolveCmsPreviewDraftPublishedDiffOptions {
  selectedReleaseId?: string | null
  activeEnvironment?: CmsReleaseEnvironment | null
}

/**
 * Clones plain CMS payload values without preserving reactivity.
 */
function cloneValue<T>(value: T): T {
  if (typeof globalThis.structuredClone === 'function') {
    try {
      return globalThis.structuredClone(value)
    } catch {
      // Vue may still hand reactive proxies to the diff layer during authoring.
      // Fall back to JSON cloning so review surfaces never crash the builder.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Converts arbitrary values into stable comparable structures.
 */
function normalizeComparableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeComparableValue)
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))

    return Object.fromEntries(entries.map(([key, entryValue]) => [
      key,
      normalizeComparableValue(entryValue),
    ]))
  }

  return value
}

/**
 * Performs deterministic equality over nested CMS settings payloads.
 */
function isComparableEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(normalizeComparableValue(left)) === JSON.stringify(normalizeComparableValue(right))
}

/**
 * Returns a stable counter summary seed.
 */
function createEmptyCounterSummary(): CmsPreviewDiffCounterSummary {
  return {
    added: 0,
    removed: 0,
    changed: 0,
    unchanged: 0,
    totalDraft: 0,
    totalPublished: 0,
  }
}

/**
 * Builds a map from entity ids, dropping blank ids to avoid unstable comparisons.
 */
function createEntityMap<T extends { id: string }>(items: T[]): Map<string, T> {
  const map = new Map<string, T>()
  for (const item of items) {
    const id = String(item.id ?? '').trim()
    if (!id) {
      continue
    }
    map.set(id, item)
  }
  return map
}

/**
 * Creates a normalized block array when older snapshots omitted the `blocks` field.
 */
function normalizeSectionBlocks(section: CmsPageSectionSettings | undefined | null): CmsPageBlockSettings[] {
  return Array.isArray(section?.blocks)
    ? cloneValue(section.blocks)
    : []
}

/**
 * Returns the comparable payload for one page, excluding sections.
 */
function getComparablePage(page: CmsPageSettings) {
  return {
    contentModelId: page.contentModelId,
    contentModelVersion: page.contentModelVersion ?? null,
    title: page.title,
    path: page.path,
    status: page.status,
    description: page.description,
    customFields: page.customFields ?? {},
    localization: page.localization ?? {},
  }
}

/**
 * Returns the comparable payload for one section, excluding blocks.
 */
function getComparableSection(section: CmsPageSectionSettings) {
  return {
    presetId: section.presetId,
    label: section.label,
    enabled: section.enabled,
    customFields: section.customFields ?? {},
    reusableMode: section.reusableMode ?? null,
    reusableSourceId: section.reusableSourceId ?? null,
    localization: section.localization ?? {},
  }
}

/**
 * Returns the comparable payload for one block.
 */
function getComparableBlock(block: CmsPageBlockSettings) {
  return {
    type: block.type,
    presetId: block.presetId ?? null,
    enabled: block.enabled,
    reusableMode: block.reusableMode ?? null,
    reusableSourceId: block.reusableSourceId ?? null,
    props: block.props ?? {},
    localization: block.localization ?? {},
  }
}

/**
 * Increments aggregate counters for one diff status.
 */
function incrementCounter(summary: CmsPreviewDiffCounterSummary, status: CmsPreviewDiffStatus): void {
  if (status === 'added') {
    summary.added += 1
    return
  }

  if (status === 'removed') {
    summary.removed += 1
    return
  }

  if (status === 'changed') {
    summary.changed += 1
    return
  }

  summary.unchanged += 1
}

/**
 * Adds two counter summaries together.
 */
function mergeCounterSummary(
  target: CmsPreviewDiffCounterSummary,
  source: CmsPreviewDiffCounterSummary
): CmsPreviewDiffCounterSummary {
  target.added += source.added
  target.removed += source.removed
  target.changed += source.changed
  target.unchanged += source.unchanged
  target.totalDraft += source.totalDraft
  target.totalPublished += source.totalPublished
  return target
}

/**
 * Compares block collections inside one section.
 */
function compareBlocks(
  pageId: string,
  sectionId: string,
  draftBlocksInput: CmsPageBlockSettings[],
  publishedBlocksInput: CmsPageBlockSettings[]
): { blocks: CmsPreviewBlockDiffSummary[], summary: CmsPreviewDiffCounterSummary } {
  const draftBlocks = cloneValue(draftBlocksInput)
  const publishedBlocks = cloneValue(publishedBlocksInput)
  const draftMap = createEntityMap(draftBlocks)
  const publishedMap = createEntityMap(publishedBlocks)
  const ids = Array.from(new Set([...draftMap.keys(), ...publishedMap.keys()])).sort()
  const summary = createEmptyCounterSummary()
  summary.totalDraft = draftMap.size
  summary.totalPublished = publishedMap.size

  const blocks = ids.map(blockId => {
    const draftBlock = draftMap.get(blockId) ?? null
    const publishedBlock = publishedMap.get(blockId) ?? null
    let status: CmsPreviewDiffStatus = 'unchanged'

    if (draftBlock && !publishedBlock) {
      status = 'added'
    } else if (!draftBlock && publishedBlock) {
      status = 'removed'
    } else if (
      draftBlock
      && publishedBlock
      && !isComparableEqual(getComparableBlock(draftBlock), getComparableBlock(publishedBlock))
    ) {
      status = 'changed'
    }

    incrementCounter(summary, status)

    return {
      pageId,
      sectionId,
      blockId,
      draftType: draftBlock?.type ?? null,
      publishedType: publishedBlock?.type ?? null,
      status,
    }
  })

  return { blocks, summary }
}

/**
 * Compares section collections inside one page.
 */
function compareSections(
  pageId: string,
  draftSectionsInput: CmsPageSectionSettings[],
  publishedSectionsInput: CmsPageSectionSettings[]
): { sections: CmsPreviewSectionDiffSummary[], sectionSummary: CmsPreviewDiffCounterSummary, blockSummary: CmsPreviewDiffCounterSummary } {
  const draftSections = cloneValue(draftSectionsInput)
  const publishedSections = cloneValue(publishedSectionsInput)
  const draftMap = createEntityMap(draftSections)
  const publishedMap = createEntityMap(publishedSections)
  const ids = Array.from(new Set([...draftMap.keys(), ...publishedMap.keys()])).sort()
  const sectionSummary = createEmptyCounterSummary()
  const blockSummary = createEmptyCounterSummary()
  sectionSummary.totalDraft = draftMap.size
  sectionSummary.totalPublished = publishedMap.size

  const sections = ids.map(sectionId => {
    const draftSection = draftMap.get(sectionId) ?? null
    const publishedSection = publishedMap.get(sectionId) ?? null
    const comparedBlocks = compareBlocks(
      pageId,
      sectionId,
      normalizeSectionBlocks(draftSection),
      normalizeSectionBlocks(publishedSection)
    )

    let status: CmsPreviewDiffStatus = 'unchanged'

    if (draftSection && !publishedSection) {
      status = 'added'
    } else if (!draftSection && publishedSection) {
      status = 'removed'
    } else if (
      draftSection
      && publishedSection
      && (
        !isComparableEqual(getComparableSection(draftSection), getComparableSection(publishedSection))
        || comparedBlocks.summary.added > 0
        || comparedBlocks.summary.removed > 0
        || comparedBlocks.summary.changed > 0
      )
    ) {
      status = 'changed'
    }

    incrementCounter(sectionSummary, status)
    mergeCounterSummary(blockSummary, comparedBlocks.summary)

    return {
      pageId,
      sectionId,
      draftLabel: draftSection?.label ?? null,
      publishedLabel: publishedSection?.label ?? null,
      status,
      blockSummary: comparedBlocks.summary,
      blocks: comparedBlocks.blocks,
    }
  })

  return { sections, sectionSummary, blockSummary }
}

/**
 * Compares page collections between draft and published snapshots.
 */
function comparePages(
  draftPagesInput: CmsPageSettings[],
  publishedPagesInput: CmsPageSettings[]
): { pages: CmsPreviewPageDiffSummary[], pageSummary: CmsPreviewDiffCounterSummary, sectionSummary: CmsPreviewDiffCounterSummary, blockSummary: CmsPreviewDiffCounterSummary } {
  const draftPages = cloneValue(draftPagesInput)
  const publishedPages = cloneValue(publishedPagesInput)
  const draftMap = createEntityMap(draftPages)
  const publishedMap = createEntityMap(publishedPages)
  const ids = Array.from(new Set([...draftMap.keys(), ...publishedMap.keys()])).sort()
  const pageSummary = createEmptyCounterSummary()
  const sectionSummary = createEmptyCounterSummary()
  const blockSummary = createEmptyCounterSummary()
  pageSummary.totalDraft = draftMap.size
  pageSummary.totalPublished = publishedMap.size

  const pages = ids.map(pageId => {
    const draftPage = draftMap.get(pageId) ?? null
    const publishedPage = publishedMap.get(pageId) ?? null
    const comparedSections = compareSections(
      pageId,
      draftPage?.sections ?? [],
      publishedPage?.sections ?? []
    )

    let status: CmsPreviewDiffStatus = 'unchanged'

    if (draftPage && !publishedPage) {
      status = 'added'
    } else if (!draftPage && publishedPage) {
      status = 'removed'
    } else if (
      draftPage
      && publishedPage
      && (
        !isComparableEqual(getComparablePage(draftPage), getComparablePage(publishedPage))
        || comparedSections.sectionSummary.added > 0
        || comparedSections.sectionSummary.removed > 0
        || comparedSections.sectionSummary.changed > 0
        || comparedSections.blockSummary.added > 0
        || comparedSections.blockSummary.removed > 0
        || comparedSections.blockSummary.changed > 0
      )
    ) {
      status = 'changed'
    }

    incrementCounter(pageSummary, status)
    mergeCounterSummary(sectionSummary, comparedSections.sectionSummary)
    mergeCounterSummary(blockSummary, comparedSections.blockSummary)

    return {
      pageId,
      draftTitle: draftPage?.title ?? null,
      publishedTitle: publishedPage?.title ?? null,
      draftPath: draftPage?.path ?? null,
      publishedPath: publishedPage?.path ?? null,
      status,
      sectionSummary: comparedSections.sectionSummary,
      blockSummary: comparedSections.blockSummary,
      sections: comparedSections.sections,
    }
  })

  return { pages, pageSummary, sectionSummary, blockSummary }
}

/**
 * Resolves a deterministic review diff between the current draft and the
 * selected published snapshot. Returns null when no published release exists.
 */
export function resolveCmsPreviewDraftPublishedDiff(
  settings: CmsWhiteLabelSettings,
  options: ResolveCmsPreviewDraftPublishedDiffOptions = {}
): CmsPreviewDraftPublishedDiff | null {
  const publishedRelease = resolveCmsPreviewPublishedRelease(settings, {
    selectedReleaseId: options.selectedReleaseId,
    activeEnvironment: options.activeEnvironment,
  })

  if (!publishedRelease) {
    return null
  }

  const draftSnapshot = createCmsReleaseSnapshot(settings)
  const publishedSnapshot = publishedRelease.snapshot
  const comparedPages = comparePages(draftSnapshot.pages, publishedSnapshot.pages)

  return {
    releaseId: publishedRelease.id,
    releaseName: publishedRelease.name,
    releaseEnvironment: publishedRelease.environment,
    publishedAt: publishedRelease.publishedAt ?? null,
    pageSummary: comparedPages.pageSummary,
    sectionSummary: comparedPages.sectionSummary,
    blockSummary: comparedPages.blockSummary,
    pages: comparedPages.pages,
    hasChanges: comparedPages.pageSummary.added > 0
      || comparedPages.pageSummary.removed > 0
      || comparedPages.pageSummary.changed > 0
      || comparedPages.sectionSummary.added > 0
      || comparedPages.sectionSummary.removed > 0
      || comparedPages.sectionSummary.changed > 0
      || comparedPages.blockSummary.added > 0
      || comparedPages.blockSummary.removed > 0
      || comparedPages.blockSummary.changed > 0,
  }
}