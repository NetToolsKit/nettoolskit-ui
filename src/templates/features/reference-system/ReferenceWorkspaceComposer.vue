<template>
  <div
    class="ntk-reference-workspace-composer"
    :class="`ntk-reference-workspace-composer--${mode}`"
  >
    <ReferenceReportManagerTemplate
      v-if="showManager"
      :report-groups="reportGroups"
      :stats="managerStats"
      :quick-actions="managerQuickActions"
      :search-value="searchValue"
      :active-report-id="activeReportId"
      :selected-preset="selectedPreset"
      @update:search-value="emit('update:searchValue', $event)"
      @update:active-report-id="emit('update:activeReportId', $event)"
      @report-select="emit('report-select', $event)"
      @action-click="emit('manager-action-click', $event)"
    />

    <ReferenceReportDesignerTemplate
      v-if="showDesigner"
      :report-groups="reportGroups"
      :search-value="searchValue"
      :active-report-id="activeReportId"
      :selected-preset="selectedPreset"
      :document-tabs="documentTabs"
      :active-document-tab-id="activeDocumentTabId"
      :topbar-actions="designerTopbarActions"
      :quick-actions="designerQuickActions"
      :widget-sections="widgetSections"
      :canvas-columns="canvasColumns"
      :canvas-objects="canvasObjects"
      :rail-actions="railActions"
      :left-status-segments="leftStatusSegments"
      :right-status-segments="rightStatusSegments"
      :zoom-options="zoomOptions"
      :zoom-value="zoomValue"
      @update:search-value="emit('update:searchValue', $event)"
      @update:active-report-id="emit('update:activeReportId', $event)"
      @report-select="emit('report-select', $event)"
      @update:active-document-tab-id="emit('update:activeDocumentTabId', $event)"
      @toolbar-action-click="emit('toolbar-action-click', $event)"
      @widget-click="emit('widget-click', $event)"
      @canvas-object-click="emit('canvas-object-click', $event)"
      @rail-action-click="emit('rail-action-click', $event)"
      @status-click="emit('status-click', $event)"
      @update:zoom-value="emit('update:zoomValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ReferenceWhitelabelPreset } from '../../../whitelabel'
import type {
  TemplateDashboardMetric,
  TemplateEditorCanvasObject,
  TemplateEditorRailAction,
  TemplateEditorStatusSegment,
  TemplateEditorToolbarAction,
  TemplateEditorWidgetSection,
} from '../../pages'
import ReferenceReportDesignerTemplate from './ReferenceReportDesignerTemplate.vue'
import ReferenceReportManagerTemplate from './ReferenceReportManagerTemplate.vue'
import type {
  ReferenceDocumentTab,
  ReferenceReportGroup,
  ReferenceSurfaceAction,
} from './reference-system.types'

const props = withDefaults(defineProps<{
  mode?: 'catalog' | 'designer' | 'both'
  reportGroups: ReferenceReportGroup[]
  selectedPreset: ReferenceWhitelabelPreset
  searchValue?: string
  activeReportId?: string | null
  managerStats?: TemplateDashboardMetric[]
  managerQuickActions?: ReferenceSurfaceAction[]
  documentTabs?: ReferenceDocumentTab[]
  activeDocumentTabId?: string
  designerTopbarActions?: TemplateEditorToolbarAction[]
  designerQuickActions?: TemplateEditorToolbarAction[]
  widgetSections?: TemplateEditorWidgetSection[]
  canvasColumns?: string[]
  canvasObjects?: TemplateEditorCanvasObject[]
  railActions?: TemplateEditorRailAction[]
  leftStatusSegments?: TemplateEditorStatusSegment[]
  rightStatusSegments?: TemplateEditorStatusSegment[]
  zoomOptions?: number[]
  zoomValue?: number
}>(), {
  mode: 'catalog',
  searchValue: '',
  activeReportId: null,
  managerStats: () => [],
  managerQuickActions: () => [],
  documentTabs: () => [],
  activeDocumentTabId: 'layout',
  designerTopbarActions: () => [],
  designerQuickActions: () => [],
  widgetSections: () => [],
  canvasColumns: () => [],
  canvasObjects: () => [],
  railActions: () => [],
  leftStatusSegments: () => [],
  rightStatusSegments: () => [],
  zoomOptions: () => [100],
  zoomValue: 100,
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:activeReportId': [value: string]
  'report-select': [value: string]
  'manager-action-click': [value: string]
  'update:activeDocumentTabId': [value: string]
  'toolbar-action-click': [value: string]
  'widget-click': [value: string]
  'canvas-object-click': [value: string]
  'rail-action-click': [value: string]
  'status-click': [value: string]
  'update:zoomValue': [value: number]
}>()

const showManager = computed(() => {
  return props.mode === 'catalog' || props.mode === 'both'
})

const showDesigner = computed(() => {
  return props.mode === 'designer' || props.mode === 'both'
})
</script>

<style scoped lang="scss">
.ntk-reference-workspace-composer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
}

.ntk-reference-workspace-composer--catalog,
.ntk-reference-workspace-composer--designer {
  gap: 0;
}
</style>