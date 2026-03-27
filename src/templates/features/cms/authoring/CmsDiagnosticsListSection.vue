<template>
  <div
    v-if="items.length > 0"
    class="cms-diagnostics-list"
  >
    <div class="cms-diagnostics-list__header">
      <strong>{{ title }}</strong>
      <q-chip
        v-if="showCount"
        dense
        square
        :style="countStyle"
      >
        {{ items.length }}
      </q-chip>
    </div>

    <article
      v-for="item in items"
      :key="item.id"
      class="cms-diagnostics-item"
    >
      <q-chip
        dense
        square
        :style="item.severityStyle"
      >
        {{ item.severity }}
      </q-chip>

      <div class="cms-diagnostics-item__body">
        <strong>{{ item.code }}</strong>
        <small>{{ item.message }}</small>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

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