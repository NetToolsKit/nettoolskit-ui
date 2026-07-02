/**
 * useTheme brightness rule, dark side — the real catalog only ships light
 * backgrounds, so the dark-theme derivations (text-inverse/footer/overlay)
 * are provable only against a mocked catalog entry. The brightness contract
 * itself (perceived luminance < 128 -> dark) is the unit under test.
 */

import { describe, expect, it, vi } from 'vitest'

describe('useTheme dark-background derivations', () => {
  it('derives inverse/footer colors from a dark background theme', async () => {
    vi.resetModules()
    const dark = {
      name: 'noite',
      identity: { name: 'noite', displayName: 'Noite' },
      colors: {
        primary: '#8b73f2', primaryDark: '#5b4bc0', primaryLight: '#b3a5f7',
        secondary: '#3ec5e6', accent: '#3ec5e6',
        background: '#0a0f1c', backgroundLight: '#121a2b',
        text: '#eef2f8', textLight: '#9aa6b8', textMuted: '#7a8699',
        border: '#293549',
        success: '#3ecf7f', warning: '#f0a93b', error: '#f4736f', info: '#3ec5e6',
      },
      gradients: { hero: 'g1', primary: 'g2', loading: 'g3' },
      fonts: { display: 'D', body: 'B' },
      logo: { mark: 'N' },
    }
    vi.doMock('../../../src/config/theme/theme.config', () => ({
      themes: { noite: dark },
      defaultTheme: dark,
    }))

    const { useTheme } = await import('../../../src/composables/ui/useTheme')
    const { setTheme } = useTheme()
    setTheme('noite' as never)

    const style = document.documentElement.style
    // Dark background -> inverse text is the theme text, footer keeps the
    // dark background instead of primaryDark.
    expect(style.getPropertyValue('--ntk-text-inverse')).toBe('#eef2f8')
    expect(style.getPropertyValue('--ntk-footer-bg')).toBe('#0a0f1c')
    expect(style.getPropertyValue('--ntk-footer-text')).toBe('#eef2f8')

    vi.doUnmock('../../../src/config/theme/theme.config')
    vi.resetModules()
  })

  it('treats a non-hex background as light (fallback parsing)', async () => {
    vi.resetModules()
    const weird = {
      name: 'estranho',
      identity: { name: 'estranho' },
      colors: {
        primary: '#111111', primaryDark: '#000000', primaryLight: '#222222',
        secondary: '#333333', accent: '#444444',
        background: 'linear-gradient(#fff,#eee)', backgroundLight: '#fafafa',
        text: '#101010', textLight: '#606060', textMuted: '#909090',
        border: '#dddddd',
        success: '#0f0', warning: '#ff0', error: '#f00', info: '#0ff',
      },
      gradients: { hero: 'g', primary: 'g', loading: 'g' },
      fonts: { display: 'D', body: 'B' },
      logo: { mark: 'E' },
    }
    vi.doMock('../../../src/config/theme/theme.config', () => ({
      themes: { estranho: weird },
      defaultTheme: weird,
    }))

    const { useTheme } = await import('../../../src/composables/ui/useTheme')
    useTheme().setTheme('estranho' as never)

    // Fallback RGB (255,255,255) -> light theme -> inverse = background string.
    expect(document.documentElement.style.getPropertyValue('--ntk-text-inverse'))
      .toBe('linear-gradient(#fff,#eee)')

    vi.doUnmock('../../../src/config/theme/theme.config')
    vi.resetModules()
  })
})

describe('useBranding empty-catalog fallbacks (mocked content)', () => {
  it('degrades contact/social to empty structures when the catalog omits them', async () => {
    vi.resetModules()
    vi.doUnmock('@/composables/ui/useBranding')
    vi.doUnmock('../../../src/composables/ui/useBranding')
    vi.doMock('../../../src/config/brand/content.config', () => ({
      getContent: () => ({}),
    }))
    vi.doMock('../../../src/config/brand/navigation.config', () => ({
      getNavigation: () => ({ header: [] }),
    }))

    const { useBranding } = await import('../../../src/composables/ui/useBranding')
    const branding = useBranding()

    expect(branding.contact.value).toEqual({})
    expect(branding.social.value).toEqual({})

    vi.doUnmock('../../../src/config/brand/content.config')
    vi.doUnmock('../../../src/config/brand/navigation.config')
    vi.resetModules()
  })
})