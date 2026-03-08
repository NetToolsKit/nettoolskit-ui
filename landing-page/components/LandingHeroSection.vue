<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span class="hero-badge" data-animate="fade-up">{{ t('hero.badge') }}</span>
        <h1 data-animate="fade-up">{{ t('hero.titlePrefix') }} <span>{{ t('hero.titleHighlight') }}</span></h1>
        <p data-animate="fade-up">
          {{ t('hero.description') }}
        </p>
        <div class="hero-actions" data-animate="fade-up">
          <a href="#installation" class="btn btn-primary">{{ t('hero.primaryCta') }}</a>
          <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" class="btn btn-secondary">{{ t('hero.secondaryCta') }}</a>
        </div>
        <div class="stats">
          <div class="stat" data-animate="fade-up">
            <div class="stat-value">22+</div>
            <div class="stat-label">{{ t('hero.stats.components') }}</div>
          </div>
          <div class="stat" data-animate="fade-up">
            <div class="stat-value">11</div>
            <div class="stat-label">{{ t('hero.stats.composables') }}</div>
          </div>
          <div class="stat" data-animate="fade-up">
            <div class="stat-value">3</div>
            <div class="stat-label">{{ t('hero.stats.themes') }}</div>
          </div>
        </div>
      </div>
      <div class="hero-visual" data-animate="fade-left">
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
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Hero Section module.
 */
import { useLandingI18n } from '../composables/useLandingI18n'

const { t } = useLandingI18n()
</script>