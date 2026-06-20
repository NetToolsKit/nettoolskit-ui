import { describe, expect, it } from 'vitest'

import {
  lintCssGovernance,
} from '../../scripts/lint-css-governance.mjs'

describe('design-system governance baseline', () => {
  it('does not add unmanaged Quasar, deep selector, important, or raw color usage', async () => {
    const result = await lintCssGovernance({
      repoRoot: process.cwd(),
    })

    expect(result.ok, JSON.stringify({
      exceededMetrics: result.exceededMetrics,
      deltas: result.deltas,
      samples: result.samples,
    }, null, 2)).toBe(true)
    expect(result.scannedFiles).toBeGreaterThanOrEqual(result.baseline.scannedFiles)
  })
})