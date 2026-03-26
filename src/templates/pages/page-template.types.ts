/**
 * Page template contracts for dashboard/profile/placeholder/not-found surfaces.
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

export interface TemplateDashboardActivityItem {
  id: string
  label: string
  value: string | number
  icon?: string
}

export interface TemplateDashboardTopItem {
  id: string
  name: string
  value: string | number
  secondaryValue?: string | number
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