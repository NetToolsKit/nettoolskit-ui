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
const landingLegacyHostSource = readRepoFile('../../../landing-page/LandingPublicApp.ts')
const samplesMainSource = readRepoFile('../../../samples/main.ts')
const samplesIndexSource = readRepoFile('../../../samples/index.html')
const cmsAppSource = readRepoFile('../../../landing-page/CmsApp.vue')
const referenceCatalogSource = readRepoFile('../../../samples/ReferenceCatalogApp.vue')
const samplesNavigationHubSource = readRepoFile('../../../samples/reference-hub/SamplesNavigationHub.vue')
const referenceSamplesSource = readRepoFile('../../../samples/ReferenceSamplesApp.vue')
const templateShowcaseSource = readRepoFile('../../../samples/TemplateShowcaseApp.vue')
const templateVisualFamilyPacksSource = readRepoFile('../../../samples/template-showcase/packs/index.ts')
const templateVisualFamilySectionSource = readRepoFile('../../../samples/template-showcase/components/TemplateVisualFamilySection.vue')
const templateSampleSelectorSource = readRepoFile('../../../samples/template-showcase/components/TemplateSampleSelector.vue')
const templateVisualVariantCardSource = readRepoFile('../../../samples/template-showcase/components/TemplateVisualVariantCard.vue')
const templateShowcaseReferenceSystemSource = readRepoFile('../../../samples/template-showcase/examples/reference-system/TemplateShowcaseReferenceSystemExample.vue')
const templateShowcaseCmsSource = readRepoFile('../../../samples/template-showcase/examples/cms-authoring/TemplateShowcaseCmsAuthoringExample.vue')
const packageJsonSource = readRepoFile('../../../package.json')
const landingStylesSource = readRepoFile('../../../landing-page/styles/landing.css')
const themeFieldCatalogSource = readRepoFile('../../../src/modules/cms/white-label/authoring/theme-field-catalog.ts')
const specDirectory = dirname(fileURLToPath(import.meta.url))

describe('Samples runtime consolidation coverage', () => {
  it('uses the samples host as the canonical public entry while keeping legacy landing, cms, samples, and template runtimes split', () => {
    expect(samplesMainSource).toContain("const LandingApp = defineAsyncComponent(() => import('../landing-page/LandingPublicApp'))")
    expect(samplesMainSource).toContain("const ReferenceCatalogApp = defineAsyncComponent(() => import('./ReferenceCatalogApp.vue'))")
    expect(samplesMainSource).toContain("searchParams.get('landing') === '1'")
    expect(samplesMainSource).toContain("searchParams.get('cms') === '1'")
    expect(samplesMainSource).toContain("const CmsApp = defineAsyncComponent(() => import('../landing-page/CmsApp.vue'))")
    expect(samplesMainSource).toContain("searchParams.get('samples') === '1'")
    expect(samplesMainSource).toContain("const ReferenceSamplesApp = defineAsyncComponent(() => import('./ReferenceSamplesApp.vue'))")
    expect(samplesMainSource).toContain("const TemplateShowcaseApp = defineAsyncComponent(() => import('./TemplateShowcaseApp.vue'))")
    expect(cmsAppSource).toContain('CmsSettingsModuleTemplate')
    expect(samplesMainSource).toContain(': ReferenceCatalogApp')
  })

  it('promotes samples commands to the canonical runtime aliases after consolidation', () => {
    expect(packageJsonSource).not.toContain('build:landing-new')
    expect(packageJsonSource).not.toContain('dev:landing-new')
    expect(packageJsonSource).toContain('"build:samples": "vite build"')
    expect(packageJsonSource).toContain('"build:landing": "npm run build:samples"')
    expect(packageJsonSource).toContain('"dev": "npm run dev:samples"')
    expect(packageJsonSource).toContain('"dev:landing": "npm run dev:samples"')
  })

  it('keeps the legacy landing composition reachable while the samples host owns the entrypoint', () => {
    expect(landingLegacyHostSource).toContain("import './styles/landing.css'")
    expect(landingLegacyHostSource).toContain("export { default } from './App.vue'")
    expect(landingAppSource).toContain('LandingNewTopNav')
    expect(landingAppSource).toContain('LandingNewHeroSection')
    expect(landingAppSource).toContain('LandingNewVideoSection')
    expect(landingAppSource).toContain('LandingNewFooterSection')
    expect(landingAppSource).toContain('href="/?cms=1"')
    expect(landingAppSource).toContain('href="/?samples=1"')
    expect(landingAppSource).not.toContain('LandingHeaderSection')
    expect(landingAppSource).not.toContain('LandingThemesSection')
  })

  it('keeps the samples html shell as the canonical app bootstrap document', () => {
    expect(samplesIndexSource).toContain('<div id="app"></div>')
    expect(samplesIndexSource).toContain('<script type="module" src="./main.ts"></script>')
    expect(samplesIndexSource).toContain('href="/favicon.png"')
  })

  it('removes the dev-only legacy landing artifact from the canonical source tree', () => {
    const legacyDevAppPath = resolve(specDirectory, '../../../landing-page/App-Dev.vue')
    expect(existsSync(legacyDevAppPath)).toBe(false)
  })

  it('keeps the legacy landing styles available in the merged landing-page root', () => {
    expect(landingStylesSource).toContain('.nav-wrapper')
    expect(landingStylesSource).toContain('.hero')
    expect(landingStylesSource).toContain('.runtime-mode-shortcuts')
    expect(landingStylesSource).toContain('.samples-mode-btn')
    expect(landingStylesSource).toContain('.cms-mode-btn')
  })

  it('adds a dedicated reference catalog runtime with reusable template surfaces and whitelabel host state', () => {
    expect(referenceCatalogSource).toContain('useReferenceCatalogHost')
    expect(referenceCatalogSource).toContain('ReferenceCatalogTemplate')
    expect(referenceCatalogSource).toContain('ReferenceWorkspaceShell')
    expect(referenceCatalogSource).toContain('SamplesNavigationHub')
    expect(samplesNavigationHubSource).toContain("navigateTo(`/?templates=1&family=${family.id}`)")
    expect(samplesNavigationHubSource).toContain("navigateTo(`/?templates=1&example=${example.id}`)")
  })

  it('adds a dedicated reference samples runtime with reusable template surfaces', () => {
    expect(referenceSamplesSource).toContain('useReferenceWorkspaceHost')
    expect(referenceSamplesSource).toContain('ReferenceWorkspaceShell')
    expect(referenceSamplesSource).toContain('ReferenceWorkspaceComposer')
  })

  it('keeps the samples showcase host consuming shared template surfaces from src', () => {
    const approvedReferencePackPath = resolve(specDirectory, '../../../samples/template-showcase/packs/approved-reference/pack.config.ts')
    const operationsWorkspacePackPath = resolve(specDirectory, '../../../samples/template-showcase/packs/operations-workspace/pack.config.ts')
    const referenceOrchestratorPackPath = resolve(specDirectory, '../../../samples/template-showcase/packs/reference-orchestrator/pack.config.ts')
    const builderStudioPackPath = resolve(specDirectory, '../../../samples/template-showcase/packs/builder-studio/pack.config.ts')
    const registryControlPackPath = resolve(specDirectory, '../../../samples/template-showcase/packs/registry-control/pack.config.ts')
    const serviceCommandPackPath = resolve(specDirectory, '../../../samples/template-showcase/packs/service-command/pack.config.ts')

    expect(templateShowcaseSource).toContain("from '../src/templates'")
    expect(templateShowcaseSource).toContain("from './template-showcase/components/TemplateVisualFamilySection.vue'")
    expect(templateShowcaseSource).toContain("from './template-showcase/components/TemplateSampleSelector.vue'")
    expect(templateShowcaseSource).toContain("from './template-showcase/families/template-visual-families'")
    expect(templateShowcaseSource).toContain("searchParams.get('family')")
    expect(templateShowcaseSource).toContain("searchParams.get('example')")
    expect(templateVisualFamilyPacksSource).toContain("from './approved-reference/pack.config'")
    expect(templateVisualFamilyPacksSource).toContain("from './operations-workspace/pack.config'")
    expect(templateVisualFamilyPacksSource).toContain("from './reference-orchestrator/pack.config'")
    expect(templateVisualFamilyPacksSource).toContain("from './builder-studio/pack.config'")
    expect(templateVisualFamilyPacksSource).toContain("from './registry-control/pack.config'")
    expect(templateVisualFamilyPacksSource).toContain("from './service-command/pack.config'")
    expect(existsSync(approvedReferencePackPath)).toBe(true)
    expect(existsSync(operationsWorkspacePackPath)).toBe(true)
    expect(existsSync(referenceOrchestratorPackPath)).toBe(true)
    expect(existsSync(builderStudioPackPath)).toBe(true)
    expect(existsSync(registryControlPackPath)).toBe(true)
    expect(existsSync(serviceCommandPackPath)).toBe(true)
    expect(templateSampleSelectorSource).toContain('Original reference plus five whitelabel variations')
    expect(templateSampleSelectorSource).toContain("family.kind === 'original'")
    expect(templateVisualFamilySectionSource).toContain('<TemplateVisualVariantCard')
    expect(templateVisualVariantCardSource).toContain('<component :is="example.component"')
    expect(templateShowcaseReferenceSystemSource).toContain('ReferenceWorkspaceComposer')
    expect(templateShowcaseCmsSource).toContain('CmsAuthoringWorkbench')
  })

  it('keeps landing typography controls exposed in CMS for the shared authoring model', () => {
    expect(themeFieldCatalogSource).toContain('Section badge letter spacing')
    expect(themeFieldCatalogSource).toContain('CTA subtitle line height')
    expect(themeFieldCatalogSource).toContain('Footer link title letter spacing')
  })
})
