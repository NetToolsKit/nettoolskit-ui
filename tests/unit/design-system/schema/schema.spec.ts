/**
 * Contract tests for the pure schema core (L2-core): field model, initial
 * values, rule resolution, validation, and resource normalization.
 */

import { describe, expect, it } from 'vitest'
import {
  createInitialValues,
  defineForm,
  defineResource,
  emailRule,
  humanizeFieldName,
  maxLengthRule,
  maxValueRule,
  minLengthRule,
  minValueRule,
  ntkFieldTypes,
  patternRule,
  requiredRule,
  resolveFieldRules,
  runNtkRules,
  validateField,
  validateForm,
  type NtkFieldSchema,
} from '@/design-system/core'

describe('field type vocabulary', () => {
  it('is a stable closed enum', () => {
    expect(ntkFieldTypes).toEqual([
      'text', 'email', 'password', 'number', 'textarea',
      'select', 'multiselect', 'checkbox', 'switch', 'date', 'time',
    ])
  })
})

describe('humanizeFieldName', () => {
  it('humanizes camelCase, snake_case and kebab-case', () => {
    expect(humanizeFieldName('firstName')).toBe('First name')
    expect(humanizeFieldName('first_name')).toBe('First name')
    expect(humanizeFieldName('first-name')).toBe('First name')
    expect(humanizeFieldName('id')).toBe('Id')
  })
})

describe('defineForm', () => {
  it('normalizes labels and defaults columns to 1', () => {
    const schema = defineForm({ fields: [{ field: 'fullName', type: 'text' }] })
    expect(schema.columns).toBe(1)
    expect(schema.fields[0].label).toBe('Full name')
  })

  it('keeps an explicit label and column count', () => {
    const schema = defineForm({ fields: [{ field: 'a', type: 'text', label: 'A' }], columns: 3 })
    expect(schema.fields[0].label).toBe('A')
    expect(schema.columns).toBe(3)
  })

  it('throws on missing key, duplicate key, unknown type, and select without options', () => {
    expect(() => defineForm({ fields: [{ field: '', type: 'text' }] })).toThrow(/field is required/)
    expect(() => defineForm({ fields: [{ field: 'a', type: 'text' }, { field: 'a', type: 'text' }] }))
      .toThrow(/Duplicate/)
    expect(() => defineForm({ fields: [{ field: 'a', type: 'bogus' as never }] })).toThrow(/Unknown field type/)
    expect(() => defineForm({ fields: [{ field: 'a', type: 'select' }] })).toThrow(/requires non-empty options/)
  })

  it('accepts select/multiselect with options', () => {
    const schema = defineForm({
      fields: [{ field: 'uf', type: 'select', options: [{ label: 'SP', value: 'SP' }] }],
    })
    expect(schema.fields[0].options).toHaveLength(1)
  })
})

describe('createInitialValues', () => {
  const schema = defineForm({
    fields: [
      { field: 'name', type: 'text' },
      { field: 'age', type: 'number' },
      { field: 'uf', type: 'select', options: [{ label: 'SP', value: 'SP' }] },
      { field: 'tags', type: 'multiselect', options: [{ label: 'A', value: 'a' }] },
      { field: 'active', type: 'switch' },
      { field: 'accepted', type: 'checkbox' },
      { field: 'role', type: 'text', defaultValue: 'guest' },
    ],
  })

  it('returns type-appropriate empty values', () => {
    expect(createInitialValues(schema)).toEqual({
      name: '',
      age: null,
      uf: null,
      tags: [],
      active: false,
      accepted: false,
      role: 'guest',
    })
  })

  it('lets a seed override defaults', () => {
    const values = createInitialValues(schema, { name: 'Ana', age: 30 })
    expect(values.name).toBe('Ana')
    expect(values.age).toBe(30)
    expect(values.role).toBe('guest')
  })
})

describe('resolveFieldRules', () => {
  it('orders rules required → type → bounds → custom', () => {
    const custom = () => true as const
    const rules = resolveFieldRules({ field: 'e', type: 'email', required: true, maxLength: 5, rules: [custom] })
    // required + email (from type) + maxLength + custom
    expect(rules).toHaveLength(4)
    expect(rules[3]).toBe(custom)
    // required rule fires first on empty input
    expect(rules[0]('')).toBe('Preencha este campo')
  })

  it('adds no rules for an unconstrained optional field', () => {
    expect(resolveFieldRules({ field: 'note', type: 'text' })).toHaveLength(0)
  })
})

describe('validation primitives', () => {
  it('requiredRule rejects empty values but allows 0 and false', () => {
    const rule = requiredRule()
    expect(rule('')).toBe('Preencha este campo')
    expect(rule(null)).toBeTypeOf('string')
    expect(rule([])).toBeTypeOf('string')
    expect(rule(0)).toBe(true)
    expect(rule(false)).toBe(true)
    expect(rule('x')).toBe(true)
  })

  it('emailRule is optional-friendly', () => {
    expect(emailRule()('')).toBe(true)
    expect(emailRule()('a@b.co')).toBe(true)
    expect(emailRule()('nope')).toBeTypeOf('string')
  })

  it('length and value bounds', () => {
    expect(minLengthRule(3)('ab')).toBeTypeOf('string')
    expect(minLengthRule(3)('abc')).toBe(true)
    expect(maxLengthRule(3)('abcd')).toBeTypeOf('string')
    expect(minValueRule(10)(5)).toBeTypeOf('string')
    expect(maxValueRule(10)(11)).toBeTypeOf('string')
    expect(maxValueRule(10)(10)).toBe(true)
  })

  it('patternRule and runNtkRules short-circuit to the first failure', () => {
    expect(patternRule(/^\d+$/)('12a')).toBe('Formato inválido')
    expect(runNtkRules([requiredRule(), emailRule()], '')).toBe('Preencha este campo')
    expect(runNtkRules([requiredRule(), emailRule()], 'bad')).toBeTypeOf('string')
    expect(runNtkRules([requiredRule(), emailRule()], 'a@b.co')).toBe(true)
  })
})

describe('validateField / validateForm', () => {
  const schema = defineForm({
    fields: [
      { field: 'name', type: 'text', required: true, minLength: 2 },
      { field: 'email', type: 'email', required: true },
      { field: 'age', type: 'number', min: 18, max: 120 },
    ],
  })

  it('validateField returns the first failing message', () => {
    expect(validateField(schema.fields[0], '')).toBe('Preencha este campo')
    expect(validateField(schema.fields[0], 'a')).toBeTypeOf('string')
    expect(validateField(schema.fields[0], 'Ana')).toBe(true)
  })

  it('validateForm aggregates errors and reports validity', () => {
    const invalid = validateForm(schema, { name: '', email: 'bad', age: 5 })
    expect(invalid.valid).toBe(false)
    expect(Object.keys(invalid.errors).sort()).toEqual(['age', 'email', 'name'])

    const valid = validateForm(schema, { name: 'Ana', email: 'a@b.co', age: 30 })
    expect(valid.valid).toBe(true)
    expect(valid.errors).toEqual({})
  })
})

describe('defineResource', () => {
  it('normalizes columns, defaults rowKey, and embeds a normalized form', () => {
    const resource = defineResource({
      title: 'Clients',
      columns: [
        { field: 'name' },
        { field: 'createdAt', label: 'Created', align: 'right', sortable: true },
      ],
      form: [{ field: 'name', type: 'text', required: true }],
    })

    expect(resource.rowKey).toBe('id')
    expect(resource.columns[0]).toMatchObject({ field: 'name', label: 'Name', align: 'left' })
    expect(resource.columns[1]).toMatchObject({ label: 'Created', align: 'right', sortable: true })
    expect(resource.form.fields[0].label).toBe('Name')
  })

  it('honors a custom rowKey and rejects invalid resources', () => {
    expect(defineResource({ title: 'X', rowKey: 'uuid', columns: [{ field: 'a' }] }).rowKey).toBe('uuid')
    expect(() => defineResource({ title: '', columns: [{ field: 'a' }] })).toThrow(/title is required/)
    expect(() => defineResource({ title: 'X', columns: [] })).toThrow(/columns must not be empty/)
  })
})
describe('schema coverage completeness', () => {
  it('humanizeFieldName returns the original for empty or separator-only names', () => {
    expect(humanizeFieldName('')).toBe('')
    expect(humanizeFieldName('___')).toBe('___')
  })

  it('resolveFieldRules includes a pattern rule when pattern is set', () => {
    const rules = resolveFieldRules({ field: 'code', type: 'text', pattern: /^\d+$/ })
    expect(rules).toHaveLength(1)
    expect(rules[0]('12a')).toBe('Formato inválido')
    expect(rules[0]('123')).toBe(true)
  })

  it('bounded rules are optional-friendly on empty input', () => {
    expect(minLengthRule(3)('')).toBe(true)
    expect(maxLengthRule(3)('')).toBe(true)
    expect(minValueRule(1)('')).toBe(true)
    expect(minValueRule(1)(null)).toBe(true)
    expect(maxValueRule(1)('')).toBe(true)
    expect(maxValueRule(1)(undefined)).toBe(true)
    expect(patternRule(/x/)('')).toBe(true)
  })

  it('defineResource rejects a column without a field', () => {
    expect(() => defineResource({ title: 'X', columns: [{ field: '' } as never] })).toThrow(/field is required/)
  })
})