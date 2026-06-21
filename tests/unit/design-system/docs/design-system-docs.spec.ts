import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, describe, expect, it } from 'vitest'

import {
  checkDesignSystemDocs,
  generateDesignSystemDocs,
  getDesignSystemDocOutputPaths,
  writeDesignSystemDocs,
} from '../../../../scripts/design-system-docs.mjs'

const tempDirectories: string[] = []

function readRepoFile(relativePath: string): Promise<string> {
  return readFile(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')
}

async function createTempOutputDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), 'ntk-design-system-docs-'))
  tempDirectories.push(directory)
  return directory
}

afterEach(async () => {
  await Promise.all(tempDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

describe('design-system documentation generator', () => {
  it('keeps checked-in markdown synchronized with generated output', async () => {
    const { docs } = await generateDesignSystemDocs()

    expect(docs.design).toBe(await readRepoFile('../../../../DESIGN.md'))
    expect(docs.tokens).toBe(await readRepoFile('../../../../TOKENS.md'))
    expect(docs.components).toBe(await readRepoFile('../../../../COMPONENTS.md'))

    const result = await checkDesignSystemDocs()

    expect(result.ok).toBe(true)
    expect(result.mismatches).toEqual([])
  })

  it('generates representative token and component content from source artifacts', async () => {
    const { docs } = await generateDesignSystemDocs()
    const combinedDocs = Object.values(docs).join('\n')

    expect(docs.tokens).toContain('`color.primary`')
    expect(docs.tokens).toContain('`--ntk-primary`')
    expect(docs.tokens).toContain('`surface.bgActive`')
    expect(docs.tokens).toContain('`rgba(var(--ntk-primary-rgb), 0.08)`')

    expect(docs.components).toContain('## Button')
    expect(docs.components).toContain('`solid`')
    expect(docs.components).toContain('`ntk-button--variant-solid`')
    expect(docs.components).toContain('## Field')
    expect(docs.components).toContain('`outlined`')
    expect(docs.components).toContain('## Card')
    expect(docs.components).toContain('`accent-left`')

    expect(combinedDocs).toMatch(/^[\x09\x0a\x0d\x20-\x7e]*$/)
  })

  it('rejects stale markdown through temporary output paths', async () => {
    const outputDirectory = await createTempOutputDirectory()

    await writeDesignSystemDocs({ outputDirectory })

    const outputPaths = getDesignSystemDocOutputPaths({ outputDirectory })
    await writeFile(outputPaths.tokens, '# Stale tokens\n', 'utf8')

    const result = await checkDesignSystemDocs({ outputDirectory })

    expect(result.ok).toBe(false)
    expect(result.mismatches).toEqual(['TOKENS.md'])
  })
})