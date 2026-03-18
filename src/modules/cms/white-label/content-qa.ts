import type { CmsMediaAssetSettings, CmsPageSettings, CmsReleaseValidationIssue, CmsReleaseValidationReport, CmsReleaseValidationSeverity, CmsReleaseSnapshot } from './types'

export interface CmsContentQaReport extends CmsReleaseValidationReport {
  accessibilityIssueCount: number
  qualityIssueCount: number
}

function toIsoTimestamp(value?: string): string {
  const parsed = new Date(String(value ?? '').trim())
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }
  return new Date().toISOString()
}

function createIssue(
  code: string,
  severity: CmsReleaseValidationSeverity,
  message: string,
  path?: string
): CmsReleaseValidationIssue {
  return {
    code,
    severity,
    message,
    path,
  }
}

function countEnabledSections(page: CmsPageSettings): number {
  return page.sections.filter(section => section.enabled !== false).length
}

function collectPageQualityIssues(page: CmsPageSettings): CmsReleaseValidationIssue[] {
  const issues: CmsReleaseValidationIssue[] = []
  const title = String(page.title ?? '').trim()
  const description = String(page.description ?? '').trim()

  if (title.length > 0 && title.length < 5) {
    issues.push(createIssue(
      'quality.page.title.too_short',
      'warning',
      `Page "${page.id}" title is too short for review and navigation contexts.`,
      `pages.${page.id}.title`
    ))
  }

  if (description.length === 0) {
    issues.push(createIssue(
      'quality.page.description.missing',
      'warning',
      `Page "${page.title || page.id}" is missing a description.`,
      `pages.${page.id}.description`
    ))
  }

  if (description.length > 0 && description.length < 20) {
    issues.push(createIssue(
      'quality.page.description.too_short',
      'warning',
      `Page "${page.title || page.id}" description is too short for editorial review.`,
      `pages.${page.id}.description`
    ))
  }

  if (countEnabledSections(page) === 0) {
    issues.push(createIssue(
      'quality.page.sections.empty',
      'warning',
      `Page "${page.title || page.id}" has no enabled sections.`,
      `pages.${page.id}.sections`
    ))
  }

  return issues
}

function collectAccessibilityIssues(asset: CmsMediaAssetSettings): CmsReleaseValidationIssue[] {
  if (asset.kind !== 'image') {
    return []
  }

  const alt = String(asset.alt ?? '').trim()
  if (alt.length === 0) {
    return [
      createIssue(
        'a11y.media.alt.missing',
        'warning',
        `Image asset "${asset.name || asset.id}" is missing alternative text.`,
        `mediaAssets.${asset.id}.alt`
      ),
    ]
  }

  if (alt.length < 3) {
    return [
      createIssue(
        'a11y.media.alt.too_short',
        'warning',
        `Image asset "${asset.name || asset.id}" has alternative text that is too short.`,
        `mediaAssets.${asset.id}.alt`
      ),
    ]
  }

  return []
}

/**
 * Builds accessibility and editorial quality diagnostics for one release snapshot.
 */
export function validateCmsContentQa(snapshot: CmsReleaseSnapshot, at?: string): CmsContentQaReport {
  const generatedAt = toIsoTimestamp(at)
  const issues: CmsReleaseValidationIssue[] = [
    ...snapshot.pages.flatMap(collectPageQualityIssues),
    ...snapshot.mediaAssets.flatMap(collectAccessibilityIssues),
  ]

  const accessibilityIssueCount = issues.filter(issue => issue.code.startsWith('a11y.')).length
  const qualityIssueCount = issues.filter(issue => issue.code.startsWith('quality.')).length

  return {
    valid: issues.every(issue => issue.severity !== 'error'),
    generatedAt,
    errorCount: issues.filter(issue => issue.severity === 'error').length,
    warningCount: issues.filter(issue => issue.severity === 'warning').length,
    issues,
    accessibilityIssueCount,
    qualityIssueCount,
  }
}