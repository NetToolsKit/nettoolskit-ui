<template>
  <DsPage class="ntk-crud-page">
    <DsPageHeader :title="resource.title" :description="resource.description">
      <template v-if="resource.create" #actions>
        <DsButton intent="primary" @click="openCreate">{{ newLabel }}</DsButton>
      </template>
    </DsPageHeader>

    <DsFilterBar
      v-if="searchable"
      :aria-label="`${resource.title} filters`"
      :loading="loading"
      @apply="reload"
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

    <DsStateBlock
      v-if="loading"
      state="loading"
      :title="loadingLabel"
    />
    <DsStateBlock
      v-else-if="error"
      state="error"
      :title="errorTitle"
      :description="error"
    />
    <DsEmptyState
      v-else-if="tableRows.length === 0"
      :title="emptyTitle"
      :description="emptyDescription"
    >
      <template v-if="resource.create" #actions>
        <DsButton intent="primary" @click="openCreate">{{ newLabel }}</DsButton>
      </template>
    </DsEmptyState>
    <DsTable
      v-else
      :columns="tableColumns"
      :rows="tableRows"
      :aria-label="resource.title"
    >
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
      />
    </DsDialog>
  </DsPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  createInitialValues,
  type NtkNormalizedResource,
  type NtkTableCellValue,
  type NtkTableRow,
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
  newLabel: 'Novo',
  editLabel: 'Editar',
  deleteLabel: 'Excluir',
  saveLabel: 'Salvar',
  cancelLabel: 'Cancelar',
  editTitle: 'Editar registro',
  searchLabel: 'Buscar',
  searchPlaceholder: 'Buscar...',
  loadingLabel: 'Carregando...',
  errorTitle: 'Não foi possível carregar',
  emptyTitle: 'Nenhum registro',
  emptyDescription: 'Não há dados para exibir.',
})

const emit = defineEmits<{
  created: [values: CrudRow]
  updated: [values: CrudRow]
  deleted: [row: CrudRow]
  error: [error: unknown]
}>()

const rows = ref<CrudRow[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const dialogOpen = ref(false)
const editing = ref<CrudRow | null>(null)
const formValues = ref<Record<string, unknown>>({})
const saving = ref(false)

// Monotonic token so a slow in-flight fetch can never overwrite a newer result.
let requestToken = 0

const searchable = computed(() => props.searchable && Boolean(props.resource.fetch))
const hasRowActions = computed(() => Boolean(props.resource.update || props.resource.remove))

const tableColumns = computed(() => {
  const columns = props.resource.columns.map((column) => ({
    id: column.field,
    label: column.label,
    align: column.align,
  }))
  if (hasRowActions.value) {
    columns.push({ id: '__actions', label: '', align: 'right' })
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

async function reload(): Promise<void> {
  const { fetch } = props.resource
  if (!fetch) {
    return
  }
  const token = ++requestToken
  loading.value = true
  error.value = null
  try {
    const result = await fetch({ search: search.value || undefined })
    if (token !== requestToken) {
      return
    }
    rows.value = [...result]
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

function onResetFilters(): void {
  search.value = ''
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