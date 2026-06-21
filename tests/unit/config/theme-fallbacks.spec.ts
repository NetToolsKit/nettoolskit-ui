import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  applyThemeColors,
  darkThemeColors,
  lightThemeColors,
} from '../../../src/config/colors/theme-mode.config'
import { defaultTheme, getTheme, themes } from '../../../src/config/theme/theme.config'

vi.mock('quasar', () => ({
  Dark: {
    set: vi.fn(),
  },
}))

describe('theme fallback configuration', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.className = ''
    document.body.removeAttribute('style')
    document.body.removeAttribute('data-theme')
    document.body.className = ''
  })

  it('defaults the legacy theme registry to the Revolut preset baseline', () => {
    expect(defaultTheme.name).toBe('revolut')
    expect(themes.revolut).toBe(defaultTheme)
    expect(getTheme('revolut')).toBe(defaultTheme)
    expect(defaultTheme.colors.primary).toBe('#0f766e')
    expect(defaultTheme.colors.secondary).toBe('#0f766e')
    expect(defaultTheme.colors.info).toBe('#14b8a6')
  })

  it('uses Revolut token values for light and dark theme-mode fallbacks', () => {
    expect(lightThemeColors.primary).toBe('#0f766e')
    expect(lightThemeColors.secondary).toBe('#0f766e')
    expect(lightThemeColors.borderFocus).toBe('#0f766e')
    expect(darkThemeColors.primary).toBe('#14b8a6')
    expect(darkThemeColors.secondary).toBe('#14b8a6')
    expect(darkThemeColors.borderFocus).toBe('#14b8a6')
  })

  it('applies secondary fallback tokens with legacy applyThemeColors', () => {
    applyThemeColors('light')

    const rootStyle = document.documentElement.style
    expect(rootStyle.getPropertyValue('--ntk-primary')).toBe('#0f766e')
    expect(rootStyle.getPropertyValue('--ntk-secondary')).toBe('#0f766e')
    expect(rootStyle.getPropertyValue('--ntk-secondary-dark')).toBe('#115e59')
    expect(rootStyle.getPropertyValue('--ntk-secondary-light')).toBe('#2dd4bf')
  })
})
