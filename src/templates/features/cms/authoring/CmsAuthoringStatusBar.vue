<template>
  <div
    class="cms-designer-card__statusbar"
    :class="className"
  >
    <template
      v-for="item in items"
      :key="item.id"
    >
      <CmsStatusChip
        v-if="item.kind === 'chip'"
        :style="item.style"
      >
        {{ item.label }}
      </CmsStatusChip>

      <span
        v-else
        class="cms-designer-card__status-text"
      >
        <strong v-if="item.emphasis">{{ item.label }}</strong>
        <template v-else>{{ item.label }}</template>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import CmsStatusChip from './CmsStatusChip.vue'

export interface CmsAuthoringStatusItem {
  id: string
  label: string
  kind?: 'chip' | 'text'
  emphasis?: boolean
  style?: CSSProperties
}

withDefaults(defineProps<{
  items?: CmsAuthoringStatusItem[]
  className?: string
}>(), {
  items: () => [],
  className: '',
})
</script>