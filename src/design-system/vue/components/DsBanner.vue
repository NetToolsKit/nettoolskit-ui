<template>
  <div :id="id" :class="classes" :data-testid="testId" :role="role">
    <span v-if="icon" class="ntk-banner__icon" aria-hidden="true">{{ icon }}</span>
    <div class="ntk-banner__content">
      <p v-if="title" class="ntk-banner__title">{{ title }}</p>
      <div class="ntk-banner__message">
        <slot>{{ message }}</slot>
      </div>
      <div v-if="$slots.actions" class="ntk-banner__actions">
        <slot name="actions" />
      </div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="ntk-banner__dismiss"
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
  getNtkBannerRole,
  ntkBannerDefaults,
  resolveNtkBannerRecipe,
  type NtkBannerContract,
} from '../../core'

defineOptions({
  name: 'DsBanner',
})

const props = withDefaults(defineProps<NtkBannerContract>(), {
  variant: ntkBannerDefaults.variant,
  size: ntkBannerDefaults.size,
  intent: ntkBannerDefaults.intent,
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const classes = computed(() => resolveNtkBannerRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

const role = computed(() => getNtkBannerRole(props.intent))

function onDismiss(): void {
  emit('dismiss')
}

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const dismissLabel = computed(() => props.dismissLabel ?? ntkI18n.t('a11y.dismiss'))
</script>

<style scoped>
.ntk-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--ntk-spacing-sm);
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
  line-height: var(--ntk-line-height-normal);
}

.ntk-banner--size-sm {
  font-size: var(--ntk-font-size-xs);
  padding-inline: var(--ntk-spacing-sm);
}

.ntk-banner--size-lg {
  font-size: var(--ntk-font-size-base);
  padding-inline: var(--ntk-spacing-lg);
}

.ntk-banner__icon {
  flex: 0 0 auto;
  font-size: var(--ntk-font-size-lg);
  line-height: 1;
}

.ntk-banner__content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  min-inline-size: 0;
}

.ntk-banner__title {
  margin: 0;
  font-weight: var(--ntk-font-weight-semibold);
  color: inherit;
}

.ntk-banner__message {
  margin: 0;
  color: inherit;
}

.ntk-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-sm);
  margin-block-start: var(--ntk-spacing-xs);
}

.ntk-banner__dismiss {
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

.ntk-banner__dismiss:hover {
  background: var(--ntk-bg-hover);
}

.ntk-banner__dismiss:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* Intent + variant treatments (token-only). */
.ntk-banner--variant-soft.ntk-banner--intent-neutral {
  border-color: transparent;
  background: var(--ntk-bg-hover);
}

.ntk-banner--variant-soft.ntk-banner--intent-info {
  border-color: transparent;
  background: var(--ntk-info-light);
  color: var(--ntk-info-dark);
}

.ntk-banner--variant-soft.ntk-banner--intent-primary {
  border-color: transparent;
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
}

.ntk-banner--variant-soft.ntk-banner--intent-success {
  border-color: transparent;
  background: var(--ntk-success-light);
  color: var(--ntk-success-dark);
}

.ntk-banner--variant-soft.ntk-banner--intent-warning {
  border-color: transparent;
  background: var(--ntk-warning-light);
  color: var(--ntk-warning-dark);
}

.ntk-banner--variant-soft.ntk-banner--intent-danger {
  border-color: transparent;
  background: var(--ntk-error-light);
  color: var(--ntk-error-dark);
}

.ntk-banner--variant-solid.ntk-banner--intent-neutral {
  border-color: transparent;
  background: var(--ntk-text-secondary);
  color: var(--ntk-text-inverse);
}

.ntk-banner--variant-solid.ntk-banner--intent-info {
  border-color: transparent;
  background: var(--ntk-info-dark);
  color: var(--ntk-text-inverse);
}

.ntk-banner--variant-solid.ntk-banner--intent-primary {
  border-color: transparent;
  background: var(--ntk-primary-dark);
  color: var(--ntk-text-on-primary);
}

.ntk-banner--variant-solid.ntk-banner--intent-success {
  border-color: transparent;
  background: var(--ntk-success-dark);
  color: var(--ntk-text-inverse);
}

.ntk-banner--variant-solid.ntk-banner--intent-warning {
  border-color: transparent;
  background: var(--ntk-warning-dark);
  color: var(--ntk-text-inverse);
}

.ntk-banner--variant-solid.ntk-banner--intent-danger {
  border-color: transparent;
  background: var(--ntk-error-dark);
  color: var(--ntk-text-inverse);
}

/* Accent: a neutral card surface with a single colored left border keyed to
   the intent (the reference feedback look). */
.ntk-banner--variant-accent {
  --ntk-accent-c: var(--ntk-text-secondary);
  border-color: var(--ntk-border-color);
  border-inline-start: 3px solid var(--ntk-accent-c);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
}

.ntk-banner--variant-accent.ntk-banner--intent-info {
  --ntk-accent-c: var(--ntk-info);
}

.ntk-banner--variant-accent.ntk-banner--intent-primary {
  --ntk-accent-c: var(--ntk-primary);
}

.ntk-banner--variant-accent.ntk-banner--intent-success {
  --ntk-accent-c: var(--ntk-success);
}

.ntk-banner--variant-accent.ntk-banner--intent-warning {
  --ntk-accent-c: var(--ntk-warning);
}

.ntk-banner--variant-accent.ntk-banner--intent-danger {
  --ntk-accent-c: var(--ntk-error);
}

.ntk-banner--variant-accent .ntk-banner__icon {
  color: var(--ntk-accent-c);
}

.ntk-banner--variant-outline {
  background: transparent;
}

.ntk-banner--variant-outline.ntk-banner--intent-info {
  border-color: var(--ntk-info);
  color: var(--ntk-info-dark);
}

.ntk-banner--variant-outline.ntk-banner--intent-primary {
  border-color: var(--ntk-primary);
  color: var(--ntk-primary-dark);
}

.ntk-banner--variant-outline.ntk-banner--intent-success {
  border-color: var(--ntk-success);
  color: var(--ntk-success-dark);
}

.ntk-banner--variant-outline.ntk-banner--intent-warning {
  border-color: var(--ntk-warning);
  color: var(--ntk-warning-dark);
}

.ntk-banner--variant-outline.ntk-banner--intent-danger {
  border-color: var(--ntk-error);
  color: var(--ntk-error-dark);
}
</style>