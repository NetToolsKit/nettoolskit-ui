/**
 * Optional-quasar surface — useResponsive breakpoints and the Notify adapter,
 * exercised against a mocked quasar module (the peer is optional; tests must
 * not depend on a real Quasar install at runtime).
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

const screenState = {
  xs: false,
  sm: false,
  md: true,
  lg: false,
  xl: false,
  width: 1200,
  height: 800,
}

const notifyCreate = vi.fn()

vi.mock('quasar', () => ({
  useQuasar: () => ({ screen: screenState }),
  Notify: { create: (options: unknown) => notifyCreate(options) },
}))

import { useResponsive } from '../../../src/composables/ui/useResponsive'
import {
  QuasarNotificationAdapter,
  getQuasarNotificationService,
} from '../../../src/adapters/QuasarNotificationAdapter'

beforeEach(() => {
  notifyCreate.mockReset()
  Object.assign(screenState, {
    xs: false, sm: false, md: true, lg: false, xl: false, width: 1200, height: 800,
  })
})

describe('useResponsive', () => {
  it('derives device classes and helpers from the md breakpoint', () => {
    const r = useResponsive()

    expect(r.isMobile.value).toBe(false)
    expect(r.isTablet.value).toBe(false)
    expect(r.isDesktop.value).toBe(true)
    expect(r.isLargeDesktop.value).toBe(false)
    expect(r.currentBreakpoint.value).toBe('md')
    expect(r.shouldShowDrawer.value).toBe(true)
    expect(r.drawerBehavior.value).toBe('desktop')
    expect(r.tableMode.value).toBe('table')
    expect(r.isLandscape.value).toBe(true)
    expect(r.isPortrait.value).toBe(false)
    expect(r.screenWidth.value).toBe(1200)
    expect(r.screenHeight.value).toBe(800)
  })

  it('flips to the mobile posture on xs and reports each breakpoint name', () => {
    Object.assign(screenState, { xs: true, md: false, width: 360, height: 720 })
    const r = useResponsive()

    expect(r.isMobile.value).toBe(true)
    expect(r.currentBreakpoint.value).toBe('xs')
    expect(r.drawerBehavior.value).toBe('mobile')
    expect(r.tableMode.value).toBe('list')
    expect(r.isPortrait.value).toBe(true)

    Object.assign(screenState, { xs: false, sm: true })
    expect(useResponsive().currentBreakpoint.value).toBe('sm')
    Object.assign(screenState, { sm: false, lg: true })
    expect(useResponsive().currentBreakpoint.value).toBe('lg')
    Object.assign(screenState, { lg: false, xl: true })
    expect(useResponsive().currentBreakpoint.value).toBe('xl')
    Object.assign(screenState, { xl: false })
    expect(useResponsive().currentBreakpoint.value).toBe('unknown')
  })
})

describe('QuasarNotificationAdapter', () => {
  it('maps service types to Quasar Notify types with error persistence', () => {
    const adapter = new QuasarNotificationAdapter()

    adapter.success('salvo')
    expect(notifyCreate).toHaveBeenLastCalledWith(expect.objectContaining({
      type: 'positive',
      message: 'salvo',
      textColor: 'white',
    }))

    adapter.error('falhou')
    expect(notifyCreate).toHaveBeenLastCalledWith(expect.objectContaining({
      type: 'negative',
      timeout: 5000,
    }))

    adapter.warning('cuidado')
    expect(notifyCreate).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'warning' }))

    adapter.info('fyi')
    expect(notifyCreate).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'info' }))
  })

  it('forwards custom actions after the built-in close action', () => {
    const handler = vi.fn()
    new QuasarNotificationAdapter().notify({
      message: 'com ação',
      type: 'info',
      actions: [{ label: 'Desfazer', handler }],
    })

    const options = notifyCreate.mock.calls.at(-1)?.[0] as { actions: Array<{ label?: string }> }
    expect(options.actions.length).toBe(2)
    expect(options.actions[1]?.label).toBe('Desfazer')
  })

  it('loading returns a handle that dismisses the ongoing notification', () => {
    const dismissSpy = vi.fn()
    notifyCreate.mockReturnValueOnce(dismissSpy)

    const handle = new QuasarNotificationAdapter().loading('processando')
    expect(notifyCreate).toHaveBeenLastCalledWith(expect.objectContaining({
      type: 'ongoing',
      spinner: true,
      timeout: 0,
    }))

    handle.dismiss()
    expect(dismissSpy).toHaveBeenCalledTimes(1)
  })

  it('getQuasarNotificationService returns a singleton', () => {
    expect(getQuasarNotificationService()).toBe(getQuasarNotificationService())
  })
})