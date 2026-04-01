<template>
  <q-select
    v-bind="$attrs"
    :model-value="modelValue"
    :options="options"
    :label="label"
    :placeholder="placeholder"
    :outlined="outlined"
    :filled="filled"
    :dense="dense"
    :readonly="readonly"
    :disable="disable"
    :rules="rules"
    :lazy-rules="lazyRules"
    :clearable="clearable"
    :use-input="useInput"
    :emit-value="emitValue"
    :map-options="mapOptions"
    :option-value="optionValue"
    :option-label="optionLabel"
    :loading="loading"
    :behavior="behavior"
    :filter-fn="filterFn"
    :no-options-text="noOptionsText"
    :multiple="true"
    :use-chips="useChips"
    :max-values="maxValues"
    :stack-label="stackLabel"
    class="base-multi-select"
    :class="customClass"
    @update:model-value="emitModelValue"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
    @filter="emitFilter"
    @add="emitAdd"
    @remove="emitRemove"
  >
    <template
      v-if="$slots.prepend"
      #prepend
    >
      <slot name="prepend" />
    </template>

    <template
      v-if="$slots.append"
      #append
    >
      <slot name="append" />
    </template>

    <template
      v-if="$slots.option"
      #option="scope"
    >
      <slot
        name="option"
        v-bind="scope"
      />
    </template>

    <template
      v-if="$slots['selected-item']"
      #selected-item="scope"
    >
      <slot
        name="selected-item"
        v-bind="scope"
      />
    </template>

    <template
      v-if="$slots['no-option']"
      #no-option="scope"
    >
      <slot
        name="no-option"
        v-bind="scope"
      />
    </template>
  </q-select>
</template>

<script setup lang="ts">
/**
 * Src/components/form/Base Multi Select module.
 */

import type { ValidationRule } from 'quasar'

type SelectOption = string | number | Record<string, unknown>

interface Props {
  modelValue?: unknown[]
  options?: SelectOption[]
  label?: string
  placeholder?: string
  outlined?: boolean
  filled?: boolean
  dense?: boolean
  readonly?: boolean
  disable?: boolean
  rules?: ValidationRule[]
  lazyRules?: boolean
  clearable?: boolean
  useInput?: boolean
  emitValue?: boolean
  mapOptions?: boolean
  optionValue?: string
  optionLabel?: string
  loading?: boolean
  behavior?: 'menu' | 'dialog' | 'default'
  filterFn?: (...args: unknown[]) => void
  noOptionsText?: string
  useChips?: boolean
  maxValues?: number
  stackLabel?: boolean
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  label: '',
  placeholder: '',
  outlined: true,
  filled: false,
  dense: false,
  readonly: false,
  disable: false,
  rules: () => [],
  lazyRules: true,
  clearable: false,
  useInput: false,
  emitValue: true,
  mapOptions: true,
  optionValue: 'value',
  optionLabel: 'label',
  loading: false,
  behavior: 'default',
  filterFn: undefined,
  noOptionsText: '',
  useChips: true,
  maxValues: undefined,
  stackLabel: false,
  customClass: '',
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'filter',
  'add',
  'remove',
])

const emitModelValue = (value: unknown) => {
  emit('update:modelValue', value as unknown[])
}

const emitFilter = (...args: unknown[]) => {
  emit('filter', ...args)
}

const emitAdd = (details: unknown) => {
  emit('add', details)
}

const emitRemove = (details: unknown) => {
  emit('remove', details)
}
</script>