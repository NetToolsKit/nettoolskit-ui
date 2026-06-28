<template>
  <section
    id="topo"
    class="cat-hero"
  >
    <div class="cat-hero__intro">
      <span class="cat-hero__eyebrow">{{ t.heroEyebrow }}</span>
      <h1 class="cat-hero__title">
        {{ t.h1Title }}
      </h1>
      <p class="cat-hero__lead">
        {{ t.introLead }}
      </p>
      <div class="cat-hero__chips">
        <DsChip
          v-for="chip in chips"
          :key="chip"
          class="cat-hero__chip"
          variant="soft"
          intent="neutral"
          size="sm"
          :label="chip"
        />
      </div>
    </div>

    <!-- Info banner -->
    <div class="cat-callout">
      <span
        class="cat-callout__icon"
        aria-hidden="true"
      >↗</span>
      <p class="cat-callout__text">
        <strong>{{ t.introCalloutStrong }}</strong> {{ t.introCallout }}
      </p>
    </div>

    <!-- Brand lockups -->
    <div class="cat-lockups">
      <span class="cat-lockups__title">{{ t.brandApps }}</span>
      <div class="cat-lockups__grid">
        <div class="cat-lockup">
          <div class="cat-lockup__card cat-lockup__card--positive">
            <CatalogBrandMark :size="26" />
            <span class="cat-lockup__name cat-lockup__name--dark">{{ t.brandName }}</span>
          </div>
          <span class="cat-lockup__caption">{{ t.lockPos }}</span>
        </div>

        <div class="cat-lockup">
          <div class="cat-lockup__card cat-lockup__card--negative">
            <CatalogBrandMark
              :size="26"
              background="#ffffff"
              color="var(--ntk-primary)"
            />
            <span class="cat-lockup__name cat-lockup__name--light">{{ t.brandName }}</span>
          </div>
          <span class="cat-lockup__caption">{{ t.lockNeg }}</span>
        </div>

        <div class="cat-lockup">
          <div class="cat-lockup__card cat-lockup__card--mono">
            <CatalogBrandMark
              :size="26"
              background="rgba(255,255,255,0.14)"
              color="#ffffff"
            />
            <span class="cat-lockup__name cat-lockup__name--light">{{ t.brandName }}</span>
          </div>
          <span class="cat-lockup__caption">{{ t.lockMono }}</span>
        </div>

        <div class="cat-lockup">
          <div class="cat-lockup__card cat-lockup__card--photo">
            <CatalogBrandMark
              :size="26"
              background="rgba(255,255,255,0.16)"
              color="#ffffff"
            />
            <span class="cat-lockup__name cat-lockup__name--light">{{ t.brandName }}</span>
            <span class="cat-lockup__overlay">{{ t.lockPhotoOverlay }}</span>
          </div>
          <span class="cat-lockup__caption">{{ t.lockPhoto }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DsChip } from '../../src/index'
import CatalogBrandMark from './CatalogBrandMark.vue'
import type { CatalogStrings } from './catalogI18n'

const props = defineProps<{ t: CatalogStrings }>()

const chips = computed(() => [
  props.t.chipVue,
  props.t.chipTs,
  props.t.chipQuasar,
  props.t.chipTokens,
  props.t.chipLayers,
  props.t.chipWcag,
])
</script>

<style scoped>
.cat-hero {
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-margin-top: 92px;
}

.cat-hero__intro {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cat-hero__eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ntk-primary);
}

.cat-hero__title {
  margin: 0;
  font-size: 40px;
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -0.025em;
  max-width: 18ch;
  color: var(--ntk-text-heading);
}

.cat-hero__lead {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  color: var(--ntk-text-muted);
  max-width: 64ch;
}

.cat-hero__chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 2px;
}

/* Reference renders the tech chips as muted mono "tokens" pills, not solid
   badges. Re-skin the soft DsChip here (samples scope permits :deep). */
.cat-hero__chips :deep(.ntk-chip) {
  background: var(--ntk-row-bg);
  border: 1px solid var(--ntk-border);
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  padding-block: 6px;
  padding-inline: 11px;
}

/* Info banner */
.cat-callout {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--ntk-radius-lg);
  background: var(--ntk-accent-soft);
  border: 1px solid transparent;
}

.cat-callout__icon {
  inline-size: 22px;
  block-size: 22px;
  border-radius: 999px;
  background: var(--ntk-primary);
  color: var(--ntk-text-on-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex: 0 0 auto;
}

.cat-callout__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  /* Text on the brand soft callout surface → global on-soft rule. */
  color: var(--ntk-on-soft);
}

/* Brand lockups */
.cat-lockups {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cat-lockups__title {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
}

.cat-lockups__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.cat-lockup {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-lockup__card {
  position: relative;
  overflow: hidden;
  height: 84px;
  border-radius: var(--ntk-radius-md);
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 16px;
}

.cat-lockup__card--positive {
  background: #ffffff;
  border: 1px solid var(--ntk-border);
}

.cat-lockup__card--negative {
  background: var(--ntk-primary);
}

.cat-lockup__card--mono {
  background: #1e293b;
}

.cat-lockup__card--photo {
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0,
      rgba(255, 255, 255, 0.05) 10px,
      transparent 10px,
      transparent 20px
    ),
    linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.cat-lockup__name {
  font-weight: 700;
  font-size: 14px;
}

.cat-lockup__name--dark {
  color: #0f172a;
}

.cat-lockup__name--light {
  color: #ffffff;
}

/* Negative lockup sits on the BRAND background, so its text must follow the
   brand contrast color (the "Cor do texto" adjuster) — not a hardcoded white.
   Mono/photo keep white (they sit on dark surfaces). */
.cat-lockup__card--negative .cat-lockup__name {
  color: var(--ntk-text-on-accent);
}

.cat-lockup__overlay {
  position: absolute;
  right: 12px;
  bottom: 9px;
  font-size: 10px;
  font-family: 'IBM Plex Mono', monospace;
  color: rgba(255, 255, 255, 0.7);
}

.cat-lockup__caption {
  font-size: 11px;
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
}

@media (max-width: 720px) {
  .cat-lockups__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .cat-hero__title {
    font-size: 32px;
  }
}
</style>