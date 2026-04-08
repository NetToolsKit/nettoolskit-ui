/**
 * Tenant profile persistence helpers for CMS white-label configuration.
 * Stores multiple tenant snapshots and keeps an active profile reference.
 */
import { createDefaultWhiteLabelSettings } from './config'
import { loadCmsWhiteLabelSettings, normalizeCmsWhiteLabelSettings } from './storage'
import type { CmsTenantProfile, CmsTenantProfilesState, CmsWhiteLabelSettings } from './types'
import {
  resolveCmsPersistenceStore,
  type CmsPersistenceStore,
  type CmsTenantProfilesPersistenceOptions,
} from './providers'

/**
 * Storage key that persists all tenant profiles for CMS white-label settings.
 */
export const CMS_TENANT_PROFILES_STORAGE_KEY = 'ntk.cms.whiteLabel.profiles.v1'
/**
 * Current persisted schema version for tenant profile collections.
 */
export const CMS_TENANT_PROFILES_SCHEMA_VERSION = 2
/**
 * Reserved identifier for the fallback tenant profile.
 */
export const CMS_DEFAULT_TENANT_PROFILE_ID = 'default'
/**
 * Default display name for the fallback tenant profile.
 */
export const CMS_DEFAULT_TENANT_PROFILE_NAME = 'Default Tenant'
const CMS_MAX_TENANT_PROFILES = 50

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

  const version = Number.parseInt(String((source as Record<string, unknown>).version ?? ''), 10)
  if (Number.isFinite(version) && version > CMS_TENANT_PROFILES_SCHEMA_VERSION) {
    return null
  }

  if (!Array.isArray(source.profiles)) {
    return null
  }

  const usedIds = new Set<string>()
  const profiles: CmsTenantProfile[] = []
  for (const entry of source.profiles.slice(0, CMS_MAX_TENANT_PROFILES)) {
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
 * Loads profile state from the active persistence providers with compatibility fallback from single-profile settings.
 */
export function loadCmsTenantProfilesState(
  options: CmsTenantProfilesPersistenceOptions = {}
): CmsTenantProfilesState {
  const settingsStore = resolveCmsPersistenceStore(options.settingsStore ?? options.profilesStore)
  const profilesStore = resolveCmsPersistenceStore(options.profilesStore)
  const fallback = createDefaultTenantProfilesState(
    loadCmsWhiteLabelSettings(settingsStore ? { store: settingsStore } : undefined)
  )
  if (!profilesStore) {
    return fallback
  }

  const rawValue = profilesStore.getItem(CMS_TENANT_PROFILES_STORAGE_KEY)
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
 * Saves a normalized tenant profiles state snapshot through the active persistence provider.
 */
export function saveCmsTenantProfilesState(
  state: CmsTenantProfilesState,
  storeOrOptions?: CmsPersistenceStore | CmsTenantProfilesPersistenceOptions | null
): void {
  const options = isPersistenceStore(storeOrOptions)
    ? { profilesStore: storeOrOptions }
    : storeOrOptions ?? {}
  const profilesStore = resolveCmsPersistenceStore(options.profilesStore)
  if (!profilesStore) {
    return
  }

  const settingsStore = resolveCmsPersistenceStore(options.settingsStore ?? options.profilesStore)
  const normalized = normalizeParsedTenantProfilesState(state)
    ?? createDefaultTenantProfilesState(
      loadCmsWhiteLabelSettings(settingsStore ? { store: settingsStore } : undefined)
    )
  profilesStore.setItem(CMS_TENANT_PROFILES_STORAGE_KEY, JSON.stringify({
    version: CMS_TENANT_PROFILES_SCHEMA_VERSION,
    ...normalized,
  }))
}

/**
 * Checks whether an arbitrary value matches the low-level persistence store contract.
 */
function isPersistenceStore(value: unknown): value is CmsPersistenceStore {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<CmsPersistenceStore>
  return typeof candidate.getItem === 'function'
    && typeof candidate.setItem === 'function'
    && typeof candidate.removeItem === 'function'
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