export const themeDensities = ['compact', 'comfortable', 'spacious'] as const

export type ThemeDensity = (typeof themeDensities)[number]
export type CssVariableName = `--${string}`

export type ResolvedTokenMap = Readonly<Record<string, string | null | undefined>>

export interface ControlledCssVariableAssignment<Name extends CssVariableName = CssVariableName> {
  name: Name
  value: string
  source?: CssVariableName
}

export interface ThemeRuntimeModel {
  themeId: string
  density: ThemeDensity
  tenantId: string | null
  tokens: Readonly<Record<CssVariableName, string>>
}

export interface ThemeRuntimeModelInput {
  themeId?: unknown
  density?: unknown
  tenantId?: unknown
  tokens?: unknown
}

export type ThemeValidationIssueCode =
  | 'invalid_theme_id'
  | 'invalid_density'
  | 'invalid_tenant_id'
  | 'invalid_token_map'
  | 'invalid_token_name'
  | 'unknown_token_name'
  | 'invalid_token_value'

export interface ThemeValidationIssue {
  code: ThemeValidationIssueCode
  path: string
  message: string
}

export interface ThemeValidationResult<T> {
  valid: boolean
  value: T
  issues: ThemeValidationIssue[]
}