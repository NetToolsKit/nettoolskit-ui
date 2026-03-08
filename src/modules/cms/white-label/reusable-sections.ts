/**
 * Reusable section library helpers for the CMS engine.
 * These templates are persisted entirely in the frontend engine so future hosts
 * can plug storage/backend providers without changing authoring behavior.
 */
import { toRaw } from 'vue'
import {
  createCmsPageBlockFromPreset,
  getDefaultCmsBlockPresetIdForSectionPreset,
  resolveCmsBlockPresetId,
} from './block-presets'
import {
  detectCmsSectionPresetId,
  resolveCmsContentModelId,
  resolveDefaultCmsBlockTypeForSection,
} from './content-models'
import {
  normalizeCmsPageBlockLocalizationSettings,
  normalizeCmsPageSectionLocalizationSettings,
} from './localized-content'
import type {
  CmsPageBlockSettings,
  CmsPageSectionSettings,
  CmsPageSettings,
  CmsReusableSectionSettings,
} from './types'

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function cloneValue<T>(value: T): T {
  const rawValue = typeof value === 'object' && value !== null
    ? toRaw(value)
    : value

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(rawValue)
    } catch {
      // Vue reactive proxies are serialized via JSON fallback below.
    }
  }

  return JSON.parse(JSON.stringify(rawValue)) as T
}

function normalizeSegment(value: string, fallback: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return normalized || fallback
}

function createUniqueValue(base: string, occupiedValues: Set<string>): string {
  if (!occupiedValues.has(base)) {
    return base
  }

  let suffix = 2
  let candidate = `${base}-${suffix}`
  while (occupiedValues.has(candidate)) {
    suffix += 1
    candidate = `${base}-${suffix}`
  }
  return candidate
}

function normalizeReusableSectionBlocks(
  blocks: unknown,
  sectionId: string,
  presetId: CmsReusableSectionSettings['presetId'],
  enabled: boolean
): CmsPageBlockSettings[] {
  const defaultBlockType = resolveDefaultCmsBlockTypeForSection(sectionId, presetId)
  const defaultBlockPresetId = getDefaultCmsBlockPresetIdForSectionPreset(presetId)
  if (!Array.isArray(blocks)) {
    return defaultBlockPresetId === 'custom'
      ? [{
        id: `${sectionId}-block-1`,
        type: defaultBlockType,
        presetId: 'custom',
        enabled,
        props: {},
      }]
      : [createCmsPageBlockFromPreset({
        presetId: defaultBlockPresetId,
        blockId: `${sectionId}-block-1`,
        enabled,
      })]
  }

  const seenIds = new Set<string>()
  const normalized = blocks
    .map<CmsPageBlockSettings | null>((rawBlock, index) => {
      if (!rawBlock || typeof rawBlock !== 'object') {
        return null
      }

      const block = rawBlock as Partial<CmsPageBlockSettings>
      const baseId = normalizeSegment(String(block.id ?? '').trim(), `${sectionId}-block-${index + 1}`)
      const id = createUniqueValue(baseId, seenIds)
      seenIds.add(id)

      return {
        id,
        type: String(block.type ?? '').trim() || defaultBlockType,
        presetId: resolveCmsBlockPresetId(block.presetId),
        enabled: typeof block.enabled === 'boolean' ? block.enabled : enabled,
        props: isObjectRecord(block.props) ? cloneValue(block.props) : {},
        localization: normalizeCmsPageBlockLocalizationSettings(block.localization),
      } satisfies CmsPageBlockSettings
    })
    .filter((block): block is CmsPageBlockSettings => block !== null)

  return normalized.length > 0
    ? normalized
    : defaultBlockPresetId === 'custom'
      ? [{
        id: `${sectionId}-block-1`,
        type: defaultBlockType,
        presetId: 'custom',
        enabled,
        props: {},
      }]
      : [createCmsPageBlockFromPreset({
        presetId: defaultBlockPresetId,
        blockId: `${sectionId}-block-1`,
        enabled,
      })]
}

/**
 * Creates the default reusable section library for the CMS engine.
 * The initial library is intentionally empty so tenants only see authored presets.
 */
export function createDefaultCmsReusableSections(): CmsReusableSectionSettings[] {
  return []
}

/**
 * Normalizes persisted reusable section payloads and falls back to defaults when malformed.
 */
export function normalizeCmsReusableSections(
  reusableSections: unknown,
  defaults: CmsReusableSectionSettings[]
): CmsReusableSectionSettings[] {
  if (!Array.isArray(reusableSections)) {
    return cloneValue(defaults)
  }

  const seenIds = new Set<string>()
  const normalized = reusableSections
    .map<CmsReusableSectionSettings | null>((rawReusableSection, index) => {
      if (!rawReusableSection || typeof rawReusableSection !== 'object') {
        return null
      }

      const reusableSection = rawReusableSection as Partial<CmsReusableSectionSettings>
      const presetId = detectCmsSectionPresetId({
        presetId: reusableSection.presetId,
        sectionId: reusableSection.label ?? reusableSection.id,
        blockType: reusableSection.blocks?.[0]?.type,
      })
      const baseId = normalizeSegment(
        String(reusableSection.id ?? reusableSection.name ?? reusableSection.label ?? '').trim(),
        `reusable-section-${index + 1}`
      )
      const id = createUniqueValue(baseId, seenIds)
      seenIds.add(id)
      const enabled = typeof reusableSection.enabled === 'boolean'
        ? reusableSection.enabled
        : true
      const sectionId = normalizeSegment(String(reusableSection.label ?? '').trim(), presetId)
      const name = String(reusableSection.name ?? '').trim() || `Reusable Section ${index + 1}`
      const label = String(reusableSection.label ?? '').trim() || name

      return {
        id,
        name,
        description: String(reusableSection.description ?? '').trim(),
        category: String(reusableSection.category ?? '').trim() || presetId,
        contentModelId: resolveCmsContentModelId(reusableSection.contentModelId),
        presetId,
        label,
        enabled,
        localization: normalizeCmsPageSectionLocalizationSettings(reusableSection.localization),
        blocks: normalizeReusableSectionBlocks(reusableSection.blocks, sectionId, presetId, enabled),
      } satisfies CmsReusableSectionSettings
    })
    .filter((reusableSection): reusableSection is CmsReusableSectionSettings => reusableSection !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Creates a reusable section template from an authored page section.
 */
export function createCmsReusableSectionFromSection(input: {
  page: CmsPageSettings
  section: CmsPageSectionSettings
  existingSections: CmsReusableSectionSettings[]
  name?: unknown
  description?: unknown
  category?: unknown
}): CmsReusableSectionSettings {
  const occupiedIds = new Set(
    input.existingSections.map(reusableSection => String(reusableSection.id ?? '').trim()).filter(Boolean)
  )
  const normalizedName = String(input.name ?? '').trim()
  const fallbackName = `${input.page.title} · ${input.section.label || input.section.id}`
  const name = normalizedName || fallbackName
  const id = createUniqueValue(
    normalizeSegment(name, normalizeSegment(input.section.id, 'reusable-section')),
    occupiedIds
  )

  return {
    id,
    name,
    description: String(input.description ?? '').trim(),
    category: String(input.category ?? '').trim() || input.section.presetId,
    contentModelId: resolveCmsContentModelId(input.page.contentModelId),
    presetId: detectCmsSectionPresetId({
      presetId: input.section.presetId,
      sectionId: input.section.id,
      blockType: input.section.blocks[0]?.type,
    }),
    label: String(input.section.label ?? '').trim() || input.section.id,
    enabled: Boolean(input.section.enabled),
    localization: normalizeCmsPageSectionLocalizationSettings(input.section.localization),
    blocks: cloneValue(input.section.blocks ?? []),
  }
}

/**
 * Clones a reusable section template into a page section payload with unique ids.
 */
export function cloneCmsReusableSectionIntoPageSection(input: {
  reusableSection: CmsReusableSectionSettings
  existingSections: CmsPageSectionSettings[]
}): CmsPageSectionSettings {
  const occupiedSectionIds = new Set(
    input.existingSections.map(section => String(section.id ?? '').trim()).filter(Boolean)
  )
  const occupiedBlockIds = new Set(
    input.existingSections.flatMap(section => (
      Array.isArray(section.blocks)
        ? section.blocks.map(block => String(block.id ?? '').trim()).filter(Boolean)
        : []
    ))
  )
  const baseSectionId = normalizeSegment(
    input.reusableSection.label || input.reusableSection.name || input.reusableSection.id,
    input.reusableSection.presetId
  )
  const sectionId = createUniqueValue(baseSectionId, occupiedSectionIds)

  const blocks = input.reusableSection.blocks.map((block, index) => {
    const fallbackId = `${sectionId}-block-${index + 1}`
    const id = createUniqueValue(fallbackId, occupiedBlockIds)
    occupiedBlockIds.add(id)

    return {
      id,
      type: String(block.type ?? '').trim()
        || resolveDefaultCmsBlockTypeForSection(sectionId, input.reusableSection.presetId),
      presetId: resolveCmsBlockPresetId(block.presetId),
      enabled: typeof block.enabled === 'boolean'
        ? block.enabled
        : input.reusableSection.enabled,
      props: isObjectRecord(block.props) ? cloneValue(block.props) : {},
      localization: normalizeCmsPageBlockLocalizationSettings(block.localization),
    } satisfies CmsPageBlockSettings
  })

  return {
    id: sectionId,
    presetId: input.reusableSection.presetId,
    label: input.reusableSection.label || input.reusableSection.name,
    enabled: input.reusableSection.enabled,
    localization: normalizeCmsPageSectionLocalizationSettings(input.reusableSection.localization),
    blocks: blocks.length > 0
      ? blocks
      : normalizeReusableSectionBlocks([], sectionId, input.reusableSection.presetId, input.reusableSection.enabled),
  }
}