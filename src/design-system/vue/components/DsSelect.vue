<template>
  <label :class="classes" :for="selectId" :data-testid="testId">
    <span v-if="label" class="ntk-field__label">{{ label }}</span>
    <select
      :id="selectId"
      class="ntk-field__control"
      :name="name"
      :multiple="multiple"
      v-bind="multiple ? {} : { value: singleValue }"
      :disabled="disabled"
      :required="required"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-describedby="descriptionId"
      @change="onChange"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    >
      <option v-if="placeholder && !multiple" value="" :disabled="required">
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :selected="multiple ? selectedSet.has(option.value) : undefined"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
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

interface DsSelectOption {
  readonly label: string
  readonly value: string
  readonly disabled?: boolean
}

type DsSelectValue = string | readonly string[] | null

defineOptions({
  name: 'DsSelect',
})

const props = withDefaults(defineProps<NtkFieldContract<DsSelectValue> & {
  readonly options?: readonly DsSelectOption[]
  /** Allow selecting multiple values; model value becomes a string array. */
  readonly multiple?: boolean
}>(), {
  variant: ntkFieldDefaults.variant,
  size: ntkFieldDefaults.size,
  intent: ntkFieldDefaults.intent,
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  options: () => [],
  multiple: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const singleValue = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : ''))
const selectedSet = computed(() => new Set(Array.isArray(props.modelValue) ? props.modelValue : []))
const selectId = computed(() => props.id ? `${props.id}__control` : undefined)
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

function onChange(event: Event): void {
  const target = event.target as HTMLSelectElement

  if (props.readonly) {
    if (!props.multiple) {
      target.value = singleValue.value
    }
    return
  }

  if (props.multiple) {
    emit('update:modelValue', Array.from(target.selectedOptions).map((option) => option.value))
    return
  }

  emit('update:modelValue', target.value)
}
</script>