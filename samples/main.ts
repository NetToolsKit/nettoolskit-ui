/**
 * Samples runtime/main module.
 */

import { bootstrapThemeSwitcher } from '../src/composables/useThemeSwitcher'
import LibrarySampleApp from './LibrarySampleApp.vue'
import { mountSamplesHost } from './shared/mountSamplesHost'

mountSamplesHost(LibrarySampleApp, () => {
  bootstrapThemeSwitcher()
})
