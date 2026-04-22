import { beforeEach, describe, expect, it } from 'vitest'

import { applyEffects, effects } from '../../../src/config/visual/effects.config'

const staleLegacyGradientColors = [
  '#0D47A1',
  '#1976D2',
  '#03A9F4',
  '#0288D1',
  '#4A9B7F',
  '#388E3C',
  '#FFE082',
  '#8BC34A',
  '#689F38',
  '#667eea',
  '#764ba2',
  '#512BD4',
  '#7B1FA2',
  '#7B74D4',
  '#5E35B1',
  '#607D8B',
  '#455A64',
]

function expectNoStaleLegacyGradientColors(value: string): void {
  const lowerValue = value.toLowerCase()

  for (const color of staleLegacyGradientColors) {
    expect(lowerValue).not.toContain(color.toLowerCase())
  }
}

describe('visual effects fallback gradients', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style')
  })

  it('keeps legacy effect presets wired to white-label gradient tokens', () => {
    for (const config of Object.values(effects)) {
      for (const value of Object.values(config.gradients)) {
        expect(value).toContain('var(--ntk-')
        expectNoStaleLegacyGradientColors(value)
      }
    }
  })

  it('applies tokenized gradients instead of stale legacy brand gradients', () => {
    for (const config of Object.values(effects)) {
      document.documentElement.removeAttribute('style')

      applyEffects(config)

      const rootStyle = document.documentElement.style
      expect(rootStyle.getPropertyValue('--ntk-gradient-primary')).toContain('var(--ntk-primary-gradient')
      expect(rootStyle.getPropertyValue('--ntk-gradient-accent')).toContain('var(--ntk-primary-gradient-start')
      expect(rootStyle.getPropertyValue('--ntk-gradient-overlay')).toContain('var(--ntk-primary-rgb')
      expect(rootStyle.getPropertyValue('--ntk-gradient-glass')).toContain('var(--ntk-surface-overlay')

      for (const key of Object.keys(config.gradients)) {
        expectNoStaleLegacyGradientColors(rootStyle.getPropertyValue(`--ntk-gradient-${key}`))
      }
    }
  })
})
