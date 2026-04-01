import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useDebouncedSearch, useThrottle } from '../../../src/composables/utils/useDebounce'

describe('useDebouncedSearch', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('does not call callback immediately', () => {
    const cb = vi.fn()
    const { debouncedFunction } = useDebouncedSearch(cb, 300)
    debouncedFunction('hello')
    expect(cb).not.toHaveBeenCalled()
  })

  it('calls callback after delay has elapsed', () => {
    const cb = vi.fn()
    const { debouncedFunction } = useDebouncedSearch(cb, 300)
    debouncedFunction('hello')
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledOnce()
    expect(cb).toHaveBeenCalledWith('hello')
  })

  it('resets the timer on repeated calls (debounce behavior)', () => {
    const cb = vi.fn()
    const { debouncedFunction } = useDebouncedSearch(cb, 300)
    debouncedFunction('h')
    vi.advanceTimersByTime(100)
    debouncedFunction('he')
    vi.advanceTimersByTime(100)
    debouncedFunction('hel')
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledOnce()
    expect(cb).toHaveBeenCalledWith('hel')
  })

  it('sets isWaiting to true while pending', () => {
    const cb = vi.fn()
    const { debouncedFunction, isWaiting } = useDebouncedSearch(cb, 300)
    debouncedFunction('x')
    expect(isWaiting.value).toBe(true)
    vi.advanceTimersByTime(300)
    expect(isWaiting.value).toBe(false)
  })

  it('cancel() prevents callback from firing', () => {
    const cb = vi.fn()
    const { debouncedFunction, cancel } = useDebouncedSearch(cb, 300)
    debouncedFunction('x')
    cancel()
    vi.advanceTimersByTime(300)
    expect(cb).not.toHaveBeenCalled()
  })

  it('flush() calls callback immediately and cancels pending timer', () => {
    const cb = vi.fn()
    const { debouncedFunction, flush } = useDebouncedSearch(cb, 300)
    debouncedFunction('x')
    flush('flushed')
    expect(cb).toHaveBeenCalledOnce()
    expect(cb).toHaveBeenCalledWith('flushed')
    vi.advanceTimersByTime(300)
    // No extra call after flush
    expect(cb).toHaveBeenCalledOnce()
  })
})

describe('useThrottle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls callback immediately on first invocation', () => {
    const cb = vi.fn()
    const { throttledFunction } = useThrottle(cb, 300)
    throttledFunction('x')
    expect(cb).toHaveBeenCalledOnce()
  })

  it('does not call again within the throttle window', () => {
    const cb = vi.fn()
    const { throttledFunction } = useThrottle(cb, 300)
    throttledFunction('first')
    throttledFunction('second')
    expect(cb).toHaveBeenCalledOnce()
  })

  it('calls again after throttle delay has passed', () => {
    const cb = vi.fn()
    const { throttledFunction } = useThrottle(cb, 300)
    throttledFunction('first')
    vi.advanceTimersByTime(300)
    throttledFunction('second')
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})