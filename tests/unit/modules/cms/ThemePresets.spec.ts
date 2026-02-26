import { describe, expect, it } from 'vitest'
import { APP_SHELL_DEFAULT_THEME } from '../../../../src/components/layout/app-shell.config'
import {
  CMS_THEME_BASE_PRESET_IDS,
  CMS_THEME_PRESET_IDS,
  buildCmsThemePresets,
  detectCmsThemePresetId,
  isCmsThemeBasePresetId,
  isCmsThemePresetId,
} from '../../../../landing-page/cms/theme-presets'

describe('theme-presets', () => {
  it('validates preset id helpers for known and unknown values', () => {
    for (const presetId of CMS_THEME_PRESET_IDS) {
      expect(isCmsThemePresetId(presetId)).toBe(true)
    }
    for (const presetId of CMS_THEME_BASE_PRESET_IDS) {
      expect(isCmsThemeBasePresetId(presetId)).toBe(true)
    }

    expect(isCmsThemePresetId('unknown')).toBe(false)
    expect(isCmsThemeBasePresetId('custom')).toBe(false)
  })

  it('builds presets and detects default preset from default theme', () => {
    const presets = buildCmsThemePresets(APP_SHELL_DEFAULT_THEME)
    const detected = detectCmsThemePresetId(APP_SHELL_DEFAULT_THEME, presets, APP_SHELL_DEFAULT_THEME)

    expect(presets.length).toBeGreaterThanOrEqual(6)
    expect(detected).toBe('default')
  })

  it('detects custom preset when theme diverges from known presets', () => {
    const presets = buildCmsThemePresets(APP_SHELL_DEFAULT_THEME)
    const detected = detectCmsThemePresetId(
      {
        ...APP_SHELL_DEFAULT_THEME,
        itemActiveColor: '#123abc',
      },
      presets,
      APP_SHELL_DEFAULT_THEME
    )

    expect(detected).toBe('custom')
  })
})