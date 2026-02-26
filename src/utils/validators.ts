/**
 * Validators - Funções de validação reutilizáveis
 * 
 * Validadores puros sem dependências de framework.
 * Podem ser usados em qualquer contexto (Vue, Node.js, etc).
 * 
 * @layer Utils
 */

/**
 * Valida formato de email (RFC 5322 simplificado)
 */
export function validateEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida formato de URL (http/https)
 */
export function validateURL(url: string): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Valida telefone brasileiro
 * Formatos aceitos: (XX) XXXXX-XXXX, (XX) XXXX-XXXX, XXXXXXXXXXX, XXXXXXXXXX
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Valida CPF brasileiro com dígitos verificadores
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf) return false
  
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  
    // Reject CPFs with all equal digits
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  
  // Calculate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0
  
  if (digit1 !== parseInt(cleaned.charAt(9))) return false
  
  // Calculate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0
  
  return digit2 === parseInt(cleaned.charAt(10))
}

/**
 * Valida CNPJ brasileiro com dígitos verificadores
 */
export function validateCNPJ(cnpj: string): boolean {
  if (!cnpj) return false
  
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14) return false
  
  // Reject CNPJs with all equal digits
  if (/^(\d)\1+$/.test(cleaned)) return false
  
  // Calculate first check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i]
  }
  let digit1 = sum % 11
  digit1 = digit1 < 2 ? 0 : 11 - digit1
  
  if (digit1 !== parseInt(cleaned.charAt(12))) return false
  
  // Calculate second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i]
  }
  let digit2 = sum % 11
  digit2 = digit2 < 2 ? 0 : 11 - digit2
  
  return digit2 === parseInt(cleaned.charAt(13))
}

/**
 * Validates password strength
 * Returns object with result and error messages
 */
export function validatePassword(
  password: string,
  minLength: number = 8
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!password) {
    errors.push('Senha é obrigatória')
    return { valid: false, errors }
  }
  
  if (password.length < minLength) {
    errors.push(`Senha deve ter no mínimo ${minLength} caracteres`)
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter letras minúsculas')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter letras maiúsculas')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter números')
  }
  
  if (!/[@$!%*?&#]/.test(password)) {
    errors.push('Senha deve conter caracteres especiais (@$!%*?&#)')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}