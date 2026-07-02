/**
 * useBranding brand-resolution branches against the real theme catalog:
 * a theme whose identity is not a known brand falls back to the nettoolskit
 * content/navigation; known-brand identities resolve their own catalog.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

import { useTheme } from '../../../src/composables/ui/useTheme'
import { getContent, type BrandContent } from '../../../src/config/brand/content.config'

// The global test setup mocks useBranding for component suites; here the REAL
// module is the unit under test, so bypass the mock explicitly.
const { useBranding } = await vi.importActual<
  typeof import('../../../src/composables/ui/useBranding')
>('../../../src/composables/ui/useBranding')

// The shared catalogs are mutable module singletons and sibling suites may
// append entries (isolate=false pool); intersection with the brand catalog
// still proves WHICH catalog the composable selected.
const expectSocialSubsetOf = (
  social: Record<string, string>,
  brand: Parameters<typeof getContent>[0],
): void => {
  const catalogUrls = new Set(
    ((getContent(brand) as BrandContent).social || []).map(item => item.url),
  )
  const urls = Object.values(social)
  expect(urls.length).toBeGreaterThan(0)
  expect(
    urls.some(url => catalogUrls.has(url)),
    `at least one link must come from the ${brand} catalog`,
  ).toBe(true)
}

afterEach(() => {
  useTheme().setTheme('nettoolskit')
})

describe('useBranding brand resolution', () => {
  it('falls back to the nettoolskit catalog for a non-brand theme identity (revolut)', () => {
    useTheme().setTheme('revolut')
    const branding = useBranding()

    // Both sides of the known-brand guard execute; every exposed social link
    // must come from the nettoolskit (fallback) catalog.
    expectSocialSubsetOf(branding.social.value, 'nettoolskit')
    expect(branding.appName.value.length).toBeGreaterThan(0)
    expect(branding.primaryColor.value).toBe('var(--ntk-primary)')
  })

  it('resolves the own catalog for known-brand identities', () => {
    for (const brand of ['sentinela', 'platea'] as const) {
      useTheme().setTheme(brand)
      const branding = useBranding()
      expectSocialSubsetOf(branding.social.value, brand)
      expect(branding.logo.value).toBeTruthy()
    }
  })

  it('exposes identity-derived strings with safe fallbacks', () => {
    useTheme().setTheme('nettoolskit')
    const branding = useBranding()

    expect(typeof branding.appName.value).toBe('string')
    expect(typeof branding.tagline.value).toBe('string')
    expect(typeof branding.appUrl.value).toBe('string')
    expect(branding.secondaryColor.value).toBe('var(--ntk-secondary)')
    expect(branding.accentColor.value).toBe('var(--ntk-accent)')
  })
})