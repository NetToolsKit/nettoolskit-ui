// @vitest-environment node
/**
 * SSR-safety contract: the theme/scheme modules declare themselves safe to
 * import and call without a DOM. This suite runs in a plain node environment
 * (no jsdom), proving every `typeof window/document === 'undefined'` guard.
 */

import { describe, expect, it } from 'vitest'

import {
  applyColorScheme,
  resolveColorScheme,
  setColorScheme,
  bootstrapColorScheme,
} from '../../../src/composables/ui/useColorScheme'
import {
  bootstrapThemeSwitcher,
  resetThemePreference,
  useThemeSwitcher,
  DEFAULT_THEME_ID,
} from '../../../src/composables/useThemeSwitcher'
import { syncThemeDomState, registerThemeDarkSync } from '../../../src/config/theme/theme-dom'
import { useTheme } from '../../../src/composables/ui/useTheme'

describe('SSR guards (no DOM)', () => {
  it('color scheme resolves and applies without window/document', () => {
    expect(resolveColorScheme('system')).toBe('light') // no matchMedia -> light
    expect(applyColorScheme('dark')).toBe('dark') // returns resolved, touches nothing
    expect(() => setColorScheme('light')).not.toThrow()
    expect(() => bootstrapColorScheme()).not.toThrow()
  })

  it('theme switcher boots, persists and resets as no-ops', () => {
    const { activeTheme, setTheme } = useThemeSwitcher()
    expect(activeTheme.value).toBe(DEFAULT_THEME_ID) // storage read guarded

    expect(() => setTheme('claude')).not.toThrow()
    expect(activeTheme.value).toBe('claude')
    expect(() => bootstrapThemeSwitcher('warp')).not.toThrow()
    expect(() => resetThemePreference()).not.toThrow()
    expect(activeTheme.value).toBe(DEFAULT_THEME_ID)
  })

  it('theme DOM sync and legacy theme application early-return', () => {
    registerThemeDarkSync(() => {
      throw new Error('must not be called without a document')
    })
    expect(() => syncThemeDomState({ dark: true })).not.toThrow()
    registerThemeDarkSync(null)

    const { setTheme, themeName } = useTheme()
    expect(() => setTheme('sentinela')).not.toThrow()
    expect(themeName.value).toBe('sentinela')
    setTheme('nettoolskit')
  })
})