import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

function readRepoFile(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')
}

describe('useBranding', () => {
  it('exposes brand colors through white-label CSS variable tokens', () => {
    const source = readRepoFile('../../../src/composables/ui/useBranding.ts')

    expect(source).toContain("computed<string>(() => 'var(--ntk-primary)')")
    expect(source).toContain("computed<string>(() => 'var(--ntk-secondary)')")
    expect(source).toContain("computed<string>(() => 'var(--ntk-accent)')")
    expect(source).not.toContain('theme.value.colors.primary')
    expect(source).not.toContain('theme.value.colors.secondary')
    expect(source).not.toContain('theme.value.colors.accent')
  })
})
