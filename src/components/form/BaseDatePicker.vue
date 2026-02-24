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
    @update:modelValue="emitModelValue"
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
            color="primary"
            :locale="dateLocale"
            @update:model-value="emitModelValue"
            @update:modelValue="emitModelValue"
          >
            <div class="row items-center justify-end q-gutter-xs">
              <q-btn
                label="Hoje"
                flat
                color="primary"
                @click="setToday"
              />
              <q-btn
                v-bind="{ 'v-close-popup': true }"
                label="Fechar"
                flat
                color="primary"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
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
  placeholder: 'DD/MM/YYYY',
  outlined: true,
  filled: false,
  dense: false,
  readonly: false,
  disable: false,
  rules: () => [],
  lazyRules: true,
  customClass: '',
})

const emit = defineEmits([
  'update:modelValue',
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

const dateLocale = {
  days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  months: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
}

const setToday = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  emitModelValue(`${year}/${month}/${day}`)
}
</script>
