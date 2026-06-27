/**
 * Samples runtime/main module.
 *
 * The living design-system CATALOG is the default samples view. It owns the
 * reference theme axes (theme/brand/density/font) on <html>, so the legacy
 * `bootstrapThemeSwitcher` (which would set data-theme='revolut') is NOT run
 * here — the catalog applies the reference light/purple palette on mount.
 *
 * The legacy library sample app stays reachable via ?view=legacy for reference.
 */

import { bootstrapThemeSwitcher } from '../src/composables/useThemeSwitcher'
import CatalogApp from './catalog/CatalogApp.vue'
import LibrarySampleApp from './LibrarySampleApp.vue'
import { mountSamplesHost } from './shared/mountSamplesHost'

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
const isLegacy = params?.get('view') === 'legacy'

if (isLegacy) {
  mountSamplesHost(LibrarySampleApp, () => {
    bootstrapThemeSwitcher()
  })
} else {
  mountSamplesHost(CatalogApp)
}