export const TEMPLATE_LAYOUT_PERSISTED_SUFFIXES = [
  'horizontal-mode',
  'mini-mode',
  'mini-labels',
  'side-menu-variant',
] as const

export function clearTemplateLayoutPersistence(storageKeyPrefix = 'ntk-template-layout'): void {
  if (typeof window === 'undefined') {
    return
  }

  for (const suffix of TEMPLATE_LAYOUT_PERSISTED_SUFFIXES) {
    try {
      window.localStorage.removeItem(`${storageKeyPrefix}:${suffix}`)
    } catch {
      // Intentionally ignore persistence failures (private mode, quota, SSR).
    }
  }
}