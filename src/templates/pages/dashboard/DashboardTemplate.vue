<template>
  <q-page
    class="ntk-template-dashboard"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-dashboard__hero">
      <div class="ntk-template-dashboard__hero-left">
        <h1 class="ntk-template-dashboard__title">
          {{ title }}
        </h1>
        <p class="ntk-template-dashboard__subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div
        v-if="chips.length > 0"
        class="ntk-template-dashboard__chips"
      >
        <div
          v-for="chip in chips"
          :key="chip.id"
          class="ntk-template-dashboard__chip"
        >
          <q-icon
            v-if="chip.icon"
            :name="chip.icon"
            size="14px"
          />
          <span>{{ chip.text }}</span>
        </div>
      </div>
    </section>

    <section
      class="ntk-template-dashboard__metrics"
      :aria-label="metricsAriaLabel"
    >
      <article
        v-for="metric in metrics"
        :key="metric.id"
        class="ntk-template-dashboard__metric"
        :class="`ntk-template-dashboard__metric--${metric.tone ?? 'neutral'}`"
      >
        <div class="ntk-template-dashboard__metric-icon">
          <q-icon :name="metric.icon ?? 'insights'" />
        </div>
        <div>
          <div class="ntk-template-dashboard__metric-value">
            {{ metric.value }}
          </div>
          <div class="ntk-template-dashboard__metric-label">
            {{ metric.label }}
          </div>
        </div>
      </article>
    </section>

    <section class="ntk-template-dashboard__content-grid">
      <q-card
        class="ntk-template-dashboard__card"
        :aria-label="activityAriaLabel"
      >
        <q-card-section>
          <div class="ntk-template-dashboard__section-title">
            {{ activityTitle }}
          </div>
          <div class="ntk-template-dashboard__activity-list">
            <div
              v-for="item in activities"
              :key="item.id"
              class="ntk-template-dashboard__activity-row"
            >
              <div class="ntk-template-dashboard__activity-label">
                <q-icon
                  v-if="item.icon"
                  :name="item.icon"
                  size="16px"
                />
                <span>{{ item.label }}</span>
              </div>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="ntk-template-dashboard__card"
        :aria-label="topItemsAriaLabel"
      >
        <q-card-section>
          <div class="ntk-template-dashboard__section-title">
            {{ topItemsTitle }}
          </div>
          <div class="ntk-template-dashboard__top-list">
            <div
              v-for="(item, index) in topItems"
              :key="item.id"
              class="ntk-template-dashboard__top-row"
            >
              <span class="ntk-template-dashboard__top-rank">{{ index + 1 }}</span>
              <span class="ntk-template-dashboard__top-name">{{ item.name }}</span>
              <span class="ntk-template-dashboard__top-value">{{ item.value }}</span>
              <span
                v-if="item.secondaryValue !== undefined"
                class="ntk-template-dashboard__top-secondary"
              >
                {{ item.secondaryValue }}
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue'

import type {
  TemplateDashboardActivityItem,
  TemplateDashboardChip,
  TemplateDashboardMetric,
  TemplateDashboardTopItem,
} from '../page-template.types'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    activityTitle?: string
    topItemsTitle?: string
    pageAriaLabel?: string
    metricsAriaLabel?: string
    activityAriaLabel?: string
    topItemsAriaLabel?: string
    chips?: TemplateDashboardChip[]
    metrics?: TemplateDashboardMetric[]
    activities?: TemplateDashboardActivityItem[]
    topItems?: TemplateDashboardTopItem[]
  }>(),
  {
    title: 'Dashboard',
    subtitle: 'Overview of your key metrics and recent activity.',
    activityTitle: 'Activity',
    topItemsTitle: 'Top items',
    pageAriaLabel: 'Dashboard page',
    metricsAriaLabel: 'Dashboard metrics',
    activityAriaLabel: 'Recent activity',
    topItemsAriaLabel: 'Top items ranking',
    chips: () => [],
    metrics: () => [],
    activities: () => [],
    topItems: () => [],
  },
)

const chips = computed<TemplateDashboardChip[]>(() => props.chips)
const metrics = computed<TemplateDashboardMetric[]>(() => props.metrics)
const activities = computed<TemplateDashboardActivityItem[]>(() => props.activities)
const topItems = computed<TemplateDashboardTopItem[]>(() => props.topItems)
</script>

<style scoped lang="scss">
.ntk-template-dashboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--ntk-template-page-bg, #f8fafc);
}

.ntk-template-dashboard__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-template-dashboard__title {
  margin: 0;
  font-size: 20px;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard__subtitle {
  margin: 4px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-dashboard__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ntk-template-dashboard__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 16px;
  border: 1px solid var(--ntk-template-page-chip-border, #e2e8f0);
  color: var(--ntk-template-page-chip-text, #475569);
  background: var(--ntk-template-page-chip-bg, #f8fafc);
}

.ntk-template-dashboard__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.ntk-template-dashboard__metric {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-template-dashboard__metric-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.ntk-template-dashboard__metric--neutral .ntk-template-dashboard__metric-icon {
  background: #f1f5f9;
  color: #475569;
}

.ntk-template-dashboard__metric--primary .ntk-template-dashboard__metric-icon,
.ntk-template-dashboard__metric--info .ntk-template-dashboard__metric-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.ntk-template-dashboard__metric--success .ntk-template-dashboard__metric-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.ntk-template-dashboard__metric--warning .ntk-template-dashboard__metric-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.ntk-template-dashboard__metric--danger .ntk-template-dashboard__metric-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.ntk-template-dashboard__metric-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard__metric-label {
  font-size: 12px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-dashboard__content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.ntk-template-dashboard__card {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  box-shadow: none;
}

.ntk-template-dashboard__section-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--ntk-template-page-subtitle, #64748b);
  margin-bottom: 10px;
}

.ntk-template-dashboard__activity-list,
.ntk-template-dashboard__top-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ntk-template-dashboard__activity-row,
.ntk-template-dashboard__top-row {
  display: grid;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--ntk-template-page-row-bg, #f8fafc);
}

.ntk-template-dashboard__activity-row {
  grid-template-columns: minmax(0, 1fr) auto;
}

.ntk-template-dashboard__activity-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ntk-template-page-text, #334155);
}

.ntk-template-dashboard__top-row {
  grid-template-columns: 28px minmax(0, 1fr) auto auto;
}

.ntk-template-dashboard__top-rank {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
}

.ntk-template-dashboard__top-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ntk-template-dashboard__top-value {
  font-weight: 700;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard__top-secondary {
  color: var(--ntk-template-page-subtitle, #64748b);
  font-size: 12px;
}

@media (max-width: 768px) {
  .ntk-template-dashboard__hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>