<template>
  <CmsSettingsModuleSurface
    v-bind="flatProps"
    @update:cms-settings-workspace-tab-value="emit('update:cmsSettingsWorkspaceTabValue', $event)"
    @update:active-settings-tab="emit('update:activeSettingsTab', $event)"
    @update:selected-domain-transfer="emit('update:selectedDomainTransfer', $event)"
    @update:show-advanced-theme-fields="emit('update:showAdvancedThemeFields', $event)"
    @update:selected-authored-content-model-id="emit('update:selectedAuthoredContentModelId', $event)"
    @update:authored-content-model-name-draft="emit('update:authoredContentModelNameDraft', $event)"
    @update:authored-content-model-description-draft="emit('update:authoredContentModelDescriptionDraft', $event)"
    @update:authored-content-model-default-page-title-draft="emit('update:authoredContentModelDefaultPageTitleDraft', $event)"
    @update:authored-content-model-default-page-description-draft="emit('update:authoredContentModelDefaultPageDescriptionDraft', $event)"
    @update:authored-content-model-default-page-path-prefix-draft="emit('update:authoredContentModelDefaultPagePathPrefixDraft', $event)"
    @update:authored-content-model-migration-notes-draft="emit('update:authoredContentModelMigrationNotesDraft', $event)"
    @update:selected-authored-content-model-field-preset-id="emit('update:selectedAuthoredContentModelFieldPresetId', $event)"
    @update:show-archived-field-presets="emit('update:showArchivedFieldPresets', $event)"
    @update:authored-content-model-allowed-section-selections="emit('update:authoredContentModelAllowedSectionSelections', $event)"
    @tenant-import-file-change="emit('tenant-import-file-change', $event)"
    @domain-import-file-change="emit('domain-import-file-change', $event)"
    @schema-import-file-change="emit('schema-import-file-change', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CmsSettingsModuleSurface from './CmsSettingsModuleSurface.vue'

defineOptions({
  name: 'CmsSettingsModuleTemplate',
})

const props = defineProps<{
  shell: Record<string, unknown>
  tenant: Record<string, unknown>
  theme: Record<string, unknown>
  contentModel: Record<string, unknown>
  actions: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:cmsSettingsWorkspaceTabValue': [value: string]
  'update:activeSettingsTab': [value: string]
  'update:selectedDomainTransfer': [value: string]
  'update:showAdvancedThemeFields': [value: boolean]
  'update:selectedAuthoredContentModelId': [value: string]
  'update:authoredContentModelNameDraft': [value: string]
  'update:authoredContentModelDescriptionDraft': [value: string]
  'update:authoredContentModelDefaultPageTitleDraft': [value: string]
  'update:authoredContentModelDefaultPageDescriptionDraft': [value: string]
  'update:authoredContentModelDefaultPagePathPrefixDraft': [value: string]
  'update:authoredContentModelMigrationNotesDraft': [value: string]
  'update:selectedAuthoredContentModelFieldPresetId': [value: string]
  'update:showArchivedFieldPresets': [value: boolean]
  'update:authoredContentModelAllowedSectionSelections': [value: any[]]
  'tenant-import-file-change': [file: File]
  'domain-import-file-change': [file: File]
  'schema-import-file-change': [file: File]
}>()

type CmsSettingsModuleSurfaceProps = InstanceType<typeof CmsSettingsModuleSurface>['$props']

const flatProps = computed<CmsSettingsModuleSurfaceProps>(() => ({
  ...props.shell,
  ...props.tenant,
  ...props.theme,
  ...props.contentModel,
  ...props.actions,
}) as unknown as CmsSettingsModuleSurfaceProps)
</script>