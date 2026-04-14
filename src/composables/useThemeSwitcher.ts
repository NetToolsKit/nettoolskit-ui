import { ref, watch } from 'vue'

export type ThemeId = 'revolut' | 'claude' | 'warp' | 'resend' | 'superhuman' | 'kraken'

export interface ThemeOption {
  id: ThemeId
  label: string
  color: string
}

export const themeOptions: ThemeOption[] = [
  { id: 'revolut', label: 'Revolut', color: '#0f766e' },
  { id: 'claude', label: 'Claude', color: '#c96442' },
  { id: 'warp', label: 'Warp', color: '#353534' },
  { id: 'resend', label: 'Resend', color: '#000000' },
  { id: 'superhuman', label: 'Superhuman', color: '#714cb6' },
  { id: 'kraken', label: 'Kraken', color: '#7132f5' },
]

const STORAGE_KEY = 'ntk-theme'

function readStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'revolut'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && themeOptions.some(t => t.id === stored)) {
    return stored as ThemeId
  }
  return 'revolut'
}

const activeTheme = ref<ThemeId>(readStoredTheme())

function applyThemeToDOM(themeId: ThemeId): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = themeId
}

// Apply stored theme on module load
applyThemeToDOM(activeTheme.value)

watch(activeTheme, (newTheme) => {
  applyThemeToDOM(newTheme)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, newTheme)
  }
})

export function useThemeSwitcher() {
  function setTheme(themeId: ThemeId): void {
    activeTheme.value = themeId
  }

  return {
    activeTheme,
    themeOptions,
    setTheme,
  }
}
