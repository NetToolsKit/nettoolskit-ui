<template>
  <ReferenceWorkspaceShell
    :whitelabel-style-vars="whitelabelStyleVars"
    :selected-preset="selectedPreset"
    :selected-preset-id="selectedPresetId"
    :preset-options="presetOptions"
    :menu-items="referenceMenuItems"
    :active-item-id="activeMenuId"
    :search-value="searchValue"
    user-name="Reference Catalog"
    user-initials="RC"
    storage-key-prefix="ntk-reference-catalog-layout"
    account-label="Open report workspace"
    sign-out-label="Open legacy landing"
    @update:search-value="searchValue = $event"
    @update:selected-preset-id="onPresetChange"
    @menu-item-click="onMenuItemClick"
    @help-click="onHelpClick"
    @profile-click="onProfileClick"
    @back-home-click="onBackHomeClick"
  >
    <div class="ntk-reference-catalog-app">
      <ReferenceCatalogTemplate
        :active-section-mode="activeSectionMode"
        :selected-preset="selectedPreset"
        :selected-surface-id="selectedSurfaceId"
        :selected-surface="selectedSurface"
        :surfaces="filteredSurfaces"
        :presets="availablePresets"
        :hero-stats="referenceHeroStats"
        :preset-callouts="referencePresetCallouts"
        :architecture-cards="referenceArchitectureCards"
        :runtime-links="referenceRuntimeLinks"
        :search-value="searchValue"
        :whitelabel-style-vars="whitelabelStyleVars"
        @update:search-value="searchValue = $event"
        @select-surface="onSurfaceSelect"
        @open-runtime="openRuntime"
      />
      <SamplesNavigationHub />
    </div>
  </ReferenceWorkspaceShell>
</template>

<script setup lang="ts">
import {
  ReferenceCatalogTemplate,
  ReferenceWorkspaceShell,
  type ReferenceCatalogRuntimeLink,
  referenceArchitectureCards,
  referenceHeroStats,
  referencePresetCallouts,
  referenceRuntimeLinks,
  useReferenceCatalogHost,
} from '../src/templates/features/reference-system'
import SamplesNavigationHub from './reference-hub/SamplesNavigationHub.vue'

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}

function onHelpClick(): void {
  navigateTo('/?templates=1')
}

function onBackHomeClick(): void {
  navigateTo('/?landing=1')
}

function onProfileClick(): void {
  navigateTo('/?samples=1')
}

function openRuntime(runtimeLink: ReferenceCatalogRuntimeLink): void {
  navigateTo(runtimeLink.href)
}

const {
  activeMenuId,
  activeSectionMode,
  availablePresets,
  filteredSurfaces,
  onMenuItemClick,
  onPresetChange,
  onSurfaceSelect,
  presetOptions,
  referenceMenuItems,
  searchValue,
  selectedPreset,
  selectedPresetId,
  selectedSurface,
  selectedSurfaceId,
  whitelabelStyleVars,
} = useReferenceCatalogHost({
  initialMenuId: 'overview',
  initialSurfaceId: 'dashboard',
  onHelp: onHelpClick,
  onBackHome: () => onBackHomeClick(),
})
</script>

<style scoped lang="scss">
.ntk-reference-catalog-app {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
