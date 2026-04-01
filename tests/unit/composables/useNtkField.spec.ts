import { describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useNtkField } from '../../../src/composables/forms/useNtkField'

describe('useNtkField', () => {
  it('initializes internalValue from modelValue', () => {
    const emit = vi.fn()
    const { internalValue } = useNtkField({ modelValue: 'hello' }, emit)
    expect(internalValue.value).toBe('hello')
  })

  it('initializes to undefined when modelValue is not provided', () => {
    const emit = vi.fn()
    const { internalValue } = useNtkField({}, emit)
    expect(internalValue.value).toBeUndefined()
  })

  it('handleUpdate updates internalValue', () => {
    const emit = vi.fn()
    const { internalValue, handleUpdate } = useNtkField({ modelValue: '' }, emit)
    handleUpdate('new value')
    expect(internalValue.value).toBe('new value')
  })

  it('handleUpdate emits update:modelValue with the new value', () => {
    const emit = vi.fn()
    const { handleUpdate } = useNtkField({ modelValue: '' }, emit)
    handleUpdate('changed')
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'changed')
  })

  it('syncs internalValue when modelValue prop changes', async () => {
    const emit = vi.fn()
    const props = reactive({ modelValue: 'initial' as string | null })
    const { internalValue } = useNtkField(props, emit)
    expect(internalValue.value).toBe('initial')

    props.modelValue = 'updated'
    await nextTick()
    expect(internalValue.value).toBe('updated')
  })

  it('works with array modelValue (multiselect)', () => {
    const emit = vi.fn()
    const { internalValue, handleUpdate } = useNtkField({ modelValue: ['a', 'b'] }, emit)
    expect(internalValue.value).toEqual(['a', 'b'])

    handleUpdate(['a', 'b', 'c'])
    expect(internalValue.value).toEqual(['a', 'b', 'c'])
    expect(emit).toHaveBeenCalledWith('update:modelValue', ['a', 'b', 'c'])
  })
})