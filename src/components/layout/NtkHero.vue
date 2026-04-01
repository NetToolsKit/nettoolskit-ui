<template>
  <section
    class="ntk-hero"
    :class="heroClasses"
    :style="heroStyle"
  >
    <div class="ntk-hero__container">
      <!-- Content -->
      <div class="ntk-hero__content">
        <span
          v-if="badge"
          class="ntk-hero__badge"
        >{{ badge }}</span>

        <h1
          v-if="title || appName"
          class="ntk-hero__title"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

        <p
          v-if="subtitle || tagline"
          class="ntk-hero__subtitle"
        >
          <slot name="subtitle">
            {{ subtitle }}
          </slot>
        </p>

        <!-- Actions -->
        <div
          v-if="$slots.actions"
          class="ntk-hero__actions"
        >
          <slot name="actions" />
        </div>

        <!-- Extra content -->
        <div
          v-if="$slots.extra"
          class="ntk-hero__extra"
        >
          <slot name="extra" />
        </div>
      </div>

      <!-- Media (Image/Illustration) -->
      <div
        v-if="$slots.media || image"
        class="ntk-hero__media"
      >
        <slot name="media">
          <img
            v-if="image"
            :src="image"
            :alt="imageAlt"
            class="ntk-hero__image"
          >
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk Hero module.
 */

import { computed } from 'vue'
import { useBranding } from '../../composables/ui/useBranding'

// ✅ NUNCA usar default export (frontend.instructions.md)
// ✅ TypeScript interface para props

interface Props {
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  layout?: 'centered' | 'split' | 'split-reverse'
  size?: 'sm' | 'md' | 'lg'
  title?: string
  subtitle?: string
  badge?: string
  image?: string
  imageAlt?: string
  bgColor?: string
  bgImage?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  layout: 'split',
  size: 'md',
  imageAlt: 'Hero image',
})

const { appName, tagline } = useBranding()

// Valores computados com fallback para tema
const title = computed(() => props.title || appName.value || '')
const subtitle = computed(() => props.subtitle || tagline.value || '')

const heroClasses = computed(() => ({
  [`ntk-hero--${props.variant}`]: true,
  [`ntk-hero--${props.layout}`]: true,
  [`ntk-hero--${props.size}`]: true
}))

const heroStyle = computed(() => {
  const styles: Record<string, string> = {}

  if (props.bgColor) {
    styles.backgroundColor = props.bgColor
  }

  if (props.bgImage) {
    styles.backgroundImage = `url(${props.bgImage})`
    styles.backgroundSize = 'cover'
    styles.backgroundPosition = 'center'
  }

  return styles
})
</script>

<style lang="scss" scoped>
.ntk-hero {
  font-family: var(--ntk-font-body);
  width: 100%;
  overflow: hidden;

  // Variants
  &--default {
    background-color: var(--ntk-bg-primary);
  }

  &--light {
    background-color: var(--ntk-bg-secondary);
  }

  &--dark {
    background-color: var(--ntk-footer-bg);
    color: var(--ntk-text-inverse);

    .ntk-hero__subtitle {
      color: var(--ntk-footer-text-muted);
    }
  }

  &--gradient {
    background: var(--ntk-gradient-hero);
  }

  // Sizes
  &--sm {
    padding: var(--ntk-spacing-xl) 0;

    @media (min-width: 1024px) {
      padding: var(--ntk-spacing-2xl) 0;
    }
  }

  &--md {
    padding: var(--ntk-spacing-2xl) 0;

    @media (min-width: 1024px) {
      padding: var(--ntk-spacing-3xl) 0;
    }
  }

  &--lg {
    padding: var(--ntk-spacing-3xl) 0;
    min-height: 80vh;
    display: flex;
    align-items: center;

    @media (min-width: 1024px) {
      padding: calc(var(--ntk-spacing-3xl) * 1.5) 0;
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
  }

  // Layout: Centered
  &--centered {
    .ntk-hero__container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .ntk-hero__content {
      text-align: center;
      max-width: 800px;
    }

    .ntk-hero__actions {
      justify-content: center;
    }

    .ntk-hero__media {
      margin-top: var(--ntk-spacing-xl);
    }
  }

  // Layout: Split
  &--split {
    .ntk-hero__container {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--ntk-spacing-xl);
      align-items: center;

      @media (min-width: 1024px) {
        grid-template-columns: 1fr 1fr;
        gap: var(--ntk-spacing-2xl);
      }
    }
  }

  // Layout: Split Reverse
  &--split-reverse {
    .ntk-hero__container {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--ntk-spacing-xl);
      align-items: center;

      @media (min-width: 1024px) {
        grid-template-columns: 1fr 1fr;
        gap: var(--ntk-spacing-2xl);
      }
    }

    .ntk-hero__media {
      @media (min-width: 1024px) {
        order: -1;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--ntk-spacing-md);
  }

  &__badge {
    display: inline-block;
    width: fit-content;
    padding: var(--ntk-spacing-xs) var(--ntk-spacing-md);
    background-color: var(--ntk-primary);
    color: var(--ntk-text-inverse);
    font-size: var(--ntk-text-xs);
    font-weight: var(--ntk-font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: var(--ntk-radius-xl);
  }

  &__title {
    font-family: var(--ntk-font-display);
    font-size: var(--ntk-text-3xl);
    font-weight: var(--ntk-font-extrabold);
    line-height: var(--ntk-line-height-tight);
    margin: 0;
    color: inherit;

    @media (min-width: 1024px) {
      font-size: var(--ntk-text-4xl);
    }
  }

  &__subtitle {
    font-size: var(--ntk-text-lg);
    color: var(--ntk-text-secondary);
    line-height: var(--ntk-line-height-relaxed);
    margin: 0;
    max-width: 600px;

    @media (min-width: 1024px) {
      font-size: var(--ntk-text-xl);
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ntk-spacing-md);
    margin-top: var(--ntk-spacing-md);
  }

  &__extra {
    margin-top: var(--ntk-spacing-lg);
  }

  &__media {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    max-width: 100%;
    height: auto;
    border-radius: var(--ntk-radius-lg);
    box-shadow: var(--ntk-shadow-lg);
  }
}

// Motion preferences (accessibility)
@media (prefers-reduced-motion: reduce) {
  .ntk-hero {
    animation: none;
  }
}
</style>