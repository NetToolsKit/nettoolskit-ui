/**
 * Domain-level import/export payload helpers for CMS repository snapshots.
 */
import type {
  CmsAssetRepositorySnapshot,
  CmsContentRepositorySnapshot,
  CmsEngineProviderSnapshots,
  CmsReleaseRepositorySnapshot,
} from './providers'

/**
 * Known payload kind for domain snapshot import/export files.
 */
export const CMS_DOMAIN_PAYLOAD_KIND = 'ntk-cms-domain-snapshot'

/**
 * Current payload version used for domain snapshot exports.
 */
export const CMS_DOMAIN_PAYLOAD_VERSION = 1

/**
 * Minimum supported payload version accepted on import.
 */
export const CMS_DOMAIN_PAYLOAD_MIN_SUPPORTED_VERSION = 1

/**
 * Maximum supported payload version accepted on import.
 */
export const CMS_DOMAIN_PAYLOAD_MAX_SUPPORTED_VERSION = CMS_DOMAIN_PAYLOAD_VERSION

/**
 * Supported CMS repository domains that can be exported independently.
 */
export type CmsDomainPayloadDomain = keyof CmsEngineProviderSnapshots

/**
 * Versioned domain export payload shape persisted to JSON files.
 */
export interface CmsDomainExportPayload<TDomain extends CmsDomainPayloadDomain = CmsDomainPayloadDomain> {
  kind: typeof CMS_DOMAIN_PAYLOAD_KIND
  version: typeof CMS_DOMAIN_PAYLOAD_VERSION
  exportedAt: string
  profile: {
    id: string
    name: string
  }
  domain: TDomain
  snapshot: CmsEngineProviderSnapshots[TDomain]
}

/**
 * Normalized domain import payload returned to the CMS runtime.
 */
export interface CmsDomainImportPayload<TDomain extends CmsDomainPayloadDomain = CmsDomainPayloadDomain> {
  domain: TDomain
  snapshot: CmsEngineProviderSnapshots[TDomain]
  sourceVersion: number
  profileId: string
  profileName: string
}

const MAX_TENANT_ID_LENGTH = 80
const MAX_TENANT_NAME_LENGTH = 64

/**
 * Builds a safe fallback name from a file name.
 */
function getTenantFallbackName(fileName: string): string {
  const fallback = String(fileName ?? '')
    .replace(/\.json$/i, '')
    .trim()

  return fallback || 'Imported Tenant'
}

/**
 * Sanitizes id-like values while preserving deterministic slug semantics.
 */
function sanitizeTenantId(value: unknown, fallback: string): string {
  const seed = String(value ?? '').trim() || String(fallback ?? '').trim() || 'tenant'
  const normalized = seed
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_TENANT_ID_LENGTH)

  return normalized || 'tenant'
}

/**
 * Sanitizes tenant display names to a bounded readable value.
 */
function sanitizeTenantName(value: unknown, fallback: string): string {
  const normalized = String(value ?? fallback).trim().slice(0, MAX_TENANT_NAME_LENGTH)
  return normalized || fallback
}

/**
 * Extracts payload version from unknown roots and validates support range.
 */
function parseSupportedPayloadVersion(root: Record<string, unknown>): number | null {
  if (!('version' in root)) {
    return CMS_DOMAIN_PAYLOAD_MIN_SUPPORTED_VERSION
  }

  const parsedVersion = Number.parseInt(String(root.version ?? ''), 10)
  if (
    !Number.isFinite(parsedVersion)
    || parsedVersion < CMS_DOMAIN_PAYLOAD_MIN_SUPPORTED_VERSION
    || parsedVersion > CMS_DOMAIN_PAYLOAD_MAX_SUPPORTED_VERSION
  ) {
    return null
  }

  return parsedVersion
}

/**
 * Resolves the requested repository domain from unknown values.
 */
function normalizeDomain(value: unknown): CmsDomainPayloadDomain | null {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (normalized === 'content' || normalized === 'assets' || normalized === 'releases') {
    return normalized
  }

  return null
}

/**
 * Detects content-domain snapshot compatibility roots.
 */
function isContentRepositorySnapshotShape(
  root: unknown
): root is CmsContentRepositorySnapshot {
  if (!root || typeof root !== 'object') {
    return false
  }

  const value = root as Record<string, unknown>
  return Boolean(
    value.branding
    && typeof value.branding === 'object'
    && value.layout
    && typeof value.layout === 'object'
    && value.content
    && typeof value.content === 'object'
    && Array.isArray(value.pages)
  )
}

/**
 * Detects asset-domain snapshot compatibility roots.
 */
function isAssetRepositorySnapshotShape(
  root: unknown
): root is CmsAssetRepositorySnapshot {
  if (!root || typeof root !== 'object') {
    return false
  }

  const value = root as Record<string, unknown>
  return Array.isArray(value.mediaAssets)
}

/**
 * Detects release-domain snapshot compatibility roots.
 */
function isReleaseRepositorySnapshotShape(
  root: unknown
): root is CmsReleaseRepositorySnapshot {
  if (!root || typeof root !== 'object') {
    return false
  }

  const value = root as Record<string, unknown>
  return Boolean(value.releases && typeof value.releases === 'object')
}

/**
 * Builds a versioned export payload from an in-memory repository snapshot.
 */
export function createCmsDomainExportPayload<TDomain extends CmsDomainPayloadDomain>(input: {
  domain: TDomain
  snapshot: CmsEngineProviderSnapshots[TDomain]
  profile: {
    id: string
    name: string
  }
}): CmsDomainExportPayload<TDomain> {
  return {
    kind: CMS_DOMAIN_PAYLOAD_KIND,
    version: CMS_DOMAIN_PAYLOAD_VERSION,
    exportedAt: new Date().toISOString(),
    profile: {
      id: sanitizeTenantId(input.profile.id, input.profile.name),
      name: sanitizeTenantName(input.profile.name, input.profile.id),
    },
    domain: input.domain,
    snapshot: input.snapshot,
  }
}

/**
 * Parses and validates domain import payloads from the versioned envelope or raw snapshot compatibility roots.
 */
export function parseCmsDomainImportPayload(
  raw: unknown,
  fileName: string,
  expectedDomain?: CmsDomainPayloadDomain | null
): CmsDomainImportPayload | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const root = raw as Record<string, unknown>
  const sourceVersion = parseSupportedPayloadVersion(root)
  if (sourceVersion === null) {
    return null
  }

  if ('kind' in root) {
    const kind = String(root.kind ?? '').trim().toLowerCase()
    if (kind.length > 0 && kind !== CMS_DOMAIN_PAYLOAD_KIND) {
      return null
    }
  }

  const fallback = getTenantFallbackName(fileName)

  if ('snapshot' in root) {
    const domain = normalizeDomain(root.domain)
    const snapshot = root.snapshot
    const profileRoot = root.profile && typeof root.profile === 'object'
      ? root.profile as Record<string, unknown>
      : {}

    if (!domain || (expectedDomain && domain !== expectedDomain) || !snapshot || typeof snapshot !== 'object') {
      return null
    }

    const snapshotRoot = snapshot as Record<string, unknown>
    if (
      (domain === 'content' && !isContentRepositorySnapshotShape(snapshotRoot))
      || (domain === 'assets' && !isAssetRepositorySnapshotShape(snapshotRoot))
      || (domain === 'releases' && !isReleaseRepositorySnapshotShape(snapshotRoot))
    ) {
      return null
    }

    return {
      domain,
      snapshot: snapshotRoot as unknown as CmsEngineProviderSnapshots[typeof domain],
      sourceVersion,
      profileId: sanitizeTenantId(profileRoot.id, fallback),
      profileName: sanitizeTenantName(profileRoot.name, fallback),
    }
  }

  const inferredDomain = expectedDomain ?? (
    isContentRepositorySnapshotShape(root)
      ? 'content'
      : isAssetRepositorySnapshotShape(root)
        ? 'assets'
        : isReleaseRepositorySnapshotShape(root)
          ? 'releases'
          : null
  )

  if (!inferredDomain) {
    return null
  }

  return {
    domain: inferredDomain,
    snapshot: root as unknown as CmsEngineProviderSnapshots[typeof inferredDomain],
    sourceVersion,
    profileId: sanitizeTenantId(fallback, 'tenant'),
    profileName: sanitizeTenantName(fallback, 'Imported Tenant'),
  }
}