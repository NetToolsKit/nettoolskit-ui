<template>
  <section
    class="ntk-reference-designer"
    :aria-label="pageAriaLabel"
  >
    <ReferenceDocumentTabsBar
      :document-tabs="documentTabs"
      :active-document-tab-id="activeDocumentTabId"
      :selected-preset="selectedPreset"
      @update:active-document-tab-id="emit('update:activeDocumentTabId', $event)"
    />

    <div class="ntk-reference-designer__grid">
      <ReferenceReportCatalogPanel
        :search-value="searchValue"
        :active-report-id="selectedReport?.id ?? null"
        :report-groups="reportGroups"
        title="Report files"
        eyebrow="Designer navigator"
        @update:search-value="emit('update:searchValue', $event)"
        @update:active-report-id="emit('update:activeReportId', $event)"
        @report-select="emit('report-select', $event)"
      />

      <div class="ntk-reference-designer__workbench-shell">
        <div class="ntk-reference-designer__workbench-header">
          <div>
            <p class="ntk-reference-designer__workbench-eyebrow">
              {{ selectedPreset.brand.name }}
            </p>
            <h2>{{ selectedReport?.fileName ?? fallbackEmptyTitle }}</h2>
            <p>{{ selectedReport?.description ?? fallbackEmptyDescription }}</p>
          </div>

          <div
            v-if="selectedReport"
            class="ntk-reference-designer__workbench-meta"
          >
            <ReferenceReportStatusBadge :status="selectedReport.status" />
            <span>{{ selectedReport.category }}</span>
            <strong>{{ selectedReport.updatedAt }}</strong>
          </div>
        </div>

        <EditorWorkbenchTemplate
          class="ntk-reference-designer__workbench"
          :document-title="selectedReport?.title ?? fallbackEmptyTitle"
          :document-subtitle="selectedReport?.description ?? fallbackEmptyDescription"
          :active-document-tab-id="activeDocumentTabId"
          :topbar-actions="topbarActions"
          :quick-actions="quickActions"
          :widget-sections="widgetSections"
          :canvas-columns="canvasColumns"
          :canvas-objects="canvasObjects"
          :rail-actions="railActions"
          :left-status-segments="leftStatusSegments"
          :right-status-segments="rightStatusSegments"
          :zoom-options="zoomOptions"
          :zoom-value="zoomValue"
          @toolbar-action-click="emit('toolbar-action-click', $event)"
          @widget-click="emit('widget-click', $event)"
          @canvas-object-click="emit('canvas-object-click', $event)"
          @rail-action-click="emit('rail-action-click', $event)"
          @status-click="emit('status-click', $event)"
          @update:zoom-value="emit('update:zoomValue', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ReferenceWhitelabelPreset } from '../../../whitelabel'
import type {
  TemplateEditorCanvasObject,
  TemplateEditorRailAction,
  TemplateEditorStatusSegment,
  TemplateEditorToolbarAction,
  TemplateEditorWidgetSection,
} from '../../pages'
import EditorWorkbenchTemplate from '../../pages/editor/EditorWorkbenchTemplate.vue'
import ReferenceReportCatalogPanel from './components/ReferenceReportCatalogPanel.vue'
import ReferenceDocumentTabsBar from './components/ReferenceDocumentTabsBar.vue'
import ReferenceReportStatusBadge from './components/ReferenceReportStatusBadge.vue'
import { findReferenceReportById } from './reference-report.sample-data'
import type {
  ReferenceDocumentTab,
  ReferenceReportGroup,
} from './reference-system.types'

const props = withDefaults(defineProps<{
  searchValue?: string
  activeReportId?: string | null
  reportGroups: ReferenceReportGroup[]
  selectedPreset: ReferenceWhitelabelPreset
  documentTabs?: ReferenceDocumentTab[]
  activeDocumentTabId?: string
  topbarActions?: TemplateEditorToolbarAction[]
  quickActions?: TemplateEditorToolbarAction[]
  widgetSections?: TemplateEditorWidgetSection[]
  canvasColumns?: string[]
  canvasObjects?: TemplateEditorCanvasObject[]
  railActions?: TemplateEditorRailAction[]
  leftStatusSegments?: TemplateEditorStatusSegment[]
  rightStatusSegments?: TemplateEditorStatusSegment[]
  zoomOptions?: number[]
  zoomValue?: number
  pageAriaLabel?: string
  fallbackEmptyTitle?: string
  fallbackEmptyDescription?: string
}>(), {
  searchValue: '',
  activeReportId: null,
  documentTabs: () => [],
  activeDocumentTabId: 'layout',
  topbarActions: () => [],
  quickActions: () => [],
  widgetSections: () => [],
  canvasColumns: () => [],
  canvasObjects: () => [],
  railActions: () => [],
  leftStatusSegments: () => [],
  rightStatusSegments: () => [],
  zoomOptions: () => [100],
  zoomValue: 100,
  pageAriaLabel: 'Reference report designer page',
  fallbackEmptyTitle: 'Select one approved report',
  fallbackEmptyDescription: 'Choose a report from the catalog to start editing the approved layout shell.',
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeReportId': [value: string]
  'report-select': [value: string]
  'update:activeDocumentTabId': [value: string]
  'toolbar-action-click': [value: string]
  'widget-click': [value: string]
  'canvas-object-click': [value: string]
  'rail-action-click': [value: string]
  'status-click': [value: string]
  'update:zoomValue': [value: number]
}>()

const selectedReport = computed(() => {
  return findReferenceReportById(props.reportGroups, props.activeReportId)
})
</script>

<style scoped lang="scss">
.ntk-reference-designer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  min-height: 100%;
  background: var(--ntk-reference-page-bg, #eef4ff);
}

.ntk-reference-designer__grid {
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 16px;
  min-height: 0;
}

.ntk-reference-designer__workbench-shell {
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 20px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  padding: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.ntk-reference-designer__workbench-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.ntk-reference-designer__workbench-eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
}

.ntk-reference-designer__workbench-header h2 {
  margin: 6px 0 0;
  color: #0f172a;
}

.ntk-reference-designer__workbench-header p {
  margin: 8px 0 0;
  color: #475569;
}

.ntk-reference-designer__workbench-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  color: #64748b;
  font-size: 12px;
}

.ntk-reference-designer__workbench-meta :deep(.ntk-reference-status-badge) {
  align-self: flex-end;
}

.ntk-reference-designer__workbench-meta strong {
  color: #0f172a;
}

.ntk-reference-designer__workbench {
  min-height: 720px;
}

@media (max-width: 1180px) {
  .ntk-reference-designer__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 880px) {
  .ntk-reference-designer {
    padding: 14px;
  }

  .ntk-reference-designer__workbench-header {
    flex-direction: column;
    align-items: stretch;
  }

  .ntk-reference-designer__workbench-meta {
    align-items: flex-start;
  }

  .ntk-reference-designer__workbench-meta :deep(.ntk-reference-status-badge) {
    align-self: flex-start;
  }
}
</style>