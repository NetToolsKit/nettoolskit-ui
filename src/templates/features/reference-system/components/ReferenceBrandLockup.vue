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
  background: var(--ntk-gradient-accent, linear-gradient(135deg, #10b981 0%, #2dd4bf 100%));
  color: var(--ntk-text-light, #ffffff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 0.14em;
  box-shadow: var(--ntk-reference-shell-glow, 0 16px 32px rgba(2, 6, 23, 0.16));
}

.ntk-reference-brand-lockup__name {
  display: block;
  color: var(--ntk-template-layout-title-color, var(--ntk-text-primary, #0f172a));
  font-family: var(--ntk-font-family-display, Inter, system-ui, sans-serif);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
}

.ntk-reference-brand-lockup__subtitle {
  display: block;
  margin-top: 2px;
  color: var(--ntk-template-layout-brand-subtitle, var(--ntk-text-secondary, #64748b));
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
