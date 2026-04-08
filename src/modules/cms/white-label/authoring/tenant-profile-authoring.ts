/**
 * Reusable tenant-profile authoring helpers for CMS white-label settings.
 *
 * Keeps tenant import/export, selection, and persistence flows out of view
 * shells so CMS apps can orchestrate state without owning every low-level
 * profile operation inline.
 */
import { normalizeCmsWhiteLabelSettings, loadCmsWhiteLabelSettings } from '../storage'
import {
  createTenantProfileId,
  removeCmsTenantProfile,
  upsertCmsTenantProfile,
} from '../tenant-profiles.storage'
import { createCmsTenantExportPayload, parseCmsTenantImportPayload } from '../tenant-payload'
import {
  createCmsDomainExportPayload,
  parseCmsDomainImportPayload,
  type CmsDomainPayloadDomain,
} from '../domain-payload'
import {
  createCmsSchemaExportPayload,
  parseCmsSchemaImportPayload,
  type CmsSchemaPackageSnapshot,
} from '../schema-payload'
import type { CmsEngineProviderSnapshots } from '../providers'
import type {
  CmsTenantProfile,
  CmsTenantProfilesState,
  CmsWhiteLabelSettings,
} from '../types'

/**
 * Serialized payload metadata returned by export helpers.
 */
export interface CmsJsonDownloadPayload {
  fileName: string
  payload: unknown
  serializedPayload: string
}

/**
 * Normalized tenant-profile resolution result.
 */
export interface CmsResolvedTenantProfile {
  tenantProfilesState: CmsTenantProfilesState
  activeProfileId: string
  profile: CmsTenantProfile
}

/**
 * Result of applying one tenant import file.
 */
export interface CmsTenantImportFileResult {
  tenantProfilesState: CmsTenantProfilesState
  activeProfileId: string
  profileId: string
  profileName: string
  sourceVersion: number
}

/**
 * Result of parsing one domain import file.
 */
export interface CmsDomainImportFileResult<TDomain extends CmsDomainPayloadDomain = CmsDomainPayloadDomain> {
  domain: TDomain
  snapshot: CmsEngineProviderSnapshots[TDomain]
  sourceVersion: number
  profileId: string
  profileName: string
}

/**
 * Result of parsing one schema import file.
 */
export interface CmsSchemaImportFileResult {
  snapshot: CmsSchemaPackageSnapshot
  sourceVersion: number
  profileId: string
  profileName: string
}

/**
 * Creates a stable fallback tenant profile when persisted state is empty.
 */
function createFallbackTenantProfile(): CmsTenantProfile {
  return {
    id: 'default',
    name: 'Default Tenant',
    settings: normalizeCmsWhiteLabelSettings(loadCmsWhiteLabelSettings()),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Resolves the active tenant profile while guaranteeing a valid fallback state.
 */
export function resolveActiveCmsTenantProfile(input: {
  tenantProfilesState: CmsTenantProfilesState
  activeProfileId: string
}): CmsResolvedTenantProfile {
  const activeProfile = input.tenantProfilesState.profiles.find(profile => profile.id === input.activeProfileId)
  if (activeProfile) {
    return {
      tenantProfilesState: input.tenantProfilesState,
      activeProfileId: activeProfile.id,
      profile: activeProfile,
    }
  }

  const firstProfile = input.tenantProfilesState.profiles[0]
  if (firstProfile) {
    return {
      tenantProfilesState: {
        ...input.tenantProfilesState,
        activeProfileId: firstProfile.id,
      },
      activeProfileId: firstProfile.id,
      profile: firstProfile,
    }
  }

  const fallbackProfile = createFallbackTenantProfile()
  return {
    tenantProfilesState: {
      activeProfileId: fallbackProfile.id,
      profiles: [fallbackProfile],
    },
    activeProfileId: fallbackProfile.id,
    profile: fallbackProfile,
  }
}

/**
 * Applies one tenant profile selection and returns the resolved settings clone.
 */
export function selectCmsTenantProfile(input: {
  tenantProfilesState: CmsTenantProfilesState
  profileId: string
}): {
  tenantProfilesState: CmsTenantProfilesState
  activeProfileId: string
  settings: CmsWhiteLabelSettings
  profile: CmsTenantProfile
} | null {
  const profile = input.tenantProfilesState.profiles.find(item => item.id === input.profileId)
  if (!profile) {
    return null
  }

  return {
    tenantProfilesState: {
      ...input.tenantProfilesState,
      activeProfileId: profile.id,
    },
    activeProfileId: profile.id,
    settings: normalizeCmsWhiteLabelSettings(profile.settings),
    profile,
  }
}

/**
 * Persists a settings snapshot back into the active tenant profile state.
 */
export function syncCmsTenantProfileSettings(input: {
  tenantProfilesState: CmsTenantProfilesState
  activeProfileId: string
  nextSettings: CmsWhiteLabelSettings
}): CmsResolvedTenantProfile {
  const active = resolveActiveCmsTenantProfile({
    tenantProfilesState: input.tenantProfilesState,
    activeProfileId: input.activeProfileId,
  })

  const nextState = upsertCmsTenantProfile(active.tenantProfilesState, {
    id: active.profile.id,
    name: active.profile.name,
    settings: normalizeCmsWhiteLabelSettings(input.nextSettings),
    updatedAt: new Date().toISOString(),
  })

  return resolveActiveCmsTenantProfile({
    tenantProfilesState: {
      ...nextState,
      activeProfileId: active.profile.id,
    },
    activeProfileId: active.profile.id,
  })
}

/**
 * Creates one tenant profile from a user-provided display name.
 */
export function createCmsTenantProfileFromName(input: {
  tenantProfilesState: CmsTenantProfilesState
  currentSettings: CmsWhiteLabelSettings
  profileName: string
}): CmsResolvedTenantProfile {
  const profileId = createTenantProfileId(
    input.profileName,
    input.tenantProfilesState.profiles.map(profile => profile.id)
  )

  const nextState = upsertCmsTenantProfile(input.tenantProfilesState, {
    id: profileId,
    name: input.profileName,
    settings: normalizeCmsWhiteLabelSettings(input.currentSettings),
  })

  return resolveActiveCmsTenantProfile({
    tenantProfilesState: {
      ...nextState,
      activeProfileId: profileId,
    },
    activeProfileId: profileId,
  })
}

/**
 * Removes the active tenant profile and guarantees a valid fallback result.
 */
export function removeActiveCmsTenantProfileEntry(input: {
  tenantProfilesState: CmsTenantProfilesState
  activeProfileId: string
}): CmsResolvedTenantProfile & { removedProfile: CmsTenantProfile | null } {
  const active = resolveActiveCmsTenantProfile({
    tenantProfilesState: input.tenantProfilesState,
    activeProfileId: input.activeProfileId,
  })

  const nextState = removeCmsTenantProfile(active.tenantProfilesState, active.profile.id)
  const resolved = resolveActiveCmsTenantProfile({
    tenantProfilesState: nextState,
    activeProfileId: nextState.activeProfileId,
  })

  return {
    ...resolved,
    removedProfile: active.profile,
  }
}

/**
 * Converts arbitrary strings into safe JSON file-name segments.
 */
export function toCmsJsonFileName(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

  return normalized || 'tenant-profile'
}

/**
 * Normalizes file inputs coming from native change events or direct file emits.
 */
export function resolveCmsImportedFile(input: Event | File): File | null {
  if (input instanceof File) {
    return input
  }

  const target = input.target as HTMLInputElement | null
  return target?.files?.[0] ?? null
}

/**
 * Creates one serializable download payload for tenant exports.
 */
export function createCmsTenantProfileDownload(profile: CmsTenantProfile): CmsJsonDownloadPayload {
  const payload = createCmsTenantExportPayload(profile)
  return {
    fileName: `ntk-cms-tenant-${toCmsJsonFileName(profile.id)}.json`,
    payload,
    serializedPayload: JSON.stringify(payload, null, 2),
  }
}

/**
 * Creates one serializable download payload for domain snapshot exports.
 */
export function createCmsDomainSnapshotDownload<TDomain extends CmsDomainPayloadDomain>(input: {
  domain: TDomain
  snapshot: CmsEngineProviderSnapshots[TDomain]
  profile: Pick<CmsTenantProfile, 'id' | 'name'>
}): CmsJsonDownloadPayload {
  const payload = createCmsDomainExportPayload({
    domain: input.domain,
    snapshot: input.snapshot,
    profile: input.profile,
  })

  return {
    fileName: `ntk-cms-${input.domain}-${toCmsJsonFileName(input.profile.id)}.json`,
    payload,
    serializedPayload: JSON.stringify(payload, null, 2),
  }
}

/**
 * Creates one serializable download payload for schema package exports.
 */
export function createCmsSchemaPackageDownload(input: {
  snapshot: CmsSchemaPackageSnapshot
  profile: Pick<CmsTenantProfile, 'id' | 'name'>
}): CmsJsonDownloadPayload {
  const payload = createCmsSchemaExportPayload({
    snapshot: input.snapshot,
    profile: input.profile,
  })

  return {
    fileName: `ntk-cms-schema-${toCmsJsonFileName(input.profile.id)}.json`,
    payload,
    serializedPayload: JSON.stringify(payload, null, 2),
  }
}

/**
 * Triggers a browser JSON download while preserving the last payload for tests.
 */
export function downloadCmsJsonPayload(download: CmsJsonDownloadPayload): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }

  ;(window as Window & {
    __NTK_CMS_LAST_DOWNLOAD__?: {
      fileName: string
      payload: string
    }
  }).__NTK_CMS_LAST_DOWNLOAD__ = {
    fileName: download.fileName,
    payload: download.serializedPayload,
  }

  const blob = new Blob([download.serializedPayload], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = download.fileName
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  window.setTimeout(() => {
    window.URL.revokeObjectURL(url)
  }, 0)

  return true
}

/**
 * Parses and merges one tenant import file into tenant-profile state.
 */
export async function importCmsTenantProfileFile(input: {
  file: File
  tenantProfilesState: CmsTenantProfilesState
  confirmReplace?: (profileId: string) => boolean
}): Promise<CmsTenantImportFileResult | null> {
  const fileContent = await input.file.text()
  const parsed = JSON.parse(fileContent) as unknown
  const imported = parseCmsTenantImportPayload(parsed, input.file.name)
  if (!imported) {
    return null
  }

  const normalizedSettings = normalizeCmsWhiteLabelSettings(imported.settings)
  const existingIds = input.tenantProfilesState.profiles.map(profile => profile.id)
  const requestedId = toCmsJsonFileName(imported.id || imported.name)
  const shouldReplace = existingIds.includes(requestedId) && Boolean(input.confirmReplace?.(requestedId))
  const profileId = shouldReplace
    ? requestedId
    : createTenantProfileId(requestedId, existingIds)

  const nextState = upsertCmsTenantProfile(input.tenantProfilesState, {
    id: profileId,
    name: imported.name.trim() || profileId,
    settings: normalizedSettings,
  })

  return {
    tenantProfilesState: {
      ...nextState,
      activeProfileId: profileId,
    },
    activeProfileId: profileId,
    profileId,
    profileName: imported.name.trim() || profileId,
    sourceVersion: imported.sourceVersion,
  }
}

/**
 * Parses one domain import file into a normalized repository payload.
 */
export async function importCmsDomainFile(
  file: File,
  expectedDomain?: CmsDomainPayloadDomain | null
): Promise<CmsDomainImportFileResult | null> {
  const fileContent = await file.text()
  const parsed = JSON.parse(fileContent) as unknown
  const imported = parseCmsDomainImportPayload(parsed, file.name, expectedDomain)
  if (!imported) {
    return null
  }

  return imported
}

/**
 * Parses one schema import file into a normalized schema package payload.
 */
export async function importCmsSchemaFile(file: File): Promise<CmsSchemaImportFileResult | null> {
  const fileContent = await file.text()
  const parsed = JSON.parse(fileContent) as unknown
  const imported = parseCmsSchemaImportPayload(parsed, file.name)
  if (!imported) {
    return null
  }

  return imported
}