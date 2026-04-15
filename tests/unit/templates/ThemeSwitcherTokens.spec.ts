import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ThemeDotsSwitcher from '../../../src/templates/navigation/ThemeDotsSwitcher.vue'
import { themeOptions, useThemeSwitcher } from '../../../src/composables/useThemeSwitcher'

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
    expect(localStorage.getItem('ntk-theme')).toBe('claude')
  })
})
