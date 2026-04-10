import type { CSSProperties } from 'vue'

import type {
  ReferenceWhitelabelBrand,
  ReferenceWhitelabelPalette,
  ReferenceWhitelabelPreset,
  ReferenceWhitelabelTypography,
} from '../../../src/whitelabel'
import type {
  TemplateShowcaseExampleDefinition,
  TemplateShowcaseExampleId,
} from '../template-showcase.examples'

export type TemplateVisualFamilyLayout =
  | 'spotlight'
  | 'editorial'
  | 'mosaic'
  | 'contrast'
  | 'laboratory'

export type TemplateVisualFamilyTone = 'light' | 'dark'

export interface TemplateVisualFamilyMetric {
  id: string
  label: string
  value: string
}

export interface TemplateVisualFamilyNote {
  id: string
  label: string
  value: string
}

export interface TemplateVisualFamilyVariantConfig {
  id: string
  label: string
  tone: TemplateVisualFamilyTone
  caption: string
  basePresetId: string
  presetOverrides?: ReferenceWhitelabelPresetOverrides
}

export interface TemplateVisualFamilyVariantDefinition extends TemplateVisualFamilyVariantConfig {
  preset: ReferenceWhitelabelPreset
  styleVars: CSSProperties
}

export interface ReferenceWhitelabelPresetOverrides {
  label?: string
  description?: string
  brand?: Partial<ReferenceWhitelabelBrand>
  palette?: Partial<ReferenceWhitelabelPalette>
  typography?: Partial<ReferenceWhitelabelTypography>
  radius?: Partial<ReferenceWhitelabelPreset['radius']>
  shadow?: Partial<ReferenceWhitelabelPreset['shadow']>
  gradients?: Partial<ReferenceWhitelabelPreset['gradients']>
}

export interface TemplateVisualFamilyConfig {
  id: string
  label: string
  kicker: string
  description: string
  layout: TemplateVisualFamilyLayout
  exampleId: TemplateShowcaseExampleId
  metrics: TemplateVisualFamilyMetric[]
  notes: TemplateVisualFamilyNote[]
  variants: [TemplateVisualFamilyVariantConfig, TemplateVisualFamilyVariantConfig]
}

export interface TemplateVisualFamilyDefinition extends TemplateVisualFamilyConfig {
  example: TemplateShowcaseExampleDefinition
  sectionStyleVars: CSSProperties
  variants: [TemplateVisualFamilyVariantDefinition, TemplateVisualFamilyVariantDefinition]
}
