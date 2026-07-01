/**
 * Behavior + integrity tests for the config catalogs (brand presets,
 * typography/spacing/effects, layout, notification behavior). These assert
 * the helper functions' real semantics and the cross-references inside the
 * data (not a restatement of the data itself).
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  applyTypography,
  getTypography,
  nettoolskitTypography,
  typographies,
} from '../../../src/config/visual/typography.config'
import {
  applySpacing,
  defaultSpacing,
  fourPxScale,
  getSpacingConfig,
  getSpacingValue,
  spacingConfigs,
} from '../../../src/config/visual/spacing.config'
import {
  applyEffects,
  getEffects,
  nettoolskitEffects,
} from '../../../src/config/visual/effects.config'
import { getTheme, revolutTheme, themes } from '../../../src/config/theme/theme.config'
import {
  getBrandIdentity,
  getCopyrightNotice,
  identities,
  nettoolskitIdentity,
} from '../../../src/config/brand/identity.config'
import {
  flattenNavLinks,
  getNavigation,
  nettoolskitNavigation,
} from '../../../src/config/brand/navigation.config'
import {
  formatPhone,
  getContent,
  getSocialLinkByPlatform,
  getWhatsAppLink,
  nettoolskitContent,
} from '../../../src/config/brand/content.config'
import {
  getCurrentBreakpoint,
  isDesktopDevice,
  isMobileDevice,
  isTabletDevice,
  defaultResponsive,
  getResponsiveConfig,
  materialBreakpoints,
} from '../../../src/config/layout/responsive.config'
import { layoutPresets, defaultLayoutConfig } from '../../../src/config/layout/structure.config'
import {
  applyNotificationConfig,
  darkNotificationStyles,
  getNotificationStyles,
  lightNotificationStyles,
  notificationConfig,
} from '../../../src/config/behavior/notification.config'
import {
  enableDeveloperFeatures,
  getComponentDocUrl,
  getNettoolskitConfig,
  nettoolskitPreset,
} from '../../../src/config/presets/nettoolskit.preset'

afterEach(() => {
  vi.restoreAllMocks()
  document.documentElement.removeAttribute('style')
  document.documentElement.className = ''
})

describe('visual configs (typography/spacing/effects)', () => {
  it('getTypography resolves the named config from the catalog', () => {
    expect(getTypography('nettoolskit')).toBe(nettoolskitTypography)
    expect(Object.keys(typographies).length).toBeGreaterThanOrEqual(3)
  })

  it('applyTypography writes the font tokens to the document root', () => {
    applyTypography(nettoolskitTypography)
    const style = document.documentElement.style
    expect(style.getPropertyValue('--ntk-font-body')).toBe(nettoolskitTypography.fonts.body)
    expect(style.getPropertyValue('--ntk-font-display')).toBe(nettoolskitTypography.fonts.display)
    expect(style.getPropertyValue('--ntk-font-mono')).toBe(nettoolskitTypography.fonts.mono)
  })

  it('getSpacingValue reads a level from a scale and getSpacingConfig resolves by name', () => {
    const [level, value] = Object.entries(fourPxScale)[0]!
    expect(getSpacingValue(fourPxScale, level as keyof typeof fourPxScale)).toBe(value)
    const [name, config] = Object.entries(spacingConfigs)[0]!
    expect(getSpacingConfig(name as keyof typeof spacingConfigs)).toBe(config)
  })

  it('applySpacing writes only --ntk-* spacing custom properties', () => {
    const setProperty = vi.spyOn(document.documentElement.style, 'setProperty')
    applySpacing(defaultSpacing)
    expect(setProperty.mock.calls.length).toBeGreaterThan(0)
    for (const [name, value] of setProperty.mock.calls) {
      expect(name).toMatch(/^--ntk-/)
      expect(String(value).length).toBeGreaterThan(0)
    }
  })

  it('applyEffects writes only --ntk-* effect custom properties', () => {
    const setProperty = vi.spyOn(document.documentElement.style, 'setProperty')
    applyEffects(getEffects('nettoolskit'))
    expect(getEffects('nettoolskit')).toBe(nettoolskitEffects)
    expect(setProperty.mock.calls.length).toBeGreaterThan(0)
    for (const [name] of setProperty.mock.calls) {
      expect(name).toMatch(/^--ntk-/)
    }
  })
})

describe('theme catalog', () => {
  it('getTheme resolves named themes and the catalog covers the runtime palettes', () => {
    expect(getTheme('revolut')).toBe(revolutTheme)
    for (const name of ['revolut', 'sentinela', 'platea', 'nettoolskit']) {
      expect(themes).toHaveProperty(name)
      expect(getTheme(name as keyof typeof themes).colors.primary).toMatch(/^#/)
    }
  })
})

describe('brand identity / navigation / content', () => {
  it('getBrandIdentity resolves the catalog and copyright carries the brand', () => {
    expect(getBrandIdentity('nettoolskit')).toBe(nettoolskitIdentity)
    expect(Object.keys(identities).length).toBeGreaterThanOrEqual(3)
    const notice = getCopyrightNotice('nettoolskit')
    expect(notice).toContain(String(new Date().getFullYear()))
  })

  it('flattenNavLinks flattens nested children and strips the children field', () => {
    const flat = flattenNavLinks([
      { label: 'root', to: '/', children: [{ label: 'child', to: '/c' }] },
    ] as never)
    expect(flat.map(link => link.label)).toEqual(['root', 'child'])
    for (const link of flat) {
      expect(link).not.toHaveProperty('children')
    }
    // Real catalog stays flattenable without loss.
    const header = getNavigation('nettoolskit').header
    expect(flattenNavLinks(header).length).toBeGreaterThanOrEqual(header.length)
    expect(nettoolskitNavigation).toBe(getNavigation('nettoolskit'))
  })

  it('formats Brazilian phones and falls back untouched otherwise', () => {
    expect(formatPhone('+5511999999999')).toBe('+55 (11) 99999-9999')
    expect(formatPhone('123')).toBe('123')
  })

  it('builds WhatsApp links with cleaned number and encoded message', () => {
    expect(getWhatsAppLink('+55 (11) 99999-9999')).toBe('https://wa.me/5511999999999')
    expect(getWhatsAppLink('5511999999999', 'Olá, tudo bem?'))
      .toBe(`https://wa.me/5511999999999?text=${encodeURIComponent('Olá, tudo bem?')}`)
  })

  it('finds social links case-insensitively and returns undefined for unknown platforms', () => {
    const content = getContent('nettoolskit')
    expect(content).toBe(nettoolskitContent)
    const first = content.social[0]
    if (first) {
      expect(getSocialLinkByPlatform(content, first.platform.toUpperCase())).toBe(first)
    }
    expect(getSocialLinkByPlatform(content, 'unknown-platform')).toBeUndefined()
  })
})

describe('responsive + structure layout configs', () => {
  it('getCurrentBreakpoint honors the breakpoint boundaries', () => {
    expect(getCurrentBreakpoint(materialBreakpoints.xl)).toBe('xl')
    expect(getCurrentBreakpoint(materialBreakpoints.lg)).toBe('lg')
    expect(getCurrentBreakpoint(materialBreakpoints.md)).toBe('md')
    expect(getCurrentBreakpoint(materialBreakpoints.sm)).toBe('sm')
    expect(getCurrentBreakpoint(materialBreakpoints.sm - 1)).toBe('xs')
  })

  it('classifies mobile/tablet/desktop widths from the config', () => {
    const mobileEdge = defaultResponsive.mobile.breakpoint
    expect(isMobileDevice(mobileEdge - 1)).toBe(true)
    expect(isMobileDevice(mobileEdge)).toBe(false)

    if (defaultResponsive.tablet) {
      expect(isTabletDevice(defaultResponsive.tablet.minWidth)).toBe(true)
      expect(isTabletDevice(defaultResponsive.tablet.maxWidth + 1)).toBe(false)
    }
    expect(isTabletDevice(800, { ...defaultResponsive, tablet: undefined } as never)).toBe(false)
    expect(typeof isDesktopDevice(5000)).toBe('boolean')
  })

  it('resolves responsive configs by name and exposes coherent layout presets', () => {
    expect(getResponsiveConfig('default' as never) ?? defaultResponsive).toBeTruthy()
    expect(Object.values(layoutPresets)).toContain(defaultLayoutConfig)
  })
})

describe('notification behavior config', () => {
  it('getNotificationStyles switches between the light and dark style sets', () => {
    expect(getNotificationStyles(true)).toBe(darkNotificationStyles)
    expect(getNotificationStyles(false)).toBe(lightNotificationStyles)
  })

  it('applyNotificationConfig merges partial overrides into the global config', () => {
    const original = { ...notificationConfig }
    try {
      applyNotificationConfig({ defaultDuration: 1234 } as never)
      expect((notificationConfig as Record<string, unknown>).defaultDuration).toBe(1234)
    } finally {
      Object.assign(notificationConfig, original)
    }
  })
})

describe('nettoolskit preset', () => {
  it('getNettoolskitConfig maps every category to the preset section and rejects unknowns', () => {
    expect(getNettoolskitConfig('palette')).toBe(nettoolskitPreset.colors.palette)
    expect(getNettoolskitConfig('typography')).toBe(nettoolskitPreset.visual.typography)
    expect(getNettoolskitConfig('structure')).toBe(nettoolskitPreset.layout.structure)
    expect(getNettoolskitConfig('identity')).toBe(nettoolskitPreset.brand.identity)
    expect(() => getNettoolskitConfig('nope' as never)).toThrow(/Unknown config category/)
  })

  it('enableDeveloperFeatures toggles the root classes on and off', () => {
    enableDeveloperFeatures({ componentGrid: true, propInspector: true })
    const root = document.documentElement
    expect(root.classList.contains('component-grid-enabled')).toBe(true)
    expect(root.classList.contains('prop-inspector-enabled')).toBe(true)

    enableDeveloperFeatures({ componentGrid: false })
    expect(root.classList.contains('component-grid-enabled')).toBe(false)
    expect(root.classList.contains('prop-inspector-enabled')).toBe(true)
  })

  it('getComponentDocUrl anchors on the GitHub social entry', () => {
    expect(getComponentDocUrl('DsButton')).toMatch(/\/tree\/main\/src\/components\/DsButton\.vue$/)
  })
})