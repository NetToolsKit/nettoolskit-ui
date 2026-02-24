/**
 * Validators - Unit Tests
 */

import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validateURL,
  validatePhone,
  validateCPF,
  validateCNPJ,
  validatePassword
} from '../../../src/utils/validators'

describe('validators', () => {
  // ============================================================================
  describe('validateEmail()', () => {
    it('should return false for empty string', () => {
      expect(validateEmail('')).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(validateEmail(null as any)).toBe(false)
      expect(validateEmail(undefined as any)).toBe(false)
    })

    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
    })

    it('should return true for email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true)
    })

    it('should return true for email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true)
    })

    it('should return false for email without @', () => {
      expect(validateEmail('testexample.com')).toBe(false)
    })

    it('should return false for email without domain', () => {
      expect(validateEmail('test@')).toBe(false)
    })

    it('should return false for email without TLD', () => {
      expect(validateEmail('test@example')).toBe(false)
    })

    it('should return false for email with spaces', () => {
      expect(validateEmail('test @example.com')).toBe(false)
    })
  })

  // ============================================================================
  describe('validateURL()', () => {
    it('should return false for empty string', () => {
      expect(validateURL('')).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(validateURL(null as any)).toBe(false)
      expect(validateURL(undefined as any)).toBe(false)
    })

    it('should return true for valid http URL', () => {
      expect(validateURL('http://example.com')).toBe(true)
    })

    it('should return true for valid https URL', () => {
      expect(validateURL('https://example.com')).toBe(true)
    })

    it('should return true for URL with path', () => {
      expect(validateURL('https://example.com/path/to/page')).toBe(true)
    })

    it('should return true for URL with query string', () => {
      expect(validateURL('https://example.com?foo=bar')).toBe(true)
    })

    it('should return true for URL with port', () => {
      expect(validateURL('https://example.com:8080')).toBe(true)
    })

    it('should return false for invalid URL', () => {
      expect(validateURL('not-a-url')).toBe(false)
    })

    it('should return false for ftp URL', () => {
      expect(validateURL('ftp://example.com')).toBe(false)
    })

    it('should return false for mailto URL', () => {
      expect(validateURL('mailto:test@example.com')).toBe(false)
    })
  })

  // ============================================================================
  describe('validatePhone()', () => {
    it('should return false for empty string', () => {
      expect(validatePhone('')).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(validatePhone(null as any)).toBe(false)
      expect(validatePhone(undefined as any)).toBe(false)
    })

    it('should return true for valid landline (10 digits)', () => {
      expect(validatePhone('1133334444')).toBe(true)
    })

    it('should return true for valid mobile (11 digits)', () => {
      expect(validatePhone('11999998888')).toBe(true)
    })

    it('should return true for formatted landline', () => {
      expect(validatePhone('(11) 3333-4444')).toBe(true)
    })

    it('should return true for formatted mobile', () => {
      expect(validatePhone('(11) 99999-8888')).toBe(true)
    })

    it('should return false for phone with 9 digits', () => {
      expect(validatePhone('113334444')).toBe(false)
    })

    it('should return false for phone with 12 digits', () => {
      expect(validatePhone('119999988881')).toBe(false)
    })
  })

  // ============================================================================
  describe('validateCPF()', () => {
    it('should return false for empty string', () => {
      expect(validateCPF('')).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(validateCPF(null as any)).toBe(false)
      expect(validateCPF(undefined as any)).toBe(false)
    })

    it('should return false for CPF with wrong length', () => {
      expect(validateCPF('1234567890')).toBe(false)
    })

    it('should return false for CPF with 12 digits', () => {
      expect(validateCPF('123456789012')).toBe(false)
    })
  })

  // ============================================================================
  describe('validateCNPJ()', () => {
    it('should return false for empty string', () => {
      expect(validateCNPJ('')).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(validateCNPJ(null as any)).toBe(false)
      expect(validateCNPJ(undefined as any)).toBe(false)
    })

    it('should return true for valid CNPJ', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true)
    })

    it('should return true for valid CNPJ without mask', () => {
      expect(validateCNPJ('11222333000181')).toBe(true)
    })

    it('should return false for CNPJ with wrong length', () => {
      expect(validateCNPJ('1122233300018')).toBe(false)
    })

    it('should return false for CNPJ with all same digits', () => {
      expect(validateCNPJ('11111111111111')).toBe(false)
    })

    it('should return false for CNPJ with invalid check digits', () => {
      expect(validateCNPJ('11222333000182')).toBe(false)
    })
  })

  // ============================================================================
  describe('validatePassword()', () => {
    it('should return invalid for empty password', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Senha é obrigatória')
    })

    it('should return invalid for null/undefined', () => {
      const result = validatePassword(null as any)
      expect(result.valid).toBe(false)
    })

    it('should return valid for strong password', () => {
      const result = validatePassword('Abc123!@#')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return error for password too short', () => {
      const result = validatePassword('Ab1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Senha deve ter no mínimo 8 caracteres')
    })

    it('should return error for password without lowercase', () => {
      const result = validatePassword('ABC123!@#')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Senha deve conter letras minúsculas')
    })

    it('should return error for password without uppercase', () => {
      const result = validatePassword('abc123!@#')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Senha deve conter letras maiúsculas')
    })

    it('should return error for password without numbers', () => {
      const result = validatePassword('Abcdefgh!@#')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Senha deve conter números')
    })

    it('should return error for password without special chars', () => {
      const result = validatePassword('Abcdefgh123')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Senha deve conter caracteres especiais (@$!%*?&#)')
    })

    it('should accept custom minimum length', () => {
      const result = validatePassword('Ab1!', 4)
      expect(result.valid).toBe(true)
    })

    it('should return multiple errors for very weak password', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })
})
