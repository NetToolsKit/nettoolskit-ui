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
})