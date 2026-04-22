/**
 * useAsync - Composable Vue para gerenciar estado de operações assíncronas
 *
 * Wrapper reativo para funções assíncronas com estados de loading/error/data.
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
 * Gerencia estado de operações assíncronas com reatividade Vue.
 *
 * @param fn - Função assíncrona a ser executada
 * @param options - Opções de configuração
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

  // Executa imediatamente se configurado
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
