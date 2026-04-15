<template>
  <!-- Shared chart surface keeps "Pedidos por Status" and "Vendas por Categoria" aligned to the reference. -->
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
