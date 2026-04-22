<template>
  <div
    ref="rootEl"
    class="ntk-reference-dashboard-charts"
  >
    <article class="ntk-reference-dashboard-charts__card">
      <div class="ntk-reference-dashboard-charts__header">
        <h3>Pedidos por Status</h3>
      </div>

      <div
        ref="statusChartEl"
        class="ntk-reference-dashboard-charts__chart ntk-reference-dashboard-charts__chart--donut"
        aria-label="Pedidos por Status"
      />
    </article>

    <article class="ntk-reference-dashboard-charts__card">
      <div class="ntk-reference-dashboard-charts__header">
        <h3>Vendas por Categoria</h3>
      </div>

      <div
        ref="categoryChartEl"
        class="ntk-reference-dashboard-charts__chart ntk-reference-dashboard-charts__chart--bars"
        aria-label="Vendas por Categoria"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
import Highcharts from 'highcharts'
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from 'vue'

export interface ReferenceDashboardStatusSegment {
  id: string
  label: string
  value: number
  color: string
}

export interface ReferenceDashboardCategorySeriesItem {
  id: string
  label: string
  value: number
  color: string
}

const props = defineProps<{
  statusSegments: ReferenceDashboardStatusSegment[]
  categorySeries: ReferenceDashboardCategorySeriesItem[]
}>()

const rootEl = ref<HTMLElement | null>(null)
const statusChartEl = ref<HTMLElement | null>(null)
const categoryChartEl = ref<HTMLElement | null>(null)
const statusChart = ref<Highcharts.Chart | null>(null)
const categoryChart = ref<Highcharts.Chart | null>(null)

let themeObserver: MutationObserver | null = null

function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') {
    return fallback
  }

  const source = rootEl.value ?? document.documentElement
  const value = window.getComputedStyle(source).getPropertyValue(name).trim()

  return value || fallback
}

function resolveCssColor(value: string, fallback: string): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback
  }

  const probe = document.createElement('span')
  probe.style.color = value
  probe.style.position = 'absolute'
  probe.style.pointerEvents = 'none'
  probe.style.visibility = 'hidden'

  const host = rootEl.value ?? document.body
  host.appendChild(probe)
  const resolved = window.getComputedStyle(probe).color
  probe.remove()

  return resolved || fallback
}

function resolveTokenColor(tokenName: string, fallback: string): string {
  return resolveCssColor(readToken(tokenName, fallback), fallback)
}

function buildChartPalette() {
  const textColor = resolveTokenColor('--ntk-template-page-text', 'var(--ntk-text-primary)')
  const mutedColor = resolveTokenColor('--ntk-template-page-subtitle', 'var(--ntk-text-secondary)')
  const subtleColor = resolveTokenColor('--ntk-reference-dashboard-chart-tick', 'var(--ntk-text-tertiary)')
  const borderColor = resolveTokenColor('--ntk-reference-dashboard-chart-guide', 'var(--ntk-border-color)')
  const surfaceColor = resolveTokenColor('--ntk-template-page-card-bg', 'var(--ntk-bg-card)')

  return {
    textColor,
    mutedColor,
    subtleColor,
    borderColor,
    surfaceColor,
  }
}

function resolveSeriesColor(value: string, fallback: string): string {
  return resolveCssColor(value, fallback)
}

function destroyChart(chartRef: Ref<Highcharts.Chart | null>): void {
  chartRef.value?.destroy()
  chartRef.value = null
}

function destroyCharts(): void {
  destroyChart(statusChart)
  destroyChart(categoryChart)
}

function createStatusChart(): void {
  if (!statusChartEl.value) {
    return
  }

  const palette = buildChartPalette()
  const fallbackColors = [
    'var(--semantic-info-primary, var(--ntk-info))',
    'var(--semantic-warning-primary, var(--ntk-warning))',
    'var(--semantic-success-primary, var(--ntk-success))',
    'var(--ntk-text-muted)',
  ]
  const data = props.statusSegments.map((segment, index) => ({
    name: segment.label,
    y: segment.value,
    color: resolveSeriesColor(segment.color, fallbackColors[index] ?? palette.textColor),
  }))

  statusChart.value = Highcharts.chart(statusChartEl.value, {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 280,
      spacing: [0, 0, 0, 0],
      animation: false,
      style: { fontFamily: 'Inter, sans-serif' },
    },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      pointFormat: '<b>{point.y}</b> pedidos ({point.percentage:.1f}%)',
      style: { fontSize: '12px', color: palette.textColor },
    },
    plotOptions: {
      series: {
        animation: false,
      },
      pie: {
        innerSize: '62%',
        borderWidth: 3,
        borderColor: palette.surfaceColor,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br/>{point.y}',
          distance: 15,
          style: {
            fontSize: '11px',
            fontWeight: '500',
            color: palette.textColor,
            textOutline: 'none',
          },
        },
        states: { hover: { brightness: 0.05 } },
      },
    },
    series: [{
      name: 'Pedidos',
      data,
      type: 'pie',
    }],
  })
}

function createCategoryChart(): void {
  if (!categoryChartEl.value) {
    return
  }

  const palette = buildChartPalette()
  const fallbackColors = [
    'var(--semantic-info-primary, var(--ntk-info))',
    'var(--ntk-accent)',
    'var(--semantic-warning-primary, var(--ntk-warning))',
    'var(--semantic-success-primary, var(--ntk-success))',
  ]
  const categories = props.categorySeries.map(item => item.label)
  const data = props.categorySeries.map((item, index) => ({
    name: item.label,
    y: item.value,
    color: resolveSeriesColor(item.color, fallbackColors[index] ?? palette.textColor),
  }))

  categoryChart.value = Highcharts.chart(categoryChartEl.value, {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      height: 260,
      spacing: [10, 16, 10, 16],
      animation: false,
      style: { fontFamily: 'Inter, sans-serif' },
    },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      categories,
      lineWidth: 0,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: '500',
          color: palette.textColor,
        },
      },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: palette.borderColor,
      labels: {
        style: {
          fontSize: '11px',
          color: palette.subtleColor,
        },
      },
      allowDecimals: false,
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> vendas',
      style: { fontSize: '12px', color: palette.textColor },
    },
    legend: { enabled: false },
    plotOptions: {
      series: {
        animation: false,
      },
      bar: {
        borderRadius: 4,
        pointWidth: 22,
        colorByPoint: true,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'Vendas',
        data,
        type: 'bar',
      },
    ],
  })
}

async function renderCharts(): Promise<void> {
  await nextTick()
  destroyCharts()
  createStatusChart()
  createCategoryChart()
}

function reflowCharts(): void {
  statusChart.value?.reflow()
  categoryChart.value?.reflow()
}

watch(
  () => [props.statusSegments, props.categorySeries],
  () => {
    void renderCharts()
  },
  { deep: true },
)

onMounted(() => {
  void renderCharts()
  window.addEventListener('resize', reflowCharts)

  themeObserver = new MutationObserver(() => {
    void renderCharts()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'style'],
  })
  if (document.body) {
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', reflowCharts)
  themeObserver?.disconnect()
  destroyCharts()
})
</script>

<style scoped lang="scss">
.ntk-reference-dashboard-charts {
  --ntk-reference-dashboard-callout-line: color-mix(
    in srgb,
    var(--ntk-template-page-text, var(--ntk-text-primary)) 24%,
    var(--ntk-template-page-border, var(--ntk-border-color))
  );
  --ntk-reference-dashboard-chart-guide: color-mix(
    in srgb,
    var(--ntk-template-page-text, var(--ntk-text-primary)) 18%,
    var(--ntk-template-page-border, var(--ntk-border-color))
  );
  --ntk-reference-dashboard-chart-tick: var(
    --ntk-template-page-chip-text,
    var(--ntk-template-page-subtitle, var(--ntk-text-tertiary, var(--ntk-text-secondary)))
  );

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ntk-reference-dashboard-charts__card {
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  min-height: 340px;
  padding: 16px 18px 18px;
  box-shadow: var(
    --ntk-template-surface-shadow,
    0 1px 3px color-mix(in srgb, var(--ntk-text-primary) 5%, transparent)
  );
  overflow: hidden;
}

.ntk-reference-dashboard-charts__header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ntk-template-page-text, var(--ntk-text-primary));
}

.ntk-reference-dashboard-charts__header::after {
  content: '';
  display: block;
  width: 42px;
  height: 1px;
  margin-top: 10px;
  background: var(--ntk-reference-dashboard-callout-line);
}

.ntk-reference-dashboard-charts__chart {
  width: 100%;
  min-height: 280px;
}

.ntk-reference-dashboard-charts__chart--bars {
  min-height: 260px;
}

.ntk-reference-dashboard-charts__chart :deep(.highcharts-container),
.ntk-reference-dashboard-charts__chart :deep(.highcharts-root) {
  width: 100% !important;
}

.ntk-reference-dashboard-charts__chart :deep(.highcharts-background) {
  fill: transparent;
}

.ntk-reference-dashboard-charts__chart :deep(.highcharts-axis-line),
.ntk-reference-dashboard-charts__chart :deep(.highcharts-tick) {
  stroke: transparent;
}

.ntk-reference-dashboard-charts__chart :deep(.highcharts-grid-line) {
  stroke: var(--ntk-reference-dashboard-chart-guide);
}

.ntk-reference-dashboard-charts__chart :deep(.highcharts-axis-labels text) {
  color: var(--ntk-reference-dashboard-chart-tick);
  fill: var(--ntk-reference-dashboard-chart-tick);
}

@media (max-width: 1180px) {
  .ntk-reference-dashboard-charts {
    grid-template-columns: 1fr;
  }
}
</style>
