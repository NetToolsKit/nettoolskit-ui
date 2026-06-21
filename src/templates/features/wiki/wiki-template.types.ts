/**
 * Typed contracts for knowledge-base and assistant feature templates.
 */

import type { RouteLocationRaw } from 'vue-router'

export type TemplateWikiViewMode = 'list' | 'grid'

export type TemplateWikiCategoryStatus = 'ok' | 'pending' | 'alert'

export type TemplateWikiDocumentStatus =
  | 'processed'
  | 'pending'
  | 'error'
  | 'draft'
  | 'archived'

export type TemplateWikiFileType =
  | 'pdf'
  | 'doc'
  | 'xls'
  | 'img'
  | 'txt'
  | 'md'
  | 'ppt'
  | 'other'

export interface TemplateWikiCategoryNode {
  id: string
  name: string
  count?: number
  status?: TemplateWikiCategoryStatus
  expanded?: boolean
  children?: TemplateWikiCategoryNode[]
}

export interface TemplateWikiFilterOption {
  value: string
  label: string
  statuses?: TemplateWikiDocumentStatus[]
}

export interface TemplateWikiDocument {
  id: string
  name: string
  fileType?: TemplateWikiFileType
  size?: string
  category?: string
  categoryId?: string
  subCategory?: string
  subCategoryId?: string
  tags?: string[]
  status?: TemplateWikiDocumentStatus
  uploadDate?: string
  selected?: boolean
  description?: string
}

export interface TemplateWikiStatChip {
  id: string
  label: string
  value: string | number
  icon?: string
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
}

export interface TemplateWikiSourceReference {
  documentName: string
  chunkContent: string
  relevance: number
}

export type TemplateWikiChatRole = 'user' | 'assistant' | 'system'

export interface TemplateWikiChatMessage {
  id: string
  role: TemplateWikiChatRole
  content: string
  fromCache?: boolean
  sources?: TemplateWikiSourceReference[]
  createdAt?: string
}

export interface TemplateWikiConversation {
  id: string
  title: string
  updatedAt: string
  messageCount?: number
}

export interface TemplateWikiSuggestion {
  id: string
  text: string
  title?: string
  icon?: string
}

export interface TemplateWikiAction {
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