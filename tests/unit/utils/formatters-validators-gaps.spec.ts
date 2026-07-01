/**
 * Behavior tests for the formatter/validator paths the base suites left
 * uncovered: relative-time bucketing and the CPF/CNPJ check-digit math.
 */

import { describe, expect, it } from 'vitest'

import { formatRelativeTime } from '../../../src/utils/formatters'
import {
  validateCNPJ,
  validateCPF,
  validatePassword,
  validatePhone,
  validateURL,
} from '../../../src/utils/validators'

describe('formatRelativeTime buckets', () => {
  const secondsAgo = (seconds: number) => new Date(Date.now() - seconds * 1000)

  it('formats each magnitude bucket with Intl semantics', () => {
    expect(formatRelativeTime(secondsAgo(5), 'en-US')).toMatch(/second|now/)
    expect(formatRelativeTime(secondsAgo(5 * 60), 'en-US')).toContain('minute')
    expect(formatRelativeTime(secondsAgo(3 * 3600), 'en-US')).toContain('hour')
    expect(formatRelativeTime(secondsAgo(2 * 86400), 'en-US')).toMatch(/day/)
  })

  it('falls back to an absolute date past 30 days and accepts ISO strings', () => {
    const old = secondsAgo(45 * 86400)
    const absolute = formatRelativeTime(old.toISOString(), 'en-US')
    expect(absolute).not.toMatch(/ago|in /)
    expect(absolute).toMatch(/\d{4}|\d{2}/)
  })
})

describe('validateCPF check digits', () => {
  it('accepts a CPF with valid check digits (masked and raw)', () => {
    expect(validateCPF('529.982.247-25')).toBe(true)
    expect(validateCPF('52998224725')).toBe(true)
  })

  it('rejects wrong first and second check digits', () => {
    expect(validateCPF('529.982.247-35')).toBe(false) // digit 1 wrong
    expect(validateCPF('529.982.247-24')).toBe(false) // digit 2 wrong
  })

  it('rejects repeated-digit, short and empty inputs', () => {
    expect(validateCPF('111.111.111-11')).toBe(false)
    expect(validateCPF('123')).toBe(false)
    expect(validateCPF('')).toBe(false)
  })
})

describe('validateCNPJ check digits', () => {
  it('accepts a CNPJ with valid check digits', () => {
    expect(validateCNPJ('04.252.011/0001-10')).toBe(true)
    expect(validateCNPJ('04252011000110')).toBe(true)
  })

  it('rejects wrong check digits, repeated digits and bad lengths', () => {
    expect(validateCNPJ('04.252.011/0001-20')).toBe(false)
    expect(validateCNPJ('04.252.011/0001-11')).toBe(false)
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false)
    expect(validateCNPJ('123')).toBe(false)
    expect(validateCNPJ('')).toBe(false)
  })
})

describe('validatePhone / validateURL / validatePassword branches', () => {
  it('accepts 10 and 11 digit Brazilian phones and rejects others', () => {
    expect(validatePhone('(11) 99999-9999')).toBe(true)
    expect(validatePhone('(11) 9999-9999')).toBe(true)
    expect(validatePhone('999')).toBe(false)
    expect(validatePhone('')).toBe(false)
  })

  it('accepts only http/https URLs', () => {
    expect(validateURL('https://nettoolskit.io')).toBe(true)
    expect(validateURL('http://localhost:3000/x')).toBe(true)
    expect(validateURL('ftp://host/file')).toBe(false)
    expect(validateURL('not a url')).toBe(false)
    expect(validateURL('')).toBe(false)
  })

  it('reports every missing password requirement individually', () => {
    expect(validatePassword('').valid).toBe(false)

    const noUpper = validatePassword('abcdef1@')
    expect(noUpper.valid).toBe(false)
    expect(noUpper.errors.join(' ')).toMatch(/uppercase/)

    const noLower = validatePassword('ABCDEF1@')
    expect(noLower.errors.join(' ')).toMatch(/lowercase/)

    const noDigit = validatePassword('Abcdefg@')
    expect(noDigit.errors.join(' ')).toMatch(/numbers/)

    const noSpecial = validatePassword('Abcdefg1')
    expect(noSpecial.errors.join(' ')).toMatch(/special/)

    const short = validatePassword('Ab1@', 8)
    expect(short.errors.join(' ')).toMatch(/8 characters/)

    expect(validatePassword('Abcdef1@').valid).toBe(true)
  })
})