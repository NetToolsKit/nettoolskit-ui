/**
 * Async Utilities - Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { retry, timeout, parallel, sequential, race } from '../../../src/utils/async'

describe('async utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ============================================================================
  describe('retry()', () => {
    it('should return result on first success', async () => {
      const fn = vi.fn().mockResolvedValue('success')

      const resultPromise = retry(fn, 3, 100)
      await vi.runAllTimersAsync()
      const result = await resultPromise

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success')

      const resultPromise = retry(fn, 3, 100)
      await vi.runAllTimersAsync()
      const result = await resultPromise

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should throw after max retries', async () => {
      // Arrange
      const fn = vi.fn().mockRejectedValue(new Error('always fails'))

      // Act
      const resultPromise = retry(fn, 2, 100)
      resultPromise.catch(() => {})
      await vi.runAllTimersAsync()

      // Assert
      await expect(resultPromise).rejects.toThrow('always fails')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should use exponential backoff', async () => {
      // Arrange
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')

      // Act
      const resultPromise = retry(fn, 3, 100)
      expect(fn).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(100)
      expect(fn).toHaveBeenCalledTimes(2)

      await vi.advanceTimersByTimeAsync(200)
      expect(fn).toHaveBeenCalledTimes(3)

      // Assert
      const result = await resultPromise
      expect(result).toBe('success')
    })
  })

  // ============================================================================
  describe('timeout()', () => {
    it('should return result if promise resolves before timeout', async () => {
      // Arrange
      const promise = Promise.resolve('success')

      // Act
      const result = await timeout(promise, 1000)

      // Assert
      expect(result).toBe('success')
    })

    it('should throw if promise takes longer than timeout', async () => {
      // Arrange
      const slowPromise = new Promise(resolve => {
        setTimeout(() => resolve('slow'), 2000)
      })

      // Act
      const resultPromise = timeout(slowPromise, 1000)
      resultPromise.catch(() => {})
      await vi.advanceTimersByTimeAsync(1000)

      // Assert
      await expect(resultPromise).rejects.toThrow('Operation timed out after 1000ms')
      await vi.advanceTimersByTimeAsync(1000)
    })

    it('should propagate errors from the promise', async () => {
      // Arrange
      const failingPromise = Promise.reject(new Error('promise error'))

      // Act & Assert
      await expect(timeout(failingPromise, 1000)).rejects.toThrow('promise error')
    })
  })

  // ============================================================================
  describe('parallel()', () => {
    it('should execute all tasks in parallel', async () => {
      const task1 = vi.fn().mockResolvedValue('result1')
      const task2 = vi.fn().mockResolvedValue('result2')
      const task3 = vi.fn().mockResolvedValue('result3')

      const results = await parallel([task1, task2, task3])

      expect(results).toEqual(['result1', 'result2', 'result3'])
      expect(task1).toHaveBeenCalledTimes(1)
      expect(task2).toHaveBeenCalledTimes(1)
      expect(task3).toHaveBeenCalledTimes(1)
    })

    it('should reject if any task fails', async () => {
      const task1 = vi.fn().mockResolvedValue('result1')
      const task2 = vi.fn().mockRejectedValue(new Error('task2 failed'))
      const task3 = vi.fn().mockResolvedValue('result3')

      await expect(parallel([task1, task2, task3])).rejects.toThrow('task2 failed')
    })

    it('should return empty array for empty tasks', async () => {
      const results = await parallel([])

      expect(results).toEqual([])
    })
  })

  // ============================================================================
  describe('sequential()', () => {
    it('should execute tasks in order', async () => {
      const order: number[] = []
      const task1 = vi.fn().mockImplementation(async () => {
        order.push(1)
        return 'result1'
      })
      const task2 = vi.fn().mockImplementation(async () => {
        order.push(2)
        return 'result2'
      })
      const task3 = vi.fn().mockImplementation(async () => {
        order.push(3)
        return 'result3'
      })

      const results = await sequential([task1, task2, task3])

      expect(results).toEqual(['result1', 'result2', 'result3'])
      expect(order).toEqual([1, 2, 3])
    })

    it('should stop on first failure', async () => {
      const task1 = vi.fn().mockResolvedValue('result1')
      const task2 = vi.fn().mockRejectedValue(new Error('task2 failed'))
      const task3 = vi.fn().mockResolvedValue('result3')

      await expect(sequential([task1, task2, task3])).rejects.toThrow('task2 failed')
      expect(task3).not.toHaveBeenCalled()
    })

    it('should return empty array for empty tasks', async () => {
      const results = await sequential([])

      expect(results).toEqual([])
    })
  })

  // ============================================================================
  describe('race()', () => {
    it('should return first resolved promise', async () => {
      vi.useRealTimers()

      const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 100))
      const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 10))

      const result = await race([slow, fast])

      expect(result).toBe('fast')
    })

    it('should reject if first promise rejects', async () => {
      vi.useRealTimers()

      const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 100))
      const fastFail = new Promise((_, reject) => setTimeout(() => reject(new Error('fast fail')), 10))

      await expect(race([slow, fastFail])).rejects.toThrow('fast fail')
    })
  })
})