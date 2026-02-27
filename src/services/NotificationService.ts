/**
 * NotificationService - Serviço de Application Layer para notificações
 * 
 * Este serviço encapsula a lógica de notificações sem dependência direta
 * de frameworks de UI. A implementação concreta (Quasar) fica na infraestrutura.
 * 
 * Segue Clean Architecture: Application Layer não deve depender de Presentation.
 * 
 * @layer Application
 */

/**
 * Tipos de notificação suportados
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * Posições disponíveis para notificações
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
 * Ação customizada em notificação
 */
export interface NotificationAction {
  label?: string
  icon?: string
  color?: string
  handler?: () => void
}

/**
 * Interface do serviço de notificações (Port)
 * 
 * Permite inversão de dependência: Application define contrato,
 * Infrastructure implementa detalhes (Quasar, Toastify, etc)
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
 * Implementação concreta do NotificationService
 * 
 * Esta é uma implementação base. Para usar com Quasar, Angular Material, etc,
 * criar adapters específicos em infrastructure/adapters/
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
      timeout: 5000, // Erros ficam mais tempo
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

  loading(message: string = 'Carregando...'): NotificationHandle {
    console.warn(`[LOADING] ${message}`)
    
    return {
      dismiss: () => console.warn('[LOADING] Dismissed')
    }
  }
}

/**
 * Factory para criar instância singleton do serviço
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
 * Permite configurar instância customizada (útil para testes e DI)
 */
export function setNotificationService(service: NotificationService): void {
  notificationServiceInstance = service
}