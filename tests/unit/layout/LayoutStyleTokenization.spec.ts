/**
 * Tests/unit/layout/Layout Style Tokenization spec module.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const layoutDirectory = join(process.cwd(), 'src/components/layout')

/**
 * Reads all layout component sources.
 */
function readLayoutComponentSources(): Array<{ fileName: string; source: string }> {
  return readdirSync(layoutDirectory)
    .filter(fileName => fileName.endsWith('.vue'))
    .map((fileName) => {
      const source = readFileSync(join(layoutDirectory, fileName), 'utf8')
      return { fileName, source }
    })
}

describe('Layout style tokenization', () => {
  it('uses CSS custom properties across layout components', () => {
    const sources = readLayoutComponentSources()
    const tokenizedSources = sources.filter(({ source }) => source.includes('var(--'))

    expect(tokenizedSources.length).toBeGreaterThan(0)
    expect(tokenizedSources.length).toBeGreaterThanOrEqual(Math.floor(sources.length / 2))
  })

  it('keeps core shell typography hooks tokenized', () => {
    const coreShellFiles = new Set(['NtkAppShell.vue', 'NtkHeader.vue', 'NtkLandingHeader.vue', 'NtkMobileDrawer.vue'])
    const sources = readLayoutComponentSources().filter(({ fileName }) => coreShellFiles.has(fileName))

    for (const { fileName, source } of sources) {
      expect(source.includes('var(--'), `Expected CSS token usage in ${fileName}`).toBe(true)
    }
  })
})