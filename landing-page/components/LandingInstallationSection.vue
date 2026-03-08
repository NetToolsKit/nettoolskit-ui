<template>
  <section id="installation" class="installation">
    <div class="container">
      <div class="section-header">
        <h2>{{ t('installation.title') }}</h2>
        <p>{{ t('installation.subtitle') }}</p>
      </div>
      <div class="install-steps">
        <div class="install-step">
          <div class="step-number">1</div>
          <h3>{{ t('installation.step1Title') }}</h3>
          <code>git submodule add https://github.com/ThiagoGuislotti/nettoolskit-ui-vue.git src/shared/ui</code>
        </div>
        <div class="install-step">
          <div class="step-number">2</div>
          <h3>{{ t('installation.step2Title') }}</h3>
          <code>@import '@/shared/ui/styles/tokens.scss';</code>
        </div>
        <div class="install-step">
          <div class="step-number">3</div>
          <h3>{{ t('installation.step3Title') }}</h3>
          <code>import { BaseInput } from '@/shared/ui';</code>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Installation Section module.
 */
import { useLandingI18n } from '../composables/useLandingI18n'

const { t } = useLandingI18n()
</script>