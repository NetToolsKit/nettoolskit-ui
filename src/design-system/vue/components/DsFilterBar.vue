<template>
  <form
    :id="id"
    :class="classes"
    :data-testid="testId"
    role="search"
    :aria-label="ariaLabel ?? 'Filters'"
    :aria-busy="loading ? 'true' : undefined"
    @submit.prevent="onSubmit"
    @reset.prevent="onReset"
  >
    <div v-if="$slots.search" class="ntk-filter-bar__search">
      <slot name="search" />
    </div>
    <div class="ntk-filter-bar__filters">
      <slot />
    </div>
    <div v-if="showActions" class="ntk-filter-bar__actions">
      <slot name="actions">
        <button type="reset" class="ntk-filter-bar__action ntk-filter-bar__action--reset">
          {{ resetLabel }}
        </button>
        <button type="submit" class="ntk-filter-bar__action ntk-filter-bar__action--apply">
          {{ applyLabel }}
        </button>
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkFilterBarDefaults,
  resolveNtkFilterBarRecipe,
  type NtkFilterBarContract,
} from '../../core'

defineOptions({
  name: 'DsFilterBar',
})

const props = withDefaults(defineProps<NtkFilterBarContract>(), {
  variant: ntkFilterBarDefaults.variant,
  size: ntkFilterBarDefaults.size,
  intent: ntkFilterBarDefaults.intent,
  density: ntkFilterBarDefaults.density,
  loading: false,
  applyLabel: 'Apply',
  resetLabel: 'Reset',
  showActions: true,
})

const emit = defineEmits<{
  apply: [event: Event]
  reset: [event: Event]
}>()

const classes = computed(() => resolveNtkFilterBarRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  loading: props.loading,
  class: props.class,
}).classes)

function onSubmit(event: Event): void {
  emit('apply', event)
}

function onReset(event: Event): void {
  emit('reset', event)
}
</script>

<style scoped>
.ntk-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-md);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  border: 1px solid var(--ntk-border-color);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-filter-bar--variant-stacked {
  flex-direction: column;
  align-items: stretch;
}

.ntk-filter-bar--density-compact {
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-sm);
}

.ntk-filter-bar--density-spacious {
  gap: var(--ntk-spacing-md);
  padding: var(--ntk-spacing-lg);
}

.ntk-filter-bar--is-loading {
  opacity: 0.75;
  pointer-events: none;
}

.ntk-filter-bar__search {
  flex: 1 1 16rem;
  min-width: 0;
}

.ntk-filter-bar__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--ntk-spacing-sm);
  min-width: 0;
}

.ntk-filter-bar__actions {
  display: flex;
  gap: var(--ntk-spacing-sm);
  margin-inline-start: auto;
}

.ntk-filter-bar--variant-stacked .ntk-filter-bar__actions {
  margin-inline-start: 0;
  justify-content: flex-end;
}

.ntk-filter-bar__action {
  min-height: 2.25rem;
  padding-inline: var(--ntk-spacing-md);
  border-radius: var(--ntk-radius-md);
  border: 1px solid transparent;
  font: inherit;
  font-weight: var(--ntk-font-weight-semibold);
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast), border-color var(--ntk-transition-fast);
}

.ntk-filter-bar__action--apply {
  background: var(--ntk-primary);
  color: var(--ntk-text-on-primary);
}

.ntk-filter-bar__action--apply:hover {
  background: var(--ntk-primary-dark);
}

.ntk-filter-bar__action--reset {
  background: transparent;
  border-color: var(--ntk-border-color);
  color: var(--ntk-text-secondary);
}

.ntk-filter-bar__action--reset:hover {
  background: var(--ntk-bg-hover);
}

.ntk-filter-bar__action:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}
</style>