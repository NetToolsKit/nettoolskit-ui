/**
 * Tests/unit/landing/Landing Tokenization spec module.
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

function readRepoFile(relativePath: string): string {
  const absolutePath = fileURLToPath(new URL(relativePath, import.meta.url))
  return readFileSync(absolutePath, 'utf8')
}

const landingAppSource = readRepoFile('../../../landing-page/App.vue')
const samplesMainSource = readRepoFile('../../../samples/main.ts')
const samplesCmsMainSource = readRepoFile('../../../samples/cms-main.ts')
const samplesIndexSource = readRepoFile('../../../samples/index.html')
const samplesReadmeSource = readRepoFile('../../../samples/README.md')
const samplesInternalCmsIndexSource = readRepoFile('../../../samples/internal-cms.html')
const rootReadmeSource = readRepoFile('../../../README.md')
const viteConfigSource = readRepoFile('../../../vite.config.ts')
const originalReferenceSource = readRepoFile('../../../samples/original-reference/OriginalReferenceApp.vue')
const originalReferenceDataSource = readRepoFile('../../../samples/original-reference/original-reference.sample-data.ts')
const originalReferenceChartsSource = readRepoFile('../../../samples/original-reference/OriginalReferenceCharts.vue')
const packageJsonSource = readRepoFile('../../../package.json')
const specDirectory = dirname(fileURLToPath(import.meta.url))

describe('Samples single reference runtime coverage', () => {
  it('uses the samples host as a single public runtime rooted in the original reference sample', () => {
    expect(samplesMainSource).toContain("const OriginalReferenceApp = defineAsyncComponent(() => import('./original-reference/OriginalReferenceApp.vue'))")
    expect(samplesMainSource).toContain("const TemplateRuntimeApp = defineAsyncComponent(() => import('../src/templates/runtime/TemplateRuntimeApp.vue'))")
    expect(samplesMainSource).toContain("searchParams.get('template-runtime') === '1'")
    expect(samplesMainSource).not.toContain('LandingPublicApp')
    expect(samplesMainSource).not.toContain("searchParams.get('landing')")
    expect(samplesMainSource).not.toContain('ReferenceCatalogApp')
    expect(samplesMainSource).not.toContain('ReferenceSamplesApp')
    expect(samplesMainSource).not.toContain('TemplateShowcaseApp')
    expect(samplesMainSource).not.toContain("searchParams.get('samples') === '1'")
    expect(samplesMainSource).not.toContain("searchParams.get('templates') === '1'")
  })

  it('keeps samples commands as the canonical runtime aliases', () => {
    expect(packageJsonSource).toContain('"build:samples": "vite build"')
    expect(packageJsonSource).toContain('"build:landing": "npm run build:samples"')
    expect(packageJsonSource).toContain('"dev": "npm run dev:samples"')
    expect(packageJsonSource).toContain('"dev:landing": "npm run dev:samples"')
  })

  it('keeps the landing source outside the public samples router', () => {
    expect(landingAppSource).toContain('href="/"')
    expect(landingAppSource).not.toContain('href="/?samples=1"')
    expect(samplesMainSource).not.toContain('LandingPublicApp')
  })

  it('keeps the samples html shell as the canonical app bootstrap document', () => {
    expect(samplesIndexSource).toContain('<div id="app"></div>')
    expect(samplesIndexSource).toContain('<script type="module" src="./main.ts"></script>')
    expect(samplesIndexSource).toContain('Atlas Flow')
  })

  it('keeps the internal CMS compatibility entry mounted outside the public runtime', () => {
    expect(samplesCmsMainSource).toContain("import CmsApp from '../landing-page/CmsApp.vue'")
    expect(samplesCmsMainSource).toContain('mountSamplesHost(CmsApp)')
    expect(samplesInternalCmsIndexSource).toContain('<script type="module" src="./cms-main.ts"></script>')
    expect(viteConfigSource).toContain("index: resolve(__dirname, './samples/index.html')")
    expect(viteConfigSource).not.toContain("'internal-cms': resolve")
  })

  it('makes the original sample self-contained instead of depending on showcase files', () => {
    expect(originalReferenceSource).toContain("from './original-reference.sample-data'")
    expect(originalReferenceSource).toContain("from './OriginalReferenceCharts.vue'")
    expect(originalReferenceSource).toContain('Open assistant')
    expect(originalReferenceSource).not.toContain('Open packs')
    expect(originalReferenceSource).not.toContain('/?templates=1')
    expect(originalReferenceSource).not.toContain('/?samples=1')
    expect(originalReferenceDataSource).toContain('getGreetingText()}')
    expect(originalReferenceDataSource).toContain(', Admin')
    expect(originalReferenceChartsSource).toContain('Orders by Status')
    expect(originalReferenceChartsSource).toContain('Sales by Category')
  })

  it('documents the single-sample public runtime in samples/README.md', () => {
    expect(samplesReadmeSource).toContain('single approved sample')
    expect(samplesReadmeSource).toContain('- `/`')
    expect(samplesReadmeSource).toContain('excluded from the public samples build entry list')
    expect(samplesReadmeSource).not.toContain('/?landing=1')
    expect(samplesReadmeSource).not.toContain('showcase')
    expect(samplesReadmeSource).not.toContain('/?templates=1')
    expect(samplesReadmeSource).not.toContain('/?samples=1')
  })

  it('keeps root runtime docs aligned with current public entries', () => {
    expect(rootReadmeSource).toContain('/?template-runtime=1')
    expect(rootReadmeSource).toContain('excluded from the public samples build entry list')
    expect(rootReadmeSource).not.toContain('/?landing=1')
    expect(rootReadmeSource).not.toContain('./templates/custom-theme-template.ts')
    expect(rootReadmeSource).not.toContain('./templates/custom-branding.scss')
  })

  it('removes the public showcase and multi-pack host files from the source tree', () => {
    const removedPaths = [
      '../../../samples/ReferenceCatalogApp.vue',
      '../../../samples/ReferenceSamplesApp.vue',
      '../../../samples/TemplateShowcaseApp.vue',
      '../../../samples/reference-hub/SamplesNavigationHub.vue',
      '../../../samples/template-showcase',
      '../../../tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts',
      '../../../tests/unit/samples/TemplateVisualFamilies.spec.ts',
    ]

    for (const relativePath of removedPaths) {
      expect(existsSync(resolve(specDirectory, relativePath))).toBe(false)
    }

    expect(existsSync(resolve(specDirectory, '../../../tests/e2e/template-runtime-screenshots.spec.ts'))).toBe(true)
  })
})
