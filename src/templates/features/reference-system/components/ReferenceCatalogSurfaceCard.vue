<template>
  <button
    type="button"
    class="ntk-reference-catalog-surface-card"
    :class="{ 'ntk-reference-catalog-surface-card--active': active }"
    @click="emit('select', surface.id)"
  >
    <div class="ntk-reference-catalog-surface-card__top">
      <span class="ntk-reference-catalog-surface-card__tag">{{ surface.tag }}</span>
      <span class="ntk-reference-catalog-surface-card__template">{{ surface.template }}</span>
    </div>

    <div class="ntk-reference-catalog-surface-card__body">
      <h3>{{ surface.title }}</h3>
      <p class="ntk-reference-catalog-surface-card__subtitle">
        {{ surface.subtitle }}
      </p>
      <p class="ntk-reference-catalog-surface-card__description">
        {{ surface.description }}
      </p>
    </div>

    <div class="ntk-reference-catalog-surface-card__footer">
      <span>{{ ctaLabel }}</span>
      <q-icon
        name="arrow_forward"
        size="16px"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import type { ReferenceSampleSurface } from '../../../../whitelabel'

withDefaults(defineProps<{
  surface: ReferenceSampleSurface
  active?: boolean
  ctaLabel?: string
}>(), {
  active: false,
  ctaLabel: 'Inspect sample',
})

const emit = defineEmits<{
  select: [surfaceId: string]
}>()
</script>

<style scoped lang="scss">
.ntk-reference-catalog-surface-card {
  width: 100%;
  border: 1px solid var(--ntk-reference-border, #dbe4f0);
  border-radius: 24px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.ntk-reference-catalog-surface-card:hover,
.ntk-reference-catalog-surface-card--active {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--ntk-reference-accent, #10b981) 54%, var(--ntk-reference-border, #dbe4f0));
  box-shadow: var(--ntk-reference-shell-glow, 0 18px 36px rgba(15, 23, 42, 0.08));
}

.ntk-reference-catalog-surface-card__top,
.ntk-reference-catalog-surface-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ntk-reference-catalog-surface-card__tag,
.ntk-reference-catalog-surface-card__template {
  min-height: 26px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ntk-reference-catalog-surface-card__tag {
  background: var(--ntk-reference-badge-bg, rgba(16, 185, 129, 0.12));
  color: var(--ntk-reference-badge-text, #10b981);
}

.ntk-reference-catalog-surface-card__template {
  background: var(--ntk-reference-panel-muted-bg, #f8fbff);
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-reference-catalog-surface-card__body h3 {
  margin: 0;
  color: var(--ntk-text-primary, #0f172a);
}

.ntk-reference-catalog-surface-card__subtitle {
  margin: 8px 0 0;
  color: var(--ntk-text-primary, #0f172a);
  font-weight: 600;
}

.ntk-reference-catalog-surface-card__description {
  margin: 10px 0 0;
  color: var(--ntk-text-secondary, #64748b);
  line-height: 1.6;
}

.ntk-reference-catalog-surface-card__footer {
  color: var(--ntk-reference-accent, #10b981);
  font-size: 13px;
  font-weight: 600;
}
</style>
