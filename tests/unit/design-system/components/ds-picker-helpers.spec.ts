/**
 * Direct unit coverage for the pure date/time picker helpers.
 *
 * These deterministic, dependency-free functions back DsDatePicker/DsTimePicker
 * and live under `core/components/**`, which the suite holds at 100%
 * statements/functions/lines. Every branch (leap years, month boundaries,
 * min/max clamping, invalid parse) is exercised here so the gate stays green
 * without relying on the Vue mount tests.
 */

import { describe, expect, it } from 'vitest'
import {
  NTK_MINUTES_PER_DAY,
  clampNtkDate,
  clampNtkTime,
  enumerateNtkTimeOptions,
  formatNtkDate,
  formatNtkTime,
  getNtkCalendarMatrix,
  getNtkDaysInMonth,
  isNtkDateDisabled,
  isNtkLeapYear,
  isNtkTimeDisabled,
  ntkMonthLabels,
  ntkTimePickerDefaults,
  ntkWeekdayLabels,
  parseNtkDate,
  parseNtkTime,
  shiftNtkDate,
  shiftNtkMonth,
} from '@/design-system/core'

describe('date helpers', () => {
  describe('parseNtkDate', () => {
    it('parses a valid ISO date as UTC midnight', () => {
      const date = parseNtkDate('2024-02-29')
      expect(date).not.toBeNull()
      expect(date?.getUTCFullYear()).toBe(2024)
      expect(date?.getUTCMonth()).toBe(1)
      expect(date?.getUTCDate()).toBe(29)
    })

    it('returns null for empty, malformed, out-of-range, and rollover input', () => {
      expect(parseNtkDate(null)).toBeNull()
      expect(parseNtkDate(undefined)).toBeNull()
      expect(parseNtkDate('')).toBeNull()
      expect(parseNtkDate('2024/02/29')).toBeNull()
      expect(parseNtkDate('2024-13-01')).toBeNull() // month out of range
      expect(parseNtkDate('2024-00-01')).toBeNull() // month out of range
      expect(parseNtkDate('2024-02-00')).toBeNull() // day out of range
      expect(parseNtkDate('2024-02-32')).toBeNull() // day out of range
      expect(parseNtkDate('2023-02-29')).toBeNull() // non-leap rollover
      expect(parseNtkDate('2024-04-31')).toBeNull() // April has 30 days
    })
  })

  it('formatNtkDate round-trips a parsed date and zero-pads', () => {
    expect(formatNtkDate(parseNtkDate('2024-01-05') as Date)).toBe('2024-01-05')
    expect(formatNtkDate(new Date(Date.UTC(2024, 11, 9)))).toBe('2024-12-09')
  })

  describe('shiftNtkDate', () => {
    it('shifts forward and backward across month and year boundaries', () => {
      expect(shiftNtkDate('2024-01-31', 1)).toBe('2024-02-01')
      expect(shiftNtkDate('2024-03-01', -1)).toBe('2024-02-29') // leap February
      expect(shiftNtkDate('2024-12-31', 1)).toBe('2025-01-01')
      expect(shiftNtkDate('2024-01-01', -1)).toBe('2023-12-31')
    })

    it('returns null for invalid input', () => {
      expect(shiftNtkDate('nope', 1)).toBeNull()
      expect(shiftNtkDate(null, 1)).toBeNull()
    })
  })

  describe('shiftNtkMonth', () => {
    it('shifts months and clamps the day to the target month length', () => {
      expect(shiftNtkMonth('2024-01-31', 1)).toBe('2024-02-29') // leap clamp
      expect(shiftNtkMonth('2023-01-31', 1)).toBe('2023-02-28') // non-leap clamp
      expect(shiftNtkMonth('2024-03-31', -1)).toBe('2024-02-29')
      expect(shiftNtkMonth('2024-01-15', 12)).toBe('2025-01-15')
      expect(shiftNtkMonth('2024-01-15', -1)).toBe('2023-12-15') // wrap back a year
    })

    it('returns null for invalid input', () => {
      expect(shiftNtkMonth('bad', 1)).toBeNull()
    })
  })

  describe('getNtkDaysInMonth / isNtkLeapYear', () => {
    it('reports month lengths including leap February', () => {
      expect(getNtkDaysInMonth(2024, 1)).toBe(29)
      expect(getNtkDaysInMonth(2023, 1)).toBe(28)
      expect(getNtkDaysInMonth(2024, 0)).toBe(31)
      expect(getNtkDaysInMonth(2024, 3)).toBe(30)
    })

    it('applies the Gregorian leap-year rules', () => {
      expect(isNtkLeapYear(2024)).toBe(true)
      expect(isNtkLeapYear(2023)).toBe(false)
      expect(isNtkLeapYear(1900)).toBe(false) // divisible by 100, not 400
      expect(isNtkLeapYear(2000)).toBe(true) // divisible by 400
    })
  })

  describe('getNtkCalendarMatrix', () => {
    it('builds a stable 6x7 grid with leading/trailing days flagged', () => {
      const matrix = getNtkCalendarMatrix(2024, 1) // February 2024 (starts Thu)
      expect(matrix).toHaveLength(6)
      matrix.forEach((week) => expect(week).toHaveLength(7))

      // Feb 1 2024 is a Thursday (column 4); leading cells are January.
      expect(matrix[0][0]).toMatchObject({ iso: '2024-01-28', inMonth: false })
      expect(matrix[0][4]).toMatchObject({ iso: '2024-02-01', day: 1, inMonth: true })
      // Trailing cells roll into March.
      const lastCell = matrix[5][6]
      expect(lastCell.inMonth).toBe(false)
      expect(lastCell.iso.startsWith('2024-03')).toBe(true)
    })

    it('covers a month that begins on Sunday with no leading days', () => {
      const matrix = getNtkCalendarMatrix(2024, 8) // September 2024 starts Sunday
      expect(matrix[0][0]).toMatchObject({ iso: '2024-09-01', day: 1, inMonth: true })
    })
  })

  describe('isNtkDateDisabled', () => {
    it('treats absent/invalid bounds as open and an invalid value as disabled', () => {
      expect(isNtkDateDisabled('2024-06-15')).toBe(false)
      expect(isNtkDateDisabled('2024-06-15', null, null)).toBe(false)
      expect(isNtkDateDisabled('2024-06-15', 'bad', 'bad')).toBe(false)
      expect(isNtkDateDisabled('not-a-date')).toBe(true)
    })

    it('flags dates below min or above max (inclusive bounds allowed)', () => {
      expect(isNtkDateDisabled('2024-06-01', '2024-06-10')).toBe(true)
      expect(isNtkDateDisabled('2024-06-10', '2024-06-10')).toBe(false)
      expect(isNtkDateDisabled('2024-06-30', undefined, '2024-06-20')).toBe(true)
      expect(isNtkDateDisabled('2024-06-20', undefined, '2024-06-20')).toBe(false)
    })
  })

  describe('clampNtkDate', () => {
    it('clamps below min, above max, and passes through in-range', () => {
      expect(clampNtkDate('2024-06-01', '2024-06-10', '2024-06-20')).toBe('2024-06-10')
      expect(clampNtkDate('2024-06-30', '2024-06-10', '2024-06-20')).toBe('2024-06-20')
      expect(clampNtkDate('2024-06-15', '2024-06-10', '2024-06-20')).toBe('2024-06-15')
      expect(clampNtkDate('2024-06-15')).toBe('2024-06-15')
    })

    it('returns null for invalid input', () => {
      expect(clampNtkDate('nope')).toBeNull()
      expect(clampNtkDate(null)).toBeNull()
    })
  })

  it('exposes weekday and month label tables', () => {
    expect(ntkWeekdayLabels).toHaveLength(7)
    expect(ntkMonthLabels).toHaveLength(12)
    expect(ntkMonthLabels[0]).toBe('January')
  })
})

describe('time helpers', () => {
  describe('parseNtkTime', () => {
    it('parses valid 24h times into a minute-of-day total', () => {
      expect(parseNtkTime('00:00')).toEqual({ hours: 0, minutes: 0, totalMinutes: 0 })
      expect(parseNtkTime('23:59')).toEqual({ hours: 23, minutes: 59, totalMinutes: 1439 })
      expect(parseNtkTime('9:05')).toEqual({ hours: 9, minutes: 5, totalMinutes: 545 })
    })

    it('returns null for empty, malformed, and out-of-range input', () => {
      expect(parseNtkTime(null)).toBeNull()
      expect(parseNtkTime(undefined)).toBeNull()
      expect(parseNtkTime('')).toBeNull()
      expect(parseNtkTime('12-30')).toBeNull()
      expect(parseNtkTime('24:00')).toBeNull() // hour out of range
      expect(parseNtkTime('12:60')).toBeNull() // minute out of range
    })
  })

  describe('formatNtkTime', () => {
    it('formats and clamps a minute-of-day integer to a single day', () => {
      expect(formatNtkTime(0)).toBe('00:00')
      expect(formatNtkTime(545)).toBe('09:05')
      expect(formatNtkTime(NTK_MINUTES_PER_DAY - 1)).toBe('23:59')
      expect(formatNtkTime(-5)).toBe('00:00') // clamp low
      expect(formatNtkTime(99999)).toBe('23:59') // clamp high
      expect(formatNtkTime(90.6)).toBe('01:31') // rounds
    })
  })

  describe('clampNtkTime', () => {
    it('clamps below min, above max, and passes through in-range', () => {
      expect(clampNtkTime('07:00', '08:00', '18:00')).toBe('08:00')
      expect(clampNtkTime('20:00', '08:00', '18:00')).toBe('18:00')
      expect(clampNtkTime('12:00', '08:00', '18:00')).toBe('12:00')
      expect(clampNtkTime('12:00')).toBe('12:00')
    })

    it('returns null for invalid input', () => {
      expect(clampNtkTime('nope')).toBeNull()
      expect(clampNtkTime(null)).toBeNull()
    })
  })

  describe('isNtkTimeDisabled', () => {
    it('treats absent bounds as open and invalid value as disabled', () => {
      expect(isNtkTimeDisabled('12:00')).toBe(false)
      expect(isNtkTimeDisabled('bad')).toBe(true)
    })

    it('flags times below min or above max (inclusive)', () => {
      expect(isNtkTimeDisabled('07:00', '08:00')).toBe(true)
      expect(isNtkTimeDisabled('08:00', '08:00')).toBe(false)
      expect(isNtkTimeDisabled('19:00', undefined, '18:00')).toBe(true)
      expect(isNtkTimeDisabled('18:00', undefined, '18:00')).toBe(false)
    })
  })

  describe('enumerateNtkTimeOptions', () => {
    it('enumerates the full day at the default step when no bounds are given', () => {
      const options = enumerateNtkTimeOptions()
      expect(options[0]).toBe('00:00')
      expect(options[1]).toBe(`00:0${ntkTimePickerDefaults.step}`)
      expect(options.at(-1)).toBe('23:55')
      expect(options).toHaveLength(NTK_MINUTES_PER_DAY / ntkTimePickerDefaults.step)
    })

    it('honours an explicit step and inclusive [min, max] window', () => {
      expect(enumerateNtkTimeOptions(30, '09:00', '11:00')).toEqual([
        '09:00', '09:30', '10:00', '10:30', '11:00',
      ])
      expect(enumerateNtkTimeOptions(15, '23:30')).toEqual(['23:30', '23:45'])
    })

    it('falls back to a 1-minute step for non-positive or non-finite steps', () => {
      expect(enumerateNtkTimeOptions(0, '09:00', '09:02')).toEqual(['09:00', '09:01', '09:02'])
      expect(enumerateNtkTimeOptions(Number.NaN, '09:00', '09:01')).toEqual(['09:00', '09:01'])
      expect(enumerateNtkTimeOptions(-5, '09:00', '09:01')).toEqual(['09:00', '09:01'])
    })
  })
})