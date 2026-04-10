import { computed, ref, watch } from 'vue'

import type { TemplateMenuChildItem, TemplateMenuItem } from '../../navigation/menu-template.types'
import {
  createReferenceWhitelabelStyleVars,
  listReferenceWhitelabelPresets,
  loadStoredReferenceWhitelabelPreset,
  persistReferenceWhitelabelPreset,
  resolveReferenceWhitelabelPreset,
  type ReferenceSampleSurface,
} from '../../../whitelabel'
import { referenceMenuItems, referenceSampleSurfaces } from './reference-catalog.sample-data'

export type ReferenceCatalogMenuId =
  | 'overview'
  | 'samples'
  | 'presets'
  | 'dashboard'
  | 'workspace'
  | 'cruds'
  | 'profile'
  | 'editor'
  | 'enterprise'
  | 'auth'
  | 'knowledge'

const NAVIGABLE_MENU_IDS = new Set<ReferenceCatalogMenuId>([
  'overview',
  'samples',
  'presets',
  'dashboard',
  'workspace',
  'cruds',
  'profile',
  'editor',
  'enterprise',
  'auth',
  'knowledge',
])

const MENU_TO_SURFACE_ID: Partial<Record<ReferenceCatalogMenuId, string>> = {
  dashboard: 'dashboard',
  workspace: 'workspace',
  cruds: 'cruds',
  profile: 'profile',
  editor: 'editor',
  enterprise: 'command-center',
  auth: 'login',
  knowledge: 'wiki',
}

const SURFACE_TO_MENU_ID = new Map(
  Object.entries(MENU_TO_SURFACE_ID).map(([menuId, surfaceId]) => [surfaceId, menuId as ReferenceCatalogMenuId])
)

export interface UseReferenceCatalogHostOptions {
  initialMenuId?: ReferenceCatalogMenuId
  initialSurfaceId?: string
  initialPresetId?: string
  persistPreset?: boolean
  onHelp?: (() => void) | null
  onBackHome?: ((item: TemplateMenuItem | TemplateMenuChildItem) => void) | null
}

export function useReferenceCatalogHost(options: UseReferenceCatalogHostOptions = {}) {
  const availablePresets = listReferenceWhitelabelPresets()
  const storedPresetId = options.persistPreset === false ? null : loadStoredReferenceWhitelabelPreset()
  const defaultPresetId =
    options.initialPresetId
    ?? storedPresetId
    ?? availablePresets[1]?.id
    ?? availablePresets[0]?.id
    ?? 'reference-light'

  const defaultSurfaceId = options.initialSurfaceId ?? referenceSampleSurfaces[0]?.id ?? 'dashboard'

  const selectedPresetId = ref(defaultPresetId)
  const activeMenuId = ref<ReferenceCatalogMenuId>(options.initialMenuId ?? 'overview')
  const searchValue = ref('')
  const selectedSurfaceId = ref(defaultSurfaceId)

  const selectedPreset = computed(() => {
    return resolveReferenceWhitelabelPreset(selectedPresetId.value)
  })

  const whitelabelStyleVars = computed(() => {
    return createReferenceWhitelabelStyleVars(selectedPreset.value)
  })

  const presetOptions = computed(() => {
    return availablePresets.map(preset => ({
      label: preset.label,
      value: preset.id,
    }))
  })

  const filteredSurfaces = computed<ReferenceSampleSurface[]>(() => {
    const search = searchValue.value.trim().toLowerCase()

    return referenceSampleSurfaces.filter(surface => {
      if (!search) {
        return true
      }

      const content = [
        surface.title,
        surface.subtitle,
        surface.description,
        surface.tag,
        surface.template,
      ]
        .join(' ')
        .toLowerCase()

      return content.includes(search)
    })
  })

  const selectedSurface = computed<ReferenceSampleSurface | null>(() => {
    return filteredSurfaces.value.find(surface => surface.id === selectedSurfaceId.value)
      ?? referenceSampleSurfaces.find(surface => surface.id === selectedSurfaceId.value)
      ?? filteredSurfaces.value[0]
      ?? referenceSampleSurfaces[0]
      ?? null
  })

  const activeSectionMode = computed<'overview' | 'samples' | 'presets' | 'screen'>(() => {
    if (activeMenuId.value === 'overview') {
      return 'overview'
    }

    if (activeMenuId.value === 'presets') {
      return 'presets'
    }

    if (activeMenuId.value === 'samples') {
      return 'samples'
    }

    return 'screen'
  })

  watch(selectedPresetId, value => {
    if (options.persistPreset !== false) {
      persistReferenceWhitelabelPreset(value)
    }
  })

  function onPresetChange(value: string | number | null): void {
    if (typeof value === 'string' && value.length > 0) {
      selectedPresetId.value = value
    }
  }

  function onSurfaceSelect(surfaceId: string): void {
    selectedSurfaceId.value = surfaceId
    activeMenuId.value = SURFACE_TO_MENU_ID.get(surfaceId) ?? 'samples'
  }

  function onMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
    if (item.id === 'help') {
      options.onHelp?.()
      return
    }

    if (item.id === 'back-home') {
      options.onBackHome?.(item)
      return
    }

    if (!NAVIGABLE_MENU_IDS.has(item.id as ReferenceCatalogMenuId)) {
      return
    }

    const nextMenuId = item.id as ReferenceCatalogMenuId
    activeMenuId.value = nextMenuId

    const mappedSurfaceId = MENU_TO_SURFACE_ID[nextMenuId]
    if (mappedSurfaceId) {
      selectedSurfaceId.value = mappedSurfaceId
    }
  }

  return {
    activeMenuId,
    activeSectionMode,
    availablePresets,
    filteredSurfaces,
    onMenuItemClick,
    onPresetChange,
    onSurfaceSelect,
    presetOptions,
    referenceMenuItems,
    referenceSampleSurfaces,
    searchValue,
    selectedPreset,
    selectedPresetId,
    selectedSurface,
    selectedSurfaceId,
    whitelabelStyleVars,
  }
}
