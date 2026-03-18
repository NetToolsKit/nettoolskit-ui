<template>
  <NtkSection id="features" class="features" variant="default" size="lg">
    <template #header>
      <NtkSectionHeader
        :title="t('features.title')"
        :subtitle="t('features.subtitle')"
        spacing="lg"
      />
    </template>

    <div class="features-grid">
      <NtkFeatureCard
        v-for="feature in features"
        :key="feature.title"
        :title="feature.title"
        :description="feature.description"
        variant="elevated"
        icon-style="square"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-for="(path, index) in feature.paths ?? []" :key="`${feature.title}-${index}`" :d="path" />
            <rect
              v-for="(rect, index) in feature.rects ?? []"
              :key="`${feature.title}-rect-${index}`"
              v-bind="rect"
            />
          </svg>
        </template>
      </NtkFeatureCard>
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Features Section module.
 */
import { computed } from 'vue'
import NtkSection from '../../src/components/layout/NtkSection.vue'
import NtkFeatureCard from '../../src/components/ui/NtkFeatureCard.vue'
import NtkSectionHeader from '../../src/components/ui/NtkSectionHeader.vue'
import { useLandingI18n } from '../composables/useLandingI18n'

interface FeatureRect {
  x: string
  y: string
  width: string
  height: string
  rx?: string
}

interface FeatureItem {
  title: string
  description: string
  paths?: string[]
  rects?: FeatureRect[]
}

const { t } = useLandingI18n()

const features = computed<FeatureItem[]>(() => ([
  {
    title: t('features.themeSystemTitle'),
    description: t('features.themeSystemBody'),
    paths: ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  },
  {
    title: t('features.formTitle'),
    description: t('features.formBody'),
    rects: [{ x: '3', y: '3', width: '18', height: '18', rx: '2' }],
    paths: ['M3 9h18', 'M9 21V9'],
  },
  {
    title: t('features.layoutTitle'),
    description: t('features.layoutBody'),
    paths: ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'],
  },
  {
    title: t('features.composablesTitle'),
    description: t('features.composablesBody'),
    paths: ['M12 2a10 10 0 100 20 10 10 0 000-20z', 'M12 6v6l4 2'],
  },
  {
    title: t('features.accessibilityTitle'),
    description: t('features.accessibilityBody'),
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  },
  {
    title: t('features.tokensTitle'),
    description: t('features.tokensBody'),
    rects: [{ x: '2', y: '4', width: '20', height: '16', rx: '2' }],
    paths: ['M22 6 12 13 2 6'],
  },
]))
</script>