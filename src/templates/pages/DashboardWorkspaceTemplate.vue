<template>
  <q-page
    class="ntk-template-dashboard-workspace"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-dashboard-workspace__hero">
      <div class="ntk-template-dashboard-workspace__hero-main">
        <h1 class="ntk-template-dashboard-workspace__title">
          {{ title }}
        </h1>
        <p class="ntk-template-dashboard-workspace__subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div
        v-if="chips.length > 0"
        class="ntk-template-dashboard-workspace__chips"
        :aria-label="chipsAriaLabel"
      >
        <div
          v-for="chip in chips"
          :key="chip.id"
          class="ntk-template-dashboard-workspace__chip"
        >
          <q-icon
            v-if="chip.icon"
            :name="chip.icon"
            size="14px"
          />
          <span>{{ chip.text }}</span>
        </div>
      </div>

      <div class="ntk-template-dashboard-workspace__hero-actions">
        <q-btn
          v-for="action in actions"
          :key="action.id"
          no-caps
          :label="action.label"
          :icon="action.icon"
          :to="action.to"
          :color="action.color || 'primary'"
          :disable="action.disable"
          :flat="action.flat ?? false"
          :outline="action.outline ?? false"
          :unelevated="action.unelevated ?? true"
          :aria-label="action.ariaLabel || action.label"
          @click="emitAction(action.id)"
        />
      </div>
    </section>

    <section
      v-if="showControlPanel"
      class="ntk-template-dashboard-workspace__control-panel"
    >
      <div class="ntk-template-dashboard-workspace__search">
        <q-icon
          name="search"
          size="16px"
        />
        <input
          v-model="searchModel"
          type="text"
          :placeholder="searchPlaceholder"
          :aria-label="searchAriaLabel"
          class="ntk-template-dashboard-workspace__search-input"
        >
      </div>

      <div class="ntk-template-dashboard-workspace__filters">
        <button
          v-for="filter in resolvedFilters"
          :key="filter.id"
          type="button"
          class="ntk-template-dashboard-workspace__filter"
          :class="{ 'ntk-template-dashboard-workspace__filter--active': effectiveFilterId === filter.id }"
          @click="setActiveFilter(filter.id)"
        >
          <span>{{ filter.label }}</span>
          <small v-if="filter.count !== undefined">{{ filter.count }}</small>
        </button>
      </div>

      <div class="ntk-template-dashboard-workspace__views">
        <button
          v-for="view in resolvedViews"
          :key="view.id"
          type="button"
          class="ntk-template-dashboard-workspace__view"
          :class="{ 'ntk-template-dashboard-workspace__view--active': effectiveViewId === view.id }"
          @click="setActiveView(view.id)"
        >
          <q-icon
            :name="view.icon || 'dashboard'"
            size="16px"
          />
          <span>{{ view.label }}</span>
        </button>
      </div>
    </section>

    <section
      v-if="resolvedMetrics.length > 0"
      class="ntk-template-dashboard-workspace__metrics"
      :aria-label="metricsAriaLabel"
    >
      <article
        v-for="metric in resolvedMetrics"
        :key="metric.id"
        class="ntk-template-dashboard-workspace__metric"
        :class="`ntk-template-dashboard-workspace__metric--${metric.tone || 'neutral'}`"
      >
        <div class="ntk-template-dashboard-workspace__metric-icon">
          <q-icon :name="metric.icon || 'insights'" />
        </div>

        <div class="ntk-template-dashboard-workspace__metric-main">
          <strong>{{ metric.value }}</strong>
          <span>{{ metric.label }}</span>
        </div>

        <small
          v-if="metric.delta"
          class="ntk-template-dashboard-workspace__metric-delta"
        >
          {{ metric.delta }}
        </small>
      </article>
    </section>

    <section
      v-if="resolvedPanels.length > 0"
      class="ntk-template-dashboard-workspace__panels"
    >
      <article
        v-for="panel in resolvedPanels"
        :key="panel.id"
        class="ntk-template-dashboard-workspace__panel"
        :class="`ntk-template-dashboard-workspace__panel--${panel.tone || 'neutral'}`"
        role="button"
        tabindex="0"
        @click="emitPanel(panel.id)"
        @keyup.enter.prevent="emitPanel(panel.id)"
        @keyup.space.prevent="emitPanel(panel.id)"
      >
        <div class="ntk-template-dashboard-workspace__panel-header">
          <q-icon
            :name="panel.icon || 'category'"
            size="16px"
          />
          <span>{{ panel.title }}</span>
        </div>
        <strong class="ntk-template-dashboard-workspace__panel-value">
          {{ panel.value }}
        </strong>
        <p
          v-if="panel.description"
          class="ntk-template-dashboard-workspace__panel-description"
        >
          {{ panel.description }}
        </p>
      </article>
    </section>

    <section
      class="ntk-template-dashboard-workspace__lanes"
      :aria-label="lanesAriaLabel"
    >
      <article
        v-for="lane in filteredLanes"
        :key="lane.id"
        class="ntk-template-dashboard-workspace__lane"
      >
        <header class="ntk-template-dashboard-workspace__lane-header">
          <h2>{{ lane.title }}</h2>
          <span>{{ resolveLaneCount(lane) }}</span>
        </header>

        <div
          v-if="lane.items.length === 0"
          class="ntk-template-dashboard-workspace__lane-empty"
        >
          {{ emptyLaneLabel }}
        </div>

        <button
          v-for="item in lane.items"
          :key="item.id"
          type="button"
          class="ntk-template-dashboard-workspace__lane-item"
          @click="emitLaneItem(lane.id, item.id)"
        >
          <span class="ntk-template-dashboard-workspace__lane-item-title">{{ item.title }}</span>
          <small
            v-if="item.subtitle"
            class="ntk-template-dashboard-workspace__lane-item-subtitle"
          >
            {{ item.subtitle }}
          </small>

          <div
            v-if="item.badge || item.assignee"
            class="ntk-template-dashboard-workspace__lane-item-meta"
          >
            <span
              v-if="item.badge"
              class="ntk-template-dashboard-workspace__lane-badge"
            >
              {{ item.badge }}
            </span>
            <span
              v-if="item.assignee"
              class="ntk-template-dashboard-workspace__lane-assignee"
            >
              {{ item.assignee }}
            </span>
          </div>
        </button>
      </article>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type {
  TemplateDashboardChip,
  TemplateDashboardWorkspaceFilterOption,
  TemplateDashboardWorkspaceLane,
  TemplateDashboardWorkspaceMetric,
  TemplateDashboardWorkspacePanelCard,
  TemplateDashboardWorkspaceTask,
  TemplateDashboardWorkspaceViewOption,
  TemplatePageAction,
} from './page-template.types'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  chips?: TemplateDashboardChip[]
  actions?: TemplatePageAction[]
  filters?: TemplateDashboardWorkspaceFilterOption[]
  views?: TemplateDashboardWorkspaceViewOption[]
  metrics?: TemplateDashboardWorkspaceMetric[]
  panels?: TemplateDashboardWorkspacePanelCard[]
  lanes?: TemplateDashboardWorkspaceLane[]
  searchValue?: string
  activeFilterId?: string
  activeViewId?: string
  showControlPanel?: boolean
  pageAriaLabel?: string
  chipsAriaLabel?: string
  searchPlaceholder?: string
  searchAriaLabel?: string
  metricsAriaLabel?: string
  lanesAriaLabel?: string
  emptyLaneLabel?: string
}>(), {
  title: 'Operations dashboard',
  subtitle: 'Template-first dashboard workspace for enterprise operational scenarios.',
  chips: () => [],
  actions: () => [],
  filters: () => [],
  views: () => [],
  metrics: () => [],
  panels: () => [],
  lanes: () => [],
  searchValue: '',
  activeFilterId: 'all',
  activeViewId: 'overview',
  showControlPanel: true,
  pageAriaLabel: 'Dashboard workspace',
  chipsAriaLabel: 'Dashboard context chips',
  searchPlaceholder: 'Search cards, owners or pipeline items...',
  searchAriaLabel: 'Search dashboard workspace',
  metricsAriaLabel: 'Dashboard metrics',
  lanesAriaLabel: 'Dashboard workflow lanes',
  emptyLaneLabel: 'No items available for this lane.',
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeFilterId': [value: string]
  'update:activeViewId': [value: string]
  'action-click': [actionId: string]
  'panel-click': [panelId: string]
  'lane-item-click': [payload: { laneId: string; itemId: string }]
}>()

const chips = computed<TemplateDashboardChip[]>(() => props.chips)
const actions = computed<TemplatePageAction[]>(() => props.actions)

const searchModel = computed<string>({
  get: () => props.searchValue,
  set: value => emit('update:searchValue', value),
})

const resolvedFilters = computed<TemplateDashboardWorkspaceFilterOption[]>(() => {
  if (props.filters.length > 0) {
    return props.filters
  }

  const totalItems = props.lanes.reduce((total, lane) => total + lane.items.length, 0)
  return [
    {
      id: 'all',
      label: 'All',
      count: totalItems,
    },
  ]
})

const resolvedViews = computed<TemplateDashboardWorkspaceViewOption[]>(() => {
  if (props.views.length > 0) {
    return props.views
  }

  return [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'pipeline', label: 'Pipeline', icon: 'view_kanban' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
  ]
})

const effectiveFilterId = computed<string>(() => {
  if (resolvedFilters.value.some(filter => filter.id === props.activeFilterId)) {
    return props.activeFilterId
  }

  return resolvedFilters.value[0]?.id || 'all'
})

const effectiveViewId = computed<string>(() => {
  if (resolvedViews.value.some(view => view.id === props.activeViewId)) {
    return props.activeViewId
  }

  return resolvedViews.value[0]?.id || 'overview'
})

const resolvedMetrics = computed<TemplateDashboardWorkspaceMetric[]>(() => {
  if (props.metrics.length > 0) {
    return props.metrics
  }

  const totalItems = props.lanes.reduce((total, lane) => total + lane.items.length, 0)
  const activeLanes = props.lanes.filter(lane => lane.items.length > 0).length

  return [
    {
      id: 'metric-items',
      label: 'Open items',
      value: totalItems,
      icon: 'checklist',
      tone: 'info',
    },
    {
      id: 'metric-lanes',
      label: 'Workflow lanes',
      value: props.lanes.length,
      icon: 'view_kanban',
      tone: 'primary',
    },
    {
      id: 'metric-active-lanes',
      label: 'Active lanes',
      value: activeLanes,
      icon: 'insights',
      tone: 'success',
    },
  ]
})

const resolvedPanels = computed<TemplateDashboardWorkspacePanelCard[]>(() => {
  if (props.panels.length > 0) {
    return props.panels
  }

  return props.lanes.slice(0, 3).map(lane => ({
    id: `panel-${lane.id}`,
    title: lane.title,
    value: lane.items.length,
    description: 'Items currently grouped in this lane.',
    icon: 'dashboard_customize',
    tone: 'neutral',
  }))
})

const filteredLanes = computed<TemplateDashboardWorkspaceLane[]>(() => {
  const activeFilter = effectiveFilterId.value
  const search = searchModel.value.trim().toLowerCase()

  return props.lanes.map(lane => {
    const items = lane.items.filter(item => {
      if (!matchesFilter(item, activeFilter)) {
        return false
      }

      if (!search) {
        return true
      }

      return matchesSearch(item, search)
    })

    return {
      ...lane,
      items,
    }
  })
})

function matchesFilter(item: TemplateDashboardWorkspaceTask, activeFilter: string): boolean {
  if (activeFilter === 'all') {
    return true
  }

  return (item.filterKeys || []).includes(activeFilter)
}

function matchesSearch(item: TemplateDashboardWorkspaceTask, search: string): boolean {
  const content = [
    item.title,
    item.subtitle,
    item.badge,
    item.assignee,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return content.includes(search)
}

function setActiveFilter(filterId: string): void {
  emit('update:activeFilterId', filterId)
}

function setActiveView(viewId: string): void {
  emit('update:activeViewId', viewId)
}

function emitAction(actionId: string): void {
  emit('action-click', actionId)
}

function emitPanel(panelId: string): void {
  emit('panel-click', panelId)
}

function emitLaneItem(laneId: string, itemId: string): void {
  emit('lane-item-click', { laneId, itemId })
}

function resolveLaneCount(lane: TemplateDashboardWorkspaceLane): number {
  return lane.count ?? lane.items.length
}
</script>

<style scoped lang="scss">
.ntk-template-dashboard-workspace {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--ntk-template-page-bg, #f8fafc);
}

.ntk-template-dashboard-workspace__hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
  border-radius: var(--ntk-template-surface-radius, 12px);
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 14px 16px;
}

.ntk-template-dashboard-workspace__title {
  margin: 0;
  font-size: 20px;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard-workspace__subtitle {
  margin: 4px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-dashboard-workspace__chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.ntk-template-dashboard-workspace__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 30px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--ntk-template-page-chip-border, #e2e8f0);
  background: var(--ntk-template-page-chip-bg, #f1f5f9);
  color: var(--ntk-template-page-chip-text, #475569);
  font-size: 12px;
}

.ntk-template-dashboard-workspace__hero-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.ntk-template-dashboard-workspace__control-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-radius: var(--ntk-template-surface-radius, 12px);
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 8px;
}

.ntk-template-dashboard-workspace__search {
  width: min(320px, 100%);
  min-height: var(--ntk-template-form-control-height, 44px);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: var(--ntk-template-form-control-radius, 8px);
  background: var(--ntk-template-form-control-bg, #ffffff);
  color: var(--ntk-template-form-icon-color, #64748b);
  padding: 0 10px;
}

.ntk-template-dashboard-workspace__search-input {
  border: 0;
  background: transparent;
  outline: 0;
  color: var(--ntk-template-page-text, #334155);
  width: 100%;
  font-size: 13px;
}

.ntk-template-dashboard-workspace__filters {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-template-dashboard-workspace__filter {
  border: 0;
  background: transparent;
  color: var(--ntk-template-page-subtitle, #64748b);
  border-radius: 6px;
  min-height: 32px;
  padding: 4px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.ntk-template-dashboard-workspace__filter small {
  color: inherit;
  opacity: 0.84;
}

.ntk-template-dashboard-workspace__filter--active {
  background: var(--ntk-primary, #512bd4);
  color: var(--ntk-text-on-primary, #ffffff);
}

.ntk-template-dashboard-workspace__views {
  margin-left: auto;
  display: inline-flex;
  gap: 4px;
  flex-wrap: wrap;
}

.ntk-template-dashboard-workspace__view {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 8px;
  min-height: 34px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  color: var(--ntk-template-page-subtitle, #64748b);
  cursor: pointer;
}

.ntk-template-dashboard-workspace__view--active {
  border-color: color-mix(in srgb, var(--ntk-primary, #512bd4) 45%, var(--ntk-template-page-border, #e2e8f0));
  background: color-mix(in srgb, var(--ntk-primary, #512bd4) 14%, white);
  color: var(--ntk-primary, #512bd4);
}

.ntk-template-dashboard-workspace__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.ntk-template-dashboard-workspace__metric {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 12px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.ntk-template-dashboard-workspace__metric-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-template-page-row-bg, #f1f5f9);
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-dashboard-workspace__metric-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ntk-template-dashboard-workspace__metric-main strong {
  font-size: 20px;
  line-height: 1.1;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard-workspace__metric-main span {
  font-size: 12px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-dashboard-workspace__metric-delta {
  font-size: 11px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-dashboard-workspace__metric--primary .ntk-template-dashboard-workspace__metric-icon,
.ntk-template-dashboard-workspace__metric--info .ntk-template-dashboard-workspace__metric-icon {
  background: color-mix(in srgb, var(--semantic-info-primary, #3b82f6) 14%, white);
  color: var(--semantic-info-primary, #3b82f6);
}

.ntk-template-dashboard-workspace__metric--success .ntk-template-dashboard-workspace__metric-icon {
  background: color-mix(in srgb, var(--semantic-success-primary, #22c55e) 14%, white);
  color: var(--semantic-success-primary, #22c55e);
}

.ntk-template-dashboard-workspace__metric--warning .ntk-template-dashboard-workspace__metric-icon {
  background: color-mix(in srgb, var(--semantic-warning-primary, #f59e0b) 16%, white);
  color: var(--semantic-warning-primary, #f59e0b);
}

.ntk-template-dashboard-workspace__metric--danger .ntk-template-dashboard-workspace__metric-icon {
  background: color-mix(in srgb, var(--semantic-error-primary, #ef4444) 14%, white);
  color: var(--semantic-error-primary, #ef4444);
}

.ntk-template-dashboard-workspace__panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.ntk-template-dashboard-workspace__panel {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 12px;
  text-align: left;
  cursor: pointer;
}

.ntk-template-dashboard-workspace__panel:hover {
  box-shadow: var(--ntk-template-surface-shadow-hover, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

.ntk-template-dashboard-workspace__panel:focus-visible {
  outline: 2px solid var(--ntk-border-focus, #512bd4);
  outline-offset: 2px;
}

.ntk-template-dashboard-workspace__panel-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ntk-template-page-subtitle, #64748b);
  font-size: 12px;
}

.ntk-template-dashboard-workspace__panel-value {
  display: block;
  margin-top: 8px;
  font-size: 24px;
  line-height: 1.1;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard-workspace__panel-description {
  margin: 8px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
  font-size: 12px;
}

.ntk-template-dashboard-workspace__lanes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
}

.ntk-template-dashboard-workspace__lane {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 220px;
}

.ntk-template-dashboard-workspace__lane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ntk-template-page-border, #e2e8f0);
}

.ntk-template-dashboard-workspace__lane-header h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard-workspace__lane-header span {
  min-width: 24px;
  min-height: 24px;
  border-radius: 999px;
  background: var(--ntk-template-page-row-bg, #f1f5f9);
  color: var(--ntk-template-page-subtitle, #64748b);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.ntk-template-dashboard-workspace__lane-empty {
  margin-top: 6px;
  border-radius: 8px;
  border: 1px dashed var(--ntk-template-page-border, #e2e8f0);
  color: var(--ntk-template-page-subtitle, #64748b);
  min-height: 96px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
}

.ntk-template-dashboard-workspace__lane-item {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 8px;
  background: var(--ntk-template-page-row-bg, #f8fafc);
  text-align: left;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  color: inherit;
}

.ntk-template-dashboard-workspace__lane-item:hover {
  border-color: color-mix(in srgb, var(--ntk-primary, #512bd4) 36%, var(--ntk-template-page-border, #e2e8f0));
}

.ntk-template-dashboard-workspace__lane-item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-dashboard-workspace__lane-item-subtitle {
  font-size: 12px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-dashboard-workspace__lane-item-meta {
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ntk-template-dashboard-workspace__lane-badge {
  min-height: 22px;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  background: color-mix(in srgb, var(--semantic-info-primary, #3b82f6) 14%, white);
  color: var(--semantic-info-primary, #3b82f6);
}

.ntk-template-dashboard-workspace__lane-assignee {
  font-size: 11px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

@media (max-width: 1024px) {
  .ntk-template-dashboard-workspace__hero {
    grid-template-columns: 1fr;
  }

  .ntk-template-dashboard-workspace__hero-actions {
    justify-content: flex-start;
  }

  .ntk-template-dashboard-workspace__views {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .ntk-template-dashboard-workspace__control-panel {
    align-items: stretch;
  }

  .ntk-template-dashboard-workspace__search {
    width: 100%;
  }

  .ntk-template-dashboard-workspace__filters,
  .ntk-template-dashboard-workspace__views {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
  }
}
</style>