/**
 * Pure resource schema model (L2-core).
 *
 * `defineResource` describes a CRUD-style entity once (title, table columns, a
 * form schema, and optional data handlers). `DsCrudPage` (L1) consumes the
 * normalized output to render list + filter + create/edit/delete with no custom
 * code per screen. This module stays pure: handlers are plain function types, so
 * nothing here touches Vue/DOM/HTTP.
 */

import {
  defineForm,
  humanizeFieldName,
  type NtkFieldSchema,
  type NtkFormColumnCount,
  type NtkNormalizedFormSchema,
} from './form'

export type NtkColumnAlign = 'left' | 'center' | 'right'

export interface NtkColumnSchema<Row = Record<string, unknown>> {
  readonly field: string
  readonly label?: string
  readonly align?: NtkColumnAlign
  readonly sortable?: boolean
  readonly format?: (value: unknown, row: Row) => string
}

export interface NtkNormalizedColumn<Row = Record<string, unknown>> extends NtkColumnSchema<Row> {
  readonly label: string
  readonly align: NtkColumnAlign
}

export interface NtkQueryParams {
  readonly search?: string
  readonly page?: number
  readonly pageSize?: number
  readonly sortBy?: string
  readonly descending?: boolean
}

export type NtkResourceFetch<Row> = (params: NtkQueryParams) => readonly Row[] | Promise<readonly Row[]>
export type NtkResourceMutate<Row> = (row: Row) => unknown | Promise<unknown>

export interface NtkResourceSchema<Row = Record<string, unknown>> {
  readonly title: string
  readonly description?: string
  /** Property used as the stable row identity. Default `'id'`. */
  readonly rowKey?: string
  readonly columns: readonly NtkColumnSchema<Row>[]
  readonly form?: readonly NtkFieldSchema[]
  readonly formColumns?: NtkFormColumnCount
  readonly fetch?: NtkResourceFetch<Row>
  readonly create?: NtkResourceMutate<Row>
  readonly update?: NtkResourceMutate<Row>
  readonly remove?: NtkResourceMutate<Row>
}

export interface NtkNormalizedResource<Row = Record<string, unknown>> {
  readonly title: string
  readonly description?: string
  readonly rowKey: string
  readonly columns: readonly NtkNormalizedColumn<Row>[]
  readonly form: NtkNormalizedFormSchema
  readonly fetch?: NtkResourceFetch<Row>
  readonly create?: NtkResourceMutate<Row>
  readonly update?: NtkResourceMutate<Row>
  readonly remove?: NtkResourceMutate<Row>
}

const normalizeColumn = <Row>(column: NtkColumnSchema<Row>): NtkNormalizedColumn<Row> => {
  if (!column.field) {
    throw new Error('NtkColumnSchema.field is required')
  }
  return {
    ...column,
    label: column.label ?? humanizeFieldName(column.field),
    align: column.align ?? 'left',
  }
}

/**
 * Validate and normalize a resource schema. Reuses `defineForm` so the embedded
 * form is validated with the same guarantees.
 */
export const defineResource = <Row = Record<string, unknown>>(
  schema: NtkResourceSchema<Row>,
): NtkNormalizedResource<Row> => {
  if (!schema.title) {
    throw new Error('NtkResourceSchema.title is required')
  }
  if (!schema.columns || schema.columns.length === 0) {
    throw new Error('NtkResourceSchema.columns must not be empty')
  }

  return {
    title: schema.title,
    description: schema.description,
    rowKey: schema.rowKey ?? 'id',
    columns: schema.columns.map(normalizeColumn),
    form: defineForm({ fields: schema.form ?? [], columns: schema.formColumns }),
    fetch: schema.fetch,
    create: schema.create,
    update: schema.update,
    remove: schema.remove,
  }
}