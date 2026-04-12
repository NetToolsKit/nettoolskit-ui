<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="layout-dashboard"
  >
    <h2>Core Reference Dashboard</h2>
    <MainLayoutTemplate
      layout-view="lHh lpR fFf"
      :menu-items="menuItems"
      :app-name="approvedReferenceBrand.name"
      user-name="Guilherme Ferreira"
      user-initials="GF"
      :show-breadcrumb="false"
      :persist-mode="false"
      storage-key-prefix="ntk-showcase-original-reference"
      :drawer-width="250"
      :mini-drawer-width="56"
      :mini-labels-drawer-width="90"
      side-menu-variant="reference"
      :active-item-id="activeMenuId"
      :default-mini-mode="true"
      @menu-item-click="handleMenuItemClick"
    >
      <template #brand>
        <div class="ntk-template-showcase__approved-brand">
          <img
            v-if="approvedReferenceBrand.logoUrl"
            :src="approvedReferenceBrand.logoUrl"
            :alt="approvedReferenceBrand.name"
            class="ntk-template-showcase__approved-brand-image"
          >
          <div
            v-else
            class="ntk-template-showcase__approved-brand-fallback"
          >
            <span class="ntk-template-showcase__approved-brand-badge">
              {{ approvedReferenceBrand.badge }}
            </span>
            <span class="ntk-template-showcase__approved-brand-text">
              {{ approvedReferenceBrand.name }}
            </span>
          </div>
        </div>
      </template>

      <template #header-actions="{ layoutControls }">
        <UserMenuTemplate
          :model-value="layoutControls.horizontalMode"
          :show-labels-in-mini="layoutControls.showLabelsInMini"
          :side-menu-variant="layoutControls.sideMenuVariant"
          :app-name="approvedReferenceBrand.name"
          profile-name="Guilherme Ferreira"
          profile-initials="GF"
          large-avatar-size="64px"
          sign-out-label="Sair"
          account-label="Ver conta"
          preferences-label="Preferencias"
          horizontal-menu-label="Menu horizontal"
          horizontal-menu-caption="Alterna entre menu lateral e horizontal"
          mini-labels-label="Labels no mini menu"
          mini-labels-caption="Exibe texto abaixo dos icones"
          :show-side-menu-style-toggle="false"
          @update:model-value="layoutControls.setHorizontalMode($event)"
          @update:show-labels-in-mini="layoutControls.setShowLabelsInMini($event)"
          @update:side-menu-variant="layoutControls.setSideMenuVariant($event)"
          @account-click="layoutActionMessage = 'A acao Ver conta foi acionada no modelo aprovado.'"
          @logout-click="layoutActionMessage = 'A acao Sair foi acionada no modelo aprovado.'"
        />
      </template>

      <DashboardTemplate
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
    </MainLayoutTemplate>

    <SampleActionStatus
      title="Layout action"
      :message="layoutActionMessage"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import MainLayoutTemplate from '../../../../src/templates/layouts/MainLayoutTemplate.vue'
import type { TemplateMenuChildItem, TemplateMenuItem } from '../../../../src/templates/navigation/menu-template.types'
import UserMenuTemplate from '../../../../src/templates/navigation/UserMenuTemplate.vue'
import DashboardTemplate from '../../../../src/templates/pages/dashboard/DashboardTemplate.vue'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import { approvedReferenceLogoUrl } from '../../packs/pack-helpers'
import { templateShowcaseDashboardSample } from '../../template-showcase.sample-data'
import TemplateShowcaseReferenceCharts from './TemplateShowcaseReferenceCharts.vue'

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

const activeMenuId = ref('dashboard')
const layoutActionMessage = ref('Comparando o dashboard aprovado com a configuracao visual selecionada.')
const approvedReferenceBrand = {
  name: 'Atlas Flow',
  badge: 'AF',
  logoUrl: approvedReferenceLogoUrl,
} as const

function handleMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
  activeMenuId.value = item.id ?? activeMenuId.value
  layoutActionMessage.value = `Navegacao acionada: ${item.text}.`
}
</script>

<style scoped lang="scss">
.ntk-template-showcase__surface[data-template-surface='layout-dashboard'] {
  --ntk-template-layout-shell-bg: #e8e8e8;
  --ntk-template-layout-page-bg: #e8e8e8;
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
}

.ntk-template-showcase__approved-brand {
  display: flex;
  align-items: center;
}

.ntk-template-showcase__approved-brand-fallback {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.ntk-template-showcase__approved-brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.ntk-template-showcase__approved-brand-image {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.ntk-template-showcase__approved-brand-text {
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #0f172a;
}
</style>
