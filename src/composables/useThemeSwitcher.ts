import { ref, watch } from 'vue'

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

function syncQuasarColorPalette(): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const body = document.body
  root.style.setProperty('--q-primary', readThemeVariable('--ntk-accent', 'var(--ntk-primary, currentColor)'))
  root.style.setProperty('--q-secondary', readThemeVariable('--ntk-secondary', 'var(--ntk-text-muted, currentColor)'))
  root.style.setProperty('--q-accent', readThemeVariable('--ntk-accent-hover', 'var(--ntk-accent, currentColor)'))
  root.style.setProperty('--q-positive', readThemeVariable('--ntk-success', 'var(--ntk-positive, currentColor)'))
  root.style.setProperty('--q-warning', readThemeVariable('--ntk-warning', 'var(--ntk-warning, currentColor)'))
  root.style.setProperty('--q-negative', readThemeVariable('--ntk-error', 'var(--ntk-negative, currentColor)'))
  root.style.setProperty('--q-info', readThemeVariable('--ntk-info', 'var(--ntk-info, currentColor)'))

  const darkScheme = readThemeVariable('--ntk-dark-scheme', '0')
  const isDark = darkScheme === '1'
  const appBackground = readThemeVariable('--ntk-bg-primary', readThemeVariable('--ntk-shell-bg', 'transparent'))
  const appText = readThemeVariable('--ntk-text-primary', readThemeVariable('--ntk-text-heading', 'currentColor'))
  root.style.colorScheme = isDark ? 'dark' : 'light'
  root.classList.toggle('dark', isDark)
  root.style.backgroundColor = appBackground
  root.style.color = appText

  if (body) {
    body.classList.toggle('body--dark', isDark)
    body.classList.toggle('body--light', !isDark)
    body.style.colorScheme = isDark ? 'dark' : 'light'
    body.style.backgroundColor = appBackground
    body.style.color = appText
  }
}

function applyThemeToDOM(themeId: ThemeId): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const body = document.body
  root.dataset.theme = themeId

  if (body) {
    body.dataset.theme = themeId
  }

  syncThemePreviewSwatches()
  syncQuasarColorPalette()

  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      syncThemePreviewSwatches()
      syncQuasarColorPalette()
    })
  }
}

// Apply stored theme on module load
applyThemeToDOM(activeTheme.value)

watch(activeTheme, (newTheme) => {
  applyThemeToDOM(newTheme)
})

function persistThemePreference(themeId: ThemeId): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(THEME_SWITCHER_STORAGE_KEY, themeId)
}

export function resetThemePreference(nextTheme: ThemeId = DEFAULT_THEME_ID): void {
  activeTheme.value = nextTheme

  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(THEME_SWITCHER_STORAGE_KEY)
}

export function useThemeSwitcher() {
  function setTheme(themeId: ThemeId): void {
    activeTheme.value = themeId
    persistThemePreference(themeId)
  }

  return {
    activeTheme,
    themeOptions,
    setTheme,
    resetThemePreference,
  }
}
