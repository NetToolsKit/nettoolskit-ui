<template>
  <NtkSection id="components" class="showcase" variant="light" size="lg">
    <template #header>
      <NtkSectionHeader
        :title="t('showcase.title')"
        :subtitle="t('showcase.subtitle')"
        spacing="lg"
      />
    </template>

    <div class="component-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="$emit('update:active-tab', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-for="tab in tabs"
      v-show="activeTab === tab.id"
      :key="`grid-${tab.id}`"
      class="component-grid"
    >
      <div v-for="item in showcaseItems[tab.id] ?? []" :key="`${tab.id}-${item.name}`" class="component-item">
        <code>{{ item.name }}</code>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Showcase Section module.
 */
import { computed } from 'vue'
import NtkSection from '../../src/components/layout/NtkSection.vue'
import NtkSectionHeader from '../../src/components/ui/NtkSectionHeader.vue'
import { useLandingI18n } from '../composables/useLandingI18n'

interface TabItem {
  id: string
  label: string
}

interface ShowcaseItem {
  name: string
  description: string
}

defineProps<{
  tabs: TabItem[]
  activeTab: string
}>()

defineEmits<{
  (e: 'update:active-tab', value: string): void
}>()

const { t } = useLandingI18n()

const showcaseItems = computed<Record<string, ShowcaseItem[]>>(() => ({
  form: [
    { name: 'BaseInput', description: t('showcase.items.baseInput') },
    { name: 'BaseSelect', description: t('showcase.items.baseSelect') },
    { name: 'BaseMultiSelect', description: t('showcase.items.baseMultiSelect') },
    { name: 'BaseTextarea', description: t('showcase.items.baseTextarea') },
    { name: 'BaseDatePicker', description: t('showcase.items.baseDatePicker') },
    { name: 'BaseTimePicker', description: t('showcase.items.baseTimePicker') },
  ],
  layout: [
    { name: 'BaseHeader', description: t('showcase.items.baseHeader') },
    { name: 'BaseSidebar', description: t('showcase.items.baseSidebar') },
    { name: 'BaseFooter', description: t('showcase.items.baseFooter') },
    { name: 'BaseHero', description: t('showcase.items.baseHero') },
    { name: 'BaseSection', description: t('showcase.items.baseSection') },
  ],
  ui: [
    { name: 'BaseCard', description: t('showcase.items.baseCard') },
    { name: 'BaseButton', description: t('showcase.items.baseButton') },
    { name: 'BaseChip', description: t('showcase.items.baseChip') },
    { name: 'BaseLogo', description: t('showcase.items.baseLogo') },
    { name: 'MetricCard', description: t('showcase.items.metricCard') },
    { name: 'InfoCard', description: t('showcase.items.infoCard') },
    { name: 'BaseFeatureCard', description: t('showcase.items.baseFeatureCard') },
    { name: 'BasePricingCard', description: t('showcase.items.basePricingCard') },
    { name: 'BaseCreditCard', description: t('showcase.items.baseCreditCard') },
    { name: 'BaseSteps', description: t('showcase.items.baseSteps') },
    { name: 'SectionHeader', description: t('showcase.items.sectionHeader') },
  ],
  composables: [
    { name: 'useTheme', description: t('showcase.items.useTheme') },
    { name: 'useNotification', description: t('showcase.items.useNotification') },
    { name: 'useDialog', description: t('showcase.items.useDialog') },
    { name: 'useFormRules', description: t('showcase.items.useFormRules') },
    { name: 'useResponsive', description: t('showcase.items.useResponsive') },
    { name: 'useDebounce', description: t('showcase.items.useDebounce') },
    { name: 'useAsync', description: t('showcase.items.useAsync') },
    { name: 'useFilters', description: t('showcase.items.useFilters') },
    { name: 'useTableColumns', description: t('showcase.items.useTableColumns') },
    { name: 'useBaseField', description: t('showcase.items.useBaseField') },
    { name: 'useDialogActions', description: t('showcase.items.useDialogActions') },
  ],
}))
</script>