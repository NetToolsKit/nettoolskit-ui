<template>
  <div
    :class="hostClasses"
    role="region"
    aria-live="polite"
    aria-atomic="false"
    :aria-label="ariaLabel"
  >
    <DsToast
      v-for="toast in toasts"
      :key="toast.id"
      class="ntk-toast-host__item"
      :title="toast.title"
      :message="toast.message"
      :intent="toast.intent"
      :dismiss-label="dismissLabel"
      dismissible
      @dismiss="dismissToast(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { getNtkToastHostPositionClass, type NtkToastPosition } from '../../core'
import { useToast } from '../../../composables/ui/useToast'
import DsToast from './DsToast.vue'

defineOptions({
  name: 'DsToastHost',
})

const props = withDefaults(defineProps<{
  position?: NtkToastPosition
  ariaLabel?: string
  dismissLabel?: string
}>(), {
  position: 'top-right',
})

const { toasts, dismissToast } = useToast()

const hostClasses = computed(() => [
  'ntk-toast-host',
  getNtkToastHostPositionClass(props.position),
])

// Built-in a11y labels resolve from the active locale; explicit props win.
import { useNtkI18n } from '../composables/useNtkI18n'
const ntkI18n = useNtkI18n()
const ariaLabel = computed(() => props.ariaLabel ?? ntkI18n.t('a11y.notifications'))
const dismissLabel = computed(() => props.dismissLabel ?? ntkI18n.t('a11y.dismiss'))
</script>

<style scoped>
.ntk-toast-host {
  position: fixed;
  z-index: var(--ntk-z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
  max-inline-size: 100vw;
  padding: var(--ntk-spacing-md);
  pointer-events: none;
}

.ntk-toast-host__item {
  pointer-events: auto;
}

.ntk-toast-host--position-top-left {
  inset-block-start: 0;
  inset-inline-start: 0;
  align-items: flex-start;
}

.ntk-toast-host--position-top-center {
  inset-block-start: 0;
  inset-inline: 0;
  align-items: center;
}

.ntk-toast-host--position-top-right {
  inset-block-start: 0;
  inset-inline-end: 0;
  align-items: flex-end;
}

.ntk-toast-host--position-bottom-left {
  inset-block-end: 0;
  inset-inline-start: 0;
  align-items: flex-start;
  flex-direction: column-reverse;
}

.ntk-toast-host--position-bottom-center {
  inset-block-end: 0;
  inset-inline: 0;
  align-items: center;
  flex-direction: column-reverse;
}

.ntk-toast-host--position-bottom-right {
  inset-block-end: 0;
  inset-inline-end: 0;
  align-items: flex-end;
  flex-direction: column-reverse;
}
</style>