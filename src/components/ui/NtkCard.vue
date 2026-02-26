<template>
  <q-card
    class="ntk-card base-card"
    :class="cardClasses"
    :flat="variant === 'outlined'"
  >
    <q-card-section
      v-if="$slots.header"
      class="ntk-card__header base-card__header"
    >
      <slot name="header" />
    </q-card-section>

    <q-card-section class="ntk-card__body base-card__body">
      <slot />
    </q-card-section>

    <q-card-section
      v-if="$slots.footer"
      class="ntk-card__footer base-card__footer"
    >
      <slot name="footer" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  clickable?: boolean
  accentColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  clickable: false,
  accentColor: 'primary'
})

const cardClasses = computed(() => ({
  [`ntk-card--${props.variant}`]: true,
  [`base-card--${props.variant}`]: true,
  [`ntk-card--padding-${props.padding}`]: true,
  [`base-card--padding-${props.padding}`]: true,
  [`ntk-card--accent-${props.accentColor}`]: props.variant === 'accent-left' || props.variant === 'accent-top',
  [`base-card--accent-${props.accentColor}`]: props.variant === 'accent-left' || props.variant === 'accent-top',
  'ntk-card--clickable': props.clickable,
  'base-card--clickable': props.clickable
}))
</script>

<style lang="scss" scoped>
.ntk-card {
  background: var(--ntk-bg-card);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-base);
  font-family: var(--ntk-font-body);

  :deep(.q-card__section) {
    padding: 0;
  }

  &--default {
    border: var(--border-width-md) solid transparent;
    box-shadow: var(--ntk-shadow-md);
  }

  &--outlined {
    border: var(--border-width-md) solid var(--ntk-border-color);
    box-shadow: none;
  }

  &--elevated {
    border: none;
    box-shadow: var(--ntk-shadow-lg);
  }

  &--accent-left {
    border: var(--border-width-md) solid transparent;
    border-left: var(--border-width-lg) solid;
    border-radius: var(--border-radius-md);
    box-shadow: var(--ntk-shadow-md);
  }

  &--accent-top {
    border: var(--border-width-md) solid transparent;
    border-top: var(--border-width-lg) solid;
    border-radius: var(--border-radius-md);
    box-shadow: var(--ntk-shadow-md);
  }

  &--accent-primary {
    border-color: var(--ntk-primary);
  }

  &--accent-success {
    border-color: var(--ntk-success);
  }

  &--accent-warning {
    border-color: var(--ntk-warning);
  }

  &--accent-danger {
    border-color: var(--ntk-error);
  }

  &--accent-info {
    border-color: var(--ntk-info);
  }

  &--clickable {
    cursor: pointer;

    &:hover {
      transform: translateY(calc(var(--ntk-spacing-xs) * -1));
      box-shadow: var(--ntk-shadow-lg);
    }

    &:active {
      transform: translateY(calc(var(--ntk-spacing-xxs) * -1));
    }
  }

  .ntk-card__header {
    padding: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: var(--border-width-sm) solid var(--ntk-border-light);
  }

  .ntk-card__body {
    flex: 1;
  }

  &--padding-none .ntk-card__body {
    padding: 0;
  }

  &--padding-sm .ntk-card__body {
    padding: var(--space-md);
  }

  &--padding-md .ntk-card__body {
    padding: var(--space-lg);
  }

  &--padding-lg .ntk-card__body {
    padding: var(--space-xl);
  }

  .ntk-card__footer {
    padding: var(--space-lg);
    padding-top: var(--space-md);
    border-top: var(--border-width-sm) solid var(--ntk-border-light);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ntk-card {
    transition: none;

    &--clickable {
      &:hover,
      &:active {
        transform: none;
      }
    }
  }
}
</style>