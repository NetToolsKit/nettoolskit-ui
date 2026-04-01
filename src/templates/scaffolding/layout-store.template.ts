/**
 * Layout state scaffold helpers.
 * Provides a framework-agnostic layout state manager for template integration.
 */

import { computed, reactive, readonly } from 'vue'

export type TemplateScaffoldMenuMode = 'vertical' | 'horizontal'

export interface TemplateScaffoldLayoutState {
  menuMode: TemplateScaffoldMenuMode
  miniMode: boolean
  showLabelsInMini: boolean
  isFullscreen: boolean
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
}

export interface TemplateScaffoldLayoutStoreOptions {
  storageKeyPrefix?: string
  persist?: boolean
  expandedDrawerWidth?: number
  miniDrawerWidth?: number
  miniLabelDrawerWidth?: number
  defaultState?: Partial<TemplateScaffoldLayoutState>
}

export interface TemplateScaffoldLayoutStore {
  state: Readonly<TemplateScaffoldLayoutState>
  drawerWidth: Readonly<{ value: number }>
  showHeader: Readonly<{ value: boolean }>
  showDrawer: Readonly<{ value: boolean }>
  toggleMiniMode: () => void
  toggleShowLabelsInMini: () => void
  toggleMenuMode: () => void
  setMenuMode: (mode: TemplateScaffoldMenuMode) => void
  toggleFullscreen: () => void
  setFullscreen: (value: boolean) => void
  toggleLeftDrawer: () => void
  toggleRightDrawer: () => void
  setLeftDrawerOpen: (value: boolean) => void
  setRightDrawerOpen: (value: boolean) => void
}

const DEFAULT_STATE: TemplateScaffoldLayoutState = {
  menuMode: 'vertical',
  miniMode: false,
  showLabelsInMini: false,
  isFullscreen: false,
  leftDrawerOpen: true,
  rightDrawerOpen: false,
}

const DEFAULT_OPTIONS: Required<Omit<TemplateScaffoldLayoutStoreOptions, 'defaultState'>> = {
  storageKeyPrefix: 'ntk-template-layout',
  persist: true,
  expandedDrawerWidth: 250,
  miniDrawerWidth: 56,
  miniLabelDrawerWidth: 90,
}

/**
 * Creates a reusable layout state manager compatible with template layouts.
 */
export function createTemplateLayoutStore(
  options: TemplateScaffoldLayoutStoreOptions = {}
): TemplateScaffoldLayoutStore {
  const settings = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const state = reactive<TemplateScaffoldLayoutState>({
    ...DEFAULT_STATE,
    ...options.defaultState,
  })

  hydrateFromStorage(state, settings)

  const drawerWidth = computed<number>(() => {
    if (state.isFullscreen || state.menuMode === 'horizontal') {
      return 0
    }

    if (!state.miniMode) {
      return settings.expandedDrawerWidth
    }

    return state.showLabelsInMini
      ? settings.miniLabelDrawerWidth
      : settings.miniDrawerWidth
  })

  const showHeader = computed<boolean>(() => !state.isFullscreen)
  const showDrawer = computed<boolean>(() => !state.isFullscreen && state.menuMode === 'vertical')

  const api: TemplateScaffoldLayoutStore = {
    state: readonly(state),
    drawerWidth,
    showHeader,
    showDrawer,
    toggleMiniMode: () => {
      state.miniMode = !state.miniMode
      persistState(state, settings)
    },
    toggleShowLabelsInMini: () => {
      state.showLabelsInMini = !state.showLabelsInMini
      persistState(state, settings)
    },
    toggleMenuMode: () => {
      state.menuMode = state.menuMode === 'vertical' ? 'horizontal' : 'vertical'
      persistState(state, settings)
    },
    setMenuMode: mode => {
      state.menuMode = mode
      persistState(state, settings)
    },
    toggleFullscreen: () => {
      state.isFullscreen = !state.isFullscreen
      persistState(state, settings)
    },
    setFullscreen: value => {
      state.isFullscreen = value
      persistState(state, settings)
    },
    toggleLeftDrawer: () => {
      state.leftDrawerOpen = !state.leftDrawerOpen
      persistState(state, settings)
    },
    toggleRightDrawer: () => {
      state.rightDrawerOpen = !state.rightDrawerOpen
      persistState(state, settings)
    },
    setLeftDrawerOpen: value => {
      state.leftDrawerOpen = value
      persistState(state, settings)
    },
    setRightDrawerOpen: value => {
      state.rightDrawerOpen = value
      persistState(state, settings)
    },
  }

  return api
}

function storageKey(prefix: string, key: keyof TemplateScaffoldLayoutState): string {
  return `${prefix}:${key}`
}

function hydrateFromStorage(
  state: TemplateScaffoldLayoutState,
  options: Required<Omit<TemplateScaffoldLayoutStoreOptions, 'defaultState'>>
): void {
  if (!options.persist) {
    return
  }

  const keys = Object.keys(DEFAULT_STATE) as Array<keyof TemplateScaffoldLayoutState>
  keys.forEach(key => {
    const rawValue = safeRead(storageKey(options.storageKeyPrefix, key))
    if (rawValue === null) {
      return
    }

    if (key === 'menuMode') {
      state.menuMode = rawValue === 'horizontal' ? 'horizontal' : 'vertical'
      return
    }

    state[key] = rawValue === 'true'
  })
}

function persistState(
  state: TemplateScaffoldLayoutState,
  options: Required<Omit<TemplateScaffoldLayoutStoreOptions, 'defaultState'>>
): void {
  if (!options.persist) {
    return
  }

  const keys = Object.keys(DEFAULT_STATE) as Array<keyof TemplateScaffoldLayoutState>
  keys.forEach(key => {
    safeWrite(storageKey(options.storageKeyPrefix, key), String(state[key]))
  })
}

function safeRead(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeWrite(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Ignore persistence errors to keep runtime behavior stable.
  }
}