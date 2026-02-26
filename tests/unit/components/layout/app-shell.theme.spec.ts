import { describe, expect, it } from 'vitest'
import { resolveAppShellTheme } from '@/components/layout/app-shell.theme'
import { APP_SHELL_DEFAULT_THEME } from '@/components/layout/app-shell.config'

describe('app-shell.theme typography resolution', () => {
  it('uses base typography defaults when values are omitted', () => {
    const resolvedTheme = resolveAppShellTheme({}, APP_SHELL_DEFAULT_THEME)

    expect(resolvedTheme.fontFamily).toBe(APP_SHELL_DEFAULT_THEME.fontFamily)
    expect(resolvedTheme.fontFamilyDisplay).toBe(APP_SHELL_DEFAULT_THEME.fontFamilyDisplay)
    expect(resolvedTheme.fontSizeTitleApp).toBe(APP_SHELL_DEFAULT_THEME.fontSizeTitleApp)
    expect(resolvedTheme.fontWeightBold).toBe(APP_SHELL_DEFAULT_THEME.fontWeightBold)
    expect(resolvedTheme.radiusMd).toBe(APP_SHELL_DEFAULT_THEME.radiusMd)
    expect(resolvedTheme.spacingMd).toBe(APP_SHELL_DEFAULT_THEME.spacingMd)
  })

  it('respects explicit typography overrides', () => {
    const resolvedTheme = resolveAppShellTheme(
      {
        fontFamily: 'Inter, sans-serif',
        fontFamilyDisplay: '"IBM Plex Sans", sans-serif',
        fontSizeTitle: '1rem',
        fontSizeTitleApp: '1.3rem',
        fontWeightBold: '800',
        radiusMd: '12px',
        spacingMd: '1.2rem',
      },
      APP_SHELL_DEFAULT_THEME
    )

    expect(resolvedTheme.fontFamily).toBe('Inter, sans-serif')
    expect(resolvedTheme.fontFamilyDisplay).toBe('"IBM Plex Sans", sans-serif')
    expect(resolvedTheme.fontSizeTitle).toBe('1rem')
    expect(resolvedTheme.fontSizeTitleApp).toBe('1.3rem')
    expect(resolvedTheme.fontWeightBold).toBe('800')
    expect(resolvedTheme.radiusMd).toBe('12px')
    expect(resolvedTheme.spacingMd).toBe('1.2rem')
  })
})