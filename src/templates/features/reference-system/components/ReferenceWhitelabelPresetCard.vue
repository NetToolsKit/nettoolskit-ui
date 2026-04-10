<template>
  <aside class="ntk-reference-preset-card">
    <p class="ntk-reference-preset-card__label">
      {{ sectionLabel }}
    </p>
    <h3>{{ preset.label }}</h3>
    <p>{{ preset.brand.kicker }} | {{ preset.brand.description }}</p>

    <div class="ntk-reference-preset-card__swatch-grid">
      <div
        v-for="swatch in swatches"
        :key="swatch.id"
        class="ntk-reference-preset-card__swatch"
      >
        <span>{{ swatch.label }}</span>
        <strong :style="{ background: swatch.background }" />
      </div>
    </div>

    <p class="ntk-reference-preset-card__note">
      {{ note }}
    </p>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ReferenceWhitelabelPreset } from '../../../../whitelabel'

const props = withDefaults(defineProps<{
  preset: ReferenceWhitelabelPreset
  sectionLabel?: string
  note?: string
}>(), {
  sectionLabel: 'Whitelabel preset',
  note: 'The same components and templates stay intact while the preset swaps shell, editor and accent tokens.',
})

const swatches = computed(() => {
  return [
    {
      id: 'accent',
      label: 'Accent',
      background: props.preset.palette.accent,
    },
    {
      id: 'drawer',
      label: 'Drawer',
      background: `linear-gradient(180deg, ${props.preset.palette.secondary} 0%, ${props.preset.palette.primaryDark} 100%)`,
    },
    {
      id: 'stage',
      label: 'Stage',
      background: props.preset.palette.surfaceAlt,
    },
  ]
})
</script>

<style scoped lang="scss">
.ntk-reference-preset-card {
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 20px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  padding: 20px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

.ntk-reference-preset-card__label {
  margin: 0;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-reference-preset-card h3 {
  margin: 8px 0 0;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-reference-preset-card p {
  color: var(--ntk-text-secondary, #475569);
}

.ntk-reference-preset-card__swatch-grid {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.ntk-reference-preset-card__swatch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 14px;
  background: var(--ntk-reference-panel-muted-bg, #f8fbff);
}

.ntk-reference-preset-card__swatch span {
  color: var(--ntk-text-secondary, #475569);
  font-size: 13px;
}

.ntk-reference-preset-card__swatch strong {
  width: 88px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.ntk-reference-preset-card__note {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--ntk-reference-border, #dbe4f0);
  font-size: 13px;
  line-height: 1.6;
}
</style>
