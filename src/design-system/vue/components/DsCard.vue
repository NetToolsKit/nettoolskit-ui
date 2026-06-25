<template>
  <article
    :id="id"
    :class="classes"
    :data-testid="testId"
    :tabindex="clickable ? 0 : undefined"
    :role="clickable ? 'button' : undefined"
    @click="onPointerActivate"
    @keydown.enter.prevent="onKeyboardActivate"
    @keydown.space.prevent="onKeyboardActivate"
  >
    <header v-if="$slots.header || title || subtitle" class="ntk-card__header">
      <slot name="header">
        <h3 v-if="title" class="ntk-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="ntk-card__subtitle">{{ subtitle }}</p>
      </slot>
    </header>
    <div v-if="$slots.default" class="ntk-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ntk-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkCardDefaults,
  resolveNtkCardRecipe,
  type NtkCardContract,
} from '../../core'

defineOptions({
  name: 'DsCard',
})

const props = withDefaults(defineProps<NtkCardContract>(), {
  variant: ntkCardDefaults.variant,
  size: ntkCardDefaults.size,
  intent: ntkCardDefaults.intent,
  clickable: false,
  selected: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const classes = computed(() => resolveNtkCardRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  clickable: props.clickable,
  selected: props.selected,
  class: props.class,
}).classes)

function onPointerActivate(event: MouseEvent): void {
  if (props.clickable) {
    emit('click', event)
  }
}

function onKeyboardActivate(event: KeyboardEvent): void {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.ntk-card {
  --ntk-c: var(--ntk-border-color);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
  padding: var(--ntk-spacing-lg);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  box-shadow: var(--ntk-shadow-sm);
  font-family: var(--ntk-font-family);
  transition:
    border-color var(--ntk-transition-fast),
    box-shadow var(--ntk-transition-fast);
}

/* Intent feeds the accent border channel. */
.ntk-card--intent-primary {
  --ntk-c: var(--ntk-primary);
}

.ntk-card--intent-success {
  --ntk-c: var(--ntk-success);
}

.ntk-card--intent-warning {
  --ntk-c: var(--ntk-warning);
}

.ntk-card--intent-danger {
  --ntk-c: var(--ntk-error);
}

.ntk-card--intent-info {
  --ntk-c: var(--ntk-info);
}

/* Sizes adjust internal padding/rhythm. */
.ntk-card--size-sm {
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-md);
}

.ntk-card--size-lg {
  gap: var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-xl);
}

/* Variants. */
.ntk-card--variant-outlined {
  box-shadow: none;
}

.ntk-card--variant-elevated {
  border-color: transparent;
  box-shadow: var(--ntk-shadow-card);
}

.ntk-card--variant-accent-left {
  border-inline-start: 4px solid var(--ntk-c);
}

.ntk-card--variant-accent-top {
  border-block-start: 4px solid var(--ntk-c);
}

/* States. */
.ntk-card--is-clickable {
  cursor: pointer;
}

.ntk-card--is-clickable:hover {
  border-color: var(--ntk-border-dark);
  box-shadow: var(--ntk-shadow-card-hover);
}

.ntk-card--is-clickable:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-card--is-selected {
  border-color: var(--ntk-primary);
  box-shadow: var(--ntk-shadow-focus);
}

/* Slots. */
.ntk-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
}

.ntk-card__title {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  line-height: var(--ntk-line-height-tight);
  color: var(--ntk-text-primary);
}

.ntk-card__subtitle {
  margin: 0;
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.ntk-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
  color: var(--ntk-text-primary);
}

.ntk-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  padding-block-start: var(--ntk-spacing-sm);
  border-block-start: 1px solid var(--ntk-border-light);
}
</style>