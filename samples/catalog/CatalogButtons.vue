<template>
  <section
    id="botoes"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="04"
      :title="t.botoesTitle"
      :desc="t.botoesDesc"
    />
    <div class="cg-card">
      <!-- variant × tone matrix -->
      <div
        v-for="variant in buttonVariants"
        :key="variant"
        class="cg-btnrow"
      >
        <span class="cg-mono cg-btnrow__label">{{ variantLabel(variant) }}</span>
        <div class="cg-btnrow__cells">
          <DsButton
            v-for="tone in galleryTones"
            :key="tone"
            :label="toneName(tone)"
            :variant="variant"
            :intent="tone"
          />
        </div>
      </div>

      <div class="cg-divider" />

      <!-- sizes -->
      <div class="cg-btnrow">
        <span class="cg-mono cg-btnrow__label">{{ t.btnSizes }}</span>
        <div class="cg-btnrow__cells cg-btnrow__cells--center">
          <DsButton
            v-for="sz in buttonSizes"
            :key="sz.key"
            :label="t[sz.labelKey]"
            :size="sz.dsSize"
            :density="sz.density"
          />
        </div>
      </div>

      <!-- states -->
      <div class="cg-btnrow">
        <span class="cg-mono cg-btnrow__label">{{ t.btnStates }}</span>
        <div class="cg-btnrow__cells cg-btnrow__cells--center">
          <DsButton :label="t.stDefault" />
          <DsButton :label="t.stHover" />
          <DsButton :label="t.stFocus" />
          <DsButton
            :label="t.stDisabled"
            disabled
          />
          <DsButton
            :label="t.stSaving"
            loading
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DsButton } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  buttonSizes,
  buttonVariantLabel,
  buttonVariants,
  galleryTones,
  toneLabel,
  toneLabelEn,
  type ButtonVariant,
  type GalleryTone,
} from './catalogGalleryData'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

function toneName(tone: GalleryTone): string {
  return props.locale === 'en' ? toneLabelEn[tone] : toneLabel[tone]
}

function variantLabel(variant: ButtonVariant): string {
  return buttonVariantLabel[variant]
}
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  scroll-margin-top: 92px;
}

.cg-card {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: var(--ds-card-padding);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cg-mono {
  font-family: var(--ds-font-mono);
}

.cg-btnrow {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cg-btnrow__label {
  width: 58px;
  font-size: 11.5px;
  color: var(--ds-color-text-muted);
  flex: 0 0 auto;
}

.cg-btnrow__cells {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}

.cg-btnrow__cells--center {
  gap: 10px;
  align-items: center;
}

.cg-divider {
  height: 1px;
  background: var(--ds-color-border);
}

/* Align the governed DsButton font to the catalog sans stack so the matrix
   matches the surrounding reference typography. */
.cg-btnrow__cells :deep(.ntk-button) {
  font-family: var(--ds-font-sans);
}
</style>