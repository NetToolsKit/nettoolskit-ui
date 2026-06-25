<template>
  <span :id="id" :class="classes" :data-testid="testId" aria-hidden="true">
    <template v-if="variant === 'text'">
      <span
        v-for="line in lineCount"
        :key="line"
        class="ntk-skeleton__line"
        :class="{ 'ntk-skeleton__line--last': line === lineCount }"
      />
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkSkeletonDefaults,
  resolveNtkSkeletonRecipe,
  type NtkSkeletonContract,
} from '../../core'

defineOptions({
  name: 'DsSkeleton',
})

const props = withDefaults(defineProps<NtkSkeletonContract>(), {
  variant: ntkSkeletonDefaults.variant,
  size: ntkSkeletonDefaults.size,
  intent: ntkSkeletonDefaults.intent,
  lines: 1,
})

const lineCount = computed(() => Math.max(1, Math.trunc(props.lines)))

const classes = computed(() => resolveNtkSkeletonRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  class: props.class,
}).classes)
</script>

<style scoped>
@keyframes ntk-skeleton-pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }

  100% {
    opacity: 1;
  }
}

.ntk-skeleton {
  display: block;
  background: var(--ntk-bg-hover);
  border-radius: var(--ntk-radius-sm);
  animation: ntk-skeleton-pulse var(--ntk-transition-slow) ease-in-out infinite;
}

.ntk-skeleton--variant-text {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
  background: transparent;
  animation: none;
}

.ntk-skeleton__line {
  display: block;
  block-size: var(--ntk-font-size-base);
  background: var(--ntk-bg-hover);
  border-radius: var(--ntk-radius-sm);
  animation: ntk-skeleton-pulse var(--ntk-transition-slow) ease-in-out infinite;
}

.ntk-skeleton--size-sm .ntk-skeleton__line {
  block-size: var(--ntk-font-size-sm);
}

.ntk-skeleton--size-lg .ntk-skeleton__line {
  block-size: var(--ntk-font-size-lg);
}

.ntk-skeleton__line--last {
  inline-size: 60%;
}

.ntk-skeleton--variant-block {
  block-size: 6rem;
}

.ntk-skeleton--size-sm.ntk-skeleton--variant-block {
  block-size: 4rem;
}

.ntk-skeleton--size-lg.ntk-skeleton--variant-block {
  block-size: 8rem;
}

.ntk-skeleton--variant-circle {
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: var(--ntk-radius-full);
}

.ntk-skeleton--size-sm.ntk-skeleton--variant-circle {
  inline-size: 2rem;
  block-size: 2rem;
}

.ntk-skeleton--size-lg.ntk-skeleton--variant-circle {
  inline-size: 4rem;
  block-size: 4rem;
}
</style>