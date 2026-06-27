<template>
  <div :id="id" :class="classes" :data-testid="testId" :aria-busy="loading ? 'true' : undefined">
    <div
      class="ntk-table__scroll"
      role="region"
      tabindex="0"
      :aria-label="scrollRegionLabel ?? ariaLabel"
    >
      <table class="ntk-table__table" :aria-label="caption ? undefined : ariaLabel">
      <caption v-if="caption" class="ntk-table__caption">
        {{ caption }}
      </caption>
      <thead class="ntk-table__head">
        <tr class="ntk-table__row ntk-table__row--head">
          <th v-if="selectable" scope="col" class="ntk-table__selection-cell">
            <input
              type="checkbox"
              class="ntk-table__selection-control"
              :checked="allRowsSelected"
              :aria-checked="selectionState"
              :aria-label="selectAllLabel"
              @change="onToggleAll"
            >
          </th>
          <th
            v-for="column in columns"
            :key="column.id"
            scope="col"
            class="ntk-table__header-cell"
            :class="`ntk-table__cell--align-${column.align ?? 'left'}`"
            :style="column.width ? { width: column.width } : undefined"
            :aria-sort="column.sortable ? ariaSortFor(column.id) : undefined"
          >
            <button
              v-if="column.sortable"
              type="button"
              class="ntk-table__sort"
              @click="onSort(column.id)"
            >
              <span class="ntk-table__sort-label">
                <slot :name="`header-${column.id}`" :column="column">{{ column.label }}</slot>
              </span>
              <span class="ntk-table__sort-indicator" aria-hidden="true">{{ sortIndicator(column.id) }}</span>
            </button>
            <template v-else>
              <slot :name="`header-${column.id}`" :column="column">{{ column.label }}</slot>
            </template>
          </th>
        </tr>
      </thead>
      <tbody class="ntk-table__body">
        <tr v-if="loading && rows.length === 0" class="ntk-table__row ntk-table__row--loading">
          <td class="ntk-table__loading-cell" :colspan="columnSpan">
            {{ loadingLabel }}
          </td>
        </tr>
        <tr v-else-if="rows.length === 0" class="ntk-table__row ntk-table__row--empty">
          <td class="ntk-table__empty-cell" :colspan="columnSpan">
            {{ emptyLabel }}
          </td>
        </tr>
        <tr
          v-for="row in rows"
          v-else
          :key="row.id"
          class="ntk-table__row"
          :class="rowClasses(row)"
          tabindex="0"
          @click="emit('row-click', row.id)"
          @keydown.enter.prevent="emit('row-click', row.id)"
          @keydown.space.prevent="emit('row-click', row.id)"
        >
          <td v-if="selectable" class="ntk-table__selection-cell" @click.stop>
            <input
              type="checkbox"
              class="ntk-table__selection-control"
              :checked="isSelected(row.id)"
              :aria-label="getSelectRowLabel(row)"
              @change="onToggleRow(row.id)"
            >
          </td>
          <td
            v-for="column in columns"
            :key="`${row.id}-${column.id}`"
            class="ntk-table__cell"
            :class="`ntk-table__cell--align-${column.align ?? 'left'}`"
          >
            <slot
              :name="`cell-${column.id}`"
              :row="row"
              :column="column"
              :value="row.cells[column.id]"
            >
              {{ formatCellValue(row.cells[column.id]) }}
            </slot>
          </td>
        </tr>
      </tbody>
      </table>
    </div>

    <nav v-if="pageInfo" class="ntk-table__pagination" :aria-label="paginationLabel">
      <span class="ntk-table__pagination-range">
        {{ pageInfo.startRow }}&ndash;{{ pageInfo.endRow }} / {{ pageInfo.total }}
      </span>
      <div class="ntk-table__pagination-controls">
        <button
          type="button"
          class="ntk-table__pagination-button"
          :disabled="!pageInfo.hasPrevious || loading"
          @click="onPage(pageInfo.page - 1)"
        >
          {{ previousPageLabel }}
        </button>
        <span class="ntk-table__pagination-page">{{ pageInfo.page }} / {{ pageInfo.totalPages }}</span>
        <button
          type="button"
          class="ntk-table__pagination-button"
          :disabled="!pageInfo.hasNext || loading"
          @click="onPage(pageInfo.page + 1)"
        >
          {{ nextPageLabel }}
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getNtkDensityClass,
  getNtkTableAriaSort,
  getNtkTablePageInfo,
  nextNtkTableSort,
  ntkTableDefaults,
  ntkTableRecipeClassMap,
  normalizeNtkClasses,
  resolveNtkTableRecipe,
  type NtkTableContract,
  type NtkTableRow,
  type NtkTableSort,
} from '../../core'

defineOptions({
  name: 'DsTable',
})

const props = withDefaults(defineProps<NtkTableContract & {
  readonly selectAllLabel?: string
  readonly selectRowLabel?: (row: NtkTableRow) => string
  readonly loadingLabel?: string
  readonly paginationLabel?: string
  readonly previousPageLabel?: string
  readonly nextPageLabel?: string
  /** Accessible name for the keyboard-focusable scroll region. */
  readonly scrollRegionLabel?: string
}>(), {
  columns: () => [],
  rows: () => [],
  selectedKeys: () => [],
  variant: ntkTableDefaults.variant,
  size: ntkTableDefaults.size,
  intent: ntkTableDefaults.intent,
  density: ntkTableDefaults.density,
  selectable: false,
  emptyLabel: 'No records found',
  emptyValueLabel: '-',
  ariaLabel: 'Data table',
  selectAllLabel: 'Select all rows',
  sort: null,
  pagination: null,
  loading: false,
  loadingLabel: 'Loading...',
  paginationLabel: 'Pagination',
  previousPageLabel: 'Previous',
  nextPageLabel: 'Next',
})

const emit = defineEmits<{
  'update:selectedKeys': [ids: string[]]
  'update:sort': [sort: NtkTableSort | null]
  'update:page': [page: number]
  'row-click': [rowId: string]
}>()

const pageInfo = computed(() => (props.pagination ? getNtkTablePageInfo(props.pagination) : null))

function ariaSortFor(columnId: string): 'ascending' | 'descending' | 'none' {
  return getNtkTableAriaSort(props.sort, columnId)
}

function sortIndicator(columnId: string): string {
  const state = ariaSortFor(columnId)
  if (state === 'ascending') {
    return '↑'
  }
  if (state === 'descending') {
    return '↓'
  }
  return '↕'
}

function onSort(columnId: string): void {
  emit('update:sort', nextNtkTableSort(props.sort, columnId))
}

function onPage(page: number): void {
  emit('update:page', page)
}

const selectedKeySet = computed(() => new Set(props.selectedKeys))
const selectedRows = computed(() => props.rows.filter(row => selectedKeySet.value.has(row.id)))
const allRowsSelected = computed(() => props.rows.length > 0 && selectedRows.value.length === props.rows.length)
const someRowsSelected = computed(() => selectedRows.value.length > 0 && !allRowsSelected.value)
const selectionState = computed(() => {
  if (someRowsSelected.value) {
    return 'mixed'
  }

  return allRowsSelected.value ? 'true' : 'false'
})
const columnSpan = computed(() => props.columns.length + (props.selectable ? 1 : 0))
const classes = computed(() => [
  ...resolveNtkTableRecipe({
    variant: props.variant,
    size: props.size,
    intent: props.intent,
    clickable: props.rows.length > 0,
    selected: selectedRows.value.length > 0,
    class: props.class,
  }).classes,
  getNtkDensityClass(ntkTableRecipeClassMap.root, props.density),
])

function isSelected(rowId: string): boolean {
  return selectedKeySet.value.has(rowId)
}

function rowClasses(row: NtkTableRow): string[] {
  return [
    ...normalizeNtkClasses(row.rowClass),
    isSelected(row.id) ? 'ntk-table__row--selected' : '',
  ].filter(Boolean)
}

function formatCellValue(value: unknown): string | number {
  if (value === null || value === undefined || value === '') {
    return props.emptyValueLabel
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return String(value)
}

function getSelectRowLabel(row: NtkTableRow): string {
  const firstReadableValue = props.columns
    .map(column => formatCellValue(row.cells[column.id]))
    .find(value => String(value).trim() && value !== props.emptyValueLabel)

  return props.selectRowLabel?.(row) ?? `Select row ${firstReadableValue ?? row.id}`
}

function onToggleAll(): void {
  if (allRowsSelected.value) {
    emit('update:selectedKeys', [])
    return
  }

  emit('update:selectedKeys', props.rows.map(row => row.id))
}

function onToggleRow(rowId: string): void {
  const nextSelectedKeys = new Set(selectedKeySet.value)

  if (nextSelectedKeys.has(rowId)) {
    nextSelectedKeys.delete(rowId)
  } else {
    nextSelectedKeys.add(rowId)
  }

  emit('update:selectedKeys', Array.from(nextSelectedKeys))
}
</script>

<style scoped>
.ntk-table {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
  font-family: var(--ntk-font-family);
  color: var(--ntk-text-primary);
}

/* Keyboard-focusable scroll container. Owns horizontal/vertical overflow so
   long/wide tables can be scrolled with the keyboard; the focus ring marks it
   as an interactive region for assistive tech. */
.ntk-table__scroll {
  overflow: auto;
  max-inline-size: 100%;
}

.ntk-table__scroll:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-table__table {
  inline-size: 100%;
  border-collapse: collapse;
  font-size: var(--ntk-font-size-sm);
}

.ntk-table__caption {
  margin-block-end: var(--ntk-spacing-sm);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  text-align: start;
  color: var(--ntk-text-secondary);
}

.ntk-table__header-cell {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border-block-end: 1px solid var(--ntk-border-color);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-secondary);
  white-space: nowrap;
}

.ntk-table__cell {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border-block-end: 1px solid var(--ntk-border-light);
  color: var(--ntk-text-primary);
}

/* Alignment helpers. */
.ntk-table__cell--align-left {
  text-align: start;
}

.ntk-table__cell--align-center {
  text-align: center;
}

.ntk-table__cell--align-right {
  text-align: end;
}

/* Density. Adjusts row height via cell block padding. Comfortable matches the
   baseline; compact tightens rows for data-dense grids, spacious relaxes them. */
.ntk-table--density-compact .ntk-table__header-cell,
.ntk-table--density-compact .ntk-table__cell,
.ntk-table--density-compact .ntk-table__selection-cell {
  padding-block: var(--ntk-spacing-xs);
}

.ntk-table--density-spacious .ntk-table__header-cell,
.ntk-table--density-spacious .ntk-table__cell,
.ntk-table--density-spacious .ntk-table__selection-cell {
  padding-block: var(--ntk-spacing-md);
}

/* Sizes. */
.ntk-table--size-sm .ntk-table__header-cell,
.ntk-table--size-sm .ntk-table__cell {
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
}

.ntk-table--size-lg .ntk-table__header-cell,
.ntk-table--size-lg .ntk-table__cell {
  padding-block: var(--ntk-spacing-md);
  padding-inline: var(--ntk-spacing-lg);
}

/* Variants. */
.ntk-table--variant-bordered .ntk-table__header-cell,
.ntk-table--variant-bordered .ntk-table__cell {
  border: 1px solid var(--ntk-border-color);
}

.ntk-table--variant-striped .ntk-table__body .ntk-table__row:nth-child(even) {
  background: var(--ntk-bg-secondary);
}

/* Row interaction. */
.ntk-table__body .ntk-table__row {
  transition: background-color var(--ntk-transition-fast);
}

.ntk-table__body .ntk-table__row:hover {
  background: var(--ntk-bg-hover);
}

.ntk-table__row:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: -2px;
}

.ntk-table__row--selected,
.ntk-table--has-selection .ntk-table__row--selected {
  background: var(--ntk-primary-light);
}

.ntk-table__selection-cell {
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border-block-end: 1px solid var(--ntk-border-light);
  text-align: center;
}

.ntk-table__selection-control {
  cursor: pointer;
}

.ntk-table__selection-control:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-table__empty-cell {
  padding: var(--ntk-spacing-lg);
  text-align: center;
  color: var(--ntk-text-muted);
}

.ntk-table__sort {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: var(--ntk-font-weight-bold);
  cursor: pointer;
}

.ntk-table__sort:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.ntk-table__sort-indicator {
  color: var(--ntk-text-muted);
  font-size: var(--ntk-font-size-sm);
}

.ntk-table__loading-cell {
  padding: var(--ntk-spacing-lg);
  text-align: center;
  color: var(--ntk-text-secondary);
}

.ntk-table__pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  padding-block-start: var(--ntk-spacing-sm);
}

.ntk-table__pagination-range,
.ntk-table__pagination-page {
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-sm);
}

.ntk-table__pagination-controls {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-table__pagination-button {
  padding: var(--ntk-spacing-xs) var(--ntk-spacing-sm);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-sm);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-primary);
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.ntk-table__pagination-button:hover:not(:disabled) {
  background: var(--ntk-bg-hover);
}

.ntk-table__pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ntk-table__pagination-button:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}
</style>