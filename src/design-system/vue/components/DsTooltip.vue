<template>
  <span
    :id="id"
    :class="classes"
    :data-testid="testId"
    :aria-describedby="describedBy"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <span
      :id="bubbleId"
      ref="bubbleRef"
      :class="bubbleClasses"
      role="tooltip"
      :hidden="!visible"
    >
      <slot name="content">{{ text }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import {
  getNtkTooltipBubbleClasses,
  ntkTooltipDefaults,
  resolveNtkTooltipRecipe,
  type NtkTooltipContract,
} from '../../core'

defineOptions({
  name: 'DsTooltip',
})

const props = withDefaults(defineProps<NtkTooltipContract>(), {
  variant: ntkTooltipDefaults.variant,
  size: ntkTooltipDefaults.size,
  intent: ntkTooltipDefaults.intent,
  position: ntkTooltipDefaults.position,
})

const visible = ref(false)
const bubbleRef = ref<HTMLElement | null>(null)
const generatedId = useId()

const bubbleId = computed(() => (props.id ? `${props.id}-tooltip` : `${generatedId}-tooltip`))
const describedBy = computed(() => (visible.value ? bubbleId.value : undefined))

const classes = computed(() => resolveNtkTooltipRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

const bubbleClasses = computed(() => getNtkTooltipBubbleClasses(props.position))

function show(): void {
  visible.value = true
}

function hide(): void {
  visible.value = false
}
</script>

<style scoped>
.ntk-tooltip {
  position: relative;
  display: inline-flex;
  font-family: var(--ntk-font-family);
}

.ntk-tooltip__bubble {
  position: absolute;
  z-index: 1;
  inline-size: max-content;
  max-inline-size: 16rem;
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border-radius: var(--ntk-radius-sm);
  background: var(--ntk-text-primary);
  color: var(--ntk-text-inverse);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-medium);
  line-height: var(--ntk-line-height-tight);
  box-shadow: var(--ntk-shadow-popup);
  pointer-events: none;
}

.ntk-tooltip__bubble[hidden] {
  display: none;
}

.ntk-tooltip--variant-soft .ntk-tooltip__bubble {
  background: var(--ntk-bg-elevated);
  color: var(--ntk-text-primary);
  border: 1px solid var(--ntk-border-color);
}

.ntk-tooltip--size-sm .ntk-tooltip__bubble {
  font-size: var(--ntk-font-size-xs);
}

.ntk-tooltip--size-lg .ntk-tooltip__bubble {
  font-size: var(--ntk-font-size-sm);
}

.ntk-tooltip__bubble--position-top {
  inset-block-end: calc(100% + var(--ntk-spacing-xs));
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.ntk-tooltip__bubble--position-bottom {
  inset-block-start: calc(100% + var(--ntk-spacing-xs));
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.ntk-tooltip__bubble--position-left {
  inset-inline-end: calc(100% + var(--ntk-spacing-xs));
  inset-block-start: 50%;
  transform: translateY(-50%);
}

.ntk-tooltip__bubble--position-right {
  inset-inline-start: calc(100% + var(--ntk-spacing-xs));
  inset-block-start: 50%;
  transform: translateY(-50%);
}
</style>