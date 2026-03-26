<template>
  <q-page
    class="ntk-template-profile"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <section class="ntk-template-profile__hero">
      <div class="ntk-template-profile__hero-left">
        <q-avatar
          size="52px"
          class="ntk-template-profile__avatar text-white"
          font-size="20px"
        >
          <img
            v-if="profile.avatar"
            :src="profile.avatar"
            :alt="`${displayName} avatar`"
          >
          <span v-else>{{ avatarInitials }}</span>
        </q-avatar>

        <div class="ntk-template-profile__hero-content">
          <h1 class="ntk-template-profile__title">
            {{ displayName }}
          </h1>
          <p class="ntk-template-profile__email">
            {{ profile.email || emptyValueLabel }}
          </p>
          <q-badge
            :color="roleTone"
            :label="resolvedRoleLabel"
            class="ntk-template-profile__role-badge"
          />
        </div>
      </div>

      <slot name="hero-action">
        <q-btn
          v-if="showLogoutAction"
          outline
          no-caps
          color="negative"
          icon="logout"
          :label="logoutLabel"
          :aria-label="logoutAriaLabel"
          @click="emit('logout-click')"
        />
      </slot>
    </section>

    <q-scroll-area
      class="ntk-template-profile__scroll"
      :aria-label="groupsAriaLabel"
    >
      <section
        v-for="group in profileGroups"
        :key="group.id"
        class="ntk-template-profile__section"
      >
        <div class="ntk-template-profile__section-label">
          <q-icon
            name="person"
            size="16px"
          />
          <span>{{ group.title }}</span>
        </div>

        <q-card class="ntk-template-profile__card">
          <template
            v-for="(field, index) in group.fields"
            :key="field.id"
          >
            <q-separator v-if="index > 0" />
            <div class="ntk-template-profile__row">
              <div class="ntk-template-profile__row-label">
                {{ field.label }}
              </div>
              <div class="ntk-template-profile__row-value">
                {{ field.value || emptyValueLabel }}
              </div>
            </div>
          </template>
        </q-card>
      </section>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { TemplateProfileGroup, TemplateUserProfile } from '../page-template.types'

const props = withDefaults(defineProps<{
  profile?: TemplateUserProfile
  groups?: TemplateProfileGroup[]
  sectionTitle?: string
  roleLabel?: string
  showLogoutAction?: boolean
  logoutLabel?: string
  logoutAriaLabel?: string
  emptyValueLabel?: string
  pageAriaLabel?: string
  groupsAriaLabel?: string
}>(), {
  profile: () => ({ name: 'User' }),
  groups: () => [],
  sectionTitle: 'Account details',
  roleLabel: '',
  showLogoutAction: false,
  logoutLabel: 'Sign out',
  logoutAriaLabel: 'Sign out',
  emptyValueLabel: 'Not provided',
  pageAriaLabel: 'Profile page',
  groupsAriaLabel: 'Profile information groups',
})

const emit = defineEmits<{
  'logout-click': []
}>()

const profile = computed<TemplateUserProfile>(() => props.profile)

const displayName = computed<string>(() => {
  return profile.value.name?.trim() || 'User'
})

const avatarInitials = computed<string>(() => {
  if (profile.value.initials?.trim()) {
    return profile.value.initials.trim().slice(0, 2).toUpperCase()
  }

  const words = displayName.value.split(/\s+/).filter(Boolean)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  const firstInitial = words[0]?.[0] ?? 'U'
  const lastWord = words[words.length - 1] ?? ''
  const lastInitial = lastWord[0] ?? ''
  return `${firstInitial}${lastInitial}`.toUpperCase()
})

const resolvedRoleLabel = computed<string>(() => {
  return props.roleLabel || profile.value.role || 'Member'
})

const roleTone = computed<string>(() => {
  const normalizedRole = resolvedRoleLabel.value.toLowerCase()
  if (normalizedRole.includes('admin') || normalizedRole.includes('owner')) {
    return 'primary'
  }
  if (normalizedRole.includes('manager') || normalizedRole.includes('lead')) {
    return 'info'
  }
  return 'grey-7'
})

const profileGroups = computed<TemplateProfileGroup[]>(() => {
  if (props.groups.length > 0) {
    return props.groups
  }

  return [
    {
      id: 'account',
      title: props.sectionTitle,
      fields: [
        {
          id: 'name',
          label: 'Name',
          value: displayName.value,
        },
        {
          id: 'email',
          label: 'Email',
          value: profile.value.email || props.emptyValueLabel,
        },
        {
          id: 'role',
          label: 'Role',
          value: resolvedRoleLabel.value,
        },
      ],
    },
  ]
})
</script>

<style scoped lang="scss">
.ntk-template-profile {
  display: flex;
  flex-direction: column;
  background: var(--ntk-template-page-bg, #f8fafc);
  padding: 12px;
  gap: 12px;
}

.ntk-template-profile__hero {
  background: var(
    --ntk-template-profile-hero-bg,
    linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)
  );
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ntk-template-profile__hero-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.ntk-template-profile__avatar {
  background: var(
    --ntk-template-profile-avatar-bg,
    linear-gradient(135deg, #334155 0%, #1e293b 100%)
  );
  border: 2px solid var(--ntk-template-profile-avatar-border, #ffffff);
  box-shadow: 0 2px 8px var(--ntk-template-profile-avatar-shadow, rgba(30, 41, 59, 0.2));
}

.ntk-template-profile__hero-content {
  min-width: 0;
}

.ntk-template-profile__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.3;
  color: var(--ntk-template-page-title, #1e293b);
}

.ntk-template-profile__email {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--ntk-template-page-subtitle, #64748b);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ntk-template-profile__role-badge {
  margin-top: 6px;
}

.ntk-template-profile__scroll {
  flex: 1;
  min-height: 0;
}

.ntk-template-profile__section {
  margin-bottom: 16px;
}

.ntk-template-profile__section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-left: 2px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-profile__card {
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  border-radius: 12px;
  box-shadow: none;
}

.ntk-template-profile__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
}

.ntk-template-profile__row-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ntk-template-page-subtitle, #64748b);
}

.ntk-template-profile__row-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ntk-template-page-title, #1e293b);
  text-align: right;
}

@media (max-width: 768px) {
  .ntk-template-profile__hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .ntk-template-profile__row {
    flex-direction: column;
    align-items: flex-start;
  }

  .ntk-template-profile__row-value {
    text-align: left;
  }
}
</style>