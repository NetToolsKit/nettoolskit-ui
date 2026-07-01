<template>
  <DsPage class="ntk-crud-page">
    <DsPageHeader :title="resource.title" :description="resource.description">
      <template v-if="resource.create || $slots['header-actions']" #actions>
        <slot name="header-actions" />
        <DsButton v-if="resource.create" intent="primary" @click="openCreate">{{ newLabel }}</DsButton>
      </template>
    </DsPageHeader>

    <DsFilterBar
      v-if="searchable"
      :aria-label="`${resource.title} filters`"
      :loading="loading"
      @apply="onApplyFilters"
      @reset="onResetFilters"
    >
      <template #search>
        <DsInput
          :id="`${idPrefix}-search`"
          type="search"
          :label="searchLabel"
          :placeholder="searchPlaceholder"
          :model-value="search"
          @update:model-value="search = $event"
        />
      </template>
    </DsFilterBar>

    <template v-if="loading">
      <slot name="loading">
        <DsStateBlock state="loading" :title="loadingLabel" />
      </slot>
    </template>
    <template v-else-if="error">
      <slot name="error" :error="error" :retry="reload">
        <DsStateBlock state="error" :title="errorTitle" :description="error" />
      </slot>
    </template>
    <template v-else-if="tableRows.length === 0">
      <slot name="empty" :open-create="openCreate">
        <DsEmptyState :title="emptyTitle" :description="emptyDescription">
          <template v-if="resource.create" #actions>
            <DsButton intent="primary" @click="openCreate">{{ newLabel }}</DsButton>
          </template>
        </DsEmptyState>
      </slot>
    </template>
    <DsTable
      v-else
      :columns="tableColumns"
      :rows="tableRows"
      :aria-label="resource.title"
      :sort="sort"
      :pagination="pagination"
      :loading="loading"
      @update:sort="onSortChange"
      @update:page="onPageChange"
    >
      <template v-for="name in forwardedTableSlots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope" />
      </template>
      <template v-if="hasRowActions" #cell-__actions="{ row }">
        <div class="ntk-crud-page__row-actions">
          <DsButton
            v-if="resource.update"
            size="sm"
            variant="ghost"
            @click="openEdit(row.id)"
          >{{ editLabel }}</DsButton>
          <DsButton
            v-if="resource.remove"
            size="sm"
            variant="ghost"
            intent="danger"
            @click="onDelete(row.id)"
          >{{ deleteLabel }}</DsButton>
          <slot name="row-actions" :row="domainRow(row.id)" />
        </div>
      </template>
    </DsTable>

    <DsDialog
      v-model="dialogOpen"
      :id="`${idPrefix}-dialog`"
      :title="editing ? editTitle : newLabel"
    >
      <DsForm
        :id-prefix="`${idPrefix}-form`"
        :schema="resource.form"
        :model-value="formValues"
        :loading="saving"
        :submit-label="saveLabel"
        :reset-label="cancelLabel"
        @update:model-value="formValues = $event"
        @submit="onSubmit"
        @reset="dialogOpen = false"
      >
        <template v-for="name in forwardedFormFieldSlots" :key="name" #[formFieldTarget(name)]="scope">
          <slot :name="name" v-bind="scope" />
        </template>
      </DsForm>
    </DsDialog>
  </DsPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots } from 'vue'
import {
  createInitialValues,
  normalizeFetchResult,
  type NtkNormalizedResource,
  type NtkQueryParams,
  type NtkTableCellValue,
  type NtkTablePagination,
  type NtkTableRow,
  type NtkTableSort,
} from '../../core'
import DsButton from './DsButton.vue'
import DsDialog from './DsDialog.vue'
import DsEmptyState from './DsEmptyState.vue'
import DsFilterBar from './DsFilterBar.vue'
import DsForm from './DsForm.vue'
import DsInput from './DsInput.vue'
import DsPage from './DsPage.vue'
import DsPageHeader from './DsPageHeader.vue'
import DsStateBlock from './DsStateBlock.vue'
import DsTable from './DsTable.vue'
import { useNtkI18n } from '../composables/useNtkI18n'

type CrudRow = Record<string, unknown>

defineOptions({
  name: 'DsCrudPage',
})

const props = withDefaults(defineProps<{
  readonly resource: NtkNormalizedResource<CrudRow>
  readonly searchable?: boolean
  readonly idPrefix?: string
  readonly newLabel?: string
  readonly editLabel?: string
  readonly deleteLabel?: string
  readonly saveLabel?: string
  readonly cancelLabel?: string
  readonly editTitle?: string
  readonly searchLabel?: string
  readonly searchPlaceholder?: string
  readonly loadingLabel?: string
  readonly errorTitle?: string
  readonly emptyTitle?: string
  readonly emptyDescription?: string
}>(), {
  searchable: true,
  idPrefix: 'ds-crud',
})

const emit = defineEmits<{
  created: [values: CrudRow]
  updated: [values: CrudRow]
  deleted: [row: CrudRow]
  error: [error: unknown]
}>()

// Built-in labels resolve from the active locale dictionary; an explicit
// label prop always wins (see core/i18n).
const { t } = useNtkI18n()
const newLabel = computed(() => props.newLabel ?? t('crud.new'))
const editLabel = computed(() => props.editLabel ?? t('crud.edit'))
const deleteLabel = computed(() => props.deleteLabel ?? t('crud.delete'))
const saveLabel = computed(() => props.saveLabel ?? t('crud.save'))
const cancelLabel = computed(() => props.cancelLabel ?? t('crud.cancel'))
const editTitle = computed(() => props.editTitle ?? t('crud.editTitle'))
const searchLabel = computed(() => props.searchLabel ?? t('crud.search'))
const searchPlaceholder = computed(() => props.searchPlaceholder ?? t('crud.searchPlaceholder'))
const loadingLabel = computed(() => props.loadingLabel ?? t('crud.loading'))
const errorTitle = computed(() => props.errorTitle ?? t('crud.errorTitle'))
const emptyTitle = computed(() => props.emptyTitle ?? t('crud.emptyTitle'))
const emptyDescription = computed(() => props.emptyDescription ?? t('crud.emptyDescription'))

const rows = ref<CrudRow[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const dialogOpen = ref(false)
const editing = ref<CrudRow | null>(null)
const formValues = ref<Record<string, unknown>>({})
const saving = ref(false)
const page = ref(1)
const pageSize = ref(props.resource.pageSize ?? 10)
const total = ref(0)
const sort = ref<NtkTableSort | null>(
  props.resource.defaultSort
    ? {
        field: props.resource.defaultSort.field,
        direction: props.resource.defaultSort.descending ? 'desc' : 'asc',
      }
    : null,
)

// Monotonic token so a slow in-flight fetch can never overwrite a newer result.
let requestToken = 0

const slots = useSlots()

// Curated slot forwarding (see docs/architecture/extension-model.md):
// `cell-<field>`/`header-<field>` pass straight through to DsTable with the
// same scope. `cell-__actions` stays internal (extend via `row-actions`) and
// `header-actions` is reserved for the page header, not a table column.
const forwardedTableSlots = computed(() =>
  Object.keys(slots).filter(name =>
    (name.startsWith('cell-') || name.startsWith('header-'))
    && name !== 'cell-__actions'
    && name !== 'header-actions',
  ),
)

const FORM_FIELD_SLOT_PREFIX = 'form-field-'
const forwardedFormFieldSlots = computed(() =>
  Object.keys(slots).filter(name => name.startsWith(FORM_FIELD_SLOT_PREFIX)),
)
const formFieldTarget = (name: string): string =>
  `field-${name.slice(FORM_FIELD_SLOT_PREFIX.length)}`

const searchable = computed(() => props.searchable && Boolean(props.resource.fetch))
const hasRowActions = computed(() =>
  Boolean(props.resource.update || props.resource.remove || slots['row-actions']),
)
const paginated = computed(() => Boolean(props.resource.pageSize))
const pagination = computed<NtkTablePagination | null>(() => (
  paginated.value ? { page: page.value, pageSize: pageSize.value, total: total.value } : null
))

const tableColumns = computed(() => {
  const columns = props.resource.columns.map((column) => ({
    id: column.field,
    label: column.label,
    align: column.align,
    sortable: column.sortable ?? false,
  }))
  if (hasRowActions.value) {
    columns.push({ id: '__actions', label: '', align: 'right', sortable: false })
  }
  return columns
})

const rowsById = computed(() => {
  const map = new Map<string, CrudRow>()
  for (const row of rows.value) {
    map.set(String(row[props.resource.rowKey]), row)
  }
  return map
})

/** Resolve the original domain row for a table row id (used by `row-actions`). */
const domainRow = (rowId: string): CrudRow => rowsById.value.get(rowId) ?? { id: rowId }

const toCellValue = (value: unknown): NtkTableCellValue => {
  if (value === null || value === undefined) {
    return value
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }
  return String(value)
}

const tableRows = computed<NtkTableRow[]>(() =>
  rows.value.map((row) => {
    const cells: Record<string, NtkTableCellValue> = {}
    for (const column of props.resource.columns) {
      const raw = row[column.field]
      cells[column.field] = column.format ? column.format(raw, row) : toCellValue(raw)
    }
    return { id: String(row[props.resource.rowKey]), cells }
  }),
)

function buildParams(): NtkQueryParams {
  return {
    search: search.value || undefined,
    ...(paginated.value ? { page: page.value, pageSize: pageSize.value } : {}),
    ...(sort.value ? { sortBy: sort.value.field, descending: sort.value.direction === 'desc' } : {}),
  }
}

async function reload(): Promise<void> {
  const { fetch } = props.resource
  if (!fetch) {
    return
  }
  const token = ++requestToken
  loading.value = true
  error.value = null
  try {
    const result = await fetch(buildParams())
    if (token !== requestToken) {
      return
    }
    const normalized = normalizeFetchResult(result)
    rows.value = normalized.rows
    total.value = normalized.total
  } catch (cause) {
    if (token !== requestToken) {
      return
    }
    error.value = cause instanceof Error ? cause.message : String(cause)
    emit('error', cause)
  } finally {
    if (token === requestToken) {
      loading.value = false
    }
  }
}

function onApplyFilters(): void {
  page.value = 1
  void reload()
}

function onResetFilters(): void {
  search.value = ''
  page.value = 1
  void reload()
}

function onSortChange(next: NtkTableSort | null): void {
  sort.value = next
  page.value = 1
  void reload()
}

function onPageChange(next: number): void {
  page.value = next
  void reload()
}

function openCreate(): void {
  editing.value = null
  formValues.value = createInitialValues(props.resource.form)
  dialogOpen.value = true
}

function openEdit(rowId: string): void {
  const row = rowsById.value.get(rowId)
  if (!row) {
    return
  }
  editing.value = row
  formValues.value = createInitialValues(props.resource.form, row)
  dialogOpen.value = true
}

async function onSubmit(values: Record<string, unknown>): Promise<void> {
  saving.value = true
  try {
    if (editing.value) {
      const merged = { ...editing.value, ...values }
      await props.resource.update?.(merged)
      emit('updated', merged)
    } else {
      await props.resource.create?.(values)
      emit('created', values)
    }
    dialogOpen.value = false
    await reload()
  } catch (cause) {
    emit('error', cause)
  } finally {
    saving.value = false
  }
}

async function onDelete(rowId: string): Promise<void> {
  const row = rowsById.value.get(rowId)
  if (!row || !props.resource.remove) {
    return
  }
  try {
    await props.resource.remove(row)
    emit('deleted', row)
    await reload()
  } catch (cause) {
    emit('error', cause)
  }
}

onMounted(reload)

defineExpose({ reload })
</script>

<style scoped>
.ntk-crud-page {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-lg);
}

.ntk-crud-page__row-actions {
  display: flex;
  gap: var(--ntk-spacing-xs);
  justify-content: flex-end;
}
</style>