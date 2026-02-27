/**
 * Tenant profile import/export payload helpers used by CMS white-label settings.
 */
import type { CmsWhiteLabelSettings } from './white-label.types'

/**
 * Known payload kind for tenant profile import/export files.
 */
export const CMS_TENANT_PROFILE_PAYLOAD_KIND = 'ntk-cms-tenant-profile'

/**
 * Current payload version used for tenant profile exports.
 */
export const CMS_TENANT_PROFILE_PAYLOAD_VERSION = 2

/**
 * Minimum supported payload version accepted on import.
 */
export const CMS_TENANT_PROFILE_MIN_SUPPORTED_VERSION = 1

/**
 * Maximum supported payload version accepted on import.
 */
export const CMS_TENANT_PROFILE_MAX_SUPPORTED_VERSION = CMS_TENANT_PROFILE_PAYLOAD_VERSION

/**
 * Safe max length for tenant id values in import payloads.
 */
const MAX_TENANT_ID_LENGTH = 80

/**
 * Safe max length for tenant display names in import payloads.
 */
const MAX_TENANT_NAME_LENGTH = 64

/**
 * Normalized tenant profile import payload returned to CMS runtime.
 */
export interface CmsTenantImportPayload {
  id: string
  name: string
  settings: Partial<CmsWhiteLabelSettings>
  sourceVersion: number
}

/**
 * Versioned payload shape persisted to exported JSON files.
 */
export interface CmsTenantExportPayload {
  kind: typeof CMS_TENANT_PROFILE_PAYLOAD_KIND
  version: typeof CMS_TENANT_PROFILE_PAYLOAD_VERSION
  exportedAt: string
  profile: {
    id: string
    name: string
    settings: CmsWhiteLabelSettings
  }
}

/**
 * Builds a safe fallback id/name from a file name.
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
    return CMS_TENANT_PROFILE_MIN_SUPPORTED_VERSION
  }

  const parsedVersion = Number.parseInt(String(root.version ?? ''), 10)
  if (
    !Number.isFinite(parsedVersion)
    || parsedVersion < CMS_TENANT_PROFILE_MIN_SUPPORTED_VERSION
    || parsedVersion > CMS_TENANT_PROFILE_MAX_SUPPORTED_VERSION
  ) {
    return null
  }

  return parsedVersion
}

/**
 * Creates a versioned export payload from an in-memory tenant profile snapshot.
 */
export function createCmsTenantExportPayload(profile: {
  id: string
  name: string
  settings: CmsWhiteLabelSettings
}): CmsTenantExportPayload {
  return {
    kind: CMS_TENANT_PROFILE_PAYLOAD_KIND,
    version: CMS_TENANT_PROFILE_PAYLOAD_VERSION,
    exportedAt: new Date().toISOString(),
    profile: {
      id: sanitizeTenantId(profile.id, profile.name),
      name: sanitizeTenantName(profile.name, profile.id),
      settings: profile.settings,
    },
  }
}

/**
 * Parses and validates tenant import payloads from multiple legacy/current JSON formats.
 */
export function parseCmsTenantImportPayload(raw: unknown, fileName: string): CmsTenantImportPayload | null {
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
    if (kind.length > 0 && kind !== CMS_TENANT_PROFILE_PAYLOAD_KIND) {
      return null
    }
  }

  const fallback = getTenantFallbackName(fileName)

  if (root.profile && typeof root.profile === 'object') {
    const profile = root.profile as Record<string, unknown>
    const settings = profile.settings
    if (!settings || typeof settings !== 'object') {
      return null
    }

    return {
      id: sanitizeTenantId(profile.id, fallback),
      name: sanitizeTenantName(profile.name, fallback),
      settings: settings as Partial<CmsWhiteLabelSettings>,
      sourceVersion,
    }
  }

  if (root.settings && typeof root.settings === 'object') {
    return {
      id: sanitizeTenantId(root.id, fallback),
      name: sanitizeTenantName(root.name, fallback),
      settings: root.settings as Partial<CmsWhiteLabelSettings>,
      sourceVersion,
    }
  }

  if ('branding' in root || 'layout' in root || 'theme' in root) {
    return {
      id: sanitizeTenantId(fallback, 'imported-tenant'),
      name: sanitizeTenantName(fallback, 'Imported Tenant'),
      settings: root as Partial<CmsWhiteLabelSettings>,
      sourceVersion,
    }
  }

  return null
}