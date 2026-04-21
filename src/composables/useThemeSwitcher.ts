import { ref, watch } from 'vue'
import { syncThemeDomState } from '../config/theme/theme-dom'

export type ThemeId = 'revolut' | 'claude' | 'warp' | 'resend' | 'superhuman' | 'kraken'

export interface ThemeOption {
  id: ThemeId
  label: string
  color: string
}

const themePreviewVars: Record<ThemeId, string> = {
  revolut: '--ntk-theme-preview-revolut',
  claude: '--ntk-theme-preview-claude',
  warp: '--ntk-theme-preview-warp',
  resend: '--ntk-theme-preview-resend',
  superhuman: '--ntk-theme-preview-superhuman',
  kraken: '--ntk-theme-preview-kraken',
}

export const themeOptions: ThemeOption[] = [
  { id: 'revolut', label: 'Revolut', color: 'var(--ntk-theme-preview-revolut)' },
  { id: 'claude', label: 'Claude', color: 'var(--ntk-theme-preview-claude)' },
  { id: 'warp', label: 'Warp', color: 'var(--ntk-theme-preview-warp)' },
  { id: 'resend', label: 'Resend', color: 'var(--ntk-theme-preview-resend)' },
  { id: 'superhuman', label: 'Superhuman', color: 'var(--ntk-theme-preview-superhuman)' },
  { id: 'kraken', label: 'Kraken', color: 'var(--ntk-theme-preview-kraken)' },
]

export const DEFAULT_THEME_ID: ThemeId = 'revolut'
export const THEME_SWITCHER_STORAGE_KEY = 'ntk-theme'

function readStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME_ID
  const stored = localStorage.getItem(THEME_SWITCHER_STORAGE_KEY)
  if (stored && themeOptions.some(t => t.id === stored)) {
    return stored as ThemeId
  }
  return DEFAULT_THEME_ID
}

const activeTheme = ref<ThemeId>(readStoredTheme())

function readThemeVariable(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function syncThemePreviewSwatches(): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const activeTheme = root.dataset.theme

  try {
    for (const theme of themeOptions) {
      root.dataset.theme = theme.id
      const swatch = readThemeVariable('--ntk-accent', readThemeVariable('--ntk-primary', 'currentColor'))
      root.style.setProperty(themePreviewVars[theme.id], swatch)
    }
  } finally {
    if (activeTheme) {
      root.dataset.theme = activeTheme
    } else {
      delete root.dataset.theme
    }
  }
}

function applyThemeToDOM(themeId: ThemeId): void {
  if (typeof document === 'undefined') return

  syncThemePreviewSwatches()
  syncThemeDomState({ presetId: themeId })

  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      syncThemePreviewSwatches()
      syncThemeDomState({ presetId: themeId })
    })
  }
}

watch(activeTheme, (newTheme) => {
  applyThemeToDOM(newTheme)
})

export function bootstrapThemeSwitcher(themeId: ThemeId = activeTheme.value): void {
  activeTheme.value = themeId
  applyThemeToDOM(themeId)
}

function persistThemePreference(themeId: ThemeId): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(THEME_SWITCHER_STORAGE_KEY, themeId)
}

export function resetThemePreference(nextTheme: ThemeId = DEFAULT_THEME_ID): void {
  activeTheme.value = nextTheme
  applyThemeToDOM(nextTheme)

  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(THEME_SWITCHER_STORAGE_KEY)
}

export function useThemeSwitcher() {
  function setTheme(themeId: ThemeId): void {
    activeTheme.value = themeId
    applyThemeToDOM(themeId)
    persistThemePreference(themeId)
  }

  return {
    activeTheme,
    themeOptions,
    setTheme,
    resetThemePreference,
  }
}
