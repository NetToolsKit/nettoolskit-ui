<template>
  <div class="ntk-reference-dashboard-charts">
    <article class="ntk-reference-dashboard-charts__card">
      <div class="ntk-reference-dashboard-charts__header">
        <h3>Pedidos por Status</h3>
      </div>

      <div class="ntk-reference-dashboard-charts__donut-layout">
        <div
          class="ntk-reference-dashboard-charts__donut"
          :style="{ background: donutBackground }"
          aria-hidden="true"
        >
          <div class="ntk-reference-dashboard-charts__donut-hole" />
        </div>

        <div class="ntk-reference-dashboard-charts__legend">
          <div
            v-for="segment in statusSegments"
            :key="segment.id"
            class="ntk-reference-dashboard-charts__legend-row"
          >
            <span
              class="ntk-reference-dashboard-charts__legend-dot"
              :style="{ backgroundColor: segment.color }"
            />
            <span class="ntk-reference-dashboard-charts__legend-label">{{ segment.label }}</span>
            <strong>{{ segment.value }}</strong>
          </div>
        </div>
      </div>
    </article>

    <article class="ntk-reference-dashboard-charts__card">
      <div class="ntk-reference-dashboard-charts__header">
        <h3>Vendas por Categoria</h3>
      </div>

      <div class="ntk-reference-dashboard-charts__bars">
        <div
          v-for="item in categorySeries"
          :key="item.id"
          class="ntk-reference-dashboard-charts__bar-row"
        >
          <span class="ntk-reference-dashboard-charts__bar-label">{{ item.label }}</span>
          <div class="ntk-reference-dashboard-charts__bar-track">
            <div
              class="ntk-reference-dashboard-charts__bar-fill"
              :style="{
                width: `${Math.max((item.value / maxCategoryValue) * 100, 12)}%`,
                backgroundColor: item.color,
              }"
            />
          </div>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const props = defineProps<{
  statusSegments: StatusSegment[]
  categorySeries: CategorySeriesItem[]
}>()

const totalStatusValue = computed(() => {
  return props.statusSegments.reduce((total, segment) => total + segment.value, 0)
})

const donutBackground = computed(() => {
  let offset = 0

  return `conic-gradient(${props.statusSegments
    .map(segment => {
      const start = offset
      const percentage = totalStatusValue.value > 0
        ? (segment.value / totalStatusValue.value) * 100
        : 0
      const end = offset + percentage
      offset = end
      return `${segment.color} ${start}% ${end}%`
    })
    .join(', ')})`
})

const maxCategoryValue = computed(() => {
  return Math.max(...props.categorySeries.map(item => item.value), 1)
})
</script>

<style scoped lang="scss">
.ntk-reference-dashboard-charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ntk-reference-dashboard-charts__card {
  border: 1px solid var(--ntk-template-page-border, #f1f5f9);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  min-height: 340px;
  padding: 16px 18px 18px;
  box-shadow: var(--ntk-shadow-soft, 0 1px 3px rgba(0, 0, 0, 0.05));
}

.ntk-reference-dashboard-charts__header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.ntk-reference-dashboard-charts__donut-layout {
  display: grid;
  grid-template-columns: minmax(210px, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 20px;
  min-height: 280px;
}

.ntk-reference-dashboard-charts__donut {
  position: relative;
  width: min(232px, 100%);
  aspect-ratio: 1;
  border-radius: 50%;
  margin: 0 auto;
}

.ntk-reference-dashboard-charts__donut-hole {
  position: absolute;
  inset: 22%;
  border-radius: 50%;
  background: var(--ntk-template-page-card-bg, #ffffff);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.16);
}

.ntk-reference-dashboard-charts__legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ntk-reference-dashboard-charts__legend-row {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #334155;
}

.ntk-reference-dashboard-charts__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.ntk-reference-dashboard-charts__legend-label {
  color: #64748b;
}

.ntk-reference-dashboard-charts__bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 280px;
  justify-content: center;
}

.ntk-reference-dashboard-charts__bar-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.ntk-reference-dashboard-charts__bar-label {
  font-size: 12px;
  color: #334155;
}

.ntk-reference-dashboard-charts__bar-track {
  height: 22px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(226, 232, 240, 0.46) 0%, rgba(241, 245, 249, 0.8) 100%);
  overflow: hidden;
}

.ntk-reference-dashboard-charts__bar-fill {
  height: 100%;
  border-radius: inherit;
}

@media (max-width: 1180px) {
  .ntk-reference-dashboard-charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .ntk-reference-dashboard-charts__donut-layout {
    grid-template-columns: 1fr;
  }

  .ntk-reference-dashboard-charts__bar-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
