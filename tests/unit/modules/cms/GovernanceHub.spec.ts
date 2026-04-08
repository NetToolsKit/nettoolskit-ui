/**
 * Tests/unit/modules/cms/Governance Hub spec module.
 */

import { describe, expect, it } from 'vitest'
import { createCmsGovernanceHubSummary } from '../../../../src/modules/cms/white-label/governance-hub'
import { applyWhiteLabelWorkflowAction, createDefaultWhiteLabelGovernance } from '../../../../src/modules/cms/white-label/workflow'

describe('cms.governance-hub', () => {
  it('aggregates workflow, revision, audit and role-policy summaries for Releases', () => {
    let governance = createDefaultWhiteLabelGovernance('2026-03-13T10:00:00.000Z')

    governance = applyWhiteLabelWorkflowAction(governance, 'save_draft', {
      id: 'editor-1',
      role: 'editor',
    }, {
      at: '2026-03-13T10:01:00.000Z',
      summary: 'Draft updated',
      metadata: { source: 'toolbar' },
    })

    governance = applyWhiteLabelWorkflowAction(governance, 'submit_review', {
      id: 'editor-1',
      role: 'editor',
    }, {
      at: '2026-03-13T10:02:00.000Z',
      summary: 'Sent to review',
    })

    const summary = createCmsGovernanceHubSummary(governance)

    expect(summary.status).toBe('warning')
    expect(summary.workflow.workflowStatus).toBe('in_review')
    expect(summary.workflow.version).toBe(2)
    expect(summary.revisions.count).toBe(3)
    expect(summary.audit.count).toBe(2)
    expect(summary.audit.recent[0]?.action).toBe('submit_review')
    expect(summary.audit.topActions[0]?.count).toBeGreaterThanOrEqual(1)
    expect(summary.roles.publishCapableCount).toBeGreaterThan(0)
    expect(summary.cards.map(card => card.id)).toEqual(['workflow', 'revisions', 'audit', 'roles'])
  })

  it('marks governance ready once workflow reaches an approved publish-ready state', () => {
    let governance = createDefaultWhiteLabelGovernance('2026-03-13T11:00:00.000Z')

    governance = applyWhiteLabelWorkflowAction(governance, 'submit_review', {
      id: 'editor-1',
      role: 'editor',
    }, {
      at: '2026-03-13T11:01:00.000Z',
      summary: 'Sent to review',
    })

    governance = applyWhiteLabelWorkflowAction(governance, 'approve', {
      id: 'reviewer-1',
      role: 'reviewer',
    }, {
      at: '2026-03-13T11:02:00.000Z',
      summary: 'Approved',
    })

    const summary = createCmsGovernanceHubSummary(governance)

    expect(summary.status).toBe('ready')
    expect(summary.workflow.status).toBe('ready')
    expect(summary.workflow.workflowStatus).toBe('approved')
    expect(summary.cards.find(card => card.id === 'workflow')?.status).toBe('ready')
  })
})