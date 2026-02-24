<template>
  <q-layout view="hHh lpR fFf">
    <!-- Top Bar -->
    <q-header
      elevated
      class="app-header"
    >
      <q-toolbar class="app-toolbar">
        <!-- Logo / Brand -->
        <q-toolbar-title class="app-brand">
          <slot name="logo">
            <div class="brand-container">
              <q-icon
                name="widgets"
                size="md"
                color="primary"
              />
              <span class="brand-text">{{ title }}</span>
            </div>
          </slot>
        </q-toolbar-title>

        <!-- Desktop Navigation -->
        <div
          v-if="!isMobile"
          class="desktop-nav"
        >
          <slot name="navigation" />
        </div>

        <!-- Actions -->
        <div class="toolbar-actions">
          <slot name="actions" />
          
          <!-- Theme Toggle -->
          <q-btn
            v-if="showThemeToggle"
            flat
            round
            dense
            :icon="isDark ? 'light_mode' : 'dark_mode'"
            @click="toggleTheme"
          >
            <q-tooltip>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</q-tooltip>
          </q-btn>

          <!-- Notifications -->
          <q-btn
            v-if="showNotifications"
            flat
            round
            dense
            icon="notifications"
            @click="$emit('notifications-click')"
          >
            <q-badge
              v-if="notificationCount > 0"
              color="error"
              floating
            >
              {{ notificationCount }}
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>

          <!-- Mobile Menu Toggle -->
          <q-btn
            v-if="isMobile && showSidebar"
            flat
            round
            dense
            icon="menu"
            @click="toggleSidebar"
          >
            <q-tooltip>Menu</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-if="showSidebar"
      v-model="sidebarOpen"
      :width="sidebarWidth"
      :breakpoint="768"
      bordered
      class="app-sidebar"
    >
      <slot name="sidebar" />
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <q-page
        class="app-content"
        :padding="contentPadding"
      >
        <slot />
      </q-page>
    </q-page-container>

    <!-- Footer -->
    <q-footer
      v-if="$slots.footer"
      class="app-footer"
    >
      <slot name="footer" />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dark } from 'quasar'
import { useResponsive } from '../../composables/ui/useResponsive'

interface Props {
  title?: string
  showSidebar?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  notificationCount?: number
  sidebarWidth?: number
  contentPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'App',
  showSidebar: true,
  showNotifications: true,
  showThemeToggle: true,
  notificationCount: 0,
  sidebarWidth: 280,
  contentPadding: true
})


const emit = defineEmits<{
  'notifications-click': []
  'sidebar-toggle': [open: boolean]
}>()

const { isMobile } = useResponsive()
const sidebarOpen = ref(!isMobile.value)
const isDark = computed(() => Dark.isActive)

const toggleTheme = () => {
  Dark.toggle()
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  emit('sidebar-toggle', sidebarOpen.value)
}
</script>

<style lang="scss" scoped>
.app-header {
  background: var(--ntk-bg-card);
  border-bottom: 1px solid var(--ntk-border);
}

.app-toolbar {
  padding: 0 var(--ntk-spacing-lg);
}

.app-brand {
  .brand-container {
    display: flex;
    align-items: center;
    gap: var(--ntk-spacing-sm);
  }

  .brand-text {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--ntk-text-primary);
  }
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  margin-left: var(--ntk-spacing-2xl);
  flex: 1;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.app-sidebar {
  background: var(--ntk-bg-secondary);
  border-right: 1px solid var(--ntk-border);
}

.app-content {
  background: var(--ntk-bg-primary);
  min-height: calc(100vh - 64px);
}

.app-footer {
  background: var(--ntk-bg-card);
  border-top: 1px solid var(--ntk-border);
  padding: var(--ntk-spacing-lg);
}
</style>
