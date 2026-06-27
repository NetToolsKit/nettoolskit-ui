<template>
  <!-- ===== 01 · CORES & TEMAS ===== -->
  <section
    id="cores"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="01"
      :title="t.coresTitle"
      :desc="t.coresDesc"
    />

    <!-- Surfaces & text -->
    <div class="cg-block">
      <span class="cg-eyebrow">{{ t.surfaces }}</span>
      <div class="cg-swatchgrid">
        <div
          v-for="s in surfaceSwatches"
          :key="s.varName"
          class="cg-swatchcard"
        >
          <div
            class="cg-swatchcard__box"
            :style="{ background: `var(${s.varName})` }"
          />
          <div class="cg-swatchcard__meta">
            <span class="cg-swatchcard__label">{{ locale === 'en' ? s.labelEn : s.label }}</span>
            <span class="cg-mono cg-swatchcard__token">{{ s.varName }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Semantic tones -->
    <div class="cg-block">
      <span class="cg-eyebrow">{{ t.tonesLbl }}</span>
      <div class="cg-swatchgrid">
        <div
          v-for="tone in galleryTones"
          :key="tone"
          class="cg-swatchcard"
        >
          <div
            class="cg-tonebox"
            :style="toneBoxStyle(tone)"
          >
            <span>Aa</span>
          </div>
          <div class="cg-swatchcard__meta cg-swatchcard__meta--tone">
            <span class="cg-swatchcard__label">{{ toneName(tone) }}</span>
            <div class="cg-tonerow">
              <span
                class="cg-tonerow__dot"
                :style="toneSoftDot(tone)"
              />
              <span class="cg-mono cg-swatchcard__token">--ds-color-{{ tone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brand palette -->
    <div class="cg-block">
      <span class="cg-eyebrow">{{ t.brandPalette }}</span>
      <div class="cg-brand">
        <div class="cg-brand__top">
          <div class="cg-brand__swatches">
            <button
              v-for="sw in swatches"
              :key="sw.id"
              type="button"
              class="cg-brand__swatch"
              :class="{ 'is-active': currentBrandHex.toLowerCase() === sw.hex.toLowerCase() }"
              :style="{ background: sw.hex }"
              :aria-label="sw.hex"
              @click="applyBrandColor(sw.hex)"
            />
          </div>
          <div class="cg-brand__custom">
            <label class="cg-brand__customlabel">
              {{ t.custom }}
              <input
                type="color"
                :value="currentBrandHex"
                @input="onCustom"
              >
            </label>
            <button
              type="button"
              class="cg-brand__reset"
              @click="resetBrandColor"
            >
              {{ t.reset }}
            </button>
          </div>
        </div>

        <div class="cg-brand__ramprow">
          <span class="cg-mono cg-brand__ramplbl">{{ t.rampLbl }}</span>
          <div class="cg-ramp">
            <div class="cg-ramp__cell cg-ramp__cell--primary">
              {{ t.rampPrimary }}
            </div>
            <div class="cg-ramp__cell cg-ramp__cell--hover">
              {{ t.rampHover }}
            </div>
            <div class="cg-ramp__cell cg-ramp__cell--soft">
              {{ t.rampSoft }}
            </div>
          </div>
          <button
            type="button"
            class="cg-brand__samplebtn"
          >
            {{ t.samplePrimaryBtn }}
          </button>
          <span class="cg-brand__samplebadge">
            <span class="cg-brand__samplebadgedot" />{{ t.sampleBadge }}
          </span>
        </div>

        <p class="cg-brand__note">
          {{ t.brandNote }}
        </p>
      </div>
    </div>
  </section>

  <!-- ===== 02 · TIPOGRAFIA ===== -->
  <section
    id="tipografia"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="02"
      :title="t.tipoTitle"
      :desc="t.tipoDesc"
    />
    <div class="cg-typecard">
      <div
        v-for="row in typeScale"
        :key="row.label"
        class="cg-typerow"
      >
        <div class="cg-typerow__label">
          <span class="cg-typerow__name">{{ row.label }}</span>
          <span class="cg-mono cg-typerow__meta">{{ row.meta }}</span>
        </div>
        <span
          class="cg-typerow__sample"
          :style="row.style as Record<string, string>"
        >{{ row.sample }}</span>
      </div>
    </div>
  </section>

  <!-- ===== 03 · ESPAÇAMENTO & RAIO ===== -->
  <section
    id="espacamento"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="03"
      :title="t.espacoTitle"
      :desc="t.espacoDesc"
    />
    <div class="cg-spacegrid">
      <div class="cg-spacecard">
        <span class="cg-eyebrow">{{ t.spaceLbl }}</span>
        <div
          v-for="sp in spaceScale"
          :key="sp.t"
          class="cg-spacerow"
        >
          <span class="cg-mono cg-spacerow__token">{{ sp.t }}</span>
          <div
            class="cg-spacerow__bar"
            :style="{ width: `${sp.px}px` }"
          />
          <span class="cg-mono cg-spacerow__val">{{ sp.px }}px</span>
        </div>
      </div>
      <div class="cg-spacecard">
        <span class="cg-eyebrow">{{ t.radiusLbl }}</span>
        <div class="cg-radiusrow">
          <div
            v-for="rd in radiusScale"
            :key="rd.t"
            class="cg-radiusitem"
          >
            <div
              class="cg-radiusitem__box"
              :style="{ borderRadius: rd.px === 999 ? '999px' : `${rd.px}px` }"
            />
            <span class="cg-mono cg-radiusitem__lbl">{{ rd.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  galleryTones,
  radiusScale,
  spaceScale,
  surfaceSwatches,
  toneLabel,
  toneLabelEn,
  typeScale,
  type GalleryTone,
} from './catalogGalleryData'
import { catalogSwatches, useCatalogShell } from './useCatalogShell'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const { currentBrandHex, applyBrandColor, resetBrandColor } = useCatalogShell()
const swatches = catalogSwatches

function onCustom(event: Event): void {
  applyBrandColor((event.target as HTMLInputElement).value)
}

function toneName(tone: GalleryTone): string {
  return props.locale === 'en' ? toneLabelEn[tone] : toneLabel[tone]
}

function toneBoxStyle(tone: GalleryTone): CSSProperties {
  return {
    height: '56px',
    background: `var(--ds-color-${tone})`,
    color: `var(--ds-color-${tone}-contrast)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '15px',
  }
}

function toneSoftDot(tone: GalleryTone): CSSProperties {
  return {
    width: '10px',
    height: '10px',
    borderRadius: '3px',
    background: `var(--ds-color-${tone}-soft)`,
    border: '1px solid var(--ds-color-border)',
    flex: '0 0 auto',
  }
}
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  scroll-margin-top: 92px;
}

.cg-block {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.cg-eyebrow {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.cg-mono {
  font-family: var(--ds-font-mono);
}

/* Swatch grids (surfaces + tones) */
.cg-swatchgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.cg-swatchcard {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  background: var(--ds-color-surface);
}

.cg-swatchcard__box {
  height: 52px;
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
}

.cg-swatchcard__meta {
  padding: 9px 11px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cg-swatchcard__meta--tone {
  gap: 4px;
}

.cg-swatchcard__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-text);
}

.cg-swatchcard__token {
  font-size: 10.5px;
  color: var(--ds-color-text-muted);
}

.cg-tonebox span {
  pointer-events: none;
}

.cg-tonerow {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Brand palette card */
.cg-brand {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: var(--ds-card-padding);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cg-brand__top {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.cg-brand__swatches {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cg-brand__swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--ds-radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s;
}

.cg-brand__swatch:hover {
  transform: scale(1.08);
}

.cg-brand__swatch.is-active {
  box-shadow: 0 0 0 2px var(--ds-color-surface), 0 0 0 4px var(--ds-color-text);
}

.cg-brand__custom {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 14px;
  border-left: 1px solid var(--ds-color-border);
  flex-wrap: wrap;
}

.cg-brand__customlabel {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--ds-color-text-muted);
  cursor: pointer;
}

.cg-brand__customlabel input[type='color'] {
  width: 38px;
  height: 30px;
  border: 1px solid var(--ds-color-border);
  border-radius: 7px;
  background: var(--ds-color-surface);
  cursor: pointer;
  padding: 2px;
}

.cg-brand__reset {
  height: 30px;
  padding: 0 12px;
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-family: var(--ds-font-sans);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.cg-brand__reset:hover {
  background: var(--ds-color-surface-muted);
}

.cg-brand__ramprow {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cg-brand__ramplbl {
  font-size: 10px;
  color: var(--ds-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: 60px;
}

.cg-ramp {
  display: flex;
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  border: 1px solid var(--ds-color-border);
}

.cg-ramp__cell {
  height: 42px;
  display: flex;
  align-items: flex-end;
  padding: 3px 6px;
  font-size: 9px;
  font-family: var(--ds-font-mono);
}

.cg-ramp__cell--primary {
  width: 74px;
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
}

.cg-ramp__cell--hover {
  width: 64px;
  background: var(--ds-color-primary-hover);
  color: var(--ds-color-primary-contrast);
}

.cg-ramp__cell--soft {
  width: 64px;
  background: var(--ds-color-primary-soft);
  color: var(--ds-color-primary-soft-fg);
}

.cg-brand__samplebtn {
  height: 34px;
  padding: 0 16px;
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-color-primary);
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
  font-family: var(--ds-font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.cg-brand__samplebadge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 3px 11px;
  border-radius: var(--ds-radius-pill);
  background: var(--ds-color-primary-soft);
  color: var(--ds-color-primary);
  font-size: 12px;
  font-weight: 600;
}

.cg-brand__samplebadgedot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ds-color-primary);
}

.cg-brand__note {
  margin: 0;
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
  line-height: 1.5;
}

/* Typography card */
.cg-typecard {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  overflow: hidden;
}

.cg-typerow {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 13px var(--ds-card-padding);
  border-top: var(--ds-border-width) solid var(--ds-color-border);
}

.cg-typerow:first-child {
  border-top: none;
}

.cg-typerow__label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cg-typerow__name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ds-color-text);
}

.cg-typerow__meta {
  font-size: 10.5px;
  color: var(--ds-color-text-muted);
}

.cg-typerow__sample {
  color: var(--ds-color-text);
}

/* Spacing & radius */
.cg-spacegrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.cg-spacecard {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: var(--ds-card-padding);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cg-spacerow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cg-spacerow__token {
  width: 78px;
  font-size: 11px;
  color: var(--ds-color-text-muted);
}

.cg-spacerow__bar {
  height: 14px;
  background: var(--ds-color-primary);
  border-radius: 3px;
  flex: 0 0 auto;
}

.cg-spacerow__val {
  font-size: 11px;
  color: var(--ds-color-text-muted);
}

.cg-radiusrow {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.cg-radiusitem {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.cg-radiusitem__box {
  width: 54px;
  height: 54px;
  background: var(--ds-color-primary-soft);
  border: var(--ds-border-width) solid var(--ds-color-primary);
}

.cg-radiusitem__lbl {
  font-size: 10.5px;
  color: var(--ds-color-text-muted);
}
</style>