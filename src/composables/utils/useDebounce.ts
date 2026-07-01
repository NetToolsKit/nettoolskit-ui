/**
 * useDebounce - Vue reactive shells over the framework-free timing core.
 *
 * The debounce/throttle algorithm lives in `design-system/core/timing` (pure,
 * portable to any framework). These composables only add Vue reactivity: they
 * mirror the core's waiting/throttled flags into refs so templates can react.
 *
 * @layer Presentation (thin shell over core/timing)
 */

import { ref } from 'vue'

import { createDebouncer, createThrottler } from '../../design-system/core/timing'

/**
 * Composable for creating debounced functions.
 * Useful for search inputs and events that fire many times.
 */
export function useDebouncedSearch<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
) {
  const isWaiting = ref(false)
  const debouncer = createDebouncer<Parameters<T>>(
    callback,
    delay,
    (waiting) => { isWaiting.value = waiting }
  )

  return {
    debouncedFunction: debouncer.invoke,
    isWaiting,
    cancel: debouncer.cancel,
    flush: debouncer.flush
  }
}

/**
 * Composable for creating throttled functions.
 * Ensures the function is executed at most once per interval.
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
) {
  const isThrottled = ref(false)
  const throttler = createThrottler<Parameters<T>>(
    callback,
    delay,
    (throttled) => { isThrottled.value = throttled }
  )

  return {
    throttledFunction: throttler.invoke,
    isThrottled
  }
}