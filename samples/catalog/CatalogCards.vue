<template>
  <section
    id="cards"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="06"
      :title="t.cardsTitle"
      :desc="t.cardsDesc"
    />
    <div class="cg-cardgrid">
      <DsCard class="cg-card cg-card--flat">
        <span class="cg-card__kicker">flat</span>
        <h4 class="cg-card__title">
          {{ t.cardFlatT }}
        </h4>
        <p class="cg-card__body">
          {{ t.cardFlatD }}
        </p>
      </DsCard>

      <DsCard
        variant="outlined"
        class="cg-card cg-card--outlined"
      >
        <span class="cg-card__kicker">outlined</span>
        <h4 class="cg-card__title">
          {{ t.cardOutT }}
        </h4>
        <p class="cg-card__body">
          {{ t.cardOutD }}
        </p>
      </DsCard>

      <DsCard
        variant="elevated"
        class="cg-card cg-card--elevated"
      >
        <span class="cg-card__kicker">elevated</span>
        <h4 class="cg-card__title">
          {{ t.cardElevT }}
        </h4>
        <p class="cg-card__body">
          {{ t.cardElevD }}
        </p>
      </DsCard>

      <DsCard
        variant="soft"
        class="cg-card"
      >
        <span class="cg-card__kicker">soft</span>
        <h4 class="cg-card__title">
          {{ t.cardSoftT }}
        </h4>
        <p class="cg-card__body">
          {{ t.cardSoftD }}
        </p>
      </DsCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DsCard } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 92px;
}

.cg-cardgrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

/* Re-skin DsCard bodies to the exact reference card metrics. The base keeps
   layout only; the surface fill is per-variant so the native soft variant's
   muted background shows through. */
.cg-card {
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-card-padding);
  gap: 8px;
}

/* DsCard wraps the default slot in __body with its own gap; flatten it so the
   reference 8px rhythm and single padding apply cleanly. */
.cg-card :deep(.ntk-card__body) {
  gap: 8px;
}

.cg-card--flat {
  border: none;
  box-shadow: none;
  background: var(--ds-color-surface);
}

.cg-card--outlined {
  border: var(--ds-border-width) solid var(--ds-color-border);
  box-shadow: none;
  background: var(--ds-color-surface);
}

.cg-card--elevated {
  border: none;
  box-shadow: var(--ds-shadow);
  background: var(--ds-color-surface);
}

.cg-card__kicker {
  font-size: 10px;
  font-family: var(--ds-font-mono);
  color: var(--ds-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cg-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  color: var(--ds-color-text);
}

.cg-card__body {
  margin: 0;
  font-size: 13.5px;
  color: var(--ds-color-text-muted);
  line-height: 1.5;
}
</style>