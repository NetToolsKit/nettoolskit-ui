<template>
  <div
    :id="id"
    :class="classes"
    :data-testid="testId"
    role="list"
    :aria-label="ariaLabel"
  >
    <article
      v-for="metric in metrics"
      :key="metric.id"
      class="ntk-metric-grid__item"
      :class="`ntk-metric-grid__item--intent-${metric.intent ?? 'neutral'}`"
      role="listitem"
    >
      <header class="ntk-metric-grid__item-header">
        <span class="ntk-metric-grid__label">{{ metric.label }}</span>
        <span v-if="metric.icon" class="ntk-metric-grid__icon" aria-hidden="true">{{ metric.icon }}</span>
      </header>
      <p class="ntk-metric-grid__value">{{ metric.value }}</p>
      <p v-if="metric.caption || metric.delta" class="ntk-metric-grid__footer">
        <span
          v-if="metric.delta"
          class="ntk-metric-grid__delta"
          :class="`ntk-metric-grid__delta--${metric.deltaDirection ?? 'flat'}`"
        >{{ metric.delta }}</span>
        <span v-if="metric.caption" class="ntk-metric-grid__caption">{{ metric.caption }}</span>
      </p>
    </article>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkMetricGridDefaults,
  resolveNtkMetricGridRecipe,
  type NtkMetricGridContract,
} from '../../core'

defineOptions({
  name: 'DsMetricGrid',
})

const props = withDefaults(defineProps<NtkMetricGridContract>(), {
  variant: ntkMetricGridDefaults.variant,
  size: ntkMetricGridDefaults.size,
  intent: ntkMetricGridDefaults.intent,
  density: ntkMetricGridDefaults.density,
  columns: ntkMetricGridDefaults.columns,
  metrics: () => [],
})

const classes = computed(() => resolveNtkMetricGridRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  columns: props.columns,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-metric-grid {
  display: grid;
  gap: var(--ntk-spacing-md);
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  font-family: var(--ntk-font-family);
}

.ntk-metric-grid--cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ntk-metric-grid--cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.ntk-metric-grid--cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.ntk-metric-grid--density-compact {
  gap: var(--ntk-spacing-sm);
}

.ntk-metric-grid--density-spacious {
  gap: var(--ntk-spacing-lg);
}

.ntk-metric-grid__item {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-md);
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
}

.ntk-metric-grid--variant-default .ntk-metric-grid__item,
.ntk-metric-grid--variant-bordered .ntk-metric-grid__item {
  border: 1px solid var(--ntk-border-color);
}

.ntk-metric-grid--variant-default .ntk-metric-grid__item {
  box-shadow: var(--ntk-shadow-sm);
}

.ntk-metric-grid--variant-plain .ntk-metric-grid__item {
  background: transparent;
  padding-inline: 0;
}

.ntk-metric-grid--density-compact .ntk-metric-grid__item {
  padding: var(--ntk-spacing-sm);
}

.ntk-metric-grid__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
}

.ntk-metric-grid__label {
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  color: var(--ntk-text-muted);
}

.ntk-metric-grid__icon {
  color: var(--ntk-primary);
}

.ntk-metric-grid__value {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-3xl);
  font-weight: var(--ntk-font-weight-bold);
  line-height: var(--ntk-line-height-tight);
  color: var(--ntk-text-primary);
}

.ntk-metric-grid__footer {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  margin: 0;
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-secondary);
}

.ntk-metric-grid__delta {
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-metric-grid__delta--up {
  color: var(--ntk-success-dark);
}

.ntk-metric-grid__delta--down {
  color: var(--ntk-error-dark);
}

.ntk-metric-grid__delta--flat {
  color: var(--ntk-text-muted);
}
</style>