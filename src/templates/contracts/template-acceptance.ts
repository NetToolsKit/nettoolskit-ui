/**
 * Mandatory acceptance criteria for template-first visual delivery.
 */

export interface TemplateAcceptanceChecklist {
  hasLayoutTemplate: boolean
  hasPageTemplate: boolean
  hasStateTemplate: boolean
  hasTokenizedStyling: boolean
  hasAccessibilityContract: boolean
  hasTemplateTests: boolean
  hasRouteOrMenuScaffold: boolean
  hasReadmeDocumentation: boolean
}

export const REQUIRED_TEMPLATE_ACCEPTANCE_CRITERIA = [
  'hasLayoutTemplate',
  'hasPageTemplate',
  'hasStateTemplate',
  'hasTokenizedStyling',
  'hasAccessibilityContract',
  'hasTemplateTests',
  'hasRouteOrMenuScaffold',
  'hasReadmeDocumentation',
] as const

export type RequiredTemplateAcceptanceCriterion =
  (typeof REQUIRED_TEMPLATE_ACCEPTANCE_CRITERIA)[number]

export function getMissingTemplateAcceptanceCriteria(
  checklist: TemplateAcceptanceChecklist
): RequiredTemplateAcceptanceCriterion[] {
  return REQUIRED_TEMPLATE_ACCEPTANCE_CRITERIA.filter(
    criterion => !checklist[criterion]
  )
}

export function isTemplateAcceptanceComplete(checklist: TemplateAcceptanceChecklist): boolean {
  return getMissingTemplateAcceptanceCriteria(checklist).length === 0
}