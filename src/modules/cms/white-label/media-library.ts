/**
 * Media library helpers for the CMS engine.
 * Assets remain backend-agnostic and can later be hydrated by any host application/provider.
 */
import { resolveCmsLocale } from './i18n'
import type {
  CmsBrandingSettings,
  CmsLocale,
  CmsMediaAssetKind,
  CmsMediaAssetFocalPointSettings,
  CmsMediaAssetSettings,
  CmsPageBlockSettings,
  CmsPageSettings,
} from './types'

export interface CmsMediaBindingDefinition {
  sourcePath: string
  targetPath: string
  altTargetPath?: string
  allowedKinds?: CmsMediaAssetKind[]
}

export type CmsMediaDiagnosticSeverity = 'warning' | 'error'

export type CmsMediaDiagnosticCode =
  | 'media_asset_missing'
  | 'media_asset_kind_mismatch'
  | 'media_asset_url_missing'
  | 'media_asset_alt_missing'
  | 'media_asset_focal_point_invalid'
  | 'media_asset_replace_target_missing'
  | 'media_asset_replace_target_self'
  | 'media_asset_unused'

export interface CmsMediaBindingReference {
  assetId: string
  sourcePath: string
  targetPath: string
  altTargetPath?: string
  allowedKinds?: CmsMediaAssetKind[]
  pageId: string
  pageTitle: string
  pagePath: string
  sectionId: string
  sectionLabel: string
  blockId: string
  blockType: string
}

export interface CmsBrandingMediaBindingReference {
  assetId: string
  slot: CmsMediaBrandingSlot
  brandingPath: `branding.${CmsMediaBrandingSlot}`
  label: string
}

export interface CmsMediaUsageSummary {
  assetId: string
  blockReferences: number
  brandingReferences: number
  usageTags: number
  totalReferences: number
}

export interface CmsMediaDiagnostic {
  id: string
  code: CmsMediaDiagnosticCode
  severity: CmsMediaDiagnosticSeverity
  message: string
  assetId?: string
  pageId?: string
  sectionId?: string
  blockId?: string
  blockType?: string
  sourcePath?: string
}

interface CmsLocalizedText {
  en: string
  'pt-BR': string
}

type CmsMediaBrandingSlot = 'brandLogo' | 'faviconUrl' | 'userAvatar'

interface CmsDefaultMediaAssetDefinition {
  id: string
  slot: CmsMediaBrandingSlot
  kind: CmsMediaAssetKind
  name: CmsLocalizedText
  description: CmsLocalizedText
  alt: (branding: CmsBrandingSettings, locale: CmsLocale) => string
  usage: string[]
  tags: string[]
}

const DEFAULT_MEDIA_ASSETS: ReadonlyArray<CmsDefaultMediaAssetDefinition> = [
  {
    id: 'brand-logo',
    slot: 'brandLogo',
    kind: 'image',
    name: {
      en: 'Brand logo',
      'pt-BR': 'Logo da marca',
    },
    description: {
      en: 'Primary product identity rendered in the shell and landing header.',
      'pt-BR': 'Identidade principal do produto usada no shell e no topo da landing page.',
    },
    alt: branding => branding.brandLogoAlt || branding.appName,
    usage: ['branding.logo', 'shell.brand'],
    tags: ['branding', 'logo'],
  },
  {
    id: 'favicon',
    slot: 'faviconUrl',
    kind: 'icon',
    name: {
      en: 'Favicon',
      'pt-BR': 'Favicon',
    },
    description: {
      en: 'Browser tab icon and bookmark image.',
      'pt-BR': 'Icone da aba do navegador e imagem de favoritos.',
    },
    alt: branding => branding.brandLogoAlt || branding.appName,
    usage: ['branding.favicon'],
    tags: ['branding', 'favicon'],
  },
  {
    id: 'user-avatar',
    slot: 'userAvatar',
    kind: 'image',
    name: {
      en: 'User avatar',
      'pt-BR': 'Avatar do usuario',
    },
    description: {
      en: 'Account action image displayed in the shell topbar.',
      'pt-BR': 'Imagem da acao de conta exibida na topbar do shell.',
    },
    alt: branding => branding.userTooltip || branding.appName,
    usage: ['branding.user-avatar', 'shell.account'],
    tags: ['branding', 'avatar'],
  },
]

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fallback for proxy-backed values.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
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

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  const deduped = new Set<string>()
  for (const entry of value) {
    const normalized = String(entry ?? '').trim()
    if (normalized.length > 0) {
      deduped.add(normalized)
    }
  }

  return Array.from(deduped)
}

function normalizeMediaKind(value: unknown): CmsMediaAssetKind {
  const normalized = String(value ?? '').trim().toLowerCase()
  switch (normalized) {
    case 'image':
    case 'video':
    case 'icon':
    case 'document':
      return normalized
    default:
      return 'other'
  }
}

function normalizeMediaFocalPoint(value: unknown): CmsMediaAssetFocalPointSettings | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const x = Number((value as Record<string, unknown>).x)
  const y = Number((value as Record<string, unknown>).y)
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
  }

  return {
    x,
    y,
  }
}

function getNestedValueByPath(record: Record<string, unknown>, path: string): unknown {
  const segments = path.split('.').filter(Boolean)
  if (segments.length === 0) {
    return undefined
  }

  let current: unknown = record
  for (const segment of segments) {
    if (!current || typeof current !== 'object' || !(segment in current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }

  return current
}

function setNestedValueByPath(record: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split('.').filter(Boolean)
  if (segments.length === 0) {
    return
  }

  let current = record
  for (const segment of segments.slice(0, -1)) {
    const next = current[segment]
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      current[segment] = {}
    }
    current = current[segment] as Record<string, unknown>
  }

  const leaf = segments[segments.length - 1]
  if (!leaf) {
    return
  }

  if (value === undefined) {
    delete current[leaf]
    return
  }

  current[leaf] = value
}

function findCmsMediaAssetById(
  mediaAssets: CmsMediaAssetSettings[],
  assetId: string
): CmsMediaAssetSettings | null {
  return mediaAssets.find(asset => asset.id === assetId) ?? null
}

function normalizeAllowedKindsLabel(kinds: CmsMediaAssetKind[] | undefined): string {
  if (!kinds || kinds.length === 0) {
    return 'supported media'
  }

  if (kinds.length === 1) {
    return kinds[0]
  }

  return kinds.join(', ')
}

function hasRecommendedAltText(kind: CmsMediaAssetKind): boolean {
  return kind === 'image' || kind === 'icon'
}

function supportsFocalPoint(kind: CmsMediaAssetKind): boolean {
  return kind === 'image' || kind === 'video'
}

function createCmsMediaReferenceId(reference: CmsMediaBindingReference): string {
  return [
    reference.pageId,
    reference.sectionId,
    reference.blockId,
    reference.sourcePath,
    reference.assetId,
  ].join(':')
}

/**
 * Creates default branding-aware media assets for the CMS engine.
 */
export function createDefaultCmsMediaAssets(
  branding: CmsBrandingSettings,
  localeInput: CmsLocale | string = 'en'
): CmsMediaAssetSettings[] {
  const locale = resolveCmsLocale(localeInput)

  return DEFAULT_MEDIA_ASSETS.map(asset => {
    const rawUrl = String(branding[asset.slot] ?? '').trim()
    const url = asset.slot === 'faviconUrl'
      ? rawUrl || String(branding.brandLogo ?? '').trim()
      : rawUrl

    return {
      id: asset.id,
      name: asset.name[locale],
      description: asset.description[locale],
      kind: asset.kind,
      url,
      alt: asset.alt(branding, locale),
      focalPoint: null,
      replaceTargetAssetId: null,
      tags: [...asset.tags],
      usage: [...asset.usage],
    }
  })
}

/**
 * Normalizes persisted media assets and restores defaults when malformed.
 */
export function normalizeCmsMediaAssets(
  mediaAssets: unknown,
  defaults: CmsMediaAssetSettings[]
): CmsMediaAssetSettings[] {
  if (!Array.isArray(mediaAssets)) {
    return cloneValue(defaults)
  }

  const seenIds = new Set<string>()
  const normalized = mediaAssets
    .map((rawMediaAsset, index) => {
      if (!rawMediaAsset || typeof rawMediaAsset !== 'object') {
        return null
      }

      const mediaAsset = rawMediaAsset as Partial<CmsMediaAssetSettings>
      const baseId = normalizeSegment(
        String(mediaAsset.id ?? mediaAsset.name ?? mediaAsset.url ?? '').trim(),
        `media-asset-${index + 1}`
      )
      const id = createUniqueValue(baseId, seenIds)
      seenIds.add(id)

      return {
        id,
        name: String(mediaAsset.name ?? '').trim() || `Media Asset ${index + 1}`,
        description: String(mediaAsset.description ?? '').trim(),
        kind: normalizeMediaKind(mediaAsset.kind),
        url: String(mediaAsset.url ?? '').trim(),
        alt: String(mediaAsset.alt ?? '').trim(),
        focalPoint: normalizeMediaFocalPoint(mediaAsset.focalPoint),
        replaceTargetAssetId: String(mediaAsset.replaceTargetAssetId ?? '').trim() || null,
        tags: normalizeStringArray(mediaAsset.tags),
        usage: normalizeStringArray(mediaAsset.usage),
      } satisfies CmsMediaAssetSettings
    })
    .filter((asset): asset is CmsMediaAssetSettings => asset !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Creates a new media asset entry with collision-safe ids.
 */
export function createCmsMediaAsset(input: {
  existingAssets: CmsMediaAssetSettings[]
  name?: unknown
  description?: unknown
  kind?: unknown
  url?: unknown
  alt?: unknown
  focalPoint?: unknown
  replaceTargetAssetId?: unknown
  tags?: unknown
  usage?: unknown
}): CmsMediaAssetSettings {
  const occupiedIds = new Set(
    input.existingAssets.map(asset => String(asset.id ?? '').trim()).filter(Boolean)
  )
  const baseName = String(input.name ?? '').trim() || 'Media Asset'
  const id = createUniqueValue(
    normalizeSegment(baseName, 'media-asset'),
    occupiedIds
  )

  return {
    id,
    name: baseName,
    description: String(input.description ?? '').trim(),
    kind: normalizeMediaKind(input.kind),
    url: String(input.url ?? '').trim(),
    alt: String(input.alt ?? '').trim(),
    focalPoint: normalizeMediaFocalPoint(input.focalPoint),
    replaceTargetAssetId: String(input.replaceTargetAssetId ?? '').trim() || null,
    tags: Array.isArray(input.tags)
      ? normalizeStringArray(input.tags)
      : normalizeStringArray(String(input.tags ?? '').split(',')),
    usage: Array.isArray(input.usage)
      ? normalizeStringArray(input.usage)
      : normalizeStringArray(String(input.usage ?? '').split(',')),
  }
}

/**
 * Collects branding-level media bindings by matching configured URLs against the media library.
 */
export function collectCmsBrandingMediaBindingReferences(input: {
  branding: CmsBrandingSettings
  mediaAssets: CmsMediaAssetSettings[]
}): CmsBrandingMediaBindingReference[] {
  const brandingBindings: Array<{ slot: CmsMediaBrandingSlot; url: string; label: string }> = [
    {
      slot: 'brandLogo',
      url: String(input.branding.brandLogo ?? '').trim(),
      label: 'Brand logo',
    },
    {
      slot: 'faviconUrl',
      url: String(input.branding.faviconUrl || input.branding.brandLogo || '').trim(),
      label: 'Favicon',
    },
    {
      slot: 'userAvatar',
      url: String(input.branding.userAvatar ?? '').trim(),
      label: 'User avatar',
    },
  ]

  return brandingBindings.flatMap(binding => {
    if (!binding.url) {
      return []
    }

    const asset = input.mediaAssets.find(entry => entry.url.trim() === binding.url)
    if (!asset) {
      return []
    }

    return [{
      assetId: asset.id,
      slot: binding.slot,
      brandingPath: `branding.${binding.slot}`,
      label: binding.label,
    } satisfies CmsBrandingMediaBindingReference]
  })
}

/**
 * Aggregates runtime and static usage information for media-library assets.
 */
export function collectCmsMediaUsageSummary(input: {
  pages: CmsPageSettings[]
  branding: CmsBrandingSettings
  mediaAssets: CmsMediaAssetSettings[]
  resolveBindings: (blockType: string) => CmsMediaBindingDefinition[]
}): Map<string, CmsMediaUsageSummary> {
  const summary = new Map<string, CmsMediaUsageSummary>()

  const ensureSummary = (assetId: string): CmsMediaUsageSummary => {
    const existing = summary.get(assetId)
    if (existing) {
      return existing
    }

    const created: CmsMediaUsageSummary = {
      assetId,
      blockReferences: 0,
      brandingReferences: 0,
      usageTags: 0,
      totalReferences: 0,
    }
    summary.set(assetId, created)
    return created
  }

  for (const asset of input.mediaAssets) {
    const entry = ensureSummary(asset.id)
    entry.usageTags = asset.usage.length
  }

  for (const reference of collectCmsMediaBindingReferences(input)) {
    const entry = ensureSummary(reference.assetId)
    entry.blockReferences += 1
    entry.totalReferences += 1
  }

  for (const reference of collectCmsBrandingMediaBindingReferences(input)) {
    const entry = ensureSummary(reference.assetId)
    entry.brandingReferences += 1
    entry.totalReferences += 1
  }

  return summary
}

/**
 * Replaces all page-level and branding-level references from one asset to another.
 */
export function replaceCmsMediaAssetReferences(input: {
  pages: CmsPageSettings[]
  branding: CmsBrandingSettings
  mediaAssets: CmsMediaAssetSettings[]
  sourceAssetId: string
  replacementAssetId: string
  resolveBindings: (blockType: string) => CmsMediaBindingDefinition[]
}): {
  pages: CmsPageSettings[]
  branding: CmsBrandingSettings
  replacedBlockReferences: number
  replacedBrandingReferences: number
} {
  const sourceAsset = findCmsMediaAssetById(input.mediaAssets, input.sourceAssetId)
  const replacementAsset = findCmsMediaAssetById(input.mediaAssets, input.replacementAssetId)
  const nextPages = cloneValue(input.pages)
  const nextBranding = cloneValue(input.branding)

  if (!sourceAsset || !replacementAsset || sourceAsset.id === replacementAsset.id) {
    return {
      pages: nextPages,
      branding: nextBranding,
      replacedBlockReferences: 0,
      replacedBrandingReferences: 0,
    }
  }

  let replacedBlockReferences = 0
  for (const page of nextPages) {
    for (const section of page.sections) {
      for (const block of section.blocks) {
        for (const binding of input.resolveBindings(block.type)) {
          const currentAssetId = String(getNestedValueByPath(block.props, binding.sourcePath) ?? '').trim()
          if (currentAssetId !== sourceAsset.id) {
            continue
          }

          setNestedValueByPath(block.props, binding.sourcePath, replacementAsset.id)
          if (binding.altTargetPath && replacementAsset.alt.trim().length > 0) {
            const currentAlt = String(getNestedValueByPath(block.props, binding.altTargetPath) ?? '').trim()
            if (!currentAlt || currentAlt === sourceAsset.alt.trim()) {
              setNestedValueByPath(block.props, binding.altTargetPath, replacementAsset.alt)
            }
          }
          replacedBlockReferences += 1
        }
      }
    }
  }

  let replacedBrandingReferences = 0
  const brandingSlots: CmsMediaBrandingSlot[] = ['brandLogo', 'faviconUrl', 'userAvatar']
  for (const slot of brandingSlots) {
    if (String(nextBranding[slot] ?? '').trim() !== sourceAsset.url.trim()) {
      continue
    }

    nextBranding[slot] = replacementAsset.url
    replacedBrandingReferences += 1
  }

  if (
    String(nextBranding.brandLogo ?? '').trim() === replacementAsset.url.trim()
    && replacementAsset.alt.trim().length > 0
  ) {
    const currentBrandLogoAlt = String(nextBranding.brandLogoAlt ?? '').trim()
    if (!currentBrandLogoAlt || currentBrandLogoAlt === sourceAsset.alt.trim()) {
      nextBranding.brandLogoAlt = replacementAsset.alt
    }
  }

  return {
    pages: nextPages,
    branding: nextBranding,
    replacedBlockReferences,
    replacedBrandingReferences,
  }
}

/**
 * Resolves media-library references inside block props into runtime-ready URL/alt props.
 */
export function resolveCmsMediaBindingProps<T extends Record<string, unknown>>(input: {
  props: T
  bindings: CmsMediaBindingDefinition[]
  mediaAssets: CmsMediaAssetSettings[]
}): T {
  if (input.bindings.length === 0 || input.mediaAssets.length === 0) {
    return cloneValue(input.props)
  }

  const resolvedProps = cloneValue(input.props)

  for (const binding of input.bindings) {
    const assetId = String(getNestedValueByPath(resolvedProps, binding.sourcePath) ?? '').trim()
    if (!assetId) {
      continue
    }

    const asset = findCmsMediaAssetById(input.mediaAssets, assetId)
    if (!asset) {
      continue
    }

    if (binding.allowedKinds?.length && !binding.allowedKinds.includes(asset.kind)) {
      continue
    }

    if (asset.url.trim().length > 0) {
      setNestedValueByPath(resolvedProps, binding.targetPath, asset.url)
    }

    if (binding.altTargetPath && asset.alt.trim().length > 0) {
      const currentAlt = String(getNestedValueByPath(resolvedProps, binding.altTargetPath) ?? '').trim()
      if (!currentAlt) {
        setNestedValueByPath(resolvedProps, binding.altTargetPath, asset.alt)
      }
    }
  }

  return resolvedProps
}

/**
 * Collects all block-level media references declared in CMS page content.
 */
export function collectCmsMediaBindingReferences(input: {
  pages: CmsPageSettings[]
  resolveBindings: (blockType: string) => CmsMediaBindingDefinition[]
}): CmsMediaBindingReference[] {
  return input.pages.flatMap(page => {
    return page.sections.flatMap(section => {
      return section.blocks.flatMap((block: CmsPageBlockSettings) => {
        return input.resolveBindings(block.type).flatMap(binding => {
          const assetId = String(getNestedValueByPath(block.props, binding.sourcePath) ?? '').trim()
          if (!assetId) {
            return []
          }

          return [{
            assetId,
            sourcePath: binding.sourcePath,
            targetPath: binding.targetPath,
            altTargetPath: binding.altTargetPath,
            allowedKinds: binding.allowedKinds,
            pageId: page.id,
            pageTitle: page.title,
            pagePath: page.path,
            sectionId: section.id,
            sectionLabel: section.label,
            blockId: block.id,
            blockType: block.type,
          } satisfies CmsMediaBindingReference]
        })
      })
    })
  })
}

/**
 * Produces diagnostics for broken media bindings and orphaned assets.
 */
export function collectCmsMediaDiagnostics(input: {
  pages: CmsPageSettings[]
  branding: CmsBrandingSettings
  mediaAssets: CmsMediaAssetSettings[]
  resolveBindings: (blockType: string) => CmsMediaBindingDefinition[]
}): CmsMediaDiagnostic[] {
  const references = collectCmsMediaBindingReferences(input)
  const brandingReferences = collectCmsBrandingMediaBindingReferences(input)
  const diagnostics: CmsMediaDiagnostic[] = []
  const mediaAssetIds = new Set(input.mediaAssets.map(asset => asset.id))
  const referencedAssetIds = new Set<string>()

  for (const reference of references) {
    referencedAssetIds.add(reference.assetId)
    const asset = findCmsMediaAssetById(input.mediaAssets, reference.assetId)
    if (!asset) {
      diagnostics.push({
        id: `${createCmsMediaReferenceId(reference)}:missing`,
        code: 'media_asset_missing',
        severity: 'error',
        message: `Block "${reference.blockId}" references missing asset "${reference.assetId}".`,
        assetId: reference.assetId,
        pageId: reference.pageId,
        sectionId: reference.sectionId,
        blockId: reference.blockId,
        blockType: reference.blockType,
        sourcePath: reference.sourcePath,
      })
      continue
    }

    if (reference.allowedKinds?.length && !reference.allowedKinds.includes(asset.kind)) {
      diagnostics.push({
        id: `${createCmsMediaReferenceId(reference)}:kind`,
        code: 'media_asset_kind_mismatch',
        severity: 'error',
        message: `Asset "${asset.name}" is "${asset.kind}" but field "${reference.sourcePath}" expects ${normalizeAllowedKindsLabel(reference.allowedKinds)}.`,
        assetId: asset.id,
        pageId: reference.pageId,
        sectionId: reference.sectionId,
        blockId: reference.blockId,
        blockType: reference.blockType,
        sourcePath: reference.sourcePath,
      })
    }

    if (asset.url.trim().length === 0) {
      diagnostics.push({
        id: `${createCmsMediaReferenceId(reference)}:url`,
        code: 'media_asset_url_missing',
        severity: 'warning',
        message: `Asset "${asset.name}" is linked but does not have a URL yet.`,
        assetId: asset.id,
        pageId: reference.pageId,
        sectionId: reference.sectionId,
        blockId: reference.blockId,
        blockType: reference.blockType,
        sourcePath: reference.sourcePath,
      })
    }
  }

  for (const reference of brandingReferences) {
    referencedAssetIds.add(reference.assetId)
  }

  for (const asset of input.mediaAssets) {
    if (hasRecommendedAltText(asset.kind) && asset.url.trim().length > 0 && asset.alt.trim().length === 0) {
      diagnostics.push({
        id: `${asset.id}:alt`,
        code: 'media_asset_alt_missing',
        severity: 'warning',
        message: `Asset "${asset.name}" should include alt text for accessible authoring.`,
        assetId: asset.id,
      })
    }

    if (asset.focalPoint) {
      const focalPointOutOfRange = asset.focalPoint.x < 0
        || asset.focalPoint.x > 100
        || asset.focalPoint.y < 0
        || asset.focalPoint.y > 100
      if (focalPointOutOfRange || !supportsFocalPoint(asset.kind)) {
        diagnostics.push({
          id: `${asset.id}:focal-point`,
          code: 'media_asset_focal_point_invalid',
          severity: 'warning',
          message: supportsFocalPoint(asset.kind)
            ? `Asset "${asset.name}" has focal point values outside the supported 0..100 range.`
            : `Asset "${asset.name}" defines a focal point but "${asset.kind}" assets do not support focal-point metadata.`,
          assetId: asset.id,
        })
      }
    }

    if (asset.replaceTargetAssetId) {
      if (asset.replaceTargetAssetId === asset.id) {
        diagnostics.push({
          id: `${asset.id}:replace-self`,
          code: 'media_asset_replace_target_self',
          severity: 'error',
          message: `Asset "${asset.name}" cannot replace itself.`,
          assetId: asset.id,
        })
      } else if (!mediaAssetIds.has(asset.replaceTargetAssetId)) {
        diagnostics.push({
          id: `${asset.id}:replace-target-missing`,
          code: 'media_asset_replace_target_missing',
          severity: 'warning',
          message: `Asset "${asset.name}" points to replacement target "${asset.replaceTargetAssetId}" but that asset does not exist.`,
          assetId: asset.id,
        })
      }
    }

    if (referencedAssetIds.has(asset.id)) {
      continue
    }

    const hasStaticUsage = asset.usage.some(entry => String(entry ?? '').trim().length > 0)
    if (hasStaticUsage) {
      continue
    }

    diagnostics.push({
      id: `${asset.id}:unused`,
      code: 'media_asset_unused',
      severity: 'warning',
      message: `Asset "${asset.name}" is saved in the media library but is not referenced by any CMS block.`,
      assetId: asset.id,
    })
  }

  return diagnostics.filter(diagnostic => {
    if (!diagnostic.assetId) {
      return true
    }
    return diagnostic.code === 'media_asset_unused'
      ? mediaAssetIds.has(diagnostic.assetId)
      : true
  })
}