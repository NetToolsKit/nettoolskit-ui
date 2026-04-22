/**
 * useFormRules - Composable Vue para validações de formulário
 * 
 * Wrapper Vue para o FormValidationService (Application Layer).
 * 
 * Este composable agora está conforme Clean Architecture:
 * - Presentation (composable) → Application (service)
 * 
 * @example
 * const { required, email, minLength } = useFormRules()
 * const rules = [required(), email(), minLength(8)]
 * 
 * @layer Presentation
 */

import { FormValidationService } from '../../services/FormValidationService'

/**
 * Composable useFormRules
 * 
 * Retorna métodos de validação do FormValidationService encapsulados para uso
 * in Vue/Quasar components.
 * 
 * @returns Objeto com métodos de validação tipados
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
 * Re-exporta tipos para conveniência
 */
export type { ValidationRule, ValidationResult } from '../../services/FormValidationService'
