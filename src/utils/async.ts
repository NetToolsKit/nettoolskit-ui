/**
 * Async Utilities - Funções utilitárias para operações assíncronas
 * 
 * Utilitários puros para trabalhar com Promises.
 * Sem dependências de framework.
 * 
 * @layer Utils
 */

/**
 * Retry - Tenta executar uma função assíncrona com retentativas
 * 
 * @param fn - Função assíncrona a ser executada
 * @param maxRetries - Número máximo de retentativas
 * @param delay - Delay entre retentativas em ms (com exponential backoff)
 * 
 * @example
 * const data = await retry(() => fetchAPI(), 3, 1000)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxRetries) {
        // Exponential backoff: delay * 2^attempt
        const backoffDelay = delay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, backoffDelay))
      }
    }
  }
  
  throw lastError!
}

/**
 * Timeout - Adiciona timeout a uma Promise
 * 
 * @param promise - Promise a ser executada
 * @param ms - Tempo limite em milissegundos
 * 
 * @example
 * const data = await timeout(fetchAPI(), 5000)
 */
export async function timeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    )
  ])
}

/**
 * Parallel - Executa múltiplas tarefas em paralelo
 * 
 * @param tasks - Array de funções que retornam Promises
 * 
 * @example
 * const results = await parallel([
 *   () => fetchUser(),
 *   () => fetchPosts(),
 *   () => fetchComments()
 * ])
 */
export async function parallel<T>(
  tasks: Array<() => Promise<T>>
): Promise<T[]> {
  return Promise.all(tasks.map(task => task()))
}

/**
 * Sequential - Executa múltiplas tarefas sequencialmente (waterfall)
 * 
 * @param tasks - Array de funções que retornam Promises
 * 
 * @example
 * const results = await sequential([
 *   () => createUser(),
 *   () => sendEmail(),
 *   () => logActivity()
 * ])
 */
export async function sequential<T>(
  tasks: Array<() => Promise<T>>
): Promise<T[]> {
  const results: T[] = []
  
  for (const task of tasks) {
    results.push(await task())
  }
  
  return results
}

/**
 * Race - Retorna a primeira Promise resolvida ou rejeitada
 * 
 * @param promises - Array de Promises
 * 
 * @example
 * const fastest = await race([
 *   fetchFromCache(),
 *   fetchFromAPI(),
 *   fetchFromBackup()
 * ])
 */
export async function race<T>(
  promises: Array<Promise<T>>
): Promise<T> {
  return Promise.race(promises)
}