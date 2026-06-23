<template>
  <label :class="classes" :for="inputId" :data-testid="testId">
    <span v-if="label" class="ntk-field__label">{{ label }}</span>
    <textarea
      v-if="multiline"
      :id="inputId"
      class="ntk-field__control ntk-field__control--multiline"
      :name="name"
      :value="normalizedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="descriptionId"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <input
      v-else
      :id="inputId"
      class="ntk-field__control"
      :type="type"
      :name="name"
      :value="normalizedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="descriptionId"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    >
    <span v-if="errorMessage || hint" :id="descriptionId" class="ntk-field__message">
      {{ errorMessage || hint }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkFieldDefaults,
  resolveNtkFieldRecipe,
  type NtkFieldContract,
} from '../../core'

type DsInputValue = string | number | null
/** Native input types the field supports. `textarea` is selected via `multiline`. */
type DsInputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'search' | 'tel' | 'url'

defineOptions({
  name: 'DsInput',
})

const props = withDefaults(defineProps<NtkFieldContract<DsInputValue> & {
  /** Native input type. Ignored when `multiline` is set. */
  readonly type?: DsInputType
  /** Render a multi-line textarea instead of a single-line input. */
  readonly multiline?: boolean
  /** Visible rows for the textarea (only when `multiline`). */
  readonly rows?: number
}>(), {
  variant: ntkFieldDefaults.variant,
  size: ntkFieldDefaults.size,
  intent: ntkFieldDefaults.intent,
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  type: 'text',
  multiline: false,
  rows: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const normalizedValue = computed(() => props.modelValue ?? '')
const inputId = computed(() => props.id ? `${props.id}__control` : undefined)
const descriptionId = computed(() => (
  (props.errorMessage || props.hint) && props.id ? `${props.id}__description` : undefined
))
const classes = computed(() => resolveNtkFieldRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  disabled: props.disabled,
  readonly: props.readonly,
  required: props.required,
  invalid: props.invalid,
  class: props.class,
}).classes)
</script>