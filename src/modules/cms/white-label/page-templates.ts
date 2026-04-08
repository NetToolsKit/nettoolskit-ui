/**
 * CMS page template helpers used by the Pages builder.
 * Generates localized page scaffolds with collision-safe ids and paths.
 */
import {
  createCmsPageSectionFromPreset,
  getCmsContentModelLabel,
  getCmsContentModelSchemaVersion,
} from './content-models'
import { resolveCmsLocale } from './i18n'
import type {
  CmsAuthoredContentModelSettings,
  CmsContentModelId,
  CmsLocale,
  CmsPageSettings,
  CmsSectionPresetId,
} from './types'

export type CmsPageTemplateId = 'landing-default' | 'marketing' | 'blank'

export interface CmsPageTemplateOption {
  value: CmsPageTemplateId
  label: string
  description: string
}

export interface CmsPageQuickStartOption {
  value: CmsPageTemplateId
  label: string
  description: string
  contentModelLabel: string
  sectionCount: number
  sectionLabels: string[]
}

interface CmsPageTemplateSectionDefinition {
  id: CmsSectionPresetId
  label: Record<CmsLocale, string>
  enabled: boolean
  blockType: string
}

interface CmsPageTemplateDefinition {
  id: CmsPageTemplateId
  contentModelId: CmsContentModelId
  label: Record<CmsLocale, string>
  description: Record<CmsLocale, string>
  baseId: string
  basePath: string
  title: Record<CmsLocale, string>
  pageDescription: Record<CmsLocale, string>
  sectionPresets: CmsPageTemplateSectionDefinition[]
}

const DEFAULT_PAGE_TEMPLATE_ID: CmsPageTemplateId = 'landing-default'

const pageTemplates: ReadonlyArray<CmsPageTemplateDefinition> = [
  {
    id: 'landing-default',
    contentModelId: 'landing-page',
    label: {
      en: 'Landing (default)',
      'pt-BR': 'Landing (padrao)',
    },
    description: {
      en: 'Balanced public page with header, hero, features and CTA flow.',
      'pt-BR': 'Pagina publica equilibrada com header, hero, features e fluxo de CTA.',
    },
    baseId: 'landing-page',
    basePath: '/landing',
    title: {
      en: 'Landing Page',
      'pt-BR': 'Pagina de Landing',
    },
    pageDescription: {
      en: 'Primary public landing page.',
      'pt-BR': 'Pagina principal publica de landing.',
    },
    sectionPresets: [
      { id: 'header', label: { en: 'Header', 'pt-BR': 'Cabecalho' }, enabled: true, blockType: 'landing.header' },
      { id: 'hero', label: { en: 'Hero', 'pt-BR': 'Hero' }, enabled: true, blockType: 'landing.hero' },
      { id: 'features', label: { en: 'Features', 'pt-BR': 'Features' }, enabled: true, blockType: 'landing.features' },
      { id: 'installation', label: { en: 'Installation', 'pt-BR': 'Instalacao' }, enabled: true, blockType: 'landing.cta' },
      { id: 'footer', label: { en: 'Footer', 'pt-BR': 'Rodape' }, enabled: true, blockType: 'landing.footer' },
    ],
  },
  {
    id: 'marketing',
    contentModelId: 'marketing-page',
    label: {
      en: 'Marketing funnel',
      'pt-BR': 'Funil de marketing',
    },
    description: {
      en: 'Marketing page with metrics section and conversion CTA.',
      'pt-BR': 'Pagina de marketing com metricas e CTA de conversao.',
    },
    baseId: 'marketing-page',
    basePath: '/marketing',
    title: {
      en: 'Marketing Page',
      'pt-BR': 'Pagina de Marketing',
    },
    pageDescription: {
      en: 'Campaign-oriented page focused on conversion.',
      'pt-BR': 'Pagina orientada a campanha com foco em conversao.',
    },
    sectionPresets: [
      { id: 'header', label: { en: 'Header', 'pt-BR': 'Cabecalho' }, enabled: true, blockType: 'landing.header' },
      { id: 'hero', label: { en: 'Hero', 'pt-BR': 'Hero' }, enabled: true, blockType: 'landing.hero' },
      { id: 'metrics', label: { en: 'Metrics', 'pt-BR': 'Metricas' }, enabled: true, blockType: 'landing.stats' },
      { id: 'features', label: { en: 'Benefits', 'pt-BR': 'Beneficios' }, enabled: true, blockType: 'landing.features' },
      { id: 'cta', label: { en: 'CTA', 'pt-BR': 'CTA' }, enabled: true, blockType: 'landing.cta' },
      { id: 'footer', label: { en: 'Footer', 'pt-BR': 'Rodape' }, enabled: true, blockType: 'landing.footer' },
    ],
  },
  {
    id: 'blank',
    contentModelId: 'blank-page',
    label: {
      en: 'Blank page',
      'pt-BR': 'Pagina em branco',
    },
    description: {
      en: 'Minimal scaffold to compose sections from scratch.',
      'pt-BR': 'Estrutura minima para montar secoes do zero.',
    },
    baseId: 'blank-page',
    basePath: '/blank',
    title: {
      en: 'Blank Page',
      'pt-BR': 'Pagina em Branco',
    },
    pageDescription: {
      en: 'Start from scratch and compose your own sections.',
      'pt-BR': 'Comece do zero e componha suas proprias secoes.',
    },
    sectionPresets: [
      { id: 'hero', label: { en: 'Hero', 'pt-BR': 'Hero' }, enabled: true, blockType: 'landing.hero' },
      { id: 'footer', label: { en: 'Footer', 'pt-BR': 'Rodape' }, enabled: true, blockType: 'landing.footer' },
    ],
  },
]

function normalizeSegment(value: string, fallback: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return normalized || fallback
}

function createUniqueValue(base: string, occupiedValues: Set<string>): string {
  if (!occupiedValues.has(base)) {
    return base
  }

  let suffix = 2
  let candidate = `${base}-${suffix}`
  while (occupiedValues.has(candidate)) {
    suffix += 1
    candidate = `${base}-${suffix}`
  }
  return candidate
}

function createUniquePageTitle(baseTitle: string, occupiedTitles: Set<string>): string {
  if (!occupiedTitles.has(baseTitle.toLowerCase())) {
    return baseTitle
  }

  let suffix = 2
  let candidate = `${baseTitle} ${suffix}`
  while (occupiedTitles.has(candidate.toLowerCase())) {
    suffix += 1
    candidate = `${baseTitle} ${suffix}`
  }
  return candidate
}

function createLocalizedTextRecord(input: Record<CmsLocale, string>): Record<CmsLocale, string> {
  return {
    en: input.en,
    'pt-BR': input['pt-BR'],
  }
}

/**
 * Returns page template options localized for current CMS locale.
 */
export function listCmsPageTemplateOptions(localeInput: unknown): CmsPageTemplateOption[] {
  const locale = resolveCmsLocale(localeInput)
  return pageTemplates.map(template => ({
    value: template.id,
    label: template.label[locale],
    description: template.description[locale],
  }))
}

/**
 * Returns guided quick-start options with content-model and section metadata.
 */
export function listCmsPageQuickStartOptions(
  localeInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsPageQuickStartOption[] {
  const locale = resolveCmsLocale(localeInput)
  return pageTemplates.map(template => ({
    value: template.id,
    label: template.label[locale],
    description: template.description[locale],
    contentModelLabel: getCmsContentModelLabel(locale, template.contentModelId, authoredModels),
    sectionCount: template.sectionPresets.length,
    sectionLabels: template.sectionPresets.map(section => section.label[locale]),
  }))
}

/**
 * Resolves a template id, falling back to default when unknown.
 */
export function resolveCmsPageTemplateId(value: unknown): CmsPageTemplateId {
  const normalized = String(value ?? '').trim()
  const found = pageTemplates.find(template => template.id === normalized)
  return found?.id ?? DEFAULT_PAGE_TEMPLATE_ID
}

/**
 * Creates a localized page scaffold from selected template.
 */
export function createCmsPageFromTemplate(input: {
  templateId: unknown
  existingPages: CmsPageSettings[]
  localeInput?: unknown
}): CmsPageSettings {
  const locale = resolveCmsLocale(input.localeInput)
  const templateId = resolveCmsPageTemplateId(input.templateId)
  const template = pageTemplates.find(item => item.id === templateId) ?? pageTemplates[0]

  const occupiedIds = new Set(input.existingPages.map(page => String(page.id ?? '').trim()).filter(Boolean))
  const occupiedPathSegments = new Set(
    input.existingPages
      .map(page => String(page.path ?? '').trim().replace(/^\/+/, ''))
      .filter(Boolean)
  )
  const occupiedTitles = new Set(input.existingPages.map(page => String(page.title ?? '').trim().toLowerCase()).filter(Boolean))

  const baseId = normalizeSegment(template.baseId, 'page')
  const pageId = createUniqueValue(baseId, occupiedIds)

  const basePathSegment = normalizeSegment(template.basePath.replace(/^\/+/, ''), pageId)
  const pagePath = `/${createUniqueValue(basePathSegment, occupiedPathSegments)}`

  const pageTitle = createUniquePageTitle(template.title.en, occupiedTitles)
  const sectionIds = new Set<string>()
  const blockIds = new Set<string>()

  const sections = template.sectionPresets.reduce<CmsPageSettings['sections']>((accumulator, section) => {
    const nextSection = createCmsPageSectionFromPreset({
      presetId: section.id as CmsSectionPresetId,
      existingSections: accumulator,
      localeInput: locale,
    })
    const sectionId = createUniqueValue(normalizeSegment(nextSection.id, 'section'), sectionIds)
    sectionIds.add(sectionId)
    const blockId = createUniqueValue(`${sectionId}-block-1`, blockIds)
    blockIds.add(blockId)

    accumulator.push({
      ...nextSection,
      id: sectionId,
      label: section.label.en,
      localization: {
        label: createLocalizedTextRecord(section.label),
      },
      enabled: section.enabled,
      blocks: nextSection.blocks.map(block => ({
        ...block,
        id: blockId,
        type: section.blockType,
        enabled: section.enabled,
      })),
    })
    return accumulator
  }, [])

  return {
    id: pageId,
    contentModelId: template.contentModelId,
    contentModelVersion: getCmsContentModelSchemaVersion(template.contentModelId),
    title: pageTitle,
    path: pagePath,
    status: 'draft',
    description: template.pageDescription.en,
    localization: {
      title: createLocalizedTextRecord(template.title),
      description: createLocalizedTextRecord(template.pageDescription),
    },
    sections,
  }
}