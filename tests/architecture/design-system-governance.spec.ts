import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

import baseline from './design-system-governance.baseline.json'

import { describe, expect, it } from 'vitest'

type GovernanceMetric =
  | 'directQuasarTags'
  | 'quasarClassSelectors'
  | 'unmanagedDeepSelectors'
  | 'importantDeclarations'
  | 'rawHexColors'

type GovernanceBaseline = {
  scannedRoots: string[]
  scannedFiles: number
  metrics: Record<GovernanceMetric, number>
}

const repoRoot = process.cwd()
const sourceExtensions = new Set(['.css', '.scss', '.ts', '.vue'])
const metricPatterns: Record<GovernanceMetric, RegExp> = {
  directQuasarTags: /<\/?q-[a-z][\w-]*/g,
  quasarClassSelectors: /(?:^|[^\w-])\.q-[\w-]+/g,
  unmanagedDeepSelectors: /:deep\(/g,
  importantDeclarations: /!important\b/g,
  rawHexColors: /(?:^|[^\w-])#[0-9a-fA-F]{3,8}(?![\w-])/g,
}

function readGovernedFiles(relativeRoot: string): string[] {
  const absoluteRoot = join(repoRoot, relativeRoot)
  const entries = readdirSync(absoluteRoot)
  const files: string[] = []

  for (const entry of entries) {
    const absolutePath = join(absoluteRoot, entry)
    const stats = statSync(absolutePath)

    if (stats.isDirectory()) {
      files.push(...readGovernedFiles(relative(repoRoot, absolutePath)))
      continue
    }

    if (stats.isFile() && sourceExtensions.has(extname(entry))) {
      files.push(relative(repoRoot, absolutePath).replace(/\\/g, '/'))
    }
  }

  return files.sort((left, right) => left.localeCompare(right))
}

function countMatches(source: string, pattern: RegExp): number {
  return source.match(pattern)?.length ?? 0
}

function collectMetrics() {
  const typedBaseline = baseline as GovernanceBaseline
  const files = typedBaseline.scannedRoots.flatMap(readGovernedFiles)
  const metrics = Object
    .keys(metricPatterns)
    .reduce<Record<GovernanceMetric, number>>((result, metricName) => {
      const metric = metricName as GovernanceMetric
      result[metric] = files.reduce((count, filePath) => {
        const source = readFileSync(join(repoRoot, filePath), 'utf8')
        return count + countMatches(source, metricPatterns[metric])
      }, 0)

      return result
    }, {
      directQuasarTags: 0,
      quasarClassSelectors: 0,
      unmanagedDeepSelectors: 0,
      importantDeclarations: 0,
      rawHexColors: 0,
    })

  return {
    scannedFiles: files.length,
    metrics,
  }
}

describe('design-system governance baseline', () => {
  it('does not add unmanaged Quasar, deep selector, important, or raw color usage', () => {
    const typedBaseline = baseline as GovernanceBaseline
    const current = collectMetrics()

    expect(current.scannedFiles).toBeGreaterThanOrEqual(typedBaseline.scannedFiles)

    for (const metric of Object.keys(metricPatterns) as GovernanceMetric[]) {
      expect(current.metrics[metric], metric).toBeLessThanOrEqual(typedBaseline.metrics[metric])
    }
  })
})