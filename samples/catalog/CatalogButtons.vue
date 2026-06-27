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
            :style="cellStyle(variant, tone)"
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
            :style="sizeStyle(sz)"
          />
        </div>
      </div>

      <!-- states -->
      <div class="cg-btnrow">
        <span class="cg-mono cg-btnrow__label">{{ t.btnStates }}</span>
        <div class="cg-btnrow__cells cg-btnrow__cells--center">
          <DsButton
            :label="t.stDefault"
            :style="stateStyle()"
          />
          <DsButton
            :label="t.stHover"
            :style="stateStyle('hover')"
          />
          <DsButton
            :label="t.stFocus"
            :style="stateStyle('focus')"
          />
          <DsButton
            :label="t.stDisabled"
            disabled
            :style="stateStyle('disabled')"
          />
          <DsButton
            :label="t.stSaving"
            loading
            :style="stateStyle('loading')"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
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
import { buttonBase, variantStyle } from './catalogGalleryStyles'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

function toneName(tone: GalleryTone): string {
  return props.locale === 'en' ? toneLabelEn[tone] : toneLabel[tone]
}

function variantLabel(variant: ButtonVariant): string {
  return buttonVariantLabel[variant]
}

function cellStyle(variant: ButtonVariant, tone: GalleryTone): CSSProperties {
  return { ...buttonBase, ...variantStyle(variant, tone) }
}

function sizeStyle(sz: (typeof buttonSizes)[number]): CSSProperties {
  return {
    ...buttonBase,
    height: sz.height,
    padding: sz.padding,
    fontSize: sz.fontSize,
    background: 'var(--ds-color-primary)',
    color: 'var(--ds-color-primary-contrast)',
    borderColor: 'var(--ds-color-primary)',
  }
}

function stateStyle(kind?: 'hover' | 'focus' | 'disabled' | 'loading'): CSSProperties {
  const base: CSSProperties = {
    ...buttonBase,
    background: 'var(--ds-color-primary)',
    color: 'var(--ds-color-primary-contrast)',
    borderColor: 'var(--ds-color-primary)',
  }
  if (kind === 'hover') {
    return { ...base, background: 'var(--ds-color-primary-hover)', borderColor: 'var(--ds-color-primary-hover)' }
  }
  if (kind === 'focus') {
    return { ...base, boxShadow: 'var(--ds-focus-ring)' }
  }
  if (kind === 'disabled') {
    return { ...base, opacity: 0.45, cursor: 'not-allowed' }
  }
  if (kind === 'loading') {
    return { ...base, cursor: 'wait' }
  }
  return base
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

/* Re-skin DsButton to the exact reference cell: inline :style already wins on
   colors/size; here we neutralize the recipe's own font + reset so the inline
   metrics render 1:1. */
.cg-btnrow__cells :deep(.ntk-button) {
  font-family: var(--ds-font-sans);
  line-height: 1;
}
</style>