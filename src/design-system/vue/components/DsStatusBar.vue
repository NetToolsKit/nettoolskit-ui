<template>
  <div
    :id="id"
    :class="classes"
    :data-testid="testId"
    role="status"
    aria-live="off"
    :aria-label="ariaLabel"
  >
    <span
      v-for="segment in segments"
      :key="segment.id"
      class="ntk-status-bar__segment"
      :class="{
        [`ntk-status-bar__segment--intent-${segment.intent}`]:
          segment.intent && segment.intent !== 'neutral',
      }"
      :title="segmentTitle(segment)"
    >
      <DsCommandIcon
        v-if="segment.icon"
        class="ntk-status-bar__icon"
        :name="segment.icon"
        :size="iconSize"
      />
      <span v-if="segment.label" class="ntk-status-bar__label">{{ segment.label }}</span>
      <span v-if="segment.value" class="ntk-status-bar__value">{{ segment.value }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DsCommandIcon from './DsCommandIcon.vue'
import {
  getNtkStatusSegmentTitle,
  ntkStatusBarDefaults,
  resolveNtkStatusBarRecipe,
  type NtkCommandIconSize,
  type NtkStatusBarContract,
  type NtkStatusBarSegment,
} from '../../core'

defineOptions({
  name: 'DsStatusBar',
})

const props = withDefaults(defineProps<NtkStatusBarContract>(), {
  segments: () => [],
  ariaLabel: 'Status bar',
  variant: ntkStatusBarDefaults.variant,
  size: ntkStatusBarDefaults.size,
  intent: ntkStatusBarDefaults.intent,
  density: ntkStatusBarDefaults.density,
})

const classes = computed(() => resolveNtkStatusBarRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  density: props.density,
  class: props.class,
}).classes)

const iconSize = computed<NtkCommandIconSize>(() => (props.size === 'lg' ? 'md' : 'sm'))

const segmentTitle = (segment: NtkStatusBarSegment): string | undefined =>
  getNtkStatusSegmentTitle(segment)
</script>

<style scoped>
.ntk-status-bar {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  inline-size: 100%;
  min-block-size: 1.75rem;
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-secondary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-xs);
  white-space: nowrap;
  overflow-x: auto;
}

.ntk-status-bar--variant-bordered {
  border-block-start: 1px solid var(--ntk-border-color);
}

.ntk-status-bar--size-sm {
  font-size: var(--ntk-font-size-xs);
}

.ntk-status-bar--size-lg {
  font-size: var(--ntk-font-size-sm);
}

.ntk-status-bar--density-compact {
  gap: var(--ntk-spacing-sm);
  min-block-size: 1.5rem;
}

.ntk-status-bar--density-spacious {
  gap: var(--ntk-spacing-lg);
  min-block-size: 2rem;
  padding-block: var(--ntk-spacing-sm);
}

.ntk-status-bar__segment {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  max-inline-size: 18rem;
  min-inline-size: 0;
}

.ntk-status-bar__icon {
  flex-shrink: 0;
}

.ntk-status-bar__label {
  flex-shrink: 0;
  color: var(--ntk-text-secondary);
}

.ntk-status-bar__value {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ntk-text-primary);
  font-weight: var(--ntk-font-weight-medium);
}

.ntk-status-bar__segment--intent-primary .ntk-status-bar__value {
  color: var(--ntk-primary-dark);
}

.ntk-status-bar__segment--intent-success .ntk-status-bar__value {
  color: var(--ntk-success-dark);
}

.ntk-status-bar__segment--intent-warning .ntk-status-bar__value {
  color: var(--ntk-warning-dark);
}

.ntk-status-bar__segment--intent-danger .ntk-status-bar__value {
  color: var(--ntk-error-dark);
}

.ntk-status-bar__segment--intent-info .ntk-status-bar__value {
  color: var(--ntk-info-dark);
}
</style>