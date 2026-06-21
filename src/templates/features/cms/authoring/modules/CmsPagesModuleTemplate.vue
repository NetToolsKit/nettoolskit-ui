<template>
  <CmsPagesModuleSurface
    v-bind="flatProps"
    @update:cms-pages-workspace-tab-value="emit('update:cmsPagesWorkspaceTabValue', $event)"
    @update:selected-page-template-id="emit('update:selectedPageTemplateId', $event)"
    @update:selected-builder-command-id="emit('update:selectedBuilderCommandId', $event)"
    @update:show-archived-reusable-sections="emit('update:showArchivedReusableSections', $event)"
    @update:cms-preview-source="emit('update:cmsPreviewSource', $event)"
    @update:cms-preview-locale="emit('update:cmsPreviewLocale', $event)"
    @update:cms-preview-viewport="emit('update:cmsPreviewViewport', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CmsPageTemplateId } from '../../../../../modules/cms/white-label/page-templates'
import type { CmsLocale, CmsPreviewSource, CmsPreviewViewport } from '../../../../../modules/cms/white-label/types'
import CmsPagesModuleSurface from './CmsPagesModuleSurface.vue'

defineOptions({
  name: 'CmsPagesModuleTemplate',
})

const props = defineProps<{
  shell: Record<string, unknown>
  builder: Record<string, unknown>
  library: Record<string, unknown>
  preview: Record<string, unknown>
  actions: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:cmsPagesWorkspaceTabValue': [value: string]
  'update:selectedPageTemplateId': [value: CmsPageTemplateId]
  'update:selectedBuilderCommandId': [value: string]
  'update:showArchivedReusableSections': [value: boolean]
  'update:cmsPreviewSource': [value: CmsPreviewSource]
  'update:cmsPreviewLocale': [value: CmsLocale]
  'update:cmsPreviewViewport': [value: CmsPreviewViewport]
}>()

type CmsPagesModuleSurfaceProps = InstanceType<typeof CmsPagesModuleSurface>['$props']

const flatProps = computed<CmsPagesModuleSurfaceProps>(() => ({
  ...props.shell,
  ...props.builder,
  ...props.library,
  ...props.preview,
  ...props.actions,
}) as unknown as CmsPagesModuleSurfaceProps)
</script>