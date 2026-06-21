import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { DESIGN_TOKENS } from '../../../src/styles'

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
  it('uses Revolut as the exported design-token fallback instead of the legacy purple palette', () => {
    expect(DESIGN_TOKENS.colors.primary).toBe('#0f766e')
    expect(DESIGN_TOKENS.colors.primaryDark).toBe('#115e59')
    expect(DESIGN_TOKENS.colors.primaryLight).toBe('#2dd4bf')
    expect(DESIGN_TOKENS.colors.secondary).toBe('#0f766e')
    expect(DESIGN_TOKENS.colors.success).toBe('#10b981')
    expect(DESIGN_TOKENS.colors.info).toBe('#14b8a6')
    expect(DESIGN_TOKENS.gradients.primary).toBe('linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)')

    const stylesIndexSource = readRepoFile('../../../src/styles/index.ts')
    expect(stylesIndexSource).not.toContain("primary: '#512BD4'")
    expect(stylesIndexSource).not.toContain('#3B1F9E')
    expect(stylesIndexSource).not.toContain('#7B74D4')
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
