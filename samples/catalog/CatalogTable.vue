<template>
  <section
    id="tabela"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="09"
      :title="t.tabelaTitle"
      :desc="t.tabelaDesc"
    />

    <!-- Scroll H + V -->
    <div class="cg-block">
      <span class="cg-eyebrow">{{ t.scrollTitle }}</span>
      <span class="cg-blockdesc">{{ t.scrollDesc }}</span>
      <div class="cg-scrollbox cg-scrollbox--hv">
        <div class="cg-grid14">
          <div class="cg-grid14__head">
            <div
              v-for="col in scrollCols"
              :key="col"
              class="cg-grid14__hcell"
            >
              {{ col }}
            </div>
          </div>
          <div
            v-for="r in scrollRows"
            :key="r.id"
            class="cg-grid14__row"
          >
            <div class="cg-grid14__cell cg-mono">
              {{ r.id }}
            </div>
            <div class="cg-grid14__cell cg-grid14__cell--strong">
              {{ r.tag }}
            </div>
            <div class="cg-grid14__cell cg-mono">
              {{ r.addr }}
            </div>
            <div class="cg-grid14__cell">
              {{ r.tipo }}
            </div>
            <div class="cg-grid14__cell cg-mono">
              {{ r.valor }}
            </div>
            <div class="cg-grid14__cell cg-grid14__cell--muted">
              {{ r.unid }}
            </div>
            <div class="cg-grid14__cell cg-mono">
              {{ r.min }}
            </div>
            <div class="cg-grid14__cell cg-mono">
              {{ r.max }}
            </div>
            <div class="cg-grid14__cell cg-mono">
              {{ r.escala }}
            </div>
            <div class="cg-grid14__cell">
              {{ r.alarme }}
            </div>
            <div class="cg-grid14__cell cg-grid14__cell--muted">
              {{ r.zona }}
            </div>
            <div class="cg-grid14__cell cg-mono">
              {{ r.plc }}
            </div>
            <div class="cg-grid14__cell cg-mono">
              {{ r.scan }}
            </div>
            <div class="cg-grid14__cell cg-mono cg-grid14__cell--muted">
              {{ r.upd }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll vertical / horizontal side by side -->
    <div class="cg-scrollsplit">
      <div class="cg-block cg-block--tight">
        <span class="cg-eyebrow">{{ t.scrollVTitle }}</span>
        <span class="cg-blockdesc cg-blockdesc--sm">{{ t.scrollVDesc }}</span>
        <div class="cg-scrollbox cg-scrollbox--v">
          <div class="cg-grid5">
            <div class="cg-grid5__head">
              <div class="cg-grid5__hcell">
                ID
              </div>
              <div class="cg-grid5__hcell">
                Tag
              </div>
              <div class="cg-grid5__hcell">
                Tipo
              </div>
              <div class="cg-grid5__hcell">
                Zona
              </div>
              <div class="cg-grid5__hcell">
                Upd
              </div>
            </div>
            <div
              v-for="r in scrollRows"
              :key="r.id"
              class="cg-grid5__row"
            >
              <div class="cg-grid5__cell cg-mono">
                {{ r.id }}
              </div>
              <div class="cg-grid5__cell cg-grid5__cell--strong cg-ellipsis">
                {{ r.tag }}
              </div>
              <div class="cg-grid5__cell">
                {{ r.tipo }}
              </div>
              <div class="cg-grid5__cell cg-grid5__cell--muted cg-ellipsis">
                {{ r.zona }}
              </div>
              <div class="cg-grid5__cell cg-mono cg-grid5__cell--muted">
                {{ r.upd }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cg-block cg-block--tight cg-minw0">
        <span class="cg-eyebrow">{{ t.scrollHTitle }}</span>
        <span class="cg-blockdesc cg-blockdesc--sm">{{ t.scrollHDesc }}</span>
        <div class="cg-scrollbox cg-scrollbox--h">
          <div class="cg-grid14 cg-grid14--h">
            <div class="cg-grid14__head cg-grid14__head--plain">
              <div
                v-for="col in scrollCols"
                :key="col"
                class="cg-grid14__hcell cg-grid14__hcell--h"
              >
                {{ col }}
              </div>
            </div>
            <div
              v-for="r in scrollRowsFew"
              :key="r.id"
              class="cg-grid14__row"
            >
              <div class="cg-grid14__cell cg-mono">
                {{ r.id }}
              </div>
              <div class="cg-grid14__cell cg-grid14__cell--strong">
                {{ r.tag }}
              </div>
              <div class="cg-grid14__cell cg-mono">
                {{ r.addr }}
              </div>
              <div class="cg-grid14__cell">
                {{ r.tipo }}
              </div>
              <div class="cg-grid14__cell cg-mono">
                {{ r.valor }}
              </div>
              <div class="cg-grid14__cell cg-grid14__cell--muted">
                {{ r.unid }}
              </div>
              <div class="cg-grid14__cell cg-mono">
                {{ r.min }}
              </div>
              <div class="cg-grid14__cell cg-mono">
                {{ r.max }}
              </div>
              <div class="cg-grid14__cell cg-mono">
                {{ r.escala }}
              </div>
              <div class="cg-grid14__cell">
                {{ r.alarme }}
              </div>
              <div class="cg-grid14__cell cg-grid14__cell--muted">
                {{ r.zona }}
              </div>
              <div class="cg-grid14__cell cg-mono">
                {{ r.plc }}
              </div>
              <div class="cg-grid14__cell cg-mono">
                {{ r.scan }}
              </div>
              <div class="cg-grid14__cell cg-mono cg-grid14__cell--muted">
                {{ r.upd }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- State cards: loading / empty / error -->
    <div class="cg-statecards">
      <div class="cg-statecard">
        <div class="cg-statecard__hd">
          {{ t.stLoading }}
        </div>
        <div class="cg-statecard__body cg-statecard__body--loading">
          <div
            class="cg-skeleton"
            style="width: 90%"
          />
          <div
            class="cg-skeleton"
            style="width: 70%"
          />
          <div
            class="cg-skeleton"
            style="width: 82%"
          />
          <div
            class="cg-skeleton"
            style="width: 60%"
          />
        </div>
      </div>

      <div class="cg-statecard">
        <div class="cg-statecard__hd">
          {{ t.stEmpty }}
        </div>
        <div class="cg-statecard__body cg-statecard__body--empty">
          <div class="cg-emptyicon">
            ∅
          </div>
          <span class="cg-empty__title">{{ t.tblNoRecords }}</span>
          <span class="cg-empty__desc">{{ t.tblEmptyDesc }}</span>
        </div>
      </div>

      <div class="cg-statecard">
        <div class="cg-statecard__hd">
          {{ t.stError }}
        </div>
        <div class="cg-statecard__body cg-statecard__body--error">
          <div class="cg-errbox">
            <span class="cg-errbox__icon">!</span>
            <div class="cg-errbox__text">
              <span class="cg-errbox__title">{{ t.tblErrTitle }}</span>
              <span class="cg-mono cg-errbox__code">{{ t.tblErrCode }}</span>
            </div>
          </div>
          <button
            type="button"
            class="cg-errbtn"
          >
            {{ t.retry }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'
import { scrollCols, scrollRows } from './catalogGalleryData'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const scrollRowsFew = computed(() => scrollRows.slice(0, 4))
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 92px;
}

.cg-block {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.cg-block--tight {
  gap: 7px;
}

.cg-minw0 {
  min-width: 0;
}

.cg-eyebrow {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.cg-blockdesc {
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
}

.cg-blockdesc--sm {
  font-size: 12px;
}

.cg-mono {
  font-family: var(--ds-font-mono);
}

.cg-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Scroll containers */
.cg-scrollbox {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
}

.cg-scrollbox--hv {
  overflow: auto;
  max-height: 300px;
  max-width: 100%;
}

.cg-scrollbox--v {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 236px;
}

.cg-scrollbox--h {
  overflow-x: auto;
  overflow-y: hidden;
}

/* 14-col data grid */
.cg-grid14 {
  min-width: 1180px;
  font-size: 12.5px;
}

.cg-grid14__head {
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(14, minmax(84px, 1fr));
  background: var(--ds-color-surface-muted);
}

.cg-grid14__head--plain {
  position: static;
}

.cg-grid14__hcell {
  padding: 8px 12px;
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ds-color-text-muted);
  white-space: nowrap;
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
}

.cg-grid14__hcell--h {
  padding: 7px 11px;
  font-size: 10px;
}

.cg-grid14__row {
  display: grid;
  grid-template-columns: repeat(14, minmax(84px, 1fr));
  border-top: var(--ds-border-width) solid var(--ds-color-border);
}

.cg-grid14__row:hover {
  background: var(--ds-color-surface-muted);
}

.cg-grid14__cell {
  padding: 6px 12px;
  white-space: nowrap;
  color: var(--ds-color-text);
}

.cg-grid14--h .cg-grid14__cell {
  padding: 6px 11px;
}

.cg-grid14__cell--strong {
  font-weight: 600;
}

.cg-grid14__cell--muted {
  color: var(--ds-color-text-muted);
}

/* split */
.cg-scrollsplit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* 5-col vertical-scroll grid */
.cg-grid5 {
  font-size: 12.5px;
}

.cg-grid5__head {
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: 104px 1.5fr 78px 1.3fr 96px;
  background: var(--ds-color-surface-muted);
}

.cg-grid5__hcell {
  padding: 7px 11px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ds-color-text-muted);
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
}

.cg-grid5__row {
  display: grid;
  grid-template-columns: 104px 1.5fr 78px 1.3fr 96px;
  border-top: var(--ds-border-width) solid var(--ds-color-border);
}

.cg-grid5__row:hover {
  background: var(--ds-color-surface-muted);
}

.cg-grid5__cell {
  padding: 6px 11px;
  color: var(--ds-color-text);
}

.cg-grid5__cell--strong {
  font-weight: 600;
}

.cg-grid5__cell--muted {
  color: var(--ds-color-text-muted);
}

/* State cards */
.cg-statecards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
}

.cg-statecard {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  overflow: hidden;
}

.cg-statecard__hd {
  padding: 11px 16px;
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
  font-size: 11px;
  font-family: var(--ds-font-mono);
  color: var(--ds-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cg-statecard__body--loading {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cg-skeleton {
  height: 11px;
  border-radius: 5px;
  background: var(--ds-color-surface-muted);
  animation: cg-shimmer 1.3s ease-in-out infinite;
}

.cg-statecard__body--empty {
  padding: 26px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.cg-emptyicon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: var(--ds-color-surface-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  font-size: 18px;
}

.cg-empty__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ds-color-text);
}

.cg-empty__desc {
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
  line-height: 1.45;
  max-width: 30ch;
}

.cg-statecard__body--error {
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cg-errbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 13px;
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-danger-soft);
}

.cg-errbox__icon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--ds-color-danger);
  color: var(--ds-color-danger-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex: 0 0 auto;
}

.cg-errbox__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cg-errbox__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-danger);
}

.cg-errbox__code {
  font-size: 11.5px;
  color: var(--ds-color-text-muted);
}

.cg-errbtn {
  align-self: flex-start;
  height: 32px;
  padding: 0 13px;
  border-radius: var(--ds-radius-sm);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  cursor: pointer;
}

.cg-errbtn:hover {
  background: var(--ds-color-surface-muted);
}

@keyframes cg-shimmer {
  0% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.45;
  }
}
</style>