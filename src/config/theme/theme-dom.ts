export interface ThemeDomSyncOptions {
  dark?: boolean
  structuralBackground?: string
  structuralText?: string
  themeId?: string | null
  themeVars?: Record<string, string | null | undefined>
}

const QUASAR_COLOR_SOURCES = {
  '--q-primary': ['--ntk-accent', '--ntk-primary'],
  '--q-secondary': ['--ntk-secondary', '--ntk-text-muted', '--ntk-text-secondary'],
  '--q-accent': ['--ntk-accent-hover', '--ntk-accent', '--ntk-primary-dark'],
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

function setThemeDataAttribute(root: HTMLElement, body: HTMLElement | null, themeId?: string | null): void {
  if (themeId === undefined) {
    return
  }

  if (themeId) {
    root.dataset.theme = themeId
    if (body) {
      body.dataset.theme = themeId
    }
    return
  }

  delete root.dataset.theme
  if (body) {
    delete body.dataset.theme
  }
}

export function syncThemeDomState(options: ThemeDomSyncOptions = {}): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const body = document.body

  applyThemeVariables(root, options.themeVars)
  setThemeDataAttribute(root, body, options.themeId)

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
