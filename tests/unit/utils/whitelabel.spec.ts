import { beforeEach, describe, expect, it } from 'vitest'

import {
  REFERENCE_WHITELABEL_STORAGE_KEY,
  createReferenceWhitelabelStyleVars,
  listReferenceWhitelabelPresets,
  loadStoredReferenceWhitelabelPreset,
  persistReferenceWhitelabelPreset,
  resolveReferenceWhitelabelPreset,
} from '../../../src/whitelabel/runtime'

describe('listReferenceWhitelabelPresets', () => {
  it('returns all available presets', () => {
    const presets = listReferenceWhitelabelPresets()

    expect(presets.length).toBeGreaterThanOrEqual(3)
    expect(presets.every(p => p.id && p.label && p.palette)).toBe(true)
  })

  it('returns a copy — mutating the result does not affect the source', () => {
    const a = listReferenceWhitelabelPresets()
    const b = listReferenceWhitelabelPresets()

    a.push({} as any)

    expect(b.length).toBe(a.length - 1)
  })
})

describe('resolveReferenceWhitelabelPreset', () => {
  it('returns the first preset when no id is given', () => {
    const first = listReferenceWhitelabelPresets()[0]

    expect(resolveReferenceWhitelabelPreset()).toEqual(first)
    expect(resolveReferenceWhitelabelPreset(null)).toEqual(first)
    expect(resolveReferenceWhitelabelPreset(undefined)).toEqual(first)
  })

  it('resolves a known preset id', () => {
    const preset = resolveReferenceWhitelabelPreset('reference-light')

    expect(preset.id).toBe('reference-light')
    expect(preset.label).toBe('Reference Light')
  })

  it('resolves reference-night preset', () => {
    const preset = resolveReferenceWhitelabelPreset('reference-night')

    expect(preset.id).toBe('reference-night')
  })

  it('resolves reference-graphite preset', () => {
    const preset = resolveReferenceWhitelabelPreset('reference-graphite')

    expect(preset.id).toBe('reference-graphite')
  })

  it('falls back to the first preset for an unknown id', () => {
    const first = listReferenceWhitelabelPresets()[0]
    const result = resolveReferenceWhitelabelPreset('nonexistent-preset-id')

    expect(result).toEqual(first)
  })
})

describe('createReferenceWhitelabelStyleVars', () => {
  const preset = resolveReferenceWhitelabelPreset('reference-light')
  const vars = createReferenceWhitelabelStyleVars(preset)
  const derivedLeakProneKeys = [
    '--ntk-template-layout-header-shadow',
    '--ntk-template-layout-nav-text',
    '--ntk-template-layout-nav-hover-bg',
    '--ntk-template-layout-nav-active-text',
    '--ntk-template-layout-nav-group-text',
    '--ntk-template-login-brand-subtitle',
    '--ntk-template-login-brand-feature-text',
    '--ntk-template-login-brand-feature-bg',
    '--ntk-template-login-brand-footer',
    '--ntk-template-profile-avatar-shadow',
    '--ntk-reference-badge-bg',
    '--ntk-reference-shell-chrome-border',
    '--ntk-reference-shell-glow',
    '--ntk-template-horizontal-link-hover-color',
    '--ntk-template-horizontal-link-active-color',
  ] as const

  it('maps palette colors to CSS custom properties', () => {
    expect(vars['--ntk-primary']).toBe(preset.palette.primary)
    expect(vars['--ntk-primary-dark']).toBe(preset.palette.primaryDark)
    expect(vars['--ntk-primary-light']).toBe(preset.palette.primaryLight)
    expect(vars['--ntk-accent']).toBe(preset.palette.accent)
    expect(vars['--ntk-bg-primary']).toBe(preset.palette.background)
    expect(vars['--ntk-text-primary']).toBe(preset.palette.text)
    expect(vars['--ntk-border-color']).toBe(preset.palette.border)
    expect(vars['--ntk-success']).toBe(preset.palette.success)
    expect(vars['--ntk-error']).toBe(preset.palette.error)
  })

  it('maps typography tokens', () => {
    expect(vars['--ntk-font-family']).toBe(preset.typography.body)
    expect(vars['--ntk-font-family-display']).toBe(preset.typography.display)
  })

  it('maps radius tokens', () => {
    expect(vars['--ntk-radius-sm']).toBe(preset.radius.sm)
    expect(vars['--ntk-radius-md']).toBe(preset.radius.md)
    expect(vars['--ntk-radius-lg']).toBe(preset.radius.lg)
    expect(vars['--ntk-radius-pill']).toBe(preset.radius.pill)
  })

  it('maps shadow tokens', () => {
    expect(vars['--ntk-shadow-soft']).toBe(preset.shadow.soft)
    expect(vars['--ntk-shadow-md']).toBe(preset.shadow.medium)
    expect(vars['--ntk-shadow-lg']).toBe(preset.shadow.strong)
  })

  it('maps gradient tokens', () => {
    expect(vars['--ntk-gradient-hero']).toBe(preset.gradients.hero)
    expect(vars['--ntk-gradient-accent']).toBe(preset.gradients.accent)
    expect(vars['--ntk-primary-gradient']).toBe(preset.gradients.accent)
  })

  it('maps brand identity tokens', () => {
    expect(vars['--reference-brand-name']).toBe(preset.brand.name)
    expect(vars['--reference-brand-subtitle']).toBe(preset.brand.subtitle)
    expect(vars['--reference-brand-kicker']).toBe(preset.brand.kicker)
  })

  it('maps template-scoped page tokens', () => {
    expect(vars['--ntk-template-page-bg']).toBe(preset.palette.background)
    expect(vars['--ntk-template-page-card-bg']).toBe(preset.palette.surface)
    expect(vars['--ntk-template-page-title']).toBe(preset.palette.text)
  })

  it('routes shell contrast through stable token aliases', () => {
    expect(vars['--ntk-text-on-accent']).toBe(preset.palette.surface)
    expect(vars['--ntk-template-layout-nav-active-text']).toBe('var(--ntk-text-on-accent)')
    expect(vars['--ntk-template-horizontal-link-hover-color']).toBe('var(--ntk-text-on-accent)')
    expect(vars['--ntk-template-horizontal-link-active-color']).toBe('var(--ntk-text-on-accent)')
    expect(vars['--ntk-template-login-brand-text']).toBe('var(--ntk-text-light)')
  })

  it('keeps the derived composer tokens free of literal white and rgba leaks', () => {
    for (const candidatePreset of listReferenceWhitelabelPresets()) {
      const candidateVars = createReferenceWhitelabelStyleVars(candidatePreset)

      for (const key of derivedLeakProneKeys) {
        const value = String(candidateVars[key] ?? '')

        expect(value).not.toContain('#ffffff')
        expect(value).not.toContain('rgba(')
      }
    }
  })

  it('derives translucent tokens with deterministic color-mix expressions', () => {
    expect(String(vars['--ntk-template-layout-header-shadow'])).toContain('color-mix(in srgb,')
    expect(String(vars['--ntk-template-login-brand-subtitle'])).toContain('color-mix(in srgb,')
    expect(String(vars['--ntk-reference-shell-glow'])).toContain('color-mix(in srgb,')
    expect(String(vars['--ntk-reference-badge-bg'])).toContain('var(--ntk-bg-card)')
  })
})

describe('loadStoredReferenceWhitelabelPreset / persistReferenceWhitelabelPreset', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when nothing is stored', () => {
    expect(loadStoredReferenceWhitelabelPreset()).toBeNull()
  })

  it('persists a preset id and loads it back', () => {
    persistReferenceWhitelabelPreset('reference-night')

    expect(loadStoredReferenceWhitelabelPreset()).toBe('reference-night')
  })

  it('uses the correct storage key', () => {
    persistReferenceWhitelabelPreset('reference-graphite')

    expect(localStorage.getItem(REFERENCE_WHITELABEL_STORAGE_KEY)).toBe('reference-graphite')
  })

  it('overwrites a previously stored preset', () => {
    persistReferenceWhitelabelPreset('reference-light')
    persistReferenceWhitelabelPreset('reference-night')

    expect(loadStoredReferenceWhitelabelPreset()).toBe('reference-night')
  })
})
