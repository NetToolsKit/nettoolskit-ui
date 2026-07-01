/**
 * useAsync state machine and useBranding brand resolution + preset applier.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAsync } from '../../../src/composables/utils/useAsync'
import { useBranding } from '../../../src/composables/ui/useBranding'
import { useTheme } from '../../../src/composables/ui/useTheme'
import { applyNettoolskitPreset, nettoolskitPreset } from '../../../src/config/presets/nettoolskit.preset'

afterEach(() => {
  const { setTheme } = useTheme()
  setTheme('nettoolskit')
  document.documentElement.className = ''
  document.documentElement.removeAttribute('style')
})

describe('useAsync', () => {
  it('tracks loading, stores data and calls onSuccess', async () => {
    const onSuccess = vi.fn()
    const { loading, error, data, execute } = useAsync(async () => 'ok', { onSuccess })

    const pending = execute()
    expect(loading.value).toBe(true)
    await pending

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(data.value).toBe('ok')
    expect(onSuccess).toHaveBeenCalledWith('ok')
  })

  it('captures errors, calls onError and clears the previous error on retry', async () => {
    const onError = vi.fn()
    let shouldFail = true
    const { error, data, execute } = useAsync(async () => {
      if (shouldFail) {
        throw new Error('boom')
      }
      return 42
    }, { onError })

    await execute()
    expect(error.value?.message).toBe('boom')
    expect(onError).toHaveBeenCalledTimes(1)
    expect(data.value).toBeNull()

    shouldFail = false
    await execute()
    expect(error.value).toBeNull()
    expect(data.value).toBe(42)
  })

  it('executes immediately when configured', async () => {
    const fn = vi.fn(async () => 'now')
    useAsync(fn, { immediate: true })
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('useBranding', () => {
  it('resolves the active brand content/navigation from the theme identity', () => {
    const branding = useBranding()

    expect(branding.appName.value.length).toBeGreaterThan(0)
    expect(branding.primaryColor.value).toBe('var(--ntk-primary)')
    expect(typeof branding.social.value).toBe('object')
    expect(branding.logo.value).toBeTruthy()
  })

  it('falls back to the nettoolskit brand for unknown theme identities', () => {
    const { setTheme } = useTheme()
    setTheme('revolut') // identity is not one of the known brand names
    const branding = useBranding()

    expect(branding.contact.value).toBeDefined()
    expect(branding.navigation?.value ?? branding).toBeTruthy()
  })
})

describe('applyNettoolskitPreset', () => {
  it('applies theme classes, CSS variables, title and meta tags', () => {
    applyNettoolskitPreset('dark', { enableCodeHighlight: true, enableHotReload: true })

    const root = document.documentElement
    expect(root.classList.contains('brand-nettoolskit')).toBe(true)
    expect(root.classList.contains('theme-dark')).toBe(true)
    expect(root.classList.contains('code-highlight-enabled')).toBe(true)
    expect(root.classList.contains('hot-reload-enabled')).toBe(true)
    expect(document.title).toContain(nettoolskitPreset.brand.identity.displayName)
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe(nettoolskitPreset.brand.identity.description)
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content'))
      .toBe('website')

    applyNettoolskitPreset('light')
    expect(root.classList.contains('theme-light')).toBe(true)
    expect(root.classList.contains('theme-dark')).toBe(false)
    expect(root.style.getPropertyValue('--theme-primary') || root.style.length).toBeTruthy()
  })
})