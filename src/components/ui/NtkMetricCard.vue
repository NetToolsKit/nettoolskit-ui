<template>
  <q-card
    class="metric-card"
    flat
  >
    <q-card-section class="metric-card__content">
      <div class="metric-card__info">
        <div class="metric-card__label">
          {{ label }}
        </div>
        <div class="metric-card__value">
          {{ value }}
        </div>
        <div
          v-if="trend"
          class="metric-card__trend"
          :class="trendClass"
        >
          <q-icon
            :name="trendIcon"
            size="xs"
          /> {{ trend }}
        </div>
      </div>
      <q-icon
        :name="icon"
        size="var(--ntk-text-3xl)"
        class="metric-card__icon"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
/**
 * Src/components/ui/Ntk Metric Card module.
 */

import { computed } from 'vue'

interface Props {
  label: string
  value: string | number
  icon: string
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  trendType: 'neutral'
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  return `metric-card__trend--${props.trendType}`
})

const trendIcon = computed(() => {
  if (props.trendType === 'positive') return 'trending_up'
  if (props.trendType === 'negative') return 'trending_down'
  return 'trending_flat'
})
</script>

<style lang="scss" scoped>
.metric-card {
  background: var(--ntk-card-bg);
  border-radius: var(--ntk-radius-xl);
  box-shadow: var(--ntk-shadow-card);
  transition: all var(--ntk-transition-base);
  font-family: var(--ntk-font-family);

  &:hover {
    transform: translateY(calc(var(--ntk-spacing-xs) * -1));
    box-shadow: var(--ntk-shadow-card-hover);
  }

  // Removes Quasar default padding.
  :deep(.q-card__section) {
    padding: var(--ntk-spacing-lg);
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__info {
    flex: 1;
  }

  &__label {
    font-size: var(--ntk-text-sm);
    color: var(--ntk-text-light);
    margin-bottom: var(--ntk-spacing-sm);
    font-weight: var(--ntk-font-medium);
  }

  &__value {
    font-size: var(--ntk-text-3xl);
    color: var(--ntk-text-dark);
    font-weight: var(--ntk-font-extrabold);
    line-height: 1.2;
  }

  &__trend {
    font-size: var(--ntk-text-sm);
    margin-top: var(--ntk-spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--ntk-spacing-xxs);

    &--positive {
      color: var(--ntk-success);
    }

    &--negative {
      color: var(--ntk-error);
    }

    &--neutral {
      color: var(--ntk-text-light);
    }
  }

  &__icon {
    color: var(--ntk-primary);
    opacity: 0.3;
  }
}
</style>
