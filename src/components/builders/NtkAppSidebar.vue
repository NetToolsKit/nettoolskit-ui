<template>
  <div class="app-sidebar-content">
    <!-- User Profile Section -->
    <div
      v-if="showUserProfile && userProfile"
      class="sidebar-profile"
    >
      <q-avatar
        size="56px"
        :color="userProfile.avatarColor || 'primary'"
        text-color="white"
      >
        <img
          v-if="userProfile.avatar"
          :src="userProfile.avatar"
          :alt="userProfile.name"
        >
        <span v-else>{{ userInitials }}</span>
      </q-avatar>
      <div class="profile-info">
        <div class="profile-name">
          {{ userProfile.name }}
        </div>
        <div class="profile-email">
          {{ userProfile.email }}
        </div>
      </div>
    </div>

    <q-separator
      v-if="showUserProfile && userProfile"
      class="q-my-md"
    />

    <!-- Navigation Menu -->
    <q-list
      class="sidebar-menu"
      padding
    >
      <template
        v-for="(item, index) in menuItems"
        :key="index"
      >
        <!-- Group Header -->
        <q-item-label
          v-if="item.type === 'header'"
          header
          class="menu-header"
        >
          {{ item.label }}
        </q-item-label>

        <!-- Separator -->
        <q-separator
          v-else-if="item.type === 'separator'"
          class="q-my-sm"
        />

        <!-- Menu Item -->
        <q-item
          v-else
          v-ripple
          clickable
          :active="item.active || isActive(item)"
          :to="item.to"
          :href="item.href"
          :target="item.href ? '_blank' : undefined"
          class="menu-item"
          @click="handleItemClick(item)"
        >
          <q-item-section
            v-if="item.icon"
            avatar
          >
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label
              v-if="item.caption"
              caption
            >
              {{ item.caption }}
            </q-item-label>
          </q-item-section>

          <q-item-section
            v-if="item.badge"
            side
          >
            <q-badge
              :color="item.badgeColor || 'primary'"
              :label="item.badge"
            />
          </q-item-section>

          <q-item-section
            v-if="item.children"
            side
          >
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>

        <!-- Submenu -->
        <q-expansion-item
          v-if="item.children"
          :icon="item.icon"
          :label="item.label"
          :caption="item.caption"
          class="submenu-item"
        >
          <q-list padding>
            <q-item
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              v-ripple
              clickable
              :active="child.active || isActive(child)"
              :to="child.to"
              :href="child.href"
              :target="child.href ? '_blank' : undefined"
              class="submenu-child"
              @click="handleItemClick(child)"
            >
              <q-item-section
                v-if="child.icon"
                avatar
              >
                <q-icon
                  :name="child.icon"
                  size="sm"
                />
              </q-item-section>
              
              <q-item-section>
                <q-item-label>{{ child.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface MenuItem {
  type?: 'item' | 'header' | 'separator'
  label: string
  caption?: string
  icon?: string
  to?: string
  href?: string
  active?: boolean
  badge?: string | number
  badgeColor?: string
  children?: MenuItem[]
  onClick?: () => void
}

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  avatarColor?: string
}

interface Props {
  menuItems: MenuItem[]
  showUserProfile?: boolean
  userProfile?: UserProfile | null
}

const props = withDefaults(defineProps<Props>(), {
  showUserProfile: false,
  userProfile: null
})

const emit = defineEmits<{
  'item-click': [item: MenuItem]
}>()

const route = useRoute()

const userInitials = computed(() => {
  if (!props.userProfile) return ''
  const names = props.userProfile.name.split(' ')
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`
    : names[0][0]
})

const isActive = (item: MenuItem): boolean => {
  if (!item.to) return false
  return route.path === item.to || route.path.startsWith(item.to + '/')
}

const handleItemClick = (item: MenuItem) => {
  emit('item-click', item)
  if (item.onClick) {
    item.onClick()
  }
}
</script>

<style lang="scss" scoped>
.app-sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-profile {
  padding: var(--ntk-spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  
  .profile-info {
    flex: 1;
    min-width: 0;
  }
  
  .profile-name {
    font-weight: 600;
    color: var(--ntk-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .profile-email {
    font-size: 0.875rem;
    color: var(--ntk-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}

.menu-header {
  color: var(--ntk-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--ntk-spacing-md) var(--ntk-spacing-lg);
}

.menu-item {
  border-radius: var(--border-radius-md);
  margin-bottom: var(--ntk-spacing-xs);
  transition: all var(--transition-base);

  &:hover {
    background: var(--ntk-bg-hover);
  }

  &.q-router-link--active {
    background: var(--ntk-primary);
    color: white;

    :deep(.q-icon) {
      color: white;
    }
  }
}

.submenu-item {
  margin-bottom: var(--ntk-spacing-xs);
}

.submenu-child {
  border-radius: var(--border-radius-sm);
  margin: var(--ntk-spacing-xs) 0;
  padding-left: var(--ntk-spacing-2xl);

  &:hover {
    background: var(--ntk-bg-hover);
  }

  &.q-router-link--active {
    background: var(--ntk-primary-light);
    color: var(--ntk-primary-dark);
  }
}
</style>
