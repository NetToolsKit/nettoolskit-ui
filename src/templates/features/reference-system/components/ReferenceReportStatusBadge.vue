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
  --ntk-reference-status-badge-bg: transparent;
  --ntk-reference-status-badge-text: var(--ntk-text-primary);
  --ntk-reference-status-badge-border: transparent;

  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--ntk-reference-status-badge-border);
  background: var(--ntk-reference-status-badge-bg);
  color: var(--ntk-reference-status-badge-text);
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.ntk-reference-status-badge--draft {
  --ntk-reference-status-badge-bg: var(--semantic-warning-bg, var(--semantic-warning-light));
  --ntk-reference-status-badge-text: var(--semantic-warning-text, var(--semantic-warning));
  --ntk-reference-status-badge-border: color-mix(in srgb, var(--semantic-warning-primary, var(--semantic-warning)) 22%, transparent);
}

.ntk-reference-status-badge--review {
  --ntk-reference-status-badge-bg: var(--semantic-info-bg, var(--semantic-info-light));
  --ntk-reference-status-badge-text: var(--semantic-info-text, var(--semantic-info));
  --ntk-reference-status-badge-border: color-mix(in srgb, var(--semantic-info-primary, var(--semantic-info)) 22%, transparent);
}

.ntk-reference-status-badge--published {
  --ntk-reference-status-badge-bg: var(--semantic-success-bg, var(--semantic-success-light));
  --ntk-reference-status-badge-text: var(--semantic-success-text, var(--semantic-success));
  --ntk-reference-status-badge-border: color-mix(in srgb, var(--semantic-success-primary, var(--semantic-success)) 22%, transparent);
}

:global(.body--dark) .ntk-reference-status-badge--draft {
  --ntk-reference-status-badge-bg: color-mix(in srgb, var(--semantic-warning-primary, var(--semantic-warning)) 26%, var(--ntk-reference-panel-muted-bg, var(--ntk-bg-secondary)));
  --ntk-reference-status-badge-text: var(--ntk-text-primary);
  --ntk-reference-status-badge-border: color-mix(in srgb, var(--semantic-warning-primary, var(--semantic-warning)) 38%, var(--ntk-reference-border, var(--ntk-border-color)));
}

:global(.body--dark) .ntk-reference-status-badge--review {
  --ntk-reference-status-badge-bg: color-mix(in srgb, var(--semantic-info-primary, var(--semantic-info)) 26%, var(--ntk-reference-panel-muted-bg, var(--ntk-bg-secondary)));
  --ntk-reference-status-badge-text: var(--ntk-text-primary);
  --ntk-reference-status-badge-border: color-mix(in srgb, var(--semantic-info-primary, var(--semantic-info)) 38%, var(--ntk-reference-border, var(--ntk-border-color)));
}

:global(.body--dark) .ntk-reference-status-badge--published {
  --ntk-reference-status-badge-bg: color-mix(in srgb, var(--semantic-success-primary, var(--semantic-success)) 26%, var(--ntk-reference-panel-muted-bg, var(--ntk-bg-secondary)));
  --ntk-reference-status-badge-text: var(--ntk-text-primary);
  --ntk-reference-status-badge-border: color-mix(in srgb, var(--semantic-success-primary, var(--semantic-success)) 38%, var(--ntk-reference-border, var(--ntk-border-color)));
}
</style>
