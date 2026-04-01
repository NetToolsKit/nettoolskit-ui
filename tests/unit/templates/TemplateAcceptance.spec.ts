import { describe, expect, it } from 'vitest'

import {
  getMissingTemplateAcceptanceCriteria,
  isTemplateAcceptanceComplete,
  type TemplateAcceptanceChecklist,
} from '../../../src/templates/contracts'

describe('template acceptance criteria', () => {
  it('returns complete when all criteria are satisfied', () => {
    const checklist: TemplateAcceptanceChecklist = {
      hasLayoutTemplate: true,
      hasPageTemplate: true,
      hasStateTemplate: true,
      hasTokenizedStyling: true,
      hasAccessibilityContract: true,
      hasTemplateTests: true,
      hasRouteOrMenuScaffold: true,
      hasReadmeDocumentation: true,
    }

    expect(getMissingTemplateAcceptanceCriteria(checklist)).toEqual([])
    expect(isTemplateAcceptanceComplete(checklist)).toBe(true)
  })

  it('returns missing criteria when checklist is incomplete', () => {
    const checklist: TemplateAcceptanceChecklist = {
      hasLayoutTemplate: true,
      hasPageTemplate: false,
      hasStateTemplate: false,
      hasTokenizedStyling: true,
      hasAccessibilityContract: false,
      hasTemplateTests: true,
      hasRouteOrMenuScaffold: false,
      hasReadmeDocumentation: false,
    }

    expect(getMissingTemplateAcceptanceCriteria(checklist)).toEqual([
      'hasPageTemplate',
      'hasStateTemplate',
      'hasAccessibilityContract',
      'hasRouteOrMenuScaffold',
      'hasReadmeDocumentation',
    ])
    expect(isTemplateAcceptanceComplete(checklist)).toBe(false)
  })
})