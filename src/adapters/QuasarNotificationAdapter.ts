/**
 * QuasarNotificationAdapter - Implementação Infrastructure para Quasar
 * 
 * Adapta o NotificationService para usar Quasar Notify.
 * Esta camada contém dependências de framework (Quasar).
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
 * Mapeamento de tipos para cores Quasar
 */
const TYPE_TO_QUASAR_TYPE: Record<NotificationType, QNotifyCreateOptions['type']> = {
  success: 'positive',
  error: 'negative',
  warning: 'warning',
  info: 'info'
}

/**
 * Adapter que implementa NotificationService usando Quasar Notify
 */
export class QuasarNotificationAdapter extends NotificationService {
  /**
   * Sobrescreve método notify para usar Quasar
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
   * Implementa loading usando Quasar Notify
   */
  loading(message: string = 'Carregando...'): NotificationHandle {
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
   * Retorna ícone padrão por tipo
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
 * Instância singleton do adapter Quasar
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