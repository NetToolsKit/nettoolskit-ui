import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import {
  designTokenResolver,
  designTokenCssVariables,
  designTokenValues,
  designTokens,
  designTokensByCssVariable,
} from '../../../../src/design-system/tokens/generated/tokens'
import tokenSource from '../../../../src/design-system/tokens/source.json'
import {
  generateDtsTokenMap,
  generateCssCustomProperties,
  generateResolverJson,
  generateTsTokenMap,
  resolveTokens,
  validateTokenSource,
} from '../../../../scripts/token-build.mjs'

function readRepoFile(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')
}

function cloneSource<T>(source: T): T {
  return JSON.parse(JSON.stringify(source)) as T
}

describe('DTCG token build pipeline', () => {
  it('validates the source token contract and preserves --ntk-* custom property names', () => {
    const validation = validateTokenSource(tokenSource)

    if (!validation.valid) {
      throw new Error(validation.errors.join('\n'))
    }

    expect(validation.tokens.length).toBeGreaterThan(20)
    expect(validation.tokens.every(token => token.cssVariable.startsWith('--ntk-'))).toBe(true)
    expect(validation.tokens.find(token => token.path === 'color.primary')?.cssVariable).toBe('--ntk-primary')
    expect(validation.tokens.find(token => token.path === 'surface.bgPrimary')?.cssVariable).toBe('--ntk-bg-primary')
    expect(validation.tokens.find(token => token.path === 'typography.fontSize.text2xl')?.cssVariable).toBe('--ntk-text-2xl')
  })

  it('resolves DTCG references while keeping CSS output token-driven', () => {
    const resolvedTokens = new Map(resolveTokens(tokenSource).map(token => [token.path, token]))

    expect(resolvedTokens.get('color.accent')).toMatchObject({
      value: '#0f766e',
      cssValue: 'var(--ntk-primary)',
      cssVariable: '--ntk-accent',
    })
    expect(resolvedTokens.get('surface.bgActive')).toMatchObject({
      value: 'rgba(15, 118, 110, 0.08)',
      cssValue: 'rgba(var(--ntk-primary-rgb), 0.08)',
      cssVariable: '--ntk-bg-active',
    })
    expect(resolvedTokens.get('gradient.primary')).toMatchObject({
      value: 'linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)',
      cssValue: 'linear-gradient(135deg, var(--ntk-primary-gradient-start) 0%, var(--ntk-primary-gradient-end) 100%)',
      cssVariable: '--ntk-primary-gradient',
    })

    const css = generateCssCustomProperties(tokenSource)
    expect(css).toContain('--ntk-accent: var(--ntk-primary);')
    expect(css).toContain('--ntk-bg-active: rgba(var(--ntk-primary-rgb), 0.08);')
    expect(css).toContain('--ntk-primary-gradient: linear-gradient(135deg, var(--ntk-primary-gradient-start) 0%, var(--ntk-primary-gradient-end) 100%);')
  })

  it('exports generated TypeScript maps by path and CSS variable', () => {
    expect(designTokenValues['color.primary']).toBe('#0f766e')
    expect(designTokenValues['color.accent']).toBe('#0f766e')
    expect(designTokenCssVariables['color.primary']).toBe('--ntk-primary')
    expect(designTokensByCssVariable['--ntk-primary']).toBe('color.primary')
    expect(designTokens['surface.bgActive']).toMatchObject({
      rawValue: 'rgba({color.primaryRgb}, 0.08)',
      value: 'rgba(15, 118, 110, 0.08)',
      cssValue: 'rgba(var(--ntk-primary-rgb), 0.08)',
    })
    expect(designTokenResolver.tokens['surface.bgActive']).toMatchObject({
      group: 'surface',
      references: ['color.primaryRgb'],
      cssVariable: '--ntk-bg-active',
    })
    expect(designTokenResolver.cssVariables['--ntk-bg-active']).toBe('surface.bgActive')
    expect(designTokenResolver.contexts.theme.tokens).toContain('color.primary')
    expect(designTokenResolver.contexts.density.tokens).toContain('spacing.md')
    expect(designTokenResolver.contexts.contrast.tokens).toContain('text.primary')
    expect(designTokenResolver.contexts.motion.tokens).toContain('motion.fast')
  })

  it('rejects missing references, circular references, and non-ntk CSS names', () => {
    const invalidNameSource = {
      color: {
        primary: {
          $type: 'color',
          $value: '#0f766e',
          $extensions: {
            nettoolskit: {
              cssVariable: '--bad-primary',
            },
          },
        },
      },
    }
    const invalidName = validateTokenSource(invalidNameSource)

    expect(invalidName.valid).toBe(false)
    expect(invalidName.errors.some(error => error.includes('must preserve --ntk-* naming'))).toBe(true)

    const missingReferenceSource = cloneSource(tokenSource)
    missingReferenceSource.color.accent.$value = '{color.notFound}'
    const missingReference = validateTokenSource(missingReferenceSource)

    expect(missingReference.valid).toBe(false)
    expect(missingReference.errors.some(error => error.includes('references unknown token color.notFound'))).toBe(true)

    const circularReferenceSource = cloneSource(tokenSource)
    circularReferenceSource.color.accent.$value = '{color.secondary}'
    circularReferenceSource.color.secondary.$value = '{color.accent}'
    const circularReference = validateTokenSource(circularReferenceSource)

    expect(circularReference.valid).toBe(false)
    expect(circularReference.errors.some(error => error.includes('Circular token reference detected'))).toBe(true)
  })

  it('keeps generated CSS and TypeScript outputs synchronized with the source', () => {
    expect(generateCssCustomProperties(tokenSource)).toBe(readRepoFile('../../../../src/design-system/tokens/generated.css'))
    expect(generateTsTokenMap(tokenSource)).toBe(readRepoFile('../../../../src/design-system/tokens/generated.ts'))
    expect(generateCssCustomProperties(tokenSource)).toBe(readRepoFile('../../../../src/design-system/tokens/generated/tokens.css'))
    expect(generateTsTokenMap(tokenSource)).toBe(readRepoFile('../../../../src/design-system/tokens/generated/tokens.ts'))
    expect(generateDtsTokenMap(tokenSource)).toBe(readRepoFile('../../../../src/design-system/tokens/generated/tokens.d.ts'))
    expect(generateResolverJson(tokenSource)).toBe(readRepoFile('../../../../src/design-system/tokens/resolver.json'))
  })
})