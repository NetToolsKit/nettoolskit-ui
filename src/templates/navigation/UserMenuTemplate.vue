<template>
  <q-btn
    round
    flat
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
            color="primary"
            @click="$emit('logout-click')"
          />
        </div>
      </div>

      <q-separator />

      <div class="ntk-template-user-menu__profile q-pa-md">
        <div class="row no-wrap q-gutter-md">
          <q-avatar
            size="56px"
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
                color="primary"
                class="q-px-none"
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
          class="text-grey-7"
        >
          {{ preferencesLabel }}
        </q-item-label>

        <q-item>
          <q-item-section avatar>
            <q-icon
              :name="modelValue ? 'view_stream' : 'view_sidebar'"
              color="grey-7"
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
              color="primary"
              @update:model-value="$emit('update:modelValue', $event)"
            />
          </q-item-section>
        </q-item>

        <q-item :disable="modelValue">
          <q-item-section avatar>
            <q-icon
              :name="showLabelsInMini ? 'label' : 'label_off'"
              color="grey-7"
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
              color="primary"
              @update:model-value="$emit('update:showLabelsInMini', $event)"
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
  appName?: string
  profileName?: string
  profileInitials?: string
  signOutLabel?: string
  accountLabel?: string
  preferencesLabel?: string
  horizontalMenuLabel?: string
  horizontalMenuCaption?: string
  miniLabelsLabel?: string
  miniLabelsCaption?: string
}>(), {
  appName: 'NetToolsKit',
  profileName: 'User',
  profileInitials: 'U',
  signOutLabel: 'Sign out',
  accountLabel: 'View account',
  preferencesLabel: 'Preferences',
  horizontalMenuLabel: 'Horizontal menu',
  horizontalMenuCaption: 'Toggle between side and top navigation',
  miniLabelsLabel: 'Labels in mini menu',
  miniLabelsCaption: 'Show labels below icons in compact mode',
})

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:showLabelsInMini': [value: boolean]
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
  min-width: 320px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.ntk-template-user-menu__avatar {
  border: 2px solid var(--ntk-template-user-menu-avatar-border, #ffffff);
  background: var(--ntk-template-user-menu-avatar-bg, var(--q-secondary));
  color: var(--ntk-template-user-menu-avatar-color, #ffffff);
}

.ntk-template-user-menu__avatar--large {
  border-width: 2px;
}

.ntk-template-user-menu__header {
  background: var(--ntk-template-user-menu-header-bg, rgba(0, 0, 0, 0.03));
}

.ntk-template-user-menu__profile {
  background: var(--ntk-template-user-menu-profile-bg, #ffffff);
}
</style>