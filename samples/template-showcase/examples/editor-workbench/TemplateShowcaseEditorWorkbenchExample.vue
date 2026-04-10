<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="editor-workbench"
  >
    <h2>Editor Workbench Template</h2>
    <EditorWorkbenchTemplate
      :document-title="templateShowcaseEditorSample.documentTitle"
      :document-subtitle="templateShowcaseEditorSample.documentSubtitle"
      :topbar-actions="templateShowcaseEditorSample.topbarActions"
      :quick-actions="templateShowcaseEditorSample.quickActions"
      :zoom-options="templateShowcaseEditorSample.zoomOptions"
      :zoom-value="zoomValue"
      :widget-sections="templateShowcaseEditorSample.widgetSections"
      :selected-widget-id="selectedWidgetId"
      :canvas-columns="templateShowcaseEditorSample.canvasColumns"
      :canvas-objects="templateShowcaseEditorSample.canvasObjects"
      :rail-actions="templateShowcaseEditorSample.railActions"
      :left-status-segments="templateShowcaseEditorSample.leftStatusSegments"
      :right-status-segments="templateShowcaseEditorSample.rightStatusSegments"
      @update:selected-widget-id="selectedWidgetId = $event"
      @update:zoom-value="zoomValue = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import EditorWorkbenchTemplate from '../../../../src/templates/pages/editor/EditorWorkbenchTemplate.vue'
import { templateShowcaseEditorSample } from '../../template-showcase.sample-data'

const selectedWidgetId = ref<string | null>(templateShowcaseEditorSample.initialSelectedWidgetId)
const zoomValue = ref(templateShowcaseEditorSample.initialZoomValue)
</script>
