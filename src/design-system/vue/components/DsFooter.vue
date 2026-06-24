<template>
  <footer :id="id" :class="classes" :data-testid="testId">
    <div v-if="$slots.start" class="ntk-footer__start">
      <slot name="start" />
    </div>
    <div class="ntk-footer__content">
      <slot />
    </div>
    <div v-if="$slots.end" class="ntk-footer__end">
      <slot name="end" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkFooterDefaults,
  resolveNtkFooterRecipe,
  type NtkFooterContract,
} from '../../core'

defineOptions({
  name: 'DsFooter',
})

const props = withDefaults(defineProps<NtkFooterContract>(), {
  variant: ntkFooterDefaults.variant,
  size: ntkFooterDefaults.size,
  intent: ntkFooterDefaults.intent,
})

const classes = computed(() => resolveNtkFooterRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-footer {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  inline-size: 100%;
  padding-block: var(--ntk-spacing-md);
  padding-inline: var(--ntk-spacing-lg);
  border-block-start: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-secondary);
  font-family: var(--ntk-font-family);
  font-size: var(--ntk-font-size-sm);
}

.ntk-footer--variant-elevated {
  border-block-start-color: transparent;
  box-shadow: var(--ntk-shadow-sm);
}

.ntk-footer--variant-transparent {
  border-block-start-color: transparent;
  background: transparent;
}

.ntk-footer--size-sm {
  padding-block: var(--ntk-spacing-sm);
}

.ntk-footer--size-lg {
  padding-block: var(--ntk-spacing-lg);
}

.ntk-footer__start {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-footer__content {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-inline-size: 0;
}

.ntk-footer__end {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}
</style>