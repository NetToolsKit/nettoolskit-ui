/**
 * FormValidationService - Application Layer service for validations
 * 
 * Encapsulates form validation rules without framework dependencies.
 * Can be used in any context (Vue, React, Angular, vanilla JS).
 * 
 * Follows Clean Architecture: Application Layer defines business rules.
 * 
 * @layer Application
 */

/**
 * Validation result
 */
export type ValidationResult = true | string

/**
 * Generic validation function
 */
export type ValidationRule<T = any> = (val: T) => ValidationResult

/**
 * Form Validation Service
 * 
 * Provides reusable and standardized validation rules.
 * All rules return `true` if valid or `string` with error message.
 */
export class FormValidationService {
  /**
   * Validates required field
   */
  static required(message = 'Campo obrigatório'): ValidationRule {
    return (val: any) => {
      // Validates null, undefined, empty string, empty array
      if (val === null || val === undefined) return message
      if (typeof val === 'string' && val.trim() === '') return message
      if (Array.isArray(val) && val.length === 0) return message
      return true
    }
  }

  /**
   * Validates email format
   */
  static email(message = 'E-mail inválido'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true // Optional by default
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(val) || message
    }
  }

  /**
   * Validates minimum length
   */
  static minLength(min: number, message?: string): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      const defaultMessage = `Mínimo de ${min} caracteres`
      return val.length >= min || message || defaultMessage
    }
  }

  /**
   * Validates maximum length
   */
  static maxLength(max: number, message?: string): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      const defaultMessage = `Máximo de ${max} caracteres`
      return val.length <= max || message || defaultMessage
    }
  }

  /**
   * Validates length range
   */
  static lengthBetween(min: number, max: number, message?: string): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      const defaultMessage = `Entre ${min} e ${max} caracteres`
      return (val.length >= min && val.length <= max) || message || defaultMessage
    }
  }

  /**
   * Validates numbers only
   */
  static numeric(message = 'Apenas números são permitidos'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      return /^\d+$/.test(val) || message
    }
  }

  /**
   * Validates Brazilian CPF
   */
  static cpf(message = 'CPF inválido'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      
      const cleanCpf = val.replace(/\D/g, '')
      if (cleanCpf.length !== 11) return message
      
      // Check if all digits are the same
      if (/^(\d)\1{10}$/.test(cleanCpf)) return message
      
      // Validate check digits
      let sum = 0
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
      }
      let digit = 11 - (sum % 11)
      if (digit >= 10) digit = 0
      if (digit !== parseInt(cleanCpf.charAt(9))) return message
      
      sum = 0
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
      }
      digit = 11 - (sum % 11)
      if (digit >= 10) digit = 0
      if (digit !== parseInt(cleanCpf.charAt(10))) return message
      
      return true
    }
  }

  /**
   * Validates Brazilian CNPJ
   */
  static cnpj(message = 'CNPJ inválido'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      
      const cleanCnpj = val.replace(/\D/g, '')
      if (cleanCnpj.length !== 14) return message
      
      // Check if all digits are the same
      if (/^(\d)\1{13}$/.test(cleanCnpj)) return message
      
      // Validate first check digit
      let length = cleanCnpj.length - 2
      let numbers = cleanCnpj.substring(0, length)
      const digits = cleanCnpj.substring(length)
      let sum = 0
      let pos = length - 7
      
      for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--
        if (pos < 2) pos = 9
      }
      
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== parseInt(digits.charAt(0))) return message
      
      // Validate second check digit
      length = length + 1
      numbers = cleanCnpj.substring(0, length)
      sum = 0
      pos = length - 7
      
      for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--
        if (pos < 2) pos = 9
      }
      
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== parseInt(digits.charAt(1))) return message
      
      return true
    }
  }

  /**
   * Validates Brazilian phone
   */
  static phone(message = 'Telefone inválido'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      const cleanPhone = val.replace(/\D/g, '')
      // Accepts landline (10 digits) and mobile (11 digits)
      return (cleanPhone.length >= 10 && cleanPhone.length <= 11) || message
    }
  }

  /**
   * Validates URL
   */
  static url(message = 'URL inválida'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      try {
        const urlObj = new URL(val)
        const validProtocols = ['http:', 'https:', 'ftp:', 'ftps:']
        return validProtocols.includes(urlObj.protocol) || message
      } catch {
        return message
      }
    }
  }

  /**
   * Validates date format DD/MM/YYYY
   */
  static dateFormat(message = 'Data inválida (DD/MM/AAAA)'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/
      return datePattern.test(val) || message
    }
  }

  /**
   * Validates numeric value between min and max
   */
  static between(min: number, max: number, message?: string): ValidationRule<number> {
    return (val: number) => {
      if (val === null || val === undefined) return true
      const defaultMessage = `Valor deve estar entre ${min} e ${max}`
      return (val >= min && val <= max) || message || defaultMessage
    }
  }

  /**
   * Validates minimum value
   */
  static min(minValue: number, message?: string): ValidationRule<number> {
    return (val: number) => {
      if (val === null || val === undefined) return true
      const defaultMessage = `Valor mínimo: ${minValue}`
      return val >= minValue || message || defaultMessage
    }
  }

  /**
   * Validates maximum value
   */
  static max(maxValue: number, message?: string): ValidationRule<number> {
    return (val: number) => {
      if (val === null || val === undefined) return true
      const defaultMessage = `Valor máximo: ${maxValue}`
      return val <= maxValue || message || defaultMessage
    }
  }

  /**
   * Validates if field matches another value
   */
  static match(otherValue: any, fieldName: string, message?: string): ValidationRule {
    return (val: any) => {
      const defaultMessage = `Deve corresponder a ${fieldName}`
      return val === otherValue || message || defaultMessage
    }
  }

  /**
   * Validates custom regex pattern
   */
  static pattern(regex: RegExp, message = 'Formato inválido'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      return regex.test(val) || message
    }
  }

  /**
   * Validates strong password
   * Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special
   */
  static strongPassword(message = 'Senha fraca. Mínimo: 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial'): ValidationRule<string> {
    return (val: string) => {
      if (!val) return true
      const hasMinLength = val.length >= 8
      const hasUpperCase = /[A-Z]/.test(val)
      const hasLowerCase = /[a-z]/.test(val)
      const hasNumber = /\d/.test(val)
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val)
      
      return (hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial) || message
    }
  }

  /**
   * Combines multiple rules into one
   */
  static combine(...rules: ValidationRule[]): ValidationRule {
    return (val: any) => {
      for (const rule of rules) {
        const result = rule(val)
        if (result !== true) return result
      }
      return true
    }
  }
}

/**
 * Complete object validator
 * Useful for validating multiple fields at once
 */
export interface FieldValidation {
  [field: string]: ValidationRule[]
}

export interface ValidationErrors {
  [field: string]: string
}

export class FormValidator {
  /**
   * Validates complete object with multiple fields
   */
  static validate(data: Record<string, any>, rules: FieldValidation): { valid: boolean; errors: ValidationErrors } {
    const errors: ValidationErrors = {}
    
    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field]
      
      for (const rule of fieldRules) {
        const result = rule(value)
        if (result !== true) {
          errors[field] = result
          break // Stop at first failing rule
        }
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }
}