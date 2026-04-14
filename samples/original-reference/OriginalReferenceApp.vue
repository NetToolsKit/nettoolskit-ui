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
        <img
          :src="referenceHeaderLogoUrl"
          alt="Atlas Flow"
          class="ntk-original-reference__brand-logo"
        >
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
          sign-out-label="Abrir landing"
          account-label="Voltar ao dashboard"
          preferences-label="Preferências"
          horizontal-menu-label="Menu horizontal"
          horizontal-menu-caption="Alterna entre menu lateral e horizontal"
          mini-labels-label="Labels no mini menu"
          mini-labels-caption="Exibe texto abaixo dos ícones"
          :show-side-menu-style-toggle="false"
          @update:model-value="layoutControls.setHorizontalMode($event)"
          @update:show-labels-in-mini="layoutControls.setShowLabelsInMini($event)"
          @update:side-menu-variant="layoutControls.setSideMenuVariant($event)"
          @account-click="setActiveSection('dashboard')"
          @logout-click="navigateTo('/?landing=1')"
        />
      </template>

      <DashboardTemplate
        v-if="activeSectionId === 'dashboard'"
        :title="originalReferenceDashboardSample.title"
        :subtitle="originalReferenceDashboardSample.subtitle"
        :greeting-icon="originalReferenceDashboardSample.greetingIcon"
        activity-title="ATIVIDADE"
        top-items-title="TOP CLIENTES"
        activity-title-icon="insights"
        top-items-title-icon="star"
        :chips="originalReferenceDashboardSample.chips"
        :metrics="originalReferenceDashboardSample.metrics"
        :activities="originalReferenceDashboardSample.activities"
        :top-items="originalReferenceDashboardSample.topItems"
      >
        <template #charts>
          <OriginalReferenceCharts
            :status-segments="originalReferenceDashboardSample.statusSegments"
            :category-series="originalReferenceDashboardSample.categorySeries"
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
          icon="smart_toy"
          color="teal-8"
          class="ntk-original-reference__floating-action"
          @click="assistantDialogOpen = true"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
          >
            Abrir assistente
          </q-tooltip>
        </q-btn>

        <q-dialog v-model="assistantDialogOpen">
          <q-card class="ntk-original-reference__assistant-dialog">
            <q-card-section>
              <div class="ntk-original-reference__assistant-title">
                Assistente do sample
              </div>
              <p class="ntk-original-reference__assistant-copy">
                Acesse rapidamente o dashboard principal, abra configurações ou volte para a landing sem sair do shell aprovado.
              </p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                no-caps
                color="primary"
                label="Dashboard"
                @click="openAssistantAction('dashboard')"
              />
              <q-btn
                flat
                no-caps
                color="primary"
                label="Configurações"
                @click="openAssistantAction('configurations')"
              />
              <q-btn
                unelevated
                no-caps
                color="primary"
                label="Landing"
                @click="openAssistantAction('landing')"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
import OriginalReferenceCharts from './OriginalReferenceCharts.vue'
import { originalReferenceDashboardSample } from './original-reference.sample-data'

const referenceHeaderLogoUrl = new URL('../assets/reference-header-logo.png', import.meta.url).href

type OriginalReferenceSectionId = 'dashboard' | 'clients' | 'orders' | 'configurations'
type AssistantActionId = 'dashboard' | 'configurations' | 'landing'

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
    text: 'Configurações',
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
const assistantDialogOpen = ref(false)

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
      title: 'Clientes em preparação',
      subtitle: 'A área de clientes permanece conectada ao shell aprovado da referência.',
      description: 'Este placeholder existe apenas para manter a navegação funcional enquanto a tela definitiva é acoplada aos mesmos componentes reutilizáveis do dashboard base.',
      statusLabel: 'Conectado',
      hints: [
        { id: 'clients-hint-1', text: 'A navegação lateral segue o layout aprovado.', icon: 'check_circle' },
        { id: 'clients-hint-2', text: 'O dashboard continua como base visual canônica do sample.', icon: 'dashboard' },
      ],
      primaryAction: { id: 'open-dashboard', label: 'Voltar ao dashboard', icon: 'dashboard' },
      secondaryAction: { id: 'open-landing', label: 'Abrir landing', icon: 'home', outline: true, unelevated: false },
    },
    orders: {
      title: 'Pedidos em preparação',
      subtitle: 'O fluxo de pedidos continua dentro do mesmo shell e da mesma linguagem do baseline aprovado.',
      description: 'A navegação já está funcional e a tela final de pedidos será derivada a partir deste mesmo runtime, sem depender de um showcase separado.',
      statusLabel: 'Conectado',
      hints: [
        { id: 'orders-hint-1', text: 'O menu superior horizontal continua disponível via preferência do usuário.', icon: 'view_stream' },
        { id: 'orders-hint-2', text: 'O dashboard principal permanece como referência do produto.', icon: 'insights' },
      ],
      primaryAction: { id: 'open-dashboard', label: 'Voltar ao dashboard', icon: 'dashboard' },
      secondaryAction: { id: 'open-landing', label: 'Abrir landing', icon: 'home', outline: true, unelevated: false },
    },
    configurations: {
      title: 'Configurações em preparação',
      subtitle: 'A parametrização continua ligada ao mesmo shell único do sample aprovado.',
      description: 'A tela final de configurações será conectada em cima da mesma arquitetura reutilizável, sem catálogo paralelo de famílias visuais no runtime público.',
      statusLabel: 'Ativo',
      hints: [
        { id: 'config-hint-1', text: 'O sample público agora foi reduzido a uma única base aprovada.', icon: 'task_alt' },
        { id: 'config-hint-2', text: 'A referência local continua sendo a comparação principal.', icon: 'open_in_new' },
      ],
      primaryAction: { id: 'open-dashboard', label: 'Voltar ao dashboard', icon: 'dashboard' },
      secondaryAction: { id: 'open-landing', label: 'Abrir landing', icon: 'home', outline: true, unelevated: false },
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
  url.searchParams.delete('landing')
  url.searchParams.delete('template-runtime')
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
  if (actionId === 'open-dashboard') {
    setActiveSection('dashboard')
    return
  }

  if (actionId === 'open-landing') {
    navigateTo('/?landing=1')
  }
}

function openAssistantAction(actionId: AssistantActionId): void {
  assistantDialogOpen.value = false

  if (actionId === 'landing') {
    navigateTo('/?landing=1')
    return
  }

  setActiveSection(actionId)
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
  --ntk-template-layout-header-text: #0f766e;
  --ntk-template-layout-title-color: #1f2937;
  --ntk-template-layout-header-height: 50px;
  --ntk-template-layout-header-padding: 0 16px 0 12px;
  --ntk-template-layout-header-shadow: none;
  --ntk-template-layout-header-border: rgba(0, 0, 0, 0.12);
  --ntk-template-layout-drawer-border: rgba(0, 0, 0, 0.21);
  --ntk-template-layout-horizontal-bg: linear-gradient(90deg, #1e293b 0%, #334155 100%);
  --ntk-template-layout-reference-nav-item-margin: 0;
  --ntk-template-layout-reference-nav-item-radius: 0;
  --ntk-template-layout-reference-nav-hover-bg: rgba(0, 0, 0, 0.05);
  --ntk-template-layout-reference-nav-active-bg: rgba(255, 255, 255, 0.15);
  --ntk-template-layout-reference-nav-active-border: rgba(255, 255, 255, 0.8);
  --ntk-template-user-menu-header-bg: rgba(0, 0, 0, 0.02);
  --ntk-template-user-menu-radius: 8px;
  --ntk-template-user-menu-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  --ntk-template-user-menu-avatar-bg: #14b8a6;
  --ntk-template-user-menu-avatar-border: #ffffff;
  --ntk-template-user-menu-avatar-color: #ffffff;
  min-height: 100vh;
}

.ntk-original-reference__brand-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  display: block;
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

.ntk-original-reference__assistant-dialog {
  width: min(420px, calc(100vw - 32px));
}

.ntk-original-reference__assistant-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.ntk-original-reference__assistant-copy {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.5;
}

.ntk-original-reference :deep(.ntk-template-main-layout__menu-btn .q-btn) {
  color: #0f766e;
}

.ntk-original-reference :deep(.ntk-template-user-menu__avatar) {
  box-shadow: none;
}

@media (max-width: 768px) {
  .ntk-original-reference__floating-action {
    bottom: 16px;
    right: 16px;
  }
}
</style>
