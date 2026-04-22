/**
 * useNotification - Vue composable for notifications.
 * 
 * Vue wrapper for NotificationService (Application Layer).
 * Uses QuasarNotificationAdapter (Infrastructure) as the concrete implementation.
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

import { getQuasarNotificationService } from '../../adapters/QuasarNotificationAdapter'
import type { NotificationOptions, NotificationHandle } from '../../services/NotificationService'

/**
 * Composable useNotification
 * 
 * Returns typed notification service methods for Vue components.
 * 
 * @returns Object with typed notification methods.
 */
export function useNotification() {
  // Get service instance (via Quasar adapter)
  const notificationService = getQuasarNotificationService()

  /**
   * Success notification (green)
   */
  const success = (message: string, options?: Partial<NotificationOptions>) => {
    notificationService.success(message, options)
  }

  /**
   * Error notification (red)
   */
  const error = (message: string, options?: Partial<NotificationOptions>) => {
    notificationService.error(message, options)
  }

  /**
   * Warning notification (orange/yellow)
   */
  const warning = (message: string, options?: Partial<NotificationOptions>) => {
    notificationService.warning(message, options)
  }

  /**
   * Info notification (blue)
   */
  const info = (message: string, options?: Partial<NotificationOptions>) => {
    notificationService.info(message, options)
  }

  /**
   * Custom notification
   */
  const notify = (options: NotificationOptions) => {
    notificationService.notify(options)
  }

  /**
   * Loading notification (spinner)
   */
  const loading = (message?: string): NotificationHandle => {
    return notificationService.loading(message)
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
