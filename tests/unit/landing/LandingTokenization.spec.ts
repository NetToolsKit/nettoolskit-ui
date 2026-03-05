/**
 * Tests/unit/landing/Landing Tokenization spec module.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * Reads a repository file relative to this spec.
 */
function readRepoFile(relativePath: string): string {
  const absolutePath = fileURLToPath(new URL(relativePath, import.meta.url))
  return readFileSync(absolutePath, 'utf8')
}

const landingAppSource = readRepoFile('../../../landing-page/App.vue')
const devLandingAppSource = readRepoFile('../../../landing-page/App-Dev.vue')
const landingDeveloperSectionSource = readRepoFile('../../../landing-page/components/LandingDeveloperSection.vue')
const headerSource = readRepoFile('../../../src/components/layout/NtkHeader.vue')
const landingHeaderSource = readRepoFile('../../../src/components/layout/NtkLandingHeader.vue')
const mobileDrawerSource = readRepoFile('../../../src/components/layout/NtkMobileDrawer.vue')
const tokensSource = readRepoFile('../../../src/styles/tokens.scss')

describe('Landing tokenization coverage', () => {
  it('avoids hardcoded numeric font declarations in key landing files', () => {
    const sources = [
      landingAppSource,
      devLandingAppSource,
      landingDeveloperSectionSource,
      headerSource,
      landingHeaderSource,
      mobileDrawerSource,
    ]

    for (const source of sources) {
      expect(/font-size:\s*[0-9]/.test(source)).toBe(false)
      expect(/font-weight:\s*[0-9]/.test(source)).toBe(false)
    }
  })

  it('keeps only canonical token aliases used by current components', () => {
    const requiredAliases = [
      '--ntk-font-body:',
      '--ntk-font-display:',
      '--ntk-text-base:',
      '--ntk-text-sm:',
      '--ntk-spacing-sm:',
      '--ntk-spacing-md:',
      '--ntk-spacing-lg:',
      '--ntk-shadow-medium:',
      '--ntk-shadow-large:',
      '--ntk-line-height-tight:',
      '--ntk-line-height-relaxed:',
    ]

    for (const alias of requiredAliases) {
      expect(tokensSource.includes(alias)).toBe(true)
    }

    expect(tokensSource.includes('--border-radius-')).toBe(false)
    expect(tokensSource.includes('--line-height-')).toBe(false)
  })

  it('uses configurable breakpoint classes instead of fixed media max-width queries in landing app', () => {
    expect(landingAppSource.includes('@media (max-width')).toBe(false)
    expect(landingAppSource.includes('landing-bp-lg')).toBe(true)
    expect(landingAppSource.includes('landing-bp-md')).toBe(true)
    expect(landingAppSource.includes('landing-bp-sm')).toBe(true)
    expect(landingAppSource.includes('--layout-breakpoint-lg')).toBe(true)
    expect(landingAppSource.includes('--layout-breakpoint-md')).toBe(true)
    expect(landingAppSource.includes('--layout-breakpoint-sm')).toBe(true)
  })

  it('keeps landing line-height and letter-spacing style hooks tokenized', () => {
    expect(landingAppSource).toContain('--layout-nav-line-height')
    expect(landingAppSource).toContain('--layout-hero-title-line-height')
    expect(landingAppSource).toContain('--layout-feature-text-line-height')
    expect(landingAppSource).toContain('--layout-code-line-height')
    expect(landingAppSource).toContain('--layout-footer-description-line-height')
    expect(landingAppSource).toContain('--layout-footer-heading-line-height')
    expect(landingAppSource).toContain('--layout-footer-link-line-height')
    expect(landingAppSource).toContain('--layout-floating-button-letter-spacing')

    expect(/^\s*line-height:\s*[0-9]/m.test(landingAppSource)).toBe(false)
    expect(/^\s*letter-spacing:\s*[0-9.-]/m.test(landingAppSource)).toBe(false)
  })
})