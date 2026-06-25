<template>
  <div :id="id" :class="classes" :data-testid="testId">
    <span v-if="icon" class="ntk-toast__icon" aria-hidden="true">{{ icon }}</span>
    <div class="ntk-toast__content">
      <p v-if="title" class="ntk-toast__title">{{ title }}</p>
      <div class="ntk-toast__message">
        <slot>{{ message }}</slot>
      </div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="ntk-toast__dismiss"
      :aria-label="dismissLabel"
      @click="onDismiss"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkToastDefaults,
  resolveNtkToastRecipe,
  type NtkToastContract,
} from '../../core'

defineOptions({
  name: 'DsToast',
})

const props = withDefaults(defineProps<NtkToastContract>(), {
  variant: ntkToastDefaults.variant,
  size: ntkToastDefaults.size,
  intent: ntkToastDefaults.intent,
  dismissible: true,
  dismissLabel: 'Dismiss',
})

const emit = defineEmits<{
  dismiss: []
}>()

const classes = computed(() => resolveNtkToastRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

function onDismiss(): void {
  emit('dismiss')
}
</script>

<style scoped>
.ntk-toast {
  display: flex;
  align-items: flex-start;
  gap: var(--ntk-spacing-sm);
  inline-size: min(92vw, 22rem);
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  box-shadow: var(--ntk-shadow-lg);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
  line-height: var(--ntk-line-height-normal);
  pointer-events: auto;
}

.ntk-toast--size-sm {
  font-size: var(--ntk-font-size-xs);
}

.ntk-toast--size-lg {
  font-size: var(--ntk-font-size-base);
}

.ntk-toast__icon {
  flex: 0 0 auto;
  font-size: var(--ntk-font-size-lg);
  line-height: 1;
}

.ntk-toast__content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  min-inline-size: 0;
}

.ntk-toast__title {
  margin: 0;
  font-weight: var(--ntk-font-weight-semibold);
  color: inherit;
}

.ntk-toast__message {
  margin: 0;
  color: inherit;
}

.ntk-toast__dismiss {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border: 0;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: inherit;
  font-size: var(--ntk-font-size-lg);
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast);
}

.ntk-toast__dismiss:hover {
  background: var(--ntk-bg-hover);
}

.ntk-toast__dismiss:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* Intent + variant treatments (token-only). */
.ntk-toast--variant-soft.ntk-toast--intent-neutral {
  border-color: transparent;
  background: var(--ntk-bg-hover);
}

.ntk-toast--variant-soft.ntk-toast--intent-info {
  border-color: var(--ntk-info);
  background: var(--ntk-info-light);
  color: var(--ntk-info-dark);
}

.ntk-toast--variant-soft.ntk-toast--intent-primary {
  border-color: var(--ntk-primary);
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
}

.ntk-toast--variant-soft.ntk-toast--intent-success {
  border-color: var(--ntk-success);
  background: var(--ntk-success-light);
  color: var(--ntk-success-dark);
}

.ntk-toast--variant-soft.ntk-toast--intent-warning {
  border-color: var(--ntk-warning);
  background: var(--ntk-warning-light);
  color: var(--ntk-warning-dark);
}

.ntk-toast--variant-soft.ntk-toast--intent-danger {
  border-color: var(--ntk-error);
  background: var(--ntk-error-light);
  color: var(--ntk-error-dark);
}

.ntk-toast--variant-solid.ntk-toast--intent-neutral {
  border-color: transparent;
  background: var(--ntk-text-secondary);
  color: var(--ntk-text-inverse);
}

.ntk-toast--variant-solid.ntk-toast--intent-info {
  border-color: transparent;
  background: var(--ntk-info-dark);
  color: var(--ntk-text-inverse);
}

.ntk-toast--variant-solid.ntk-toast--intent-primary {
  border-color: transparent;
  background: var(--ntk-primary-dark);
  color: var(--ntk-text-on-primary);
}

.ntk-toast--variant-solid.ntk-toast--intent-success {
  border-color: transparent;
  background: var(--ntk-success-dark);
  color: var(--ntk-text-inverse);
}

.ntk-toast--variant-solid.ntk-toast--intent-warning {
  border-color: transparent;
  background: var(--ntk-warning-dark);
  color: var(--ntk-text-inverse);
}

.ntk-toast--variant-solid.ntk-toast--intent-danger {
  border-color: transparent;
  background: var(--ntk-error-dark);
  color: var(--ntk-text-inverse);
}

.ntk-toast--variant-outline {
  background: var(--ntk-bg-card);
}

.ntk-toast--variant-outline.ntk-toast--intent-info {
  border-color: var(--ntk-info);
  color: var(--ntk-info-dark);
}

.ntk-toast--variant-outline.ntk-toast--intent-primary {
  border-color: var(--ntk-primary);
  color: var(--ntk-primary-dark);
}

.ntk-toast--variant-outline.ntk-toast--intent-success {
  border-color: var(--ntk-success);
  color: var(--ntk-success-dark);
}

.ntk-toast--variant-outline.ntk-toast--intent-warning {
  border-color: var(--ntk-warning);
  color: var(--ntk-warning-dark);
}

.ntk-toast--variant-outline.ntk-toast--intent-danger {
  border-color: var(--ntk-error);
  color: var(--ntk-error-dark);
}
</style>