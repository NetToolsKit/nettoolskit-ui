/**
 * Schema migration helpers for CMS content-model upgrades.
 * They provide dry-run reports plus safe application helpers without coupling
 * authoring flows to backend orchestration.
 */

import {
  getCmsContentModelFieldDefinitions,
  getCmsContentModelLastSchemaChangeAt,
  getCmsContentModelMigrationNotes,
  getCmsContentModelSchemaVersion,
  normalizeCmsPageCustomFieldsForContentModel,
  resolveCmsContentModelId,
} from './content-models'
import { resolveCmsLocale } from './i18n'
import { normalizeCmsPageLocalizationSettings } from './localized-content'
import type {
  CmsAuthoredContentModelSettings,
  CmsContentModelFieldDefinition,
  CmsLocalizedPropsRecord,
  CmsLocale,
  CmsPageSettings,
} from './types'

/**
 * High-level upgrade state for one page against the current content-model schema.
 */
export type CmsSchemaMigrationStatus =
  | 'current'
  | 'upgrade-required'
  | 'version-missing'
  | 'ahead'
  | 'invalid-model'

/**
 * Supported dry-run change kinds emitted by the schema migration report.
 */
export type CmsSchemaMigrationChangeKind = 'add' | 'remove' | 'update'

/**
 * One field-level change emitted by the migration preview.
 */
export interface CmsPageSchemaMigrationChange {
  id: string
  kind: CmsSchemaMigrationChangeKind
  locale: CmsLocale | null
  fieldId: string
  label: string
  path: string
  previousValue?: unknown
  nextValue?: unknown
}

/**
 * Aggregate counters for one migration preview.
 */
export interface CmsSchemaMigrationChangeSummary {
  addCount: number
  removeCount: number
  updateCount: number
  total: number
}

/**
 * Page-level dry-run report for migrating one page to the latest schema version.
 */
export interface CmsPageSchemaMigrationReport {
  pageId: string
  pageTitle: string
  contentModelId: string
  appliedVersion: number | null
  targetVersion: number | null
  status: CmsSchemaMigrationStatus
  migrationNotes: string
  lastSchemaChangeAt: string | null
  summary: CmsSchemaMigrationChangeSummary
  hasChanges: boolean
  canApply: boolean
  nextCustomFields: Record<string, unknown>
  nextLocalizationFields?: CmsLocalizedPropsRecord
  changes: CmsPageSchemaMigrationChange[]
}

/**
 * Aggregate summary for all pages reviewed by one schema migration run.
 */
export interface CmsSchemaMigrationBatchSummary {
  pageCount: number
  currentCount: number
  upgradeRequiredCount: number
  versionMissingCount: number
  aheadCount: number
  invalidModelCount: number
  changedPageCount: number
  addCount: number
  removeCount: number
  updateCount: number
}

/**
 * Whole-report dry-run result across all pages in one tenant snapshot.
 */
export interface CmsSchemaMigrationBatchReport {
  summary: CmsSchemaMigrationBatchSummary
  pages: CmsPageSchemaMigrationReport[]
}

function cloneValue<T>(value: T): T {
  if (typeof globalThis.structuredClone === 'function') {
    try {
      return globalThis.structuredClone(value)
    } catch {
      // Vue proxies can still leak into authoring flows.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key)
}

function normalizeComparableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeComparableValue)
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([key, entryValue]) => [key, normalizeComparableValue(entryValue)])
    )
  }

  return value
}

function isComparableEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(normalizeComparableValue(left)) === JSON.stringify(normalizeComparableValue(right))
}

function resolveAppliedSchemaVersion(value: unknown): number | null {
  const parsed = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim().length > 0 ? Number(value) : Number.NaN)

  return Number.isFinite(parsed) && parsed > 0
    ? Math.max(1, Math.floor(parsed))
    : null
}

function createEmptyMigrationSummary(): CmsSchemaMigrationChangeSummary {
  return {
    addCount: 0,
    removeCount: 0,
    updateCount: 0,
    total: 0,
  }
}

function createEmptyBatchSummary(pageCount: number): CmsSchemaMigrationBatchSummary {
  return {
    pageCount,
    currentCount: 0,
    upgradeRequiredCount: 0,
    versionMissingCount: 0,
    aheadCount: 0,
    invalidModelCount: 0,
    changedPageCount: 0,
    addCount: 0,
    removeCount: 0,
    updateCount: 0,
  }
}

function incrementMigrationSummary(
  summary: CmsSchemaMigrationChangeSummary,
  kind: CmsSchemaMigrationChangeKind
): void {
  if (kind === 'add') {
    summary.addCount += 1
  } else if (kind === 'remove') {
    summary.removeCount += 1
  } else {
    summary.updateCount += 1
  }

  summary.total += 1
}

function resolveMigrationStatus(
  appliedVersion: number | null,
  targetVersion: number
): CmsSchemaMigrationStatus {
  if (appliedVersion == null) {
    return 'version-missing'
  }

  if (appliedVersion > targetVersion) {
    return 'ahead'
  }

  if (appliedVersion < targetVersion) {
    return 'upgrade-required'
  }

  return 'current'
}

function normalizeLocalizedFieldOverrides(
  value: unknown,
  contentModelId: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsLocalizedPropsRecord | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const normalized: CmsLocalizedPropsRecord = {}
  for (const [rawLocale, rawFields] of Object.entries(value)) {
    if (!isRecord(rawFields)) {
      continue
    }

    const locale = resolveCmsLocale(rawLocale)
    normalized[locale] = normalizeCmsPageCustomFieldsForContentModel(
      rawFields,
      contentModelId,
      locale,
      authoredModels
    )
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

function collectRecordChanges(options: {
  fieldDefinitions: CmsContentModelFieldDefinition[]
  currentFields: Record<string, unknown>
  nextFields: Record<string, unknown>
  locale: CmsLocale | null
}): CmsPageSchemaMigrationChange[] {
  const changes: CmsPageSchemaMigrationChange[] = []
  const knownFieldIds = new Set(options.fieldDefinitions.map(field => field.id))
  const pathPrefix = options.locale == null
    ? 'customFields'
    : `localization.fields.${options.locale}`

  for (const field of options.fieldDefinitions) {
    const beforeHas = hasOwn(options.currentFields, field.id)
    const beforeValue = beforeHas ? options.currentFields[field.id] : undefined
    const afterValue = options.nextFields[field.id]

    if (isComparableEqual(beforeValue, afterValue)) {
      continue
    }

    changes.push({
      id: `${pathPrefix}.${field.id}`,
      kind: beforeHas ? 'update' : 'add',
      locale: options.locale,
      fieldId: field.id,
      label: field.label,
      path: `${pathPrefix}.${field.id}`,
      ...(beforeHas ? { previousValue: cloneValue(beforeValue) } : {}),
      nextValue: cloneValue(afterValue),
    })
  }

  for (const unknownFieldId of Object.keys(options.currentFields).sort()) {
    if (knownFieldIds.has(unknownFieldId)) {
      continue
    }

    changes.push({
      id: `${pathPrefix}.${unknownFieldId}`,
      kind: 'remove',
      locale: options.locale,
      fieldId: unknownFieldId,
      label: unknownFieldId,
      path: `${pathPrefix}.${unknownFieldId}`,
      previousValue: cloneValue(options.currentFields[unknownFieldId]),
    })
  }

  return changes
}

/**
 * Builds a dry-run report for migrating one page to the current schema version.
 */
export function createCmsPageSchemaMigrationReport(input: {
  page: CmsPageSettings
  localeInput?: unknown
  authoredContentModels?: CmsAuthoredContentModelSettings[]
}): CmsPageSchemaMigrationReport {
  const authoredContentModels = Array.isArray(input.authoredContentModels)
    ? input.authoredContentModels
    : []
  const locale = resolveCmsLocale(input.localeInput)
  const rawContentModelId = String(input.page.contentModelId ?? '').trim()
  const normalizedContentModelId = resolveCmsContentModelId(rawContentModelId, authoredContentModels)
  const hasValidContentModel = rawContentModelId.length > 0 && rawContentModelId === normalizedContentModelId
  const currentCustomFields = isRecord(input.page.customFields)
    ? cloneValue(input.page.customFields)
    : {}
  const currentLocalizationFields = input.page.localization?.fields

  if (!hasValidContentModel) {
    return {
      pageId: String(input.page.id ?? '').trim(),
      pageTitle: String(input.page.title ?? '').trim(),
      contentModelId: rawContentModelId,
      appliedVersion: resolveAppliedSchemaVersion(input.page.contentModelVersion),
      targetVersion: null,
      status: 'invalid-model',
      migrationNotes: '',
      lastSchemaChangeAt: null,
      summary: createEmptyMigrationSummary(),
      hasChanges: false,
      canApply: false,
      nextCustomFields: cloneValue(currentCustomFields),
      ...(isRecord(currentLocalizationFields)
        ? { nextLocalizationFields: cloneValue(currentLocalizationFields as CmsLocalizedPropsRecord) }
        : {}),
      changes: [],
    }
  }

  const fieldDefinitions = getCmsContentModelFieldDefinitions(
    locale,
    input.page.contentModelId,
    authoredContentModels
  )
  const nextCustomFields = normalizeCmsPageCustomFieldsForContentModel(
    currentCustomFields,
    input.page.contentModelId,
    locale,
    authoredContentModels
  )
  const nextLocalizationFields = normalizeLocalizedFieldOverrides(
    currentLocalizationFields,
    input.page.contentModelId,
    authoredContentModels
  )

  const localeKeys = Array.from(new Set([
    ...Object.keys(currentLocalizationFields ?? {}),
    ...Object.keys(nextLocalizationFields ?? {}),
  ]))
    .map(entry => resolveCmsLocale(entry))
    .sort()

  const changes = collectRecordChanges({
    fieldDefinitions,
    currentFields: currentCustomFields,
    nextFields: nextCustomFields,
    locale: null,
  })

  for (const localeKey of localeKeys) {
    const currentLocaleFields = isRecord(currentLocalizationFields?.[localeKey])
      ? currentLocalizationFields?.[localeKey] as Record<string, unknown>
      : {}
    const nextLocaleFields = isRecord(nextLocalizationFields?.[localeKey])
      ? nextLocalizationFields?.[localeKey] as Record<string, unknown>
      : {}

    changes.push(...collectRecordChanges({
      fieldDefinitions,
      currentFields: currentLocaleFields,
      nextFields: nextLocaleFields,
      locale: localeKey,
    }))
  }

  changes.sort((left, right) => left.path.localeCompare(right.path))

  const targetVersion = getCmsContentModelSchemaVersion(input.page.contentModelId, authoredContentModels)
  const appliedVersion = resolveAppliedSchemaVersion(input.page.contentModelVersion)
  const status = resolveMigrationStatus(appliedVersion, targetVersion)
  const summary = createEmptyMigrationSummary()
  changes.forEach(change => incrementMigrationSummary(summary, change.kind))
  const hasChanges = changes.length > 0 || status === 'upgrade-required' || status === 'version-missing'

  return {
    pageId: String(input.page.id ?? '').trim(),
    pageTitle: String(input.page.title ?? '').trim(),
    contentModelId: String(input.page.contentModelId ?? '').trim(),
    appliedVersion,
    targetVersion,
    status,
    migrationNotes: getCmsContentModelMigrationNotes(locale, input.page.contentModelId, authoredContentModels),
    lastSchemaChangeAt: getCmsContentModelLastSchemaChangeAt(input.page.contentModelId, authoredContentModels),
    summary,
    hasChanges,
    canApply: status !== 'ahead' && hasChanges,
    nextCustomFields: cloneValue(nextCustomFields),
    ...(nextLocalizationFields ? { nextLocalizationFields: cloneValue(nextLocalizationFields) } : {}),
    changes,
  }
}

/**
 * Builds a whole-report dry-run summary across all pages.
 */
export function createCmsSchemaMigrationBatchReport(input: {
  pages: CmsPageSettings[]
  localeInput?: unknown
  authoredContentModels?: CmsAuthoredContentModelSettings[]
}): CmsSchemaMigrationBatchReport {
  const pages = Array.isArray(input.pages) ? input.pages : []
  const reports = pages.map(page => createCmsPageSchemaMigrationReport({
    page,
    localeInput: input.localeInput,
    authoredContentModels: input.authoredContentModels,
  }))
  const summary = createEmptyBatchSummary(reports.length)

  for (const report of reports) {
    if (report.status === 'current') {
      summary.currentCount += 1
    } else if (report.status === 'upgrade-required') {
      summary.upgradeRequiredCount += 1
    } else if (report.status === 'version-missing') {
      summary.versionMissingCount += 1
    } else if (report.status === 'invalid-model') {
      summary.invalidModelCount += 1
    } else {
      summary.aheadCount += 1
    }

    if (report.hasChanges) {
      summary.changedPageCount += 1
    }

    summary.addCount += report.summary.addCount
    summary.removeCount += report.summary.removeCount
    summary.updateCount += report.summary.updateCount
  }

  return {
    summary,
    pages: reports,
  }
}

/**
 * Applies one page schema migration to the latest content-model schema.
 */
export function applyCmsPageSchemaMigration(input: {
  page: CmsPageSettings
  localeInput?: unknown
  authoredContentModels?: CmsAuthoredContentModelSettings[]
}): CmsPageSettings {
  const report = createCmsPageSchemaMigrationReport(input)
  if (!report.canApply) {
    return cloneValue(input.page)
  }

  return {
    ...cloneValue(input.page),
    customFields: cloneValue(report.nextCustomFields),
    localization: normalizeCmsPageLocalizationSettings({
      ...(input.page.localization ?? {}),
      fields: report.nextLocalizationFields,
    }),
    contentModelVersion: report.targetVersion,
  }
}