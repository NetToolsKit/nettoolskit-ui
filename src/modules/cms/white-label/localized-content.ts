/**
 * Backend-agnostic authored content localization helpers for the CMS engine.
 * They preserve legacy plain values while enabling locale-scoped overrides.
 */
import { resolveCmsLocale } from './i18n'
import type {
  CmsLocale,
  CmsLocalizedPropsRecord,
  CmsLocalizedTextRecord,
  CmsPageBlockLocalizationSettings,
  CmsPageLocalizationSettings,
  CmsPageSectionLocalizationSettings,
} from './types'

export const CMS_AUTHORED_DEFAULT_LOCALE: CmsLocale = 'en'

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function resolveCmsLocalizedRecordLocale(value: unknown): CmsLocale | null {
  const normalized = String(value ?? '').trim()
  if (normalized === 'en') {
    return 'en'
  }
  if (normalized.toLowerCase().startsWith('pt')) {
    return 'pt-BR'
  }
  return null
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fallback handles proxies and other non-cloneable objects.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function deepMergeRecords(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const merged = cloneValue(base)

  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = merged[key]
    if (isObjectRecord(baseValue) && isObjectRecord(overrideValue)) {
      merged[key] = deepMergeRecords(baseValue, overrideValue)
      continue
    }

    merged[key] = cloneValue(overrideValue)
  }

  return merged
}

function normalizeCmsLocalizedLocaleMap<T>(
  value: unknown,
  normalizeEntry: (entry: unknown) => T | null
): Partial<Record<CmsLocale, T>> | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const normalized: Partial<Record<CmsLocale, T>> = {}
  for (const [rawLocale, rawEntry] of Object.entries(value)) {
    const locale = resolveCmsLocalizedRecordLocale(rawLocale)
    if (!locale) {
      continue
    }
    const entry = normalizeEntry(rawEntry)
    if (entry !== null) {
      normalized[locale] = entry
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

/**
 * Normalizes locale->text maps while discarding invalid entries.
 */
export function normalizeCmsLocalizedTextRecord(value: unknown): CmsLocalizedTextRecord | undefined {
  return normalizeCmsLocalizedLocaleMap(value, entry => {
    if (typeof entry !== 'string') {
      return null
    }
    return entry
  })
}

/**
 * Normalizes locale->props maps while discarding invalid entries.
 */
export function normalizeCmsLocalizedPropsRecord(value: unknown): CmsLocalizedPropsRecord | undefined {
  return normalizeCmsLocalizedLocaleMap(value, entry => {
    if (!isObjectRecord(entry)) {
      return null
    }
    return cloneValue(entry)
  })
}

/**
 * Normalizes page localization payloads from storage/import snapshots.
 */
export function normalizeCmsPageLocalizationSettings(value: unknown): CmsPageLocalizationSettings | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const title = normalizeCmsLocalizedTextRecord(value.title)
  const description = normalizeCmsLocalizedTextRecord(value.description)
  const fields = normalizeCmsLocalizedPropsRecord(value.fields)
  if (!title && !description && !fields) {
    return undefined
  }

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(fields ? { fields } : {}),
  }
}

/**
 * Normalizes section localization payloads from storage/import snapshots.
 */
export function normalizeCmsPageSectionLocalizationSettings(value: unknown): CmsPageSectionLocalizationSettings | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const label = normalizeCmsLocalizedTextRecord(value.label)
  return label ? { label } : undefined
}

/**
 * Normalizes block localization payloads from storage/import snapshots.
 */
export function normalizeCmsPageBlockLocalizationSettings(value: unknown): CmsPageBlockLocalizationSettings | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const props = normalizeCmsLocalizedPropsRecord(value.props)
  return props ? { props } : undefined
}

/**
 * Resolves one authored text value for the active locale with legacy fallback.
 */
export function resolveCmsLocalizedText(input: {
  baseValue: string
  localized?: CmsLocalizedTextRecord
  localeInput?: unknown
}): string {
  const locale = resolveCmsLocale(input.localeInput)
  const localizedValue = input.localized?.[locale]
  if (typeof localizedValue === 'string') {
    return localizedValue
  }

  return input.baseValue
}

/**
 * Resolves block props for the active locale with deep fallback to base props.
 */
export function resolveCmsLocalizedProps(input: {
  baseProps: Record<string, unknown>
  localized?: CmsLocalizedPropsRecord
  localeInput?: unknown
}): Record<string, unknown> {
  const locale = resolveCmsLocale(input.localeInput)
  const localizedProps = input.localized?.[locale]
  if (!isObjectRecord(localizedProps)) {
    return cloneValue(input.baseProps)
  }

  return deepMergeRecords(input.baseProps, localizedProps)
}

/**
 * Applies a locale-scoped text edit while preserving legacy base values for `en`.
 */
export function applyCmsLocalizedTextUpdate(input: {
  baseValue: string
  localized?: CmsLocalizedTextRecord
  localeInput?: unknown
  nextValue: unknown
}): {
  baseValue: string
  localized?: CmsLocalizedTextRecord
} {
  const locale = resolveCmsLocale(input.localeInput)
  const normalizedValue = String(input.nextValue ?? '')

  if (locale === CMS_AUTHORED_DEFAULT_LOCALE) {
    const nextLocalized = { ...(input.localized ?? {}) }
    delete nextLocalized[CMS_AUTHORED_DEFAULT_LOCALE]
    return {
      baseValue: normalizedValue,
      localized: Object.keys(nextLocalized).length > 0 ? nextLocalized : undefined,
    }
  }

  return {
    baseValue: input.baseValue,
    localized: {
      ...(input.localized ?? {}),
      [locale]: normalizedValue,
    },
  }
}

/**
 * Applies a locale-scoped props edit while preserving legacy base props for `en`.
 */
export function applyCmsLocalizedPropsUpdate(input: {
  baseProps: Record<string, unknown>
  localized?: CmsLocalizedPropsRecord
  localeInput?: unknown
  nextValue: Record<string, unknown>
}): {
  baseProps: Record<string, unknown>
  localized?: CmsLocalizedPropsRecord
} {
  const locale = resolveCmsLocale(input.localeInput)

  if (locale === CMS_AUTHORED_DEFAULT_LOCALE) {
    const nextLocalized = { ...(input.localized ?? {}) }
    delete nextLocalized[CMS_AUTHORED_DEFAULT_LOCALE]
    return {
      baseProps: cloneValue(input.nextValue),
      localized: Object.keys(nextLocalized).length > 0 ? nextLocalized : undefined,
    }
  }

  return {
    baseProps: cloneValue(input.baseProps),
    localized: {
      ...(input.localized ?? {}),
      [locale]: cloneValue(input.nextValue),
    },
  }
}