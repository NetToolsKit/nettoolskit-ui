<template>
  <ntk-select
    v-model="internalValue"
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
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    multiple
    :use-chips="useChips"
    :emit-value="emitValue"
    :map-options="mapOptions"
    @update:model-value="handleUpdate"
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
  </ntk-select>
</template>

<script setup lang="ts">
import { ntkFieldPropsDefaults, useNtkField } from '../../composables/forms/useNtkField'
import ntkSelect from './NtkSelect.vue'

const props = defineProps({
  ...ntkFieldPropsDefaults,
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  useChips: {
    type: Boolean,
    default: true
  },
  emitValue: {
    type: Boolean,
    default: true
  },
  mapOptions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const { internalValue, handleUpdate } = useNtkField(props, emit)
</script>

<style scoped lang="scss">
// Styles are inherited from NtkSelect
</style>
