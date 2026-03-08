/**
 * Tests/unit/modules/cms/Localized Content spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  applyCmsLocalizedPropsUpdate,
  applyCmsLocalizedTextUpdate,
  normalizeCmsPageBlockLocalizationSettings,
  normalizeCmsPageLocalizationSettings,
  normalizeCmsPageSectionLocalizationSettings,
  resolveCmsLocalizedProps,
  resolveCmsLocalizedText,
} from '../../../../src/modules/cms/white-label/localized-content'

describe('localized-content', () => {
  it('resolves localized text with fallback to base authored value', () => {
    expect(resolveCmsLocalizedText({
      baseValue: 'Main Landing',
      localized: { 'pt-BR': 'Landing Principal' },
      localeInput: 'pt-BR',
    })).toBe('Landing Principal')

    expect(resolveCmsLocalizedText({
      baseValue: 'Main Landing',
      localized: { 'pt-BR': 'Landing Principal' },
      localeInput: 'en',
    })).toBe('Main Landing')
  })

  it('deep merges localized props over base block props', () => {
    const resolved = resolveCmsLocalizedProps({
      baseProps: {
        title: 'Build faster',
        primaryAction: {
          label: 'Start editing',
          href: '#installation',
        },
      },
      localized: {
        'pt-BR': {
          title: 'Monte mais rapido',
          primaryAction: {
            label: 'Comecar edicao',
          },
        },
      },
      localeInput: 'pt-BR',
    })

    expect(resolved).toEqual({
      title: 'Monte mais rapido',
      primaryAction: {
        label: 'Comecar edicao',
        href: '#installation',
      },
    })
  })

  it('writes english edits into base values and pt-BR edits into localized maps', () => {
    const english = applyCmsLocalizedTextUpdate({
      baseValue: 'Main Landing',
      localized: { 'pt-BR': 'Landing Principal' },
      localeInput: 'en',
      nextValue: 'Landing Home',
    })

    expect(english.baseValue).toBe('Landing Home')
    expect(english.localized).toEqual({ 'pt-BR': 'Landing Principal' })

    const portuguese = applyCmsLocalizedPropsUpdate({
      baseProps: { title: 'Build faster' },
      localized: undefined,
      localeInput: 'pt-BR',
      nextValue: { title: 'Monte mais rapido' },
    })

    expect(portuguese.baseProps).toEqual({ title: 'Build faster' })
    expect(portuguese.localized).toEqual({
      'pt-BR': { title: 'Monte mais rapido' },
    })
  })

  it('normalizes malformed localization payloads safely', () => {
    expect(normalizeCmsPageLocalizationSettings({
      title: {
        en: 'Landing',
        other: 'ignored',
      },
      description: 'invalid',
    })).toEqual({
      title: {
        en: 'Landing',
      },
    })

    expect(normalizeCmsPageSectionLocalizationSettings({
      label: {
        'pt-BR': 'Hero',
      },
    })).toEqual({
      label: {
        'pt-BR': 'Hero',
      },
    })

    expect(normalizeCmsPageBlockLocalizationSettings({
      props: {
        'pt-BR': {
          title: 'Ola',
        },
        en: 'invalid',
      },
    })).toEqual({
      props: {
        'pt-BR': {
          title: 'Ola',
        },
      },
    })
  })
})