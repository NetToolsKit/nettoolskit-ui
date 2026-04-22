<template>
  <!-- Shared chart surface keeps "Orders by Status" and "Sales by Category" aligned to the reference. -->
  <ReferenceDashboardCharts
    :status-segments="statusSegments"
    :category-series="categorySeries"
  />
</template>

<script setup lang="ts">
import ReferenceDashboardCharts from '../../src/templates/pages/dashboard/ReferenceDashboardCharts.vue'

interface StatusSegment {
  id: string
  label: string
  value: number
  color: string
}

interface CategorySeriesItem {
  id: string
  label: string
  value: number
  color: string
}

defineProps<{
  statusSegments: StatusSegment[]
  categorySeries: CategorySeriesItem[]
}>()
</script>
