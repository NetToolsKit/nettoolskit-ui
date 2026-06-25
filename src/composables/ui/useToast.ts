/**
 * useToast composable
 *
 * A module-level reactive toast queue shared across the app. `DsToastHost`
 * renders the live `toasts` list inside an `aria-live` region; product code only
 * ever calls `pushToast`/`dismissToast`. Lifecycle (auto-dismiss timers) is owned
 * here so the visual `DsToast` stays purely presentational.
 *
 * SSR-safe: timers are only scheduled in a browser (guarded `setTimeout`), so a
 * server render can enqueue toasts without leaking pending timers. The state is a
 * single module-level singleton so every caller and the single host observe the
 * same queue.
 */

import { readonly, ref } from 'vue'
import type { NtkToastIntent } from '../../design-system/core'

/** Default auto-dismiss in ms. `timeout: 0` makes a toast sticky. */
export const DEFAULT_TOAST_TIMEOUT = 5000

export interface PushToastOptions {
  readonly message: string
  readonly title?: string
  readonly intent?: NtkToastIntent
  /** Auto-dismiss delay in ms. `0` keeps the toast until dismissed manually. */
  readonly timeout?: number
}

export interface ToastRecord {
  readonly id: string
  readonly message: string
  readonly title?: string
  readonly intent: NtkToastIntent
  readonly timeout: number
}

const isBrowser = (): boolean => typeof window !== 'undefined'

const toasts = ref<ToastRecord[]>([])
const timers = new Map<string, ReturnType<typeof setTimeout>>()

let counter = 0
const nextId = (): string => {
  counter += 1
  return `ntk-toast-${counter}`
}

function clearTimer(id: string): void {
  const handle = timers.get(id)
  if (handle !== undefined) {
    clearTimeout(handle)
    timers.delete(id)
  }
}

/**
 * Remove a toast (and cancel its pending timer). No-op for an unknown id.
 */
export function dismissToast(id: string): void {
  clearTimer(id)
  const index = toasts.value.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

/**
 * Enqueue a toast and return its id. A positive `timeout` schedules
 * auto-dismiss; `timeout: 0` keeps it sticky.
 */
export function pushToast(options: PushToastOptions): string {
  const id = nextId()
  const timeout = options.timeout ?? DEFAULT_TOAST_TIMEOUT
  toasts.value.push({
    id,
    message: options.message,
    title: options.title,
    intent: options.intent ?? 'info',
    timeout,
  })

  if (timeout > 0 && isBrowser()) {
    timers.set(id, setTimeout(() => dismissToast(id), timeout))
  }

  return id
}

/** Remove every active toast and cancel all pending timers. */
export function clearToasts(): void {
  for (const id of [...timers.keys()]) {
    clearTimer(id)
  }
  toasts.value = []
}

/**
 * Reactive toast control. Returns the shared singleton queue and actions.
 */
export function useToast() {
  return {
    toasts: readonly(toasts),
    pushToast,
    dismissToast,
    clearToasts,
  }
}