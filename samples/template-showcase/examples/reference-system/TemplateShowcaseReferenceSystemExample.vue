<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="reference-system"
  >
    <h2>Reference System Templates</h2>
    <div
      class="ntk-template-showcase__reference-shell"
      :style="referenceShowcaseStyleVars"
    >
      <ReferenceWorkspaceComposer
        mode="both"
        :report-groups="referenceSampleReportGroups"
        :selected-preset="referenceShowcasePreset"
        :search-value="referenceShowcaseSearchValue"
        :active-report-id="referenceShowcaseActiveReportId"
        :manager-stats="referenceSampleManagerConfig.stats"
        :manager-quick-actions="referenceSampleManagerConfig.quickActions"
        :document-tabs="referenceSampleDocumentTabs"
        :active-document-tab-id="referenceShowcaseActiveDocumentTabId"
        :designer-topbar-actions="referenceSampleDesignerConfig.topbarActions"
        :designer-quick-actions="referenceSampleDesignerConfig.quickActions"
        :widget-sections="referenceSampleDesignerConfig.widgetSections"
        :canvas-columns="referenceSampleDesignerConfig.canvasColumns"
        :canvas-objects="referenceSampleDesignerConfig.canvasObjects"
        :rail-actions="referenceSampleDesignerConfig.railActions"
        :left-status-segments="referenceSampleDesignerConfig.leftStatusSegments"
        :right-status-segments="referenceSampleDesignerConfig.rightStatusSegments"
        :zoom-options="referenceSampleDesignerConfig.zoomOptions"
        :zoom-value="referenceShowcaseZoomValue"
        @update:search-value="referenceShowcaseSearchValue = $event"
        @update:active-report-id="referenceShowcaseActiveReportId = $event"
        @report-select="handleReferenceReportSelect"
        @manager-action-click="handleReferenceAction"
        @update:active-document-tab-id="referenceShowcaseActiveDocumentTabId = $event"
        @toolbar-action-click="handleReferenceAction"
        @widget-click="handleReferenceAction"
        @canvas-object-click="handleReferenceAction"
        @rail-action-click="handleReferenceAction"
        @status-click="handleReferenceAction"
        @update:zoom-value="referenceShowcaseZoomValue = $event"
      />
    </div>
    <SampleActionStatus
      title="Reference action"
      :message="referenceMessage"
      tone="success"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  ReferenceWorkspaceComposer,
  referenceSampleDesignerConfig,
  referenceSampleDocumentTabs,
  referenceSampleManagerConfig,
  referenceSampleReportGroups,
} from '../../../../src/templates/features/reference-system'
import { resolveReferenceWhitelabelPreset } from '../../../../src/whitelabel'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import { useTemplateVisualThemeContext } from '../../families/template-visual-family.context'

const themeVariant = useTemplateVisualThemeContext()
const referenceShowcaseSearchValue = ref('')
const referenceShowcaseActiveReportId = ref(referenceSampleReportGroups[0]?.items[0]?.id ?? '')
const referenceShowcaseActiveDocumentTabId = ref(referenceSampleDocumentTabs[0]?.id ?? 'layout')
const referenceShowcaseZoomValue = ref(referenceSampleDesignerConfig.zoomOptions[2] ?? 100)
const fallbackPreset = resolveReferenceWhitelabelPreset('reference-night')

const referenceShowcasePreset = computed(() => {
  return themeVariant?.preset ?? fallbackPreset
})

const referenceShowcaseStyleVars = computed(() => {
  return themeVariant?.styleVars ?? {}
})

const referenceMessage = ref('Use the manager or designer controls to inspect the reference workspace interactions.')

function handleReferenceAction(actionId: string): void {
  referenceMessage.value = `Reference workspace action executed: ${actionId}.`
}

function handleReferenceReportSelect(reportId: string): void {
  referenceShowcaseActiveReportId.value = reportId
  referenceMessage.value = `Reference report selected: ${reportId}.`
}
</script>
