import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createDebouncer, createThrottler } from '../../../../src/design-system/core/timing'

describe('createDebouncer (core/timing)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('does not invoke the callback immediately', () => {
    const cb = vi.fn()
    const d = createDebouncer(cb, 300)
    d.invoke('a')
    expect(cb).not.toHaveBeenCalled()
    expect(d.isWaiting).toBe(true)
  })

  it('invokes once after the delay with the latest args', () => {
    const cb = vi.fn()
    const d = createDebouncer(cb, 300)
    d.invoke('a')
    vi.advanceTimersByTime(100)
    d.invoke('b')
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledOnce()
    expect(cb).toHaveBeenCalledWith('b')
    expect(d.isWaiting).toBe(false)
  })

  it('reports waiting transitions through the onWaitingChange hook', () => {
    const states: boolean[] = []
    const d = createDebouncer(vi.fn(), 300, (w) => states.push(w))
    d.invoke('x')
    vi.advanceTimersByTime(300)
    expect(states).toEqual([true, false])
  })

  it('cancel() clears a pending invocation and resets waiting', () => {
    const cb = vi.fn()
    const d = createDebouncer(cb, 300)
    d.invoke('x')
    d.cancel()
    expect(d.isWaiting).toBe(false)
    vi.advanceTimersByTime(300)
    expect(cb).not.toHaveBeenCalled()
  })

  it('cancel() with nothing pending is a no-op', () => {
    const cb = vi.fn()
    const d = createDebouncer(cb, 300)
    expect(() => d.cancel()).not.toThrow()
    expect(d.isWaiting).toBe(false)
  })

  it('flush() invokes immediately and prevents the trailing call', () => {
    const cb = vi.fn()
    const d = createDebouncer(cb, 300)
    d.invoke('x')
    d.flush('y')
    expect(cb).toHaveBeenCalledOnce()
    expect(cb).toHaveBeenCalledWith('y')
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledOnce()
  })
})

describe('createThrottler (core/timing)', () => {
  // No setSystemTime here: fake timers start at the current wall clock, so the
  // very first invoke sees a large `now - lastExecuted(0)` gap and takes the
  // leading (immediate) branch — matching real usage. Pinning the clock to 0
  // would make the first call fall into the trailing branch instead.
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('invokes immediately on the first call (leading)', () => {
    const cb = vi.fn()
    const t = createThrottler(cb, 300)
    t.invoke('a')
    expect(cb).toHaveBeenCalledOnce()
    expect(t.isThrottled).toBe(true)
  })

  it('coalesces calls inside the window into one trailing call', () => {
    const cb = vi.fn()
    const t = createThrottler(cb, 300)
    t.invoke('first')
    t.invoke('second')
    expect(cb).toHaveBeenCalledOnce()
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenLastCalledWith('second')
    expect(t.isThrottled).toBe(false)
  })

  it('invokes again after the window elapses (leading of next window)', () => {
    const cb = vi.fn()
    const t = createThrottler(cb, 300)
    t.invoke('first')
    vi.advanceTimersByTime(300)
    t.invoke('second')
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('clears the trailing timer when superseded inside the window', () => {
    const cb = vi.fn()
    const t = createThrottler(cb, 300)
    t.invoke('lead')
    t.invoke('a')
    t.invoke('b')
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenLastCalledWith('b')
  })
})