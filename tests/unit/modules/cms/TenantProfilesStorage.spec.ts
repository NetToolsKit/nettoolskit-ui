/**
 * Tests/unit/modules/cms/Tenant Profiles Storage spec module.
 */

import { beforeEach, describe, expect, it } from 'vitest'
import {
  CMS_DEFAULT_TENANT_PROFILE_ID,
  CMS_TENANT_PROFILES_STORAGE_KEY,
  createTenantProfileId,
  loadCmsTenantProfilesState,
  removeCmsTenantProfile,
  saveCmsTenantProfilesState,
  upsertCmsTenantProfile,
} from '../../../../landing-page/cms/tenant-profiles.storage'
import { createDefaultWhiteLabelSettings } from '../../../../landing-page/cms/white-label.config'

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
})