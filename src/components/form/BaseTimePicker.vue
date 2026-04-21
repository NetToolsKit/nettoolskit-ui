<template>
  <q-input
    v-bind="$attrs"
    :model-value="internalValue"
    :label="label"
    :placeholder="placeholder"
    :outlined="outlined"
    :filled="filled"
    :dense="dense"
    :readonly="readonly"
    :disable="disable"
    :rules="rules"
    :lazy-rules="lazyRules"
    :mask="mask"
    :error="error"
    :error-message="errorMessage"
    :loading="loading"
    :clearable="clearable"
    :stack-label="stackLabel"
    class="base-time-picker"
    :class="customClass"
    @update:model-value="emitModelValue"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
    <template #append>
      <q-icon
        name="access_time"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-time
            v-model="internalValue"
            :format24h="format24h"
            :with-seconds="withSeconds"
            class="base-time-picker__clock"
            @update:model-value="emitModelValue"
          >
            <div class="row items-center justify-between q-px-sm q-gutter-sm">
              <q-btn
                label="Agora"
                flat
                class="base-time-picker__action base-time-picker__action--accent"
                @click="setNowTime"
              />
              <q-btn
                v-bind="{ 'v-close-popup': true }"
                label="Fechar"
                flat
                class="base-time-picker__action"
              />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * Src/components/form/Base Time Picker module.
 */

import { ref, watch } from 'vue'
import type { ValidationRule } from 'quasar'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  outlined?: boolean
  filled?: boolean
  dense?: boolean
  readonly?: boolean
  disable?: boolean
  rules?: ValidationRule[]
  lazyRules?: boolean
  format24h?: boolean
  withSeconds?: boolean
  mask?: string
  error?: boolean
  errorMessage?: string
  loading?: boolean
  clearable?: boolean
  stackLabel?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: 'HH:mm',
  outlined: true,
  filled: false,
  dense: false,
  readonly: false,
  disable: false,
  rules: () => [],
  lazyRules: true,
  format24h: true,
  withSeconds: false,
  mask: '',
  error: false,
  errorMessage: '',
  loading: false,
  clearable: false,
  stackLabel: true,
  customClass: '',
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  }
)

const emitModelValue = (value: unknown) => {
  internalValue.value = String(value ?? '')
  emit('update:modelValue', internalValue.value)
}

const setNowTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  if (props.withSeconds) {
    const seconds = String(now.getSeconds()).padStart(2, '0')
    emitModelValue(`${hours}:${minutes}:${seconds}`)
    return
  }

  emitModelValue(`${hours}:${minutes}`)
}
</script>

<style lang="scss">
.base-time-picker__clock {
  --base-time-picker-accent: var(--ntk-primary, var(--ntk-accent));
  --base-time-picker-action-text: var(--ntk-input-action-text, var(--base-time-picker-accent));

  font-family: var(--ntk-font-family);
  background: var(--ntk-popup-bg) !important;
  border-radius: var(--ntk-radius-md);
  box-shadow: var(--ntk-shadow-popup);

  .q-time__header {
    background-color: var(--ntk-popup-header-bg) !important;
    color: var(--ntk-popup-header-text) !important;
  }

  .q-time__content,
  .q-time__clock,
  .q-time__clock-position {
    background: var(--ntk-popup-bg) !important;
  }

  .q-time__clock-position {
    color: var(--ntk-text-dark) !important;

    &--active {
      background: var(--base-time-picker-accent) !important;
      color: var(--ntk-text-inverse) !important;
    }
  }

  .q-time__clock-pointer {
    background-color: var(--base-time-picker-accent) !important;

    &::before,
    &::after {
      background-color: var(--base-time-picker-accent) !important;
    }
  }

  .base-time-picker__action {
    color: var(--base-time-picker-action-text) !important;
  }

  .base-time-picker__action--accent {
    font-weight: var(--ntk-font-weight-medium);
  }
}
</style>
