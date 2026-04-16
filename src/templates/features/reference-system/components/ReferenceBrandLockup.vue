<template>
  <div class="ntk-reference-brand-lockup">
    <img
      v-if="preset.brand.logoUrl"
      :src="preset.brand.logoUrl"
      :alt="preset.brand.name"
      class="ntk-reference-brand-lockup__logo-img"
    >
    <span
      v-else
      class="ntk-reference-brand-lockup__mark"
    >{{ preset.brand.logoText }}</span>
    <div>
      <span class="ntk-reference-brand-lockup__name">{{ preset.brand.name }}</span>
      <small class="ntk-reference-brand-lockup__subtitle">{{ preset.brand.subtitle }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReferenceWhitelabelPreset } from '../../../../whitelabel'

defineProps<{
  preset: ReferenceWhitelabelPreset
}>()
</script>

<style scoped lang="scss">
.ntk-reference-brand-lockup {
  --ntk-reference-brand-mark-bg: var(--ntk-reference-brand-mark-background, var(--ntk-template-layout-brand-mark-bg, var(--ntk-primary-gradient, var(--ntk-accent))));
  --ntk-reference-brand-mark-color: var(--ntk-reference-brand-mark-text, var(--ntk-text-on-accent, var(--ntk-template-layout-header-text, var(--ntk-text-primary))));
  --ntk-reference-brand-mark-shadow: var(--ntk-reference-shell-glow, var(--ntk-shadow-md));
  --ntk-reference-brand-name-color: var(--ntk-reference-brand-name, var(--ntk-template-layout-title-color, var(--ntk-text-heading, var(--ntk-text-primary))));
  --ntk-reference-brand-subtitle-color: var(--ntk-reference-brand-subtitle, var(--ntk-template-layout-brand-subtitle, var(--ntk-text-muted, var(--ntk-text-secondary))));

  display: flex;
  align-items: center;
  gap: 12px;
}

.ntk-reference-brand-lockup__logo-img {
  width: 120px;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.ntk-reference-brand-lockup__mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--ntk-reference-brand-mark-bg);
  color: var(--ntk-reference-brand-mark-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 0.14em;
  box-shadow: var(--ntk-reference-brand-mark-shadow);
}

.ntk-reference-brand-lockup__name {
  display: block;
  color: var(--ntk-reference-brand-name-color);
  font-family: var(--ntk-font-family-display, system-ui, sans-serif);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
}

.ntk-reference-brand-lockup__subtitle {
  display: block;
  margin-top: 2px;
  color: var(--ntk-reference-brand-subtitle-color);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
