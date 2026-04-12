import type {
  ReferenceWhitelabelPresetOverrides,
  TemplateVisualFamilyTone,
  TemplateVisualFamilyVariantConfig,
} from '../families/template-visual-families.types'

export const approvedReferenceLogoUrl = new URL('../../assets/core-reference-logo.svg', import.meta.url).href

export function createPackVariant(
  id: string,
  label: string,
  tone: TemplateVisualFamilyTone,
  basePresetId: string,
  caption: string,
  presetOverrides?: ReferenceWhitelabelPresetOverrides
): TemplateVisualFamilyVariantConfig {
  return {
    id,
    label,
    tone,
    basePresetId,
    caption,
    presetOverrides,
  }
}
