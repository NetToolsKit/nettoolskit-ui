import tokenSource from './source.json'

export {
  designTokenCssVariables,
  designTokenResolver,
  designTokenValues,
  designTokens,
  designTokensByCssVariable,
} from './generated/tokens'
export type { DesignTokenCssVariable, DesignTokenPath } from './generated/tokens'

export const dtcgTokenSource = tokenSource