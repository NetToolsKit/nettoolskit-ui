<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'dashboard'">
      <rect
        x="3"
        y="3"
        width="7"
        height="9"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="5"
      />
      <rect
        x="14"
        y="12"
        width="7"
        height="9"
      />
      <rect
        x="3"
        y="16"
        width="7"
        height="5"
      />
    </template>
    <template v-else-if="name === 'orders'">
      <path d="M6 2 3 6v14h18V6l-3-4z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </template>
    <template v-else-if="name === 'products'">
      <path d="M20 7 12 3 4 7l8 4 8-4z" />
      <path d="M4 7v10l8 4 8-4V7M12 11v10" />
    </template>
    <template v-else-if="name === 'stock'">
      <rect
        x="3"
        y="4"
        width="18"
        height="4"
      />
      <path d="M5 8v12h14V8M9 12h6" />
    </template>
    <template v-else-if="name === 'customers'">
      <circle
        cx="9"
        cy="8"
        r="3"
      />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 6a3 3 0 0 1 0 6M21 20c0-2-1-3.5-3-4.3" />
    </template>
    <template v-else-if="name === 'reports'">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </template>
    <template v-else>
      <circle
        cx="12"
        cy="12"
        r="3"
      />
      <path
        d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.6h-4l-.3 2.6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { EcomNavItem } from './catalogScreensData'

defineProps<{ name: EcomNavItem['key'] }>()
</script>