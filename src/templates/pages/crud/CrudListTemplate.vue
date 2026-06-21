<template>
  <q-page
    class="ntk-template-crud-list"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-crud-list__hero">
      <div class="ntk-template-crud-list__hero-main">
        <h1 class="ntk-template-crud-list__title">
          {{ title }}
        </h1>
        <p class="ntk-template-crud-list__subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div class="ntk-template-crud-list__hero-actions">
        <q-btn
          v-for="action in actions"
          :key="action.id"
          no-caps
          :label="action.label"
          :icon="action.icon"
          :to="action.to"
          :disable="action.disable"
          :flat="action.flat ?? false"
          :outline="action.outline ?? false"
          :unelevated="action.unelevated ?? true"
          :aria-label="action.ariaLabel || action.label"
          :class="resolveActionClass(action, 'primary')"
          @click="emitAction(action.id)"
        />
      </div>
    </section>

    <section class="ntk-template-crud-list__toolbar">
      <div class="ntk-template-crud-list__search">
        <q-icon
          name="search"
          size="16px"
        />
        <input
          v-model="searchModel"
          type="text"
          name="crud-list-search"
          :placeholder="searchPlaceholder"
          :aria-label="searchAriaLabel"
          class="ntk-template-crud-list__search-input"
        >
      </div>

      <div class="ntk-template-crud-list__filters">
        <button
          v-for="filter in resolvedFilters"
          :key="filter.id"
          type="button"
          class="ntk-template-crud-list__filter"
          :class="{ 'ntk-template-crud-list__filter--active': effectiveFilterId === filter.id }"
          @click="setActiveFilter(filter.id)"
        >
          <span>{{ filter.label }}</span>
          <small v-if="filter.count !== undefined">{{ filter.count }}</small>
        </button>
      </div>

      <div class="ntk-template-crud-list__views">
        <button
          type="button"
          class="ntk-template-crud-list__view"
          :class="{ 'ntk-template-crud-list__view--active': viewModeModel === 'table' }"
          :aria-label="tableViewAriaLabel"
          @click="setViewMode('table')"
        >
          <q-icon
            name="view_list"
            size="16px"
          />
        </button>

        <button
          type="button"
          class="ntk-template-crud-list__view"
          :class="{ 'ntk-template-crud-list__view--active': viewModeModel === 'cards' }"
          :aria-label="cardsViewAriaLabel"
          @click="setViewMode('cards')"
        >
          <q-icon
            name="grid_view"
            size="16px"
          />
        </button>
      </div>
    </section>

    <section
      v-if="showMetricChips && resolvedMetrics.length > 0"
      class="ntk-template-crud-list__metrics"
      :aria-label="metricsAriaLabel"
    >
      <div
        v-for="metric in resolvedMetrics"
        :key="metric.id"
        class="ntk-template-crud-list__metric"
        :class="`ntk-template-crud-list__metric--${metric.tone || 'neutral'}`"
      >
        <q-icon
          :name="metric.icon || 'insights'"
          size="16px"
        />
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
      </div>
    </section>

    <section
      v-if="showBulkActions && selectedIds.length > 0 && bulkActions.length > 0"
      class="ntk-template-crud-list__bulk"
      :aria-label="bulkAriaLabel"
    >
      <span class="ntk-template-crud-list__bulk-label">{{ selectedSummaryLabel }}</span>
      <div class="ntk-template-crud-list__bulk-actions">
        <q-btn
          v-for="action in bulkActions"
          :key="action.id"
          dense
          no-caps
          :label="action.label"
          :icon="action.icon"
          :disable="action.disable"
          :flat="action.flat ?? false"
          :outline="action.outline ?? true"
          :unelevated="action.unelevated ?? false"
          :aria-label="action.ariaLabel || action.label"
          :class="resolveActionClass(action, 'primary')"
          @click="emitBulkAction(action.id)"
        />
      </div>
    </section>

    <section class="ntk-template-crud-list__surface">
      <div
        v-if="loading"
        class="ntk-template-crud-list__loading"
      >
        <q-skeleton
          v-for="index in 6"
          :key="index"
          type="rect"
          class="ntk-template-crud-list__loading-item"
        />
      </div>

      <div
        v-else-if="filteredRecords.length === 0"
        class="ntk-template-crud-list__empty"
      >
        <q-icon
          :name="emptyIcon"
          size="40px"
        />
        <h2>{{ emptyTitle }}</h2>
        <p>{{ emptySubtitle }}</p>
      </div>

      <div
        v-else-if="viewModeModel === 'table'"
        class="ntk-template-crud-list__table-wrap"
      >
        <NtkDataTable
          :aria-label="tableAriaLabel"
          :columns="columns"
          :empty-label="emptyTitle"
          :empty-value-label="emptyValueLabel"
          :rows="tableRows"
          :row-actions="rowActions"
          :selected-keys="selectedIds"
          :selectable="selectable"
          :status-label="tableStatusLabel"
          :actions-label="tableActionsLabel"
          @row-click="emitRowClick"
          @row-action-click="handleTableRowAction"
          @update:selected-keys="updateSelectedIds"
        />
      </div>

      <div
        v-else
        class="ntk-template-crud-list__cards"
        :aria-label="cardsAriaLabel"
      >
        <article
          v-for="record in filteredRecords"
          :key="record.id"
          class="ntk-template-crud-list__card"
          @click="emitRowClick(record.id)"
        >
          <header class="ntk-template-crud-list__card-header">
            <div class="ntk-template-crud-list__card-title-wrap">
              <h3 class="ntk-template-crud-list__card-title">
                {{ record.title }}
              </h3>
              <p
                v-if="record.subtitle"
                class="ntk-template-crud-list__card-subtitle"
              >
                {{ record.subtitle }}
              </p>
            </div>

            <span
              v-if="record.status"
              class="ntk-template-crud-list__status"
              :class="`ntk-template-crud-list__status--${record.status.tone || 'neutral'}`"
            >
              {{ record.status.label }}
            </span>
          </header>

          <dl class="ntk-template-crud-list__card-fields">
            <div
              v-for="column in cardColumns"
              :key="`${record.id}-${column.id}-card`"
              class="ntk-template-crud-list__card-field"
            >
              <dt>{{ column.label }}</dt>
              <dd>{{ resolveCellValue(record, column.id) }}</dd>
            </div>
          </dl>

          <div
            v-if="record.tags && record.tags.length > 0"
            class="ntk-template-crud-list__tags"
          >
            <span
              v-for="tag in record.tags.slice(0, 3)"
              :key="`${record.id}-${tag}`"
              class="ntk-template-crud-list__tag"
            >
              {{ tag }}
            </span>
          </div>

          <div
            v-if="rowActions.length > 0"
            class="ntk-template-crud-list__card-actions"
          >
            <button
              v-for="action in rowActions"
              :key="`${record.id}-${action.id}-card`"
              type="button"
              class="ntk-template-crud-list__row-action"
              :disabled="action.disable"
              :aria-label="action.ariaLabel || action.label || action.id"
              @click.stop="emitRowAction(action.id, record.id)"
            >
              <q-icon
                :name="action.icon"
                size="16px"
              />
            </button>
          </div>
        </article>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import NtkDataTable from '../../../components/ui/NtkDataTable.vue'
import type {
  TemplateCrudFilterOption,
  TemplateCrudListColumn,
  TemplateCrudListRecord,
  TemplateCrudMetricChip,
  TemplateCrudRowAction,
  TemplateCrudViewMode,
  TemplatePageAction,
  TemplatePageTone,
} from '../page-template.types'

type CrudDataTableRow = {
  id: string
  cells: Record<string, string>
  status?: TemplateCrudListRecord['status']
}

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  columns?: TemplateCrudListColumn[]
  records?: TemplateCrudListRecord[]
  filters?: TemplateCrudFilterOption[]
  metrics?: TemplateCrudMetricChip[]
  actions?: TemplatePageAction[]
  rowActions?: TemplateCrudRowAction[]
  bulkActions?: TemplatePageAction[]
  searchValue?: string
  activeFilterId?: string
  viewMode?: TemplateCrudViewMode
  selectedIds?: string[]
  selectable?: boolean
  loading?: boolean
  showMetricChips?: boolean
  showBulkActions?: boolean
  pageAriaLabel?: string
  searchPlaceholder?: string
  searchAriaLabel?: string
  tableAriaLabel?: string
  cardsAriaLabel?: string
  metricsAriaLabel?: string
  bulkAriaLabel?: string
  tableViewAriaLabel?: string
  cardsViewAriaLabel?: string
  tableStatusLabel?: string
  tableActionsLabel?: string
  selectedCountLabel?: string
  emptyTitle?: string
  emptySubtitle?: string
  emptyIcon?: string
  emptyValueLabel?: string
}>(), {
  title: 'Records',
  subtitle: 'Reusable CRUD list template for enterprise modules and dashboards.',
  columns: () => [],
  records: () => [],
  filters: () => [],
  metrics: () => [],
  actions: () => [],
  rowActions: () => [],
  bulkActions: () => [],
  searchValue: '',
  activeFilterId: 'all',
  viewMode: 'table',
  selectedIds: () => [],
  selectable: true,
  loading: false,
  showMetricChips: true,
  showBulkActions: true,
  pageAriaLabel: 'CRUD list workspace',
  searchPlaceholder: 'Search records...',
  searchAriaLabel: 'Search records',
  tableAriaLabel: 'Records table view',
  cardsAriaLabel: 'Records card view',
  metricsAriaLabel: 'CRUD metrics',
  bulkAriaLabel: 'Bulk actions',
  tableViewAriaLabel: 'Switch to table view',
  cardsViewAriaLabel: 'Switch to card view',
  tableStatusLabel: 'Status',
  tableActionsLabel: 'Actions',
  selectedCountLabel: '{count} selected',
  emptyTitle: 'No records found',
  emptySubtitle: 'Try changing the filters or create a new record.',
  emptyIcon: 'inbox',
  emptyValueLabel: '—',
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeFilterId': [value: string]
  'update:viewMode': [mode: TemplateCrudViewMode]
  'update:selectedIds': [ids: string[]]
  'action-click': [actionId: string]
  'row-click': [recordId: string]
  'row-action-click': [payload: { actionId: string; recordId: string }]
  'bulk-action-click': [payload: { actionId: string; selectedIds: string[] }]
}>()

const actions = computed<TemplatePageAction[]>(() => props.actions)
const bulkActions = computed<TemplatePageAction[]>(() => props.bulkActions)
const rowActions = computed<TemplateCrudRowAction[]>(() => props.rowActions)
const selectedIds = computed<string[]>(() => props.selectedIds)

const searchModel = computed<string>({
  get: () => props.searchValue,
  set: value => emit('update:searchValue', value),
})

const viewModeModel = computed<TemplateCrudViewMode>(() => {
  return props.viewMode
})

const resolvedFilters = computed<TemplateCrudFilterOption[]>(() => {
  if (props.filters.length > 0) {
    return props.filters
  }

  const statusCountMap = new Map<string, number>()
  props.records.forEach(record => {
    if (record.status?.value) {
      statusCountMap.set(
        record.status.value,
        (statusCountMap.get(record.status.value) || 0) + 1
      )
    }
  })

  const generated = [...statusCountMap.entries()].map(([id, count]) => ({
    id,
    label: id,
    count,
  }))

  return [
    {
      id: 'all',
      label: 'All',
      count: props.records.length,
    },
    ...generated,
  ]
})

const effectiveFilterId = computed<string>(() => {
  if (resolvedFilters.value.some(filter => filter.id === props.activeFilterId)) {
    return props.activeFilterId
  }

  return resolvedFilters.value[0]?.id || 'all'
})

const filteredRecords = computed<TemplateCrudListRecord[]>(() => {
  const activeFilter = effectiveFilterId.value
  const search = searchModel.value.trim().toLowerCase()

  return props.records.filter(record => {
    if (activeFilter !== 'all') {
      const byFilterKeys = (record.filterKeys || []).includes(activeFilter)
      const byStatus = record.status?.value === activeFilter
      if (!byFilterKeys && !byStatus) {
        return false
      }
    }

    if (!search) {
      return true
    }

    const valuesText = props.columns
      .map(column => resolveCellValue(record, column.id))
      .join(' ')

    const searchable = [
      record.title,
      record.subtitle,
      valuesText,
      record.status?.label,
      ...(record.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchable.includes(search)
  })
})

const resolvedMetrics = computed<TemplateCrudMetricChip[]>(() => {
  if (props.metrics.length > 0) {
    return props.metrics
  }

  return [
    { id: 'total', label: 'Total', value: props.records.length, icon: 'dataset', tone: 'info' },
    { id: 'visible', label: 'Visible', value: filteredRecords.value.length, icon: 'filter_list', tone: 'primary' },
    { id: 'selected', label: 'Selected', value: selectedIds.value.length, icon: 'task_alt', tone: 'success' },
  ]
})

const cardColumns = computed<TemplateCrudListColumn[]>(() => props.columns.slice(0, 3))

const tableRows = computed<CrudDataTableRow[]>(() => {
  return filteredRecords.value.map(record => ({
    id: record.id,
    cells: Object.fromEntries(
      props.columns.map(column => [column.id, resolveCellValue(record, column.id)])
    ),
    status: record.status,
  }))
})

const selectedSummaryLabel = computed<string>(() => {
  return props.selectedCountLabel.replace('{count}', String(selectedIds.value.length))
})

function setActiveFilter(filterId: string): void {
  emit('update:activeFilterId', filterId)
}

function setViewMode(mode: TemplateCrudViewMode): void {
  emit('update:viewMode', mode)
}

function emitAction(actionId: string): void {
  emit('action-click', actionId)
}

function emitBulkAction(actionId: string): void {
  emit('bulk-action-click', {
    actionId,
    selectedIds: [...selectedIds.value],
  })
}

function resolveActionClass(
  action: TemplatePageAction,
  fallbackTone: TemplatePageTone,
): string[] {
  const variant = action.flat ? 'flat' : action.outline ? 'outline' : 'solid'

  return [
    'ntk-template-tone-action',
    `ntk-template-tone-action--tone-${resolveActionTone(action.color, fallbackTone)}`,
    `ntk-template-tone-action--variant-${variant}`,
  ]
}

function resolveActionTone(
  color: string | undefined,
  fallback: TemplatePageTone,
): TemplatePageTone {
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

function emitRowClick(recordId: string): void {
  emit('row-click', recordId)
}

function emitRowAction(actionId: string, recordId: string): void {
  emit('row-action-click', { actionId, recordId })
}

function handleTableRowAction(payload: { actionId: string; rowId: string }): void {
  emitRowAction(payload.actionId, payload.rowId)
}

function updateSelectedIds(ids: string[]): void {
  emit('update:selectedIds', ids)
}

function resolveCellValue(record: TemplateCrudListRecord, columnId: string): string {
  const value = record.values[columnId]
  if (value === null || value === undefined || value === '') {
    return props.emptyValueLabel
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}
</script>

<style scoped lang="scss">
.ntk-template-crud-list {
  --ntk-template-crud-list-surface: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  --ntk-template-crud-list-surface-muted: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));
  --ntk-template-crud-list-text: var(--ntk-template-page-title, var(--ntk-text-primary));
  --ntk-template-crud-list-muted: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  --ntk-template-crud-list-filter-active-bg: var(--ntk-template-semantic-accent-emphasis-bg);
  --ntk-template-crud-list-filter-active-text: var(--ntk-template-semantic-accent-emphasis-text);
  --ntk-template-crud-list-filter-active-border: var(--ntk-template-semantic-accent-emphasis-border);
  --ntk-template-crud-list-tone-neutral-bg: var(--ntk-template-semantic-neutral-emphasis-bg);
  --ntk-template-crud-list-tone-neutral-text: var(--ntk-template-semantic-neutral-emphasis-text);
  --ntk-template-crud-list-tone-neutral-border: var(--ntk-template-semantic-neutral-emphasis-border);
  --ntk-template-crud-list-tone-accent-bg: var(--ntk-template-semantic-accent-emphasis-bg);
  --ntk-template-crud-list-tone-accent-text: var(--ntk-template-semantic-accent-emphasis-text);
  --ntk-template-crud-list-tone-accent-border: var(--ntk-template-semantic-accent-emphasis-border);
  --ntk-template-crud-list-tone-info-bg: var(--ntk-template-semantic-info-emphasis-bg);
  --ntk-template-crud-list-tone-info-text: var(--ntk-template-semantic-info-emphasis-text);
  --ntk-template-crud-list-tone-info-border: var(--ntk-template-semantic-info-emphasis-border);
  --ntk-template-crud-list-tone-success-bg: var(--ntk-template-semantic-success-emphasis-bg);
  --ntk-template-crud-list-tone-success-text: var(--ntk-template-semantic-success-emphasis-text);
  --ntk-template-crud-list-tone-success-border: var(--ntk-template-semantic-success-emphasis-border);
  --ntk-template-crud-list-tone-warning-bg: var(--ntk-template-semantic-warning-emphasis-bg);
  --ntk-template-crud-list-tone-warning-text: var(--ntk-template-semantic-warning-emphasis-text);
  --ntk-template-crud-list-tone-warning-border: var(--ntk-template-semantic-warning-emphasis-border);
  --ntk-template-crud-list-tone-danger-bg: var(--ntk-template-semantic-danger-emphasis-bg);
  --ntk-template-crud-list-tone-danger-text: var(--ntk-template-semantic-danger-emphasis-text);
  --ntk-template-crud-list-tone-danger-border: var(--ntk-template-semantic-danger-emphasis-border);
  --ntk-template-crud-list-bulk-bg: var(--ntk-template-crud-list-tone-info-bg);
  --ntk-template-crud-list-bulk-border: var(--ntk-template-crud-list-tone-info-border);
  --ntk-template-crud-list-bulk-text: var(--ntk-template-crud-list-tone-info-text);

  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--ntk-template-page-bg, var(--ntk-bg-secondary));
}

.ntk-template-crud-list__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: var(--ntk-template-surface-radius, 12px);
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  padding: 14px 16px;
}

.ntk-template-crud-list__title {
  margin: 0;
  font-size: 20px;
  color: var(--ntk-template-page-title, var(--ntk-text-primary));
}

.ntk-template-crud-list__subtitle {
  margin: 4px 0 0;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
}

.ntk-template-crud-list__hero-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.ntk-template-crud-list__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-radius: var(--ntk-template-surface-radius, 12px);
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  padding: 8px;
}

.ntk-template-crud-list__search {
  width: min(320px, 100%);
  min-height: var(--ntk-template-form-control-height, 44px);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  border-radius: var(--ntk-template-form-control-radius, 8px);
  background: var(--ntk-template-form-control-bg, var(--ntk-bg-card));
  color: var(--ntk-template-form-icon-color, var(--ntk-text-secondary));
  padding: 0 10px;
}

.ntk-template-crud-list__search-input {
  border: 0;
  background: transparent;
  outline: 0;
  color: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
  width: 100%;
  font-size: 13px;
}

.ntk-template-crud-list__filters {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
}

.ntk-template-crud-list__filter {
  border: 0;
  background: transparent;
  color: var(--ntk-template-crud-list-muted);
  border-radius: 6px;
  min-height: 32px;
  padding: 4px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.ntk-template-crud-list__filter--active {
  background: var(--ntk-template-crud-list-filter-active-bg);
  color: var(--ntk-template-crud-list-filter-active-text);
  box-shadow: inset 0 0 0 1px var(--ntk-template-crud-list-filter-active-border);
}

.ntk-template-crud-list__views {
  margin-left: auto;
  display: inline-flex;
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  border-radius: 8px;
  overflow: hidden;
}

.ntk-template-crud-list__view {
  width: 34px;
  height: 34px;
  border: 0;
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  cursor: pointer;
}

.ntk-template-crud-list__view--active {
  background: var(--ntk-template-crud-list-filter-active-bg);
  color: var(--ntk-template-crud-list-filter-active-text);
  box-shadow: inset 0 0 0 1px var(--ntk-template-crud-list-filter-active-border);
}

.ntk-template-crud-list__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ntk-template-crud-list__metric {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  border-radius: 999px;
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  padding: 4px 10px;
  font-size: 12px;
}

.ntk-template-crud-list__metric--neutral {
  border-color: var(--ntk-template-crud-list-tone-neutral-border);
  background: var(--ntk-template-crud-list-tone-neutral-bg);
  color: var(--ntk-template-crud-list-tone-neutral-text);
}

.ntk-template-crud-list__metric strong {
  color: var(--ntk-template-page-title, var(--ntk-text-primary));
  font-size: 13px;
}

.ntk-template-crud-list__metric--primary {
  border-color: var(--ntk-template-crud-list-tone-accent-border);
  background: var(--ntk-template-crud-list-tone-accent-bg);
  color: var(--ntk-template-crud-list-tone-accent-text);
}

.ntk-template-crud-list__metric--info {
  border-color: var(--ntk-template-crud-list-tone-info-border);
  background: var(--ntk-template-crud-list-tone-info-bg);
  color: var(--ntk-template-crud-list-tone-info-text);
}

.ntk-template-crud-list__metric--success {
  border-color: var(--ntk-template-crud-list-tone-success-border);
  background: var(--ntk-template-crud-list-tone-success-bg);
  color: var(--ntk-template-crud-list-tone-success-text);
}

.ntk-template-crud-list__metric--warning {
  border-color: var(--ntk-template-crud-list-tone-warning-border);
  background: var(--ntk-template-crud-list-tone-warning-bg);
  color: var(--ntk-template-crud-list-tone-warning-text);
}

.ntk-template-crud-list__metric--danger {
  border-color: var(--ntk-template-crud-list-tone-danger-border);
  background: var(--ntk-template-crud-list-tone-danger-bg);
  color: var(--ntk-template-crud-list-tone-danger-text);
}

.ntk-template-crud-list__bulk {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: var(--ntk-template-surface-radius, 12px);
  border: 1px solid var(--ntk-template-crud-list-bulk-border);
  background: var(--ntk-template-crud-list-bulk-bg);
  padding: 10px 12px;
}

.ntk-template-crud-list__bulk-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ntk-template-crud-list-bulk-text);
}

.ntk-template-crud-list__bulk-actions {
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ntk-template-crud-list__surface {
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  border-radius: var(--ntk-template-surface-radius, 12px);
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  min-height: 240px;
  overflow: hidden;
}

.ntk-template-crud-list__loading {
  padding: 12px;
  display: grid;
  gap: 8px;
}

.ntk-template-crud-list__loading-item {
  height: 36px;
  border-radius: 8px;
}

.ntk-template-crud-list__empty {
  min-height: 240px;
  padding: 28px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
}

.ntk-template-crud-list__empty h2 {
  margin: 0;
  font-size: 20px;
  color: var(--ntk-template-page-title, var(--ntk-text-primary));
}

.ntk-template-crud-list__empty p {
  margin: 0;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
}

.ntk-template-crud-list__table-wrap {
  width: 100%;
  overflow-x: auto;
}

.ntk-template-crud-list__status {
  min-height: 24px;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 2px 9px;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-template-crud-list-surface-muted);
  color: var(--ntk-template-crud-list-muted);
}

.ntk-template-crud-list__status--neutral {
  background: var(--ntk-template-crud-list-tone-neutral-bg);
  border-color: var(--ntk-template-crud-list-tone-neutral-border);
  color: var(--ntk-template-crud-list-tone-neutral-text);
}

.ntk-template-crud-list__status--primary {
  background: var(--ntk-template-crud-list-tone-accent-bg);
  border-color: var(--ntk-template-crud-list-tone-accent-border);
  color: var(--ntk-template-crud-list-tone-accent-text);
}

.ntk-template-crud-list__status--info {
  background: var(--ntk-template-crud-list-tone-info-bg);
  border-color: var(--ntk-template-crud-list-tone-info-border);
  color: var(--ntk-template-crud-list-tone-info-text);
}

.ntk-template-crud-list__status--success {
  background: var(--ntk-template-crud-list-tone-success-bg);
  border-color: var(--ntk-template-crud-list-tone-success-border);
  color: var(--ntk-template-crud-list-tone-success-text);
}

.ntk-template-crud-list__status--warning {
  background: var(--ntk-template-crud-list-tone-warning-bg);
  border-color: var(--ntk-template-crud-list-tone-warning-border);
  color: var(--ntk-template-crud-list-tone-warning-text);
}

.ntk-template-crud-list__status--danger {
  background: var(--ntk-template-crud-list-tone-danger-bg);
  border-color: var(--ntk-template-crud-list-tone-danger-border);
  color: var(--ntk-template-crud-list-tone-danger-text);
}

.ntk-template-crud-list__card-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ntk-template-crud-list__row-action {
  width: 28px;
  height: 28px;
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  border-radius: 7px;
  background: var(--ntk-template-crud-list-surface-muted);
  color: var(--ntk-template-crud-list-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ntk-template-crud-list__row-action:hover {
  background: var(--ntk-template-page-row-hover-bg, var(--ntk-bg-hover, var(--ntk-template-crud-list-surface-muted)));
}

.ntk-template-crud-list__cards {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}

.ntk-template-crud-list__card {
  border: 1px solid var(--ntk-template-page-border, var(--ntk-border-color));
  border-radius: 12px;
  background: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
}

.ntk-template-crud-list__card:hover {
  box-shadow: var(--ntk-template-surface-shadow-hover, 0 4px 6px -1px color-mix(in srgb, var(--ntk-text-primary) 10%, transparent));
}

.ntk-template-crud-list__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.ntk-template-crud-list__card-title {
  margin: 0;
  font-size: 15px;
  color: var(--ntk-template-page-title, var(--ntk-text-primary));
}

.ntk-template-crud-list__card-subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
}

.ntk-template-crud-list__card-fields {
  margin: 0;
  display: grid;
  gap: 6px;
}

.ntk-template-crud-list__card-field {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.ntk-template-crud-list__card-field dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
}

.ntk-template-crud-list__card-field dd {
  margin: 0;
  font-size: 13px;
  color: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
  text-align: right;
}

.ntk-template-crud-list__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.ntk-template-crud-list__tag {
  min-height: 22px;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  background: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));
  color: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
}

@media (max-width: 1024px) {
  .ntk-template-crud-list__hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .ntk-template-crud-list__hero-actions {
    justify-content: flex-start;
  }

  .ntk-template-crud-list__views {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .ntk-template-crud-list__search {
    width: 100%;
  }

  .ntk-template-crud-list__filters {
    width: 100%;
    overflow-x: auto;
  }

  .ntk-template-crud-list__bulk {
    flex-direction: column;
    align-items: flex-start;
  }

  .ntk-template-crud-list__bulk-actions {
    margin-left: 0;
  }
}
</style>
