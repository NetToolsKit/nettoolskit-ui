/**
 * Tests/unit/modules/cms/Media Picker spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  createCmsMediaPickerOptions,
  resolveCmsMediaPickerSelectedOptions,
} from '../../../../src/modules/cms/white-label/media-picker'
import type { CmsMediaAssetSettings } from '../../../../src/modules/cms/white-label/types'

const mediaAssets: CmsMediaAssetSettings[] = [
  {
    id: 'favicon',
    name: 'Favicon',
    description: 'Site favicon',
    kind: 'icon',
    url: '/favicon.png',
    alt: 'Favicon',
    focalPoint: null,
    replaceTargetAssetId: null,
    tags: [],
    usage: [],
  },
  {
    id: 'brand-logo',
    name: 'Brand logo',
    description: 'Primary logo',
    kind: 'image',
    url: '/logo.svg',
    alt: 'Brand logo',
    focalPoint: null,
    replaceTargetAssetId: null,
    tags: [],
    usage: [],
  },
  {
    id: 'hero-video',
    name: 'Hero video',
    description: 'Hero loop',
    kind: 'video',
    url: '/hero.mp4',
    alt: '',
    focalPoint: null,
    replaceTargetAssetId: null,
    tags: [],
    usage: [],
  },
]

describe('media-picker', () => {
  it('keeps compatible assets first and marks incompatible items as disabled', () => {
    const options = createCmsMediaPickerOptions(
      mediaAssets,
      ['image'],
      kind => kind.toUpperCase(),
      { incompatibleLabel: 'Not allowed' }
    )

    expect(options.map(option => option.value)).toEqual([
      'brand-logo',
      'favicon',
      'hero-video',
    ])
    expect(options[0]?.disable).toBe(false)
    expect(options[1]?.disable).toBe(true)
    expect(options[1]?.incompatible).toBe(true)
    expect(options[1]?.description).toContain('Not allowed')
  })

  it('resolves selected picker options preserving the selected value order', () => {
    const options = createCmsMediaPickerOptions(mediaAssets, [], kind => kind)

    const multiple = resolveCmsMediaPickerSelectedOptions(options, ['hero-video', 'brand-logo'])
    expect(multiple.map(option => option.value)).toEqual(['hero-video', 'brand-logo'])

    const single = resolveCmsMediaPickerSelectedOptions(options, 'favicon')
    expect(single.map(option => option.value)).toEqual(['favicon'])
  })
})