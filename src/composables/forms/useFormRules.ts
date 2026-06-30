/**
 * useFormRules - Vue composable for form validation.
 * 
 * Vue wrapper for FormValidationService (Application Layer).
 * 
 * This composable follows Clean Architecture:
 * - Presentation (composable) → Application (service)
 * 
 * @example
 * const { required, email, minLength } = useFormRules()
 * const rules = [required(), email(), minLength(8)]
 * 
 * @layer Presentation
 */

import { FormValidationService } from '../../design-system/core/validators/FormValidationService'

/**
 * Composable useFormRules
 * 
 * Returns FormValidationService validation methods wrapped for use
 * in Vue/Quasar components.
 * 
 * @returns Object with typed validation methods
 */
export function useFormRules() {
  return {
    // Basic validations
    required: FormValidationService.required,
    email: FormValidationService.email,
    
    // Length validations
    minLength: FormValidationService.minLength,
    maxLength: FormValidationService.maxLength,
    lengthBetween: FormValidationService.lengthBetween,
    
    // Numeric validations
    numeric: FormValidationService.numeric,
    between: FormValidationService.between,
    min: FormValidationService.min,
    max: FormValidationService.max,
    
    // Brazilian documents
    cpf: FormValidationService.cpf,
    cnpj: FormValidationService.cnpj,
    
    // Contact info
    phone: FormValidationService.phone,
    
    // Internet
    url: FormValidationService.url,
    
    // Date
    dateFormat: FormValidationService.dateFormat,
    
    // Match
    match: FormValidationService.match,
    
    // Custom pattern
    pattern: FormValidationService.pattern,
    
    // Password
    strongPassword: FormValidationService.strongPassword,
    
    // Rule combination
    combine: FormValidationService.combine
  }
}

/**
 * Re-export types for convenience
 */
export type { ValidationRule, ValidationResult } from '../../design-system/core/validators/FormValidationService'