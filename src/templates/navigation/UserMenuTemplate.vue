<template>
  <q-btn
    round
    flat
    class="ntk-template-user-menu__trigger"
  >
    <q-avatar
      size="40px"
      class="ntk-template-user-menu__avatar"
      font-size="13px"
    >
      {{ profile.initials }}
    </q-avatar>

    <q-menu
      class="ntk-template-user-menu q-pb-md"
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
      transition-show="jump-down"
      transition-hide="jump-up"
      transition-duration="200"
    >
      <div class="ntk-template-user-menu__header q-pa-md">
        <div class="row items-center justify-between">
          <span class="text-weight-medium">{{ appName }}</span>
          <q-btn
            no-caps
            flat
            :label="signOutLabel"
            class="ntk-template-user-menu__accent-action"
            @click="$emit('logout-click')"
          />
        </div>
      </div>

      <q-separator />

      <div class="ntk-template-user-menu__profile q-pa-md">
        <div class="row no-wrap q-gutter-md">
          <q-avatar
            :size="largeAvatarSize"
            class="ntk-template-user-menu__avatar ntk-template-user-menu__avatar--large"
          >
            {{ profile.initials }}
          </q-avatar>

          <div class="column justify-center">
            <div class="text-subtitle1 text-weight-bold">
              {{ profile.name }}
            </div>
            <div>
              <q-btn
                flat
                no-caps
                :label="accountLabel"
                class="q-px-none ntk-template-user-menu__accent-action"
                @click="$emit('account-click')"
              />
            </div>
          </div>
        </div>
      </div>

      <q-separator />

      <q-list>
        <q-item-label
          header
          class="ntk-template-user-menu__section-label"
        >
          {{ preferencesLabel }}
        </q-item-label>

        <q-item>
          <q-item-section avatar>
            <q-icon
              :name="modelValue ? 'view_stream' : 'view_sidebar'"
              class="ntk-template-user-menu__item-icon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ horizontalMenuLabel }}</q-item-label>
            <q-item-label caption>
              {{ horizontalMenuCaption }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="modelValue"
              class="ntk-template-user-menu__toggle"
              @update:model-value="$emit('update:modelValue', $event)"
            />
          </q-item-section>
        </q-item>

        <q-item :disable="modelValue">
          <q-item-section avatar>
            <q-icon
              :name="showLabelsInMini ? 'label' : 'label_off'"
              class="ntk-template-user-menu__item-icon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ miniLabelsLabel }}</q-item-label>
            <q-item-label caption>
              {{ miniLabelsCaption }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="showLabelsInMini"
              :disable="modelValue"
              class="ntk-template-user-menu__toggle"
              @update:model-value="$emit('update:showLabelsInMini', $event)"
            />
          </q-item-section>
        </q-item>

        <q-item
          v-if="showSideMenuStyleToggle"
          :disable="modelValue"
        >
          <q-item-section avatar>
            <q-icon
              :name="sideMenuVariant === 'vercel' ? 'auto_awesome' : 'tune'"
              class="ntk-template-user-menu__item-icon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ sideMenuStyleLabel }}</q-item-label>
            <q-item-label caption>
              {{ sideMenuStyleCaption }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="sideMenuVariant === 'vercel'"
              :disable="modelValue"
              class="ntk-template-user-menu__toggle"
              @update:model-value="$emit('update:sideMenuVariant', $event ? 'vercel' : 'reference')"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { TemplateUserMenuProfile } from './menu-template.types'

const props = withDefaults(defineProps<{
  modelValue: boolean
  showLabelsInMini: boolean
  sideMenuVariant: 'vercel' | 'reference'
  appName?: string
  profileName?: string
  profileInitials?: string
  largeAvatarSize?: string
  signOutLabel?: string
  accountLabel?: string
  preferencesLabel?: string
  horizontalMenuLabel?: string
  horizontalMenuCaption?: string
  miniLabelsLabel?: string
  miniLabelsCaption?: string
  sideMenuStyleLabel?: string
  sideMenuStyleCaption?: string
  showSideMenuStyleToggle?: boolean
}>(), {
  appName: 'NetToolsKit',
  profileName: 'User',
  profileInitials: 'U',
  largeAvatarSize: '56px',
  signOutLabel: 'Sign out',
  accountLabel: 'View account',
  preferencesLabel: 'Preferences',
  horizontalMenuLabel: 'Horizontal menu',
  horizontalMenuCaption: 'Toggle between side and top navigation',
  miniLabelsLabel: 'Labels in mini menu',
  miniLabelsCaption: 'Show labels below icons in compact mode',
  sideMenuStyleLabel: 'Sidebar style',
  sideMenuStyleCaption: 'Switch between Vercel and reference side menu visuals',
  sideMenuVariant: 'vercel',
  showSideMenuStyleToggle: true,
})

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:showLabelsInMini': [value: boolean]
  'update:sideMenuVariant': [value: 'vercel' | 'reference']
  'account-click': []
  'logout-click': []
}>()

const profile = computed<TemplateUserMenuProfile>(() => {
  const name = props.profileName.trim() || 'User'
  const initials = props.profileInitials.trim() || name.slice(0, 2).toUpperCase()
  return {
    name,
    initials,
  }
})
</script>

<style lang="scss">
.ntk-template-user-menu {
  --ntk-template-user-menu-surface: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  --ntk-template-user-menu-border-color: var(--ntk-template-user-menu-border, var(--ntk-border-color));
  --ntk-template-user-menu-shadow-color: color-mix(in srgb, var(--ntk-text-primary) 14%, transparent);
  --ntk-template-user-menu-text-color: var(--ntk-template-user-menu-text, var(--ntk-text-primary));
  --ntk-template-user-menu-muted-color: var(--ntk-template-user-menu-muted, var(--ntk-text-secondary));
  --ntk-template-user-menu-avatar-border-color: var(--ntk-template-user-menu-avatar-border, var(--ntk-template-user-menu-surface));
  --ntk-template-user-menu-avatar-bg-color: var(--ntk-template-user-menu-avatar-bg, var(--ntk-avatar-bg, var(--ntk-primary)));
  --ntk-template-user-menu-avatar-text-color: var(--ntk-template-user-menu-avatar-color, var(--ntk-text-on-primary, var(--ntk-text-inverse)));
  --ntk-template-user-menu-header-surface: var(--ntk-template-user-menu-header-bg, color-mix(in srgb, var(--ntk-template-user-menu-text-color) 2%, var(--ntk-template-user-menu-surface)));
  --ntk-template-user-menu-profile-surface: var(--ntk-template-user-menu-profile-bg, var(--ntk-template-user-menu-surface));
  --ntk-template-user-menu-accent: var(--ntk-template-user-menu-accent-color, var(--ntk-accent, var(--ntk-primary)));

  min-width: 320px;
  border: 1px solid var(--ntk-template-user-menu-border-color);
  border-radius: var(--ntk-template-user-menu-radius, 8px);
  background: var(--ntk-template-user-menu-surface);
  box-shadow: var(--ntk-template-user-menu-shadow, 0 4px 20px var(--ntk-template-user-menu-shadow-color));
  overflow: hidden;
  color: var(--ntk-template-user-menu-text-color);
}

.ntk-template-user-menu__trigger {
  --ntk-template-user-menu-trigger-color: var(--ntk-template-layout-header-action-text, var(--ntk-template-layout-header-text, var(--ntk-text-primary)));
  --ntk-template-user-menu-trigger-hover-bg: var(--ntk-template-layout-header-action-hover-bg, color-mix(in srgb, var(--ntk-template-user-menu-trigger-color) 10%, transparent));
  --ntk-template-user-menu-trigger-focus-ring: var(--ntk-template-layout-header-action-focus-ring, var(--ntk-border-focus, var(--ntk-accent)));
  --ntk-template-user-menu-trigger-radius: var(--ntk-template-layout-header-action-radius, 999px);

  color: var(--ntk-template-user-menu-trigger-color) !important;
  border-radius: var(--ntk-template-user-menu-trigger-radius);
}

.ntk-template-user-menu__trigger::before {
  background: var(--ntk-template-user-menu-trigger-hover-bg) !important;
}

.ntk-template-user-menu__trigger:hover::before,
.ntk-template-user-menu__trigger.q-focusable--focused::before,
.ntk-template-user-menu__trigger.q-hoverable:hover::before {
  opacity: 1 !important;
}

.ntk-template-user-menu__trigger:focus-visible {
  outline: 2px solid var(--ntk-template-user-menu-trigger-focus-ring);
  outline-offset: 2px;
}

.ntk-template-user-menu__trigger :deep(.q-btn__content) {
  color: inherit;
}

.ntk-template-user-menu__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--ntk-template-user-menu-avatar-border-color);
  background: var(--ntk-template-user-menu-avatar-bg-color);
  color: var(--ntk-template-user-menu-avatar-text-color);
  font-weight: 600;
  line-height: 1;
  text-align: center;
}

.ntk-template-user-menu__avatar--large {
  border-width: 2px;
}

.ntk-template-user-menu__header {
  background: var(--ntk-template-user-menu-header-surface);
}

.ntk-template-user-menu__profile {
  background: var(--ntk-template-user-menu-profile-surface);
}

.ntk-template-user-menu__section-label {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-template-user-menu-muted-color) !important;
}

.ntk-template-user-menu__item-icon {
  color: var(--ntk-template-user-menu-muted-color);
}

.ntk-template-user-menu :deep(.q-separator) {
  background: var(--ntk-template-user-menu-border-color);
}

.ntk-template-user-menu :deep(.q-item) {
  color: var(--ntk-template-user-menu-text-color);
}

.ntk-template-user-menu :deep(.q-item__label--caption) {
  color: var(--ntk-template-user-menu-muted-color) !important;
}

.ntk-template-user-menu :deep(.ntk-template-user-menu__accent-action),
.ntk-template-user-menu :deep(.ntk-template-user-menu__accent-action .q-icon) {
  color: var(--ntk-template-user-menu-accent) !important;
}

.ntk-template-user-menu :deep(.ntk-template-user-menu__toggle .q-toggle__inner--truthy) {
  color: var(--ntk-template-user-menu-accent) !important;
}
</style>
