<template>
  <q-select
    v-model="internalValue"
    :options="options"
    :label="label"
    :placeholder="placeholder"
    :hint="hint"
    :outlined="resolvedOutlined"
    :filled="resolvedFilled"
    :dense="resolvedDense"
    :readonly="readonly"
    :disable="resolvedDisable"
    :multiple="multiple"
    :use-chips="useChips"
    :emit-value="emitValue"
    :map-options="mapOptions"
    :rules="rules"
    :lazy-rules="lazyRules"
    :error="invalid"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-required="required ? 'true' : undefined"
    :aria-describedby="ariaDescribedBy"
    stack-label
    :class="selectClasses"
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

    <!-- Select all / Deselect all actions for multiple select -->
    <template
      v-if="multiple"
      #before-options
    >
      <q-item>
        <q-item-section>
          <div class="row q-gutter-sm q-px-sm">
            <q-btn 
              label="Select all"
              size="sm" 
              flat 
              dense
              class="ntk-select__bulk-action ntk-select__bulk-action--accent"
              @click="selectAll"
            />
            <q-btn 
              label="Deselect all"
              size="sm" 
              flat 
              dense
              class="ntk-select__bulk-action ntk-select__bulk-action--neutral"
              @click="deselectAll"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-separator />
    </template>

    <!-- Show checkmark on selected options -->
    <template
      v-if="multiple"
      #option="scope"
    >
      <q-item v-bind="scope.itemProps">
        <q-item-section side>
          <q-checkbox 
            :model-value="scope.selected" 
            dense
            class="ntk-select__option-check"
            @update:model-value="scope.toggleOption(scope.opt)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label || scope.opt }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
/**
 * Src/components/form/Ntk Select module.
 */

import { computed, getCurrentInstance, type PropType } from 'vue'
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
    type: [String, Number, Array, Object, null],
    default: null
  },
  options: {
    type: Array as PropType<readonly unknown[]>,
    required: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  useChips: {
    type: Boolean,
    default: false
  },
  emitValue: {
    type: Boolean,
    default: true
  },
  mapOptions: {
    type: Boolean,
    default: true
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
  'update:modelValue': [value: unknown]
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
const selectClasses = computed(() => resolveNtkFieldRecipe({
  variant: resolvedVariant.value,
  size: resolvedSize.value,
  intent: resolvedIntent.value,
  disabled: resolvedDisable.value,
  readonly: props.readonly,
  required: props.required,
  invalid: props.invalid,
  class: 'ntk-select',
}).classes)

const selectAll = () => {
  if (props.multiple && props.emitValue) {
    const allValues = props.options.map((opt: any) => opt.value || opt)
    internalValue.value = allValues
    handleUpdate(allValues)
  } else if (props.multiple) {
    internalValue.value = [...props.options]
    handleUpdate([...props.options])
  }
}

const deselectAll = () => {
  if (props.multiple) {
    internalValue.value = []
    handleUpdate([])
  }
}
</script>

<style scoped lang="scss">
.ntk-select {
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

  :deep(.q-chip) {
    background-color: var(--ntk-primary);
    color: var(--ntk-text-inverse);
    border-radius: var(--ntk-radius-md);
  }

  :deep(.ntk-select__bulk-action--accent) {
    color: var(--ntk-input-action-text, var(--ntk-primary, var(--ntk-accent))) !important;
    font-weight: var(--ntk-font-weight-medium);
  }

  :deep(.ntk-select__bulk-action--neutral) {
    color: var(--ntk-text-muted, var(--ntk-input-label)) !important;
  }
}
</style>

<style lang="scss">
.q-menu {
  background: var(--ntk-menu-bg) !important;
  box-shadow: var(--ntk-shadow-popup);
  border-radius: var(--ntk-radius-md);

  .q-item {
    font-family: var(--ntk-font-family);
    color: var(--ntk-text-dark) !important;
    border-radius: var(--ntk-radius-sm);
    margin: 4px 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--ntk-menu-item-hover) !important;
    }

    &.q-item--active,
    &[aria-selected="true"] {
      background-color: var(--ntk-menu-item-active-bg) !important;
      color: var(--ntk-menu-item-active-text) !important;
      
      .q-item__label {
        color: var(--ntk-menu-item-active-text) !important;
      }
    }
  }

  .q-item__label {
    color: var(--ntk-text-dark) !important;
  }

  .q-checkbox {
    .q-checkbox__inner {
      color: var(--ntk-primary) !important;
    }
  }
}
</style>