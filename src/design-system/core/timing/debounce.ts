/**
 * Framework-free debounce / throttle factories.
 *
 * Pure timing logic extracted from the Vue `useDebounce` composable so it can be
 * reused by any framework binding (the composable is now a thin reactive shell
 * over these). No Vue, no DOM — only the host `setTimeout`/`clearTimeout`
 * globals, which exist in every JS runtime.
 *
 * @layer core (framework-free)
 * @see docs/architecture/core-extraction-migration-map.md
 */

type AnyArgs = any[]

export interface Debouncer<A extends AnyArgs> {
  /** Schedule the callback, resetting any pending invocation. */
  invoke: (...args: A) => void
  /** Cancel a pending invocation without firing it. */
  cancel: () => void
  /** Run the callback immediately and cancel any pending invocation. */
  flush: (...args: A) => void
  /** True while an invocation is scheduled but not yet fired. */
  readonly isWaiting: boolean
}

export interface Throttler<A extends AnyArgs> {
  /** Invoke at most once per `delay`, leading + trailing. */
  invoke: (...args: A) => void
  /** True while inside a throttle window. */
  readonly isThrottled: boolean
}

/**
 * Create a debouncer: the callback fires only after `delay` ms have elapsed
 * since the last `invoke`. `onWaitingChange` lets a reactive shell mirror the
 * waiting flag into framework state without this module depending on it.
 */
export function createDebouncer<A extends AnyArgs>(
  callback: (...args: A) => void,
  delay = 300,
  onWaitingChange?: (waiting: boolean) => void,
): Debouncer<A> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let waiting = false

  const setWaiting = (value: boolean) => {
    waiting = value
    onWaitingChange?.(value)
  }

  const clear = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const invoke = (...args: A) => {
    setWaiting(true)
    clear()
    timeoutId = setTimeout(() => {
      callback(...args)
      timeoutId = null
      setWaiting(false)
    }, delay)
  }

  const cancel = () => {
    if (timeoutId !== null) {
      clear()
      setWaiting(false)
    }
  }

  const flush = (...args: A) => {
    cancel()
    callback(...args)
  }

  return {
    invoke,
    cancel,
    flush,
    get isWaiting() {
      return waiting
    },
  }
}

/**
 * Create a throttler: the callback fires immediately, then at most once per
 * `delay` ms (trailing call carries the most recent args). Mirrors the original
 * `useThrottle` semantics exactly.
 */
export function createThrottler<A extends AnyArgs>(
  callback: (...args: A) => void,
  delay = 300,
  onThrottledChange?: (throttled: boolean) => void,
): Throttler<A> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastExecuted = 0
  let throttled = false

  const setThrottled = (value: boolean) => {
    throttled = value
    onThrottledChange?.(value)
  }

  const clear = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const invoke = (...args: A) => {
    const now = Date.now()
    const elapsed = now - lastExecuted

    if (elapsed >= delay) {
      callback(...args)
      lastExecuted = now
      setThrottled(true)
      clear()
      timeoutId = setTimeout(() => {
        setThrottled(false)
        timeoutId = null
      }, delay)
    } else {
      setThrottled(true)
      clear()
      const remaining = delay - elapsed
      timeoutId = setTimeout(() => {
        callback(...args)
        lastExecuted = Date.now()
        setThrottled(false)
        timeoutId = null
      }, remaining)
    }
  }

  return {
    invoke,
    get isThrottled() {
      return throttled
    },
  }
}