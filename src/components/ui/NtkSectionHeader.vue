<template>
  <div
    class="section-header"
    :class="spacingClass"
  >
    <h2 class="section-header__title">
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="section-header__subtitle"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  subtitle?: string
  spacing?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  spacing: 'md'
})

const spacingClass = computed(() => {
  const spacingMap = {
    sm: 'section-header--spacing-sm',
    md: 'section-header--spacing-md',
    lg: 'section-header--spacing-lg'
  }
  return spacingMap[props.spacing]
})
</script>

<style lang="scss" scoped>
.section-header {
  font-family: var(--ntk-font-family);

  &--spacing-sm {
    margin-bottom: 1rem;
  }

  &--spacing-md {
    margin-bottom: 1.5rem;
  }

  &--spacing-lg {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: var(--ntk-font-size-4xl);
    font-weight: var(--ntk-font-weight-bold);
    color: var(--ntk-text-dark);
    margin: 0;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: var(--ntk-font-size-base);
    color: var(--ntk-text-light);
    margin: 0.5rem 0 0 0;
    line-height: 1.6;
  }
}
</style>