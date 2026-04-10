<template>
  <div
    class="ntk-sample-action-status"
    :class="`ntk-sample-action-status--${tone}`"
  >
    <div class="ntk-sample-action-status__label">
      {{ title }}
    </div>
    <div class="ntk-sample-action-status__message">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message: string
  tone?: 'info' | 'success' | 'warning'
}>(), {
  title: 'Interaction',
  tone: 'info',
})
</script>

<style scoped lang="scss">
.ntk-sample-action-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--ntk-border-color, #cbd5e1);
  background: color-mix(in srgb, var(--ntk-bg-card, #ffffff) 88%, transparent);
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-sample-action-status__label {
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-sample-action-status__message {
  font-size: 13px;
  line-height: 1.5;
}

.ntk-sample-action-status--success {
  border-color: color-mix(in srgb, var(--ntk-success, #16a34a) 38%, var(--ntk-border-color, #cbd5e1));
}

.ntk-sample-action-status--warning {
  border-color: color-mix(in srgb, var(--ntk-warning, #d97706) 38%, var(--ntk-border-color, #cbd5e1));
}
</style>
