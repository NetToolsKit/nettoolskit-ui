/**
 * DsForm (L2-vue) — renders a schema, coerces values, validates, and emits
 * submit/reset. Also asserts no axe violations on the rendered form.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsForm } from '@/design-system/vue'
import { defineForm } from '@/design-system/core'

const schema = defineForm({
  fields: [
    { field: 'name', type: 'text', required: true },
    { field: 'age', type: 'number', min: 18 },
    { field: 'role', type: 'select', options: [{ label: 'Admin', value: 1 }, { label: 'User', value: 2 }] },
    { field: 'active', type: 'switch' },
    { field: 'bio', type: 'textarea' },
    { field: 'tags', type: 'multiselect', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] },
  ],
})

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

describe('DsForm', () => {
  it('renders one control per field with wired ids/labels', () => {
    const wrapper = mount(DsForm, { props: { schema } })
    expect(wrapper.find('#ds-form-name__control').exists()).toBe(true)
    expect(wrapper.find('#ds-form-age__control').attributes('type')).toBe('number')
    expect(wrapper.find('#ds-form-role__control').element.tagName).toBe('SELECT')
    expect(wrapper.find('#ds-form-bio__control').element.tagName).toBe('TEXTAREA')
    expect(wrapper.text()).toContain('Name')
  })

  it('coerces number input and emits update:modelValue', async () => {
    const wrapper = mount(DsForm, { props: { schema } })
    await wrapper.find('#ds-form-name__control').setValue('Ana')
    await wrapper.find('#ds-form-age__control').setValue('30')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const last = emitted!.at(-1)![0] as Record<string, unknown>
    expect(last.name).toBe('Ana')
    expect(last.age).toBe(30)
  })

  it('maps a select option back to its typed value', async () => {
    const wrapper = mount(DsForm, { props: { schema } })
    await wrapper.find('#ds-form-role__control').setValue('1')
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as Record<string, unknown>
    expect(last.role).toBe(1)
  })

  it('renders multiselect as a DsSelect and emits a typed array', async () => {
    const wrapper = mount(DsForm, { props: { schema } })
    const select = wrapper.find('#ds-form-tags__control')
    expect(select.exists()).toBe(true)
    expect(select.attributes('multiple')).toBeDefined()

    await select.setValue(['a', 'b'])
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as Record<string, unknown>
    expect(last.tags).toEqual(['a', 'b'])
  })

  it('blocks submit and shows messages when invalid, then submits when valid', async () => {
    const wrapper = mount(DsForm, { props: { schema } })

    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('Preencha este campo')

    await wrapper.find('#ds-form-name__control').setValue('Ana')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    const submitted = wrapper.emitted('submit')
    expect(submitted).toHaveLength(1)
    expect((submitted![0][0] as Record<string, unknown>).name).toBe('Ana')
  })

  it('clears live errors once a field becomes valid after a submit attempt', async () => {
    const wrapper = mount(DsForm, { props: { schema } })
    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(wrapper.text()).toContain('Preencha este campo')

    await wrapper.find('#ds-form-name__control').setValue('Ana')
    await nextTick()
    expect(wrapper.text()).not.toContain('Preencha este campo')
  })

  it('emits reset and clears values', async () => {
    const wrapper = mount(DsForm, { props: { schema } })
    await wrapper.find('#ds-form-name__control').setValue('Ana')
    await wrapper.find('form').trigger('reset')

    expect(wrapper.emitted('reset')).toHaveLength(1)
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as Record<string, unknown>
    expect(last.name).toBe('')
  })

  it('exposes a validate() method', async () => {
    const wrapper = mount(DsForm, { props: { schema } })
    const vm = wrapper.vm as unknown as { validate: () => boolean }
    expect(vm.validate()).toBe(false)
    await wrapper.find('#ds-form-name__control').setValue('Ana')
    expect(vm.validate()).toBe(true)
  })

  it('has no accessibility violations', async () => {
    const wrapper = mount(DsForm, { props: { schema, legend: 'Profile' }, attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])
    wrapper.unmount()
  })
})