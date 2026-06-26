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

/* ============================================================
 * E-commerce · KPIs / orders / products / stock / customers
 * ============================================================ */
export interface Kpi {
  readonly key: string
  readonly value: string
  readonly delta: string
  readonly tone: 'success' | 'danger'
}

export const ecomKpis: readonly Kpi[] = [
  { key: 'kpiRevenue', value: 'R$ 128,4k', delta: '↑ 12,4%', tone: 'success' },
  { key: 'kpiOrders', value: '1.284', delta: '↑ 4,1%', tone: 'success' },
  { key: 'kpiTicket', value: 'R$ 99,90', delta: '↓ 1,2%', tone: 'danger' },
  { key: 'kpiConv', value: '3,8%', delta: '↑ 0,3pp', tone: 'success' },
]

export type OrderStatusTone = 'success' | 'warning' | 'info' | 'danger'

export interface OrderRow {
  readonly id: string
  readonly client: string
  readonly total: string
  readonly statusKey: string
  readonly tone: OrderStatusTone
}

/** Reference "Pedidos recentes" rows (Dashboard tab shows the first three). */
export const ecomOrders: readonly OrderRow[] = [
  { id: '#10482', client: 'Mariana Alves', total: 'R$ 249,80', statusKey: 'stActive', tone: 'success' },
  { id: '#10481', client: 'Diego Fontes', total: 'R$ 1.290,00', statusKey: 'stPending', tone: 'warning' },
  { id: '#10480', client: 'Bianca Souza', total: 'R$ 89,90', statusKey: 'mTop2', tone: 'info' },
  { id: '#10479', client: 'Rafael Lima', total: 'R$ 149,90', statusKey: 'stActive', tone: 'success' },
  { id: '#10478', client: 'Helena Castro', total: 'R$ 59,90', statusKey: 'stBlocked', tone: 'danger' },
  { id: '#10477', client: 'Otávio Pires', total: 'R$ 2.580,00', statusKey: 'stActive', tone: 'success' },
]

export interface ProductCard {
  readonly name: string
  readonly price: string
  readonly tone: 'primary' | 'info' | 'success' | 'warning' | 'danger'
}

export const ecomProducts: readonly ProductCard[] = [
  { name: 'Switch 24p', price: 'R$ 1.290', tone: 'primary' },
  { name: 'Roteador X2', price: 'R$ 890', tone: 'info' },
  { name: 'Patch Cord', price: 'R$ 19,90', tone: 'success' },
  { name: 'Rack 12U', price: 'R$ 740', tone: 'warning' },
  { name: 'Sensor IoT', price: 'R$ 320', tone: 'danger' },
  { name: 'Gateway LTE', price: 'R$ 1.150', tone: 'primary' },
]

export interface StockRow {
  readonly sku: string
  readonly name: string
  readonly qty: string
  readonly label: string
  readonly tone: 'success' | 'warning' | 'danger'
}

export const ecomStock: readonly StockRow[] = [
  { sku: 'SW-24', name: 'Switch 24p', qty: '128', label: 'OK', tone: 'success' },
  { sku: 'RT-X2', name: 'Roteador X2', qty: '12', label: 'Baixo', tone: 'warning' },
  { sku: 'PC-01', name: 'Patch Cord', qty: '0', label: 'Zerado', tone: 'danger' },
  { sku: 'RK-12', name: 'Rack 12U', qty: '34', label: 'OK', tone: 'success' },
  { sku: 'SN-IO', name: 'Sensor IoT', qty: '7', label: 'Baixo', tone: 'warning' },
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
  readonly label: string
  readonly value: string
  readonly delta: string
}

export const ecomReportKpis: readonly ReportKpi[] = [
  { label: 'NPS', value: '72', delta: '↑ 5' },
  { label: 'SLA', value: '98,4%', delta: '↑ 0,6pp' },
  { label: 'Devoluções', value: '2,1%', delta: '↓ 0,3pp' },
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
  readonly label: string
  readonly value: string
  readonly delta: string
  readonly tone: 'success' | 'danger'
}

export const dashKpis: readonly DashKpi[] = [
  { label: 'Sessões', value: '84.2k', delta: '↑ 9,1%', tone: 'success' },
  { label: 'kpiRevenue', value: 'R$ 1,2M', delta: '↑ 6,7%', tone: 'success' },
  { label: 'kpiConv', value: '4,3%', delta: '↑ 0,4pp', tone: 'success' },
  { label: 'Churn', value: '1,9%', delta: '↑ 0,2pp', tone: 'danger' },
]

/** color-mix(in srgb, primary PCT%, surface) — re-resolves with theme/brand. */
function mix(pct: number): string {
  return `color-mix(in srgb, var(--ds-color-primary) ${pct}%, var(--ds-color-surface))`
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
  readonly label: string
  readonly pct: string
  readonly tone: 'primary' | 'info' | 'success' | 'warning'
}

/** Distribuição donut legend (conic stops: 44 / 68 / 86 / 100). */
export const dashDonut: readonly DashDonutSlice[] = [
  { label: 'Direto', pct: '44%', tone: 'primary' },
  { label: 'Orgânico', pct: '24%', tone: 'info' },
  { label: 'Social', pct: '18%', tone: 'success' },
  { label: 'Pago', pct: '14%', tone: 'warning' },
]

export interface DashRegion {
  readonly name: string
  readonly pct: string
  readonly style: CSSProperties
}

const regionNames = ['Norte', 'Nordeste', 'Centro', 'Sudeste', 'Sul', 'Oeste', 'Leste', 'Litoral', 'Serra', 'Vale', 'Planalto', 'Capital']

export const dashRegions: readonly DashRegion[] = regionNames.map((name, i) => {
  const pct = seeded.region[i]
  return {
    name,
    pct: `${pct}%`,
    style: {
      background: mix(pct),
      borderRadius: 'var(--ds-radius-md)',
      padding: '12px',
      minHeight: '62px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: pct > 52 ? 'var(--ds-color-primary-contrast)' : 'var(--ds-color-text)',
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
          color: v > 52 ? 'var(--ds-color-primary-contrast)' : 'var(--ds-color-text-muted)',
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