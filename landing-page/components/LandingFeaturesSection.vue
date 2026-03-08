<template>
  <section id="features" class="features">
    <div class="container">
      <div class="section-header">
        <h2>{{ t('features.title') }}</h2>
        <p>{{ t('features.subtitle') }}</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3>{{ t('features.themeSystemTitle') }}</h3>
          <p>{{ t('features.themeSystemBody') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <h3>{{ t('features.formTitle') }}</h3>
          <p>{{ t('features.formBody') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
          </div>
          <h3>{{ t('features.layoutTitle') }}</h3>
          <p>{{ t('features.layoutBody') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3>{{ t('features.composablesTitle') }}</h3>
          <p>{{ t('features.composablesBody') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3>{{ t('features.accessibilityTitle') }}</h3>
          <p>{{ t('features.accessibilityBody') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h3>{{ t('features.tokensTitle') }}</h3>
          <p>{{ t('features.tokensBody') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Features Section module.
 */
import { useLandingI18n } from '../composables/useLandingI18n'

const { t } = useLandingI18n()
</script>