/**
 * `createNetToolsKitUI` — one-line install for the NetToolsKit front creation
 * system (L0 of the front-creation-system spec).
 *
 * Goal: a product app becomes usable with a single `app.use(...)` that
 *   - registers every `Ds*` component globally (so screens need no imports), and
 *   - bootstraps the runtime theme (named palette) and color scheme (light/dark).
 *
 * Every DOM/runtime helper used here is SSR-safe (it guards `window`/`document`),
 * so the plugin is safe to install on the server. Installation is idempotent:
 * already-registered component names are left untouched, so re-installing or
 * installing alongside manual registrations never clobbers or warns.
 */

import type { App, Component, Plugin } from 'vue'

import * as dsComponents from '../components'
import { setNtkLocale } from '../composables/useNtkI18n'
import type { NtkLocale } from '../../core'
import {
  bootstrapColorScheme,
  setColorScheme,
  type ColorSchemeMode,
} from '../../../composables/ui/useColorScheme'
import {
  bootstrapThemeSwitcher,
  type ThemeId,
} from '../../../composables/useThemeSwitcher'

/** Color scheme accepted by the plugin. `'auto'` is an alias of `'system'`. */
export type NetToolsKitColorScheme = ColorSchemeMode | 'auto'

export interface NetToolsKitUIOptions {
  /**
   * Named runtime palette to apply on install (e.g. `'revolut'`, `'claude'`).
   * Omit to keep the current/stored theme.
   */
  readonly theme?: ThemeId
  /**
   * Light/dark behavior. `'auto'`/`'system'` follow the OS. Omit to keep the
   * current/stored preference.
   */
  readonly colorScheme?: NetToolsKitColorScheme
  /**
   * Locale for the governed built-in strings (CRUD/form/table/dialog labels
   * and validation messages). Default `'pt-BR'`; per-component label props
   * always override the dictionary. Runtime switching: `setNtkLocale()`.
   */
  readonly locale?: NtkLocale
  /**
   * Register all `Ds*` components globally. Default `true`. Set to `false` when
   * you prefer explicit per-screen imports for maximum tree-shaking.
   */
  readonly registerComponents?: boolean
}

/** Stable map of the `Ds*` component name → component, used for registration. */
export const ntkUiComponents: Readonly<Record<string, Component>> =
  dsComponents as unknown as Record<string, Component>

const normalizeColorScheme = (scheme: NetToolsKitColorScheme): ColorSchemeMode =>
  scheme === 'auto' ? 'system' : scheme

/**
 * Register every `Ds*` component on an app instance without clobbering names
 * that are already registered. Exposed for consumers that want registration
 * without the theme bootstrap.
 */
export const registerNtkUiComponents = (app: App): void => {
  for (const [name, component] of Object.entries(ntkUiComponents)) {
    if (!app.component(name)) {
      app.component(name, component)
    }
  }
}

/**
 * Create the NetToolsKit UI plugin.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createNetToolsKitUI } from '@nettoolskit/ui'
 *
 * createApp(App)
 *   .use(createNetToolsKitUI({ theme: 'revolut', colorScheme: 'auto' }))
 *   .mount('#app')
 * ```
 */
export function createNetToolsKitUI(options: NetToolsKitUIOptions = {}): Plugin {
  const { theme, colorScheme, locale, registerComponents = true } = options

  return {
    install(app: App): void {
      if (registerComponents) {
        registerNtkUiComponents(app)
      }

      if (locale) {
        setNtkLocale(locale)
      }

      // Color scheme first so the initial paint already reflects light/dark.
      bootstrapColorScheme()
      if (colorScheme) {
        setColorScheme(normalizeColorScheme(colorScheme))
      }

      if (theme) {
        bootstrapThemeSwitcher(theme)
      }
    },
  }
}