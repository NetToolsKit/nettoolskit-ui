/**
 * Static data for the Fundamentos + Componentes galleries.
 *
 * Values mirror the reference standalone catalog 1:1 (labels, token names,
 * type-scale specs, space/radius steps, button/badge matrices, kanban/agenda
 * seeds and the scroll table). Colors are authored against the reference
 * `--ds-color-*` token bridge (see src/styles/reference-themes.css) so the
 * gallery re-resolves live when theme / brand / density change.
 */

/** Semantic tone keys, in reference order. */
export const galleryTones = ['primary', 'neutral', 'success', 'warning', 'danger', 'info'] as const
export type GalleryTone = (typeof galleryTones)[number]

/** Fixed PT tone labels for the matrix headers. */
export const toneLabel: Record<GalleryTone, string> = {
  primary: 'Primária',
  neutral: 'Neutra',
  success: 'Sucesso',
  warning: 'Atenção',
  danger: 'Perigo',
  info: 'Info',
}

export const toneLabelEn: Record<GalleryTone, string> = {
  primary: 'Primary',
  neutral: 'Neutral',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
}

/** Surface/text roles for the "Superfícies & texto" swatch row. */
export interface SurfaceSwatch {
  readonly label: string
  readonly labelEn: string
  readonly varName: string
}

export const surfaceSwatches: readonly SurfaceSwatch[] = [
  { label: 'Fundo', labelEn: 'Background', varName: '--ds-color-bg' },
  { label: 'Superfície', labelEn: 'Surface', varName: '--ds-color-surface' },
  { label: 'Superfície sutil', labelEn: 'Subtle surface', varName: '--ds-color-surface-muted' },
  { label: 'Texto', labelEn: 'Text', varName: '--ds-color-text' },
  { label: 'Texto sutil', labelEn: 'Subtle text', varName: '--ds-color-text-muted' },
  { label: 'Borda', labelEn: 'Border', varName: '--ds-color-border' },
]

/**
 * Type-scale rows: i18n keys for label + sample + spec meta + the rendered style.
 * `labelKey`/`sampleKey` resolve against the active locale; Display and Mono use a
 * fixed brand/token literal (`sample`) that is identical in both locales.
 */
export interface TypeScaleRow {
  readonly labelKey: string
  readonly sampleKey?: string
  readonly sample?: string
  readonly meta: string
  readonly style: Record<string, string | number>
}

export const typeScale: readonly TypeScaleRow[] = [
  {
    labelKey: 'tsDisplay',
    sample: 'NetToolsKit',
    meta: '40px · 1.15 · 600',
    style: { fontSize: '40px', lineHeight: 1.15, fontWeight: 600, letterSpacing: '-.02em' },
  },
  {
    labelKey: 'tsH1',
    sampleKey: 'tsSampleH1',
    meta: '28px · 1.2 · 600',
    style: { fontSize: '28px', lineHeight: 1.2, fontWeight: 600, letterSpacing: '-.02em' },
  },
  {
    labelKey: 'tsH2',
    sampleKey: 'tsSampleH2',
    meta: '20px · 1.3 · 600',
    style: { fontSize: '20px', lineHeight: 1.3, fontWeight: 600 },
  },
  {
    labelKey: 'tsH3',
    sampleKey: 'tsSampleH3',
    meta: '16px · 1.4 · 600',
    style: { fontSize: '16px', lineHeight: 1.4, fontWeight: 600 },
  },
  {
    labelKey: 'tsBody',
    sampleKey: 'tsSampleBody',
    meta: '15px · 1.55 · 400',
    style: { fontSize: '15px', lineHeight: 1.55, fontWeight: 400 },
  },
  {
    labelKey: 'tsBodyStrong',
    sampleKey: 'tsSampleBodyStrong',
    meta: '15px · 1.55 · 600',
    style: { fontSize: '15px', lineHeight: 1.55, fontWeight: 600 },
  },
  {
    labelKey: 'tsSmall',
    sampleKey: 'tsSampleSmall',
    meta: '13px · 1.5 · 400',
    style: { fontSize: '13px', lineHeight: 1.5, fontWeight: 400, color: 'var(--ds-color-text-muted)' },
  },
  {
    labelKey: 'tsMono',
    sample: '--ds-color-primary: #4f26db',
    meta: '12px · 1.5 · 500',
    style: {
      fontSize: '12px',
      lineHeight: 1.5,
      fontWeight: 500,
      fontFamily: 'var(--ds-font-mono)',
      color: 'var(--ds-color-text-muted)',
    },
  },
]

/** Space scale: token name + px width of the filled bar. */
export const spaceScale: readonly { readonly t: string; readonly px: number }[] = [
  { t: 'space-100', px: 4 },
  { t: 'space-200', px: 8 },
  { t: 'space-300', px: 12 },
  { t: 'space-400', px: 16 },
  { t: 'space-600', px: 24 },
  { t: 'space-800', px: 32 },
]

/** Radius scale: token key + px (pill = 999). */
export const radiusScale: readonly { readonly t: string; readonly px: number; readonly label: string }[] = [
  { t: 'sm', px: 6, label: '6px' },
  { t: 'md', px: 10, label: '10px' },
  { t: 'lg', px: 16, label: '16px' },
  { t: 'pill', px: 999, label: 'pill' },
]

/** Button variant matrix rows (reference variant keys). */
export const buttonVariants = ['solid', 'soft', 'outline', 'ghost', 'plain'] as const
export type ButtonVariant = (typeof buttonVariants)[number]

export const buttonVariantLabel: Record<ButtonVariant, string> = {
  solid: 'Solid',
  soft: 'Soft',
  outline: 'Outline',
  ghost: 'Ghost',
  plain: 'Plain',
}

/** Button size demo row, mapped to the governed DsButton size + density axes. */
export const buttonSizes: readonly {
  readonly key: string
  readonly labelKey: string
  readonly dsSize: 'sm' | 'md' | 'lg'
  readonly density: 'compact' | 'comfortable' | 'spacious'
}[] = [
  { key: 'xs', labelKey: 'szXs', dsSize: 'sm', density: 'compact' },
  { key: 'sm', labelKey: 'szSm', dsSize: 'sm', density: 'comfortable' },
  { key: 'md', labelKey: 'szMd', dsSize: 'md', density: 'comfortable' },
  { key: 'lg', labelKey: 'szLg', dsSize: 'lg', density: 'spacious' },
]

/**
 * Scroll table column header i18n keys (14 cols) + generated rows (verbatim from
 * the reference). Keys resolve against the active locale in CatalogTable.
 */
export const scrollColKeys = [
  'tcId',
  'tcTag',
  'tcAddr',
  'tcType',
  'tcValue',
  'tcUnit',
  'tcMin',
  'tcMax',
  'tcScale',
  'tcAlarm',
  'tcZone',
  'tcPlc',
  'tcScan',
  'tcUpdated',
] as const

export interface ScrollRow {
  readonly id: string
  readonly tag: string
  readonly addr: string
  readonly tipo: string
  readonly valor: string
  readonly unid: string
  readonly min: string
  readonly max: string
  readonly escala: string
  readonly alarme: string
  readonly zona: string
  readonly plc: string
  readonly scan: string
  readonly upd: string
}

export const scrollRows: readonly ScrollRow[] = Array.from({ length: 36 }, (_unused, i): ScrollRow => {
  const n = i + 1
  const tipos = ['BOOL', 'REAL', 'INT', 'WORD', 'DINT']
  const zonas = ['Linha A', 'Linha B', 'Forno', 'Envase', 'Paletização']
  const max = 50 + (n % 5) * 25
  return {
    id: `T-${String(1000 + n)}`,
    tag: `${['Motor', 'Sensor', 'Valvula', 'Nivel', 'Pressao', 'Temp'][n % 6]}_${String(n).padStart(2, '0')}`,
    addr: `%MD${100 + n * 2}`,
    tipo: tipos[n % tipos.length],
    valor: ((n * 7.3) % 100).toFixed(1),
    unid: ['°C', 'bar', 'rpm', '%', 'L'][n % 5],
    min: '0',
    max: String(max),
    escala: `0–${max}`,
    alarme: n % 4 === 0 ? 'ALTO' : n % 4 === 1 ? 'BAIXO' : 'OK',
    zona: zonas[n % zonas.length],
    plc: `PLC-${String((n % 3) + 1).padStart(2, '0')}`,
    scan: `${100 + (n % 4) * 50}ms`,
    upd: `10:3${n % 6}:0${n % 9}`,
  }
})

/** Kanban + agenda + draw seeds. */
export interface KanbanCard {
  readonly id: string
  /** i18n key for the card title (resolved against the active locale). */
  readonly titleKey: string
  readonly tone: GalleryTone
}

export const kanbanCards: Record<string, KanbanCard> = {
  k1: { id: 'k1', titleKey: 'kbCardOauth', tone: 'info' },
  k2: { id: 'k2', titleKey: 'kbCardRate', tone: 'warning' },
  k3: { id: 'k3', titleKey: 'kbCardWebhook', tone: 'neutral' },
  k4: { id: 'k4', titleKey: 'kbCardSchema', tone: 'primary' },
  k5: { id: 'k5', titleKey: 'kbCardCache', tone: 'success' },
  k6: { id: 'k6', titleKey: 'kbCardAudit', tone: 'danger' },
}

export type KanbanColumnKey = 'todo' | 'doing' | 'done'

export const kanbanColumns: readonly { readonly key: KanbanColumnKey; readonly labelKey: string }[] = [
  { key: 'todo', labelKey: 'kbTodo' },
  { key: 'doing', labelKey: 'kbDoing' },
  { key: 'done', labelKey: 'kbDone' },
]

export const initialKanban: Record<KanbanColumnKey, string[]> = {
  todo: ['k1', 'k2', 'k3'],
  doing: ['k4', 'k5'],
  done: ['k6'],
}

export interface AgendaEvent {
  readonly id: string
  readonly title: string
  readonly time: string
  readonly tone: GalleryTone
}

export const agendaEvents: Record<string, AgendaEvent> = {
  a1: { id: 'a1', title: 'Daily', time: '09:00', tone: 'primary' },
  a2: { id: 'a2', title: 'Deploy', time: '11:00', tone: 'success' },
  a3: { id: 'a3', title: 'Review', time: '15:00', tone: 'info' },
  a4: { id: 'a4', title: 'Retro', time: '16:00', tone: 'warning' },
  a5: { id: 'a5', title: 'Planning', time: '10:00', tone: 'neutral' },
}

export const agendaDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'] as const
export const agendaDaysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

export const initialAgenda: Record<number, string[]> = {
  0: ['a1'],
  1: ['a2', 'a3'],
  2: [],
  3: ['a4'],
  4: ['a5'],
}

export const drawSwatches = ['#4f26db', '#2563eb', '#16a34a', '#c2740a', '#dc2626', '#0f172a'] as const
export const drawWidths = [2, 4, 8] as const