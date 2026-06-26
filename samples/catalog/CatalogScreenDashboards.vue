<template>
  <CatalogScreenFrame
    anchor="dashboards"
    :badge="t.dashBadge"
    :title="t.dashTitle"
    :desc="t.dashDesc"
    :t="t"
  >
    <template #default>
      <div class="db-grid">
        <!-- KPIs -->
        <div class="db-kpis">
          <div
            v-for="kpi in dashKpis"
            :key="kpi.label"
            class="db-kpi"
          >
            <span class="db-kpi__label">{{ kpiLabel(kpi.label) }}</span>
            <span class="db-kpi__value">{{ kpi.value }}</span>
            <span
              class="db-kpi__delta"
              :style="{ color: `var(--ds-color-${kpi.tone})` }"
            >{{ kpi.delta }}</span>
          </div>
        </div>

        <!-- Bar + Line -->
        <div class="db-row db-row--barline">
          <div class="db-card">
            <span class="db-card__t">{{ t.dashRevenue }}</span>
            <div class="db-bars">
              <div
                v-for="bar in dashBars"
                :key="bar.label"
                class="db-barcol"
              >
                <div
                  class="db-bar"
                  :style="{ height: bar.h }"
                />
                <span class="db-bar__lbl">{{ bar.label }}</span>
              </div>
            </div>
          </div>
          <div class="db-card">
            <span class="db-card__t">{{ t.dashTraffic }}</span>
            <svg
              viewBox="0 0 300 150"
              preserveAspectRatio="none"
              class="db-line"
              aria-hidden="true"
            >
              <polyline
                points="0,120 50,90 100,100 150,55 200,70 250,30 300,45"
                fill="none"
                stroke="var(--ds-color-primary)"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polygon
                points="0,120 50,90 100,100 150,55 200,70 250,30 300,45 300,150 0,150"
                fill="var(--ds-color-primary-soft)"
                opacity="0.7"
              />
              <polyline
                points="0,135 50,128 100,132 150,110 200,118 250,100 300,108"
                fill="none"
                stroke="var(--ds-color-info)"
                stroke-width="2"
                stroke-dasharray="4 4"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>

        <!-- Donut + Heatmap -->
        <div class="db-row db-row--donutheat">
          <div class="db-card">
            <span class="db-card__t">{{ t.dashSplit }}</span>
            <div class="db-donutwrap">
              <div class="db-donut">
                <div class="db-donut__hole">
                  100%
                </div>
              </div>
              <div class="db-legend">
                <div
                  v-for="slice in dashDonut"
                  :key="slice.label"
                  class="db-legend__item"
                >
                  <span
                    class="db-legend__sw"
                    :style="{ background: `var(--ds-color-${slice.tone})` }"
                  />
                  {{ slice.label }} <span class="db-legend__pct">{{ slice.pct }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="db-card">
            <div class="db-card__hdrow">
              <span class="db-card__t">{{ t.dashHeatLbl }}</span>
              <span class="db-card__meta">color-mix · {{ t.lblBrand }}</span>
            </div>
            <div class="db-heat">
              <div
                v-for="(cell, i) in dashHeat"
                :key="i"
                :style="cell.style"
              />
            </div>
          </div>
        </div>

        <!-- Map + Matrix -->
        <div class="db-row db-row--mapmatrix">
          <div class="db-card">
            <span class="db-card__t">{{ t.dashMapLbl }}</span>
            <div class="db-map">
              <div
                v-for="rg in dashRegions"
                :key="rg.name"
                :style="rg.style"
              >
                <span class="db-map__name">{{ rg.name }}</span>
                <span class="db-map__pct">{{ rg.pct }}</span>
              </div>
            </div>
          </div>
          <div class="db-card">
            <span class="db-card__t">{{ t.dashMatrixLbl }}</span>
            <div class="db-matrix">
              <div
                v-for="(row, r) in dashMatrix"
                :key="r"
                class="db-matrix__row"
              >
                <div
                  v-for="(cell, c) in row.cells"
                  :key="c"
                  :style="cell.style"
                >
                  {{ cell.val }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CatalogScreenFrame>
</template>

<script setup lang="ts">
import CatalogScreenFrame from './CatalogScreenFrame.vue'
import type { CatalogStrings } from './catalogI18n'
import { dashBars, dashDonut, dashHeat, dashKpis, dashMatrix, dashRegions } from './catalogScreensData'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

/** KPI labels are either literal strings or i18n keys (Sessões/Churn mix). */
function kpiLabel(label: string): string {
  if (label === 'kpiRevenue') return props.t.kpiRevenue
  if (label === 'kpiConv') return props.t.kpiConv
  if (label === 'Sessões') return props.t.kpiSessions
  if (label === 'Churn') return props.t.kpiChurn
  return label
}
</script>

<style scoped>
.db-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.db-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.db-kpi {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.db-kpi__label {
  font-size: 11px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.db-kpi__value {
  font-size: 22px;
  font-weight: 700;
}

.db-kpi__delta {
  font-size: 11.5px;
  font-weight: 600;
}

.db-row {
  display: grid;
  gap: 14px;
}

.db-row--barline {
  grid-template-columns: 1.3fr 1fr;
}

.db-row--donutheat {
  grid-template-columns: 1fr 1.5fr;
}

.db-row--mapmatrix {
  grid-template-columns: 1.5fr 1fr;
}

.db-card {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.db-card__t {
  font-size: 13px;
  font-weight: 700;
}

.db-card__hdrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.db-card__meta {
  font-size: 11px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
}

/* Bar chart */
.db-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 150px;
}

.db-barcol {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  height: 100%;
  justify-content: flex-end;
}

.db-bar {
  width: 100%;
  background: var(--ds-color-primary);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
}

.db-bar__lbl {
  font-size: 9px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
}

/* Line chart */
.db-line {
  width: 100%;
  height: 150px;
  overflow: visible;
}

/* Donut */
.db-donutwrap {
  display: flex;
  align-items: center;
  gap: 18px;
}

.db-donut {
  width: 108px;
  height: 108px;
  border-radius: 999px;
  flex: 0 0 auto;
  background: conic-gradient(
    var(--ds-color-primary) 0 44%,
    var(--ds-color-info) 44% 68%,
    var(--ds-color-success) 68% 86%,
    var(--ds-color-warning) 86% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.db-donut__hole {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: var(--ds-color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
}

.db-legend {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 12.5px;
}

.db-legend__item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.db-legend__sw {
  width: 9px;
  height: 9px;
  border-radius: 3px;
}

.db-legend__pct {
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
}

/* Heatmap */
.db-heat {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}

/* Region map */
.db-map {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.db-map__name {
  font-size: 11.5px;
  font-weight: 600;
}

.db-map__pct {
  font-size: 13px;
  font-weight: 700;
  font-family: var(--ds-font-mono);
}

/* Correlation matrix */
.db-matrix {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.db-matrix__row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
}
</style>