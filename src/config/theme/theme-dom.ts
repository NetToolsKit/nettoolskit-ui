export interface ThemeDomSyncOptions {
  dark?: boolean
  structuralBackground?: string
  structuralText?: string
  presetId?: string | null
  templateScope?: boolean
  themeVars?: Record<string, string | null | undefined>
}

const QUASAR_COLOR_SOURCES = {
  '--q-primary': ['--ntk-primary', '--ntk-accent'],
  '--q-secondary': ['--ntk-secondary', '--ntk-accent', '--ntk-primary', '--ntk-text-muted', '--ntk-text-secondary'],
  '--q-accent': ['--ntk-accent-hover', '--ntk-accent', '--ntk-primary-dark'],
  '--q-dark': ['--ntk-dark', '--ntk-bg-card', '--ntk-card-bg', '--ntk-bg-secondary'],
  '--q-dark-page': ['--ntk-dark-page', '--ntk-shell-bg', '--ntk-bg-primary'],
  '--q-positive': ['--ntk-success', '--ntk-positive'],
  '--q-warning': ['--ntk-warning'],
  '--q-negative': ['--ntk-error', '--ntk-negative'],
  '--q-info': ['--ntk-info'],
} as const

function setStyleProperty(style: CSSStyleDeclaration, name: string, value?: string | null): void {
  if (!value) {
    style.removeProperty(name)
    return
  }

  style.setProperty(name, value)
}

function readThemeVariable(style: CSSStyleDeclaration, names: readonly string[], fallback?: string): string {
  for (const name of names) {
    const value = style.getPropertyValue(name).trim()
    if (value) {
      return value
    }
  }

  return fallback ?? ''
}

function applyThemeVariables(root: HTMLElement, themeVars?: Record<string, string | null | undefined>): void {
  if (!themeVars) {
    return
  }

  for (const [name, value] of Object.entries(themeVars)) {
    setStyleProperty(root.style, name, value)
  }
}

function setThemeDataAttribute(root: HTMLElement, body: HTMLElement | null, presetId?: string | null): void {
  if (presetId === undefined) {
    return
  }

  if (presetId) {
    root.dataset.theme = presetId
    if (body) {
      body.dataset.theme = presetId
    }
    return
  }

  delete root.dataset.theme
  if (body) {
    delete body.dataset.theme
  }
}

function setTemplateThemeScope(body: HTMLElement | null, templateScope?: boolean): void {
  if (!body || templateScope === undefined) {
    return
  }

  if (templateScope) {
    body.dataset.ntkTemplateTheme = 'true'
    return
  }

  delete body.dataset.ntkTemplateTheme
}

type ThemeDarkSync = (isDark: boolean) => void

let themeDarkSync: ThemeDarkSync | null = null

/**
 * Register an optional host-framework dark-mode bridge (e.g. Quasar `Dark`
 * via `installQuasarServices()` from `@nettoolskit/ui/quasar`). Pass `null`
 * to detach. Keeps this module free of optional peers: the `--q-*` variable
 * bridge below is plain CSS and needs no Quasar import.
 */
export function registerThemeDarkSync(sync: ThemeDarkSync | null): void {
  themeDarkSync = sync
}

function syncHostDarkMode(isDark: boolean): void {
  try {
    themeDarkSync?.(isDark)
  } catch {
    // Host bridge failed or is absent; DOM classes remain the authoritative fallback.
  }
}

export function syncThemeDomState(options: ThemeDomSyncOptions = {}): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const body = document.body

  applyThemeVariables(root, options.themeVars)
  setThemeDataAttribute(root, body, options.presetId)
  setTemplateThemeScope(body, options.templateScope)

  const computedStyle = getComputedStyle(root)
  const isDark = options.dark ?? computedStyle.getPropertyValue('--ntk-dark-scheme').trim() === '1'
  const structuralBackground =
    options.structuralBackground
    ?? readThemeVariable(computedStyle, ['--ntk-bg-primary', '--ntk-shell-bg', '--ntk-bg-secondary'], 'transparent')
  const structuralText =
    options.structuralText
    ?? readThemeVariable(
      computedStyle,
      ['--ntk-text-primary', '--ntk-text-heading', '--ntk-text-secondary'],
      'currentColor',
    )

  for (const [quasarVar, sources] of Object.entries(QUASAR_COLOR_SOURCES)) {
    const value = readThemeVariable(computedStyle, sources, '')
    setStyleProperty(root.style, quasarVar, value)
  }

  syncHostDarkMode(isDark)
  root.classList.toggle('dark', isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'
  root.style.backgroundColor = structuralBackground
  root.style.color = structuralText

  if (!body) {
    return
  }

  body.classList.toggle('body--dark', isDark)
  body.classList.toggle('body--light', !isDark)
  body.style.colorScheme = isDark ? 'dark' : 'light'
  body.style.backgroundColor = structuralBackground
  body.style.color = structuralText
}