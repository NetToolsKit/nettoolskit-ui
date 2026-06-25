<template>
  <button
    :id="id"
    type="button"
    :class="classes"
    :data-testid="testId"
    :aria-pressed="selected ? 'true' : undefined"
    :disabled="disabled"
    @click="onClick"
  >
    <DsCommandIcon class="ntk-ribbon-command__icon" :name="icon" :size="iconSize" />
    <span class="ntk-ribbon-command__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DsCommandIcon from './DsCommandIcon.vue'
import {
  ntkRibbonCommandDefaults,
  resolveNtkRibbonCommandRecipe,
  type NtkCommandIconSize,
  type NtkRibbonCommandContract,
} from '../../core'

defineOptions({
  name: 'DsRibbonCommand',
})

const props = withDefaults(defineProps<NtkRibbonCommandContract>(), {
  variant: ntkRibbonCommandDefaults.variant,
  size: ntkRibbonCommandDefaults.size,
  intent: ntkRibbonCommandDefaults.intent,
  selected: false,
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const iconSize = computed<NtkCommandIconSize>(() => (props.size === 'sm' ? 'sm' : 'md'))

const classes = computed(() => resolveNtkRibbonCommandRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  selected: props.selected,
  disabled: props.disabled,
  class: props.class,
}).classes)

function onClick(event: MouseEvent): void {
  if (props.disabled) {
    return
  }
  emit('click', event)
}
</script>

<style scoped>
.ntk-ribbon-command {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ntk-spacing-xs);
  min-inline-size: 3.5rem;
  margin: 0;
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-sm);
  background: transparent;
  color: var(--ntk-text-secondary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-medium);
  line-height: var(--ntk-line-height-tight);
  cursor: pointer;
  transition: background var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.ntk-ribbon-command--size-sm {
  min-inline-size: 2.75rem;
}

.ntk-ribbon-command--size-lg {
  min-inline-size: 4.25rem;
  font-size: var(--ntk-font-size-sm);
}

.ntk-ribbon-command:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.ntk-ribbon-command:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-ribbon-command__icon {
  color: var(--ntk-text-primary);
}

.ntk-ribbon-command--intent-primary .ntk-ribbon-command__icon {
  color: var(--ntk-primary);
}

.ntk-ribbon-command--intent-success .ntk-ribbon-command__icon {
  color: var(--ntk-success-dark);
}

.ntk-ribbon-command--intent-warning .ntk-ribbon-command__icon {
  color: var(--ntk-warning-dark);
}

.ntk-ribbon-command--intent-danger .ntk-ribbon-command__icon {
  color: var(--ntk-error-dark);
}

.ntk-ribbon-command--intent-info .ntk-ribbon-command__icon {
  color: var(--ntk-info-dark);
}

.ntk-ribbon-command--is-selected {
  background: var(--ntk-bg-active);
  border-color: var(--ntk-primary);
  color: var(--ntk-primary-dark);
}

.ntk-ribbon-command--is-disabled,
.ntk-ribbon-command:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ntk-ribbon-command__label {
  display: block;
  max-inline-size: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>