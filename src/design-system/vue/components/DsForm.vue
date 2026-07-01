<template>
  <form
    class="ntk-form"
    :class="loading ? 'ntk-form--is-loading' : null"
    :aria-busy="loading ? 'true' : undefined"
    novalidate
    @submit.prevent="onSubmit"
    @reset.prevent="onReset"
  >
    <DsFormLayout :legend="legend" :columns="resolvedColumns">
      <slot name="before-fields" />
      <template v-for="field in fields" :key="field.field">
        <slot :name="`field-${field.field}`" v-bind="fieldSlotProps(field)">
        <DsInput
          v-if="isInputField(field.type)"
          :id="fieldId(field.field)"
          :type="inputType(field.type)"
          :multiline="field.type === 'textarea'"
          :label="field.label"
          :model-value="stringValue(field.field)"
          :placeholder="field.placeholder"
          :hint="field.help"
          :required="field.required"
          :disabled="disabled || field.disabled"
          :readonly="field.readonly"
          :invalid="Boolean(errors[field.field])"
          :error-message="errors[field.field]"
          @update:model-value="setField(field, $event)"
        />

        <DsSelect
          v-else-if="field.type === 'select'"
          :id="fieldId(field.field)"
          :label="field.label"
          :options="selectOptions(field)"
          :model-value="stringValue(field.field)"
          :placeholder="field.placeholder"
          :hint="field.help"
          :required="field.required"
          :disabled="disabled || field.disabled"
          :invalid="Boolean(errors[field.field])"
          :error-message="errors[field.field]"
          @update:model-value="setSelect(field, $event)"
        />

        <label
          v-else-if="field.type === 'checkbox' || field.type === 'switch'"
          class="ntk-field ntk-form__boolean"
          :class="errors[field.field] ? 'ntk-field--is-invalid' : null"
          :for="fieldId(field.field) + '__control'"
        >
          <input
            :id="fieldId(field.field) + '__control'"
            type="checkbox"
            class="ntk-form__boolean-control"
            :checked="booleanValue(field.field)"
            :disabled="disabled || field.disabled"
            :aria-invalid="errors[field.field] ? 'true' : undefined"
            @change="setBoolean(field, ($event.target as HTMLInputElement).checked)"
          >
          <span class="ntk-field__label">{{ field.label }}</span>
          <span v-if="errors[field.field] || field.help" class="ntk-field__message">
            {{ errors[field.field] || field.help }}
          </span>
        </label>

        <DsSelect
          v-else-if="field.type === 'multiselect'"
          :id="fieldId(field.field)"
          multiple
          :label="field.label"
          :options="selectOptions(field)"
          :model-value="selectedStrings(field.field)"
          :hint="field.help"
          :required="field.required"
          :disabled="disabled || field.disabled"
          :invalid="Boolean(errors[field.field])"
          :error-message="errors[field.field]"
          @update:model-value="setMultiselect(field, $event)"
        />
        </slot>
      </template>
      <slot name="after-fields" />

      <template v-if="showActions" #actions>
        <DsButton v-if="showReset" type="reset" variant="ghost" intent="neutral">
          {{ resetLabel }}
        </DsButton>
        <DsButton type="submit" :loading="loading" :disabled="disabled">
          {{ submitLabel }}
        </DsButton>
      </template>
    </DsFormLayout>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  createInitialValues,
  defineForm,
  validateField,
  validateForm,
  type NtkFieldType,
  type NtkFormColumnCount,
  type NtkFormSchema,
  type NtkNormalizedField,
  type NtkNormalizedFormSchema,
} from '../../core'
import DsButton from './DsButton.vue'
import DsFormLayout from './DsFormLayout.vue'
import DsInput from './DsInput.vue'
import DsSelect from './DsSelect.vue'

defineOptions({
  name: 'DsForm',
})

const props = withDefaults(defineProps<{
  /** Form schema (raw or already normalized via defineForm). */
  readonly schema: NtkFormSchema | NtkNormalizedFormSchema
  /** Form values object (use with v-model). When omitted, DsForm keeps its own state. */
  readonly modelValue?: Record<string, unknown>
  readonly legend?: string
  readonly columns?: NtkFormColumnCount
  readonly loading?: boolean
  readonly disabled?: boolean
  readonly submitLabel?: string
  readonly resetLabel?: string
  readonly showActions?: boolean
  readonly showReset?: boolean
  readonly idPrefix?: string
}>(), {
  loading: false,
  disabled: false,
  submitLabel: 'Salvar',
  resetLabel: 'Limpar',
  showActions: true,
  showReset: true,
  idPrefix: 'ds-form',
})

const emit = defineEmits<{
  'update:modelValue': [values: Record<string, unknown>]
  submit: [values: Record<string, unknown>]
  reset: []
}>()

const INPUT_FIELD_TYPES: ReadonlySet<NtkFieldType> = new Set([
  'text', 'email', 'password', 'number', 'date', 'time', 'textarea',
])

// defineForm accepts an already-normalized schema (labels are preserved), so it
// safely normalizes both raw and normalized inputs.
const normalized = computed<NtkNormalizedFormSchema>(() => defineForm(props.schema))
const fields = computed(() => normalized.value.fields)
const resolvedColumns = computed<NtkFormColumnCount>(() => props.columns ?? normalized.value.columns)

const internal = ref<Record<string, unknown>>(
  createInitialValues(normalized.value, props.modelValue ?? {}),
)
const values = computed<Record<string, unknown>>(() => props.modelValue ?? internal.value)

const submitted = ref(false)
const errors = ref<Record<string, string>>({})

const fieldId = (key: string): string => `${props.idPrefix}-${key}`

const isInputField = (type: NtkFieldType): boolean => INPUT_FIELD_TYPES.has(type)
type DsFormInputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'time'
const inputType = (type: NtkFieldType): DsFormInputType =>
  type === 'number' ? 'number' : type === 'textarea' ? 'text' : (type as DsFormInputType)

const stringValue = (key: string): string => {
  const value = values.value[key]
  return value === null || value === undefined ? '' : String(value)
}
const booleanValue = (key: string): boolean => values.value[key] === true
const selectedStrings = (key: string): string[] => {
  const value = values.value[key]
  return Array.isArray(value) ? value.map(String) : []
}

const selectOptions = (field: NtkNormalizedField) =>
  (field.options ?? []).map((option) => ({
    label: option.label,
    value: String(option.value),
    disabled: option.disabled,
  }))

const commit = (next: Record<string, unknown>): void => {
  internal.value = next
  emit('update:modelValue', next)
}

const liveValidate = (field: NtkNormalizedField): void => {
  const result = validateField(field, values.value[field.field])
  if (result === true) {
    const { [field.field]: _removed, ...rest } = errors.value
    errors.value = rest
  } else {
    errors.value = { ...errors.value, [field.field]: result }
  }
}

const update = (field: NtkNormalizedField, value: unknown): void => {
  commit({ ...values.value, [field.field]: value })
  if (submitted.value) {
    liveValidate(field)
  }
}

const setField = (field: NtkNormalizedField, raw: string): void => {
  const coerced = field.type === 'number' ? (raw === '' ? null : Number(raw)) : raw
  update(field, coerced)
}
const setSelect = (field: NtkNormalizedField, raw: string | string[]): void => {
  const value = Array.isArray(raw) ? (raw[0] ?? '') : raw
  const option = (field.options ?? []).find((candidate) => String(candidate.value) === value)
  update(field, option ? option.value : (value === '' ? null : value))
}
const setBoolean = (field: NtkNormalizedField, checked: boolean): void => {
  update(field, checked)
}
const setMultiselect = (field: NtkNormalizedField, raw: string | string[]): void => {
  const chosen = Array.isArray(raw) ? raw : [raw]
  const mapped = (field.options ?? [])
    .filter((option) => chosen.includes(String(option.value)))
    .map((option) => option.value)
  update(field, mapped)
}

/**
 * Scope handed to a per-field override slot (`#field-<name>`). `update` writes
 * through the same normalized `update:modelValue` path as the schema-driven
 * control, so an overridden field keeps v-model, live validation on submit,
 * and initial-value semantics without leaving L2.
 */
const fieldSlotProps = (field: NtkNormalizedField) => ({
  field,
  value: values.value[field.field],
  error: errors.value[field.field],
  disabled: Boolean(props.disabled || field.disabled),
  update: (value: unknown) => update(field, value),
})

const validate = (): boolean => {
  submitted.value = true
  const result = validateForm(normalized.value, values.value)
  errors.value = result.errors
  return result.valid
}

const onSubmit = (): void => {
  if (validate()) {
    emit('submit', values.value)
  }
}

const onReset = (): void => {
  commit(createInitialValues(normalized.value))
  errors.value = {}
  submitted.value = false
  emit('reset')
}

defineExpose({ validate, reset: onReset })
</script>

<style scoped>
.ntk-form__boolean {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-form__boolean .ntk-field__label {
  margin: 0;
}

.ntk-form--is-loading {
  opacity: 0.7;
  pointer-events: none;
}
</style>