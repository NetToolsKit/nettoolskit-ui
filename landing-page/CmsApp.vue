<template>
  <NtkAppShell
    v-bind="shellConfig"
    v-model:active-item="activeMenuId"
    v-model:search-value="searchQuery"
    :items="filteredItems"
  >
    <template #default="{ activeItem }">
      <div class="cms-shell-page">
        <div class="cms-shell-page__hero">
          <h1>{{ activeItem.label }}</h1>
          <p>{{ activeItem.description || 'Selecione um modulo no menu lateral.' }}</p>
        </div>

        <div class="cms-shell-page__grid">
          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Padrão Sentinela Aplicado</strong>
              <q-chip dense square color="green-1" text-color="green-9" icon="check_circle">OK</q-chip>
            </div>
            <q-separator />
            <div class="cms-shell-card__body">
              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="check" color="positive" /></q-item-section>
                  <q-item-section>Menu lateral com compressao no rodape</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="check" color="positive" /></q-item-section>
                  <q-item-section>Hover com deslocamento horizontal e destaque</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="check" color="positive" /></q-item-section>
                  <q-item-section>Estado ativo com gradiente e borda lateral</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="check" color="positive" /></q-item-section>
                  <q-item-section>Topbar com busca, notificacoes e acoes</q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card>

          <q-card flat bordered class="cms-shell-card">
            <div class="cms-shell-card__header">
              <strong>Componente Dinamico</strong>
            </div>
            <q-separator />
            <div class="cms-shell-card__body">
              <p class="q-mb-md">
                O layout usa um unico componente reutilizavel: <code>NtkAppShell</code>.
                Para novo projeto, basta trocar grupos/itens e conteudo do slot.
              </p>

              <q-banner rounded class="bg-blue-1 text-blue-9">
                Proxima fase: ligar o CMS real (paginas, blocos, propriedades e publicacao) neste shell.
              </q-banner>
            </div>
          </q-card>
        </div>
      </div>
    </template>
  </NtkAppShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import NtkAppShell from '../src/components/layout/NtkAppShell.vue'
import { createCmsShellConfig } from './cms/shell.config'

const shellConfig = createCmsShellConfig()

const activeMenuId = ref(shellConfig.activeItem || shellConfig.items[0]?.id || '')
const searchQuery = ref(shellConfig.searchValue || '')

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return shellConfig.items
  }

  return shellConfig.items.filter(item => {
    return (
      item.label.toLowerCase().includes(query) ||
      (item.caption ?? '').toLowerCase().includes(query) ||
      (item.description ?? '').toLowerCase().includes(query)
    )
  })
})

watch(
  filteredItems,
  items => {
    if (items.length === 0) {
      return
    }

    if (!items.some(item => item.id === activeMenuId.value)) {
      activeMenuId.value = items[0].id
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.cms-shell-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cms-shell-page__hero h1 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--ntk-text-primary, #0f172a);
}

.cms-shell-page__hero p {
  margin: 0.4rem 0 0;
  color: var(--ntk-text-secondary, #475569);
}

.cms-shell-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.cms-shell-card {
  border-radius: 14px;
  border-color: var(--ntk-border-color, #d9e1eb);
  background: var(--ntk-bg-card, #ffffff);
}

.cms-shell-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
}

.cms-shell-card__body {
  padding: 0.9rem 1rem 1rem;
}

@media (max-width: 1024px) {
  .cms-shell-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
