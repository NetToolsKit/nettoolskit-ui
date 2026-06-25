<template>
  <div :id="id" :class="classes" :data-testid="testId">
    <div
      class="ntk-tabs__list"
      role="tablist"
      :aria-label="ariaLabel"
    >
      <button
        v-for="tab in tabs"
        :id="tabId(tab.id)"
        :key="tab.id"
        ref="tabRefs"
        type="button"
        role="tab"
        class="ntk-tabs__tab"
        :class="{ 'ntk-tabs__tab--is-active': tab.id === activeId }"
        :aria-selected="tab.id === activeId ? 'true' : 'false'"
        :aria-controls="panelId(tab.id)"
        :tabindex="tab.id === activeId ? 0 : -1"
        :disabled="tab.disabled"
        @click="onSelect(tab.id, tab.disabled)"
        @keydown="onKeydown"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      v-if="activeId"
      :id="panelId(activeId)"
      class="ntk-tabs__panel"
      role="tabpanel"
      tabindex="0"
      :aria-labelledby="tabId(activeId)"
    >
      <slot :name="`panel-${activeId}`" :active-id="activeId">
        <slot :active-id="activeId" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  getNtkTabsNextId,
  ntkTabsDefaults,
  resolveNtkTabsRecipe,
  type NtkTabsContract,
} from '../../core'

defineOptions({
  name: 'DsTabs',
})

const props = withDefaults(defineProps<NtkTabsContract>(), {
  tabs: () => [],
  variant: ntkTabsDefaults.variant,
  size: ntkTabsDefaults.size,
  intent: ntkTabsDefaults.intent,
  ariaLabel: 'Tabs',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabRefs = ref<HTMLButtonElement[]>([])

const activeId = computed<string | undefined>(() => {
  if (props.modelValue && props.tabs.some((tab) => tab.id === props.modelValue)) {
    return props.modelValue
  }
  return props.tabs.find((tab) => !tab.disabled)?.id
})

const enabledIds = computed(() => props.tabs.filter((tab) => !tab.disabled).map((tab) => tab.id))

const classes = computed(() => resolveNtkTabsRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

const tabId = (value: string): string => (props.id ? `${props.id}-tab-${value}` : `ntk-tab-${value}`)
const panelId = (value: string): string =>
  (props.id ? `${props.id}-panel-${value}` : `ntk-tabpanel-${value}`)

function onSelect(value: string, disabled?: boolean): void {
  if (disabled || value === props.modelValue) {
    return
  }
  emit('update:modelValue', value)
}

function focusTab(value: string): void {
  void nextTick(() => {
    const index = props.tabs.findIndex((tab) => tab.id === value)
    tabRefs.value[index]?.focus()
  })
}

function onKeydown(event: KeyboardEvent): void {
  const key = event.key
  if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') {
    return
  }
  const nextId = getNtkTabsNextId(enabledIds.value, activeId.value, key)
  if (!nextId) {
    return
  }
  event.preventDefault()
  onSelect(nextId)
  focusTab(nextId)
}
</script>

<style scoped>
.ntk-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
  font-family: var(--ntk-font-family);
}

.ntk-tabs__list {
  display: flex;
  gap: var(--ntk-spacing-xs);
  border-block-end: 1px solid var(--ntk-border-color);
}

.ntk-tabs__tab {
  margin: 0;
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border: 0;
  border-block-end: 2px solid transparent;
  background: transparent;
  color: var(--ntk-text-secondary);
  font: inherit;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  cursor: pointer;
  transition: color var(--ntk-transition-fast), border-color var(--ntk-transition-fast);
}

.ntk-tabs--size-sm .ntk-tabs__tab {
  font-size: var(--ntk-font-size-xs);
  padding-inline: var(--ntk-spacing-sm);
}

.ntk-tabs--size-lg .ntk-tabs__tab {
  font-size: var(--ntk-font-size-base);
}

.ntk-tabs__tab:hover {
  color: var(--ntk-text-primary);
}

.ntk-tabs__tab--is-active {
  color: var(--ntk-primary);
  border-block-end-color: var(--ntk-primary);
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-tabs__tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ntk-tabs__tab:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-tabs--variant-pill .ntk-tabs__list {
  gap: var(--ntk-spacing-sm);
  border-block-end: 0;
}

.ntk-tabs--variant-pill .ntk-tabs__tab {
  border-block-end: 0;
  border-radius: var(--ntk-radius-full);
}

.ntk-tabs--variant-pill .ntk-tabs__tab--is-active {
  background: var(--ntk-bg-active);
}

.ntk-tabs--variant-enclosed .ntk-tabs__tab {
  border: 1px solid transparent;
  border-block-end: 0;
  border-radius: var(--ntk-radius-md) var(--ntk-radius-md) 0 0;
}

.ntk-tabs--variant-enclosed .ntk-tabs__tab--is-active {
  border-color: var(--ntk-border-color);
  background: var(--ntk-bg-card);
}

.ntk-tabs__panel {
  color: var(--ntk-text-primary);
}

.ntk-tabs__panel:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}
</style>