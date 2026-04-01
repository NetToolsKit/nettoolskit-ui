import { computed, ref, watch } from 'vue'

import type { TemplateMenuChildItem, TemplateMenuItem } from '../../navigation/menu-template.types'
import {
  createReferenceWhitelabelStyleVars,
  listReferenceWhitelabelPresets,
  loadStoredReferenceWhitelabelPreset,
  persistReferenceWhitelabelPreset,
  resolveReferenceWhitelabelPreset,
} from '../../../whitelabel'

export type ReferenceWorkspaceMenuId = 'catalog' | 'designer'

export interface UseReferenceWorkspaceHostOptions {
  initialMenuId?: ReferenceWorkspaceMenuId
  initialReportId?: string
  initialDocumentTabId?: string
  initialZoomValue?: number
  initialPresetId?: string
  persistPreset?: boolean
  onBackHome?: ((item: TemplateMenuItem | TemplateMenuChildItem) => void) | null
}

export function useReferenceWorkspaceHost(options: UseReferenceWorkspaceHostOptions = {}) {
  const availablePresets = listReferenceWhitelabelPresets()
  const storedPresetId = options.persistPreset === false ? null : loadStoredReferenceWhitelabelPreset()
  const defaultPresetId =
    options.initialPresetId
    ?? storedPresetId
    ?? availablePresets[1]?.id
    ?? availablePresets[0]?.id
    ?? 'reference-light'

  const selectedPresetId = ref(defaultPresetId)
  const activeMenuId = ref<ReferenceWorkspaceMenuId>(options.initialMenuId ?? 'catalog')
  const activeReportId = ref(options.initialReportId ?? '')
  const activeDocumentTabId = ref(options.initialDocumentTabId ?? 'layout')
  const searchValue = ref('')
  const zoomValue = ref(options.initialZoomValue ?? 100)

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

  function openDesigner(): void {
    activeMenuId.value = 'designer'
  }

  function onManagerActionClick(actionId: string): void {
    if (actionId === 'create-report' || actionId === 'duplicate-report' || actionId === 'publish-report') {
      openDesigner()
    }
  }

  function onMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
    if (item.id === 'back-home') {
      options.onBackHome?.(item)
      return
    }

    if (item.id === 'catalog' || item.id === 'designer') {
      activeMenuId.value = item.id
    }
  }

  return {
    activeDocumentTabId,
    activeMenuId,
    activeReportId,
    availablePresets,
    onManagerActionClick,
    onMenuItemClick,
    onPresetChange,
    openDesigner,
    presetOptions,
    searchValue,
    selectedPreset,
    selectedPresetId,
    whitelabelStyleVars,
    zoomValue,
  }
}