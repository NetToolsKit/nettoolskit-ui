import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { DsSelect } from '@/design-system/vue'

describe('DsSelect', () => {
  const options = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived', disabled: true },
  ]

  it('renders label, options, value, message, attributes, and recipe classes', () => {
    const wrapper = mount(DsSelect, {
      props: {
        id: 'release-status',
        testId: 'release-status-field',
        modelValue: 'published',
        name: 'releaseStatus',
        label: 'Release status',
        hint: 'Choose the publication state',
        placeholder: 'Select status',
        options,
        variant: 'filled',
        size: 'sm',
        intent: 'primary',
        required: true,
        class: ['custom-select'],
      },
    })

    const label = wrapper.get('label')
    const select = wrapper.get('select')
    const optionElements = wrapper.findAll('option')

    expect(label.attributes('for')).toBe('release-status__control')
    expect(label.attributes('data-testid')).toBe('release-status-field')
    expect(label.text()).toContain('Release status')
    expect(label.text()).toContain('Choose the publication state')
    expect(label.classes()).toEqual(expect.arrayContaining([
      'ntk-field',
      'ntk-field--variant-filled',
      'ntk-field--size-sm',
      'ntk-field--intent-primary',
      'ntk-field--is-required',
      'custom-select',
    ]))
    expect(select.attributes('id')).toBe('release-status__control')
    expect(select.attributes('name')).toBe('releaseStatus')
    expect(select.element.value).toBe('published')
    expect(select.attributes('aria-describedby')).toBe('release-status__description')
    expect(optionElements.map(option => option.text())).toEqual([
      'Select status',
      'Draft',
      'Published',
      'Archived',
    ])
    expect(optionElements[0]?.attributes('disabled')).toBeDefined()
    expect(optionElements[3]?.attributes('disabled')).toBeDefined()
  })

  it('emits string model updates and invalid state attributes', async () => {
    const wrapper = mount(DsSelect, {
      props: {
        id: 'locale',
        modelValue: 'en',
        invalid: true,
        errorMessage: 'Locale is required',
        options: [
          { label: 'English', value: 'en' },
          { label: 'Portuguese (Brazil)', value: 'pt-BR' },
        ],
      },
    })

    const select = wrapper.get('select')
    await select.setValue('pt-BR')

    expect(select.attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Locale is required')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['pt-BR'])
    expect(wrapper.get('label').classes()).toEqual(expect.arrayContaining([
      'ntk-field--is-invalid',
    ]))
  })

  it('renders disabled and readonly state classes without enabling selection', () => {
    const wrapper = mount(DsSelect, {
      props: {
        disabled: true,
        readonly: true,
        options,
      },
    })

    const select = wrapper.get('select')

    expect(select.attributes('disabled')).toBeDefined()
    expect(wrapper.get('label').classes()).toEqual(expect.arrayContaining([
      'ntk-field--is-disabled',
      'ntk-field--is-readonly',
    ]))
  })

  it('does not emit model updates while readonly', async () => {
    const wrapper = mount(DsSelect, {
      props: {
        modelValue: 'draft',
        readonly: true,
        options,
      },
    })

    const select = wrapper.get('select')
    await select.setValue('published')

    expect(select.attributes('aria-readonly')).toBe('true')
    expect(select.element.value).toBe('draft')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})