<template>
  <div class="cms-designer-card__ruler-shell">
    <div class="cms-designer-card__ruler-gutter">
      <q-btn
        flat
        dense
        round
        icon="chevron_left"
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
      <q-btn
        flat
        dense
        no-caps
        icon="grid_4x4"
        class="cms-designer-card__ruler-mode"
        :label="modeLabel"
        @click="$emit('toggle-mode')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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