import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

function readRepoFile(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')
}

function readCssBlock(source: string, selector: string): string {
  const selectorIndex = source.indexOf(selector)

  if (selectorIndex < 0) {
    return ''
  }

  const blockStart = source.indexOf('{', selectorIndex)
  const blockEnd = source.indexOf('}', blockStart)

  if (blockStart < 0 || blockEnd < 0) {
    return ''
  }

  return source.slice(blockStart + 1, blockEnd)
}

describe('style token fallback palette', () => {
  it('keeps the styles entry free of duplicated token literals (anti-duplicity)', () => {
    const stylesIndexSource = readRepoFile('../../../src/styles/index.ts')

    // Values live only in the token sources; the TS entry must not restate
    // any color literal (the old DESIGN_TOKENS/CSS_VARS maps were removed).
    expect(stylesIndexSource).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    expect(stylesIndexSource).not.toContain('DESIGN_TOKENS')
    expect(stylesIndexSource).not.toContain('CSS_VARS')
  })

  it('keeps base CSS tokens Revolut-based and secondary token-driven', () => {
    const tokensSource = readRepoFile('../../../src/styles/tokens.scss')

    expect(tokensSource).toContain('--ntk-primary: #0f766e;')
    expect(tokensSource).toContain('--ntk-primary-dark: #115e59;')
    expect(tokensSource).toContain('--ntk-primary-light: #2dd4bf;')
    expect(tokensSource).toContain('--ntk-primary-rgb: 15, 118, 110;')
    expect(tokensSource).toContain('--ntk-secondary: var(--ntk-accent, #0f766e);')
    expect(tokensSource).toContain('--ntk-dark: #0f172a;')
    expect(tokensSource).toContain('--ntk-dark-page: var(--ntk-bg-secondary);')
    expect(tokensSource).not.toContain('--ntk-primary: #512BD4;')
    expect(tokensSource).not.toContain('--ntk-primary-dark: #3B1F9E;')
    expect(tokensSource).not.toContain('--ntk-primary-light: #7B74D4;')
  })

  it('bridges preset semantic and secondary aliases through active theme tokens', () => {
    const themesSource = readRepoFile('../../../src/styles/themes.css')
    const themeBridgeBlock = readCssBlock(themesSource, 'html[data-theme],')

    expect(themeBridgeBlock).toContain('--ntk-secondary: var(--ntk-accent);')
    expect(themeBridgeBlock).toContain('--ntk-secondary-dark: var(--ntk-accent-hover);')
    expect(themeBridgeBlock).toContain('--ntk-secondary-light: var(--ntk-primary-light);')

    for (const [semanticToken, presetToken] of [
      ['success', 'success'],
      ['warning', 'warning'],
      ['error', 'error'],
      ['info', 'info'],
    ] as const) {
      expect(themeBridgeBlock).toContain(`--semantic-${semanticToken}: var(--ntk-${presetToken});`)
      expect(themeBridgeBlock).toContain(`--semantic-${semanticToken}-primary: var(--ntk-${presetToken});`)
      expect(themeBridgeBlock).toContain(`--semantic-${semanticToken}-bg: color-mix(in srgb, var(--ntk-${presetToken})`)
      expect(themeBridgeBlock).toContain(`--semantic-${semanticToken}-text: color-mix(in srgb, var(--ntk-${presetToken})`)
    }

    expect(themesSource).toContain('--ntk-dark: #1a1a19;')
    expect(themesSource).toContain('--ntk-dark-page: #0e0e0d;')
  })
})