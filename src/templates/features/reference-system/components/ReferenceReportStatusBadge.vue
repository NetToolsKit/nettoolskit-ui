<template>
  <span
    class="ntk-reference-status-badge"
    :class="`ntk-reference-status-badge--${status}`"
  >
    {{ displayLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ReferenceReportStatus } from '../reference-system.types'

const props = defineProps<{
  status: ReferenceReportStatus
  label?: string
}>()

const displayLabel = computed(() => {
  return props.label ?? props.status
})
</script>

<style scoped lang="scss">
.ntk-reference-status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.ntk-reference-status-badge--draft {
  background: #fff7ed;
  color: #c2410c;
}

.ntk-reference-status-badge--review {
  background: #eff6ff;
  color: #1d4ed8;
}

.ntk-reference-status-badge--published {
  background: #ecfdf5;
  color: #047857;
}
</style>