/**
 * Reusable block library helpers for the CMS engine.
 * These templates stay backend-agnostic and can later be persisted by any host application.
 */
import { toRaw } from 'vue'
import {
  getCmsBlockPresetDescription,
  getCmsBlockPresetDefinition,
  getCmsBlockPresetLabel,
  resolveCmsBlockPresetId,
} from './block-presets'
import { normalizeCmsPageBlockLocalizationSettings } from './localized-content'
import type {
  CmsPageBlockSettings,
  CmsReusableBlockSettings,
  CmsReusableReferenceMode,
} from './types'

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const reusableBlockSeedPresetIds = [
  'landing-hero-product-launch',
  'landing-stats-proof-strip',
  'landing-cta-final-prompt',
] as const

function cloneValue<T>(value: T): T {
  const rawValue = typeof value === 'object' && value !== null
    ? toRaw(value)
    : value

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(rawValue)
    } catch {
      // Vue reactive proxies and devtool-marked objects are serialized as plain JSON.
    }
  }

  return JSON.parse(JSON.stringify(rawValue)) as T
}

function normalizeSegment(value: string, fallback: string): string {
  let normalized = ''

  for (const character of value.trim().toLowerCase()) {
    const isAllowed =
      (character >= 'a' && character <= 'z') ||
      (character >= '0' && character <= '9') ||
      character === '/' ||
      character === '_' ||
      character === '-'

    if (!isAllowed) {
      if (normalized && !normalized.endsWith('-')) {
        normalized += '-'
      }
      continue
    }

    if (character === '-' && (!normalized || normalized.endsWith('-'))) {
      continue
    }

    normalized += character
  }

  while (normalized.startsWith('-')) {
    normalized = normalized.slice(1)
  }

  while (normalized.endsWith('-')) {
    normalized = normalized.slice(0, -1)
  }

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

function buildReusableBlockVariantName(
  source: CmsReusableBlockSettings,
  existingBlocks: CmsReusableBlockSettings[]
): string {
  const baseName = `${source.name} Variant`
  const occupiedNames = new Set(
    existingBlocks.map(reusableBlock => String(reusableBlock.name ?? '').trim()).filter(Boolean)
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

/**
 * Creates the default reusable block library seeded for the landing builder.
 */
export function createDefaultCmsReusableBlocks(localeInput: unknown = 'en'): CmsReusableBlockSettings[] {
  return reusableBlockSeedPresetIds
    .map<CmsReusableBlockSettings | null>(seedId => {
      const definition = getCmsBlockPresetDefinition(seedId)
      if (!definition) {
        return null
      }

      const reusableBlock: CmsReusableBlockSettings = {
        id: seedId,
        name: getCmsBlockPresetLabel(localeInput, seedId),
        description: getCmsBlockPresetDescription(localeInput, seedId),
        category: definition.category,
        type: definition.type,
        presetId: seedId,
        props: cloneValue(definition.props),
        localization: normalizeCmsPageBlockLocalizationSettings(
          definition.localizedProps
            ? { props: cloneValue(definition.localizedProps) }
            : undefined
        ),
      }

      return reusableBlock
    })
    .filter((reusableBlock): reusableBlock is CmsReusableBlockSettings => reusableBlock !== null)
}

/**
 * Normalizes reusable block payloads and falls back to defaults when malformed.
 */
export function normalizeCmsReusableBlocks(
  reusableBlocks: unknown,
  defaults: CmsReusableBlockSettings[]
): CmsReusableBlockSettings[] {
  if (!Array.isArray(reusableBlocks)) {
    return cloneValue(defaults)
  }

  const seenIds = new Set<string>()
  const normalized = reusableBlocks
    .map<CmsReusableBlockSettings | null>((rawReusableBlock, index) => {
      if (!rawReusableBlock || typeof rawReusableBlock !== 'object') {
        return null
      }

      const reusableBlock = rawReusableBlock as Partial<CmsReusableBlockSettings>
      const baseId = normalizeSegment(
        String(reusableBlock.id ?? reusableBlock.name ?? reusableBlock.type ?? '').trim(),
        `reusable-block-${index + 1}`
      )
      const id = createUniqueValue(baseId, seenIds)
      seenIds.add(id)

      return {
        id,
        name: String(reusableBlock.name ?? '').trim() || `Reusable Block ${index + 1}`,
        description: String(reusableBlock.description ?? '').trim(),
        category: String(reusableBlock.category ?? '').trim() || 'custom',
        type: String(reusableBlock.type ?? '').trim() || 'landing.hero',
        presetId: resolveCmsBlockPresetId(reusableBlock.presetId),
        props: isObjectRecord(reusableBlock.props)
          ? cloneValue(reusableBlock.props)
          : {},
        localization: normalizeCmsPageBlockLocalizationSettings(reusableBlock.localization),
        archivedAt: String(reusableBlock.archivedAt ?? '').trim() || null,
        deprecatedAt: String(reusableBlock.deprecatedAt ?? '').trim() || null,
        deprecationNote: String(reusableBlock.deprecationNote ?? '').trim() || null,
        replacementEntityId: String(reusableBlock.replacementEntityId ?? '').trim() || null,
        branchSourceId: normalizeOptionalString(reusableBlock.branchSourceId),
        branchRootId: normalizeOptionalString(reusableBlock.branchRootId),
      } satisfies CmsReusableBlockSettings
    })
    .filter((reusableBlock): reusableBlock is CmsReusableBlockSettings => reusableBlock !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Creates a reusable block template from a live authored block.
 */
export function createCmsReusableBlockFromBlock(input: {
  block: CmsPageBlockSettings
  existingBlocks: CmsReusableBlockSettings[]
  displayName?: unknown
  name?: unknown
  description?: unknown
  category?: unknown
  sourceReusableBlock?: CmsReusableBlockSettings | null
}): CmsReusableBlockSettings {
  const occupiedIds = new Set(
    input.existingBlocks.map(reusableBlock => String(reusableBlock.id ?? '').trim()).filter(Boolean)
  )
  const normalizedName = String(input.name ?? '').trim()
  const displayName = String(input.displayName ?? input.block.type ?? 'Reusable block').trim() || 'Reusable block'
  const sourceReusableBlock = input.sourceReusableBlock ?? null
  const baseName = normalizedName || (sourceReusableBlock
    ? buildReusableBlockVariantName(sourceReusableBlock, input.existingBlocks)
    : displayName)
  const id = createUniqueValue(
    normalizeSegment(baseName, normalizeSegment(input.block.type, 'reusable-block')),
    occupiedIds
  )

  return {
    id,
    name: baseName,
    description: String(input.description ?? '').trim(),
    category: String(input.category ?? '').trim() || 'custom',
    type: String(input.block.type ?? '').trim() || 'landing.hero',
    presetId: input.block.presetId,
    props: cloneValue(input.block.props ?? {}),
    localization: normalizeCmsPageBlockLocalizationSettings(input.block.localization),
    branchSourceId: sourceReusableBlock?.id ?? null,
    branchRootId: sourceReusableBlock
      ? (sourceReusableBlock.branchRootId || sourceReusableBlock.id)
      : null,
  }
}

/**
 * Creates one reusable block variant from an existing reusable source while
 * keeping lineage metadata for later enterprise review and replacement flows.
 */
export function createCmsReusableBlockVariantFromReusable(input: {
  reusableBlock: CmsReusableBlockSettings
  existingBlocks: CmsReusableBlockSettings[]
  name?: unknown
  description?: unknown
}): CmsReusableBlockSettings {
  const source = cloneValue(input.reusableBlock)

  return createCmsReusableBlockFromBlock({
    block: {
      id: `${source.id}-variant`,
      type: source.type,
      presetId: source.presetId,
      enabled: true,
      props: cloneValue(source.props),
      localization: normalizeCmsPageBlockLocalizationSettings(source.localization),
    },
    existingBlocks: input.existingBlocks,
    displayName: source.name,
    name: String(input.name ?? '').trim() || buildReusableBlockVariantName(source, input.existingBlocks),
    description: String(input.description ?? '').trim() || source.description,
    category: source.category,
    sourceReusableBlock: source,
  })
}

/**
 * Resolves one page block against the reusable block library when it is still linked.
 */
export function resolveCmsReusableBlockReference(input: {
  block: CmsPageBlockSettings
  reusableBlocks?: CmsReusableBlockSettings[]
}): CmsPageBlockSettings {
  const block = cloneValue(input.block)
  if (block.reusableMode !== 'linked' || !block.reusableSourceId) {
    return block
  }

  const reusableBlock = input.reusableBlocks?.find(entry => entry.id === block.reusableSourceId)
  if (!reusableBlock) {
    return block
  }

  return {
    ...block,
    type: reusableBlock.type,
    presetId: reusableBlock.presetId,
    props: cloneValue(reusableBlock.props),
    localization: normalizeCmsPageBlockLocalizationSettings(reusableBlock.localization),
  }
}

/**
 * Converts a linked page block into a detached local copy while keeping its resolved payload.
 */
export function detachCmsPageBlockFromReusable(input: {
  block: CmsPageBlockSettings
  reusableBlocks?: CmsReusableBlockSettings[]
}): CmsPageBlockSettings {
  const resolvedBlock = resolveCmsReusableBlockReference(input)

  return {
    ...resolvedBlock,
    reusableMode: 'detached',
    reusableSourceId: input.block.reusableSourceId,
  }
}

/**
 * Clones a reusable template into a block instance payload with a fresh id.
 */
export function cloneCmsReusableBlockIntoPageBlock(input: {
  reusableBlock: CmsReusableBlockSettings
  blockId: string
  mode?: CmsReusableReferenceMode
}): CmsPageBlockSettings {
  const reusableMode = input.mode === 'linked' ? 'linked' : 'detached'

  return {
    id: input.blockId,
    type: input.reusableBlock.type,
    presetId: input.reusableBlock.presetId,
    enabled: true,
    reusableMode,
    reusableSourceId: input.reusableBlock.id,
    props: cloneValue(input.reusableBlock.props),
    localization: normalizeCmsPageBlockLocalizationSettings(input.reusableBlock.localization),
  }
}
