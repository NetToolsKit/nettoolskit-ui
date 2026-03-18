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
  normalizeCmsSectionCustomFieldsForPreset,
  resolveCmsContentModelId,
  resolveDefaultCmsBlockTypeForSection,
} from './content-models'
import {
  normalizeCmsPageBlockLocalizationSettings,
  normalizeCmsPageSectionLocalizationSettings,
} from './localized-content'
import {
  detachCmsPageBlockFromReusable,
  resolveCmsReusableBlockReference,
} from './reusable-blocks'
import type {
  CmsPageBlockSettings,
  CmsPageSectionSettings,
  CmsPageSettings,
  CmsReusableBlockSettings,
  CmsReusableReferenceMode,
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

function normalizeOptionalString(value: unknown): string | null {
  const normalized = String(value ?? '').trim()
  return normalized || null
}

function buildReusableSectionVariantName(
  source: CmsReusableSectionSettings,
  existingSections: CmsReusableSectionSettings[]
): string {
  const baseName = `${source.name} Variant`
  const occupiedNames = new Set(
    existingSections.map(reusableSection => String(reusableSection.name ?? '').trim()).filter(Boolean)
  )
  if (!occupiedNames.has(baseName)) {
    return baseName
  }

  let suffix = 2
  let candidate = `${baseName} ${suffix}`
  while (occupiedNames.has(candidate)) {
    suffix += 1
    candidate = `${baseName} ${suffix}`
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
        reusableMode: block.reusableMode === 'linked' || block.reusableMode === 'detached'
          ? block.reusableMode
          : undefined,
        reusableSourceId: String(block.reusableSourceId ?? '').trim() || undefined,
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
        customFields: normalizeCmsSectionCustomFieldsForPreset(
          reusableSection.customFields,
          presetId,
          'en'
        ),
        localization: normalizeCmsPageSectionLocalizationSettings(reusableSection.localization),
        blocks: normalizeReusableSectionBlocks(reusableSection.blocks, sectionId, presetId, enabled),
        archivedAt: String(reusableSection.archivedAt ?? '').trim() || null,
        deprecatedAt: String(reusableSection.deprecatedAt ?? '').trim() || null,
        deprecationNote: String(reusableSection.deprecationNote ?? '').trim() || null,
        replacementEntityId: String(reusableSection.replacementEntityId ?? '').trim() || null,
        branchSourceId: normalizeOptionalString(reusableSection.branchSourceId),
        branchRootId: normalizeOptionalString(reusableSection.branchRootId),
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
  sourceReusableSection?: CmsReusableSectionSettings | null
}): CmsReusableSectionSettings {
  const occupiedIds = new Set(
    input.existingSections.map(reusableSection => String(reusableSection.id ?? '').trim()).filter(Boolean)
  )
  const normalizedName = String(input.name ?? '').trim()
  const fallbackName = `${input.page.title} · ${input.section.label || input.section.id}`
  const sourceReusableSection = input.sourceReusableSection ?? null
  const name = normalizedName || (sourceReusableSection
    ? buildReusableSectionVariantName(sourceReusableSection, input.existingSections)
    : fallbackName)
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
    customFields: normalizeCmsSectionCustomFieldsForPreset(
      input.section.customFields,
      input.section.presetId,
      'en'
    ),
    localization: normalizeCmsPageSectionLocalizationSettings(input.section.localization),
    blocks: cloneValue(input.section.blocks ?? []),
    branchSourceId: sourceReusableSection?.id ?? null,
    branchRootId: sourceReusableSection
      ? (sourceReusableSection.branchRootId || sourceReusableSection.id)
      : null,
  }
}

/**
 * Creates one reusable section variant from an existing reusable source while
 * preserving lineage metadata and the full resolved section payload.
 */
export function createCmsReusableSectionVariantFromReusable(input: {
  reusableSection: CmsReusableSectionSettings
  existingSections: CmsReusableSectionSettings[]
  name?: unknown
  description?: unknown
}): CmsReusableSectionSettings {
  const source = cloneValue(input.reusableSection)

  return createCmsReusableSectionFromSection({
    page: {
      id: source.contentModelId,
      title: source.name,
      description: source.description,
      path: '/',
      status: 'draft',
      contentModelId: source.contentModelId,
      sections: [],
      customFields: {},
      contentModelVersion: 1,
    },
    section: {
      id: source.label || source.id,
      presetId: source.presetId,
      label: source.label,
      enabled: source.enabled,
      customFields: cloneValue(source.customFields ?? {}),
      localization: normalizeCmsPageSectionLocalizationSettings(source.localization),
      blocks: cloneValue(source.blocks),
    },
    existingSections: input.existingSections,
    name: String(input.name ?? '').trim() || buildReusableSectionVariantName(source, input.existingSections),
    description: String(input.description ?? '').trim() || source.description,
    category: source.category,
    sourceReusableSection: source,
  })
}

/**
 * Resolves one page section against the reusable section library when it is still linked.
 */
export function resolveCmsReusableSectionReference(input: {
  section: CmsPageSectionSettings
  reusableSections?: CmsReusableSectionSettings[]
  reusableBlocks?: CmsReusableBlockSettings[]
}): CmsPageSectionSettings {
  const section = cloneValue(input.section)
  const localBlocks = Array.isArray(section.blocks) ? section.blocks : []

  const resolveLocalBlocks = (blocks: CmsPageBlockSettings[]): CmsPageBlockSettings[] => {
    return blocks.map(block => resolveCmsReusableBlockReference({
      block,
      reusableBlocks: input.reusableBlocks,
    }))
  }

  if (section.reusableMode !== 'linked' || !section.reusableSourceId) {
    return {
      ...section,
      blocks: resolveLocalBlocks(localBlocks),
    }
  }

  const reusableSection = input.reusableSections?.find(entry => entry.id === section.reusableSourceId)
  if (!reusableSection) {
    return {
      ...section,
      blocks: resolveLocalBlocks(localBlocks),
    }
  }

  const resolvedBlocks = reusableSection.blocks.map((block, index) => {
    const localBlock = localBlocks[index]
    const fallbackId = `${section.id}-block-${index + 1}`
    const resolvedBlock = resolveCmsReusableBlockReference({
      block,
      reusableBlocks: input.reusableBlocks,
    })

    return {
      ...resolvedBlock,
      id: String(localBlock?.id ?? '').trim() || fallbackId,
      enabled: typeof localBlock?.enabled === 'boolean'
        ? localBlock.enabled
        : (typeof resolvedBlock.enabled === 'boolean' ? resolvedBlock.enabled : section.enabled),
      reusableMode: localBlock?.reusableMode ?? resolvedBlock.reusableMode,
      reusableSourceId: localBlock?.reusableSourceId ?? resolvedBlock.reusableSourceId,
    } satisfies CmsPageBlockSettings
  })

  return {
    ...section,
    presetId: reusableSection.presetId,
    label: reusableSection.label,
    customFields: normalizeCmsSectionCustomFieldsForPreset(
      reusableSection.customFields,
      reusableSection.presetId,
      'en'
    ),
    localization: normalizeCmsPageSectionLocalizationSettings(reusableSection.localization),
    blocks: resolvedBlocks.length > 0
      ? resolvedBlocks
      : normalizeReusableSectionBlocks([], section.id, reusableSection.presetId, section.enabled),
  }
}

/**
 * Converts a linked page section into a detached local copy while keeping its resolved payload.
 */
export function detachCmsPageSectionFromReusable(input: {
  section: CmsPageSectionSettings
  reusableSections?: CmsReusableSectionSettings[]
  reusableBlocks?: CmsReusableBlockSettings[]
}): CmsPageSectionSettings {
  const resolvedSection = resolveCmsReusableSectionReference(input)

  return {
    ...resolvedSection,
    reusableMode: 'detached',
    reusableSourceId: input.section.reusableSourceId,
    blocks: resolvedSection.blocks.map(block => detachCmsPageBlockFromReusable({
      block,
      reusableBlocks: input.reusableBlocks,
    })),
  }
}

/**
 * Clones a reusable section template into a page section payload with unique ids.
 */
export function cloneCmsReusableSectionIntoPageSection(input: {
  reusableSection: CmsReusableSectionSettings
  existingSections: CmsPageSectionSettings[]
  mode?: CmsReusableReferenceMode
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

  const reusableMode = input.mode === 'linked' ? 'linked' : 'detached'

  return {
    id: sectionId,
    presetId: input.reusableSection.presetId,
    label: input.reusableSection.label || input.reusableSection.name,
    enabled: input.reusableSection.enabled,
    customFields: normalizeCmsSectionCustomFieldsForPreset(
      input.reusableSection.customFields,
      input.reusableSection.presetId,
      'en'
    ),
    reusableMode,
    reusableSourceId: input.reusableSection.id,
    localization: normalizeCmsPageSectionLocalizationSettings(input.reusableSection.localization),
    blocks: blocks.length > 0
      ? blocks
      : normalizeReusableSectionBlocks([], sectionId, input.reusableSection.presetId, input.reusableSection.enabled),
  }
}