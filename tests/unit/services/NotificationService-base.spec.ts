/**
 * NotificationService base implementation — the framework-free fallback used
 * when no adapter is registered: console channel routing, type defaults and
 * the loading handle contract.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

import { NotificationService } from '../../../src/services/NotificationService'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('NotificationService (base/console)', () => {
  it('routes errors to console.error and everything else to console.warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const service = new NotificationService()

    service.success('salvo')
    service.warning('atenção')
    service.info('fyi')
    service.error('falhou')

    expect(warn).toHaveBeenCalledTimes(3)
    expect(error).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]?.[0]).toContain('[SUCCESS]')
    expect(warn.mock.calls[1]?.[0]).toContain('[WARNING]')
    expect(warn.mock.calls[2]?.[0]).toContain('[INFO]')
    expect(error.mock.calls[0]?.[0]).toContain('[ERROR]')
  })

  it('lets explicit options override the per-type defaults', () => {
    const service = new NotificationService()
    const notify = vi.spyOn(service, 'notify')

    service.success('ok', { icon: 'custom_icon', timeout: 999 })

    expect(notify).toHaveBeenCalledWith(expect.objectContaining({
      message: 'ok',
      type: 'success',
      icon: 'custom_icon',
      timeout: 999,
    }))
  })

  it('honors a constructor timeout config for non-error types', () => {
    const service = new NotificationService({ timeout: 1500 })
    const notify = vi.spyOn(service, 'notify')

    service.info('fyi')

    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ timeout: 1500 }))
  })

  it('loading returns a dismissible handle', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const service = new NotificationService()

    const handle = service.loading('processando')
    expect(warn.mock.calls[0]?.[0]).toContain('processando')

    handle.dismiss()
    expect(warn.mock.calls.at(-1)?.[0]).toContain('Dismissed')
  })
})