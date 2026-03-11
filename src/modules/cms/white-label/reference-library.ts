/**
 * Internal reference-catalog helpers for schema-driven CMS fields.
 * These helpers keep entity relationships inside the engine backend-agnostic.
 */
import { resolveCmsLocalizedText } from './localized-content'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsLocale,
  CmsReusableBlockSettings,
  CmsReusableSectionSettings,
  CmsSchemaReferenceKind,
} from './types'

export interface CmsSchemaReferenceCatalogInput {
  localeInput?: CmsLocale | string
  authoredContentModels?: CmsAuthoredContentModelSettings[]
  authoredBlockPresets?: CmsAuthoredBlockPresetSettings[]
  reusableBlocks?: CmsReusableBlockSettings[]
  reusableSections?: CmsReusableSectionSettings[]
}

export interface CmsSchemaReferenceOption {
  value: string
  label: string
  description: string
  kind: CmsSchemaReferenceKind
}

function createCmsSchemaReferenceOptionsForContentModels(
  input: CmsSchemaReferenceCatalogInput
): CmsSchemaReferenceOption[] {
  return (input.authoredContentModels ?? []).map(model => ({
    value: model.id,
    label: resolveCmsLocalizedText({
      baseValue: model.name,
      localized: model.localization?.name,
      localeInput: input.localeInput,
    }),
    description: resolveCmsLocalizedText({
      baseValue: model.description,
      localized: model.localization?.description,
      localeInput: input.localeInput,
    }),
    kind: 'content-model',
  }))
}

function createCmsSchemaReferenceOptionsForBlockPresets(
  input: CmsSchemaReferenceCatalogInput
): CmsSchemaReferenceOption[] {
  return (input.authoredBlockPresets ?? []).map(preset => ({
    value: preset.id,
    label: resolveCmsLocalizedText({
      baseValue: preset.name,
      localized: preset.localization?.name,
      localeInput: input.localeInput,
    }),
    description: resolveCmsLocalizedText({
      baseValue: preset.description,
      localized: preset.localization?.description,
      localeInput: input.localeInput,
    }),
    kind: 'block-preset',
  }))
}

function createCmsSchemaReferenceOptionsForReusableBlocks(
  input: CmsSchemaReferenceCatalogInput
): CmsSchemaReferenceOption[] {
  return (input.reusableBlocks ?? []).map(block => ({
    value: block.id,
    label: block.name,
    description: block.description,
    kind: 'reusable-block',
  }))
}

function createCmsSchemaReferenceOptionsForReusableSections(
  input: CmsSchemaReferenceCatalogInput
): CmsSchemaReferenceOption[] {
  return (input.reusableSections ?? []).map(section => ({
    value: section.id,
    label: section.name,
    description: section.description,
    kind: 'reusable-section',
  }))
}

/**
 * Lists engine-managed entities as select-ready options for one reference field.
 */
export function listCmsSchemaReferenceOptions(
  kinds: CmsSchemaReferenceKind[],
  input: CmsSchemaReferenceCatalogInput
): CmsSchemaReferenceOption[] {
  const normalizedKinds: CmsSchemaReferenceKind[] = kinds.length > 0
    ? kinds
    : ['content-model', 'block-preset', 'reusable-block', 'reusable-section']
  const optionsByKind: Record<CmsSchemaReferenceKind, CmsSchemaReferenceOption[]> = {
    'content-model': createCmsSchemaReferenceOptionsForContentModels(input),
    'block-preset': createCmsSchemaReferenceOptionsForBlockPresets(input),
    'reusable-block': createCmsSchemaReferenceOptionsForReusableBlocks(input),
    'reusable-section': createCmsSchemaReferenceOptionsForReusableSections(input),
  }

  return normalizedKinds.flatMap(kind => optionsByKind[kind] ?? [])
}

/**
 * Checks whether one reference id exists in the allowed engine catalogs.
 */
export function hasCmsSchemaReferenceOption(
  value: unknown,
  kinds: CmsSchemaReferenceKind[],
  input: CmsSchemaReferenceCatalogInput
): boolean {
  const normalizedValue = String(value ?? '').trim()
  if (!normalizedValue) {
    return false
  }

  return listCmsSchemaReferenceOptions(kinds, input).some(option => option.value === normalizedValue)
}