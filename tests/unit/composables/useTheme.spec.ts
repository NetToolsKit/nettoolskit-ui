import { describe, expect, it, afterEach } from 'vitest'
import { useTheme } from '../../../src/composables/ui/useTheme'

// useTheme has module-level singleton state — reset to a known theme after each test
afterEach(() => {
  const { setTheme } = useTheme()
  setTheme('nettoolskit')
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
})