<template>
  <CatalogScreenFrame
    anchor="ecommerce"
    :badge="t.ecomBadge"
    :title="t.ecomTitle"
    :desc="t.ecomDesc"
    :t="t"
  >
    <template #default="{ isFull }">
      <div
        class="ec-shell"
        :class="{ 'ec-shell--full': isFull }"
      >
        <!-- TOP MENU -->
        <div class="ec-top">
          <button
            type="button"
            class="ec-icon ec-hamb"
            :aria-label="t.collapseMenu"
            :title="t.collapseMenu"
            @click="collapsed = !collapsed"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="ec-brand">
            <span class="ec-logo">N</span>
            <span class="ec-logo__name">NetShop</span>
          </div>
          <div class="ec-search">
            <input
              :placeholder="t.ecomSearch"
              class="ec-search__input"
            >
            <span
              class="ec-search__icon"
              aria-hidden="true"
            >⌕</span>
          </div>
          <div class="ec-spacer" />
          <div class="ec-topnav">
            <span class="ec-topnav__item ec-topnav__item--active">{{ t.mTop1 }}</span>
            <span class="ec-topnav__item">{{ t.mTop2 }}</span>
            <span class="ec-topnav__item">{{ t.mTop3 }}</span>
            <span class="ec-topnav__item">{{ t.mTop4 }}</span>
          </div>
          <span class="ec-divider" />
          <button
            type="button"
            class="ec-icon"
            :aria-label="t.ecomNotifications"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
          </button>
          <span class="ec-avatar">MA</span>
        </div>

        <div class="ec-body">
          <!-- SIDEBAR -->
          <aside
            class="ec-sidebar"
            :class="{ 'ec-sidebar--collapsed': collapsed }"
          >
            <button
              v-for="item in nav"
              :key="item.key"
              type="button"
              class="ec-nav"
              :class="{ 'ec-nav--active': tab === item.key }"
              @click="tab = item.key"
            >
              <EcomNavIcon
                :name="item.key"
                class="ec-nav__icon"
              />
              <span class="ec-nav__label">{{ t[item.labelKey] }}</span>
            </button>
            <div class="ec-navspacer" />
            <button
              type="button"
              class="ec-nav"
              :class="{ 'ec-nav--active': tab === 'settings' }"
              @click="tab = 'settings'"
            >
              <EcomNavIcon
                name="settings"
                class="ec-nav__icon"
              />
              <span class="ec-nav__label">{{ t.sbSettings }}</span>
            </button>
          </aside>

          <!-- CONTENT -->
          <main class="ec-main">
            <!-- Dashboard -->
            <div
              v-show="tab === 'dashboard'"
              class="ec-panel"
            >
              <div class="ec-kpis">
                <div
                  v-for="kpi in ecomKpis"
                  :key="kpi.key"
                  class="ec-kpi"
                >
                  <span class="ec-kpi__label">{{ t[kpi.key] }}</span>
                  <span class="ec-kpi__value">{{ formatKpiValue(kpi, locale) }}</span>
                  <span
                    class="ec-kpi__delta"
                    :style="{ color: `var(--ds-color-${kpi.tone})` }"
                  >{{ formatDeltaPercent(kpi.delta, locale) }}</span>
                </div>
              </div>
              <div class="ec-card">
                <div class="ec-card__hd">
                  {{ t.recentOrders }}
                </div>
                <div>
                  <div
                    class="ec-orow ec-orow--head"
                  >
                    <div class="ec-ocell">
                      {{ t.colOrder }}
                    </div>
                    <div class="ec-ocell">
                      {{ t.colClient }}
                    </div>
                    <div class="ec-ocell ec-ocell--right">
                      {{ t.colTotal }}
                    </div>
                    <div class="ec-ocell">
                      {{ t.colSituacao }}
                    </div>
                  </div>
                  <div
                    v-for="o in ecomOrders.slice(0, 3)"
                    :key="o.id"
                    class="ec-orow"
                  >
                    <div class="ec-ocell ec-ocell--mono">
                      {{ o.id }}
                    </div>
                    <div class="ec-ocell">
                      {{ o.client }}
                    </div>
                    <div class="ec-ocell ec-ocell--right ec-ocell--mono">
                      {{ formatCurrency(o.total, locale) }}
                    </div>
                    <div class="ec-ocell">
                      <span
                        class="ec-pill"
                        :style="pillStyle(o.tone)"
                      >
                        <span
                          class="ec-pill__dot"
                          :style="{ background: `var(--ds-color-${o.tone})` }"
                        />
                        {{ t[o.statusKey] }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Orders -->
            <div
              v-show="tab === 'orders'"
              class="ec-panel"
            >
              <span class="ec-h">{{ t.sbOrders }}</span>
              <div class="ec-card">
                <div>
                  <div
                    class="ec-orow ec-orow--head"
                  >
                    <div class="ec-ocell">
                      {{ t.colOrder }}
                    </div>
                    <div class="ec-ocell">
                      {{ t.colClient }}
                    </div>
                    <div class="ec-ocell ec-ocell--right">
                      {{ t.colTotal }}
                    </div>
                    <div class="ec-ocell">
                      {{ t.colSituacao }}
                    </div>
                  </div>
                  <div
                    v-for="o in ecomOrders"
                    :key="o.id"
                    class="ec-orow"
                  >
                    <div class="ec-ocell ec-ocell--mono">
                      {{ o.id }}
                    </div>
                    <div class="ec-ocell">
                      {{ o.client }}
                    </div>
                    <div class="ec-ocell ec-ocell--right ec-ocell--mono">
                      {{ formatCurrency(o.total, locale) }}
                    </div>
                    <div class="ec-ocell">
                      <span
                        class="ec-pill"
                        :style="pillStyle(o.tone)"
                      >
                        <span
                          class="ec-pill__dot"
                          :style="{ background: `var(--ds-color-${o.tone})` }"
                        />
                        {{ t[o.statusKey] }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products -->
            <div
              v-show="tab === 'products'"
              class="ec-panel"
            >
              <span class="ec-h">{{ t.sbProducts }}</span>
              <div class="ec-prodgrid">
                <div
                  v-for="p in ecomProducts"
                  :key="p.name"
                  class="ec-prod"
                >
                  <div
                    class="ec-prod__img"
                    :style="{ background: `var(--ds-color-${p.tone}-soft)` }"
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      :stroke="`var(--ds-color-${p.tone}-soft-fg)`"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 7 12 3 4 7l8 4 8-4z" />
                      <path d="M4 7v10l8 4 8-4V7" />
                    </svg>
                  </div>
                  <div class="ec-prod__body">
                    <span class="ec-prod__name">{{ p.name }}</span>
                    <span class="ec-prod__price">{{ formatCurrency(p.price, locale, p.priceDecimals) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stock -->
            <div
              v-show="tab === 'stock'"
              class="ec-panel"
            >
              <span class="ec-h">{{ t.sbStock }}</span>
              <div class="ec-card">
                <div>
                  <div
                    class="ec-srow ec-orow--head"
                  >
                    <div class="ec-ocell">
                      {{ t.colSku }}
                    </div>
                    <div class="ec-ocell">
                      {{ t.sbProducts }}
                    </div>
                    <div class="ec-ocell ec-ocell--right">
                      {{ t.colQty }}
                    </div>
                    <div class="ec-ocell">
                      {{ t.colSituacao }}
                    </div>
                  </div>
                  <div
                    v-for="s in ecomStock"
                    :key="s.sku"
                    class="ec-srow"
                  >
                    <div class="ec-ocell ec-ocell--mono">
                      {{ s.sku }}
                    </div>
                    <div class="ec-ocell">
                      {{ s.name }}
                    </div>
                    <div class="ec-ocell ec-ocell--right ec-ocell--mono">
                      {{ s.qty }}
                    </div>
                    <div class="ec-ocell">
                      <span
                        class="ec-pill"
                        :style="pillStyle(s.tone)"
                      >
                        <span
                          class="ec-pill__dot"
                          :style="{ background: `var(--ds-color-${s.tone})` }"
                        />
                        {{ t[s.labelKey] }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customers -->
            <div
              v-show="tab === 'customers'"
              class="ec-panel"
            >
              <span class="ec-h">{{ t.sbCustomers }}</span>
              <div class="ec-custgrid">
                <div
                  v-for="c in ecomCustomers"
                  :key="c.email"
                  class="ec-cust"
                >
                  <span class="ec-cust__av">{{ c.initials }}</span>
                  <div class="ec-cust__body">
                    <span class="ec-cust__name">{{ c.name }}</span>
                    <span class="ec-cust__email">{{ c.email }}</span>
                  </div>
                  <span class="ec-cust__plan">{{ c.plan }}</span>
                </div>
              </div>
            </div>

            <!-- Reports -->
            <div
              v-show="tab === 'reports'"
              class="ec-panel"
            >
              <span class="ec-h">{{ t.sbReports }}</span>
              <div class="ec-kpis">
                <div
                  v-for="k in ecomReportKpis"
                  :key="k.labelKey"
                  class="ec-kpi"
                >
                  <span class="ec-kpi__label">{{ t[k.labelKey] }}</span>
                  <span class="ec-kpi__value">{{ k.value }}</span>
                  <span class="ec-kpi__delta ec-kpi__delta--ok">{{ k.delta }}</span>
                </div>
              </div>
              <div class="ec-card">
                <div class="ec-reportchart">
                  <span class="ec-reportchart__t">{{ t.dashRevenue }}</span>
                  <div class="ec-bars">
                    <div
                      v-for="(h, i) in ecomReportBars"
                      :key="i"
                      class="ec-bar"
                      :style="{ height: h }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div
              v-show="tab === 'settings'"
              class="ec-panel"
            >
              <span class="ec-h">{{ t.sbSettings }}</span>
              <div class="ec-card">
                <div class="ec-settings">
                  <label class="ec-settings__lbl">{{ t.setStore }}</label>
                  <input
                    class="ec-settings__inp"
                    :value="locale === 'en' ? 'NetShop US' : 'NetShop BR'"
                  >
                  <label class="ec-settings__lbl">{{ t.setCurrency }}</label>
                  <input
                    class="ec-settings__inp"
                    :value="locale === 'en' ? 'USD ($)' : 'BRL (R$)'"
                  >
                  <label class="ec-settings__lbl">{{ t.setTimezone }}</label>
                  <input
                    class="ec-settings__inp ec-settings__inp--mono"
                    :value="locale === 'en' ? 'America/New_York' : 'America/Sao_Paulo'"
                  >
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </template>
  </CatalogScreenFrame>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import CatalogScreenFrame from './CatalogScreenFrame.vue'
import EcomNavIcon from './EcomNavIcon.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  ecomCustomers,
  ecomKpis,
  ecomNav,
  ecomOrders,
  ecomProducts,
  ecomReportBars,
  ecomReportKpis,
  ecomStock,
  formatCurrency,
  formatDeltaPercent,
  formatKpiValue,
  type EcomNavItem,
} from './catalogScreensData'

defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const collapsed = ref(false)
const tab = ref<EcomNavItem['key']>('dashboard')
const nav = ecomNav

function pillStyle(tone: string): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 9px',
    borderRadius: '999px',
    background: `var(--ds-color-${tone}-soft)`,
    color: `var(--ds-color-${tone}-soft-fg)`,
    fontSize: '11.5px',
    fontWeight: 600,
  }
}
</script>

<style scoped>
.ec-shell {
  height: 520px;
  border: var(--ds-border-width) solid var(--ds-color-border-strong);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow);
  background: var(--ds-color-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ec-shell--full {
  height: calc(100vh - 48px);
}

/* Top bar */
.ec-top {
  height: 54px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  background: var(--ds-color-surface);
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
}

.ec-icon {
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  color: var(--ds-color-text-muted);
  border-radius: var(--ds-radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.ec-icon:hover {
  background: var(--ds-color-surface-muted);
  color: var(--ds-color-text);
}

.ec-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.ec-logo {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ds-font-mono);
  font-weight: 700;
  font-size: 13px;
}

.ec-logo__name {
  font-weight: 700;
  font-size: 14px;
}

.ec-search {
  position: relative;
  flex: 1;
  max-width: 360px;
  min-width: 90px;
}

.ec-search__input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 34px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 13px;
  font-family: var(--ds-font-sans);
  outline: none;
}

.ec-search__input:focus {
  border-color: var(--ds-color-primary);
  box-shadow: var(--ds-focus-ring);
}

.ec-search__icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ds-color-text-muted);
  font-size: 14px;
  pointer-events: none;
}

.ec-spacer {
  flex: 1;
}

.ec-topnav {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-text-muted);
}

.ec-topnav__item {
  cursor: pointer;
}

.ec-topnav__item--active {
  color: var(--ds-color-text);
}

.ec-topnav__item:hover {
  color: var(--ds-color-text);
}

.ec-divider {
  width: 1px;
  height: 22px;
  background: var(--ds-color-border);
}

.ec-avatar {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: var(--ds-color-primary-soft);
  color: var(--ntk-on-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex: 0 0 auto;
}

.ec-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

/* Sidebar */
.ec-sidebar {
  width: 212px;
  flex: 0 0 auto;
  background: var(--ds-color-surface);
  border-right: var(--ds-border-width) solid var(--ds-color-border);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  overflow: hidden;
  transition: width 0.16s ease;
}

.ec-sidebar--collapsed {
  width: 54px;
}

.ec-nav {
  display: flex;
  align-items: center;
  gap: 11px;
  height: 38px;
  padding: 0 9px;
  border-radius: var(--ds-radius-md);
  border: none;
  cursor: pointer;
  background: transparent;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-sans);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  width: 100%;
  flex: 0 0 auto;
}

.ec-nav:hover {
  background: var(--ds-color-surface-muted);
  color: var(--ds-color-text);
}

.ec-nav--active {
  background: var(--ds-color-primary-soft);
  color: var(--ntk-on-soft);
}

.ec-nav__icon {
  display: inline-flex;
  flex: 0 0 auto;
}

.ec-nav__icon :deep(svg) {
  flex: 0 0 auto;
}

.ec-nav__label {
  white-space: nowrap;
}

.ec-sidebar--collapsed .ec-nav__label {
  display: none;
}

.ec-navspacer {
  flex: 1;
}

/* Main content */
.ec-main {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 18px;
}

.ec-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ec-h {
  font-size: 16px;
  font-weight: 700;
}

.ec-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.ec-kpi {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ec-kpi__label {
  font-size: 11px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ec-kpi__value {
  font-size: 22px;
  font-weight: 700;
}

.ec-kpi__delta {
  font-size: 11.5px;
  font-weight: 600;
}

.ec-kpi__delta--ok {
  color: var(--ds-color-success);
}

.ec-card {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  overflow: hidden;
}

.ec-card__hd {
  padding: 12px 16px;
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
  font-size: 14px;
  font-weight: 700;
}

.ec-orow {
  display: grid;
  grid-template-columns: 1fr 1.4fr 0.9fr 1fr;
  font-size: 13px;
  border-top: var(--ds-border-width) solid var(--ds-color-border);
}

.ec-srow {
  display: grid;
  grid-template-columns: 0.9fr 1.5fr 0.6fr 1fr;
  font-size: 13px;
  border-top: var(--ds-border-width) solid var(--ds-color-border);
}

.ec-orow--head {
  background: var(--ds-color-surface-muted);
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ds-color-text-muted);
  border-top: none;
}

.ec-ocell {
  padding: 9px 16px;
}

.ec-orow--head .ec-ocell {
  padding: 8px 16px;
}

.ec-ocell--mono {
  font-family: var(--ds-font-mono);
}

.ec-ocell--right {
  text-align: right;
}

.ec-pill__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

/* Products */
.ec-prodgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.ec-prod {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ec-prod__img {
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ec-prod__body {
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ec-prod__name {
  font-size: 13px;
  font-weight: 600;
}

.ec-prod__price {
  font-size: 13px;
  font-family: var(--ds-font-mono);
  color: var(--ds-color-text-muted);
}

/* Customers */
.ec-custgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
}

.ec-cust {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: 13px;
  display: flex;
  align-items: center;
  gap: 11px;
}

.ec-cust__av {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: var(--ds-color-primary-soft);
  color: var(--ntk-on-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex: 0 0 auto;
}

.ec-cust__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.ec-cust__name {
  font-size: 13px;
  font-weight: 600;
}

.ec-cust__email {
  font-size: 11.5px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ec-cust__plan {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--ds-color-text-muted);
}

/* Reports chart */
.ec-reportchart {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ec-reportchart__t {
  font-size: 13px;
  font-weight: 700;
}

.ec-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
}

.ec-bar {
  flex: 1;
  background: var(--ds-color-primary);
  border-radius: 4px 4px 0 0;
}

/* Settings */
.ec-settings {
  padding: 18px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px 16px;
  max-width: 460px;
  align-items: center;
}

.ec-settings__lbl {
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
}

.ec-settings__inp {
  height: 36px;
  padding: 0 11px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 13px;
  font-family: var(--ds-font-sans);
  outline: none;
}

.ec-settings__inp--mono {
  font-family: var(--ds-font-mono);
}
</style>