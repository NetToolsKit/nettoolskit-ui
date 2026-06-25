<template>
  <!-- Recipe: a standalone DsTable driven by a static fixture. Sorting and
       pagination are "server-style" props that we resolve locally over the
       fixture, plus a density toggle. No DsCrudPage, no Quasar, no custom CSS
       beyond the density control row (token-only). -->
  <div class="recipe-table">
    <div class="recipe-table__controls">
      <DsSelect
        id="recipe-table-density"
        class="recipe-table__density"
        label="Densidade"
        :model-value="density"
        :options="densityOptions"
        @update:model-value="onDensityChange"
      />
    </div>

    <DsTable
      caption="Pedidos recentes"
      :columns="columns"
      :rows="pageRows"
      :sort="sort"
      :pagination="pagination"
      :density="density"
      variant="striped"
      empty-label="Nenhum pedido encontrado"
      pagination-label="Paginação de pedidos"
      previous-page-label="Anterior"
      next-page-label="Próximo"
      @update:sort="onSort"
      @update:page="onPage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DsSelect,
  DsTable,
  ntkComponentDensities,
  type NtkComponentDensity,
  type NtkTableColumn,
  type NtkTableRow,
  type NtkTableSort,
} from '../../index'

const columns: NtkTableColumn[] = [
  { id: 'order', label: 'Pedido', sortable: true },
  { id: 'customer', label: 'Cliente', sortable: true },
  { id: 'total', label: 'Total', align: 'right', sortable: true },
  { id: 'status', label: 'Status' },
]

// Deterministic fixture — no backend, no product data.
const fixture: NtkTableRow[] = [
  { id: '1', cells: { order: 'PD-1001', customer: 'Ana Souza', total: 1280, status: 'Pago' } },
  { id: '2', cells: { order: 'PD-1002', customer: 'Bruno Lima', total: 540, status: 'Pendente' } },
  { id: '3', cells: { order: 'PD-1003', customer: 'Carla Dias', total: 990, status: 'Pago' } },
  { id: '4', cells: { order: 'PD-1004', customer: 'Diego Alves', total: 320, status: 'Cancelado' } },
  { id: '5', cells: { order: 'PD-1005', customer: 'Elena Rocha', total: 2100, status: 'Pago' } },
  { id: '6', cells: { order: 'PD-1006', customer: 'Fábio Nunes', total: 760, status: 'Pendente' } },
  { id: '7', cells: { order: 'PD-1007', customer: 'Gisele Matos', total: 1450, status: 'Pago' } },
]

const PAGE_SIZE = 4

const sort = ref<NtkTableSort | null>({ field: 'order', direction: 'asc' })
const page = ref(1)
const density = ref<NtkComponentDensity>('comfortable')

const densityOptions = ntkComponentDensities.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}))

const compareCells = (a: NtkTableRow, b: NtkTableRow, field: string): number => {
  const left = a.cells[field]
  const right = b.cells[field]
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }
  return String(left ?? '').localeCompare(String(right ?? ''))
}

// Sort + paginate locally — mirrors the shape a server endpoint would return.
const sortedRows = computed<NtkTableRow[]>(() => {
  if (!sort.value) {
    return fixture
  }
  const { field, direction } = sort.value
  const factor = direction === 'asc' ? 1 : -1
  return [...fixture].sort((a, b) => compareCells(a, b, field) * factor)
})

const pagination = computed(() => ({
  page: page.value,
  pageSize: PAGE_SIZE,
  total: fixture.length,
}))

const pageRows = computed<NtkTableRow[]>(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return sortedRows.value.slice(start, start + PAGE_SIZE)
})

const onSort = (next: NtkTableSort | null): void => {
  sort.value = next
  page.value = 1
}

const onPage = (next: number): void => {
  page.value = next
}

const onDensityChange = (next: string): void => {
  density.value = next as NtkComponentDensity
}
</script>

<style scoped>
.recipe-table {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
}

.recipe-table__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-md);
}

.recipe-table__density {
  min-width: 180px;
}
</style>