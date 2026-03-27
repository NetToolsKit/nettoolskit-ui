<template>
  <q-card flat bordered class="cms-shell-card cms-authoring-workbench">
    <EditorWorkbenchTemplate
      class="cms-authoring-workbench__template"
      :page-aria-label="pageAriaLabel"
      :canvas-aria-label="canvasAriaLabel"
      :status-bar-aria-label="statusBarAriaLabel"
    >
      <template #topbar-document>
        <slot name="header" />
      </template>

      <template #topbar-actions />

      <template #commandbar>
        <slot name="ruler" />
      </template>

      <template #widgets-panel>
        <div class="cms-authoring-workbench__panel-spacer" aria-hidden="true" />
      </template>

      <template #ruler-left>
        <div class="cms-authoring-workbench__ruler-spacer" aria-hidden="true" />
      </template>

      <template #canvas-stage>
        <slot name="workbench" />
      </template>

      <template #right-rail>
        <div class="cms-authoring-workbench__panel-spacer" aria-hidden="true" />
      </template>

      <template #statusbar-left>
        <slot name="status" />
      </template>

      <template #statusbar-right>
        <slot name="status-right" />
      </template>
    </EditorWorkbenchTemplate>
  </q-card>
</template>

<script setup lang="ts">
import EditorWorkbenchTemplate from '../../../pages/editor/EditorWorkbenchTemplate.vue'

withDefaults(defineProps<{
  pageAriaLabel?: string
  canvasAriaLabel?: string
  statusBarAriaLabel?: string
}>(), {
  pageAriaLabel: 'CMS authoring workbench',
  canvasAriaLabel: 'CMS authoring canvas',
  statusBarAriaLabel: 'CMS authoring status bar',
})
</script>

<style scoped>
.cms-authoring-workbench {
  min-height: 0;
  overflow: hidden;
}

.cms-authoring-workbench__template {
  min-height: 0;
}

.cms-authoring-workbench__panel-spacer,
.cms-authoring-workbench__ruler-spacer {
  display: none;
}

.cms-authoring-workbench :deep(.ntk-template-editor-workbench) {
  min-height: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.cms-authoring-workbench :deep(.ntk-template-editor-workbench__topbar),
.cms-authoring-workbench :deep(.ntk-template-editor-workbench__commandbar),
.cms-authoring-workbench :deep(.ntk-template-editor-workbench__canvas-stage),
.cms-authoring-workbench :deep(.ntk-template-editor-workbench__statusbar) {
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.cms-authoring-workbench :deep(.ntk-template-editor-workbench__workspace) {
  grid-template-columns: 1fr;
  gap: 0;
  min-height: 0;
}

.cms-authoring-workbench :deep(.ntk-template-editor-workbench__widgets-panel),
.cms-authoring-workbench :deep(.ntk-template-editor-workbench__right-rail),
.cms-authoring-workbench :deep(.ntk-template-editor-workbench__ruler-left) {
  display: none;
}

.cms-authoring-workbench :deep(.ntk-template-editor-workbench__canvas-shell) {
  min-height: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.cms-authoring-workbench :deep(.ntk-template-editor-workbench__canvas-body) {
  grid-template-columns: 1fr;
  min-height: 0;
}
</style>