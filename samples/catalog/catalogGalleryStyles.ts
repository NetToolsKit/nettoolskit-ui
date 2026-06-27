/**
 * Inline-style builders for the gallery matrices.
 *
 * Mirrors the reference catalog's `variantStyle` / `badgeSolid` / `badgeSoft`
 * / `dot` helpers verbatim, authored against the `--ds-color-*` bridge so the
 * matrices re-resolve live when theme / brand change.
 */
import type { CSSProperties } from 'vue'
import type { ButtonVariant, GalleryTone } from './catalogGalleryData'

/** Base style shared by every button cell in the variant matrix. */
export const buttonBase: CSSProperties = {
  height: 'var(--ds-control-height)',
  padding: '0 16px',
  borderRadius: 'var(--ds-radius-md)',
  border: 'var(--ds-border-width) solid transparent',
  fontFamily: 'var(--ds-font-sans)',
  fontSize: '13.5px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'filter .15s,background .15s,color .15s',
  whiteSpace: 'nowrap',
}

/** Variant × tone color treatment (reference `variantStyle`). */
export function variantStyle(variant: ButtonVariant, tone: GalleryTone): CSSProperties {
  const c = `var(--ds-color-${tone})`
  const soft = `var(--ds-color-${tone}-soft)`
  // Foreground tuned to contrast on the soft bg (lighter tint in dark theme).
  const softFg = `var(--ds-color-${tone}-soft-fg)`
  const contrast = `var(--ds-color-${tone}-contrast)`
  if (variant === 'solid') return { background: c, color: contrast, borderColor: c }
  if (variant === 'soft') return { background: soft, color: softFg, borderColor: 'transparent' }
  if (variant === 'outline') return { background: 'transparent', color: c, borderColor: c }
  if (variant === 'ghost') return { background: 'transparent', color: c, borderColor: 'transparent' }
  // plain
  return {
    background: 'transparent',
    color: tone === 'neutral' ? 'var(--ds-color-text)' : c,
    borderColor: 'transparent',
  }
}

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