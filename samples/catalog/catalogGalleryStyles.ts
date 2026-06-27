/**
 * Inline-style builders for the gallery matrices.
 *
 * Mirrors the reference catalog's `variantStyle` / `badgeSolid` / `badgeSoft`
 * / `dot` helpers verbatim, authored against the `--ds-color-*` bridge so the
 * matrices re-resolve live when theme / brand change.
 */
import type { CSSProperties } from 'vue'
import type { GalleryTone } from './catalogGalleryData'

/** Pill base shared by solid/soft badges. */
const badgePill: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  padding: '3px 11px',
  borderRadius: 'var(--ds-radius-pill)',
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1.45,
  whiteSpace: 'nowrap',
}

export function badgeSolid(tone: GalleryTone): CSSProperties {
  return { ...badgePill, background: `var(--ds-color-${tone})`, color: `var(--ds-color-${tone}-contrast)` }
}

export function badgeSoft(tone: GalleryTone): CSSProperties {
  // Soft-fg text + dot so the badge stays readable on the subtle dark soft bg.
  return { ...badgePill, background: `var(--ds-color-${tone}-soft)`, color: `var(--ds-color-${tone}-soft-fg)` }
}

/** Leading status dot inside a badge. */
export function dotStyle(color: string): CSSProperties {
  return { width: '6px', height: '6px', borderRadius: '999px', background: color, flex: '0 0 auto' }
}