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
      background: 'var(--ntk-accent)',
    },
    {
      id: 'drawer',
      label: 'Drawer',
      background: 'linear-gradient(180deg, var(--ntk-secondary) 0%, var(--ntk-primary-dark) 100%)',
    },
    {
      id: 'stage',
      label: 'Stage',
      background: 'var(--ntk-bg-tertiary)',
    },
  ]
})
</script>

<style scoped lang="scss">
.ntk-reference-preset-card {
  border: 1px solid var(--ntk-reference-border);
  border-radius: 20px;
  background: var(--ntk-reference-panel-bg);
  padding: 20px;
  box-shadow: var(--ntk-reference-shell-glow);
}

.ntk-reference-preset-card__label {
  margin: 0;
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary);
}

.ntk-reference-preset-card h3 {
  margin: 8px 0 0;
  color: var(--ntk-text-primary);
}

.ntk-reference-preset-card p {
  color: var(--ntk-text-secondary);
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
  border: 1px solid var(--ntk-reference-border);
  border-radius: 14px;
  background: var(--ntk-reference-panel-muted-bg);
}

.ntk-reference-preset-card__swatch span {
  color: var(--ntk-text-secondary);
  font-size: 13px;
}

.ntk-reference-preset-card__swatch strong {
  width: 88px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid var(--ntk-border-color);
}

.ntk-reference-preset-card__note {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--ntk-reference-border);
  font-size: 13px;
  line-height: 1.6;
}
</style>
