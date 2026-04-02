<template>
  <div class="ntk-reference-topbar">
    <div class="ntk-reference-topbar__search">
      <q-input
        v-model="internalSearch"
        dense
        outlined
        placeholder="Search reports…"
        class="ntk-reference-topbar__search-input"
        @update:model-value="onSearchInput(String($event ?? ''))"
      >
        <template #prepend>
          <q-icon
            name="search"
            size="18px"
            class="ntk-reference-topbar__search-icon"
          />
        </template>
        <template
          v-if="internalSearch"
          #append
        >
          <q-icon
            name="close"
            size="14px"
            class="cursor-pointer"
            @click="clearSearch"
          />
        </template>
      </q-input>
    </div>

    <div class="ntk-reference-topbar__actions">
      <q-btn
        flat
        round
        dense
        icon="notifications_none"
        class="ntk-reference-topbar__action-btn"
        aria-label="Notifications"
      >
        <q-badge
          v-if="notificationCount > 0"
          color="negative"
          floating
          rounded
        >
          {{ notificationCount }}
        </q-badge>
        <q-tooltip>Notifications</q-tooltip>
      </q-btn>

      <q-btn
        flat
        round
        dense
        icon="help_outline"
        class="ntk-reference-topbar__action-btn"
        aria-label="Help"
      >
        <q-tooltip>Help</q-tooltip>
      </q-btn>

      <q-separator
        vertical
        class="ntk-reference-topbar__separator q-mx-sm"
      />

      <q-select
        :model-value="selectedPresetId"
        dense
        outlined
        emit-value
        map-options
        :options="presetOptions"
        :label="presetLabel"
        class="ntk-reference-topbar__preset-select"
        @update:model-value="emit('update:selectedPresetId', $event)"
      />

      <q-separator
        vertical
        class="ntk-reference-topbar__separator q-mx-sm"
      />

      <q-btn
        flat
        dense
        round
        class="ntk-reference-topbar__user-btn"
        aria-label="User menu"
      >
        <div class="ntk-reference-topbar__user-avatar">
          {{ userInitials }}
        </div>

        <q-menu
          anchor="bottom right"
          self="top right"
          class="ntk-reference-topbar__user-menu"
        >
          <div class="ntk-reference-topbar__user-menu-header">
            <div class="ntk-reference-topbar__user-menu-avatar">
              {{ userInitials }}
            </div>
            <div>
              <div class="ntk-reference-topbar__user-menu-name">{{ userName }}</div>
              <div class="ntk-reference-topbar__user-menu-role">Reference Workspace</div>
            </div>
          </div>

          <q-separator />

          <q-list dense>
            <q-item
              v-close-popup
              clickable
              @click="emit('profile-click')"
            >
              <q-item-section avatar>
                <q-icon name="person_outline" />
              </q-item-section>
              <q-item-section>Profile</q-item-section>
            </q-item>

            <q-item
              v-close-popup
              clickable
              @click="emit('settings-click')"
            >
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>Settings</q-item-section>
            </q-item>

            <q-separator />

            <q-item
              v-close-popup
              clickable
              @click="emit('back-home-click')"
            >
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>Back to home</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

interface PresetOption {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  searchValue?: string
  selectedPresetId: string
  presetOptions?: PresetOption[]
  presetLabel?: string
  userName?: string
  userInitials?: string
  notificationCount?: number
}>(), {
  searchValue: '',
  presetOptions: () => [],
  presetLabel: 'Preset',
  userName: 'Reference Team',
  userInitials: 'RT',
  notificationCount: 0,
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:selectedPresetId': [value: string | number | null]
  'profile-click': []
  'settings-click': []
  'back-home-click': []
}>()

const internalSearch = ref(props.searchValue)

watch(() => props.searchValue, value => {
  internalSearch.value = value
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput(val: string): void {
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('update:searchValue', val), 300)
}

function clearSearch(): void {
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  internalSearch.value = ''
  emit('update:searchValue', '')
}

onUnmounted(() => {
  if (debounceTimer !== null) clearTimeout(debounceTimer)
})
</script>

<style scoped lang="scss">
.ntk-reference-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.ntk-reference-topbar__search {
  flex: 1;
  max-width: 320px;
}

.ntk-reference-topbar__search-input {
  :deep(.q-field__control) {
    background: var(--ntk-bg-secondary, #f1f5f9);
    border-radius: 8px;
  }

  :deep(.q-field__outlined .q-field__control::before) {
    border-color: var(--ntk-border-color, #e2e8f0);
  }
}

.ntk-reference-topbar__search-icon {
  color: var(--ntk-text-muted, #94a3b8);
}

.ntk-reference-topbar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.ntk-reference-topbar__action-btn {
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-reference-topbar__separator {
  height: 24px;
  opacity: 0.3;
}

.ntk-reference-topbar__preset-select {
  min-width: 180px;

  :deep(.q-field__control) {
    background: var(--ntk-bg-secondary, #f1f5f9);
  }
}

.ntk-reference-topbar__user-btn {
  padding: 4px;
}

.ntk-reference-topbar__user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ntk-primary, #2563eb);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.ntk-reference-topbar__user-menu {
  min-width: 220px;
}

.ntk-reference-topbar__user-menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.ntk-reference-topbar__user-menu-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ntk-primary, #2563eb);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.ntk-reference-topbar__user-menu-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-reference-topbar__user-menu-role {
  font-size: 12px;
  color: var(--ntk-text-muted, #94a3b8);
}
</style>