<template>
  <!-- Recipe: a gallery of the newer Ds* primitives, a few variants each. Every
       item is a library component from the package index; layout is token-only.
       The toast demo pushes onto the shared queue rendered by <DsToastHost />
       (mounted once at the catalog root). -->
  <div class="recipe-gallery">
    <section class="recipe-gallery__group" aria-label="DsBadge">
      <h4 class="recipe-gallery__title">DsBadge</h4>
      <div class="recipe-gallery__row">
        <DsBadge label="Padrão" />
        <DsBadge label="Novo" variant="solid" intent="primary" />
        <DsBadge label="Ativo" variant="soft" intent="primary" />
        <DsBadge label="Beta" variant="outline" intent="primary" />
        <DsBadge dot intent="primary" label="Status online" />
      </div>
    </section>

    <section class="recipe-gallery__group" aria-label="DsChip">
      <h4 class="recipe-gallery__title">DsChip</h4>
      <div class="recipe-gallery__row">
        <DsChip label="Padrão" />
        <DsChip label="Selecionado" clickable selected />
        <DsChip label="Removível" variant="soft" removable remove-label="Remover filtro" />
      </div>
    </section>

    <section class="recipe-gallery__group" aria-label="DsAvatar">
      <h4 class="recipe-gallery__title">DsAvatar</h4>
      <div class="recipe-gallery__row">
        <DsAvatar name="Ana Souza" />
        <DsAvatar name="Bruno Lima" variant="solid" intent="primary" status="online" />
        <DsAvatar name="Carla Dias" variant="soft" intent="primary" shape="square" />
        <DsAvatar name="Diego Alves" status="busy" size="lg" />
      </div>
    </section>

    <section class="recipe-gallery__group" aria-label="DsTabs">
      <h4 class="recipe-gallery__title">DsTabs</h4>
      <DsTabs
        id="gallery-tabs"
        v-model="activeTab"
        :tabs="tabs"
        aria-label="Exemplo de abas"
      >
        <template #panel-overview>
          <p class="recipe-gallery__panel">Visão geral com indicadores principais.</p>
        </template>
        <template #panel-activity>
          <p class="recipe-gallery__panel">Histórico de atividades recentes.</p>
        </template>
        <template #panel-settings>
          <p class="recipe-gallery__panel">Preferências e configurações da conta.</p>
        </template>
      </DsTabs>
    </section>

    <section class="recipe-gallery__group" aria-label="DsTooltip">
      <h4 class="recipe-gallery__title">DsTooltip</h4>
      <div class="recipe-gallery__row">
        <DsTooltip text="Dica acessível exibida no foco e no hover" position="top">
          <DsButton label="Passe o mouse / foco" variant="outline" intent="primary" />
        </DsTooltip>
      </div>
    </section>

    <section class="recipe-gallery__group" aria-label="DsSkeleton">
      <h4 class="recipe-gallery__title">DsSkeleton</h4>
      <div class="recipe-gallery__row recipe-gallery__row--skeleton">
        <DsSkeleton variant="circle" />
        <div class="recipe-gallery__skeleton-stack">
          <DsSkeleton variant="text" :lines="3" />
        </div>
      </div>
    </section>

    <section class="recipe-gallery__group" aria-label="DsBreadcrumbs">
      <h4 class="recipe-gallery__title">DsBreadcrumbs</h4>
      <DsBreadcrumbs :items="breadcrumbs" />
    </section>

    <section class="recipe-gallery__group" aria-label="DsSteps">
      <h4 class="recipe-gallery__title">DsSteps</h4>
      <DsSteps :steps="steps" :current="1" aria-label="Progresso do cadastro" />
    </section>

    <section class="recipe-gallery__group" aria-label="DsBanner">
      <h4 class="recipe-gallery__title">DsBanner</h4>
      <div class="recipe-gallery__stack">
        <DsBanner
          variant="soft"
          intent="neutral"
          icon="ℹ️"
          title="Atualização disponível"
          message="Uma nova versão da biblioteca foi publicada."
        />
        <DsBanner
          variant="soft"
          intent="primary"
          icon="📌"
          title="Plano atualizado"
          message="Suas alterações de plano entram em vigor no próximo ciclo."
          dismissible
          dismiss-label="Dispensar aviso"
        />
      </div>
    </section>

    <section class="recipe-gallery__group" aria-label="DsToast">
      <h4 class="recipe-gallery__title">DsToast</h4>
      <div class="recipe-gallery__row">
        <DsButton
          label="Disparar toast"
          intent="primary"
          @click="onToast"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DsAvatar,
  DsBadge,
  DsBanner,
  DsBreadcrumbs,
  DsButton,
  DsChip,
  DsSkeleton,
  DsSteps,
  DsTabs,
  DsTooltip,
  useToast,
  type NtkBreadcrumbItem,
  type NtkStepItem,
  type NtkTabItem,
} from '../../index'

const tabs: NtkTabItem[] = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'activity', label: 'Atividade' },
  { id: 'settings', label: 'Configurações' },
]
const activeTab = ref('overview')

const breadcrumbs: NtkBreadcrumbItem[] = [
  { label: 'Início', href: '#' },
  { label: 'Clientes', href: '#' },
  { label: 'Detalhes' },
]

const steps: NtkStepItem[] = [
  { id: 'account', label: 'Conta', description: 'Dados de acesso' },
  { id: 'profile', label: 'Perfil', description: 'Informações pessoais' },
  { id: 'review', label: 'Revisão', description: 'Confirmar e enviar' },
]

// Toast queue is shared; <DsToastHost /> at the catalog root renders it.
const { pushToast } = useToast()
const onToast = (): void => {
  pushToast({
    title: 'Registro salvo',
    message: 'O cliente foi adicionado à lista.',
    intent: 'success',
  })
}
</script>

<style scoped>
.recipe-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--ntk-spacing-lg);
}

.recipe-gallery__group {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
}

.recipe-gallery__title {
  margin: 0;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.recipe-gallery__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.recipe-gallery__row--skeleton {
  align-items: flex-start;
}

.recipe-gallery__stack {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
}

.recipe-gallery__skeleton-stack {
  flex: 1 1 160px;
}

.recipe-gallery__panel {
  margin: 0;
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-sm);
}
</style>