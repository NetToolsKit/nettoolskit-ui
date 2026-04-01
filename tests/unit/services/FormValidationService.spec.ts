/**
 * FormValidationService - Unit Tests
 */

import { describe, it, expect } from 'vitest'
import { FormValidationService, FormValidator } from '../../../src/services/FormValidationService'

describe('FormValidationService', () => {
  // ============================================================================
  describe('required()', () => {
    const rule = FormValidationService.required()

    it('should return error for null', () => {
      expect(rule(null)).toBe('Campo obrigatório')
    })

    it('should return error for undefined', () => {
      expect(rule(undefined)).toBe('Campo obrigatório')
    })

    it('should return error for empty string', () => {
      expect(rule('')).toBe('Campo obrigatório')
    })

    it('should return error for whitespace only', () => {
      expect(rule('   ')).toBe('Campo obrigatório')
    })

    it('should return error for empty array', () => {
      expect(rule([])).toBe('Campo obrigatório')
    })

    it('should return true for valid string', () => {
      expect(rule('hello')).toBe(true)
    })

    it('should return true for non-empty array', () => {
      expect(rule([1, 2, 3])).toBe(true)
    })

    it('should return true for number 0', () => {
      expect(rule(0)).toBe(true)
    })

    it('should accept custom message', () => {
      const customRule = FormValidationService.required('Custom message')
      expect(customRule(null)).toBe('Custom message')
    })
  })

  // ============================================================================
  describe('email()', () => {
    const rule = FormValidationService.email()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for valid email', () => {
      expect(rule('test@example.com')).toBe(true)
    })

    it('should return true for email with subdomain', () => {
      expect(rule('user@mail.example.com')).toBe(true)
    })

    it('should return error for invalid email without @', () => {
      expect(rule('invalid')).toBe('E-mail inválido')
    })

    it('should return error for invalid email without domain', () => {
      expect(rule('test@')).toBe('E-mail inválido')
    })

    it('should return error for invalid email without TLD', () => {
      expect(rule('test@example')).toBe('E-mail inválido')
    })
  })

  // ============================================================================
  describe('minLength()', () => {
    const rule = FormValidationService.minLength(5)

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for string with exact min length', () => {
      expect(rule('12345')).toBe(true)
    })

    it('should return true for string longer than min', () => {
      expect(rule('123456789')).toBe(true)
    })

    it('should return error for string shorter than min', () => {
      expect(rule('1234')).toBe('Mínimo de 5 caracteres')
    })

    it('should accept custom message', () => {
      const customRule = FormValidationService.minLength(5, 'Too short')
      expect(customRule('123')).toBe('Too short')
    })
  })

  // ============================================================================
  describe('maxLength()', () => {
    const rule = FormValidationService.maxLength(5)

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for string with exact max length', () => {
      expect(rule('12345')).toBe(true)
    })

    it('should return true for string shorter than max', () => {
      expect(rule('123')).toBe(true)
    })

    it('should return error for string longer than max', () => {
      expect(rule('123456')).toBe('Máximo de 5 caracteres')
    })
  })

  // ============================================================================
  describe('lengthBetween()', () => {
    const rule = FormValidationService.lengthBetween(3, 5)

    it('should return true for string within range', () => {
      expect(rule('1234')).toBe(true)
    })

    it('should return true for string at min boundary', () => {
      expect(rule('123')).toBe(true)
    })

    it('should return true for string at max boundary', () => {
      expect(rule('12345')).toBe(true)
    })

    it('should return error for string below min', () => {
      expect(rule('12')).toBe('Entre 3 e 5 caracteres')
    })

    it('should return error for string above max', () => {
      expect(rule('123456')).toBe('Entre 3 e 5 caracteres')
    })
  })

  // ============================================================================
  describe('numeric()', () => {
    const rule = FormValidationService.numeric()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for numeric string', () => {
      expect(rule('12345')).toBe(true)
    })

    it('should return error for string with letters', () => {
      expect(rule('123abc')).toBe('Apenas números são permitidos')
    })

    it('should return error for string with special chars', () => {
      expect(rule('123-456')).toBe('Apenas números são permitidos')
    })
  })

  // ============================================================================
  describe('cpf()', () => {
    const rule = FormValidationService.cpf()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for valid CPF', () => {
      expect(rule('529.982.247-25')).toBe(true)
    })

    it('should return true for valid CPF without mask', () => {
      expect(rule('52998224725')).toBe(true)
    })

    it('should return error for CPF with wrong length', () => {
      expect(rule('1234567890')).toBe('CPF inválido')
    })

    it('should return error for CPF with all same digits', () => {
      expect(rule('11111111111')).toBe('CPF inválido')
    })

    it('should return error for CPF with invalid check digits', () => {
      expect(rule('12345678901')).toBe('CPF inválido')
    })
  })

  // ============================================================================
  describe('cnpj()', () => {
    const rule = FormValidationService.cnpj()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for valid CNPJ', () => {
      expect(rule('11.222.333/0001-81')).toBe(true)
    })

    it('should return true for valid CNPJ without mask', () => {
      expect(rule('11222333000181')).toBe(true)
    })

    it('should return error for CNPJ with wrong length', () => {
      expect(rule('1122233300018')).toBe('CNPJ inválido')
    })

    it('should return error for CNPJ with all same digits', () => {
      expect(rule('11111111111111')).toBe('CNPJ inválido')
    })
  })

  // ============================================================================
  describe('phone()', () => {
    const rule = FormValidationService.phone()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for valid landline (10 digits)', () => {
      expect(rule('1133334444')).toBe(true)
    })

    it('should return true for valid mobile (11 digits)', () => {
      expect(rule('11999998888')).toBe(true)
    })

    it('should return true for formatted phone', () => {
      expect(rule('(11) 99999-8888')).toBe(true)
    })

    it('should return error for phone with wrong length', () => {
      expect(rule('123456789')).toBe('Telefone inválido')
    })
  })

  // ============================================================================
  describe('url()', () => {
    const rule = FormValidationService.url()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for valid http URL', () => {
      expect(rule('http://example.com')).toBe(true)
    })

    it('should return true for valid https URL', () => {
      expect(rule('https://example.com')).toBe(true)
    })

    it('should return true for URL with path', () => {
      expect(rule('https://example.com/path/to/page')).toBe(true)
    })

    it('should return error for invalid URL', () => {
      expect(rule('not-a-url')).toBe('URL inválida')
    })

    it('should return error for URL with invalid protocol', () => {
      expect(rule('mailto:test@example.com')).toBe('URL inválida')
    })
  })

  // ============================================================================
  describe('dateFormat()', () => {
    const rule = FormValidationService.dateFormat()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for valid date format', () => {
      expect(rule('25/12/2024')).toBe(true)
    })

    it('should return error for invalid date format', () => {
      expect(rule('2024-12-25')).toBe('Data inválida (DD/MM/AAAA)')
    })

    it('should return error for incomplete date', () => {
      expect(rule('25/12')).toBe('Data inválida (DD/MM/AAAA)')
    })
  })

  // ============================================================================
  describe('between()', () => {
    const rule = FormValidationService.between(1, 10)

    it('should return true for null (optional)', () => {
      expect(rule(null as any)).toBe(true)
    })

    it('should return true for value within range', () => {
      expect(rule(5)).toBe(true)
    })

    it('should return true for value at min boundary', () => {
      expect(rule(1)).toBe(true)
    })

    it('should return true for value at max boundary', () => {
      expect(rule(10)).toBe(true)
    })

    it('should return error for value below min', () => {
      expect(rule(0)).toBe('Valor deve estar entre 1 e 10')
    })

    it('should return error for value above max', () => {
      expect(rule(11)).toBe('Valor deve estar entre 1 e 10')
    })
  })

  // ============================================================================
  describe('min()', () => {
    const rule = FormValidationService.min(5)

    it('should return true for value at min', () => {
      expect(rule(5)).toBe(true)
    })

    it('should return true for value above min', () => {
      expect(rule(10)).toBe(true)
    })

    it('should return error for value below min', () => {
      expect(rule(4)).toBe('Valor mínimo: 5')
    })
  })

  // ============================================================================
  describe('max()', () => {
    const rule = FormValidationService.max(10)

    it('should return true for value at max', () => {
      expect(rule(10)).toBe(true)
    })

    it('should return true for value below max', () => {
      expect(rule(5)).toBe(true)
    })

    it('should return error for value above max', () => {
      expect(rule(11)).toBe('Valor máximo: 10')
    })
  })

  // ============================================================================
  describe('match()', () => {
    it('should return true when values match', () => {
      const rule = FormValidationService.match('password123', 'Senha')
      expect(rule('password123')).toBe(true)
    })

    it('should return error when values do not match', () => {
      const rule = FormValidationService.match('password123', 'Senha')
      expect(rule('different')).toBe('Deve corresponder a Senha')
    })
  })

  // ============================================================================
  describe('pattern()', () => {
    const rule = FormValidationService.pattern(/^[A-Z]{3}$/, 'Must be 3 uppercase letters')

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for matching pattern', () => {
      expect(rule('ABC')).toBe(true)
    })

    it('should return error for non-matching pattern', () => {
      expect(rule('abc')).toBe('Must be 3 uppercase letters')
    })
  })

  // ============================================================================
  describe('strongPassword()', () => {
    const rule = FormValidationService.strongPassword()

    it('should return true for empty value (optional)', () => {
      expect(rule('')).toBe(true)
    })

    it('should return true for strong password', () => {
      expect(rule('Abc123!@#')).toBe(true)
    })

    it('should return error for weak password (no uppercase)', () => {
      expect(rule('abc123!@#')).toContain('Senha fraca')
    })

    it('should return error for weak password (no lowercase)', () => {
      expect(rule('ABC123!@#')).toContain('Senha fraca')
    })

    it('should return error for weak password (no number)', () => {
      expect(rule('Abcdef!@#')).toContain('Senha fraca')
    })

    it('should return error for weak password (no special)', () => {
      expect(rule('Abcdef123')).toContain('Senha fraca')
    })

    it('should return error for weak password (too short)', () => {
      expect(rule('Ab1!')).toContain('Senha fraca')
    })
  })

  // ============================================================================
  describe('combine()', () => {
    it('should return true when all rules pass', () => {
      const rule = FormValidationService.combine(
        FormValidationService.required(),
        FormValidationService.minLength(3),
        FormValidationService.maxLength(10)
      )
      expect(rule('hello')).toBe(true)
    })

    it('should return first error when a rule fails', () => {
      const rule = FormValidationService.combine(
        FormValidationService.required(),
        FormValidationService.minLength(10)
      )
      expect(rule('hi')).toBe('Mínimo de 10 caracteres')
    })

    it('should return required error first', () => {
      const rule = FormValidationService.combine(
        FormValidationService.required(),
        FormValidationService.email()
      )
      expect(rule('')).toBe('Campo obrigatório')
    })
  })
})

// ============================================================================
describe('FormValidator', () => {
  describe('validate()', () => {
    it('should return valid true when all fields pass', () => {
      const data = {
        name: 'John',
        email: 'john@example.com'
      }
      const rules = {
        name: [FormValidationService.required()],
        email: [FormValidationService.required(), FormValidationService.email()]
      }

      const result = FormValidator.validate(data, rules)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return valid false with errors when fields fail', () => {
      const data = {
        name: '',
        email: 'invalid'
      }
      const rules = {
        name: [FormValidationService.required()],
        email: [FormValidationService.required(), FormValidationService.email()]
      }

      const result = FormValidator.validate(data, rules)

      expect(result.valid).toBe(false)
      expect(result.errors.name).toBe('Campo obrigatório')
      expect(result.errors.email).toBe('E-mail inválido')
    })

    it('should stop at first failing rule per field', () => {
      const data = {
        password: ''
      }
      const rules = {
        password: [
          FormValidationService.required('Password required'),
          FormValidationService.minLength(8, 'Min 8 chars')
        ]
      }

      const result = FormValidator.validate(data, rules)

      expect(result.errors.password).toBe('Password required')
    })
  })
})