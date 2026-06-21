/**
 * Tests/unit/modules/cms/White Label I18n spec module.
 */
import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  applyCmsLocalePreset,
  createLocalizedContentDefaults,
  getCmsLocalePack,
  resolveCmsLocale,
} from '../../../../src/modules/cms/white-label/i18n'

describe('white-label.i18n', () => {
  it('resolves locale aliases safely', () => {
    expect(resolveCmsLocale('pt')).toBe('pt-BR')
    expect(resolveCmsLocale('pt-BR')).toBe('pt-BR')
    expect(resolveCmsLocale('EN')).toBe('en')
    expect(resolveCmsLocale('es')).toBe('en')
  })

  it('builds localized content defaults with locale id', () => {
    const defaultsEn = createLocalizedContentDefaults('en')
    const defaultsPt = createLocalizedContentDefaults('pt-BR')

    expect(defaultsEn.locale).toBe('en')
    expect(defaultsEn.tabColorsLabel).toBe('Colors')
    expect(defaultsPt.locale).toBe('pt-BR')
    expect(defaultsPt.tabColorsLabel).toBe('Cores')
  })

  it('applies locale preset to shell labels and content copy', () => {
    const settings = createDefaultWhiteLabelSettings()
    const originalThemeValue = settings.theme.pageBackground

    const appliedLocale = applyCmsLocalePreset(settings, 'pt-BR')
    const localePack = getCmsLocalePack(appliedLocale)

    expect(appliedLocale).toBe('pt-BR')
    expect(settings.content.locale).toBe('pt-BR')
    expect(settings.content.statusTitle).toBe(localePack.content.statusTitle)
    expect(settings.layout.searchPlaceholder).toBe(localePack.searchPlaceholder)
    expect(settings.items.find(item => item.id === 'settings')?.label).toBe(localePack.items.settings.label)
    expect(settings.navGroups.find(group => group.id === 'configuration')?.label).toBe(localePack.navGroups.configuration)
    expect(settings.theme.pageBackground).toBe(originalThemeValue)
  })
})