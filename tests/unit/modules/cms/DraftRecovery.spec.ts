import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  clearCmsDraftRecoveryEntry,
  getCmsDraftRecoveryEntry,
  loadCmsDraftRecoveryState,
  resolveCmsDraftRecoveryCandidate,
  saveCmsDraftRecoverySnapshot,
} from '../../../../src/modules/cms/white-label/draft-recovery'

function createMemoryStore() {
  const map = new Map<string, string>()

  return {
    getItem(key: string) {
      return map.get(key) ?? null
    },
    setItem(key: string, value: string) {
      map.set(key, value)
    },
    removeItem(key: string) {
      map.delete(key)
    },
  }
}

describe('draft recovery helpers', () => {
  it('stores one latest recovery snapshot per tenant profile', () => {
    const store = createMemoryStore()
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.appName = 'Draft Recovery Tenant'

    const result = saveCmsDraftRecoverySnapshot('tenant-a', settings, 'autosave', { store })

    expect(result.ok).toBe(true)
    expect(result.entry?.latest?.settings.branding.appName).toBe('Draft Recovery Tenant')
    expect(result.entry?.previous).toBeNull()

    const state = loadCmsDraftRecoveryState({ store })
    expect(getCmsDraftRecoveryEntry(state, 'tenant-a')?.latest?.settings.branding.appName).toBe('Draft Recovery Tenant')
  })

  it('rotates the previous snapshot when a distinct autosave arrives', () => {
    const store = createMemoryStore()
    const initialSettings = createDefaultWhiteLabelSettings()
    initialSettings.branding.appName = 'Initial Draft'
    saveCmsDraftRecoverySnapshot('tenant-a', initialSettings, 'autosave', { store })

    const nextSettings = createDefaultWhiteLabelSettings()
    nextSettings.branding.appName = 'Updated Draft'
    const result = saveCmsDraftRecoverySnapshot('tenant-a', nextSettings, 'checkpoint', { store })

    expect(result.entry?.latest?.settings.branding.appName).toBe('Updated Draft')
    expect(result.entry?.latest?.reason).toBe('checkpoint')
    expect(result.entry?.previous?.settings.branding.appName).toBe('Initial Draft')
  })

  it('prefers the previous snapshot when the latest autosave already matches the current settings', () => {
    const store = createMemoryStore()
    const initialSettings = createDefaultWhiteLabelSettings()
    initialSettings.branding.appName = 'Initial Draft'
    saveCmsDraftRecoverySnapshot('tenant-a', initialSettings, 'autosave', { store })

    const resetSettings = createDefaultWhiteLabelSettings()
    resetSettings.branding.appName = 'Reset Draft'
    saveCmsDraftRecoverySnapshot('tenant-a', resetSettings, 'autosave', { store })

    const state = loadCmsDraftRecoveryState({ store })
    const candidate = resolveCmsDraftRecoveryCandidate(
      getCmsDraftRecoveryEntry(state, 'tenant-a'),
      resetSettings
    )

    expect(candidate?.settings.branding.appName).toBe('Initial Draft')
  })

  it('clears one tenant recovery entry without affecting the rest of the store', () => {
    const store = createMemoryStore()
    saveCmsDraftRecoverySnapshot('tenant-a', createDefaultWhiteLabelSettings(), 'autosave', { store })
    saveCmsDraftRecoverySnapshot('tenant-b', createDefaultWhiteLabelSettings(), 'autosave', { store })

    const state = clearCmsDraftRecoveryEntry('tenant-a', { store })

    expect(getCmsDraftRecoveryEntry(state, 'tenant-a')).toBeNull()
    expect(getCmsDraftRecoveryEntry(state, 'tenant-b')).not.toBeNull()
  })
})