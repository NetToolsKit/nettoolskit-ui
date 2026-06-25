/**
 * Date picker contract, class recipe, and pure date helpers.
 *
 * The recipe reuses the shared field recipe internally (the picker presents as a
 * `.ntk-field`) but exposes its own `getNtkDatePicker*` helpers so it
 * participates in the core-helpers gate. The date math below is intentionally
 * dependency-free and timezone-neutral: every value is an ISO `YYYY-MM-DD`
 * string parsed/formatted in UTC so it is fully deterministic and unit-testable.
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

export type NtkDatePickerVariant = NtkFieldVariant
export type NtkDatePickerSize = NtkFieldSize
export type NtkDatePickerIntent = NtkFieldIntent

export interface NtkDatePickerContract extends NtkFieldContract<string | null> {
  /** Earliest selectable date, inclusive (ISO `YYYY-MM-DD`). */
  readonly min?: string | null
  /** Latest selectable date, inclusive (ISO `YYYY-MM-DD`). */
  readonly max?: string | null
  /** Accessible label for the calendar trigger button. */
  readonly triggerLabel?: string
}

export const ntkDatePickerDefaults = ntkFieldDefaults

/**
 * Date picker class map. Mirrors the field class map (the control is a field) so
 * the picker inherits the field's variant/size/intent/state styling.
 */
export const ntkDatePickerRecipeClassMap = ntkFieldRecipeClassMap satisfies
  NtkRecipeClassMap<NtkDatePickerVariant, NtkDatePickerSize, NtkDatePickerIntent>

export type NtkDatePickerRecipeOptions =
  NtkRecipeOptions<NtkDatePickerVariant, NtkDatePickerSize, NtkDatePickerIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkDatePickerRecipe = (options: NtkDatePickerRecipeOptions = {}) =>
  resolveNtkRecipe(ntkDatePickerRecipeClassMap, ntkDatePickerDefaults, options)

export const getNtkDatePickerClasses = (options: NtkDatePickerRecipeOptions = {}) =>
  resolveNtkDatePickerRecipe(options).classes

export const getNtkDatePickerClassName = (options: NtkDatePickerRecipeOptions = {}) =>
  resolveNtkDatePickerRecipe(options).className

// --- Pure date helpers --------------------------------------------------------

/** Weekday header labels, Sunday-first. */
export const ntkWeekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

/** Month name labels, January-first. */
export const ntkMonthLabels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const pad2 = (value: number): string => String(value).padStart(2, '0')

/**
 * Parse an ISO `YYYY-MM-DD` string into a UTC `Date`, or `null` for any input
 * that is not a real calendar date (bad shape, out-of-range, or a rollover like
 * `2023-02-29`). Timezone-neutral: the result is anchored at UTC midnight.
 */
export const parseNtkDate = (iso: string | null | undefined): Date | null => {
  if (!iso) {
    return null
  }
  const match = ISO_DATE_PATTERN.exec(iso)
  if (!match) {
    return null
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null
  }
  const date = new Date(Date.UTC(year, month - 1, day))
  // Reject rollovers (e.g. Feb 30 -> Mar 2): the round-trip must be stable.
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    return null
  }
  return date
}

/** Format a UTC `Date` back to an ISO `YYYY-MM-DD` string. */
export const formatNtkDate = (date: Date): string =>
  `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`

/**
 * Shift an ISO date by a whole number of days, returning a new ISO string.
 * Returns `null` if the input is not a valid date.
 */
export const shiftNtkDate = (iso: string | null | undefined, deltaDays: number): string | null => {
  const date = parseNtkDate(iso)
  if (!date) {
    return null
  }
  date.setUTCDate(date.getUTCDate() + deltaDays)
  return formatNtkDate(date)
}

/**
 * Shift an ISO date by a whole number of months, clamping the day to the target
 * month length (e.g. Jan 31 + 1 month -> Feb 28/29). Returns `null` if invalid.
 */
export const shiftNtkMonth = (iso: string | null | undefined, deltaMonths: number): string | null => {
  const date = parseNtkDate(iso)
  if (!date) {
    return null
  }
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + deltaMonths
  const targetYear = year + Math.floor(month / 12)
  const targetMonth = ((month % 12) + 12) % 12
  const day = Math.min(date.getUTCDate(), getNtkDaysInMonth(targetYear, targetMonth))
  return formatNtkDate(new Date(Date.UTC(targetYear, targetMonth, day)))
}

/** Number of days in a given month (0-based month). Handles leap Februaries. */
export const getNtkDaysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

/** True when the calendar year is a leap year (Gregorian rules). */
export const isNtkLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

export interface NtkCalendarDay {
  /** ISO `YYYY-MM-DD` of the cell. */
  readonly iso: string
  /** Day-of-month number (1-31). */
  readonly day: number
  /** True when the cell belongs to the displayed month (vs. leading/trailing). */
  readonly inMonth: boolean
}

/**
 * Build a 6x7 calendar matrix (weeks x days) for the given year/month
 * (0-based month). Always returns 6 full weeks of 7 days so the grid is a stable
 * rectangle; leading/trailing days from adjacent months carry `inMonth: false`.
 */
export const getNtkCalendarMatrix = (year: number, month: number): NtkCalendarDay[][] => {
  const firstOfMonth = new Date(Date.UTC(year, month, 1))
  const leading = firstOfMonth.getUTCDay()
  const start = new Date(Date.UTC(year, month, 1 - leading))

  const weeks: NtkCalendarDay[][] = []
  const cursor = new Date(start)
  for (let week = 0; week < 6; week += 1) {
    const days: NtkCalendarDay[] = []
    for (let day = 0; day < 7; day += 1) {
      days.push({
        iso: formatNtkDate(cursor),
        day: cursor.getUTCDate(),
        inMonth: cursor.getUTCMonth() === month,
      })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    weeks.push(days)
  }
  return weeks
}

/**
 * True when `iso` falls outside the inclusive `[min, max]` range. Invalid or
 * absent bounds are treated as open (no constraint); an unparseable `iso` is
 * considered disabled.
 */
export const isNtkDateDisabled = (
  iso: string | null | undefined,
  min?: string | null,
  max?: string | null,
): boolean => {
  const date = parseNtkDate(iso)
  if (!date) {
    return true
  }
  const minDate = parseNtkDate(min)
  if (minDate && date.getTime() < minDate.getTime()) {
    return true
  }
  const maxDate = parseNtkDate(max)
  if (maxDate && date.getTime() > maxDate.getTime()) {
    return true
  }
  return false
}

/**
 * Clamp an ISO date into the inclusive `[min, max]` range. Returns the clamped
 * ISO string, or `null` if the input itself is invalid.
 */
export const clampNtkDate = (
  iso: string | null | undefined,
  min?: string | null,
  max?: string | null,
): string | null => {
  const date = parseNtkDate(iso)
  if (!date) {
    return null
  }
  const minDate = parseNtkDate(min)
  if (minDate && date.getTime() < minDate.getTime()) {
    return formatNtkDate(minDate)
  }
  const maxDate = parseNtkDate(max)
  if (maxDate && date.getTime() > maxDate.getTime()) {
    return formatNtkDate(maxDate)
  }
  return formatNtkDate(date)
}