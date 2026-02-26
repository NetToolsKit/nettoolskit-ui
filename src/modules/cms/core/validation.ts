import { CMS_SCHEMA_VERSION, type CmsPageSchema } from './types'
import type { CmsBlockRegistry } from './registry'

export interface CmsSchemaValidationIssue {
  path: string
  message: string
}

export interface CmsSchemaValidationResult {
  valid: boolean
  issues: CmsSchemaValidationIssue[]
}

export interface CmsSchemaValidationOptions {
  supportedVersions?: string[]
  registry?: CmsBlockRegistry
}

const VALID_STATUS = new Set(['draft', 'published', 'archived'])

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function pushIssue(
  issues: CmsSchemaValidationIssue[],
  path: string,
  message: string
): void {
  issues.push({ path, message })
}

function validateBlockNode(
  value: unknown,
  path: string,
  issues: CmsSchemaValidationIssue[],
  registry?: CmsBlockRegistry
): void {
  if (!isObject(value)) {
    pushIssue(issues, path, 'Block must be an object.')
    return
  }

  if (!isNonEmptyString(value.id)) {
    pushIssue(issues, `${path}.id`, 'Block id is required.')
  }

  if (!isNonEmptyString(value.type)) {
    pushIssue(issues, `${path}.type`, 'Block type is required.')
  } else if (registry && !registry.has(value.type)) {
    pushIssue(issues, `${path}.type`, `Block type "${value.type}" is not registered.`)
  }

  if (!isObject(value.props)) {
    pushIssue(issues, `${path}.props`, 'Block props must be an object.')
  }

  if (value.children !== undefined) {
    if (!Array.isArray(value.children)) {
      pushIssue(issues, `${path}.children`, 'Block children must be an array when provided.')
      return
    }

    value.children.forEach((child, index) => {
      validateBlockNode(child, `${path}.children[${index}]`, issues, registry)
    })
  }
}

function validateSectionNode(
  value: unknown,
  path: string,
  issues: CmsSchemaValidationIssue[],
  registry?: CmsBlockRegistry
): void {
  if (!isObject(value)) {
    pushIssue(issues, path, 'Section must be an object.')
    return
  }

  if (!isNonEmptyString(value.id)) {
    pushIssue(issues, `${path}.id`, 'Section id is required.')
  }

  if (!Array.isArray(value.blocks)) {
    pushIssue(issues, `${path}.blocks`, 'Section blocks must be an array.')
    return
  }

  value.blocks.forEach((block, index) => {
    validateBlockNode(block, `${path}.blocks[${index}]`, issues, registry)
  })
}

export function validateCmsPageSchema(
  value: unknown,
  options: CmsSchemaValidationOptions = {}
): CmsSchemaValidationResult {
  const issues: CmsSchemaValidationIssue[] = []
  const supportedVersions = options.supportedVersions ?? [CMS_SCHEMA_VERSION]

  if (!isObject(value)) {
    return {
      valid: false,
      issues: [{ path: 'root', message: 'Page schema must be an object.' }],
    }
  }

  if (!isNonEmptyString(value.version)) {
    pushIssue(issues, 'version', 'Schema version is required.')
  } else if (!supportedVersions.includes(value.version)) {
    pushIssue(issues, 'version', `Unsupported schema version "${value.version}".`)
  }

  if (!isNonEmptyString(value.id)) {
    pushIssue(issues, 'id', 'Page id is required.')
  }

  if (!isNonEmptyString(value.slug)) {
    pushIssue(issues, 'slug', 'Page slug is required.')
  }

  if (!isNonEmptyString(value.title)) {
    pushIssue(issues, 'title', 'Page title is required.')
  }

  if (!isNonEmptyString(value.status) || !VALID_STATUS.has(value.status)) {
    pushIssue(issues, 'status', 'Page status must be draft, published, or archived.')
  }

  if (!Array.isArray(value.sections) || value.sections.length === 0) {
    pushIssue(issues, 'sections', 'Page sections must be a non-empty array.')
  } else {
    value.sections.forEach((section, index) => {
      validateSectionNode(section, `sections[${index}]`, issues, options.registry)
    })
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}

export function isCmsPageSchema(
  value: unknown,
  options: CmsSchemaValidationOptions = {}
): value is CmsPageSchema {
  return validateCmsPageSchema(value, options).valid
}