import type { Component } from 'vue'
import type { CmsBlockNode, CmsRecord } from './types'

export type CmsBlockCategory =
  | 'layout'
  | 'content'
  | 'form'
  | 'conversion'
  | 'media'
  | 'data'
  | 'custom'

export interface CmsBlockDefinition<TProps extends CmsRecord = CmsRecord> {
  type: string
  displayName: string
  category: CmsBlockCategory
  description?: string
  component?: Component
  defaults?: Partial<TProps>
  acceptsChildren?: boolean
  validateProps?: (props: CmsRecord) => props is TProps
}

export interface CmsBlockFactoryInput<TProps extends CmsRecord = CmsRecord> {
  id: string
  props?: Partial<TProps>
  children?: CmsBlockNode[]
}