<template>
  <div :id="id" :class="classes" :data-testid="testId">
    <div
      class="ntk-ribbon__tablist"
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
        class="ntk-ribbon__tab"
        :class="{ 'ntk-ribbon__tab--is-active': tab.id === activeId }"
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
      v-if="activeTabModel"
      :id="panelId(activeTabModel.id)"
      class="ntk-ribbon__panel"
      role="tabpanel"
      :aria-labelledby="tabId(activeTabModel.id)"
    >
      <div class="ntk-ribbon__groups">
        <DsRibbonGroup
          v-for="group in activeTabModel.groups"
          :key="group.id"
          :label="group.label"
          :commands="group.commands"
          :size="size"
          :density="density"
          separator
          @command="onCommand"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import DsRibbonGroup from './DsRibbonGroup.vue'
import {
  getNtkRibbonNextTabId,
  ntkRibbonDefaults,
  resolveNtkRibbonRecipe,
  type NtkRibbonContract,
} from '../../core'

defineOptions({
  name: 'DsRibbon',
})

const props = withDefaults(defineProps<NtkRibbonContract>(), {
  tabs: () => [],
  ariaLabel: 'Ribbon',
  variant: ntkRibbonDefaults.variant,
  size: ntkRibbonDefaults.size,
  intent: ntkRibbonDefaults.intent,
  density: ntkRibbonDefaults.density,
})

const emit = defineEmits<{
  'update:activeTab': [value: string]
  command: [id: string]
}>()

const tabRefs = ref<HTMLButtonElement[]>([])

const activeId = computed<string | undefined>(() => {
  if (props.activeTab && props.tabs.some((tab) => tab.id === props.activeTab)) {
    return props.activeTab
  }
  return props.tabs.find((tab) => !tab.disabled)?.id
})

const activeTabModel = computed(() => props.tabs.find((tab) => tab.id === activeId.value))

const enabledIds = computed(() => props.tabs.filter((tab) => !tab.disabled).map((tab) => tab.id))

const classes = computed(() => resolveNtkRibbonRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  class: props.class,
}).classes)

const tabId = (value: string): string => (props.id ? `${props.id}-tab-${value}` : `ntk-ribbon-tab-${value}`)
const panelId = (value: string): string =>
  (props.id ? `${props.id}-panel-${value}` : `ntk-ribbon-panel-${value}`)

function onSelect(value: string, disabled?: boolean): void {
  if (disabled || value === activeId.value) {
    return
  }
  emit('update:activeTab', value)
}

function onCommand(id: string): void {
  emit('command', id)
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
  const nextId = getNtkRibbonNextTabId(enabledIds.value, activeId.value, key)
  if (!nextId) {
    return
  }
  event.preventDefault()
  onSelect(nextId)
  focusTab(nextId)
}
</script>

<style scoped>
.ntk-ribbon {
  display: flex;
  flex-direction: column;
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  border-radius: var(--ntk-radius-md);
}

.ntk-ribbon--variant-bordered {
  border: 1px solid var(--ntk-border-color);
}

.ntk-ribbon__tablist {
  display: flex;
  gap: var(--ntk-spacing-xs);
  overflow-x: auto;
  padding-inline: var(--ntk-spacing-sm);
  border-block-end: 1px solid var(--ntk-border-color);
}

.ntk-ribbon__tab {
  flex: 0 0 auto;
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
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--ntk-transition-fast), border-color var(--ntk-transition-fast);
}

.ntk-ribbon--size-sm .ntk-ribbon__tab {
  font-size: var(--ntk-font-size-xs);
}

.ntk-ribbon--size-lg .ntk-ribbon__tab {
  font-size: var(--ntk-font-size-base);
}

.ntk-ribbon__tab:hover {
  color: var(--ntk-text-primary);
}

.ntk-ribbon__tab--is-active {
  color: var(--ntk-primary);
  border-block-end-color: var(--ntk-primary);
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-ribbon__tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ntk-ribbon__tab:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.ntk-ribbon__panel {
  padding: var(--ntk-spacing-sm);
}

.ntk-ribbon--density-compact .ntk-ribbon__panel {
  padding: var(--ntk-spacing-xs);
}

.ntk-ribbon--density-spacious .ntk-ribbon__panel {
  padding: var(--ntk-spacing-md);
}

.ntk-ribbon__groups {
  display: flex;
  align-items: flex-start;
  gap: var(--ntk-spacing-xs);
  overflow-x: auto;
}
</style>