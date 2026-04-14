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
const landingLegacyHostSource = readRepoFile('../../../landing-page/LandingPublicApp.ts')
const samplesMainSource = readRepoFile('../../../samples/main.ts')
const samplesCmsMainSource = readRepoFile('../../../samples/cms-main.ts')
const samplesIndexSource = readRepoFile('../../../samples/index.html')
const samplesReadmeSource = readRepoFile('../../../samples/README.md')
const samplesInternalCmsIndexSource = readRepoFile('../../../samples/internal-cms.html')
const originalReferenceSource = readRepoFile('../../../samples/original-reference/OriginalReferenceApp.vue')
const originalReferenceDataSource = readRepoFile('../../../samples/original-reference/original-reference.sample-data.ts')
const originalReferenceChartsSource = readRepoFile('../../../samples/original-reference/OriginalReferenceCharts.vue')
const packageJsonSource = readRepoFile('../../../package.json')
const specDirectory = dirname(fileURLToPath(import.meta.url))

describe('Samples single reference runtime coverage', () => {
  it('uses the samples host as a single public runtime rooted in the original reference sample', () => {
    expect(samplesMainSource).toContain("const LandingApp = defineAsyncComponent(() => import('../landing-page/LandingPublicApp'))")
    expect(samplesMainSource).toContain("const OriginalReferenceApp = defineAsyncComponent(() => import('./original-reference/OriginalReferenceApp.vue'))")
    expect(samplesMainSource).toContain("const TemplateRuntimeApp = defineAsyncComponent(() => import('../src/templates/runtime/TemplateRuntimeApp.vue'))")
    expect(samplesMainSource).toContain("searchParams.get('landing') === '1'")
    expect(samplesMainSource).toContain("searchParams.get('template-runtime') === '1'")
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

  it('keeps the legacy landing reachable while pointing its shortcut to the single public sample', () => {
    expect(landingLegacyHostSource).toContain("export { default } from './App.vue'")
    expect(landingAppSource).toContain('href="/"')
    expect(landingAppSource).not.toContain('href="/?samples=1"')
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
  })

  it('makes the original sample self-contained instead of depending on showcase files', () => {
    expect(originalReferenceSource).toContain("from './original-reference.sample-data'")
    expect(originalReferenceSource).toContain("from './OriginalReferenceCharts.vue'")
    expect(originalReferenceSource).toContain('Abrir assistente')
    expect(originalReferenceSource).toContain("navigateTo('/?landing=1')")
    expect(originalReferenceSource).not.toContain('Abrir packs')
    expect(originalReferenceSource).not.toContain('/?templates=1')
    expect(originalReferenceSource).not.toContain('/?samples=1')
    expect(originalReferenceDataSource).toContain('getGreetingText()}')
    expect(originalReferenceDataSource).toContain(', Guilherme')
    expect(originalReferenceChartsSource).toContain('Pedidos por Status')
    expect(originalReferenceChartsSource).toContain('Vendas por Categoria')
  })

  it('documents the single-sample public runtime in samples/README.md', () => {
    expect(samplesReadmeSource).toContain('single approved sample')
    expect(samplesReadmeSource).toContain('- `/`')
    expect(samplesReadmeSource).not.toContain('showcase')
    expect(samplesReadmeSource).not.toContain('/?templates=1')
    expect(samplesReadmeSource).not.toContain('/?samples=1')
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
      '../../../tests/e2e/template-visual-regression.spec.ts',
    ]

    for (const relativePath of removedPaths) {
      expect(existsSync(resolve(specDirectory, relativePath))).toBe(false)
    }
  })
})
