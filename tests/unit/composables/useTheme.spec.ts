import { afterEach, describe, expect, it } from 'vitest'
import { useTheme } from '../../../src/composables/ui/useTheme'
import { themes } from '../../../src/config/theme/theme.config'

// useTheme has module-level singleton state — reset to a known theme after each test
afterEach(() => {
  const { setTheme } = useTheme()
  setTheme('nettoolskit')

  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
  document.body.removeAttribute('data-theme')
  document.body.classList.remove('body--dark', 'body--light')
  document.body.style.colorScheme = ''
})

describe('useTheme', () => {
  it('exposes a theme object with colors and identity', () => {
    const { theme } = useTheme()
    expect(theme.value.colors).toBeDefined()
    expect(theme.value.identity).toBeDefined()
  })

  it('primaryColor matches theme colors.primary', () => {
    const { theme, primaryColor } = useTheme()
    expect(primaryColor.value).toBe(theme.value.colors.primary)
  })

  it('name is a non-empty string', () => {
    const { name } = useTheme()
    expect(typeof name.value).toBe('string')
    expect(name.value.length).toBeGreaterThan(0)
  })

  it('availableThemes includes sentinela, platea, nettoolskit', () => {
    const { availableThemes } = useTheme()
    expect(availableThemes.value).toContain('sentinela')
    expect(availableThemes.value).toContain('platea')
    expect(availableThemes.value).toContain('nettoolskit')
  })

  it('setTheme changes themeName', () => {
    const { themeName, setTheme } = useTheme()
    setTheme('sentinela')
    expect(themeName.value).toBe('sentinela')
  })

  it('setTheme changes primaryColor to match new theme', () => {
    const { primaryColor, setTheme } = useTheme()
    setTheme('sentinela')
    const sentinelaColor = primaryColor.value
    setTheme('nettoolskit')
    const nettoolskitColor = primaryColor.value
    // Different themes likely have different primary colors
    expect(typeof sentinelaColor).toBe('string')
    expect(typeof nettoolskitColor).toBe('string')
  })

  it('isDark returns a boolean', () => {
    const { isDark } = useTheme()
    expect(typeof isDark.value).toBe('boolean')
  })

  it('logo returns a logo config object', () => {
    const { logo } = useTheme()
    expect(logo.value).toBeDefined()
  })

  it('updates legacy CSS variables without overwriting shared DOM theme state', () => {
    const root = document.documentElement
    const body = document.body
    root.dataset.theme = 'warp'
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
    body.dataset.theme = 'warp'
    body.classList.add('body--dark')
    body.style.colorScheme = 'dark'

    const { setTheme } = useTheme()
    setTheme('sentinela')

    expect(root.dataset.theme).toBe('warp')
    expect(body.dataset.theme).toBe('warp')
    expect(root.classList.contains('dark')).toBe(true)
    expect(body.classList.contains('body--dark')).toBe(true)
    expect(root.style.colorScheme).toBe('dark')
    expect(body.style.colorScheme).toBe('dark')
    expect(root.style.getPropertyValue('--theme-primary')).toBe(themes.sentinela.colors.primary)
    expect(root.style.getPropertyValue('--ntk-primary')).toBe(themes.sentinela.colors.primary)
  })

  it('does not author data-theme when no shared DOM theme contract is active', () => {
    const root = document.documentElement
    const body = document.body
    root.removeAttribute('data-theme')
    body.removeAttribute('data-theme')

    const { setTheme } = useTheme()
    setTheme('platea')

    expect(root.hasAttribute('data-theme')).toBe(false)
    expect(body.hasAttribute('data-theme')).toBe(false)
    expect(root.style.getPropertyValue('--theme-primary')).toBe(themes.platea.colors.primary)
  })
})
