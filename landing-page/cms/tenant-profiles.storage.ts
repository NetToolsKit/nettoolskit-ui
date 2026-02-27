/**
 * Tenant profile persistence helpers for CMS white-label configuration.
 * Stores multiple tenant snapshots and keeps an active profile reference.
 */
import { createDefaultWhiteLabelSettings } from './white-label.config'
import { loadCmsWhiteLabelSettings, normalizeCmsWhiteLabelSettings } from './white-label.storage'
import type { CmsTenantProfile, CmsTenantProfilesState, CmsWhiteLabelSettings } from './white-label.types'

/**
 * Storage key that persists all tenant profiles for CMS white-label settings.
 */
export const CMS_TENANT_PROFILES_STORAGE_KEY = 'ntk.cms.whiteLabel.profiles.v1'
/**
 * Reserved identifier for the fallback tenant profile.
 */
export const CMS_DEFAULT_TENANT_PROFILE_ID = 'default'
/**
 * Default display name for the fallback tenant profile.
 */
export const CMS_DEFAULT_TENANT_PROFILE_NAME = 'Default Tenant'

/**
 * Creates a deep clone for profile payloads.
 */
function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Checks if browser storage APIs are available in current runtime.
 */
function isBrowserRuntime(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * Normalizes tenant display names and enforces max length.
 */
function normalizeTenantProfileName(value: unknown): string {
  const name = String(value ?? '').trim().slice(0, 64)
  return name || CMS_DEFAULT_TENANT_PROFILE_NAME
}

/**
 * Converts arbitrary names into safe tenant profile ids.
 */
function slugifyTenantProfileId(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || 'tenant'
}

/**
 * Ensures profile id uniqueness by appending numeric suffixes when needed.
 */
function ensureUniqueTenantProfileId(candidate: string, existingIds: Set<string>): string {
  if (!existingIds.has(candidate)) {
    return candidate
  }

  let index = 2
  let nextId = `${candidate}-${index}`
  while (existingIds.has(nextId)) {
    index += 1
    nextId = `${candidate}-${index}`
  }
  return nextId
}

/**
 * Creates a normalized tenant profile object.
 */
function createTenantProfile(settings: CmsWhiteLabelSettings, id: string, name: string): CmsTenantProfile {
  return {
    id,
    name: normalizeTenantProfileName(name),
    settings: cloneValue(settings),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Builds the default tenant profiles state with a single fallback profile.
 */
function createDefaultTenantProfilesState(initialSettings?: CmsWhiteLabelSettings): CmsTenantProfilesState {
  const baseSettings = initialSettings ? cloneValue(initialSettings) : createDefaultWhiteLabelSettings()
  return {
    activeProfileId: CMS_DEFAULT_TENANT_PROFILE_ID,
    profiles: [
      createTenantProfile(
        normalizeCmsWhiteLabelSettings(baseSettings),
        CMS_DEFAULT_TENANT_PROFILE_ID,
        CMS_DEFAULT_TENANT_PROFILE_NAME
      ),
    ],
  }
}

/**
 * Parses and normalizes a raw persisted tenant profiles state payload.
 */
function normalizeParsedTenantProfilesState(parsed: unknown): CmsTenantProfilesState | null {
  if (!parsed || typeof parsed !== 'object') {
    return null
  }

  const source = parsed as {
    activeProfileId?: unknown
    profiles?: unknown
  }

  if (!Array.isArray(source.profiles)) {
    return null
  }

  const usedIds = new Set<string>()
  const profiles: CmsTenantProfile[] = []
  for (const entry of source.profiles) {
    if (!entry || typeof entry !== 'object') {
      continue
    }

    const rawProfile = entry as {
      id?: unknown
      name?: unknown
      settings?: unknown
      updatedAt?: unknown
    }

    const idSeed = String(rawProfile.id ?? rawProfile.name ?? 'tenant')
    const profileId = ensureUniqueTenantProfileId(slugifyTenantProfileId(idSeed), usedIds)
    usedIds.add(profileId)

    const normalizedSettings = normalizeCmsWhiteLabelSettings(
      (rawProfile.settings ?? undefined) as Partial<CmsWhiteLabelSettings> | undefined
    )

    const updatedAt = String(rawProfile.updatedAt ?? '').trim()
    profiles.push({
      id: profileId,
      name: normalizeTenantProfileName(rawProfile.name ?? profileId),
      settings: normalizedSettings,
      updatedAt: updatedAt || new Date().toISOString(),
    })
  }

  if (profiles.length === 0) {
    return null
  }

  const activeProfileId = String(source.activeProfileId ?? '').trim()
  const hasActiveProfile = profiles.some(profile => profile.id === activeProfileId)

  return {
    activeProfileId: hasActiveProfile ? activeProfileId : profiles[0].id,
    profiles,
  }
}

/**
 * Creates a unique tenant profile id from a display name and existing ids.
 */
export function createTenantProfileId(name: string, existingIds: Iterable<string>): string {
  const usedIds = new Set(existingIds)
  const seed = slugifyTenantProfileId(name)
  return ensureUniqueTenantProfileId(seed, usedIds)
}

/**
 * Loads profile state from storage with legacy fallback from single-profile settings.
 */
export function loadCmsTenantProfilesState(): CmsTenantProfilesState {
  const fallback = createDefaultTenantProfilesState(loadCmsWhiteLabelSettings())
  if (!isBrowserRuntime()) {
    return fallback
  }

  const rawValue = window.localStorage.getItem(CMS_TENANT_PROFILES_STORAGE_KEY)
  if (!rawValue) {
    return fallback
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown
    return normalizeParsedTenantProfilesState(parsed) ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Saves a normalized tenant profiles state snapshot.
 */
export function saveCmsTenantProfilesState(state: CmsTenantProfilesState): void {
  if (!isBrowserRuntime()) {
    return
  }

  const normalized = normalizeParsedTenantProfilesState(state) ?? createDefaultTenantProfilesState(loadCmsWhiteLabelSettings())
  window.localStorage.setItem(CMS_TENANT_PROFILES_STORAGE_KEY, JSON.stringify(normalized))
}

/**
 * Inserts a tenant profile or updates an existing one by id.
 */
export function upsertCmsTenantProfile(
  state: CmsTenantProfilesState,
  profile: Omit<CmsTenantProfile, 'updatedAt'> & { updatedAt?: string }
): CmsTenantProfilesState {
  const nextProfile: CmsTenantProfile = {
    ...profile,
    updatedAt: profile.updatedAt ?? new Date().toISOString(),
    settings: normalizeCmsWhiteLabelSettings(profile.settings),
  }

  const exists = state.profiles.some(item => item.id === nextProfile.id)
  const profiles = exists
    ? state.profiles.map(item => (item.id === nextProfile.id ? nextProfile : item))
    : [...state.profiles, nextProfile]

  return {
    activeProfileId: exists ? state.activeProfileId : nextProfile.id,
    profiles,
  }
}

/**
 * Removes a tenant profile and guarantees at least one fallback profile remains.
 */
export function removeCmsTenantProfile(state: CmsTenantProfilesState, profileId: string): CmsTenantProfilesState {
  const remaining = state.profiles.filter(profile => profile.id !== profileId)
  if (remaining.length === 0) {
    return createDefaultTenantProfilesState()
  }

  return {
    activeProfileId: remaining.some(profile => profile.id === state.activeProfileId)
      ? state.activeProfileId
      : remaining[0].id,
    profiles: remaining,
  }
}