<template>
  <section
    id="badges"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="07"
      :title="t.badgesTitle"
      :desc="t.badgesDesc"
    />
    <div class="cg-card">
      <div
        v-for="tone in galleryTones"
        :key="tone"
        class="cg-badgerow"
      >
        <span class="cg-mono cg-badgerow__key">{{ tone }}</span>
        <DsBadge
          variant="solid"
          :intent="tone"
          leading-dot
        >
          {{ toneName(tone) }}
        </DsBadge>
        <DsBadge
          variant="soft"
          :intent="tone"
          leading-dot
        >
          {{ toneName(tone) }}
        </DsBadge>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DsBadge } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'
import { galleryTones, toneLabel, toneLabelEn, type GalleryTone } from './catalogGalleryData'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

function toneName(tone: GalleryTone): string {
  return props.locale === 'en' ? toneLabelEn[tone] : toneLabel[tone]
}
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 92px;
}

.cg-card {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: var(--ds-card-padding);
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.cg-mono {
  font-family: var(--ds-font-mono);
}

.cg-badgerow {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cg-badgerow__key {
  width: 80px;
  font-size: 11.5px;
  color: var(--ds-color-text-muted);
  flex: 0 0 auto;
}

/* Align the governed DsBadge font to the catalog sans stack. */
.cg-badgerow :deep(.ntk-badge) {
  font-family: var(--ds-font-sans);
}
</style>