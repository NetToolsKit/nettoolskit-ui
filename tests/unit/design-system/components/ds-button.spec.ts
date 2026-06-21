import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {
  DsButton,
} from '@/design-system/vue'

describe('DsButton', () => {
  it('renders contract labels, attributes, and recipe classes', () => {
    const wrapper = mount(DsButton, {
      props: {
        id: 'save-action',
        testId: 'save-button',
        label: 'Save',
        variant: 'outline',
        size: 'sm',
        intent: 'success',
        icon: 'save',
        iconRight: 'arrow_forward',
        class: ['custom-action'],
      },
    })

    const button = wrapper.get('button')

    expect(button.attributes('id')).toBe('save-action')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('data-testid')).toBe('save-button')
    expect(button.text()).toContain('Save')
    expect(button.classes()).toEqual(expect.arrayContaining([
      'ntk-button',
      'ntk-button--variant-outline',
      'ntk-button--size-sm',
      'ntk-button--intent-success',
      'custom-action',
    ]))
    expect(wrapper.find('.ntk-button__icon--left').text()).toBe('save')
    expect(wrapper.find('.ntk-button__icon--right').text()).toBe('arrow_forward')
  })

  it('supports default slot content and disabled loading state', async () => {
    const wrapper = mount(DsButton, {
      props: {
        loading: true,
        disabled: true,
      },
      slots: {
        default: 'Submit now',
      },
    })

    const button = wrapper.get('button')
    await button.trigger('click')

    expect(button.text()).toContain('Submit now')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.classes()).toEqual(expect.arrayContaining([
      'ntk-button--is-disabled',
      'ntk-button--is-loading',
    ]))
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})