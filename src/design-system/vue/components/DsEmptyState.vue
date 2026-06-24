<template>
  <div
    :id="id"
    :class="classes"
    :data-testid="testId"
    role="status"
    :aria-label="ariaLabel"
  >
    <div v-if="icon || $slots.icon" class="ntk-empty-state__icon" aria-hidden="true">
      <slot name="icon">{{ icon }}</slot>
    </div>
    <p v-if="title" class="ntk-empty-state__title">{{ title }}</p>
    <p v-if="description" class="ntk-empty-state__description">{{ description }}</p>
    <div v-if="$slots.default" class="ntk-empty-state__body">
      <slot />
    </div>
    <div v-if="$slots.actions" class="ntk-empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkEmptyStateDefaults,
  resolveNtkEmptyStateRecipe,
  type NtkEmptyStateContract,
} from '../../core'

defineOptions({
  name: 'DsEmptyState',
})

const props = withDefaults(defineProps<NtkEmptyStateContract>(), {
  variant: ntkEmptyStateDefaults.variant,
  size: ntkEmptyStateDefaults.size,
  intent: ntkEmptyStateDefaults.intent,
})

const classes = computed(() => resolveNtkEmptyStateRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-xl) var(--ntk-spacing-lg);
  text-align: center;
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-empty-state--variant-bordered {
  border: 1px dashed var(--ntk-border-color);
}

.ntk-empty-state--variant-ghost {
  background: transparent;
}

.ntk-empty-state--size-sm {
  padding: var(--ntk-spacing-md);
}

.ntk-empty-state--size-lg {
  padding: var(--ntk-spacing-3xl) var(--ntk-spacing-xl);
}

.ntk-empty-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: var(--ntk-radius-full);
  font-size: var(--ntk-font-size-2xl);
  background: var(--ntk-bg-active);
  color: var(--ntk-primary);
}

.ntk-empty-state--intent-success .ntk-empty-state__icon {
  background: var(--ntk-success-light);
  color: var(--ntk-success-dark);
}

.ntk-empty-state--intent-warning .ntk-empty-state__icon {
  background: var(--ntk-warning-light);
  color: var(--ntk-warning-dark);
}

.ntk-empty-state--intent-danger .ntk-empty-state__icon {
  background: var(--ntk-error-light);
  color: var(--ntk-error-dark);
}

.ntk-empty-state--intent-info .ntk-empty-state__icon {
  background: var(--ntk-info-light);
  color: var(--ntk-info-dark);
}

.ntk-empty-state__title {
  margin: 0;
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.ntk-empty-state__description {
  margin: 0;
  max-width: 48ch;
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.ntk-empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-sm);
  margin-block-start: var(--ntk-spacing-sm);
}
</style>