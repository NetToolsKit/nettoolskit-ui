/**
 * Generic enterprise template contracts for reusable operational surfaces.
 */

export type TemplateEnterpriseTone =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export interface TemplateEnterpriseAction {
  id: string
  label: string
  icon?: string
  color?: string
  disable?: boolean
  flat?: boolean
  outline?: boolean
  unelevated?: boolean
  ariaLabel?: string
}

export interface TemplateEnterpriseKpi {
  id: string
  label: string
  value: string | number
  delta?: string
  icon?: string
  tone?: TemplateEnterpriseTone
}

export interface TemplateEnterpriseAlert {
  id: string
  title: string
  summary?: string
  service?: string
  timeLabel?: string
  statusLabel?: string
  severity?: TemplateEnterpriseTone
  filterKeys?: string[]
}

export interface TemplateEnterpriseActivity {
  id: string
  title: string
  description?: string
  owner?: string
  timeLabel?: string
  stateLabel?: string
  tone?: TemplateEnterpriseTone
  filterKeys?: string[]
}

export interface TemplateEnterpriseServiceHealth {
  id: string
  name: string
  uptime: string
  sla: string
  owner?: string
  tone?: TemplateEnterpriseTone
  filterKeys?: string[]
}

export interface TemplateEnterpriseFilterOption {
  id: string
  label: string
  count?: number
}

export type TemplateApprovalDecision = 'approve' | 'reject' | 'request_changes'

export interface TemplateApprovalQueueItem {
  id: string
  title: string
  summary?: string
  requester?: string
  submittedAt?: string
  amount?: string
  statusLabel?: string
  tone?: TemplateEnterpriseTone
  tags?: string[]
  filterKeys?: string[]
}

export interface TemplateAuditTimelineEvent {
  id: string
  title: string
  description?: string
  actor?: string
  target?: string
  eventType?: string
  timestamp: string
  tone?: TemplateEnterpriseTone
  filterKeys?: string[]
}