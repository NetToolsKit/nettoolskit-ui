/**
 * Reusable schema-field preset helpers for authored content-model creation.
 * Presets let backend-oriented authors save one structured field definition and
 * reapply it across content models without rebuilding the field contract.
 */
import { resolveCmsLocale } from './i18n'
import {
  applyCmsLocalizedTextUpdate,
  normalizeCmsLocalizedTextRecord,
  resolveCmsLocalizedText,
} from './localized-content'
import {
  type CmsAuthoredContentModelFieldPresetId,
  type CmsAuthoredContentModelFieldPresetSettings,
  type CmsContentModelFieldLocalizationSettings,
  type CmsContentModelFieldSettings,
  type CmsContentModelFieldValue,
} from './types'

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeSegment(value: string, fallback = 'item'): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || fallback
}

function createUniqueValue(base: string, occupiedIds: Set<string>): string {
  if (!occupiedIds.has(base)) {
    return base
  }

  let suffix = 2
  let candidate = `${base}-${suffix}`
  while (occupiedIds.has(candidate)) {
    suffix += 1
    candidate = `${base}-${suffix}`
  }

  return candidate
}

function normalizeCmsContentModelFieldPresetLocalizationSettings(
  value: unknown
): CmsAuthoredContentModelFieldPresetSettings['localization'] | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const name = normalizeCmsLocalizedTextRecord(value.name)
  const description = normalizeCmsLocalizedTextRecord(value.description)
  if (!name && !description) {
    return undefined
  }

  return {
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
  }
}

function normalizeCmsContentModelFieldLocalizationSettings(
  value: unknown
): CmsContentModelFieldLocalizationSettings | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const label = normalizeCmsLocalizedTextRecord(value.label)
  const description = normalizeCmsLocalizedTextRecord(value.description)
  const placeholder = normalizeCmsLocalizedTextRecord(value.placeholder)
  const group = normalizeCmsLocalizedTextRecord(value.group)

  if (!label && !description && !placeholder && !group) {
    return undefined
  }

  return {
    ...(label ? { label } : {}),
    ...(description ? { description } : {}),
    ...(placeholder ? { placeholder } : {}),
    ...(group ? { group } : {}),
  }
}

function normalizeFieldDefaultValue(
  value: unknown,
  input: {
    type: CmsContentModelFieldSettings['type']
    repeatable: boolean
    fields?: CmsContentModelFieldSettings[]
  }
): CmsContentModelFieldValue {
  if (input.type === 'object') {
    return isObjectRecord(value) ? cloneValue(value) : {}
  }

  if (input.type === 'group') {
    return Array.isArray(value)
      ? value.filter(isObjectRecord).map(entry => cloneValue(entry))
      : []
  }

  if (input.repeatable) {
    if (!Array.isArray(value)) {
      return []
    }

    return value
      .map(entry => {
        if (
          entry == null
          || typeof entry === 'string'
          || typeof entry === 'number'
          || typeof entry === 'boolean'
        ) {
          return entry
        }

        return null
      })
  }

  if (
    value == null
  ) {
    return null
  }

  if (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
  ) {
    return value
  }

  return ''
}

function normalizeFieldSetting(value: unknown, fallbackName = 'field'): CmsContentModelFieldSettings | null {
  if (!isObjectRecord(value)) {
    return null
  }

  const type = ['text', 'textarea', 'number', 'toggle', 'select', 'url', 'date', 'media-asset', 'reference', 'object', 'group'].includes(String(value.type ?? '').trim())
    ? String(value.type ?? '').trim() as CmsContentModelFieldSettings['type']
    : 'text'
  const id = normalizeSegment(String(value.id ?? ''), fallbackName)
  const required = Boolean(value.required)
  const repeatable = type === 'object' || type === 'group' ? false : Boolean(value.repeatable)
  const min = value.min == null || value.min === '' ? null : Number(value.min)
  const max = value.max == null || value.max === '' ? null : Number(value.max)
  const fields = (type === 'object' || type === 'group') && Array.isArray(value.fields)
    ? value.fields
      .map((entry, index) => normalizeFieldSetting(entry, `${fallbackName}-${index + 1}`))
      .filter((entry): entry is CmsContentModelFieldSettings => entry !== null)
    : undefined
  const mediaKinds = type === 'media-asset' && Array.isArray(value.mediaKinds)
    ? value.mediaKinds
      .map(entry => String(entry ?? '').trim().toLowerCase())
      .filter((entry, index, entries) => {
        return ['image', 'video', 'icon', 'document', 'other'].includes(entry)
          && entries.indexOf(entry) === index
      }) as CmsContentModelFieldSettings['mediaKinds']
    : undefined
  const referenceKinds = type === 'reference' && Array.isArray(value.referenceKinds)
    ? value.referenceKinds
      .map(entry => String(entry ?? '').trim().toLowerCase())
      .filter((entry, index, entries) => {
        return ['content-model', 'block-preset', 'reusable-block', 'reusable-section'].includes(entry)
          && entries.indexOf(entry) === index
      }) as CmsContentModelFieldSettings['referenceKinds']
    : undefined

  return {
    id,
    type,
    label: String(value.label ?? '').trim() || 'Field',
    description: String(value.description ?? '').trim(),
    placeholder: String(value.placeholder ?? '').trim(),
    group: String(value.group ?? '').trim(),
    order: Number.isFinite(Number(value.order)) ? Math.max(1, Math.floor(Number(value.order))) : 1,
    required,
    repeatable,
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
    defaultValue: cloneValue(
      normalizeFieldDefaultValue((value as { defaultValue?: unknown }).defaultValue, {
        type,
        repeatable,
        fields,
      })
    ),
    options: Array.isArray(value.options)
      ? value.options
        .map(entry => {
          if (!isObjectRecord(entry)) {
            return null
          }
          const optionValue = String(entry.value ?? '').trim()
          if (!optionValue) {
            return null
          }
          return {
            value: optionValue,
            label: String(entry.label ?? entry.value ?? '').trim() || optionValue,
          }
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      : undefined,
    ...(mediaKinds && mediaKinds.length > 0 ? { mediaKinds } : {}),
    ...(referenceKinds && referenceKinds.length > 0 ? { referenceKinds } : {}),
    ...(fields && fields.length > 0 ? { fields } : {}),
    localization: normalizeCmsContentModelFieldLocalizationSettings(value.localization),
  }
}

export interface CmsContentModelFieldPresetOption {
  value: CmsAuthoredContentModelFieldPresetId
  label: string
  description: string
  category: string
}

export interface CmsResolvedContentModelFieldPresetDefinition {
  id: CmsAuthoredContentModelFieldPresetId
  name: string
  description: string
  category: string
  field: CmsContentModelFieldSettings
}

/**
 * Creates the default authored schema-field preset library for the CMS engine.
 */
export function createDefaultCmsAuthoredContentModelFieldPresets(): CmsAuthoredContentModelFieldPresetSettings[] {
  return []
}

/**
 * Normalizes authored schema-field preset payloads from storage/import snapshots.
 */
export function normalizeCmsAuthoredContentModelFieldPresets(
  authoredPresets: unknown,
  defaults: CmsAuthoredContentModelFieldPresetSettings[] = []
): CmsAuthoredContentModelFieldPresetSettings[] {
  if (!Array.isArray(authoredPresets)) {
    return cloneValue(defaults)
  }

  const seenIds = new Set<string>()
  const normalized = authoredPresets
    .map<CmsAuthoredContentModelFieldPresetSettings | null>((rawPreset, index) => {
      if (!isObjectRecord(rawPreset)) {
        return null
      }

      const requestedId = String(rawPreset.id ?? '').trim()
      const baseName = String(rawPreset.name ?? '').trim() || `Field preset ${index + 1}`
      const baseId = requestedId.startsWith('field-preset:')
        ? requestedId
        : `field-preset:${normalizeSegment(baseName, `field-preset-${index + 1}`)}`
      const id = createUniqueValue(baseId, seenIds) as CmsAuthoredContentModelFieldPresetId
      seenIds.add(id)

      const field = normalizeFieldSetting(
        rawPreset.field,
        normalizeSegment(String(rawPreset.name ?? rawPreset.category ?? ''), `field-${index + 1}`)
      )
      if (!field) {
        return null
      }

      return {
        id,
        name: baseName,
        description: String(rawPreset.description ?? '').trim(),
        category: String(rawPreset.category ?? '').trim() || field.group || field.type,
        field,
        localization: normalizeCmsContentModelFieldPresetLocalizationSettings(rawPreset.localization),
        archivedAt: String(rawPreset.archivedAt ?? '').trim() || null,
        deprecatedAt: String(rawPreset.deprecatedAt ?? '').trim() || null,
        deprecationNote: String(rawPreset.deprecationNote ?? '').trim() || null,
        replacementEntityId: String(rawPreset.replacementEntityId ?? '').trim() || null,
      }
    })
    .filter((preset): preset is CmsAuthoredContentModelFieldPresetSettings => preset !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Resolves one authored schema-field preset definition for the active locale.
 */
export function getCmsContentModelFieldPresetDefinition(
  localeInput: unknown,
  presetId: string,
  authoredPresets: CmsAuthoredContentModelFieldPresetSettings[] = []
): CmsResolvedContentModelFieldPresetDefinition | null {
  const preset = authoredPresets.find(entry => entry.id === presetId)
  if (!preset) {
    return null
  }

  return {
    id: preset.id,
    name: resolveCmsLocalizedText({
      baseValue: preset.name,
      localized: preset.localization?.name,
      localeInput,
    }),
    description: resolveCmsLocalizedText({
      baseValue: preset.description,
      localized: preset.localization?.description,
      localeInput,
    }),
    category: preset.category,
    field: cloneValue(preset.field),
  }
}

/**
 * Lists authored schema-field presets as select-ready options for the CMS UI.
 */
export function listCmsContentModelFieldPresetOptions(
  localeInput: unknown,
  authoredPresets: CmsAuthoredContentModelFieldPresetSettings[] = []
): CmsContentModelFieldPresetOption[] {
  return authoredPresets.map(preset => ({
    value: preset.id,
    label: resolveCmsLocalizedText({
      baseValue: preset.name,
      localized: preset.localization?.name,
      localeInput,
    }),
    description: resolveCmsLocalizedText({
      baseValue: preset.description,
      localized: preset.localization?.description,
      localeInput,
    }),
    category: preset.category,
  }))
}

/**
 * Creates one authored schema-field preset from a live field definition.
 */
export function createCmsAuthoredContentModelFieldPreset(input: {
  field: CmsContentModelFieldSettings
  existingPresets: CmsAuthoredContentModelFieldPresetSettings[]
  localeInput?: unknown
  name?: unknown
  description?: unknown
  category?: unknown
}): CmsAuthoredContentModelFieldPresetSettings {
  const locale = resolveCmsLocale(input.localeInput)
  const occupiedIds = new Set(
    input.existingPresets.map(preset => String(preset.id ?? '').trim()).filter(Boolean)
  )
  const fallbackName = String(input.field.label ?? '').trim() || 'Field preset'
  const normalizedName = String(input.name ?? '').trim()
  const baseName = locale === 'en'
    ? (normalizedName || fallbackName)
    : fallbackName
  const id = createUniqueValue(
    `field-preset:${normalizeSegment(normalizedName || fallbackName, 'field-preset')}`,
    occupiedIds
  ) as CmsAuthoredContentModelFieldPresetId
  const nextName = applyCmsLocalizedTextUpdate({
    baseValue: baseName,
    localized: undefined,
    localeInput: locale,
    nextValue: normalizedName || fallbackName,
  })
  const nextDescription = applyCmsLocalizedTextUpdate({
    baseValue: locale === 'en' ? String(input.description ?? input.field.description ?? '').trim() : '',
    localized: undefined,
    localeInput: locale,
    nextValue: String(input.description ?? input.field.description ?? '').trim(),
  })

  return {
    id,
    name: nextName.baseValue,
    description: nextDescription.baseValue,
    category: String(input.category ?? '').trim() || input.field.group || input.field.type,
    field: cloneValue(input.field),
    localization: normalizeCmsContentModelFieldPresetLocalizationSettings({
      name: nextName.localized,
      description: nextDescription.localized,
    }),
  }
}

/**
 * Updates one authored schema-field preset using current locale metadata and field payload.
 */
export function updateCmsAuthoredContentModelFieldPreset(input: {
  preset: CmsAuthoredContentModelFieldPresetSettings
  field?: CmsContentModelFieldSettings | null
  localeInput?: unknown
  name?: unknown
  description?: unknown
  category?: unknown
}): CmsAuthoredContentModelFieldPresetSettings {
  const locale = resolveCmsLocale(input.localeInput)
  const nextName = applyCmsLocalizedTextUpdate({
    baseValue: input.preset.name,
    localized: input.preset.localization?.name,
    localeInput: locale,
    nextValue: String(input.name ?? '').trim() || input.preset.name,
  })
  const nextDescription = applyCmsLocalizedTextUpdate({
    baseValue: input.preset.description,
    localized: input.preset.localization?.description,
    localeInput: locale,
    nextValue: String(input.description ?? '').trim(),
  })

  return {
    ...input.preset,
    name: nextName.baseValue,
    description: nextDescription.baseValue,
    category: String(input.category ?? '').trim() || input.preset.category,
    field: input.field ? cloneValue(input.field) : cloneValue(input.preset.field),
    localization: normalizeCmsContentModelFieldPresetLocalizationSettings({
      name: nextName.localized,
      description: nextDescription.localized,
    }),
  }
}