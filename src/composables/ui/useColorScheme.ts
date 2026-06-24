/**
 * useColorScheme composable
 *
 * Token-only light/dark mode for the design system. It never writes color
 * values from JavaScript: it only sets `document.documentElement[data-color-scheme]`
 * and mirrors Quasar through the `body--dark` class. All actual colors live in
 * `src/styles/themes.css` as token swaps, so changing the design or the scheme
 * never requires editing component CSS.
 *
 * Modes:
 *   'system' (default) - follow the OS via `prefers-color-scheme`
 *   'light' / 'dark'   - explicit choice that always wins over the OS
 */

import { computed, onScopeDispose, readonly, ref } from 'vue'

export type ColorSchemeMode = 'system' | 'light' | 'dark'
export type ResolvedColorScheme = 'light' | 'dark'

export const COLOR_SCHEME_STORAGE_KEY = 'ntk-color-scheme'

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
const COLOR_SCHEME_MODES: readonly ColorSchemeMode[] = ['system', 'light', 'dark']

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined'

const isColorSchemeMode = (value: unknown): value is ColorSchemeMode =>
  typeof value === 'string' && COLOR_SCHEME_MODES.includes(value as ColorSchemeMode)

function prefersDark(): boolean {
  if (!isBrowser() || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(DARK_MEDIA_QUERY).matches
}

function readStoredMode(): ColorSchemeMode {
  if (!isBrowser()) {
    return 'system'
  }
  try {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
    return isColorSchemeMode(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function persistMode(mode: ColorSchemeMode): void {
  if (!isBrowser()) {
    return
  }
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, mode)
  } catch {
    // Storage can be unavailable (private mode, SSR hydration). Ignore.
  }
}

/**
 * Resolve the concrete scheme that should be rendered for a mode.
 */
export function resolveColorScheme(mode: ColorSchemeMode): ResolvedColorScheme {
  if (mode === 'system') {
    return prefersDark() ? 'dark' : 'light'
  }
  return mode
}

/**
 * Apply a mode to the DOM. Only attributes/classes are touched; the CSS layer
 * owns every color value.
 */
export function applyColorScheme(mode: ColorSchemeMode): ResolvedColorScheme {
  const resolved = resolveColorScheme(mode)

  if (isBrowser()) {
    const root = document.documentElement
    if (mode === 'system') {
      delete root.dataset.colorScheme
    } else {
      root.dataset.colorScheme = mode
    }
    // Keep Quasar's dark-mode CSS in sync without coupling to a Quasar instance.
    document.body?.classList.toggle('body--dark', resolved === 'dark')
  }

  return resolved
}

// Shared singleton state so every caller observes the same scheme.
const mode = ref<ColorSchemeMode>(readStoredMode())
const resolved = ref<ResolvedColorScheme>(resolveColorScheme(mode.value))

let mediaQuery: MediaQueryList | undefined
let listenerCount = 0

function refreshResolved(): void {
  resolved.value = applyColorScheme(mode.value)
}

function handleSystemChange(): void {
  if (mode.value === 'system') {
    refreshResolved()
  }
}

function ensureMediaListener(): void {
  if (!isBrowser() || typeof window.matchMedia !== 'function' || mediaQuery) {
    return
  }
  mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)
  mediaQuery.addEventListener('change', handleSystemChange)
}

/**
 * Set the active mode, persist it, and apply it to the DOM.
 */
export function setColorScheme(next: ColorSchemeMode): void {
  mode.value = next
  persistMode(next)
  refreshResolved()
}

/**
 * Initialize color-scheme handling during application startup, mirroring
 * `bootstrapThemeSwitcher`. Safe to call once from `main.ts`.
 */
export function bootstrapColorScheme(): void {
  mode.value = readStoredMode()
  ensureMediaListener()
  refreshResolved()
}

/**
 * Reactive color-scheme control. Returns the shared singleton state.
 */
export function useColorScheme() {
  if (isBrowser()) {
    ensureMediaListener()
    listenerCount += 1
    onScopeDispose(() => {
      listenerCount -= 1
      if (listenerCount <= 0 && mediaQuery) {
        mediaQuery.removeEventListener('change', handleSystemChange)
        mediaQuery = undefined
        listenerCount = 0
      }
    })
  }

  const isDark = computed(() => resolved.value === 'dark')

  /** Cycle explicit dark/light, ignoring system. */
  const toggle = (): void => {
    setColorScheme(isDark.value ? 'light' : 'dark')
  }

  return {
    mode: readonly(mode),
    resolved: readonly(resolved),
    isDark,
    availableModes: COLOR_SCHEME_MODES,
    setMode: setColorScheme,
    toggle,
  }
}