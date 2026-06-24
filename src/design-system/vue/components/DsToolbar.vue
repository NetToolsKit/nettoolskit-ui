<template>
  <div
    :id="id"
    role="toolbar"
    :class="classes"
    :data-testid="testId"
    :aria-label="ariaLabel"
    :aria-orientation="'horizontal'"
  >
    <div v-if="$slots.start || $slots.default" class="ntk-toolbar__group ntk-toolbar__group--start">
      <slot name="start" />
      <slot />
    </div>
    <div v-if="$slots.end" class="ntk-toolbar__group ntk-toolbar__group--end">
      <slot name="end" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkToolbarDefaults,
  resolveNtkToolbarRecipe,
  type NtkToolbarContract,
} from '../../core'

defineOptions({
  name: 'DsToolbar',
})

const props = withDefaults(defineProps<NtkToolbarContract>(), {
  variant: ntkToolbarDefaults.variant,
  size: ntkToolbarDefaults.size,
  intent: ntkToolbarDefaults.intent,
  density: ntkToolbarDefaults.density,
  align: ntkToolbarDefaults.align,
  wrap: false,
})

const classes = computed(() => resolveNtkToolbarRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  align: props.align,
  wrap: props.wrap,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-toolbar {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  inline-size: 100%;
  padding: var(--ntk-spacing-sm) var(--ntk-spacing-md);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-toolbar--variant-bordered {
  border: 1px solid var(--ntk-border-color);
}

.ntk-toolbar--variant-floating {
  border: 1px solid var(--ntk-border-light);
  box-shadow: var(--ntk-shadow-card);
}

.ntk-toolbar--density-compact {
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-xs) var(--ntk-spacing-sm);
}

.ntk-toolbar--density-spacious {
  gap: var(--ntk-spacing-md);
  padding: var(--ntk-spacing-md) var(--ntk-spacing-lg);
}

.ntk-toolbar--is-wrap {
  flex-wrap: wrap;
}

.ntk-toolbar__group {
  display: flex;
  align-items: center;
  gap: inherit;
  min-width: 0;
}

.ntk-toolbar__group--start {
  flex: 1 1 auto;
}

.ntk-toolbar__group--end {
  flex: 0 0 auto;
  justify-content: flex-end;
}

.ntk-toolbar--align-center .ntk-toolbar__group--start {
  justify-content: center;
}

.ntk-toolbar--align-end .ntk-toolbar__group--start {
  justify-content: flex-end;
}

.ntk-toolbar--align-between .ntk-toolbar__group--start {
  justify-content: space-between;
}
</style>