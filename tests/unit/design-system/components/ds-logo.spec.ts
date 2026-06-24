/**
 * DsLogo (capability-parity for NtkLogo) — a token-driven brand mark with an
 * optional wordmark/tagline, sizes xs–xl, and an optional link. Asserts the
 * rendered structure, the accessible name strategy, and axe cleanliness.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsLogo } from '@/design-system/vue'

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

describe('DsLogo', () => {
  it('renders the mark and wordmark with default recipe classes', () => {
    const wrapper = mount(DsLogo, { props: { mark: 'N', text: 'NetToolsKit' } })

    const root = wrapper.get('.ntk-logo')
    expect(root.element.tagName).toBe('SPAN')
    expect(root.classes()).toEqual(expect.arrayContaining([
      'ntk-logo--variant-gradient',
      'ntk-logo--size-md',
      'ntk-logo--intent-primary',
    ]))
    expect(wrapper.get('.ntk-logo__mark').text()).toBe('N')
    expect(wrapper.get('.ntk-logo__mark').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('.ntk-logo__text').text()).toBe('NetToolsKit')
  })

  it('renders as a clickable anchor when href is provided', () => {
    const wrapper = mount(DsLogo, { props: { mark: 'N', text: 'NetToolsKit', href: '/home' } })

    const root = wrapper.get('.ntk-logo')
    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('/home')
    expect(root.classes()).toContain('ntk-logo--is-clickable')
  })

  it('hides the wordmark and uses an accessible label for an icon-only mark', () => {
    const wrapper = mount(DsLogo, { props: { mark: 'N', text: 'NetToolsKit', showText: false } })

    expect(wrapper.find('.ntk-logo__content').exists()).toBe(false)
    // The visible mark is decorative, so the name comes from the label.
    expect(wrapper.get('.ntk-logo').attributes('aria-label')).toBe('NetToolsKit')
  })

  it('prefers an explicit ariaLabel and shows the tagline only when enabled', () => {
    const hidden = mount(DsLogo, { props: { mark: 'N', text: 'Brand', showText: false, ariaLabel: 'Home' } })
    expect(hidden.get('.ntk-logo').attributes('aria-label')).toBe('Home')

    const withTagline = mount(DsLogo, {
      props: { mark: 'N', text: 'Brand', tagline: 'Engineering-first', showTagline: true },
    })
    expect(withTagline.get('.ntk-logo__tagline').text()).toBe('Engineering-first')

    const withoutTagline = mount(DsLogo, {
      props: { mark: 'N', text: 'Brand', tagline: 'Engineering-first' },
    })
    expect(withoutTagline.find('.ntk-logo__tagline').exists()).toBe(false)
  })

  it('applies variant, size, and intent recipe classes', () => {
    const wrapper = mount(DsLogo, {
      props: { mark: 'N', text: 'Brand', variant: 'outline', size: 'xl', intent: 'success' },
    })

    expect(wrapper.get('.ntk-logo').classes()).toEqual(expect.arrayContaining([
      'ntk-logo--variant-outline',
      'ntk-logo--size-xl',
      'ntk-logo--intent-success',
    ]))
  })

  it('has no accessibility violations as a linked, icon-only mark', async () => {
    const wrapper = mount(DsLogo, {
      props: { mark: 'N', text: 'NetToolsKit', href: '/home', showText: false },
      attachTo: document.body,
    })
    await nextTick()

    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])
    wrapper.unmount()
  })
})