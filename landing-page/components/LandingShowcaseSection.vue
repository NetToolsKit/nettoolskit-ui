<template>
  <section id="components" class="showcase">
    <div class="container">
      <div class="section-header">
        <h2>Component Library</h2>
        <p>22+ production-ready components organized by category.</p>
      </div>

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
    </div>
  </section>
</template>

<script setup lang="ts">
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

const showcaseItems: Record<string, ShowcaseItem[]> = {
  form: [
    { name: 'BaseInput', description: 'Text input with validation' },
    { name: 'BaseSelect', description: 'Single select dropdown' },
    { name: 'BaseMultiSelect', description: 'Multi-select with chips' },
    { name: 'BaseTextarea', description: 'Multiline text input' },
    { name: 'BaseDatePicker', description: 'Date selection' },
    { name: 'BaseTimePicker', description: 'Time selection' },
  ],
  layout: [
    { name: 'BaseHeader', description: 'Application header' },
    { name: 'BaseSidebar', description: 'Navigation sidebar' },
    { name: 'BaseFooter', description: 'Application footer' },
    { name: 'BaseHero', description: 'Landing page hero section' },
    { name: 'BaseSection', description: 'Content section wrapper' },
  ],
  ui: [
    { name: 'BaseCard', description: 'Content container' },
    { name: 'BaseButton', description: 'Action button' },
    { name: 'BaseChip', description: 'Tag/label chip' },
    { name: 'BaseLogo', description: 'Brand logo display' },
    { name: 'MetricCard', description: 'Dashboard metrics' },
    { name: 'InfoCard', description: 'Information display' },
    { name: 'BaseFeatureCard', description: 'Feature showcase' },
    { name: 'BasePricingCard', description: 'Pricing plans' },
    { name: 'BaseCreditCard', description: 'Payment card display' },
    { name: 'BaseSteps', description: 'Step indicator' },
    { name: 'SectionHeader', description: 'Section title' },
  ],
  composables: [
    { name: 'useTheme', description: 'Theme management' },
    { name: 'useNotification', description: 'Toast notifications' },
    { name: 'useDialog', description: 'Modal state management' },
    { name: 'useFormRules', description: 'Form validation rules' },
    { name: 'useResponsive', description: 'Breakpoint detection' },
    { name: 'useDebounce', description: 'Debounced values' },
    { name: 'useAsync', description: 'Async operation handling' },
    { name: 'useFilters', description: 'Data filtering' },
    { name: 'useTableColumns', description: 'Table column config' },
    { name: 'useBaseField', description: 'Form field base' },
    { name: 'useDialogActions', description: 'Dialog action handlers' },
  ],
}
</script>