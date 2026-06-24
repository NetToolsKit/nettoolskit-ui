<template>
  <DsCrudPage :resource="resource" />
</template>

<script setup lang="ts">
// Recipe: a complete CRUD screen from a single resource definition.
// No custom CSS, no raw Quasar, no hand-rolled loading/empty/error states.
import { DsCrudPage, defineResource } from '../../index'

interface Person {
  id: number
  name: string
  email: string
  role: string
}

let store: Person[] = [
  { id: 1, name: 'Ana Souza', email: 'ana@acme.co', role: 'admin' },
  { id: 2, name: 'Bruno Lima', email: 'bruno@acme.co', role: 'user' },
  { id: 3, name: 'Carla Dias', email: 'carla@acme.co', role: 'user' },
]
let nextId = 4

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 150))

const resource = defineResource({
  title: 'Clientes',
  description: 'CRUD completo a partir de um schema — sem CSS, sem Quasar cru.',
  rowKey: 'id',
  columns: [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'E-mail' },
    { field: 'role', label: 'Perfil' },
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
        { label: 'Administrador', value: 'admin' },
        { label: 'Usuário', value: 'user' },
      ],
    },
  ],
  async fetch({ search }) {
    await settle()
    const term = (search ?? '').toLowerCase()
    return term ? store.filter((person) => person.name.toLowerCase().includes(term)) : store
  },
  async create(row) {
    await settle()
    store = [...store, { ...(row as Person), id: nextId++ }]
  },
  async update(row) {
    await settle()
    const next = row as Person
    store = store.map((person) => (person.id === next.id ? { ...next } : person))
  },
  async remove(row) {
    await settle()
    store = store.filter((person) => person.id !== (row as Person).id)
  },
})
</script>