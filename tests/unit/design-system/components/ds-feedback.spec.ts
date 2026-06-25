/**
 * Feedback surface (capability-parity): DsBanner, DsToast, DsToastHost, and the
 * shared `useToast` queue.
 *
 * The visual layer is pure-DOM and token-driven; the imperative notification
 * path (`useNotification`) is unchanged. These tests assert the ARIA contract
 * (banner roles, the host live region), dismissal wiring, the host-owned toast
 * lifecycle (manual + timeout auto-dismiss), and axe cleanliness.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DsBanner, DsToast, DsToastHost } from '@/design-system/vue'
import {
  getNtkBannerRole,
  getNtkToastHostPositionClass,
  ntkToastPositions,
} from '@/design-system/core'
import {
  DEFAULT_TOAST_TIMEOUT,
  clearToasts,
  dismissToast,
  pushToast,
  useToast,
} from '@/composables/ui/useToast'

const axeOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
}

describe('DsBanner', () => {
  it('renders the default recipe classes, title, and message slot', () => {
    const wrapper = mount(DsBanner, {
      props: { title: 'Heads up' },
      slots: { default: 'Body text' },
    })

    const root = wrapper.get('.ntk-banner')
    expect(root.element.tagName).toBe('DIV')
    expect(root.classes()).toEqual(expect.arrayContaining([
      'ntk-banner--variant-soft',
      'ntk-banner--size-md',
      'ntk-banner--intent-info',
    ]))
    expect(wrapper.get('.ntk-banner__title').text()).toBe('Heads up')
    expect(wrapper.get('.ntk-banner__message').text()).toBe('Body text')
  })

  it('uses role="status" for low-urgency intents and role="alert" for danger/warning', () => {
    expect(mount(DsBanner, { props: { intent: 'info' } }).get('.ntk-banner').attributes('role')).toBe('status')
    expect(mount(DsBanner, { props: { intent: 'success' } }).get('.ntk-banner').attributes('role')).toBe('status')
    expect(mount(DsBanner, { props: { intent: 'neutral' } }).get('.ntk-banner').attributes('role')).toBe('status')
    expect(mount(DsBanner, { props: { intent: 'warning' } }).get('.ntk-banner').attributes('role')).toBe('alert')
    expect(mount(DsBanner, { props: { intent: 'danger' } }).get('.ntk-banner').attributes('role')).toBe('alert')
  })

  it('renders a decorative leading icon hidden from assistive tech', () => {
    const wrapper = mount(DsBanner, { props: { icon: '!', message: 'Note' } })
    const icon = wrapper.get('.ntk-banner__icon')
    expect(icon.text()).toBe('!')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  it('emits dismiss from a labelled close button only when dismissible', async () => {
    const plain = mount(DsBanner, { props: { message: 'x' } })
    expect(plain.find('.ntk-banner__dismiss').exists()).toBe(false)

    const wrapper = mount(DsBanner, {
      props: { message: 'x', dismissible: true, dismissLabel: 'Close banner' },
    })
    const button = wrapper.get('.ntk-banner__dismiss')
    expect(button.attributes('aria-label')).toBe('Close banner')
    await button.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('renders an actions slot', () => {
    const wrapper = mount(DsBanner, {
      props: { message: 'x' },
      slots: { actions: '<button type="button">Retry</button>' },
    })
    expect(wrapper.get('.ntk-banner__actions').text()).toBe('Retry')
  })

  it('has no accessibility violations when dismissible with actions', async () => {
    const wrapper = mount(DsBanner, {
      props: { title: 'Saved', message: 'All good', dismissible: true, intent: 'success' },
      slots: { actions: '<button type="button">Undo</button>' },
      attachTo: document.body,
    })
    await nextTick()

    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])
    wrapper.unmount()
  })
})

describe('DsToast', () => {
  it('renders message/title and a dismissible close button by default', async () => {
    const wrapper = mount(DsToast, { props: { title: 'Done', message: 'Saved' } })

    expect(wrapper.get('.ntk-toast').classes()).toEqual(expect.arrayContaining([
      'ntk-toast--variant-soft',
      'ntk-toast--intent-info',
    ]))
    expect(wrapper.get('.ntk-toast__title').text()).toBe('Done')
    expect(wrapper.get('.ntk-toast__message').text()).toBe('Saved')

    const button = wrapper.get('.ntk-toast__dismiss')
    expect(button.attributes('aria-label')).toBe('Dismiss')
    await button.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('omits the close button when not dismissible', () => {
    const wrapper = mount(DsToast, { props: { message: 'x', dismissible: false } })
    expect(wrapper.find('.ntk-toast__dismiss').exists()).toBe(false)
  })
})

describe('DsToastHost', () => {
  beforeEach(() => {
    clearToasts()
  })

  afterEach(() => {
    clearToasts()
    vi.useRealTimers()
  })

  it('renders a polite live region with the configured position class', () => {
    const wrapper = mount(DsToastHost, { props: { position: 'bottom-left' } })
    const region = wrapper.get('.ntk-toast-host')

    expect(region.attributes('role')).toBe('region')
    expect(region.attributes('aria-live')).toBe('polite')
    expect(region.attributes('aria-atomic')).toBe('false')
    expect(region.attributes('aria-label')).toBe('Notifications')
    expect(region.classes()).toContain('ntk-toast-host--position-bottom-left')
  })

  it('renders pushed toasts inside the live region', async () => {
    const wrapper = mount(DsToastHost)
    pushToast({ message: 'First', timeout: 0 })
    pushToast({ message: 'Second', title: 'Hi', timeout: 0 })
    await nextTick()

    const toasts = wrapper.findAllComponents(DsToast)
    expect(toasts).toHaveLength(2)
    expect(wrapper.get('.ntk-toast-host').text()).toContain('First')
    expect(wrapper.get('.ntk-toast-host').text()).toContain('Second')
  })

  it('removes a single toast when its close button is clicked', async () => {
    const wrapper = mount(DsToastHost)
    pushToast({ message: 'Keep me', timeout: 0 })
    pushToast({ message: 'Remove me', timeout: 0 })
    await nextTick()
    expect(wrapper.findAllComponents(DsToast)).toHaveLength(2)

    // Dismiss the second toast via its labelled button.
    await wrapper.findAllComponents(DsToast)[1].get('.ntk-toast__dismiss').trigger('click')
    await nextTick()

    const remaining = wrapper.findAllComponents(DsToast)
    expect(remaining).toHaveLength(1)
    expect(remaining[0].text()).toContain('Keep me')
  })

  it('auto-dismisses a toast after its timeout elapses', async () => {
    vi.useFakeTimers()
    const wrapper = mount(DsToastHost)
    pushToast({ message: 'Transient', timeout: 3000 })
    await nextTick()
    expect(wrapper.findAllComponents(DsToast)).toHaveLength(1)

    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(wrapper.findAllComponents(DsToast)).toHaveLength(0)
  })

  it('has no accessibility violations while announcing toasts', async () => {
    const wrapper = mount(DsToastHost, { attachTo: document.body })
    pushToast({ message: 'Accessible toast', title: 'Notice', timeout: 0 })
    await nextTick()

    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')
    expect(results.violations, summary).toEqual([])
    wrapper.unmount()
  })
})

describe('useToast queue', () => {
  beforeEach(() => {
    clearToasts()
  })

  afterEach(() => {
    clearToasts()
    vi.useRealTimers()
  })

  it('pushToast returns a unique id and appends to the reactive queue', () => {
    const { toasts } = useToast()
    const first = pushToast({ message: 'a', timeout: 0 })
    const second = pushToast({ message: 'b', timeout: 0 })

    expect(first).not.toBe(second)
    expect(toasts.value.map((t) => t.id)).toEqual([first, second])
    expect(toasts.value[0]).toMatchObject({ message: 'a', intent: 'info' })
  })

  it('dismissToast removes the matching toast and ignores unknown ids', () => {
    const { toasts } = useToast()
    const id = pushToast({ message: 'a', timeout: 0 })
    pushToast({ message: 'b', timeout: 0 })

    dismissToast('does-not-exist')
    expect(toasts.value).toHaveLength(2)

    dismissToast(id)
    expect(toasts.value.map((t) => t.message)).toEqual(['b'])
  })

  it('auto-removes a toast after the default timeout and cancels timers on manual dismiss', () => {
    vi.useFakeTimers()
    const { toasts } = useToast()

    const auto = pushToast({ message: 'auto' })
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].timeout).toBe(DEFAULT_TOAST_TIMEOUT)

    vi.advanceTimersByTime(DEFAULT_TOAST_TIMEOUT)
    expect(toasts.value).toHaveLength(0)

    // A toast dismissed before its timer fires must not throw when the timer elapses.
    const manual = pushToast({ message: 'manual', timeout: 1000 })
    dismissToast(manual)
    expect(toasts.value).toHaveLength(0)
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
    expect(auto).not.toBe(manual)
  })

  it('clearToasts empties the queue', () => {
    const { toasts } = useToast()
    pushToast({ message: 'a', timeout: 0 })
    pushToast({ message: 'b', timeout: 0 })
    expect(toasts.value).toHaveLength(2)

    clearToasts()
    expect(toasts.value).toHaveLength(0)
  })
})

describe('feedback pure helpers', () => {
  it('getNtkBannerRole maps urgency to the live role and defaults to status', () => {
    expect(getNtkBannerRole()).toBe('status')
    expect(getNtkBannerRole('info')).toBe('status')
    expect(getNtkBannerRole('success')).toBe('status')
    expect(getNtkBannerRole('primary')).toBe('status')
    expect(getNtkBannerRole('neutral')).toBe('status')
    expect(getNtkBannerRole('warning')).toBe('alert')
    expect(getNtkBannerRole('danger')).toBe('alert')
  })

  it('getNtkToastHostPositionClass maps every position and defaults to top-right', () => {
    expect(getNtkToastHostPositionClass()).toBe('ntk-toast-host--position-top-right')
    for (const position of ntkToastPositions) {
      expect(getNtkToastHostPositionClass(position)).toBe(`ntk-toast-host--position-${position}`)
    }
  })
})