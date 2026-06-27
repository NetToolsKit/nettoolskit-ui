<template>
  <header class="cat-topbar">
    <div class="cat-topbar__inner">
      <!-- Brand -->
      <div class="cat-brand">
        <CatalogBrandMark :size="38" />
        <span class="cat-brand__text">
          <span class="cat-brand__name">{{ t.brandName }}</span>
          <span class="cat-brand__caption">{{ t.brandCaption }}</span>
        </span>
      </div>

      <div class="cat-topbar__controls">
        <!-- TEMA -->
        <div class="cat-control">
          <span class="cat-control__label">{{ t.lblTheme }}</span>
          <div
            class="cat-seg"
            role="group"
            :aria-label="t.lblTheme"
          >
            <button
              v-for="opt in themeOptions"
              :key="opt.value"
              type="button"
              class="cat-seg__btn"
              :class="{ 'is-active': state.theme === opt.value }"
              :aria-pressed="state.theme === opt.value"
              @click="applyTheme(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- MARCA -->
        <div class="cat-control">
          <span class="cat-control__label">{{ t.lblBrand }}</span>
          <button
            type="button"
            class="cat-dropdown"
            :aria-label="t.brandColorLbl"
          >
            <span
              class="cat-dropdown__dot"
              :style="{ background: currentBrandHex }"
              aria-hidden="true"
            />
            <span class="cat-dropdown__text">{{ t.colorBtn }}</span>
            <span
              class="cat-dropdown__chevron"
              aria-hidden="true"
            >⌄</span>
            <QMenu
              anchor="bottom right"
              self="top right"
              class="cat-menu"
            >
              <div class="cat-palette">
                <p class="cat-palette__title">
                  {{ t.brandColorLbl }}
                </p>
                <div class="cat-palette__grid">
                  <button
                    v-for="sw in swatches"
                    :key="sw.id"
                    v-close-popup
                    type="button"
                    class="cat-swatch"
                    :class="{ 'is-active': currentBrandHex.toLowerCase() === sw.hex.toLowerCase() }"
                    :style="{ background: sw.hex }"
                    :title="sw.hex"
                    :aria-label="sw.hex"
                    @click="applyBrandColor(sw.hex)"
                  />
                </div>
                <label class="cat-palette__custom">
                  <span>{{ t.custom }}</span>
                  <input
                    type="color"
                    :value="currentBrandHex"
                    @input="onCustomColor"
                  >
                </label>

                <!-- Brand TEXT color (contrast drawn on top of the brand). -->
                <div class="cat-palette__divider" />
                <p class="cat-palette__title">
                  {{ t.brandTextLbl }}
                </p>
                <div
                  class="cat-textmode"
                  role="group"
                  :aria-label="t.brandTextLbl"
                >
                  <button
                    v-for="opt in textColorOptions"
                    :key="opt.value"
                    type="button"
                    class="cat-textmode__btn"
                    :class="{ 'is-active': isTextModeActive(opt.value) }"
                    :aria-pressed="isTextModeActive(opt.value)"
                    @click="applyBrandTextColor(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
                <label class="cat-palette__custom">
                  <span>{{ t.custom }}</span>
                  <input
                    type="color"
                    :value="currentBrandTextHex"
                    :aria-label="t.brandTextLbl"
                    @input="onCustomTextColor"
                  >
                </label>

                <button
                  v-close-popup
                  type="button"
                  class="cat-palette__reset"
                  @click="resetBrandColor"
                >
                  {{ t.reset }}
                </button>
              </div>
            </QMenu>
          </button>
        </div>

        <!-- DENSIDADE -->
        <div class="cat-control">
          <span class="cat-control__label">{{ t.lblDensity }}</span>
          <div
            class="cat-seg"
            role="group"
            :aria-label="t.lblDensity"
          >
            <button
              v-for="opt in densityOptions"
              :key="opt.value"
              type="button"
              class="cat-seg__btn"
              :class="{ 'is-active': state.density === opt.value }"
              :aria-pressed="state.density === opt.value"
              @click="applyDensity(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- FONTE -->
        <div class="cat-control">
          <span class="cat-control__label">{{ t.lblFont }}</span>
          <button
            type="button"
            class="cat-dropdown cat-dropdown--wide"
            :aria-label="t.lblFont"
          >
            <span class="cat-dropdown__text">{{ activeFontLabel }}</span>
            <span
              class="cat-dropdown__chevron"
              aria-hidden="true"
            >⌄</span>
            <QMenu
              anchor="bottom right"
              self="top right"
              class="cat-menu"
            >
              <div class="cat-fontlist">
                <button
                  v-for="font in fonts"
                  :key="font.id"
                  v-close-popup
                  type="button"
                  class="cat-fontlist__item"
                  :class="{ 'is-active': state.fontId === font.id }"
                  :style="{ fontFamily: font.stack }"
                  @click="applyFont(font.id)"
                >
                  {{ font.label }}
                </button>
              </div>
            </QMenu>
          </button>
        </div>

        <!-- IDIOMA -->
        <div class="cat-control">
          <span class="cat-control__label">{{ t.lblLang }}</span>
          <div
            class="cat-seg"
            role="group"
            :aria-label="t.lblLang"
          >
            <button
              v-for="opt in localeOptions"
              :key="opt.value"
              type="button"
              class="cat-seg__btn"
              :class="{ 'is-active': state.locale === opt.value }"
              :aria-pressed="state.locale === opt.value"
              @click="applyLocale(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QMenu } from 'quasar'
import CatalogBrandMark from './CatalogBrandMark.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  catalogFonts,
  catalogSwatches,
  useCatalogShell,
  type CatalogDensity,
  type CatalogLocale,
  type CatalogTheme,
} from './useCatalogShell'

const props = defineProps<{ t: CatalogStrings }>()

const {
  state,
  currentBrandHex,
  currentBrandTextHex,
  applyTheme,
  applyDensity,
  applyLocale,
  applyFont,
  applyBrandColor,
  applyBrandTextColor,
  resetBrandColor,
} = useCatalogShell()

const swatches = catalogSwatches
const fonts = catalogFonts

const themeOptions = computed<{ value: CatalogTheme; label: string }[]>(() => [
  { value: 'light', label: props.t.tLight },
  { value: 'dark', label: props.t.tDark },
  { value: 'hc', label: props.t.tHc },
])

const densityOptions = computed<{ value: CatalogDensity; label: string }[]>(() => [
  { value: 'compact', label: props.t.dCompact },
  { value: 'comfortable', label: props.t.dComfortable },
  { value: 'spacious', label: props.t.dSpacious },
])

const localeOptions: { value: CatalogLocale; label: string }[] = [
  { value: 'pt', label: 'PT' },
  { value: 'en', label: 'EN' },
]

const activeFontLabel = computed(
  () => fonts.find((f) => f.id === state.fontId)?.label ?? fonts[0].label
)

/** Brand-text adjuster presets: Auto (luminance) · White · Black. */
const textColorOptions = computed<{ value: 'auto' | string; label: string }[]>(() => [
  { value: 'auto', label: props.t.textAuto },
  { value: '#ffffff', label: props.t.textWhite },
  { value: '#000000', label: props.t.textBlack },
])

function isTextModeActive(value: 'auto' | string): boolean {
  if (value === 'auto') return state.brandTextColor === 'auto'
  return (
    state.brandTextColor !== 'auto' &&
    state.brandTextColor.toLowerCase() === value.toLowerCase()
  )
}

function onCustomColor(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  applyBrandColor(value)
}

function onCustomTextColor(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  applyBrandTextColor(value)
}
</script>

<style scoped>
.cat-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--ntk-header-bg);
  border-bottom: 1px solid var(--ntk-border);
}

.cat-topbar__inner {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 11px clamp(20px, 4vw, 48px);
}

/* Brand */
.cat-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  flex: 0 0 auto;
}

.cat-brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.cat-brand__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ntk-text-heading);
}

.cat-brand__caption {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
}

/* Controls row */
.cat-topbar__controls {
  display: flex;
  align-items: flex-start;
  gap: clamp(14px, 2vw, 30px);
  margin-left: auto;
  flex-wrap: wrap;
}

.cat-control {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cat-control__label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
  padding-left: 2px;
}

/* Segmented control */
.cat-seg {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 9px;
  background: var(--ntk-row-bg);
}

.cat-seg__btn {
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 5px 11px;
  border-radius: 7px;
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ntk-text-muted);
  background: transparent;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.cat-seg__btn:hover {
  color: var(--ntk-text-heading);
}

.cat-seg__btn.is-active {
  background: var(--ntk-primary);
  color: var(--ntk-text-on-accent);
  font-weight: 600;
}

/* Dropdown buttons (MARCA, FONTE) */
.cat-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 11px;
  border-radius: 8px;
  border: 1px solid var(--ntk-border);
  background: var(--ntk-card-bg);
  color: var(--ntk-text-heading);
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  transition: border-color 0.15s, background 0.15s;
}

.cat-dropdown:hover {
  border-color: var(--ntk-border-strong);
}

.cat-dropdown--wide {
  min-width: 150px;
  justify-content: space-between;
}

.cat-dropdown__dot {
  inline-size: 14px;
  block-size: 14px;
  border-radius: 999px;
  flex: 0 0 auto;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08) inset;
}

.cat-dropdown__chevron {
  font-size: 12px;
  color: var(--ntk-text-muted);
  line-height: 1;
}

@media (max-width: 1180px) {
  .cat-topbar__inner {
    flex-wrap: wrap;
  }
  .cat-topbar__controls {
    margin-left: 0;
  }
}
</style>

<!--
  QMenu panels (MARCA "Cor" + FONTE) teleport to <body>, OUTSIDE this component's
  scoped DOM, so scoped selectors never match the .q-menu root (it carries no
  data-v attribute). These rules are intentionally GLOBAL so the popover panels
  follow the catalog theme tokens instead of Quasar's default white surface.
-->
<style>
.cat-menu.q-menu {
  background: var(--ntk-card-bg);
  color: var(--ntk-text-body);
  border: 1px solid var(--ntk-border);
  border-radius: 12px;
  box-shadow: var(--ntk-shadow-popup, 0 8px 24px rgba(0, 0, 0, 0.25));
}

.cat-menu .cat-palette {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  width: 200px;
}

.cat-menu .cat-palette__title {
  margin: 0;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
  font-family: 'IBM Plex Mono', monospace;
}

.cat-menu .cat-palette__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 7px;
}

.cat-menu .cat-swatch {
  inline-size: 22px;
  block-size: 22px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18) inset;
  transition: transform 0.12s;
}

.cat-menu .cat-swatch:hover {
  transform: scale(1.1);
}

.cat-menu .cat-swatch.is-active {
  box-shadow: 0 0 0 2px var(--ntk-card-bg), 0 0 0 4px var(--ntk-text-heading);
}

.cat-menu .cat-palette__custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: var(--ntk-text-body);
}

.cat-menu .cat-palette__custom input[type='color'] {
  inline-size: 34px;
  block-size: 24px;
  border: 1px solid var(--ntk-border);
  border-radius: 6px;
  background: none;
  cursor: pointer;
  padding: 0;
}

.cat-menu .cat-palette__divider {
  block-size: 1px;
  margin: 2px 0;
  background: var(--ntk-border);
}

/* Brand text-color mode (Auto / White / Black) */
.cat-menu .cat-textmode {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 2px;
  border-radius: 8px;
  background: var(--ntk-row-bg);
}

.cat-menu .cat-textmode__btn {
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 6px 4px;
  border-radius: 6px;
  font: inherit;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ntk-text-muted);
  background: transparent;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.cat-menu .cat-textmode__btn:hover {
  color: var(--ntk-text-heading);
}

.cat-menu .cat-textmode__btn.is-active {
  background: var(--ntk-primary);
  color: var(--ntk-text-on-accent);
  font-weight: 600;
}

.cat-menu .cat-palette__reset {
  appearance: none;
  cursor: pointer;
  border: 1px solid var(--ntk-border);
  border-radius: 8px;
  background: var(--ntk-row-bg);
  color: var(--ntk-text-body);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 10px;
}

.cat-menu .cat-palette__reset:hover {
  background: var(--ntk-row-hover-bg);
}

/* Font list menu */
.cat-menu .cat-fontlist {
  display: flex;
  flex-direction: column;
  padding: 6px;
  min-width: 180px;
}

.cat-menu .cat-fontlist__item {
  appearance: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 9px 12px;
  border-radius: 8px;
  background: transparent;
  /* Theme text color so the per-option font preview stays readable in dark. */
  color: var(--ntk-text-body);
  font-size: 14px;
}

.cat-menu .cat-fontlist__item:hover {
  background: var(--ntk-row-hover-bg);
}

.cat-menu .cat-fontlist__item.is-active {
  background: var(--ntk-nav-active-bg);
  /* Selected option sits on the soft nav-active surface → global on-soft rule. */
  color: var(--ntk-on-soft);
  font-weight: 600;
}
</style>