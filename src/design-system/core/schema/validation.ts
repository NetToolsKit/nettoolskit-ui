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

/** A field rule: returns `true` when valid, otherwise an error message. */
export type NtkValidationRule = (value: unknown) => true | string

const isEmpty = (value: unknown): boolean =>
  value === null
  || value === undefined
  || (typeof value === 'string' && value.trim() === '')
  || (Array.isArray(value) && value.length === 0)

export const requiredRule = (message = 'Preencha este campo'): NtkValidationRule =>
  (value) => (isEmpty(value) ? message : true)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emailRule = (message = 'Informe um e-mail válido'): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return EMAIL_PATTERN.test(String(value)) || message
  }

export const minLengthRule = (min: number, message?: string): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return String(value).length >= min || (message ?? `Use ao menos ${min} caracteres`)
  }

export const maxLengthRule = (max: number, message?: string): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return String(value).length <= max || (message ?? `Use no máximo ${max} caracteres`)
  }

export const minValueRule = (min: number, message?: string): NtkValidationRule =>
  (value) => {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return Number(value) >= min || (message ?? `Valor mínimo: ${min}`)
  }

export const maxValueRule = (max: number, message?: string): NtkValidationRule =>
  (value) => {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return Number(value) <= max || (message ?? `Valor máximo: ${max}`)
  }

export const patternRule = (pattern: RegExp, message = 'Formato inválido'): NtkValidationRule =>
  (value) => {
    if (isEmpty(value)) {
      return true
    }
    return pattern.test(String(value)) || message
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