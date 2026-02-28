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
const cmsAppSource = readRepoFile('../../../../landing-page/CmsApp.vue')

describe('CMS white-label configuration coverage', () => {
  it('exposes all AppShellTheme keys in CmsApp color fields', () => {
    const appShellThemeKeys = extractInterfaceKeys(appShellTypesSource, 'AppShellTheme')
    const cmsThemeFieldKeys = extractUniqueMatches(cmsAppSource, /key:\s*'([a-zA-Z0-9_]+)'/g)
    const missingThemeKeys = appShellThemeKeys.filter(key => !cmsThemeFieldKeys.includes(key))

    expect(missingThemeKeys).toEqual([])
  })

  it('references all CmsLayoutSettings keys in CmsApp', () => {
    const layoutKeys = extractInterfaceKeys(cmsTypesSource, 'CmsLayoutSettings')
    const layoutRefs = extractUniqueMatches(cmsAppSource, /settings\.layout\.([a-zA-Z0-9_]+)/g)
    const missingLayoutRefs = layoutKeys.filter(key => !layoutRefs.includes(key))

    expect(missingLayoutRefs).toEqual([])
  })

  it('references all AppShellItem keys in CmsApp item editing/preview flows', () => {
    const itemKeys = extractInterfaceKeys(appShellTypesSource, 'AppShellItem')
    const itemRefs = extractUniqueMatches(cmsAppSource, /item\.([a-zA-Z0-9_]+)/g)
    const missingItemRefs = itemKeys.filter(key => !itemRefs.includes(key))

    expect(missingItemRefs).toEqual([])
  })

  it('references all AppShellAction keys in CmsApp action editing/preview flows', () => {
    const actionKeys = extractInterfaceKeys(appShellTypesSource, 'AppShellAction')
    const actionRefs = extractUniqueMatches(cmsAppSource, /action\.([a-zA-Z0-9_]+)/g)
    const missingActionRefs = actionKeys.filter(key => !actionRefs.includes(key))

    expect(missingActionRefs).toEqual([])
  })
})