<template>
  <section
    :id="id"
    :class="classes"
    :data-testid="testId"
    :aria-labelledby="labelledBy"
    :aria-label="labelledBy ? undefined : ariaLabel"
  >
    <header v-if="$slots.header || $slots.actions || eyebrow || title || subtitle" class="ntk-section__header">
      <slot name="header">
        <p v-if="eyebrow" class="ntk-section__eyebrow">{{ eyebrow }}</p>
        <component
          :is="headingTag"
          v-if="title"
          :id="titleId"
          class="ntk-section__title"
        >
          {{ title }}
        </component>
        <p v-if="subtitle" class="ntk-section__subtitle">{{ subtitle }}</p>
      </slot>
      <div v-if="$slots.actions" class="ntk-section__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="ntk-section__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ntk-section__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  ntkSectionDefaults,
  resolveNtkSectionRecipe,
  type NtkSectionContract,
} from '../../core'

defineOptions({
  name: 'DsSection',
})

const props = withDefaults(defineProps<NtkSectionContract>(), {
  variant: ntkSectionDefaults.variant,
  size: ntkSectionDefaults.size,
  intent: ntkSectionDefaults.intent,
  headingLevel: ntkSectionDefaults.headingLevel,
})

const slots = useSlots()
const titleId = computed(() => props.id ? `${props.id}__title` : undefined)
const labelledBy = computed(() => props.title && titleId.value && !slots.header ? titleId.value : undefined)
const headingTag = computed(() => `h${props.headingLevel}`)
const classes = computed(() => resolveNtkSectionRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-section {
  --ntk-c: var(--ntk-primary);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
  font-family: var(--ntk-font-family);
  color: var(--ntk-text-primary);
}

/* Intent feeds the accent channel. */
.ntk-section--intent-success {
  --ntk-c: var(--ntk-success);
}

.ntk-section--intent-warning {
  --ntk-c: var(--ntk-warning);
}

.ntk-section--intent-danger {
  --ntk-c: var(--ntk-error);
}

.ntk-section--intent-info {
  --ntk-c: var(--ntk-info);
}

/* Sizes adjust vertical rhythm. */
.ntk-section--size-sm {
  gap: var(--ntk-spacing-sm);
}

.ntk-section--size-lg {
  gap: var(--ntk-spacing-lg);
}

/* Variants. */
.ntk-section--variant-surface {
  gap: var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-lg);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
}

.ntk-section--variant-muted {
  gap: var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-lg);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-secondary);
}

.ntk-section--variant-accent {
  gap: var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-lg);
  border-inline-start: 4px solid var(--ntk-c);
  border-radius: 0 var(--ntk-radius-lg) var(--ntk-radius-lg) 0;
  background: var(--ntk-bg-secondary);
}

/* Slots. */
.ntk-section__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
}

.ntk-section__eyebrow {
  margin: 0;
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ntk-c);
}

.ntk-section__title {
  margin: var(--ntk-spacing-xs) 0 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-xl);
  font-weight: var(--ntk-font-weight-bold);
  line-height: var(--ntk-line-height-tight);
  color: var(--ntk-text-primary);
}

.ntk-section__subtitle {
  margin: var(--ntk-spacing-xs) 0 0;
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.ntk-section__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-section__body {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
}

.ntk-section__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  padding-block-start: var(--ntk-spacing-sm);
  color: var(--ntk-text-secondary);
}
</style>