<template>
  <section :id="id" :class="classes" :data-testid="testId" :aria-label="ariaLabel">
    <header v-if="$slots.header" class="ntk-workspace-canvas__header">
      <slot name="header" />
    </header>
    <div class="ntk-workspace-canvas__surface">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ntkWorkspaceCanvasDefaults,
  resolveNtkWorkspaceCanvasRecipe,
  type NtkWorkspaceCanvasContract,
} from '../../core'

defineOptions({
  name: 'DsWorkspaceCanvas',
})

const props = withDefaults(defineProps<NtkWorkspaceCanvasContract>(), {
  surface: ntkWorkspaceCanvasDefaults.surface,
  ariaLabel: 'Workspace',
  variant: ntkWorkspaceCanvasDefaults.variant,
  size: ntkWorkspaceCanvasDefaults.size,
  intent: ntkWorkspaceCanvasDefaults.intent,
})

const classes = computed(() => resolveNtkWorkspaceCanvasRecipe({
  variant: props.variant,
  size: props.size,
  intent: props.intent,
  surface: props.surface,
  class: props.class,
}).classes)
</script>

<style scoped>
.ntk-workspace-canvas {
  display: flex;
  flex-direction: column;
  min-block-size: 0;
  inline-size: 100%;
  block-size: 100%;
  background: var(--ntk-bg-secondary);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

.ntk-workspace-canvas__header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
  padding-block: var(--ntk-spacing-xs);
  padding-inline: var(--ntk-spacing-sm);
  border-block-end: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
  font-size: var(--ntk-font-size-sm);
}

.ntk-workspace-canvas__surface {
  flex: 1 1 auto;
  min-block-size: 0;
  overflow: auto;
  padding: var(--ntk-spacing-md);
}

/* Token-driven grid: two crossing linear gradients of the light border color
   over the secondary surface. The transparent stop falls back to the same
   surface token so the lines stay a single tokenized hue. */
.ntk-workspace-canvas--surface-grid .ntk-workspace-canvas__surface {
  background-color: var(--ntk-bg-secondary);
  background-image:
    linear-gradient(to right, var(--ntk-border-light) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ntk-border-light) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Token-driven dotted grid: a single radial gradient of the light border color. */
.ntk-workspace-canvas--surface-dots .ntk-workspace-canvas__surface {
  background-color: var(--ntk-bg-secondary);
  background-image:
    radial-gradient(circle, var(--ntk-border-light) 1px, transparent 1.5px);
  background-size: 20px 20px;
}

.ntk-workspace-canvas--surface-plain .ntk-workspace-canvas__surface {
  background-color: var(--ntk-bg-secondary);
}
</style>