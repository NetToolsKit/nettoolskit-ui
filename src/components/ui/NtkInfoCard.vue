<template>
  <q-card
    class="info-card"
    :class="{ 'info-card--elevated': variant === 'elevated' }"
    flat
  >
    <q-card-section
      v-if="safeHeaderBg"
      class="info-card__header info-card__header--colored"
      :style="{ backgroundColor: safeHeaderBg }"
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
          :style="iconStyle"
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
/**
 * Src/components/ui/Ntk Info Card module.
 */

import { computed } from 'vue'

interface Props {
  title: string
  subtitle?: string
  icon?: string
  iconColor?: string
  headerBg?: string
  variant?: 'default' | 'elevated'
  separator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  separator: false
})

const COLOR_TOKEN_ALIASES: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  brand: 'var(--ntk-primary)',
  success: 'var(--ntk-success, var(--semantic-success-primary))',
  positive: 'var(--ntk-success, var(--semantic-success-primary))',
  warning: 'var(--ntk-warning, var(--semantic-warning-primary))',
  error: 'var(--ntk-error, var(--semantic-error-primary))',
  danger: 'var(--ntk-error, var(--semantic-error-primary))',
  negative: 'var(--ntk-error, var(--semantic-error-primary))',
  info: 'var(--ntk-info, var(--semantic-info-primary))',
  neutral: 'var(--ntk-text-secondary)',
  muted: 'var(--ntk-text-muted)',
  text: 'var(--ntk-text-primary)',
  inverse: 'var(--ntk-text-inverse)',
  surface: 'var(--ntk-bg-primary)',
  'surface-muted': 'var(--ntk-bg-secondary)',
}

const QUASAR_NEUTRAL_ALIAS_PATTERN = /^(grey|gray|blue-grey)-\d+$/i
const UNSAFE_CSS_VALUE_PATTERN = /[;{}<>]|url\s*\(|expression\s*\(|javascript:/i
const HEX_COLOR_PATTERN = /#[\da-f]{3,8}\b/i
const RAW_COLOR_FUNCTION_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(\s*(?!var\(--)/i
const NAMED_COLOR_PATTERN = /\b(?:white|black|red|green|blue|hotpink|purple|violet|yellow|orange|pink|gray|grey|cyan|magenta|lime|navy|teal|maroon|olive|silver|gold|brown|coral|tomato|salmon|beige|ivory|snow|azure|lavender|plum|orchid|indigo)\b/i

const stripCssVariables = (value: string): string => value.replace(/var\([^)]*\)/gi, '')

const resolveTokenColor = (value?: string): string => {
  const normalized = value?.trim()
  if (!normalized) {
    return ''
  }

  const hasSafeTokenExpression = normalized.includes('var(--')
    && !UNSAFE_CSS_VALUE_PATTERN.test(normalized)
    && !HEX_COLOR_PATTERN.test(normalized)
    && !RAW_COLOR_FUNCTION_PATTERN.test(normalized)
    && !NAMED_COLOR_PATTERN.test(stripCssVariables(normalized))

  if (hasSafeTokenExpression) {
    return normalized
  }

  const alias = normalized.toLowerCase().replace(/_/g, '-')
  return COLOR_TOKEN_ALIASES[alias] ?? (QUASAR_NEUTRAL_ALIAS_PATTERN.test(alias) ? COLOR_TOKEN_ALIASES.neutral : '')
}

const safeHeaderBg = computed(() => resolveTokenColor(props.headerBg))

const iconStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  const iconColor = resolveTokenColor(props.iconColor)
  if (!iconColor) {
    return style
  }

  style.color = iconColor
  return style
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
