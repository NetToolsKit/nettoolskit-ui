import {
  createReferenceWhitelabelStyleVars,
  resolveReferenceWhitelabelPreset,
  type ReferenceWhitelabelPreset,
} from '../../../src/whitelabel'
import { templateVisualFamilyConfigs } from '../packs'
import { findTemplateShowcaseExample } from '../template-showcase.examples'
import type {
  ReferenceWhitelabelPresetOverrides,
  TemplateVisualFamilyVariantDefinition,
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

export const templateVisualFamilies: TemplateVisualFamilyDefinition[] = templateVisualFamilyConfigs
  .map(config => {
    const variants = config.variants.map(variantConfig => {
      const basePreset = resolveReferenceWhitelabelPreset(variantConfig.basePresetId)
      const preset = mergeReferenceWhitelabelPreset(basePreset, variantConfig.presetOverrides)

      return {
        ...variantConfig,
        preset,
        styleVars: createReferenceWhitelabelStyleVars(preset),
      }
    }) as [TemplateVisualFamilyVariantDefinition, TemplateVisualFamilyVariantDefinition]

    return {
      ...config,
      example: findTemplateShowcaseExample(config.exampleId),
      sectionStyleVars: variants[0].styleVars,
      variants,
    }
  })
  .sort((left, right) => left.sortOrder - right.sortOrder)
