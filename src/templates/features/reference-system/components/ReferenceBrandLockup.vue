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
  width: 38px;
  height: 38px;
  border-radius: 14px;
  object-fit: contain;
  flex-shrink: 0;
}

.ntk-reference-brand-lockup__mark {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: var(--ntk-primary, #2563eb);
  color: var(--ntk-text-light, #ffffff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.ntk-reference-brand-lockup__name {
  display: block;
  color: var(--ntk-text-primary, #0f172a);
  font-weight: 700;
}

.ntk-reference-brand-lockup__subtitle {
  display: block;
  color: var(--ntk-text-secondary, #64748b);
}
</style>