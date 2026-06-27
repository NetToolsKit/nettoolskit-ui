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

/** Parses a #rgb / #rrggbb hex into 0–255 channel triplet. */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

/** Converts a #rrggbb hex to an "r, g, b" channel string for *-rgb tokens. */
function hexToRgbChannels(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  return `${r}, ${g}, ${b}`
}

/** Brand-text candidates: near-white and near-black (matches theme contrasts). */
const TEXT_WHITE = '#ffffff'
const TEXT_BLACK = '#0b0a1a'

/** WCAG relative luminance for an sRGB hex color (0 = black, 1 = white). */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const lin = [r, g, b].map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

/** WCAG contrast ratio between two hex colors (1 = identical, 21 = max). */
function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Auto brand-text color: pick white or near-black — whichever yields the higher
 * WCAG contrast ratio against the chosen brand color.
 */
function autoBrandTextColor(brandHex: string): string {
  return contrastRatio(brandHex, TEXT_WHITE) >= contrastRatio(brandHex, TEXT_BLACK)
    ? TEXT_WHITE
    : TEXT_BLACK
}

/**
 * Reference catalog's per-theme `soft` tint for the canonical brand swatches
 * (purple / blue). We pin the brand HUE constant across themes (so the
 * primary/dot never shift), but the SOFT surface must still adapt per theme —
 * in dark it is a DARK tint of the hue, never a light wash. Light/HC use the
 * reference's literal light softs; in dark we SOFTEN the reference's literal
 * dark soft toward the surface so it reads as a gentle, subtle tint just above
 * the surface (the raw reference values read too heavy in our shell).
 */
const CANONICAL_BRAND_SOFT: Record<string, { light: string; dark: string; hc: string }> = {
  '#4f26db': {
    light: '#ece8fb',
    dark: 'color-mix(in srgb, #241a4d 70%, var(--ds-color-surface, #121a2b))',
    hc: '#e9e3fb',
  }, // purple
  '#2563eb': {
    light: '#e8f0fe',
    dark: 'color-mix(in srgb, #152449 70%, var(--ds-color-surface, #121a2b))',
    hc: '#e3ebfb',
  }, // blue
}

/**
 * Per-theme SOFT tint for an arbitrary brand hue. Light/HC are LIGHT washes
 * (mix toward white); DARK is a GENTLE dark tint (a small amount of the hue mixed
 * into the dark surface) so the soft is a subtle low-contrast background just
 * above the surface — clearly a dark tint, never a light panel.
 */
function brandSoftFor(hex: string, theme: CatalogTheme): string {
  const canonical = CANONICAL_BRAND_SOFT[hex.toLowerCase()]
  if (canonical) return canonical[theme]
  if (theme === 'dark') return `color-mix(in srgb, ${hex} 12%, var(--ds-color-surface, #121a2b))`
  if (theme === 'hc') return `color-mix(in srgb, ${hex} 16%, white)`
  return `color-mix(in srgb, ${hex} 14%, white)`
}

/** Brand text-color choice: 'auto' (luminance-derived) or a forced hex. */
export type CatalogBrandTextColor = 'auto' | string

interface CatalogShellState {
  theme: CatalogTheme
  density: CatalogDensity
  locale: CatalogLocale
  fontId: string
  brandColor: string | null
  brandTextColor: CatalogBrandTextColor
}

const state = reactive<CatalogShellState>({
  theme: 'light',
  density: 'comfortable',
  locale: 'pt',
  fontId: 'plex',
  brandColor: null,
  brandTextColor: 'auto',
})

function root(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

export function applyTheme(theme: CatalogTheme): void {
  state.theme = theme
  const el = root()
  if (!el) return
  el.dataset.theme = theme
  // Re-pin the brand inline for the new theme: the hue stays constant, but the
  // per-theme SOFT tint (light wash vs dark tint) must re-resolve.
  paintBrand()
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

/** The brand hue currently in effect: the user pick, or the catalog default. */
function effectiveBrand(): string {
  return state.brandColor ?? catalogSwatches[0].hex
}

/**
 * Resolves the effective brand-text color for the active choice: 'auto' derives
 * it from the current brand color's luminance; otherwise the forced hex is used.
 */
function resolveBrandTextColor(): string {
  const brand = effectiveBrand()
  return state.brandTextColor === 'auto' ? autoBrandTextColor(brand) : state.brandTextColor
}

/**
 * Applies the brand-text color INLINE so it is identical across themes: writes
 * both `--ntk-primary-contrast` and `--ntk-text-on-accent` (plus a `--cat-brand-
 * contrast` mirror the embedded Industrial reads).
 */
function paintBrandTextColor(): void {
  const el = root()
  if (!el) return
  const color = resolveBrandTextColor()
  el.style.setProperty('--ntk-primary-contrast', color)
  el.style.setProperty('--ntk-text-on-accent', color)
  el.style.setProperty('--cat-brand-contrast', color)
}

/**
 * Paints the WHOLE brand family inline on <html> from the effective brand hue.
 *
 * The brand HUE is pinned CONSTANT across themes: `--ntk-primary`/`--ntk-accent`
 * (+ rgb) are written verbatim so Light↔Dark↔HC never shift the brand tone (the
 * MARCA dot and primary accents stay identical). Only the theme-relative parts
 * adapt:
 *   - hover = color-mix(brand 82%, black);
 *   - soft / nav-active-bg = brandSoftFor() — a LIGHT wash in light/hc but a
 *     DARK tint in dark (so the soft is never a light panel in dark theme);
 *   - contrast = the brand-text adjuster value (painted separately).
 * Also mirrors `--cat-brand*` for theme-scoped subtrees (embedded Industrial).
 * Must be re-run on theme change so the per-theme soft re-resolves.
 */
function paintBrand(): void {
  const el = root()
  if (!el) return
  const hex = effectiveBrand()
  const rgb = hexToRgbChannels(hex)
  const hover = `color-mix(in srgb, ${hex} 82%, black)`
  const soft = brandSoftFor(hex, state.theme)
  el.style.setProperty('--ntk-primary', hex)
  el.style.setProperty('--ntk-accent', hex)
  el.style.setProperty('--ntk-primary-rgb', rgb)
  el.style.setProperty('--ntk-accent-rgb', rgb)
  el.style.setProperty('--ntk-primary-dark', hover)
  el.style.setProperty('--ntk-accent-hover', hover)
  el.style.setProperty('--ntk-accent-soft', soft)
  el.style.setProperty('--ntk-nav-active-bg', soft)
  // Brand source mirrors (read by theme-scoped subtrees, e.g. the Industrial).
  el.style.setProperty('--cat-brand', hex)
  el.style.setProperty('--cat-brand-dark', hover)
  el.style.setProperty('--cat-brand-rgb', rgb)
  el.style.setProperty('--cat-brand-soft', soft)
  paintBrandTextColor()
}

/**
 * Sets the live brand color (user pick) and repaints the whole brand family.
 */
export function applyBrandColor(hex: string): void {
  state.brandColor = hex
  paintBrand()
}

/**
 * Sets the brand-text color choice ('auto' | hex) and re-paints it inline so the
 * text drawn on top of the brand color stays identical across light/dark/hc.
 */
export function applyBrandTextColor(choice: CatalogBrandTextColor): void {
  state.brandTextColor = choice
  paintBrandTextColor()
}

/** Clears the user pick, restoring the catalog default brand (still pinned). */
export function resetBrandColor(): void {
  state.brandColor = null
  state.brandTextColor = 'auto'
  // Repaint from the default brand: the family stays inline (pinned hue across
  // themes), the Auto brand-text color re-derives, and the embedded Industrial
  // keeps following the catalog default brand.
  paintBrand()
}

/**
 * Owns the document theme axes for the catalog: forces the reference light
 * palette (overriding any legacy data-theme like 'revolut') on mount, and pins
 * the brand family inline so the hue is constant across themes from the start.
 */
export function initCatalogShell(): void {
  applyTheme(state.theme)
  applyDensity(state.density)
  applyFont(state.fontId)
  const el = root()
  if (!el) return
  el.dataset.brand = 'purple'
  // Pin the brand family inline from the start (constant hue across themes), so
  // the MARCA dot, primary accents, segmented controls and the embedded
  // Industrial all resolve the same brand in Light / Dark / HC.
  paintBrand()
}

export function useCatalogShell() {
  const currentBrandHex = computed(() => state.brandColor ?? catalogSwatches[0].hex)
  // Effective brand-text color (resolves 'auto' to the luminance-derived value),
  // used to drive the custom color input's value in the MARCA control.
  const currentBrandTextHex = computed(() =>
    state.brandTextColor === 'auto'
      ? autoBrandTextColor(currentBrandHex.value)
      : state.brandTextColor,
  )
  return {
    state: readonly(state),
    currentBrandHex,
    currentBrandTextHex,
    applyTheme,
    applyDensity,
    applyLocale,
    applyFont,
    applyBrandColor,
    applyBrandTextColor,
    resetBrandColor,
  }
}