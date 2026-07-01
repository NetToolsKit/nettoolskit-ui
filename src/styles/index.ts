/**
 * Shared Styles Export
 *
 * This file centralizes the shared project styles.
 *
 * TOKEN SYSTEM:
 * - tokens.scss: global CSS custom properties (--ntk-*)
 * - global.scss: reset and global styles
 * - themes.css: named runtime palettes via [data-theme]
 *
 * Values live ONLY in the token sources (design-system/tokens/source.json →
 * generated CSS, plus the runtime palettes in themes.css). This module
 * deliberately exports no color/spacing literals — duplicating token values
 * in TypeScript is a governance violation (anti-duplicity rule).
 *
 * PROJECT USAGE:
 * 1. Import the styles in main.ts or App.vue:
 *    @import '@nettoolskit/ui/styles/tokens.scss';
 *    @import '@nettoolskit/ui/styles/global.scss';
 *
 * 2. Prefer preset/theme CSS variables for runtime branding:
 *    :root { --ntk-primary: var(--brand-primary); }
 */

/**
 * Helper to read a CSS custom property from the document root.
 */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Helper to set a CSS custom property on the document root.
 */
export function setCssVar(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value);
}