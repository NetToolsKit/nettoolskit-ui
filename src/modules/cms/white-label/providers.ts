/**
 * Persistence provider contracts for the CMS engine.
 * The frontend demo defaults to browser localStorage, while external application
 * layers can inject their own adapters backed by API caches, IndexedDB or SSR state.
 */
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelFieldPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsBrandingSettings,
  CmsContentSettings,
  CmsLayoutSettings,
  CmsMediaAssetSettings,
  CmsPageSettings,
  CmsReleaseSettings,
  CmsReusableBlockSettings,
  CmsReusableSectionSettings,
  CmsWhiteLabelGovernance,
  CmsWhiteLabelSettings,
} from './types'
import type { AppShellAction, AppShellGroup, AppShellItem, AppShellTheme } from '../../../components/layout/app-shell.types'
import type { CmsThemeBasePresetId, CmsThemePresetId } from './theme-presets'

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

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
 * Async-friendly provider return type used by future backend integrations.
 * The current frontend demo keeps synchronous local persistence, while application
 * layers can implement the same contracts with promises backed by APIs.
 */
export type CmsProviderResult<T> = T | Promise<T>

/**
 * Content-domain snapshot consumed by future repository providers.
 * It excludes assets and release state so each concern can be integrated independently.
 */
export interface CmsContentRepositorySnapshot {
  branding: CmsBrandingSettings
  layout: CmsLayoutSettings
  content: CmsContentSettings
  pages: CmsPageSettings[]
  reusableSections: CmsReusableSectionSettings[]
  reusableBlocks: CmsReusableBlockSettings[]
  authoredContentModels: CmsAuthoredContentModelSettings[]
  authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
  themePresetId: CmsThemePresetId
  themePresetOverrides: Partial<Record<CmsThemeBasePresetId, Partial<AppShellTheme>>>
  theme: AppShellTheme
  navGroups: AppShellGroup[]
  items: AppShellItem[]
  toolbarActions: AppShellAction[]
  governance: CmsWhiteLabelGovernance
}

/**
 * Asset-domain snapshot consumed by media repository providers.
 */
export interface CmsAssetRepositorySnapshot {
  mediaAssets: CmsMediaAssetSettings[]
}

/**
 * Release-domain snapshot consumed by release repository providers.
 */
export interface CmsReleaseRepositorySnapshot {
  releases: CmsReleaseSettings
}

/**
 * Aggregate provider snapshot bundle that lets application layers persist each domain independently.
 */
export interface CmsEngineProviderSnapshots {
  content: CmsContentRepositorySnapshot
  assets: CmsAssetRepositorySnapshot
  releases: CmsReleaseRepositorySnapshot
}

/**
 * Repository domains that can be synchronized independently against backend persistence.
 */
export type CmsProviderSyncDomain = 'content' | 'assets' | 'releases'

/**
 * Version metadata associated with one persisted repository domain.
 * Version starts at 0 for unsynchronized local state and increments after each successful save.
 */
export interface CmsProviderSyncVersion {
  revision: string | null
  version: number
  updatedAt: string | null
}

/**
 * Versioned repository document used by optimistic-concurrency flows.
 */
export interface CmsProviderSyncDocument<TSnapshot> extends CmsProviderSyncVersion {
  snapshot: TSnapshot
}

export type CmsContentRepositorySyncDocument = CmsProviderSyncDocument<CmsContentRepositorySnapshot>
export type CmsAssetRepositorySyncDocument = CmsProviderSyncDocument<CmsAssetRepositorySnapshot>
export type CmsReleaseRepositorySyncDocument = CmsProviderSyncDocument<CmsReleaseRepositorySnapshot>

/**
 * Aggregate document bundle used by backend-aware sync helpers.
 */
export interface CmsEngineProviderSyncDocuments {
  content: CmsContentRepositorySyncDocument
  assets: CmsAssetRepositorySyncDocument
  releases: CmsReleaseRepositorySyncDocument
}

/**
 * Save request carrying optimistic concurrency expectations for one repository domain.
 */
export interface CmsProviderSyncSaveRequest<TSnapshot> {
  snapshot: TSnapshot
  expectedRevision?: string | null
  expectedVersion?: number | null
}

/**
 * Conflict payload returned when a provider rejects a stale save attempt.
 */
export interface CmsProviderSyncConflict<TSnapshot> {
  domain: CmsProviderSyncDomain
  expectedRevision: string | null
  expectedVersion: number | null
  current: CmsProviderSyncDocument<TSnapshot> | null
  reason: 'revision_mismatch' | 'version_mismatch'
}

/**
 * Save result for one optimistic repository write.
 */
export type CmsProviderSyncSaveResult<TSnapshot> =
  | {
    ok: true
    document: CmsProviderSyncDocument<TSnapshot>
  }
  | {
    ok: false
    conflict: CmsProviderSyncConflict<TSnapshot>
  }

/**
 * Aggregate save report across all provider domains.
 */
export interface CmsEngineProviderSyncSaveReport {
  content?: CmsProviderSyncSaveResult<CmsContentRepositorySnapshot>
  assets?: CmsProviderSyncSaveResult<CmsAssetRepositorySnapshot>
  releases?: CmsProviderSyncSaveResult<CmsReleaseRepositorySnapshot>
}

/**
 * Contract used by external content repositories.
 * Implementations can persist to APIs, IndexedDB, filesystem or server caches without changing the engine.
 */
export interface CmsContentRepositoryProvider {
  loadContentSnapshot(): CmsProviderResult<CmsContentRepositorySnapshot | null>
  saveContentSnapshot(snapshot: CmsContentRepositorySnapshot): CmsProviderResult<void>
}

/**
 * Promise-native content repository contract used by future backend integrations.
 */
export interface CmsAsyncContentRepositoryProvider {
  loadContentSnapshot(): Promise<CmsContentRepositorySnapshot | null>
  saveContentSnapshot(snapshot: CmsContentRepositorySnapshot): Promise<void>
}

/**
 * Contract used by external asset repositories.
 */
export interface CmsAssetRepositoryProvider {
  loadAssetSnapshot(): CmsProviderResult<CmsAssetRepositorySnapshot | null>
  saveAssetSnapshot(snapshot: CmsAssetRepositorySnapshot): CmsProviderResult<void>
}

/**
 * Promise-native asset repository contract used by future backend integrations.
 */
export interface CmsAsyncAssetRepositoryProvider {
  loadAssetSnapshot(): Promise<CmsAssetRepositorySnapshot | null>
  saveAssetSnapshot(snapshot: CmsAssetRepositorySnapshot): Promise<void>
}

/**
 * Contract used by external release repositories.
 */
export interface CmsReleaseRepositoryProvider {
  loadReleaseSnapshot(): CmsProviderResult<CmsReleaseRepositorySnapshot | null>
  saveReleaseSnapshot(snapshot: CmsReleaseRepositorySnapshot): CmsProviderResult<void>
}

/**
 * Promise-native release repository contract used by future backend integrations.
 */
export interface CmsAsyncReleaseRepositoryProvider {
  loadReleaseSnapshot(): Promise<CmsReleaseRepositorySnapshot | null>
  saveReleaseSnapshot(snapshot: CmsReleaseRepositorySnapshot): Promise<void>
}

/**
 * Optional provider set consumed by application layers embedding the CMS engine.
 */
export interface CmsEngineProviders {
  contentRepository?: CmsContentRepositoryProvider | null
  assetRepository?: CmsAssetRepositoryProvider | null
  releaseRepository?: CmsReleaseRepositoryProvider | null
}

/**
 * Promise-native provider set used by async repository adapters.
 */
export interface CmsAsyncEngineProviders {
  contentRepository?: CmsAsyncContentRepositoryProvider | null
  assetRepository?: CmsAsyncAssetRepositoryProvider | null
  releaseRepository?: CmsAsyncReleaseRepositoryProvider | null
}

/**
 * Promise-native content repository contract with optimistic concurrency semantics.
 */
export interface CmsAsyncContentSyncRepositoryProvider {
  loadContentDocument(): Promise<CmsContentRepositorySyncDocument | null>
  saveContentDocument(
    request: CmsProviderSyncSaveRequest<CmsContentRepositorySnapshot>
  ): Promise<CmsProviderSyncSaveResult<CmsContentRepositorySnapshot>>
}

/**
 * Promise-native asset repository contract with optimistic concurrency semantics.
 */
export interface CmsAsyncAssetSyncRepositoryProvider {
  loadAssetDocument(): Promise<CmsAssetRepositorySyncDocument | null>
  saveAssetDocument(
    request: CmsProviderSyncSaveRequest<CmsAssetRepositorySnapshot>
  ): Promise<CmsProviderSyncSaveResult<CmsAssetRepositorySnapshot>>
}

/**
 * Promise-native release repository contract with optimistic concurrency semantics.
 */
export interface CmsAsyncReleaseSyncRepositoryProvider {
  loadReleaseDocument(): Promise<CmsReleaseRepositorySyncDocument | null>
  saveReleaseDocument(
    request: CmsProviderSyncSaveRequest<CmsReleaseRepositorySnapshot>
  ): Promise<CmsProviderSyncSaveResult<CmsReleaseRepositorySnapshot>>
}

/**
 * Aggregate sync-capable provider bundle used by backend integrations that need revision safety.
 */
export interface CmsAsyncEngineSyncProviders {
  contentRepository?: CmsAsyncContentSyncRepositoryProvider | null
  assetRepository?: CmsAsyncAssetSyncRepositoryProvider | null
  releaseRepository?: CmsAsyncReleaseSyncRepositoryProvider | null
}

/**
 * Normalizes a sync-or-async provider result into a promise.
 */
export function resolveCmsProviderResult<T>(result: CmsProviderResult<T>): Promise<T> {
  return Promise.resolve(result)
}

/**
 * Creates a normalized sync document envelope for one repository domain.
 */
export function createCmsProviderSyncDocument<TSnapshot>(
  snapshot: TSnapshot,
  version: Partial<CmsProviderSyncVersion> = {}
): CmsProviderSyncDocument<TSnapshot> {
  const normalizedVersion = Number.isFinite(version.version)
    ? Math.max(0, Math.floor(Number(version.version)))
    : 0

  return {
    snapshot: cloneValue(snapshot),
    revision: typeof version.revision === 'string' && version.revision.trim().length > 0
      ? version.revision.trim()
      : null,
    version: normalizedVersion,
    updatedAt: typeof version.updatedAt === 'string' && version.updatedAt.trim().length > 0
      ? version.updatedAt.trim()
      : null,
  }
}

/**
 * Creates the next sync document version after a successful save.
 */
export function createNextCmsProviderSyncDocument<TSnapshot>(
  domain: CmsProviderSyncDomain,
  snapshot: TSnapshot,
  previous?: CmsProviderSyncDocument<TSnapshot> | null,
  at = new Date().toISOString()
): CmsProviderSyncDocument<TSnapshot> {
  const nextVersion = Number.isFinite(previous?.version)
    ? Math.max(0, Number(previous?.version)) + 1
    : 1
  const normalizedAt = String(at ?? '').trim() || new Date().toISOString()

  return createCmsProviderSyncDocument(snapshot, {
    revision: `${domain}-v${nextVersion}-${normalizedAt.replace(/[^0-9a-z]/gi, '').toLowerCase()}`,
    version: nextVersion,
    updatedAt: normalizedAt,
  })
}

/**
 * Builds a typed optimistic concurrency conflict payload.
 */
export function createCmsProviderSyncConflict<TSnapshot>(
  domain: CmsProviderSyncDomain,
  request: CmsProviderSyncSaveRequest<TSnapshot>,
  current: CmsProviderSyncDocument<TSnapshot> | null
): CmsProviderSyncConflict<TSnapshot> {
  const expectedVersion = Number.isFinite(request.expectedVersion)
    ? Math.max(0, Math.floor(Number(request.expectedVersion)))
    : null
  const normalizedExpectedRevision = typeof request.expectedRevision === 'string' && request.expectedRevision.trim().length > 0
    ? request.expectedRevision.trim()
    : null

  return {
    domain,
    expectedRevision: normalizedExpectedRevision,
    expectedVersion,
    current: current ? createCmsProviderSyncDocument(current.snapshot, current) : null,
    reason: normalizedExpectedRevision !== (current?.revision ?? null)
      ? 'revision_mismatch'
      : 'version_mismatch',
  }
}

/**
 * Checks whether a save request still matches the current persisted document revision.
 */
export function cmsProviderSyncRequestMatchesDocument<TSnapshot>(
  request: CmsProviderSyncSaveRequest<TSnapshot>,
  current: CmsProviderSyncDocument<TSnapshot> | null
): boolean {
  const expectedRevision = typeof request.expectedRevision === 'string' && request.expectedRevision.trim().length > 0
    ? request.expectedRevision.trim()
    : null
  const expectedVersion = Number.isFinite(request.expectedVersion)
    ? Math.max(0, Math.floor(Number(request.expectedVersion)))
    : null

  if (expectedRevision !== (current?.revision ?? null)) {
    return false
  }

  if (expectedVersion !== null && expectedVersion !== (current?.version ?? 0)) {
    return false
  }

  return true
}

/**
 * Wraps a sync-or-async content repository with a promise-native adapter.
 */
export function toAsyncCmsContentRepositoryProvider(
  provider: CmsContentRepositoryProvider
): CmsAsyncContentRepositoryProvider {
  return {
    loadContentSnapshot: () => resolveCmsProviderResult(provider.loadContentSnapshot()),
    saveContentSnapshot: snapshot => resolveCmsProviderResult(provider.saveContentSnapshot(snapshot)),
  }
}

/**
 * Wraps a sync-or-async asset repository with a promise-native adapter.
 */
export function toAsyncCmsAssetRepositoryProvider(
  provider: CmsAssetRepositoryProvider
): CmsAsyncAssetRepositoryProvider {
  return {
    loadAssetSnapshot: () => resolveCmsProviderResult(provider.loadAssetSnapshot()),
    saveAssetSnapshot: snapshot => resolveCmsProviderResult(provider.saveAssetSnapshot(snapshot)),
  }
}

/**
 * Wraps a sync-or-async release repository with a promise-native adapter.
 */
export function toAsyncCmsReleaseRepositoryProvider(
  provider: CmsReleaseRepositoryProvider
): CmsAsyncReleaseRepositoryProvider {
  return {
    loadReleaseSnapshot: () => resolveCmsProviderResult(provider.loadReleaseSnapshot()),
    saveReleaseSnapshot: snapshot => resolveCmsProviderResult(provider.saveReleaseSnapshot(snapshot)),
  }
}

/**
 * Wraps the optional engine provider set into a promise-native adapter bundle.
 */
export function toAsyncCmsEngineProviders(
  providers: CmsEngineProviders
): CmsAsyncEngineProviders {
  return {
    contentRepository: providers.contentRepository
      ? toAsyncCmsContentRepositoryProvider(providers.contentRepository)
      : null,
    assetRepository: providers.assetRepository
      ? toAsyncCmsAssetRepositoryProvider(providers.assetRepository)
      : null,
    releaseRepository: providers.releaseRepository
      ? toAsyncCmsReleaseRepositoryProvider(providers.releaseRepository)
      : null,
  }
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

/**
 * Extracts the content-domain repository snapshot from full white-label settings.
 */
export function createCmsContentRepositorySnapshot(
  settings: CmsWhiteLabelSettings
): CmsContentRepositorySnapshot {
  return {
    branding: cloneValue(settings.branding),
    layout: cloneValue(settings.layout),
    content: cloneValue(settings.content),
    pages: cloneValue(settings.pages),
    reusableSections: cloneValue(settings.reusableSections),
    reusableBlocks: cloneValue(settings.reusableBlocks),
    authoredContentModels: cloneValue(settings.authoredContentModels),
    authoredContentModelFieldPresets: cloneValue(settings.authoredContentModelFieldPresets),
    authoredBlockPresets: cloneValue(settings.authoredBlockPresets),
    themePresetId: settings.themePresetId,
    themePresetOverrides: cloneValue(settings.themePresetOverrides),
    theme: cloneValue(settings.theme),
    navGroups: cloneValue(settings.navGroups),
    items: cloneValue(settings.items),
    toolbarActions: cloneValue(settings.toolbarActions),
    governance: cloneValue(settings.governance),
  }
}

/**
 * Applies a content-domain repository snapshot while preserving assets and release state.
 */
export function applyCmsContentRepositorySnapshot(
  settings: CmsWhiteLabelSettings,
  snapshot: CmsContentRepositorySnapshot
): CmsWhiteLabelSettings {
  return {
    ...settings,
    branding: cloneValue(snapshot.branding),
    layout: cloneValue(snapshot.layout),
    content: cloneValue(snapshot.content),
    pages: cloneValue(snapshot.pages),
    reusableSections: cloneValue(snapshot.reusableSections),
    reusableBlocks: cloneValue(snapshot.reusableBlocks),
    authoredContentModels: cloneValue(snapshot.authoredContentModels),
    authoredContentModelFieldPresets: cloneValue(snapshot.authoredContentModelFieldPresets),
    authoredBlockPresets: cloneValue(snapshot.authoredBlockPresets),
    themePresetId: snapshot.themePresetId,
    themePresetOverrides: cloneValue(snapshot.themePresetOverrides),
    theme: cloneValue(snapshot.theme),
    navGroups: cloneValue(snapshot.navGroups),
    items: cloneValue(snapshot.items),
    toolbarActions: cloneValue(snapshot.toolbarActions),
    governance: cloneValue(snapshot.governance),
  }
}

/**
 * Extracts the asset-domain repository snapshot from full white-label settings.
 */
export function createCmsAssetRepositorySnapshot(
  settings: CmsWhiteLabelSettings
): CmsAssetRepositorySnapshot {
  return {
    mediaAssets: cloneValue(settings.mediaAssets),
  }
}

/**
 * Applies an asset-domain snapshot while preserving content and release state.
 */
export function applyCmsAssetRepositorySnapshot(
  settings: CmsWhiteLabelSettings,
  snapshot: CmsAssetRepositorySnapshot
): CmsWhiteLabelSettings {
  return {
    ...settings,
    mediaAssets: cloneValue(snapshot.mediaAssets),
  }
}

/**
 * Extracts the release-domain repository snapshot from full white-label settings.
 */
export function createCmsReleaseRepositorySnapshot(
  settings: CmsWhiteLabelSettings
): CmsReleaseRepositorySnapshot {
  return {
    releases: cloneValue(settings.releases),
  }
}

/**
 * Applies a release-domain snapshot while preserving content and assets.
 */
export function applyCmsReleaseRepositorySnapshot(
  settings: CmsWhiteLabelSettings,
  snapshot: CmsReleaseRepositorySnapshot
): CmsWhiteLabelSettings {
  return {
    ...settings,
    releases: cloneValue(snapshot.releases),
  }
}

/**
 * Splits full white-label settings into repository snapshots that can be persisted independently.
 */
export function createCmsEngineProviderSnapshots(
  settings: CmsWhiteLabelSettings
): CmsEngineProviderSnapshots {
  return {
    content: createCmsContentRepositorySnapshot(settings),
    assets: createCmsAssetRepositorySnapshot(settings),
    releases: createCmsReleaseRepositorySnapshot(settings),
  }
}

/**
 * Applies a partial bundle of repository snapshots while keeping omitted domains intact.
 */
export function applyCmsEngineProviderSnapshots(
  settings: CmsWhiteLabelSettings,
  snapshots: Partial<CmsEngineProviderSnapshots>
): CmsWhiteLabelSettings {
  let nextSettings = settings

  if (snapshots.content) {
    nextSettings = applyCmsContentRepositorySnapshot(nextSettings, snapshots.content)
  }

  if (snapshots.assets) {
    nextSettings = applyCmsAssetRepositorySnapshot(nextSettings, snapshots.assets)
  }

  if (snapshots.releases) {
    nextSettings = applyCmsReleaseRepositorySnapshot(nextSettings, snapshots.releases)
  }

  return nextSettings
}

/**
 * Loads all available repository snapshots through async-friendly providers.
 * Missing providers or null snapshots are ignored so callers can hydrate domains independently.
 */
export async function loadCmsEngineProviderSnapshotsAsync(
  providers: CmsEngineProviders | CmsAsyncEngineProviders
): Promise<Partial<CmsEngineProviderSnapshots>> {
  const asyncProviders = toAsyncCmsEngineProviders(providers as CmsEngineProviders)
  const [content, assets, releases] = await Promise.all([
    asyncProviders.contentRepository?.loadContentSnapshot() ?? Promise.resolve(null),
    asyncProviders.assetRepository?.loadAssetSnapshot() ?? Promise.resolve(null),
    asyncProviders.releaseRepository?.loadReleaseSnapshot() ?? Promise.resolve(null),
  ])

  return {
    ...(content ? { content } : {}),
    ...(assets ? { assets } : {}),
    ...(releases ? { releases } : {}),
  }
}

/**
 * Persists all available repository snapshots through async-friendly providers.
 * The source UI contract remains the aggregate white-label settings object.
 */
export async function saveCmsEngineProviderSnapshotsAsync(
  settings: CmsWhiteLabelSettings,
  providers: CmsEngineProviders | CmsAsyncEngineProviders
): Promise<CmsEngineProviderSnapshots> {
  const snapshots = createCmsEngineProviderSnapshots(settings)
  const asyncProviders = toAsyncCmsEngineProviders(providers as CmsEngineProviders)

  await Promise.all([
    asyncProviders.contentRepository?.saveContentSnapshot(snapshots.content) ?? Promise.resolve(),
    asyncProviders.assetRepository?.saveAssetSnapshot(snapshots.assets) ?? Promise.resolve(),
    asyncProviders.releaseRepository?.saveReleaseSnapshot(snapshots.releases) ?? Promise.resolve(),
  ])

  return snapshots
}

/**
 * Loads any available repository snapshots and hydrates an aggregate settings object.
 */
export async function hydrateCmsWhiteLabelSettingsFromProvidersAsync(
  settings: CmsWhiteLabelSettings,
  providers: CmsEngineProviders | CmsAsyncEngineProviders
): Promise<CmsWhiteLabelSettings> {
  const snapshots = await loadCmsEngineProviderSnapshotsAsync(providers)
  return applyCmsEngineProviderSnapshots(settings, snapshots)
}

/**
 * Loads all available versioned repository documents through sync-capable providers.
 */
export async function loadCmsEngineProviderSyncDocumentsAsync(
  providers: CmsAsyncEngineSyncProviders
): Promise<Partial<CmsEngineProviderSyncDocuments>> {
  const [content, assets, releases] = await Promise.all([
    providers.contentRepository?.loadContentDocument() ?? Promise.resolve(null),
    providers.assetRepository?.loadAssetDocument() ?? Promise.resolve(null),
    providers.releaseRepository?.loadReleaseDocument() ?? Promise.resolve(null),
  ])

  return {
    ...(content ? { content } : {}),
    ...(assets ? { assets } : {}),
    ...(releases ? { releases } : {}),
  }
}

/**
 * Loads sync-capable provider documents and hydrates aggregate white-label settings from their snapshots.
 */
export async function hydrateCmsWhiteLabelSettingsFromSyncProvidersAsync(
  settings: CmsWhiteLabelSettings,
  providers: CmsAsyncEngineSyncProviders
): Promise<{
  settings: CmsWhiteLabelSettings
  documents: Partial<CmsEngineProviderSyncDocuments>
}> {
  const documents = await loadCmsEngineProviderSyncDocumentsAsync(providers)
  return {
    settings: applyCmsEngineProviderSnapshots(settings, {
      ...(documents.content ? { content: documents.content.snapshot } : {}),
      ...(documents.assets ? { assets: documents.assets.snapshot } : {}),
      ...(documents.releases ? { releases: documents.releases.snapshot } : {}),
    }),
    documents,
  }
}

/**
 * Persists repository snapshots through sync-capable providers using optimistic concurrency expectations.
 */
export async function saveCmsEngineProviderSyncDocumentsAsync(
  settings: CmsWhiteLabelSettings,
  providers: CmsAsyncEngineSyncProviders,
  baseDocuments: Partial<CmsEngineProviderSyncDocuments> = {}
): Promise<CmsEngineProviderSyncSaveReport> {
  const snapshots = createCmsEngineProviderSnapshots(settings)
  const [content, assets, releases] = await Promise.all([
    providers.contentRepository?.saveContentDocument({
      snapshot: snapshots.content,
      expectedRevision: baseDocuments.content?.revision ?? null,
      expectedVersion: baseDocuments.content?.version ?? 0,
    }) ?? Promise.resolve(undefined),
    providers.assetRepository?.saveAssetDocument({
      snapshot: snapshots.assets,
      expectedRevision: baseDocuments.assets?.revision ?? null,
      expectedVersion: baseDocuments.assets?.version ?? 0,
    }) ?? Promise.resolve(undefined),
    providers.releaseRepository?.saveReleaseDocument({
      snapshot: snapshots.releases,
      expectedRevision: baseDocuments.releases?.revision ?? null,
      expectedVersion: baseDocuments.releases?.version ?? 0,
    }) ?? Promise.resolve(undefined),
  ])

  return {
    ...(content ? { content } : {}),
    ...(assets ? { assets } : {}),
    ...(releases ? { releases } : {}),
  }
}