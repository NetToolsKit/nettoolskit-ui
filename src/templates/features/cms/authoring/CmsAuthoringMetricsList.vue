<template>
  <div class="cms-designer-card__metrics">
    <span
      v-for="item in items"
      :key="item.id"
    >
      {{ item.label }}: <strong>{{ item.value }}</strong>
    </span>
  </div>
</template>

<script setup lang="ts">
export interface CmsAuthoringMetricItem {
  id: string
  label: string
  value: number | string
}

withDefaults(defineProps<{
  items?: CmsAuthoringMetricItem[]
}>(), {
  items: () => [],
})
</script>