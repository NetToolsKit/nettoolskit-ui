import type { CmsReleaseValidationIssue } from './types'
import type { CmsReleaseCandidateChecklistItem } from '../releases/orchestration'

export type CmsReleaseChecklistDrilldownTarget =
  | 'branding'
  | 'content'
  | 'pages'
  | 'blocks'
  | 'releases'

export interface CmsReleaseChecklistDrilldownAction {
  id: string
  checklistItemId: CmsReleaseCandidateChecklistItem['id']
  target: CmsReleaseChecklistDrilldownTarget
  pageId?: string | null
  sectionId?: string | null
  issueCode?: string
  issuePath?: string
}

interface ParsedIssuePath {
  pageId: string | null
  sectionId: string | null
}

function parseCmsIssuePath(path?: string | null): ParsedIssuePath {
  const normalizedPath = String(path ?? '').trim()
  if (!normalizedPath) {
    return {
      pageId: null,
      sectionId: null,
    }
  }

  const pageMatch = normalizedPath.match(/^pages\.([^.[]+)/)
  const sectionDotMatch = normalizedPath.match(/\.sections\.([^.[]+)/)

  return {
    pageId: pageMatch?.[1] ?? null,
    sectionId: sectionDotMatch?.[1] ?? null,
  }
}

function resolveCmsReleaseChecklistDrilldownTarget(
  item: Pick<CmsReleaseCandidateChecklistItem, 'id'>,
  issue: CmsReleaseValidationIssue
): CmsReleaseChecklistDrilldownTarget | null {
  const issueCode = String(issue.code ?? '').trim()
  const issuePath = String(issue.path ?? '').trim()

  if (item.id === 'validation' && issueCode === 'release.validation.required') {
    return 'releases'
  }

  if (
    issueCode === 'permissions.publish.denied'
    || issueCode === 'workflow.status.not_ready'
    || issuePath.startsWith('releases.')
  ) {
    return 'releases'
  }

  if (
    issueCode === 'assets.logo.required'
    || issueCode === 'assets.favicon.required'
    || issuePath.startsWith('branding.')
  ) {
    return 'branding'
  }

  if (issuePath.startsWith('reusableSections.')) {
    return 'pages'
  }

  if (issuePath.startsWith('reusableBlocks.')) {
    return 'blocks'
  }

  if (
    issuePath.startsWith('authoredContentModels.')
    || issuePath.startsWith('authoredContentModelFieldPresets.')
    || issuePath.startsWith('authoredBlockPresets.')
  ) {
    return 'content'
  }

  if (issuePath.startsWith('pages.')) {
    return issuePath.includes('.sections.')
      ? 'blocks'
      : 'pages'
  }

  if (item.id === 'content_integrity') {
    return 'pages'
  }

  return null
}

function buildCmsReleaseChecklistDrilldownAction(
  item: Pick<CmsReleaseCandidateChecklistItem, 'id'>,
  issue: CmsReleaseValidationIssue
): CmsReleaseChecklistDrilldownAction | null {
  const target = resolveCmsReleaseChecklistDrilldownTarget(item, issue)
  if (!target) {
    return null
  }

  const { pageId, sectionId } = parseCmsIssuePath(issue.path)

  return {
    id: [
      item.id,
      target,
      issue.code ?? 'unknown',
      issue.path ?? 'root',
      pageId ?? 'page',
      sectionId ?? 'section',
    ].join(':'),
    checklistItemId: item.id,
    target,
    pageId,
    sectionId,
    issueCode: issue.code,
    issuePath: issue.path,
  }
}

/**
 * Resolves deduplicated navigation actions from one release checklist row.
 */
export function resolveCmsReleaseChecklistDrilldownActions(
  item: Pick<CmsReleaseCandidateChecklistItem, 'id' | 'issues'>
): CmsReleaseChecklistDrilldownAction[] {
  const seen = new Set<string>()
  const actions: CmsReleaseChecklistDrilldownAction[] = []

  item.issues.forEach(issue => {
    const action = buildCmsReleaseChecklistDrilldownAction(item, issue)
    if (!action || seen.has(action.id)) {
      return
    }

    seen.add(action.id)
    actions.push(action)
  })

  return actions
}