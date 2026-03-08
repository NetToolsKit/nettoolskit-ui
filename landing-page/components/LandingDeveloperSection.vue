<template>
  <div>
    <section class="code-section">
      <div class="container">
        <div class="code-container">
          <div>
            <div class="section-header landing-dev__section-header">
              <h2>{{ t('developer.title') }}</h2>
              <p>{{ t('developer.subtitle') }}</p>
            </div>
            <ul class="landing-dev__list">
              <li v-for="item in checklistItems" :key="item" class="landing-dev__item">
                <span class="landing-dev__check">✓</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <div class="code-block">
            <div class="code-header">
              <span class="code-dot red" />
              <span class="code-dot yellow" />
              <span class="code-dot green" />
            </div>
            <div class="code-content">
              <pre><span class="comment">// Import components</span>
<span class="keyword">import</span> {
  <span class="component">BaseInput</span>,
  <span class="component">BaseSelect</span>,
  <span class="component">MetricCard</span>
} <span class="keyword">from</span> <span class="string">'@nettoolskit/ui-vue'</span>

<span class="comment">// Import composables</span>
<span class="keyword">import</span> {
  <span class="component">useTheme</span>,
  <span class="component">useNotification</span>
} <span class="keyword">from</span> <span class="string">'@nettoolskit/ui-vue'</span>

<span class="comment">// Use in your component</span>
<span class="keyword">const</span> { currentTheme, setTheme } = <span class="component">useTheme</span>()
<span class="keyword">const</span> { notify } = <span class="component">useNotification</span>()

<span class="component">setTheme</span>(<span class="string">'dark'</span>)
<span class="component">notify</span>(<span class="string">'Theme changed!'</span>, <span class="string">'success'</span>)</pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="form-visual-section">
      <div class="container">
        <div class="form-visual-container">
          <div class="form-visual-image">
            <picture>
              <source srcset="../assets/form-components.webp" type="image/webp">
              <img
                src="../assets/form-components.png"
                :alt="t('developer.formVisualAlt')"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              >
            </picture>
          </div>
          <div class="form-visual-content">
            <h2>{{ t('developer.formToolkitTitle') }}</h2>
            <p>{{ t('developer.formToolkitSubtitle') }}</p>
            <div class="form-features">
              <div v-for="feature in formFeatureItems" :key="feature" class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="composables-visual-section">
      <div class="container">
        <div class="composables-visual-container">
          <div class="composables-visual-content">
            <h2>{{ t('developer.composablesTitle') }}</h2>
            <p>{{ t('developer.composablesSubtitle') }}</p>
            <div class="composables-list">
              <div v-for="item in composableItems" :key="item.code" class="composable-item">
                <div class="composable-header"><span class="composable-icon">{{ item.icon }}</span><code>{{ item.code }}</code></div>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
          <div class="composables-visual-image">
            <picture>
              <source srcset="../assets/composables-visual.webp" type="image/webp">
              <img
                src="../assets/composables-visual.png"
                :alt="t('developer.composablesVisualAlt')"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              >
            </picture>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Developer Section module.
 */
import { computed } from 'vue'
import { useLandingI18n } from '../composables/useLandingI18n'

const { t } = useLandingI18n()

const checklistItems = computed(() => [
  t('developer.bullet1'),
  t('developer.bullet2'),
  t('developer.bullet3'),
  t('developer.bullet4'),
])

const formFeatureItems = computed(() => [
  t('developer.formFeature1'),
  t('developer.formFeature2'),
  t('developer.formFeature3'),
  t('developer.formFeature4'),
])

const composableItems = computed(() => [
  { icon: '🎨', code: 'useTheme', description: t('developer.useTheme') },
  { icon: '🔔', code: 'useNotification', description: t('developer.useNotification') },
  { icon: '💬', code: 'useDialog', description: t('developer.useDialog') },
  { icon: '✅', code: 'useFormRules', description: t('developer.useFormRules') },
  { icon: '⏱️', code: 'useDebounce', description: t('developer.useDebounce') },
  { icon: '⚡', code: 'useAsync', description: t('developer.useAsync') },
])
</script>

<style scoped>
.landing-dev__section-header {
  text-align: left;
  margin-bottom: var(--spacing-xl);
}

.landing-dev__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.landing-dev__item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.landing-dev__item > span:last-child {
  color: var(--gray-300);
}

.landing-dev__check {
  color: var(--code-string);
  font-weight: var(--ntk-font-weight-bold);
}
</style>