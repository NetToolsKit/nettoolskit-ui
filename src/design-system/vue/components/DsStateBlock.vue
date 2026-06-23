<template>
  <div
    :id="id"
    :class="classes"
    :data-testid="testId"
    :role="role"
    :aria-busy="state === 'loading' || state === 'skeleton' ? 'true' : undefined"
    aria-live="polite"
    :aria-label="ariaLabel"
  >
    <template v-if="state === 'skeleton'">
      <span
        v-for="line in skeletonCount"
        :key="line"
        class="ntk-state-block__skeleton-line"
        aria-hidden="true"
      />
    </template>
    <template v-else>
      <span
        v-if="state === 'loading'"
        class="ntk-state-block__spinner"
        aria-hidden="true"
      />
      <span
        v-else-if="icon || $slots.icon"
        class="ntk-state-block__icon"
        aria-hidden="true"
      >
        <slot name="icon">{{ icon }}</slot>
      </span>
      <p v-if="title" class="ntk-state-block__title">{{ title }}</p>
      <p v-if="description" class="ntk-state-block__description">{{ description }}</p>
      <div v-if="$slots.default" class="ntk-state-block__body">
        <slot />
      </div>
      <div v-if="$slots.actions" class="ntk-state-block__actions">
        <slot name="actions" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkStateBlockDefaults,
  resolveNtkStateBlockRecipe,
  type NtkStateBlockContract,
} from '../../core'

defineOptions({
  name: 'DsStateBlock',
})

const props = withDefaults(defineProps<NtkStateBlockContract>(), {
  state: ntkStateBlockDefaults.state,
  variant: ntkStateBlockDefaults.variant,
  size: ntkStateBlockDefaults.size,
  skeletonLines: 3,
})

const role = computed(() => (props.state === 'error' ? 'alert' : 'status'))
const skeletonCount = computed(() => Math.max(1, props.skeletonLines))
const classes = computed(() => resolveNtkStateBlockRecipe({
  state: props.state,
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-xl) var(--ntk-spacing-lg);
  text-align: center;
  border-radius: var(--ntk-radius-lg);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-state-block--variant-inline {
  flex-direction: row;
  justify-content: flex-start;
  padding: var(--ntk-spacing-sm) var(--ntk-spacing-md);
  text-align: start;
}

.ntk-state-block--variant-overlay {
  position: absolute;
  inset: 0;
  background: var(--ntk-bg-overlay);
}

.ntk-state-block__title {
  margin: 0;
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-state-block__description {
  margin: 0;
  max-width: 48ch;
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.ntk-state-block--state-error .ntk-state-block__title {
  color: var(--ntk-error-dark);
}

.ntk-state-block--state-success .ntk-state-block__title {
  color: var(--ntk-success-dark);
}

.ntk-state-block__icon {
  font-size: var(--ntk-font-size-2xl);
}

.ntk-state-block__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-sm);
  margin-block-start: var(--ntk-spacing-sm);
}

/* Loading spinner */
.ntk-state-block__spinner {
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border: 3px solid var(--ntk-border-color);
  border-block-start-color: var(--ntk-primary);
  border-radius: var(--ntk-radius-full);
  animation: ntk-state-block-spin 0.8s linear infinite;
}

@keyframes ntk-state-block-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Skeleton placeholder lines */
.ntk-state-block--state-skeleton {
  align-items: stretch;
}

.ntk-state-block__skeleton-line {
  block-size: 0.75rem;
  border-radius: var(--ntk-radius-sm);
  background: linear-gradient(
    90deg,
    var(--ntk-bg-hover) 0%,
    var(--ntk-bg-active) 50%,
    var(--ntk-bg-hover) 100%
  );
  background-size: 200% 100%;
  animation: ntk-state-block-shimmer 1.4s ease-in-out infinite;
}

.ntk-state-block__skeleton-line:nth-child(2) {
  inline-size: 85%;
}

.ntk-state-block__skeleton-line:last-child {
  inline-size: 60%;
}

@keyframes ntk-state-block-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ntk-state-block__spinner,
  .ntk-state-block__skeleton-line {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
  }
}
</style>