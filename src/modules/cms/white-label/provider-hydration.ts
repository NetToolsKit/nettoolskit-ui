/**
 * Backend hydration examples for the CMS engine.
 * These helpers keep the engine backend-agnostic while giving host applications
 * a minimal path to plug API-backed repositories into the existing async provider contracts.
 */
import type {
  CmsAssetRepositorySnapshot,
  CmsAsyncAssetRepositoryProvider,
  CmsAsyncAssetSyncRepositoryProvider,
  CmsAsyncContentRepositoryProvider,
  CmsAsyncContentSyncRepositoryProvider,
  CmsAsyncEngineProviders,
  CmsAsyncEngineSyncProviders,
  CmsAsyncReleaseSyncRepositoryProvider,
  CmsAsyncReleaseRepositoryProvider,
  CmsContentRepositorySnapshot,
  CmsProviderSyncDocument,
  CmsProviderSyncSaveRequest,
  CmsProviderSyncSaveResult,
  CmsReleaseRepositorySnapshot,
} from './providers'

/**
 * Known CMS repository domains that can be hydrated independently.
 */
export type CmsProviderHydrationDomain = 'content' | 'assets' | 'releases'

/**
 * Generic transport used by example async repository adapters.
 * Host applications can implement this with fetch, Axios, RPC clients or SDK calls.
 */
export interface CmsProviderHydrationTransport {
  loadSnapshot<T>(domain: CmsProviderHydrationDomain): Promise<T | null>
  saveSnapshot<T>(domain: CmsProviderHydrationDomain, snapshot: T): Promise<void>
}

/**
 * Generic transport used by async repositories that need revision-safe save contracts.
 */
export interface CmsProviderHydrationSyncTransport {
  loadDocument<T>(domain: CmsProviderHydrationDomain): Promise<CmsProviderSyncDocument<T> | null>
  saveDocument<T>(
    domain: CmsProviderHydrationDomain,
    request: CmsProviderSyncSaveRequest<T>
  ): Promise<CmsProviderSyncSaveResult<T>>
}

/**
 * Creates the engine async providers from a generic domain transport.
 */
export function createCmsAsyncEngineProvidersFromTransport(
  transport: CmsProviderHydrationTransport
): CmsAsyncEngineProviders {
  const contentRepository: CmsAsyncContentRepositoryProvider = {
    loadContentSnapshot: () => transport.loadSnapshot<CmsContentRepositorySnapshot>('content'),
    saveContentSnapshot: snapshot => transport.saveSnapshot('content', snapshot),
  }

  const assetRepository: CmsAsyncAssetRepositoryProvider = {
    loadAssetSnapshot: () => transport.loadSnapshot<CmsAssetRepositorySnapshot>('assets'),
    saveAssetSnapshot: snapshot => transport.saveSnapshot('assets', snapshot),
  }

  const releaseRepository: CmsAsyncReleaseRepositoryProvider = {
    loadReleaseSnapshot: () => transport.loadSnapshot<CmsReleaseRepositorySnapshot>('releases'),
    saveReleaseSnapshot: snapshot => transport.saveSnapshot('releases', snapshot),
  }

  return {
    contentRepository,
    assetRepository,
    releaseRepository,
  }
}

/**
 * Creates sync-capable async engine providers from a generic revision-aware transport.
 */
export function createCmsAsyncEngineSyncProvidersFromTransport(
  transport: CmsProviderHydrationSyncTransport
): CmsAsyncEngineSyncProviders {
  const contentRepository: CmsAsyncContentSyncRepositoryProvider = {
    loadContentDocument: () => transport.loadDocument<CmsContentRepositorySnapshot>('content'),
    saveContentDocument: request => transport.saveDocument('content', request),
  }

  const assetRepository: CmsAsyncAssetSyncRepositoryProvider = {
    loadAssetDocument: () => transport.loadDocument<CmsAssetRepositorySnapshot>('assets'),
    saveAssetDocument: request => transport.saveDocument('assets', request),
  }

  const releaseRepository: CmsAsyncReleaseSyncRepositoryProvider = {
    loadReleaseDocument: () => transport.loadDocument<CmsReleaseRepositorySnapshot>('releases'),
    saveReleaseDocument: request => transport.saveDocument('releases', request),
  }

  return {
    contentRepository,
    assetRepository,
    releaseRepository,
  }
}

/**
 * Minimal fetch signature used by the HTTP hydration example.
 */
export type CmsHydrationFetch = (
  input: string,
  init?: {
    method?: string
    headers?: Record<string, string>
    body?: string
  }
) => Promise<{
  ok: boolean
  status: number
  json(): Promise<unknown>
}>

/**
 * Endpoint map consumed by the fetch-based hydration example.
 */
export interface CmsFetchProviderHydrationEndpoints {
  content?: string | null
  assets?: string | null
  releases?: string | null
}

/**
 * Options for the fetch-based provider hydration example.
 */
export interface CmsFetchProviderHydrationOptions {
  endpoints: CmsFetchProviderHydrationEndpoints
  fetchImpl: CmsHydrationFetch
  saveMethod?: 'PUT' | 'POST'
  headers?: Record<string, string>
}

function resolveEndpoint(
  endpoints: CmsFetchProviderHydrationEndpoints,
  domain: CmsProviderHydrationDomain
): string | null {
  const endpoint = endpoints[domain]
  return typeof endpoint === 'string' && endpoint.trim().length > 0 ? endpoint.trim() : null
}

/**
 * Creates a transport that loads and saves CMS repository snapshots through JSON HTTP endpoints.
 * This is a reference adapter only; host apps can replace it with Axios, TanStack Query or any SDK.
 */
export function createCmsFetchProviderHydrationTransport(
  options: CmsFetchProviderHydrationOptions
): CmsProviderHydrationTransport {
  const saveMethod = options.saveMethod ?? 'PUT'
  const defaultHeaders = {
    'content-type': 'application/json',
    ...(options.headers ?? {}),
  }

  return {
    async loadSnapshot<T>(domain: CmsProviderHydrationDomain): Promise<T | null> {
      const endpoint = resolveEndpoint(options.endpoints, domain)
      if (!endpoint) {
        return null
      }

      const response = await options.fetchImpl(endpoint, {
        method: 'GET',
        headers: defaultHeaders,
      })

      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        throw new Error(`Failed to load CMS ${domain} snapshot (${response.status})`)
      }

      return await response.json() as T
    },
    async saveSnapshot<T>(domain: CmsProviderHydrationDomain, snapshot: T): Promise<void> {
      const endpoint = resolveEndpoint(options.endpoints, domain)
      if (!endpoint) {
        return
      }

      const response = await options.fetchImpl(endpoint, {
        method: saveMethod,
        headers: defaultHeaders,
        body: JSON.stringify(snapshot),
      })

      if (!response.ok) {
        throw new Error(`Failed to save CMS ${domain} snapshot (${response.status})`)
      }
    },
  }
}

/**
 * Creates engine async providers backed by simple JSON HTTP endpoints.
 */
export function createCmsFetchEngineProviders(
  options: CmsFetchProviderHydrationOptions
): CmsAsyncEngineProviders {
  return createCmsAsyncEngineProvidersFromTransport(
    createCmsFetchProviderHydrationTransport(options)
  )
}