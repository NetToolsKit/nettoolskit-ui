<template>
  <NtkHero
    :variant="variant"
    :layout="layout"
    :size="size"
    :badge="badge"
    :title="title"
    :subtitle="subtitle"
  >
    <template #actions>
      <NtkButton
        v-if="primaryAction"
        :label="primaryAction.label"
        color="primary"
        unelevated
        :href="primaryAction.href"
        :target="primaryAction.external ? '_blank' : undefined"
      />
      <NtkButton
        v-if="secondaryAction"
        :label="secondaryAction.label"
        outline
        color="primary"
        :href="secondaryAction.href"
        :target="secondaryAction.external ? '_blank' : undefined"
      />
    </template>
    <template
      v-if="hasMedia"
      #media
    >
      <div
        ref="mediaContainerRef"
        class="cms-landing-hero-media"
        :class="mediaClasses"
      >
        <div
          ref="mediaStageRef"
          class="cms-landing-hero-media__stage"
          :style="mediaStageStyle"
        >
          <video
            v-if="showVideo"
            class="cms-landing-hero-media__video"
            :poster="resolvedVideoPoster || undefined"
            :autoplay="videoAutoplay"
            :loop="videoLoop"
            :muted="videoMuted"
            :playsinline="videoPlaysinline"
            :controls="videoControls"
            :preload="resolvedVideoPreload"
            @error="handleVideoError"
          >
            <source
              v-if="normalizedVideoWebm"
              :src="normalizedVideoWebm"
              type="video/webm"
            >
            <source
              v-if="normalizedVideoMp4"
              :src="normalizedVideoMp4"
              type="video/mp4"
            >
          </video>
          <img
            v-else-if="image"
            :src="image"
            :alt="imageAlt"
            class="cms-landing-hero-media__image"
          >
          <div
            v-if="showVideo"
            class="cms-landing-hero-media__overlay"
            aria-hidden="true"
          />
        </div>
        <div
          v-if="revealMask"
          class="cms-landing-hero-media__reveal-mask"
          aria-hidden="true"
        />
      </div>
    </template>
  </NtkHero>
</template>

<script setup lang="ts">
/**
 * Src/modules/cms/blocks/landing/Cms Landing Hero Block module.
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NtkHero from '../../../../components/layout/NtkHero.vue'
import NtkButton from '../../../../components/ui/NtkButton.vue'

interface HeroAction {
  label: string
  href: string
  external?: boolean
}

interface Props {
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  layout?: 'centered' | 'split' | 'split-reverse'
  size?: 'sm' | 'md' | 'lg'
  badge?: string
  title?: string
  subtitle?: string
  image?: string
  imageAlt?: string
  videoWebm?: string
  videoMp4?: string
  videoPoster?: string
  videoAutoplay?: boolean
  videoLoop?: boolean
  videoMuted?: boolean
  videoPlaysinline?: boolean
  videoControls?: boolean
  videoPreload?: 'none' | 'metadata' | 'auto'
  revealOnScroll?: boolean
  revealMask?: boolean
  revealOnce?: boolean
  parallaxEnabled?: boolean
  parallaxStrength?: number
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gradient',
  layout: 'split',
  size: 'lg',
  badge: '',
  title: '',
  subtitle: '',
  image: '',
  imageAlt: 'Hero image',
  videoWebm: '',
  videoMp4: '',
  videoPoster: '',
  videoAutoplay: true,
  videoLoop: true,
  videoMuted: true,
  videoPlaysinline: true,
  videoControls: false,
  videoPreload: 'metadata',
  revealOnScroll: true,
  revealMask: true,
  revealOnce: false,
  parallaxEnabled: true,
  parallaxStrength: 18,
  primaryAction: undefined,
  secondaryAction: undefined,
})

const videoFailed = ref(false)
const mediaContainerRef = ref<HTMLElement | null>(null)
const mediaStageRef = ref<HTMLElement | null>(null)
const isRevealed = ref(false)
const isInViewport = ref(false)
const prefersReducedMotion = ref(false)
const parallaxOffset = ref(0)

let mediaObserver: IntersectionObserver | null = null
let rafId: number | null = null

const normalizedVideoWebm = computed(() => props.videoWebm.trim())
const normalizedVideoMp4 = computed(() => props.videoMp4.trim())

const hasConfiguredVideo = computed(() => {
  return normalizedVideoWebm.value.length > 0 || normalizedVideoMp4.value.length > 0
})

const showVideo = computed(() => {
  return hasConfiguredVideo.value && !videoFailed.value
})

const hasMedia = computed(() => {
  return showVideo.value || props.image.trim().length > 0
})

const resolvedVideoPoster = computed(() => {
  const explicitPoster = props.videoPoster.trim()
  if (explicitPoster) {
    return explicitPoster
  }
  return props.image.trim()
})

const resolvedVideoPreload = computed(() => {
  switch (props.videoPreload) {
    case 'none':
    case 'metadata':
    case 'auto':
      return props.videoPreload
    default:
      return 'metadata'
  }
})

const normalizedParallaxStrength = computed(() => {
  const parsed = Number(props.parallaxStrength)
  if (Number.isNaN(parsed)) {
    return 18
  }
  return Math.max(0, Math.min(60, parsed))
})

const mediaClasses = computed<Record<string, boolean>>(() => ({
  'cms-landing-hero-media--video': showVideo.value,
  'cms-landing-hero-media--revealed': isRevealed.value,
  'cms-landing-hero-media--mask': props.revealMask,
}))

const emptyStyle: Record<string, string> = {}

const mediaStageStyle = computed<Record<string, string>>(() => {
  if (!props.parallaxEnabled || prefersReducedMotion.value) {
    return emptyStyle
  }

  const offset = Math.round(parallaxOffset.value * 100) / 100
  return {
    transform: `translate3d(0, ${offset}px, 0) scale(1.015)`,
  }
})

watch([normalizedVideoWebm, normalizedVideoMp4], () => {
  videoFailed.value = false
})

watch(
  () => [props.parallaxEnabled, props.parallaxStrength, props.revealOnScroll, props.revealOnce],
  () => {
    refreshMediaEffects()
  }
)

/**
 * Handles video load/render errors and enables image fallback.
 */
function handleVideoError(): void {
  videoFailed.value = true
}

/**
 * Checks whether browser has reduced-motion preference.
 */
function resolveReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Clamps a number to a min/max range.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Cancels pending parallax animation frame.
 */
function cancelParallaxFrame(): void {
  if (rafId === null || typeof window === 'undefined') {
    return
  }
  window.cancelAnimationFrame(rafId)
  rafId = null
}

/**
 * Applies a smooth parallax offset based on viewport position.
 */
function updateParallaxOffset(): void {
  if (
    typeof window === 'undefined' ||
    !props.parallaxEnabled ||
    prefersReducedMotion.value ||
    !mediaStageRef.value ||
    !mediaContainerRef.value
  ) {
    parallaxOffset.value = 0
    return
  }

  if (props.revealOnScroll && !isInViewport.value) {
    parallaxOffset.value = 0
    return
  }

  const rect = mediaContainerRef.value.getBoundingClientRect()
  const viewportHeight = Math.max(window.innerHeight, 1)
  const viewportCenter = viewportHeight / 2
  const elementCenter = rect.top + (rect.height / 2)
  const normalizedDistance = clamp((elementCenter - viewportCenter) / viewportHeight, -1, 1)
  parallaxOffset.value = normalizedDistance * -normalizedParallaxStrength.value
}

/**
 * Schedules parallax updates in requestAnimationFrame.
 */
function scheduleParallaxUpdate(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (rafId !== null) {
    return
  }

  rafId = window.requestAnimationFrame(() => {
    rafId = null
    updateParallaxOffset()
  })
}

/**
 * Handles media intersection events to drive reveal/replay behavior.
 */
function handleMediaIntersection(entries: IntersectionObserverEntry[]): void {
  const entry = entries[0]
  if (!entry) {
    return
  }

  if (entry.isIntersecting) {
    isInViewport.value = true
    isRevealed.value = true
    scheduleParallaxUpdate()

    if (props.revealOnce) {
      mediaObserver?.disconnect()
      mediaObserver = null
    }
    return
  }

  isInViewport.value = false
  if (!props.revealOnce) {
    isRevealed.value = false
  }
}

/**
 * Rebuilds reveal/parallax observers and listeners when props change.
 */
function refreshMediaEffects(): void {
  if (typeof window === 'undefined' || !hasMedia.value) {
    isRevealed.value = true
    return
  }

  prefersReducedMotion.value = resolveReducedMotion()
  cancelParallaxFrame()
  mediaObserver?.disconnect()
  mediaObserver = null
  window.removeEventListener('scroll', scheduleParallaxUpdate)
  window.removeEventListener('resize', scheduleParallaxUpdate)

  if (!props.revealOnScroll || prefersReducedMotion.value) {
    isRevealed.value = true
    isInViewport.value = true
  } else if (typeof window.IntersectionObserver === 'undefined') {
    isRevealed.value = true
    isInViewport.value = true
  } else if (mediaContainerRef.value) {
    isRevealed.value = false
    isInViewport.value = false
    mediaObserver = new window.IntersectionObserver(handleMediaIntersection, {
      threshold: 0.2,
      rootMargin: '0px 0px -8% 0px',
    })
    mediaObserver.observe(mediaContainerRef.value)
  }

  if (props.parallaxEnabled && !prefersReducedMotion.value) {
    window.addEventListener('scroll', scheduleParallaxUpdate, { passive: true })
    window.addEventListener('resize', scheduleParallaxUpdate, { passive: true })
    scheduleParallaxUpdate()
  } else {
    parallaxOffset.value = 0
  }
}

onMounted(() => {
  refreshMediaEffects()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', scheduleParallaxUpdate)
    window.removeEventListener('resize', scheduleParallaxUpdate)
  }
  mediaObserver?.disconnect()
  mediaObserver = null
  cancelParallaxFrame()
})
</script>

<style scoped lang="scss">
.cms-landing-hero-media {
  position: relative;
  border-radius: var(--ntk-radius-xl, 20px);
  overflow: hidden;
  box-shadow: var(--ntk-shadow-lg);
  background: var(--ntk-bg-card, #ffffff);
  isolation: isolate;
  opacity: 0;
  transform: translate3d(0, 22px, 0) scale(0.985);
  transition:
    opacity 620ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cms-landing-hero-media--revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

.cms-landing-hero-media__stage {
  will-change: transform;
  transition: transform 260ms ease-out;
}

.cms-landing-hero-media__video,
.cms-landing-hero-media__image {
  display: block;
  width: 100%;
  height: auto;
  max-height: 640px;
  object-fit: cover;
}

.cms-landing-hero-media--video .cms-landing-hero-media__video {
  aspect-ratio: 16 / 10;
}

.cms-landing-hero-media__reveal-mask {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background: var(--ntk-bg-card, #ffffff);
  transform: translate3d(0, 0, 0);
  transition: transform 880ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cms-landing-hero-media--mask.cms-landing-hero-media--revealed .cms-landing-hero-media__reveal-mask {
  transform: translate3d(105%, 0, 0);
}

.cms-landing-hero-media__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--ntk-primary, #512bd4) 40%, transparent), transparent 55%),
    linear-gradient(145deg, color-mix(in srgb, var(--ntk-primary, #512bd4) 18%, transparent), transparent 42%);
  opacity: 0.55;
  animation: cms-hero-video-overlay 8s ease-in-out infinite;
}

@keyframes cms-hero-video-overlay {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.65;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cms-landing-hero-media,
  .cms-landing-hero-media__stage,
  .cms-landing-hero-media__reveal-mask {
    transition: none;
    transform: none !important;
  }

  .cms-landing-hero-media {
    opacity: 1;
  }

  .cms-landing-hero-media__overlay {
    animation: none;
  }
}
</style>