/**
 * Async Utilities - helpers for asynchronous operations.
 * 
 * Pure utilities for working with Promises.
 * No framework dependencies.
 * 
 * @layer Utils
 */

/**
 * Retry - attempts to execute an async function with retries.
 * 
 * @param fn - Async function to execute
 * @param maxRetries - Maximum number of retries
 * @param delay - Delay between retries in ms with exponential backoff
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
 * Timeout - adds a timeout to a Promise.
 * 
 * @param promise - Promise to execute
 * @param ms - Timeout in milliseconds
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
 * Parallel - executes multiple tasks concurrently.
 * 
 * @param tasks - Array of functions that return Promises
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
 * Sequential - executes multiple tasks sequentially (waterfall).
 * 
 * @param tasks - Array of functions that return Promises
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
 * Race - returns the first Promise that resolves or rejects.
 * 
 * @param promises - Array of Promises
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
