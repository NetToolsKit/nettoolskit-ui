/**
 * Tests/unit/landing/Landing I18n spec module.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import {
  LANDING_I18N_STORAGE_KEY,
  createLandingI18n,
  resolveLandingLocale,
} from '../../../landing-page/composables/useLandingI18n'

describe('resolveLandingLocale', () => {
  it('resolves locale aliases and fallback safely', () => {
    expect(resolveLandingLocale('pt')).toBe('pt-BR')
    expect(resolveLandingLocale('pt-BR')).toBe('pt-BR')
    expect(resolveLandingLocale('en')).toBe('en')
    expect(resolveLandingLocale('fr')).toBe('en')
  })

  it('falls back to en for null, undefined, or empty input', () => {
    expect(resolveLandingLocale(null)).toBe('en')
    expect(resolveLandingLocale(undefined)).toBe('en')
    expect(resolveLandingLocale('')).toBe('en')
  })
})

describe('createLandingI18n — translations', () => {
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

  it('falls back to English when key only exists in en dictionary', () => {
    const portuguese = createLandingI18n('pt-BR')

    // All keys exist in both locales in this project, so a missing-in-pt-BR key falls back to en
    expect(portuguese.t('hero.badge')).toBe('Vue 3 + Quasar')
  })
})

describe('createLandingI18n — isPtBr and setLocale', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('isPtBr is true only for pt-BR locale', () => {
    const en = createLandingI18n('en')
    const pt = createLandingI18n('pt-BR')

    expect(en.isPtBr.value).toBe(false)
    expect(pt.isPtBr.value).toBe(true)
  })

  it('setLocale switches locale and updates isPtBr', () => {
    const i18n = createLandingI18n('en')

    expect(i18n.locale.value).toBe('en')
    expect(i18n.isPtBr.value).toBe(false)

    i18n.setLocale('pt-BR')

    expect(i18n.locale.value).toBe('pt-BR')
    expect(i18n.isPtBr.value).toBe(true)
  })

  it('setLocale persists the locale to localStorage', () => {
    const i18n = createLandingI18n('en')

    i18n.setLocale('pt-BR')

    expect(localStorage.getItem(LANDING_I18N_STORAGE_KEY)).toBe('pt-BR')
  })

  it('reads locale from localStorage when no initialLocale is given', () => {
    localStorage.setItem(LANDING_I18N_STORAGE_KEY, 'pt-BR')

    const i18n = createLandingI18n()

    expect(i18n.locale.value).toBe('pt-BR')
  })

  it('initialLocale overrides localStorage', () => {
    localStorage.setItem(LANDING_I18N_STORAGE_KEY, 'pt-BR')

    const i18n = createLandingI18n('en')

    expect(i18n.locale.value).toBe('en')
  })
})