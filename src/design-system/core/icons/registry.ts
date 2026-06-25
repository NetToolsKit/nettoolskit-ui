/**
 * Built-in inline-SVG command icon registry.
 *
 * A closed, domain-neutral set of command glyphs used by the industrial desktop
 * components (`DsCommandIcon`, `DsQuickAccessToolbar`, `DsRibbon*`). Each entry
 * is the inner SVG markup for a 24x24 `viewBox`, authored against `currentColor`
 * (stroke-based, `fill="none"` on the host `<svg>`) so the glyph inherits the
 * caller's text color and density. No icon font, no Quasar, no raw hex.
 *
 * The registry is intentionally small and typed: icon names are a closed union
 * (`NtkCommandIconName`) so product code cannot request an arbitrary/unsafe icon
 * string. Unknown names resolve to a controlled fallback glyph (never text
 * initials) via `resolveNtkCommandIcon`.
 */

/**
 * Inner SVG path markup for each command. Drawn on a 24x24 grid. The host
 * `<svg>` sets `fill="none"` and `stroke="currentColor"`, so these are line
 * glyphs with `stroke-linecap`/`stroke-linejoin` rounded by the host.
 */
export const ntkCommandIconRegistry = {
  new: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  open: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  save: '<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M8 3v5h7"/><path d="M8 21v-6h8v6"/>',
  run: '<path d="M7 4l13 8-13 8z"/>',
  stop: '<rect x="5" y="5" width="14" height="14" rx="1"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  undo: '<path d="M9 7L4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 5 5v1"/>',
  redo: '<path d="M15 7l5 5-5 5"/><path d="M20 12H9a5 5 0 0 0-5 5v1"/>',
  cut: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.5 15.5"/><path d="M14.5 14.5L20 20"/><path d="M8.5 8.5L11 11"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  paste: '<path d="M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1z"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/>',
  delete: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3"/><path d="M12 17h.01"/>',
  'zoom-in': '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  'zoom-out': '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
} as const

/** Closed union of supported command icon names. */
export type NtkCommandIconName = keyof typeof ntkCommandIconRegistry

/** Ordered list of supported command icon names (for iteration/validation). */
export const ntkCommandIconNames = Object.keys(ntkCommandIconRegistry) as NtkCommandIconName[]

/**
 * Controlled fallback glyph for unknown icon names. A neutral square with a
 * centered dot — deliberately NOT text initials, so a missing icon never
 * degrades into a letter (`N`, `S`, `X`, ...) on a command surface.
 */
export const ntkCommandIconFallback =
  '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 16h.01"/><path d="M12 8a2.5 2.5 0 0 1 1 4.8c-.6.3-1 .8-1 1.4"/>'

let hasWarnedForName = new Set<string>()

const isDevEnvironment = (): boolean => {
  // `import.meta.env?.DEV` (Vite) is preferred; fall back to NODE_ENV for
  // Node/SSR adapters. Both are guarded so production stays silent.
  const viteEnv = (import.meta as unknown as { env?: { DEV?: boolean } }).env
  if (viteEnv && typeof viteEnv.DEV === 'boolean') {
    return viteEnv.DEV
  }
  const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV
  return nodeEnv !== 'production'
}

/** Reset the dev-warning de-dupe cache. Test-only helper. */
export const resetNtkCommandIconWarnings = (): void => {
  hasWarnedForName = new Set<string>()
}

export interface NtkResolvedCommandIcon {
  /** True when `name` matched a registry entry. */
  readonly known: boolean
  /** Resolved inner SVG markup (registry glyph or controlled fallback). */
  readonly path: string
}

/**
 * Resolve a command icon name to its inner SVG markup. Unknown names return the
 * controlled fallback glyph and emit a one-time `console.warn` in development
 * only (never in production, and never more than once per name).
 */
export const resolveNtkCommandIcon = (name: string): NtkResolvedCommandIcon => {
  if (Object.prototype.hasOwnProperty.call(ntkCommandIconRegistry, name)) {
    return { known: true, path: ntkCommandIconRegistry[name as NtkCommandIconName] }
  }

  if (isDevEnvironment() && !hasWarnedForName.has(name)) {
    hasWarnedForName.add(name)
    // eslint-disable-next-line no-console
    console.warn(
      `[DsCommandIcon] Unknown icon name "${name}". Rendering the fallback glyph. `
      + `Use one of: ${ntkCommandIconNames.join(', ')}.`,
    )
  }

  return { known: false, path: ntkCommandIconFallback }
}