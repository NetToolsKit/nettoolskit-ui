<template>
  <div :class="gridClass">
    <article
      v-for="item in items"
      :key="item.id"
      :class="cardClass"
      v-bind="resolveCardAttrs(item)"
    >
      <div :class="headerClass">
        <div :class="copyClass">
          <strong>{{ item.title }}</strong>
          <small>{{ item.description }}</small>
        </div>

        <q-chip
          dense
          square
          :style="item.statusStyle"
        >
          {{ item.statusLabel }}
        </q-chip>
      </div>

      <div :class="metricsClass">
        <span
          v-for="metric in item.metrics"
          :key="`${item.id}-${metric.id}`"
          :class="metricClass"
        >
          <strong>{{ metric.value }}</strong>
          <small>{{ metric.label }}</small>
        </span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

export interface CmsStatusMetricCardMetric {
  id: string
  label: string
  value: number | string
}

export interface CmsStatusMetricCardItem {
  id: string
  title: string
  description: string
  statusLabel: string
  statusStyle?: CSSProperties
  statusValue?: string
  metrics: CmsStatusMetricCardMetric[]
}

const props = withDefaults(defineProps<{
  items?: CmsStatusMetricCardItem[]
  gridClass?: string
  cardClass?: string
  headerClass?: string
  copyClass?: string
  metricsClass?: string
  metricClass?: string
  cardDataAttrName?: string
  statusDataAttrName?: string
}>(), {
  items: () => [],
  gridClass: '',
  cardClass: '',
  headerClass: '',
  copyClass: '',
  metricsClass: '',
  metricClass: '',
  cardDataAttrName: '',
  statusDataAttrName: '',
})

function resolveCardAttrs(item: CmsStatusMetricCardItem): Record<string, string> {
  return {
    ...(props.cardDataAttrName
      ? { [props.cardDataAttrName]: item.id }
      : {}),
    ...(props.statusDataAttrName
      ? { [props.statusDataAttrName]: item.statusValue ?? '' }
      : {}),
  }
}
</script>