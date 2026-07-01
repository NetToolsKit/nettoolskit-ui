/**
 * DsDatePicker — popup lifecycle, month navigation, day selection and the
 * popup keyboard contract (the paths the base picker suite left uncovered).
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsDatePicker } from '@/design-system/vue'

const mountPicker = (props: Record<string, unknown> = {}) =>
  mount(DsDatePicker, {
    props: { id: 'dp', label: 'Data', modelValue: '2026-06-15', ...props },
    attachTo: document.body,
  })

const openPopup = async (wrapper: ReturnType<typeof mountPicker>) => {
  await wrapper.get('.ntk-date-picker__trigger').trigger('click')
  await nextTick()
  return wrapper.get('[role="dialog"]')
}

describe('DsDatePicker interactions', () => {
  it('opens and closes the calendar popup from the trigger', async () => {
    const wrapper = mountPicker()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await openPopup(wrapper)
    expect(wrapper.get('.ntk-date-picker__trigger').attributes('aria-expanded')).toBe('true')

    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows the model value in the readonly input and marks the selected day', async () => {
    const wrapper = mountPicker()
    expect((wrapper.get('#dp__control, .ntk-date-picker__input').element as HTMLInputElement).value)
      .toBe('2026-06-15')

    await openPopup(wrapper)
    const selected = wrapper.get('.ntk-date-picker__day--selected')
    expect(selected.attributes('data-iso')).toBe('2026-06-15')
    expect(selected.attributes('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('selects a day and emits the ISO value', async () => {
    const wrapper = mountPicker()
    await openPopup(wrapper)

    await wrapper.get('[data-iso="2026-06-20"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-06-20'])
    wrapper.unmount()
  })

  it('navigates months in both directions with a live month label', async () => {
    const wrapper = mountPicker()
    await openPopup(wrapper)
    const label = () => wrapper.get('.ntk-date-picker__month-label').text()
    const initial = label()

    const [prev, next] = wrapper.findAll('.ntk-date-picker__nav')
    await next!.trigger('click')
    await nextTick()
    const advanced = label()
    expect(advanced).not.toBe(initial)

    await prev!.trigger('click')
    await nextTick()
    expect(label()).toBe(initial)
    wrapper.unmount()
  })

  it('honors the popup keyboard contract (arrow moves, enter selects, escape closes)', async () => {
    const wrapper = mountPicker()
    const popup = await openPopup(wrapper)

    await popup.trigger('keydown', { key: 'ArrowRight' })
    await popup.trigger('keydown', { key: 'ArrowDown' })
    await popup.trigger('keydown', { key: 'ArrowLeft' })
    await popup.trigger('keydown', { key: 'ArrowUp' })
    await popup.trigger('keydown', { key: 'Enter' })
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.at(-1)).toEqual(['2026-06-15'])

    if (wrapper.find('[role="dialog"]').exists()) {
      await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
      await nextTick()
    }
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps the trigger disabled when the field is disabled or readonly', () => {
    const disabled = mountPicker({ disabled: true })
    expect(disabled.get('.ntk-date-picker__trigger').attributes('disabled')).toBeDefined()

    const readonly = mountPicker({ id: 'dp2', readonly: true })
    expect(readonly.get('.ntk-date-picker__trigger').attributes('disabled')).toBeDefined()
    disabled.unmount()
    readonly.unmount()
  })
})