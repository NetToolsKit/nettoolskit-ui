/**
 * Catalog shell state: theme/brand/density/font controls + locale + TOC model.
 *
 * The reference catalog drives the SAME `--ntk-*` tokens the rest of the
 * library reads, by toggling `data-*` attributes on <html> and writing a small
 * set of inline overrides for the live brand-color picker. Keeping this in one
 * composable lets the shell sub-components stay presentational.
 */
import { computed, reactive, readonly } from 'vue'

export type CatalogTheme = 'light' | 'dark' | 'hc'
export type CatalogDensity = 'compact' | 'comfortable' | 'spacious'
export type CatalogLocale = 'pt' | 'en'

export interface CatalogFont {
  readonly id: string
  readonly label: string
  readonly stack: string
}

export interface CatalogSwatch {
  readonly id: string
  readonly hex: string
}

export interface CatalogTocItem {
  readonly id: string
  readonly anchor: string
  readonly labelKey: string
}

export interface CatalogTocGroup {
  readonly id: string
  readonly labelKey: string
  readonly items: readonly CatalogTocItem[]
}

/** The 12 brand swatches from the reference MARCA palette. */
export const catalogSwatches: readonly CatalogSwatch[] = [
  { id: 'purple', hex: '#4f26db' },
  { id: 'violet', hex: '#7c3aed' },
  { id: 'blue', hex: '#2563eb' },
  { id: 'sky', hex: '#0ea5e9' },
  { id: 'teal', hex: '#0d9488' },
  { id: 'green', hex: '#16a34a' },
  { id: 'olive', hex: '#65a30d' },
  { id: 'amber', hex: '#d97706' },
  { id: 'orange', hex: '#ea580c' },
  { id: 'red', hex: '#dc2626' },
  { id: 'pink', hex: '#db2777' },
  { id: 'slate', hex: '#475569' },
]

/** FONTE dropdown families; each rendered in its own stack in the menu. */
export const catalogFonts: readonly CatalogFont[] = [
  { id: 'plex', label: 'IBM Plex Sans', stack: '"IBM Plex Sans", system-ui, sans-serif' },
  { id: 'manrope', label: 'Manrope', stack: '"Manrope", system-ui, sans-serif' },
  { id: 'source', label: 'Source Sans 3', stack: '"Source Sans 3", system-ui, sans-serif' },
  { id: 'franklin', label: 'Libre Franklin', stack: '"Libre Franklin", system-ui, sans-serif' },
]

/** Left TOC model — anchors resolve to the section stubs rendered in CatalogApp. */
export const catalogToc: readonly CatalogTocGroup[] = [
  {
    id: 'overview',
    labelKey: 'tocOverview',
    items: [{ id: 'intro', anchor: 'topo', labelKey: 'navIntro' }],
  },
  {
    id: 'screens',
    labelKey: 'navExamples',
    items: [
      { id: 'login', anchor: 'login', labelKey: 'navLogin' },
      { id: 'web', anchor: 'web', labelKey: 'navWeb' },
      { id: 'ecommerce', anchor: 'ecommerce', labelKey: 'navEcommerce' },
      { id: 'dashboards', anchor: 'dashboards', labelKey: 'navDashboards' },
      { id: 'flow', anchor: 'fluxo', labelKey: 'navFlow' },
      { id: 'viewer3d', anchor: 'viewer3d', labelKey: 'nav3d' },
      { id: 'industrial', anchor: 'industrial', labelKey: 'navIndustrial' },
    ],
  },
  {
    id: 'foundations',
    labelKey: 'tocFoundations',
    items: [
      { id: 'cores', anchor: 'cores', labelKey: 'navCores' },
      { id: 'tipografia', anchor: 'tipografia', labelKey: 'navTipografia' },
      { id: 'espacamento', anchor: 'espacamento', labelKey: 'navEspaco' },
    ],
  },
  {
    id: 'components',
    labelKey: 'tocComponents',
    items: [
      { id: 'botoes', anchor: 'botoes', labelKey: 'navBotoes' },
      { id: 'inputs', anchor: 'inputs', labelKey: 'navInputs' },
      { id: 'cards', anchor: 'cards', labelKey: 'navCards' },
      { id: 'badges', anchor: 'badges', labelKey: 'navBadges' },
      { id: 'modais', anchor: 'modais', labelKey: 'navModais' },
      { id: 'tabela', anchor: 'tabela', labelKey: 'navTabela' },
      { id: 'interativos', anchor: 'interativos', labelKey: 'navInterativos' },
      { id: 'feedback', anchor: 'feedback', labelKey: 'navFeedback' },
    ],
  },
]

/** Section stub metadata (badge + numbering) keyed by anchor. */
export interface CatalogSectionMeta {
  readonly anchor: string
  readonly group: 'screens' | 'foundations' | 'components'
  readonly badgeKey?: string
  readonly number?: string
  readonly titleKey: string
  readonly descKey: string
}

export const catalogSections: readonly CatalogSectionMeta[] = [
  { anchor: 'login', group: 'screens', badgeKey: 'loginBadge', titleKey: 'loginTitle', descKey: 'loginDesc' },
  { anchor: 'web', group: 'screens', badgeKey: 'webBadge', titleKey: 'webTitle', descKey: 'webDesc' },
  { anchor: 'ecommerce', group: 'screens', badgeKey: 'ecomBadge', titleKey: 'ecomTitle', descKey: 'ecomDesc' },
  { anchor: 'dashboards', group: 'screens', badgeKey: 'dashBadge', titleKey: 'dashTitle', descKey: 'dashDesc' },
  { anchor: 'fluxo', group: 'screens', badgeKey: 'flowBadge', titleKey: 'navFlow', descKey: 'flowDesc' },
  { anchor: 'viewer3d', group: 'screens', badgeKey: 'tdBadge', titleKey: 'tdTitle', descKey: 'tdDesc' },
  { anchor: 'industrial', group: 'screens', badgeKey: 'indBadge', titleKey: 'indTitle', descKey: 'indDesc' },
  { anchor: 'cores', group: 'foundations', number: '01', titleKey: 'coresTitle', descKey: 'coresDesc' },
  { anchor: 'tipografia', group: 'foundations', number: '02', titleKey: 'tipoTitle', descKey: 'tipoDesc' },
  { anchor: 'espacamento', group: 'foundations', number: '03', titleKey: 'espacoTitle', descKey: 'espacoDesc' },
  { anchor: 'botoes', group: 'components', number: '04', titleKey: 'botoesTitle', descKey: 'botoesDesc' },
  { anchor: 'inputs', group: 'components', number: '05', titleKey: 'inputsTitle', descKey: 'inputsDesc' },
  { anchor: 'cards', group: 'components', number: '06', titleKey: 'cardsTitle', descKey: 'cardsDesc' },
  { anchor: 'badges', group: 'components', number: '07', titleKey: 'badgesTitle', descKey: 'badgesDesc' },
  { anchor: 'modais', group: 'components', number: '08', titleKey: 'modaisTitle', descKey: 'modaisDesc' },
  { anchor: 'tabela', group: 'components', number: '09', titleKey: 'tabelaTitle', descKey: 'tabelaDesc' },
  { anchor: 'feedback', group: 'components', number: '10', titleKey: 'feedbackTitle', descKey: 'feedbackDesc' },
  { anchor: 'interativos', group: 'components', number: '11', titleKey: 'interTitle', descKey: 'interDesc' },
]

/** Converts a #rrggbb hex to an "r, g, b" channel string for *-rgb tokens. */
function hexToRgbChannels(hex: string): string {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

/** Inline-override keys this composable owns, so reset clears exactly these. */
const BRAND_OVERRIDE_KEYS = [
  '--ntk-primary',
  '--ntk-accent',
  '--ntk-primary-rgb',
  '--ntk-accent-rgb',
  '--ntk-primary-dark',
  '--ntk-accent-hover',
  '--ntk-accent-soft',
  '--ntk-nav-active-bg',
] as const

interface CatalogShellState {
  theme: CatalogTheme
  density: CatalogDensity
  locale: CatalogLocale
  fontId: string
  brandColor: string | null
}

const state = reactive<CatalogShellState>({
  theme: 'light',
  density: 'comfortable',
  locale: 'pt',
  fontId: 'plex',
  brandColor: null,
})

function root(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

export function applyTheme(theme: CatalogTheme): void {
  state.theme = theme
  const el = root()
  if (el) el.dataset.theme = theme
}

export function applyDensity(density: CatalogDensity): void {
  state.density = density
  const el = root()
  if (el) el.dataset.density = density
}

export function applyLocale(locale: CatalogLocale): void {
  state.locale = locale
}

export function applyFont(fontId: string): void {
  const font = catalogFonts.find((f) => f.id === fontId) ?? catalogFonts[0]
  state.fontId = font.id
  const el = root()
  if (el) el.style.setProperty('--ntk-font-sans', font.stack)
}

/**
 * Sets the live brand color: writes primary/accent + rgb channels and derives
 * the dark/hover and soft surfaces with color-mix, all as inline overrides.
 */
export function applyBrandColor(hex: string): void {
  state.brandColor = hex
  const el = root()
  if (!el) return
  const rgb = hexToRgbChannels(hex)
  const dark = `color-mix(in srgb, ${hex} 82%, black)`
  const soft = `color-mix(in srgb, ${hex} 12%, white)`
  el.style.setProperty('--ntk-primary', hex)
  el.style.setProperty('--ntk-accent', hex)
  el.style.setProperty('--ntk-primary-rgb', rgb)
  el.style.setProperty('--ntk-accent-rgb', rgb)
  el.style.setProperty('--ntk-primary-dark', dark)
  el.style.setProperty('--ntk-accent-hover', dark)
  el.style.setProperty('--ntk-accent-soft', soft)
  el.style.setProperty('--ntk-nav-active-bg', soft)
}

/** Clears the inline brand overrides, falling back to the theme default. */
export function resetBrandColor(): void {
  state.brandColor = null
  const el = root()
  if (!el) return
  for (const key of BRAND_OVERRIDE_KEYS) {
    el.style.removeProperty(key)
  }
}

/**
 * Owns the document theme axes for the catalog: forces the reference light
 * palette (overriding any legacy data-theme like 'revolut') on mount.
 */
export function initCatalogShell(): void {
  applyTheme(state.theme)
  applyDensity(state.density)
  applyFont(state.fontId)
  const el = root()
  if (el) el.dataset.brand = 'purple'
}

export function useCatalogShell() {
  const currentBrandHex = computed(() => state.brandColor ?? catalogSwatches[0].hex)
  return {
    state: readonly(state),
    currentBrandHex,
    applyTheme,
    applyDensity,
    applyLocale,
    applyFont,
    applyBrandColor,
    resetBrandColor,
  }
}