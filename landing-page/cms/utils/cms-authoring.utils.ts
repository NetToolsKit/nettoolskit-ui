import { toRaw } from 'vue'
import type {
  CmsMediaAssetFocalPointSettings,
  CmsWhiteLabelSettings,
} from '../../../src/modules/cms/white-label/types'

export interface CmsMediaAssetDraftFocalPointInput {
  focalPointX: string
  focalPointY: string
}

export function parseBreakpointToken(value: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''))
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }
  return fallback
}

export function resolveViewportWidth(
  screenWidth: number | undefined,
  fallback: number
): number {
  if (typeof screenWidth === 'number' && Number.isFinite(screenWidth)) {
    return screenWidth
  }

  if (typeof window !== 'undefined' && typeof window.innerWidth === 'number' && Number.isFinite(window.innerWidth)) {
    return window.innerWidth
  }

  return fallback
}

export function cloneWhiteLabelSettings(value: CmsWhiteLabelSettings): CmsWhiteLabelSettings {
  const rawValue = toRaw(value) as CmsWhiteLabelSettings
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(rawValue)
    } catch {
      return JSON.parse(JSON.stringify(rawValue)) as CmsWhiteLabelSettings
    }
  }

  return JSON.parse(JSON.stringify(rawValue)) as CmsWhiteLabelSettings
}

export function cloneSerializableValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      return JSON.parse(JSON.stringify(value)) as T
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

export function areCmsSettingsSnapshotsEqual(
  left: CmsWhiteLabelSettings,
  right: CmsWhiteLabelSettings
): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

export function parseMediaDraftList(value: string): string[] {
  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
}

export function parseMediaDraftFocalPoint(
  assetDraft: CmsMediaAssetDraftFocalPointInput
): CmsMediaAssetFocalPointSettings | null {
  const normalizedX = assetDraft.focalPointX.trim()
  const normalizedY = assetDraft.focalPointY.trim()
  if (!normalizedX && !normalizedY) {
    return null
  }

  const x = Number(normalizedX)
  const y = Number(normalizedY)
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
  }

  return {
    x,
    y,
  }
}