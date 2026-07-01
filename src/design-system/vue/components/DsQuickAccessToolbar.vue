<template>
  <div
    :id="id"
    role="toolbar"
    :class="classes"
    :data-testid="testId"
    :aria-label="ariaLabel"
    aria-orientation="horizontal"
  >
    <button
      v-for="item in items"
      :key="item.id"
      ref="buttonRefs"
      type="button"
      class="ntk-quick-access-toolbar__button"
      :class="{
        'ntk-quick-access-toolbar__button--is-selected': item.selected,
        [`ntk-quick-access-toolbar__button--intent-${item.intent}`]: item.intent && item.intent !== 'neutral',
      }"
      :aria-label="item.label"
      :title="item.label"
      :aria-pressed="item.selected ? 'true' : undefined"
      :disabled="item.disabled"
      :tabindex="item.id === resolvedRovingId ? 0 : -1"
      @click="onCommand(item)"
      @keydown="onKeydown($event, item)"
    >
      <DsCommandIcon :name="item.icon" :size="iconSize" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DsCommandIcon from './DsCommandIcon.vue'
import {
  getNtkQuickAccessNextId,
  ntkQuickAccessToolbarDefaults,
  resolveNtkQuickAccessToolbarRecipe,
  type NtkCommandIconSize,
  type NtkQuickAccessItem,
  type NtkQuickAccessToolbarContract,
} from '../../core'

defineOptions({
  name: 'DsQuickAccessToolbar',
})

const props = withDefaults(defineProps<NtkQuickAccessToolbarContract>(), {
  items: () => [],
  variant: ntkQuickAccessToolbarDefaults.variant,
  size: ntkQuickAccessToolbarDefaults.size,
  intent: ntkQuickAccessToolbarDefaults.intent,
  density: ntkQuickAccessToolbarDefaults.density,
})

const emit = defineEmits<{
  command: [id: string]
}>()

const buttonRefs = ref<HTMLButtonElement[]>([])

const classes = computed(() => resolveNtkQuickAccessToolbarRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  class: props.class,
}).classes)

const iconSize = computed<NtkCommandIconSize>(() => props.size ?? ntkQuickAccessToolbarDefaults.size)

const enabledIds = computed(() => props.items.filter((item) => !item.disabled).map((item) => item.id))

// Roving tabindex: the toolbar is a single tab stop. The first enabled item (or
// the first selected enabled item) owns the focusable tabindex until the user
// arrows to another.
const rovingId = ref<string | undefined>(undefined)

const resolvedRovingId = computed<string | undefined>(() => {
  if (rovingId.value && enabledIds.value.includes(rovingId.value)) {
    return rovingId.value
  }
  const firstSelected = props.items.find((item) => item.selected && !item.disabled)
  return firstSelected?.id ?? enabledIds.value[0]
})

function focusItem(id: string): void {
  const index = props.items.findIndex((item) => item.id === id)
  buttonRefs.value[index]?.focus()
}

function onCommand(item: NtkQuickAccessItem): void {
  if (item.disabled) {
    return
  }
  rovingId.value = item.id
  emit('command', item.id)
}

function onKeydown(event: KeyboardEvent, item: NtkQuickAccessItem): void {
  const key = event.key
  if (
    key !== 'ArrowLeft'
    && key !== 'ArrowRight'
    && key !== 'ArrowUp'
    && key !== 'ArrowDown'
    && key !== 'Home'
    && key !== 'End'
  ) {
    return
  }
  const nextId = getNtkQuickAccessNextId(enabledIds.value, item.id, key)
  if (!nextId) {
    return
  }
  event.preventDefault()
  rovingId.value = nextId
  focusItem(nextId)
}

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const ariaLabel = computed(() => props.ariaLabel ?? ntkI18n.t('a11y.quickAccessToolbar'))
</script>

<style scoped>
.ntk-quick-access-toolbar {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-xs);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-quick-access-toolbar--variant-bordered {
  border: 1px solid var(--ntk-border-color);
}

.ntk-quick-access-toolbar--variant-floating {
  border: 1px solid var(--ntk-border-light);
  box-shadow: var(--ntk-shadow-card);
}

.ntk-quick-access-toolbar--density-compact {
  gap: 2px;
  padding: 2px;
}

.ntk-quick-access-toolbar--density-spacious {
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-sm);
}

.ntk-quick-access-toolbar__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-secondary);
  cursor: pointer;
  transition: background var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.ntk-quick-access-toolbar--size-sm .ntk-quick-access-toolbar__button {
  inline-size: 1.75rem;
  block-size: 1.75rem;
}

.ntk-quick-access-toolbar--size-lg .ntk-quick-access-toolbar__button {
  inline-size: 2.5rem;
  block-size: 2.5rem;
}

.ntk-quick-access-toolbar__button:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.ntk-quick-access-toolbar__button:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-quick-access-toolbar__button--is-selected {
  background: var(--ntk-bg-active);
  border-color: var(--ntk-primary);
  color: var(--ntk-primary-dark);
}

.ntk-quick-access-toolbar__button--intent-primary {
  color: var(--ntk-primary-dark);
}

.ntk-quick-access-toolbar__button--intent-success {
  color: var(--ntk-success-dark);
}

.ntk-quick-access-toolbar__button--intent-warning {
  color: var(--ntk-warning-dark);
}

.ntk-quick-access-toolbar__button--intent-danger {
  color: var(--ntk-error-dark);
}

.ntk-quick-access-toolbar__button--intent-info {
  color: var(--ntk-info-dark);
}

.ntk-quick-access-toolbar__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>