import {
  themeDensities,
  type CssVariableName,
  type ResolvedTokenMap,
  type ThemeDensity,
  type ThemeRuntimeModel,
  type ThemeRuntimeModelInput,
  type ThemeValidationIssue,
  type ThemeValidationIssueCode,
  type ThemeValidationResult,
} from './types'

export const DEFAULT_THEME_ID = 'default'
export const DEFAULT_THEME_DENSITY: ThemeDensity = 'comfortable'

const THEME_ID_PATTERN = /^[a-z][a-z0-9-]{0,62}$/
const TENANT_ID_PATTERN = /^[a-z0-9](?:[a-z0-9_-]{0,62}[a-z0-9])?$/
const CSS_VARIABLE_NAME_PATTERN = /^--[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const CSS_VALUE_MAX_LENGTH = 512
const UNSAFE_CSS_VALUE_PATTERN = /[;{}<>]/
const UNSAFE_CSS_FUNCTION_PATTERN = /\b(?:expression|url)\s*\(/i

function hasControlCharacter(value: string): boolean {
  return [...value].some(character => {
    const codePoint = character.charCodeAt(0)
    return codePoint <= 31 || codePoint === 127
  })
}

function createIssue(
  code: ThemeValidationIssueCode,
  path: string,
  message: string,
): ThemeValidationIssue {
  return { code, path, message }
}

function normalizeOptionalIdentifier(
  value: unknown,
  fallback: string | null,
  pattern: RegExp,
  code: ThemeValidationIssueCode,
  path: string,
  label: string,
  issues: ThemeValidationIssue[],
): string | null {
  if (value === undefined || value === null || value === '') {
    return fallback
  }

  if (typeof value !== 'string') {
    issues.push(createIssue(code, path, `${label} must be a string.`))
    return fallback
  }

  const normalized = value.trim().toLowerCase()
  if (!pattern.test(normalized)) {
    issues.push(createIssue(code, path, `${label} contains unsupported characters.`))
    return fallback
  }

  return normalized
}

export function isThemeDensity(value: unknown): value is ThemeDensity {
  return typeof value === 'string' && themeDensities.includes(value as ThemeDensity)
}

export function isControlledCssVariableName(value: unknown): value is CssVariableName {
  return typeof value === 'string' && CSS_VARIABLE_NAME_PATTERN.test(value.trim())
}

export function isControlledCssVariableValue(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }

  const normalized = value.trim()
  return (
    normalized.length > 0
    && normalized.length <= CSS_VALUE_MAX_LENGTH
    && !UNSAFE_CSS_VALUE_PATTERN.test(normalized)
    && !UNSAFE_CSS_FUNCTION_PATTERN.test(normalized)
    && !hasControlCharacter(normalized)
  )
}

export function normalizeResolvedTokenMap(
  tokens: unknown,
  basePath = 'tokens',
): ThemeValidationResult<Readonly<Record<CssVariableName, string>>> {
  const issues: ThemeValidationIssue[] = []
  const normalizedTokens: Record<CssVariableName, string> = {}

  if (tokens === undefined || tokens === null) {
    return {
      valid: true,
      value: normalizedTokens,
      issues,
    }
  }

  if (typeof tokens !== 'object' || Array.isArray(tokens)) {
    return {
      valid: false,
      value: normalizedTokens,
      issues: [
        createIssue('invalid_token_map', basePath, 'Resolved tokens must be provided as an object map.'),
      ],
    }
  }

  for (const [rawName, rawValue] of Object.entries(tokens as ResolvedTokenMap)) {
    const tokenPath = `${basePath}.${rawName}`
    const name = rawName.trim()

    if (!isControlledCssVariableName(name)) {
      issues.push(createIssue('invalid_token_name', tokenPath, 'Token names must be lowercase CSS custom properties.'))
      continue
    }

    if (rawValue === undefined || rawValue === null) {
      continue
    }

    if (!isControlledCssVariableValue(rawValue)) {
      issues.push(createIssue('invalid_token_value', tokenPath, 'Token value is empty or contains unsupported CSS.'))
      continue
    }

    normalizedTokens[name] = rawValue.trim()
  }

  return {
    valid: issues.length === 0,
    value: normalizedTokens,
    issues,
  }
}

export function validateThemeRuntimeModel(input: ThemeRuntimeModelInput): ThemeValidationResult<ThemeRuntimeModel> {
  const issues: ThemeValidationIssue[] = []
  const themeId =
    normalizeOptionalIdentifier(
      input.themeId,
      DEFAULT_THEME_ID,
      THEME_ID_PATTERN,
      'invalid_theme_id',
      'themeId',
      'Theme id',
      issues,
    ) ?? DEFAULT_THEME_ID
  const tenantId = normalizeOptionalIdentifier(
    input.tenantId,
    null,
    TENANT_ID_PATTERN,
    'invalid_tenant_id',
    'tenantId',
    'Tenant id',
    issues,
  )
  const density = input.density ?? DEFAULT_THEME_DENSITY
  const tokenResult = normalizeResolvedTokenMap(input.tokens)

  if (!isThemeDensity(density)) {
    issues.push(
      createIssue(
        'invalid_density',
        'density',
        `Density must be one of: ${themeDensities.join(', ')}.`,
      ),
    )
  }

  issues.push(...tokenResult.issues)

  return {
    valid: issues.length === 0,
    value: {
      themeId,
      density: isThemeDensity(density) ? density : DEFAULT_THEME_DENSITY,
      tenantId,
      tokens: tokenResult.value,
    },
    issues,
  }
}