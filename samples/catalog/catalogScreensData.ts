/**
 * Static data for the EXAMPLE SCREENS (Login / Web / E-commerce / Dashboards).
 *
 * Values mirror the reference standalone catalog 1:1 (customer rows, KPI
 * figures, order/product/stock data and the deterministically-seeded chart
 * arrays). Colors are authored against the reference `--ds-color-*` token
 * bridge (see src/styles/reference-themes.css) so the screens re-resolve live
 * when theme / brand / density change.
 */
import type { CSSProperties } from 'vue'
import type { CatalogLocale } from './useCatalogShell'

/* ============================================================
 * Web · Base de clientes
 * ============================================================ */
export type CustomerStatus = 'active' | 'pending' | 'inactive' | 'blocked'

export interface Customer {
  readonly id: string
  readonly nome: string
  readonly email: string
  readonly doc: string
  readonly tipo: 'CPF' | 'CNPJ'
  readonly plano: string
  readonly valor: number
  readonly status: CustomerStatus
  readonly criado: string
}

/** The 14 reference customer rows (verbatim from the standalone). */
export const customers: readonly Customer[] = [
  { id: 'C-1042', nome: 'Mariana Alves', email: 'mariana.alves@empresa.com.br', doc: '182.443.901-07', tipo: 'CPF', plano: 'Pro', valor: 149.9, status: 'active', criado: '2025-11-03' },
  { id: 'C-1043', nome: 'Diego Fontes', email: 'diego@fonteslog.com', doc: '12.345.678/0001-90', tipo: 'CNPJ', plano: 'Enterprise', valor: 1290, status: 'active', criado: '2025-09-21' },
  { id: 'C-1044', nome: 'Bianca Souza', email: 'bianca.souza@gmail.com', doc: '305.118.762-44', tipo: 'CPF', plano: 'Starter', valor: 49.9, status: 'pending', criado: '2026-01-12' },
  { id: 'C-1045', nome: 'Rafael Lima', email: 'rafael.lima@nuvemtec.com.br', doc: '98.765.432/0001-10', tipo: 'CNPJ', plano: 'Pro', valor: 149.9, status: 'active', criado: '2025-08-07' },
  { id: 'C-1046', nome: 'Helena Castro', email: 'helena.castro@outlook.com', doc: '221.554.388-19', tipo: 'CPF', plano: 'Free', valor: 0, status: 'inactive', criado: '2025-06-30' },
  { id: 'C-1047', nome: 'Otávio Pires', email: 'otavio@pirescomex.com.br', doc: '45.221.876/0001-55', tipo: 'CNPJ', plano: 'Enterprise', valor: 1290, status: 'blocked', criado: '2025-12-18' },
  { id: 'C-1048', nome: 'Camila Nunes', email: 'camila.nunes@empresa.com.br', doc: '677.903.215-88', tipo: 'CPF', plano: 'Pro', valor: 149.9, status: 'active', criado: '2026-02-02' },
  { id: 'C-1049', nome: 'Vinícius Rocha', email: 'vinicius@rochadev.io', doc: '334.872.109-50', tipo: 'CPF', plano: 'Starter', valor: 49.9, status: 'pending', criado: '2026-03-15' },
  { id: 'C-1050', nome: 'Letícia Barros', email: 'leticia.barros@portalx.com', doc: '58.119.430/0001-72', tipo: 'CNPJ', plano: 'Pro', valor: 149.9, status: 'active', criado: '2025-10-09' },
  { id: 'C-1051', nome: 'Gustavo Reis', email: 'gustavo.reis@gmail.com', doc: '412.665.998-30', tipo: 'CPF', plano: 'Free', valor: 0, status: 'inactive', criado: '2025-05-22' },
  { id: 'C-1052', nome: 'Patrícia Gomes', email: 'patricia@gomeslog.com.br', doc: '09.872.551/0001-04', tipo: 'CNPJ', plano: 'Enterprise', valor: 1290, status: 'active', criado: '2025-07-14' },
  { id: 'C-1053', nome: 'André Tavares', email: 'andre.tavares@empresa.com.br', doc: '751.224.063-92', tipo: 'CPF', plano: 'Pro', valor: 149.9, status: 'blocked', criado: '2026-01-28' },
  { id: 'C-1054', nome: 'Júlia Mendes', email: 'julia.mendes@startup.dev', doc: '88.443.220/0001-61', tipo: 'CNPJ', plano: 'Starter', valor: 49.9, status: 'pending', criado: '2026-04-05' },
  { id: 'C-1055', nome: 'Felipe Cardoso', email: 'felipe.cardoso@gmail.com', doc: '520.337.114-06', tipo: 'CPF', plano: 'Pro', valor: 149.9, status: 'active', criado: '2025-11-30' },
]

/** Maps a customer status to its DsBadge tone (reference statusMeta). */
export const statusTone: Record<CustomerStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
  active: 'success',
  pending: 'warning',
  inactive: 'neutral',
  blocked: 'danger',
}

export const PAGE_SIZE = 6

export function formatBrl(n: number, locale: CatalogLocale): string {
  try {
    return Number(n).toLocaleString(locale === 'en' ? 'en-US' : 'pt-BR', {
      style: 'currency',
      currency: locale === 'en' ? 'USD' : 'BRL',
    })
  } catch {
    return `R$ ${n}`
  }
}

export function formatDate(iso: string, locale: CatalogLocale): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR')
  } catch {
    return iso
  }
}

/** BCP-47 tag for the catalog locale (drives every Intl formatter below). */
function intlTag(locale: CatalogLocale): string {
  return locale === 'en' ? 'en-US' : 'pt-BR'
}

/**
 * Locale-aware currency (BRL `R$` in pt-BR, USD `$` in en-US). When the source
 * figure was authored in BRL, the en-US view is shown in USD at parity so the
 * symbol and grouping localize exactly like the reference. `fractionDigits`
 * controls min/max decimals (e.g. 2 for "R$ 99,90", 0 for "R$ 1.290").
 */
export function formatCurrency(n: number, locale: CatalogLocale, fractionDigits = 2): string {
  try {
    return new Intl.NumberFormat(intlTag(locale), {
      style: 'currency',
      currency: locale === 'en' ? 'USD' : 'BRL',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(n)
  } catch {
    return `R$ ${n}`
  }
}

/** Locale-aware compact currency (e.g. "R$ 128,4 mil" / "$128.4K"). */
export function formatCurrencyCompact(n: number, locale: CatalogLocale): string {
  try {
    return new Intl.NumberFormat(intlTag(locale), {
      style: 'currency',
      currency: locale === 'en' ? 'USD' : 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(n)
  } catch {
    return `R$ ${n}`
  }
}

/** Locale-aware integer with grouping (e.g. "1.284" / "1,284"). */
export function formatInt(n: number, locale: CatalogLocale): string {
  try {
    return new Intl.NumberFormat(intlTag(locale)).format(n)
  } catch {
    return String(n)
  }
}

/** Locale-aware percent from a 0–100 figure (e.g. "3,8%" / "3.8%"). */
export function formatPercent(pct: number, locale: CatalogLocale, fractionDigits = 1): string {
  try {
    return new Intl.NumberFormat(intlTag(locale), {
      style: 'percent',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(pct / 100)
  } catch {
    return `${pct}%`
  }
}

/** Locale-aware signed delta percent in points (e.g. "↑ 12,4%" / "↑ 12.4%"). */
export function formatDeltaPercent(pct: number, locale: CatalogLocale): string {
  const arrow = pct >= 0 ? '↑' : '↓'
  return `${arrow} ${formatPercent(Math.abs(pct), locale)}`
}

/* ============================================================
 * E-commerce · KPIs / orders / products / stock / customers
 * ============================================================ */
/** How a KPI's numeric `value` is rendered per locale (Intl-driven). */
export type KpiFormat = 'currencyCompact' | 'int' | 'currency' | 'percent'

export interface Kpi {
  readonly key: string
  readonly value: number
  readonly format: KpiFormat
  /** Signed delta in percentage points (formatted per locale at render). */
  readonly delta: number
  readonly tone: 'success' | 'danger'
}

export const ecomKpis: readonly Kpi[] = [
  { key: 'kpiRevenue', value: 128400, format: 'currencyCompact', delta: 12.4, tone: 'success' },
  { key: 'kpiOrders', value: 1284, format: 'int', delta: 4.1, tone: 'success' },
  { key: 'kpiTicket', value: 99.9, format: 'currency', delta: -1.2, tone: 'danger' },
  { key: 'kpiConv', value: 3.8, format: 'percent', delta: 0.3, tone: 'success' },
]

/** Renders a KPI numeric value with the right Intl formatter for its `format`. */
export function formatKpiValue(kpi: Kpi, locale: CatalogLocale): string {
  switch (kpi.format) {
    case 'currencyCompact':
      return formatCurrencyCompact(kpi.value, locale)
    case 'int':
      return formatInt(kpi.value, locale)
    case 'currency':
      return formatCurrency(kpi.value, locale)
    case 'percent':
      return formatPercent(kpi.value, locale)
    default:
      return String(kpi.value)
  }
}

export type OrderStatusTone = 'success' | 'warning' | 'info' | 'danger'

export interface OrderRow {
  readonly id: string
  readonly client: string
  /** Order total in BRL; rendered as locale currency at display time. */
  readonly total: number
  readonly statusKey: string
  readonly tone: OrderStatusTone
}

/** Reference "Pedidos recentes" rows (Dashboard tab shows the first three). */
export const ecomOrders: readonly OrderRow[] = [
  { id: '#10482', client: 'Mariana Alves', total: 249.8, statusKey: 'stActive', tone: 'success' },
  { id: '#10481', client: 'Diego Fontes', total: 1290, statusKey: 'stPending', tone: 'warning' },
  { id: '#10480', client: 'Bianca Souza', total: 89.9, statusKey: 'mTop2', tone: 'info' },
  { id: '#10479', client: 'Rafael Lima', total: 149.9, statusKey: 'stActive', tone: 'success' },
  { id: '#10478', client: 'Helena Castro', total: 59.9, statusKey: 'stBlocked', tone: 'danger' },
  { id: '#10477', client: 'Otávio Pires', total: 2580, statusKey: 'stActive', tone: 'success' },
]

export interface ProductCard {
  readonly name: string
  /** Catalog price in BRL; rendered as locale currency at display time. */
  readonly price: number
  /** Whole-currency prices render with 0 decimals (e.g. "R$ 1.290" / "$1,290"). */
  readonly priceDecimals: 0 | 2
  readonly tone: 'primary' | 'info' | 'success' | 'warning' | 'danger'
}

export const ecomProducts: readonly ProductCard[] = [
  { name: 'Switch 24p', price: 1290, priceDecimals: 0, tone: 'primary' },
  { name: 'Roteador X2', price: 890, priceDecimals: 0, tone: 'info' },
  { name: 'Patch Cord', price: 19.9, priceDecimals: 2, tone: 'success' },
  { name: 'Rack 12U', price: 740, priceDecimals: 0, tone: 'warning' },
  { name: 'Sensor IoT', price: 320, priceDecimals: 0, tone: 'danger' },
  { name: 'Gateway LTE', price: 1150, priceDecimals: 0, tone: 'primary' },
]

export interface StockRow {
  readonly sku: string
  readonly name: string
  readonly qty: string
  /** i18n key for the stock-status pill (resolved against the active locale). */
  readonly labelKey: string
  readonly tone: 'success' | 'warning' | 'danger'
}

export const ecomStock: readonly StockRow[] = [
  { sku: 'SW-24', name: 'Switch 24p', qty: '128', labelKey: 'stockOk', tone: 'success' },
  { sku: 'RT-X2', name: 'Roteador X2', qty: '12', labelKey: 'stockLow', tone: 'warning' },
  { sku: 'PC-01', name: 'Patch Cord', qty: '0', labelKey: 'stockOut', tone: 'danger' },
  { sku: 'RK-12', name: 'Rack 12U', qty: '34', labelKey: 'stockOk', tone: 'success' },
  { sku: 'SN-IO', name: 'Sensor IoT', qty: '7', labelKey: 'stockLow', tone: 'warning' },
]

export interface EcomCustomer {
  readonly initials: string
  readonly name: string
  readonly email: string
  readonly plan: string
}

export const ecomCustomers: readonly EcomCustomer[] = [
  { initials: 'MA', name: 'Mariana Alves', email: 'mariana@empresa.com.br', plan: 'Pro' },
  { initials: 'DF', name: 'Diego Fontes', email: 'diego@fonteslog.com', plan: 'Enterprise' },
  { initials: 'BS', name: 'Bianca Souza', email: 'bianca@gmail.com', plan: 'Starter' },
  { initials: 'RL', name: 'Rafael Lima', email: 'rafael@nuvemtec.com.br', plan: 'Pro' },
  { initials: 'HC', name: 'Helena Castro', email: 'helena@outlook.com', plan: 'Free' },
  { initials: 'OP', name: 'Otávio Pires', email: 'otavio@pirescomex.com.br', plan: 'Enterprise' },
]

export interface ReportKpi {
  /** i18n key for the report KPI label (resolved against the active locale). */
  readonly labelKey: string
  readonly value: string
  readonly delta: string
}

export const ecomReportKpis: readonly ReportKpi[] = [
  { labelKey: 'rptNps', value: '72', delta: '↑ 5' },
  { labelKey: 'rptSla', value: '98,4%', delta: '↑ 0,6pp' },
  { labelKey: 'rptReturns', value: '2,1%', delta: '↓ 0,3pp' },
]

/** Mini bar chart heights (%) inside the Relatórios tab. */
export const ecomReportBars: readonly string[] = ['40%', '62%', '55%', '70%', '82%', '75%', '90%']

export interface EcomNavItem {
  readonly key: 'dashboard' | 'orders' | 'products' | 'stock' | 'customers' | 'reports' | 'settings'
  readonly labelKey: string
}

/** Sidebar nav (settings pinned to the bottom). */
export const ecomNav: readonly EcomNavItem[] = [
  { key: 'dashboard', labelKey: 'sbDashboard' },
  { key: 'orders', labelKey: 'sbOrders' },
  { key: 'products', labelKey: 'sbProducts' },
  { key: 'stock', labelKey: 'sbStock' },
  { key: 'customers', labelKey: 'sbCustomers' },
  { key: 'reports', labelKey: 'sbReports' },
]

/* ============================================================
 * Dashboards · charts (deterministic, seeded exactly as the reference)
 * ============================================================ */
export interface DashKpi {
  /** i18n key for the KPI label (resolved against the active locale). */
  readonly labelKey: string
  readonly value: number
  readonly format: KpiFormat
  /** Signed delta in percentage points (formatted per locale at render). */
  readonly delta: number
  readonly tone: 'success' | 'danger'
}

export const dashKpis: readonly DashKpi[] = [
  { labelKey: 'kpiSessions', value: 84200, format: 'int', delta: 9.1, tone: 'success' },
  { labelKey: 'kpiRevenue', value: 1200000, format: 'currencyCompact', delta: 6.7, tone: 'success' },
  { labelKey: 'kpiConv', value: 4.3, format: 'percent', delta: 0.4, tone: 'success' },
  { labelKey: 'kpiChurn', value: 1.9, format: 'percent', delta: 0.2, tone: 'danger' },
]

/** Renders a dashboard KPI numeric value with the right Intl formatter. */
export function formatDashKpiValue(kpi: DashKpi, locale: CatalogLocale): string {
  switch (kpi.format) {
    case 'currencyCompact':
      return formatCurrencyCompact(kpi.value, locale)
    case 'int':
      return formatInt(kpi.value, locale)
    case 'currency':
      return formatCurrency(kpi.value, locale)
    case 'percent':
      return formatPercent(kpi.value, locale)
    default:
      return String(kpi.value)
  }
}

/** color-mix(in srgb, primary PCT%, surface) — re-resolves with theme/brand. */
function mix(pct: number): string {
  return `color-mix(in srgb, var(--ds-color-primary) ${pct}%, var(--ds-color-surface))`
}

/**
 * Heat-cell text color picker (WCAG AA). The cell background is `mix(pct)` — a
 * light wash of the brand for low pct, deepening as pct rises. White
 * (`--ds-color-primary-contrast`) only clears 4.5:1 once the wash is dark enough
 * (~74% of the purple brand); below that the dark on-surface text is readable.
 * The threshold sits at 74 so neither branch is ever under-contrasted.
 * (Matrix cells never land in 53–73, so the simple split is safe there.)
 */
const HEAT_WHITE_TEXT_MIN = 74
function heatTextColor(pct: number, lightVar: string): string {
  return pct >= HEAT_WHITE_TEXT_MIN ? 'var(--ds-color-primary-contrast)' : lightVar
}

/**
 * Region map cells carry a numeric label that can land anywhere in 18–87,
 * including the 53–73 "dead zone" where neither white nor the dark on-surface
 * text clears 4.5:1 against `mix(pct)`. To keep both the label value AND AA
 * contrast, cells from 66% up render white text on a background floored to
 * `HEAT_WHITE_TEXT_MIN` (a sub-perceptible deepening of the wash), so white
 * always clears; lighter cells keep the dark text on their exact wash.
 */
function regionFill(pct: number): { background: string; color: string } {
  if (pct >= 66) {
    return {
      background: mix(Math.max(pct, HEAT_WHITE_TEXT_MIN)),
      color: 'var(--ds-color-primary-contrast)',
    }
  }
  return { background: mix(pct), color: 'var(--ds-color-text)' }
}

/**
 * Reference LCG used to seed the heatmap and region map. Reproduced verbatim
 * so the rendered cells are pixel-identical to the standalone. Heat consumes
 * the first 60 draws; the region map consumes the next 12.
 */
function seededValues(): { heat: number[]; region: number[] } {
  let s = 7
  const rnd = (): number => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const heat: number[] = []
  for (let i = 0; i < 60; i++) heat.push(6 + Math.floor(rnd() * 86))
  const region: number[] = []
  for (let i = 0; i < 12; i++) region.push(18 + Math.floor(rnd() * 70))
  return { heat, region }
}

const seeded = seededValues()

export interface DashBar {
  readonly h: string
  readonly label: string
}

export const dashBars: readonly DashBar[] = [42, 58, 51, 67, 73, 62, 80, 76, 88, 71, 94, 85].map((h, i) => ({
  h: `${h}%`,
  label: String(i + 1),
}))

export interface DashCell {
  readonly style: CSSProperties
}

export const dashHeat: readonly DashCell[] = seeded.heat.map((pct) => ({
  style: { background: mix(pct), borderRadius: '3px', aspectRatio: '1' },
}))

export interface DashDonutSlice {
  /** i18n key for the legend label (resolved against the active locale). */
  readonly labelKey: string
  readonly pct: string
  readonly tone: 'primary' | 'info' | 'success' | 'warning'
}

/** Distribuição donut legend (conic stops: 44 / 68 / 86 / 100). */
export const dashDonut: readonly DashDonutSlice[] = [
  { labelKey: 'donutDirect', pct: '44%', tone: 'primary' },
  { labelKey: 'donutOrganic', pct: '24%', tone: 'info' },
  { labelKey: 'donutSocial', pct: '18%', tone: 'success' },
  { labelKey: 'donutPaid', pct: '14%', tone: 'warning' },
]

export interface DashRegion {
  /** i18n key for the region name (resolved against the active locale). */
  readonly nameKey: string
  readonly pct: string
  readonly style: CSSProperties
}

const regionNameKeys = [
  'regNorth', 'regNortheast', 'regCenter', 'regSoutheast', 'regSouth', 'regWest',
  'regEast', 'regCoast', 'regHighland', 'regValley', 'regPlateau', 'regCapital',
]

export const dashRegions: readonly DashRegion[] = regionNameKeys.map((nameKey, i) => {
  const pct = seeded.region[i]
  const fill = regionFill(pct)
  return {
    nameKey,
    pct: `${pct}%`,
    style: {
      background: fill.background,
      borderRadius: 'var(--ds-radius-md)',
      padding: '12px',
      minHeight: '62px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: fill.color,
      border: 'var(--ds-border-width) solid var(--ds-color-border)',
    },
  }
})

export interface DashMatrixCell {
  readonly val: string
  readonly style: CSSProperties
}

export const dashMatrix: readonly { cells: DashMatrixCell[] }[] = (() => {
  const out: { cells: DashMatrixCell[] }[] = []
  for (let r = 0; r < 5; r++) {
    const cells: DashMatrixCell[] = []
    for (let c = 0; c < 5; c++) {
      const v = r === c ? 78 + r * 4 : Math.max(3, 16 - Math.abs(r - c) * 4)
      cells.push({
        val: `${v}%`,
        style: {
          background: mix(v),
          color: heatTextColor(v, 'var(--ds-color-text-muted)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '38px',
          fontSize: '11px',
          fontFamily: 'var(--ds-font-mono)',
          fontWeight: 600,
          borderRadius: '4px',
        },
      })
    }
    out.push({ cells })
  }
  return out
})()

/* ============================================================
 * Fluxo / BPM · N8N-style node editor
 * ------------------------------------------------------------
 * Node positions / labels / connections mirror the reference's BPM canvas.
 * Each node "kind" carries a semantic `--ds-color-*` tone so the colored chip,
 * the left accent and the connectors re-resolve live with theme / brand.
 * ============================================================ */
export type FlowKind = 'start' | 'task' | 'gateway' | 'end' | 'event'

/** Maps a node kind to its semantic tone token suffix (`--ds-color-<tone>`). */
export const flowKindTone: Record<FlowKind, 'success' | 'primary' | 'warning' | 'danger' | 'info'> = {
  start: 'success',
  task: 'primary',
  gateway: 'warning',
  end: 'danger',
  event: 'info',
}

export interface FlowNodeSeed {
  readonly id: string
  readonly kind: FlowKind
  /** i18n key for the bold node title. */
  readonly titleKey: string
  readonly x: number
  readonly y: number
}

/** Reference BPM nodes (verbatim layout from the reference canvas). */
export const flowNodes: readonly FlowNodeSeed[] = [
  { id: 'n-start', kind: 'start', titleKey: 'bpmStart', x: 30, y: 118 },
  { id: 'n-receive', kind: 'task', titleKey: 'bpmReceive', x: 240, y: 118 },
  { id: 'n-approve', kind: 'gateway', titleKey: 'bpmApprove', x: 460, y: 118 },
  { id: 'n-invoice', kind: 'task', titleKey: 'bpmInvoice', x: 700, y: 30 },
  { id: 'n-review', kind: 'task', titleKey: 'bpmReview', x: 700, y: 206 },
  { id: 'n-end', kind: 'end', titleKey: 'bpmEnd', x: 930, y: 118 },
]

export interface FlowEdgeSeed {
  readonly from: string
  readonly to: string
}

/** Reference BPM connections (curved bezier links with arrowheads). */
export const flowEdges: readonly FlowEdgeSeed[] = [
  { from: 'n-start', to: 'n-receive' },
  { from: 'n-receive', to: 'n-approve' },
  { from: 'n-approve', to: 'n-invoice' },
  { from: 'n-approve', to: 'n-review' },
  { from: 'n-invoice', to: 'n-end' },
  { from: 'n-review', to: 'n-end' },
]

/** Left "Componentes" palette (one entry per node kind). */
export interface FlowPaletteItem {
  readonly kind: FlowKind
  readonly labelKey: string
}

export const flowPalette: readonly FlowPaletteItem[] = [
  { kind: 'start', labelKey: 'bpmStart' },
  { kind: 'task', labelKey: 'bpmTask' },
  { kind: 'gateway', labelKey: 'bpmGateway' },
  { kind: 'end', labelKey: 'bpmEnd' },
  { kind: 'event', labelKey: 'bpmEvent' },
]