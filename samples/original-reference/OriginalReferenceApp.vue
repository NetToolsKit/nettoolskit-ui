<template>
  <div class="ntk-original-reference">
    <MainLayoutTemplate
      layout-view="lHh lpR fFf"
      :menu-items="menuItems"
      app-name="Atlas Flow"
      user-name="Admin NetToolsKit"
      user-initials="AN"
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
        <ThemeDotsSwitcher />

        <UserMenuTemplate
          :model-value="layoutControls.horizontalMode"
          :show-labels-in-mini="layoutControls.showLabelsInMini"
          :side-menu-variant="layoutControls.sideMenuVariant"
          app-name="Atlas Flow"
          profile-name="Admin NetToolsKit"
          profile-initials="AN"
          large-avatar-size="64px"
          sign-out-label="Open landing"
          account-label="Back to dashboard"
          preferences-label="Preferences"
          horizontal-menu-label="Horizontal menu"
          horizontal-menu-caption="Switches between side and horizontal menus"
          mini-labels-label="Mini menu labels"
          mini-labels-caption="Shows text below icons"
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
          class="ntk-original-reference__floating-action"
          @click="assistantDialogOpen = true"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
          >
            Open assistant
          </q-tooltip>
        </q-btn>

        <q-dialog v-model="assistantDialogOpen">
          <q-card class="ntk-original-reference__assistant-dialog">
            <q-card-section>
              <div class="ntk-original-reference__assistant-title">
                Sample assistant
              </div>
              <p class="ntk-original-reference__assistant-copy">
                Quickly open the main dashboard, settings, or landing page without leaving the approved shell.
              </p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                no-caps
                label="Dashboard"
                class="ntk-original-reference__accent-btn"
                @click="openAssistantAction('dashboard')"
              />
              <q-btn
                flat
                no-caps
                label="Settings"
                class="ntk-original-reference__accent-btn"
                @click="openAssistantAction('configurations')"
              />
              <q-btn
                unelevated
                no-caps
                label="Landing"
                class="ntk-original-reference__accent-btn--filled"
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
import ThemeDotsSwitcher from '../../src/templates/navigation/ThemeDotsSwitcher.vue'
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
    text: 'Clients',
    icon: 'people',
  },
  {
    id: 'orders',
    text: 'Orders',
    icon: 'shopping_cart',
  },
  {
    id: 'configurations',
    text: 'Settings',
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
      title: 'Clients in preparation',
      subtitle: 'The clients area remains connected to the approved reference shell.',
      description: 'This placeholder keeps navigation functional while the final screen is attached to the same reusable components as the base dashboard.',
      statusLabel: 'Connected',
      hints: [
        { id: 'clients-hint-1', text: 'Side navigation follows the approved layout.', icon: 'check_circle' },
        { id: 'clients-hint-2', text: 'The dashboard remains the canonical visual base for the sample.', icon: 'dashboard' },
      ],
      primaryAction: { id: 'open-dashboard', label: 'Back to dashboard', icon: 'dashboard' },
      secondaryAction: { id: 'open-landing', label: 'Open landing', icon: 'home', outline: true, unelevated: false },
    },
    orders: {
      title: 'Orders in preparation',
      subtitle: 'The order flow stays inside the same shell and visual language as the approved baseline.',
      description: 'Navigation is already functional and the final orders screen will be derived from this same runtime, without a separate showcase.',
      statusLabel: 'Connected',
      hints: [
        { id: 'orders-hint-1', text: 'The horizontal top menu remains available through user preferences.', icon: 'view_stream' },
        { id: 'orders-hint-2', text: 'The main dashboard remains the product reference.', icon: 'insights' },
      ],
      primaryAction: { id: 'open-dashboard', label: 'Back to dashboard', icon: 'dashboard' },
      secondaryAction: { id: 'open-landing', label: 'Open landing', icon: 'home', outline: true, unelevated: false },
    },
    configurations: {
      title: 'Settings in preparation',
      subtitle: 'Configuration remains attached to the same single shell as the approved sample.',
      description: 'The final settings screen will be connected on top of the same reusable architecture, without a parallel public runtime catalog.',
      statusLabel: 'Active',
      hints: [
        { id: 'config-hint-1', text: 'The public sample is now reduced to a single approved base.', icon: 'task_alt' },
        { id: 'config-hint-2', text: 'The local reference remains the main comparison target.', icon: 'open_in_new' },
      ],
      primaryAction: { id: 'open-dashboard', label: 'Back to dashboard', icon: 'dashboard' },
      secondaryAction: { id: 'open-landing', label: 'Open landing', icon: 'home', outline: true, unelevated: false },
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
  --ntk-template-layout-shell-bg: var(--ntk-shell-bg, var(--ntk-bg-primary));
  --ntk-template-layout-page-bg: var(--ntk-shell-bg, var(--ntk-bg-primary));
  --ntk-template-layout-header-bg: var(--ntk-header-bg, var(--ntk-bg-card));
  --ntk-template-layout-header-text: var(--ntk-accent);
  --ntk-template-layout-title-color: var(--ntk-text-heading);
  --ntk-template-layout-header-height: 50px;
  --ntk-template-layout-header-padding: 0 16px 0 12px;
  --ntk-template-layout-header-shadow: none;
  --ntk-template-layout-header-border: var(--ntk-border);
  --ntk-template-layout-drawer-border: var(--ntk-border-strong, var(--ntk-border));
  --ntk-template-layout-horizontal-bg: var(--ntk-layout-horizontal-bg, linear-gradient(90deg, var(--ntk-template-shell-nav-surface-start) 0%, var(--ntk-template-shell-nav-surface-end) 100%));
  --ntk-template-layout-reference-nav-item-margin: 0;
  --ntk-template-layout-reference-nav-item-radius: 0;
  --ntk-template-layout-reference-nav-hover-bg: var(--ntk-nav-hover-bg, color-mix(in srgb, var(--ntk-template-layout-header-text) 8%, transparent));
  --ntk-template-layout-reference-nav-active-bg: var(--ntk-nav-active-bg, color-mix(in srgb, var(--ntk-template-layout-header-text) 14%, transparent));
  --ntk-template-layout-reference-nav-active-border: var(--ntk-nav-active-border, var(--ntk-template-layout-header-text));
  --ntk-template-user-menu-header-bg: color-mix(in srgb, var(--ntk-text-primary) 2%, transparent);
  --ntk-template-user-menu-radius: 8px;
  --ntk-template-user-menu-shadow: var(--ntk-shadow-lg);
  --ntk-template-user-menu-avatar-bg: var(--ntk-avatar-bg, var(--ntk-accent));
  --ntk-template-user-menu-avatar-border: var(--ntk-avatar-border, var(--ntk-text-on-accent));
  --ntk-template-user-menu-avatar-color: var(--ntk-avatar-color, var(--ntk-text-on-accent));
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
  background: var(--ntk-accent) !important;
  color: var(--ntk-text-on-accent) !important;
  box-shadow: 0 4px 16px var(--ntk-fab-shadow, color-mix(in srgb, var(--ntk-accent) 30%, transparent));
}

.ntk-original-reference__floating-action:hover {
  box-shadow: 0 6px 24px var(--ntk-fab-shadow-hover, color-mix(in srgb, var(--ntk-accent) 40%, transparent));
}

.ntk-original-reference__assistant-dialog {
  width: min(420px, calc(100vw - 32px));
}

.ntk-original-reference__assistant-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ntk-text-heading);
}

.ntk-original-reference__assistant-copy {
  margin: 8px 0 0;
  color: var(--ntk-text-muted);
  line-height: 1.5;
}

/* Accent buttons replace Quasar palette props. */
.ntk-original-reference__accent-btn {
  color: var(--ntk-accent) !important;
}

.ntk-original-reference__accent-btn--filled {
  background: var(--ntk-accent) !important;
  color: var(--ntk-text-on-accent) !important;
}

.ntk-original-reference :deep(.ntk-template-main-layout__menu-btn .q-btn) {
  color: var(--ntk-accent);
}

.ntk-original-reference :deep(.ntk-template-user-menu__avatar) {
  box-shadow: none;
}

/* Override Quasar toggle colors inside user menu */
.ntk-original-reference :deep(.q-toggle__inner--truthy) {
  color: var(--ntk-accent) !important;
}

@media (max-width: 768px) {
  .ntk-original-reference__floating-action {
    bottom: 16px;
    right: 16px;
  }
}
</style>
