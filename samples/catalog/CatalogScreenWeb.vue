<template>
  <CatalogScreenFrame
    anchor="web"
    :badge="t.webBadge"
    :title="t.webTitle"
    :desc="t.webDesc"
    :t="t"
  >
    <template #default>
      <!-- DsPage -->
      <div class="wb-page">
        <div class="wb-pagebody">
          <!-- DsPageHeader -->
          <div class="wb-header">
            <div class="wb-header__text">
              <h3 class="wb-title">
                {{ t.baseTitle }}
              </h3>
              <p class="wb-sub">
                {{ t.baseSub }}
              </p>
            </div>
            <button
              type="button"
              class="wb-new"
            >
              <span class="wb-plus">＋</span>{{ t.newClient }}
            </button>
          </div>

          <!-- Filtros -->
          <div class="wb-filters">
            <div class="wb-toprow">
              <div class="wb-search">
                <input
                  v-model="query"
                  :placeholder="t.searchPh"
                  aria-label="Buscar cliente"
                  class="wb-search__input"
                >
                <span
                  class="wb-search__icon"
                  aria-hidden="true"
                >⌕</span>
              </div>
              <span class="wb-count">{{ total }} {{ t.results }}</span>
            </div>
            <div class="wb-tabs">
              <button
                v-for="tab in statusTabs"
                :key="tab.key"
                type="button"
                class="wb-tab"
                :class="{ 'wb-tab--active': status === tab.key }"
                @click="setStatus(tab.key)"
              >
                {{ t[tab.labelKey] }}<span class="wb-tab__n">{{ tab.count }}</span>
              </button>
            </div>
          </div>

          <!-- DsTable -->
          <div class="wb-tablewrap">
            <div class="wb-tablescroll">
              <div
                role="table"
                class="wb-table"
              >
                <div
                  role="row"
                  class="wb-thead"
                >
                  <div
                    role="columnheader"
                    class="wb-th wb-th--sortable"
                    @click="toggleSort('nome')"
                  >
                    {{ t.colClient }} {{ arrow('nome') }}
                  </div>
                  <div
                    role="columnheader"
                    class="wb-th"
                  >
                    {{ t.colDoc }}
                  </div>
                  <div
                    role="columnheader"
                    class="wb-th"
                  >
                    {{ t.colPlan }}
                  </div>
                  <div
                    role="columnheader"
                    class="wb-th wb-th--sortable wb-th--right"
                    @click="toggleSort('valor')"
                  >
                    {{ t.colFee }} {{ arrow('valor') }}
                  </div>
                  <div
                    role="columnheader"
                    class="wb-th"
                  >
                    {{ t.colStatus }}
                  </div>
                  <div
                    role="columnheader"
                    class="wb-th wb-th--sortable"
                    @click="toggleSort('criado')"
                  >
                    {{ t.colCreated }} {{ arrow('criado') }}
                  </div>
                  <div
                    role="columnheader"
                    class="wb-th wb-th--right"
                  >
                    {{ t.colActions }}
                  </div>
                </div>

                <div
                  v-for="c in pageRows"
                  :key="c.id"
                  role="row"
                  class="wb-tr"
                >
                  <div class="wb-cell wb-cell--client">
                    <span class="wb-client__name">{{ c.nome }}</span>
                    <span class="wb-client__email">{{ c.email }}</span>
                  </div>
                  <div class="wb-cell wb-cell--doc">
                    <span class="wb-doc__num">{{ c.doc }}</span>
                    <span class="wb-doc__type">{{ c.tipo }}</span>
                  </div>
                  <div class="wb-cell wb-cell--plan">
                    {{ c.plano }}
                  </div>
                  <div class="wb-cell wb-cell--fee">
                    {{ formatBrl2(c.valor) }}
                  </div>
                  <div class="wb-cell wb-cell--status">
                    <span
                      class="wb-badge"
                      :style="badgeStyle(c.status)"
                    >
                      <span
                        class="wb-dot"
                        :style="{ background: `var(--ds-color-${statusTone[c.status]})` }"
                      />
                      {{ t[statusLabelKey(c.status)] }}
                    </span>
                  </div>
                  <div class="wb-cell wb-cell--created">
                    {{ formatDate2(c.criado) }}
                  </div>
                  <div class="wb-cell wb-cell--actions">
                    <div class="wb-actions">
                      <button
                        type="button"
                        class="wb-act"
                      >
                        {{ t.view }}
                      </button>
                      <button
                        type="button"
                        class="wb-act wb-act--primary"
                      >
                        {{ t.edit }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="isEmpty"
              class="wb-empty"
            >
              <div class="wb-empty__icon">
                ∅
              </div>
              <span class="wb-empty__title">{{ t.emptyTitle }}</span>
              <span class="wb-empty__desc">{{ t.emptyDesc }}</span>
              <button
                type="button"
                class="wb-empty__btn"
                @click="clearFilters"
              >
                {{ t.clearFilters }}
              </button>
            </div>

            <div class="wb-pager">
              <span class="wb-pager__info">{{ t.showing }} {{ showingFrom }}–{{ showingTo }} {{ t.of }} {{ total }}</span>
              <div class="wb-pager__nav">
                <button
                  type="button"
                  class="wb-pgbtn"
                  :disabled="page <= 1"
                  @click="prevPage"
                >
                  {{ t.prev }}
                </button>
                <span class="wb-pager__page">{{ t.page }} {{ page }}/{{ pageCount }}</span>
                <button
                  type="button"
                  class="wb-pgbtn"
                  :disabled="page >= pageCount"
                  @click="nextPage"
                >
                  {{ t.next }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CatalogScreenFrame>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import CatalogScreenFrame from './CatalogScreenFrame.vue'
import type { CatalogStrings } from './catalogI18n'
import {
  customers,
  formatBrl,
  formatDate,
  PAGE_SIZE,
  statusTone,
  type Customer,
  type CustomerStatus,
} from './catalogScreensData'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

type FilterKey = 'todos' | CustomerStatus
type SortKey = 'nome' | 'valor' | 'criado'

const query = ref('')
const status = ref<FilterKey>('todos')
const sortKey = ref<SortKey>('nome')
const sortDir = ref<'asc' | 'desc'>('asc')
const page = ref(1)

const statusLabelByKey: Record<CustomerStatus, string> = {
  active: 'stActive',
  pending: 'stPending',
  inactive: 'stInactive',
  blocked: 'stBlocked',
}
function statusLabelKey(s: CustomerStatus): string {
  return statusLabelByKey[s]
}

const counts = computed(() => {
  const c: Record<FilterKey, number> = { todos: customers.length, active: 0, pending: 0, inactive: 0, blocked: 0 }
  for (const cust of customers) c[cust.status]++
  return c
})

const statusTabs = computed(() => [
  { key: 'todos' as FilterKey, labelKey: 'fTodos', count: counts.value.todos },
  { key: 'active' as FilterKey, labelKey: 'fActive', count: counts.value.active },
  { key: 'pending' as FilterKey, labelKey: 'fPending', count: counts.value.pending },
  { key: 'inactive' as FilterKey, labelKey: 'fInactive', count: counts.value.inactive },
  { key: 'blocked' as FilterKey, labelKey: 'fBlocked', count: counts.value.blocked },
])

const filtered = computed<Customer[]>(() => {
  const q = query.value.trim().toLowerCase()
  return customers.filter((c) => {
    const mq =
      !q ||
      c.nome.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.doc.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    const ms = status.value === 'todos' || c.status === status.value
    return mq && ms
  })
})

const sorted = computed<Customer[]>(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return filtered.value.slice().sort((a, b) => {
    let av: string | number
    let bv: string | number
    if (sortKey.value === 'valor') {
      av = a.valor
      bv = b.valor
    } else if (sortKey.value === 'criado') {
      av = a.criado
      bv = b.criado
    } else {
      av = a.nome.toLowerCase()
      bv = b.nome.toLowerCase()
    }
    return av < bv ? -1 * dir : av > bv ? 1 * dir : 0
  })
})

const total = computed(() => sorted.value.length)
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const clampedPage = computed(() => Math.min(page.value, pageCount.value))
const start = computed(() => (clampedPage.value - 1) * PAGE_SIZE)
const pageRows = computed(() => sorted.value.slice(start.value, start.value + PAGE_SIZE))
const isEmpty = computed(() => total.value === 0)
const showingFrom = computed(() => (total.value === 0 ? 0 : start.value + 1))
const showingTo = computed(() => Math.min(start.value + PAGE_SIZE, total.value))

function setStatus(k: FilterKey): void {
  status.value = k
  page.value = 1
}
function toggleSort(key: SortKey): void {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
  page.value = 1
}
function arrow(key: SortKey): string {
  return sortKey.value === key ? (sortDir.value === 'asc' ? '↑' : '↓') : '↕'
}
function prevPage(): void {
  if (clampedPage.value > 1) page.value = clampedPage.value - 1
}
function nextPage(): void {
  if (clampedPage.value < pageCount.value) page.value = clampedPage.value + 1
}
function clearFilters(): void {
  query.value = ''
  status.value = 'todos'
  page.value = 1
}

function formatBrl2(n: number): string {
  return n ? formatBrl(n, props.locale) : '—'
}
function formatDate2(iso: string): string {
  return formatDate(iso, props.locale)
}
function badgeStyle(s: CustomerStatus): CSSProperties {
  const tone = statusTone[s]
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    borderRadius: 'var(--ds-radius-pill)',
    fontSize: '12px',
    fontWeight: 600,
    background: `var(--ds-color-${tone}-soft)`,
    color: `var(--ds-color-${tone}-soft-fg)`,
  }
}
</script>

<style scoped>
.wb-page {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow);
  overflow: hidden;
}

.wb-pagebody {
  padding: var(--ds-card-padding);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.wb-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.wb-header__text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.wb-title {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.wb-sub {
  margin: 0;
  font-size: 13.5px;
  color: var(--ds-color-text-muted);
}

.wb-new {
  height: var(--ds-control-height);
  padding: 0 16px;
  border-radius: var(--ds-radius-md);
  border: var(--ds-border-width) solid var(--ds-color-primary);
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
  font-family: var(--ds-font-sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}

.wb-new:hover {
  filter: brightness(0.94);
}

.wb-plus {
  font-size: 16px;
  line-height: 1;
}

.wb-filters {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.wb-toprow {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

.wb-search {
  position: relative;
  flex: 1;
  min-width: 230px;
  max-width: 400px;
}

.wb-search__input {
  width: 100%;
  height: var(--ds-control-height);
  padding: 0 14px 0 38px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 14px;
  font-family: var(--ds-font-sans);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.wb-search__input:focus {
  border-color: var(--ds-color-primary);
  box-shadow: var(--ds-focus-ring);
}

.wb-search__icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ds-color-text-muted);
  font-size: 15px;
  pointer-events: none;
}

.wb-count {
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
}

.wb-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  padding: 3px;
  background: var(--ds-color-surface-muted);
  border-radius: var(--ds-radius-pill);
  width: fit-content;
  max-width: 100%;
}

.wb-tab {
  appearance: none;
  border: none;
  border-radius: var(--ds-radius-pill);
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  cursor: pointer;
  line-height: 1;
  white-space: nowrap;
  background: transparent;
  color: var(--ds-color-text-muted);
}

.wb-tab--active {
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
}

.wb-tab__n {
  opacity: 0.6;
  margin-left: 5px;
}

.wb-tab--active .wb-tab__n {
  opacity: 0.85;
}

.wb-tablewrap {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  overflow: hidden;
}

.wb-tablescroll {
  overflow-x: auto;
}

.wb-table {
  min-width: 926px;
  font-size: 13.5px;
}

.wb-thead,
.wb-tr {
  display: grid;
  grid-template-columns: minmax(190px, 2fr) minmax(150px, 1.4fr) 92px minmax(108px, 1.1fr) 122px 104px 160px;
  align-items: center;
  min-height: var(--ds-table-row-height);
}

.wb-thead {
  background: var(--ds-color-surface-muted);
}

.wb-tr {
  border-top: var(--ds-border-width) solid var(--ds-color-border);
}

.wb-tr:hover {
  background: var(--ds-color-surface-muted);
}

.wb-th {
  padding: 0 16px;
  font-weight: 600;
  color: var(--ds-color-text-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.wb-th--sortable {
  cursor: pointer;
  user-select: none;
}

.wb-th--right {
  text-align: right;
}

.wb-cell {
  padding: 8px 16px;
  min-width: 0;
}

.wb-cell--client {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.wb-client__name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wb-client__email {
  font-size: 12px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wb-cell--doc {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-family: var(--ds-font-mono);
  white-space: nowrap;
}

.wb-doc__num {
  font-size: 12.5px;
  color: var(--ds-color-text);
}

.wb-doc__type {
  font-size: 10px;
  color: var(--ds-color-text-muted);
}

.wb-cell--plan {
  white-space: nowrap;
}

.wb-cell--fee {
  text-align: right;
  font-family: var(--ds-font-mono);
  white-space: nowrap;
}

.wb-cell--created {
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
  font-size: 12.5px;
  white-space: nowrap;
}

.wb-cell--actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
}

.wb-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  flex: 0 0 auto;
}

.wb-actions {
  display: inline-flex;
  gap: 6px;
  flex: 0 0 auto;
}

.wb-act {
  height: 30px;
  padding: 0 11px;
  border-radius: var(--ds-radius-sm);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  cursor: pointer;
}

.wb-act:hover {
  background: var(--ds-color-surface-muted);
}

.wb-act--primary {
  border-color: transparent;
  background: var(--ds-color-primary-soft);
  color: var(--ntk-on-soft);
}

.wb-act--primary:hover {
  filter: brightness(0.97);
}

.wb-empty {
  padding: 44px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
}

.wb-empty__icon {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: var(--ds-color-surface-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ds-font-mono);
  color: var(--ds-color-text-muted);
  font-size: 20px;
}

.wb-empty__title {
  font-weight: 600;
  font-size: 15px;
}

.wb-empty__desc {
  font-size: 13px;
  color: var(--ds-color-text-muted);
  max-width: 42ch;
  line-height: 1.5;
}

.wb-empty__btn {
  margin-top: 4px;
  height: 36px;
  padding: 0 16px;
  border-radius: var(--ds-radius-md);
  border: var(--ds-border-width) solid transparent;
  background: var(--ds-color-primary-soft);
  color: var(--ntk-on-soft);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  cursor: pointer;
}

.wb-pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 16px;
  border-top: var(--ds-border-width) solid var(--ds-color-border);
  flex-wrap: wrap;
  background: var(--ds-color-surface);
}

.wb-pager__info,
.wb-pager__page {
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
}

.wb-pager__nav {
  display: flex;
  align-items: center;
  gap: 9px;
}

.wb-pgbtn {
  height: 32px;
  padding: 0 12px;
  border-radius: var(--ds-radius-sm);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--ds-font-sans);
  cursor: pointer;
}

.wb-pgbtn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>