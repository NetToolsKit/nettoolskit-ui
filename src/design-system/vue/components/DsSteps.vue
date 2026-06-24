<template>
  <ol :id="id" :class="classes" :data-testid="testId" :aria-label="ariaLabel">
    <li
      v-for="(step, index) in steps"
      :key="step.id"
      :class="itemClasses(index)"
      :aria-current="index === resolvedCurrent ? 'step' : undefined"
    >
      <component
        :is="clickable ? 'button' : 'div'"
        class="ntk-steps__step"
        :type="clickable ? 'button' : undefined"
        @click="onStepClick(index)"
      >
        <span class="ntk-steps__marker" aria-hidden="true">
          {{ markerText(index) }}
        </span>
        <span class="ntk-steps__body">
          <span class="ntk-steps__label">{{ step.label }}</span>
          <span v-if="step.description" class="ntk-steps__description">{{ step.description }}</span>
        </span>
      </component>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getNtkStepStatus,
  ntkStepStatusClassMap,
  ntkStepsDefaults,
  resolveNtkStepsRecipe,
  type NtkStepsContract,
} from '../../core'

defineOptions({
  name: 'DsSteps',
})

const props = withDefaults(defineProps<NtkStepsContract>(), {
  steps: () => [],
  current: 0,
  variant: ntkStepsDefaults.variant,
  size: ntkStepsDefaults.size,
  intent: ntkStepsDefaults.intent,
  orientation: ntkStepsDefaults.orientation,
  clickable: false,
  ariaLabel: 'Progress',
})

const emit = defineEmits<{
  'step-click': [index: number]
}>()

const resolvedCurrent = computed(() => props.current)

const classes = computed(() => resolveNtkStepsRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  orientation: props.orientation,
  class: props.class,
}).classes)

const itemClasses = (index: number): string[] => [
  'ntk-steps__item',
  ntkStepStatusClassMap[getNtkStepStatus(index, props.current)],
]

const markerText = (index: number): string => {
  if (getNtkStepStatus(index, props.current) === 'complete') {
    return '✓'
  }
  return String(index + 1)
}

const onStepClick = (index: number): void => {
  if (props.clickable) {
    emit('step-click', index)
  }
}
</script>

<style scoped>
.ntk-steps {
  display: flex;
  gap: var(--ntk-spacing-md);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--ntk-font-family);
}

.ntk-steps--orientation-vertical {
  flex-direction: column;
}

.ntk-steps__item {
  display: flex;
  flex: 1;
  min-inline-size: 0;
}

.ntk-steps__step {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
}

button.ntk-steps__step {
  cursor: pointer;
}

button.ntk-steps__step:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-steps__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  flex-shrink: 0;
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-full);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-bold);
  line-height: 1;
}

.ntk-steps__item--complete .ntk-steps__marker {
  border-color: var(--ntk-primary);
  background: var(--ntk-primary);
  color: var(--ntk-text-on-primary);
}

.ntk-steps__item--current .ntk-steps__marker {
  border-color: var(--ntk-primary);
  color: var(--ntk-primary);
}

.ntk-steps__label {
  display: block;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.ntk-steps__item--upcoming .ntk-steps__label {
  color: var(--ntk-text-secondary);
}

.ntk-steps__description {
  display: block;
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}
</style>