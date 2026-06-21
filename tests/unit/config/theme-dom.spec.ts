import { beforeEach, describe, expect, it, vi } from 'vitest'

const { darkSetMock } = vi.hoisted(() => ({
  darkSetMock: vi.fn(),
}))

vi.mock('quasar', () => ({
  Dark: {
    set: darkSetMock,
  },
}))

import { syncThemeDomState } from '../../../src/config/theme/theme-dom'

describe('theme DOM sync', () => {
  beforeEach(() => {
    darkSetMock.mockClear()
    document.documentElement.removeAttribute('style')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.className = ''
    document.body.removeAttribute('style')
    document.body.removeAttribute('data-theme')
    document.body.className = ''
  })

  it('syncs Quasar palette aliases from white-label tokens including dark surfaces', () => {
    const root = document.documentElement
    root.style.setProperty('--ntk-primary', '#0f766e')
    root.style.setProperty('--ntk-accent', '#14b8a6')
    root.style.setProperty('--ntk-accent-hover', '#115e59')
    root.style.setProperty('--ntk-success', '#10b981')
    root.style.setProperty('--ntk-warning', '#f59e0b')
    root.style.setProperty('--ntk-error', '#ef4444')
    root.style.setProperty('--ntk-info', '#14b8a6')
    root.style.setProperty('--ntk-dark', '#1a1a19')
    root.style.setProperty('--ntk-dark-page', '#0e0e0d')
    root.style.setProperty('--ntk-bg-primary', '#0e0e0d')
    root.style.setProperty('--ntk-text-primary', '#faf9f6')

    syncThemeDomState({ dark: true })

    expect(root.style.getPropertyValue('--q-primary')).toBe('#0f766e')
    expect(root.style.getPropertyValue('--q-secondary')).toBe('#14b8a6')
    expect(root.style.getPropertyValue('--q-accent')).toBe('#115e59')
    expect(root.style.getPropertyValue('--q-positive')).toBe('#10b981')
    expect(root.style.getPropertyValue('--q-warning')).toBe('#f59e0b')
    expect(root.style.getPropertyValue('--q-negative')).toBe('#ef4444')
    expect(root.style.getPropertyValue('--q-info')).toBe('#14b8a6')
    expect(root.style.getPropertyValue('--q-dark')).toBe('#1a1a19')
    expect(root.style.getPropertyValue('--q-dark-page')).toBe('#0e0e0d')
    expect(darkSetMock).toHaveBeenCalledWith(true)
  })

  it('prefers explicit secondary when provided by a host white-label theme', () => {
    const root = document.documentElement
    root.style.setProperty('--ntk-primary', '#0f766e')
    root.style.setProperty('--ntk-accent', '#14b8a6')
    root.style.setProperty('--ntk-secondary', '#c96442')

    syncThemeDomState()

    expect(root.style.getPropertyValue('--q-secondary')).toBe('#c96442')
  })
})
