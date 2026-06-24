/**
 * DsChip (capability-parity) — recipe contract, rendered behavior, and a11y.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsChip } from '@/design-system/vue'
import { resolveNtkChipRecipe, ntkChipVariants } from '@/design-system/core'

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

describe('resolveNtkChipRecipe', () => {
  it('exposes the closed variant set and default classes', () => {
    expect(ntkChipVariants).toEqual(['solid', 'soft', 'outline'])
    expect(resolveNtkChipRecipe().classes).toStrictEqual([
      'ntk-chip',
      'ntk-chip--variant-solid',
      'ntk-chip--size-md',
      'ntk-chip--intent-neutral',
    ])
  })

  it('adds state modifiers', () => {
    const { classes } = resolveNtkChipRecipe({ variant: 'outline', size: 'sm', intent: 'primary', clickable: true, selected: true })
    expect(classes).toEqual(expect.arrayContaining([
      'ntk-chip--variant-outline',
      'ntk-chip--size-sm',
      'ntk-chip--intent-primary',
      'ntk-chip--is-clickable',
      'ntk-chip--is-selected',
    ]))
  })
})

describe('DsChip', () => {
  it('renders a non-interactive span by default', () => {
    const wrapper = mount(DsChip, { props: { label: 'Tag' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toContain('Tag')
  })

  it('renders a button and emits click when clickable', async () => {
    const wrapper = mount(DsChip, { props: { label: 'Filter', clickable: true, selected: true } })
    const el = wrapper.get('button')
    expect(el.attributes('aria-pressed')).toBe('true')
    await el.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(DsChip, { props: { label: 'X', clickable: true, disabled: true } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders a labelled remove control that emits remove', async () => {
    const wrapper = mount(DsChip, { props: { label: 'Tag', removable: true, removeLabel: 'Remove tag' } })
    const remove = wrapper.get('.ntk-chip__remove')
    expect(remove.attributes('aria-label')).toBe('Remove tag')
    await remove.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('has no accessibility violations (clickable + removable)', async () => {
    const wrapper = mount(DsChip, {
      props: { label: 'Accessible', clickable: true, removable: true, removeLabel: 'Remove' },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(wrapper.element, axeOptions)
    expect(results.violations, results.violations.map((v) => v.id).join(', ')).toEqual([])
    wrapper.unmount()
  })
})