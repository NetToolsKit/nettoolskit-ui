/**
 * Samples runtime/main module.
 *
 * Mounts the samples root, whose default landing surface is the Design System
 * showcase. The existing demo apps (Catálogo/Industrial/Usuários/E-commerce in
 * the PlaTEA shell) stay reachable from the showcase top bar.
 */

import { bootstrapColorScheme } from '../src/composables/ui/useColorScheme'
import { bootstrapThemeSwitcher } from '../src/composables/useThemeSwitcher'
import SamplesRoot from './SamplesRoot.vue'
import { mountSamplesHost } from './shared/mountSamplesHost'

mountSamplesHost(SamplesRoot, () => {
  bootstrapThemeSwitcher()
  bootstrapColorScheme()
})