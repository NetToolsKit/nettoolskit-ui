<template>
  <span
    :id="id"
    :class="classes"
    :data-testid="testId"
    :role="dot ? 'status' : undefined"
    :aria-label="dot ? label : undefined"
  >
    <template v-if="!dot">
      <slot>{{ label }}</slot>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkBadgeDefaults,
  resolveNtkBadgeRecipe,
  type NtkBadgeContract,
} from '../../core'

defineOptions({
  name: 'DsBadge',
})

const props = withDefaults(defineProps<NtkBadgeContract>(), {
  variant: ntkBadgeDefaults.variant,
  size: ntkBadgeDefaults.size,
  intent: ntkBadgeDefaults.intent,
  dot: false,
})

const classes = computed(() => resolveNtkBadgeRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: [props.class, props.dot ? 'ntk-badge--is-dot' : null],
}).classes)
</script>

<style scoped>
.ntk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ntk-spacing-xs);
  min-inline-size: 1.25rem;
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-full);
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

.ntk-badge--size-sm {
  min-inline-size: 1rem;
  padding-inline: var(--ntk-spacing-xs);
}

.ntk-badge--size-lg {
  font-size: var(--ntk-font-size-sm);
  padding-inline: var(--ntk-spacing-md);
}

.ntk-badge--variant-solid.ntk-badge--intent-neutral {
  background: var(--ntk-text-secondary);
  color: var(--ntk-text-inverse);
}

.ntk-badge--variant-solid.ntk-badge--intent-primary {
  background: var(--ntk-primary);
  color: var(--ntk-text-on-primary);
}

.ntk-badge--variant-solid.ntk-badge--intent-success {
  background: var(--ntk-success);
  color: var(--ntk-text-inverse);
}

.ntk-badge--variant-solid.ntk-badge--intent-warning {
  background: var(--ntk-warning);
  color: var(--ntk-text-inverse);
}

.ntk-badge--variant-solid.ntk-badge--intent-danger {
  background: var(--ntk-error);
  color: var(--ntk-text-inverse);
}

.ntk-badge--variant-solid.ntk-badge--intent-info {
  background: var(--ntk-info);
  color: var(--ntk-text-inverse);
}

.ntk-badge--variant-soft.ntk-badge--intent-primary {
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
}

.ntk-badge--variant-soft.ntk-badge--intent-success {
  background: var(--ntk-success-light);
  color: var(--ntk-success-dark);
}

.ntk-badge--variant-soft.ntk-badge--intent-warning {
  background: var(--ntk-warning-light);
  color: var(--ntk-warning-dark);
}

.ntk-badge--variant-soft.ntk-badge--intent-danger {
  background: var(--ntk-error-light);
  color: var(--ntk-error-dark);
}

.ntk-badge--variant-soft.ntk-badge--intent-info {
  background: var(--ntk-info-light);
  color: var(--ntk-info-dark);
}

.ntk-badge--variant-outline {
  background: transparent;
  border-color: var(--ntk-border-color);
  color: var(--ntk-text-primary);
}

.ntk-badge--variant-outline.ntk-badge--intent-primary {
  border-color: var(--ntk-primary);
  color: var(--ntk-primary-dark);
}

.ntk-badge--variant-outline.ntk-badge--intent-success {
  border-color: var(--ntk-success);
  color: var(--ntk-success-dark);
}

.ntk-badge--variant-outline.ntk-badge--intent-warning {
  border-color: var(--ntk-warning);
  color: var(--ntk-warning-dark);
}

.ntk-badge--variant-outline.ntk-badge--intent-danger {
  border-color: var(--ntk-error);
  color: var(--ntk-error-dark);
}

.ntk-badge--variant-outline.ntk-badge--intent-info {
  border-color: var(--ntk-info);
  color: var(--ntk-info-dark);
}

.ntk-badge--is-dot {
  min-inline-size: 0;
  inline-size: 0.625rem;
  block-size: 0.625rem;
  padding: 0;
  border-radius: var(--ntk-radius-full);
}

.ntk-badge--is-dot.ntk-badge--size-lg {
  inline-size: 0.875rem;
  block-size: 0.875rem;
}
</style>