import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkInput from '../../../../src/components/form/NtkInput.vue'
import NtkSelect from '../../../../src/components/form/NtkSelect.vue'
import NtkTextarea from '../../../../src/components/form/NtkTextarea.vue'
import NtkMultiSelect from '../../../../src/components/form/NtkMultiSelect.vue'
import NtkDatePicker from '../../../../src/components/form/NtkDatePicker.vue'
import NtkTimePicker from '../../../../src/components/form/NtkTimePicker.vue'

// ─── NtkInput ──────────────────────────────────────────────────────────────

describe('NtkInput', () => {
  it('renders with ntk-input class on q-input stub', () => {
    const wrapper = shallowMount(NtkInput, {
      props: { label: 'Name' },
    })

    const input = wrapper.find('q-input-stub.ntk-input')
    expect(input.exists()).toBe(true)
    expect(input.classes()).toEqual(expect.arrayContaining([
      'ntk-field',
      'ntk-field--variant-outlined',
      'ntk-field--size-md',
      'ntk-field--intent-neutral',
    ]))
  })

  it('passes label and disable to q-input stub', () => {
    const wrapper = shallowMount(NtkInput, {
      props: { label: 'Email', disable: true },
    })

    const input = wrapper.find('q-input-stub')
    expect(input.attributes('label')).toBe('Email')
    expect(input.attributes('disable')).toBe('true')
  })

  it('emits update:modelValue via handleUpdate', () => {
    const wrapper = shallowMount(NtkInput, {
      props: { label: 'Name', modelValue: '' },
    })

    ;(wrapper.vm as unknown as { handleUpdate: (v: string) => void }).handleUpdate('Alice')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Alice'])
  })

  it('syncs internalValue when modelValue prop changes', async () => {
    const wrapper = shallowMount(NtkInput, {
      props: { label: 'Name', modelValue: 'Alice' },
    })

    await wrapper.setProps({ modelValue: 'Bob' })
    expect((wrapper.vm as unknown as { internalValue: string }).internalValue).toBe('Bob')
  })

  it('passes type prop to q-input stub', () => {
    const wrapper = shallowMount(NtkInput, {
      props: { label: 'Password', type: 'password' },
    })

    expect(wrapper.find('q-input-stub').attributes('type')).toBe('password')
  })

  it('maps design-system compatibility props onto the q-input stub', () => {
    const wrapper = shallowMount(NtkInput, {
      props: {
        label: 'Email',
        variant: 'filled',
        size: 'sm',
        intent: 'danger',
        disabled: true,
        invalid: true,
        required: true,
        readonly: true,
      },
    })

    const input = wrapper.find('q-input-stub')

    expect(input.attributes('filled')).toBe('true')
    expect(input.attributes('outlined')).toBe('false')
    expect(input.attributes('dense')).toBe('true')
    expect(input.attributes('disable')).toBe('true')
    expect(input.attributes('error')).toBe('true')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-required')).toBe('true')
    expect(input.classes()).toEqual(expect.arrayContaining([
      'ntk-field--variant-filled',
      'ntk-field--size-sm',
      'ntk-field--intent-danger',
      'ntk-field--is-disabled',
      'ntk-field--is-invalid',
      'ntk-field--is-readonly',
      'ntk-field--is-required',
    ]))
  })

  it('lets explicit legacy visual and disabled props win over compatibility aliases', () => {
    const wrapper = shallowMount(NtkInput, {
      props: {
        label: 'Email',
        variant: 'filled',
        size: 'sm',
        disabled: true,
        disable: false,
        outlined: true,
        filled: false,
        dense: false,
      },
    })

    const input = wrapper.find('q-input-stub')

    expect(input.attributes('outlined')).toBe('true')
    expect(input.attributes('filled')).toBe('false')
    expect(input.attributes('dense')).toBe('false')
    expect(input.attributes('disable')).toBe('false')
    expect(input.classes()).toEqual(expect.arrayContaining([
      'ntk-field--variant-outlined',
      'ntk-field--size-md',
    ]))
    expect(input.classes()).not.toContain('ntk-field--is-disabled')
  })

  it('treats outlined and filled as one legacy visual group when only one is explicit', () => {
    const wrapper = shallowMount(NtkInput, {
      props: {
        label: 'Email',
        variant: 'filled',
        outlined: true,
      },
    })

    const input = wrapper.find('q-input-stub')

    expect(input.attributes('outlined')).toBe('true')
    expect(input.attributes('filled')).toBe('false')
    expect(input.classes()).toContain('ntk-field--variant-outlined')
  })

  it('falls back to the default field recipe for unknown compatibility values', () => {
    const wrapper = shallowMount(NtkInput, {
      props: {
        label: 'Email',
        variant: 'soft',
        size: 'xl',
        intent: 'brand',
      },
    })

    const input = wrapper.find('q-input-stub')

    expect(input.classes()).toEqual(expect.arrayContaining([
      'ntk-field--variant-outlined',
      'ntk-field--size-md',
      'ntk-field--intent-neutral',
    ]))
  })
})

// ─── NtkSelect ─────────────────────────────────────────────────────────────

describe('NtkSelect', () => {
  const options = ['Option A', 'Option B', 'Option C']

  it('renders with ntk-select class on q-select stub', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: { label: 'Status', options },
    })

    const select = wrapper.find('q-select-stub.ntk-select')
    expect(select.exists()).toBe(true)
    expect(select.classes()).toEqual(expect.arrayContaining([
      'ntk-field',
      'ntk-field--variant-outlined',
      'ntk-field--size-md',
      'ntk-field--intent-neutral',
    ]))
  })

  it('passes label and options to q-select stub', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: { label: 'Status', options },
    })

    const select = wrapper.find('q-select-stub')
    expect(select.attributes('label')).toBe('Status')
  })

  it('emits update:modelValue via handleUpdate', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: { label: 'Status', options, modelValue: null },
    })

    ;(wrapper.vm as unknown as { handleUpdate: (v: string) => void }).handleUpdate('Option A')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Option A'])
  })

  it('passes disable prop', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: { label: 'Status', options, disable: true },
    })

    expect(wrapper.find('q-select-stub').attributes('disable')).toBe('true')
  })

  it('maps design-system compatibility props onto the q-select stub', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: {
        label: 'Status',
        options,
        variant: 'filled',
        size: 'sm',
        intent: 'success',
        disabled: true,
        invalid: true,
        required: true,
        readonly: true,
      },
    })

    const select = wrapper.find('q-select-stub')

    expect(select.attributes('filled')).toBe('true')
    expect(select.attributes('outlined')).toBe('false')
    expect(select.attributes('dense')).toBe('true')
    expect(select.attributes('disable')).toBe('true')
    expect(select.attributes('error')).toBe('true')
    expect(select.attributes('aria-invalid')).toBe('true')
    expect(select.attributes('aria-required')).toBe('true')
    expect(select.classes()).toEqual(expect.arrayContaining([
      'ntk-field--variant-filled',
      'ntk-field--size-sm',
      'ntk-field--intent-success',
      'ntk-field--is-disabled',
      'ntk-field--is-invalid',
      'ntk-field--is-readonly',
      'ntk-field--is-required',
    ]))
  })

  it('lets explicit legacy visual and disabled props win over compatibility aliases', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: {
        label: 'Status',
        options,
        variant: 'filled',
        size: 'sm',
        disabled: true,
        disable: false,
        outlined: true,
        filled: false,
        dense: false,
      },
    })

    const select = wrapper.find('q-select-stub')

    expect(select.attributes('outlined')).toBe('true')
    expect(select.attributes('filled')).toBe('false')
    expect(select.attributes('dense')).toBe('false')
    expect(select.attributes('disable')).toBe('false')
    expect(select.classes()).toEqual(expect.arrayContaining([
      'ntk-field--variant-outlined',
      'ntk-field--size-md',
    ]))
    expect(select.classes()).not.toContain('ntk-field--is-disabled')
  })

  it('treats outlined and filled as one legacy visual group when only one is explicit', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: {
        label: 'Status',
        options,
        variant: 'filled',
        outlined: true,
      },
    })

    const select = wrapper.find('q-select-stub')

    expect(select.attributes('outlined')).toBe('true')
    expect(select.attributes('filled')).toBe('false')
    expect(select.classes()).toContain('ntk-field--variant-outlined')
  })

  it('falls back to the default field recipe for unknown compatibility values', () => {
    const wrapper = shallowMount(NtkSelect, {
      props: {
        label: 'Status',
        options,
        variant: 'soft',
        size: 'xl',
        intent: 'brand',
      },
    })

    const select = wrapper.find('q-select-stub')

    expect(select.classes()).toEqual(expect.arrayContaining([
      'ntk-field--variant-outlined',
      'ntk-field--size-md',
      'ntk-field--intent-neutral',
    ]))
  })
})

// ─── NtkTextarea ───────────────────────────────────────────────────────────

describe('NtkTextarea', () => {
  it('renders with ntk-textarea class on q-input stub', () => {
    const wrapper = shallowMount(NtkTextarea, {
      props: { label: 'Notes' },
    })

    expect(wrapper.find('q-input-stub.ntk-textarea').exists()).toBe(true)
  })

  it('passes type=textarea to q-input stub', () => {
    const wrapper = shallowMount(NtkTextarea, {
      props: { label: 'Notes' },
    })

    expect(wrapper.find('q-input-stub').attributes('type')).toBe('textarea')
  })

  it('emits update:modelValue via handleUpdate', () => {
    const wrapper = shallowMount(NtkTextarea, {
      props: { label: 'Notes', modelValue: '' },
    })

    ;(wrapper.vm as unknown as { handleUpdate: (v: string) => void }).handleUpdate('Hello world')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello world'])
  })
})

// ─── NtkMultiSelect ────────────────────────────────────────────────────────

describe('NtkMultiSelect', () => {
  const options = ['Tag1', 'Tag2', 'Tag3']

  it('renders ntk-select stub with multiple attribute', () => {
    const wrapper = shallowMount(NtkMultiSelect, {
      props: { label: 'Tags', options, modelValue: [] },
    })

    const select = wrapper.find('ntk-select-stub')
    expect(select.exists()).toBe(true)
    expect(select.attributes('multiple')).toBeDefined()
  })

  it('passes label and options to ntk-select stub', () => {
    const wrapper = shallowMount(NtkMultiSelect, {
      props: { label: 'Tags', options, modelValue: [] },
    })

    expect(wrapper.find('ntk-select-stub').attributes('label')).toBe('Tags')
  })

  it('emits update:modelValue when handleUpdate is called', () => {
    const wrapper = shallowMount(NtkMultiSelect, {
      props: { label: 'Tags', options, modelValue: [] },
    })

    ;(wrapper.vm as unknown as { handleUpdate: (v: string[]) => void }).handleUpdate(['Tag1', 'Tag2'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Tag1', 'Tag2']])
  })
})

// ─── NtkDatePicker ─────────────────────────────────────────────────────────

describe('NtkDatePicker', () => {
  it('renders with ntk-date-picker class on q-input stub', () => {
    const wrapper = shallowMount(NtkDatePicker, {
      props: { label: 'Due date' },
    })

    expect(wrapper.find('q-input-stub.ntk-date-picker').exists()).toBe(true)
  })

  it('passes label and disable to q-input stub', () => {
    const wrapper = shallowMount(NtkDatePicker, {
      props: { label: 'Due date', disable: true },
    })

    const input = wrapper.find('q-input-stub')
    expect(input.attributes('label')).toBe('Due date')
    expect(input.attributes('disable')).toBe('true')
  })

  it('emits update:modelValue via handleUpdate', () => {
    const wrapper = shallowMount(NtkDatePicker, {
      props: { label: 'Date', modelValue: '' },
    })

    ;(wrapper.vm as unknown as { handleUpdate: (v: string) => void }).handleUpdate('2026-04-01')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-04-01'])
  })
})

// ─── NtkTimePicker ─────────────────────────────────────────────────────────

describe('NtkTimePicker', () => {
  it('renders with ntk-time-picker class on q-input stub', () => {
    const wrapper = shallowMount(NtkTimePicker, {
      props: { label: 'Start time' },
    })

    expect(wrapper.find('q-input-stub.ntk-time-picker').exists()).toBe(true)
  })

  it('passes label to q-input stub', () => {
    const wrapper = shallowMount(NtkTimePicker, {
      props: { label: 'Start time' },
    })

    expect(wrapper.find('q-input-stub').attributes('label')).toBe('Start time')
  })

  it('emits update:modelValue via handleUpdate', () => {
    const wrapper = shallowMount(NtkTimePicker, {
      props: { label: 'Time', modelValue: '' },
    })

    ;(wrapper.vm as unknown as { handleUpdate: (v: string) => void }).handleUpdate('14:30')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['14:30'])
  })
})