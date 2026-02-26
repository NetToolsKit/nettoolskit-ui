import { ref } from 'vue'

/**
 * Composable for creating debounced functions
 * Useful for search inputs and events that fire many times
 */
export function useDebouncedSearch<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
) {
  const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
  const isWaiting = ref(false)

  const debouncedFunction = (...args: Parameters<T>) => {
    isWaiting.value = true

    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }

    timeoutId.value = setTimeout(() => {
      callback(...args)
      isWaiting.value = false
      timeoutId.value = null
    }, delay)
  }

  const cancel = () => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
      isWaiting.value = false
    }
  }

  const flush = (...args: Parameters<T>) => {
    cancel()
    callback(...args)
  }

  return {
    debouncedFunction,
    isWaiting,
    cancel,
    flush
  }
}

/**
 * Composable for creating throttled functions
 * Ensures the function is executed at most once per interval
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
) {
  const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
  const lastExecuted = ref<number>(0)
  const isThrottled = ref(false)

  const throttledFunction = (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.value

    if (timeSinceLastExecution >= delay) {
      callback(...args)
      lastExecuted.value = now
      isThrottled.value = true
      
      // Clear throttled state after delay
      if (timeoutId.value) {
        clearTimeout(timeoutId.value)
      }
      
      timeoutId.value = setTimeout(() => {
        isThrottled.value = false
        timeoutId.value = null
      }, delay)
    } else {
      isThrottled.value = true
      
      if (timeoutId.value) {
        clearTimeout(timeoutId.value)
      }

      const remainingTime = delay - timeSinceLastExecution
      
      timeoutId.value = setTimeout(() => {
        callback(...args)
        lastExecuted.value = Date.now()
        isThrottled.value = false
        timeoutId.value = null
      }, remainingTime)
    }
  }

  return {
    throttledFunction,
    isThrottled
  }
}