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
            class="cursor-pointer ntk-reference-topbar__close-icon"
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
        <q-tooltip class="ntk-reference-topbar__tooltip">Notifications</q-tooltip>

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
                  size="18px"
                  :class="notif.read ? 'ntk-reference-topbar__notif-icon--muted' : 'ntk-reference-topbar__notif-icon--accent'"
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
        <q-tooltip class="ntk-reference-topbar__tooltip">Help</q-tooltip>
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
        popup-content-class="ntk-reference-topbar__preset-popup"
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
  --ntk-reference-topbar-surface: var(--ntk-reference-panel-bg, var(--ntk-template-page-card-bg, var(--ntk-bg-primary)));
  --ntk-reference-topbar-surface-muted: var(--ntk-reference-panel-muted-bg, color-mix(in srgb, var(--ntk-reference-topbar-surface) 92%, transparent));
  --ntk-reference-topbar-border: var(--ntk-reference-border, color-mix(in srgb, var(--ntk-text-primary) 12%, transparent));
  --ntk-reference-topbar-text: var(--ntk-text-primary);
  --ntk-reference-topbar-text-muted: var(--ntk-text-secondary);
  --ntk-reference-topbar-icon-muted: color-mix(in srgb, var(--ntk-reference-topbar-text-muted) 72%, transparent);
  --ntk-reference-topbar-accent: var(--ntk-primary, var(--ntk-accent));
  --ntk-reference-topbar-accent-soft-bg: color-mix(in srgb, var(--ntk-reference-topbar-accent) 24%, var(--ntk-template-popup-bg, var(--ntk-bg-card)));
  --ntk-reference-topbar-accent-soft-border: color-mix(in srgb, var(--ntk-reference-topbar-accent) 32%, var(--ntk-template-popup-border, var(--ntk-reference-topbar-border)));
  --ntk-reference-topbar-popup-hover-bg: color-mix(in srgb, var(--ntk-reference-topbar-accent) 12%, var(--ntk-template-popup-bg, var(--ntk-bg-card)));
  --ntk-reference-topbar-popup-accent-text: var(--ntk-template-popup-text, var(--ntk-reference-topbar-text));
  --ntk-reference-topbar-popup-unread-bg: color-mix(in srgb, var(--ntk-reference-topbar-accent) 18%, var(--ntk-template-popup-bg, var(--ntk-bg-card)));
  --ntk-reference-topbar-popup-unread-border: color-mix(in srgb, var(--ntk-reference-topbar-accent) 30%, var(--ntk-template-popup-border, var(--ntk-reference-topbar-border)));
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.ntk-reference-topbar__search {
  flex: 1;
  max-width: 320px;
}

.ntk-reference-topbar__search-input {
  :deep(.q-field__control) {
    background: var(--ntk-reference-topbar-surface-muted);
    border-radius: 10px;
    color: var(--ntk-reference-topbar-text);
  }

  :deep(.q-field__outlined .q-field__control::before) {
    border-color: var(--ntk-reference-topbar-border);
  }

  :deep(.q-field__native),
  :deep(.q-field__input) {
    color: var(--ntk-reference-topbar-text);
  }
}

.ntk-reference-topbar__search-icon {
  color: var(--ntk-reference-topbar-icon-muted);
}

.ntk-reference-topbar__close-icon {
  color: var(--ntk-reference-topbar-icon-muted);
}

.ntk-reference-topbar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.ntk-reference-topbar__action-btn {
  border: 1px solid var(--ntk-reference-topbar-border);
  border-radius: 10px;
  background: var(--ntk-reference-topbar-surface-muted);
  color: var(--ntk-reference-topbar-text-muted);
}

.ntk-reference-topbar__separator {
  height: 24px;
  opacity: 0.18;
}

.ntk-reference-topbar__preset-select {
  min-width: 180px;

  :deep(.q-field__control) {
    background: var(--ntk-reference-topbar-surface-muted);
    border-radius: 10px;
  }

  :deep(.q-field__label),
  :deep(.q-field__native),
  :deep(.q-field__input),
  :deep(.q-select__dropdown-icon) {
    color: var(--ntk-reference-topbar-text) !important;
  }
}

:global(.ntk-reference-topbar__preset-popup) {
  border-radius: 12px;
  min-width: 180px;
}

:global(.ntk-reference-topbar__preset-popup .q-item.q-manual-focusable--focused),
:global(.ntk-reference-topbar__preset-popup .q-item:hover) {
  background: var(--ntk-reference-topbar-popup-hover-bg);
}

.ntk-reference-topbar__counter-badge {
  background: var(--ntk-reference-topbar-accent-soft-bg) !important;
  color: var(--ntk-reference-topbar-popup-accent-text) !important;
  border: 1px solid var(--ntk-reference-topbar-accent-soft-border);
}

.ntk-reference-topbar__counter-badge--inline {
  position: static;
}

:global(.ntk-reference-topbar__notifications-menu) {
  min-width: 340px;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notifications-header) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 10px;
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notifications-title) {
  font-weight: 600;
  font-size: 13px;
  color: var(--ntk-template-popup-text, var(--ntk-text-primary));
  flex: 1;
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notifications-empty) {
  padding: 20px 16px;
  font-size: 13px;
  color: var(--ntk-template-popup-muted, var(--ntk-text-secondary));
  text-align: center;
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notif-item--unread) {
  background: var(--ntk-reference-topbar-popup-unread-bg);
  box-shadow: inset 0 0 0 1px var(--ntk-reference-topbar-popup-unread-border);
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notif-icon--muted) {
  color: var(--ntk-template-popup-muted, var(--ntk-text-secondary));
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notif-icon--accent) {
  color: var(--ntk-reference-topbar-popup-accent-text);
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notif-item-title) {
  font-size: 13px;
  line-height: 1.3;
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notif-item-desc) {
  font-size: 12px;
  color: var(--ntk-template-popup-muted, var(--ntk-text-secondary));
  white-space: normal;
  line-height: 1.4;
}

:global(.ntk-reference-topbar__notifications-menu .ntk-reference-topbar__notif-item-time) {
  font-size: 11px;
  color: var(--ntk-template-popup-muted, var(--ntk-text-secondary));
  white-space: nowrap;
}
</style>
