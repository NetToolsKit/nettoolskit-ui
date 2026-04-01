import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import AuthLayoutTemplate from '../../../src/templates/layouts/AuthLayoutTemplate.vue'

const layoutGlobal = {
  global: {
    renderStubDefaultSlot: true,
  },
}

describe('AuthLayoutTemplate', () => {
  it('renders default slot content', () => {
    const wrapper = shallowMount(AuthLayoutTemplate, {
      ...layoutGlobal,
      slots: { default: '<div class="login-form">Login form</div>' },
    })

    expect(wrapper.find('.login-form').exists()).toBe(true)
    expect(wrapper.find('.login-form').text()).toBe('Login form')
  })

  it('wraps content in centering container when centerContent is true (default)', () => {
    const wrapper = shallowMount(AuthLayoutTemplate, {
      ...layoutGlobal,
      props: { centerContent: true },
      slots: { default: '<p>Content</p>' },
    })

    expect(wrapper.find('.ntk-template-auth-layout__center').exists()).toBe(true)
  })

  it('does not wrap in centering container when centerContent is false', () => {
    const wrapper = shallowMount(AuthLayoutTemplate, {
      ...layoutGlobal,
      props: { centerContent: false },
      slots: { default: '<p>Content</p>' },
    })

    expect(wrapper.find('.ntk-template-auth-layout__center').exists()).toBe(false)
  })

  it('applies pageContainerClass to the container element', () => {
    const wrapper = shallowMount(AuthLayoutTemplate, {
      ...layoutGlobal,
      props: { pageContainerClass: 'custom-bg' },
    })

    expect(wrapper.find('.ntk-template-auth-layout__container').classes()).toContain('custom-bg')
  })

  it('applies pageClass to the page element', () => {
    const wrapper = shallowMount(AuthLayoutTemplate, {
      ...layoutGlobal,
      props: { pageClass: 'custom-page' },
    })

    expect(wrapper.find('.ntk-template-auth-layout__page').classes()).toContain('custom-page')
  })
})