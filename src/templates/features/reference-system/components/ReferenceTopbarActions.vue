<template>
  <div class="ntk-reference-topbar">
    <div class="ntk-reference-topbar__search">
      <q-input
        v-model="internalSearch"
        name="reference-topbar-search"
        dense
        outlined
        placeholder="Search screens, flows or tokens..."
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
          floating
          rounded
          class="ntk-reference-topbar__counter-badge"
        >
          {{ notificationCount }}
        </q-badge>
        <q-tooltip>Notifications</q-tooltip>

        <q-menu
          anchor="bottom right"
          self="top right"
          class="ntk-reference-topbar__notifications-menu"
        >
          <div class="ntk-reference-topbar__notifications-header">
            <span class="ntk-reference-topbar__notifications-title">Notifications</span>
            <q-badge
              v-if="unreadCount > 0"
              rounded
              class="ntk-reference-topbar__counter-badge ntk-reference-topbar__counter-badge--inline"
            >
              {{ unreadCount }}
            </q-badge>
          </div>
          <q-separator />
          <q-list dense>
            <q-item
              v-for="notif in notifications"
              :key="notif.id"
              v-close-popup
              clickable
              :class="{ 'ntk-reference-topbar__notif-item--unread': !notif.read }"
            >
              <q-item-section avatar>
                <q-icon
                  :name="notif.icon"
                  :color="notif.read ? 'grey-5' : 'primary'"
                  size="18px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  class="ntk-reference-topbar__notif-item-title"
                  :class="{ 'text-weight-bold': !notif.read }"
                >
                  {{ notif.title }}
                </q-item-label>
                <q-item-label
                  caption
                  class="ntk-reference-topbar__notif-item-desc"
                >
                  {{ notif.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section
                side
                class="ntk-reference-topbar__notif-item-time"
              >
                {{ notif.time }}
              </q-item-section>
            </q-item>
          </q-list>
          <div
            v-if="notifications.length === 0"
            class="ntk-reference-topbar__notifications-empty"
          >
            No notifications
          </div>
        </q-menu>
      </q-btn>

      <q-btn
        flat
        round
        dense
        icon="help_outline"
        class="ntk-reference-topbar__action-btn"
        aria-label="Help"
        @click="emit('help-click')"
      >
        <q-tooltip>Help</q-tooltip>
      </q-btn>

      <q-separator
        vertical
        class="ntk-reference-topbar__separator q-mx-sm"
      />

      <q-select
        :model-value="selectedPresetId"
        name="reference-topbar-preset"
        dense
        outlined
        emit-value
        map-options
        :options="presetOptions"
        :label="presetLabel"
        class="ntk-reference-topbar__preset-select"
        @update:model-value="emit('update:selectedPresetId', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

import type { ReferenceNotificationItem } from '../reference-system.types'

interface PresetOption {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  searchValue?: string
  selectedPresetId: string
  presetOptions?: PresetOption[]
  presetLabel?: string
  notificationCount?: number
  notifications?: ReferenceNotificationItem[]
}>(), {
  searchValue: '',
  presetOptions: () => [],
  presetLabel: 'Preset',
  notificationCount: 0,
  notifications: () => [],
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:selectedPresetId': [value: string | number | null]
  'help-click': []
}>()

const unreadCount = computed(() => props.notifications.filter(n => !n.read).length)

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
  gap: 12px;
  flex: 1;
}

.ntk-reference-topbar__search {
  flex: 1;
  max-width: 360px;
}

.ntk-reference-topbar__search-input {
  :deep(.q-field__control) {
    background: color-mix(in srgb, var(--ntk-reference-topbar-control-bg, #f1f5f9) 88%, transparent);
    border-radius: 14px;
    color: var(--ntk-reference-topbar-control-text, #0f172a);
  }

  :deep(.q-field__outlined .q-field__control::before) {
    border-color: var(--ntk-reference-topbar-control-border, #e2e8f0);
  }

  :deep(.q-field__native),
  :deep(.q-field__input) {
    color: var(--ntk-reference-topbar-control-text, #0f172a);
  }
}

.ntk-reference-topbar__search-icon {
  color: var(--ntk-reference-topbar-control-muted, #94a3b8);
}

.ntk-reference-topbar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.ntk-reference-topbar__action-btn {
  border: 1px solid var(--ntk-reference-topbar-control-border, rgba(148, 163, 184, 0.18));
  border-radius: 12px;
  background: color-mix(in srgb, var(--ntk-reference-topbar-control-bg, #f1f5f9) 82%, transparent);
  color: var(--ntk-reference-topbar-control-text, #64748b);
}

.ntk-reference-topbar__separator {
  height: 24px;
  opacity: 0.18;
}

.ntk-reference-topbar__preset-select {
  min-width: 180px;

  :deep(.q-field__control) {
    background: color-mix(in srgb, var(--ntk-reference-topbar-control-bg, #f1f5f9) 88%, transparent);
    border-radius: 14px;
  }

  :deep(.q-field__label),
  :deep(.q-field__native),
  :deep(.q-field__input),
  :deep(.q-select__dropdown-icon) {
    color: var(--ntk-reference-topbar-control-text, #0f172a) !important;
  }
}

.ntk-reference-topbar__counter-badge {
  background: color-mix(in srgb, var(--ntk-accent, #10b981) 24%, transparent) !important;
  color: var(--ntk-accent, #10b981) !important;
  border: 1px solid color-mix(in srgb, var(--ntk-accent, #10b981) 28%, transparent);
}

.ntk-reference-topbar__counter-badge--inline {
  position: static;
}

.ntk-reference-topbar__notifications-menu {
  min-width: 340px;
  max-width: 400px;
  border: 1px solid var(--ntk-reference-topbar-border, rgba(148, 163, 184, 0.18));
  border-radius: 18px;
  background: var(--ntk-reference-topbar-surface, #ffffff);
  box-shadow: var(--ntk-reference-shell-glow, 0 20px 48px rgba(15, 23, 42, 0.12));
  overflow: hidden;
}

.ntk-reference-topbar__notifications-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 10px;
  background: var(--ntk-reference-topbar-action-bg, #ffffff);
}

.ntk-reference-topbar__notifications-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--ntk-text-primary, #0f172a);
  flex: 1;
}

.ntk-reference-topbar__notifications-empty {
  padding: 20px 16px;
  font-size: 13px;
  color: var(--ntk-reference-topbar-control-muted, #94a3b8);
  text-align: center;
}

.ntk-reference-topbar__notif-item--unread {
  background: color-mix(in srgb, var(--ntk-accent, #10b981) 12%, var(--ntk-reference-topbar-surface, #ffffff));
}

.ntk-reference-topbar__notif-item-title {
  font-size: 13px;
  line-height: 1.3;
}

.ntk-reference-topbar__notif-item-desc {
  font-size: 12px;
  color: var(--ntk-reference-topbar-control-muted, #94a3b8);
  white-space: normal;
  line-height: 1.4;
}

.ntk-reference-topbar__notif-item-time {
  font-size: 11px;
  color: var(--ntk-reference-topbar-control-muted, #94a3b8);
  white-space: nowrap;
}
</style>
