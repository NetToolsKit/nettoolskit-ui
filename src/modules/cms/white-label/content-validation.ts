/**
 * Structured content validation helpers for the CMS engine.
 * These checks stay builder-focused and backend-agnostic so Pages/Blocks/Releases
 * can share the same integrity rules.
 */
import type { CmsBlockRegistry } from '../core/registry'
import {
  getCmsBlockPresetDefinition,
  isCmsBlockPresetAllowedForType,
  resolveCmsBlockPresetId,
} from './block-presets'
import {
  coerceCmsContentModelFieldValue,
  getCmsContentModelFieldDefinitions,
  getCmsContentModelLastSchemaChangeAt,
  getCmsContentModelMigrationNotes,
  getCmsContentModelMaxSections,
  getCmsContentModelSectionPresetLimitMap,
  getCmsContentModelSchemaVersion,
  getCmsRequiredSectionPresetIds,
  getCmsSectionPresetBlockLimits,
  isCmsBlockPresetAllowedForSectionPreset,
  isCmsBlockTypeAllowedForSectionPreset,
  isCmsSectionPresetAllowedForContentModel,
  resolveCmsContentModelId,
  resolveCmsSectionPresetId,
} from './content-models'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsContentModelFieldDefinition,
  CmsPageBlockSettings,
  CmsPageSectionSettings,
  CmsPageSettings,
} from './types'

export type CmsContentValidationSeverity = 'error' | 'warning'

export interface CmsContentValidationIssue {
  id: string
  code: string
  severity: CmsContentValidationSeverity
  message: string
  path: string
  pageId?: string
  sectionId?: string
  blockId?: string
}

export interface CmsContentValidationSummary {
  pageCount: number
  publishedPagesCount: number
  enabledSectionsCount: number
  enabledBlocksCount: number
}

export interface CmsContentValidationResult {
  valid: boolean
  errorCount: number
  warningCount: number
  issues: CmsContentValidationIssue[]
  summary: CmsContentValidationSummary
}

export interface CmsContentValidationOptions {
  pages: CmsPageSettings[]
  registry?: CmsBlockRegistry
  authoredContentModels?: CmsAuthoredContentModelSettings[]
  authoredBlockPresets?: CmsAuthoredBlockPresetSettings[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function trimValue(value: unknown): string {
  return String(value ?? '').trim()
}

function buildIssueId(issue: Omit<CmsContentValidationIssue, 'id'>): string {
  return [
    issue.code,
    issue.path,
    issue.pageId ?? '',
    issue.sectionId ?? '',
    issue.blockId ?? '',
  ].join(':')
}

function pushIssue(
  issues: CmsContentValidationIssue[],
  issue: Omit<CmsContentValidationIssue, 'id'>
): void {
  issues.push({
    ...issue,
    id: buildIssueId(issue),
  })
}

function hasCmsContentModelFieldValue(
  field: CmsContentModelFieldDefinition,
  value: unknown
): boolean {
  if (field.repeatable) {
    return Array.isArray(value) && value.some(entry => hasCmsContentModelFieldValue({
      ...field,
      repeatable: false,
    }, entry))
  }

  switch (field.type) {
    case 'toggle':
      return typeof value === 'boolean'
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
    case 'select':
    case 'textarea':
    case 'text':
    default:
      return String(value ?? '').trim().length > 0
  }
}

function isCmsValidScalarContentModelFieldValue(
  field: CmsContentModelFieldDefinition,
  value: unknown
): boolean {
  switch (field.type) {
    case 'toggle':
      return typeof value === 'boolean'
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
    case 'select':
      return field.options.some(option => option.value === String(value ?? '').trim())
    case 'textarea':
    case 'text':
    default:
      return typeof value === 'string'
  }
}

function validatePageCustomFields(
  page: CmsPageSettings,
  pathBase: string,
  issues: CmsContentValidationIssue[],
  authoredContentModels: CmsAuthoredContentModelSettings[] = []
): void {
  const fieldDefinitions = getCmsContentModelFieldDefinitions(
    'en',
    page.contentModelId,
    authoredContentModels
  )

  if (fieldDefinitions.length === 0) {
    return
  }

  if (page.customFields != null && !isRecord(page.customFields)) {
    pushIssue(issues, {
      code: 'pages.custom_fields.invalid',
      severity: 'error',
      message: `Page "${page.id || page.title || 'unknown'}" must provide custom fields as an object.`,
      path: `${pathBase}.customFields`,
      pageId: page.id,
    })
    return
  }

  const customFields = isRecord(page.customFields) ? page.customFields : {}
  const knownFieldIds = new Set(fieldDefinitions.map(field => field.id))

  for (const field of fieldDefinitions) {
    const value = customFields[field.id]
    const normalizedValue = coerceCmsContentModelFieldValue(field, value)

    if (field.required && !hasCmsContentModelFieldValue(field, value)) {
      pushIssue(issues, {
        code: 'pages.custom_fields.required',
        severity: 'error',
        message: `Field "${field.label}" is required in page "${page.id || page.title || 'unknown'}".`,
        path: `${pathBase}.customFields.${field.id}`,
        pageId: page.id,
      })
      continue
    }

    if (field.repeatable) {
      if (value != null && !Array.isArray(value)) {
        pushIssue(issues, {
          code: 'pages.custom_fields.repeatable.invalid',
          severity: 'error',
          message: `Field "${field.label}" must contain an array of values.`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
        continue
      }

      const repeatableValues = Array.isArray(value) ? value : []
      if (repeatableValues.some(entry => !isCmsValidScalarContentModelFieldValue({
        ...field,
        repeatable: false,
      }, entry))) {
        pushIssue(issues, {
          code: `pages.custom_fields.${field.type}.invalid`,
          severity: 'error',
          message: `Field "${field.label}" contains one or more invalid values.`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
      }

      if (field.min != null && repeatableValues.length < field.min) {
        pushIssue(issues, {
          code: 'pages.custom_fields.min',
          severity: 'error',
          message: `Field "${field.label}" requires at least ${field.min} value(s).`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
      }

      if (field.max != null && repeatableValues.length > field.max) {
        pushIssue(issues, {
          code: 'pages.custom_fields.max',
          severity: 'error',
          message: `Field "${field.label}" allows at most ${field.max} value(s).`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
      }

      continue
    }

    if (field.type === 'number' && value != null && String(value).trim() !== '' && typeof normalizedValue !== 'number') {
      pushIssue(issues, {
        code: 'pages.custom_fields.number.invalid',
        severity: 'error',
        message: `Field "${field.label}" must contain a valid number.`,
        path: `${pathBase}.customFields.${field.id}`,
        pageId: page.id,
      })
      continue
    }

    if (field.type === 'toggle' && value != null && typeof value !== 'boolean') {
      pushIssue(issues, {
        code: 'pages.custom_fields.toggle.invalid',
        severity: 'error',
        message: `Field "${field.label}" must contain a boolean value.`,
        path: `${pathBase}.customFields.${field.id}`,
        pageId: page.id,
      })
      continue
    }

    if (
      (field.type === 'text' || field.type === 'textarea')
      && hasCmsContentModelFieldValue(field, value)
    ) {
      const textLength = String(value ?? '').length
      if (field.min != null && textLength < field.min) {
        pushIssue(issues, {
          code: 'pages.custom_fields.min',
          severity: 'error',
          message: `Field "${field.label}" requires at least ${field.min} characters.`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
      }

      if (field.max != null && textLength > field.max) {
        pushIssue(issues, {
          code: 'pages.custom_fields.max',
          severity: 'error',
          message: `Field "${field.label}" allows at most ${field.max} characters.`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
      }
    }

    if (
      field.type === 'number'
      && typeof normalizedValue === 'number'
      && Number.isFinite(normalizedValue)
    ) {
      if (field.min != null && normalizedValue < field.min) {
        pushIssue(issues, {
          code: 'pages.custom_fields.min',
          severity: 'error',
          message: `Field "${field.label}" must be greater than or equal to ${field.min}.`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
      }

      if (field.max != null && normalizedValue > field.max) {
        pushIssue(issues, {
          code: 'pages.custom_fields.max',
          severity: 'error',
          message: `Field "${field.label}" must be less than or equal to ${field.max}.`,
          path: `${pathBase}.customFields.${field.id}`,
          pageId: page.id,
        })
      }
    }

    if (
      field.type === 'select'
      && hasCmsContentModelFieldValue(field, value)
      && !field.options.some(option => option.value === String(value ?? '').trim())
    ) {
      pushIssue(issues, {
        code: 'pages.custom_fields.select.invalid',
        severity: 'error',
        message: `Field "${field.label}" must use one of the allowed options.`,
        path: `${pathBase}.customFields.${field.id}`,
        pageId: page.id,
      })
    }
  }

  for (const fieldId of Object.keys(customFields)) {
    if (knownFieldIds.has(fieldId)) {
      continue
    }

    pushIssue(issues, {
      code: 'pages.custom_fields.unknown',
      severity: 'warning',
      message: `Page "${page.id || page.title || 'unknown'}" stores an unknown custom field "${fieldId}".`,
      path: `${pathBase}.customFields.${fieldId}`,
      pageId: page.id,
    })
  }
}

function validateBlock(
  block: CmsPageBlockSettings,
  section: CmsPageSectionSettings,
  page: CmsPageSettings,
  blockIndex: number,
  issues: CmsContentValidationIssue[],
  registry?: CmsBlockRegistry,
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[] = []
): void {
  const blockId = trimValue(block?.id)
  const blockType = trimValue(block?.type)
  const rawBlockPresetId = trimValue(block?.presetId)
  const blockPresetId = resolveCmsBlockPresetId(block?.presetId)
  const pathBase = `pages.${page.id || 'unknown'}.sections.${section.id || 'unknown'}.blocks[${blockIndex}]`

  if (!blockId) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.id.required',
      severity: 'error',
      message: `Block ${blockIndex + 1} in section "${section.id || 'unknown'}" must provide an id.`,
      path: `${pathBase}.id`,
      pageId: page.id,
      sectionId: section.id,
    })
  }

  if (!blockType) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.type.required',
      severity: 'error',
      message: `Block "${blockId || `#${blockIndex + 1}`}" in section "${section.id || 'unknown'}" must define a type.`,
      path: `${pathBase}.type`,
      pageId: page.id,
      sectionId: section.id,
      blockId,
    })
  } else if (registry && !registry.has(blockType)) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.type.unregistered',
      severity: 'error',
      message: `Block type "${blockType}" is not registered in the CMS registry.`,
      path: `${pathBase}.type`,
      pageId: page.id,
      sectionId: section.id,
      blockId,
    })
  } else if (!isCmsBlockTypeAllowedForSectionPreset(section.presetId, blockType)) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.type.not_allowed_for_preset',
      severity: 'error',
      message: `Block type "${blockType}" is not allowed inside section preset "${resolveCmsSectionPresetId(section.presetId)}".`,
      path: `${pathBase}.type`,
      pageId: page.id,
      sectionId: section.id,
      blockId,
    })
  }

  if (
    rawBlockPresetId
    && rawBlockPresetId !== 'custom'
    && !getCmsBlockPresetDefinition(rawBlockPresetId, authoredBlockPresets)
  ) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.preset.invalid',
      severity: 'error',
      message: `Block "${blockId || blockType || `#${blockIndex + 1}`}" uses an invalid preset "${rawBlockPresetId}".`,
      path: `${pathBase}.presetId`,
      pageId: page.id,
      sectionId: section.id,
      blockId,
    })
  } else if (
    blockPresetId !== 'custom'
    && blockType
    && !isCmsBlockPresetAllowedForType(blockType, blockPresetId, authoredBlockPresets)
  ) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.preset.type_mismatch',
      severity: 'error',
      message: `Block preset "${blockPresetId}" is not compatible with block type "${blockType}".`,
      path: `${pathBase}.presetId`,
      pageId: page.id,
      sectionId: section.id,
      blockId,
    })
  } else if (
    blockPresetId !== 'custom'
    && !isCmsBlockPresetAllowedForSectionPreset(
      section.presetId,
      blockPresetId,
      authoredBlockPresets
    )
  ) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.preset.not_allowed_for_section',
      severity: 'error',
      message: `Block preset "${blockPresetId}" is not allowed inside section preset "${resolveCmsSectionPresetId(section.presetId)}".`,
      path: `${pathBase}.presetId`,
      pageId: page.id,
      sectionId: section.id,
      blockId,
    })
  }

  if (!isRecord(block?.props)) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.props.invalid',
      severity: 'error',
      message: `Block "${blockId || blockType || `#${blockIndex + 1}`}" must provide props as an object.`,
      path: `${pathBase}.props`,
      pageId: page.id,
      sectionId: section.id,
      blockId,
    })
    return
  }

  const definition = blockType ? registry?.get(blockType) : undefined
  if (definition?.validateProps) {
    const mergedProps = {
      ...(definition.defaults ?? {}),
      ...block.props,
    }

    if (!definition.validateProps(mergedProps)) {
      pushIssue(issues, {
        code: 'pages.sections.blocks.props.schema_invalid',
        severity: 'error',
        message: `Block "${blockId || blockType}" does not satisfy the registered prop schema.`,
        path: `${pathBase}.props`,
        pageId: page.id,
        sectionId: section.id,
        blockId,
      })
    }
  }
}

function validateSection(
  section: CmsPageSectionSettings,
  page: CmsPageSettings,
  sectionIndex: number,
  issues: CmsContentValidationIssue[],
  registry?: CmsBlockRegistry,
  authoredContentModels: CmsAuthoredContentModelSettings[] = [],
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[] = []
): {
  enabledBlocksCount: number
} {
  const sectionId = trimValue(section?.id)
  const sectionLabel = trimValue(section?.label)
  const sectionPresetId = trimValue(section?.presetId)
  const normalizedPresetId = resolveCmsSectionPresetId(sectionPresetId)
  const rawPresetIsValid = sectionPresetId === normalizedPresetId
  const pathBase = `pages.${page.id || 'unknown'}.sections[${sectionIndex}]`
  const blocks = Array.isArray(section?.blocks) ? section.blocks : []

  if (!sectionId) {
    pushIssue(issues, {
      code: 'pages.sections.id.required',
      severity: 'error',
      message: `Section ${sectionIndex + 1} in page "${page.id || page.title || 'unknown'}" must provide an id.`,
      path: `${pathBase}.id`,
      pageId: page.id,
    })
  }

  if (!sectionLabel) {
    pushIssue(issues, {
      code: 'pages.sections.label.required',
      severity: 'warning',
      message: `Section "${sectionId || `#${sectionIndex + 1}`}" should provide a visible label.`,
      path: `${pathBase}.label`,
      pageId: page.id,
      sectionId,
    })
  }

  if (!rawPresetIsValid) {
    pushIssue(issues, {
      code: 'pages.sections.preset.invalid',
      severity: 'error',
      message: `Section "${sectionId || `#${sectionIndex + 1}`}" uses an invalid preset "${sectionPresetId || 'empty'}".`,
      path: `${pathBase}.presetId`,
      pageId: page.id,
      sectionId,
    })
  } else if (!isCmsSectionPresetAllowedForContentModel(page.contentModelId, normalizedPresetId, authoredContentModels)) {
    pushIssue(issues, {
      code: 'pages.sections.preset.not_allowed',
      severity: 'error',
      message: `Section preset "${normalizedPresetId}" is not allowed for content model "${page.contentModelId}".`,
      path: `${pathBase}.presetId`,
      pageId: page.id,
      sectionId,
    })
  }

  const enabledBlocks = blocks.filter(block => block.enabled)
  const sectionBlockLimits = getCmsSectionPresetBlockLimits(normalizedPresetId)
  if (section.enabled && enabledBlocks.length === 0) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.empty',
      severity: 'error',
      message: `Enabled section "${sectionId || `#${sectionIndex + 1}`}" must contain at least one enabled block.`,
      path: `${pathBase}.blocks`,
      pageId: page.id,
      sectionId,
    })
  }

  if (
    section.enabled
    && enabledBlocks.length > 0
    && enabledBlocks.length < sectionBlockLimits.minBlocks
  ) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.limit.missing',
      severity: 'error',
      message: `Section "${sectionId || `#${sectionIndex + 1}`}" requires at least ${sectionBlockLimits.minBlocks} enabled block(s).`,
      path: `${pathBase}.blocks`,
      pageId: page.id,
      sectionId,
    })
  }

  if (
    section.enabled
    && sectionBlockLimits.maxBlocks != null
    && enabledBlocks.length > sectionBlockLimits.maxBlocks
  ) {
    pushIssue(issues, {
      code: 'pages.sections.blocks.limit.exceeded',
      severity: 'error',
      message: `Section "${sectionId || `#${sectionIndex + 1}`}" allows at most ${sectionBlockLimits.maxBlocks} enabled block(s).`,
      path: `${pathBase}.blocks`,
      pageId: page.id,
      sectionId,
    })
  }

  const blockIds = new Set<string>()
  blocks.forEach((block, blockIndex) => {
    const blockId = trimValue(block?.id)
    if (blockId) {
      if (blockIds.has(blockId)) {
        pushIssue(issues, {
          code: 'pages.sections.blocks.id.duplicate',
          severity: 'error',
          message: `Duplicate block id "${blockId}" in section "${sectionId || `#${sectionIndex + 1}`}".`,
          path: `${pathBase}.blocks.${blockId}`,
          pageId: page.id,
          sectionId,
          blockId,
        })
      }
      blockIds.add(blockId)
    }

    validateBlock(block, section, page, blockIndex, issues, registry, authoredBlockPresets)
  })

  return {
    enabledBlocksCount: enabledBlocks.length,
  }
}

/**
 * Validates CMS page settings and emits reusable builder diagnostics.
 */
export function validateCmsContentPages(
  options: CmsContentValidationOptions
): CmsContentValidationResult {
  const pages = Array.isArray(options.pages) ? options.pages : []
  const authoredContentModels = Array.isArray(options.authoredContentModels)
    ? options.authoredContentModels
    : []
  const authoredBlockPresets = Array.isArray(options.authoredBlockPresets)
    ? options.authoredBlockPresets
    : []
  const issues: CmsContentValidationIssue[] = []
  const summary: CmsContentValidationSummary = {
    pageCount: pages.length,
    publishedPagesCount: 0,
    enabledSectionsCount: 0,
    enabledBlocksCount: 0,
  }

  if (pages.length === 0) {
    pushIssue(issues, {
      code: 'pages.required',
      severity: 'error',
      message: 'At least one page must be configured.',
      path: 'pages',
    })
  }

  const pageIds = new Set<string>()
  const pagePaths = new Set<string>()

  pages.forEach((page, pageIndex) => {
    const pageId = trimValue(page?.id)
    const pagePath = trimValue(page?.path)
    const pageTitle = trimValue(page?.title)
    const contentModelId = trimValue(page?.contentModelId)
    const normalizedContentModelId = resolveCmsContentModelId(contentModelId, authoredContentModels)
    const pathBase = `pages[${pageIndex}]`
    const sections = Array.isArray(page?.sections) ? page.sections : []

    if (page.status === 'published') {
      summary.publishedPagesCount += 1
    }

    if (!pageId) {
      pushIssue(issues, {
        code: 'pages.id.required',
        severity: 'error',
        message: `Page ${pageIndex + 1} must provide an id.`,
        path: `${pathBase}.id`,
      })
    } else if (pageIds.has(pageId)) {
      pushIssue(issues, {
        code: 'pages.id.duplicate',
        severity: 'error',
        message: `Duplicate page ID "${pageId}".`,
        path: `${pathBase}.id`,
        pageId,
      })
    } else {
      pageIds.add(pageId)
    }

    if (!pageTitle) {
      pushIssue(issues, {
        code: 'pages.title.required',
        severity: 'error',
        message: `Page "${pageId || `#${pageIndex + 1}`}" must provide a title.`,
        path: `${pathBase}.title`,
        pageId,
      })
    }

    if (!pagePath) {
      pushIssue(issues, {
        code: 'pages.path.required',
        severity: 'error',
        message: `Page "${pageId || `#${pageIndex + 1}`}" must define a route path.`,
        path: `${pathBase}.path`,
        pageId,
      })
    } else {
      if (!pagePath.startsWith('/')) {
        pushIssue(issues, {
          code: 'pages.path.leading_slash',
          severity: 'warning',
          message: `Page path "${pagePath}" should start with "/".`,
          path: `${pathBase}.path`,
          pageId,
        })
      }

      if (pagePaths.has(pagePath)) {
        pushIssue(issues, {
          code: 'pages.path.duplicate',
          severity: 'error',
          message: `Duplicate page path "${pagePath}".`,
          path: `${pathBase}.path`,
          pageId,
        })
      } else {
        pagePaths.add(pagePath)
      }
    }

    if (!contentModelId || contentModelId !== normalizedContentModelId) {
      pushIssue(issues, {
        code: 'pages.content_model.invalid',
        severity: 'error',
        message: `Page "${pageId || `#${pageIndex + 1}`}" uses an invalid content model "${contentModelId || 'empty'}".`,
        path: `${pathBase}.contentModelId`,
        pageId,
      })
    }

    if (contentModelId && contentModelId === normalizedContentModelId) {
      const currentSchemaVersion = getCmsContentModelSchemaVersion(contentModelId, authoredContentModels)
      const appliedSchemaVersion = typeof page.contentModelVersion === 'number'
        && Number.isFinite(page.contentModelVersion)
        && page.contentModelVersion > 0
        ? Math.max(1, Math.floor(page.contentModelVersion))
        : null

      if (appliedSchemaVersion == null) {
        pushIssue(issues, {
          code: 'pages.content_model.version.missing',
          severity: 'warning',
          message: `Page "${pageId || pageTitle || `#${pageIndex + 1}`}" is missing the applied schema version for content model "${contentModelId}".`,
          path: `${pathBase}.contentModelVersion`,
          pageId,
        })
      } else if (appliedSchemaVersion > currentSchemaVersion) {
        pushIssue(issues, {
          code: 'pages.content_model.version.ahead',
          severity: 'error',
          message: `Page "${pageId || pageTitle || `#${pageIndex + 1}`}" references schema version ${appliedSchemaVersion}, but content model "${contentModelId}" is currently at version ${currentSchemaVersion}.`,
          path: `${pathBase}.contentModelVersion`,
          pageId,
        })
      } else if (appliedSchemaVersion < currentSchemaVersion) {
        const migrationNotes = getCmsContentModelMigrationNotes('en', contentModelId, authoredContentModels)
        const lastSchemaChangeAt = getCmsContentModelLastSchemaChangeAt(contentModelId, authoredContentModels)
        const metadataParts = [
          migrationNotes ? `Migration notes: ${migrationNotes}.` : '',
          lastSchemaChangeAt ? `Updated at ${lastSchemaChangeAt}.` : '',
        ].filter(Boolean)

        pushIssue(issues, {
          code: 'pages.content_model.version.stale',
          severity: 'warning',
          message: `Page "${pageId || pageTitle || `#${pageIndex + 1}`}" is still using schema version ${appliedSchemaVersion}, while content model "${contentModelId}" is at version ${currentSchemaVersion}. ${metadataParts.join(' ')}`.trim(),
          path: `${pathBase}.contentModelVersion`,
          pageId,
        })
      }
    }

    validatePageCustomFields(page, pathBase, issues, authoredContentModels)

    if (sections.length === 0) {
      pushIssue(issues, {
        code: 'pages.sections.empty',
        severity: 'warning',
        message: `Page "${pageId || pageTitle || `#${pageIndex + 1}`}" has no sections configured.`,
        path: `${pathBase}.sections`,
        pageId,
      })
      return
    }

    const enabledSectionPresetIds = new Set(
      sections
        .filter(section => section?.enabled)
        .map(section => resolveCmsSectionPresetId(section?.presetId))
    )
    const enabledPresetUsageCounts = new Map<string, number>()
    sections
      .filter(section => section?.enabled)
      .forEach(section => {
        const presetId = resolveCmsSectionPresetId(section?.presetId)
        enabledPresetUsageCounts.set(presetId, (enabledPresetUsageCounts.get(presetId) ?? 0) + 1)
      })
    const sectionIds = new Set<string>()
    sections.forEach((section, sectionIndex) => {
      const sectionId = trimValue(section?.id)
      if (section.enabled) {
        summary.enabledSectionsCount += 1
      }

      if (sectionId) {
        if (sectionIds.has(sectionId)) {
          pushIssue(issues, {
            code: 'pages.sections.id.duplicate',
            severity: 'error',
            message: `Duplicate section id "${sectionId}" found in page "${pageId || pageTitle}".`,
            path: `${pathBase}.sections.${sectionId}`,
            pageId,
            sectionId,
          })
        }
        sectionIds.add(sectionId)
      }

      const sectionResult = validateSection(
        section,
        page,
        sectionIndex,
        issues,
        options.registry,
        authoredContentModels,
        authoredBlockPresets
      )
      summary.enabledBlocksCount += sectionResult.enabledBlocksCount
    })

    if (contentModelId && contentModelId === normalizedContentModelId) {
      const maxSections = getCmsContentModelMaxSections(contentModelId, authoredContentModels)
      const enabledSectionsCount = sections.filter(section => section?.enabled).length
      if (maxSections != null && enabledSectionsCount > maxSections) {
        pushIssue(issues, {
          code: 'pages.sections.limit.exceeded',
          severity: 'error',
          message: `Page "${pageId || pageTitle || `#${pageIndex + 1}`}" exceeds the maximum of ${maxSections} enabled sections for content model "${contentModelId}".`,
          path: `${pathBase}.sections`,
          pageId,
        })
      }

      const presetLimits = getCmsContentModelSectionPresetLimitMap(contentModelId, authoredContentModels)
      Object.entries(presetLimits).forEach(([presetId, limit]) => {
        const usageCount = enabledPresetUsageCounts.get(presetId) ?? 0
        if (usageCount <= limit) {
          return
        }

        pushIssue(issues, {
          code: 'pages.sections.preset.limit.exceeded',
          severity: 'error',
          message: `Page "${pageId || pageTitle || `#${pageIndex + 1}`}" exceeds the limit of ${limit} enabled "${presetId}" sections for content model "${contentModelId}".`,
          path: `${pathBase}.sections`,
          pageId,
        })
      })

      getCmsRequiredSectionPresetIds(contentModelId, authoredContentModels).forEach(requiredPresetId => {
        if (enabledSectionPresetIds.has(requiredPresetId)) {
          return
        }

        pushIssue(issues, {
          code: 'pages.sections.required_preset.missing',
          severity: 'error',
          message: `Page "${pageId || pageTitle || `#${pageIndex + 1}`}" is missing required section preset "${requiredPresetId}" for content model "${contentModelId}".`,
          path: `${pathBase}.sections`,
          pageId,
        })
      })
    }
  })

  if (summary.publishedPagesCount === 0) {
    pushIssue(issues, {
      code: 'pages.published.required',
      severity: 'error',
      message: 'At least one page must be marked as published.',
      path: 'pages',
    })
  }

  if (summary.enabledBlocksCount === 0) {
    pushIssue(issues, {
      code: 'pages.blocks.enabled.required',
      severity: 'error',
      message: 'No enabled blocks were found in enabled sections.',
      path: 'pages',
    })
  }

  const errorCount = issues.filter(issue => issue.severity === 'error').length
  const warningCount = issues.filter(issue => issue.severity === 'warning').length

  return {
    valid: errorCount === 0,
    errorCount,
    warningCount,
    issues,
    summary,
  }
}