<template>
  <NtkSection
    id="features"
    :variant="variant"
    :size="size"
    :centered="true"
  >
    <template #header>
      <NtkSectionHeader
        :title="title"
        :subtitle="subtitle"
        spacing="lg"
      />
    </template>

    <div class="cms-features-grid">
      <NtkFeatureCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        :variant="item.variant ?? cardVariant"
        :icon-style="item.iconStyle ?? iconStyle"
      />
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
/**
 * Src/modules/cms/blocks/landing/Cms Landing Features Block module.
 */

import NtkSection from '../../../../components/layout/NtkSection.vue'
import NtkSectionHeader from '../../../../components/ui/NtkSectionHeader.vue'
import NtkFeatureCard from '../../../../components/ui/NtkFeatureCard.vue'

interface FeatureItem {
  id: string
  icon?: string
  title: string
  description: string
  variant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top'
  iconStyle?: 'default' | 'circle' | 'square' | 'gradient'
}

interface Props {
  title: string
  subtitle?: string
  items: FeatureItem[]
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  cardVariant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top'
  iconStyle?: 'default' | 'circle' | 'square' | 'gradient'
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  variant: 'default',
  size: 'lg',
  cardVariant: 'elevated',
  iconStyle: 'gradient',
})
</script>

<style scoped>
.cms-features-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .cms-features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .cms-features-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>