/**
 * useNotification — pluggable backend resolution (optional-peer surface).
 * The composable must resolve its backend lazily so a registration made at
 * app-install time is honored by wrappers created earlier, and the default
 * (no registration) must be the framework-free base service.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

import { useNotification } from '../../../src/composables/services/useNotification'
import {
  NotificationService,
  getNotificationService,
  setNotificationService,
} from '../../../src/services/NotificationService'

afterEach(() => {
  setNotificationService(new NotificationService())
  vi.restoreAllMocks()
})

describe('useNotification backend resolution', () => {
  it('falls back to the base (console) service without any registration', () => {
    setNotificationService(new NotificationService())
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    useNotification().success('saved')

    expect(getNotificationService()).toBeInstanceOf(NotificationService)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('saved'))
  })

  it('honors a backend registered after the composable was created', () => {
    const { success } = useNotification()

    const calls: string[] = []
    class RecordingService extends NotificationService {
      override notify(options: { message: string }): void {
        calls.push(options.message)
      }
    }
    setNotificationService(new RecordingService())

    success('late binding works')

    expect(calls).toEqual(['late binding works'])
  })
})