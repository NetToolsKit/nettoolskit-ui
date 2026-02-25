<template>
  <NtkSection
    :id="sectionId"
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

    <div class="ntk-service-grid__list" :style="gridStyle">
      <NtkFeatureCard
        v-for="(service, index) in services"
        :key="service.id"
        :title="service.title"
        :description="service.description"
        :icon="service.icon || formatOrder(index)"
        :variant="service.variant ?? cardVariant"
        :icon-style="service.iconStyle ?? iconStyle"
      />
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NtkSection from './NtkSection.vue'
import NtkSectionHeader from '../ui/NtkSectionHeader.vue'
import NtkFeatureCard from '../ui/NtkFeatureCard.vue'

interface ServiceItem {
  id: string
  title: string
  description: string
  icon?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top'
  iconStyle?: 'default' | 'circle' | 'square' | 'gradient'
}

interface Props {
  sectionId?: string
  title: string
  subtitle?: string
  services: ServiceItem[]
  columns?: number
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  cardVariant?: 'default' | 'outlined' | 'elevated' | 'accent-left' | 'accent-top'
  iconStyle?: 'default' | 'circle' | 'square' | 'gradient'
}

const props = withDefaults(defineProps<Props>(), {
  sectionId: 'services',
  subtitle: '',
  columns: 3,
  variant: 'default',
  size: 'lg',
  cardVariant: 'elevated',
  iconStyle: 'gradient',
})

const gridStyle = computed(() => {
  const safeColumns = Math.max(1, props.columns)
  return {
    '--ntk-services-columns': `${safeColumns}`,
  }
})

function formatOrder(index: number): string {
  return `${index + 1}`.padStart(2, '0')
}
</script>

<style scoped>
.ntk-service-grid__list {
  display: grid;
  grid-template-columns: repeat(var(--ntk-services-columns), minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 1200px) {
  .ntk-service-grid__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .ntk-service-grid__list {
    grid-template-columns: 1fr;
  }
}
</style>
