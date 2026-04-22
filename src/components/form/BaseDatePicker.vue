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
    :stack-label="true"
    class="base-date-picker"
    :class="customClass"
    @update:model-value="emitModelValue"
  >
    <template #append>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="internalValue"
            :minimal="true"
            :today-btn="true"
            class="base-date-picker__calendar"
            :locale="dateLocale"
            @update:model-value="emitModelValue"
          >
            <div class="row items-center justify-end q-gutter-xs">
              <q-btn
                label="Today"
                flat
                class="base-date-picker__action base-date-picker__action--accent"
                @click="setToday"
              />
              <q-btn
                v-bind="{ 'v-close-popup': true }"
                label="Close"
                flat
                class="base-date-picker__action"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * Src/components/form/Base Date Picker module.
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
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: 'YYYY/MM/DD',
  outlined: true,
  filled: false,
  dense: false,
  readonly: false,
  disable: false,
  rules: () => [],
  lazyRules: true,
  customClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

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

const dateLocale = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

const setToday = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  emitModelValue(`${year}/${month}/${day}`)
}
</script>

<style lang="scss">
.base-date-picker__calendar {
  --base-date-picker-accent: var(--ntk-primary, var(--ntk-accent));
  --base-date-picker-action-text: var(--ntk-input-action-text, var(--base-date-picker-accent));

  font-family: var(--ntk-font-family);
  background: var(--ntk-popup-bg) !important;
  border-radius: var(--ntk-radius-md);
  box-shadow: var(--ntk-shadow-popup);

  .q-date__header {
    background-color: var(--ntk-popup-header-bg) !important;
    color: var(--ntk-popup-header-text) !important;
  }

  .q-date__view,
  .q-date__calendar {
    background: var(--ntk-popup-bg) !important;
  }

  .q-date__calendar-item .q-btn {
    color: var(--ntk-text-dark) !important;

    &:hover {
      background-color: var(--ntk-bg-hover) !important;
    }

    &.q-btn--unelevated {
      background-color: var(--base-date-picker-accent) !important;
      color: var(--ntk-text-inverse) !important;
    }
  }

  .base-date-picker__action {
    color: var(--base-date-picker-action-text) !important;
  }

  .base-date-picker__action--accent {
    font-weight: var(--ntk-font-weight-medium);
  }
}
</style>
