import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  lintCssGovernance,
  runCli,
} from '../../../../scripts/lint-css-governance.mjs'

type GovernanceMetric =
  | 'directQuasarTags'
  | 'quasarClassSelectors'
  | 'unmanagedDeepSelectors'
  | 'importantDeclarations'
  | 'rawHexColors'

type GovernanceBaseline = {
  schemaVersion: number
  scannedRoots: string[]
  scannedFiles: number
  metrics: Record<GovernanceMetric, number>
}

const temporaryDirectories: string[] = []

function createBaseline(overrides: Partial<Record<GovernanceMetric, number>> = {}): GovernanceBaseline {
  return {
    schemaVersion: 1,
    scannedRoots: ['src/components'],
    scannedFiles: 0,
    metrics: {
      directQuasarTags: 0,
      quasarClassSelectors: 0,
      unmanagedDeepSelectors: 0,
      importantDeclarations: 0,
      rawHexColors: 0,
      ...overrides,
    },
  }
}

async function createFixture(files: Record<string, string>) {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'ntk-css-governance-'))
  temporaryDirectories.push(repoRoot)

  for (const [filePath, source] of Object.entries(files)) {
    const absolutePath = path.join(repoRoot, filePath)
    await mkdir(path.dirname(absolutePath), { recursive: true })
    await writeFile(absolutePath, source, 'utf8')
  }

  return repoRoot
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => (
    rm(directory, { recursive: true, force: true })
  )))
})

describe('CSS governance lint', () => {
  it('passes when fixture counts stay within the baseline', async () => {
    const repoRoot = await createFixture({
      'src/components/LegacyButton.vue': '<template><q-btn /></template>\n<style>.legacy { color: #fff; }</style>\n',
    })

    const result = await lintCssGovernance({
      baseline: createBaseline({
        directQuasarTags: 1,
        rawHexColors: 1,
      }),
      repoRoot,
    })

    expect(result.ok).toBe(true)
    expect(result.metrics.directQuasarTags).toBe(1)
    expect(result.metrics.rawHexColors).toBe(1)
    expect(result.exceededMetrics).toEqual([])
  })

  it('fails when raw hex colors and direct q-btn usage exceed the baseline', async () => {
    const repoRoot = await createFixture({
      'src/components/NewButton.vue': '<template><q-btn /></template>\n<style>.cta { color: #fff; }</style>\n',
    })

    const result = await lintCssGovernance({
      baseline: createBaseline(),
      repoRoot,
    })

    expect(result.ok).toBe(false)
    expect(result.metrics.directQuasarTags).toBe(1)
    expect(result.metrics.rawHexColors).toBe(1)
    expect(result.exceededMetrics).toEqual(expect.arrayContaining([
      'directQuasarTags',
      'rawHexColors',
    ]))
    expect(result.samples.rawHexColors[0]).toMatchObject({
      filePath: 'src/components/NewButton.vue',
      value: '#fff',
    })
  })

  it('prints machine-readable CLI output', async () => {
    const repoRoot = await createFixture({
      'src/components/NewButton.vue': '<template><q-btn /></template>\n',
      'tests/baseline.json': JSON.stringify(createBaseline(), null, 2),
    })
    const stdout: string[] = []
    const exitCode = await runCli([
      '--format=json',
      '--repo-root',
      repoRoot,
      '--baseline',
      'tests/baseline.json',
    ], {
      stdout: line => stdout.push(line),
    })

    const payload = JSON.parse(stdout.join('\n'))

    expect(exitCode).toBe(1)
    expect(payload.ok).toBe(false)
    expect(payload.metrics.directQuasarTags).toBe(1)
    expect(payload.exceededMetrics).toContain('directQuasarTags')
  })
})