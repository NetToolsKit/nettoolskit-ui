/**
 * Tests for the L0 install plugin (`createNetToolsKitUI`).
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h } from 'vue'

import {
  createNetToolsKitUI,
  ntkUiComponents,
  registerNtkUiComponents,
} from '@/design-system/vue'

const makeApp = () => createApp(defineComponent({ render: () => h('div') }))

const resetDom = () => {
  delete document.documentElement.dataset.colorScheme
  delete document.documentElement.dataset.theme
  try {
    localStorage.clear()
  } catch {
    /* ignore */
  }
}

beforeEach(resetDom)

describe('createNetToolsKitUI', () => {
  it('registers every Ds* component globally by default', () => {
    const app = makeApp()
    app.use(createNetToolsKitUI())

    const names = Object.keys(ntkUiComponents)
    expect(names).toContain('DsButton')
    expect(names.length).toBeGreaterThanOrEqual(15)
    for (const name of names) {
      expect(app.component(name), `${name} should be registered`).toBeTruthy()
    }
  })

  it('skips registration when registerComponents is false', () => {
    const app = makeApp()
    app.use(createNetToolsKitUI({ registerComponents: false }))
    expect(app.component('DsButton')).toBeUndefined()
  })

  it('applies an explicit dark color scheme', () => {
    makeApp().use(createNetToolsKitUI({ colorScheme: 'dark' }))
    expect(document.documentElement.dataset.colorScheme).toBe('dark')
  })

  it('treats "auto" as system (no explicit color-scheme attribute)', () => {
    document.documentElement.dataset.colorScheme = 'dark'
    makeApp().use(createNetToolsKitUI({ colorScheme: 'auto' }))
    expect(document.documentElement.dataset.colorScheme).toBeUndefined()
  })

  it('applies a named runtime theme palette', () => {
    makeApp().use(createNetToolsKitUI({ theme: 'claude' }))
    expect(document.documentElement.dataset.theme).toBe('claude')
  })

  it('is idempotent and does not clobber a pre-registered component name', () => {
    const app = makeApp()
    const custom = defineComponent({ name: 'DsButton', render: () => h('button') })
    app.component('DsButton', custom)

    const plugin = createNetToolsKitUI()
    expect(() => {
      app.use(plugin)
      app.use(plugin)
    }).not.toThrow()

    expect(app.component('DsButton')).toBe(custom)
  })

  it('registerNtkUiComponents registers without touching the theme', () => {
    const app = makeApp()
    registerNtkUiComponents(app)
    expect(app.component('DsTable')).toBeTruthy()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})