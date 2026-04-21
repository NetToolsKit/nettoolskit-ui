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
    class="ntk-date-picker"
    @update:model-value="handleUpdate"
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
            minimal
            today-btn
            class="ntk-date-picker__calendar"
            :locale="dateLocale"
            @update:model-value="handleUpdate"
          >
            <div class="row items-center justify-end q-gutter-xs">
              <q-btn
                label="Hoje"
                flat
                class="ntk-date-picker__action ntk-date-picker__action--accent"
                @click="setToday"
              />
              <q-btn
                v-close-popup
                label="Fechar"
                flat
                class="ntk-date-picker__action"
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
 * Src/components/form/Ntk Date Picker module.
 */

import { ntkFieldPropsDefaults, useNtkField } from '../../composables/forms/useNtkField'

const props = defineProps({
  ...ntkFieldPropsDefaults,
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'DD/MM/YYYY'
  }
})

const emit = defineEmits(['update:modelValue'])

const { internalValue, handleUpdate } = useNtkField(props, emit)

// Locale object for QDate component
const dateLocale = {
  days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
}

const setToday = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const dateString = `${year}/${month}/${day}`

  internalValue.value = dateString
  handleUpdate(dateString)
}
</script>

<style scoped lang="scss">
.ntk-date-picker {
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
.ntk-date-picker__calendar {
  --ntk-date-picker-accent: var(--ntk-primary, var(--ntk-accent));
  --ntk-date-picker-action-text: var(--ntk-input-action-text, var(--ntk-date-picker-accent));

  font-family: var(--ntk-font-family);
  box-shadow: var(--ntk-shadow-popup);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-popup-bg) !important;

  .q-date__header {
    background-color: var(--ntk-popup-header-bg) !important;
    color: var(--ntk-popup-header-text) !important;
  }

  .q-date__view {
    background: var(--ntk-popup-bg) !important;
  }

  .q-date__calendar {
    background: var(--ntk-popup-bg) !important;

    .q-btn {
      color: var(--ntk-text-dark) !important;

      &.q-btn--flat {
        color: var(--ntk-text-dark) !important;
      }
    }
  }

  .q-date__calendar-item .q-btn {
    color: var(--ntk-text-dark) !important;

    &:hover {
      background-color: var(--ntk-bg-hover) !important;
    }

    &.q-btn--unelevated {
      background-color: var(--ntk-date-picker-accent) !important;
      color: var(--ntk-text-inverse) !important;
    }
  }

  .ntk-date-picker__action {
    color: var(--ntk-date-picker-action-text) !important;
  }

  .ntk-date-picker__action--accent {
    font-weight: var(--ntk-font-weight-medium);
  }
}
</style>
