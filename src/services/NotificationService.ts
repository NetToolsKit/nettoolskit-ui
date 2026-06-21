/**
 * NotificationService - application-layer service for notifications.
 * 
 * This service encapsulates notification behavior without a direct dependency
 * on UI frameworks. Concrete implementations live in infrastructure adapters.
 * 
 * Clean Architecture rule: the application layer does not depend on presentation.
 * 
 * @layer Application
 */

/**
 * Supported notification types.
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * Available notification positions.
 */
export type NotificationPosition = 
  | 'top' 
  | 'top-right' 
  | 'top-left' 
  | 'bottom' 
  | 'bottom-right' 
  | 'bottom-left'
  | 'left'
  | 'right'
  | 'center'

/**
 * Notification configuration options
 */
export interface NotificationOptions {
  message: string
  type?: NotificationType
  position?: NotificationPosition
  timeout?: number
  icon?: string
  html?: boolean
  actions?: NotificationAction[]
}

/**
 * Custom notification action.
 */
export interface NotificationAction {
  label?: string
  icon?: string
  color?: string
  handler?: () => void
}

/**
 * Notification service port.
 * 
 * Enables dependency inversion: application defines the contract while
 * infrastructure implements concrete details such as Quasar or Toastify.
 */
export interface INotificationService {
  /**
   * Success notification
   */
  success(message: string, options?: Partial<NotificationOptions>): void

  /**
   * Error notification
   */
  error(message: string, options?: Partial<NotificationOptions>): void

  /**
   * Warning notification
   */
  warning(message: string, options?: Partial<NotificationOptions>): void

  /**
   * Info notification
   */
  info(message: string, options?: Partial<NotificationOptions>): void

  /**
   * Custom notification
   */
  notify(options: NotificationOptions): void

  /**
   * Loading/progress notification
   */
  loading(message?: string): NotificationHandle
}

/**
 * Handle to control notification (dismiss, update)
 */
export interface NotificationHandle {
  dismiss(): void
}

/**
 * Default service configuration
 */
export const DEFAULT_NOTIFICATION_CONFIG = {
  position: 'top-right' as NotificationPosition,
  timeout: 3000,
  html: false
}

/**
 * Base NotificationService implementation.
 * 
 * Specific UI frameworks should provide adapters in infrastructure/adapters.
 */
export class NotificationService implements INotificationService {
  private config: typeof DEFAULT_NOTIFICATION_CONFIG

  constructor(config?: Partial<typeof DEFAULT_NOTIFICATION_CONFIG>) {
    this.config = { ...DEFAULT_NOTIFICATION_CONFIG, ...config }
  }

  success(message: string, options?: Partial<NotificationOptions>): void {
    this.notify({
      message,
      type: 'success',
      icon: 'check_circle',
      timeout: this.config.timeout,
      ...options
    })
  }

  error(message: string, options?: Partial<NotificationOptions>): void {
    this.notify({
      message,
      type: 'error',
      icon: 'error',
      timeout: 5000,
      ...options
    })
  }

  warning(message: string, options?: Partial<NotificationOptions>): void {
    this.notify({
      message,
      type: 'warning',
      icon: 'warning',
      timeout: this.config.timeout,
      ...options
    })
  }

  info(message: string, options?: Partial<NotificationOptions>): void {
    this.notify({
      message,
      type: 'info',
      icon: 'info',
      timeout: this.config.timeout,
      ...options
    })
  }

  notify(options: NotificationOptions): void {
    // Base implementation (console.log)
    // Concrete adapter (Quasar) will be created in infrastructure
    const { type = 'info', message, icon } = options
    const log = type === 'error' ? console.error : console.warn
    log(`[${type.toUpperCase()}] ${icon ? icon + ' ' : ''}${message}`)
  }

  loading(message: string = 'Loading...'): NotificationHandle {
    console.warn(`[LOADING] ${message}`)
    
    return {
      dismiss: () => console.warn('[LOADING] Dismissed')
    }
  }
}

/**
 * Singleton service instance.
 */
let notificationServiceInstance: NotificationService | null = null

/**
 * Handles get notification service.
 */
export function getNotificationService(): NotificationService {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService()
  }
  return notificationServiceInstance
}

/**
 * Allows tests and dependency injection to provide a custom instance.
 */
export function setNotificationService(service: NotificationService): void {
  notificationServiceInstance = service
}
