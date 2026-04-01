<template>
  <ReferenceWorkspaceShell
    :whitelabel-style-vars="whitelabelStyleVars"
    :selected-preset="selectedPreset"
    :selected-preset-id="selectedPresetId"
    :preset-options="presetOptions"
    :menu-items="referenceSampleMenuItems"
    :active-item-id="activeMenuId"
    @menu-item-click="onMenuItemClick"
    @update:selected-preset-id="onPresetChange"
    @primary-action-click="openDesigner"
  >
    <ReferenceWorkspaceComposer
      :mode="activeMenuId === 'catalog' ? 'catalog' : 'designer'"
      :report-groups="referenceSampleReportGroups"
      :selected-preset="selectedPreset"
      :search-value="searchValue"
      :active-report-id="activeReportId"
      :manager-stats="referenceSampleManagerConfig.stats"
      :manager-quick-actions="referenceSampleManagerConfig.quickActions"
      :document-tabs="referenceSampleDocumentTabs"
      :active-document-tab-id="activeDocumentTabId"
      :designer-topbar-actions="referenceSampleDesignerConfig.topbarActions"
      :designer-quick-actions="referenceSampleDesignerConfig.quickActions"
      :widget-sections="referenceSampleDesignerConfig.widgetSections"
      :canvas-columns="referenceSampleDesignerConfig.canvasColumns"
      :canvas-objects="referenceSampleDesignerConfig.canvasObjects"
      :rail-actions="referenceSampleDesignerConfig.railActions"
      :left-status-segments="referenceSampleDesignerConfig.leftStatusSegments"
      :right-status-segments="referenceSampleDesignerConfig.rightStatusSegments"
      :zoom-options="referenceSampleDesignerConfig.zoomOptions"
      :zoom-value="zoomValue"
      @update:search-value="searchValue = $event"
      @update:active-report-id="activeReportId = $event"
      @report-select="activeReportId = $event"
      @manager-action-click="onManagerActionClick"
      @update:active-document-tab-id="activeDocumentTabId = $event"
      @update:zoom-value="zoomValue = $event"
    />
  </ReferenceWorkspaceShell>
</template>

<script setup lang="ts">
import {
  ReferenceWorkspaceComposer,
  ReferenceWorkspaceShell,
  referenceSampleDesignerConfig,
  referenceSampleDocumentTabs,
  referenceSampleManagerConfig,
  referenceSampleMenuItems,
  referenceSampleReportGroups,
  useReferenceWorkspaceHost,
} from '../src/templates/features/reference-system'

const {
  activeDocumentTabId,
  activeMenuId,
  activeReportId,
  onManagerActionClick,
  onMenuItemClick,
  onPresetChange,
  openDesigner,
  presetOptions,
  searchValue,
  selectedPreset,
  selectedPresetId,
  whitelabelStyleVars,
  zoomValue,
} = useReferenceWorkspaceHost({
  initialMenuId: 'catalog',
  initialReportId: referenceSampleReportGroups[0]?.items[0]?.id ?? '',
  initialDocumentTabId: referenceSampleDocumentTabs[0]?.id ?? 'layout',
  initialZoomValue: referenceSampleDesignerConfig.zoomOptions[2] ?? 100,
  onBackHome: () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  },
})
</script>