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
  getNtkDensityClass,
  ntkFieldDefaults,
  ntkFieldRecipeClassMap,
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
  density: ntkFieldDefaults.density,
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
const classes = computed(() => [
  ...resolveNtkFieldRecipe({
    variant: props.variant,
    size: props.size,
    intent: props.intent,
    disabled: props.disabled,
    readonly: props.readonly,
    required: props.required,
    invalid: props.invalid,
    class: props.class,
  }).classes,
  getNtkDensityClass(ntkFieldRecipeClassMap.root, props.density),
])

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

<style scoped>
.ntk-field {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  font-family: var(--ntk-font-family);
}

.ntk-field__label {
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  color: var(--ntk-text-secondary);
}

.ntk-field--is-required .ntk-field__label::after {
  content: ' *';
  color: var(--ntk-error);
}

.ntk-field__control {
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--ntk-spacing-sm);
  /* Extra inline-end room keeps text clear of the native dropdown arrow. */
  padding-inline: var(--ntk-spacing-md) var(--ntk-spacing-xl);
  border: 1px solid var(--ntk-border-input);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: inherit;
  font-size: var(--ntk-font-size-base);
  line-height: var(--ntk-line-height-normal);
  cursor: pointer;
  transition:
    border-color var(--ntk-transition-fast),
    box-shadow var(--ntk-transition-fast);
}

.ntk-field__control:hover:not(:disabled):not(:focus) {
  border-color: var(--ntk-border-input-hover);
}

.ntk-field__control:focus {
  outline: none;
  border-color: var(--ntk-border-focus);
  box-shadow: var(--ntk-shadow-focus);
}

.ntk-field__control:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* Multi-select grows to a comfortable list and drops the arrow padding. */
.ntk-field__control[multiple] {
  padding-inline-end: var(--ntk-spacing-md);
  cursor: default;
}

/* Density. Comfortable keeps the baseline control padding; compact tightens
   the field for dense forms and spacious relaxes it for touch surfaces. */
.ntk-field--density-compact {
  gap: 2px;
}

.ntk-field--density-compact .ntk-field__control {
  padding-block: var(--ntk-spacing-xs);
}

.ntk-field--density-spacious {
  gap: var(--ntk-spacing-sm);
}

.ntk-field--density-spacious .ntk-field__control {
  padding-block: var(--ntk-spacing-md);
}

/* Sizes. */
.ntk-field--size-sm .ntk-field__control {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm) var(--ntk-spacing-lg);
  font-size: var(--ntk-font-size-sm);
}

.ntk-field--size-lg .ntk-field__control {
  padding-block: var(--ntk-spacing-md);
  padding-inline: var(--ntk-spacing-lg) var(--ntk-spacing-2xl);
  font-size: var(--ntk-font-size-lg);
}

/* Variants. */
.ntk-field--variant-filled .ntk-field__control {
  border-color: transparent;
  background: var(--ntk-bg-secondary);
}

.ntk-field--variant-plain .ntk-field__control {
  border-color: transparent;
  background: transparent;
}

/* States. */
.ntk-field--is-invalid .ntk-field__control {
  border-color: var(--ntk-error);
}

.ntk-field--is-invalid .ntk-field__control:focus {
  box-shadow: none;
}

.ntk-field--is-disabled .ntk-field__control,
.ntk-field__control:disabled {
  opacity: 0.6;
  background: var(--ntk-bg-secondary);
  cursor: not-allowed;
}

.ntk-field__message {
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.ntk-field--is-invalid .ntk-field__message {
  color: var(--ntk-error);
}
</style>