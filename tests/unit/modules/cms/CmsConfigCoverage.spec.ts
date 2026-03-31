/**
 * Tests/unit/modules/cms/Cms Config Coverage spec module.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * Handles read repo file.
 */
function readRepoFile(relativePath: string): string {
  const absolutePath = fileURLToPath(new URL(relativePath, import.meta.url))
  return readFileSync(absolutePath, 'utf8')
}

/**
 * Handles extract interface keys.
 */
function extractInterfaceKeys(source: string, interfaceName: string): string[] {
  const pattern = new RegExp(`export interface ${interfaceName}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm')
  const match = source.match(pattern)
  if (!match) {
    throw new Error(`Interface ${interfaceName} not found`)
  }

  return [...match[1].matchAll(/\n\s*([a-zA-Z0-9_]+)\??:/g)].map(item => item[1])
}

/**
 * Handles extract unique matches.
 */
function extractUniqueMatches(source: string, pattern: RegExp): string[] {
  return [...new Set([...source.matchAll(pattern)].map(match => match[1]))]
}

const appShellTypesSource = readRepoFile('../../../../src/components/layout/app-shell.types.ts')
const cmsTypesSource = readRepoFile('../../../../src/modules/cms/white-label/types.ts')
const appShellSource = readRepoFile('../../../../src/components/layout/NtkAppShell.vue')

// Theme field key literals (key: 'fontFamily', etc.) live in the canonical catalog file,
// not inline in CmsApp or the module surfaces (fields are iterated dynamically via field.key).
const themeFieldCatalogSource = readRepoFile('../../../../src/modules/cms/white-label/authoring/theme-field-catalog.ts')

// Layout/item/action prop references are distributed across CmsApp and the extracted module
// surfaces. Concatenate all authoring files to maintain the full coverage guarantee.
const cmsAuthoringSource = [
  readRepoFile('../../../../landing-page/CmsApp.vue'),
  readRepoFile('../../../../src/templates/features/cms/authoring/modules/CmsSettingsModuleSurface.vue'),
  readRepoFile('../../../../src/templates/features/cms/authoring/modules/CmsBlocksModuleSurface.vue'),
  readRepoFile('../../../../src/templates/features/cms/authoring/modules/CmsMediaModuleSurface.vue'),
  readRepoFile('../../../../src/templates/features/cms/authoring/modules/CmsPagesModuleSurface.vue'),
  readRepoFile('../../../../src/templates/features/cms/authoring/modules/CmsReleasesModuleSurface.vue'),
].join('\n')
const cmsAppSource = readRepoFile('../../../../landing-page/CmsApp.vue')

describe('CMS white-label configuration coverage', () => {
  it('exposes all AppShellTheme keys in CmsApp color fields', () => {
    const appShellThemeKeys = extractInterfaceKeys(appShellTypesSource, 'AppShellTheme')
    const cmsThemeFieldKeys = extractUniqueMatches(themeFieldCatalogSource, /key:\s*'([a-zA-Z0-9_]+)'/g)
    const missingThemeKeys = appShellThemeKeys.filter(key => !cmsThemeFieldKeys.includes(key))

    expect(missingThemeKeys).toEqual([])
  })

  it('references all CmsLayoutSettings keys in CmsApp', () => {
    const layoutKeys = extractInterfaceKeys(cmsTypesSource, 'CmsLayoutSettings')
    const layoutRefs = extractUniqueMatches(cmsAuthoringSource, /settings\.layout\.([a-zA-Z0-9_]+)/g)
    const missingLayoutRefs = layoutKeys.filter(key => !layoutRefs.includes(key))

    expect(missingLayoutRefs).toEqual([])
  })

  it('references all AppShellItem keys in CmsApp item editing/preview flows', () => {
    const itemKeys = extractInterfaceKeys(appShellTypesSource, 'AppShellItem')
    const itemRefs = extractUniqueMatches(cmsAuthoringSource, /item\.([a-zA-Z0-9_]+)/g)
    const missingItemRefs = itemKeys.filter(key => !itemRefs.includes(key))

    expect(missingItemRefs).toEqual([])
  })

  it('references all AppShellAction keys in CmsApp action editing/preview flows', () => {
    const actionKeys = extractInterfaceKeys(appShellTypesSource, 'AppShellAction')
    const actionRefs = extractUniqueMatches(cmsAuthoringSource, /action\.([a-zA-Z0-9_]+)/g)
    const missingActionRefs = actionKeys.filter(key => !actionRefs.includes(key))

    expect(missingActionRefs).toEqual([])
  })

  it('avoids hardcoded numeric font declarations in shell and CMS settings UI styles', () => {
    const hasHardcodedCmsFontSize = /font-size:\s*[0-9]/.test(cmsAppSource)
    const hasHardcodedCmsFontWeight = /font-weight:\s*[0-9]/.test(cmsAppSource)
    const hasHardcodedShellFontWeight = /font-weight:\s*[0-9]/.test(appShellSource)

    expect(hasHardcodedCmsFontSize).toBe(false)
    expect(hasHardcodedCmsFontWeight).toBe(false)
    expect(hasHardcodedShellFontWeight).toBe(false)
  })
})