/**
 * Persistence provider contracts for the CMS engine.
 * The frontend demo defaults to browser localStorage, while external application
 * layers can inject their own adapters backed by API caches, IndexedDB or SSR state.
 */

/**
 * Minimal key-value store contract used by CMS engine persistence helpers.
 */
export interface CmsPersistenceStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

/**
 * Shared options used by white-label settings persistence helpers.
 */
export interface CmsPersistenceOptions {
  store?: CmsPersistenceStore | null
}

/**
 * Options used by tenant profile persistence helpers.
 * Separate stores let application layers isolate white-label settings from profile collections.
 */
export interface CmsTenantProfilesPersistenceOptions {
  profilesStore?: CmsPersistenceStore | null
  settingsStore?: CmsPersistenceStore | null
}

/**
 * Resolves the active persistence store.
 * Explicit providers win; otherwise browser localStorage is used when available.
 */
export function resolveCmsPersistenceStore(
  provider?: CmsPersistenceStore | null
): CmsPersistenceStore | null {
  if (provider) {
    return provider
  }

  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }

  return window.localStorage
}