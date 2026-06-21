<template>
  <section
    class="ntk-section"
    :class="sectionClasses"
    :style="sectionStyle"
  >
    <div
      class="ntk-section__container"
      :class="containerClasses"
    >
      <!-- Section Header -->
      <div
        v-if="title || subtitle || $slots.header"
        class="ntk-section__header"
      >
        <slot name="header">
          <span
            v-if="badge"
            class="ntk-section__badge"
          >{{ badge }}</span>
          <h2
            v-if="title"
            class="ntk-section__title"
          >
            {{ title }}
          </h2>
          <p
            v-if="subtitle"
            class="ntk-section__subtitle"
          >
            {{ subtitle }}
          </p>
        </slot>
      </div>

      <!-- Section Content -->
      <div class="ntk-section__content">
        <slot />
      </div>

      <!-- Section Footer -->
      <div
        v-if="$slots.footer"
        class="ntk-section__footer"
      >
        <slot name="footer" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk Section module.
 */

import { computed } from 'vue'

// ✅ NUNCA usar default export (frontend.instructions.md)
// ✅ TypeScript interface para props

interface Props {
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  subtitle?: string
  badge?: string
  centered?: boolean
  fullWidth?: boolean
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  title: '',
  subtitle: '',
  badge: '',
  centered: true,
  fullWidth: false,
  bgColor: ''
})

const sectionClasses = computed(() => ({
  [`ntk-section--${props.variant}`]: true,
  [`ntk-section--${props.size}`]: true,
  'ntk-section--centered': props.centered
}))

const containerClasses = computed(() => ({
  'ntk-section__container--full-width': props.fullWidth
}))

const BACKGROUND_TOKEN_ALIASES: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  brand: 'var(--ntk-primary)',
  surface: 'var(--ntk-bg-primary)',
  'surface-muted': 'var(--ntk-bg-secondary)',
  dark: 'var(--ntk-footer-bg)',
  light: 'var(--ntk-bg-light)',
  neutral: 'var(--ntk-bg-secondary)',
  success: 'var(--ntk-success, var(--semantic-success-primary))',
  warning: 'var(--ntk-warning, var(--semantic-warning-primary))',
  error: 'var(--ntk-error, var(--semantic-error-primary))',
  danger: 'var(--ntk-error, var(--semantic-error-primary))',
  info: 'var(--ntk-info, var(--semantic-info-primary))',
}

const UNSAFE_CSS_VALUE_PATTERN = /[;{}<>]|url\s*\(|expression\s*\(|javascript:/i
const HEX_COLOR_PATTERN = /#[\da-f]{3,8}\b/i
const RAW_COLOR_FUNCTION_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(\s*(?!var\(--)/i
const NAMED_COLOR_PATTERN = /\b(?:white|black|red|green|blue|hotpink|purple|violet|yellow|orange|pink|gray|grey|cyan|magenta|lime|navy|teal|maroon|olive|silver|gold|brown|coral|tomato|salmon|beige|ivory|snow|azure|lavender|plum|orchid|indigo)\b/i

const stripCssVariables = (value: string): string => value.replace(/var\([^)]*\)/gi, '')

const resolveTokenBackground = (value?: string): string => {
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

  return BACKGROUND_TOKEN_ALIASES[normalized.toLowerCase().replace(/_/g, '-')] ?? ''
}

const sectionStyle = computed(() => {
  const backgroundColor = resolveTokenBackground(props.bgColor)
  if (backgroundColor) {
    return { backgroundColor }
  }
  return {}
})
</script>

<style lang="scss" scoped>
.ntk-section {
  font-family: var(--ntk-font-body);
  width: 100%;

  // Variants
  &--default {
    background-color: var(--ntk-bg-primary);
  }

  &--light {
    background-color: var(--ntk-bg-light);
  }

  &--dark {
    background-color: var(--ntk-footer-bg);
    color: var(--ntk-text-inverse);
    
    .ntk-section__subtitle {
      color: var(--ntk-footer-text-muted);
    }
  }

  &--gradient {
    background: var(--ntk-gradient-hero);
  }

  // Sizes
  &--sm {
    padding: var(--ntk-spacing-lg) 0;
  }

  &--md {
    padding: var(--ntk-spacing-xl) 0;
    
    @media (min-width: 1024px) {
      padding: var(--ntk-spacing-2xl) 0;
    }
  }

  &--lg {
    padding: var(--ntk-spacing-2xl) 0;
    
    @media (min-width: 1024px) {
      padding: var(--ntk-spacing-3xl) 0;
    }
  }

  &--xl {
    padding: var(--ntk-spacing-3xl) 0;
    
    @media (min-width: 1024px) {
      padding: calc(var(--ntk-spacing-3xl) * 1.5) 0;
    }
  }

  // Centered
  &--centered {
    .ntk-section__header {
      text-align: center;
    }
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--ntk-spacing-md);
    
    @media (min-width: 600px) {
      padding: 0 var(--ntk-spacing-lg);
    }
    
    @media (min-width: 1024px) {
      padding: 0 var(--ntk-spacing-xl);
    }

    &--full-width {
      max-width: none;
      padding: 0;
    }
  }

  &__header {
    margin-bottom: var(--ntk-spacing-xl);
    
    @media (min-width: 1024px) {
      margin-bottom: var(--ntk-spacing-2xl);
    }
  }

  &__badge {
    display: inline-block;
    padding: var(--ntk-spacing-xs) var(--ntk-spacing-md);
    background-color: var(--ntk-primary);
    color: var(--ntk-text-inverse);
    font-size: var(--ntk-text-xs);
    font-weight: var(--ntk-font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: var(--ntk-radius-xl);
    margin-bottom: var(--ntk-spacing-md);
  }

  &__title {
    font-family: var(--ntk-font-display);
    font-size: var(--ntk-text-2xl);
    font-weight: var(--ntk-font-bold);
    line-height: var(--ntk-line-height-tight);
    margin: 0 0 var(--ntk-spacing-md) 0;
    color: inherit;
    
    @media (min-width: 1024px) {
      font-size: var(--ntk-text-3xl);
    }
  }

  &__subtitle {
    font-size: var(--ntk-text-lg);
    color: var(--ntk-text-secondary);
    max-width: 700px;
    margin: 0 auto;
    line-height: var(--ntk-line-height-relaxed);
  }

  &__content {
    // Content styles handled by children
  }

  &__footer {
    margin-top: var(--ntk-spacing-xl);
    
    @media (min-width: 1024px) {
      margin-top: var(--ntk-spacing-2xl);
    }
  }
}
</style>
