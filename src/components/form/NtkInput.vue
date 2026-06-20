<template>
  <q-input
    v-model="internalValue"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :outlined="resolvedOutlined"
    :filled="resolvedFilled"
    :dense="resolvedDense"
    :readonly="readonly"
    :disable="resolvedDisable"
    :rules="rules"
    :lazy-rules="lazyRules"
    :error="invalid"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-required="required ? 'true' : undefined"
    :aria-describedby="ariaDescribedBy"
    stack-label
    :class="inputClasses"
    @update:model-value="handleUpdate"
  >
    <template
      v-if="prependIcon || $slots.prepend"
      #prepend
    >
      <q-icon
        v-if="prependIcon"
        :name="prependIcon"
      />
      <slot
        v-if="$slots.prepend"
        name="prepend"
      />
    </template>

    <template
      v-if="appendIcon || $slots.append"
      #append
    >
      <q-icon
        v-if="appendIcon"
        :name="appendIcon"
      />
      <slot
        v-if="$slots.append"
        name="append"
      />
    </template>

    <template
      v-if="hint"
      #hint
    >
      {{ hint }}
    </template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * Src/components/form/Ntk Input module.
 */

import { computed, getCurrentInstance } from 'vue'
import { ntkFieldPropsDefaults, useNtkField } from '../../composables/forms/useNtkField'
import {
  ntkComponentIntents,
  ntkComponentSizes,
  ntkFieldVariants,
  resolveNtkFieldRecipe,
  type NtkComponentIntent,
  type NtkComponentSize,
  type NtkFieldVariant,
} from '../../design-system/core'

const props = defineProps({
  ...ntkFieldPropsDefaults,
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String as () => 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'textarea',
    default: 'text'
  },
  variant: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  intent: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const instance = getCurrentInstance()
const { internalValue, handleUpdate } = useNtkField(props, emit)

const hasRawProp = (name: string): boolean => {
  const vnodeProps = instance?.vnode.props ?? {}
  return Object.prototype.hasOwnProperty.call(vnodeProps, name)
}

const isNtkFieldVariant = (value: unknown): value is NtkFieldVariant =>
  typeof value === 'string' && ntkFieldVariants.includes(value as NtkFieldVariant)

const isNtkFieldSize = (value: unknown): value is NtkComponentSize =>
  typeof value === 'string' && ntkComponentSizes.includes(value as NtkComponentSize)

const isNtkFieldIntent = (value: unknown): value is NtkComponentIntent =>
  typeof value === 'string' && ntkComponentIntents.includes(value as NtkComponentIntent)

const hasExplicitLegacyVisualVariant = computed(() => hasRawProp('outlined') || hasRawProp('filled'))
const requestedVariant = computed(() => isNtkFieldVariant(props.variant) ? props.variant : undefined)
const resolvedOutlined = computed(() => (
  hasExplicitLegacyVisualVariant.value
    ? props.outlined
    : requestedVariant.value
      ? requestedVariant.value === 'outlined'
      : true
))
const resolvedFilled = computed(() => (
  hasExplicitLegacyVisualVariant.value ? props.filled : requestedVariant.value === 'filled'
))
const resolvedDense = computed(() => (
  hasRawProp('dense') ? props.dense : props.size === 'sm'
))
const resolvedDisable = computed(() => hasRawProp('disable') ? props.disable : props.disabled)
const resolvedVariant = computed<NtkFieldVariant>(() => {
  if (resolvedFilled.value) {
    return 'filled'
  }

  if (resolvedOutlined.value) {
    return 'outlined'
  }

  return 'plain'
})
const resolvedSize = computed<NtkComponentSize>(() => {
  if (hasRawProp('dense')) {
    return props.dense ? 'sm' : 'md'
  }

  return isNtkFieldSize(props.size) ? props.size : 'md'
})
const resolvedIntent = computed(() => isNtkFieldIntent(props.intent) ? props.intent : undefined)
const inputClasses = computed(() => resolveNtkFieldRecipe({
  variant: resolvedVariant.value,
  size: resolvedSize.value,
  intent: resolvedIntent.value,
  disabled: resolvedDisable.value,
  readonly: props.readonly,
  required: props.required,
  invalid: props.invalid,
  class: 'ntk-input',
}).classes)
</script>

<style scoped lang="scss">
.ntk-input {
  font-family: var(--ntk-font-family);

  :deep(.q-field__control) {
    border-radius: var(--ntk-radius-md);
    border: 1px solid var(--ntk-input-border);
    background: var(--ntk-input-bg);
    transition: all var(--ntk-transition-base);

    &:hover {
      border-color: var(--ntk-input-border-hover);
    }
  }

  :deep(.q-field--outlined.q-field--focused .q-field__control) {
    border-color: var(--ntk-input-border-focus);
    box-shadow: none;
  }

  :deep(.q-field__label) {
    color: var(--ntk-input-label);
    font-weight: var(--ntk-font-weight-medium);
  }

  :deep(.q-field__native) {
    color: var(--ntk-input-text);
    font-family: var(--ntk-font-family);
  }

  :deep(.q-icon) {
    color: var(--ntk-input-icon);
  }
}
</style>