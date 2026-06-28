<!--
  DsSelect — a fully themed single/multiple-choice combobox.

  The governed select never shows the native OS popup. It renders a themed
  trigger button (the combobox) plus a teleported option panel styled entirely
  with `--ntk-*` tokens, so the popup follows the active theme/brand instead of
  the OS surface. It is searchable (an in-panel filter input) and supports
  single or multiple selection. ARIA follows the combobox + listbox pattern:
  the trigger owns `aria-haspopup="listbox"`/`aria-expanded`/`aria-controls`,
  the panel is the `role="listbox"`, and the active option is announced through
  `aria-activedescendant`.

  Keyboard: Up/Down move the active option, Enter/Space select (toggle in
  multiple mode), Home/End jump to the first/last option, Esc/Tab close.
-->
<template>
  <div :class="classes" :data-testid="testId">
    <span
      v-if="label"
      :id="labelId"
      class="ntk-field__label"
    >{{ label }}</span>

    <button
      :id="triggerId"
      ref="triggerRef"
      type="button"
      class="ntk-field__control ntk-select__trigger"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-labelledby="label ? `${labelId} ${triggerId}` : undefined"
      :aria-label="label ? undefined : (placeholder || 'Select')"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="(errorMessage || hint) ? descriptionId : undefined"
      :disabled="disabled"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      <span
        class="ntk-select__value"
        :class="{ 'ntk-select__value--placeholder': !triggerLabel }"
      >{{ triggerLabel || placeholder }}</span>
      <span class="ntk-select__chevron" aria-hidden="true"></span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panelRef"
        class="ntk-select-panel"
        :style="panelStyle"
      >
        <div v-if="searchable" class="ntk-select-panel__search">
          <input
            ref="searchRef"
            v-model="query"
            type="text"
            class="ntk-select-panel__search-input"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            @keydown="onSearchKeydown"
          >
        </div>
        <ul
          :id="listboxId"
          class="ntk-select-panel__listbox"
          role="listbox"
          :aria-multiselectable="multiple ? 'true' : undefined"
          :aria-labelledby="label ? labelId : undefined"
          :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
          tabindex="-1"
        >
          <li
            v-if="filteredOptions.length === 0"
            class="ntk-select-panel__empty"
            role="presentation"
          >
            {{ emptyLabel }}
          </li>
          <li
            v-for="(option, index) in filteredOptions"
            :id="optionId(index)"
            :key="option.value"
            class="ntk-select-panel__option"
            :class="{
              'ntk-select-panel__option--selected': isSelected(option.value),
              'ntk-select-panel__option--active': index === activeIndex,
              'ntk-select-panel__option--disabled': option.disabled,
            }"
            role="option"
            :aria-selected="isSelected(option.value) ? 'true' : 'false'"
            :aria-disabled="option.disabled ? 'true' : undefined"
            @click="onOptionClick(option)"
            @mousemove="activeIndex = index"
          >
            <span class="ntk-select-panel__option-label">{{ option.label }}</span>
            <span
              v-if="isSelected(option.value)"
              class="ntk-select-panel__option-check"
              aria-hidden="true"
            ></span>
          </li>
        </ul>
      </div>
    </Teleport>

    <span
      v-if="errorMessage || hint"
      :id="descriptionId"
      class="ntk-field__message"
    >{{ errorMessage || hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  getNtkDensityClass,
  ntkFieldDefaults,
  ntkFieldRecipeClassMap,
  resolveNtkFieldRecipe,
  type NtkFieldContract,
} from '../../core'

interface DsSelectOption {
  readonly label: string
  readonly value: string
  readonly disabled?: boolean
}

type DsSelectValue = string | readonly string[] | null

defineOptions({
  name: 'DsSelect',
})

const props = withDefaults(defineProps<NtkFieldContract<DsSelectValue> & {
  readonly options?: readonly DsSelectOption[]
  /** Allow selecting multiple values; model value becomes a string array. */
  readonly multiple?: boolean
  /** Show an in-panel filter input that narrows the visible options. */
  readonly searchable?: boolean
  readonly searchPlaceholder?: string
  /** Label shown when no options match the current search. */
  readonly emptyLabel?: string
}>(), {
  variant: ntkFieldDefaults.variant,
  size: ntkFieldDefaults.size,
  intent: ntkFieldDefaults.intent,
  density: ntkFieldDefaults.density,
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  options: () => [],
  multiple: false,
  searchable: false,
  searchPlaceholder: 'Search...',
  emptyLabel: 'No options',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const query = ref('')
const panelStyle = ref<Record<string, string>>({})

const baseId = computed(() => props.id ?? 'ntk-select')
const labelId = computed(() => `${baseId.value}__label`)
const triggerId = computed(() => `${baseId.value}__trigger`)
const listboxId = computed(() => `${baseId.value}__listbox`)
const descriptionId = computed(() => `${baseId.value}__description`)
const optionId = (index: number): string => `${baseId.value}__opt-${index}`

const selectedValues = computed<string[]>(() => {
  if (Array.isArray(props.modelValue)) {
    return [...props.modelValue]
  }
  return typeof props.modelValue === 'string' && props.modelValue !== '' ? [props.modelValue] : []
})

const isSelected = (value: string): boolean => selectedValues.value.includes(value)

const triggerLabel = computed(() => {
  const labels = props.options
    .filter(option => selectedValues.value.includes(option.value))
    .map(option => option.label)
  return labels.join(', ')
})

const filteredOptions = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!props.searchable || term === '') {
    return props.options
  }
  return props.options.filter(option => option.label.toLowerCase().includes(term))
})

const classes = computed(() => [
  ...resolveNtkFieldRecipe({
    variant: props.variant,
    size: props.size,
    intent: props.intent,
    disabled: props.disabled,
    readonly: props.readonly,
    required: props.required,
    invalid: props.invalid,
    class: [props.class, 'ntk-select'],
  }).classes,
  getNtkDensityClass(ntkFieldRecipeClassMap.root, props.density),
])

function position(): void {
  const el = triggerRef.value
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  panelStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    'min-width': `${rect.width}px`,
  }
}

function firstSelectableIndex(): number {
  const options = filteredOptions.value
  const selected = options.findIndex(option => isSelected(option.value) && !option.disabled)
  if (selected >= 0) {
    return selected
  }
  return options.findIndex(option => !option.disabled)
}

function openPanel(): void {
  if (props.disabled || props.readonly) {
    return
  }
  position()
  open.value = true
  activeIndex.value = Math.max(0, firstSelectableIndex())
  window.addEventListener('scroll', onWindowChange, true)
  window.addEventListener('resize', onWindowChange)
  document.addEventListener('pointerdown', onDocumentPointer, true)
  void nextTick(() => {
    if (props.searchable) {
      searchRef.value?.focus()
    }
    scrollActiveIntoView()
  })
}

function closePanel(focusTrigger = false): void {
  if (!open.value) {
    return
  }
  open.value = false
  query.value = ''
  window.removeEventListener('scroll', onWindowChange, true)
  window.removeEventListener('resize', onWindowChange)
  document.removeEventListener('pointerdown', onDocumentPointer, true)
  if (focusTrigger) {
    triggerRef.value?.focus()
  }
}

function onTriggerClick(): void {
  if (open.value) {
    closePanel(true)
  } else {
    openPanel()
  }
}

function selectOption(option: DsSelectOption): void {
  if (option.disabled || props.readonly) {
    return
  }
  if (props.multiple) {
    const next = new Set(selectedValues.value)
    if (next.has(option.value)) {
      next.delete(option.value)
    } else {
      next.add(option.value)
    }
    emit('update:modelValue', Array.from(next))
    return
  }
  emit('update:modelValue', option.value)
  closePanel(true)
}

function onOptionClick(option: DsSelectOption): void {
  selectOption(option)
}

function moveActive(delta: number): void {
  const options = filteredOptions.value
  const count = options.length
  if (count === 0) {
    return
  }
  let next = activeIndex.value
  for (let step = 0; step < count; step += 1) {
    next = (next + delta + count) % count
    if (!options[next]?.disabled) {
      activeIndex.value = next
      void nextTick(scrollActiveIntoView)
      return
    }
  }
}

function scrollActiveIntoView(): void {
  // jsdom (unit test env) has no global `CSS`, so guard `CSS.escape`. Option ids
  // are generated and selector-safe, so the raw id is a fine fallback.
  const id = optionId(activeIndex.value)
  const safeId = typeof CSS !== 'undefined' && typeof CSS.escape === 'function' ? CSS.escape(id) : id
  const el = panelRef.value?.querySelector<HTMLElement>(`#${safeId}`)
  // jsdom (unit env) doesn't implement scrollIntoView — optional-call it so the
  // keyboard/active-option logic stays test-safe in the browser-less suite.
  el?.scrollIntoView?.({ block: 'nearest' })
}

function onWindowChange(): void {
  position()
}

function onDocumentPointer(event: PointerEvent): void {
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }
  closePanel()
}

function commitActive(): void {
  const option = filteredOptions.value[activeIndex.value]
  if (option) {
    selectOption(option)
  }
}

function onTriggerKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (open.value) {
        moveActive(1)
      } else {
        openPanel()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (open.value) {
        moveActive(-1)
      } else {
        openPanel()
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (open.value) {
        commitActive()
      } else {
        openPanel()
      }
      break
    case 'Home':
      if (open.value) {
        event.preventDefault()
        activeIndex.value = filteredOptions.value.findIndex(option => !option.disabled)
        void nextTick(scrollActiveIntoView)
      }
      break
    case 'End':
      if (open.value) {
        event.preventDefault()
        for (let index = filteredOptions.value.length - 1; index >= 0; index -= 1) {
          if (!filteredOptions.value[index]?.disabled) {
            activeIndex.value = index
            break
          }
        }
        void nextTick(scrollActiveIntoView)
      }
      break
    case 'Escape':
      if (open.value) {
        event.preventDefault()
        closePanel(true)
      }
      break
    case 'Tab':
      closePanel()
      break
  }
}

function onSearchKeydown(event: KeyboardEvent): void {
  if (['ArrowDown', 'ArrowUp', 'Enter', 'Home', 'End', 'Escape'].includes(event.key)) {
    onTriggerKeydown(event)
    return
  }
  if (event.key === 'Tab') {
    closePanel()
  }
}

watch(query, () => {
  activeIndex.value = filteredOptions.value.findIndex(option => !option.disabled)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowChange, true)
  window.removeEventListener('resize', onWindowChange)
  document.removeEventListener('pointerdown', onDocumentPointer, true)
})
</script>

<style scoped>
.ntk-field {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  font-family: var(--ntk-font-family);
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

.ntk-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-input);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: inherit;
  font-size: var(--ntk-font-size-base);
  line-height: var(--ntk-line-height-normal);
  text-align: start;
  cursor: pointer;
  transition:
    border-color var(--ntk-transition-fast),
    box-shadow var(--ntk-transition-fast);
}

.ntk-select__trigger:hover:not(:disabled) {
  border-color: var(--ntk-border-input-hover);
}

.ntk-select__trigger:focus-visible {
  outline: none;
  border-color: var(--ntk-border-focus);
  box-shadow: var(--ntk-shadow-focus);
}

.ntk-select__value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ntk-select__value--placeholder {
  color: var(--ntk-text-muted);
}

.ntk-select__chevron {
  flex: 0 0 auto;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-inline-end: 2px solid var(--ntk-text-muted);
  border-block-end: 2px solid var(--ntk-text-muted);
  transform: rotate(45deg) translate(-2px, -2px);
}

/* Sizes mirror the input field rhythm. */
.ntk-field--size-sm .ntk-select__trigger {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  font-size: var(--ntk-font-size-sm);
}

.ntk-field--size-lg .ntk-select__trigger {
  padding-block: var(--ntk-spacing-md);
  padding-inline: var(--ntk-spacing-lg);
  font-size: var(--ntk-font-size-lg);
}

/* Density. */
.ntk-field--density-compact {
  gap: 2px;
}

.ntk-field--density-compact .ntk-select__trigger {
  padding-block: var(--ntk-spacing-xs);
}

.ntk-field--density-spacious {
  gap: var(--ntk-spacing-sm);
}

.ntk-field--density-spacious .ntk-select__trigger {
  padding-block: var(--ntk-spacing-md);
}

/* Variants. */
.ntk-field--variant-filled .ntk-select__trigger {
  border-color: transparent;
  background: var(--ntk-bg-secondary);
}

.ntk-field--variant-plain .ntk-select__trigger {
  border-color: transparent;
  background: transparent;
}

/* States. */
.ntk-field--is-invalid .ntk-select__trigger {
  border-color: var(--ntk-error);
}

.ntk-field--is-disabled .ntk-select__trigger,
.ntk-select__trigger:disabled {
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
</style>

<!--
  The option panel teleports to <body>, outside the scoped DOM, so its rules
  live in a non-scoped block. They are namespaced under `ntk-select-panel` and
  driven entirely by `--ntk-*` tokens so the popup follows theme + brand. No
  deep selectors are used (the panel renders outside this component scope id).
-->
<style>
.ntk-select-panel {
  z-index: var(--ntk-z-popover, 1000);
  display: flex;
  flex-direction: column;
  max-block-size: 16rem;
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  box-shadow: var(--ntk-shadow-lg);
  font-family: var(--ntk-font-family);
  overflow: hidden;
}

.ntk-select-panel__search {
  padding: var(--ntk-spacing-xs);
  border-block-end: 1px solid var(--ntk-border-light);
}

.ntk-select-panel__search-input {
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border: 1px solid var(--ntk-border-input);
  border-radius: var(--ntk-radius-sm);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: inherit;
  font-size: var(--ntk-font-size-sm);
}

.ntk-select-panel__search-input:focus-visible {
  outline: none;
  border-color: var(--ntk-border-focus);
  box-shadow: var(--ntk-shadow-focus);
}

.ntk-select-panel__listbox {
  margin: 0;
  padding: var(--ntk-spacing-xs);
  list-style: none;
  overflow-y: auto;
}

.ntk-select-panel__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-sm);
  border-radius: var(--ntk-radius-sm);
  color: var(--ntk-text-primary);
  font-size: var(--ntk-font-size-sm);
  cursor: pointer;
}

.ntk-select-panel__option--active {
  background: var(--ntk-bg-hover);
}

.ntk-select-panel__option--selected {
  background: var(--ntk-bg-active);
  color: var(--ntk-on-soft);
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-select-panel__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ntk-select-panel__option-check {
  flex: 0 0 auto;
  inline-size: 0.5rem;
  block-size: 0.75rem;
  border-inline-end: 2px solid currentColor;
  border-block-end: 2px solid currentColor;
  transform: rotate(45deg);
}

.ntk-select-panel__empty {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-sm);
  color: var(--ntk-text-muted);
  font-size: var(--ntk-font-size-sm);
}
</style>