/**
 * Optional Quasar integration entry (`@nettoolskit/ui/quasar`).
 *
 * Everything that statically depends on the optional `quasar` peer lives
 * behind this subpath so the root entry stays resolvable in apps that do not
 * install Quasar. Import from here only when the host app ships Quasar.
 */

import { Dark } from 'quasar'

import { getQuasarNotificationService } from './adapters/QuasarNotificationAdapter'
import { setNotificationService } from './services/NotificationService'
import { registerThemeDarkSync } from './config/theme/theme-dom'

export * from './adapters/QuasarNotificationAdapter'
export * from './composables/ui/useDialogActions'
export * from './composables/ui/useResponsive'

/**
 * Wire the optional Quasar backends into the core runtime: rich Notify-based
 * notifications for `useNotification()` and the Quasar Dark bridge for the
 * theme DOM sync. Call once during app install, after `app.use(Quasar, ...)`.
 */
export function installQuasarServices(): void {
  setNotificationService(getQuasarNotificationService())
  registerThemeDarkSync((isDark) => Dark.set(isDark))
}