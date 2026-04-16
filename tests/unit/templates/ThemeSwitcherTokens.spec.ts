import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ThemeDotsSwitcher from '../../../src/templates/navigation/ThemeDotsSwitcher.vue'
import {
  DEFAULT_THEME_ID,
  THEME_SWITCHER_STORAGE_KEY,
  resetThemePreference,
  themeOptions,
  useThemeSwitcher,
} from '../../../src/composables/useThemeSwitcher'

describe('theme switcher tokenization', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
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
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBe('claude')
  })

  it('resets the active theme to the default preset without keeping a stored preference', async () => {
    const { setTheme } = useThemeSwitcher()

    setTheme('kraken')
    await nextTick()
    expect(document.documentElement.dataset.theme).toBe('kraken')
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBe('kraken')

    resetThemePreference()
    await nextTick()

    expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME_ID)
    expect(localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)).toBeNull()
  })
})
