<template>
  <div class="cms-designer-card__ruler-shell">
    <div class="cms-designer-card__ruler-gutter">
      <DsButton
        variant="ghost"
        size="sm"
        intent="neutral"
        icon="chevron_left"
        class="cms-designer-card__ruler-focus"
        :aria-label="focusAriaLabel"
        @click="$emit('focus')"
      />
    </div>

    <div class="cms-designer-card__ruler">
      <span
        v-for="mark in marks"
        :key="`cms-authoring-ruler-${mark}`"
        class="cms-designer-card__ruler-mark"
      >
        {{ mark }}
      </span>
    </div>

    <div class="cms-designer-card__ruler-meta">
      <slot name="meta-prefix" />
      <span class="cms-designer-card__ruler-zoom">{{ zoomLabel }}</span>
      <DsButton
        variant="ghost"
        size="sm"
        intent="neutral"
        icon="grid_4x4"
        class="cms-designer-card__ruler-mode"
        :label="modeLabel"
        @click="$emit('toggle-mode')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DsButton } from '../../../../design-system/vue'

withDefaults(defineProps<{
  marks?: Array<string | number>
  zoomLabel?: string
  focusAriaLabel?: string
  modeLabel?: string
}>(), {
  marks: () => [],
  zoomLabel: '100%',
  focusAriaLabel: 'Focus workbench',
  modeLabel: 'Grid',
})

defineEmits<{
  (e: 'focus'): void
  (e: 'toggle-mode'): void
}>()
</script>