<template>
  <main
    :id="id"
    :class="classes"
    :data-testid="testId"
    :aria-labelledby="labelledBy"
    :aria-label="labelledBy ? undefined : ariaLabel"
  >
    <header v-if="$slots.header || $slots.actions || title || subtitle" class="ntk-page__header">
      <slot name="header">
        <h1 v-if="title" :id="titleId" class="ntk-page__title">{{ title }}</h1>
        <p v-if="subtitle" class="ntk-page__subtitle">{{ subtitle }}</p>
      </slot>
      <div v-if="$slots.actions" class="ntk-page__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="ntk-page__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ntk-page__footer">
      <slot name="footer" />
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  ntkPageDefaults,
  resolveNtkPageRecipe,
  type NtkPageContract,
} from '../../core'

defineOptions({
  name: 'DsPage',
})

const props = withDefaults(defineProps<NtkPageContract>(), {
  variant: ntkPageDefaults.variant,
  size: ntkPageDefaults.size,
  intent: ntkPageDefaults.intent,
})

const slots = useSlots()
const titleId = computed(() => props.id ? `${props.id}__title` : undefined)
const labelledBy = computed(() => props.title && titleId.value && !slots.header ? titleId.value : undefined)
const classes = computed(() => resolveNtkPageRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-page {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-lg);
  background: var(--ntk-bg-primary);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

/* Variants. */
.ntk-page--variant-surface {
  background: var(--ntk-bg-secondary);
}

.ntk-page--variant-dashboard {
  gap: var(--ntk-spacing-xl);
  background: var(--ntk-bg-secondary);
}

/* Sizes adjust the page padding. */
.ntk-page--size-sm {
  gap: var(--ntk-spacing-md);
  padding: var(--ntk-spacing-md);
}

.ntk-page--size-lg {
  gap: var(--ntk-spacing-xl);
  padding: var(--ntk-spacing-2xl);
}

/* Slots. */
.ntk-page__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
}

.ntk-page__title {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-2xl);
  font-weight: var(--ntk-font-weight-bold);
  line-height: var(--ntk-line-height-tight);
  color: var(--ntk-text-primary);
}

.ntk-page__subtitle {
  margin: var(--ntk-spacing-xs) 0 0;
  font-size: var(--ntk-font-size-base);
  color: var(--ntk-text-secondary);
}

.ntk-page__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-page__body {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-lg);
}

.ntk-page__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  padding-block-start: var(--ntk-spacing-md);
  border-block-start: 1px solid var(--ntk-border-color);
  color: var(--ntk-text-secondary);
}
</style>