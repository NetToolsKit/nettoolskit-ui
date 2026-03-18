<template>
  <NtkHero
    class="landing-hero hero"
    variant="default"
    layout="split"
    size="lg"
    :badge="t('hero.badge')"
  >
    <template #title>
      {{ t('hero.titlePrefix') }}
      <span class="landing-hero__highlight">{{ t('hero.titleHighlight') }}</span>
    </template>

    <template #subtitle>
      {{ t('hero.description') }}
    </template>

    <template #actions>
      <div class="hero-actions">
        <a href="#installation" class="btn btn-primary">{{ t('hero.primaryCta') }}</a>
        <a
          href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue"
          class="btn btn-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('hero.secondaryCta') }}
        </a>
      </div>
    </template>

    <template #extra>
      <div class="stats">
        <div class="stat">
          <div class="stat-value">22+</div>
          <div class="stat-label">{{ t('hero.stats.components') }}</div>
        </div>
        <div class="stat">
          <div class="stat-value">11</div>
          <div class="stat-label">{{ t('hero.stats.composables') }}</div>
        </div>
        <div class="stat">
          <div class="stat-value">3</div>
          <div class="stat-label">{{ t('hero.stats.themes') }}</div>
        </div>
      </div>
    </template>

    <template #media>
      <div class="hero-visual">
        <picture>
          <source srcset="../assets/hero-visual.webp" type="image/webp">
          <img
            src="../assets/hero-visual.png"
            :alt="t('hero.visualAlt')"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          >
        </picture>
      </div>
    </template>
  </NtkHero>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Hero Section module.
 */
import NtkHero from '../../src/components/layout/NtkHero.vue'
import { useLandingI18n } from '../composables/useLandingI18n'

const { t } = useLandingI18n()
</script>

<style lang="scss">
.landing-hero {
  position: relative;
  overflow: hidden;
  padding: 160px 0 100px;
  background: linear-gradient(
    135deg,
    var(--landing-section-bg-secondary) 0%,
    color-mix(in srgb, var(--landing-section-bg-secondary) 72%, var(--landing-section-bg-primary)) 52%,
    var(--overlay-accent-05) 100%
  );
}

.landing-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, var(--overlay-accent-08) 0%, transparent 70%);
  border-radius: 50%;
}

.landing-hero .ntk-hero__container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.landing-hero .ntk-hero__content {
  position: relative;
  z-index: 1;
  gap: 0;
}

.landing-hero .ntk-hero__badge {
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
}

.landing-hero .ntk-hero__badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 35%, transparent);
  animation: ntk-pulse-dot 2s ease-in-out infinite;
}

.landing-hero .ntk-hero__title {
  font-size: clamp(3.2rem, 5vw, 3.6rem);
  font-weight: var(--ntk-font-weight-bold);
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: var(--gray-900);
}

.landing-hero__highlight {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.landing-hero .ntk-hero__subtitle {
  font-size: var(--landing-font-size-xl-plus);
  color: var(--gray-500);
  margin-bottom: var(--spacing-xl);
  max-width: 500px;
}

.landing-hero .hero-actions {
  display: flex;
  gap: var(--spacing-md);
}

.landing-hero .stats {
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
}

.landing-hero .stat-value {
  font-size: var(--landing-font-size-display-xl);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--gray-900);
  line-height: 1;
}

.landing-hero .stat-label {
  font-size: var(--ntk-font-size-sm);
  color: var(--gray-500);
  margin-top: 0.35rem;
}

.landing-hero .hero-visual {
  position: relative;
  z-index: 1;
  animation: ntk-float 4s ease-in-out infinite;
}

.landing-hero .hero-visual picture {
  display: block;
  border-radius: 16px;
  overflow: hidden;
}

.landing-hero .hero-visual img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: var(--shadow-emphasis);
}

.landing-hero .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-weight: var(--ntk-font-weight-semibold);
  font-size: var(--landing-font-size-sm-tight);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
}

.landing-hero .btn-primary {
  background: var(--ntk-purple);
  color: var(--white) !important;
}

.landing-hero .btn-primary:hover {
  background: var(--ntk-purple-dark);
  color: var(--white) !important;
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.landing-hero .btn-secondary {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.landing-hero .btn-secondary:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

body.dark-mode .landing-hero {
  background: linear-gradient(
    135deg,
    var(--landing-section-bg-secondary) 0%,
    color-mix(in srgb, var(--landing-section-bg-secondary) 72%, var(--landing-section-bg-primary)) 52%,
    var(--landing-section-bg-primary) 100%
  );
}

body.dark-mode .landing-hero .ntk-hero__title {
  color: var(--white);
}

body.dark-mode .landing-hero__highlight {
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

body.dark-mode .landing-hero .ntk-hero__subtitle {
  color: var(--gh-fg-muted);
}

body.dark-mode .landing-hero .btn-secondary {
  border-color: var(--gh-border-default);
  color: var(--gh-fg-default);
}

body.dark-mode .landing-hero .btn-secondary:hover {
  background: var(--gh-bg-muted);
  color: var(--gh-fg-default);
}

body.dark-mode .landing-hero .btn-primary {
  background: var(--gh-bg-muted);
  border: 1px solid var(--gh-border-default);
  color: var(--gh-fg-default) !important;
  box-shadow: none;
}

body.dark-mode .landing-hero .btn-primary:hover {
  background: var(--gh-border-default);
  border-color: var(--gh-fg-subtle);
  color: var(--gh-fg-default) !important;
  box-shadow: none;
}

body.dark-mode .landing-hero .stat-value {
  color: var(--gh-accent);
}

body.dark-mode .landing-hero .stat-label {
  color: var(--gh-fg-muted);
}

@media (max-width: 1024px) {
  .landing-hero .ntk-hero__container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .landing-hero .ntk-hero__subtitle {
    margin: 0 auto var(--spacing-xl);
  }

  .landing-hero .hero-actions,
  .landing-hero .stats {
    justify-content: center;
  }

  .landing-hero .hero-visual {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .landing-hero .ntk-hero__title {
    font-size: var(--landing-font-size-display-3xl);
  }

  .landing-hero .ntk-hero__subtitle {
    font-size: var(--landing-font-size-md-plus);
  }
}

@media (max-width: 480px) {
  .landing-hero {
    padding: 120px 0 60px;
  }

  .landing-hero .ntk-hero__title {
    font-size: var(--landing-font-size-display-2xl);
  }

  .landing-hero .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .landing-hero .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .landing-hero .stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-lg);
  }

  .landing-hero .stat {
    text-align: center;
    min-width: 80px;
  }

  .landing-hero .stat-value {
    font-size: var(--landing-font-size-display-sm);
  }

  .landing-hero .stat-label {
    font-size: var(--ntk-font-size-xs);
  }
}
</style>