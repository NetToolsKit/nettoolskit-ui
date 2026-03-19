/**
 * Tests/unit/landing/Landing Tokenization spec module.
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
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
const landingMainSource = readRepoFile('../../../landing-page/main.ts')
const cmsAppSource = readRepoFile('../../../landing-page/CmsApp.vue')
const packageJsonSource = readRepoFile('../../../package.json')
const landingStylesSource = readRepoFile('../../../landing-page/styles/landing.css')
const specDirectory = dirname(fileURLToPath(import.meta.url))

describe('Landing consolidation coverage', () => {
  it('uses landing-page as the canonical public entry while keeping CMS mode split', () => {
    expect(landingMainSource).toContain("const LandingApp = defineAsyncComponent(() => import('./LandingPublicApp'))")
    expect(landingMainSource).toContain("searchParams.get('cms') === '1'")
    expect(landingMainSource).toContain("const CmsApp = defineAsyncComponent(() => import('./CmsApp.vue'))")
  })

  it('removes parallel landing-new build scripts after consolidation', () => {
    expect(packageJsonSource).not.toContain('build:landing-new')
    expect(packageJsonSource).not.toContain('dev:landing-new')
    expect(packageJsonSource).toContain('"dev": "npm run dev:landing"')
  })

  it('renders the canonical landing with the new composition and keeps CMS access visible', () => {
    expect(landingAppSource).toContain('LandingNewTopNav')
    expect(landingAppSource).toContain('LandingNewHeroSection')
    expect(landingAppSource).toContain('LandingNewVideoSection')
    expect(landingAppSource).toContain('LandingNewFooterSection')
    expect(landingAppSource).toContain('href="/?cms=1"')
    expect(landingAppSource).not.toContain('LandingHeaderSection')
    expect(landingAppSource).not.toContain('LandingThemesSection')
  })

  it('removes the dev-only legacy landing artifact from the canonical source tree', () => {
    const legacyDevAppPath = resolve(specDirectory, '../../../landing-page/App-Dev.vue')
    expect(existsSync(legacyDevAppPath)).toBe(false)
  })

  it('keeps canonical landing styles in the merged landing-page root', () => {
    expect(landingStylesSource).toContain('.nav-wrapper')
    expect(landingStylesSource).toContain('.hero')
    expect(landingStylesSource).toContain('.cms-mode-btn')
  })

  it('keeps landing typography controls exposed in CMS for the shared authoring model', () => {
    expect(cmsAppSource).toContain('Section badge letter spacing')
    expect(cmsAppSource).toContain('CTA subtitle line height')
    expect(cmsAppSource).toContain('Footer link title letter spacing')
  })
})