<template>
  <!-- Recipe: a gallery of the newer Ds* primitives, a few variants each. Every
       item is a library component from the package index; layout is token-only.
       The toast demo pushes onto the shared queue rendered by <DsToastHost />
       (mounted once at the catalog root). -->
  <div class="recipe-gallery">
    <section class="recipe-gallery__group" aria-label="DsBadge">
      <h4 class="recipe-gallery__title">DsBadge</h4>
      <!-- Every intent x variant so the e2e axe color-contrast scan exercises
           the full matrix of solid/soft/outline semantic pairings. -->
      <div
        v-for="variant in intentVariants"
        :key="`badge-${variant}`"
        class="recipe-gallery__row"
      >
        <DsBadge
          v-for="intent in intents"
          :key="`badge-${variant}-${intent}`"
          :variant="variant"
          :intent="intent"
          :label="intent"
        />
      </div>
      <div class="recipe-gallery__row">
        <DsBadge dot intent="primary" label="Status online" />
      </div>
    </section>

    <section class="recipe-gallery__group" aria-label="DsChip">
      <h4 class="recipe-gallery__title">DsChip</h4>
      <div
        v-for="variant in intentVariants"
        :key="`chip-${variant}`"
        class="recipe-gallery__row"
      >
        <DsChip
          v-for="intent in intents"
          :key="`chip-${variant}-${intent}`"
          :variant="variant"
          :intent="intent"
          :label="intent"
        />
      </div>
      <div class="recipe-gallery__row">
        <DsChip label="Selecionado" clickable selected />
        <DsChip label="Removível" variant="soft" removable remove-label="Remover filtro" />
      </div>
    </section>

    <section class="recipe-gallery__group recipe-gallery__group--wide" aria-label="DsButton">
      <h4 class="recipe-gallery__title">DsButton</h4>
      <div
        v-for="variant in buttonVariants"
        :key="`button-${variant}`"
        class="recipe-gallery__row"
      >
        <DsButton
          v-for="intent in intents"
          :key="`button-${variant}-${intent}`"
          :variant="variant"
          :intent="intent"
          :label="intent"
        />
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

    <section class="recipe-gallery__group recipe-gallery__group--wide" aria-label="DsBanner">
      <h4 class="recipe-gallery__title">DsBanner</h4>
      <!-- Full intent x variant matrix; the e2e axe scan validates contrast for
           every solid/soft/outline semantic banner. -->
      <div class="recipe-gallery__stack">
        <template v-for="variant in intentVariants" :key="`banner-${variant}`">
          <DsBanner
            v-for="intent in intents"
            :key="`banner-${variant}-${intent}`"
            :variant="variant"
            :intent="intent"
            :title="`${variant} / ${intent}`"
            :message="`Banner ${variant} com intenção ${intent}.`"
          />
        </template>
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

    <section class="recipe-gallery__group" aria-label="DsDatePicker e DsTimePicker">
      <h4 class="recipe-gallery__title">DsDatePicker / DsTimePicker</h4>
      <div class="recipe-gallery__row recipe-gallery__row--pickers">
        <DsDatePicker
          id="gallery-date"
          v-model="selectedDate"
          label="Data do agendamento"
          placeholder="Selecione uma data"
          :min="'2024-01-01'"
          :max="'2025-12-31'"
          hint="Use o calendario ou as setas do teclado"
        />
        <DsTimePicker
          id="gallery-time"
          v-model="selectedTime"
          label="Horario"
          placeholder="Selecione um horario"
          :step="30"
          min="08:00"
          max="18:00"
          hint="Lista de horarios em intervalos de 30 minutos"
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
  DsDatePicker,
  DsSkeleton,
  DsSteps,
  DsTabs,
  DsTimePicker,
  DsTooltip,
  useToast,
  type NtkBadgeVariant,
  type NtkBreadcrumbItem,
  type NtkButtonVariant,
  type NtkComponentIntent,
  type NtkStepItem,
  type NtkTabItem,
} from '../../src/index'

// Drive the intent x variant matrices below so the e2e axe color-contrast scan
// exercises every solid/soft/outline semantic pairing in one rendered DOM.
const intents: NtkComponentIntent[] = [
  'neutral',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
]
// Badge/Banner/Chip share the solid/soft/outline variant set.
const intentVariants: NtkBadgeVariant[] = ['solid', 'soft', 'outline']
// Buttons expose solid/outline/ghost (plus link, omitted here).
const buttonVariants: NtkButtonVariant[] = ['solid', 'outline', 'ghost']

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

const selectedDate = ref<string | null>('2024-06-15')
const selectedTime = ref<string | null>('09:30')

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

.recipe-gallery__group--wide {
  grid-column: 1 / -1;
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

.recipe-gallery__row--pickers {
  align-items: flex-start;
}

.recipe-gallery__row--pickers > * {
  flex: 1 1 200px;
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