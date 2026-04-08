/**
 * Tests/unit/modules/cms/Tenant Profiles Storage spec module.
 */

import { beforeEach, describe, expect, it } from 'vitest'
import {
  CMS_DEFAULT_TENANT_PROFILE_ID,
  CMS_TENANT_PROFILES_STORAGE_KEY,
  CMS_TENANT_PROFILES_SCHEMA_VERSION,
  createTenantProfileId,
  loadCmsTenantProfilesState,
  removeCmsTenantProfile,
  saveCmsTenantProfilesState,
  upsertCmsTenantProfile,
} from '../../../../src/modules/cms/white-label/tenant-profiles.storage'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import { saveCmsWhiteLabelSettings } from '../../../../src/modules/cms/white-label/storage'
import { applyWhiteLabelWorkflowAction } from '../../../../src/modules/cms/white-label/workflow'
import type { CmsPersistenceStore } from '../../../../src/modules/cms/white-label/providers'

/**
 * Handles install memory local storage.
 */
function installMemoryLocalStorage(): void {
  const storage = new Map<string, string>()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, String(value))
      },
      removeItem: (key: string) => {
        storage.delete(key)
      },
    },
  })
}

/**
 * Creates an isolated in-memory persistence store for provider contract tests.
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

describe('tenant-profiles.storage', () => {
  beforeEach(() => {
    installMemoryLocalStorage()
    window.localStorage.removeItem(CMS_TENANT_PROFILES_STORAGE_KEY)
  })

  it('creates unique profile ids based on slugified name', () => {
    const profileId = createTenantProfileId('Default Tenant', ['default-tenant', 'default-tenant-2'])
    expect(profileId).toBe('default-tenant-3')
  })

  it('loads fallback state with one default tenant when storage is empty', () => {
    const state = loadCmsTenantProfilesState()

    expect(state.profiles.length).toBeGreaterThanOrEqual(1)
    expect(state.profiles[0]?.id).toBe(CMS_DEFAULT_TENANT_PROFILE_ID)
    expect(state.activeProfileId).toBe(state.profiles[0]?.id)
  })

  it('upserts and removes profiles keeping a valid active profile', () => {
    const baseState = loadCmsTenantProfilesState()
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.appName = 'Tenant B'

    const withTenant = upsertCmsTenantProfile(baseState, {
      id: 'tenant-b',
      name: 'Tenant B',
      settings,
    })

    expect(withTenant.profiles.some(profile => profile.id === 'tenant-b')).toBe(true)
    expect(withTenant.activeProfileId).toBe('tenant-b')

    const removed = removeCmsTenantProfile(withTenant, 'tenant-b')
    expect(removed.profiles.some(profile => profile.id === 'tenant-b')).toBe(false)
    expect(removed.profiles.length).toBeGreaterThanOrEqual(1)
    expect(removed.profiles.some(profile => profile.id === removed.activeProfileId)).toBe(true)
  })

  it('normalizes duplicated ids when saving and loading from storage', () => {
    const settings = createDefaultWhiteLabelSettings()
    const duplicatedState = {
      activeProfileId: 'alpha',
      profiles: [
        {
          id: 'alpha',
          name: 'Alpha',
          settings,
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'alpha',
          name: 'Alpha Copy',
          settings,
          updatedAt: new Date().toISOString(),
        },
      ],
    }

    saveCmsTenantProfilesState(duplicatedState)
    const loaded = loadCmsTenantProfilesState()
    const profileIds = loaded.profiles.map(profile => profile.id)

    expect(new Set(profileIds).size).toBe(profileIds.length)
    expect(loaded.profiles.length).toBe(2)
    expect(loaded.profiles.some(profile => profile.id === loaded.activeProfileId)).toBe(true)
  })

  it('persists schema version and rejects unsupported future payload versions', () => {
    const baseState = loadCmsTenantProfilesState()
    saveCmsTenantProfilesState(baseState)

    const persisted = JSON.parse(window.localStorage.getItem(CMS_TENANT_PROFILES_STORAGE_KEY) ?? '{}') as Record<string, unknown>
    expect(persisted.version).toBe(CMS_TENANT_PROFILES_SCHEMA_VERSION)

    window.localStorage.setItem(CMS_TENANT_PROFILES_STORAGE_KEY, JSON.stringify({
      version: CMS_TENANT_PROFILES_SCHEMA_VERSION + 10,
      activeProfileId: 'future',
      profiles: [],
    }))

    const loaded = loadCmsTenantProfilesState()
    expect(loaded.profiles.length).toBeGreaterThanOrEqual(1)
    expect(loaded.profiles[0]?.id).toBe(CMS_DEFAULT_TENANT_PROFILE_ID)
  })

  it('supports isolated provider contracts for settings fallback and tenant collections', () => {
    const settingsStore = createMemoryStore()
    const profilesStore = createMemoryStore()
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.appName = 'Provider Workspace'

    saveCmsWhiteLabelSettings(settings, { store: settingsStore })
    const fallbackState = loadCmsTenantProfilesState({ profilesStore, settingsStore })

    expect(fallbackState.profiles[0]?.settings.branding.appName).toBe('Provider Workspace')

    saveCmsTenantProfilesState(fallbackState, { profilesStore, settingsStore })
    const reloaded = loadCmsTenantProfilesState({ profilesStore, settingsStore })

    expect(reloaded.profiles[0]?.settings.branding.appName).toBe('Provider Workspace')
    expect(window.localStorage.getItem(CMS_TENANT_PROFILES_STORAGE_KEY)).toBeNull()
  })

  it('keeps tenant settings isolated and preserves rollback history per profile', () => {
    const baseState = loadCmsTenantProfilesState()
    const tenantASettings = createDefaultWhiteLabelSettings()
    const tenantBSettings = createDefaultWhiteLabelSettings()

    tenantASettings.branding.appName = 'Tenant A'
    tenantBSettings.branding.appName = 'Tenant B'
    tenantASettings.governance = applyWhiteLabelWorkflowAction(tenantASettings.governance, 'save_draft', { id: 'editor-a', role: 'editor' })
    tenantASettings.governance = applyWhiteLabelWorkflowAction(tenantASettings.governance, 'submit_review', { id: 'editor-a', role: 'editor' })
    tenantASettings.governance = applyWhiteLabelWorkflowAction(tenantASettings.governance, 'approve', { id: 'reviewer-a', role: 'reviewer' })
    tenantASettings.governance = applyWhiteLabelWorkflowAction(tenantASettings.governance, 'publish', { id: 'admin-a', role: 'admin' })
    tenantASettings.governance = applyWhiteLabelWorkflowAction(tenantASettings.governance, 'rollback', { id: 'owner-a', role: 'owner' })

    let state = upsertCmsTenantProfile(baseState, {
      id: 'tenant-a',
      name: 'Tenant A',
      settings: tenantASettings,
    })
    state = upsertCmsTenantProfile(state, {
      id: 'tenant-b',
      name: 'Tenant B',
      settings: tenantBSettings,
    })
    saveCmsTenantProfilesState(state)

    const loaded = loadCmsTenantProfilesState()
    const loadedTenantA = loaded.profiles.find(profile => profile.id === 'tenant-a')
    const loadedTenantB = loaded.profiles.find(profile => profile.id === 'tenant-b')

    expect(loadedTenantA?.settings.branding.appName).toBe('Tenant A')
    expect(loadedTenantB?.settings.branding.appName).toBe('Tenant B')
    expect(loadedTenantA?.settings.governance.workflow.status).toBe('draft')
    expect(loadedTenantA?.settings.governance.workflow.version).toBeGreaterThan(loadedTenantB?.settings.governance.workflow.version ?? 0)
    expect(loadedTenantB?.settings.governance.workflow.status).toBe('draft')
  })
})