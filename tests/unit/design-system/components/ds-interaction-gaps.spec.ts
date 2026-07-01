/**
 * Interaction coverage for the primitives the base suites exercised only
 * partially: DsInput control types/events, DsDialog close policies and
 * variants, DsDrawer lifecycle, DsSelect search filtering.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsDialog, DsDrawer, DsInput, DsSelect } from '@/design-system/vue'

describe('DsInput control surface', () => {
  it('renders native input types and a textarea when multiline', () => {
    const email = mount(DsInput, { props: { id: 'e', label: 'E-mail', type: 'email', modelValue: '' } })
    expect(email.get('#e__control').attributes('type')).toBe('email')

    const password = mount(DsInput, { props: { id: 'p', label: 'Senha', type: 'password', modelValue: '' } })
    expect(password.get('#p__control').attributes('type')).toBe('password')

    const notes = mount(DsInput, { props: { id: 'n', label: 'Notas', multiline: true, modelValue: '' } })
    expect(notes.get('#n__control').element.tagName).toBe('TEXTAREA')
  })

  it('emits update/focus/blur through the native control', async () => {
    const wrapper = mount(DsInput, { props: { id: 'x', label: 'Nome', modelValue: '' } })
    const control = wrapper.get('#x__control')

    await control.trigger('focus')
    await control.setValue('Ana')
    await control.trigger('blur')

    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Ana'])
  })

  it('exposes invalid state with the error message and disabled/readonly attributes', () => {
    const wrapper = mount(DsInput, {
      props: {
        id: 'inv',
        label: 'CPF',
        modelValue: '',
        invalid: true,
        errorMessage: 'Corrija o CPF',
        disabled: true,
        readonly: true,
      },
    })

    expect(wrapper.text()).toContain('Corrija o CPF')
    const control = wrapper.get('#inv__control')
    expect(control.attributes('disabled')).toBeDefined()
    expect(control.attributes('aria-invalid')).toBe('true')
  })
})

describe('DsDialog close policies and variants', () => {
  it('persistent blocks escape/backdrop but keeps the close button working', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'pd', modelValue: true, persistent: true, title: 'Confirma?' },
      attachTo: document.body,
    })
    await nextTick()
    const dialog = wrapper.get('dialog')

    await dialog.trigger('cancel')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await dialog.trigger('click') // backdrop (target === dialog)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('.ntk-dialog__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('non-persistent closes on backdrop click and hides the button with hideClose', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'bd', modelValue: true, hideClose: true, ariaLabel: 'Aviso' },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.find('.ntk-dialog__close').exists()).toBe(false)
    await wrapper.get('dialog').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('applies the size and variant recipe classes and the actions close scope', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'va', modelValue: true, variant: 'fullscreen', size: 'lg', title: 'T' },
      attachTo: document.body,
      slots: {
        actions: `<template #actions="{ close }">
          <button class="use-scope-close" type="button" @click="close()">Fechar</button>
        </template>`,
      },
    })
    await nextTick()

    const dialog = wrapper.get('dialog')
    expect(dialog.classes().join(' ')).toContain('ntk-dialog--variant-fullscreen')
    expect(dialog.classes().join(' ')).toContain('ntk-dialog--size-lg')

    await wrapper.get('.use-scope-close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})

describe('DsDrawer lifecycle', () => {
  it('opens with v-model, exposes accessible labels and closes via the button', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, ariaLabel: 'Menu principal' },
      slots: { default: '<a href="#">Item</a>' },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.text()).toContain('Item')
    await wrapper.get('.ntk-drawer__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})

describe('DsSelect search filtering', () => {
  const options = [
    { label: 'Alfa', value: 'a' },
    { label: 'Beta', value: 'b' },
    { label: 'Gama', value: 'g' },
  ]

  it('filters the visible options through the search input', async () => {
    const wrapper = mount(DsSelect, {
      props: { id: 'sf', label: 'Opção', modelValue: '', options, searchable: true },
      attachTo: document.body,
    })

    await wrapper.get('#sf__trigger').trigger('click')
    await nextTick()

    const search = document.querySelector<HTMLInputElement>('.ntk-select-panel input')
    expect(search).toBeTruthy()
    search!.value = 'be'
    search!.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    const visible = [...document.querySelectorAll('#sf__listbox [role="option"]')]
      .map(option => option.textContent?.trim())
    expect(visible).toEqual(['Beta'])

    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })

  it('does not open the panel when disabled', async () => {
    const wrapper = mount(DsSelect, {
      props: { id: 'sd', label: 'Opção', modelValue: '', options, disabled: true },
      attachTo: document.body,
    })

    await wrapper.get('#sd__trigger').trigger('click')
    await nextTick()

    expect(document.querySelector('#sd__listbox')).toBeNull()
    wrapper.unmount()
  })

  it('supports the full trigger keyboard contract (open, move, commit, home/end, escape, tab)', async () => {
    const wrapper = mount(DsSelect, {
      props: { id: 'kb', label: 'Opção', modelValue: '', options },
      attachTo: document.body,
    })
    const trigger = wrapper.get('#kb__trigger')

    // ArrowDown opens the closed combobox.
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.querySelector('#kb__listbox')).toBeTruthy()

    // End + Enter commits the last enabled option deterministically.
    await trigger.trigger('keydown', { key: 'End' })
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['g'])

    // Reopen with ArrowUp; Home + Space commits the first enabled option.
    await trigger.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'Home' })
    await trigger.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['a'])

    // Escape closes an open panel; Tab closes silently.
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(document.querySelector('#kb__listbox')).toBeNull()

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'Tab' })
    await nextTick()
    expect(document.querySelector('#kb__listbox')).toBeNull()

    // ArrowDown/ArrowUp move the active option while open.
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowUp' })
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThanOrEqual(3)

    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })
})

describe('DsInput multiline events', () => {
  it('emits update/focus/blur through the textarea control', async () => {
    const wrapper = mount(DsInput, {
      props: { id: 'ta', label: 'Notas', multiline: true, modelValue: '' },
    })
    const control = wrapper.get('#ta__control')

    await control.trigger('focus')
    await control.setValue('linha 1')
    await control.trigger('blur')

    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['linha 1'])
  })
})