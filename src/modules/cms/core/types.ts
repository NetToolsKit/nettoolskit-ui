/**
 * CMS Core Types
 *
 * Foundation contracts for schema-driven page composition.
 */

export const CMS_SCHEMA_VERSION = '1.0' as const

export type CmsSchemaVersion = typeof CMS_SCHEMA_VERSION

export type CmsPublishStatus = 'draft' | 'published' | 'archived'

export type CmsSectionLayout = 'single' | 'two-column' | 'three-column' | 'grid'

export type CmsRecord = Record<string, unknown>

export interface CmsBlockLocalizationNode {
  props?: Record<string, CmsRecord | undefined>
}

export interface CmsThemeRef {
  tenantId: string
  themeName: string
  brandName?: string
}

export interface CmsAuditMetadata {
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface CmsBlockNode<TProps extends CmsRecord = CmsRecord> {
  id: string
  type: string
  props: TProps
  settings?: CmsRecord
  localization?: CmsBlockLocalizationNode
  children?: CmsBlockNode[]
}

export interface CmsSectionNode {
  id: string
  layout?: CmsSectionLayout
  settings?: CmsRecord
  blocks: CmsBlockNode[]
}

export interface CmsPageSchema {
  version: string
  id: string
  slug: string
  title: string
  status: CmsPublishStatus
  themeRef?: CmsThemeRef
  sections: CmsSectionNode[]
  metadata?: CmsAuditMetadata
}