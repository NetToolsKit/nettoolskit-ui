/**
 * Time picker contract, class recipe, and pure time helpers.
 *
 * Like the date picker, the recipe reuses the shared field recipe internally
 * (the control presents as a `.ntk-field`) but exposes its own
 * `getNtkTimePicker*` helpers for the core-helpers gate. Time math operates on
 * 24-hour `HH:mm` strings and is fully deterministic — values are reduced to a
 * minute-of-day integer so parsing, clamping, and enumeration are pure.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import {
  ntkFieldDefaults,
  ntkFieldRecipeClassMap,
  type NtkFieldContract,
  type NtkFieldIntent,
  type NtkFieldSize,
  type NtkFieldVariant,
} from './field'

export type NtkTimePickerVariant = NtkFieldVariant
export type NtkTimePickerSize = NtkFieldSize
export type NtkTimePickerIntent = NtkFieldIntent

export interface NtkTimePickerContract extends NtkFieldContract<string | null> {
  /** Earliest selectable time, inclusive (`HH:mm`, 24h). */
  readonly min?: string | null
  /** Latest selectable time, inclusive (`HH:mm`, 24h). */
  readonly max?: string | null
  /** Step between enumerated options, in minutes. */
  readonly step?: number
  /** Accessible label for the time-list trigger button. */
  readonly triggerLabel?: string
}

/** Minutes in a full day; the exclusive upper bound for a minute-of-day value. */
export const NTK_MINUTES_PER_DAY = 24 * 60

export const ntkTimePickerDefaults = {
  ...ntkFieldDefaults,
  step: 5,
} as const

/**
 * Time picker class map. Mirrors the field class map (the control is a field) so
 * the picker inherits the field's variant/size/intent/state styling.
 */
export const ntkTimePickerRecipeClassMap = ntkFieldRecipeClassMap satisfies
  NtkRecipeClassMap<NtkTimePickerVariant, NtkTimePickerSize, NtkTimePickerIntent>

export type NtkTimePickerRecipeOptions =
  NtkRecipeOptions<NtkTimePickerVariant, NtkTimePickerSize, NtkTimePickerIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkTimePickerRecipe = (options: NtkTimePickerRecipeOptions = {}) =>
  resolveNtkRecipe(ntkTimePickerRecipeClassMap, ntkTimePickerDefaults, options)

export const getNtkTimePickerClasses = (options: NtkTimePickerRecipeOptions = {}) =>
  resolveNtkTimePickerRecipe(options).classes

export const getNtkTimePickerClassName = (options: NtkTimePickerRecipeOptions = {}) =>
  resolveNtkTimePickerRecipe(options).className

// --- Pure time helpers --------------------------------------------------------

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/

const pad2 = (value: number): string => String(value).padStart(2, '0')

export interface NtkParsedTime {
  readonly hours: number
  readonly minutes: number
  /** Total minutes since midnight (0-1439). */
  readonly totalMinutes: number
}

/**
 * Parse an `HH:mm` (24h) string. Returns `null` for any input outside
 * `00:00`-`23:59` or with the wrong shape.
 */
export const parseNtkTime = (value: string | null | undefined): NtkParsedTime | null => {
  if (!value) {
    return null
  }
  const match = TIME_PATTERN.exec(value)
  if (!match) {
    return null
  }
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null
  }
  return { hours, minutes, totalMinutes: hours * 60 + minutes }
}

/** Format a minute-of-day integer (clamped to a single day) as `HH:mm`. */
export const formatNtkTime = (totalMinutes: number): string => {
  const clamped = Math.max(0, Math.min(NTK_MINUTES_PER_DAY - 1, Math.round(totalMinutes)))
  return `${pad2(Math.floor(clamped / 60))}:${pad2(clamped % 60)}`
}

/**
 * Clamp an `HH:mm` time into the inclusive `[min, max]` range. Invalid bounds are
 * treated as open; an unparseable `value` returns `null`.
 */
export const clampNtkTime = (
  value: string | null | undefined,
  min?: string | null,
  max?: string | null,
): string | null => {
  const parsed = parseNtkTime(value)
  if (!parsed) {
    return null
  }
  let total = parsed.totalMinutes
  const minTime = parseNtkTime(min)
  if (minTime && total < minTime.totalMinutes) {
    total = minTime.totalMinutes
  }
  const maxTime = parseNtkTime(max)
  if (maxTime && total > maxTime.totalMinutes) {
    total = maxTime.totalMinutes
  }
  return formatNtkTime(total)
}

/**
 * True when `value` falls outside the inclusive `[min, max]` range. Absent or
 * invalid bounds are open; an unparseable `value` is considered disabled.
 */
export const isNtkTimeDisabled = (
  value: string | null | undefined,
  min?: string | null,
  max?: string | null,
): boolean => {
  const parsed = parseNtkTime(value)
  if (!parsed) {
    return true
  }
  const minTime = parseNtkTime(min)
  if (minTime && parsed.totalMinutes < minTime.totalMinutes) {
    return true
  }
  const maxTime = parseNtkTime(max)
  if (maxTime && parsed.totalMinutes > maxTime.totalMinutes) {
    return true
  }
  return false
}

/**
 * Enumerate selectable `HH:mm` options across `[min, max]` (default the full
 * day) at the given `step` in minutes. A non-positive or non-finite `step`
 * falls back to 1 so the list is always well-formed. The upper bound is
 * inclusive when it lands on a step boundary.
 */
export const enumerateNtkTimeOptions = (
  step: number = ntkTimePickerDefaults.step,
  min?: string | null,
  max?: string | null,
): string[] => {
  const safeStep = Number.isFinite(step) && step > 0 ? Math.floor(step) : 1
  const start = parseNtkTime(min)?.totalMinutes ?? 0
  const end = parseNtkTime(max)?.totalMinutes ?? NTK_MINUTES_PER_DAY - 1
  const options: string[] = []
  for (let total = start; total <= end; total += safeStep) {
    options.push(formatNtkTime(total))
  }
  return options
}