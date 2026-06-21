<template>
  <q-input
    v-model="internalValue"
    :label="label"
    :placeholder="placeholder"
    :outlined="outlined"
    :filled="filled"
    :dense="dense"
    :readonly="readonly"
    :disable="disable"
    :rules="rules"
    :lazy-rules="lazyRules"
    stack-label
    class="ntk-time-picker"
    @update:model-value="handleTimeUpdate"
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
            mask="HH:mm"
            class="ntk-time-picker__clock"
            :format24h="timeFormat24h"
            @update:model-value="handleTimeUpdate"
          >
            <div class="row items-center justify-between q-px-sm">
              <q-btn 
                :label="timeFormat24h ? '12h' : '24h'" 
                flat 
                dense
                class="ntk-time-picker__action"
                @click="timeFormat24h = !timeFormat24h" 
              />
            <div class="row items-center q-gutter-sm">
                <q-btn
                  label="Now"
                  flat
                  class="ntk-time-picker__action ntk-time-picker__action--accent"
                  @click="setNowTime"
                />
                <q-btn
                  v-close-popup
                  label="OK"
                  flat
                  class="ntk-time-picker__action"
                />
              </div>
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * Src/components/form/Ntk Time Picker module.
 */

import { ref } from 'vue'
import { ntkFieldPropsDefaults, useNtkField } from '../../composables/forms/useNtkField'

const props = defineProps({
  ...ntkFieldPropsDefaults,
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'HH:mm'
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const { internalValue, handleUpdate } = useNtkField<string | null>(props, emit)
const timeFormat24h = ref(true)

const handleTimeUpdate = (value: string | number | null) => {
  handleUpdate(value === null ? null : String(value))
}

const setNowTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  internalValue.value = `${hours}:${minutes}`
  emit('update:modelValue', internalValue.value)
}
</script>

<style scoped lang="scss">
.ntk-time-picker {
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

<style lang="scss">
.ntk-time-picker__clock {
  --ntk-time-picker-accent: var(--ntk-primary, var(--ntk-accent));
  --ntk-time-picker-action-text: var(--ntk-input-action-text, var(--ntk-time-picker-accent));

  font-family: var(--ntk-font-family);
  box-shadow: var(--ntk-shadow-popup);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-popup-bg) !important;

  .q-time__header {
    background-color: var(--ntk-popup-header-bg) !important;
    color: var(--ntk-popup-header-text) !important;
  }

  .q-time__content {
    background: var(--ntk-popup-bg) !important;
  }

  .q-time__clock {
    background: var(--ntk-popup-bg) !important;
    
    .q-time__clock-position {
      background: var(--ntk-popup-bg) !important;
      color: var(--ntk-text-dark) !important;
      
      &--active {
        background: var(--ntk-time-picker-accent) !important;
        color: var(--ntk-text-inverse) !important;
      }
    }
  }

  .q-time__clock-pointer {
    background-color: var(--ntk-time-picker-accent) !important;
    
    &::before,
    &::after {
      background-color: var(--ntk-time-picker-accent) !important;
    }
  }

  .ntk-time-picker__action {
    color: var(--ntk-time-picker-action-text) !important;
  }

  .ntk-time-picker__action--accent {
    font-weight: var(--ntk-font-weight-medium);
  }
}
</style>
