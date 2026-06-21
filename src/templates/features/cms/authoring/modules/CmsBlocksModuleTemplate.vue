<template>
  <CmsBlocksModuleSurface
    v-bind="flatProps"
    @update:cms-blocks-workspace-tab-value="emit('update:cmsBlocksWorkspaceTabValue', $event)"
    @update:selected-builder-command-id="emit('update:selectedBuilderCommandId', $event)"
    @update:active-blocks-page-id="emit('update:activeBlocksPageId', $event)"
    @update:active-blocks-section-id="emit('update:activeBlocksSectionId', $event)"
    @update:active-blocks-block-id="emit('update:activeBlocksBlockId', $event)"
    @update:selected-palette-block-type="emit('update:selectedPaletteBlockType', $event)"
    @update:selected-palette-block-preset-id="emit('update:selectedPaletteBlockPresetId', $event)"
    @update:reusable-block-name-draft="emit('update:reusableBlockNameDraft', $event)"
    @update:reusable-block-description-draft="emit('update:reusableBlockDescriptionDraft', $event)"
    @update:selected-reusable-block-id="emit('update:selectedReusableBlockId', $event)"
    @update:show-archived-reusable-blocks="emit('update:showArchivedReusableBlocks', $event)"
    @update:authored-block-preset-name-draft="emit('update:authoredBlockPresetNameDraft', $event)"
    @update:authored-block-preset-description-draft="emit('update:authoredBlockPresetDescriptionDraft', $event)"
    @update:selected-authored-block-preset-id="emit('update:selectedAuthoredBlockPresetId', $event)"
    @update:authored-preset-starter-section-selections="emit('update:authoredPresetStarterSectionSelections', $event)"
    @update:show-archived-authored-block-presets="emit('update:showArchivedAuthoredBlockPresets', $event)"
    @update:active-blocks-props-draft="emit('update:activeBlocksPropsDraft', $event)"
    @update:cms-preview-source="emit('update:cmsPreviewSource', $event)"
    @update:cms-preview-locale="emit('update:cmsPreviewLocale', $event)"
    @update:cms-preview-viewport="emit('update:cmsPreviewViewport', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CmsBlockPresetId, CmsLocale, CmsPreviewSource, CmsPreviewViewport, CmsSectionPresetId } from '../../../../../modules/cms/white-label/types'
import CmsBlocksModuleSurface from './CmsBlocksModuleSurface.vue'

defineOptions({
  name: 'CmsBlocksModuleTemplate',
})

const props = defineProps<{
  shell: Record<string, unknown>
  builder: Record<string, unknown>
  library: Record<string, unknown>
  preview: Record<string, unknown>
  actions: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:cmsBlocksWorkspaceTabValue': [value: string]
  'update:selectedBuilderCommandId': [value: string]
  'update:activeBlocksPageId': [value: string]
  'update:activeBlocksSectionId': [value: string]
  'update:activeBlocksBlockId': [value: string]
  'update:selectedPaletteBlockType': [value: string]
  'update:selectedPaletteBlockPresetId': [value: CmsBlockPresetId]
  'update:reusableBlockNameDraft': [value: string]
  'update:reusableBlockDescriptionDraft': [value: string]
  'update:selectedReusableBlockId': [value: string]
  'update:showArchivedReusableBlocks': [value: boolean]
  'update:authoredBlockPresetNameDraft': [value: string]
  'update:authoredBlockPresetDescriptionDraft': [value: string]
  'update:selectedAuthoredBlockPresetId': [value: CmsBlockPresetId]
  'update:authoredPresetStarterSectionSelections': [value: CmsSectionPresetId[]]
  'update:showArchivedAuthoredBlockPresets': [value: boolean]
  'update:activeBlocksPropsDraft': [value: string]
  'update:cmsPreviewSource': [value: CmsPreviewSource]
  'update:cmsPreviewLocale': [value: CmsLocale]
  'update:cmsPreviewViewport': [value: CmsPreviewViewport]
}>()

type CmsBlocksModuleSurfaceProps = InstanceType<typeof CmsBlocksModuleSurface>['$props']

const flatProps = computed<CmsBlocksModuleSurfaceProps>(() => ({
  ...props.shell,
  ...props.builder,
  ...props.library,
  ...props.preview,
  ...props.actions,
}) as unknown as CmsBlocksModuleSurfaceProps)
</script>