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
      @toolbar-action-click="editorMessage = `Toolbar action executed: ${$event}.`"
      @widget-click="editorMessage = `Widget selected: ${$event}.`"
      @canvas-object-click="editorMessage = `Canvas object selected: ${$event}.`"
      @rail-action-click="editorMessage = `Inspector action executed: ${$event}.`"
      @status-click="editorMessage = `Status segment selected: ${$event}.`"
    />
    <SampleActionStatus
      title="Workbench action"
      :message="editorMessage"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import EditorWorkbenchTemplate from '../../../../src/templates/pages/editor/EditorWorkbenchTemplate.vue'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import { templateShowcaseEditorSample } from '../../template-showcase.sample-data'

const selectedWidgetId = ref<string | null>(templateShowcaseEditorSample.initialSelectedWidgetId)
const zoomValue = ref(templateShowcaseEditorSample.initialZoomValue)
const editorMessage = ref('Select widgets, toolbar actions, or rail controls to inspect editor interactions.')
</script>
