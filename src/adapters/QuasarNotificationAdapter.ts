/**
 * QuasarNotificationAdapter - Quasar infrastructure implementation.
 * 
 * Adapts NotificationService to Quasar Notify.
 * This layer contains framework dependencies.
 * 
 * @layer Infrastructure
 */

import { Notify, type QNotifyCreateOptions } from 'quasar'
import { 
  NotificationService, 
  type NotificationOptions,
  type NotificationHandle,
  type NotificationType
} from '../services/NotificationService'

/**
 * Maps service notification types to Quasar notification types.
 */
const TYPE_TO_QUASAR_TYPE: Record<NotificationType, QNotifyCreateOptions['type']> = {
  success: 'positive',
  error: 'negative',
  warning: 'warning',
  info: 'info'
}

/**
 * Adapter that implements NotificationService with Quasar Notify.
 */
export class QuasarNotificationAdapter extends NotificationService {
  /**
   * Overrides notify to use Quasar.
   */
  notify(options: NotificationOptions): void {
    const {
      message,
      type = 'info',
      position = 'top-right',
      timeout = 3000,
      icon,
      html = false,
      actions = []
    } = options

    const quasarType = TYPE_TO_QUASAR_TYPE[type]
    const isNegative = type === 'error'
    const textColor = isNegative || type === 'success' ? 'white' : 'black'

    Notify.create({
      type: quasarType,
      message,
      icon: icon || this.getDefaultIcon(type),
      color: quasarType,
      textColor,
      iconColor: textColor,
      position,
      timeout: type === 'error' ? 5000 : timeout,
      progress: true,
      html,
      actions: [
        {
          icon: 'close',
          color: textColor,
          flat: true,
          round: true
        },
        ...actions.map(action => ({
          label: action.label,
          icon: action.icon,
          color: action.color || textColor,
          handler: action.handler
        }))
      ]
    })
  }

  /**
   * Implements loading feedback with Quasar Notify.
   */
  loading(message: string = 'Loading...'): NotificationHandle {
    const notifyInstance = Notify.create({
      type: 'ongoing',
      message,
      spinner: true,
      timeout: 0,
      position: 'top-right',
      group: false
    })

    return {
      dismiss: () => {
        if (typeof notifyInstance === 'function') {
          notifyInstance()
        }
      }
    }
  }

  /**
   * Returns the default icon for each notification type.
   */
  private getDefaultIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    }
    return icons[type]
  }
}

/**
 * Singleton Quasar adapter instance.
 */
let quasarNotificationInstance: QuasarNotificationAdapter | null = null

/**
 * Handles get quasar notification service.
 */
export function getQuasarNotificationService(): QuasarNotificationAdapter {
  if (!quasarNotificationInstance) {
    quasarNotificationInstance = new QuasarNotificationAdapter()
  }
  return quasarNotificationInstance
}
