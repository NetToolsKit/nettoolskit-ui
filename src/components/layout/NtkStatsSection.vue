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

    <div
      class="ntk-stats-section__grid"
      :style="gridStyle"
    >
      <NtkStatCard
        v-for="item in items"
        :key="item.id"
        :value="item.value"
        :label="item.label"
        :icon="item.icon"
        :prefix="item.prefix"
        :suffix="item.suffix"
        :trend="item.trend"
        :variant="item.variant ?? cardVariant"
      />
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NtkSection from './NtkSection.vue'
import NtkSectionHeader from '../ui/NtkSectionHeader.vue'
import NtkStatCard from '../ui/NtkStatCard.vue'

interface StatsItemTrend {
  value: number
  direction: 'up' | 'down'
}

interface StatsItem {
  id: string
  value: number | string
  label: string
  icon?: string
  prefix?: string
  suffix?: string
  trend?: StatsItemTrend
  variant?: 'default' | 'outlined' | 'gradient' | 'minimal'
}

interface Props {
  sectionId?: string
  title: string
  subtitle?: string
  items: StatsItem[]
  columns?: number
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  cardVariant?: 'default' | 'outlined' | 'gradient' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
  sectionId: 'stats',
  subtitle: '',
  columns: 4,
  variant: 'light',
  size: 'md',
  cardVariant: 'default',
})

const gridStyle = computed(() => {
  const safeColumns = Math.max(1, props.columns)
  return {
    '--ntk-stats-columns': `${safeColumns}`,
  }
})
</script>

<style scoped>
.ntk-stats-section__grid {
  display: grid;
  grid-template-columns: repeat(var(--ntk-stats-columns), minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .ntk-stats-section__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .ntk-stats-section__grid {
    grid-template-columns: 1fr;
  }
}
</style>