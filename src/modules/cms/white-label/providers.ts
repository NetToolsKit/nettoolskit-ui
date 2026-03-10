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
 * Contract used by external content repositories.
 * Implementations can persist to APIs, IndexedDB, filesystem or server caches without changing the engine.
 */
export interface CmsContentRepositoryProvider {
  loadContentSnapshot(): CmsProviderResult<CmsContentRepositorySnapshot | null>
  saveContentSnapshot(snapshot: CmsContentRepositorySnapshot): CmsProviderResult<void>
}

/**
 * Contract used by external asset repositories.
 */
export interface CmsAssetRepositoryProvider {
  loadAssetSnapshot(): CmsProviderResult<CmsAssetRepositorySnapshot | null>
  saveAssetSnapshot(snapshot: CmsAssetRepositorySnapshot): CmsProviderResult<void>
}

/**
 * Contract used by external release repositories.
 */
export interface CmsReleaseRepositoryProvider {
  loadReleaseSnapshot(): CmsProviderResult<CmsReleaseRepositorySnapshot | null>
  saveReleaseSnapshot(snapshot: CmsReleaseRepositorySnapshot): CmsProviderResult<void>
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