<template>
  <div
    class="pricing-card"
    :class="cardClasses"
  >
    <!-- Featured Badge -->
    <div
      v-if="featured"
      class="pricing-card__badge"
    >
      {{ badgeText }}
    </div>

    <!-- Header -->
    <div class="pricing-card__header">
      <h3 class="pricing-card__title">
        {{ title }}
      </h3>
      <div class="pricing-card__price">
        <span
          v-if="currency"
          class="pricing-card__currency"
        >{{ currency }}</span>
        <span class="pricing-card__amount">{{ price }}</span>
        <span
          v-if="period"
          class="pricing-card__period"
        >/{{ period }}</span>
      </div>
      <p
        v-if="description"
        class="pricing-card__description"
      >
        {{ description }}
      </p>
    </div>

    <!-- Features -->
    <div class="pricing-card__features">
      <ul class="pricing-card__feature-list">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="pricing-card__feature"
          :class="{ 'pricing-card__feature--disabled': feature.disabled }"
        >
          <q-icon
            :name="feature.disabled ? 'close' : 'check'"
            :color="feature.disabled ? 'grey-5' : 'positive'"
            :size="$q.screen.xs ? 'var(--ntk-text-md)' : 'var(--ntk-text-lg)'"
          />
          <span>{{ feature.text }}</span>
        </li>
      </ul>
      <slot name="features" />
    </div>

    <!-- Action -->
    <div class="pricing-card__action">
      <slot name="action">
        <NtkButton
          :variant="featured ? 'primary' : 'secondary'"
          full-width
          @click="$emit('select')"
        >
          {{ actionText }}
        </NtkButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QIcon } from 'quasar'
import NtkButton from './NtkButton.vue'

// ✅ NUNCA usar default export (frontend.instructions.md)
// ✅ TypeScript interface para props

interface Feature {
  text: string
  disabled?: boolean
}

interface Props {
  title: string
  price: string
  currency?: string
  period?: string
  description?: string
  features?: Feature[]
  featured?: boolean
  badgeText?: string
  actionText?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: '',
  period: '',
  description: '',
  features: () => [],
  featured: false,
  badgeText: 'Mais Popular',
  actionText: 'Escolher Plano'
})

defineEmits(['select'])

const cardClasses = computed(() => ({
  'pricing-card--featured': props.featured
}))
</script>

<style lang="scss" scoped>
.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--ntk-bg-card);
  border: var(--border-width-md) solid var(--ntk-border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  transition: all var(--transition-base);
  font-family: var(--ntk-font-body);

  &:hover {
    box-shadow: var(--ntk-shadow-lg);
    transform: translateY(calc(var(--ntk-spacing-xs) * -1));
  }

  &--featured {
    border-color: var(--ntk-primary);
    box-shadow: var(--ntk-shadow-lg);
    transform: scale(1.02);

    &:hover {
      transform: scale(1.02) translateY(calc(var(--ntk-spacing-xs) * -1));
    }
  }

  &__badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--ntk-primary);
    color: var(--ntk-text-inverse);
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--border-radius-xl);
    font-size: var(--ntk-text-xs);
    font-weight: var(--ntk-font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  &__header {
    text-align: center;
    padding-bottom: var(--space-lg);
    border-bottom: var(--border-width-sm) solid var(--ntk-border-light);
    margin-bottom: var(--space-lg);
  }

  &__title {
    font-family: var(--ntk-font-display);
    font-size: var(--ntk-text-xl);
    font-weight: var(--ntk-font-bold);
    color: var(--ntk-text-primary);
    margin: 0 0 var(--space-md) 0;
  }

  &__price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: var(--ntk-spacing-xxs);
    margin-bottom: var(--space-sm);
  }

  &__currency {
    font-size: var(--ntk-text-lg);
    font-weight: var(--ntk-font-semibold);
    color: var(--ntk-text-primary);
  }

  &__amount {
    font-family: var(--ntk-font-display);
    font-size: var(--ntk-text-4xl);
    font-weight: var(--ntk-font-extrabold);
    color: var(--ntk-text-primary);
    line-height: 1;
  }

  &__period {
    font-size: var(--ntk-text-sm);
    color: var(--ntk-text-secondary);
  }

  &__description {
    font-size: var(--ntk-text-sm);
    color: var(--ntk-text-secondary);
    margin: 0;
  }

  &__features {
    flex: 1;
    margin-bottom: var(--space-lg);
  }

  &__feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--ntk-text-sm);
    color: var(--ntk-text-primary);

    &--disabled {
      color: var(--ntk-text-muted);
      text-decoration: line-through;
    }
  }

  &__action {
    margin-top: auto;
  }
}

// Motion preferences (accessibility)
@media (prefers-reduced-motion: reduce) {
  .pricing-card {
    transition: none;

    &:hover {
      transform: none;
    }

    &--featured {
      transform: none;

      &:hover {
        transform: none;
      }
    }
  }
}
</style>

