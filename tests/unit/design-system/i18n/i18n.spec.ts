/**
 * Library i18n — pure dictionaries + reactive locale switching.
 * Default locale is pt-BR (NTK-FE-STD-002); `en` is the key-coverage source.
 * Per-component label props must always win over the dictionary.
 */

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import {
  DEFAULT_NTK_LOCALE,
  ntkLocales,
  ntkMessages,
  requiredRule,
  resolveNtkMessage,
  formatNtkMessage,
  minLengthRule,
} from '@/design-system/core'
import { DsForm, DsTable, getNtkLocale, setNtkLocale, useNtkI18n } from '@/design-system/vue'

afterEach(() => {
  setNtkLocale(DEFAULT_NTK_LOCALE)
})

describe('core i18n dictionaries (pure)', () => {
  it('covers every en key in every locale', () => {
    const enKeys = Object.keys(ntkMessages.en).sort()
    for (const locale of ntkLocales) {
      expect(Object.keys(ntkMessages[locale]).sort()).toEqual(enKeys)
    }
  })

  it('resolves by locale and interpolates placeholders', () => {
    expect(resolveNtkMessage('pt-BR', 'crud.new')).toBe('Novo')
    expect(resolveNtkMessage('en', 'crud.new')).toBe('New')
    expect(resolveNtkMessage('en', 'validation.minLength', { min: 3 }))
      .toBe('Use at least 3 characters')
    expect(formatNtkMessage('keep {unknown}', {})).toBe('keep {unknown}')
  })

  it('localizes validation rule defaults at evaluation time', () => {
    const rule = requiredRule()
    expect(rule('')).toBe('Preencha este campo')

    setNtkLocale('en')
    expect(rule('')).toBe('Fill in this field')
    expect(minLengthRule(5)('abc')).toBe('Use at least 5 characters')
  })
})

describe('component built-in labels (reactive locale)', () => {
  it('DsForm actions follow the locale and switch at runtime', async () => {
    const wrapper = mount(DsForm, {
      props: { schema: { fields: [{ field: 'name', type: 'text' }] } },
    })

    expect(wrapper.text()).toContain('Salvar')
    expect(wrapper.text()).toContain('Limpar')

    setNtkLocale('en')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.text()).toContain('Clear')
  })

  it('DsTable empty/boolean strings follow the locale', async () => {
    const wrapper = mount(DsTable, {
      props: {
        columns: [{ id: 'active', label: 'Active' }],
        rows: [{ id: 'r1', cells: { active: true } }],
      },
    })

    expect(wrapper.text()).toContain('Sim')

    setNtkLocale('en')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Yes')
  })

  it('an explicit label prop always overrides the dictionary', async () => {
    const wrapper = mount(DsForm, {
      props: {
        schema: { fields: [{ field: 'name', type: 'text' }] },
        submitLabel: 'Enviar agora',
      },
    })

    setNtkLocale('en')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Enviar agora')
    expect(wrapper.text()).not.toContain('Save')
  })

  it('useNtkI18n exposes the reactive locale', () => {
    const { locale, t } = useNtkI18n()
    expect(locale.value).toBe('pt-BR')
    expect(getNtkLocale()).toBe('pt-BR')
    expect(t('dialog.close')).toBe('Fechar')

    setNtkLocale('en')
    expect(locale.value).toBe('en')
    expect(getNtkLocale()).toBe('en')
    expect(t('dialog.close')).toBe('Close')
  })
})