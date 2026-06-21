/**
 * Shared media-picker helpers used by CMS authoring surfaces.
 */
import type { CmsMediaAssetKind, CmsMediaAssetSettings } from './types'

/**
 * One media option exposed to CMS picker surfaces.
 */
export interface CmsMediaPickerOption {
  label: string
  value: string
  description: string
  kind: CmsMediaAssetKind
  kindLabel: string
  url: string
  alt: string
  disable: boolean
  incompatible: boolean
}

/**
 * Optional label overrides for picker option annotations.
 */
export interface CmsMediaPickerLabels {
  incompatibleLabel: string
}

/**
 * Creates normalized picker options and keeps incompatible assets visible but disabled.
 */
export function createCmsMediaPickerOptions(
  mediaAssets: CmsMediaAssetSettings[],
  allowedKinds: CmsMediaAssetKind[] | undefined,
  getKindLabel: (kind: CmsMediaAssetKind) => string,
  labels?: Partial<CmsMediaPickerLabels>
): CmsMediaPickerOption[] {
  const normalizedAllowedKinds = Array.isArray(allowedKinds)
    ? [...new Set(allowedKinds.filter((kind): kind is CmsMediaAssetKind => typeof kind === 'string' && kind.length > 0))]
    : []

  const incompatibleLabel = labels?.incompatibleLabel ?? 'Incompatible'

  const options = mediaAssets.map(asset => {
    const isCompatible = normalizedAllowedKinds.length === 0 || normalizedAllowedKinds.includes(asset.kind)
    const baseDescription = asset.description.trim() || asset.alt.trim() || asset.url.trim()

    return {
      label: asset.name,
      value: asset.id,
      description: isCompatible
        ? baseDescription
        : [baseDescription, incompatibleLabel].filter(part => part.length > 0).join(' · '),
      kind: asset.kind,
      kindLabel: getKindLabel(asset.kind),
      url: asset.url,
      alt: asset.alt,
      disable: !isCompatible,
      incompatible: !isCompatible,
    } satisfies CmsMediaPickerOption
  })

  return options.sort((left, right) => {
    if (left.disable !== right.disable) {
      return left.disable ? 1 : -1
    }

    return left.label.localeCompare(right.label)
  })
}

/**
 * Resolves the selected picker options preserving the selected value order.
 */
export function resolveCmsMediaPickerSelectedOptions(
  options: CmsMediaPickerOption[],
  value: string | string[] | null | undefined
): CmsMediaPickerOption[] {
  const selectedValues = Array.isArray(value)
    ? value
      .map(entry => String(entry ?? '').trim())
      .filter(entry => entry.length > 0)
    : [String(value ?? '').trim()].filter(entry => entry.length > 0)

  const optionsByValue = new Map(options.map(option => [option.value, option] as const))

  return selectedValues
    .map(selectedValue => optionsByValue.get(selectedValue) ?? null)
    .filter((option): option is CmsMediaPickerOption => option !== null)
}