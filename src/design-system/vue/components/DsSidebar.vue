<template>
  <aside :id="id" :class="classes" :data-testid="testId">
    <div v-if="$slots.header" class="ntk-sidebar__header">
      <slot name="header" />
    </div>
    <nav class="ntk-sidebar__nav" :aria-label="ariaLabel">
      <slot />
    </nav>
    <div v-if="$slots.footer" class="ntk-sidebar__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkSidebarCollapsedClass,
  ntkSidebarDefaults,
  resolveNtkSidebarRecipe,
  type NtkSidebarContract,
} from '../../core'

defineOptions({
  name: 'DsSidebar',
})

const props = withDefaults(defineProps<NtkSidebarContract>(), {
  variant: ntkSidebarDefaults.variant,
  size: ntkSidebarDefaults.size,
  intent: ntkSidebarDefaults.intent,
  collapsed: false,
})

const classes = computed(() => resolveNtkSidebarRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: [props.class, props.collapsed ? ntkSidebarCollapsedClass : undefined],
}).classes)

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const ariaLabel = computed(() => props.ariaLabel ?? ntkI18n.t('a11y.sidebar'))
</script>

<style scoped>
.ntk-sidebar {
  display: flex;
  flex-direction: column;
  inline-size: 16rem;
  block-size: 100%;
  border-inline-end: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-sidebar--variant-elevated {
  border-inline-end-color: transparent;
  box-shadow: var(--ntk-shadow-sm);
}

.ntk-sidebar--variant-transparent {
  border-inline-end-color: transparent;
  background: transparent;
}

.ntk-sidebar--size-sm {
  inline-size: 13rem;
}

.ntk-sidebar--size-lg {
  inline-size: 20rem;
}

.ntk-sidebar--is-collapsed {
  inline-size: 4rem;
}

.ntk-sidebar__header {
  padding: var(--ntk-spacing-md);
  border-block-end: 1px solid var(--ntk-border-color);
}

.ntk-sidebar__nav {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-sm);
  overflow-y: auto;
}

.ntk-sidebar__footer {
  padding: var(--ntk-spacing-md);
  border-block-start: 1px solid var(--ntk-border-color);
}
</style>