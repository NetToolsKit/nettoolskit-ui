import { describe, expect, it } from 'vitest'
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
  truncate,
  capitalize,
  formatBytes,
  formatDuration,
  slugify,
} from '../../../src/utils/formatters'

describe('formatCurrency', () => {
  it('formats BRL by default', () => {
    expect(formatCurrency(1234.56)).toContain('1.234,56')
  })

  it('includes currency symbol', () => {
    expect(formatCurrency(100)).toContain('R$')
  })
})

describe('formatNumber', () => {
  it('formats with thousand separators (pt-BR)', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatPercent', () => {
  it('formats 0.1234 as 12,34%', () => {
    expect(formatPercent(0.1234)).toContain('12,34')
  })

  it('respects decimals parameter', () => {
    expect(formatPercent(0.5, 0)).not.toContain(',')
  })
})

describe('formatDate', () => {
  it('formats date as DD/MM/YYYY', () => {
    const date = new Date('2026-04-01T00:00:00Z')
    const result = formatDate(date)
    expect(result).toMatch(/\d{2}\/\d{2}\/2026/)
  })

  it('accepts string input', () => {
    const result = formatDate('2026-01-15')
    expect(result).toContain('2026')
  })
})

describe('formatDateTime', () => {
  it('includes date and time parts', () => {
    const date = new Date('2026-04-01T14:30:00')
    const result = formatDateTime(date)
    expect(result).toContain('2026')
    expect(result).toMatch(/14:30|14h/)
  })
})

describe('formatCPF', () => {
  it('formats 11-digit string as CPF', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01')
  })

  it('returns original value if not 11 digits', () => {
    expect(formatCPF('123')).toBe('123')
  })
})

describe('formatCNPJ', () => {
  it('formats 14-digit string as CNPJ', () => {
    expect(formatCNPJ('12345678000190')).toBe('12.345.678/0001-90')
  })

  it('returns original value if not 14 digits', () => {
    expect(formatCNPJ('123')).toBe('123')
  })
})

describe('formatPhone', () => {
  it('formats 11-digit mobile number', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
  })

  it('formats 10-digit landline number', () => {
    expect(formatPhone('1134567890')).toBe('(11) 3456-7890')
  })

  it('returns original value for other lengths', () => {
    expect(formatPhone('999')).toBe('999')
  })
})

describe('formatCEP', () => {
  it('formats 8-digit CEP', () => {
    expect(formatCEP('12345678')).toBe('12345-678')
  })

  it('returns original value if not 8 digits', () => {
    expect(formatCEP('1234')).toBe('1234')
  })
})

describe('truncate', () => {
  it('truncates text longer than maxLength with ellipsis', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...')
  })

  it('returns original text when within maxLength', () => {
    expect(truncate('Hi', 10)).toBe('Hi')
  })

  it('handles exact maxLength', () => {
    expect(truncate('12345', 5)).toBe('12345')
  })
})

describe('capitalize', () => {
  it('capitalizes first letter of each word', () => {
    expect(capitalize('hello world')).toBe('Hello World')
  })

  it('lowercases the rest', () => {
    expect(capitalize('HELLO WORLD')).toBe('Hello World')
  })
})

describe('formatBytes', () => {
  it('returns 0 Bytes for 0', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
  })

  it('formats 1024 as 1 KB', () => {
    expect(formatBytes(1024)).toBe('1 KB')
  })

  it('formats 1048576 as 1 MB', () => {
    expect(formatBytes(1048576)).toBe('1 MB')
  })

  it('respects decimals parameter', () => {
    expect(formatBytes(1500, 0)).toBe('1 KB')
  })
})

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(90)).toBe('1m 30s')
  })

  it('formats hours, minutes and seconds', () => {
    expect(formatDuration(3661)).toBe('1h 1m 1s')
  })

  it('returns 0s for zero input', () => {
    expect(formatDuration(0)).toBe('0s')
  })
})

describe('slugify', () => {
  it('converts to lowercase with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes accents', () => {
    expect(slugify('Olá Mundo')).toBe('ola-mundo')
  })

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('!test!')).toBe('test')
  })
})