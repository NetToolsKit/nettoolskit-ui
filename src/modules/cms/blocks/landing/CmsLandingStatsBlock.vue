<template>
  <NtkSection
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

    <div class="cms-stats-grid">
      <NtkStatCard
        v-for="item in items"
        :key="item.id"
        :value="item.value"
        :label="item.label"
        :icon="item.icon"
        :suffix="item.suffix"
        :prefix="item.prefix"
        :variant="item.variant ?? cardVariant"
      />
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
import NtkSection from '../../../../components/layout/NtkSection.vue'
import NtkSectionHeader from '../../../../components/ui/NtkSectionHeader.vue'
import NtkStatCard from '../../../../components/ui/NtkStatCard.vue'

interface StatsItem {
  id: string
  value: number | string
  label: string
  icon?: string
  prefix?: string
  suffix?: string
  variant?: 'default' | 'outlined' | 'gradient' | 'minimal'
}

interface Props {
  title: string
  subtitle?: string
  items: StatsItem[]
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  cardVariant?: 'default' | 'outlined' | 'gradient' | 'minimal'
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  variant: 'light',
  size: 'md',
  cardVariant: 'default',
})
</script>

<style scoped>
.cms-stats-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .cms-stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .cms-stats-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
