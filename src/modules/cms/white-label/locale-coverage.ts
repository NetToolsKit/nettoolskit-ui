/**
 * Locale coverage helpers for CMS preview and review surfaces.
 * They summarize how much authored content has explicit coverage per locale
 * across pages, schema metadata and reusable content libraries.
 */

import {
  getCmsContentModelFieldDefinitions,
  getCmsSectionPresetFieldDefinitions,
} from './content-models'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelFieldPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsContentModelFieldDefinition,
  CmsLocale,
  CmsPageLocalizationSettings,
  CmsPageSectionLocalizationSettings,
  CmsPreviewSnapshot,
  CmsReusableBlockSettings,
  CmsReusableSectionSettings,
} from './types'

export type CmsLocaleCoverageCategory = 'pages' | 'fields' | 'reusable-content'

export type CmsLocaleCoverageStatus =
  | 'complete'
  | 'partial'
  | 'empty'
  | 'not-applicable'

export interface CmsLocaleCoverageEntry {
  id: string
  locale: CmsLocale
  category: CmsLocaleCoverageCategory
  entityKind: string
  entityId: string
  label: string
  fieldLabel: string
}

export interface CmsLocaleCoverageCategorySummary {
  category: CmsLocaleCoverageCategory
  total: number
  covered: number
  missing: number
  percentage: number
  status: CmsLocaleCoverageStatus
  missingEntries: CmsLocaleCoverageEntry[]
}

export interface CmsLocaleCoverageSummary {
  locale: CmsLocale
  total: number
  covered: number
  missing: number
  percentage: number
  status: CmsLocaleCoverageStatus
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>
  missingEntries: CmsLocaleCoverageEntry[]
}

const CMS_LOCALE_COVERAGE_CATEGORY_ORDER: CmsLocaleCoverageCategory[] = [
  'pages',
  'fields',
  'reusable-content',
]

const CMS_LOCALE_MATRIX_ORDER: CmsLocale[] = ['en', 'pt-BR']

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isEntityArchived(value: unknown): boolean {
  return isObjectRecord(value) && String(value.archivedAt ?? '').trim().length > 0
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Vue proxies and imported snapshots may not always be cloneable.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function hasMeaningfulValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(entry => hasMeaningfulValue(entry))
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (typeof value === 'number') {
    return Number.isFinite(value)
  }

  if (typeof value === 'boolean') {
    return true
  }

  return value != null
}

function createEmptyCategorySummary(
  category: CmsLocaleCoverageCategory
): CmsLocaleCoverageCategorySummary {
  return {
    category,
    total: 0,
    covered: 0,
    missing: 0,
    percentage: 100,
    status: 'not-applicable',
    missingEntries: [],
  }
}

function resolveCoverageStatus(
  covered: number,
  missing: number
): CmsLocaleCoverageStatus {
  if (covered === 0 && missing === 0) {
    return 'not-applicable'
  }

  if (missing === 0) {
    return 'complete'
  }

  if (covered === 0) {
    return 'empty'
  }

  return 'partial'
}

function finalizeCategorySummary(
  summary: CmsLocaleCoverageCategorySummary
): CmsLocaleCoverageCategorySummary {
  const next = cloneValue(summary)
  next.percentage = next.total > 0
    ? Math.round((next.covered / next.total) * 100)
    : 100
  next.status = resolveCoverageStatus(next.covered, next.missing)
  next.missingEntries = [...next.missingEntries].sort((left, right) => {
    const labelOrder = left.label.localeCompare(right.label)
    if (labelOrder !== 0) {
      return labelOrder
    }

    return left.fieldLabel.localeCompare(right.fieldLabel)
  })
  return next
}

function createCoverageEntry(input: {
  locale: CmsLocale
  category: CmsLocaleCoverageCategory
  entityKind: string
  entityId: string
  label: string
  fieldLabel: string
}): CmsLocaleCoverageEntry {
  return {
    id: `${input.locale}:${input.category}:${input.entityKind}:${input.entityId}:${input.fieldLabel}`,
    locale: input.locale,
    category: input.category,
    entityKind: input.entityKind,
    entityId: input.entityId,
    label: input.label,
    fieldLabel: input.fieldLabel,
  }
}

function registerCoverageEntry(
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>,
  input: {
    locale: CmsLocale
    category: CmsLocaleCoverageCategory
    entityKind: string
    entityId: string
    label: string
    fieldLabel: string
    baseValue: unknown
    localizedValue: unknown
  }
): void {
  if (!hasMeaningfulValue(input.baseValue)) {
    return
  }

  const summary = categories[input.category]
  if (!summary) {
    return
  }

  summary.total += 1

  const covered = input.locale === 'en'
    ? true
    : hasMeaningfulValue(input.localizedValue)

  if (covered) {
    summary.covered += 1
    return
  }

  summary.missing += 1
  summary.missingEntries.push(createCoverageEntry({
    locale: input.locale,
    category: input.category,
    entityKind: input.entityKind,
    entityId: input.entityId,
    label: input.label,
    fieldLabel: input.fieldLabel,
  }))
}

function registerMetadataCoverage(
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>,
  input: {
    locale: CmsLocale
    entityKind: string
    entityId: string
    label: string
    fieldLabel: string
    baseValue: string
    localizedValue?: string
  }
): void {
  registerCoverageEntry(categories, {
    locale: input.locale,
    category: 'fields',
    entityKind: input.entityKind,
    entityId: input.entityId,
    label: input.label,
    fieldLabel: input.fieldLabel,
    baseValue: input.baseValue,
    localizedValue: input.localizedValue ?? '',
  })
}

function collectPageCoverage(
  locale: CmsLocale,
  snapshot: CmsPreviewSnapshot,
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>
): void {
  for (const page of snapshot.pages) {
    const pageLabel = page.title || page.path || page.id
    const localizedPage = page.localization as CmsPageLocalizationSettings | undefined

    registerCoverageEntry(categories, {
      locale,
      category: 'pages',
      entityKind: 'page',
      entityId: page.id,
      label: pageLabel,
      fieldLabel: 'Title',
      baseValue: page.title,
      localizedValue: localizedPage?.title?.[locale] ?? '',
    })

    registerCoverageEntry(categories, {
      locale,
      category: 'pages',
      entityKind: 'page',
      entityId: page.id,
      label: pageLabel,
      fieldLabel: 'Description',
      baseValue: page.description,
      localizedValue: localizedPage?.description?.[locale] ?? '',
    })

    const pageFields = getCmsContentModelFieldDefinitions(
      'en',
      page.contentModelId,
      snapshot.authoredContentModels
    )
    for (const field of pageFields) {
      registerCoverageEntry(categories, {
        locale,
        category: 'pages',
        entityKind: 'page-field',
        entityId: `${page.id}:${field.id}`,
        label: pageLabel,
        fieldLabel: field.label,
        baseValue: page.customFields?.[field.id],
        localizedValue: localizedPage?.fields?.[locale]?.[field.id],
      })
    }

    for (const section of page.sections.filter(entry => entry.enabled)) {
      const sectionLabel = section.label || section.id
      const localizedSection = section.localization as CmsPageSectionLocalizationSettings | undefined

      registerCoverageEntry(categories, {
        locale,
        category: 'pages',
        entityKind: 'section',
        entityId: section.id,
        label: `${pageLabel} / ${sectionLabel}`,
        fieldLabel: 'Section label',
        baseValue: section.label,
        localizedValue: localizedSection?.label?.[locale] ?? '',
      })

      const sectionFields = getCmsSectionPresetFieldDefinitions('en', section.presetId)
      for (const field of sectionFields) {
        registerCoverageEntry(categories, {
          locale,
          category: 'pages',
          entityKind: 'section-field',
          entityId: `${section.id}:${field.id}`,
          label: `${pageLabel} / ${sectionLabel}`,
          fieldLabel: field.label,
          baseValue: section.customFields?.[field.id],
          localizedValue: localizedSection?.fields?.[locale]?.[field.id],
        })
      }
    }
  }
}

function collectAuthoredContentModelCoverage(
  locale: CmsLocale,
  models: CmsAuthoredContentModelSettings[],
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>
): void {
  for (const model of models) {
    const label = model.name || model.id
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'content-model',
      entityId: model.id,
      label,
      fieldLabel: 'Model name',
      baseValue: model.name,
      localizedValue: model.localization?.name?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'content-model',
      entityId: model.id,
      label,
      fieldLabel: 'Model description',
      baseValue: model.description,
      localizedValue: model.localization?.description?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'content-model',
      entityId: model.id,
      label,
      fieldLabel: 'Default page title',
      baseValue: model.defaultPageTitle,
      localizedValue: model.localization?.pageTitle?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'content-model',
      entityId: model.id,
      label,
      fieldLabel: 'Default page description',
      baseValue: model.defaultPageDescription,
      localizedValue: model.localization?.pageDescription?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'content-model',
      entityId: model.id,
      label,
      fieldLabel: 'Migration notes',
      baseValue: model.migrationNotes ?? '',
      localizedValue: model.localization?.migrationNotes?.[locale],
    })

    for (const field of model.fields ?? []) {
      const fieldLabel = field.label || field.id
      registerMetadataCoverage(categories, {
        locale,
        entityKind: 'content-model-field',
        entityId: `${model.id}:${field.id}`,
        label,
        fieldLabel: `${fieldLabel} / Label`,
        baseValue: field.label,
        localizedValue: field.localization?.label?.[locale],
      })
      registerMetadataCoverage(categories, {
        locale,
        entityKind: 'content-model-field',
        entityId: `${model.id}:${field.id}`,
        label,
        fieldLabel: `${fieldLabel} / Description`,
        baseValue: field.description,
        localizedValue: field.localization?.description?.[locale],
      })
      registerMetadataCoverage(categories, {
        locale,
        entityKind: 'content-model-field',
        entityId: `${model.id}:${field.id}`,
        label,
        fieldLabel: `${fieldLabel} / Placeholder`,
        baseValue: field.placeholder,
        localizedValue: field.localization?.placeholder?.[locale],
      })
      registerMetadataCoverage(categories, {
        locale,
        entityKind: 'content-model-field',
        entityId: `${model.id}:${field.id}`,
        label,
        fieldLabel: `${fieldLabel} / Group`,
        baseValue: field.group,
        localizedValue: field.localization?.group?.[locale],
      })
    }
  }
}

function collectFieldPresetCoverage(
  locale: CmsLocale,
  presets: CmsAuthoredContentModelFieldPresetSettings[],
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>
): void {
  for (const preset of presets.filter(entry => !isEntityArchived(entry))) {
    const label = preset.name || preset.id

    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'field-preset',
      entityId: preset.id,
      label,
      fieldLabel: 'Preset name',
      baseValue: preset.name,
      localizedValue: preset.localization?.name?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'field-preset',
      entityId: preset.id,
      label,
      fieldLabel: 'Preset description',
      baseValue: preset.description,
      localizedValue: preset.localization?.description?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'field-preset-field',
      entityId: `${preset.id}:${preset.field.id}`,
      label,
      fieldLabel: `${preset.field.label || preset.field.id} / Label`,
      baseValue: preset.field.label,
      localizedValue: preset.field.localization?.label?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'field-preset-field',
      entityId: `${preset.id}:${preset.field.id}`,
      label,
      fieldLabel: `${preset.field.label || preset.field.id} / Description`,
      baseValue: preset.field.description,
      localizedValue: preset.field.localization?.description?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'field-preset-field',
      entityId: `${preset.id}:${preset.field.id}`,
      label,
      fieldLabel: `${preset.field.label || preset.field.id} / Placeholder`,
      baseValue: preset.field.placeholder,
      localizedValue: preset.field.localization?.placeholder?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'field-preset-field',
      entityId: `${preset.id}:${preset.field.id}`,
      label,
      fieldLabel: `${preset.field.label || preset.field.id} / Group`,
      baseValue: preset.field.group,
      localizedValue: preset.field.localization?.group?.[locale],
    })
  }
}

function collectBlockPresetCoverage(
  locale: CmsLocale,
  presets: CmsAuthoredBlockPresetSettings[],
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>
): void {
  for (const preset of presets.filter(entry => !isEntityArchived(entry))) {
    const label = preset.name || preset.id

    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'block-preset',
      entityId: preset.id,
      label,
      fieldLabel: 'Preset name',
      baseValue: preset.name,
      localizedValue: preset.localization?.name?.[locale],
    })
    registerMetadataCoverage(categories, {
      locale,
      entityKind: 'block-preset',
      entityId: preset.id,
      label,
      fieldLabel: 'Preset description',
      baseValue: preset.description,
      localizedValue: preset.localization?.description?.[locale],
    })
  }
}

function collectReusableSectionFieldCoverage(
  locale: CmsLocale,
  section: CmsReusableSectionSettings,
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>
): void {
  const sectionLabel = section.label || section.id
  const definitionFields: CmsContentModelFieldDefinition[] = getCmsSectionPresetFieldDefinitions('en', section.presetId)

  registerCoverageEntry(categories, {
    locale,
    category: 'reusable-content',
    entityKind: 'reusable-section',
    entityId: section.id,
    label: section.name || section.id,
    fieldLabel: 'Section label',
    baseValue: section.label,
    localizedValue: section.localization?.label?.[locale] ?? '',
  })

  for (const field of definitionFields) {
    registerCoverageEntry(categories, {
      locale,
      category: 'reusable-content',
      entityKind: 'reusable-section-field',
      entityId: `${section.id}:${field.id}`,
      label: `${section.name || section.id} / ${sectionLabel}`,
      fieldLabel: field.label,
      baseValue: section.customFields?.[field.id],
      localizedValue: section.localization?.fields?.[locale]?.[field.id],
    })
  }
}

function collectReusableContentCoverage(
  locale: CmsLocale,
  sections: CmsReusableSectionSettings[],
  blocks: CmsReusableBlockSettings[],
  categories: Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>
): void {
  for (const section of sections.filter(entry => !isEntityArchived(entry) && entry.enabled)) {
    const label = section.name || section.id

    registerCoverageEntry(categories, {
      locale,
      category: 'reusable-content',
      entityKind: 'reusable-section',
      entityId: section.id,
      label,
      fieldLabel: 'Reusable section name',
      baseValue: section.name,
      localizedValue: '',
    })
    registerCoverageEntry(categories, {
      locale,
      category: 'reusable-content',
      entityKind: 'reusable-section',
      entityId: section.id,
      label,
      fieldLabel: 'Reusable section description',
      baseValue: section.description,
      localizedValue: '',
    })

    collectReusableSectionFieldCoverage(locale, section, categories)
  }

  for (const block of blocks.filter(entry => !isEntityArchived(entry))) {
    const label = block.name || block.id

    registerCoverageEntry(categories, {
      locale,
      category: 'reusable-content',
      entityKind: 'reusable-block',
      entityId: block.id,
      label,
      fieldLabel: 'Reusable block name',
      baseValue: block.name,
      localizedValue: '',
    })
    registerCoverageEntry(categories, {
      locale,
      category: 'reusable-content',
      entityKind: 'reusable-block',
      entityId: block.id,
      label,
      fieldLabel: 'Reusable block description',
      baseValue: block.description,
      localizedValue: '',
    })
  }
}

function createLocaleCoverageCategories(
  _locale: CmsLocale
): Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary> {
  return {
    pages: createEmptyCategorySummary('pages'),
    fields: createEmptyCategorySummary('fields'),
    'reusable-content': createEmptyCategorySummary('reusable-content'),
  }
}

/**
 * Builds one locale coverage matrix for preview/reporting and i18n review.
 */
export function resolveCmsLocaleCoverageMatrix(
  snapshot: CmsPreviewSnapshot | null,
  locales: CmsLocale[] = CMS_LOCALE_MATRIX_ORDER
): CmsLocaleCoverageSummary[] {
  if (!snapshot) {
    return []
  }

  return locales.map(locale => {
    const categories = createLocaleCoverageCategories(locale)

    collectPageCoverage(locale, snapshot, categories)
    collectAuthoredContentModelCoverage(locale, snapshot.authoredContentModels, categories)
    collectFieldPresetCoverage(locale, snapshot.authoredContentModelFieldPresets, categories)
    collectBlockPresetCoverage(locale, snapshot.authoredBlockPresets, categories)
    collectReusableContentCoverage(locale, snapshot.reusableSections, snapshot.reusableBlocks, categories)

    const finalizedCategories = Object.fromEntries(
      CMS_LOCALE_COVERAGE_CATEGORY_ORDER.map(category => [
        category,
        finalizeCategorySummary(categories[category]),
      ])
    ) as Record<CmsLocaleCoverageCategory, CmsLocaleCoverageCategorySummary>

    const total = CMS_LOCALE_COVERAGE_CATEGORY_ORDER.reduce((sum, category) => {
      return sum + finalizedCategories[category].total
    }, 0)
    const covered = CMS_LOCALE_COVERAGE_CATEGORY_ORDER.reduce((sum, category) => {
      return sum + finalizedCategories[category].covered
    }, 0)
    const missing = CMS_LOCALE_COVERAGE_CATEGORY_ORDER.reduce((sum, category) => {
      return sum + finalizedCategories[category].missing
    }, 0)
    const percentage = total > 0 ? Math.round((covered / total) * 100) : 100
    const status = resolveCoverageStatus(covered, missing)
    const missingEntries = CMS_LOCALE_COVERAGE_CATEGORY_ORDER.flatMap(category => {
      return finalizedCategories[category].missingEntries
    })

    return {
      locale,
      total,
      covered,
      missing,
      percentage,
      status,
      categories: finalizedCategories,
      missingEntries,
    }
  })
}