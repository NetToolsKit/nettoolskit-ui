/**
 * DsSteps (capability-parity) — app stepper: recipe, step status, rendered
 * semantics (ordered list + aria-current), and accessibility.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsSteps } from '@/design-system/vue'
import { getNtkStepStatus, resolveNtkStepsRecipe, ntkStepsOrientations } from '@/design-system/core'

const steps = [
  { id: 'a', label: 'Account', description: 'Your details' },
  { id: 'b', label: 'Address' },
  { id: 'c', label: 'Review' },
]

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

describe('steps recipe + status', () => {
  it('exposes orientations and default classes', () => {
    expect(ntkStepsOrientations).toEqual(['horizontal', 'vertical'])
    expect(resolveNtkStepsRecipe().classes).toStrictEqual([
      'ntk-steps',
      'ntk-steps--variant-default',
      'ntk-steps--size-md',
      'ntk-steps--intent-neutral',
      'ntk-steps--orientation-horizontal',
    ])
    expect(resolveNtkStepsRecipe({ orientation: 'vertical' }).classes).toContain('ntk-steps--orientation-vertical')
  })

  it('derives step status from the current index', () => {
    expect(getNtkStepStatus(0, 1)).toBe('complete')
    expect(getNtkStepStatus(1, 1)).toBe('current')
    expect(getNtkStepStatus(2, 1)).toBe('upcoming')
  })
})

describe('DsSteps', () => {
  it('renders an ordered list with a labelled item per step and marks current', () => {
    const wrapper = mount(DsSteps, { props: { steps, current: 1, ariaLabel: 'Checkout' } })
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.get('ol').attributes('aria-label')).toBe('Checkout')
    const items = wrapper.findAll('li')
    expect(items).toHaveLength(3)
    expect(items[1].attributes('aria-current')).toBe('step')
    expect(items[0].attributes('aria-current')).toBeUndefined()
    // completed step shows a check marker
    expect(items[0].get('.ntk-steps__marker').text()).toBe('✓')
    expect(wrapper.text()).toContain('Account')
  })

  it('is non-interactive by default and interactive when clickable', async () => {
    const plain = mount(DsSteps, { props: { steps, current: 0 } })
    expect(plain.find('button').exists()).toBe(false)

    const wrapper = mount(DsSteps, { props: { steps, current: 0, clickable: true } })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3)
    await buttons[2].trigger('click')
    expect(wrapper.emitted('step-click')?.[0]).toEqual([2])
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsSteps, {
      props: { steps, current: 1, clickable: true, ariaLabel: 'Checkout progress' },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(wrapper.element, axeOptions)
    expect(results.violations, results.violations.map((v) => v.id).join(', ')).toEqual([])
    wrapper.unmount()
  })
})