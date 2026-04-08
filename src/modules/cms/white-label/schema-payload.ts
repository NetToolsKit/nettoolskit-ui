/**
 * Schema-level import/export payload helpers for CMS-authored models and presets.
 */
import {
  createDefaultCmsAuthoredBlockPresets,
  normalizeCmsAuthoredBlockPresets,
} from './block-presets'
import {
  createDefaultCmsAuthoredContentModels,
  normalizeCmsAuthoredContentModels,
} from './content-models'
import {
  createDefaultCmsAuthoredContentModelFieldPresets,
  normalizeCmsAuthoredContentModelFieldPresets,
} from './schema-field-presets'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelFieldPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsWhiteLabelSettings,
} from './types'

/**
 * Known payload kind for schema package import/export files.
 */
export const CMS_SCHEMA_PACKAGE_KIND = 'ntk-cms-schema-package'

/**
 * Current payload version used for schema package exports.
 */
export const CMS_SCHEMA_PACKAGE_VERSION = 1

/**
 * Minimum supported payload version accepted on import.
 */
export const CMS_SCHEMA_PACKAGE_MIN_SUPPORTED_VERSION = 1

/**
 * Maximum supported payload version accepted on import.
 */
export const CMS_SCHEMA_PACKAGE_MAX_SUPPORTED_VERSION = CMS_SCHEMA_PACKAGE_VERSION

/**
 * Schema-only CMS snapshot containing authored models and reusable presets.
 */
export interface CmsSchemaPackageSnapshot {
  authoredContentModels: CmsAuthoredContentModelSettings[]
  authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
}

/**
 * Versioned schema export payload shape persisted to JSON files.
 */
export interface CmsSchemaPackageExportPayload {
  kind: typeof CMS_SCHEMA_PACKAGE_KIND
  version: typeof CMS_SCHEMA_PACKAGE_VERSION
  exportedAt: string
  profile: {
    id: string
    name: string
  }
  snapshot: CmsSchemaPackageSnapshot
}

/**
 * Normalized schema import payload returned to the CMS runtime.
 */
export interface CmsSchemaPackageImportPayload {
  snapshot: CmsSchemaPackageSnapshot
  sourceVersion: number
  profileId: string
  profileName: string
}

const MAX_TENANT_ID_LENGTH = 80
const MAX_TENANT_NAME_LENGTH = 64

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fall through to the JSON-compatible clone below for Vue reactive proxies.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Builds a stable default schema snapshot used by normalization/import fallbacks.
 */
export function createDefaultCmsSchemaPackageSnapshot(): CmsSchemaPackageSnapshot {
  return {
    authoredContentModels: createDefaultCmsAuthoredContentModels(),
    authoredContentModelFieldPresets: createDefaultCmsAuthoredContentModelFieldPresets(),
    authoredBlockPresets: createDefaultCmsAuthoredBlockPresets(),
  }
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
 * Builds a safe fallback display name from a file name.
 */
function getTenantFallbackName(fileName: string): string {
  const fallback = String(fileName ?? '')
    .replace(/\.json$/i, '')
    .trim()

  return fallback || 'Imported Tenant'
}

/**
 * Extracts payload version from unknown roots and validates support range.
 */
function parseSupportedPayloadVersion(root: Record<string, unknown>): number | null {
  if (!('version' in root)) {
    return CMS_SCHEMA_PACKAGE_MIN_SUPPORTED_VERSION
  }

  const parsedVersion = Number.parseInt(String(root.version ?? ''), 10)
  if (
    !Number.isFinite(parsedVersion)
    || parsedVersion < CMS_SCHEMA_PACKAGE_MIN_SUPPORTED_VERSION
    || parsedVersion > CMS_SCHEMA_PACKAGE_MAX_SUPPORTED_VERSION
  ) {
    return null
  }

  return parsedVersion
}

/**
 * Detects raw schema-snapshot compatibility roots.
 */
function isSchemaPackageSnapshotShape(root: unknown): root is Partial<CmsSchemaPackageSnapshot> {
  if (!root || typeof root !== 'object') {
    return false
  }

  const value = root as Record<string, unknown>
  return (
    Array.isArray(value.authoredContentModels)
    || Array.isArray(value.authoredContentModelFieldPresets)
    || Array.isArray(value.authoredBlockPresets)
  )
}

/**
 * Normalizes imported schema payloads into one stable engine snapshot.
 */
export function normalizeCmsSchemaPackageSnapshot(
  snapshot: Partial<CmsSchemaPackageSnapshot> | null | undefined,
  defaults: CmsSchemaPackageSnapshot = createDefaultCmsSchemaPackageSnapshot()
): CmsSchemaPackageSnapshot {
  return {
    authoredContentModels: normalizeCmsAuthoredContentModels(
      snapshot?.authoredContentModels,
      defaults.authoredContentModels
    ),
    authoredContentModelFieldPresets: normalizeCmsAuthoredContentModelFieldPresets(
      snapshot?.authoredContentModelFieldPresets,
      defaults.authoredContentModelFieldPresets
    ),
    authoredBlockPresets: normalizeCmsAuthoredBlockPresets(
      snapshot?.authoredBlockPresets,
      defaults.authoredBlockPresets
    ),
  }
}

/**
 * Extracts the schema-only authored snapshot from full white-label settings.
 */
export function createCmsSchemaPackageSnapshot(
  settings: CmsWhiteLabelSettings
): CmsSchemaPackageSnapshot {
  return {
    authoredContentModels: cloneValue(settings.authoredContentModels),
    authoredContentModelFieldPresets: cloneValue(settings.authoredContentModelFieldPresets),
    authoredBlockPresets: cloneValue(settings.authoredBlockPresets),
  }
}

/**
 * Applies a schema-only snapshot while preserving authored page content, assets and releases.
 */
export function applyCmsSchemaPackageSnapshot(
  settings: CmsWhiteLabelSettings,
  snapshot: Partial<CmsSchemaPackageSnapshot>
): CmsWhiteLabelSettings {
  const normalizedSnapshot = normalizeCmsSchemaPackageSnapshot(snapshot)

  return {
    ...settings,
    authoredContentModels: cloneValue(normalizedSnapshot.authoredContentModels),
    authoredContentModelFieldPresets: cloneValue(normalizedSnapshot.authoredContentModelFieldPresets),
    authoredBlockPresets: cloneValue(normalizedSnapshot.authoredBlockPresets),
  }
}

/**
 * Builds a versioned export payload from one in-memory schema snapshot.
 */
export function createCmsSchemaExportPayload(input: {
  snapshot: CmsSchemaPackageSnapshot
  profile: {
    id: string
    name: string
  }
}): CmsSchemaPackageExportPayload {
  return {
    kind: CMS_SCHEMA_PACKAGE_KIND,
    version: CMS_SCHEMA_PACKAGE_VERSION,
    exportedAt: new Date().toISOString(),
    profile: {
      id: sanitizeTenantId(input.profile.id, input.profile.name),
      name: sanitizeTenantName(input.profile.name, input.profile.id),
    },
    snapshot: normalizeCmsSchemaPackageSnapshot(input.snapshot),
  }
}

/**
 * Parses and validates schema import payloads from the versioned envelope or raw compatibility snapshots.
 */
export function parseCmsSchemaImportPayload(
  raw: unknown,
  fileName: string
): CmsSchemaPackageImportPayload | null {
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
    if (kind.length > 0 && kind !== CMS_SCHEMA_PACKAGE_KIND) {
      return null
    }
  }

  const fallback = getTenantFallbackName(fileName)
  const profileRoot = root.profile && typeof root.profile === 'object'
    ? root.profile as Record<string, unknown>
    : {}

  if ('snapshot' in root) {
    const snapshot = root.snapshot
    if (!isSchemaPackageSnapshotShape(snapshot)) {
      return null
    }

    return {
      snapshot: normalizeCmsSchemaPackageSnapshot(snapshot),
      sourceVersion,
      profileId: sanitizeTenantId(profileRoot.id, fallback),
      profileName: sanitizeTenantName(profileRoot.name, fallback),
    }
  }

  if (!isSchemaPackageSnapshotShape(root)) {
    return null
  }

  return {
    snapshot: normalizeCmsSchemaPackageSnapshot(root),
    sourceVersion,
    profileId: sanitizeTenantId(fallback, 'tenant'),
    profileName: sanitizeTenantName(fallback, 'Imported Tenant'),
  }
}