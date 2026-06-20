import {
  designTokenCssVariables,
  designTokenValues,
} from '../tokens/generated/tokens'
import {
  type ControlledCssVariableAssignment,
  type CssVariableName,
  type ThemeDensity,
} from './types'

const densityTokenPaths = {
  spacingSm: 'spacing.sm',
  spacingMd: 'spacing.md',
  spacingLg: 'spacing.lg',
  radiusMd: 'radius.md',
  lineHeightNormal: 'typography.lineHeight.normal',
} as const

type DensityTokenKey = keyof typeof densityTokenPaths
type DensityCssVariableName = (typeof designTokenCssVariables)[(typeof densityTokenPaths)[DensityTokenKey]]

export type DensityCssVariableAssignment = ControlledCssVariableAssignment<DensityCssVariableName>

const comfortableDensityValues: Record<DensityTokenKey, string> = {
  spacingSm: designTokenValues[densityTokenPaths.spacingSm],
  spacingMd: designTokenValues[densityTokenPaths.spacingMd],
  spacingLg: designTokenValues[densityTokenPaths.spacingLg],
  radiusMd: designTokenValues[densityTokenPaths.radiusMd],
  lineHeightNormal: designTokenValues[densityTokenPaths.lineHeightNormal],
}

export const densityTokenValuePresets: Record<ThemeDensity, Record<DensityTokenKey, string>> = {
  compact: {
    spacingSm: '0.375rem',
    spacingMd: '0.75rem',
    spacingLg: '1rem',
    radiusMd: '6px',
    lineHeightNormal: '1.4',
  },
  comfortable: comfortableDensityValues,
  spacious: {
    spacingSm: '0.75rem',
    spacingMd: '1.25rem',
    spacingLg: '2rem',
    radiusMd: '10px',
    lineHeightNormal: '1.7',
  },
}

export function createDensityCssVariableAssignments(
  density: ThemeDensity,
): DensityCssVariableAssignment[] {
  const values = densityTokenValuePresets[density]

  return Object
    .entries(densityTokenPaths)
    .map(([key, tokenPath]) => ({
      name: designTokenCssVariables[tokenPath as (typeof densityTokenPaths)[DensityTokenKey]] as DensityCssVariableName,
      value: values[key as DensityTokenKey],
      source: designTokenCssVariables[tokenPath as (typeof densityTokenPaths)[DensityTokenKey]] as CssVariableName,
    }))
}

export function createDensityCssVariableAssignmentMap(
  density: ThemeDensity,
): Partial<Record<DensityCssVariableName, string>> {
  return Object.fromEntries(
    createDensityCssVariableAssignments(density).map(assignment => [assignment.name, assignment.value]),
  ) as Partial<Record<DensityCssVariableName, string>>
}