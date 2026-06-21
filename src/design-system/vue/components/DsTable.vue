<template>
  <div :id="id" :class="classes" :data-testid="testId">
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
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="ntk-table__body">
        <tr v-if="rows.length === 0" class="ntk-table__row ntk-table__row--empty">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkTableDefaults,
  normalizeNtkClasses,
  resolveNtkTableRecipe,
  type NtkTableContract,
  type NtkTableRow,
} from '../../core'

defineOptions({
  name: 'DsTable',
})

const props = withDefaults(defineProps<NtkTableContract & {
  readonly selectAllLabel?: string
  readonly selectRowLabel?: (row: NtkTableRow) => string
}>(), {
  columns: () => [],
  rows: () => [],
  selectedKeys: () => [],
  variant: ntkTableDefaults.variant,
  size: ntkTableDefaults.size,
  intent: ntkTableDefaults.intent,
  selectable: false,
  emptyLabel: 'No records found',
  emptyValueLabel: '-',
  ariaLabel: 'Data table',
  selectAllLabel: 'Select all rows',
})

const emit = defineEmits<{
  'update:selectedKeys': [ids: string[]]
  'row-click': [rowId: string]
}>()

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
const classes = computed(() => resolveNtkTableRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  clickable: props.rows.length > 0,
  selected: selectedRows.value.length > 0,
  class: props.class,
}).classes)

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