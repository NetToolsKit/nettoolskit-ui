<template>
  <span
    class="cat-mark"
    :style="markStyle"
    aria-hidden="true"
  >N</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * The rounded "N" brand tile from the reference. Size and background are
 * configurable so it can serve the top bar (small, brand color) and the
 * brand lockups (positive/negative/mono).
 */
const props = withDefaults(
  defineProps<{
    size?: number
    background?: string
    color?: string
  }>(),
  {
    size: 28,
    background: 'var(--ntk-primary)',
    color: '#ffffff',
  }
)

const markStyle = computed(() => ({
  inlineSize: `${props.size}px`,
  blockSize: `${props.size}px`,
  fontSize: `${Math.round(props.size * 0.46)}px`,
  background: props.background,
  color: props.color,
}))
</script>

<style scoped>
.cat-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  line-height: 1;
  flex: 0 0 auto;
}
</style>