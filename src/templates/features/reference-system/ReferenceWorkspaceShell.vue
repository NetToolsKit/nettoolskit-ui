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

      <template #header-actions="{ layoutControls }">
        <slot name="header-actions">
          <ReferenceTopbarActions
            :search-value="searchValue"
            :selected-preset-id="selectedPresetId"
            :preset-options="presetOptions"
            :preset-label="presetLabel"
            :notification-count="notificationCount"
            :notifications="notifications"
            @update:search-value="emit('update:searchValue', $event)"
            @update:selected-preset-id="emit('update:selectedPresetId', $event)"
            @help-click="emit('help-click')"
          />
          <UserMenuTemplate
            :model-value="layoutControls.horizontalMode"
            :show-labels-in-mini="layoutControls.showLabelsInMini"
            :side-menu-variant="layoutControls.sideMenuVariant"
            :app-name="selectedPreset.brand.name"
            :profile-name="userName"
            :profile-initials="userInitials"
            :show-side-menu-style-toggle="false"
            @update:model-value="layoutControls.setHorizontalMode($event)"
            @update:show-labels-in-mini="layoutControls.setShowLabelsInMini($event)"
            @update:side-menu-variant="layoutControls.setSideMenuVariant($event)"
            @account-click="emit('profile-click')"
            @logout-click="emit('back-home-click')"
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
import UserMenuTemplate from '../../navigation/UserMenuTemplate.vue'
import type { ReferenceWhitelabelPreset } from '../../../whitelabel'
import ReferenceBrandLockup from './components/ReferenceBrandLockup.vue'
import ReferenceTopbarActions from './components/ReferenceTopbarActions.vue'
import type { ReferenceNotificationItem } from './reference-system.types'

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
  searchValue?: string
  notificationCount?: number
  notifications?: ReferenceNotificationItem[]
  presetLabel?: string
}>(), {
  whitelabelStyleVars: () => ({}),
  presetOptions: () => [],
  activeItemId: '',
  userName: 'Reference Team',
  userInitials: 'RT',
  storageKeyPrefix: 'ntk-reference-samples-layout',
  pageContainerClass: 'ntk-reference-workspace-shell__page-container',
  searchValue: '',
  notificationCount: 0,
  notifications: () => [],
  presetLabel: 'Whitelabel preset',
})

const emit = defineEmits<{
  'update:selectedPresetId': [value: string | number | null]
  'update:searchValue': [value: string]
  'help-click': []
  'profile-click': []
  'back-home-click': []
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