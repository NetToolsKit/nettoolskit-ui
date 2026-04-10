<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="layout-dashboard"
  >
    <h2>Approved Reference Dashboard</h2>
    <MainLayoutTemplate
      :menu-items="menuItems"
      :app-name="currentAppName"
      user-name="Guilherme Ferreira"
      user-initials="GF"
      :show-breadcrumb="false"
      :persist-mode="false"
      storage-key-prefix="ntk-showcase-approved-reference"
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
            v-if="currentLogoUrl"
            :src="currentLogoUrl"
            :alt="currentAppName"
            class="ntk-template-showcase__approved-brand-image"
          >
          <span
            v-else
            class="ntk-template-showcase__approved-brand-text"
          >
            {{ currentAppName }}
          </span>
        </div>
      </template>

      <template #header-actions="{ layoutControls }">
        <UserMenuTemplate
          :model-value="layoutControls.horizontalMode"
          :show-labels-in-mini="layoutControls.showLabelsInMini"
          :side-menu-variant="layoutControls.sideMenuVariant"
          :app-name="currentAppName"
          profile-name="Guilherme Ferreira"
          profile-initials="GF"
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
import { computed, ref } from 'vue'

import MainLayoutTemplate from '../../../../src/templates/layouts/MainLayoutTemplate.vue'
import type { TemplateMenuChildItem, TemplateMenuItem } from '../../../../src/templates/navigation/menu-template.types'
import UserMenuTemplate from '../../../../src/templates/navigation/UserMenuTemplate.vue'
import DashboardTemplate from '../../../../src/templates/pages/dashboard/DashboardTemplate.vue'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import { useTemplateVisualThemeContext } from '../../families/template-visual-family.context'
import { templateShowcaseDashboardSample } from '../../template-showcase.sample-data'
import TemplateShowcaseReferenceCharts from './TemplateShowcaseReferenceCharts.vue'

const themeVariant = useTemplateVisualThemeContext()

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

const currentAppName = computed(() => {
  return themeVariant?.preset.brand.name ?? 'SMB Conecta'
})

const currentLogoUrl = computed(() => {
  return themeVariant?.preset.brand.logoUrl ?? null
})

function handleMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
  activeMenuId.value = item.id ?? activeMenuId.value
  layoutActionMessage.value = `Navegacao acionada: ${item.text}.`
}
</script>

<style scoped lang="scss">
.ntk-template-showcase__approved-brand {
  display: flex;
  align-items: center;
}

.ntk-template-showcase__approved-brand-image {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.ntk-template-showcase__approved-brand-text {
  font-size: 30px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #dc2626;
  text-transform: uppercase;
}
</style>
