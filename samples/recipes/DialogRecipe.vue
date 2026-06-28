<template>
  <div class="recipe-dialog">
    <DsButton label="Editar perfil" intent="primary" @click="open = true" />
    <p v-if="saved" class="recipe-dialog__result">Salvo: {{ saved }}</p>

    <DsDialog
      id="recipe-dialog"
      v-model="open"
      title="Editar perfil"
      description="Formulário em diálogo acessível, montado a partir de um schema."
    >
      <DsForm
        :schema="schema"
        :model-value="values"
        :show-reset="false"
        submit-label="Salvar"
        @update:model-value="values = $event"
        @submit="onSubmit"
      />
    </DsDialog>
  </div>
</template>

<script setup lang="ts">
// Recipe: a schema form inside an accessible modal dialog.
// No custom CSS for the dialog/form; DsDialog owns focus trap + Esc/backdrop,
// DsForm owns layout, validation and submit.
import { ref } from 'vue'
import { DsButton, DsDialog, DsForm, defineForm } from '../../src/index'

const schema = defineForm({
  fields: [
    { field: 'name', type: 'text', label: 'Nome', required: true, minLength: 2 },
    { field: 'email', type: 'email', label: 'E-mail', required: true },
  ],
})

const open = ref(false)
const values = ref<Record<string, unknown>>({ name: 'Ana Souza', email: 'ana@acme.co' })
const saved = ref<string | null>(null)

const onSubmit = (next: Record<string, unknown>): void => {
  saved.value = JSON.stringify(next)
  open.value = false
}
</script>

<style scoped>
.recipe-dialog__result {
  margin-block-start: var(--ntk-spacing-sm);
  color: var(--ntk-text-secondary);
  font-size: 0.875rem;
  word-break: break-all;
}
</style>