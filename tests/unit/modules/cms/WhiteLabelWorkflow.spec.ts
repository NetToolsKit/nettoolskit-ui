/**
 * Tests/unit/modules/cms/White Label Workflow spec module.
 */

import { describe, expect, it } from 'vitest'
import {
  applyWhiteLabelWorkflowAction,
  canApplyWhiteLabelWorkflowAction,
  createDefaultWhiteLabelGovernance,
  getAllowedWhiteLabelWorkflowActions,
  normalizeWhiteLabelGovernance,
} from '../../../../landing-page/cms/white-label.workflow'

describe('white-label.workflow', () => {
  it('creates default governance envelope with draft status and seed revision', () => {
    const governance = createDefaultWhiteLabelGovernance('2026-02-27T10:00:00.000Z')

    expect(governance.workflow.status).toBe('draft')
    expect(governance.workflow.version).toBe(1)
    expect(governance.workflow.publishedVersion).toBeNull()
    expect(governance.revisions).toHaveLength(1)
    expect(governance.revisions[0]).toMatchObject({
      version: 1,
      status: 'draft',
      action: 'save_draft',
      by: 'system',
      byRole: 'system',
    })
  })

  it('enforces RBAC and status-based action constraints', () => {
    const governance = createDefaultWhiteLabelGovernance()

    expect(canApplyWhiteLabelWorkflowAction(governance, 'submit_review', 'editor')).toBe(true)
    expect(canApplyWhiteLabelWorkflowAction(governance, 'publish', 'editor')).toBe(false)
    expect(getAllowedWhiteLabelWorkflowActions(governance.workflow.status, 'reviewer')).toEqual([])
  })

  it('allows reset/import across review states for admin workflows', () => {
    const actorEditor = { id: 'editor-1', role: 'editor' } as const
    const actorReviewer = { id: 'reviewer-1', role: 'reviewer' } as const
    const actorAdmin = { id: 'admin-1', role: 'admin' } as const

    let governance = createDefaultWhiteLabelGovernance()
    governance = applyWhiteLabelWorkflowAction(governance, 'submit_review', actorEditor)
    expect(canApplyWhiteLabelWorkflowAction(governance, 'reset_defaults', actorAdmin.role)).toBe(true)
    expect(canApplyWhiteLabelWorkflowAction(governance, 'import_settings', actorAdmin.role)).toBe(true)

    governance = applyWhiteLabelWorkflowAction(governance, 'approve', actorReviewer)
    expect(canApplyWhiteLabelWorkflowAction(governance, 'reset_defaults', actorAdmin.role)).toBe(true)
    expect(canApplyWhiteLabelWorkflowAction(governance, 'import_settings', actorAdmin.role)).toBe(true)
  })

  it('applies lifecycle transitions with versioning and audit trail', () => {
    const actorEditor = { id: 'editor-1', role: 'editor' } as const
    const actorReviewer = { id: 'reviewer-1', role: 'reviewer' } as const
    const actorAdmin = { id: 'admin-1', role: 'admin' } as const
    const actorOwner = { id: 'owner-1', role: 'owner' } as const

    let governance = createDefaultWhiteLabelGovernance('2026-02-27T10:00:00.000Z')

    governance = applyWhiteLabelWorkflowAction(governance, 'save_draft', actorEditor, {
      at: '2026-02-27T10:01:00.000Z',
      summary: 'Draft updated',
    })
    expect(governance.workflow.version).toBe(2)
    expect(governance.workflow.status).toBe('draft')

    governance = applyWhiteLabelWorkflowAction(governance, 'submit_review', actorEditor, {
      at: '2026-02-27T10:02:00.000Z',
    })
    expect(governance.workflow.version).toBe(2)
    expect(governance.workflow.status).toBe('in_review')

    governance = applyWhiteLabelWorkflowAction(governance, 'approve', actorReviewer, {
      at: '2026-02-27T10:03:00.000Z',
    })
    expect(governance.workflow.status).toBe('approved')

    governance = applyWhiteLabelWorkflowAction(governance, 'publish', actorAdmin, {
      at: '2026-02-27T10:04:00.000Z',
    })
    expect(governance.workflow.status).toBe('published')
    expect(governance.workflow.publishedVersion).toBe(2)

    governance = applyWhiteLabelWorkflowAction(governance, 'rollback', actorOwner, {
      at: '2026-02-27T10:05:00.000Z',
    })
    expect(governance.workflow.status).toBe('draft')
    expect(governance.workflow.version).toBe(3)
    expect(governance.revisions).toHaveLength(6)
    expect(governance.auditTrail).toHaveLength(5)
    expect(governance.auditTrail.at(-1)).toMatchObject({
      action: 'rollback',
      fromStatus: 'published',
      toStatus: 'draft',
      fromVersion: 2,
      toVersion: 3,
    })
  })

  it('throws when action is invalid for the current role/status', () => {
    const governance = createDefaultWhiteLabelGovernance()
    expect(() => {
      applyWhiteLabelWorkflowAction(governance, 'publish', {
        id: 'editor-1',
        role: 'editor',
      })
    }).toThrowError(/not allowed/i)
  })

  it('normalizes malformed governance payloads to safe defaults', () => {
    const normalized = normalizeWhiteLabelGovernance({
      workflow: {
        status: 'invalid-status',
        version: -20,
        publishedVersion: 999,
        lastActionAt: '',
        lastActionBy: '',
        lastActionRole: 'invalid-role',
      } as never,
      revisions: [
        {
          version: 2,
          status: 'published',
          action: 'publish',
          at: '2026-02-27T11:00:00.000Z',
          by: 'admin-1',
          byRole: 'admin',
          summary: 'Published',
        },
        {
          version: 9,
          status: 'draft',
          action: 'save_draft',
          at: '2026-02-27T11:01:00.000Z',
          by: 'admin-1',
          byRole: 'admin',
          summary: 'Out of range',
        },
      ],
      auditTrail: [
        {
          id: '',
          action: 'invalid-action',
          actorId: '',
          actorRole: 'invalid-role',
          at: '',
          fromStatus: 'invalid-status',
          toStatus: 'invalid-status',
          fromVersion: -1,
          toVersion: -1,
          summary: '',
        } as never,
      ],
      maxAuditEntries: 2,
    }, '2026-02-27T10:30:00.000Z')

    expect(normalized.workflow.status).toBe('draft')
    expect(normalized.workflow.version).toBe(1)
    expect(normalized.workflow.publishedVersion).toBeNull()
    expect(normalized.revisions).toHaveLength(1)
    expect(normalized.auditTrail).toHaveLength(1)
    expect(normalized.maxAuditEntries).toBeGreaterThanOrEqual(20)
    expect(normalized.maxAuditEntries).toBeLessThanOrEqual(1000)
  })
})