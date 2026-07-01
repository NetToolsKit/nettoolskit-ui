<template>
  <!-- eslint-disable vue/no-v-html -- registry-only build-time SVG paths keyed by a closed name union; no untrusted string can reach this sink (see icons/registry.ts) -->
  <svg
    :id="id"
    :class="classes"
    :data-testid="testId"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label || undefined"
    v-html="iconMarkup"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkCommandIconDefaults,
  resolveNtkCommandIcon,
  resolveNtkCommandIconRecipe,
  type NtkCommandIconContract,
} from '../../core'

defineOptions({
  name: 'DsCommandIcon',
})

const props = withDefaults(defineProps<NtkCommandIconContract>(), {
  variant: ntkCommandIconDefaults.variant,
  size: ntkCommandIconDefaults.size,
  intent: ntkCommandIconDefaults.intent,
})

const pixelSizes = { sm: 16, md: 20, lg: 24 } as const

const pixelSize = computed(() => pixelSizes[props.size ?? ntkCommandIconDefaults.size])

const classes = computed(() => resolveNtkCommandIconRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)

// The registry returns trusted, build-time SVG path markup keyed by a closed
// union of names (never product-provided HTML), so v-html is safe here: there is
// no path for untrusted strings to reach the DOM.
const iconMarkup = computed(() => resolveNtkCommandIcon(props.name).path)
</script>

<style scoped>
.ntk-command-icon {
  display: inline-block;
  flex-shrink: 0;
  color: var(--ntk-text-primary);
  vertical-align: middle;
}

.ntk-command-icon--intent-primary {
  color: var(--ntk-primary);
}

.ntk-command-icon--intent-success {
  color: var(--ntk-success-dark);
}

.ntk-command-icon--intent-warning {
  color: var(--ntk-warning-dark);
}

.ntk-command-icon--intent-danger {
  color: var(--ntk-error-dark);
}

.ntk-command-icon--intent-info {
  color: var(--ntk-info-dark);
}
</style>