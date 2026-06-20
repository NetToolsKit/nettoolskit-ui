<template>
  <div
    v-if="items.length > 0"
    class="cms-diagnostics-list"
  >
    <div class="cms-diagnostics-list__header">
      <strong>{{ title }}</strong>
      <CmsStatusChip
        v-if="showCount"
        :style="countStyle"
      >
        {{ items.length }}
      </CmsStatusChip>
    </div>

    <article
      v-for="item in items"
      :key="item.id"
      class="cms-diagnostics-item"
    >
      <CmsStatusChip :style="item.severityStyle">
        {{ item.severity }}
      </CmsStatusChip>

      <div class="cms-diagnostics-item__body">
        <strong>{{ item.code }}</strong>
        <small>{{ item.message }}</small>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import CmsStatusChip from './CmsStatusChip.vue'

export interface CmsDiagnosticsListItem {
  id: string
  code: string
  message: string
  severity: string
  severityStyle?: CSSProperties
}

withDefaults(defineProps<{
  title: string
  items?: CmsDiagnosticsListItem[]
  countStyle?: CSSProperties
  showCount?: boolean
}>(), {
  items: () => [],
  countStyle: undefined,
  showCount: true,
})
</script>