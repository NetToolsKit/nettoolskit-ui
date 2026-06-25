import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {
  DsCard,
  DsInput,
} from '@/design-system/vue'

describe('DsCard', () => {
  it('renders titles, slots, attributes, and recipe classes', () => {
    const wrapper = mount(DsCard, {
      props: {
        id: 'summary-card',
        testId: 'summary',
        title: 'Release summary',
        subtitle: 'Ready for review',
        variant: 'accent-left',
        size: 'lg',
        intent: 'info',
        selected: true,
        class: ['custom-card'],
      },
      slots: {
        default: '<p>Snapshot ready</p>',
        footer: '<button type="button">Open</button>',
      },
    })

    const card = wrapper.get('article')

    expect(card.attributes('id')).toBe('summary-card')
    expect(card.attributes('data-testid')).toBe('summary')
    expect(card.attributes('aria-selected')).toBeUndefined()
    expect(card.text()).toContain('Release summary')
    expect(card.text()).toContain('Ready for review')
    expect(card.text()).toContain('Snapshot ready')
    expect(card.classes()).toEqual(expect.arrayContaining([
      'ntk-card',
      'ntk-card--variant-accent-left',
      'ntk-card--size-lg',
      'ntk-card--intent-info',
      'ntk-card--is-selected',
      'custom-card',
    ]))
  })

  it('emits click from keyboard only when clickable', async () => {
    const wrapper = mount(DsCard, {
      props: {
        clickable: true,
      },
    })

    const card = wrapper.get('article')
    await card.trigger('keydown.enter')

    expect(card.attributes('role')).toBe('button')
    expect(card.attributes('tabindex')).toBe('0')
    expect(card.classes()).toContain('ntk-card--is-clickable')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit activation events when not clickable', async () => {
    const wrapper = mount(DsCard)

    const card = wrapper.get('article')
    await card.trigger('click')
    await card.trigger('keydown.enter')
    await card.trigger('keydown.space')

    expect(card.attributes('role')).toBeUndefined()
    expect(card.attributes('tabindex')).toBeUndefined()
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})

describe('DsInput', () => {
  it('renders label, value, message, attributes, and recipe classes', () => {
    const wrapper = mount(DsInput, {
      props: {
        id: 'tenant-name',
        testId: 'tenant-name-field',
        modelValue: 'Acme',
        name: 'tenantName',
        label: 'Tenant name',
        hint: 'Visible in the shell',
        placeholder: 'Type a tenant',
        variant: 'filled',
        size: 'sm',
        intent: 'primary',
        required: true,
        class: ['custom-field'],
      },
    })

    const label = wrapper.get('label')
    const input = wrapper.get('input')

    expect(label.attributes('for')).toBe('tenant-name__control')
    expect(label.attributes('data-testid')).toBe('tenant-name-field')
    expect(label.text()).toContain('Tenant name')
    expect(label.text()).toContain('Visible in the shell')
    expect(label.classes()).toEqual(expect.arrayContaining([
      'ntk-field',
      'ntk-field--variant-filled',
      'ntk-field--size-sm',
      'ntk-field--intent-primary',
      'ntk-field--is-required',
      'custom-field',
    ]))
    expect(input.attributes('id')).toBe('tenant-name__control')
    expect(input.attributes('name')).toBe('tenantName')
    expect(input.element.value).toBe('Acme')
    expect(input.attributes('placeholder')).toBe('Type a tenant')
    expect(input.attributes('aria-describedby')).toBe('tenant-name__description')
  })

  it('emits string model updates and invalid state attributes', async () => {
    const wrapper = mount(DsInput, {
      props: {
        id: 'email',
        modelValue: '',
        invalid: true,
        errorMessage: 'Email is required',
      },
    })

    const input = wrapper.get('input')
    await input.setValue('ops@example.com')

    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ops@example.com'])
    expect(wrapper.get('label').classes()).toEqual(expect.arrayContaining([
      'ntk-field--is-invalid',
    ]))
  })

  it('renders disabled and readonly state attributes without forcing model updates', () => {
    const wrapper = mount(DsInput, {
      props: {
        disabled: true,
        readonly: true,
      },
    })

    const input = wrapper.get('input')

    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('readonly')).toBeDefined()
    expect(wrapper.get('label').classes()).toEqual(expect.arrayContaining([
      'ntk-field--is-disabled',
      'ntk-field--is-readonly',
    ]))
  })

  it('defaults to comfortable density and reflects an explicit density class', () => {
    expect(mount(DsInput).get('label').classes()).toContain('ntk-field--density-comfortable')

    const spacious = mount(DsInput, { props: { density: 'spacious' } })
    expect(spacious.get('label').classes()).toContain('ntk-field--density-spacious')
  })
})