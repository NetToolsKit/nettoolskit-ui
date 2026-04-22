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

      <EditorWorkbenchTemplate
        class="ntk-reference-designer__workbench"
        :active-document-tab-id="activeDocumentTabId"
        :show-document-regions="true"
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
        @canvas-object-click="onCanvasObjectClick"
        @rail-action-click="emit('rail-action-click', $event)"
        @status-click="emit('status-click', $event)"
        @update:zoom-value="emit('update:zoomValue', $event)"
      >
        <template #topbar-document>
          <div class="ntk-reference-designer__doc-identity">
            <p class="ntk-reference-designer__doc-eyebrow">
              {{ selectedPreset.brand.name }}
            </p>
            <h1 class="ntk-reference-designer__doc-title">
              {{ selectedReport?.fileName ?? fallbackEmptyTitle }}
            </h1>
          </div>
          <div
            v-if="selectedReport"
            class="ntk-reference-designer__doc-meta"
          >
            <ReferenceReportStatusBadge :status="selectedReport.status" />
            <span class="ntk-reference-designer__doc-category">{{ selectedReport.category }}</span>
            <strong class="ntk-reference-designer__doc-date">{{ selectedReport.updatedAt }}</strong>
          </div>
        </template>

        <template #widgets-panel>
          <ReferenceDocumentNavigatorPanel
            :canvas-objects="canvasObjects"
            :selected-object-id="activeCanvasObjectId"
            :document-title="selectedReport?.fileName ?? fallbackEmptyTitle"
            @object-select="onCanvasObjectClick"
          />
        </template>

        <template #right-rail>
          <ReferenceContextRailPanel
            :selected-object-id="activeCanvasObjectId"
            :canvas-objects="canvasObjects"
          />
        </template>
      </EditorWorkbenchTemplate>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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
import ReferenceContextRailPanel from './components/ReferenceContextRailPanel.vue'
import ReferenceDocumentNavigatorPanel from './components/ReferenceDocumentNavigatorPanel.vue'
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

const activeCanvasObjectId = ref<string | null>(null)

function onCanvasObjectClick(objectId: string): void {
  activeCanvasObjectId.value = activeCanvasObjectId.value === objectId ? null : objectId
  emit('canvas-object-click', objectId)
}
</script>

<style scoped lang="scss">
.ntk-reference-designer {
  --ntk-reference-designer-text: var(--ntk-reference-text, var(--ntk-template-page-title, var(--ntk-text-primary, var(--ntk-text-body))));
  --ntk-reference-designer-muted: var(--ntk-reference-muted, var(--ntk-template-editor-muted-text, var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-body)))));

  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  min-height: 100%;
  background: var(--ntk-reference-page-bg, var(--ntk-template-page-bg, var(--ntk-bg-secondary)));
}

.ntk-reference-designer__grid {
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 16px;
  min-height: 0;
  flex: 1;
}

.ntk-reference-designer__workbench {
  min-height: 720px;
  min-width: 0;
}

.ntk-reference-designer__doc-identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ntk-reference-designer__doc-eyebrow {
  margin: 0;
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-reference-designer-muted);
  white-space: nowrap;
}

.ntk-reference-designer__doc-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ntk-reference-designer__doc-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ntk-reference-designer-muted);
  font-size: 12px;
  white-space: nowrap;
}

.ntk-reference-designer__doc-date {
  color: var(--ntk-reference-designer-text);
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
}
</style>
