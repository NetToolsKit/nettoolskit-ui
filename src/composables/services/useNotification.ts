/**
 * useNotification - Vue composable for notifications.
 *
 * Vue wrapper for NotificationService (Application Layer). The concrete
 * backend is pluggable through `setNotificationService()` so the root entry
 * stays free of optional peers: without any registration the base
 * NotificationService (console) is used; a host app with Quasar wires the
 * rich backend via `installQuasarServices()` from `@nettoolskit/ui/quasar`.
 *
 * This composable follows Clean Architecture boundaries:
 * - Presentation (composable) -> Application (service) -> Infrastructure (adapter)
 *
 * @example
 * const { success, error, warning, info } = useNotification()
 * success('Data saved successfully!')
 * error('Could not process request')
 *
 * @layer Presentation
 */

import { getNotificationService } from '../../services/NotificationService'
import type { NotificationOptions, NotificationHandle } from '../../services/NotificationService'

/**
 * Composable useNotification
 *
 * Returns typed notification service methods for Vue components. The backend
 * is resolved lazily per call, so a registration made during app install is
 * honored even by composables created earlier.
 *
 * @returns Object with typed notification methods.
 */
export function useNotification() {
  const success = (message: string, options?: Partial<NotificationOptions>) => {
    getNotificationService().success(message, options)
  }

  const error = (message: string, options?: Partial<NotificationOptions>) => {
    getNotificationService().error(message, options)
  }

  const warning = (message: string, options?: Partial<NotificationOptions>) => {
    getNotificationService().warning(message, options)
  }

  const info = (message: string, options?: Partial<NotificationOptions>) => {
    getNotificationService().info(message, options)
  }

  const notify = (options: NotificationOptions) => {
    getNotificationService().notify(options)
  }

  const loading = (message?: string): NotificationHandle => {
    return getNotificationService().loading(message)
  }

  return {
    success,
    error,
    warning,
    info,
    notify,
    loading
  }
}