<template>
  <header :id="id" :class="classes" :data-testid="testId">
    <div class="ntk-header__start">
      <button
        v-if="showMenu"
        type="button"
        class="ntk-header__menu"
        :aria-label="menuLabel"
        @click="onToggleMenu"
      >
        <span aria-hidden="true">&#9776;</span>
      </button>
      <div v-if="$slots.brand" class="ntk-header__brand">
        <slot name="brand" />
      </div>
    </div>
    <div class="ntk-header__center">
      <slot>
        <span v-if="title" class="ntk-header__title">{{ title }}</span>
      </slot>
    </div>
    <div v-if="$slots.actions" class="ntk-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkHeaderDefaults,
  resolveNtkHeaderRecipe,
  type NtkHeaderContract,
} from '../../core'

defineOptions({
  name: 'DsHeader',
})

const props = withDefaults(defineProps<NtkHeaderContract>(), {
  variant: ntkHeaderDefaults.variant,
  size: ntkHeaderDefaults.size,
  intent: ntkHeaderDefaults.intent,
  showMenu: false,
  menuLabel: 'Open menu',
})

const emit = defineEmits<{
  'toggle-menu': []
}>()

const classes = computed(() => resolveNtkHeaderRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

function onToggleMenu(): void {
  emit('toggle-menu')
}
</script>

<style scoped>
.ntk-header {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  inline-size: 100%;
  block-size: 4rem;
  padding-inline: var(--ntk-spacing-lg);
  border-block-end: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-header--variant-elevated {
  border-block-end-color: transparent;
  box-shadow: var(--ntk-shadow-sm);
}

.ntk-header--variant-transparent {
  border-block-end-color: transparent;
  background: transparent;
}

.ntk-header--size-sm {
  block-size: 3rem;
  padding-inline: var(--ntk-spacing-md);
}

.ntk-header--size-lg {
  block-size: 5rem;
}

.ntk-header__start {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-header__center {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-inline-size: 0;
}

.ntk-header__title {
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.ntk-header__actions {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-header__menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 0;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-xl);
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.ntk-header__menu:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.ntk-header__menu:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}
</style>