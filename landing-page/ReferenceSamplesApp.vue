<template>
  <ReferenceWorkspaceShell
    :whitelabel-style-vars="whitelabelStyleVars"
    :selected-preset="selectedPreset"
    :selected-preset-id="selectedPresetId"
    :preset-options="presetOptions"
    :menu-items="referenceSampleMenuItems"
    :active-item-id="activeMenuId"
    :search-value="searchValue"
    :notification-count="referenceSampleNotifications.length"
    :notifications="referenceSampleNotifications"
    @update:search-value="searchValue = $event"
    @menu-item-click="onMenuItemClick"
    @update:selected-preset-id="onPresetChange"
    @help-click="onHelpClick"
    @back-home-click="onBackHomeClick"
  >
    <ReferenceWorkspaceComposer
      v-if="activeMenuId === 'catalog' || activeMenuId === 'designer'"
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
    <div
      v-else
      class="ntk-reference-samples-section-placeholder"
    >
      <q-icon
        :name="activeSection?.icon ?? 'construction'"
        size="40px"
        class="ntk-reference-samples-section-placeholder__icon"
      />
      <div class="ntk-reference-samples-section-placeholder__title">
        {{ activeSection?.text ?? 'Section' }}
      </div>
      <div class="ntk-reference-samples-section-placeholder__desc">
        This section is part of the reference layout and will be available in the full product.
      </div>
    </div>
  </ReferenceWorkspaceShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import {
  ReferenceWorkspaceComposer,
  ReferenceWorkspaceShell,
  referenceSampleDesignerConfig,
  referenceSampleDocumentTabs,
  referenceSampleManagerConfig,
  referenceSampleMenuItems,
  referenceSampleNotifications,
  referenceSampleReportGroups,
  useReferenceWorkspaceHost,
} from '../src/templates/features/reference-system'

function onHelpClick(): void {
  // placeholder — open help docs or contextual drawer
}

function onBackHomeClick(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

const {
  activeDocumentTabId,
  activeMenuId,
  activeReportId,
  onManagerActionClick,
  onMenuItemClick,
  onPresetChange,
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
  onBackHome: onBackHomeClick,
  onHelp: onHelpClick,
})

const activeSection = computed(() =>
  referenceSampleMenuItems.find(item => item.id === activeMenuId.value) ?? null
)
</script>

<style scoped lang="scss">
.ntk-reference-samples-section-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: calc(100vh - 120px);
  padding: 40px 24px;
  text-align: center;
}

.ntk-reference-samples-section-placeholder__icon {
  color: var(--ntk-text-muted, #94a3b8);
  opacity: 0.5;
}

.ntk-reference-samples-section-placeholder__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-reference-samples-section-placeholder__desc {
  font-size: 14px;
  color: var(--ntk-text-muted, #94a3b8);
  max-width: 400px;
  line-height: 1.6;
}
</style>