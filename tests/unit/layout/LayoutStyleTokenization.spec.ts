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
  it('avoids fixed max-width media queries in layout components', () => {
    const sources = readLayoutComponentSources()

    for (const { fileName, source } of sources) {
      const hasFixedMaxWidthMedia = source.includes('@media (max-width')
      expect(hasFixedMaxWidthMedia, `Found fixed max-width media query in ${fileName}`).toBe(false)
    }
  })

  it('avoids hardcoded numeric line-height and letter-spacing declarations in layout components', () => {
    const sources = readLayoutComponentSources()

    for (const { fileName, source } of sources) {
      const hasNumericLineHeight = /^\s*line-height:\s*[0-9]/m.test(source)
      const hasNumericLetterSpacing = /^\s*letter-spacing:\s*[0-9.-]/m.test(source)
      expect(hasNumericLineHeight, `Found numeric line-height in ${fileName}`).toBe(false)
      expect(hasNumericLetterSpacing, `Found numeric letter-spacing in ${fileName}`).toBe(false)
    }
  })
})