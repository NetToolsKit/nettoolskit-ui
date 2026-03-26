/**
 * Notification scaffold helpers.
 * Wraps application notification service with reusable template presets.
 */

import {
  getNotificationService,
  type INotificationService,
  type NotificationHandle,
  type NotificationOptions,
  type NotificationPosition,
  type NotificationType,
} from '../../services/NotificationService'

export interface TemplateNotificationPreset {
  id: string
  message: string
  type: NotificationType
  icon?: string
  timeout?: number
  position?: NotificationPosition
}

export interface TemplateNotificationBridgeOptions {
  service?: INotificationService
  defaultPosition?: NotificationPosition
  defaultTimeout?: number
  presets?: TemplateNotificationPreset[]
}

export interface TemplateNotificationBridge {
  success: (message: string, options?: Partial<NotificationOptions>) => void
  error: (message: string, options?: Partial<NotificationOptions>) => void
  warning: (message: string, options?: Partial<NotificationOptions>) => void
  info: (message: string, options?: Partial<NotificationOptions>) => void
  notify: (options: NotificationOptions) => void
  loading: (message?: string) => NotificationHandle
  notifyPreset: (presetId: string, overrides?: Partial<NotificationOptions>) => void
}

/**
 * Creates a template-level notification bridge with optional reusable presets.
 */
export function createTemplateNotificationBridge(
  options: TemplateNotificationBridgeOptions = {}
): TemplateNotificationBridge {
  const service = options.service ?? getNotificationService()
  const defaultPosition = options.defaultPosition ?? 'top-right'
  const defaultTimeout = options.defaultTimeout ?? 3000
  const presets = new Map<string, TemplateNotificationPreset>(
    (options.presets || []).map(preset => [preset.id, preset])
  )

  return {
    success(message, partialOptions = {}) {
      service.success(message, withPartialDefaults(partialOptions, defaultPosition, defaultTimeout))
    },
    error(message, partialOptions = {}) {
      service.error(message, withPartialDefaults(partialOptions, defaultPosition, defaultTimeout))
    },
    warning(message, partialOptions = {}) {
      service.warning(message, withPartialDefaults(partialOptions, defaultPosition, defaultTimeout))
    },
    info(message, partialOptions = {}) {
      service.info(message, withPartialDefaults(partialOptions, defaultPosition, defaultTimeout))
    },
    notify(rawOptions) {
      service.notify(withRequiredDefaults(rawOptions, defaultPosition, defaultTimeout))
    },
    loading(message = 'Loading...') {
      return service.loading(message)
    },
    notifyPreset(presetId, overrides = {}) {
      const preset = presets.get(presetId)
      if (!preset) {
        return
      }

      const baseMessage = overrides.message ?? preset.message
      const payload = withDefaults(
        {
          message: baseMessage,
          type: preset.type,
          icon: preset.icon,
          timeout: preset.timeout,
          position: preset.position,
          ...overrides,
        },
        defaultPosition,
        defaultTimeout
      )

      service.notify(payload)
    },
  }
}

function withPartialDefaults(
  options: Partial<NotificationOptions>,
  defaultPosition: NotificationPosition,
  defaultTimeout: number
): Partial<NotificationOptions> {
  return {
    type: options.type ?? 'info',
    position: options.position ?? defaultPosition,
    timeout: options.timeout ?? defaultTimeout,
    icon: options.icon,
    html: options.html,
    actions: options.actions,
  }
}

function withRequiredDefaults(
  options: NotificationOptions,
  defaultPosition: NotificationPosition,
  defaultTimeout: number
): NotificationOptions {
  return {
    ...withPartialDefaults(options, defaultPosition, defaultTimeout),
    message: options.message,
  }
}

function withDefaults(
  options: NotificationOptions,
  defaultPosition: NotificationPosition,
  defaultTimeout: number
): NotificationOptions {
  return withRequiredDefaults(options, defaultPosition, defaultTimeout)
}