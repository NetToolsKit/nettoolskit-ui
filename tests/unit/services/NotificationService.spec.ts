/**
 * NotificationService - Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationOptions {
  message: string
  type?: NotificationType
  timeout?: number
  position?: string
  actions?: Array<{ label: string; handler: () => void }>
}

class MockNotificationService {
  private notifications: NotificationOptions[] = []
  private adapter: any = null

  setAdapter(adapter: any) {
    this.adapter = adapter
  }

  notify(options: NotificationOptions) {
    this.notifications.push(options)
    if (this.adapter) {
      this.adapter.notify(options)
    }
  }

  success(message: string, options?: Partial<NotificationOptions>) {
    this.notify({ message, type: 'success', ...options })
  }

  error(message: string, options?: Partial<NotificationOptions>) {
    this.notify({ message, type: 'error', ...options })
  }

  warning(message: string, options?: Partial<NotificationOptions>) {
    this.notify({ message, type: 'warning', ...options })
  }

  info(message: string, options?: Partial<NotificationOptions>) {
    this.notify({ message, type: 'info', ...options })
  }

  getNotifications() {
    return this.notifications
  }

  clear() {
    this.notifications = []
  }
}

describe('NotificationService', () => {
  let service: MockNotificationService

  beforeEach(() => {
    service = new MockNotificationService()
  })

  describe('notify()', () => {
    it('should add notification to queue', () => {
      service.notify({ message: 'Test notification' })

      const notifications = service.getNotifications()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].message).toBe('Test notification')
    })

    it('should call adapter when set', () => {
      const mockAdapter = {
        notify: vi.fn()
      }
      service.setAdapter(mockAdapter)

      service.notify({ message: 'Test' })

      expect(mockAdapter.notify).toHaveBeenCalledWith({ message: 'Test' })
    })

    it('should accept all options', () => {
      const options: NotificationOptions = {
        message: 'Full options test',
        type: 'success',
        timeout: 5000,
        position: 'top-right',
        actions: [{ label: 'Undo', handler: vi.fn() }]
      }

      service.notify(options)

      const notifications = service.getNotifications()
      expect(notifications[0]).toEqual(options)
    })
  })

  describe('success()', () => {
    it('should create success notification', () => {
      service.success('Operation completed')

      const notifications = service.getNotifications()
      expect(notifications[0].type).toBe('success')
      expect(notifications[0].message).toBe('Operation completed')
    })

    it('should merge additional options', () => {
      service.success('Success', { timeout: 3000 })

      const notifications = service.getNotifications()
      expect(notifications[0].timeout).toBe(3000)
    })
  })

  describe('error()', () => {
    it('should create error notification', () => {
      service.error('Something went wrong')

      const notifications = service.getNotifications()
      expect(notifications[0].type).toBe('error')
      expect(notifications[0].message).toBe('Something went wrong')
    })
  })

  describe('warning()', () => {
    it('should create warning notification', () => {
      service.warning('Please review your input')

      const notifications = service.getNotifications()
      expect(notifications[0].type).toBe('warning')
      expect(notifications[0].message).toBe('Please review your input')
    })
  })

  describe('info()', () => {
    it('should create info notification', () => {
      service.info('New update available')

      const notifications = service.getNotifications()
      expect(notifications[0].type).toBe('info')
      expect(notifications[0].message).toBe('New update available')
    })
  })

  describe('clear()', () => {
    it('should clear all notifications', () => {
      service.success('Test 1')
      service.error('Test 2')
      service.warning('Test 3')

      expect(service.getNotifications()).toHaveLength(3)

      service.clear()

      expect(service.getNotifications()).toHaveLength(0)
    })
  })

  describe('multiple notifications', () => {
    it('should handle multiple notifications', () => {
      service.success('Success 1')
      service.success('Success 2')
      service.error('Error 1')
      service.info('Info 1')

      const notifications = service.getNotifications()
      expect(notifications).toHaveLength(4)
      expect(notifications.filter(n => n.type === 'success')).toHaveLength(2)
      expect(notifications.filter(n => n.type === 'error')).toHaveLength(1)
      expect(notifications.filter(n => n.type === 'info')).toHaveLength(1)
    })
  })

  describe('actions', () => {
    it('should support action buttons', () => {
      const undoHandler = vi.fn()

      service.notify({
        message: 'Item deleted',
        type: 'success',
        actions: [{ label: 'Undo', handler: undoHandler }]
      })

      const notifications = service.getNotifications()
      expect(notifications[0].actions).toHaveLength(1)
      expect(notifications[0].actions![0].label).toBe('Undo')

      notifications[0].actions![0].handler()
      expect(undoHandler).toHaveBeenCalled()
    })

    it('should support multiple actions', () => {
      const action1 = vi.fn()
      const action2 = vi.fn()

      service.notify({
        message: 'Confirm action',
        type: 'warning',
        actions: [
          { label: 'Confirm', handler: action1 },
          { label: 'Cancel', handler: action2 }
        ]
      })

      const notifications = service.getNotifications()
      expect(notifications[0].actions).toHaveLength(2)
    })
  })
})