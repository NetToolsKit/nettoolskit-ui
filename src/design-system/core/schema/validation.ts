/**
 * Pure validation primitives for the schema layer.
 *
 * Lives in `core/` so it has no Vue/DOM/Quasar/service dependency. Each rule is
 * `(value) => true | string` (the same shape Quasar field rules use), so custom
 * rules from the Application layer (e.g. `FormValidationService.cpf()`) can be
 * supplied through a field's `rules` array without any coupling.
 *
 * Messages explain how to correct the value, per STANDARD §17.9 / §19.6.
 */

import { ntkMessage } from '../i18n'

/** A field rule: returns `true` when valid, otherwise an error message. */
export type NtkValidationRule = (value: unknown) => true | string

const isEmpty = (value: unknown): boolean =>
  value === null
  || value === undefined
  || (typeof value === 'string' && value.trim() === '')
  || (Array.isArray(value) && value.length === 0)

// Default messages resolve from the locale registry AT EVALUATION time (when
// the rule runs), so a locale set during app install localizes validation
// errors without touching schema definitions. Explicit `message` args win.

export const requiredRule = (message?: string): NtkValidationRule =>
  (value) => (isEmpty(value) ? (message ?? ntkMessage('validation.required')) : true)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emailRule = (message?: string): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return EMAIL_PATTERN.test(String(value)) || (message ?? ntkMessage('validation.email'))
  }

export const minLengthRule = (min: number, message?: string): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return String(value).length >= min || (message ?? ntkMessage('validation.minLength', { min }))
  }

export const maxLengthRule = (max: number, message?: string): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return String(value).length <= max || (message ?? ntkMessage('validation.maxLength', { max }))
  }

export const minValueRule = (min: number, message?: string): NtkValidationRule =>
  (value) => {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return Number(value) >= min || (message ?? ntkMessage('validation.minValue', { min }))
  }

export const maxValueRule = (max: number, message?: string): NtkValidationRule =>
  (value) => {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return Number(value) <= max || (message ?? ntkMessage('validation.maxValue', { max }))
  }

export const patternRule = (pattern: RegExp, message?: string): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return pattern.test(String(value)) || (message ?? ntkMessage('validation.pattern'))
  }

/**
 * Run rules in order and return the first failure message, or `true` if all
 * pass. Mirrors how Quasar evaluates a field's rule array.
 */
export const runNtkRules = (rules: readonly NtkValidationRule[], value: unknown): true | string => {
  for (const rule of rules) {
    const result = rule(value)
    if (result !== true) {
      return result
    }
  }
  return true
}