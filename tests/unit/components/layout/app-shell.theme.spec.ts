/**
 * Tests/unit/components/layout/app shell theme spec module.
 */

import { describe, expect, it } from 'vitest'
import { resolveAppShellTheme } from '@/components/layout/app-shell.theme'
import { APP_SHELL_DEFAULT_THEME } from '@/components/layout/app-shell.config'
import type { AppShellTheme } from '@/components/layout/app-shell.types'

const LANDING_COLOR_KEYS = [
  'landingAbsoluteWhite',
  'landingBrandPrimary',
  'landingBrandPrimaryDark',
  'landingBrandPrimaryLight',
  'landingBrandSecondary',
  'landingGray900',
  'landingGray800',
  'landingGray700',
  'landingGray600',
  'landingGray500',
  'landingGray400',
  'landingGray300',
  'landingGray200',
  'landingGray100',
  'landingGray50',
  'landingWhite',
  'landingSectionBgPrimary',
  'landingSectionBgSecondary',
  'landingSectionBgDark',
  'landingSectionBgPrimaryDark',
  'landingSectionBgSecondaryDark',
  'landingSectionBgDarkDark',
  'landingGhBgCanvas',
  'landingGhBgSubtle',
  'landingGhBgMuted',
  'landingGhBorderDefault',
  'landingGhFgDefault',
  'landingGhFgMuted',
  'landingGhFgSubtle',
  'landingGhAccent',
  'landingGhAccentEmphasis',
  'landingGhAccentHover',
  'landingGhAccentSubtle',
  'landingSharedDarkBg',
  'landingSharedDarkSurface',
  'landingSharedDarkSurfaceMuted',
  'landingSharedDarkBorder',
  'landingSharedDarkText',
  'landingSharedDarkTextMuted',
  'landingSharedDarkAccent',
  'landingCodeKeyword',
  'landingCodeString',
  'landingCodeComponent',
  'landingCodeProp',
  'landingCodeComment',
  'landingThemeGradientStart',
  'landingThemeGradientEnd',
  'landingHeroHighlight1',
  'landingHeroHighlight2',
  'landingHeroHighlight3',
  'landingHeroHighlight4',
  'landingHeroHighlight5',
  'landingBlack',
] satisfies Array<keyof AppShellTheme>

describe('app-shell.theme typography resolution', () => {
  it('uses base typography defaults when values are omitted', () => {
    const resolvedTheme = resolveAppShellTheme({}, APP_SHELL_DEFAULT_THEME)

    expect(resolvedTheme.fontFamily).toBe(APP_SHELL_DEFAULT_THEME.fontFamily)
    expect(resolvedTheme.fontFamilyDisplay).toBe(APP_SHELL_DEFAULT_THEME.fontFamilyDisplay)
    expect(resolvedTheme.fontSizeTitleApp).toBe(APP_SHELL_DEFAULT_THEME.fontSizeTitleApp)
    expect(resolvedTheme.fontWeightBold).toBe(APP_SHELL_DEFAULT_THEME.fontWeightBold)
    expect(resolvedTheme.fontSizeGroupCaption).toBe(APP_SHELL_DEFAULT_THEME.fontSizeGroupCaption)
    expect(resolvedTheme.menuSlotWidth).toBe(APP_SHELL_DEFAULT_THEME.menuSlotWidth)
    expect(resolvedTheme.searchControlHeight).toBe(APP_SHELL_DEFAULT_THEME.searchControlHeight)
    expect(resolvedTheme.brandLogoSize).toBe(APP_SHELL_DEFAULT_THEME.brandLogoSize)
    expect(resolvedTheme.itemIconSize).toBe(APP_SHELL_DEFAULT_THEME.itemIconSize)
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
        fontSizeGroupCaption: '0.75rem',
        menuSlotWidth: '34px',
        searchControlHeight: '40px',
        brandLogoSize: '38px',
        itemIconSize: '24px',
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
    expect(resolvedTheme.fontSizeGroupCaption).toBe('0.75rem')
    expect(resolvedTheme.menuSlotWidth).toBe('34px')
    expect(resolvedTheme.searchControlHeight).toBe('40px')
    expect(resolvedTheme.brandLogoSize).toBe('38px')
    expect(resolvedTheme.itemIconSize).toBe('24px')
    expect(resolvedTheme.radiusMd).toBe('12px')
    expect(resolvedTheme.spacingMd).toBe('1.2rem')
  })

  it('keeps search background independent from page background fallback', () => {
    const resolvedTheme = resolveAppShellTheme(
      {
        pageBackground: '#f4f1ec',
        searchBackground: '',
      },
      APP_SHELL_DEFAULT_THEME
    )

    expect(resolvedTheme.searchBackground).toBe(APP_SHELL_DEFAULT_THEME.searchBackground)
  })

  it('keeps header action hover independent from sidebar item hover fallback', () => {
    const resolvedTheme = resolveAppShellTheme(
      {
        itemHoverBackground: '#223344',
        actionBackground: '#111827',
        actionHoverBackground: '#991111',
      },
      APP_SHELL_DEFAULT_THEME
    )

    expect(resolvedTheme.itemHoverBackground).toBe('#223344')
    expect(resolvedTheme.actionBackground).toBe('#111827')
    expect(resolvedTheme.actionHoverBackground).toBe('#991111')
  })

  it('uses default header action hover token when override is missing', () => {
    const resolvedTheme = resolveAppShellTheme(
      {
        itemHoverBackground: '#223344',
        actionBackground: '',
        actionHoverBackground: '',
      },
      APP_SHELL_DEFAULT_THEME
    )

    expect(resolvedTheme.actionBackground).toBe(APP_SHELL_DEFAULT_THEME.actionBackground)
    expect(resolvedTheme.actionHoverBackground).toBe(APP_SHELL_DEFAULT_THEME.actionHoverBackground)
  })

  it('keeps actionHoverBackground independent from searchBackground fallback', () => {
    const resolvedTheme = resolveAppShellTheme(
      {
        searchBackground: '#aabbcc',
        actionHoverBackground: '',
      },
      APP_SHELL_DEFAULT_THEME
    )

    expect(resolvedTheme.searchBackground).toBe('#aabbcc')
    expect(resolvedTheme.actionHoverBackground).toBe(APP_SHELL_DEFAULT_THEME.actionHoverBackground)
    expect(resolvedTheme.actionHoverBackground).not.toBe('#aabbcc')
  })

  it('keeps landing color defaults white-labelable through runtime CSS variables', () => {
    for (const key of LANDING_COLOR_KEYS) {
      const value = APP_SHELL_DEFAULT_THEME[key]

      expect(typeof value, `${String(key)} must stay a string token for typed config consumers`).toBe('string')
      expect(value, `${String(key)} must be routed through an ntk landing token`).toContain('var(--ntk-landing-')
      expect(value, `${String(key)} must not be a fixed palette hex`).not.toMatch(/^#[\da-f]{3,8}$/i)
    }
  })
})
