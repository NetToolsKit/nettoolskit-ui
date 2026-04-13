import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HorizontalMenuLinkTemplate from '../../../src/templates/navigation/HorizontalMenuLinkTemplate.vue'

describe('HorizontalMenuLinkTemplate', () => {
  it('supports manual active state and emits clicks without router targets', async () => {
    const wrapper = mount(HorizontalMenuLinkTemplate, {
      props: {
        item: {
          id: 'dashboard',
          text: 'Dashboard',
          icon: 'dashboard',
        },
        activeItemId: 'dashboard',
      },
      global: {
        stubs: {
          'q-btn': {
            props: ['disable'],
            template: '<button :disabled="disable" @click="$emit(\'click\')"><slot /></button>',
          },
          'q-btn-dropdown': {
            template: '<div><slot name="label" /><slot /></div>',
          },
          'q-icon': {
            template: '<span><slot /></span>',
          },
          'q-list': {
            template: '<div><slot /></div>',
          },
          'q-item': {
            template: '<div><slot /></div>',
          },
          'q-item-section': {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('.ntk-template-horizontal-link--active').exists()).toBe(true)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('item-click')?.[0]).toEqual([
      {
        id: 'dashboard',
        text: 'Dashboard',
        icon: 'dashboard',
      },
    ])
  })
})
