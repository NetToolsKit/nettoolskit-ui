/**
 * Pure form schema model (L2-core).
 *
 * `defineForm` turns a declarative field list into a normalized, validated
 * schema; `createInitialValues`, `resolveFieldRules` and `validateForm` make the
 * schema drive a real form without any Vue/DOM dependency. The Vue renderer
 * (`DsForm`) consumes these outputs.
 */

import {
  emailRule,
  maxLengthRule,
  maxValueRule,
  minLengthRule,
  minValueRule,
  patternRule,
  requiredRule,
  runNtkRules,
  type NtkValidationRule,
} from './validation'

/** Closed set of field types. Each maps to an existing `Ds*` field component. */
export const ntkFieldTypes = [
  'text',
  'email',
  'password',
  'number',
  'textarea',
  'select',
  'multiselect',
  'checkbox',
  'switch',
  'date',
  'time',
] as const
export type NtkFieldType = (typeof ntkFieldTypes)[number]

export const ntkFormColumns = [1, 2, 3, 4] as const
export type NtkFormColumnCount = (typeof ntkFormColumns)[number]
export type NtkFieldColumnSpan = NtkFormColumnCount

export interface NtkFieldOption {
  readonly label: string
  readonly value: string | number | boolean
  readonly disabled?: boolean
}

export interface NtkFieldSchema {
  readonly field: string
  readonly type: NtkFieldType
  readonly label?: string
  readonly placeholder?: string
  readonly help?: string
  readonly required?: boolean
  readonly disabled?: boolean
  readonly readonly?: boolean
  readonly clearable?: boolean
  readonly defaultValue?: unknown
  /** Options for `select` / `multiselect`. Required for those types. */
  readonly options?: readonly NtkFieldOption[]
  /** Numeric value bounds (`number`). */
  readonly min?: number
  readonly max?: number
  /** String length bounds (`text` / `email` / `password` / `textarea`). */
  readonly minLength?: number
  readonly maxLength?: number
  readonly pattern?: RegExp
  /** Extra custom rules (e.g. `FormValidationService.cpf()`). */
  readonly rules?: readonly NtkValidationRule[]
  /** How many layout columns the field spans. */
  readonly colSpan?: NtkFieldColumnSpan
}

export interface NtkNormalizedField extends NtkFieldSchema {
  readonly label: string
}

export interface NtkFormSchema {
  readonly fields: readonly NtkFieldSchema[]
  readonly columns?: NtkFormColumnCount
}

export interface NtkNormalizedFormSchema {
  readonly fields: readonly NtkNormalizedField[]
  readonly columns: NtkFormColumnCount
}

export interface NtkFormValidationResult {
  readonly valid: boolean
  readonly errors: Record<string, string>
}

const FIELD_TYPES_REQUIRING_OPTIONS: ReadonlySet<NtkFieldType> = new Set(['select', 'multiselect'])

/** Turn a field key (`firstName`, `first_name`) into a readable label. */
export const humanizeFieldName = (name: string): string => {
  const spaced = name
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .toLowerCase()
  if (!spaced) {
    return name
  }
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const normalizeField = (field: NtkFieldSchema): NtkNormalizedField => ({
  ...field,
  label: field.label ?? humanizeFieldName(field.field),
})

/**
 * Validate and normalize a form schema. Throws on misconfiguration (missing
 * key, duplicate key, unknown type, select without options) so mistakes fail
 * fast at development time rather than rendering a broken form.
 */
export const defineForm = (schema: NtkFormSchema): NtkNormalizedFormSchema => {
  const seen = new Set<string>()
  const fields = schema.fields.map((field) => {
    if (!field.field) {
      throw new Error('NtkFieldSchema.field is required')
    }
    if (seen.has(field.field)) {
      throw new Error(`Duplicate form field: "${field.field}"`)
    }
    seen.add(field.field)
    if (!ntkFieldTypes.includes(field.type)) {
      throw new Error(`Unknown field type "${field.type}" for "${field.field}"`)
    }
    if (FIELD_TYPES_REQUIRING_OPTIONS.has(field.type) && !(field.options && field.options.length > 0)) {
      throw new Error(`Field "${field.field}" of type "${field.type}" requires non-empty options`)
    }
    return normalizeField(field)
  })

  return { fields, columns: schema.columns ?? 1 }
}

const defaultValueForType = (field: NtkFieldSchema): unknown => {
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }
  switch (field.type) {
    case 'multiselect':
      return []
    case 'checkbox':
    case 'switch':
      return false
    case 'number':
    case 'select':
      return null
    default:
      return ''
  }
}

/**
 * Build the initial value object for a schema. `seed` (e.g. a row being edited)
 * wins over per-field defaults; missing keys fall back to a type-appropriate
 * empty value.
 */
export const createInitialValues = (
  schema: NtkFormSchema | NtkNormalizedFormSchema,
  seed: Record<string, unknown> = {},
): Record<string, unknown> => {
  const values: Record<string, unknown> = {}
  for (const field of schema.fields) {
    values[field.field] = field.field in seed ? seed[field.field] : defaultValueForType(field)
  }
  return values
}

/** Derive the ordered rule list for a field from its declarative constraints. */
export const resolveFieldRules = (field: NtkFieldSchema): NtkValidationRule[] => {
  const rules: NtkValidationRule[] = []
  if (field.required) {
    rules.push(requiredRule())
  }
  if (field.type === 'email') {
    rules.push(emailRule())
  }
  if (typeof field.minLength === 'number') {
    rules.push(minLengthRule(field.minLength))
  }
  if (typeof field.maxLength === 'number') {
    rules.push(maxLengthRule(field.maxLength))
  }
  if (typeof field.min === 'number') {
    rules.push(minValueRule(field.min))
  }
  if (typeof field.max === 'number') {
    rules.push(maxValueRule(field.max))
  }
  if (field.pattern) {
    rules.push(patternRule(field.pattern))
  }
  if (field.rules) {
    rules.push(...field.rules)
  }
  return rules
}

/** Validate a single field value, returning `true` or the first error message. */
export const validateField = (field: NtkFieldSchema, value: unknown): true | string =>
  runNtkRules(resolveFieldRules(field), value)

/** Validate every field in a schema against a values object. */
export const validateForm = (
  schema: NtkFormSchema | NtkNormalizedFormSchema,
  values: Record<string, unknown>,
): NtkFormValidationResult => {
  const errors: Record<string, string> = {}
  for (const field of schema.fields) {
    const result = validateField(field, values[field.field])
    if (result !== true) {
      errors[field.field] = result
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}