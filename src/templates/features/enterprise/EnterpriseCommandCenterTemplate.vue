<template>
  <q-page
    class="ntk-template-enterprise-command"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-enterprise-command__hero">
      <div class="ntk-template-enterprise-command__hero-main">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <div class="ntk-template-enterprise-command__hero-actions">
        <q-btn
          v-for="action in actions"
          :key="action.id"
          no-caps
          :label="action.label"
          :icon="action.icon"
          :disable="action.disable"
          :flat="action.flat ?? false"
          :outline="action.outline ?? false"
          :unelevated="action.unelevated ?? true"
          :aria-label="action.ariaLabel || action.label"
          :class="resolveActionClass(action)"
          @click="emit('action-click', action.id)"
        />
      </div>
    </section>

    <section class="ntk-template-enterprise-command__toolbar">
      <div class="ntk-template-enterprise-command__search">
        <q-icon
          name="search"
          size="16px"
        />
        <input
          v-model="searchModel"
          type="text"
          name="enterprise-command-search"
          :placeholder="searchPlaceholder"
          :aria-label="searchAriaLabel"
        >
      </div>

      <div class="ntk-template-enterprise-command__filters">
      <button
        v-for="filter in resolvedFilters"
        :key="filter.id"
        type="button"
          class="ntk-template-enterprise-command__filter"
          :class="{ 'ntk-template-enterprise-command__filter--active': effectiveFilterId === filter.id }"
          @click="setFilter(filter.id)"
        >
          <span>{{ filter.label }}</span>
          <small v-if="filter.count !== undefined">{{ filter.count }}</small>
        </button>
      </div>
    </section>

    <section
      v-if="kpis.length > 0"
      class="ntk-template-enterprise-command__kpis"
      :aria-label="kpisAriaLabel"
    >
      <article
        v-for="kpi in kpis"
        :key="kpi.id"
        class="ntk-template-enterprise-command__kpi"
        :class="`ntk-template-enterprise-command__kpi--${kpi.tone || 'neutral'}`"
      >
        <q-icon
          :name="kpi.icon || 'insights'"
          size="18px"
        />
        <div>
          <strong>{{ kpi.value }}</strong>
          <span>{{ kpi.label }}</span>
        </div>
        <small v-if="kpi.delta">{{ kpi.delta }}</small>
      </article>
    </section>

    <section class="ntk-template-enterprise-command__grid">
      <q-card
        class="ntk-template-enterprise-command__card"
        :aria-label="alertsAriaLabel"
      >
        <q-card-section>
          <header class="ntk-template-enterprise-command__card-header">
            <h2>{{ alertsTitle }}</h2>
            <span>{{ filteredAlerts.length }}</span>
          </header>

          <div
            v-if="filteredAlerts.length === 0"
            class="ntk-template-enterprise-command__empty"
          >
            {{ emptyAlertsLabel }}
          </div>

          <button
          v-for="alert in filteredAlerts"
          :key="alert.id"
          type="button"
          class="ntk-template-enterprise-command__alert"
          :class="`ntk-template-enterprise-command__alert--${alert.severity || 'neutral'}`"
            @click="emit('alert-click', alert.id)"
          >
            <div class="ntk-template-enterprise-command__alert-main">
              <strong>{{ alert.title }}</strong>
              <small>{{ alert.summary || emptyValueLabel }}</small>
            </div>
            <div class="ntk-template-enterprise-command__alert-meta">
              <span>{{ alert.service || emptyValueLabel }}</span>
              <span>{{ alert.timeLabel || emptyValueLabel }}</span>
            </div>
          </button>
        </q-card-section>
      </q-card>

      <q-card
        class="ntk-template-enterprise-command__card"
        :aria-label="activitiesAriaLabel"
      >
        <q-card-section>
          <header class="ntk-template-enterprise-command__card-header">
            <h2>{{ activitiesTitle }}</h2>
            <span>{{ filteredActivities.length }}</span>
          </header>

          <div
            v-if="filteredActivities.length === 0"
            class="ntk-template-enterprise-command__empty"
          >
            {{ emptyActivitiesLabel }}
          </div>

          <button
          v-for="activity in filteredActivities"
          :key="activity.id"
          type="button"
          class="ntk-template-enterprise-command__activity"
          :class="`ntk-template-enterprise-command__activity--${activity.tone || 'neutral'}`"
          @click="emit('activity-click', activity.id)"
        >
            <div class="ntk-template-enterprise-command__activity-main">
              <strong>{{ activity.title }}</strong>
              <small>{{ activity.description || emptyValueLabel }}</small>
            </div>
            <div class="ntk-template-enterprise-command__activity-meta">
              <span>{{ activity.owner || emptyValueLabel }}</span>
              <span>{{ activity.timeLabel || emptyValueLabel }}</span>
            </div>
          </button>
        </q-card-section>
      </q-card>

      <q-card
        class="ntk-template-enterprise-command__card ntk-template-enterprise-command__card--wide"
        :aria-label="servicesAriaLabel"
      >
        <q-card-section>
          <header class="ntk-template-enterprise-command__card-header">
            <h2>{{ servicesTitle }}</h2>
            <span>{{ filteredServices.length }}</span>
          </header>

          <NtkDataTable
            class="ntk-template-enterprise-command__table"
            :aria-label="servicesAriaLabel"
            :columns="serviceTableColumns"
            :empty-value-label="emptyValueLabel"
            :rows="serviceTableRows"
            :selectable="false"
            :show-status="false"
            @row-click="serviceId => emit('service-click', serviceId)"
          >
            <template #cell-name="{ value }">
              <span class="ntk-template-enterprise-command__service-name">
                {{ value }}
              </span>
            </template>
          </NtkDataTable>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import NtkDataTable from '../../../components/ui/NtkDataTable.vue'
import type {
  TemplateEnterpriseAction,
  TemplateEnterpriseActivity,
  TemplateEnterpriseAlert,
  TemplateEnterpriseFilterOption,
  TemplateEnterpriseKpi,
  TemplateEnterpriseServiceHealth,
  TemplateEnterpriseTone,
} from './enterprise-template.types'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  actions?: TemplateEnterpriseAction[]
  kpis?: TemplateEnterpriseKpi[]
  alerts?: TemplateEnterpriseAlert[]
  activities?: TemplateEnterpriseActivity[]
  services?: TemplateEnterpriseServiceHealth[]
  filters?: TemplateEnterpriseFilterOption[]
  searchValue?: string
  activeFilterId?: string
  pageAriaLabel?: string
  searchPlaceholder?: string
  searchAriaLabel?: string
  kpisAriaLabel?: string
  alertsAriaLabel?: string
  activitiesAriaLabel?: string
  servicesAriaLabel?: string
  alertsTitle?: string
  activitiesTitle?: string
  servicesTitle?: string
  emptyAlertsLabel?: string
  emptyActivitiesLabel?: string
  emptyValueLabel?: string
  serviceNameLabel?: string
  serviceUptimeLabel?: string
  serviceSlaLabel?: string
  serviceOwnerLabel?: string
}>(), {
  title: 'Command center',
  subtitle: 'Enterprise operational visibility template for incidents, activities and service health.',
  actions: () => [],
  kpis: () => [],
  alerts: () => [],
  activities: () => [],
  services: () => [],
  filters: () => [],
  searchValue: '',
  activeFilterId: 'all',
  pageAriaLabel: 'Enterprise command center',
  searchPlaceholder: 'Search incidents, services or owners...',
  searchAriaLabel: 'Search command center',
  kpisAriaLabel: 'Operational key metrics',
  alertsAriaLabel: 'Incident alerts list',
  activitiesAriaLabel: 'Operational activities list',
  servicesAriaLabel: 'Service health table',
  alertsTitle: 'Alerts',
  activitiesTitle: 'Activities',
  servicesTitle: 'Service health',
  emptyAlertsLabel: 'No alerts found for the current criteria.',
  emptyActivitiesLabel: 'No activities found for the current criteria.',
  emptyValueLabel: '—',
  serviceNameLabel: 'Service',
  serviceUptimeLabel: 'Uptime',
  serviceSlaLabel: 'SLA',
  serviceOwnerLabel: 'Owner',
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeFilterId': [value: string]
  'action-click': [actionId: string]
  'alert-click': [alertId: string]
  'activity-click': [activityId: string]
  'service-click': [serviceId: string]
}>()

const searchModel = computed<string>({
  get: () => props.searchValue,
  set: value => emit('update:searchValue', value),
})

const actions = computed<TemplateEnterpriseAction[]>(() => props.actions)
const kpis = computed<TemplateEnterpriseKpi[]>(() => props.kpis)

const resolvedFilters = computed<TemplateEnterpriseFilterOption[]>(() => {
  if (props.filters.length > 0) {
    return props.filters
  }

  return [
    {
      id: 'all',
      label: 'All',
      count: props.alerts.length,
    },
    {
      id: 'critical',
      label: 'Critical',
      count: props.alerts.filter(item => item.severity === 'danger').length,
    },
    {
      id: 'warning',
      label: 'Warning',
      count: props.alerts.filter(item => item.severity === 'warning').length,
    },
  ]
})

const effectiveFilterId = computed<string>(() => {
  if (resolvedFilters.value.some(filter => filter.id === props.activeFilterId)) {
    return props.activeFilterId
  }

  return resolvedFilters.value[0]?.id || 'all'
})

const filteredAlerts = computed<TemplateEnterpriseAlert[]>(() => {
  const activeFilter = effectiveFilterId.value
  const search = searchModel.value.trim().toLowerCase()

  return props.alerts.filter(item => {
    if (!matchesFilter(item.filterKeys, item.severity, activeFilter)) {
      return false
    }

    if (!search) {
      return true
    }

    const text = [item.title, item.summary, item.service, item.statusLabel].filter(Boolean).join(' ').toLowerCase()
    return text.includes(search)
  })
})

const filteredActivities = computed<TemplateEnterpriseActivity[]>(() => {
  const activeFilter = effectiveFilterId.value
  const search = searchModel.value.trim().toLowerCase()

  return props.activities.filter(item => {
    if (!matchesFilter(item.filterKeys, item.tone, activeFilter)) {
      return false
    }

    if (!search) {
      return true
    }

    const text = [item.title, item.description, item.owner, item.stateLabel].filter(Boolean).join(' ').toLowerCase()
    return text.includes(search)
  })
})

const filteredServices = computed<TemplateEnterpriseServiceHealth[]>(() => {
  const activeFilter = effectiveFilterId.value
  const search = searchModel.value.trim().toLowerCase()

  return props.services.filter(item => {
    if (!matchesFilter(item.filterKeys, item.tone, activeFilter)) {
      return false
    }

    if (!search) {
      return true
    }

    const text = [item.name, item.owner, item.uptime, item.sla].filter(Boolean).join(' ').toLowerCase()
    return text.includes(search)
  })
})

const serviceTableColumns = computed(() => [
  { id: 'name', label: props.serviceNameLabel, emphasize: true },
  { id: 'uptime', label: props.serviceUptimeLabel },
  { id: 'sla', label: props.serviceSlaLabel },
  { id: 'owner', label: props.serviceOwnerLabel },
])

const serviceTableRows = computed(() => {
  return filteredServices.value.map(service => ({
    id: service.id,
    rowClass: `ntk-template-enterprise-command__service-row--${service.tone || 'neutral'}`,
    cells: {
      name: service.name,
      uptime: service.uptime,
      sla: service.sla,
      owner: service.owner || props.emptyValueLabel,
    },
  }))
})

function matchesFilter(
  filterKeys: string[] | undefined,
  tone: string | undefined,
  activeFilter: string
): boolean {
  if (activeFilter === 'all') {
    return true
  }

  if ((filterKeys || []).includes(activeFilter)) {
    return true
  }

  return tone === activeFilter
}

function setFilter(filterId: string): void {
  emit('update:activeFilterId', filterId)
}

function resolveActionClass(action: TemplateEnterpriseAction): string[] {
  const variant = action.flat ? 'flat' : action.outline ? 'outline' : 'solid'

  return [
    'ntk-template-tone-action',
    `ntk-template-tone-action--tone-${resolveActionTone(action.color, 'primary')}`,
    `ntk-template-tone-action--variant-${variant}`,
  ]
}

function resolveActionTone(
  color: string | undefined,
  fallback: TemplateEnterpriseTone,
): TemplateEnterpriseTone {
  const value = color?.trim().toLowerCase() ?? ''

  if (!value) {
    return fallback
  }

  if (['primary', 'accent', 'brand', 'blue', 'indigo', 'violet'].includes(value)) {
    return 'primary'
  }

  if (['info', 'cyan', 'teal'].includes(value)) {
    return 'info'
  }

  if (['positive', 'success', 'green'].includes(value)) {
    return 'success'
  }

  if (['warning', 'amber', 'orange', 'yellow'].includes(value)) {
    return 'warning'
  }

  if (['negative', 'danger', 'error', 'red'].includes(value)) {
    return 'danger'
  }

  if (
    value.startsWith('grey')
    || value.startsWith('gray')
    || ['neutral', 'slate', 'dark', 'secondary'].includes(value)
  ) {
    return 'neutral'
  }

  return fallback
}
</script>

<style scoped lang="scss">
.ntk-template-enterprise-command {
  --ntk-template-enterprise-accent: var(--ntk-template-page-accent, var(--ntk-primary, var(--ntk-accent, var(--semantic-info-primary, var(--ntk-info)))));
  --ntk-template-enterprise-on-accent: var(--ntk-template-page-on-accent, var(--ntk-text-on-primary, var(--ntk-on-primary, var(--ntk-text-inverse))));
  --ntk-template-enterprise-info: var(--ntk-template-notification-info, var(--ntk-template-page-info, var(--semantic-info-primary, var(--ntk-info))));
  --ntk-template-enterprise-positive: var(--ntk-template-notification-positive, var(--ntk-template-page-success, var(--semantic-success-primary, var(--ntk-success))));
  --ntk-template-enterprise-warning: var(--ntk-template-notification-warning, var(--ntk-template-page-warning, var(--semantic-warning-primary, var(--ntk-warning))));
  --ntk-template-enterprise-negative: var(--ntk-template-notification-negative, var(--ntk-template-page-error, var(--semantic-error-primary, var(--ntk-error))));
  --ntk-template-enterprise-surface: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  --ntk-template-enterprise-border: var(--ntk-template-page-border, var(--ntk-border-color));
  --ntk-template-enterprise-text: var(--ntk-template-page-title, var(--ntk-text-primary));
  --ntk-template-enterprise-body: var(--ntk-template-page-text, var(--ntk-template-enterprise-text));
  --ntk-template-enterprise-muted: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  --ntk-template-enterprise-row-bg: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));

  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--ntk-template-page-bg, var(--ntk-bg-secondary));
}

.ntk-template-enterprise-command__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--ntk-template-enterprise-border);
  border-radius: 12px;
  background: var(--ntk-template-enterprise-surface);
  color: var(--ntk-template-enterprise-text);
}

.ntk-template-enterprise-command__hero h1 {
  margin: 0;
  font-size: 20px;
  color: var(--ntk-template-enterprise-text);
}

.ntk-template-enterprise-command__hero p {
  margin: 4px 0 0;
  color: var(--ntk-template-enterprise-muted);
}

.ntk-template-enterprise-command__hero-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.ntk-template-enterprise-command__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px;
  border: 1px solid var(--ntk-template-enterprise-border);
  border-radius: 12px;
  background: var(--ntk-template-enterprise-surface);
}

.ntk-template-enterprise-command__search {
  width: min(320px, 100%);
  min-height: 42px;
  border: 1px solid var(--ntk-template-enterprise-border);
  border-radius: 8px;
  background: var(--ntk-template-enterprise-surface);
  color: var(--ntk-template-enterprise-muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.ntk-template-enterprise-command__search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ntk-template-enterprise-text);
}

.ntk-template-enterprise-command__search input::placeholder {
  color: color-mix(in srgb, var(--ntk-template-enterprise-muted) 78%, transparent);
}

.ntk-template-enterprise-command__filters {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--ntk-template-enterprise-border);
  background: var(--ntk-template-enterprise-surface);
}

.ntk-template-enterprise-command__filter {
  min-height: 32px;
  border: 0;
  background: transparent;
  border-radius: 6px;
  padding: 4px 10px;
  color: var(--ntk-template-enterprise-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.ntk-template-enterprise-command__filter--active {
  background: var(--ntk-template-enterprise-accent);
  color: var(--ntk-template-enterprise-on-accent);
}

.ntk-template-enterprise-command__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 8px;
}

.ntk-template-enterprise-command__kpi {
  border: 1px solid var(--ntk-template-enterprise-border);
  border-radius: 12px;
  background: var(--ntk-template-enterprise-surface);
  padding: 10px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.ntk-template-enterprise-command__kpi--primary,
.ntk-template-enterprise-command__kpi--info {
  border-color: color-mix(in srgb, var(--ntk-template-enterprise-info) 42%, var(--ntk-template-page-border, var(--ntk-border-color)));
  background: color-mix(in srgb, var(--ntk-template-enterprise-info) 10%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__kpi--success {
  border-color: color-mix(in srgb, var(--ntk-template-enterprise-positive) 42%, var(--ntk-template-page-border, var(--ntk-border-color)));
  background: color-mix(in srgb, var(--ntk-template-enterprise-positive) 10%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__kpi--warning {
  border-color: color-mix(in srgb, var(--ntk-template-enterprise-warning) 42%, var(--ntk-template-page-border, var(--ntk-border-color)));
  background: color-mix(in srgb, var(--ntk-template-enterprise-warning) 10%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__kpi--danger {
  border-color: color-mix(in srgb, var(--ntk-template-enterprise-negative) 42%, var(--ntk-template-page-border, var(--ntk-border-color)));
  background: color-mix(in srgb, var(--ntk-template-enterprise-negative) 10%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__kpi strong {
  display: block;
  color: var(--ntk-template-enterprise-text);
  line-height: 1.15;
}

.ntk-template-enterprise-command__kpi span {
  color: var(--ntk-template-enterprise-muted);
  font-size: 12px;
}

.ntk-template-enterprise-command__kpi small {
  font-size: 11px;
  color: var(--ntk-template-enterprise-muted);
}

.ntk-template-enterprise-command__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ntk-template-enterprise-command__card {
  border: 1px solid var(--ntk-template-enterprise-border);
  background: var(--ntk-template-enterprise-surface);
  color: var(--ntk-template-enterprise-text);
  box-shadow: none;
}

.ntk-template-enterprise-command__card :deep(.q-card__section) {
  color: inherit;
}

.ntk-template-enterprise-command__card--wide {
  grid-column: span 2;
}

.ntk-template-enterprise-command__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.ntk-template-enterprise-command__card-header h2 {
  margin: 0;
  font-size: 14px;
  color: var(--ntk-template-enterprise-text);
}

.ntk-template-enterprise-command__card-header span {
  min-width: 24px;
  min-height: 24px;
  border-radius: 999px;
  background: var(--ntk-template-enterprise-row-bg);
  color: var(--ntk-template-enterprise-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.ntk-template-enterprise-command__empty {
  min-height: 120px;
  border-radius: 8px;
  border: 1px dashed var(--ntk-template-enterprise-border);
  background: color-mix(in srgb, var(--ntk-template-enterprise-row-bg) 72%, transparent);
  color: var(--ntk-template-enterprise-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
}

.ntk-template-enterprise-command__alert,
.ntk-template-enterprise-command__activity {
  width: 100%;
  border: 1px solid var(--ntk-template-enterprise-border);
  border-radius: 8px;
  background: var(--ntk-template-enterprise-row-bg);
  margin-top: 8px;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.ntk-template-enterprise-command__alert--primary,
.ntk-template-enterprise-command__alert--info,
.ntk-template-enterprise-command__activity--primary,
.ntk-template-enterprise-command__activity--info,
.ntk-template-enterprise-command__service-row--primary,
.ntk-template-enterprise-command__service-row--info {
  background: color-mix(in srgb, var(--ntk-template-enterprise-info) 8%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__alert--success,
.ntk-template-enterprise-command__activity--success,
.ntk-template-enterprise-command__service-row--success {
  background: color-mix(in srgb, var(--ntk-template-enterprise-positive) 8%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__alert--warning,
.ntk-template-enterprise-command__activity--warning,
.ntk-template-enterprise-command__service-row--warning {
  background: color-mix(in srgb, var(--ntk-template-enterprise-warning) 8%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__alert--danger,
.ntk-template-enterprise-command__activity--danger,
.ntk-template-enterprise-command__service-row--danger {
  background: color-mix(in srgb, var(--ntk-template-enterprise-negative) 8%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__alert-main strong,
.ntk-template-enterprise-command__activity-main strong {
  display: block;
  color: var(--ntk-template-enterprise-text);
  font-size: 13px;
}

.ntk-template-enterprise-command__alert-main small,
.ntk-template-enterprise-command__activity-main small {
  display: block;
  margin-top: 2px;
  color: var(--ntk-template-enterprise-muted);
  font-size: 12px;
}

.ntk-template-enterprise-command__alert-meta,
.ntk-template-enterprise-command__activity-meta {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--ntk-template-enterprise-muted);
  font-size: 11px;
}

.ntk-template-enterprise-command__table {
  width: 100%;
  border-collapse: collapse;
}

.ntk-template-enterprise-command__table th,
.ntk-template-enterprise-command__table td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid var(--ntk-template-enterprise-border);
}

.ntk-template-enterprise-command__table th {
  font-size: 11px;
  color: var(--ntk-template-enterprise-muted);
  text-transform: uppercase;
  background: color-mix(in srgb, var(--ntk-template-enterprise-row-bg) 68%, transparent);
}

.ntk-template-enterprise-command__table td {
  font-size: 13px;
  color: var(--ntk-template-enterprise-body);
}

.ntk-template-enterprise-command__table tr[role='button'] {
  cursor: pointer;
}

.ntk-template-enterprise-command__table tr[role='button']:hover {
  background: color-mix(in srgb, var(--ntk-template-enterprise-accent) 5%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));
}

.ntk-template-enterprise-command__service-name {
  font-weight: 600;
  color: var(--ntk-template-enterprise-text);
}

.ntk-template-enterprise-command__service-row--neutral {
  background: transparent;
}

@media (max-width: 1024px) {
  .ntk-template-enterprise-command__hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .ntk-template-enterprise-command__hero-actions {
    justify-content: flex-start;
  }

  .ntk-template-enterprise-command__grid {
    grid-template-columns: 1fr;
  }

  .ntk-template-enterprise-command__card--wide {
    grid-column: auto;
  }
}
</style>
