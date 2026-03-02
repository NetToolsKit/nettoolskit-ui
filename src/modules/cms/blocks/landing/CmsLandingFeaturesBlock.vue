<template>
  <NtkSection
    id="features"
    :variant="variant"
    :size="size"
    :centered="true"
  >
    <template #header>
      <NtkSectionHeader
        :title="title"
        :subtitle="subtitle"
        spacing="lg"
      />
    </template>

    <div class="cms-features-grid">
      <div
        v-for="(item, index) in items"
        :key="item.id || `feature-${index}`"
        class="cms-features-card"
        :class="{ 'cms-features-card--cinematic': cinematicCardsActive }"
        :style="cardBaseStyle"
        @pointerenter="onCardPointerEnter"
        @pointermove="onCardPointerMove"
        @pointerleave="onCardPointerLeave"
        @pointercancel="onCardPointerLeave"
      >
        <NtkFeatureCard
          :title="item.title"
          :description="item.description"
          :icon="item.icon"
          :variant="item.variant ?? cardVariant"
          :icon-style="item.iconStyle ?? iconStyle"
          :hoverable="!cinematicCardsActive"
        />
      </div>
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
/**
 * Src/modules/cms/blocks/landing/Cms Landing Features Block module.
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import NtkSection from '../../../../components/layout/NtkSection.vue'
import NtkSectionHeader from '../../../../components/ui/NtkSectionHeader.vue'
import NtkFeatureCard from '../../../../components/ui/NtkFeatureCard.vue'

interface FeatureItem {
  id: string
  icon?: string
  title: string
  description: string
  variant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top'
  iconStyle?: 'default' | 'circle' | 'square' | 'gradient'
}

interface Props {
  title?: string
  subtitle?: string
  items?: FeatureItem[]
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  cardVariant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top'
  iconStyle?: 'default' | 'circle' | 'square' | 'gradient'
  cinematicCardsEnabled?: boolean
  cinematicCardsTilt?: number
  cinematicCardsGlow?: number
  cinematicCardsPerspective?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  items: () => [],
  variant: 'default',
  size: 'lg',
  cardVariant: 'elevated',
  iconStyle: 'gradient',
  cinematicCardsEnabled: true,
  cinematicCardsTilt: 6,
  cinematicCardsGlow: 0.28,
  cinematicCardsPerspective: 920,
})

const prefersReducedMotion = ref(false)
let reducedMotionMediaQuery: MediaQueryList | null = null
let removeReducedMotionListener: (() => void) | null = null

const emptyStyle: Record<string, string> = {}

const normalizedTilt = computed(() => clampNumber(props.cinematicCardsTilt, 0, 24, 6))
const normalizedGlow = computed(() => clampNumber(props.cinematicCardsGlow, 0, 1, 0.28))
const normalizedPerspective = computed(() => clampNumber(props.cinematicCardsPerspective, 640, 1800, 920))

const cinematicCardsActive = computed(() => {
  return props.cinematicCardsEnabled && !prefersReducedMotion.value
})

const cardBaseStyle = computed<Record<string, string>>(() => {
  if (!cinematicCardsActive.value) {
    return emptyStyle
  }

  return {
    '--cms-card-tilt-x': '0deg',
    '--cms-card-tilt-y': '0deg',
    '--cms-card-lift': '0px',
    '--cms-card-glow-x': '50%',
    '--cms-card-glow-y': '50%',
    '--cms-card-glow-alpha': '0',
    '--cms-card-glow-strength': normalizedGlow.value.toString(),
    '--cms-card-perspective': `${normalizedPerspective.value}px`,
  }
})

/**
 * Clamps numeric values and applies fallback for invalid inputs.
 */
function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    return fallback
  }
  return Math.min(max, Math.max(min, parsed))
}

/**
 * Applies base cinematic variables to a feature card wrapper.
 */
function applyBaseCardVariables(element: HTMLElement): void {
  element.style.setProperty('--cms-card-tilt-x', '0deg')
  element.style.setProperty('--cms-card-tilt-y', '0deg')
  element.style.setProperty('--cms-card-lift', '0px')
  element.style.setProperty('--cms-card-glow-x', '50%')
  element.style.setProperty('--cms-card-glow-y', '50%')
  element.style.setProperty('--cms-card-glow-alpha', '0')
  element.style.setProperty('--cms-card-glow-strength', normalizedGlow.value.toString())
  element.style.setProperty('--cms-card-perspective', `${normalizedPerspective.value}px`)
}

/**
 * Handles pointer enter for cinematic cards.
 */
function onCardPointerEnter(event: PointerEvent): void {
  if (!cinematicCardsActive.value) {
    return
  }

  const element = event.currentTarget as HTMLElement | null
  if (!element) {
    return
  }

  applyBaseCardVariables(element)
  element.style.setProperty('--cms-card-lift', '-6px')
  element.style.setProperty('--cms-card-glow-alpha', normalizedGlow.value.toString())
}

/**
 * Handles pointer movement and computes 3D tilt/glow coordinates.
 */
function onCardPointerMove(event: PointerEvent): void {
  if (!cinematicCardsActive.value) {
    return
  }

  const element = event.currentTarget as HTMLElement | null
  if (!element) {
    return
  }

  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) {
    return
  }

  const normalizedX = clampNumber((event.clientX - rect.left) / rect.width, 0, 1, 0.5)
  const normalizedY = clampNumber((event.clientY - rect.top) / rect.height, 0, 1, 0.5)

  const rotateY = (normalizedX - 0.5) * normalizedTilt.value * 2
  const rotateX = (0.5 - normalizedY) * normalizedTilt.value * 2

  element.style.setProperty('--cms-card-tilt-x', `${rotateX.toFixed(2)}deg`)
  element.style.setProperty('--cms-card-tilt-y', `${rotateY.toFixed(2)}deg`)
  element.style.setProperty('--cms-card-glow-x', `${(normalizedX * 100).toFixed(2)}%`)
  element.style.setProperty('--cms-card-glow-y', `${(normalizedY * 100).toFixed(2)}%`)
}

/**
 * Handles pointer leave/cancel and resets cinematic transforms.
 */
function onCardPointerLeave(event: PointerEvent): void {
  if (!cinematicCardsActive.value) {
    return
  }

  const element = event.currentTarget as HTMLElement | null
  if (!element) {
    return
  }

  applyBaseCardVariables(element)
}

/**
 * Updates reduced-motion preference.
 */
function updateReducedMotionPreference(): void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    prefersReducedMotion.value = false
    return
  }
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  updateReducedMotionPreference()

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return
  }

  reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const listener = () => updateReducedMotionPreference()

  if (typeof reducedMotionMediaQuery.addEventListener === 'function') {
    reducedMotionMediaQuery.addEventListener('change', listener)
    removeReducedMotionListener = () => reducedMotionMediaQuery?.removeEventListener('change', listener)
  } else if (typeof reducedMotionMediaQuery.addListener === 'function') {
    reducedMotionMediaQuery.addListener(listener)
    removeReducedMotionListener = () => reducedMotionMediaQuery?.removeListener(listener)
  }
})

onBeforeUnmount(() => {
  removeReducedMotionListener?.()
  removeReducedMotionListener = null
  reducedMotionMediaQuery = null
})
</script>

<style scoped>
.cms-features-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--ntk-spacing-lg);
}

.cms-features-card {
  position: relative;
  border-radius: var(--ntk-radius-lg);
}

.cms-features-card--cinematic {
  transform-style: preserve-3d;
  will-change: transform;
  transform:
    perspective(var(--cms-card-perspective))
    rotateX(var(--cms-card-tilt-x))
    rotateY(var(--cms-card-tilt-y))
    translate3d(0, var(--cms-card-lift), 0);
  transition: transform 220ms ease-out;
}

.cms-features-card--cinematic::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: var(--cms-card-glow-alpha);
  background: radial-gradient(
    circle at var(--cms-card-glow-x) var(--cms-card-glow-y),
    color-mix(in srgb, var(--ntk-primary, #512bd4) calc(var(--cms-card-glow-strength) * 100%), transparent),
    transparent 58%
  );
  transition: opacity 220ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .cms-features-card--cinematic {
    transform: none !important;
    transition: none;
  }

  .cms-features-card--cinematic::after {
    display: none;
  }
}

@media (min-width: 768px) {
  .cms-features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .cms-features-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>