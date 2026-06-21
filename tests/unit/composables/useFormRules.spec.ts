/**
 * useFormRules Composable - Unit Tests
 */

import { describe, it, expect } from 'vitest'
import { useFormRules } from '../../../src/composables/forms/useFormRules'

describe('useFormRules', () => {
  it('should return all validation methods', () => {
    const rules = useFormRules()

    expect(rules.required).toBeDefined()
    expect(rules.email).toBeDefined()

    expect(rules.minLength).toBeDefined()
    expect(rules.maxLength).toBeDefined()
    expect(rules.lengthBetween).toBeDefined()

    expect(rules.numeric).toBeDefined()
    expect(rules.between).toBeDefined()
    expect(rules.min).toBeDefined()
    expect(rules.max).toBeDefined()

    expect(rules.cpf).toBeDefined()
    expect(rules.cnpj).toBeDefined()

    expect(rules.phone).toBeDefined()

    expect(rules.url).toBeDefined()

    expect(rules.dateFormat).toBeDefined()

    expect(rules.match).toBeDefined()

    expect(rules.pattern).toBeDefined()

    expect(rules.strongPassword).toBeDefined()

    expect(rules.combine).toBeDefined()
  })

  describe('required()', () => {
    it('should validate required field', () => {
      const { required } = useFormRules()
      const rule = required()

      expect(rule('value')).toBe(true)
      expect(rule('')).toBe('Required field')
      expect(rule(null)).toBe('Required field')
    })

    it('should accept custom message', () => {
      const { required } = useFormRules()
      const rule = required('Field is required')

      expect(rule('')).toBe('Field is required')
    })
  })

  describe('email()', () => {
    it('should validate email format', () => {
      const { email } = useFormRules()
      const rule = email()

      expect(rule('test@example.com')).toBe(true)
      expect(rule('invalid')).toBe('Invalid email')
      expect(rule('')).toBe(true)
    })
  })

  describe('minLength()', () => {
    it('should validate minimum length', () => {
      const { minLength } = useFormRules()
      const rule = minLength(5)

      expect(rule('12345')).toBe(true)
      expect(rule('1234')).toBe('Minimum 5 characters')
    })
  })

  describe('maxLength()', () => {
    it('should validate maximum length', () => {
      const { maxLength } = useFormRules()
      const rule = maxLength(5)

      expect(rule('12345')).toBe(true)
      expect(rule('123456')).toBe('Maximum 5 characters')
    })
  })

  describe('numeric()', () => {
    it('should validate numeric only', () => {
      const { numeric } = useFormRules()
      const rule = numeric()

      expect(rule('12345')).toBe(true)
      expect(rule('123abc')).toBe('Only numbers are allowed')
    })
  })

  describe('cpf()', () => {
    it('should validate CPF', () => {
      const { cpf } = useFormRules()
      const rule = cpf()

      expect(rule('529.982.247-25')).toBe(true)
      expect(rule('11111111111')).toBe('Invalid CPF')
    })
  })

  describe('cnpj()', () => {
    it('should validate CNPJ', () => {
      const { cnpj } = useFormRules()
      const rule = cnpj()

      expect(rule('11.222.333/0001-81')).toBe(true)
      expect(rule('11111111111111')).toBe('Invalid CNPJ')
    })
  })

  describe('phone()', () => {
    it('should validate phone', () => {
      const { phone } = useFormRules()
      const rule = phone()

      expect(rule('11999998888')).toBe(true)
      expect(rule('123456789')).toBe('Invalid phone number')
    })
  })

  describe('url()', () => {
    it('should validate URL', () => {
      const { url } = useFormRules()
      const rule = url()

      expect(rule('https://example.com')).toBe(true)
      expect(rule('not-a-url')).toBe('Invalid URL')
    })
  })

  describe('between()', () => {
    it('should validate numeric range', () => {
      const { between } = useFormRules()
      const rule = between(1, 10)

      expect(rule(5)).toBe(true)
      expect(rule(0)).toBe('Value must be between 1 and 10')
      expect(rule(11)).toBe('Value must be between 1 and 10')
    })
  })

  describe('strongPassword()', () => {
    it('should validate strong password', () => {
      const { strongPassword } = useFormRules()
      const rule = strongPassword()

      expect(rule('Abc123!@#')).toBe(true)
      expect(rule('weak')).toContain('Weak password')
    })
  })

  describe('combine()', () => {
    it('should combine multiple rules', () => {
      const { combine, required, minLength, maxLength } = useFormRules()
      const rule = combine(
        required(),
        minLength(3),
        maxLength(10)
      )

      expect(rule('hello')).toBe(true)
      expect(rule('')).toBe('Required field')
      expect(rule('hi')).toBe('Minimum 3 characters')
      expect(rule('hello world!')).toBe('Maximum 10 characters')
    })
  })

  describe('pattern()', () => {
    it('should validate custom pattern', () => {
      const { pattern } = useFormRules()
      const rule = pattern(/^[A-Z]{3}-\d{4}$/, 'Invalid plate format')

      expect(rule('ABC-1234')).toBe(true)
      expect(rule('abc-1234')).toBe('Invalid plate format')
    })
  })

  describe('match()', () => {
    it('should validate field match', () => {
      const { match } = useFormRules()
      const password = 'secret123'
      const rule = match(password, 'password')

      expect(rule('secret123')).toBe(true)
      expect(rule('different')).toBe('Must match password')
    })
  })
})
