<template>
  <QTable
    class="ntk-data-table"
    flat
    :aria-label="ariaLabel"
    :columns="quasarColumns"
    :hide-bottom="true"
    :hide-pagination="true"
    :no-data-label="emptyLabel"
    :pagination="tablePagination"
    :row-key="rowKey"
    :rows="rows"
    :rows-per-page-options="[0]"
    :selected="selectedRows"
    :selection="selectable ? 'multiple' : 'none'"
    :table-row-class-fn="resolveRowClass"
    role="region"
    @row-click="handleRowClick"
    @update:selected="handleSelectedRowsUpdate"
  >
    <template
      v-for="column in columns"
      :key="column.id"
      #[`body-cell-${column.id}`]="cellProps"
    >
      <QTd
        :props="cellProps"
        :class="[
          column.emphasize ? 'ntk-data-table__cell--emphasis' : '',
          `ntk-data-table__cell--${column.id}`,
        ]"
      >
        <slot
          :name="`cell-${column.id}`"
          :row="cellProps.row"
          :column="column"
          :value="resolveCellValue(cellProps.row, column.id)"
        >
          {{ resolveCellValue(cellProps.row, column.id) }}
        </slot>
      </QTd>
    </template>

    <template #body-cell-status="cellProps">
      <QTd
        :props="cellProps"
        class="ntk-data-table__status-cell"
      >
        <span
          v-if="cellProps.row.status"
          class="ntk-data-table__status"
          :class="`ntk-data-table__status--${cellProps.row.status.tone || 'neutral'}`"
        >
          {{ cellProps.row.status.label }}
        </span>
        <span v-else>{{ emptyValueLabel }}</span>
      </QTd>
    </template>

    <template #body-cell-actions="cellProps">
      <QTd
        :props="cellProps"
        auto-width
        class="ntk-data-table__actions-cell"
        @click.stop
      >
        <button
          v-for="action in rowActions"
          :key="`${cellProps.row.id}-${action.id}`"
          type="button"
          class="ntk-data-table__row-action"
          :disabled="action.disable"
          :aria-label="action.ariaLabel || action.label || action.id"
          @click.stop="emitRowAction(action.id, cellProps.row.id)"
        >
          <QIcon
            :name="action.icon"
            size="16px"
          />
        </button>
      </QTd>
    </template>
  </QTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QIcon, QTable, QTd, type QTableColumn } from 'quasar'

defineOptions({
  name: 'NtkDataTable',
})

type NtkDataTableTone =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

interface NtkDataTableColumn {
  id: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
  emphasize?: boolean
  sortable?: boolean
}

interface NtkDataTableStatus {
  value?: string
  label: string
  tone?: NtkDataTableTone
}

interface NtkDataTableRow {
  id: string
  cells: Record<string, string | number | boolean | null | undefined>
  status?: NtkDataTableStatus
  rowClass?: string
}

interface NtkDataTableRowAction {
  id: string
  icon: string
  label?: string
  ariaLabel?: string
  disable?: boolean
}

const props = withDefaults(defineProps<{
  rows?: NtkDataTableRow[]
  columns?: NtkDataTableColumn[]
  rowActions?: NtkDataTableRowAction[]
  selectedKeys?: string[]
  rowKey?: string
  selectable?: boolean
  showStatus?: boolean
  ariaLabel?: string
  statusLabel?: string
  actionsLabel?: string
  emptyLabel?: string
  emptyValueLabel?: string
}>(), {
  rows: () => [],
  columns: () => [],
  rowActions: () => [],
  selectedKeys: () => [],
  rowKey: 'id',
  selectable: true,
  showStatus: true,
  ariaLabel: 'Data table',
  statusLabel: 'Status',
  actionsLabel: 'Actions',
  emptyLabel: 'No records found',
  emptyValueLabel: '-',
})

const emit = defineEmits<{
  'update:selectedKeys': [ids: string[]]
  'row-click': [rowId: string]
  'row-action-click': [payload: { actionId: string; rowId: string }]
}>()

const tablePagination = {
  rowsPerPage: 0,
}

const quasarColumns = computed<QTableColumn<NtkDataTableRow>[]>(() => {
  const dataColumns = props.columns.map((column): QTableColumn<NtkDataTableRow> => ({
    name: column.id,
    label: column.label,
    field: row => resolveCellValue(row, column.id),
    align: column.align ?? 'left',
    sortable: column.sortable ?? false,
    style: column.width ? `width: ${column.width}` : undefined,
    classes: column.emphasize ? 'ntk-data-table__cell--emphasis' : undefined,
    headerClasses: 'ntk-data-table__header-cell',
  }))

  const utilityColumns: QTableColumn<NtkDataTableRow>[] = []

  if (props.showStatus) {
    utilityColumns.push({
      name: 'status',
      label: props.statusLabel,
      field: row => row.status?.label ?? props.emptyValueLabel,
      align: 'left',
      sortable: false,
      headerClasses: 'ntk-data-table__header-cell ntk-data-table__header-cell--status',
      classes: 'ntk-data-table__status-cell',
    })
  }

  if (props.rowActions.length > 0) {
    utilityColumns.push({
      name: 'actions',
      label: props.actionsLabel,
      field: () => '',
      align: 'right',
      sortable: false,
      headerClasses: 'ntk-data-table__header-cell ntk-data-table__header-cell--actions',
      classes: 'ntk-data-table__actions-cell',
    })
  }

  return [...dataColumns, ...utilityColumns]
})

const selectedKeySet = computed<Set<string>>(() => new Set(props.selectedKeys))

const selectedRows = computed<NtkDataTableRow[]>(() => {
  return props.rows.filter(row => selectedKeySet.value.has(row.id))
})

function resolveCellValue(row: NtkDataTableRow, columnId: string): string | number | boolean {
  const value = row.cells[columnId]
  if (value === null || value === undefined || value === '') {
    return props.emptyValueLabel
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return value
}

function handleSelectedRowsUpdate(nextRows: readonly NtkDataTableRow[]): void {
  emit('update:selectedKeys', nextRows.map(row => row.id))
}

function handleRowClick(_event: Event, row: NtkDataTableRow): void {
  emit('row-click', row.id)
}

function resolveRowClass(row: NtkDataTableRow): string {
  return row.rowClass ?? ''
}

function emitRowAction(actionId: string, rowId: string): void {
  emit('row-action-click', { actionId, rowId })
}
</script>

<style scoped lang="scss">
.ntk-data-table {
  --ntk-data-table-surface: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  --ntk-data-table-row-bg: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));
  --ntk-data-table-row-hover-bg: var(--ntk-template-page-row-hover-bg, var(--ntk-bg-hover, var(--ntk-data-table-row-bg)));
  --ntk-data-table-border: var(--ntk-template-page-border, var(--ntk-border-color));
  --ntk-data-table-text: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
  --ntk-data-table-title: var(--ntk-template-page-title, var(--ntk-text-primary));
  --ntk-data-table-muted: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  --ntk-data-table-tone-neutral-bg: var(--ntk-template-semantic-neutral-emphasis-bg);
  --ntk-data-table-tone-neutral-text: var(--ntk-template-semantic-neutral-emphasis-text);
  --ntk-data-table-tone-neutral-border: var(--ntk-template-semantic-neutral-emphasis-border);
  --ntk-data-table-tone-primary-bg: var(--ntk-template-semantic-accent-emphasis-bg);
  --ntk-data-table-tone-primary-text: var(--ntk-template-semantic-accent-emphasis-text);
  --ntk-data-table-tone-primary-border: var(--ntk-template-semantic-accent-emphasis-border);
  --ntk-data-table-tone-info-bg: var(--ntk-template-semantic-info-emphasis-bg);
  --ntk-data-table-tone-info-text: var(--ntk-template-semantic-info-emphasis-text);
  --ntk-data-table-tone-info-border: var(--ntk-template-semantic-info-emphasis-border);
  --ntk-data-table-tone-success-bg: var(--ntk-template-semantic-success-emphasis-bg);
  --ntk-data-table-tone-success-text: var(--ntk-template-semantic-success-emphasis-text);
  --ntk-data-table-tone-success-border: var(--ntk-template-semantic-success-emphasis-border);
  --ntk-data-table-tone-warning-bg: var(--ntk-template-semantic-warning-emphasis-bg);
  --ntk-data-table-tone-warning-text: var(--ntk-template-semantic-warning-emphasis-text);
  --ntk-data-table-tone-warning-border: var(--ntk-template-semantic-warning-emphasis-border);
  --ntk-data-table-tone-danger-bg: var(--ntk-template-semantic-danger-emphasis-bg);
  --ntk-data-table-tone-danger-text: var(--ntk-template-semantic-danger-emphasis-text);
  --ntk-data-table-tone-danger-border: var(--ntk-template-semantic-danger-emphasis-border);

  width: 100%;
  overflow-x: auto;
  border: 0;
  border-radius: 0;
  background: var(--ntk-data-table-surface);
  color: var(--ntk-data-table-text);
}

.ntk-data-table :deep(.q-table__container),
.ntk-data-table :deep(.q-table__middle),
.ntk-data-table :deep(.q-table) {
  background: var(--ntk-data-table-surface);
  color: var(--ntk-data-table-text);
}

.ntk-data-table :deep(.q-table th) {
  border-bottom: 1px solid var(--ntk-data-table-border);
  color: var(--ntk-data-table-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 10px 12px;
  text-transform: uppercase;
}

.ntk-data-table :deep(.q-table td) {
  border-bottom: 1px solid var(--ntk-data-table-border);
  color: var(--ntk-data-table-text);
  padding: 10px 12px;
}

.ntk-data-table :deep(.q-table tbody tr) {
  cursor: pointer;
}

.ntk-data-table :deep(.q-table tbody tr:hover td),
.ntk-data-table :deep(.q-table tbody tr.q-tr--selected td) {
  background: var(--ntk-data-table-row-hover-bg);
}

.ntk-data-table :deep(.q-checkbox__inner) {
  color: var(--ntk-data-table-muted);
}

.ntk-data-table :deep(.q-checkbox__inner--truthy),
.ntk-data-table :deep(.q-checkbox__inner--indet) {
  color: var(--ntk-data-table-tone-primary-text);
}

.ntk-data-table :deep(.q-table__bottom) {
  border-top: 1px solid var(--ntk-data-table-border);
  background: var(--ntk-data-table-surface);
  color: var(--ntk-data-table-muted);
}

.ntk-data-table :deep(.ntk-data-table__cell--emphasis) {
  color: var(--ntk-data-table-title);
  font-weight: 600;
}

.ntk-data-table__status {
  min-height: 24px;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 2px 9px;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-data-table-row-bg);
  color: var(--ntk-data-table-muted);
}

.ntk-data-table__status--neutral {
  background: var(--ntk-data-table-tone-neutral-bg);
  border-color: var(--ntk-data-table-tone-neutral-border);
  color: var(--ntk-data-table-tone-neutral-text);
}

.ntk-data-table__status--primary {
  background: var(--ntk-data-table-tone-primary-bg);
  border-color: var(--ntk-data-table-tone-primary-border);
  color: var(--ntk-data-table-tone-primary-text);
}

.ntk-data-table__status--info {
  background: var(--ntk-data-table-tone-info-bg);
  border-color: var(--ntk-data-table-tone-info-border);
  color: var(--ntk-data-table-tone-info-text);
}

.ntk-data-table__status--success {
  background: var(--ntk-data-table-tone-success-bg);
  border-color: var(--ntk-data-table-tone-success-border);
  color: var(--ntk-data-table-tone-success-text);
}

.ntk-data-table__status--warning {
  background: var(--ntk-data-table-tone-warning-bg);
  border-color: var(--ntk-data-table-tone-warning-border);
  color: var(--ntk-data-table-tone-warning-text);
}

.ntk-data-table__status--danger {
  background: var(--ntk-data-table-tone-danger-bg);
  border-color: var(--ntk-data-table-tone-danger-border);
  color: var(--ntk-data-table-tone-danger-text);
}

.ntk-data-table__actions-cell {
  white-space: nowrap;
}

.ntk-data-table__row-action {
  width: 28px;
  height: 28px;
  border: 1px solid var(--ntk-data-table-border);
  border-radius: 7px;
  background: var(--ntk-data-table-row-bg);
  color: var(--ntk-data-table-title);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ntk-data-table__row-action + .ntk-data-table__row-action {
  margin-left: 4px;
}

.ntk-data-table__row-action:hover {
  background: var(--ntk-data-table-row-hover-bg);
}

.ntk-data-table__row-action:disabled {
  cursor: not-allowed;
  opacity: 0.56;
}
</style>
