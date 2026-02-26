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

    <div class="ntk-tech-stack__grid">
      <article
        v-for="category in categories"
        :key="category.id"
        class="ntk-tech-stack__card"
      >
        <header class="ntk-tech-stack__card-header">
          <h3>{{ category.label }}</h3>
          <small>{{ category.items.length }} itens</small>
        </header>

        <div class="ntk-tech-stack__chips">
          <q-chip
            v-for="item in category.items"
            :key="`${category.id}-${item}`"
            class="ntk-tech-stack__chip"
            dense
            outline
            color="primary"
            text-color="primary"
          >
            {{ item }}
          </q-chip>
        </div>
      </article>
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
import NtkSection from './NtkSection.vue'
import NtkSectionHeader from '../ui/NtkSectionHeader.vue'

interface StackCategory {
  id: string
  label: string
  items: string[]
}

interface Props {
  sectionId?: string
  title: string
  subtitle?: string
  categories: StackCategory[]
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), {
  sectionId: 'stack',
  subtitle: '',
  variant: 'light',
  size: 'md',
})
</script>

<style scoped>
.ntk-tech-stack__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-lg);
}

.ntk-tech-stack__card {
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg, 12px);
  background: var(--ntk-bg-card);
  padding: var(--space-lg);
}

.ntk-tech-stack__card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.ntk-tech-stack__card-header h3 {
  margin: 0;
  font-size: var(--ntk-font-size-lg);
  color: var(--ntk-text-dark);
}

.ntk-tech-stack__card-header small {
  color: var(--ntk-text-light);
}

.ntk-tech-stack__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.ntk-tech-stack__chip {
  margin: 0;
}

@media (max-width: 900px) {
  .ntk-tech-stack__grid {
    grid-template-columns: 1fr;
  }
}
</style>