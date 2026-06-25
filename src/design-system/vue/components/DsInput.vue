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
  getNtkDensityClass,
  ntkFieldDefaults,
  ntkFieldRecipeClassMap,
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
  density: ntkFieldDefaults.density,
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
  padding-inline: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-input);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: inherit;
  font-size: var(--ntk-font-size-base);
  line-height: var(--ntk-line-height-normal);
  transition:
    border-color var(--ntk-transition-fast),
    box-shadow var(--ntk-transition-fast);
}

.ntk-field__control::placeholder {
  color: var(--ntk-text-muted);
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

.ntk-field__control--multiline {
  resize: vertical;
  min-block-size: calc(var(--ntk-spacing-3xl) + var(--ntk-spacing-md));
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
  padding-inline: var(--ntk-spacing-sm);
  font-size: var(--ntk-font-size-sm);
}

.ntk-field--size-lg .ntk-field__control {
  padding-block: var(--ntk-spacing-md);
  padding-inline: var(--ntk-spacing-lg);
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
  padding-inline: 0;
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