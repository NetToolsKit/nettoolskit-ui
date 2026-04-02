import type {
  TemplateDashboardMetric,
  TemplateEditorCanvasObject,
  TemplateEditorRailAction,
  TemplateEditorStatusSegment,
  TemplateEditorToolbarAction,
  TemplateEditorWidgetSection,
  TemplatePageTone,
} from '../../pages'

export type ReferenceReportStatus = 'draft' | 'review' | 'published'

export interface ReferenceReportItem {
  id: string
  fileName: string
  title: string
  description: string
  category: string
  owner: string
  updatedAt: string
  status: ReferenceReportStatus
  tags?: string[]
  favorite?: boolean
}

export interface ReferenceReportGroup {
  id: string
  title: string
  items: ReferenceReportItem[]
}

export interface ReferenceReportSelectionSummary {
  sectionLabel?: string
  fallbackEmptyTitle?: string
  fallbackEmptyDescription?: string
}

export interface ReferenceSurfaceAction {
  id: string
  label: string
  description?: string
  icon?: string
  tone?: TemplatePageTone
}

export interface ReferenceDocumentTab {
  id: string
  label: string
  caption?: string
}

export interface ReferenceNotificationItem {
  id: string
  icon: string
  title: string
  description: string
  time: string
  read: boolean
}

export interface ReferenceDesignerSampleConfig {
  topbarActions: TemplateEditorToolbarAction[]
  quickActions: TemplateEditorToolbarAction[]
  widgetSections: TemplateEditorWidgetSection[]
  canvasColumns: string[]
  canvasObjects: TemplateEditorCanvasObject[]
  railActions: TemplateEditorRailAction[]
  leftStatusSegments: TemplateEditorStatusSegment[]
  rightStatusSegments: TemplateEditorStatusSegment[]
  zoomOptions: number[]
}

export interface ReferenceManagerSampleConfig {
  stats: TemplateDashboardMetric[]
  quickActions: ReferenceSurfaceAction[]
}