import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import { validateCmsContentQa } from '../../../../src/modules/cms/white-label/content-qa'
import { createCmsReleaseSnapshot } from '../../../../src/modules/cms/releases'

describe('white-label.content-qa', () => {
  it('emits editorial and accessibility warnings for weak page summaries and image alt text', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.pages[0].description = ''
    settings.pages[0].title = 'Go'
    settings.pages[0].sections.forEach(section => { section.enabled = false })
    const firstImage = settings.mediaAssets.find(asset => asset.kind === 'image')
    if (firstImage) {
      firstImage.alt = ''
    }

    const report = validateCmsContentQa(createCmsReleaseSnapshot(settings))

    expect(report.valid).toBe(true)
    expect(report.warningCount).toBeGreaterThanOrEqual(3)
    expect(report.accessibilityIssueCount).toBeGreaterThanOrEqual(1)
    expect(report.qualityIssueCount).toBeGreaterThanOrEqual(2)
    expect(report.issues.map(issue => issue.code)).toEqual(expect.arrayContaining([
      'quality.page.title.too_short',
      'quality.page.description.missing',
      'quality.page.sections.empty',
      'a11y.media.alt.missing',
    ]))
  })
})