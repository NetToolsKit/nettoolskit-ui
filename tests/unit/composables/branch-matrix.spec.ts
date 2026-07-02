/**
 * Branch matrix for the stateful UI composables: color-scheme resolution
 * (system/explicit, storage validity, matchMedia presence), theme switcher
 * persistence, and the compat prop adapters' variant mappings.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  applyColorScheme,
  bootstrapColorScheme,
  COLOR_SCHEME_STORAGE_KEY,
  resolveColorScheme,
  setColorScheme,
  useColorScheme,
} from '../../../src/composables/ui/useColorScheme'
import {
  bootstrapThemeSwitcher,
  DEFAULT_THEME_ID,
  resetThemePreference,
  THEME_SWITCHER_STORAGE_KEY,
  useThemeSwitcher,
} from '../../../src/composables/useThemeSwitcher'

const installMatchMedia = (matches: boolean) => {
  const listeners = new Set<() => void>()
  const mql = {
    matches,
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  }
  vi.stubGlobal('matchMedia', vi.fn(() => mql))
  return { mql, fire: () => listeners.forEach(cb => cb()) }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  localStorage.removeItem(COLOR_SCHEME_STORAGE_KEY)
  localStorage.removeItem(THEME_SWITCHER_STORAGE_KEY)
  setColorScheme('system')
  resetThemePreference()
  document.documentElement.removeAttribute('data-color-scheme')
  document.body.classList.remove('body--dark')
})

describe('useColorScheme branch matrix', () => {
  it('resolves system mode from prefers-color-scheme in both directions', () => {
    installMatchMedia(true)
    expect(resolveColorScheme('system')).toBe('dark')

    installMatchMedia(false)
    expect(resolveColorScheme('system')).toBe('light')

    // Explicit modes ignore the media query entirely.
    expect(resolveColorScheme('dark')).toBe('dark')
    expect(resolveColorScheme('light')).toBe('light')
  })

  it('falls back to light when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(resolveColorScheme('system')).toBe('light')
  })

  it('applies explicit modes to the DOM and clears them for system', () => {
    installMatchMedia(false)
    applyColorScheme('dark')
    expect(document.documentElement.dataset.colorScheme).toBe('dark')
    expect(document.body.classList.contains('body--dark')).toBe(true)

    applyColorScheme('system')
    expect(document.documentElement.dataset.colorScheme).toBeUndefined()
    expect(document.body.classList.contains('body--dark')).toBe(false)
  })

  it('persists the mode, survives a storage failure, and bootstraps from storage', () => {
    installMatchMedia(false)
    setColorScheme('dark')
    expect(localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe('dark')

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => setColorScheme('light')).not.toThrow()
    setItem.mockRestore()

    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, 'not-a-mode')
    bootstrapColorScheme()
    const { mode } = useColorScheme()
    expect(mode.value).toBe('system')
  })

  it('toggle cycles explicit dark/light from the resolved value', () => {
    installMatchMedia(false)
    const scheme = useColorScheme()

    setColorScheme('light')
    scheme.toggle()
    expect(scheme.mode.value).toBe('dark')
    scheme.toggle()
    expect(scheme.mode.value).toBe('light')
    expect(scheme.availableModes).toContain('system')
  })

  it('re-resolves on a system change only while in system mode (fresh module)', async () => {
    // The media listener is a module-level singleton; a fresh module instance
    // makes the change-handler branch deterministically testable.
    vi.resetModules()
    const media = installMatchMedia(false)
    const fresh = await import('../../../src/composables/ui/useColorScheme')

    fresh.bootstrapColorScheme()
    fresh.setColorScheme('system')
    const scheme = fresh.useColorScheme()
    expect(scheme.resolved.value).toBe('light')

    ;(media.mql as { matches: boolean }).matches = true
    media.fire()
    expect(scheme.resolved.value).toBe('dark')

    // Explicit mode ignores further system changes.
    fresh.setColorScheme('light')
    ;(media.mql as { matches: boolean }).matches = false
    media.fire()
    expect(scheme.resolved.value).toBe('light')
    vi.resetModules()
  })
})

describe('useThemeSwitcher branch matrix', () => {
  it('setTheme applies the preset id to the DOM and persists it', () => {
    const { setTheme, activeTheme } = useThemeSwitcher()
    setTheme('claude')

    expect(activeTheme.value).toBe('claude')
    expect(document.documentElement.dataset.theme).toBe('claude')
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBe('claude')
  })

  it('resetThemePreference restores the default and clears storage', () => {
    const { setTheme } = useThemeSwitcher()
    setTheme('kraken')

    resetThemePreference()
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBeNull()
    expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME_ID)
  })

  it('bootstrapThemeSwitcher applies an explicit id and tolerates a missing rAF', () => {
    const raf = window.requestAnimationFrame
    // Branch: environment without requestAnimationFrame.
    ;(window as { requestAnimationFrame?: unknown }).requestAnimationFrame = undefined
    try {
      bootstrapThemeSwitcher('warp')
      expect(document.documentElement.dataset.theme).toBe('warp')
    } finally {
      window.requestAnimationFrame = raf
    }
  })
})