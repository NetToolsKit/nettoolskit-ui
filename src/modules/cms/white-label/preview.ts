/**
 * CMS preview engine helpers.
 * Resolves draft/published snapshots for builder preview surfaces without backend coupling.
 */

import { createCmsReleaseSnapshot } from '../releases/orchestration'
import { resolveCmsLocale } from './i18n'
import type {
  CmsLocale,
  CmsPreviewSnapshot,
  CmsPreviewSource,
  CmsReleaseEntry,
  CmsReleaseEnvironment,
  CmsWhiteLabelSettings,
} from './types'

/**
 * Runtime options for resolving a preview snapshot.
 */
export interface ResolveCmsPreviewSnapshotOptions {
  source: CmsPreviewSource
  localeInput?: CmsLocale | string | null
  selectedReleaseId?: string | null
  activeEnvironment?: CmsReleaseEnvironment | null
}

/**
 * Converts arbitrary release timestamps into sortable numeric values.
 */
function getReleaseTimestamp(value: string | null | undefined): number {
  const parsed = new Date(String(value ?? '').trim()).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * Sorts published releases from newest to oldest using publish/update/create timestamps.
 */
function sortPublishedReleases(entries: CmsReleaseEntry[]): CmsReleaseEntry[] {
  return [...entries].sort((left, right) => {
    const rightTime = getReleaseTimestamp(right.publishedAt)
      || getReleaseTimestamp(right.updatedAt)
      || getReleaseTimestamp(right.createdAt)
    const leftTime = getReleaseTimestamp(left.publishedAt)
      || getReleaseTimestamp(left.updatedAt)
      || getReleaseTimestamp(left.createdAt)

    if (rightTime !== leftTime) {
      return rightTime - leftTime
    }

    return right.id.localeCompare(left.id)
  })
}

/**
 * Resolves the most appropriate published release for preview fallback.
 */
export function resolveCmsPreviewPublishedRelease(
  settings: CmsWhiteLabelSettings,
  options: Omit<ResolveCmsPreviewSnapshotOptions, 'source' | 'localeInput'>
): CmsReleaseEntry | null {
  const publishedEntries = settings.releases.items.filter(item => item.status === 'published')
  if (publishedEntries.length === 0) {
    return null
  }

  const selectedReleaseId = String(options.selectedReleaseId ?? '').trim()
  if (selectedReleaseId) {
    const selectedRelease = publishedEntries.find(item => item.id === selectedReleaseId)
    if (selectedRelease) {
      return selectedRelease
    }
  }

  const activeEnvironment = options.activeEnvironment ?? null
  if (activeEnvironment) {
    const publishedInEnvironment = sortPublishedReleases(
      publishedEntries.filter(item => item.environment === activeEnvironment)
    )

    if (publishedInEnvironment.length > 0) {
      return publishedInEnvironment[0] ?? null
    }
  }

  return sortPublishedReleases(publishedEntries)[0] ?? null
}

/**
 * Maps a release snapshot into the generic preview snapshot shape.
 */
function mapPreviewSnapshot(
  settings: CmsWhiteLabelSettings,
  locale: CmsLocale,
  source: CmsPreviewSource,
  release: CmsReleaseEntry | null
): CmsPreviewSnapshot {
  const snapshot = release?.snapshot ?? createCmsReleaseSnapshot(settings)

  return {
    source,
    locale,
    branding: snapshot.branding,
    pages: snapshot.pages,
    authoredContentModels: snapshot.authoredContentModels,
    authoredBlockPresets: snapshot.authoredBlockPresets,
    reusableSections: snapshot.reusableSections,
    reusableBlocks: snapshot.reusableBlocks,
    mediaAssets: snapshot.mediaAssets,
    releaseId: release?.id ?? null,
    releaseName: release?.name ?? null,
    releaseEnvironment: release?.environment ?? null,
    publishedAt: release?.publishedAt ?? null,
  }
}

/**
 * Resolves the snapshot used by CMS preview surfaces.
 * Draft mode mirrors current in-memory settings. Published mode resolves the best local published release snapshot.
 */
export function resolveCmsPreviewSnapshot(
  settings: CmsWhiteLabelSettings,
  options: ResolveCmsPreviewSnapshotOptions
): CmsPreviewSnapshot | null {
  const locale = resolveCmsLocale(options.localeInput ?? settings.content.locale)

  if (options.source === 'draft') {
    return mapPreviewSnapshot(settings, locale, 'draft', null)
  }

  const publishedRelease = resolveCmsPreviewPublishedRelease(settings, {
    selectedReleaseId: options.selectedReleaseId,
    activeEnvironment: options.activeEnvironment,
  })

  if (!publishedRelease) {
    return null
  }

  return mapPreviewSnapshot(settings, locale, 'published', publishedRelease)
}