<template>
  <div :class="rootClasses" :data-testid="testId">
    <span v-if="label" :id="labelId" class="ntk-field__label">{{ label }}</span>
    <div class="ntk-time-picker__control-row">
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        class="ntk-field__control ntk-time-picker__input"
        :name="name"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="true"
        :required="required"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="descriptionId"
        :aria-labelledby="label ? labelId : undefined"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
      <button
        ref="triggerRef"
        type="button"
        class="ntk-time-picker__trigger"
        :disabled="disabled || readonly"
        :aria-label="triggerLabel"
        :aria-haspopup="'listbox'"
        :aria-expanded="open ? 'true' : 'false'"
        @click="toggle"
      >
        <DsCommandIcon name="settings" :size="size" />
      </button>
    </div>

    <ul
      v-if="open"
      ref="popupRef"
      class="ntk-time-picker__popup"
      role="listbox"
      :aria-label="listLabel"
      :aria-activedescendant="activeOptionId"
      tabindex="-1"
      @keydown="onPopupKeydown"
    >
      <li
        v-for="time in options"
        :id="optionId(time)"
        :key="time"
        role="option"
        class="ntk-time-picker__option"
        :class="{ 'ntk-time-picker__option--selected': time === modelValue }"
        :aria-selected="time === modelValue ? 'true' : 'false'"
        :data-time="time"
        @click="selectTime(time)"
      >{{ time }}</li>
    </ul>

    <span v-if="errorMessage || hint" :id="descriptionId" class="ntk-field__message">
      {{ errorMessage || hint }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import DsCommandIcon from './DsCommandIcon.vue'
import {
  clampNtkTime,
  enumerateNtkTimeOptions,
  getNtkDensityClass,
  ntkFieldRecipeClassMap,
  ntkTimePickerDefaults,
  resolveNtkTimePickerRecipe,
  type NtkTimePickerContract,
} from '../../core'

defineOptions({
  name: 'DsTimePicker',
})

const props = withDefaults(defineProps<NtkTimePickerContract>(), {
  modelValue: null,
  variant: ntkTimePickerDefaults.variant,
  size: ntkTimePickerDefaults.size,
  intent: ntkTimePickerDefaults.intent,
  density: ntkTimePickerDefaults.density,
  step: ntkTimePickerDefaults.step,
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  triggerLabel: 'Open time list',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const popupRef = ref<HTMLUListElement | null>(null)

const open = ref(false)
// Index of the option that currently owns focus inside the listbox.
const activeIndex = ref(0)

const inputId = computed(() => (props.id ? `${props.id}__control` : undefined))
const labelId = computed(() => (props.id ? `${props.id}__label` : undefined))
const descriptionId = computed(() => (
  (props.errorMessage || props.hint) && props.id ? `${props.id}__description` : undefined
))
const listLabel = computed(() => (props.label ? `${props.label} options` : 'Choose time'))

const options = computed(() => enumerateNtkTimeOptions(props.step, props.min, props.max))

const rootClasses = computed(() => [
  ...resolveNtkTimePickerRecipe({
    variant: props.variant,
    size: props.size,
    intent: props.intent,
    disabled: props.disabled,
    readonly: props.readonly,
    required: props.required,
    invalid: props.invalid,
    class: props.class,
  }).classes,
  getNtkDensityClass(ntkFieldRecipeClassMap.root, props.density),
  'ntk-time-picker',
])

function optionId(time: string): string | undefined {
  return props.id ? `${props.id}__opt-${time.replace(':', '-')}` : undefined
}

const activeOptionId = computed(() => {
  const time = options.value[activeIndex.value]
  return time ? optionId(time) : undefined
})

function openPopup(): void {
  if (props.disabled || props.readonly) {
    return
  }
  const list = options.value
  // Anchor the active option on the selected value (clamped into range) or the
  // first option.
  const selected = clampNtkTime(props.modelValue, props.min, props.max)
  const index = selected ? list.indexOf(selected) : -1
  activeIndex.value = index >= 0 ? index : 0
  open.value = true
  void nextTick(() => {
    popupRef.value?.focus()
    scrollActiveIntoView()
  })
}

function closePopup(restoreFocus = true): void {
  if (!open.value) {
    return
  }
  open.value = false
  if (restoreFocus) {
    void nextTick(() => triggerRef.value?.focus())
  }
}

function toggle(): void {
  if (open.value) {
    closePopup()
  } else {
    openPopup()
  }
}

function scrollActiveIntoView(): void {
  void nextTick(() => {
    const time = options.value[activeIndex.value]
    if (!time) {
      return
    }
    const optionEl = popupRef.value
      ?.querySelector<HTMLElement>(`.ntk-time-picker__option[data-time="${time}"]`)
    // scrollIntoView is unimplemented in jsdom; guard so tests/SSR stay safe.
    optionEl?.scrollIntoView?.({ block: 'nearest' })
  })
}

function setActive(index: number): void {
  const last = options.value.length - 1
  if (last < 0) {
    return
  }
  activeIndex.value = Math.max(0, Math.min(last, index))
  scrollActiveIntoView()
}

function selectTime(time: string): void {
  const index = options.value.indexOf(time)
  if (index >= 0) {
    activeIndex.value = index
  }
  emit('update:modelValue', time)
  closePopup()
}

function onPopupKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      closePopup()
      return
    case 'ArrowDown':
      event.preventDefault()
      setActive(activeIndex.value + 1)
      return
    case 'ArrowUp':
      event.preventDefault()
      setActive(activeIndex.value - 1)
      return
    case 'Home':
      event.preventDefault()
      setActive(0)
      return
    case 'End':
      event.preventDefault()
      setActive(options.value.length - 1)
      return
    case 'Enter':
    case ' ': {
      event.preventDefault()
      const time = options.value[activeIndex.value]
      if (time) {
        selectTime(time)
      }
      return
    }
    default:
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  const target = event.target as Node | null
  if (!target) {
    return
  }
  if (popupRef.value?.contains(target) || triggerRef.value?.contains(target)) {
    return
  }
  closePopup(false)
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})

defineExpose({ open })
</script>

<style scoped>
.ntk-field {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  font-family: var(--ntk-font-family);
}

.ntk-time-picker {
  position: relative;
}

.ntk-field__label {
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  color: var(--ntk-text-secondary);
}

.ntk-field--is-required .ntk-field__label::after {
  content: ' *';
  color: var(--ntk-error);
}

.ntk-time-picker__control-row {
  position: relative;
  display: flex;
  align-items: stretch;
}

.ntk-field__control {
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md) var(--ntk-spacing-3xl);
  border: 1px solid var(--ntk-border-input);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: inherit;
  font-size: var(--ntk-font-size-base);
  line-height: var(--ntk-line-height-normal);
  cursor: default;
  transition:
    border-color var(--ntk-transition-fast),
    box-shadow var(--ntk-transition-fast);
}

.ntk-field__control::placeholder {
  color: var(--ntk-text-muted);
}

.ntk-field__control:hover:not(:disabled):not(:focus) {
  border-color: var(--ntk-border-input-hover);
}

.ntk-field__control:focus {
  outline: none;
  border-color: var(--ntk-border-focus);
  box-shadow: var(--ntk-shadow-focus);
}

.ntk-field__control:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-time-picker__trigger {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--ntk-spacing-3xl);
  border: 0;
  border-radius: var(--ntk-radius-md);
  background: transparent;
  color: var(--ntk-text-secondary);
  cursor: pointer;
}

.ntk-time-picker__trigger:hover:not(:disabled) {
  color: var(--ntk-text-primary);
}

.ntk-time-picker__trigger:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.ntk-time-picker__trigger:disabled {
  cursor: not-allowed;
  color: var(--ntk-text-muted);
}

/* Density. */
.ntk-field--density-compact {
  gap: 2px;
}

.ntk-field--density-compact .ntk-field__control {
  padding-block: var(--ntk-spacing-xs);
}

.ntk-field--density-spacious {
  gap: var(--ntk-spacing-sm);
}

.ntk-field--density-spacious .ntk-field__control {
  padding-block: var(--ntk-spacing-md);
}

/* Sizes. */
.ntk-field--size-sm .ntk-field__control {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm) var(--ntk-spacing-2xl);
  font-size: var(--ntk-font-size-sm);
}

.ntk-field--size-lg .ntk-field__control {
  padding-block: var(--ntk-spacing-md);
  padding-inline: var(--ntk-spacing-lg) var(--ntk-spacing-3xl);
  font-size: var(--ntk-font-size-lg);
}

/* Variants. */
.ntk-field--variant-filled .ntk-field__control {
  border-color: transparent;
  background: var(--ntk-bg-secondary);
}

.ntk-field--variant-plain .ntk-field__control {
  border-color: transparent;
  background: transparent;
}

/* States. */
.ntk-field--is-invalid .ntk-field__control {
  border-color: var(--ntk-error);
}

.ntk-field--is-invalid .ntk-field__control:focus {
  box-shadow: none;
}

.ntk-field--is-disabled .ntk-field__control,
.ntk-field__control:disabled {
  opacity: 0.6;
  background: var(--ntk-bg-secondary);
  cursor: not-allowed;
}

.ntk-field__message {
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.ntk-field--is-invalid .ntk-field__message {
  color: var(--ntk-error);
}

/* Popup. */
.ntk-time-picker__popup {
  position: absolute;
  z-index: 50;
  inset-block-start: calc(100% + var(--ntk-spacing-xs));
  inset-inline-start: 0;
  inline-size: 100%;
  max-block-size: 14rem;
  margin: 0;
  padding: var(--ntk-spacing-xs);
  overflow-y: auto;
  list-style: none;
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  box-shadow: var(--ntk-shadow-lg);
}

.ntk-time-picker__popup:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.ntk-time-picker__option {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border-radius: var(--ntk-radius-sm);
  font-size: var(--ntk-font-size-sm);
  cursor: pointer;
}

.ntk-time-picker__option:hover {
  background: var(--ntk-bg-hover);
}

.ntk-time-picker__option--selected {
  background: var(--ntk-primary-dark);
  color: var(--ntk-text-inverse);
}
</style>