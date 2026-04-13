<template>
  <ReferenceWorkspaceShell
    :whitelabel-style-vars="whitelabelStyleVars"
    :selected-preset="selectedPreset"
    :selected-preset-id="selectedPresetId"
    :preset-options="presetOptions"
    :menu-items="menuItems"
    :active-item-id="activeMenuId"
    :search-value="searchValue"
    user-name="Samples Review"
    user-initials="SR"
    storage-key-prefix="ntk-samples-home-layout"
    account-label="Abrir workspace"
    sign-out-label="Abrir original"
    @update:search-value="searchValue = $event"
    @update:selected-preset-id="selectedPresetId = String($event ?? 'reference-light')"
    @menu-item-click="onMenuItemClick"
    @help-click="navigateTo('/?templates=1')"
    @profile-click="navigateTo('/?samples=1')"
    @back-home-click="navigateTo('/?original=1')"
  >
    <q-page class="ntk-samples-home-page">
      <SamplesNavigationHub :search-value="searchValue" />
    </q-page>
  </ReferenceWorkspaceShell>
</template>

<script setup lang="ts">
import SamplesNavigationHub from './reference-hub/SamplesNavigationHub.vue'
import { useSamplesShellState } from './shared/useSamplesShellState'
import { ReferenceWorkspaceShell } from '../src/templates/features/reference-system'
import type { TemplateMenuChildItem, TemplateMenuItem } from '../src/templates/navigation/menu-template.types'

const {
  activeMenuId,
  menuItems,
  presetOptions,
  searchValue,
  selectedPreset,
  selectedPresetId,
  whitelabelStyleVars,
} = useSamplesShellState('home')

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}

function onMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
  activeMenuId.value = item.id ?? 'home'

  if (item.id === 'templates' || item.id === 'presets') {
    navigateTo(item.id === 'presets' ? '/?templates=1&family=approved-reference' : '/?templates=1')
    return
  }

  if (item.id === 'workspace') {
    navigateTo('/?samples=1')
    return
  }

  navigateTo('/')
}
</script>

<style scoped lang="scss">
.ntk-samples-home-page {
  min-height: calc(100vh - 56px);
}
</style>
