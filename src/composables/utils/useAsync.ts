/**
 * useAsync - Vue composable for managing asynchronous operation state.
 *
 * Reactive wrapper for asynchronous functions with loading/error/data states.
 * Simplifies API call management in Vue components.
 *
 * @layer Composables/Utils
 */

import { ref, type Ref } from 'vue'

export interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export interface UseAsyncReturn<T> {
  loading: Ref<boolean>
  error: Ref<Error | null>
  data: Ref<T | null>
  execute: () => Promise<void>
}

/**
 * Composable useAsync
 *
 * Manages asynchronous operation state with Vue reactivity.
 *
 * @param fn - Async function to execute
 * @param options - Configuration options
 *
 * @example
 * const { loading, error, data, execute } = useAsync(
 *   async () => {
 *     const response = await fetch('/api/users')
 *     return response.json()
 *   },
 *   {
 *     immediate: true,
 *     onSuccess: (users) => console.log('Loaded:', users),
 *     onError: (err) => console.error('Failed:', err)
 *   }
 * )
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const { immediate = false, onSuccess, onError } = options

  const loading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref(null) as Ref<T | null>

  const execute = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const result = await fn()
      data.value = result

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      error.value = err as Error

      if (onError) {
        onError(err as Error)
      }
    } finally {
      loading.value = false
    }
  }

  // Executes immediately when configured.
  if (immediate) {
    execute()
  }

  return {
    loading,
    error,
    data,
    execute
  }
}
