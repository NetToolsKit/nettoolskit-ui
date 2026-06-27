<!--
  CatalogSelect — a fully themed single-choice dropdown for the Inputs gallery.

  Native <select> option lists render with the OS popup (white surface + a
  light-blue highlight) which is completely off-theme in dark mode. This
  replacement uses a themed trigger button + a teleported option panel styled
  with the catalog `--ds-color-*` tokens (mirroring the FONTE menu), so the
  popup follows light/dark/hc/machine and the brand color.

  Keyboard accessible: Up/Down move the active option, Enter/Space select,
  Esc/Tab close. The listbox is wired to the trigger via aria-controls and the
  active descendant is announced through aria-activedescendant.
-->
<template>
  <div
    class="cs-field"
    :class="{ 'cs-field--invalid': invalid, 'cs-field--required': required }"
  >
    <span
      v-if="label"
      :id="`${id}__label`"
      class="cs-field__label"
    >{{ label }}</span>

    <button
      :id="`${id}__trigger`"
      ref="trigger"
      type="button"
      class="cs-trigger"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      :aria-labelledby="label ? `${id}__label ${id}__trigger` : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="(errorMessage || hint) ? `${id}__desc` : undefined"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span
        class="cs-trigger__value"
        :class="{ 'cs-trigger__value--placeholder': !selectedLabel }"
      >{{ selectedLabel || placeholder }}</span>
      <span
        class="cs-trigger__chevron"
        aria-hidden="true"
      >⌄</span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panel"
        class="cs-panel"
        :style="panelStyle"
      >
        <ul
          :id="`${id}__listbox`"
          class="cs-listbox"
          role="listbox"
          :aria-labelledby="label ? `${id}__label` : undefined"
          :aria-activedescendant="activeIndex >= 0 ? `${id}__opt-${activeIndex}` : undefined"
          tabindex="-1"
        >
          <li
            v-for="(opt, i) in options"
            :id="`${id}__opt-${i}`"
            :key="opt.value"
            class="cs-option"
            :class="{
              'cs-option--selected': opt.value === modelValue,
              'cs-option--active': i === activeIndex,
            }"
            role="option"
            :aria-selected="opt.value === modelValue"
            @click="pick(opt.value)"
            @mousemove="activeIndex = i"
          >
            <span class="cs-option__label">{{ opt.label }}</span>
            <span
              v-if="opt.value === modelValue"
              class="cs-option__check"
              aria-hidden="true"
            >✓</span>
          </li>
        </ul>
      </div>
    </Teleport>

    <span
      v-if="errorMessage || hint"
      :id="`${id}__desc`"
      class="cs-field__message"
    >{{ errorMessage || hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

interface Option { value: string; label: string }

const props = withDefaults(defineProps<{
  id: string
  label?: string
  modelValue: string
  options: readonly Option[]
  placeholder?: string
  hint?: string
  errorMessage?: string
  required?: boolean
  invalid?: boolean
}>(), {
  label: '',
  placeholder: 'Selecione…',
  hint: '',
  errorMessage: '',
  required: false,
  invalid: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const panelStyle = ref<Record<string, string>>({})

const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? '',
)

function position(): void {
  const el = trigger.value
  if (!el) return
  const r = el.getBoundingClientRect()
  panelStyle.value = {
    position: 'fixed',
    top: `${r.bottom + 6}px`,
    left: `${r.left}px`,
    width: `${r.width}px`,
  }
}

function openPanel(): void {
  position()
  open.value = true
  activeIndex.value = Math.max(0, props.options.findIndex((o) => o.value === props.modelValue))
  window.addEventListener('scroll', onWindowChange, true)
  window.addEventListener('resize', onWindowChange)
  document.addEventListener('pointerdown', onDocPointer, true)
}

function closePanel(focusTrigger = false): void {
  if (!open.value) return
  open.value = false
  window.removeEventListener('scroll', onWindowChange, true)
  window.removeEventListener('resize', onWindowChange)
  document.removeEventListener('pointerdown', onDocPointer, true)
  if (focusTrigger) trigger.value?.focus()
}

function toggle(): void {
  if (open.value) closePanel(true)
  else openPanel()
}

function pick(value: string): void {
  emit('update:modelValue', value)
  closePanel(true)
}

function onWindowChange(): void {
  position()
}

function onDocPointer(e: PointerEvent): void {
  const t = e.target as Node
  if (trigger.value?.contains(t) || panel.value?.contains(t)) return
  closePanel()
}

function move(delta: number): void {
  const n = props.options.length
  if (n === 0) return
  const start = activeIndex.value < 0 ? (delta > 0 ? -1 : 0) : activeIndex.value
  activeIndex.value = (start + delta + n) % n
  nextTick(scrollActiveIntoView)
}

function scrollActiveIntoView(): void {
  const el = panel.value?.querySelector<HTMLElement>(`#${props.id}__opt-${activeIndex.value}`)
  el?.scrollIntoView({ block: 'nearest' })
}

function onTriggerKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (!open.value) openPanel()
      else move(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      if (!open.value) openPanel()
      else move(-1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!open.value) openPanel()
      else if (activeIndex.value >= 0) pick(props.options[activeIndex.value].value)
      break
    case 'Escape':
      if (open.value) {
        e.preventDefault()
        closePanel(true)
      }
      break
    case 'Tab':
      closePanel()
      break
    case 'Home':
      if (open.value) {
        e.preventDefault()
        activeIndex.value = 0
        nextTick(scrollActiveIntoView)
      }
      break
    case 'End':
      if (open.value) {
        e.preventDefault()
        activeIndex.value = props.options.length - 1
        nextTick(scrollActiveIntoView)
      }
      break
  }
}

watch(open, (v) => {
  if (v) nextTick(scrollActiveIntoView)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowChange, true)
  window.removeEventListener('resize', onWindowChange)
  document.removeEventListener('pointerdown', onDocPointer, true)
})
</script>

<style scoped>
.cs-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.cs-field__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-text);
}

.cs-field--required .cs-field__label::after {
  content: ' *';
  color: var(--ds-color-danger);
  font-weight: 700;
}

.cs-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  inline-size: 100%;
  height: var(--ds-control-height);
  padding: 0 13px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 14px;
  font-family: var(--ds-font-sans);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.cs-trigger:hover {
  border-color: var(--ds-color-border-strong);
}

.cs-trigger:focus-visible {
  outline: none;
  border-color: var(--ds-color-primary);
  box-shadow: var(--ds-focus-ring);
}

.cs-trigger__value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cs-trigger__value--placeholder {
  color: var(--ds-color-text-muted);
}

.cs-trigger__chevron {
  flex: 0 0 auto;
  font-size: 12px;
  line-height: 1;
  color: var(--ds-color-text-muted);
}

.cs-field--invalid .cs-trigger {
  border-color: var(--ds-color-danger);
  box-shadow: 0 0 0 3px var(--ds-color-danger-soft);
}

.cs-field--invalid .cs-field__message {
  color: var(--ds-color-danger);
  font-weight: 500;
}

.cs-field__message {
  font-size: 12px;
  color: var(--ds-color-text-muted);
}
</style>

<!--
  The option panel teleports to <body>, outside the scoped DOM, so its styles
  must be global (mirrors the FONTE QMenu approach). Driven entirely by the
  catalog `--ds-color-*` tokens so the popup follows theme + brand.
-->
<style>
.cs-panel {
  z-index: 1000;
}

.cs-listbox {
  margin: 0;
  padding: 5px;
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow);
}

.cs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 11px;
  border-radius: var(--ds-radius-sm);
  font-size: 13.5px;
  font-family: var(--ds-font-sans);
  color: var(--ds-color-text);
  cursor: pointer;
}

.cs-option--active {
  background: var(--ds-color-surface-muted);
}

.cs-option--selected {
  background: var(--ds-color-primary-soft);
  /* Selected row sits on the brand soft surface → global on-soft rule. */
  color: var(--ntk-on-soft);
  font-weight: 600;
}

.cs-option--selected.cs-option--active {
  background: color-mix(in srgb, var(--ds-color-primary-soft) 80%, var(--ds-color-text) 6%);
}

.cs-option__check {
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--ntk-on-soft);
}
</style>