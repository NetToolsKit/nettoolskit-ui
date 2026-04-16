<template>
  <q-page
    class="ntk-template-dashboard"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-dashboard__hero">
      <div class="ntk-template-dashboard__hero-left">
        <div class="ntk-template-dashboard__hero-title-row">
          <span
            v-if="greetingIcon"
            class="ntk-template-dashboard__greeting-icon"
            aria-hidden="true"
          >{{ greetingIcon }}</span>
          <h1 class="ntk-template-dashboard__title">
            {{ title }}
          </h1>
        </div>
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

    <section
      v-if="$slots.charts"
      class="ntk-template-dashboard__charts"
      :aria-label="chartsAriaLabel"
    >
      <slot name="charts" />
    </section>

    <section class="ntk-template-dashboard__content-grid">
      <q-card
        class="ntk-template-dashboard__card"
        :aria-label="activityAriaLabel"
      >
        <q-card-section>
          <div class="ntk-template-dashboard__section-title">
            <q-icon
              v-if="activityTitleIcon"
              :name="activityTitleIcon"
              size="16px"
              aria-hidden="true"
            />
            <span>{{ activityTitle }}</span>
          </div>
          <div class="ntk-template-dashboard__activity-list">
            <div
              v-for="item in activities"
              :key="item.id"
              class="ntk-template-dashboard__activity-row"
            >
              <div class="ntk-template-dashboard__activity-label">
                <div
                  v-if="item.icon"
                  class="ntk-template-dashboard__activity-icon"
                  :class="item.iconTone ? `ntk-template-dashboard__activity-icon--${item.iconTone}` : ''"
                >
                  <q-icon
                    :name="item.icon"
                    size="16px"
                  />
                </div>
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
            <q-icon
              v-if="topItemsTitleIcon"
              :name="topItemsTitleIcon"
              size="16px"
              aria-hidden="true"
            />
            <span>{{ topItemsTitle }}</span>
          </div>
          <div class="ntk-template-dashboard__top-list">
            <div
              v-for="(item, index) in topItems"
              :key="item.id"
              class="ntk-template-dashboard__top-row"
            >
              <span class="ntk-template-dashboard__top-rank">{{ index + 1 }}</span>
              <div
                v-if="item.avatar"
                class="ntk-template-dashboard__top-avatar"
                aria-hidden="true"
              >
                {{ item.avatar }}
              </div>
              <div class="ntk-template-dashboard__top-info">
                <span class="ntk-template-dashboard__top-name">{{ item.name }}</span>
                <div
                  v-if="item.barPercent !== undefined"
                  class="ntk-template-dashboard__top-bar-track"
                >
                  <div
                    class="ntk-template-dashboard__top-bar-fill"
                    :style="{ width: `${Math.min(Math.max(item.barPercent, 2), 100)}%` }"
                  />
                </div>
              </div>
              <div class="ntk-template-dashboard__top-stats">
                <span class="ntk-template-dashboard__top-stat">
                  <span class="ntk-template-dashboard__top-value">{{ item.value }}</span>
                  <span
                    v-if="item.valueCaption"
                    class="ntk-template-dashboard__top-stat-label"
                  >
                    {{ item.valueCaption }}
                  </span>
                </span>
                <span
                  v-if="item.secondaryValue !== undefined"
                  class="ntk-template-dashboard__top-stat ntk-template-dashboard__top-stat--secondary"
                >
                  <span class="ntk-template-dashboard__top-secondary">{{ item.secondaryValue }}</span>
                  <span
                    v-if="item.secondaryCaption"
                    class="ntk-template-dashboard__top-stat-label"
                  >
                    {{ item.secondaryCaption }}
                  </span>
                </span>
              </div>
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
    /** Emoji or short text rendered before the title — e.g. '☀️', '🌙' */
    greetingIcon?: string
    activityTitle?: string
    topItemsTitle?: string
    activityTitleIcon?: string
    topItemsTitleIcon?: string
    pageAriaLabel?: string
    metricsAriaLabel?: string
    chartsAriaLabel?: string
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
    activityTitleIcon: '',
    topItemsTitleIcon: '',
    pageAriaLabel: 'Dashboard page',
    metricsAriaLabel: 'Dashboard metrics',
    chartsAriaLabel: 'Dashboard charts',
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
  --ntk-template-dashboard-bg: var(--ntk-template-page-bg, var(--ntk-bg-secondary));
  --ntk-template-dashboard-surface: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  --ntk-template-dashboard-border: var(--ntk-template-page-border, var(--ntk-border-color));
  --ntk-template-dashboard-title: var(--ntk-template-page-title, var(--ntk-text-primary));
  --ntk-template-dashboard-subtitle: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  --ntk-template-dashboard-chip-border: var(--ntk-template-page-chip-border, var(--ntk-template-dashboard-border));
  --ntk-template-dashboard-chip-text: var(--ntk-template-page-chip-text, var(--ntk-template-dashboard-subtitle));
  --ntk-template-dashboard-chip-bg: var(--ntk-template-page-chip-bg, var(--ntk-bg-secondary));
  --ntk-template-dashboard-row-bg: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));
  --ntk-template-dashboard-text: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
  --ntk-template-dashboard-icon-neutral: color-mix(in srgb, var(--ntk-template-dashboard-text) 82%, var(--ntk-text-primary));

  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--ntk-template-dashboard-bg);
}

.ntk-template-dashboard__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid var(--ntk-template-dashboard-border);
  border-radius: 12px;
  background: var(--ntk-template-dashboard-surface);
}

.ntk-template-dashboard__hero-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-template-dashboard__greeting-icon {
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
}

.ntk-template-dashboard__title {
  margin: 0;
  font-size: 20px;
  color: var(--ntk-template-dashboard-title);
}

.ntk-template-dashboard__subtitle {
  margin: 4px 0 0;
  color: var(--ntk-template-dashboard-subtitle);
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
  border: 1px solid var(--ntk-template-dashboard-chip-border);
  color: var(--ntk-template-dashboard-chip-text);
  background: var(--ntk-template-dashboard-chip-bg);
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
  border: 1px solid var(--ntk-template-dashboard-border);
  background: var(--ntk-template-dashboard-surface);
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
  background: color-mix(in srgb, var(--ntk-template-dashboard-text) 8%, var(--ntk-template-dashboard-surface));
  color: var(--ntk-template-dashboard-icon-neutral);
}

.ntk-template-dashboard__metric--primary .ntk-template-dashboard__metric-icon,
.ntk-template-dashboard__metric--info .ntk-template-dashboard__metric-icon {
  background: color-mix(in srgb, var(--ntk-info) 14%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-info);
}

.ntk-template-dashboard__metric--success .ntk-template-dashboard__metric-icon {
  background: color-mix(in srgb, var(--ntk-success) 14%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-success);
}

.ntk-template-dashboard__metric--warning .ntk-template-dashboard__metric-icon {
  background: color-mix(in srgb, var(--ntk-warning) 16%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-warning);
}

.ntk-template-dashboard__metric--danger .ntk-template-dashboard__metric-icon {
  background: color-mix(in srgb, var(--ntk-error) 14%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-error);
}

.ntk-template-dashboard__metric-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--ntk-template-page-title, var(--ntk-text-primary));
}

.ntk-template-dashboard__metric-label {
  font-size: 12px;
  color: var(--ntk-template-dashboard-subtitle);
}

.ntk-template-dashboard__charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.ntk-template-dashboard__content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.ntk-template-dashboard__card {
  border: 1px solid var(--ntk-template-dashboard-border);
  border-radius: 12px;
  box-shadow: none;
}

.ntk-template-dashboard__section-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  margin-bottom: 14px;
  padding-left: 2px;
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
  min-height: 40px;
  padding: 10px 8px;
  border-radius: 8px;
  background: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));
  transition: background 0.15s ease;
}

.ntk-template-dashboard__activity-row:hover,
.ntk-template-dashboard__top-row:hover {
  background: var(--ntk-template-page-row-hover-bg, var(--ntk-accent-soft, var(--ntk-bg-tertiary)));
}

.ntk-template-dashboard__activity-row {
  grid-template-columns: minmax(0, 1fr) auto;
}

.ntk-template-dashboard__activity-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
}

.ntk-template-dashboard__activity-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary))) 8%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-template-dashboard-icon-neutral);
  flex-shrink: 0;
}

.ntk-template-dashboard__activity-icon--blue,
.ntk-template-dashboard__activity-icon--teal {
  background: color-mix(in srgb, var(--ntk-info) 14%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-info);
}

.ntk-template-dashboard__activity-icon--indigo,
.ntk-template-dashboard__activity-icon--violet,
.ntk-template-dashboard__activity-icon--pink {
  background: color-mix(in srgb, var(--ntk-accent) 14%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-accent);
}

.ntk-template-dashboard__activity-icon--green {
  background: color-mix(in srgb, var(--ntk-success) 14%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-success);
}

.ntk-template-dashboard__activity-icon--amber {
  background: color-mix(in srgb, var(--ntk-warning) 16%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-warning);
}

.ntk-template-dashboard__activity-icon--slate {
  background: color-mix(in srgb, var(--ntk-template-dashboard-text) 8%, var(--ntk-template-dashboard-surface));
  color: var(--ntk-template-dashboard-icon-neutral);
}

.ntk-template-dashboard__activity-icon--red {
  background: color-mix(in srgb, var(--ntk-error) 14%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-error);
}

.ntk-template-dashboard__top-row {
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
}

.ntk-template-dashboard__top-row:has(.ntk-template-dashboard__top-avatar) {
  grid-template-columns: 28px 30px minmax(0, 1fr) auto;
}

.ntk-template-dashboard__top-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--ntk-template-page-avatar-bg, var(--ntk-avatar-bg, var(--ntk-primary-gradient, var(--ntk-accent))));
  color: var(--ntk-avatar-color, var(--ntk-text-on-accent, var(--ntk-text-primary)));
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--ntk-avatar-color, var(--ntk-text-on-accent, var(--ntk-text-primary))) 16%, transparent);
}

.ntk-template-dashboard__top-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ntk-template-dashboard__top-bar-track {
  height: 4px;
  background: var(--ntk-template-page-border, var(--ntk-border-color));
  border-radius: 2px;
  overflow: hidden;
}

.ntk-template-dashboard__top-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--ntk-template-page-bar-fill, var(--ntk-primary-gradient, var(--ntk-accent)));
  transition: width 0.4s ease;
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
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  background: color-mix(in srgb, var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary)) 78%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-dashboard__top-row:first-child .ntk-template-dashboard__top-rank {
  background: color-mix(in srgb, var(--ntk-accent) 16%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
  color: var(--ntk-accent);
}

.ntk-template-dashboard__top-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  color: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
}

.ntk-template-dashboard__top-value {
  display: block;
  font-weight: 700;
  color: var(--ntk-template-page-title, var(--ntk-text-primary));
}

.ntk-template-dashboard__top-stats {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
}

.ntk-template-dashboard__top-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.ntk-template-dashboard__top-stat--secondary .ntk-template-dashboard__top-secondary {
  color: var(--ntk-template-page-accent-value, var(--semantic-success-primary, var(--ntk-success)));
}

.ntk-template-dashboard__top-stat-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--ntk-template-page-subtitle-soft, color-mix(in srgb, var(--ntk-template-page-subtitle, var(--ntk-text-secondary)) 72%, transparent));
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ntk-template-dashboard__top-secondary {
  display: block;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .ntk-template-dashboard__hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
