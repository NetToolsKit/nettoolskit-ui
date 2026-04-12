import { computed, ref, watch } from 'vue'

import {
  createReferenceWhitelabelStyleVars,
  listReferenceWhitelabelPresets,
  loadStoredReferenceWhitelabelPreset,
  persistReferenceWhitelabelPreset,
  resolveReferenceWhitelabelPreset,
} from '../../src/whitelabel'
import type { TemplateMenuItem } from '../../src/templates/navigation/menu-template.types'

const samplesShellMenuItems: TemplateMenuItem[] = [
  {
    id: 'home',
    text: 'Inicio',
    icon: 'home',
  },
  {
    id: 'templates',
    text: 'Pacotes',
    icon: 'dashboard',
  },
  {
    id: 'workspace',
    text: 'Workspace',
    icon: 'view_kanban',
  },
  {
    id: 'presets',
    text: 'Presets',
    icon: 'settings',
    stickyBottom: true,
  },
]

export function useSamplesShellState(initialMenuId: string) {
  const activeMenuId = ref(initialMenuId)
  const searchValue = ref('')
  const storedPresetId = loadStoredReferenceWhitelabelPreset()
  const selectedPresetId = ref(storedPresetId ?? 'reference-light')

  const presetOptions = computed(() => {
    return listReferenceWhitelabelPresets().map(preset => ({
      label: preset.label,
      value: preset.id,
    }))
  })

  const selectedPreset = computed(() => {
    const preset = resolveReferenceWhitelabelPreset(selectedPresetId.value)
    return {
      ...preset,
      brand: {
        ...preset.brand,
        name: 'Samples Runtime',
        subtitle: 'Whitelabel review shell',
        kicker: 'samples runtime',
        description: 'Reusable screens and packs reviewed through the shared sample shell.',
      },
    }
  })

  const whitelabelStyleVars = computed(() => {
    return createReferenceWhitelabelStyleVars(selectedPreset.value)
  })

  watch(selectedPresetId, value => {
    persistReferenceWhitelabelPreset(value)
  })

  return {
    activeMenuId,
    menuItems: samplesShellMenuItems,
    presetOptions,
    searchValue,
    selectedPreset,
    selectedPresetId,
    whitelabelStyleVars,
  }
}
