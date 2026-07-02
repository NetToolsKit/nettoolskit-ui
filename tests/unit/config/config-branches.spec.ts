/**
 * Branch matrix for the config layer: semantic-color override resolution
 * (?? fallback chains), theme-dom option permutations, and compat adapters.
 */

import { afterEach, describe, expect, it } from 'vitest'

import {
  resetSemanticColors,
  semanticColors,
  setSemanticColors,
} from '../../../src/config/colors/semantic.config'

const initialInfoPrimary = semanticColors.infoPrimary
import { registerThemeDarkSync, syncThemeDomState } from '../../../src/config/theme/theme-dom'
import {
  resolveNtkButtonVueCompatProps,
  resolveNtkCardVueCompatProps,
  resolveNtkFieldVueCompatProps,
} from '../../../src/design-system/vue/compatibility'

afterEach(() => {
  resetSemanticColors()
  registerThemeDarkSync(null)
  document.documentElement.removeAttribute('style')
  document.documentElement.removeAttribute('data-theme')
  document.body.removeAttribute('data-theme')
  delete document.body.dataset.ntkTemplateTheme
})

describe('semantic color overrides', () => {
  it('derives borders and positive/negative from the primary when not overridden', () => {
    const resolved = setSemanticColors({ successPrimary: '#0f0', errorPrimary: '#f00' })

    expect(resolved.successBorder).toBeDefined()
    expect(resolved.positive).toBeDefined()
    expect(resolved.negative).toBeDefined()
    expect(semanticColors.successPrimary).toBe('#0f0')
  })

  it('honors explicit border/positive overrides over the derived values', () => {
    const resolved = setSemanticColors({
      successPrimary: '#0f0',
      successBorder: '#00ff99',
      positive: '#00cc00',
    })

    expect(resolved.successBorder).toBe('#00ff99')
    expect(resolved.positive).toBe('#00cc00')
  })

  it('resetSemanticColors restores the defaults', () => {
    setSemanticColors({ infoPrimary: '#00f' })
    expect(semanticColors.infoPrimary).toBe('#00f')
    const reset = resetSemanticColors()
    expect(reset.infoPrimary).toBe(initialInfoPrimary)
  })
})

describe('theme-dom option permutations', () => {
  it('honors explicit structural colors and presetId=null clears the attribute', () => {
    document.documentElement.dataset.theme = 'warp'
    syncThemeDomState({
      dark: false,
      structuralBackground: 'rgb(1, 2, 3)',
      structuralText: 'rgb(4, 5, 6)',
      presetId: null,
      templateScope: false,
    })

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    expect(document.documentElement.style.backgroundColor).toBe('rgb(1, 2, 3)')
    expect(document.documentElement.style.color).toBe('rgb(4, 5, 6)')
    expect(document.body.dataset.ntkTemplateTheme).toBeUndefined()
  })

  it('applies themeVars, removing entries whose value is null', () => {
    document.documentElement.style.setProperty('--ntk-test-var', 'keep')
    syncThemeDomState({
      dark: true,
      themeVars: { '--ntk-test-var': null, '--ntk-other-var': '#123456' },
      presetId: 'claude',
      templateScope: true,
    })

    const style = document.documentElement.style
    expect(style.getPropertyValue('--ntk-test-var')).toBe('')
    expect(style.getPropertyValue('--ntk-other-var')).toBe('#123456')
    expect(document.documentElement.dataset.theme).toBe('claude')
    expect(document.body.dataset.ntkTemplateTheme).toBe('true')
  })
})

describe('vue compat adapters', () => {
  it('maps every button variant to its Quasar-flag combination', () => {
    expect(resolveNtkButtonVueCompatProps({ variant: 'solid' })).toMatchObject({ unelevated: true })
    expect(resolveNtkButtonVueCompatProps({ variant: 'soft' })).toMatchObject({ flat: true, unelevated: true })
    expect(resolveNtkButtonVueCompatProps({ variant: 'outline' })).toMatchObject({ outline: true })
    expect(resolveNtkButtonVueCompatProps({ variant: 'ghost' })).toMatchObject({ flat: true })
    expect(resolveNtkButtonVueCompatProps({ variant: 'link' })).toMatchObject({ flat: true, unelevated: true })
    expect(resolveNtkButtonVueCompatProps({ variant: 'plain' })).toMatchObject({ flat: true })

    const defaults = resolveNtkButtonVueCompatProps()
    expect(defaults.size).toBe('md')
    expect(defaults.color).toBe('primary')
    expect(defaults.class.length).toBeGreaterThan(0)
  })

  it('maps field variants and derives dense from the sm size', () => {
    expect(resolveNtkFieldVueCompatProps({ variant: 'outlined' })).toMatchObject({ outlined: true, filled: false })
    expect(resolveNtkFieldVueCompatProps({ variant: 'filled' })).toMatchObject({ outlined: false, filled: true })
    expect(resolveNtkFieldVueCompatProps({ variant: 'plain' })).toMatchObject({ outlined: false, filled: false })
    expect(resolveNtkFieldVueCompatProps({ size: 'sm' }).dense).toBe(true)
    expect(resolveNtkFieldVueCompatProps({ size: 'md' }).dense).toBe(false)
  })

  it('maps the neutral card intent to no accent and keeps the others', () => {
    expect(resolveNtkCardVueCompatProps({ intent: 'neutral' }).accentColor).toBeUndefined()
    expect(resolveNtkCardVueCompatProps({ intent: 'danger' }).accentColor).toBe('danger')
    expect(resolveNtkCardVueCompatProps().variant).toBeDefined()
  })
})