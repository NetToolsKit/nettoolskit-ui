<template>
  <q-input
    v-bind="$attrs"
    :model-value="modelValue"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :outlined="outlined"
    :filled="filled"
    :dense="dense"
    :readonly="readonly"
    :disable="disable"
    :rules="rules"
    :lazy-rules="lazyRules"
    :clearable="clearable"
    :maxlength="maxlength"
    :counter="counter"
    :mask="mask"
    :loading="loading"
    :autofocus="autofocus"
    :stack-label="stackLabel"
    class="base-input"
    :class="customClass"
    @update:model-value="emitModelValue"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
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
      v-if="$slots.hint || hint"
      #hint
    >
      <slot name="hint">
        {{ hint }}
      </slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import type { ValidationRule } from 'quasar'

interface Props {
  modelValue?: string | number | null
  label?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'date' | 'time' | 'file' | 'datetime-local'
  placeholder?: string
  outlined?: boolean
  filled?: boolean
  dense?: boolean
  readonly?: boolean
  disable?: boolean
  rules?: ValidationRule[]
  lazyRules?: boolean
  clearable?: boolean
  maxlength?: number | string
  counter?: boolean
  mask?: string
  loading?: boolean
  autofocus?: boolean
  stackLabel?: boolean
  customClass?: string
  hint?: string
  showPasswordToggle?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  outlined: true,
  filled: false,
  dense: false,
  readonly: false,
  disable: false,
  rules: () => [],
  lazyRules: true,
  clearable: false,
  maxlength: undefined,
  counter: false,
  mask: '',
  loading: false,
  autofocus: false,
  stackLabel: true,
  customClass: '',
  hint: '',
  showPasswordToggle: false,
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
])

const emitModelValue = (value: unknown) => {
  emit('update:modelValue', value)
}
</script>