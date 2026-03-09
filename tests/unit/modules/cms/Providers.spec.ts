/**
 * Tests/unit/modules/cms/Providers spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  applyCmsAssetRepositorySnapshot,
  applyCmsContentRepositorySnapshot,
  applyCmsEngineProviderSnapshots,
  applyCmsReleaseRepositorySnapshot,
  createCmsAssetRepositorySnapshot,
  createCmsContentRepositorySnapshot,
  createCmsEngineProviderSnapshots,
  createCmsReleaseRepositorySnapshot,
  type CmsPersistenceStore,
} from '../../../../src/modules/cms/white-label/providers'
import {
  loadCmsAssetRepositorySnapshot,
  loadCmsContentRepositorySnapshot,
  loadCmsReleaseRepositorySnapshot,
  loadCmsWhiteLabelSettings,
  saveCmsAssetRepositorySnapshot,
  saveCmsContentRepositorySnapshot,
  saveCmsReleaseRepositorySnapshot,
  saveCmsWhiteLabelSettings,
} from '../../../../src/modules/cms/white-label/storage'

/**
 * Creates an isolated in-memory persistence store for repository provider tests.
 */
function createMemoryStore(): CmsPersistenceStore {
  const storage = new Map<string, string>()
  return {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, String(value))
    },
    removeItem: (key: string) => {
      storage.delete(key)
    },
  }
}

describe('white-label.providers', () => {
  it('splits settings into domain snapshots and reapplies them without cross-domain mutation', () => {
    const source = createDefaultWhiteLabelSettings()
    source.branding.appName = 'Provider Source'
    source.content.locale = 'pt-BR'
    source.governance.workflow.status = 'approved'
    if (source.mediaAssets[0]) {
      source.mediaAssets[0].name = 'Source Asset'
    }
    source.releases.activeEnvironment = 'production'

    const snapshots = createCmsEngineProviderSnapshots(source)
    expect(snapshots.content.branding.appName).toBe('Provider Source')
    expect(snapshots.assets.mediaAssets[0]?.name).toBe('Source Asset')
    expect(snapshots.releases.releases.activeEnvironment).toBe('production')

    const current = createDefaultWhiteLabelSettings()
    current.branding.appName = 'Current Tenant'
    if (current.mediaAssets[0]) {
      current.mediaAssets[0].name = 'Current Asset'
    }
    current.releases.activeEnvironment = 'dev'

    const contentApplied = applyCmsContentRepositorySnapshot(current, snapshots.content)
    expect(contentApplied.branding.appName).toBe('Provider Source')
    expect(contentApplied.content.locale).toBe('pt-BR')
    expect(contentApplied.governance.workflow.status).toBe('approved')
    expect(contentApplied.mediaAssets[0]?.name).toBe('Current Asset')
    expect(contentApplied.releases.activeEnvironment).toBe('dev')

    const assetApplied = applyCmsAssetRepositorySnapshot(current, snapshots.assets)
    expect(assetApplied.mediaAssets[0]?.name).toBe('Source Asset')
    expect(assetApplied.branding.appName).toBe('Current Tenant')
    expect(assetApplied.releases.activeEnvironment).toBe('dev')

    const releaseApplied = applyCmsReleaseRepositorySnapshot(current, snapshots.releases)
    expect(releaseApplied.releases.activeEnvironment).toBe('production')
    expect(releaseApplied.branding.appName).toBe('Current Tenant')
    expect(releaseApplied.mediaAssets[0]?.name).toBe('Current Asset')

    const combined = applyCmsEngineProviderSnapshots(current, {
      content: snapshots.content,
      assets: snapshots.assets,
      releases: snapshots.releases,
    })
    expect(combined.branding.appName).toBe('Provider Source')
    expect(combined.mediaAssets[0]?.name).toBe('Source Asset')
    expect(combined.releases.activeEnvironment).toBe('production')
  })

  it('loads and saves repository snapshots through the current persistence store', () => {
    const store = createMemoryStore()
    const initial = createDefaultWhiteLabelSettings()
    initial.branding.appName = 'Initial Tenant'
    initial.releases.activeEnvironment = 'staging'

    saveCmsWhiteLabelSettings(initial, { store })

    const contentSnapshot = loadCmsContentRepositorySnapshot({ store })
    const initialAssetSnapshot = loadCmsAssetRepositorySnapshot({ store })
    expect(contentSnapshot.branding.appName).toBe('Initial Tenant')
    contentSnapshot.branding.appName = 'Content Repo Tenant'
    contentSnapshot.governance.workflow.status = 'in_review'
    saveCmsContentRepositorySnapshot(contentSnapshot, { store })

    let loaded = loadCmsWhiteLabelSettings({ store })
    expect(loaded.branding.appName).toBe('Content Repo Tenant')
    expect(loaded.governance.workflow.status).toBe('in_review')
    expect(createCmsAssetRepositorySnapshot(loaded)).toEqual(initialAssetSnapshot)
    expect(loaded.releases.activeEnvironment).toBe('staging')

    const assetSnapshot = loadCmsAssetRepositorySnapshot({ store })
    if (assetSnapshot.mediaAssets[0]) {
      assetSnapshot.mediaAssets[0] = {
        ...assetSnapshot.mediaAssets[0],
        name: 'Asset Repo Replacement',
        alt: 'Updated asset alt',
      }
    } else {
      assetSnapshot.mediaAssets = [
        {
          id: 'asset-provider-replacement',
          name: 'Asset Repo Replacement',
          description: 'Provider-managed test asset',
          kind: 'image',
          url: '/provider-replacement.png',
          alt: 'Updated asset alt',
          focalPoint: null,
          replaceTargetAssetId: null,
          tags: ['provider-test'],
          usage: [],
        },
      ]
    }
    saveCmsAssetRepositorySnapshot(assetSnapshot, { store })

    loaded = loadCmsWhiteLabelSettings({ store })
    expect(loaded.mediaAssets.some(asset => asset.name === 'Asset Repo Replacement')).toBe(true)
    expect(loaded.branding.appName).toBe('Content Repo Tenant')
    expect(loaded.releases.activeEnvironment).toBe('staging')

    const releaseSnapshot = loadCmsReleaseRepositorySnapshot({ store })
    const assetSnapshotAfterAssetSave = createCmsAssetRepositorySnapshot(loaded)
    expect(releaseSnapshot.releases.activeEnvironment).toBe('staging')
    releaseSnapshot.releases.activeEnvironment = 'production'
    saveCmsReleaseRepositorySnapshot(releaseSnapshot, { store })

    loaded = loadCmsWhiteLabelSettings({ store })
    expect(loaded.releases.activeEnvironment).toBe('production')
    expect(loaded.branding.appName).toBe('Content Repo Tenant')
    expect(createCmsAssetRepositorySnapshot(loaded)).toEqual(assetSnapshotAfterAssetSave)
  })

  it('creates focused repository snapshots from the aggregate settings object', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.appName = 'Focused Tenant'
    if (settings.mediaAssets[0]) {
      settings.mediaAssets[0].name = 'Focused Asset'
    }
    settings.releases.activeEnvironment = 'production'

    const contentSnapshot = createCmsContentRepositorySnapshot(settings)
    const assetSnapshot = createCmsAssetRepositorySnapshot(settings)
    const releaseSnapshot = createCmsReleaseRepositorySnapshot(settings)

    expect('mediaAssets' in contentSnapshot).toBe(false)
    expect('releases' in contentSnapshot).toBe(false)
    expect(assetSnapshot.mediaAssets[0]?.name).toBe('Focused Asset')
    expect(releaseSnapshot.releases.activeEnvironment).toBe('production')
  })
})