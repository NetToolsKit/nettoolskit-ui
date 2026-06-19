import { describe, expect, it } from 'vitest'

import {
  DEFAULT_THEME_DENSITY,
  DEFAULT_THEME_ID,
  normalizeResolvedTokenMap,
  validateThemeRuntimeModel,
} from '../../../../src/design-system/theme'

describe('theme runtime validation model', () => {
  it('normalizes valid theme, density, tenant, and resolved token input', () => {
    const result = validateThemeRuntimeModel({
      themeId: 'Tenant-Theme',
      density: 'compact',
      tenantId: 'Tenant_A',
      tokens: {
        '--ntk-primary': ' #0f766e ',
        '--ntk-control-height': '32px',
      },
    })

    expect(result.valid).toBe(true)
    expect(result.issues).toEqual([])
    expect(result.value).toEqual({
      themeId: 'tenant-theme',
      density: 'compact',
      tenantId: 'tenant_a',
      tokens: {
        '--ntk-primary': '#0f766e',
        '--ntk-control-height': '32px',
      },
    })
  })

  it('falls back to safe model defaults when identity fields are invalid', () => {
    const result = validateThemeRuntimeModel({
      themeId: '../theme',
      density: 'dense',
      tenantId: 'tenant<script>',
      tokens: {},
    })

    expect(result.valid).toBe(false)
    expect(result.value.themeId).toBe(DEFAULT_THEME_ID)
    expect(result.value.density).toBe(DEFAULT_THEME_DENSITY)
    expect(result.value.tenantId).toBeNull()
    expect(result.issues.map(issue => issue.code)).toEqual([
      'invalid_theme_id',
      'invalid_tenant_id',
      'invalid_density',
    ])
  })

  it('filters invalid token names and unsafe token values', () => {
    const result = normalizeResolvedTokenMap({
      '--ntk-primary': '#0f766e',
      '--Ntk-Primary': '#ef4444',
      '--ntk-danger': 'red; background: blue',
      '--ntk-bg-primary': null,
      '--ntk-spacing-md': '1rem',
    })

    expect(result.valid).toBe(false)
    expect(result.value).toEqual({
      '--ntk-primary': '#0f766e',
      '--ntk-spacing-md': '1rem',
    })
    expect(result.issues.map(issue => issue.code)).toEqual([
      'invalid_token_name',
      'invalid_token_value',
    ])
  })
})