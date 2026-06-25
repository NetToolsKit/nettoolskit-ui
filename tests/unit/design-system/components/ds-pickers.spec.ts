/**
 * DsDatePicker / DsTimePicker (pure-DOM, token-driven).
 *
 * Mounts the real components and asserts the field shell, the popup
 * open/close/keyboard lifecycle, v-model emission, min/max disabling, and axe
 * cleanliness — no Quasar, native elements plus a custom popup only.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsDatePicker, DsTimePicker } from '@/design-system/vue'

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

describe('DsDatePicker', () => {
  it('renders the field shell with the formatted value and default recipe classes', () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', label: 'Birthday', modelValue: '2024-06-15' },
    })

    const root = wrapper.get('.ntk-date-picker')
    expect(root.classes()).toEqual(expect.arrayContaining([
      'ntk-field',
      'ntk-field--variant-outlined',
      'ntk-field--size-md',
      'ntk-field--density-comfortable',
    ]))
    expect(wrapper.get('.ntk-field__label').text()).toBe('Birthday')
    expect(wrapper.get('input').element.value).toBe('2024-06-15')
    // Popup is closed until the trigger is used.
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('opens a calendar grid on trigger and closes on Escape', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', label: 'Date', modelValue: '2024-06-15' },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()

    const grid = wrapper.find('[role="grid"]')
    expect(grid.exists()).toBe(true)
    expect(wrapper.findAll('[role="row"]').length).toBeGreaterThan(0)
    // The selected day exposes aria-selected and the single roving tab stop.
    const selected = wrapper.get('.ntk-date-picker__day--selected')
    expect(selected.attributes('aria-selected')).toBe('true')
    expect(selected.attributes('tabindex')).toBe('0')

    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('moves the roving focus with arrow keys and selects with Enter (v-model emit)', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', modelValue: '2024-06-15' },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()

    const popup = wrapper.get('[role="dialog"]')
    // ArrowRight -> +1 day, ArrowDown -> +7 days => 2024-06-23.
    await popup.trigger('keydown', { key: 'ArrowRight' })
    await popup.trigger('keydown', { key: 'ArrowDown' })
    await popup.trigger('keydown', { key: 'Enter' })
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted?.at(-1)).toEqual(['2024-06-23'])
    // Selecting closes the popup.
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('selects a day on click and emits the ISO value', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', modelValue: '2024-06-15' },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()

    const day20 = wrapper.get('.ntk-date-picker__day[data-iso="2024-06-20"]')
    await day20.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2024-06-20'])

    wrapper.unmount()
  })

  it('marks out-of-range days aria-disabled and ignores their selection', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', modelValue: '2024-06-15', min: '2024-06-10', max: '2024-06-20' },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()

    const before = wrapper.get('.ntk-date-picker__day[data-iso="2024-06-05"]')
    expect(before.attributes('aria-disabled')).toBe('true')
    const inside = wrapper.get('.ntk-date-picker__day[data-iso="2024-06-15"]')
    expect(inside.attributes('aria-disabled')).toBeUndefined()

    await before.trigger('click')
    // A disabled day must not emit and must keep the popup open.
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('navigates months via the header buttons', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', modelValue: '2024-06-15' },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()
    expect(wrapper.get('.ntk-date-picker__month-label').text()).toBe('June 2024')

    await wrapper.get('[aria-label="Next month"]').trigger('click')
    await nextTick()
    expect(wrapper.get('.ntk-date-picker__month-label').text()).toBe('July 2024')

    await wrapper.get('[aria-label="Previous month"]').trigger('click')
    await wrapper.get('[aria-label="Previous month"]').trigger('click')
    await nextTick()
    expect(wrapper.get('.ntk-date-picker__month-label').text()).toBe('May 2024')

    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', modelValue: '2024-06-15', disabled: true },
    })
    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('has no accessibility violations with the calendar open', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { id: 'dp', label: 'Appointment', modelValue: '2024-06-15' },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()

    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])

    wrapper.unmount()
  })
})

describe('DsTimePicker', () => {
  it('renders the field shell and the formatted value', () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tp', label: 'Start', modelValue: '09:30' },
    })

    expect(wrapper.get('.ntk-time-picker').classes()).toContain('ntk-field')
    expect(wrapper.get('.ntk-field__label').text()).toBe('Start')
    expect(wrapper.get('input').element.value).toBe('09:30')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('opens a listbox of stepped options and closes on Escape', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tp', label: 'Time', modelValue: '09:30', step: 30 },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()

    const listbox = wrapper.get('[role="listbox"]')
    const options = wrapper.findAll('[role="option"]')
    expect(options.length).toBe(48) // 24h / 30min
    const selected = wrapper.get('.ntk-time-picker__option--selected')
    expect(selected.attributes('aria-selected')).toBe('true')
    expect(selected.text()).toBe('09:30')

    await listbox.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('navigates options with arrow/Home/End and selects with Enter (v-model emit)', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tp', modelValue: '09:00', step: 60 },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()

    const listbox = wrapper.get('[role="listbox"]')
    // Active starts on 09:00; ArrowDown -> 10:00, Enter selects.
    await listbox.trigger('keydown', { key: 'ArrowDown' })
    await listbox.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10:00'])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    // Re-open and jump to End -> last option 23:00.
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    const reopened = wrapper.get('[role="listbox"]')
    await reopened.trigger('keydown', { key: 'End' })
    await reopened.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['23:00'])

    wrapper.unmount()
  })

  it('selects an option on click and emits the value', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tp', modelValue: '09:00', step: 60 },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    await wrapper.get('[data-time="12:00"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['12:00'])

    wrapper.unmount()
  })

  it('restricts the option list to the [min, max] window', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tp', modelValue: null, step: 60, min: '09:00', max: '12:00' },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    const labels = wrapper.findAll('[role="option"]').map((o) => o.text())
    expect(labels).toEqual(['09:00', '10:00', '11:00', '12:00'])

    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tp', modelValue: '09:00', disabled: true },
    })
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('has no accessibility violations with the listbox open', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tp', label: 'Reminder', modelValue: '09:30', step: 30 },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()

    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])

    wrapper.unmount()
  })
})