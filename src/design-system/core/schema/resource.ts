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

/** A page of rows plus the server-reported total, for server-mode pagination. */
export interface NtkFetchResult<Row> {
  readonly rows: readonly Row[]
  readonly total?: number
}

/** A fetch may return a plain array (client mode) or a `{ rows, total }` page. */
export type NtkResourceFetchResult<Row> = readonly Row[] | NtkFetchResult<Row>

export type NtkResourceFetch<Row> = (
  params: NtkQueryParams,
) => NtkResourceFetchResult<Row> | Promise<NtkResourceFetchResult<Row>>
export type NtkResourceMutate<Row> = (row: Row) => unknown | Promise<unknown>

/** Default sort applied on first load when columns are sortable. */
export interface NtkResourceSort {
  readonly field: string
  readonly descending?: boolean
}

/**
 * Coerce either fetch result shape into a uniform `{ rows, total }`. When the
 * handler returns a bare array (client mode) the total is the array length.
 * Pure.
 */
export const normalizeFetchResult = <Row>(
  result: NtkResourceFetchResult<Row>,
): { rows: Row[]; total: number } => {
  if (Array.isArray(result)) {
    return { rows: [...result], total: result.length }
  }
  const page = result as NtkFetchResult<Row>
  const rows = [...page.rows]
  return { rows, total: page.total ?? rows.length }
}

export interface NtkResourceSchema<Row = Record<string, unknown>> {
  readonly title: string
  readonly description?: string
  /** Property used as the stable row identity. Default `'id'`. */
  readonly rowKey?: string
  readonly columns: readonly NtkColumnSchema<Row>[]
  readonly form?: readonly NtkFieldSchema[]
  readonly formColumns?: NtkFormColumnCount
  /** When set, enables server-mode pagination with this page size. */
  readonly pageSize?: number
  /** Initial sort applied on first load. */
  readonly defaultSort?: NtkResourceSort
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
  readonly pageSize?: number
  readonly defaultSort?: NtkResourceSort
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
    pageSize: schema.pageSize,
    defaultSort: schema.defaultSort,
    fetch: schema.fetch,
    create: schema.create,
    update: schema.update,
    remove: schema.remove,
  }
}