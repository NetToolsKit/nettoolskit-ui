import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ThemeDotsSwitcher from '../../../src/templates/navigation/ThemeDotsSwitcher.vue'
import {
  DEFAULT_THEME_ID,
  THEME_SWITCHER_STORAGE_KEY,
  bootstrapThemeSwitcher,
  resetThemePreference,
  themeOptions,
  useThemeSwitcher,
} from '../../../src/composables/useThemeSwitcher'

describe('theme switcher tokenization', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.body.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('body--dark', 'body--light')
    document.documentElement.style.cssText = ''
    document.body.style.cssText = ''
    const { setTheme } = useThemeSwitcher()
    setTheme('revolut')
  })

  it('exposes theme preview swatches through CSS variable references', () => {
    expect(themeOptions.length).toBeGreaterThan(0)
    expect(themeOptions.every(option => option.color.includes('var('))).toBe(true)
  })

  it('renders one theme dot per option using token-driven backgrounds', () => {
    const wrapper = mount(ThemeDotsSwitcher)
    const dots = wrapper.findAll('button')

    expect(dots).toHaveLength(themeOptions.length)
    expect(
      dots.every(dot => {
        const style = dot.attributes('style') ?? ''
        return style.includes('var(')
      })
    ).toBe(true)
  })

  it('persists the active theme and updates the DOM dataset when a dot is clicked', async () => {
    const wrapper = mount(ThemeDotsSwitcher)
    const claudeIndex = themeOptions.findIndex(option => option.id === 'claude')

    expect(claudeIndex).toBeGreaterThanOrEqual(0)

    await wrapper.findAll('button')[claudeIndex]!.trigger('click')

    expect(document.documentElement.dataset.theme).toBe('claude')
    expect(document.body.dataset.theme).toBe('claude')
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBe('claude')
  })

  it('resets the active theme to the default preset without keeping a stored preference', async () => {
    const { setTheme } = useThemeSwitcher()

    setTheme('kraken')
    await nextTick()
    expect(document.documentElement.dataset.theme).toBe('kraken')
    expect(document.body.dataset.theme).toBe('kraken')
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBe('kraken')

    resetThemePreference()
    await nextTick()

    expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME_ID)
    expect(document.body.dataset.theme).toBe(DEFAULT_THEME_ID)
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBeNull()
  })

  it('applies structural dark mode classes for dark presets and restores light mode for light presets', async () => {
    const { setTheme } = useThemeSwitcher()

    for (const darkTheme of ['warp', 'resend'] as const) {
      document.documentElement.style.setProperty('--ntk-dark-scheme', '1')
      setTheme(darkTheme)
      await nextTick()

      expect(document.documentElement.dataset.theme).toBe(darkTheme)
      expect(document.body.dataset.theme).toBe(darkTheme)
      expect(document.documentElement.dataset.theme).not.toBe('dark')
      expect(document.body.dataset.theme).not.toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.style.colorScheme).toBe('dark')
      expect(document.body.classList.contains('body--dark')).toBe(true)
      expect(document.body.classList.contains('body--light')).toBe(false)
      expect(document.body.style.colorScheme).toBe('dark')
    }

    document.documentElement.style.setProperty('--ntk-dark-scheme', '0')
    setTheme('revolut')
    await nextTick()

    expect(document.documentElement.dataset.theme).toBe('revolut')
    expect(document.body.dataset.theme).toBe('revolut')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(document.body.classList.contains('body--dark')).toBe(false)
    expect(document.body.classList.contains('body--light')).toBe(true)
    expect(document.body.style.colorScheme).toBe('light')
  })

  it('keeps preset selection separate from the generic dark fallback selector model', async () => {
    const { setTheme } = useThemeSwitcher()

    document.documentElement.style.setProperty('--ntk-dark-scheme', '1')
    setTheme('warp')
    await nextTick()

    expect(document.documentElement.dataset.theme).toBe('warp')
    expect(document.body.dataset.theme).toBe('warp')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.body.classList.contains('body--dark')).toBe(true)

    document.documentElement.style.setProperty('--ntk-dark-scheme', '0')
    setTheme('claude')
    await nextTick()

    expect(document.documentElement.dataset.theme).toBe('claude')
    expect(document.body.dataset.theme).toBe('claude')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.body.classList.contains('body--light')).toBe(true)
  })

  it('does not apply a stored preset as a module-load side effect', async () => {
    vi.resetModules()
    localStorage.setItem(THEME_SWITCHER_STORAGE_KEY, 'warp')
    document.documentElement.removeAttribute('data-theme')
    document.body.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('body--dark', 'body--light')

    await import('../../../src/composables/useThemeSwitcher')

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    expect(document.body.hasAttribute('data-theme')).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.body.classList.contains('body--dark')).toBe(false)
  })

  it('applies the stored preset only through the explicit bootstrap entrypoint', async () => {
    vi.resetModules()
    localStorage.setItem(THEME_SWITCHER_STORAGE_KEY, 'warp')
    document.documentElement.removeAttribute('data-theme')
    document.body.removeAttribute('data-theme')
    document.documentElement.style.setProperty('--ntk-dark-scheme', '1')

    const { bootstrapThemeSwitcher } = await import('../../../src/composables/useThemeSwitcher')
    bootstrapThemeSwitcher()
    await nextTick()

    expect(document.documentElement.dataset.theme).toBe('warp')
    expect(document.body.dataset.theme).toBe('warp')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.body.classList.contains('body--dark')).toBe(true)
  })

  it('allows bootstrap to force a preset without writing a stored preference', async () => {
    localStorage.clear()

    bootstrapThemeSwitcher('claude')
    await nextTick()

    expect(document.documentElement.dataset.theme).toBe('claude')
    expect(document.body.dataset.theme).toBe('claude')
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBeNull()
  })

  it('keeps Quasar Dark wired through the central DOM theme sync and sample host', () => {
    const themeDomSource = readFileSync(resolve(process.cwd(), 'src/config/theme/theme-dom.ts'), 'utf8')
    const sampleHostSource = readFileSync(resolve(process.cwd(), 'samples/shared/mountSamplesHost.ts'), 'utf8')

    expect(themeDomSource).toContain("import { Dark } from 'quasar'")
    expect(themeDomSource).toContain('Dark.set(isDark)')
    expect(sampleHostSource).toContain('Dark,')
    expect(sampleHostSource).toContain('plugins: {\n      Dark,')
  })
})
