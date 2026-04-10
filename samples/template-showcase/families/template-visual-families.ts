import {
  createReferenceWhitelabelStyleVars,
  resolveReferenceWhitelabelPreset,
  type ReferenceWhitelabelPreset,
} from '../../../src/whitelabel'
import { resolveTemplateShowcaseExamples } from '../template-showcase.examples'
import { templateVisualFamilyConfigs } from './template-visual-families.config'
import type {
  ReferenceWhitelabelPresetOverrides,
  TemplateVisualFamilyDefinition,
} from './template-visual-families.types'

function mergeReferenceWhitelabelPreset(
  basePreset: ReferenceWhitelabelPreset,
  overrides?: ReferenceWhitelabelPresetOverrides
): ReferenceWhitelabelPreset {
  if (!overrides) {
    return basePreset
  }

  return {
    ...basePreset,
    label: overrides.label ?? basePreset.label,
    description: overrides.description ?? basePreset.description,
    brand: {
      ...basePreset.brand,
      ...overrides.brand,
    },
    palette: {
      ...basePreset.palette,
      ...overrides.palette,
    },
    typography: {
      ...basePreset.typography,
      ...overrides.typography,
    },
    radius: {
      ...basePreset.radius,
      ...overrides.radius,
    },
    shadow: {
      ...basePreset.shadow,
      ...overrides.shadow,
    },
    gradients: {
      ...basePreset.gradients,
      ...overrides.gradients,
    },
  }
}

export const templateVisualFamilies: TemplateVisualFamilyDefinition[] = templateVisualFamilyConfigs.map(config => {
  const basePreset = resolveReferenceWhitelabelPreset(config.basePresetId)
  const preset = mergeReferenceWhitelabelPreset(basePreset, config.presetOverrides)

  return {
    ...config,
    preset,
    styleVars: createReferenceWhitelabelStyleVars(preset),
    examples: resolveTemplateShowcaseExamples(config.featuredExampleIds),
  }
})
