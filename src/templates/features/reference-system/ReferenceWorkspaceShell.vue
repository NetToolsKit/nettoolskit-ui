<template>
  <div
    class="ntk-reference-workspace-shell"
    :style="whitelabelStyleVars"
  >
    <MainLayoutTemplate
      :app-name="selectedPreset.brand.name"
      :user-name="userName"
      :user-initials="userInitials"
      :menu-items="menuItems"
      :show-breadcrumb="false"
      :side-menu-variant="'reference'"
      :active-item-id="activeItemId"
      :storage-key-prefix="storageKeyPrefix"
      :page-container-class="pageContainerClass"
      @menu-item-click="emit('menu-item-click', $event)"
    >
      <template #brand>
        <ReferenceBrandLockup :preset="selectedPreset" />
      </template>

      <template #header-actions>
        <slot name="header-actions">
          <ReferencePresetSelectorBar
            :model-value="selectedPresetId"
            :options="presetOptions"
            :label="presetLabel"
            :primary-action-label="primaryActionLabel"
            :primary-action-icon="primaryActionIcon"
            :show-primary-action="showPrimaryAction"
            @update:model-value="emit('update:selectedPresetId', $event)"
            @primary-action-click="emit('primary-action-click')"
          />
        </slot>
      </template>

      <slot />
    </MainLayoutTemplate>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import type { TemplateMenuChildItem, TemplateMenuItem } from '../../navigation/menu-template.types'
import MainLayoutTemplate from '../../layouts/MainLayoutTemplate.vue'
import type { ReferenceWhitelabelPreset } from '../../../whitelabel'
import ReferenceBrandLockup from './components/ReferenceBrandLockup.vue'
import ReferencePresetSelectorBar from './components/ReferencePresetSelectorBar.vue'

interface ReferencePresetOption {
  label: string
  value: string
}

withDefaults(defineProps<{
  whitelabelStyleVars?: CSSProperties
  selectedPreset: ReferenceWhitelabelPreset
  selectedPresetId: string
  presetOptions?: ReferencePresetOption[]
  menuItems: TemplateMenuItem[]
  activeItemId?: string
  userName?: string
  userInitials?: string
  storageKeyPrefix?: string
  pageContainerClass?: string
  presetLabel?: string
  primaryActionLabel?: string
  primaryActionIcon?: string
  showPrimaryAction?: boolean
}>(), {
  whitelabelStyleVars: () => ({}),
  presetOptions: () => [],
  activeItemId: '',
  userName: 'Reference Team',
  userInitials: 'RT',
  storageKeyPrefix: 'ntk-reference-samples-layout',
  pageContainerClass: 'ntk-reference-workspace-shell__page-container',
  presetLabel: 'Whitelabel preset',
  primaryActionLabel: 'Open designer',
  primaryActionIcon: 'design_services',
  showPrimaryAction: true,
})

const emit = defineEmits<{
  'update:selectedPresetId': [value: string | number | null]
  'primary-action-click': []
  'menu-item-click': [item: TemplateMenuItem | TemplateMenuChildItem]
}>()
</script>

<style scoped lang="scss">
.ntk-reference-workspace-shell {
  min-height: 100vh;
  background: var(--ntk-template-layout-page-bg, #f8fafc);
}

.ntk-reference-workspace-shell :deep(.ntk-reference-workspace-shell__page-container) {
  min-height: calc(100vh - 56px);
}
</style>