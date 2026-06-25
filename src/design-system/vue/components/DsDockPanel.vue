<template>
  <section
    :id="id"
    :class="classes"
    :data-testid="testId"
    :aria-label="title"
  >
    <header class="ntk-dock-panel__bar">
      <h3 :id="titleId" class="ntk-dock-panel__title" :title="title">{{ title }}</h3>

      <div class="ntk-dock-panel__actions">
        <slot name="actions" />

        <button
          v-if="collapsible"
          type="button"
          class="ntk-dock-panel__control"
          :aria-label="collapsed ? 'Expand panel' : 'Collapse panel'"
          :aria-expanded="collapsed ? 'false' : 'true'"
          :aria-controls="bodyId"
          @click="onToggleCollapse"
        >
          <DsCommandIcon
            class="ntk-dock-panel__chevron"
            :class="{ 'ntk-dock-panel__chevron--is-collapsed': collapsed }"
            name="chevron-down"
            size="sm"
          />
        </button>

        <button
          v-if="closable"
          type="button"
          class="ntk-dock-panel__control"
          aria-label="Close panel"
          @click="onClose"
        >
          <DsCommandIcon name="close" size="sm" />
        </button>
      </div>
    </header>

    <div
      v-show="!collapsed"
      :id="bodyId"
      class="ntk-dock-panel__body"
      role="region"
      :aria-labelledby="titleId"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DsCommandIcon from './DsCommandIcon.vue'
import {
  ntkDockPanelDefaults,
  resolveNtkDockPanelRecipe,
  type NtkDockPanelContract,
} from '../../core'

defineOptions({
  name: 'DsDockPanel',
})

const props = withDefaults(defineProps<NtkDockPanelContract>(), {
  variant: ntkDockPanelDefaults.variant,
  size: ntkDockPanelDefaults.size,
  intent: ntkDockPanelDefaults.intent,
  density: ntkDockPanelDefaults.density,
  collapsible: false,
  closable: false,
  collapsed: false,
})

const emit = defineEmits<{
  'toggle-collapse': []
  close: []
}>()

const classes = computed(() => resolveNtkDockPanelRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  collapsed: props.collapsed,
  class: props.class,
}).classes)

const titleId = computed(() => (props.id ? `${props.id}-title` : undefined))
const bodyId = computed(() => (props.id ? `${props.id}-body` : undefined))

function onToggleCollapse(): void {
  emit('toggle-collapse')
}

function onClose(): void {
  emit('close')
}
</script>

<style scoped>
.ntk-dock-panel {
  display: flex;
  flex-direction: column;
  min-block-size: 0;
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  border-radius: var(--ntk-radius-md);
}

.ntk-dock-panel--variant-bordered {
  border: 1px solid var(--ntk-border-color);
}

.ntk-dock-panel__bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border-block-end: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-secondary);
}

.ntk-dock-panel--is-collapsed .ntk-dock-panel__bar {
  border-block-end-color: transparent;
}

.ntk-dock-panel--density-compact .ntk-dock-panel__bar {
  padding-block: 2px;
}

.ntk-dock-panel--density-spacious .ntk-dock-panel__bar {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
}

.ntk-dock-panel__title {
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.ntk-dock-panel--size-sm .ntk-dock-panel__title {
  font-size: var(--ntk-font-size-xs);
}

.ntk-dock-panel--size-lg .ntk-dock-panel__title {
  font-size: var(--ntk-font-size-base);
}

.ntk-dock-panel__actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
}

.ntk-dock-panel__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-secondary);
  cursor: pointer;
  transition: background var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.ntk-dock-panel__control:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.ntk-dock-panel__control:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 1px;
}

.ntk-dock-panel__chevron {
  transition: transform var(--ntk-transition-fast);
}

.ntk-dock-panel__chevron--is-collapsed {
  transform: rotate(-90deg);
}

.ntk-dock-panel__body {
  flex: 1 1 auto;
  min-block-size: 0;
  overflow: auto;
  padding: var(--ntk-spacing-sm);
}

.ntk-dock-panel--density-compact .ntk-dock-panel__body {
  padding: var(--ntk-spacing-xs);
}

.ntk-dock-panel--density-spacious .ntk-dock-panel__body {
  padding: var(--ntk-spacing-md);
}
</style>