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
  background: var(--semantic-warning-bg, var(--semantic-warning-light));
  color: var(--semantic-warning-text, var(--semantic-warning));
}

.ntk-reference-status-badge--review {
  background: var(--semantic-info-bg, var(--semantic-info-light));
  color: var(--semantic-info-text, var(--semantic-info));
}

.ntk-reference-status-badge--published {
  background: var(--semantic-success-bg, var(--semantic-success-light));
  color: var(--semantic-success-text, var(--semantic-success));
}
</style>
