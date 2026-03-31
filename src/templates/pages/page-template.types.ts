/**
 * Page template contracts for dashboard/profile/placeholder/not-found and generic dashboard/CRUD surfaces.
 */

import type { RouteLocationRaw } from 'vue-router'

export interface TemplateDashboardChip {
  id: string
  text: string
  icon?: string
}

export interface TemplateDashboardMetric {
  id: string
  label: string
  value: string | number
  icon?: string
  tone?: 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger'
}

export type TemplateDashboardIconTone =
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'green'
  | 'amber'
  | 'slate'
  | 'red'
  | 'teal'
  | 'pink'

export interface TemplateDashboardActivityItem {
  id: string
  label: string
  value: string | number
  icon?: string
  /** When set, renders a colored background behind the icon */
  iconTone?: TemplateDashboardIconTone
}

export interface TemplateDashboardTopItem {
  id: string
  name: string
  value: string | number
  secondaryValue?: string | number
  /** When set, renders an avatar circle with initials before the name */
  avatar?: string
  /** 0–100 — when set, renders a progress bar under the name */
  barPercent?: number
}

export type TemplatePageTone =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export interface TemplateDashboardWorkspaceFilterOption {
  id: string
  label: string
  count?: number
}

export interface TemplateDashboardWorkspaceViewOption {
  id: string
  label: string
  icon?: string
}

export interface TemplateDashboardWorkspaceMetric {
  id: string
  label: string
  value: string | number
  delta?: string
  icon?: string
  tone?: TemplatePageTone
}

export interface TemplateDashboardWorkspacePanelCard {
  id: string
  title: string
  value: string | number
  description?: string
  icon?: string
  tone?: TemplatePageTone
}

export interface TemplateDashboardWorkspaceTask {
  id: string
  title: string
  subtitle?: string
  badge?: string
  assignee?: string
  filterKeys?: string[]
}

export interface TemplateDashboardWorkspaceLane {
  id: string
  title: string
  count?: number
  items: TemplateDashboardWorkspaceTask[]
}

export type TemplateCrudViewMode = 'table' | 'cards'

export interface TemplateCrudListColumn {
  id: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
  emphasize?: boolean
}

export interface TemplateCrudRecordStatus {
  value: string
  label: string
  tone?: TemplatePageTone
}

export interface TemplateCrudListRecord {
  id: string
  title: string
  subtitle?: string
  values: Record<string, string | number | boolean | null | undefined>
  status?: TemplateCrudRecordStatus
  tags?: string[]
  filterKeys?: string[]
}

export interface TemplateCrudFilterOption {
  id: string
  label: string
  count?: number
}

export interface TemplateCrudMetricChip {
  id: string
  label: string
  value: string | number
  icon?: string
  tone?: TemplatePageTone
}

export interface TemplateCrudRowAction {
  id: string
  icon: string
  label?: string
  ariaLabel?: string
  color?: string
  disable?: boolean
}

export interface TemplateProfileField {
  id: string
  label: string
  value: string
}

export interface TemplateProfileGroup {
  id: string
  title: string
  fields: TemplateProfileField[]
}

export interface TemplateUserProfile {
  name: string
  email?: string
  role?: string
  avatar?: string
  initials?: string
}

export interface TemplatePageAction {
  id: string
  label: string
  icon?: string
  to?: RouteLocationRaw
  color?: string
  disable?: boolean
  flat?: boolean
  outline?: boolean
  unelevated?: boolean
  ariaLabel?: string
}

export interface TemplatePageHint {
  id: string
  text: string
  icon?: string
}

export interface TemplateEditorToolbarAction {
  id: string
  label?: string
  icon?: string
  disable?: boolean
  ariaLabel?: string
}

export interface TemplateEditorWidgetItem {
  id: string
  label: string
  icon?: string
  description?: string
  disabled?: boolean
  filterKeys?: string[]
}

export interface TemplateEditorWidgetSection {
  id: string
  title: string
  items: TemplateEditorWidgetItem[]
}

export interface TemplateEditorCanvasObject {
  id: string
  label: string
  subtitle?: string
  tone?: TemplatePageTone
  x?: number
  y?: number
  width?: number
  height?: number
  locked?: boolean
}

export interface TemplateEditorRailAction {
  id: string
  icon: string
  label?: string
  ariaLabel?: string
  disable?: boolean
}

export interface TemplateEditorStatusSegment {
  id: string
  label: string
  value?: string | number
  tone?: TemplatePageTone
}