<template>
  <button
    :id="id"
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :data-testid="testId"
    @click="emit('click', $event)"
  >
    <span v-if="icon" class="ntk-button__icon ntk-button__icon--left" aria-hidden="true">{{ icon }}</span>
    <span v-if="$slots.default || label" class="ntk-button__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="iconRight" class="ntk-button__icon ntk-button__icon--right" aria-hidden="true">{{ iconRight }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkButtonDefaults,
  resolveNtkButtonRecipe,
  type NtkButtonContract,
} from '../../core'

defineOptions({
  name: 'DsButton',
})

const props = withDefaults(defineProps<NtkButtonContract>(), {
  variant: ntkButtonDefaults.variant,
  size: ntkButtonDefaults.size,
  intent: ntkButtonDefaults.intent,
  type: 'button',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => resolveNtkButtonRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  disabled: props.disabled,
  loading: props.loading,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-button {
  --ntk-c: var(--ntk-primary);
  --ntk-c-dark: var(--ntk-primary-dark);
  --ntk-c-light: var(--ntk-primary-light);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ntk-spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-md);
  background: transparent;
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  line-height: var(--ntk-line-height-tight);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ntk-transition-fast),
    border-color var(--ntk-transition-fast),
    color var(--ntk-transition-fast),
    box-shadow var(--ntk-transition-fast);
}

.ntk-button:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* Intents map to a single local color channel consumed by the variants. */
.ntk-button--intent-neutral {
  --ntk-c: var(--ntk-text-secondary);
  --ntk-c-dark: var(--ntk-text-primary);
  --ntk-c-light: var(--ntk-bg-secondary);
}

.ntk-button--intent-primary {
  --ntk-c: var(--ntk-primary);
  --ntk-c-dark: var(--ntk-primary-dark);
  --ntk-c-light: var(--ntk-primary-light);
}

.ntk-button--intent-success {
  --ntk-c: var(--ntk-success);
  --ntk-c-dark: var(--ntk-success-dark);
  --ntk-c-light: var(--ntk-success-light);
}

.ntk-button--intent-warning {
  --ntk-c: var(--ntk-warning);
  --ntk-c-dark: var(--ntk-warning-dark);
  --ntk-c-light: var(--ntk-warning-light);
}

.ntk-button--intent-danger {
  --ntk-c: var(--ntk-error);
  --ntk-c-dark: var(--ntk-error-dark);
  --ntk-c-light: var(--ntk-error-light);
}

.ntk-button--intent-info {
  --ntk-c: var(--ntk-info);
  --ntk-c-dark: var(--ntk-info-dark);
  --ntk-c-light: var(--ntk-info-light);
}

/* Sizes. */
.ntk-button--size-sm {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  font-size: var(--ntk-font-size-xs);
}

.ntk-button--size-md {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  font-size: var(--ntk-font-size-sm);
}

.ntk-button--size-lg {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-lg);
  font-size: var(--ntk-font-size-base);
}

/* Variants. */
.ntk-button--variant-solid {
  border-color: var(--ntk-c);
  background: var(--ntk-c);
  color: var(--ntk-text-inverse);
}

.ntk-button--variant-solid:hover:not(:disabled) {
  border-color: var(--ntk-c-dark);
  background: var(--ntk-c-dark);
}

.ntk-button--variant-outline {
  border-color: var(--ntk-c);
  background: transparent;
  color: var(--ntk-c);
}

.ntk-button--variant-outline:hover:not(:disabled) {
  background: var(--ntk-c-light);
}

.ntk-button--variant-ghost {
  border-color: transparent;
  background: transparent;
  color: var(--ntk-c);
}

.ntk-button--variant-ghost:hover:not(:disabled) {
  background: var(--ntk-bg-hover);
}

.ntk-button--variant-link {
  padding-inline: 0;
  border-color: transparent;
  background: transparent;
  color: var(--ntk-text-link);
}

.ntk-button--variant-link:hover:not(:disabled) {
  color: var(--ntk-text-link-hover);
  text-decoration: underline;
}

/* States. */
.ntk-button:disabled,
.ntk-button--is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ntk-button--is-loading,
.ntk-button[aria-busy='true'] {
  opacity: 0.75;
  cursor: progress;
}

.ntk-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.ntk-button__label {
  display: inline-flex;
  align-items: center;
}
</style>