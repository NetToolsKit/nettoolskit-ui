/**
 * Draft recovery helpers for CMS authoring sessions.
 * Stores recent autosave snapshots per tenant profile so the editor can recover
 * from destructive actions or interrupted browser sessions without backend coupling.
 */
import type { CmsPersistenceOptions } from './providers'
import { resolveCmsPersistenceStore } from './providers'
import type { CmsWhiteLabelSettings } from './types'

/**
 * Storage key used for draft recovery snapshots.
 */
export const CMS_DRAFT_RECOVERY_STORAGE_KEY = 'ntk.cms.whiteLabel.recovery.v1'

/**
 * Current draft recovery schema version.
 */
export const CMS_DRAFT_RECOVERY_STORAGE_VERSION = 1

/**
 * Reason associated with one stored recovery snapshot.
 */
export type CmsDraftRecoveryReason = 'autosave' | 'checkpoint'

/**
 * Immutable recovery snapshot metadata.
 */
export interface CmsDraftRecoverySnapshot {
  savedAt: string
  checksum: string
  reason: CmsDraftRecoveryReason
  settings: CmsWhiteLabelSettings
}

/**
 * Per-profile recovery ring buffer.
 */
export interface CmsDraftRecoveryEntry {
  profileId: string
  latest: CmsDraftRecoverySnapshot | null
  previous: CmsDraftRecoverySnapshot | null
}

/**
 * Global recovery state persisted in local storage.
 */
export interface CmsDraftRecoveryState {
  version: typeof CMS_DRAFT_RECOVERY_STORAGE_VERSION
  entries: Record<string, CmsDraftRecoveryEntry>
}

/**
 * Save result returned by autosave helpers.
 */
export interface CmsDraftRecoverySaveResult {
  ok: boolean
  state: CmsDraftRecoveryState
  entry: CmsDraftRecoveryEntry | null
  savedSnapshot: CmsDraftRecoverySnapshot | null
  error?: string
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fall through to JSON clone.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function createEmptyDraftRecoveryState(): CmsDraftRecoveryState {
  return {
    version: CMS_DRAFT_RECOVERY_STORAGE_VERSION,
    entries: {},
  }
}

function normalizeProfileId(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'default-tenant'
}

function createSnapshotChecksum(settings: CmsWhiteLabelSettings): string {
  return JSON.stringify(settings)
}

function createDraftRecoverySnapshot(
  settings: CmsWhiteLabelSettings,
  reason: CmsDraftRecoveryReason
): CmsDraftRecoverySnapshot {
  const clonedSettings = cloneValue(settings)
  return {
    savedAt: new Date().toISOString(),
    checksum: createSnapshotChecksum(clonedSettings),
    reason,
    settings: clonedSettings,
  }
}

function normalizeRecoverySnapshot(value: unknown): CmsDraftRecoverySnapshot | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const root = value as Record<string, unknown>
  if (!root.settings || typeof root.settings !== 'object') {
    return null
  }

  const reason = root.reason === 'checkpoint' ? 'checkpoint' : 'autosave'
  const savedAt = String(root.savedAt ?? '').trim() || new Date().toISOString()
  const settings = cloneValue(root.settings as CmsWhiteLabelSettings)

  return {
    savedAt,
    reason,
    checksum: typeof root.checksum === 'string' && root.checksum.trim()
      ? root.checksum
      : createSnapshotChecksum(settings),
    settings,
  }
}

function normalizeRecoveryEntry(profileId: string, value: unknown): CmsDraftRecoveryEntry {
  if (!value || typeof value !== 'object') {
    return {
      profileId,
      latest: null,
      previous: null,
    }
  }

  const root = value as Record<string, unknown>
  return {
    profileId,
    latest: normalizeRecoverySnapshot(root.latest),
    previous: normalizeRecoverySnapshot(root.previous),
  }
}

/**
 * Loads persisted draft-recovery state from the active store.
 */
export function loadCmsDraftRecoveryState(options: CmsPersistenceOptions = {}): CmsDraftRecoveryState {
  const store = resolveCmsPersistenceStore(options.store)
  if (!store) {
    return createEmptyDraftRecoveryState()
  }

  const raw = store.getItem(CMS_DRAFT_RECOVERY_STORAGE_KEY)
  if (!raw) {
    return createEmptyDraftRecoveryState()
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') {
      return createEmptyDraftRecoveryState()
    }

    const root = parsed as Record<string, unknown>
    if (Number.parseInt(String(root.version ?? ''), 10) > CMS_DRAFT_RECOVERY_STORAGE_VERSION) {
      return createEmptyDraftRecoveryState()
    }

    const entriesRoot = root.entries
    if (!entriesRoot || typeof entriesRoot !== 'object') {
      return createEmptyDraftRecoveryState()
    }

    const normalizedEntries = Object.entries(entriesRoot as Record<string, unknown>).reduce<Record<string, CmsDraftRecoveryEntry>>(
      (accumulator, [entryProfileId, entryValue]) => {
        const profileId = normalizeProfileId(entryProfileId)
        accumulator[profileId] = normalizeRecoveryEntry(profileId, entryValue)
        return accumulator
      },
      {}
    )

    return {
      version: CMS_DRAFT_RECOVERY_STORAGE_VERSION,
      entries: normalizedEntries,
    }
  } catch {
    return createEmptyDraftRecoveryState()
  }
}

/**
 * Persists one full draft-recovery state snapshot.
 */
export function saveCmsDraftRecoveryState(
  state: CmsDraftRecoveryState,
  options: CmsPersistenceOptions = {}
): void {
  const store = resolveCmsPersistenceStore(options.store)
  if (!store) {
    return
  }

  store.setItem(CMS_DRAFT_RECOVERY_STORAGE_KEY, JSON.stringify({
    version: CMS_DRAFT_RECOVERY_STORAGE_VERSION,
    entries: state.entries,
  }))
}

/**
 * Returns the recovery entry associated with one tenant profile.
 */
export function getCmsDraftRecoveryEntry(
  state: CmsDraftRecoveryState,
  profileId: string
): CmsDraftRecoveryEntry | null {
  return state.entries[normalizeProfileId(profileId)] ?? null
}

/**
 * Saves one autosave/checkpoint snapshot into the per-profile ring buffer.
 */
export function saveCmsDraftRecoverySnapshot(
  profileId: string,
  settings: CmsWhiteLabelSettings,
  reason: CmsDraftRecoveryReason,
  options: CmsPersistenceOptions = {}
): CmsDraftRecoverySaveResult {
  try {
    const normalizedProfileId = normalizeProfileId(profileId)
    const nextSnapshot = createDraftRecoverySnapshot(settings, reason)
    const currentState = loadCmsDraftRecoveryState(options)
    const currentEntry = getCmsDraftRecoveryEntry(currentState, normalizedProfileId)
    const nextEntry: CmsDraftRecoveryEntry = {
      profileId: normalizedProfileId,
      latest: nextSnapshot,
      previous: null,
    }

    if (currentEntry?.latest) {
      if (currentEntry.latest.checksum === nextSnapshot.checksum) {
        nextEntry.latest = {
          ...currentEntry.latest,
          savedAt: nextSnapshot.savedAt,
          reason,
        }
        nextEntry.previous = currentEntry.previous ? cloneValue(currentEntry.previous) : null
      } else {
        nextEntry.previous = cloneValue(currentEntry.latest)
      }
    }

    const nextState: CmsDraftRecoveryState = {
      version: CMS_DRAFT_RECOVERY_STORAGE_VERSION,
      entries: {
        ...currentState.entries,
        [normalizedProfileId]: nextEntry,
      },
    }

    saveCmsDraftRecoveryState(nextState, options)

    return {
      ok: true,
      state: nextState,
      entry: nextEntry,
      savedSnapshot: nextEntry.latest,
    }
  } catch (error) {
    return {
      ok: false,
      state: loadCmsDraftRecoveryState(options),
      entry: null,
      savedSnapshot: null,
      error: error instanceof Error ? error.message : String(error ?? 'Unknown draft recovery error'),
    }
  }
}

/**
 * Removes recovery snapshots for one tenant profile.
 */
export function clearCmsDraftRecoveryEntry(
  profileId: string,
  options: CmsPersistenceOptions = {}
): CmsDraftRecoveryState {
  const normalizedProfileId = normalizeProfileId(profileId)
  const currentState = loadCmsDraftRecoveryState(options)
  if (!currentState.entries[normalizedProfileId]) {
    return currentState
  }

  const nextEntries = { ...currentState.entries }
  delete nextEntries[normalizedProfileId]
  const nextState: CmsDraftRecoveryState = {
    version: CMS_DRAFT_RECOVERY_STORAGE_VERSION,
    entries: nextEntries,
  }
  saveCmsDraftRecoveryState(nextState, options)
  return nextState
}

/**
 * Resolves the most useful recovery candidate for the current editor snapshot.
 * If the latest autosave already matches the current editor state, it falls back
 * to the previous ring-buffer entry when available.
 */
export function resolveCmsDraftRecoveryCandidate(
  entry: CmsDraftRecoveryEntry | null | undefined,
  currentSettings: CmsWhiteLabelSettings
): CmsDraftRecoverySnapshot | null {
  if (!entry) {
    return null
  }

  const currentChecksum = createSnapshotChecksum(currentSettings)
  if (entry.latest && entry.latest.checksum !== currentChecksum) {
    return cloneValue(entry.latest)
  }

  if (entry.previous && entry.previous.checksum !== currentChecksum) {
    return cloneValue(entry.previous)
  }

  return null
}