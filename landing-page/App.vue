<template>
  <div id="app">
    <LandingHeaderSection
      :is-dark="isDark"
      @toggle-theme="toggleTheme"
      @mobile-toggle="handleMobileToggle"
    />

    <LandingHeroSection />
    <LandingFeaturesSection />
    <LandingShowcaseSection
      class="ntk-deferred-section"
      :tabs="tabs"
      :active-tab="activeTab"
      @update:active-tab="activeTab = $event"
    />
    <LandingDeveloperSection class="ntk-deferred-section" />
    <LandingDashboardSection class="ntk-deferred-section" />
    <LandingThemesSection class="ntk-deferred-section" />
    <LandingInstallationSection class="ntk-deferred-section" />
    <LandingFooterSection class="ntk-deferred-section" />

    <a
      href="/?cms=1"
      class="cms-mode-btn"
      :aria-label="t('app.testCms')"
    >
      {{ t('app.testCms') }}
    </a>
  </div>
</template>

<script setup lang="ts">
/**
 * Landing page/App module.
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import LandingDashboardSection from './components/LandingDashboardSection.vue'
import LandingDeveloperSection from './components/LandingDeveloperSection.vue'
import LandingFeaturesSection from './components/LandingFeaturesSection.vue'
import LandingFooterSection from './components/LandingFooterSection.vue'
import LandingHeaderSection from './components/LandingHeaderSection.vue'
import LandingHeroSection from './components/LandingHeroSection.vue'
import LandingInstallationSection from './components/LandingInstallationSection.vue'
import LandingShowcaseSection from './components/LandingShowcaseSection.vue'
import LandingThemesSection from './components/LandingThemesSection.vue'
import { createLandingI18n, provideLandingI18n } from './composables/useLandingI18n'

const landingI18n = createLandingI18n(
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('lang')
    : null
)
provideLandingI18n(landingI18n)
const { t } = landingI18n

const isDark = ref(false)
const activeTab = ref('form')
const isScrolled = ref(false)

interface LandingAnimationBlueprint {
  selector: string
  type: 'fade-up' | 'fade-right' | 'fade-left' | 'zoom-in'
  delay?: number
  stagger?: number
  once?: boolean
}

const landingAnimationBlueprints: LandingAnimationBlueprint[] = [
  { selector: '.landing-hero .ntk-hero__badge', type: 'fade-left', delay: 40 },
  { selector: '.landing-hero .ntk-hero__title', type: 'fade-left', delay: 110 },
  { selector: '.landing-hero .ntk-hero__subtitle', type: 'fade-left', delay: 165 },
  { selector: '.landing-hero .hero-actions', type: 'fade-left', delay: 220 },
  { selector: '.landing-hero .hero-visual', type: 'fade-left', delay: 190 },
  { selector: '.landing-hero .stats .stat', type: 'fade-left', delay: 150, stagger: 90 },
  { selector: '.section-header', type: 'fade-left', delay: 40 },
  { selector: '.feature-card', type: 'fade-left', delay: 80, stagger: 70 },
  { selector: '.component-tabs', type: 'fade-left', delay: 80 },
  { selector: '.component-grid .component-item', type: 'zoom-in', delay: 100, stagger: 35 },
  { selector: '.code-container > div:first-child', type: 'fade-left' },
  { selector: '.code-block', type: 'fade-left', delay: 120 },
  { selector: '.form-visual-image', type: 'fade-left' },
  { selector: '.form-visual-content', type: 'fade-left', delay: 120 },
  { selector: '.composables-visual-content', type: 'fade-left' },
  { selector: '.composables-visual-image', type: 'fade-left', delay: 120 },
  { selector: '.composable-item', type: 'zoom-in', delay: 80, stagger: 45 },
  { selector: '.metrics-grid-simple .metric-card-simple', type: 'fade-left', delay: 60, stagger: 60 },
  { selector: '.chart-simple', type: 'fade-left', delay: 140 },
  { selector: '.theme-preview-image', type: 'fade-left', delay: 60 },
  { selector: '.theme-card', type: 'zoom-in', delay: 80, stagger: 80 },
  { selector: '.install-step', type: 'fade-left', delay: 60, stagger: 90 },
  { selector: '.footer-content > *', type: 'fade-left', delay: 60, stagger: 120 },
]

let revealObserver: IntersectionObserver | null = null

const tabs = computed(() => [
  { id: 'form', label: t('showcase.tabs.form') },
  { id: 'layout', label: t('showcase.tabs.layout') },
  { id: 'ui', label: t('showcase.tabs.ui') },
  { id: 'composables', label: t('showcase.tabs.composables') },
])

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('ntk-theme', isDark.value ? 'dark' : 'light')
}

const handleMobileToggle = (isOpen: boolean) => {
  document.body.style.overflow = ''
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
}

const updateScrollState = () => {
  if (typeof window === 'undefined') {
    return
  }

  isScrolled.value = window.scrollY > 18
  document.body.classList.toggle('landing-scrolled', isScrolled.value)
}

/**
 * Handles prepare landing animations.
 */
function prepareLandingAnimations(): void {
  if (typeof document === 'undefined') {
    return
  }

  for (const blueprint of landingAnimationBlueprints) {
    const elements = document.querySelectorAll<HTMLElement>(blueprint.selector)
    elements.forEach((element, index) => {
      element.dataset.animate = blueprint.type
      const animateOnce = blueprint.once === true
      element.dataset.animateOnce = animateOnce ? 'true' : 'false'

      const baseDelay = blueprint.delay ?? 0
      const stagger = blueprint.stagger ?? 0
      const resolvedDelay = baseDelay + (index * stagger)
      element.style.setProperty('--animate-delay', `${resolvedDelay}ms`)
      if (!animateOnce) {
        element.classList.remove('in-view')
      }
    })
  }
}

/**
 * Handles observe landing animations.
 */
function observeLandingAnimations(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const animatedElements = document.querySelectorAll<HTMLElement>('[data-animate]')
  if (animatedElements.length === 0) {
    return
  }

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(element => element.classList.add('in-view'))
    return
  }

  revealObserver?.disconnect()

  revealObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement
        const animateOnce = target.dataset.animateOnce !== 'false'

        if (entry.isIntersecting) {
          target.classList.add('in-view')
          if (animateOnce) {
            revealObserver?.unobserve(target)
          }
        } else if (!animateOnce) {
          target.classList.remove('in-view')
        }
      }
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -10% 0px',
    }
  )

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      animatedElements.forEach(element => revealObserver?.observe(element))
    })
  })
}

/**
 * Handles refresh landing animations.
 */
function refreshLandingAnimations(): void {
  prepareLandingAnimations()
  observeLandingAnimations()
}

onMounted(() => {
  const savedTheme = localStorage.getItem('ntk-theme')
  if (savedTheme === 'dark') {
    isDark.value = true
  }

  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })

  nextTick(() => {
    refreshLandingAnimations()
  })
})

watch(isDark, newValue => {
  if (newValue) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})

watch(activeTab, () => {
  nextTick(() => {
    refreshLandingAnimations()
  })
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  revealObserver = null

  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', updateScrollState)
  }

  document.body.classList.remove('landing-scrolled')
  document.body.style.overflow = ''
})
</script>

<style>
:root {
  /* NTK Monochrome Brand Colors */
  --ntk-purple: #171717;
  --ntk-purple-dark: #050505;
  --ntk-purple-light: #f0f0f0;
  --royal-blue: #737373;
  --ntk-purple-rgb: 23, 23, 23;
  
  /* Grays */
  --gray-900: #101113;
  --gray-800: #181b20;
  --gray-700: #343a43;
  --gray-600: #596170;
  --gray-500: #7f8897;
  --gray-400: #a7afbd;
  --gray-300: #c7ced9;
  --gray-200: #e5e8ee;
  --gray-100: #f2f4f7;
  --gray-50: #f8f9fb;
  --white: #ffffff;
  
  /* Semantic */
  --success: var(--semantic-success);
  --warning: var(--semantic-warning);
  --error: var(--semantic-error);
  --info: var(--semantic-info);
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;

  /* Section backgrounds (secondary -> primary -> dark pattern) */
  --landing-section-bg-primary: #f7f8fa;
  --landing-section-bg-secondary: #eef1f5;
  --landing-section-bg-dark: #010409;
  --landing-section-bg-primary-dark: #0d1117;
  --landing-section-bg-secondary-dark: #161b22;
  --landing-section-bg-dark-dark: #010409;

  /* GitHub dark palette reference */
  --gh-bg-canvas: #0d1117;
  --gh-bg-subtle: #161b22;
  --gh-bg-muted: #21262d;
  --gh-border-default: #30363d;
  --gh-fg-default: #c9d1d9;
  --gh-fg-muted: #8b949e;
  --gh-fg-subtle: #7d8590;
  --gh-accent: #c9d1d9;
  --gh-accent-emphasis: #6e7681;
  --gh-accent-hover: #8b949e;
  --gh-accent-subtle: #9da7b3;
  --landing-shared-dark-bg: #010409;
  --landing-shared-dark-surface: #161b22;
  --landing-shared-dark-surface-muted: #21262d;
  --landing-shared-dark-border: #30363d;
  --landing-shared-dark-text: #c9d1d9;
  --landing-shared-dark-text-muted: #8b949e;
  --landing-shared-dark-accent: #6e7681;

  /* Landing-specific typography fine-tuning */
  --landing-font-size-2xs: 0.65rem;
  --landing-font-size-xs-tight: 0.7rem;
  --landing-font-size-sm-tight: 0.8125rem;
  --landing-font-size-sm-plus: 0.9375rem;
  --landing-font-size-md-plus: 1.03rem;
  --landing-font-size-lg-plus: 1.06rem;
  --landing-font-size-xl-plus: 1.14rem;
  --landing-font-size-display-sm: 1.65rem;
  --landing-font-size-display-md: 1.7rem;
  --landing-font-size-display-lg: 1.85rem;
  --landing-font-size-display-xl: 1.95rem;
  --landing-font-size-display-2xl: 2rem;
  --landing-font-size-display-3xl: 2.15rem;
  
  /* Shadows */
  --shadow-soft: var(--ntk-shadow-sm);
  --shadow-medium: var(--ntk-shadow-md);
  --shadow-strong: var(--ntk-shadow-lg);
  --shadow-header: 0 2px 8px color-mix(in srgb, var(--gray-900) 30%, transparent);
  --shadow-emphasis: 0 8px 24px color-mix(in srgb, var(--gray-900) 30%, transparent);

  /* Overlay helpers */
  --overlay-accent-05: color-mix(in srgb, var(--ntk-purple) 5%, transparent);
  --overlay-accent-08: color-mix(in srgb, var(--ntk-purple) 8%, transparent);
  --overlay-accent-10: color-mix(in srgb, var(--ntk-purple) 10%, transparent);
  --overlay-accent-15: color-mix(in srgb, var(--ntk-purple) 15%, transparent);
  --overlay-ink-30: color-mix(in srgb, var(--gray-900) 30%, transparent);
  --overlay-ink-50: color-mix(in srgb, var(--gray-900) 50%, transparent);
  --overlay-white-10: color-mix(in srgb, var(--white) 10%, transparent);
  --overlay-white-20: color-mix(in srgb, var(--white) 20%, transparent);
  --overlay-panel-80: color-mix(in srgb, var(--gray-800) 80%, transparent);
  --overlay-panel-90: color-mix(in srgb, var(--gray-900) 90%, transparent);

  /* Code palette */
  --code-dot-red: var(--error);
  --code-dot-yellow: var(--warning);
  --code-dot-green: var(--success);
  --code-keyword: #58a6ff;
  --code-string: #3fb950;
  --code-component: #79c0ff;
  --code-prop: #d29922;
  --code-comment: #8b949e;
  
  /* Motion */
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 220ms var(--easing-standard);
  --transition-normal: 350ms var(--easing-standard);
  --transition-slow: 500ms var(--easing-standard);
  --reveal-distance: 52px;
  --reveal-duration: 760ms;
  --image-hover-zoom-scale: 1.045;
  --image-hover-zoom-duration: 620ms;
  --image-hover-zoom-easing: cubic-bezier(0.22, 1, 0.36, 1);
  --component-card-hover-scale: 1.018;
  --component-card-hover-lift: -3px;
  --component-card-accent-width: 4px;
  --component-card-accent-opacity: 0.95;
  --component-card-accent-easing: cubic-bezier(0.22, 1, 0.36, 1);
  --code-block-hover-scale: 1.015;
  --topbar-enter-duration: 520ms;
  --topbar-enter-offset: 18px;
  --topbar-shadow-scrolled: 0 10px 24px color-mix(in srgb, var(--gray-900) 22%, transparent);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--ntk-font-family);
  color: var(--gray-900);
  line-height: 1.6;
  background: var(--landing-section-bg-primary);
  overflow-x: hidden;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code, pre {
  font-family: var(--ntk-font-family-mono);
}

[data-animate] {
  opacity: 0;
  transform: translate3d(var(--reveal-distance), 0, 0);
  transition:
    opacity var(--reveal-duration) var(--easing-standard),
    transform var(--reveal-duration) var(--easing-standard);
  transition-delay: var(--animate-delay, 0ms);
  will-change: opacity, transform;
}

[data-animate="fade-up"] {
  transform: translate3d(0, var(--reveal-distance), 0);
}

[data-animate="fade-right"] {
  transform: translate3d(calc(var(--reveal-distance) * -1), 0, 0);
}

[data-animate="fade-left"] {
  transform: translate3d(var(--reveal-distance), 0, 0);
}

[data-animate="zoom-in"] {
  transform: translate3d(0, calc(var(--reveal-distance) * 0.65), 0) scale(0.965);
}

[data-animate].in-view {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

a {
  color: var(--ntk-purple);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.ntk-deferred-section {
  content-visibility: auto;
  contain-intrinsic-size: 900px;
}

a:hover {
  color: var(--ntk-purple-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--white);
  box-shadow: var(--shadow-header);
  z-index: 100;
  padding: var(--spacing-md) 0;
  transition:
    background var(--transition-normal),
    box-shadow var(--transition-normal),
    padding var(--transition-normal);
  backdrop-filter: blur(0);
  animation: ntk-header-enter var(--topbar-enter-duration) var(--easing-standard);
  animation-fill-mode: both;
}

body.landing-scrolled .header {
  padding: calc(var(--spacing-md) * 0.82) 0;
  background: color-mix(in srgb, var(--white) 90%, transparent);
  box-shadow: var(--topbar-shadow-scrolled);
  backdrop-filter: blur(8px);
}

body.dark-mode.landing-scrolled .header {
  background: color-mix(in srgb, var(--gray-900) 90%, transparent);
}

@keyframes ntk-header-enter {
  from {
    opacity: 0;
    transform: translate3d(0, calc(var(--topbar-enter-offset) * -1), 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.logo-text {
  font-weight: var(--ntk-font-weight-extrabold);
  font-size: var(--ntk-font-size-xl);
  color: var(--gray-900);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav a {
  color: var(--gray-700);
  font-weight: var(--ntk-font-weight-medium);
  font-size: var(--ntk-font-size-sm);
  line-height: 1;
  display: flex;
  align-items: center;
}

.nav > a:not(.btn) {
  position: relative;
  transition: color var(--transition-fast), transform var(--transition-normal);
}

.nav > a:not(.btn)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.35rem;
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-normal);
}

.nav a:hover {
  color: var(--ntk-purple);
}

.nav > a:not(.btn):hover {
  transform: translateY(-1px);
}

.nav > a:not(.btn):hover::after {
  transform: scaleX(1);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: var(--ntk-font-weight-semibold);
  font-size: var(--landing-font-size-sm-tight);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--ntk-purple);
  color: var(--white) !important;
}

.btn-primary:hover {
  background: var(--ntk-purple-dark);
  color: var(--white) !important;
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.btn-github {
  background: var(--gh-bg-muted);
  border: 1px solid var(--gh-border-default);
  color: var(--gh-fg-default) !important;
  box-shadow: none;
}

.btn-github:hover {
  background: var(--gh-border-default);
  border-color: var(--gh-fg-subtle);
  color: var(--gh-fg-default) !important;
  transform: translateY(-1px);
  box-shadow: none;
}

.btn-secondary {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

/* Hero */
.hero {
  padding: 160px 0 100px;
  background: linear-gradient(
    135deg,
    var(--landing-section-bg-secondary) 0%,
    color-mix(in srgb, var(--landing-section-bg-secondary) 72%, var(--landing-section-bg-primary)) 52%,
    var(--overlay-accent-05) 100%
  );
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, var(--overlay-accent-08) 0%, transparent 70%);
  border-radius: 50%;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--overlay-accent-10);
  color: var(--ntk-purple);
  border-radius: 100px;
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.hero-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 35%, transparent);
  animation: ntk-pulse-dot 2s ease-in-out infinite;
}

.hero h1 {
  font-size: clamp(3.2rem, 5vw, 3.6rem);
  font-weight: var(--ntk-font-weight-bold);
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: var(--gray-900);
}

.hero h1 span {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: var(--landing-font-size-xl-plus);
  color: var(--gray-500);
  margin-bottom: var(--spacing-xl);
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
}

.hero-visual {
  position: relative;
  z-index: 1;
  animation: ntk-float 4s ease-in-out infinite;
}

.hero-visual picture {
  display: block;
  border-radius: 16px;
  overflow: hidden;
  transform-origin: center;
  box-shadow: var(--shadow-strong);
  transition: transform var(--image-hover-zoom-duration) var(--image-hover-zoom-easing);
}

.hero-visual:hover picture {
  transform: scale(var(--image-hover-zoom-scale));
}

.hero-visual img {
  width: 100%;
  max-width: 700px;
  display: block;
  filter: grayscale(1) contrast(1.08);
}

/* Float Animation */
@keyframes ntk-float {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -8px, 0);
  }
}

@keyframes ntk-pulse-dot {
  0% {
    opacity: 0.75;
    box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 35%, transparent);
  }
  70% {
    opacity: 1;
    box-shadow: 0 0 0 8px color-mix(in srgb, currentColor 0%, transparent);
  }
  100% {
    opacity: 0.75;
    box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 0%, transparent);
  }
}

/* Stats */
.stats {
  display: flex;
  gap: var(--spacing-3xl);
  margin-top: var(--spacing-3xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--gray-200);
}

.stat {
  text-align: left;
}

.stat-value {
  font-size: var(--landing-font-size-display-lg);
  font-weight: var(--ntk-font-weight-extrabold);
  color: var(--ntk-purple);
}

.stat-label {
  font-size: var(--ntk-font-size-sm);
  color: var(--gray-500);
  font-weight: var(--ntk-font-weight-medium);
}

/* Features */
.features {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-section-bg-primary);
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto var(--spacing-3xl);
}

.section-header h2 {
  font-size: clamp(2.3rem, 3.8vw, 2.65rem);
  font-weight: var(--ntk-font-weight-bold);
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.section-header p {
  font-size: var(--landing-font-size-lg-plus);
  color: var(--gray-500);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.feature-card {
  padding: var(--spacing-xl);
  background: var(--white);
  border: 1px solid var(--gray-100);
  border-radius: 16px;
  transition: all var(--transition-normal);
}

.feature-card:hover {
  border-color: var(--ntk-purple-light);
  box-shadow: var(--shadow-medium);
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--ntk-purple) 0%, var(--ntk-purple-light) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: var(--white);
}

.feature-card h3 {
  font-size: var(--ntk-font-size-xl);
  font-weight: var(--ntk-font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--gray-900);
}

.feature-card p {
  font-size: var(--landing-font-size-sm-plus);
  color: var(--gray-600);
  line-height: 1.6;
}

/* Components Showcase - ALWAYS dark background with white text */
.showcase {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-shared-dark-bg) !important;
  color: var(--landing-shared-dark-text) !important;
}

.showcase h2,
.showcase .section-header h2 {
  color: var(--white) !important;
}

.showcase .section-header p {
  color: var(--landing-shared-dark-text-muted) !important;
}

.btn-primary,
.btn-primary svg,
.btn-primary:hover,
.btn-primary:hover svg {
  color: var(--white) !important;
  fill: var(--white) !important;
}

.component-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.tab-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: transparent;
  color: var(--landing-shared-dark-text-muted);
  border: 1px solid var(--landing-shared-dark-border);
  border-radius: 8px;
  font-weight: var(--ntk-font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover,
.tab-btn.active {
  background: var(--ntk-purple);
  border-color: var(--ntk-purple);
  color: var(--white);
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.component-item {
  padding: var(--spacing-lg);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transform-origin: center;
  will-change: transform;
  transition:
    transform var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.component-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--component-card-accent-width);
  border-radius: 12px 0 0 12px;
  background: linear-gradient(180deg, var(--ntk-purple) 0%, var(--royal-blue) 100%);
  opacity: 0;
  transform: scaleY(0.2);
  transform-origin: center;
  transition:
    opacity var(--transition-fast),
    transform var(--transition-normal) var(--component-card-accent-easing);
}

.component-item:hover,
.component-item:focus-within {
  background: var(--gray-100);
  border-color: var(--ntk-purple);
  box-shadow: var(--shadow-soft);
  transform: translate3d(0, var(--component-card-hover-lift), 0) scale(var(--component-card-hover-scale));
}

.component-item:hover::before,
.component-item:focus-within::before {
  opacity: var(--component-card-accent-opacity);
  transform: scaleY(1);
}

.component-item code {
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-purple);
}

.component-item p {
  font-size: var(--ntk-font-size-xs);
  color: var(--gray-600);
  margin-top: var(--spacing-xs);
}

/* Code Example */
.code-section {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-shared-dark-bg);
}

.code-section .section-header h2 {
  color: var(--landing-shared-dark-text);
}

.code-section .section-header p {
  color: var(--landing-shared-dark-text-muted);
}

.code-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.code-block {
  background: var(--landing-shared-dark-bg);
  border: 1px solid color-mix(in srgb, #000 28%, transparent);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 18px 36px color-mix(in srgb, #000 32%, transparent);
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.2s;
  transform-origin: center;
  transition:
    scale var(--image-hover-zoom-duration) var(--image-hover-zoom-easing),
    box-shadow var(--transition-fast);
}

.code-block:hover,
.code-block:focus-within {
  scale: var(--code-block-hover-scale);
  box-shadow: 0 22px 44px color-mix(in srgb, var(--gray-900) 34%, transparent);
}

.code-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--landing-shared-dark-bg);
  border-bottom: 1px solid color-mix(in srgb, #000 28%, transparent);
}

.code-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.code-dot.red { background: var(--code-dot-red); }
.code-dot.yellow { background: var(--code-dot-yellow); }
.code-dot.green { background: var(--code-dot-green); }

.code-content {
  background: var(--landing-shared-dark-bg);
  padding: var(--spacing-lg);
  overflow-x: auto;
}

.code-content pre {
  font-size: var(--ntk-font-size-sm);
  line-height: 1.7;
  color: var(--landing-shared-dark-text-muted);
}

.code-content .keyword { color: var(--code-keyword); }
.code-content .string { color: var(--code-string); }
.code-content .component { color: var(--code-component); }
.code-content .prop { color: var(--code-prop); }
.code-content .comment { color: var(--code-comment); }

/* Form Components Visual Section */
.form-visual-section {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-section-bg-primary);
}

.form-visual-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.form-visual-image img {
  width: 100%;
  display: block;
  filter: grayscale(1) contrast(1.08);
}

.form-visual-image picture {
  display: block;
  border-radius: 16px;
  overflow: hidden;
  transform-origin: center;
  box-shadow: var(--shadow-strong);
  transition: transform var(--image-hover-zoom-duration) var(--image-hover-zoom-easing);
}

.form-visual-image {
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.3s;
}

.form-visual-image:hover picture {
  transform: scale(var(--image-hover-zoom-scale));
}

.form-visual-content h2 {
  font-size: clamp(2.3rem, 3.8vw, 2.65rem);
  font-weight: var(--ntk-font-weight-bold);
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.form-visual-content p {
  font-size: var(--landing-font-size-lg-plus);
  color: var(--gray-500);
  margin-bottom: var(--spacing-xl);
}

.form-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.form-feature-icon {
  width: 32px;
  height: 32px;
  background: var(--overlay-accent-10);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ntk-purple);
}

/* Composables Visual Section */
.composables-visual-section {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-section-bg-dark);
}

.composables-visual-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: start;
}

.composables-visual-image {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.6s;
}

.composables-visual-image img {
  width: 100%;
  max-width: 500px;
  display: block;
  filter: grayscale(1) contrast(1.08);
}

.composables-visual-image picture {
  display: block;
  border-radius: 16px;
  overflow: hidden;
  transform-origin: center;
  box-shadow: var(--shadow-strong);
  transition: transform var(--image-hover-zoom-duration) var(--image-hover-zoom-easing);
}

.composables-visual-image:hover picture {
  transform: scale(var(--image-hover-zoom-scale));
}

.composables-visual-content h2 {
  font-size: clamp(2.3rem, 3.8vw, 2.65rem);
  font-weight: var(--ntk-font-weight-bold);
  margin-bottom: var(--spacing-md);
  color: var(--white);
}

.composables-visual-content p {
  font-size: var(--landing-font-size-lg-plus);
  color: var(--gray-300);
  margin-bottom: var(--spacing-xl);
}

.composables-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.composable-item {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--white);
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  text-align: left;
  position: relative;
  overflow: hidden;
  transform-origin: center;
  will-change: transform;
  transition:
    transform var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.composable-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--component-card-accent-width);
  border-radius: 8px 0 0 8px;
  background: linear-gradient(180deg, var(--ntk-purple) 0%, var(--royal-blue) 100%);
  opacity: 0;
  transform: scaleY(0.2);
  transform-origin: center;
  transition:
    opacity var(--transition-fast),
    transform var(--transition-normal) var(--component-card-accent-easing);
}

.composable-item:hover,
.composable-item:focus-within {
  background: var(--gray-100);
  border-color: var(--ntk-purple);
  box-shadow: var(--shadow-soft);
  transform: translate3d(0, var(--component-card-hover-lift), 0) scale(var(--component-card-hover-scale));
}

.composable-item:hover::before,
.composable-item:focus-within::before {
  opacity: var(--component-card-accent-opacity);
  transform: scaleY(1);
}

.composable-item .composable-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: var(--spacing-xs);
}

.composable-icon {
  font-size: var(--ntk-font-size-xl);
}

.composable-item code {
  color: var(--ntk-purple);
  font-weight: var(--ntk-font-weight-semibold);
}

.composable-item p {
  font-size: var(--ntk-font-size-xs);
  color: var(--gray-500);
  margin: 0;
}

/* Theme Section */
.themes {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-section-bg-primary);
}

.theme-preview-image {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.theme-preview-image img {
  width: 100%;
  display: block;
}

.theme-preview-image picture {
  display: block;
  border-radius: 16px;
  overflow: hidden;
  transform-origin: center;
  box-shadow: var(--shadow-strong);
  transition: transform var(--image-hover-zoom-duration) var(--image-hover-zoom-easing);
}

.theme-preview-image {
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.9s;
}

.theme-preview-image:hover picture {
  transform: scale(var(--image-hover-zoom-scale));
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.theme-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-medium);
  transition: all var(--transition-normal);
}

.theme-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-strong);
}

.theme-preview {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.theme-preview.dark-theme {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
}

.theme-preview.purple-theme {
  background: linear-gradient(135deg, #5133de 0%, #7a67e7 100%);
}

.theme-preview.monochrome-theme {
  background: linear-gradient(135deg, var(--gray-700) 0%, var(--gray-500) 100%);
}

.theme-preview img {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  box-shadow: var(--shadow-emphasis);
  transition: transform var(--transition-normal);
}

.theme-card:hover .theme-preview img {
  transform: scale(1.08);
}

.theme-card {
  background: var(--white);
  border: 1px solid var(--gray-100);
}

.theme-info {
  padding: var(--spacing-lg);
  background: var(--white);
}

.theme-info h3 {
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  margin-bottom: var(--spacing-xs);
  color: var(--gray-900);
}

.theme-info p {
  font-size: var(--ntk-font-size-sm);
  color: var(--gray-500);
}

/* Dashboard Preview */
.dashboard-preview {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-section-bg-secondary);
}

.dashboard-simple {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.metrics-grid-simple {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.metric-card-simple {
  background: var(--white);
  border-radius: 12px;
  padding: var(--spacing-lg);
  border: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  transform-origin: center;
  will-change: transform;
  transition:
    transform var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.metric-card-simple::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--component-card-accent-width);
  border-radius: 12px 0 0 12px;
  background: linear-gradient(180deg, var(--ntk-purple) 0%, var(--royal-blue) 100%);
  opacity: 0;
  transform: scaleY(0.2);
  transform-origin: center;
  transition:
    opacity var(--transition-fast),
    transform var(--transition-normal) var(--component-card-accent-easing);
}

.metric-card-simple:hover,
.metric-card-simple:focus-within {
  border-color: var(--ntk-purple);
  box-shadow: var(--shadow-medium);
  transform: translate3d(0, var(--component-card-hover-lift), 0) scale(var(--component-card-hover-scale));
}

.metric-card-simple:hover::before,
.metric-card-simple:focus-within::before {
  opacity: var(--component-card-accent-opacity);
  transform: scaleY(1);
}

.metric-card-simple:hover .metric-icon,
.metric-card-simple:focus-within .metric-icon {
  transform: scale(1.06);
}

.metric-icon {
  font-size: var(--landing-font-size-display-2xl);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-purple-light);
  border-radius: 12px;
  transition: transform var(--transition-fast);
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: var(--ntk-font-size-sm);
  color: var(--gray-500);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  font-size: var(--ntk-font-size-2xl);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--gray-900);
}

.metric-trend {
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  padding: 4px 8px;
  border-radius: 6px;
}

.metric-trend.positive {
  color: var(--success);
  background: color-mix(in srgb, var(--success) 10%, transparent);
}

.metric-trend.negative {
  color: var(--error);
  background: color-mix(in srgb, var(--error) 10%, transparent);
}

.chart-simple {
  background: var(--white);
  border-radius: 12px;
  padding: var(--spacing-xl);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-soft);
  transform-origin: center;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.chart-simple:hover,
.chart-simple:focus-within {
  box-shadow: var(--shadow-medium);
  transform: translate3d(0, calc(var(--component-card-hover-lift) * 0.8), 0) scale(calc(var(--component-card-hover-scale) - 0.003));
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.chart-title {
  font-weight: var(--ntk-font-weight-bold);
  color: var(--gray-900);
}

.chart-period {
  font-size: var(--ntk-font-size-sm);
  color: var(--gray-500);
}

.chart-bars-simple {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  gap: var(--spacing-sm);
}

.chart-bar-simple {
  flex: 1;
  background: linear-gradient(180deg, var(--ntk-purple), var(--ntk-purple-light));
  border-radius: 6px 6px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  transition: all 0.3s;
}

.chart-bar-simple:hover {
  opacity: 0.8;
}

.chart-bar-simple span {
  position: absolute;
  bottom: -24px;
  font-size: var(--ntk-font-size-xs);
  color: var(--gray-500);
}

/* Dark mode for dashboard simple */
body.dark-mode .dashboard-preview {
  background: var(--gray-800);
}

body.dark-mode .metric-card-simple {
  background: var(--gray-900);
  border-color: var(--gray-700);
}

body.dark-mode .metric-card-simple:hover,
body.dark-mode .metric-card-simple:focus-within {
  border-color: var(--ntk-purple-light);
}

body.dark-mode .metric-value {
  color: var(--white);
}

body.dark-mode .chart-simple {
  background: var(--gray-900);
  border-color: var(--gray-700);
}

body.dark-mode .chart-title {
  color: var(--white);
}

/* Installation */
.installation {
  padding: var(--spacing-3xl) 0;
  background: var(--landing-shared-dark-bg);
  color: var(--landing-shared-dark-text);
}

.installation .section-header h2 {
  color: var(--landing-shared-dark-text) !important;
}

.installation .section-header p {
  color: var(--landing-shared-dark-text-muted) !important;
}

.install-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.install-step {
  text-align: center;
  background: var(--landing-shared-dark-surface);
  border: 1px solid var(--landing-shared-dark-border);
  border-radius: 12px;
  padding: var(--spacing-xl);
  transform-origin: center;
  transition: transform var(--transition-fast);
}

.install-step:hover,
.install-step:focus-within {
  transform: scale(calc(var(--component-card-hover-scale) - 0.002));
}

.step-number {
  width: 48px;
  height: 48px;
  background: var(--landing-shared-dark-accent);
  color: var(--landing-shared-dark-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--ntk-font-weight-extrabold);
  font-size: var(--ntk-font-size-xl);
  margin: 0 auto var(--spacing-lg);
}

.install-step h3 {
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--landing-shared-dark-text) !important;
}

.install-step code {
  display: block;
  padding: var(--spacing-md);
  background: var(--landing-shared-dark-bg);
  border: 1px solid var(--landing-shared-dark-border);
  border-radius: 8px;
  font-size: var(--ntk-font-size-sm);
  color: var(--landing-shared-dark-text);
  margin-top: var(--spacing-md);
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.install-step-content {
  overflow: hidden;
}

.install-step-content code {
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-size: var(--ntk-font-size-xs);
}

/* Theme Toggle */
.theme-toggle {
  background: transparent;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-700);
  transition: all var(--transition-fast);
}

.lang-toggle {
  min-width: 56px;
  padding: 0.5rem 0.65rem;
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  letter-spacing: var(--landing-layout-floating-button-letter-spacing);
}

.theme-toggle:hover {
  background: var(--gray-100);
  color: var(--ntk-purple);
}

body.dark-mode .theme-toggle {
  border-color: var(--overlay-white-20);
  color: var(--gray-300);
}

body.dark-mode .theme-toggle:hover {
  background: var(--overlay-white-10);
  color: var(--ntk-purple-light);
}

/* Dark Mode Styles */
body.dark-mode {
  --ntk-purple: var(--gh-accent-emphasis);
  --ntk-purple-dark: var(--gh-accent-hover);
  --ntk-purple-light: var(--gh-accent);
  --royal-blue: var(--gh-accent-subtle);

  --gray-900: var(--gh-bg-canvas);
  --gray-800: var(--gh-bg-subtle);
  --gray-700: var(--gh-bg-muted);
  --gray-600: var(--gh-border-default);
  --gray-500: var(--gh-fg-muted);
  --gray-400: var(--gh-fg-subtle);
  --gray-300: var(--gh-fg-muted);
  --gray-200: var(--gh-border-default);
  --gray-100: var(--gh-bg-subtle);
  --white: var(--gh-fg-default);

  --landing-section-bg-primary: var(--gh-bg-canvas);
  --landing-section-bg-secondary: var(--gh-bg-subtle);
  --landing-section-bg-dark: #010409;

  background: var(--gh-bg-canvas);
  color: var(--gh-fg-default);
}

body.dark-mode .header {
  background: color-mix(in srgb, #010409 94%, transparent);
  border-bottom: 1px solid var(--gh-border-default);
}

body.dark-mode.landing-scrolled .header {
  background: color-mix(in srgb, #010409 90%, transparent);
  border-bottom-color: var(--gh-border-default);
}

body.dark-mode .logo-text {
  color: var(--white);
}

body.dark-mode .nav a {
  color: var(--gh-fg-muted);
}

body.dark-mode .nav a:hover {
  color: var(--gh-accent);
}

body.dark-mode .hero {
  background: linear-gradient(
    135deg,
    var(--landing-section-bg-secondary) 0%,
    color-mix(in srgb, var(--landing-section-bg-secondary) 72%, var(--landing-section-bg-primary)) 52%,
    var(--landing-section-bg-primary) 100%
  );
}

body.dark-mode .hero h1 {
  color: var(--white);
}

body.dark-mode .hero h1 span {
  background: linear-gradient(
    110deg,
    color-mix(in srgb, #f3f6fb 84%, var(--gh-bg-canvas) 16%) 0%,
    color-mix(in srgb, #d7dde6 80%, var(--gh-bg-canvas) 20%) 24%,
    color-mix(in srgb, #9aa6b8 72%, var(--gh-bg-canvas) 28%) 52%,
    color-mix(in srgb, #d3d9e3 82%, var(--gh-bg-canvas) 18%) 78%,
    color-mix(in srgb, #eef2f8 88%, var(--gh-bg-canvas) 12%) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

body.dark-mode .hero p {
  color: var(--gh-fg-muted);
}

body.dark-mode .btn-secondary {
  border-color: var(--gh-border-default);
  color: var(--gh-fg-default);
}

body.dark-mode .btn-secondary:hover {
  background: var(--gh-bg-muted);
  color: var(--gh-fg-default);
}

body.dark-mode .btn-primary {
  background: var(--gh-bg-muted);
  border: 1px solid var(--gh-border-default);
  color: var(--gh-fg-default) !important;
  box-shadow: none;
}

body.dark-mode .btn-primary:hover {
  background: var(--gh-border-default);
  border-color: var(--gh-fg-subtle);
  color: var(--gh-fg-default) !important;
  box-shadow: none;
}

body.dark-mode .stat-number {
  color: var(--gh-accent);
}

body.dark-mode .stat-label {
  color: var(--gh-fg-muted);
}

body.dark-mode .section-header h2 {
  color: var(--white);
}

body.dark-mode .section-header p {
  color: var(--gh-fg-muted);
}

/* Feature cards - same style in both themes - FORCE colors */
body.dark-mode .feature-card {
  background: var(--gh-bg-subtle) !important;
  border-color: var(--gh-border-default) !important;
}

body.dark-mode .feature-card h3 {
  color: var(--gh-fg-default) !important;
}

body.dark-mode .feature-card p {
  color: var(--gh-fg-muted) !important;
}

body.dark-mode .feature-card:hover {
  background: var(--gh-bg-muted) !important;
  border-color: var(--gh-accent-emphasis) !important;
}

/* Theme cards - keep white bottom in both themes */
body.dark-mode .theme-card {
  background: var(--gh-bg-subtle);
  border: 1px solid var(--gh-border-default);
}

body.dark-mode .theme-info {
  background: var(--gh-bg-subtle);
}

body.dark-mode .theme-card h3,
body.dark-mode .theme-info h3 {
  color: var(--gh-fg-default) !important;
}

body.dark-mode .theme-card p,
body.dark-mode .theme-info p {
  color: var(--gh-fg-muted) !important;
}

body.dark-mode .form-visual-content h2 {
  color: var(--white);
}

body.dark-mode .form-visual-content p {
  color: var(--gray-400);
}

body.dark-mode .form-feature span {
  color: var(--gray-300);
}

body.dark-mode .composables-visual-content h2 {
  color: var(--white);
}

body.dark-mode .composables-visual-content p {
  color: var(--gray-400);
}

/* Composable items - same style in both themes - FORCE colors */
body.dark-mode .composable-item {
  background: var(--gh-bg-subtle) !important;
  border-color: var(--gh-border-default) !important;
}

body.dark-mode .composable-item code {
  color: var(--gh-accent) !important;
}

body.dark-mode .composable-item p {
  color: var(--gh-fg-muted) !important;
}

body.dark-mode .tab-btn {
  background: var(--gh-bg-subtle);
  border-color: var(--gh-border-default);
  color: var(--gh-fg-default);
}

body.dark-mode .tab-btn:hover {
  background: var(--gh-bg-muted);
  border-color: var(--gh-accent-emphasis);
  color: #ffffff;
}

body.dark-mode .tab-btn.active {
  background: var(--gh-accent-emphasis);
  border-color: var(--gh-accent-emphasis);
  color: #ffffff;
}

/* Component items - white cards with dark text in both themes */
.showcase .component-item {
  background: var(--white) !important;
  border: 1px solid var(--gray-200) !important;
}

.showcase .component-item code {
  color: var(--ntk-purple) !important;
}

.showcase .component-item p {
  color: var(--gray-600) !important;
}

body.dark-mode .showcase .component-item {
  background: var(--gh-bg-subtle) !important;
  border: 1px solid var(--gh-border-default) !important;
}

body.dark-mode .showcase .component-item code {
  color: var(--gh-accent) !important;
}

body.dark-mode .showcase .component-item p {
  color: var(--gh-fg-muted) !important;
}

body.dark-mode .install-step {
  background: var(--gh-bg-subtle);
  border-color: var(--gh-border-default);
}

body.dark-mode .install-step code {
  background: var(--gh-bg-canvas);
  border: 1px solid var(--gh-border-default);
  color: var(--gh-accent);
}

/* Light mode - ensure text visibility on dark backgrounds */
.dark-section h2,
.dark-section h3,
.dark-section p,
.dark-section code {
  color: var(--white);
}

.dark-section .section-header h2 {
  color: var(--white);
}

.dark-section .section-header p {
  color: var(--gh-fg-muted);
}

.dark-section .component-item code {
  color: var(--ntk-purple-light);
}

.dark-section .component-item p {
  color: var(--gray-400);
}

/* Footer always has white text (dark background) */
.footer,
.footer h4,
.footer p,
.footer a {
  color: var(--landing-shared-dark-text-muted);
}

.footer h4 {
  color: var(--landing-shared-dark-text) !important;
}

.footer .footer-logo {
  color: var(--landing-shared-dark-text);
}

.footer-column a:hover {
  color: var(--landing-shared-dark-text);
}

/* Footer */
.footer {
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  background: var(--landing-shared-dark-bg);
  border-top: 1px solid var(--landing-shared-dark-border);
}

body.dark-mode .footer {
  background: var(--gh-bg-canvas);
  border-top-color: var(--gh-border-default);
}

body.dark-mode .footer p,
body.dark-mode .footer a,
body.dark-mode .footer-description,
body.dark-mode .footer-bottom p,
body.dark-mode .footer-column a {
  color: var(--gh-fg-muted);
}

body.dark-mode .footer h4,
body.dark-mode .footer-logo,
body.dark-mode .footer-bottom a:hover,
body.dark-mode .footer-column a:hover {
  color: var(--gh-fg-default) !important;
}

body:not(.dark-mode) .footer {
  background: var(--gh-bg-canvas);
  border-top-color: var(--gh-border-default);
}

body:not(.dark-mode) .footer p,
body:not(.dark-mode) .footer a,
body:not(.dark-mode) .footer-description,
body:not(.dark-mode) .footer-bottom p,
body:not(.dark-mode) .footer-column a {
  color: var(--gh-fg-muted);
}

body:not(.dark-mode) .footer h4,
body:not(.dark-mode) .footer-logo,
body:not(.dark-mode) .footer-bottom a:hover,
body:not(.dark-mode) .footer-column a:hover {
  color: var(--gh-fg-default) !important;
}

body:not(.dark-mode) .footer-bottom {
  border-top-color: var(--gh-border-default);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-2xl);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--white);
  font-weight: var(--ntk-font-weight-bold);
  font-size: var(--ntk-font-size-lg);
}

.footer-logo img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.footer-description {
  color: var(--landing-shared-dark-text-muted);
  font-size: var(--ntk-font-size-sm);
  line-height: 1.6;
  max-width: 300px;
}

.footer-social {
  display: flex;
  gap: var(--spacing-md);
}

.footer-social a {
  color: var(--landing-shared-dark-text-muted);
  transition: color var(--transition-fast);
}

.footer-social a:hover {
  color: var(--landing-shared-dark-text);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: var(--spacing-xl);
}

.footer-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start !important;
  align-items: flex-start;
  gap: var(--spacing-md);
  min-height: auto !important;
}

.footer-column h4 {
  color: var(--white);
  font-weight: var(--ntk-font-weight-semibold);
  font-size: var(--ntk-font-size-sm);
  margin: 0 0 var(--spacing-sm);
  line-height: 1.2;
}

.footer-links-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--spacing-md);
  width: 100%;
}

.footer-links-list li {
  margin: 0;
  padding: 0;
}

.footer-column a {
  display: inline-block;
  color: var(--landing-shared-dark-text-muted);
  font-size: var(--ntk-font-size-sm);
  line-height: 1.35;
  transition: color var(--transition-fast);
  margin: 0;
  padding: 0;
}

.footer-column a:hover {
  color: var(--landing-shared-dark-text);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--overlay-white-10);
}

.footer-bottom p {
  color: var(--landing-shared-dark-text-muted);
  font-size: var(--ntk-font-size-sm);
}

.footer-bottom a {
  color: var(--landing-shared-dark-text-muted);
}

.footer-bottom a:hover {
  color: var(--landing-shared-dark-text);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  [data-animate] {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-content {
    order: 1;
  }
  
  .hero-visual {
    order: 2;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .hero p {
    margin: 0 auto var(--spacing-xl);
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .stats {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .component-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .code-container {
    grid-template-columns: 1fr;
  }
  
  .theme-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .install-steps {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: var(--landing-font-size-display-3xl);
  }
  
  .hero p {
    font-size: var(--landing-font-size-md-plus);
  }
  
  .hero-visual img {
    width: 100%;
    max-width: 100%;
  }
  
  .nav {
    display: none;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .form-visual-container {
    grid-template-columns: 1fr;
  }
  
  .form-visual-content h2 {
    font-size: var(--landing-font-size-display-xl);
  }
  
  .composables-visual-container {
    grid-template-columns: 1fr;
  }
  
  .composables-visual-image {
    padding-top: 0;
    order: 2;
  }
  
  .composables-visual-content {
    order: 1;
  }
  
  .composables-visual-content h2 {
    font-size: var(--landing-font-size-display-xl);
  }
  
  .composables-list {
    grid-template-columns: 1fr;
  }
  
  .code-block {
    overflow-x: auto;
  }
  
  .code-content pre {
    font-size: var(--ntk-font-size-xs);
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .theme-section h2 {
    font-size: var(--landing-font-size-display-xl);
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-description {
    max-width: 100%;
  }
  
  .footer-social {
    justify-content: center;
  }
  
  .footer-links-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .hero {
    padding: 120px 0 60px;
  }
  
  .hero h1 {
    font-size: var(--landing-font-size-display-2xl);
  }
  
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-lg);
  }
  
  .stat {
    text-align: center;
    min-width: 80px;
  }
  
  .stat-value {
    font-size: var(--landing-font-size-display-sm);
  }
  
  .stat-label {
    font-size: var(--ntk-font-size-xs);
  }
  
  .section-header h2 {
    font-size: var(--landing-font-size-display-md);
  }
  
  .form-visual-content h2,
  .composables-visual-content h2,
  .theme-section h2 {
    font-size: var(--landing-font-size-display-md);
  }
  
  .install-step-content code {
    font-size: var(--landing-font-size-xs-tight);
    word-break: break-all;
  }
  
  .install-step {
    padding: var(--spacing-md);
  }
  
  .install-step code {
    font-size: var(--landing-font-size-2xs);
    padding: var(--spacing-sm);
  }
  
  .install-step h3 {
    font-size: var(--ntk-font-size-base);
  }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--gray-700);
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

body.dark-mode .mobile-menu-btn {
  color: var(--gray-300);
}

/* Mobile Drawer */
.mobile-drawer {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: var(--white);
  z-index: 1000;
  transition: right 0.3s ease;
  box-shadow: -4px 0 20px color-mix(in srgb, var(--gray-900) 10%, transparent);
}

.mobile-drawer.open {
  right: 0;
}

body.dark-mode .mobile-drawer {
  background: var(--gray-900);
}

.drawer-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-100);
}

body.dark-mode .drawer-header {
  border-bottom-color: var(--overlay-white-10);
}

.drawer-close-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--gray-500);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 8px;
  transition: all var(--transition-fast);
}

.drawer-close-btn:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

body.dark-mode .drawer-close-btn {
  color: var(--gray-400);
}

body.dark-mode .drawer-close-btn:hover {
  background: var(--overlay-white-10);
  color: var(--white);
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  gap: var(--spacing-sm);
}

.drawer-link {
  display: block;
  padding: var(--spacing-md);
  color: var(--gray-700);
  font-weight: var(--ntk-font-weight-medium);
  border-radius: 8px;
  transition: all var(--transition-fast);
}

.drawer-link:hover {
  background: var(--gray-100);
  color: var(--ntk-purple);
}

body.dark-mode .drawer-link {
  color: var(--gray-300);
}

body.dark-mode .drawer-link:hover {
  background: var(--overlay-white-10);
  color: var(--ntk-purple-light);
}

.drawer-cta {
  margin-top: var(--spacing-md);
  justify-content: center;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--overlay-ink-50);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.drawer-overlay.open {
  opacity: 1;
  visibility: visible;
}

.cms-mode-btn {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1100;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 0.875rem;
  border-radius: 999px;
  background: var(--gh-bg-muted);
  border: 1px solid var(--gh-border-default);
  color: var(--gh-fg-default) !important;
  font-size: var(--landing-font-size-sm-tight);
  font-weight: var(--ntk-font-weight-bold);
  letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow: none;
  transition:
    transform var(--transition-fast),
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.cms-mode-btn:hover {
  background: var(--gh-border-default);
  border-color: var(--gh-fg-subtle);
  color: var(--gh-fg-default) !important;
  transform: translateY(-1px);
}

</style>