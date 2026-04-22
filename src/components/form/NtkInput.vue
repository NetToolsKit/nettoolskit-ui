<template>
  <q-input
    v-model="internalValue"
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
    :aria-describedby="ariaDescribedBy"
    stack-label
    class="ntk-input"
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

import { ntkFieldPropsDefaults, useNtkField } from '../../composables/forms/useNtkField'

const props = defineProps({
  ...ntkFieldPropsDefaults,
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String as () => 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'textarea',
    default: 'text'
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const { internalValue, handleUpdate } = useNtkField(props, emit)
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
