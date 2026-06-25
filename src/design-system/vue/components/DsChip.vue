<template>
  <span :id="id" :class="classes" :data-testid="testId">
    <button
      v-if="clickable"
      type="button"
      class="ntk-chip__action"
      :disabled="disabled"
      :aria-pressed="selected ? 'true' : 'false'"
      @click="onClick"
    >
      <span v-if="icon" class="ntk-chip__icon" aria-hidden="true">{{ icon }}</span>
      <span class="ntk-chip__label"><slot>{{ label }}</slot></span>
    </button>
    <template v-else>
      <span v-if="icon" class="ntk-chip__icon" aria-hidden="true">{{ icon }}</span>
      <span class="ntk-chip__label"><slot>{{ label }}</slot></span>
    </template>
    <button
      v-if="removable"
      type="button"
      class="ntk-chip__remove"
      :aria-label="removeLabel"
      :disabled="disabled"
      @click.stop="onRemove"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkChipDefaults,
  resolveNtkChipRecipe,
  type NtkChipContract,
} from '../../core'

defineOptions({
  name: 'DsChip',
})

const props = withDefaults(defineProps<NtkChipContract>(), {
  variant: ntkChipDefaults.variant,
  size: ntkChipDefaults.size,
  intent: ntkChipDefaults.intent,
  clickable: false,
  selected: false,
  disabled: false,
  removable: false,
  removeLabel: 'Remove',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  remove: []
}>()

const classes = computed(() => resolveNtkChipRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  clickable: props.clickable,
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

function onRemove(): void {
  if (props.disabled) {
    return
  }
  emit('remove')
}
</script>

<style scoped>
.ntk-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-2xl);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  line-height: 1;
}

.ntk-chip--size-sm {
  font-size: var(--ntk-font-size-xs);
  padding-inline: var(--ntk-spacing-xs);
}

.ntk-chip--size-lg {
  font-size: var(--ntk-font-size-base);
  padding-inline: var(--ntk-spacing-md);
}

.ntk-chip--variant-soft {
  border-color: transparent;
  background: var(--ntk-bg-hover);
}

.ntk-chip--variant-outline {
  background: transparent;
}

.ntk-chip--is-selected {
  border-color: var(--ntk-primary);
  color: var(--ntk-primary);
}

.ntk-chip--is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.ntk-chip__action {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.ntk-chip__action:focus-visible,
.ntk-chip__remove:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-chip__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.1rem;
  block-size: 1.1rem;
  border: 0;
  border-radius: var(--ntk-radius-full);
  background: transparent;
  color: inherit;
  font-size: var(--ntk-font-size-base);
  line-height: 1;
  cursor: pointer;
}

.ntk-chip__remove:hover {
  background: var(--ntk-bg-hover);
}
</style>