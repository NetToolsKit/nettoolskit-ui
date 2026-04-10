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
  basePresetId: string
  presetOverrides?: ReferenceWhitelabelPresetOverrides
  metrics: TemplateVisualFamilyMetric[]
  notes: TemplateVisualFamilyNote[]
  featuredExampleIds: TemplateShowcaseExampleId[]
}

export interface TemplateVisualFamilyDefinition extends TemplateVisualFamilyConfig {
  preset: ReferenceWhitelabelPreset
  styleVars: CSSProperties
  examples: TemplateShowcaseExampleDefinition[]
}
