<template>
  <div id="app">
    <LandingHeaderSection
      :is-dark="isDark"
      :drawer-open="drawerOpen"
      @toggle-theme="toggleTheme"
      @open-drawer="openDrawer"
      @close-drawer="closeDrawer"
    />

    <LandingHeroSection />
    <LandingFeaturesSection />
    <LandingShowcaseSection :tabs="tabs" :active-tab="activeTab" @update:active-tab="activeTab = $event" />
    <LandingDeveloperSection />
    <LandingDashboardSection />
    <LandingThemesSection />
    <LandingInstallationSection />
    <LandingFooterSection />

    <a
      href="/?cms=1"
      class="cms-mode-btn"
      aria-label="Open CMS mode"
    >
      Test CMS
    </a>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import LandingDashboardSection from './components/LandingDashboardSection.vue'
import LandingDeveloperSection from './components/LandingDeveloperSection.vue'
import LandingFeaturesSection from './components/LandingFeaturesSection.vue'
import LandingFooterSection from './components/LandingFooterSection.vue'
import LandingHeaderSection from './components/LandingHeaderSection.vue'
import LandingHeroSection from './components/LandingHeroSection.vue'
import LandingInstallationSection from './components/LandingInstallationSection.vue'
import LandingShowcaseSection from './components/LandingShowcaseSection.vue'
import LandingThemesSection from './components/LandingThemesSection.vue'

const isDark = ref(false)
const drawerOpen = ref(false)
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
  { selector: '.hero-content', type: 'fade-right' },
  { selector: '.hero-visual', type: 'fade-left', delay: 120 },
  { selector: '.stats .stat', type: 'fade-up', delay: 150, stagger: 90 },
  { selector: '.section-header', type: 'fade-up', delay: 40 },
  { selector: '.feature-card', type: 'fade-up', delay: 80, stagger: 70 },
  { selector: '.component-tabs', type: 'fade-up', delay: 80 },
  { selector: '.component-grid .component-item', type: 'zoom-in', delay: 100, stagger: 35 },
  { selector: '.code-container > div:first-child', type: 'fade-right' },
  { selector: '.code-block', type: 'fade-left', delay: 120 },
  { selector: '.form-visual-image', type: 'fade-right' },
  { selector: '.form-visual-content', type: 'fade-left', delay: 120 },
  { selector: '.composables-visual-content', type: 'fade-right' },
  { selector: '.composables-visual-image', type: 'fade-left', delay: 120 },
  { selector: '.composable-item', type: 'zoom-in', delay: 80, stagger: 45 },
  { selector: '.metrics-grid-simple .metric-card-simple', type: 'fade-up', delay: 60, stagger: 60 },
  { selector: '.chart-simple', type: 'fade-up', delay: 140 },
  { selector: '.theme-preview-image', type: 'fade-up', delay: 60 },
  { selector: '.theme-card', type: 'zoom-in', delay: 80, stagger: 80 },
  { selector: '.install-step', type: 'fade-up', delay: 60, stagger: 90 },
  { selector: '.footer-content > *', type: 'fade-up', delay: 60, stagger: 120 },
]

let revealObserver: IntersectionObserver | null = null

const tabs = [
  { id: 'form', label: 'Form' },
  { id: 'layout', label: 'Layout' },
  { id: 'ui', label: 'UI' },
  { id: 'composables', label: 'Composables' },
]

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('ntk-theme', isDark.value ? 'dark' : 'light')
}

const openDrawer = () => {
  drawerOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeDrawer = () => {
  drawerOpen.value = false
  document.body.style.overflow = ''
}

const updateScrollState = () => {
  if (typeof window === 'undefined') {
    return
  }

  isScrolled.value = window.scrollY > 18
  document.body.classList.toggle('landing-scrolled', isScrolled.value)
}

function prepareLandingAnimations(): void {
  if (typeof document === 'undefined') {
    return
  }

  for (const blueprint of landingAnimationBlueprints) {
    const elements = document.querySelectorAll<HTMLElement>(blueprint.selector)
    elements.forEach((element, index) => {
      element.dataset.animate = blueprint.type
      element.dataset.animateOnce = blueprint.once === false ? 'false' : 'true'

      const baseDelay = blueprint.delay ?? 0
      const stagger = blueprint.stagger ?? 0
      const resolvedDelay = baseDelay + (index * stagger)
      element.style.setProperty('--animate-delay', `${resolvedDelay}ms`)
    })
  }
}

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

  animatedElements.forEach(element => revealObserver?.observe(element))
}

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
})
</script>

<style>
:root {
  /* NTK Brand Colors */
  --ntk-purple: var(--ntk-primary);
  --ntk-purple-dark: var(--ntk-primary-dark);
  --ntk-purple-light: var(--ntk-primary-light);
  --royal-blue: var(--ntk-info);
  --ntk-purple-rgb: var(--ntk-primary-rgb);
  
  /* Grays */
  --gray-900: var(--ntk-text-primary);
  --gray-800: color-mix(in srgb, var(--ntk-text-primary) 85%, var(--ntk-bg-primary));
  --gray-700: var(--ntk-text-secondary);
  --gray-600: color-mix(in srgb, var(--ntk-text-secondary) 85%, var(--ntk-text-muted));
  --gray-500: var(--ntk-text-muted);
  --gray-400: color-mix(in srgb, var(--ntk-text-muted) 85%, var(--ntk-bg-secondary));
  --gray-300: var(--ntk-border-dark);
  --gray-200: var(--ntk-border-color);
  --gray-100: var(--ntk-bg-secondary);
  --gray-50: var(--ntk-bg-tertiary);
  --white: var(--ntk-text-on-primary);
  
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
  --code-keyword: color-mix(in srgb, var(--ntk-purple-light) 70%, var(--white));
  --code-string: color-mix(in srgb, var(--success) 85%, var(--white));
  --code-component: color-mix(in srgb, var(--info) 85%, var(--white));
  --code-prop: color-mix(in srgb, var(--warning) 85%, var(--white));
  --code-comment: color-mix(in srgb, var(--gray-500) 85%, var(--gray-800));
  
  /* Motion */
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 220ms var(--easing-standard);
  --transition-normal: 350ms var(--easing-standard);
  --transition-slow: 500ms var(--easing-standard);
  --reveal-distance: 40px;
  --reveal-duration: 700ms;
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
  background: var(--white);
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
  transform: translate3d(0, var(--reveal-distance), 0);
  transition:
    opacity var(--reveal-duration) var(--easing-standard),
    transform var(--reveal-duration) var(--easing-standard);
  transition-delay: var(--animate-delay, 0ms);
  will-change: opacity, transform;
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
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--gray-900);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav a {
  color: var(--gray-700);
  font-weight: 500;
  font-size: 0.875rem;
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
  font-weight: 600;
  font-size: 0.8125rem;
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
  background: linear-gradient(135deg, var(--gray-100) 0%, var(--white) 50%, var(--overlay-accent-05) 100%);
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
  font-size: 0.75rem;
  font-weight: 600;
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
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: var(--gray-900);
}

.hero h1 span {
  background: linear-gradient(135deg, var(--ntk-purple) 0%, var(--royal-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.25rem;
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
}

.hero-visual img {
  width: 120%;
  max-width: 700px;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 4s ease-in-out infinite;
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
  font-size: 2rem;
  font-weight: 800;
  color: var(--ntk-purple);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray-500);
  font-weight: 500;
}

/* Features */
.features {
  padding: var(--spacing-3xl) 0;
  background: var(--white);
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto var(--spacing-3xl);
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.section-header p {
  font-size: 1.125rem;
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
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--gray-900);
}

.feature-card p {
  font-size: 0.9375rem;
  color: var(--gray-600);
  line-height: 1.6;
}

/* Components Showcase - ALWAYS dark background with white text */
.showcase {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-900) !important;
  color: var(--white) !important;
}

.showcase h2,
.showcase .section-header h2 {
  color: var(--white) !important;
}

.showcase .section-header p {
  color: var(--gray-300) !important;
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
  color: var(--gray-300);
  border: 1px solid var(--gray-700);
  border-radius: 8px;
  font-weight: 500;
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
  transition: all var(--transition-fast);
}

.component-item:hover {
  background: var(--gray-100);
  border-color: var(--ntk-purple);
}

.component-item code {
  font-size: 0.875rem;
  color: var(--ntk-purple);
}

.component-item p {
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-top: var(--spacing-xs);
}

/* Code Example */
.code-section {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-100);
}

.code-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.code-block {
  background: var(--gray-900);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.2s;
}

.code-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--overlay-ink-30);
  border-bottom: 1px solid var(--overlay-white-10);
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
  padding: var(--spacing-lg);
  overflow-x: auto;
}

.code-content pre {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--gray-300);
}

.code-content .keyword { color: var(--code-keyword); }
.code-content .string { color: var(--code-string); }
.code-content .component { color: var(--code-component); }
.code-content .prop { color: var(--code-prop); }
.code-content .comment { color: var(--code-comment); }

/* Form Components Visual Section */
.form-visual-section {
  padding: var(--spacing-3xl) 0;
  background: var(--white);
}

.form-visual-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.form-visual-image img {
  width: 100%;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.3s;
}

.form-visual-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.form-visual-content p {
  font-size: 1.125rem;
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
  background: var(--gray-100);
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
}

.composables-visual-image img {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.6s;
}

.composables-visual-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.composables-visual-content p {
  font-size: 1.125rem;
  color: var(--gray-500);
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
}

.composable-item .composable-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: var(--spacing-xs);
}

.composable-icon {
  font-size: 1.25rem;
}

.composable-item code {
  color: var(--ntk-purple);
  font-weight: 600;
}

.composable-item p {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin: 0;
}

/* Theme Section */
.themes {
  padding: var(--spacing-3xl) 0;
  background: var(--white);
}

.theme-preview-image {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.theme-preview-image img {
  width: 100%;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 4s ease-in-out infinite;
  animation-delay: 0.9s;
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
  background: linear-gradient(135deg, var(--ntk-purple) 0%, var(--ntk-purple-light) 100%);
}

.theme-preview.monochrome-theme {
  background: linear-gradient(135deg, var(--gray-700) 0%, var(--gray-500) 100%);
}

.theme-preview img {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  box-shadow: var(--shadow-emphasis);
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
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--gray-900);
}

.theme-info p {
  font-size: 0.875rem;
  color: var(--gray-500);
}

/* Dashboard Preview */
.dashboard-preview {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-50);
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
}

.metric-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-purple-light);
  border-radius: 12px;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--gray-500);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}

.metric-trend {
  font-size: 0.875rem;
  font-weight: 600;
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
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.chart-title {
  font-weight: 700;
  color: var(--gray-900);
}

.chart-period {
  font-size: 0.875rem;
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
  font-size: 0.75rem;
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
  background: var(--gray-900);
  color: var(--white);
}

.installation .section-header h2 {
  color: var(--white) !important;
}

.installation .section-header p {
  color: var(--gray-300) !important;
}

.install-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.install-step {
  text-align: center;
  background: var(--overlay-panel-80);
  border: 1px solid var(--overlay-white-10);
  border-radius: 12px;
  padding: var(--spacing-xl);
}

.step-number {
  width: 48px;
  height: 48px;
  background: var(--ntk-purple);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  margin: 0 auto var(--spacing-lg);
}

.install-step h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--white) !important;
}

.install-step code {
  display: block;
  padding: var(--spacing-md);
  background: var(--overlay-panel-90);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--ntk-purple-light);
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
  font-size: 0.75rem;
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
  background: var(--gray-900);
  color: var(--gray-100);
}

body.dark-mode .header {
  background: color-mix(in srgb, var(--gray-900) 95%, transparent);
  border-bottom-color: var(--overlay-white-10);
}

body.dark-mode .logo-text {
  color: var(--white);
}

body.dark-mode .nav a {
  color: var(--gray-300);
}

body.dark-mode .nav a:hover {
  color: var(--ntk-purple-light);
}

body.dark-mode .hero {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--ntk-footer-bg) 50%, var(--overlay-accent-15) 100%);
}

body.dark-mode .hero h1 {
  color: var(--white);
}

body.dark-mode .hero p {
  color: var(--gray-400);
}

body.dark-mode .btn-secondary {
  border-color: var(--overlay-white-20);
  color: var(--gray-300);
}

body.dark-mode .btn-secondary:hover {
  background: var(--overlay-white-10);
  color: var(--white);
}

body.dark-mode .stat-number {
  color: var(--ntk-purple-light);
}

body.dark-mode .stat-label {
  color: var(--gray-400);
}

body.dark-mode section:not(.dark-section) {
  background: var(--gray-900);
}

body.dark-mode .section-header h2 {
  color: var(--white);
}

body.dark-mode .section-header p {
  color: var(--gray-400);
}

/* Feature cards - same style in both themes - FORCE colors */
body.dark-mode .feature-card {
  background: var(--white) !important;
  border-color: var(--gray-200) !important;
}

body.dark-mode .feature-card h3 {
  color: var(--gray-900) !important;
}

body.dark-mode .feature-card p {
  color: var(--gray-600) !important;
}

body.dark-mode .code-content {
  background: color-mix(in srgb, var(--gray-900) 85%, var(--gray-800));
}

/* Theme cards - keep white bottom in both themes */
body.dark-mode .theme-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
}

body.dark-mode .theme-info {
  background: var(--white);
}

body.dark-mode .theme-card h3,
body.dark-mode .theme-info h3 {
  color: var(--gray-900) !important;
}

body.dark-mode .theme-card p,
body.dark-mode .theme-info p {
  color: var(--gray-600) !important;
}

/* Dark mode: form-visual-section */
body.dark-mode .form-visual-section {
  background: var(--gray-900);
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

/* Dark mode: composables-visual-section */
body.dark-mode .composables-visual-section {
  background: var(--gray-900);
}

body.dark-mode .composables-visual-content h2 {
  color: var(--white);
}

body.dark-mode .composables-visual-content p {
  color: var(--gray-400);
}

/* Composable items - same style in both themes - FORCE colors */
body.dark-mode .composable-item {
  background: var(--white) !important;
  border-color: var(--gray-200) !important;
}

body.dark-mode .composable-item code {
  color: var(--ntk-purple) !important;
}

body.dark-mode .composable-item p {
  color: var(--gray-600) !important;
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
  color: var(--gray-300);
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
  color: var(--gray-300);
}

.footer h4 {
  color: var(--white) !important;
}

.footer .footer-logo {
  color: var(--white);
}

.footer-column a:hover {
  color: var(--white);
}

/* Footer */
.footer {
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  background: var(--gray-900);
  border-top: 1px solid var(--overlay-white-10);
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
  font-weight: 700;
  font-size: 1.125rem;
}

.footer-logo img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.footer-description {
  color: var(--gray-400);
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 300px;
}

.footer-social {
  display: flex;
  gap: var(--spacing-md);
}

.footer-social a {
  color: var(--gray-400);
  transition: color var(--transition-fast);
}

.footer-social a:hover {
  color: var(--ntk-purple-light);
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
  font-weight: 600;
  font-size: 0.875rem;
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
  color: var(--gray-400);
  font-size: 0.875rem;
  line-height: 1.35;
  transition: color var(--transition-fast);
  margin: 0;
  padding: 0;
}

.footer-column a:hover {
  color: var(--ntk-purple-light);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--overlay-white-10);
}

.footer-bottom p {
  color: var(--gray-500);
  font-size: 0.875rem;
}

.footer-bottom a {
  color: var(--ntk-purple-light);
}

.footer-bottom a:hover {
  color: var(--white);
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
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
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
    font-size: 1.75rem;
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
    font-size: 1.75rem;
  }
  
  .composables-list {
    grid-template-columns: 1fr;
  }
  
  .code-block {
    overflow-x: auto;
  }
  
  .code-content pre {
    font-size: 0.75rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .theme-section h2 {
    font-size: 1.75rem;
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
    font-size: 1.75rem;
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
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .form-visual-content h2,
  .composables-visual-content h2,
  .theme-section h2 {
    font-size: 1.5rem;
  }
  
  .install-step-content code {
    font-size: 0.7rem;
    word-break: break-all;
  }
  
  .install-step {
    padding: var(--spacing-md);
  }
  
  .install-step code {
    font-size: 0.65rem;
    padding: var(--spacing-sm);
  }
  
  .install-step h3 {
    font-size: 1rem;
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
  font-size: 0.875rem;
  font-weight: 500;
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
  font-weight: 500;
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
  background: var(--ntk-purple);
  color: var(--white) !important;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow: var(--shadow-medium);
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.cms-mode-btn:hover {
  background: var(--ntk-purple-dark);
  color: var(--white) !important;
  transform: translateY(-1px);
}

</style>