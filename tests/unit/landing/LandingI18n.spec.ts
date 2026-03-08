/**
 * Tests/unit/landing/Landing I18n spec module.
 */
import { describe, expect, it } from 'vitest'
import { createLandingI18n, resolveLandingLocale } from '../../../landing-page/composables/useLandingI18n'

describe('landing.i18n', () => {
  it('resolves locale aliases and fallback safely', () => {
    expect(resolveLandingLocale('pt')).toBe('pt-BR')
    expect(resolveLandingLocale('pt-BR')).toBe('pt-BR')
    expect(resolveLandingLocale('en')).toBe('en')
    expect(resolveLandingLocale('fr')).toBe('en')
  })

  it('translates header and hero copy by selected locale', () => {
    const english = createLandingI18n('en')
    const portuguese = createLandingI18n('pt-BR')

    expect(english.t('header.nav.features')).toBe('Features')
    expect(english.t('hero.primaryCta')).toBe('Get Started')
    expect(portuguese.t('header.nav.features')).toBe('Recursos')
    expect(portuguese.t('hero.primaryCta')).toBe('Comecar')
  })

  it('falls back to key when translation path is unknown', () => {
    const i18n = createLandingI18n('en')
    expect(i18n.t('unknown.translation.key')).toBe('unknown.translation.key')
  })
})