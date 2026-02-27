<template>
  <q-chip
    class="ntk-chip"
    :class="chipClasses"
    :clickable="!disabled"
    :disable="disabled"
    :selected="selected"
    :color="chipColor"
    :outline="variant === 'outlined'"
    @click="handleClick"
  >
    <slot />
  </q-chip>
</template>

<script setup lang="ts">
/**
 * Src/components/ui/Ntk Chip module.
 */

import { computed } from 'vue'

type ChipVariant = 'default' | 'primary' | 'secondary' | 'outlined'

interface Props {
  variant?: ChipVariant
  selected?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  selected: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const chipClasses = computed(() => [
  `ntk-chip--${props.variant}`,
  { 'ntk-chip--selected': props.selected }
])

const chipColor = computed(() => {
  if (props.variant === 'primary') return 'primary'
  return undefined
})

const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<style scoped lang="scss">
// Override Quasar defaults, mantendo visual NetToolsKit
.ntk-chip {
  padding: 10px 20px;
  border-radius: var(--ntk-radius-2xl);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  font-family: var(--ntk-font-family);
  transition: all var(--ntk-transition-base);
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  // Variant: default
  &--default {
    background: var(--ntk-chip-bg);
    color: var(--ntk-chip-text);
    border: 2px solid var(--ntk-chip-border);

    &:hover:not(.disabled) {
      background: var(--ntk-bg-primary);
      border-color: var(--ntk-primary);
      color: var(--ntk-primary);
      transform: translateY(-2px);
      box-shadow: var(--ntk-shadow-sm);
      text-decoration: none;
    }
  }

  // Variant: primary
  &--primary {
    background: var(--ntk-primary) !important;
    color: var(--ntk-text-inverse) !important;
    border: 2px solid var(--ntk-primary);

    &:hover:not(.disabled) {
      background: var(--ntk-primary-dark) !important;
      border-color: var(--ntk-primary-dark);
      text-decoration: none;
    }
  }

  // Variant: secondary
  &--secondary {
    background: var(--ntk-chip-bg);
    color: var(--ntk-chip-text);
    border: 2px solid var(--ntk-border-color);

    &:hover:not(.disabled) {
      background: var(--ntk-bg-primary);
      border-color: var(--ntk-primary);
      color: var(--ntk-primary);
      text-decoration: none;
    }
  }

  // Variant: outlined
  &--outlined {
    background: transparent !important;
    border: 2px solid var(--ntk-border-color);
    color: var(--ntk-chip-text);

    &:hover:not(.disabled) {
      background: var(--ntk-chip-bg) !important;
      border-color: var(--ntk-primary);
      color: var(--ntk-primary);
      text-decoration: none;
    }
  }

  // State: selected
  &--selected {
    background: var(--ntk-chip-bg-selected) !important;
    border-color: var(--ntk-chip-bg-selected);
    color: var(--ntk-chip-text-selected) !important;

    &:hover:not(.disabled) {
      background: var(--ntk-primary-dark) !important;
      border-color: var(--ntk-primary-dark);
      text-decoration: none;
    }
  }
}
</style>