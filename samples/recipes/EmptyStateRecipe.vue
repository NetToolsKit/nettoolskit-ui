<template>
  <!-- Recipe: the three async surfaces a list screen needs. DsEmptyState owns the
       "no results" message + actions; DsStateBlock owns loading and error.
       Token-only layout, no Quasar, no hand-rolled spinners. -->
  <div class="recipe-empty">
    <DsEmptyState
      class="recipe-empty__panel"
      icon="🔍"
      title="Nenhum cliente encontrado"
      description="Ajuste os filtros ou cadastre o primeiro cliente para começar."
      variant="bordered"
    >
      <template #actions>
        <DsButton label="Limpar filtros" variant="outline" intent="primary" />
        <DsButton label="Novo cliente" intent="primary" />
      </template>
    </DsEmptyState>

    <DsStateBlock
      class="recipe-empty__panel"
      state="loading"
      title="Carregando clientes"
      description="Buscando os registros mais recentes."
    />

    <DsStateBlock
      class="recipe-empty__panel"
      state="error"
      icon="⚠️"
      title="Falha ao carregar"
      description="Não foi possível buscar os clientes. Tente novamente."
    >
      <template #actions>
        <DsButton label="Tentar de novo" intent="primary" />
      </template>
    </DsStateBlock>
  </div>
</template>

<script setup lang="ts">
// Pure presentation: each state is a static demo of the async surfaces.
import { DsButton, DsEmptyState, DsStateBlock } from '../../src/index'
</script>

<style scoped>
.recipe-empty {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--ntk-spacing-md);
}

.recipe-empty__panel {
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg);
}
</style>