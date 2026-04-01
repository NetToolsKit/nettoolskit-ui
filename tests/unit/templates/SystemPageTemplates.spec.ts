import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import PlaceholderTemplate from '../../../src/templates/pages/system/PlaceholderTemplate.vue'
import ErrorNotFoundTemplate from '../../../src/templates/pages/system/ErrorNotFoundTemplate.vue'

const pageGlobal = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': { template: '<div><slot /></div>' },
    },
  },
}

describe('PlaceholderTemplate', () => {
  it('renders title, subtitle and statusLabel', () => {
    const wrapper = shallowMount(PlaceholderTemplate, {
      ...pageGlobal,
      props: {
        title: 'Feature coming soon',
        subtitle: 'This module is under construction.',
        statusLabel: 'In progress',
      },
    })

    expect(wrapper.text()).toContain('Feature coming soon')
    expect(wrapper.text()).toContain('This module is under construction.')
    expect(wrapper.text()).toContain('In progress')
  })

  it('renders hints list', () => {
    const wrapper = shallowMount(PlaceholderTemplate, {
      ...pageGlobal,
      props: {
        hints: [
          { id: 'h1', text: 'Available in Q3 2026', icon: 'schedule' },
          { id: 'h2', text: 'Requires enterprise tier', icon: 'lock' },
        ],
      },
    })

    const hints = wrapper.findAll('.ntk-template-placeholder__hint')
    expect(hints).toHaveLength(2)
    expect(hints[0]?.text()).toContain('Available in Q3 2026')
    expect(hints[1]?.text()).toContain('Requires enterprise tier')
  })

  it('emits action-click with primaryAction id when primary button is clicked', async () => {
    const wrapper = shallowMount(PlaceholderTemplate, {
      ...pageGlobal,
      props: {
        primaryAction: { id: 'go-docs', label: 'Read docs', icon: 'book' },
      },
    })

    await wrapper.get('q-btn-stub[label="Read docs"]').trigger('click')

    expect(wrapper.emitted('action-click')).toEqual([['go-docs']])
  })

  it('does not render separator or actions when hints and actions are absent', () => {
    const wrapper = shallowMount(PlaceholderTemplate, {
      ...pageGlobal,
      props: {
        hints: [],
        primaryAction: null,
        secondaryAction: null,
      },
    })

    expect(wrapper.find('q-separator-stub').exists()).toBe(false)
    expect(wrapper.find('.ntk-template-placeholder__actions').exists()).toBe(false)
  })

  it('renders description when provided', () => {
    const wrapper = shallowMount(PlaceholderTemplate, {
      ...pageGlobal,
      props: { description: 'Extended explanation of the placeholder state.' },
    })

    expect(wrapper.text()).toContain('Extended explanation of the placeholder state.')
  })
})

describe('ErrorNotFoundTemplate', () => {
  it('renders default 404 code, title and description', () => {
    const wrapper = shallowMount(ErrorNotFoundTemplate, pageGlobal)

    expect(wrapper.find('.ntk-template-not-found__code').text()).toBe('404')
    expect(wrapper.find('.ntk-template-not-found__title').text()).toBe('Page not found')
    expect(wrapper.text()).toContain('The page you are looking for does not exist or was moved.')
  })

  it('renders custom code and title', () => {
    const wrapper = shallowMount(ErrorNotFoundTemplate, {
      ...pageGlobal,
      props: {
        code: '403',
        title: 'Access denied',
        description: 'You do not have permission to view this page.',
      },
    })

    expect(wrapper.find('.ntk-template-not-found__code').text()).toBe('403')
    expect(wrapper.find('.ntk-template-not-found__title').text()).toBe('Access denied')
    expect(wrapper.text()).toContain('You do not have permission to view this page.')
  })

  it('emits action-click with primaryAction id when primary button is clicked', async () => {
    const wrapper = shallowMount(ErrorNotFoundTemplate, pageGlobal)

    await wrapper.get('q-btn-stub[label="Go to home"]').trigger('click')

    expect(wrapper.emitted('action-click')).toEqual([['go-home']])
  })

  it('hides secondary action when showSecondaryAction is false', () => {
    const wrapper = shallowMount(ErrorNotFoundTemplate, {
      ...pageGlobal,
      props: { showSecondaryAction: false },
    })

    expect(wrapper.find('q-btn-stub[label="Go back"]').exists()).toBe(false)
    expect(wrapper.find('q-btn-stub[label="Go to home"]').exists()).toBe(true)
  })
})