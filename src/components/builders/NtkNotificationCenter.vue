<template>
  <div class="notification-center">
    <q-btn
      flat
      round
      icon="notifications"
      @click="togglePanel"
    >
      <q-badge
        v-if="unreadCount > 0"
        color="error"
        floating
      >
        {{ unreadCount }}
      </q-badge>
    </q-btn>

    <q-menu
      v-model="panelOpen"
      anchor="bottom right"
      self="top right"
      max-width="400px"
      class="notification-panel"
    >
      <q-card
        flat
        bordered
        class="notification-card"
      >
        <!-- Header -->
        <q-card-section class="notification-header">
          <div class="header-content">
            <h6 class="header-title">
              Notifications
            </h6>
            <q-btn
              v-if="unreadCount > 0"
              flat
              dense
              size="sm"
              label="Mark all as read"
              @click="markAllAsRead"
            />
          </div>
        </q-card-section>

        <q-separator />

        <!-- Notifications List -->
        <q-scroll-area style="height: 400px">
          <q-list
            v-if="notifications.length > 0"
            separator
          >
            <q-item
              v-for="notification in notifications"
              :key="notification.id"
              v-ripple
              clickable
              :class="{ 'notification-unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <q-item-section avatar>
                <q-avatar
                  :color="getNotificationColor(notification.type)"
                  text-color="white"
                >
                  <q-icon :name="getNotificationIcon(notification.type)" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ notification.title }}</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                >
                  {{ notification.message }}
                </q-item-label>
                <q-item-label
                  caption
                  class="notification-time"
                >
                  {{ formatTime(notification.timestamp) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="close"
                  @click.stop="removeNotification(notification.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-else
            class="notification-empty"
          >
            <q-icon
              name="notifications_none"
              size="64px"
              color="grey-5"
            />
            <p class="text-grey-6">
              No notifications
            </p>
          </div>
        </q-scroll-area>

        <q-separator />

        <!-- Footer -->
        <q-card-section class="notification-footer">
          <q-btn
            flat
            dense
            label="View all notifications"
            class="full-width"
            @click="viewAll"
          />
        </q-card-section>
      </q-card>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface Notification {
  id: string | number
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date | string
  read: boolean
  action?: () => void
}

interface Props {
  notifications?: Notification[]
}

const props = withDefaults(defineProps<Props>(), {
  notifications: () => []
})

const emit = defineEmits<{
  'notification-click': [notification: Notification]
  'mark-as-read': [id: string | number]
  'mark-all-as-read': []
  'remove': [id: string | number]
  'view-all': []
}>()

const panelOpen = ref(false)

const unreadCount = computed(() => {
  return props.notifications.filter(n => !n.read).length
})

const togglePanel = () => {
  panelOpen.value = !panelOpen.value
}

const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    emit('mark-as-read', notification.id)
  }
  emit('notification-click', notification)
  if (notification.action) {
    notification.action()
  }
}

const markAllAsRead = () => {
  emit('mark-all-as-read')
}

const removeNotification = (id: string | number) => {
  emit('remove', id)
}

const viewAll = () => {
  emit('view-all')
  panelOpen.value = false
}

const getNotificationIcon = (type: Notification['type']): string => {
  const icons = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error'
  }
  return icons[type]
}

const getNotificationColor = (type: Notification['type']): string => {
  const colors = {
    info: 'info',
    success: 'positive',
    warning: 'warning',
    error: 'negative'
  }
  return colors[type]
}

const formatTime = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}
</script>

<style lang="scss" scoped>
.notification-center {
  position: relative;
}

.notification-panel {
  .notification-card {
    width: 400px;
    max-width: 90vw;
  }
}

.notification-header {
  padding: var(--ntk-spacing-md) var(--ntk-spacing-lg);
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--ntk-text-primary);
  }
}

.notification-unread {
  background: var(--ntk-bg-hover);
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--ntk-primary);
  }
}

.notification-time {
  margin-top: var(--ntk-spacing-xs);
  font-size: 0.75rem;
}

.notification-empty {
  padding: var(--ntk-spacing-3xl) var(--ntk-spacing-lg);
  text-align: center;
  
  p {
    margin-top: var(--ntk-spacing-md);
    margin-bottom: 0;
  }
}

.notification-footer {
  padding: var(--ntk-spacing-sm);
}
</style>