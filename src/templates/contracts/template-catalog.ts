/**
 * Template catalog contracts used by the template-first visual layer.
 */

export const TEMPLATE_AREAS = [
  'layout',
  'navigation',
  'page',
  'feature',
  'style',
  'scaffolding',
] as const

export type TemplateArea = (typeof TEMPLATE_AREAS)[number]

export const TEMPLATE_STATUSES = [
  'planned',
  'in_progress',
  'ready',
] as const

export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number]

export const TEMPLATE_CUSTOMIZATION_SCOPES = [
  'theme',
  'content',
  'navigation',
  'behavior',
  'data',
  'a11y',
  'testing',
] as const

export type TemplateCustomizationScope = (typeof TEMPLATE_CUSTOMIZATION_SCOPES)[number]

export interface TemplateCatalogEntry {
  id: string
  area: TemplateArea
  title: string
  description: string
  targetPath: string
  status: TemplateStatus
  customizableScopes: readonly TemplateCustomizationScope[]
  sourceReferencePath?: string
}

/**
 * Provides a stable shape for registry definitions and prevents accidental mutations.
 */
export function createTemplateCatalogEntry(entry: TemplateCatalogEntry): TemplateCatalogEntry {
  return {
    ...entry,
    customizableScopes: [...entry.customizableScopes],
  }
}