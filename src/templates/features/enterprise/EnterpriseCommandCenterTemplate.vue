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
          :color="action.color || 'primary'"
          :disable="action.disable"
          :flat="action.flat ?? false"
          :outline="action.outline ?? false"
          :unelevated="action.unelevated ?? true"
          :aria-label="action.ariaLabel || action.label"
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

          <table class="ntk-template-enterprise-command__table">
            <thead>
              <tr>
                <th>{{ serviceNameLabel }}</th>
                <th>{{ serviceUptimeLabel }}</th>
                <th>{{ serviceSlaLabel }}</th>
                <th>{{ serviceOwnerLabel }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="service in filteredServices"
                :key="service.id"
                role="button"
                tabindex="0"
                @click="emit('service-click', service.id)"
                @keyup.enter.prevent="emit('service-click', service.id)"
                @keyup.space.prevent="emit('service-click', service.id)"
              >
                <td>
                  <span class="ntk-template-enterprise-command__service-name">
                    {{ service.name }}
                  </span>
                </td>
                <td>{{ service.uptime }}</td>
                <td>{{ service.sla }}</td>
                <td>{{ service.owner || emptyValueLabel }}</td>
              </tr>
            </tbody>
          </table>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type {
  TemplateEnterpriseAction,
  TemplateEnterpriseActivity,
  TemplateEnterpriseAlert,
  TemplateEnterpriseFilterOption,
  TemplateEnterpriseKpi,
  TemplateEnterpriseServiceHealth,
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
</script>

<style scoped lang="scss">
.ntk-template-enterprise-command {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--ntk-template-page-bg, #f8fafc);
}

.ntk-template-enterprise-command__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-template-enterprise-command__hero h1 {
  margin: 0;
  font-size: 20px;
}

.ntk-template-enterprise-command__hero p {
  margin: 4px 0 0;
  color: var(--ntk-template-page-subtitle, #64748b);
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
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-template-enterprise-command__search {
  width: min(320px, 100%);
  min-height: 42px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 8px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  color: var(--ntk-template-page-subtitle, #64748b);
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
}

.ntk-template-enterprise-command__filters {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-template-enterprise-command__filter {
  min-height: 32px;
  border: 0;
  background: transparent;
  border-radius: 6px;
  padding: 4px 10px;
  color: var(--ntk-template-page-subtitle, #64748b);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.ntk-template-enterprise-command__filter--active {
  background: var(--ntk-primary, #512bd4);
  color: var(--ntk-text-on-primary, #ffffff);
}

.ntk-template-enterprise-command__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 8px;
}

.ntk-template-enterprise-command__kpi {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, #ffffff);
  padding: 10px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.ntk-template-enterprise-command__kpi strong {
  display: block;
  color: var(--ntk-template-page-title, #1e293b);
  line-height: 1.15;
}

.ntk-template-enterprise-command__kpi span {
  color: var(--ntk-template-page-subtitle, #64748b);
  font-size: 12px;
}

.ntk-template-enterprise-command__kpi small {
  font-size: 11px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-enterprise-command__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ntk-template-enterprise-command__card {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
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
}

.ntk-template-enterprise-command__card-header span {
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

.ntk-template-enterprise-command__empty {
  min-height: 120px;
  border-radius: 8px;
  border: 1px dashed var(--ntk-template-page-border, #e2e8f0);
  color: var(--ntk-template-page-subtitle, #64748b);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
}

.ntk-template-enterprise-command__alert,
.ntk-template-enterprise-command__activity {
  width: 100%;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 8px;
  background: var(--ntk-template-page-row-bg, #f8fafc);
  margin-top: 8px;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.ntk-template-enterprise-command__alert-main strong,
.ntk-template-enterprise-command__activity-main strong {
  display: block;
  color: var(--ntk-template-page-title, #1e293b);
  font-size: 13px;
}

.ntk-template-enterprise-command__alert-main small,
.ntk-template-enterprise-command__activity-main small {
  display: block;
  margin-top: 2px;
  color: var(--ntk-template-page-subtitle, #64748b);
  font-size: 12px;
}

.ntk-template-enterprise-command__alert-meta,
.ntk-template-enterprise-command__activity-meta {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--ntk-template-page-subtitle, #64748b);
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
  border-bottom: 1px solid var(--ntk-template-page-border, #e2e8f0);
}

.ntk-template-enterprise-command__table th {
  font-size: 11px;
  color: var(--ntk-template-page-subtitle, #64748b);
  text-transform: uppercase;
}

.ntk-template-enterprise-command__table td {
  font-size: 13px;
  color: var(--ntk-template-page-text, #334155);
}

.ntk-template-enterprise-command__table tr[role='button'] {
  cursor: pointer;
}

.ntk-template-enterprise-command__table tr[role='button']:hover {
  background: color-mix(in srgb, var(--ntk-primary, #512bd4) 5%, white);
}

.ntk-template-enterprise-command__service-name {
  font-weight: 600;
  color: var(--ntk-template-page-title, #1e293b);
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
