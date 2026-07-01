<template>
  <div :class="rootClasses" :data-testid="testId">
    <span v-if="label" :id="labelId" class="ntk-field__label">{{ label }}</span>
    <div class="ntk-date-picker__control-row">
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        class="ntk-field__control ntk-date-picker__input"
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
        class="ntk-date-picker__trigger"
        :disabled="disabled || readonly"
        :aria-label="triggerLabel"
        :aria-haspopup="'dialog'"
        :aria-expanded="open ? 'true' : 'false'"
        @click="toggle"
      >
        <DsCommandIcon name="open" :size="size" />
      </button>
    </div>

    <div
      v-if="open"
      ref="popupRef"
      class="ntk-date-picker__popup"
      role="dialog"
      :aria-label="calendarLabel"
      @keydown="onPopupKeydown"
    >
      <div class="ntk-date-picker__header">
        <button
          type="button"
          class="ntk-date-picker__nav"
          :aria-label="previousMonthLabel"
          @click="changeMonth(-1)"
        >
          <DsCommandIcon name="chevron-down" class="ntk-date-picker__nav-icon ntk-date-picker__nav-icon--prev" />
        </button>
        <span class="ntk-date-picker__month-label" aria-live="polite">{{ monthLabel }}</span>
        <button
          type="button"
          class="ntk-date-picker__nav"
          :aria-label="nextMonthLabel"
          @click="changeMonth(1)"
        >
          <DsCommandIcon name="chevron-down" class="ntk-date-picker__nav-icon ntk-date-picker__nav-icon--next" />
        </button>
      </div>

      <div role="grid" class="ntk-date-picker__grid" :aria-label="monthLabel">
        <div role="row" class="ntk-date-picker__weekdays">
          <span
            v-for="weekday in weekdayLabels"
            :key="weekday"
            role="columnheader"
            class="ntk-date-picker__weekday"
          >{{ weekday }}</span>
        </div>
        <div
          v-for="(week, weekIndex) in matrix"
          :key="`week-${weekIndex}`"
          role="row"
          class="ntk-date-picker__week"
        >
          <button
            v-for="cell in week"
            :key="cell.iso"
            type="button"
            role="gridcell"
            class="ntk-date-picker__day"
            :class="{
              'ntk-date-picker__day--outside': !cell.inMonth,
              'ntk-date-picker__day--selected': cell.iso === modelValue,
            }"
            :tabindex="cell.iso === focusedIso ? 0 : -1"
            :aria-selected="cell.iso === modelValue ? 'true' : 'false'"
            :aria-disabled="isCellDisabled(cell.iso) ? 'true' : undefined"
            :data-iso="cell.iso"
            @click="selectDay(cell.iso)"
          >{{ cell.day }}</button>
        </div>
      </div>
    </div>

    <span v-if="errorMessage || hint" :id="descriptionId" class="ntk-field__message">
      {{ errorMessage || hint }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import DsCommandIcon from './DsCommandIcon.vue'
import {
  clampNtkDate,
  formatNtkDate,
  getNtkCalendarMatrix,
  getNtkDensityClass,
  isNtkDateDisabled,
  ntkDatePickerDefaults,
  ntkFieldRecipeClassMap,
  ntkMonthLabels,
  ntkWeekdayLabels,
  parseNtkDate,
  resolveNtkDatePickerRecipe,
  shiftNtkDate,
  shiftNtkMonth,
  type NtkDatePickerContract,
} from '../../core'

defineOptions({
  name: 'DsDatePicker',
})

const props = withDefaults(defineProps<NtkDatePickerContract>(), {
  modelValue: null,
  variant: ntkDatePickerDefaults.variant,
  size: ntkDatePickerDefaults.size,
  intent: ntkDatePickerDefaults.intent,
  density: ntkDatePickerDefaults.density,
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)

const open = ref(false)
// ISO of the day that currently owns the roving tabindex inside the grid.
const focusedIso = ref<string>(props.modelValue ?? formatNtkDate(new Date()))

const weekdayLabels = ntkWeekdayLabels

const inputId = computed(() => (props.id ? `${props.id}__control` : undefined))
const labelId = computed(() => (props.id ? `${props.id}__label` : undefined))
const descriptionId = computed(() => (
  (props.errorMessage || props.hint) && props.id ? `${props.id}__description` : undefined
))

const rootClasses = computed(() => [
  ...resolveNtkDatePickerRecipe({
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
  'ntk-date-picker',
])

const focusedDate = computed(() => parseNtkDate(focusedIso.value) ?? new Date())
const matrix = computed(() =>
  getNtkCalendarMatrix(focusedDate.value.getUTCFullYear(), focusedDate.value.getUTCMonth()))
const monthLabel = computed(() =>
  `${ntkMonthLabels[focusedDate.value.getUTCMonth()]} ${focusedDate.value.getUTCFullYear()}`)
const calendarLabel = computed(() => props.label ? `${props.label} calendar` : 'Choose date')
const previousMonthLabel = 'Previous month'
const nextMonthLabel = 'Next month'

function isCellDisabled(iso: string): boolean {
  return isNtkDateDisabled(iso, props.min, props.max)
}

function openPopup(): void {
  if (props.disabled || props.readonly) {
    return
  }
  // Anchor the roving focus on the selected day (clamped into range) or today.
  const anchor = clampNtkDate(props.modelValue ?? formatNtkDate(new Date()), props.min, props.max)
  focusedIso.value = anchor ?? formatNtkDate(new Date())
  open.value = true
  void nextTick(() => focusDay(focusedIso.value))
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

function focusDay(iso: string): void {
  void nextTick(() => {
    popupRef.value
      ?.querySelector<HTMLButtonElement>(`.ntk-date-picker__day[data-iso="${iso}"]`)
      ?.focus()
  })
}

function moveFocus(iso: string | null): void {
  if (!iso) {
    return
  }
  focusedIso.value = iso
  focusDay(iso)
}

function selectDay(iso: string): void {
  if (isCellDisabled(iso)) {
    return
  }
  focusedIso.value = iso
  emit('update:modelValue', iso)
  closePopup()
}

function changeMonth(delta: number): void {
  const next = shiftNtkMonth(focusedIso.value, delta)
  if (next) {
    focusedIso.value = next
  }
}

function onPopupKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      closePopup()
      return
    case 'ArrowLeft':
      event.preventDefault()
      moveFocus(shiftNtkDate(focusedIso.value, -1))
      return
    case 'ArrowRight':
      event.preventDefault()
      moveFocus(shiftNtkDate(focusedIso.value, 1))
      return
    case 'ArrowUp':
      event.preventDefault()
      moveFocus(shiftNtkDate(focusedIso.value, -7))
      return
    case 'ArrowDown':
      event.preventDefault()
      moveFocus(shiftNtkDate(focusedIso.value, 7))
      return
    case 'PageUp':
      event.preventDefault()
      moveFocus(shiftNtkMonth(focusedIso.value, -1))
      return
    case 'PageDown':
      event.preventDefault()
      moveFocus(shiftNtkMonth(focusedIso.value, 1))
      return
    case 'Home': {
      event.preventDefault()
      const date = parseNtkDate(focusedIso.value)
      if (date) {
        moveFocus(shiftNtkDate(focusedIso.value, -date.getUTCDay()))
      }
      return
    }
    case 'End': {
      event.preventDefault()
      const date = parseNtkDate(focusedIso.value)
      if (date) {
        moveFocus(shiftNtkDate(focusedIso.value, 6 - date.getUTCDay()))
      }
      return
    }
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectDay(focusedIso.value)
      return
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

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const triggerLabel = computed(() => props.triggerLabel ?? ntkI18n.t('a11y.openCalendar'))
</script>

<style scoped>
.ntk-field {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  font-family: var(--ntk-font-family);
}

.ntk-date-picker {
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

.ntk-date-picker__control-row {
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

.ntk-date-picker__trigger {
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

.ntk-date-picker__trigger:hover:not(:disabled) {
  color: var(--ntk-text-primary);
}

.ntk-date-picker__trigger:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.ntk-date-picker__trigger:disabled {
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
.ntk-date-picker__popup {
  position: absolute;
  z-index: 50;
  inset-block-start: calc(100% + var(--ntk-spacing-xs));
  inset-inline-start: 0;
  inline-size: max-content;
  padding: var(--ntk-spacing-sm);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  box-shadow: var(--ntk-shadow-lg);
}

.ntk-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  margin-block-end: var(--ntk-spacing-xs);
}

.ntk-date-picker__month-label {
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.ntk-date-picker__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-secondary);
  cursor: pointer;
}

.ntk-date-picker__nav:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.ntk-date-picker__nav:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-date-picker__nav-icon--prev {
  transform: rotate(90deg);
}

.ntk-date-picker__nav-icon--next {
  transform: rotate(-90deg);
}

.ntk-date-picker__weekdays,
.ntk-date-picker__week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.ntk-date-picker__weekday {
  padding-block: var(--ntk-spacing-xs);
  color: var(--ntk-text-muted);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  text-align: center;
}

.ntk-date-picker__day {
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 0;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-primary);
  font-family: inherit;
  font-size: var(--ntk-font-size-sm);
  cursor: pointer;
}

.ntk-date-picker__day:hover:not([aria-disabled='true']) {
  background: var(--ntk-bg-hover);
}

.ntk-date-picker__day:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.ntk-date-picker__day--outside {
  color: var(--ntk-text-muted);
}

.ntk-date-picker__day--selected {
  background: var(--ntk-primary-dark);
  color: var(--ntk-text-inverse);
}

.ntk-date-picker__day[aria-disabled='true'] {
  color: var(--ntk-text-muted);
  opacity: 0.5;
  cursor: not-allowed;
}
</style>