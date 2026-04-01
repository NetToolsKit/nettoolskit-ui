import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { REFERENCE_WHITELABEL_STORAGE_KEY } from '../../../src/whitelabel'
import { useReferenceWorkspaceHost } from '../../../src/templates/features/reference-system'

afterEach(() => {
  window.localStorage.clear()
})

describe('useReferenceWorkspaceHost', () => {
  it('hydrates workspace state from explicit options without persisting when disabled', () => {
    const state = useReferenceWorkspaceHost({
      initialMenuId: 'designer',
      initialReportId: 'bateladas-carregamento',
      initialDocumentTabId: 'preview',
      initialZoomValue: 125,
      initialPresetId: 'reference-graphite',
      persistPreset: false,
    })

    expect(state.activeMenuId.value).toBe('designer')
    expect(state.activeReportId.value).toBe('bateladas-carregamento')
    expect(state.activeDocumentTabId.value).toBe('preview')
    expect(state.zoomValue.value).toBe(125)
    expect(state.selectedPresetId.value).toBe('reference-graphite')
    expect(state.selectedPreset.value.label).toBe('Reference Graphite')
    expect(state.whitelabelStyleVars.value['--ntk-template-layout-page-bg']).toBeDefined()
    expect(window.localStorage.getItem(REFERENCE_WHITELABEL_STORAGE_KEY)).toBeNull()
  })

  it('persists preset selection and opens the designer for manager actions', async () => {
    const state = useReferenceWorkspaceHost({
      initialMenuId: 'catalog',
      initialPresetId: 'reference-light',
    })

    state.onPresetChange('reference-night')
    state.onManagerActionClick('create-report')
    await nextTick()

    expect(state.selectedPresetId.value).toBe('reference-night')
    expect(state.activeMenuId.value).toBe('designer')
    expect(window.localStorage.getItem(REFERENCE_WHITELABEL_STORAGE_KEY)).toBe('reference-night')
  })

  it('routes menu events to workspace navigation and custom back-home handlers', () => {
    const onBackHome = vi.fn()
    const state = useReferenceWorkspaceHost({
      onBackHome,
    })

    state.onMenuItemClick({
      id: 'designer',
      text: 'Designer',
      icon: 'design_services',
    })
    state.onMenuItemClick({
      id: 'back-home',
      text: 'Back',
      icon: 'home',
    })

    expect(state.activeMenuId.value).toBe('designer')
    expect(onBackHome).toHaveBeenCalledOnce()
  })
})