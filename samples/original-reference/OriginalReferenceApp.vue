<template>
  <div class="ntk-original-reference">
    <MainLayoutTemplate
      layout-view="lHh lpR fFf"
      :menu-items="menuItems"
      app-name="Atlas Flow"
      user-name="Guilherme Ferreira"
      user-initials="GF"
      :show-breadcrumb="false"
      storage-key-prefix="ntk-original-reference-layout"
      :drawer-width="250"
      :mini-drawer-width="56"
      :mini-labels-drawer-width="90"
      side-menu-variant="reference"
      :active-item-id="activeSectionId"
      :default-mini-mode="false"
      :default-show-labels-in-mini="false"
      @menu-item-click="handleMenuItemClick"
    >
      <template #brand>
        <div class="ntk-original-reference__brand">
          <img
            :src="approvedReferenceLogoUrl"
            alt="Atlas Flow"
            class="ntk-original-reference__brand-image"
          >
        </div>
      </template>

      <template #header-actions="{ layoutControls }">
        <UserMenuTemplate
          :model-value="layoutControls.horizontalMode"
          :show-labels-in-mini="layoutControls.showLabelsInMini"
          :side-menu-variant="layoutControls.sideMenuVariant"
          app-name="Atlas Flow"
          profile-name="Guilherme Ferreira"
          profile-initials="GF"
          large-avatar-size="64px"
          sign-out-label="Abrir packs"
          account-label="Abrir inicio"
          preferences-label="Preferencias"
          horizontal-menu-label="Menu horizontal"
          horizontal-menu-caption="Alterna entre menu lateral e horizontal"
          mini-labels-label="Labels no mini menu"
          mini-labels-caption="Exibe texto abaixo dos icones"
          :show-side-menu-style-toggle="false"
          @update:model-value="layoutControls.setHorizontalMode($event)"
          @update:show-labels-in-mini="layoutControls.setShowLabelsInMini($event)"
          @update:side-menu-variant="layoutControls.setSideMenuVariant($event)"
          @account-click="navigateTo('/')"
          @logout-click="navigateTo('/?templates=1')"
        />
      </template>

      <DashboardTemplate
        v-if="activeSectionId === 'dashboard'"
        :title="templateShowcaseDashboardSample.title"
        :subtitle="templateShowcaseDashboardSample.subtitle"
        :greeting-icon="templateShowcaseDashboardSample.greetingIcon"
        activity-title="ATIVIDADE"
        top-items-title="TOP CLIENTES"
        :chips="templateShowcaseDashboardSample.chips"
        :metrics="templateShowcaseDashboardSample.metrics"
        :activities="templateShowcaseDashboardSample.activities"
        :top-items="templateShowcaseDashboardSample.topItems"
      >
        <template #charts>
          <TemplateShowcaseReferenceCharts
            :status-segments="templateShowcaseDashboardSample.statusSegments"
            :category-series="templateShowcaseDashboardSample.categorySeries"
          />
        </template>
      </DashboardTemplate>

      <PlaceholderTemplate
        v-else
        :title="activePlaceholder.title"
        :subtitle="activePlaceholder.subtitle"
        :description="activePlaceholder.description"
        :status-label="activePlaceholder.statusLabel"
        :hints="activePlaceholder.hints"
        :primary-action="activePlaceholder.primaryAction"
        :secondary-action="activePlaceholder.secondaryAction"
        @action-click="handlePlaceholderAction"
      />

      <template #floating>
        <q-btn
          fab
          icon="widgets"
          color="teal-8"
          class="ntk-original-reference__floating-action"
          @click="navigateTo('/?templates=1')"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
          >
            Abrir packs
          </q-tooltip>
        </q-btn>
      </template>
    </MainLayoutTemplate>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import MainLayoutTemplate from '../../src/templates/layouts/MainLayoutTemplate.vue'
import type { TemplateMenuChildItem, TemplateMenuItem } from '../../src/templates/navigation/menu-template.types'
import UserMenuTemplate from '../../src/templates/navigation/UserMenuTemplate.vue'
import DashboardTemplate from '../../src/templates/pages/dashboard/DashboardTemplate.vue'
import PlaceholderTemplate from '../../src/templates/pages/system/PlaceholderTemplate.vue'
import type { TemplatePageAction, TemplatePageHint } from '../../src/templates/pages/page-template.types'
import { approvedReferenceLogoUrl } from '../template-showcase/packs/pack-helpers'
import { templateShowcaseDashboardSample } from '../template-showcase/template-showcase.sample-data'
import TemplateShowcaseReferenceCharts from '../template-showcase/examples/layout-dashboard/TemplateShowcaseReferenceCharts.vue'

type OriginalReferenceSectionId = 'dashboard' | 'clients' | 'orders' | 'configurations'

const menuItems: TemplateMenuItem[] = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: 'dashboard',
  },
  {
    id: 'clients',
    text: 'Clientes',
    icon: 'people',
  },
  {
    id: 'orders',
    text: 'Pedidos',
    icon: 'shopping_cart',
  },
  {
    id: 'configurations',
    text: 'Configuracoes',
    icon: 'settings',
    stickyBottom: true,
  },
]

const validSectionIds = new Set<OriginalReferenceSectionId>([
  'dashboard',
  'clients',
  'orders',
  'configurations',
])

const activeSectionId = ref<OriginalReferenceSectionId>(resolveSectionFromLocation())

interface PlaceholderState {
  title: string
  subtitle: string
  description: string
  statusLabel: string
  hints: TemplatePageHint[]
  primaryAction: TemplatePageAction
  secondaryAction: TemplatePageAction
}

const activePlaceholder = computed<PlaceholderState>(() => {
  const bySection: Record<Exclude<OriginalReferenceSectionId, 'dashboard'>, PlaceholderState> = {
    clients: {
      title: 'Clientes em preparacao',
      subtitle: 'A area de clientes continua conectada ao shell original aprovado.',
      description: 'Este placeholder reutiliza o mesmo runtime enquanto a tela final de clientes evolui a partir dos templates compartilhados.',
      statusLabel: 'Conectado',
      hints: [
        { id: 'clients-hint-1', text: 'A navegacao ja esta funcional no shell base.', icon: 'check_circle' },
        { id: 'clients-hint-2', text: 'Use o showcase para revisar variacoes de CRUD e perfil.', icon: 'widgets' },
      ],
      primaryAction: { id: 'open-packs', label: 'Abrir packs', icon: 'widgets' },
      secondaryAction: { id: 'open-home', label: 'Voltar ao inicio', icon: 'home', outline: true, unelevated: false },
    },
    orders: {
      title: 'Pedidos em preparacao',
      subtitle: 'O fluxo de pedidos segue o mesmo shell e sera derivado da biblioteca compartilhada.',
      description: 'O baseline aprovado permanece no dashboard; os modulos derivados continuam sendo parametrizados sem forks visuais.',
      statusLabel: 'Conectado',
      hints: [
        { id: 'orders-hint-1', text: 'O shell principal ja segue a referencia local.', icon: 'dashboard' },
        { id: 'orders-hint-2', text: 'Os packs continuam disponiveis para comparacao visual.', icon: 'palette' },
      ],
      primaryAction: { id: 'open-workspace', label: 'Abrir workspace', icon: 'view_kanban' },
      secondaryAction: { id: 'open-home', label: 'Voltar ao inicio', icon: 'home', outline: true, unelevated: false },
    },
    configurations: {
      title: 'Configuracoes em preparacao',
      subtitle: 'A parametrizacao continua sendo a arquitetura de whitelabel do sistema.',
      description: 'A tela final de configuracoes sera conectada a partir dos mesmos componentes reutilizaveis vistos no catalogo e no showcase.',
      statusLabel: 'Ativo',
      hints: [
        { id: 'config-hint-1', text: 'A base visual segue a referencia local antes das variacoes.', icon: 'task_alt' },
        { id: 'config-hint-2', text: 'O original agora abre como runtime proprio.', icon: 'open_in_new' },
      ],
      primaryAction: { id: 'open-packs', label: 'Abrir packs', icon: 'widgets' },
      secondaryAction: { id: 'open-home', label: 'Voltar ao inicio', icon: 'home', outline: true, unelevated: false },
    },
  }

  return bySection[activeSectionId.value as Exclude<OriginalReferenceSectionId, 'dashboard'>]
})

function resolveSectionFromLocation(): OriginalReferenceSectionId {
  if (typeof window === 'undefined') {
    return 'dashboard'
  }

  const searchParams = new URLSearchParams(window.location.search)
  const section = searchParams.get('section')
  if (section && validSectionIds.has(section as OriginalReferenceSectionId)) {
    return section as OriginalReferenceSectionId
  }

  return 'dashboard'
}

function syncSectionFromLocation(): void {
  activeSectionId.value = resolveSectionFromLocation()
}

function updateLocationForSection(sectionId: OriginalReferenceSectionId): void {
  if (typeof window === 'undefined') {
    return
  }

  const url = new URL(window.location.href)
  url.searchParams.set('original', '1')
  if (sectionId === 'dashboard') {
    url.searchParams.delete('section')
  } else {
    url.searchParams.set('section', sectionId)
  }

  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

function setActiveSection(sectionId: OriginalReferenceSectionId): void {
  activeSectionId.value = sectionId
  updateLocationForSection(sectionId)
}

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}

function handleMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
  if (validSectionIds.has(item.id as OriginalReferenceSectionId)) {
    setActiveSection(item.id as OriginalReferenceSectionId)
  }
}

function handlePlaceholderAction(actionId: string): void {
  if (actionId === 'open-home') {
    navigateTo('/')
    return
  }

  if (actionId === 'open-workspace') {
    navigateTo('/?samples=1')
    return
  }

  navigateTo('/?templates=1')
}

onMounted(() => {
  syncSectionFromLocation()
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', syncSectionFromLocation)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', syncSectionFromLocation)
  }
})
</script>

<style scoped lang="scss">
.ntk-original-reference {
  --ntk-template-layout-shell-bg: #e8e8e8;
  --ntk-template-layout-page-bg: #e8e8e8;
  --ntk-template-layout-header-bg: #ffffff;
  --ntk-template-layout-header-text: #1f2937;
  --ntk-template-layout-title-color: #1f2937;
  --ntk-template-layout-header-height: 50px;
  --ntk-template-layout-header-padding: 0 16px 0 12px;
  --ntk-template-layout-header-shadow: none;
  --ntk-template-layout-header-border: rgba(0, 0, 0, 0.12);
  --ntk-template-layout-drawer-border: rgba(0, 0, 0, 0.21);
  --ntk-template-layout-reference-nav-item-margin: 0;
  --ntk-template-layout-reference-nav-item-radius: 0;
  --ntk-template-layout-reference-nav-hover-bg: rgba(0, 0, 0, 0.05);
  --ntk-template-layout-reference-nav-active-bg: rgba(255, 255, 255, 0.15);
  --ntk-template-layout-reference-nav-active-border: rgba(255, 255, 255, 0.8);
  --ntk-template-user-menu-header-bg: rgba(0, 0, 0, 0.02);
  --ntk-template-user-menu-radius: 8px;
  --ntk-template-user-menu-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-height: 100vh;
}

.ntk-original-reference__brand {
  display: flex;
  align-items: center;
}

.ntk-original-reference__brand-image {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.ntk-original-reference__floating-action {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 1999;
  box-shadow: 0 4px 16px rgba(15, 118, 110, 0.3);
}

.ntk-original-reference__floating-action:hover {
  box-shadow: 0 6px 24px rgba(15, 118, 110, 0.4);
}

@media (max-width: 768px) {
  .ntk-original-reference__floating-action {
    bottom: 16px;
    right: 16px;
  }
}
</style>
