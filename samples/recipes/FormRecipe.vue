<template>
  <div class="recipe-form">
    <DsFormPage
      title="Cadastro de cliente"
      description="Formulário de duas colunas gerado a partir de um schema."
      :schema="schema"
      :model-value="values"
      submit-label="Cadastrar"
      reset-label="Limpar"
      @update:model-value="values = $event"
      @submit="onSubmit"
    />
    <p v-if="submitted" class="recipe-form__result">Enviado: {{ submitted }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DsFormPage, defineForm } from '../../index'

const schema = defineForm({
  columns: 2,
  fields: [
    { field: 'firstName', type: 'text', label: 'Nome', required: true },
    { field: 'lastName', type: 'text', label: 'Sobrenome', required: true },
    { field: 'email', type: 'email', label: 'E-mail', required: true },
    { field: 'age', type: 'number', label: 'Idade', min: 18, max: 120 },
    { field: 'bio', type: 'textarea', label: 'Bio' },
    { field: 'newsletter', type: 'switch', label: 'Receber novidades' },
  ],
})

const values = ref<Record<string, unknown>>({})
const submitted = ref<string | null>(null)

const onSubmit = (next: Record<string, unknown>): void => {
  submitted.value = JSON.stringify(next)
}
</script>

<style scoped>
.recipe-form__result {
  margin-block-start: var(--ntk-spacing-sm);
  color: var(--ntk-text-secondary);
  font-size: 0.875rem;
  word-break: break-all;
}
</style>