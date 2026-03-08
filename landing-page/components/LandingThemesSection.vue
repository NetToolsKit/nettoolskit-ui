<template>
  <section id="themes" class="themes">
    <div class="container">
      <div class="section-header">
        <h2>{{ t('themes.title') }}</h2>
        <p>{{ t('themes.subtitle') }}</p>
      </div>

      <div class="theme-preview-image">
        <picture>
          <source srcset="../assets/theme-preview.webp" type="image/webp">
          <img
            src="../assets/theme-preview.png"
            :alt="t('themes.previewAlt')"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          >
        </picture>
      </div>

      <div class="theme-grid">
        <div class="theme-card">
          <div class="theme-preview dark-theme">
            <picture>
              <source srcset="../assets/nuget-icon.webp" type="image/webp">
              <img
                src="../assets/nuget-icon.png"
                :alt="t('themes.darkAlt')"
                style="width: 64px; height: 64px;"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </div>
          <div class="theme-info">
            <h3>{{ t('themes.darkTitle') }}</h3>
            <p>{{ t('themes.darkBody') }}</p>
          </div>
        </div>
        <div class="theme-card">
          <div class="theme-preview purple-theme">
            <picture>
              <source srcset="../assets/positive-icon.webp" type="image/webp">
              <img
                src="../assets/positive-icon.png"
                :alt="t('themes.lightAlt')"
                style="width: 64px; height: 64px;"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </div>
          <div class="theme-info">
            <h3>{{ t('themes.lightTitle') }}</h3>
            <p>{{ t('themes.lightBody') }}</p>
          </div>
        </div>
        <div class="theme-card">
          <div class="theme-preview monochrome-theme">
            <picture>
              <source srcset="../assets/monochrome-icon.webp" type="image/webp">
              <img
                src="../assets/monochrome-icon.png"
                :alt="t('themes.monochromeAlt')"
                style="width: 64px; height: 64px;"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </div>
          <div class="theme-info">
            <h3>{{ t('themes.monochromeTitle') }}</h3>
            <p>{{ t('themes.monochromeBody') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Themes Section module.
 */
import { useLandingI18n } from '../composables/useLandingI18n'

const { t } = useLandingI18n()
</script>