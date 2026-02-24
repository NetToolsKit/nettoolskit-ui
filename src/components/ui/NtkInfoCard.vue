<template>
  <q-card
    class="info-card"
    :class="{ 'info-card--elevated': variant === 'elevated' }"
    flat
  >
    <q-card-section
      v-if="headerBg"
      class="info-card__header info-card__header--colored"
      :style="{ backgroundColor: headerBg }"
    >
      <div
        v-if="icon"
        class="info-card__header-content"
      >
        <q-icon
          :name="icon"
          :size="$q.screen.xs ? 'var(--ntk-text-xl)' : 'var(--ntk-text-2xl)'"
          class="info-card__icon"
        />
        <div>
          <div class="info-card__title">
            {{ title }}
          </div>
          <div
            v-if="subtitle"
            class="info-card__subtitle"
          >
            {{ subtitle }}
          </div>
        </div>
      </div>
      <template v-else>
        <div class="info-card__title">
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="info-card__subtitle"
        >
          {{ subtitle }}
        </div>
      </template>
    </q-card-section>

    <q-card-section
      v-else
      class="info-card__header"
    >
      <div
        v-if="icon"
        class="info-card__header-content"
      >
        <q-icon
          :name="icon"
          :size="$q.screen.xs ? 'var(--ntk-text-xl)' : 'var(--ntk-text-2xl)'"
          class="info-card__icon"
          :style="{ color: iconColor }"
        />
        <div>
          <div class="info-card__title">
            {{ title }}
          </div>
          <div
            v-if="subtitle"
            class="info-card__subtitle"
          >
            {{ subtitle }}
          </div>
        </div>
      </div>
      <template v-else>
        <div class="info-card__title">
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="info-card__subtitle"
        >
          {{ subtitle }}
        </div>
      </template>
    </q-card-section>

    <q-separator v-if="separator" />

    <q-card-section class="info-card__content">
      <slot />
    </q-card-section>

    <q-card-actions
      v-if="$slots.actions"
      class="info-card__actions"
    >
      <slot name="actions" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: string
  iconColor?: string
  headerBg?: string
  variant?: 'default' | 'elevated'
  separator?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  separator: false
})
</script>

<style lang="scss" scoped>
.info-card {
  background: var(--ntk-card-bg);
  border-radius: var(--ntk-radius-xl);
  box-shadow: var(--ntk-shadow-card);
  overflow: hidden;
  transition: all var(--ntk-transition-base);
  font-family: var(--ntk-font-family);

  &:hover {
    transform: translateY(calc(var(--ntk-spacing-xs) * -1));
    box-shadow: var(--ntk-shadow-card-hover);
  }

  &--elevated {
    box-shadow: var(--ntk-shadow-card-hover);
  }

  // Remove padding padrão do Quasar
  :deep(.q-card__section) {
    padding: 0;
  }

  :deep(.q-card__actions) {
    padding: 0;
  }

  &__header {
    padding: var(--ntk-spacing-lg);

    &--colored {
      background: var(--ntk-primary);
      color: var(--ntk-text-inverse);

      .info-card__title,
      .info-card__subtitle {
        color: var(--ntk-text-inverse);
      }

      .info-card__icon {
        color: var(--ntk-text-inverse) !important;
      }
    }
  }

  &__header-content {
    display: flex;
    align-items: center;
    gap: var(--ntk-spacing-md);
  }

  &__icon {
    color: var(--ntk-primary);
  }

  &__title {
    font-size: var(--ntk-text-xl);
    font-weight: var(--ntk-font-bold);
    color: var(--ntk-text-dark);
  }

  &__subtitle {
    font-size: var(--ntk-text-sm);
    color: var(--ntk-text-light);
    margin-top: var(--ntk-spacing-xxs);
  }

  &__content {
    padding: var(--ntk-spacing-lg);
    color: var(--ntk-text-dark);

    strong {
      color: var(--ntk-primary);
      font-weight: var(--ntk-font-semibold);
    }
  }

  &__actions {
    padding: var(--ntk-spacing-md) var(--ntk-spacing-lg);
    display: flex;
    justify-content: flex-end;
    gap: var(--ntk-spacing-sm);
    border-top: var(--border-width-sm) solid var(--ntk-border-light);
  }
}
</style>
