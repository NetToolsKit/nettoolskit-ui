/**
 * Reactive mirror of the pure core locale registry.
 *
 * `Ds*` components resolve their built-in label defaults through `t()` inside
 * `computed`, so switching the locale at runtime re-renders every governed
 * string. Per-component label props always win over the dictionary.
 */

import { computed, ref, type ComputedRef } from 'vue'

import {
  DEFAULT_NTK_LOCALE,
  resolveNtkMessage,
  setNtkCoreLocale,
  type NtkLocale,
  type NtkMessageKey,
} from '../../core'

const ntkLocaleRef = ref<NtkLocale>(DEFAULT_NTK_LOCALE)

/**
 * Set the active library locale (reactive + core registry write-through).
 * Called by `createNetToolsKitUI({ locale })`; apps may also call it directly
 * for a runtime language switch.
 */
export function setNtkLocale(locale: NtkLocale): void {
  ntkLocaleRef.value = locale
  setNtkCoreLocale(locale)
}

export function getNtkLocale(): NtkLocale {
  return ntkLocaleRef.value
}

export interface NtkI18n {
  readonly locale: ComputedRef<NtkLocale>
  readonly t: (key: NtkMessageKey, params?: Record<string, string | number>) => string
}

export function useNtkI18n(): NtkI18n {
  return {
    locale: computed(() => ntkLocaleRef.value),
    t: (key, params) => resolveNtkMessage(ntkLocaleRef.value, key, params),
  }
}