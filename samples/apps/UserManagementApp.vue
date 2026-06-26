<template>
  <!-- Mocked user management screen built from the front-creation system:
       a single defineResource drives the list, filters, sort, server-mode
       pagination and the create/edit/delete dialog (DsCrudPage). Above it,
       a DsMetricGrid summary and a DsBadge status legend. No custom widgets,
       only library Ds* components; the store is in-memory. -->
  <div class="users">
    <header class="users__header">
      <div>
        <p class="users__kicker">Gestão de usuários</p>
        <h1 class="users__title">Usuários</h1>
        <p class="users__lead">
          Lista, busca, ordenação e CRUD a partir de um único
          <code>defineResource</code> &mdash; loja em memória, sem backend.
        </p>
      </div>
    </header>

    <DsMetricGrid
      :metrics="metrics"
      :columns="3"
      aria-label="Resumo de usuários"
    />

    <section class="users__legend" aria-label="Legenda de status">
      <span class="users__legend-title">Status</span>
      <DsBadge label="Active" intent="success" variant="soft" />
      <DsBadge label="Invited" intent="info" variant="soft" />
      <DsBadge label="Suspended" intent="danger" variant="soft" />
    </section>

    <DsCrudPage
      :resource="resource"
      id-prefix="users-crud"
      new-label="Novo usuário"
      edit-title="Editar usuário"
      search-label="Buscar"
      search-placeholder="Buscar por nome ou e-mail"
      empty-title="Nenhum usuário encontrado"
      empty-description="Ajuste a busca ou cadastre um novo usuário."
      @created="refreshMetrics"
      @updated="refreshMetrics"
      @deleted="refreshMetrics"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DsBadge,
  DsCrudPage,
  DsMetricGrid,
  defineResource,
  pushToast,
  type NtkMetricItem,
  type NtkQueryParams,
} from '../../index'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'invited' | 'suspended'
}

const roleLabels: Record<User['role'], string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}
const statusLabels: Record<User['status'], string> = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
}

// In-memory mocked store.
let store: User[] = [
  { id: 1, name: 'Ana Souza', email: 'ana@acme.co', role: 'admin', status: 'active' },
  { id: 2, name: 'Bruno Lima', email: 'bruno@acme.co', role: 'editor', status: 'active' },
  { id: 3, name: 'Carla Dias', email: 'carla@acme.co', role: 'viewer', status: 'invited' },
  { id: 4, name: 'Diego Reis', email: 'diego@acme.co', role: 'editor', status: 'suspended' },
  { id: 5, name: 'Elisa Nunes', email: 'elisa@acme.co', role: 'viewer', status: 'active' },
  { id: 6, name: 'Felipe Castro', email: 'felipe@acme.co', role: 'admin', status: 'active' },
  { id: 7, name: 'Gabriela Melo', email: 'gabriela@acme.co', role: 'editor', status: 'invited' },
  { id: 8, name: 'Heitor Pires', email: 'heitor@acme.co', role: 'viewer', status: 'active' },
  { id: 9, name: 'Isabela Rocha', email: 'isabela@acme.co', role: 'editor', status: 'active' },
  { id: 10, name: 'João Vieira', email: 'joao@acme.co', role: 'viewer', status: 'suspended' },
  { id: 11, name: 'Karina Alves', email: 'karina@acme.co', role: 'editor', status: 'active' },
  { id: 12, name: 'Lucas Barros', email: 'lucas@acme.co', role: 'viewer', status: 'invited' },
]
let nextId = 13

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 120))

// Metric summary (recomputed after every mutation).
const metrics = ref<NtkMetricItem[]>([])
function computeMetrics(): NtkMetricItem[] {
  const total = store.length
  const active = store.filter((user) => user.status === 'active').length
  const admins = store.filter((user) => user.role === 'admin').length
  return [
    { id: 'total', label: 'Total de usuários', value: String(total), intent: 'primary' },
    { id: 'active', label: 'Ativos', value: String(active), intent: 'success' },
    { id: 'admins', label: 'Admins', value: String(admins), intent: 'info' },
  ]
}
metrics.value = computeMetrics()
function refreshMetrics(): void {
  metrics.value = computeMetrics()
}

const resource = defineResource<Record<string, unknown>>({
  title: 'Usuários',
  rowKey: 'id',
  pageSize: 5,
  defaultSort: { field: 'name' },
  columns: [
    { field: 'name', label: 'Nome', sortable: true },
    { field: 'email', label: 'E-mail', sortable: true },
    { field: 'role', label: 'Perfil', sortable: true, format: (value) => roleLabels[value as User['role']] ?? String(value) },
    { field: 'status', label: 'Status', sortable: true, format: (value) => statusLabels[value as User['status']] ?? String(value) },
  ],
  form: [
    { field: 'name', type: 'text', label: 'Nome', required: true, minLength: 2 },
    { field: 'email', type: 'email', label: 'E-mail', required: true },
    {
      field: 'role',
      type: 'select',
      label: 'Perfil',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      field: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Invited', value: 'invited' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
  ],
  // Server-mode fetch: applies search, sort and pagination over the store and
  // returns { rows, total } so DsCrudPage renders real pagination controls.
  async fetch({ search, page = 1, pageSize = 5, sortBy, descending }: NtkQueryParams) {
    await settle()
    const term = (search ?? '').toLowerCase()
    let rows = term
      ? store.filter((user) =>
        user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term))
      : [...store]

    if (sortBy) {
      rows.sort((left, right) => {
        const a = String((left as unknown as Record<string, unknown>)[sortBy] ?? '')
        const b = String((right as unknown as Record<string, unknown>)[sortBy] ?? '')
        const order = a.localeCompare(b)
        return descending ? -order : order
      })
    }

    const total = rows.length
    const start = (page - 1) * pageSize
    rows = rows.slice(start, start + pageSize)
    return { rows: rows as unknown as Record<string, unknown>[], total }
  },
  async create(row) {
    await settle()
    store = [...store, { ...(row as unknown as User), id: nextId++ }]
    pushToast({ message: 'Usuário criado', intent: 'success' })
  },
  async update(row) {
    await settle()
    const next = row as unknown as User
    store = store.map((user) => (user.id === next.id ? { ...next } : user))
    pushToast({ message: 'Usuário atualizado', intent: 'success' })
  },
  async remove(row) {
    await settle()
    const target = row as unknown as User
    store = store.filter((user) => user.id !== target.id)
    pushToast({ message: 'Usuário removido', intent: 'warning' })
  },
})
</script>

<style scoped>
.users {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-lg);
}

.users__kicker {
  margin: 0 0 var(--ntk-spacing-xs);
  color: var(--ntk-primary);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-bold);
  text-transform: uppercase;
}

.users__title {
  margin: 0 0 var(--ntk-spacing-xs);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
}

.users__lead {
  margin: 0;
  max-inline-size: 44rem;
  color: var(--ntk-text-secondary);
}

.users__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  padding: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
}

.users__legend-title {
  margin-inline-end: var(--ntk-spacing-xs);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}
</style>