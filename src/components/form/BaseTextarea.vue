<template>
  <q-input
    v-bind="$attrs"
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :outlined="outlined"
    :filled="filled"
    :dense="dense"
    :readonly="readonly"
    :disable="disable"
    :rules="rules"
    :lazy-rules="lazyRules"
    :rows="rows"
    :maxlength="maxlength"
    :counter="counter"
    :autogrow="autogrow"
    :error="error"
    :error-message="errorMessage"
    :loading="loading"
    :stack-label="stackLabel"
    :clearable="clearable"
    :bottom-slots="bottomSlots"
    :hint="hint"
    type="textarea"
    class="base-textarea"
    :class="customClass"
    @update:model-value="emitModelValue"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
    @input="$emit('input', $event)"
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
      v-if="$slots.hint"
      #hint
    >
      <slot name="hint" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * Src/components/form/Base Textarea module.
 */

import type { ValidationRule } from 'quasar'

interface Props {
  modelValue?: string | null
  label?: string
  placeholder?: string
  outlined?: boolean
  filled?: boolean
  dense?: boolean
  readonly?: boolean
  disable?: boolean
  rules?: ValidationRule[]
  lazyRules?: boolean
  rows?: number | string
  maxlength?: number | string
  counter?: boolean
  autogrow?: boolean
  error?: boolean
  errorMessage?: string
  loading?: boolean
  stackLabel?: boolean
  clearable?: boolean
  bottomSlots?: boolean
  hint?: string
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  outlined: true,
  filled: false,
  dense: false,
  readonly: false,
  disable: false,
  rules: () => [],
  lazyRules: true,
  rows: 3,
  maxlength: undefined,
  counter: false,
  autogrow: false,
  error: false,
  errorMessage: '',
  loading: false,
  stackLabel: true,
  clearable: false,
  bottomSlots: false,
  hint: '',
  customClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  blur: [event: Event]
  focus: [event: Event]
  input: [event: unknown]
}>()

const emitModelValue = (value: unknown) => {
  emit('update:modelValue', value)
}
</script>
