<template>
  <div class="ntk-reference-dashboard-charts">
    <article class="ntk-reference-dashboard-charts__card">
      <div class="ntk-reference-dashboard-charts__header">
        <h3>Pedidos por Status</h3>
      </div>

      <div class="ntk-reference-dashboard-charts__donut-layout">
        <div class="ntk-reference-dashboard-charts__donut-stage">
          <div
            class="ntk-reference-dashboard-charts__donut"
            :style="{ '--ntk-reference-dashboard-donut-background': donutBackground }"
            aria-hidden="true"
          >
            <div class="ntk-reference-dashboard-charts__donut-hole" />
          </div>

          <div
            v-for="callout in donutCallouts"
            :key="callout.id"
            class="ntk-reference-dashboard-charts__callout"
            :class="`ntk-reference-dashboard-charts__callout--${callout.position}`"
          >
            <strong>{{ callout.label }}</strong>
            <span>{{ callout.value }}</span>
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
                  '--ntk-reference-dashboard-bar-fill': item.color,
                  width: `${Math.max((item.value / maxCategoryValue) * 100, 12)}%`,
                }"
              />
          </div>
        </div>

        <div class="ntk-reference-dashboard-charts__axis">
          <span class="ntk-reference-dashboard-charts__axis-spacer" />
          <div class="ntk-reference-dashboard-charts__axis-track">
            <span
              v-for="tick in axisTicks"
              :key="tick"
              class="ntk-reference-dashboard-charts__axis-tick"
            >
              {{ tick }}
            </span>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const roundedAxisMax = computed(() => {
  return Math.ceil(maxCategoryValue.value / 100) * 100
})

const axisTicks = computed(() => {
  const stepCount = 6
  const step = Math.max(Math.round(roundedAxisMax.value / stepCount), 1)
  return Array.from({ length: stepCount + 1 }, (_, index) => index * step)
})

const donutCallouts = computed(() => {
  const positions = ['top-right', 'right', 'bottom-left', 'top-left'] as const

  return props.statusSegments.map((segment, index) => ({
    ...segment,
    position: positions[index] ?? 'right',
  }))
})
</script>

<style scoped lang="scss">
.ntk-reference-dashboard-charts {
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
}

.ntk-reference-dashboard-charts__header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ntk-template-page-text, var(--ntk-text-primary));
}

.ntk-reference-dashboard-charts__donut-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

.ntk-reference-dashboard-charts__donut-stage {
  position: relative;
  width: min(360px, 100%);
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.ntk-reference-dashboard-charts__donut {
  position: relative;
  width: min(250px, 100%);
  aspect-ratio: 1;
  border-radius: 50%;
  margin: 0 auto;
  background: var(
    --ntk-reference-dashboard-donut-background,
    var(--ntk-template-page-card-bg, var(--ntk-bg-card))
  );
  box-shadow: inset 0 0 0 3px var(--ntk-template-page-card-bg, var(--ntk-bg-card));
}

.ntk-reference-dashboard-charts__donut-hole {
  position: absolute;
  inset: 22%;
  border-radius: 50%;
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  box-shadow: inset 0 0 0 1px color-mix(
    in srgb,
    var(--ntk-template-page-border, var(--ntk-border-color)) 72%,
    transparent
  );
}

.ntk-reference-dashboard-charts__callout {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  line-height: 1.2;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-primary)));
}

.ntk-reference-dashboard-charts__callout::before {
  content: '';
  position: absolute;
  background: color-mix(
    in srgb,
    var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-primary))) 44%,
    transparent
  );
}

.ntk-reference-dashboard-charts__callout strong {
  color: var(--ntk-template-page-text, var(--ntk-text-primary));
  font-weight: 600;
}

.ntk-reference-dashboard-charts__callout span {
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-primary)));
  font-weight: 600;
}

.ntk-reference-dashboard-charts__callout--top-right {
  top: 56px;
  right: 8px;
  text-align: left;
}

.ntk-reference-dashboard-charts__callout--top-right::before {
  width: 32px;
  height: 1px;
  left: -36px;
  top: 20px;
  transform: rotate(12deg);
}

.ntk-reference-dashboard-charts__callout--right {
  top: 128px;
  right: -6px;
  text-align: left;
}

.ntk-reference-dashboard-charts__callout--right::before {
  width: 34px;
  height: 1px;
  left: -38px;
  top: 16px;
}

.ntk-reference-dashboard-charts__callout--bottom-left {
  bottom: 18px;
  left: 38px;
  text-align: left;
}

.ntk-reference-dashboard-charts__callout--bottom-left::before {
  width: 32px;
  height: 1px;
  right: -36px;
  top: 12px;
  transform: rotate(12deg);
}

.ntk-reference-dashboard-charts__callout--top-left {
  top: 62px;
  left: 30px;
  text-align: center;
}

.ntk-reference-dashboard-charts__callout--top-left::before {
  width: 28px;
  height: 1px;
  right: -32px;
  top: 22px;
  transform: rotate(-18deg);
}

.ntk-reference-dashboard-charts__bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 280px;
  justify-content: center;
  padding: 6px 14px 8px 6px;
}

.ntk-reference-dashboard-charts__bar-row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.ntk-reference-dashboard-charts__bar-label {
  font-size: 12px;
  color: var(--ntk-template-page-text, var(--ntk-text-primary));
}

.ntk-reference-dashboard-charts__bar-track {
  height: 22px;
  border-radius: 0;
  background: linear-gradient(
    90deg,
    color-mix(
      in srgb,
      var(--ntk-template-page-border, var(--ntk-border-color)) 36%,
      transparent
    ) 0%,
    color-mix(
      in srgb,
      var(--ntk-template-page-row-bg, var(--ntk-bg-secondary)) 86%,
      var(--ntk-template-page-card-bg, var(--ntk-bg-card))
    ) 100%
  );
  overflow: hidden;
  position: relative;
}

.ntk-reference-dashboard-charts__bar-track::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    color-mix(
      in srgb,
      var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-primary))) 12%,
      transparent
    ) 0,
    color-mix(
      in srgb,
      var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-primary))) 12%,
      transparent
    ) 1px,
    transparent 1px,
    transparent calc(20% - 1px)
  );
  pointer-events: none;
}

.ntk-reference-dashboard-charts__bar-fill {
  height: 100%;
  border-radius: 0 4px 4px 0;
  background: var(--ntk-reference-dashboard-bar-fill, var(--ntk-primary, var(--ntk-accent)));
}

.ntk-reference-dashboard-charts__axis {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding-top: 4px;
}

.ntk-reference-dashboard-charts__axis-track {
  display: flex;
  justify-content: space-between;
}

.ntk-reference-dashboard-charts__axis-tick {
  color: var(
    --ntk-template-page-subtitle-soft,
    var(--ntk-text-tertiary, var(--ntk-text-secondary, var(--ntk-text-primary)))
  );
  font-size: 11px;
}

@media (max-width: 1180px) {
  .ntk-reference-dashboard-charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .ntk-reference-dashboard-charts__donut-layout {
    display: block;
  }

  .ntk-reference-dashboard-charts__donut-stage {
    width: 100%;
    min-height: 232px;
  }

  .ntk-reference-dashboard-charts__callout,
  .ntk-reference-dashboard-charts__axis {
    display: none;
  }

  .ntk-reference-dashboard-charts__bar-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
