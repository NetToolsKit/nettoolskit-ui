/**
 * Structured content model and section preset helpers for the CMS engine.
 * These definitions let the page builder stay schema-driven while remaining
 * backend-agnostic and reusable across future products.
 */
import { resolveCmsLocale } from './i18n'
import {
  applyCmsLocalizedTextUpdate,
  normalizeCmsLocalizedTextRecord,
  resolveCmsLocalizedText,
} from './localized-content'
import {
  createCmsPageBlockFromPreset,
  getCmsBlockPresetDefinition,
  getDefaultCmsBlockPresetIdForSectionPreset,
  listCmsBlockPresetDefinitionsForType,
  resolveCmsBlockPresetId,
} from './block-presets'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelId,
  CmsAuthoredContentModelSettings,
  CmsBlockPresetId,
  CmsBuiltinContentModelId,
  CmsContentModelId,
  CmsContentModelFieldDefinition,
  CmsContentModelFieldLocalizationSettings,
  CmsContentModelFieldObjectValue,
  CmsContentModelFieldVisibilityDefinition,
  CmsContentModelFieldVisibilityOperator,
  CmsContentModelFieldVisibilitySettings,
  CmsContentModelFieldVisibilitySource,
  CmsContentModelFieldOptionSettings,
  CmsContentModelFieldPrimitiveValue,
  CmsContentModelFieldSettings,
  CmsContentModelFieldType,
  CmsContentModelFieldValue,
  CmsLocale,
  CmsMediaAssetKind,
  CmsPageSectionSettings,
  CmsPageSettings,
  CmsSchemaReferenceKind,
  CmsSectionPresetLimitMap,
  CmsSectionPresetId,
} from './types'

export interface CmsContentModelOption {
  value: CmsContentModelId
  label: string
  description: string
}

export interface CmsSectionPresetOption {
  value: CmsSectionPresetId
  label: string
  description: string
}

export interface CmsSectionStarterPresetOption {
  value: CmsBlockPresetId
  label: string
  description: string
  source: 'builtin' | 'authored' | 'custom'
  category: string
  isDefault: boolean
}

export interface CmsSectionPresetSlotDefinition {
  id: string
  label: string
  description: string
  allowedBlockTypes: string[]
  minBlocks: number
  maxBlocks: number | null
}

export interface CmsResolvedSectionPresetDefinition {
  id: CmsSectionPresetId
  label: string
  description: string
  defaultSectionId: string
  defaultLabel: string
  defaultEnabled: boolean
  blockType: string
  allowedBlockTypes: string[]
  minBlocks: number
  maxBlocks: number | null
  fields: CmsContentModelFieldDefinition[]
  slots: CmsSectionPresetSlotDefinition[]
}

interface CmsLocalizedText {
  en: string
  'pt-BR': string
}

interface CmsSectionPresetDefinition {
  id: CmsSectionPresetId
  label: CmsLocalizedText
  description: CmsLocalizedText
  defaultSectionId: string
  defaultLabel: CmsLocalizedText
  defaultEnabled: boolean
  blockType: string
  blockPresetId: CmsBlockPresetId
  allowedBlockTypes: string[]
  minBlocks: number
  maxBlocks: number | null
  fields: CmsContentModelFieldSettings[]
}

interface CmsBuiltinContentModelDefinition {
  id: CmsBuiltinContentModelId
  label: CmsLocalizedText
  description: CmsLocalizedText
  defaultPageTitle: CmsLocalizedText
  defaultPageDescription: CmsLocalizedText
  defaultPagePathPrefix: string
  schemaVersion: number
  migrationNotes: CmsLocalizedText
  lastSchemaChangeAt: string | null
  fields: CmsContentModelFieldSettings[]
  allowedPresets: CmsSectionPresetId[]
  requiredPresets: CmsSectionPresetId[]
  starterPresets: CmsSectionPresetId[]
  recommendedPresets: CmsSectionPresetId[]
  maxSections: number | null
  sectionPresetLimits: CmsSectionPresetLimitMap
}

export interface CmsContentModelFieldVisibilityContext {
  pageStatus: CmsPageSettings['status']
  customFields: Record<string, unknown>
}

interface CmsResolvedContentModelDefinition {
  id: CmsContentModelId
  label: string
  description: string
  defaultPageTitle: string
  defaultPageDescription: string
  defaultPagePathPrefix: string
  schemaVersion: number
  migrationNotes: string
  lastSchemaChangeAt: string | null
  fields: CmsContentModelFieldDefinition[]
  allowedPresets: CmsSectionPresetId[]
  requiredPresets: CmsSectionPresetId[]
  starterPresets: CmsSectionPresetId[]
  recommendedPresets: CmsSectionPresetId[]
  maxSections: number | null
  sectionPresetLimits: CmsSectionPresetLimitMap
}

type CmsNormalizedContentModelFieldShape = {
  id: string
  type: CmsContentModelFieldType
  required?: boolean
  repeatable?: boolean
  min?: number | null
  max?: number | null
  defaultValue?: CmsContentModelFieldValue
  options?: CmsContentModelFieldOptionSettings[]
  mediaKinds?: CmsMediaAssetKind[]
  referenceKinds?: CmsSchemaReferenceKind[]
  fields?: CmsNormalizedContentModelFieldShape[]
}

const DEFAULT_CONTENT_MODEL_ID: CmsBuiltinContentModelId = 'landing-page'
const DEFAULT_SECTION_PRESET_ID: CmsSectionPresetId = 'hero'
const AUTHORED_CONTENT_MODEL_ID_PREFIX = 'authored-model:'

function createCommonSectionPresetFields(): CmsContentModelFieldSettings[] {
  return [
    {
      id: 'anchorid',
      type: 'text',
      label: 'Anchor ID',
      description: 'Optional anchor used for in-page navigation and deep links.',
      placeholder: 'hero',
      group: 'Section settings',
      order: 1,
      required: false,
      defaultValue: '',
      localization: {
        label: { 'pt-BR': 'ID da ancora' },
        description: { 'pt-BR': 'Ancora opcional usada para navegacao interna e links profundos.' },
        placeholder: { 'pt-BR': 'hero' },
        group: { 'pt-BR': 'Configuracoes da secao' },
      },
    },
    {
      id: 'themevariant',
      type: 'select',
      label: 'Theme variant',
      description: 'Visual tone applied to the section container.',
      placeholder: '',
      group: 'Section settings',
      order: 2,
      required: false,
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'muted', label: 'Muted' },
        { value: 'contrast', label: 'Contrast' },
      ],
      localization: {
        label: { 'pt-BR': 'Variante do tema' },
        description: { 'pt-BR': 'Tom visual aplicado ao container da secao.' },
        group: { 'pt-BR': 'Configuracoes da secao' },
      },
    },
  ]
}

const sectionPresetCatalog: Readonly<Record<CmsSectionPresetId, CmsSectionPresetDefinition>> = {
  header: {
    id: 'header',
    label: { en: 'Header', 'pt-BR': 'Cabecalho' },
    description: { en: 'Top navigation and brand bar.', 'pt-BR': 'Barra de marca e navegacao superior.' },
    defaultSectionId: 'header',
    defaultLabel: { en: 'Header', 'pt-BR': 'Cabecalho' },
    defaultEnabled: true,
    blockType: 'landing.header',
    blockPresetId: 'landing-header-product',
    allowedBlockTypes: ['landing.header'],
    minBlocks: 1,
    maxBlocks: 1,
    fields: createCommonSectionPresetFields(),
  },
  hero: {
    id: 'hero',
    label: { en: 'Hero', 'pt-BR': 'Hero' },
    description: { en: 'Primary opening section with message and media.', 'pt-BR': 'Secao principal de abertura com mensagem e midia.' },
    defaultSectionId: 'hero',
    defaultLabel: { en: 'Hero', 'pt-BR': 'Hero' },
    defaultEnabled: true,
    blockType: 'landing.hero',
    blockPresetId: 'landing-hero-product-launch',
    allowedBlockTypes: ['landing.hero', 'landing.stats', 'landing.cta'],
    minBlocks: 1,
    maxBlocks: 3,
    fields: createCommonSectionPresetFields(),
  },
  stats: {
    id: 'stats',
    label: { en: 'Stats', 'pt-BR': 'Estatisticas' },
    description: { en: 'Highlights product metrics and trust signals.', 'pt-BR': 'Destaca metricas do produto e sinais de confianca.' },
    defaultSectionId: 'stats',
    defaultLabel: { en: 'Stats', 'pt-BR': 'Estatisticas' },
    defaultEnabled: true,
    blockType: 'landing.stats',
    blockPresetId: 'landing-stats-proof-strip',
    allowedBlockTypes: ['landing.stats'],
    minBlocks: 1,
    maxBlocks: 2,
    fields: createCommonSectionPresetFields(),
  },
  metrics: {
    id: 'metrics',
    label: { en: 'Metrics', 'pt-BR': 'Metricas' },
    description: { en: 'Campaign KPIs and measurable outcomes.', 'pt-BR': 'KPIs de campanha e resultados mensuraveis.' },
    defaultSectionId: 'metrics',
    defaultLabel: { en: 'Metrics', 'pt-BR': 'Metricas' },
    defaultEnabled: true,
    blockType: 'landing.stats',
    blockPresetId: 'landing-stats-dashboard-kpis',
    allowedBlockTypes: ['landing.stats'],
    minBlocks: 1,
    maxBlocks: 2,
    fields: createCommonSectionPresetFields(),
  },
  features: {
    id: 'features',
    label: { en: 'Features', 'pt-BR': 'Features' },
    description: { en: 'Core capabilities or product pillars.', 'pt-BR': 'Capacidades centrais ou pilares do produto.' },
    defaultSectionId: 'features',
    defaultLabel: { en: 'Features', 'pt-BR': 'Features' },
    defaultEnabled: true,
    blockType: 'landing.features',
    blockPresetId: 'landing-features-component-library',
    allowedBlockTypes: ['landing.features', 'landing.stats', 'landing.cta'],
    minBlocks: 1,
    maxBlocks: 4,
    fields: createCommonSectionPresetFields(),
  },
  benefits: {
    id: 'benefits',
    label: { en: 'Benefits', 'pt-BR': 'Beneficios' },
    description: { en: 'Value-driven section for marketing funnels.', 'pt-BR': 'Secao orientada a valor para funis de marketing.' },
    defaultSectionId: 'benefits',
    defaultLabel: { en: 'Benefits', 'pt-BR': 'Beneficios' },
    defaultEnabled: true,
    blockType: 'landing.features',
    blockPresetId: 'landing-features-enterprise-readiness',
    allowedBlockTypes: ['landing.features', 'landing.cta'],
    minBlocks: 1,
    maxBlocks: 3,
    fields: createCommonSectionPresetFields(),
  },
  installation: {
    id: 'installation',
    label: { en: 'Installation', 'pt-BR': 'Instalacao' },
    description: { en: 'Activation section for setup or onboarding.', 'pt-BR': 'Secao de ativacao para setup ou onboarding.' },
    defaultSectionId: 'installation',
    defaultLabel: { en: 'Installation', 'pt-BR': 'Instalacao' },
    defaultEnabled: true,
    blockType: 'landing.cta',
    blockPresetId: 'landing-cta-installation-guide',
    allowedBlockTypes: ['landing.cta', 'landing.features'],
    minBlocks: 1,
    maxBlocks: 2,
    fields: createCommonSectionPresetFields(),
  },
  cta: {
    id: 'cta',
    label: { en: 'CTA', 'pt-BR': 'CTA' },
    description: { en: 'Focused conversion or final action block.', 'pt-BR': 'Bloco focado em conversao ou acao final.' },
    defaultSectionId: 'cta',
    defaultLabel: { en: 'CTA', 'pt-BR': 'CTA' },
    defaultEnabled: true,
    blockType: 'landing.cta',
    blockPresetId: 'landing-cta-final-prompt',
    allowedBlockTypes: ['landing.cta', 'landing.stats'],
    minBlocks: 1,
    maxBlocks: 2,
    fields: createCommonSectionPresetFields(),
  },
  footer: {
    id: 'footer',
    label: { en: 'Footer', 'pt-BR': 'Rodape' },
    description: { en: 'Closing section with navigation and brand links.', 'pt-BR': 'Secao final com navegacao e links da marca.' },
    defaultSectionId: 'footer',
    defaultLabel: { en: 'Footer', 'pt-BR': 'Rodape' },
    defaultEnabled: true,
    blockType: 'landing.footer',
    blockPresetId: 'landing-footer-docs',
    allowedBlockTypes: ['landing.footer'],
    minBlocks: 1,
    maxBlocks: 1,
    fields: createCommonSectionPresetFields(),
  },
  custom: {
    id: 'custom',
    label: { en: 'Custom section', 'pt-BR': 'Secao customizada' },
    description: { en: 'Generic starter section for custom composition.', 'pt-BR': 'Secao inicial generica para composicao customizada.' },
    defaultSectionId: 'section',
    defaultLabel: { en: 'Custom section', 'pt-BR': 'Secao customizada' },
    defaultEnabled: true,
    blockType: 'landing.hero',
    blockPresetId: 'custom',
    allowedBlockTypes: [
      'landing.header',
      'landing.hero',
      'landing.stats',
      'landing.features',
      'landing.cta',
      'landing.footer',
    ],
    minBlocks: 1,
    maxBlocks: null,
    fields: createCommonSectionPresetFields(),
  },
}

const ALL_SECTION_PRESET_IDS = Object.keys(sectionPresetCatalog) as CmsSectionPresetId[]

const builtinContentModelCatalog: ReadonlyArray<CmsBuiltinContentModelDefinition> = [
  {
    id: 'landing-page',
    label: { en: 'Landing page', 'pt-BR': 'Pagina de landing' },
    description: { en: 'Public-facing product page with balanced narrative flow.', 'pt-BR': 'Pagina publica do produto com narrativa equilibrada.' },
    defaultPageTitle: { en: 'Landing Page', 'pt-BR': 'Pagina de Landing' },
    defaultPageDescription: { en: 'Primary public landing page.', 'pt-BR': 'Pagina principal publica de landing.' },
    defaultPagePathPrefix: '/landing',
    schemaVersion: 1,
    migrationNotes: { en: '', 'pt-BR': '' },
    lastSchemaChangeAt: null,
    fields: [],
    allowedPresets: ['header', 'hero', 'stats', 'features', 'installation', 'cta', 'footer', 'custom'],
    requiredPresets: ['header', 'hero', 'footer'],
    starterPresets: ['header', 'hero', 'features', 'installation', 'footer'],
    recommendedPresets: ['header', 'hero', 'features', 'installation', 'footer'],
    maxSections: null,
    sectionPresetLimits: {
      header: 1,
      hero: 1,
      installation: 1,
      footer: 1,
    },
  },
  {
    id: 'marketing-page',
    label: { en: 'Marketing page', 'pt-BR': 'Pagina de marketing' },
    description: { en: 'Campaign-oriented page with metrics, benefits and conversion blocks.', 'pt-BR': 'Pagina orientada a campanha com metricas, beneficios e conversao.' },
    defaultPageTitle: { en: 'Marketing Page', 'pt-BR': 'Pagina de Marketing' },
    defaultPageDescription: { en: 'Campaign-oriented page focused on conversion.', 'pt-BR': 'Pagina orientada a campanha com foco em conversao.' },
    defaultPagePathPrefix: '/marketing',
    schemaVersion: 1,
    migrationNotes: { en: '', 'pt-BR': '' },
    lastSchemaChangeAt: null,
    fields: [],
    allowedPresets: ['header', 'hero', 'metrics', 'benefits', 'features', 'cta', 'footer', 'custom'],
    requiredPresets: ['header', 'hero', 'cta', 'footer'],
    starterPresets: ['header', 'hero', 'metrics', 'benefits', 'cta', 'footer'],
    recommendedPresets: ['header', 'hero', 'metrics', 'benefits', 'cta', 'footer'],
    maxSections: null,
    sectionPresetLimits: {
      header: 1,
      hero: 1,
      cta: 1,
      footer: 1,
    },
  },
  {
    id: 'blank-page',
    label: { en: 'Blank canvas', 'pt-BR': 'Canvas em branco' },
    description: { en: 'Minimal starting point for custom composition.', 'pt-BR': 'Ponto de partida minimo para composicao customizada.' },
    defaultPageTitle: { en: 'Blank Page', 'pt-BR': 'Pagina em Branco' },
    defaultPageDescription: { en: 'Start from scratch and compose your own sections.', 'pt-BR': 'Comece do zero e componha suas proprias secoes.' },
    defaultPagePathPrefix: '/blank',
    schemaVersion: 1,
    migrationNotes: { en: '', 'pt-BR': '' },
    lastSchemaChangeAt: null,
    fields: [],
    allowedPresets: [...ALL_SECTION_PRESET_IDS],
    requiredPresets: [],
    starterPresets: ['hero', 'footer'],
    recommendedPresets: ['hero', 'footer'],
    maxSections: null,
    sectionPresetLimits: {},
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

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fallback handles Vue proxies and other non-cloneable values.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function resolveLocalizedText(text: CmsLocalizedText, locale: CmsLocale): string {
  return text[locale]
}

function resolvePagePathPrefix(
  value: unknown,
  fallback: string
): string {
  const baseValue = String(value ?? '').trim() || fallback
  const normalizedPath = `/${baseValue
    .replace(/^\/+/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .toLowerCase()}`

  return normalizedPath === '/'
    ? `/${normalizeSegment(fallback, 'page')}`
    : normalizedPath
}

function resolveSchemaVersion(value: unknown, fallback = 1): number {
  const parsed = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim().length > 0 ? Number(value) : Number.NaN)

  return Number.isFinite(parsed) && parsed > 0
    ? Math.max(1, Math.floor(parsed))
    : Math.max(1, Math.floor(fallback))
}

function resolveIsoTimestamp(value: unknown, fallback: string | null = null): string | null {
  const normalized = String(value ?? '').trim()
  if (!normalized) {
    return fallback
  }

  const parsed = Date.parse(normalized)
  return Number.isNaN(parsed)
    ? fallback
    : new Date(parsed).toISOString()
}

function createLocalizedTextRecord(text: CmsLocalizedText): Record<CmsLocale, string> {
  return {
    en: text.en,
    'pt-BR': text['pt-BR'],
  }
}

function resolveSectionSlotLabel(
  locale: CmsLocale,
  sectionPreset: CmsSectionPresetDefinition
): string {
  return locale === 'pt-BR'
    ? `${sectionPreset.label['pt-BR']} principal`
    : `${sectionPreset.label.en} main`
}

function resolveSectionSlotDescription(
  locale: CmsLocale,
  _sectionPreset: CmsSectionPresetDefinition
): string {
  return locale === 'pt-BR'
    ? 'Slot principal que controla os blocos permitidos nesta secao.'
    : 'Primary slot that controls the blocks allowed in this section.'
}

function resolveCmsSectionPresetDefinition(
  localeInput: unknown,
  presetInput: unknown
): CmsResolvedSectionPresetDefinition {
  const locale = resolveCmsLocale(localeInput)
  const presetId = resolveCmsSectionPresetId(presetInput)
  const preset = sectionPresetCatalog[presetId]

  return {
    id: preset.id,
    label: resolveLocalizedText(preset.label, locale),
    description: resolveLocalizedText(preset.description, locale),
    defaultSectionId: preset.defaultSectionId,
    defaultLabel: resolveLocalizedText(preset.defaultLabel, locale),
    defaultEnabled: preset.defaultEnabled,
    blockType: preset.blockType,
    allowedBlockTypes: [...preset.allowedBlockTypes],
    minBlocks: preset.minBlocks,
    maxBlocks: preset.maxBlocks,
    fields: resolveCmsContentModelFieldDefinitions(preset.fields, locale),
    slots: [
      {
        id: 'main',
        label: resolveSectionSlotLabel(locale, preset),
        description: resolveSectionSlotDescription(locale, preset),
        allowedBlockTypes: [...preset.allowedBlockTypes],
        minBlocks: preset.minBlocks,
        maxBlocks: preset.maxBlocks,
      },
    ],
  }
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function resolveCmsContentModelFieldType(
  value: unknown,
  fallback: CmsContentModelFieldType = 'text'
): CmsContentModelFieldType {
  const normalized = String(value ?? '').trim()
  switch (normalized) {
    case 'text':
    case 'textarea':
    case 'number':
    case 'toggle':
    case 'select':
    case 'url':
    case 'date':
    case 'media-asset':
    case 'reference':
    case 'object':
    case 'group':
      return normalized
    default:
      return fallback
  }
}

function buildCmsContentModelFieldFallbackValue(
  type: CmsContentModelFieldType,
  options: CmsContentModelFieldOptionSettings[] = [],
  fields: CmsNormalizedContentModelFieldShape[] = []
): CmsContentModelFieldValue {
  switch (type) {
    case 'toggle':
      return false
    case 'number':
      return null
    case 'select':
      return options[0]?.value ?? ''
    case 'object':
      return buildCmsStructuredContentModelFieldObjectValue(fields)
    case 'group':
      return []
    case 'url':
    case 'date':
    case 'media-asset':
    case 'reference':
    case 'textarea':
    case 'text':
    default:
      return ''
  }
}

function normalizeCmsContentModelFieldMediaKinds(
  value: unknown,
  fallback: CmsMediaAssetKind[] = []
): CmsMediaAssetKind[] {
  if (!Array.isArray(value)) {
    return cloneValue(fallback)
  }

  const normalizedKinds = new Set<CmsMediaAssetKind>()
  for (const entry of value) {
    switch (String(entry ?? '').trim().toLowerCase()) {
      case 'image':
      case 'video':
      case 'icon':
      case 'document':
      case 'other':
        normalizedKinds.add(String(entry ?? '').trim().toLowerCase() as CmsMediaAssetKind)
        break
      default:
        break
    }
  }

  return Array.from(normalizedKinds)
}

function normalizeCmsContentModelFieldReferenceKinds(
  value: unknown,
  fallback: CmsSchemaReferenceKind[] = []
): CmsSchemaReferenceKind[] {
  if (!Array.isArray(value)) {
    return cloneValue(fallback)
  }

  const normalizedKinds = new Set<CmsSchemaReferenceKind>()
  for (const entry of value) {
    switch (String(entry ?? '').trim().toLowerCase()) {
      case 'content-model':
      case 'block-preset':
      case 'reusable-block':
      case 'reusable-section':
        normalizedKinds.add(String(entry ?? '').trim().toLowerCase() as CmsSchemaReferenceKind)
        break
      default:
        break
    }
  }

  return Array.from(normalizedKinds)
}

function normalizeCmsContentModelFieldLocalizationSettings(
  value: unknown
): CmsContentModelFieldLocalizationSettings | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const label = normalizeCmsLocalizedTextRecord(value.label)
  const description = normalizeCmsLocalizedTextRecord(value.description)
  const placeholder = normalizeCmsLocalizedTextRecord(value.placeholder)
  const group = normalizeCmsLocalizedTextRecord(value.group)

  if (!label && !description && !placeholder && !group) {
    return undefined
  }

  return {
    ...(label ? { label } : {}),
    ...(description ? { description } : {}),
    ...(placeholder ? { placeholder } : {}),
    ...(group ? { group } : {}),
  }
}

function resolveCmsContentModelFieldVisibilitySource(
  value: unknown
): CmsContentModelFieldVisibilitySource {
  return value === 'page-status' ? 'page-status' : 'field'
}

function resolveCmsContentModelFieldVisibilityOperator(
  value: unknown,
  source: CmsContentModelFieldVisibilitySource
): CmsContentModelFieldVisibilityOperator {
  const normalized = String(value ?? '').trim().toLowerCase()

  if (source === 'page-status') {
    return normalized === 'not-equals' ? 'not-equals' : 'equals'
  }

  switch (normalized) {
    case 'not-equals':
    case 'contains':
    case 'is-empty':
    case 'is-not-empty':
    case 'is-true':
    case 'is-false':
      return normalized
    case 'equals':
    default:
      return 'equals'
  }
}

function doesCmsContentModelFieldVisibilityOperatorRequireValue(
  operator: CmsContentModelFieldVisibilityOperator
): boolean {
  return operator === 'equals'
    || operator === 'not-equals'
    || operator === 'contains'
}

function normalizeCmsContentModelFieldVisibilityValue(
  value: unknown,
  fallback: CmsContentModelFieldPrimitiveValue = ''
): CmsContentModelFieldPrimitiveValue {
  if (typeof value === 'boolean' || typeof value === 'number' || value === null) {
    return value
  }

  if (typeof value === 'string') {
    return value.trim()
  }

  return fallback
}

function normalizeCmsContentModelFieldVisibilitySettings(
  value: unknown,
  currentFieldId: string,
  fallback?: CmsContentModelFieldVisibilitySettings | null
): CmsContentModelFieldVisibilitySettings | undefined {
  if (!isObjectRecord(value)) {
    return fallback ? cloneValue(fallback) : undefined
  }

  const source = resolveCmsContentModelFieldVisibilitySource(value.source ?? fallback?.source)
  const operator = resolveCmsContentModelFieldVisibilityOperator(
    value.operator ?? fallback?.operator,
    source
  )

  if (source === 'page-status') {
    const rawStatus = String(value.value ?? fallback?.value ?? 'draft').trim().toLowerCase()
    const normalizedStatus = rawStatus === 'published' ? 'published' : 'draft'
    return {
      source,
      operator,
      value: normalizedStatus,
    }
  }

  const fieldId = normalizeSegment(
    String(value.fieldId ?? fallback?.fieldId ?? ''),
    ''
  )

  if (!fieldId || fieldId === currentFieldId) {
    return undefined
  }

  return {
    source,
    fieldId,
    operator,
    ...(doesCmsContentModelFieldVisibilityOperatorRequireValue(operator)
      ? {
          value: normalizeCmsContentModelFieldVisibilityValue(
            value.value,
            fallback?.value ?? ''
          ),
        }
      : {}),
  }
}

function normalizeCmsContentModelFieldGroup(
  value: unknown,
  fallback = ''
): string {
  return String(value ?? fallback).trim()
}

function resolveCmsContentModelFieldOrder(
  value: unknown,
  fallback: number
): number {
  const parsed = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim().length > 0 ? Number(value) : NaN)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.max(1, Math.floor(parsed))
}

function resolveCmsContentModelFieldConstraint(
  value: unknown,
  input: {
    type: CmsContentModelFieldType
    repeatable: boolean
  },
  fallback: number | null = null
): number | null {
  const supportsConstraint = input.repeatable
    || input.type === 'group'
    || input.type === 'text'
    || input.type === 'textarea'
    || input.type === 'number'
    || input.type === 'url'

  if (!supportsConstraint) {
    return null
  }

  const parsed = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim().length > 0 ? Number(value) : NaN)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  if (input.repeatable || input.type === 'group' || input.type === 'text' || input.type === 'textarea' || input.type === 'url') {
    return Math.max(0, Math.floor(parsed))
  }

  return Number(parsed)
}

function normalizeCmsContentModelFieldOptions(
  value: unknown,
  fallback: CmsContentModelFieldOptionSettings[] = []
): CmsContentModelFieldOptionSettings[] {
  if (!Array.isArray(value)) {
    return cloneValue(fallback)
  }

  const seenValues = new Set<string>()
  const normalized = value
    .map<CmsContentModelFieldOptionSettings | null>(entry => {
      if (isObjectRecord(entry)) {
        const optionValue = String(entry.value ?? '').trim()
        const optionLabel = String(entry.label ?? entry.value ?? '').trim()
        if (!optionValue || seenValues.has(optionValue)) {
          return null
        }
        seenValues.add(optionValue)
        return {
          value: optionValue,
          label: optionLabel || optionValue,
        }
      }

      const rawValue = String(entry ?? '').trim()
      if (!rawValue || seenValues.has(rawValue)) {
        return null
      }
      seenValues.add(rawValue)
      return {
        value: rawValue,
        label: rawValue,
      }
    })
    .filter((entry): entry is CmsContentModelFieldOptionSettings => entry !== null)

  return normalized.length > 0 ? normalized : cloneValue(fallback)
}

function normalizeCmsContentModelFieldPrimitiveValue(
  field: Pick<CmsNormalizedContentModelFieldShape, 'type' | 'options'>,
  value: unknown,
  fallbackValue?: CmsContentModelFieldPrimitiveValue
): CmsContentModelFieldPrimitiveValue {
  const fallback = fallbackValue ?? buildCmsContentModelFieldFallbackValue(
    field.type,
    field.options ?? []
  ) as CmsContentModelFieldPrimitiveValue

  switch (field.type) {
    case 'toggle':
      if (typeof value === 'boolean') {
        return value
      }

      if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase()
        if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
          return true
        }
        if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
          return false
        }
      }

      return fallback
    case 'number': {
      const parsedValue = typeof value === 'number'
        ? value
        : (typeof value === 'string' && value.trim().length > 0 ? Number(value) : NaN)
      return Number.isFinite(parsedValue) ? Number(parsedValue) : fallback
    }
    case 'select': {
      const normalizedValue = String(value ?? '').trim()
      const availableOptions = field.options ?? []
      if (normalizedValue && availableOptions.some(option => option.value === normalizedValue)) {
        return normalizedValue
      }
      return availableOptions.some(option => option.value === String(fallback ?? ''))
        ? String(fallback ?? '')
        : buildCmsContentModelFieldFallbackValue('select', availableOptions) as CmsContentModelFieldPrimitiveValue
    }
    case 'url':
    case 'date':
    case 'media-asset':
    case 'reference':
      if (value == null) {
        return fallback
      }
      return String(value ?? '').trim()
    case 'textarea':
    case 'text':
    default:
      if (value == null) {
        return fallback
      }
      return String(value ?? '')
  }
}

function buildCmsStructuredContentModelFieldObjectValue(
  fields: CmsNormalizedContentModelFieldShape[]
): CmsContentModelFieldObjectValue {
  return Object.fromEntries(
    fields.map(field => [
      field.id,
      normalizeCmsContentModelFieldValue(field, field.defaultValue),
    ])
  )
}

function normalizeCmsStructuredContentModelFieldObjectValue(
  fields: CmsNormalizedContentModelFieldShape[],
  value: unknown,
  fallbackValue?: CmsContentModelFieldValue
): CmsContentModelFieldObjectValue {
  const rawRecord = isObjectRecord(value) ? value : {}
  const fallbackRecord = isObjectRecord(fallbackValue)
    ? cloneValue(fallbackValue)
    : buildCmsStructuredContentModelFieldObjectValue(fields)
  const normalized: CmsContentModelFieldObjectValue = {}

  for (const childField of fields) {
    normalized[childField.id] = normalizeCmsContentModelFieldValue(
      childField,
      rawRecord[childField.id],
      fallbackRecord[childField.id] as CmsContentModelFieldValue | undefined
    )
  }

  return normalized
}

function hasCmsStructuredContentModelFieldObjectValue(
  fields: CmsNormalizedContentModelFieldShape[],
  value: CmsContentModelFieldObjectValue
): boolean {
  return fields.some(field => hasCmsNormalizedContentModelFieldValue(
    field,
    value[field.id]
  ))
}

function normalizeCmsContentModelFieldValue(
  field: Pick<CmsNormalizedContentModelFieldShape, 'id' | 'type' | 'options' | 'repeatable' | 'fields' | 'defaultValue'>,
  value: unknown,
  fallbackValue?: CmsContentModelFieldValue
): CmsContentModelFieldValue {
  if (field.type === 'object') {
    return normalizeCmsStructuredContentModelFieldObjectValue(
      field.fields ?? [],
      value,
      fallbackValue
    )
  }

  if (field.type === 'group') {
    const normalizedValues = (Array.isArray(value)
      ? value
      : (isObjectRecord(value) ? [value] : []))
      .filter(isObjectRecord)
      .map(entry => normalizeCmsStructuredContentModelFieldObjectValue(
        field.fields ?? [],
        entry
      ))
      .filter(entry => hasCmsStructuredContentModelFieldObjectValue(
        field.fields ?? [],
        entry
      ))

    if (normalizedValues.length > 0) {
      return normalizedValues
    }

    return Array.isArray(fallbackValue)
      ? fallbackValue
        .filter(isObjectRecord)
        .map(entry => normalizeCmsStructuredContentModelFieldObjectValue(field.fields ?? [], entry))
      : []
  }

  if (field.repeatable) {
    const fallbackArray = Array.isArray(fallbackValue)
      ? fallbackValue
      : []
    const sourceValues = Array.isArray(value)
      ? value
      : (value == null || value === '' ? [] : [value])

    const normalizedValues = sourceValues
      .map(entry => normalizeCmsContentModelFieldPrimitiveValue(
        field,
        entry,
        buildCmsContentModelFieldFallbackValue(field.type, field.options ?? []) as CmsContentModelFieldPrimitiveValue
      ))
      .filter(entry => {
        if (entry == null) {
          return false
        }
        if (typeof entry === 'string') {
          return entry.trim().length > 0
        }
        return true
      })

    return normalizedValues.length > 0 ? normalizedValues : fallbackArray
  }

  return normalizeCmsContentModelFieldPrimitiveValue(
    field,
    value,
    Array.isArray(fallbackValue)
      ? buildCmsContentModelFieldFallbackValue(field.type, field.options ?? []) as CmsContentModelFieldPrimitiveValue
      : (fallbackValue as CmsContentModelFieldPrimitiveValue | undefined)
  )
}

function hasCmsNormalizedContentModelFieldValue(
  field: CmsNormalizedContentModelFieldShape,
  value: unknown
): boolean {
  if (field.type === 'object') {
    if (!isObjectRecord(value)) {
      return false
    }

    return (field.fields ?? []).some(entry => hasCmsNormalizedContentModelFieldValue(
      entry,
      value[entry.id]
    ))
  }

  if (field.type === 'group') {
    return Array.isArray(value) && value.some(entry => {
      if (!isObjectRecord(entry)) {
        return false
      }

      return (field.fields ?? []).some(childField => hasCmsNormalizedContentModelFieldValue(
        childField,
        entry[childField.id]
      ))
    })
  }

  if (field.repeatable) {
    return Array.isArray(value) && value.some(entry => hasCmsNormalizedContentModelFieldValue({
      ...field,
      repeatable: false,
    }, entry))
  }

  switch (field.type) {
    case 'toggle':
      return typeof value === 'boolean'
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
    case 'url':
    case 'date':
    case 'media-asset':
    case 'reference':
    case 'select':
    case 'textarea':
    case 'text':
    default:
      return String(value ?? '').trim().length > 0
  }
}

function normalizeCmsContentModelFieldSettings(
  value: unknown,
  fallback: CmsContentModelFieldSettings[] = [],
  localeInput: unknown = 'en'
): CmsContentModelFieldSettings[] {
  if (!Array.isArray(value)) {
    return cloneValue(fallback)
  }

  const locale = resolveCmsLocale(localeInput)
  const seenIds = new Set<string>()
  const fallbackById = new Map(fallback.map(field => [field.id, field]))
  const normalized = value
    .map<CmsContentModelFieldSettings | null>((entry, index) => {
      if (!isObjectRecord(entry)) {
        return null
      }

      const fallbackFieldByIndex = fallback[index]
      const type = resolveCmsContentModelFieldType(entry.type)
      const fallbackLabel = `Field ${index + 1}`
      const requestedId = normalizeSegment(
        String(entry.id ?? fallbackFieldByIndex?.id ?? ''),
        fallbackFieldByIndex?.id ?? `field-${index + 1}`
      )
      const id = createUniqueValue(requestedId || `field-${index + 1}`, seenIds)
      seenIds.add(id)
      const matchedFallbackField = fallbackById.get(id) ?? fallbackFieldByIndex
      const normalizedNestedFields = type === 'object' || type === 'group'
        ? normalizeCmsContentModelFieldSettings(
            entry.fields,
            matchedFallbackField?.fields ?? [],
            locale
          )
        : []
      const normalizedOptions = type === 'select'
        ? normalizeCmsContentModelFieldOptions(entry.options, fallbackFieldByIndex?.options ?? [])
        : []
      const normalizedMediaKinds = type === 'media-asset'
        ? normalizeCmsContentModelFieldMediaKinds(
            entry.mediaKinds,
            matchedFallbackField?.mediaKinds ?? []
          )
        : []
      const normalizedReferenceKinds = type === 'reference'
        ? normalizeCmsContentModelFieldReferenceKinds(
            entry.referenceKinds,
            matchedFallbackField?.referenceKinds ?? []
          )
        : []
      const existingLocalization = {
        ...(matchedFallbackField?.localization ?? {}),
        ...(normalizeCmsContentModelFieldLocalizationSettings(entry.localization) ?? {}),
      }
      const baseLabel = matchedFallbackField?.label || fallbackLabel
      const baseDescription = matchedFallbackField?.description || ''
      const basePlaceholder = matchedFallbackField?.placeholder || ''
      const baseGroup = matchedFallbackField?.group || ''
      const rawLabel = String(entry.label ?? '').trim()
      const rawDescription = String(entry.description ?? '').trim()
      const rawPlaceholder = String(entry.placeholder ?? '').trim()
      const rawGroup = normalizeCmsContentModelFieldGroup(entry.group, baseGroup)
      const nextLabel = applyCmsLocalizedTextUpdate({
        baseValue: locale === 'en' ? (rawLabel || baseLabel) : baseLabel,
        localized: existingLocalization.label,
        localeInput: locale,
        nextValue: rawLabel || baseLabel,
      })
      const nextDescription = applyCmsLocalizedTextUpdate({
        baseValue: locale === 'en' ? rawDescription : baseDescription,
        localized: existingLocalization.description,
        localeInput: locale,
        nextValue: rawDescription,
      })
      const nextPlaceholder = applyCmsLocalizedTextUpdate({
        baseValue: locale === 'en' ? rawPlaceholder : basePlaceholder,
        localized: existingLocalization.placeholder,
        localeInput: locale,
        nextValue: rawPlaceholder,
      })
      const nextGroup = applyCmsLocalizedTextUpdate({
        baseValue: locale === 'en' ? rawGroup : baseGroup,
        localized: existingLocalization.group,
        localeInput: locale,
        nextValue: rawGroup,
      })
      const repeatable = type === 'object' || type === 'group'
        ? false
        : Boolean(entry.repeatable ?? matchedFallbackField?.repeatable)
      const visibility = normalizeCmsContentModelFieldVisibilitySettings(
        entry.visibility,
        id,
        matchedFallbackField?.visibility
      )
      const min = resolveCmsContentModelFieldConstraint(
        entry.min,
        { type, repeatable },
        matchedFallbackField?.min ?? null
      )
      const max = resolveCmsContentModelFieldConstraint(
        entry.max,
        { type, repeatable },
        matchedFallbackField?.max ?? null
      )
      const normalizedLocalization = normalizeCmsContentModelFieldLocalizationSettings({
        label: nextLabel.localized,
        description: nextDescription.localized,
        placeholder: nextPlaceholder.localized,
        group: nextGroup.localized,
      })
      const order = resolveCmsContentModelFieldOrder(
        entry.order,
        matchedFallbackField?.order ?? (index + 1)
      )

      return {
        id,
        type,
        label: nextLabel.baseValue,
        description: nextDescription.baseValue,
        placeholder: nextPlaceholder.baseValue,
        group: nextGroup.baseValue,
        order,
        required: Boolean(entry.required),
        repeatable,
        visibility,
        min,
        max: min != null && max != null && max < min ? min : max,
        defaultValue: normalizeCmsContentModelFieldValue(
          { id, type, options: normalizedOptions, repeatable, fields: normalizedNestedFields },
          entry.defaultValue,
          type === 'group'
            ? (Array.isArray(matchedFallbackField?.defaultValue)
              ? matchedFallbackField?.defaultValue
              : [])
            : type === 'object'
              ? (isObjectRecord(matchedFallbackField?.defaultValue)
                ? matchedFallbackField?.defaultValue
                : buildCmsStructuredContentModelFieldObjectValue(normalizedNestedFields))
              : repeatable
                ? (Array.isArray(matchedFallbackField?.defaultValue)
                  ? matchedFallbackField?.defaultValue
                  : [])
                : buildCmsContentModelFieldFallbackValue(type, normalizedOptions, normalizedNestedFields)
        ),
        options: type === 'select' && normalizedOptions.length > 0
          ? normalizedOptions
          : undefined,
        mediaKinds: type === 'media-asset' && normalizedMediaKinds.length > 0
          ? normalizedMediaKinds
          : undefined,
        referenceKinds: type === 'reference' && normalizedReferenceKinds.length > 0
          ? normalizedReferenceKinds
          : undefined,
        fields: normalizedNestedFields.length > 0
          ? normalizedNestedFields
          : undefined,
        localization: normalizedLocalization,
      }
    })
    .filter((entry): entry is CmsContentModelFieldSettings => entry !== null)

  return normalized.length > 0 ? normalized : cloneValue(fallback)
}

function resolveCmsContentModelFieldDefinitions(
  fields: CmsContentModelFieldSettings[] | undefined,
  localeInput: unknown = 'en'
): CmsContentModelFieldDefinition[] {
  return (fields ?? [])
    .map((field, index) => ({
      id: field.id,
      type: field.type,
      label: resolveCmsLocalizedText({
        baseValue: field.label,
        localized: field.localization?.label,
        localeInput,
      }),
      description: resolveCmsLocalizedText({
        baseValue: field.description,
        localized: field.localization?.description,
        localeInput,
      }),
      placeholder: resolveCmsLocalizedText({
        baseValue: field.placeholder,
        localized: field.localization?.placeholder,
        localeInput,
      }),
      group: resolveCmsLocalizedText({
        baseValue: field.group,
        localized: field.localization?.group,
        localeInput,
      }),
      order: resolveCmsContentModelFieldOrder(field.order, index + 1),
      required: field.required,
      repeatable: Boolean(field.repeatable),
      visibility: field.visibility
        ? {
            source: field.visibility.source,
            fieldId: field.visibility.fieldId ?? null,
            operator: field.visibility.operator,
            value: field.visibility.value ?? null,
          }
        : null,
      min: field.min ?? null,
      max: field.max ?? null,
      defaultValue: normalizeCmsContentModelFieldValue(field, field.defaultValue),
      options: cloneValue(field.options ?? []),
      mediaKinds: cloneValue(field.mediaKinds ?? []),
      referenceKinds: cloneValue(field.referenceKinds ?? []),
      fields: resolveCmsContentModelFieldDefinitions(field.fields, localeInput),
      __sortIndex: index,
    }))
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order
      }

      return left.__sortIndex - right.__sortIndex
    })
    .map(({ __sortIndex: _sortIndex, ...field }) => field)
}

function buildCmsContentModelCustomFieldDefaults(
  fields: CmsContentModelFieldDefinition[]
): Record<string, unknown> {
  return Object.fromEntries(
    fields.map(field => [field.id, normalizeCmsContentModelFieldValue(field, field.defaultValue)])
  )
}

function normalizeCmsPageCustomFieldValues(
  value: unknown,
  fields: CmsContentModelFieldDefinition[]
): Record<string, unknown> {
  const rawRecord = isObjectRecord(value) ? value : {}
  const defaults = buildCmsContentModelCustomFieldDefaults(fields)

  for (const field of fields) {
    defaults[field.id] = normalizeCmsContentModelFieldValue(
      field,
      rawRecord[field.id],
      field.defaultValue
    )
  }

  return defaults
}

function isCmsAuthoredContentModelId(value: unknown): value is CmsAuthoredContentModelId {
  const normalized = String(value ?? '').trim()
  return normalized.startsWith(AUTHORED_CONTENT_MODEL_ID_PREFIX)
    && normalized.length > AUTHORED_CONTENT_MODEL_ID_PREFIX.length
}

function resolveSectionPresetList(
  value: unknown,
  fallback: CmsSectionPresetId[] = [...ALL_SECTION_PRESET_IDS]
): CmsSectionPresetId[] {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  const normalized = value
    .map(entry => String(entry ?? '').trim())
    .filter((entry, index, entries): entry is CmsSectionPresetId => (
      Boolean(entry)
      && entry in sectionPresetCatalog
      && entries.indexOf(entry) === index
    ))

  return normalized.length > 0 ? normalized : [...fallback]
}

function resolveRecommendedSectionPresetList(
  value: unknown,
  allowedPresets: CmsSectionPresetId[],
  fallback: CmsSectionPresetId[] = [allowedPresets[0] ?? DEFAULT_SECTION_PRESET_ID]
): CmsSectionPresetId[] {
  const normalizedFallback = fallback.filter((presetId, index, entries) => (
    allowedPresets.includes(presetId)
    && entries.indexOf(presetId) === index
  ))

  if (!Array.isArray(value)) {
    return [...normalizedFallback]
  }

  const normalized = value
    .map(entry => String(entry ?? '').trim())
    .filter((entry, index, entries): entry is CmsSectionPresetId => (
      Boolean(entry)
      && allowedPresets.includes(entry as CmsSectionPresetId)
      && entries.indexOf(entry) === index
    ))

  return normalized.length > 0 ? normalized : [...normalizedFallback]
}

function resolveRequiredSectionPresetList(
  value: unknown,
  allowedPresets: CmsSectionPresetId[],
  fallback: CmsSectionPresetId[] = []
): CmsSectionPresetId[] {
  const normalizedFallback = fallback.filter((presetId, index, entries) => (
    allowedPresets.includes(presetId)
    && entries.indexOf(presetId) === index
  ))

  if (!Array.isArray(value)) {
    return [...normalizedFallback]
  }

  const normalized = value
    .map(entry => String(entry ?? '').trim())
    .filter((entry, index, entries): entry is CmsSectionPresetId => (
      Boolean(entry)
      && allowedPresets.includes(entry as CmsSectionPresetId)
      && entries.indexOf(entry) === index
    ))

  return normalized.length > 0 ? normalized : [...normalizedFallback]
}

function resolveStarterSectionPresetList(
  value: unknown,
  allowedPresets: CmsSectionPresetId[],
  fallback: CmsSectionPresetId[] = []
): CmsSectionPresetId[] {
  const normalizedFallback = fallback.filter((presetId, index, entries) => (
    allowedPresets.includes(presetId)
    && entries.indexOf(presetId) === index
  ))

  if (!Array.isArray(value)) {
    return [...normalizedFallback]
  }

  const normalized = value
    .map(entry => String(entry ?? '').trim())
    .filter((entry, index, entries): entry is CmsSectionPresetId => (
      Boolean(entry)
      && allowedPresets.includes(entry as CmsSectionPresetId)
      && entries.indexOf(entry) === index
    ))

  return normalized.length > 0 ? normalized : [...normalizedFallback]
}

function resolveMaxSections(
  value: unknown,
  minimumSections: number,
  fallback: number | null = null
): number | null {
  const parsedValue = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim().length > 0 ? Number(value) : NaN)
  const normalizedValue = Number.isFinite(parsedValue) && parsedValue > 0
    ? Math.max(1, Math.floor(parsedValue))
    : null

  if (normalizedValue == null) {
    return fallback == null ? null : Math.max(fallback, minimumSections)
  }

  return Math.max(normalizedValue, minimumSections)
}

function resolveSectionPresetLimitMap(
  value: unknown,
  allowedPresets: CmsSectionPresetId[],
  fallback: CmsSectionPresetLimitMap = {}
): CmsSectionPresetLimitMap {
  const allowedPresetIds = new Set(allowedPresets)
  const normalizedFallback = Object.fromEntries(
    Object.entries(fallback)
      .filter(([presetId, limit]) => (
        allowedPresetIds.has(presetId as CmsSectionPresetId)
        && Number.isFinite(limit)
        && Number(limit) > 0
      ))
      .map(([presetId, limit]) => [presetId, Math.max(1, Math.floor(Number(limit)))])
  ) as CmsSectionPresetLimitMap

  if (!isObjectRecord(value)) {
    return normalizedFallback
  }

  const normalizedEntries = Object.entries(value)
    .filter(([presetId, limit]) => {
      if (!allowedPresetIds.has(presetId as CmsSectionPresetId)) {
        return false
      }

      const parsedLimit = typeof limit === 'number'
        ? limit
        : (typeof limit === 'string' && limit.trim().length > 0 ? Number(limit) : NaN)

      return Number.isFinite(parsedLimit) && parsedLimit > 0
    })
    .map(([presetId, limit]) => {
      const parsedLimit = typeof limit === 'number' ? limit : Number(limit)
      return [presetId, Math.max(1, Math.floor(parsedLimit))]
    })

  return {
    ...normalizedFallback,
    ...Object.fromEntries(normalizedEntries),
  }
}

function applyStarterSequenceConstraints(
  starterPresets: CmsSectionPresetId[],
  maxSections: number | null,
  sectionPresetLimits: CmsSectionPresetLimitMap
): CmsSectionPresetId[] {
  const presetUsageCount = new Map<CmsSectionPresetId, number>()
  const constrainedStarterPresets: CmsSectionPresetId[] = []

  for (const presetId of starterPresets) {
    if (maxSections != null && constrainedStarterPresets.length >= maxSections) {
      break
    }

    const nextCount = (presetUsageCount.get(presetId) ?? 0) + 1
    const limit = sectionPresetLimits[presetId]
    if (typeof limit === 'number' && nextCount > limit) {
      continue
    }

    presetUsageCount.set(presetId, nextCount)
    constrainedStarterPresets.push(presetId)
  }

  return constrainedStarterPresets
}

function normalizeCmsContentModelId(value: unknown): string {
  return String(value ?? '').trim()
}

function getBuiltinContentModelDefinition(contentModelInput: unknown): CmsBuiltinContentModelDefinition | undefined {
  const normalized = normalizeCmsContentModelId(contentModelInput)
  return builtinContentModelCatalog.find(model => model.id === normalized)
}

function resolveAuthoredContentModelDefinition(
  localeInput: unknown,
  model: CmsAuthoredContentModelSettings
): CmsResolvedContentModelDefinition {
  const locale = resolveCmsLocale(localeInput)
  return {
    id: model.id,
    label: resolveCmsLocalizedText({
      baseValue: model.name,
      localized: model.localization?.name,
      localeInput: locale,
    }),
    description: resolveCmsLocalizedText({
      baseValue: model.description,
      localized: model.localization?.description,
      localeInput: locale,
    }),
    defaultPageTitle: resolveCmsLocalizedText({
      baseValue: model.defaultPageTitle,
      localized: model.localization?.pageTitle,
      localeInput: locale,
    }),
    defaultPageDescription: resolveCmsLocalizedText({
      baseValue: model.defaultPageDescription,
      localized: model.localization?.pageDescription,
      localeInput: locale,
    }),
    defaultPagePathPrefix: model.defaultPagePathPrefix,
    schemaVersion: resolveSchemaVersion(model.schemaVersion, 1),
    migrationNotes: resolveCmsLocalizedText({
      baseValue: String(model.migrationNotes ?? '').trim(),
      localized: model.localization?.migrationNotes,
      localeInput: locale,
    }),
    lastSchemaChangeAt: resolveIsoTimestamp(model.lastSchemaChangeAt, null),
    fields: resolveCmsContentModelFieldDefinitions(model.fields, locale),
    allowedPresets: [...model.allowedPresets],
    requiredPresets: [...model.requiredPresets],
    starterPresets: [...model.starterPresets],
    recommendedPresets: [...model.recommendedPresets],
    maxSections: model.maxSections,
    sectionPresetLimits: cloneValue(model.sectionPresetLimits),
  }
}

function resolveCmsContentModelDefinition(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsResolvedContentModelDefinition {
  const locale = resolveCmsLocale(localeInput)
  const builtinDefinition = getBuiltinContentModelDefinition(contentModelInput)
  if (builtinDefinition) {
    return {
      id: builtinDefinition.id,
      label: resolveLocalizedText(builtinDefinition.label, locale),
      description: resolveLocalizedText(builtinDefinition.description, locale),
      defaultPageTitle: resolveLocalizedText(builtinDefinition.defaultPageTitle, locale),
      defaultPageDescription: resolveLocalizedText(builtinDefinition.defaultPageDescription, locale),
      defaultPagePathPrefix: builtinDefinition.defaultPagePathPrefix,
      schemaVersion: builtinDefinition.schemaVersion,
      migrationNotes: resolveLocalizedText(builtinDefinition.migrationNotes, locale),
      lastSchemaChangeAt: builtinDefinition.lastSchemaChangeAt,
      fields: resolveCmsContentModelFieldDefinitions(builtinDefinition.fields, locale),
      allowedPresets: [...builtinDefinition.allowedPresets],
      requiredPresets: [...builtinDefinition.requiredPresets],
      starterPresets: [...builtinDefinition.starterPresets],
      recommendedPresets: [...builtinDefinition.recommendedPresets],
      maxSections: builtinDefinition.maxSections,
      sectionPresetLimits: cloneValue(builtinDefinition.sectionPresetLimits),
    }
  }

  const authoredDefinition = authoredModels.find(model => model.id === contentModelInput)
  if (authoredDefinition) {
    return resolveAuthoredContentModelDefinition(locale, authoredDefinition)
  }

  const fallbackDefinition = builtinContentModelCatalog[0]
  return {
    id: fallbackDefinition.id,
    label: resolveLocalizedText(fallbackDefinition.label, locale),
    description: resolveLocalizedText(fallbackDefinition.description, locale),
    defaultPageTitle: resolveLocalizedText(fallbackDefinition.defaultPageTitle, locale),
    defaultPageDescription: resolveLocalizedText(fallbackDefinition.defaultPageDescription, locale),
    defaultPagePathPrefix: fallbackDefinition.defaultPagePathPrefix,
    schemaVersion: fallbackDefinition.schemaVersion,
    migrationNotes: resolveLocalizedText(fallbackDefinition.migrationNotes, locale),
    lastSchemaChangeAt: fallbackDefinition.lastSchemaChangeAt,
    fields: resolveCmsContentModelFieldDefinitions(fallbackDefinition.fields, locale),
    allowedPresets: [...fallbackDefinition.allowedPresets],
    requiredPresets: [...fallbackDefinition.requiredPresets],
    starterPresets: [...fallbackDefinition.starterPresets],
    recommendedPresets: [...fallbackDefinition.recommendedPresets],
    maxSections: fallbackDefinition.maxSections,
    sectionPresetLimits: cloneValue(fallbackDefinition.sectionPresetLimits),
  }
}

function buildCmsContentModelSchemaFieldSignature(
  field: CmsContentModelFieldSettings
): Record<string, unknown> {
  return {
    id: field.id,
    type: field.type,
    group: field.group,
    order: field.order ?? null,
    required: field.required,
    repeatable: Boolean(field.repeatable),
    visibility: field.visibility
      ? {
          source: field.visibility.source,
          fieldId: field.visibility.fieldId ?? null,
          operator: field.visibility.operator,
          value: field.visibility.value ?? null,
        }
      : null,
    min: field.min ?? null,
    max: field.max ?? null,
    options: (field.options ?? []).map(option => ({
      value: option.value,
      label: option.label,
    })),
  }
}

function buildCmsContentModelSchemaSignature(
  model: Pick<
    CmsAuthoredContentModelSettings,
    | 'fields'
    | 'allowedPresets'
    | 'requiredPresets'
    | 'starterPresets'
    | 'recommendedPresets'
    | 'maxSections'
    | 'sectionPresetLimits'
  >
): string {
  return JSON.stringify({
    fields: (model.fields ?? []).map(buildCmsContentModelSchemaFieldSignature),
    allowedPresets: [...model.allowedPresets],
    requiredPresets: [...model.requiredPresets],
    starterPresets: [...model.starterPresets],
    recommendedPresets: [...model.recommendedPresets],
    maxSections: model.maxSections ?? null,
    sectionPresetLimits: Object.fromEntries(
      Object.entries(model.sectionPresetLimits)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    ),
  })
}

/**
 * Normalizes content-model localization payloads from storage/import snapshots.
 */
export function normalizeCmsContentModelLocalizationSettings(
  value: unknown
): CmsAuthoredContentModelSettings['localization'] | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const name = normalizeCmsLocalizedTextRecord(value.name)
  const description = normalizeCmsLocalizedTextRecord(value.description)
  const pageTitle = normalizeCmsLocalizedTextRecord(value.pageTitle)
  const pageDescription = normalizeCmsLocalizedTextRecord(value.pageDescription)
  const migrationNotes = normalizeCmsLocalizedTextRecord(value.migrationNotes)
  if (!name && !description && !pageTitle && !pageDescription && !migrationNotes) {
    return undefined
  }

  return {
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(pageTitle ? { pageTitle } : {}),
    ...(pageDescription ? { pageDescription } : {}),
    ...(migrationNotes ? { migrationNotes } : {}),
  }
}

/**
 * Creates the default authored content-model collection for the CMS engine.
 */
export function createDefaultCmsAuthoredContentModels(): CmsAuthoredContentModelSettings[] {
  return []
}

/**
 * Normalizes authored content-model payloads and falls back to safe defaults when malformed.
 */
export function normalizeCmsAuthoredContentModels(
  authoredModels: unknown,
  defaults: CmsAuthoredContentModelSettings[] = []
): CmsAuthoredContentModelSettings[] {
  if (!Array.isArray(authoredModels)) {
    return cloneValue(defaults)
  }

  const seenIds = new Set<string>()
  const normalized = authoredModels
    .map<CmsAuthoredContentModelSettings | null>((rawModel, index) => {
      if (!isObjectRecord(rawModel)) {
        return null
      }

      const requestedId = normalizeCmsContentModelId(rawModel.id)
      const baseId = isCmsAuthoredContentModelId(requestedId)
        ? requestedId
        : `${AUTHORED_CONTENT_MODEL_ID_PREFIX}${normalizeSegment(String(rawModel.name ?? ''), `model-${index + 1}`)}`
      const id = createUniqueValue(baseId, seenIds) as CmsAuthoredContentModelId
      seenIds.add(id)
      const modelName = String(rawModel.name ?? '').trim() || `Content model ${index + 1}`
      const defaultPageTitle = String(rawModel.defaultPageTitle ?? '').trim() || modelName
      const defaultPageDescription = String(rawModel.defaultPageDescription ?? '').trim()
      const defaultPagePathPrefix = resolvePagePathPrefix(rawModel.defaultPagePathPrefix, modelName)
      const schemaVersion = resolveSchemaVersion(rawModel.schemaVersion, 1)
      const migrationNotes = String(rawModel.migrationNotes ?? '').trim()
      const lastSchemaChangeAt = resolveIsoTimestamp(rawModel.lastSchemaChangeAt, null)
      const fields = normalizeCmsContentModelFieldSettings(rawModel.fields)

      const allowedPresets = resolveSectionPresetList(rawModel.allowedPresets)
      const requiredPresets = resolveRequiredSectionPresetList(
        rawModel.requiredPresets,
        allowedPresets
      )
      const recommendedPresets = resolveRecommendedSectionPresetList(
        rawModel.recommendedPresets,
        allowedPresets,
        [allowedPresets[0] ?? DEFAULT_SECTION_PRESET_ID]
      )
      const maxSections = resolveMaxSections(rawModel.maxSections, requiredPresets.length)
      const sectionPresetLimits = resolveSectionPresetLimitMap(
        rawModel.sectionPresetLimits,
        allowedPresets
      )
      const rawStarterPresets = resolveStarterSectionPresetList(
        rawModel.starterPresets,
        allowedPresets,
        recommendedPresets.length > 0 ? recommendedPresets : requiredPresets
      )
      const starterPresets = applyStarterSequenceConstraints(
        rawStarterPresets,
        maxSections,
        sectionPresetLimits
      )

      return {
        id,
        name: modelName,
        description: String(rawModel.description ?? '').trim(),
        defaultPageTitle,
        defaultPageDescription,
        defaultPagePathPrefix,
        schemaVersion,
        migrationNotes,
        lastSchemaChangeAt,
        fields,
        allowedPresets,
        requiredPresets,
        starterPresets,
        recommendedPresets,
        maxSections,
        sectionPresetLimits,
        localization: normalizeCmsContentModelLocalizationSettings(rawModel.localization),
      }
    })
    .filter((model): model is CmsAuthoredContentModelSettings => model !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Creates a new authored content model using the current authoring locale.
 */
export function createCmsAuthoredContentModel(input: {
  existingModels: CmsAuthoredContentModelSettings[]
  localeInput?: unknown
  name?: unknown
  description?: unknown
  defaultPageTitle?: unknown
  defaultPageDescription?: unknown
  defaultPagePathPrefix?: unknown
  migrationNotes?: unknown
  fields?: unknown
  allowedPresets?: unknown
  requiredPresets?: unknown
  starterPresets?: unknown
  recommendedPresets?: unknown
  maxSections?: unknown
  sectionPresetLimits?: unknown
}): CmsAuthoredContentModelSettings {
  const locale = resolveCmsLocale(input.localeInput)
  const occupiedIds = new Set(
    input.existingModels.map(model => String(model.id ?? '').trim()).filter(Boolean)
  )
  const normalizedName = String(input.name ?? '').trim()
  const fallbackName = locale === 'pt-BR' ? 'Modelo de conteudo' : 'Content model'
  const fallbackPageTitle = normalizedName || fallbackName
  const id = createUniqueValue(
    `${AUTHORED_CONTENT_MODEL_ID_PREFIX}${normalizeSegment(normalizedName || fallbackName, 'content-model')}`,
    occupiedIds
  ) as CmsAuthoredContentModelId
  const allowedPresets = resolveSectionPresetList(input.allowedPresets)
  const requiredPresets = resolveRequiredSectionPresetList(
    input.requiredPresets,
    allowedPresets
  )
  const recommendedPresets = resolveRecommendedSectionPresetList(
    input.recommendedPresets,
    allowedPresets,
    [allowedPresets[0] ?? DEFAULT_SECTION_PRESET_ID]
  )
  const maxSections = resolveMaxSections(input.maxSections, requiredPresets.length)
  const sectionPresetLimits = resolveSectionPresetLimitMap(
    input.sectionPresetLimits,
    allowedPresets
  )
  const starterPresets = applyStarterSequenceConstraints(resolveStarterSectionPresetList(
    input.starterPresets,
    allowedPresets,
    recommendedPresets.length > 0 ? recommendedPresets : requiredPresets
  ), maxSections, sectionPresetLimits)
  const nextName = applyCmsLocalizedTextUpdate({
    baseValue: locale === 'en' ? (normalizedName || fallbackName) : fallbackName,
    localized: undefined,
    localeInput: locale,
    nextValue: normalizedName || fallbackName,
  })
  const nextDescription = applyCmsLocalizedTextUpdate({
    baseValue: locale === 'en' ? String(input.description ?? '').trim() : '',
    localized: undefined,
    localeInput: locale,
    nextValue: String(input.description ?? '').trim(),
  })
  const nextDefaultPageTitle = applyCmsLocalizedTextUpdate({
    baseValue: locale === 'en'
      ? (String(input.defaultPageTitle ?? '').trim() || fallbackPageTitle)
      : fallbackPageTitle,
    localized: undefined,
    localeInput: locale,
    nextValue: String(input.defaultPageTitle ?? '').trim() || fallbackPageTitle,
  })
  const nextDefaultPageDescription = applyCmsLocalizedTextUpdate({
    baseValue: locale === 'en' ? String(input.defaultPageDescription ?? '').trim() : '',
    localized: undefined,
    localeInput: locale,
    nextValue: String(input.defaultPageDescription ?? '').trim(),
  })
  const nextMigrationNotes = applyCmsLocalizedTextUpdate({
    baseValue: locale === 'en' ? String(input.migrationNotes ?? '').trim() : '',
    localized: undefined,
    localeInput: locale,
    nextValue: String(input.migrationNotes ?? '').trim(),
  })
  const defaultPagePathPrefix = resolvePagePathPrefix(
    input.defaultPagePathPrefix,
    fallbackPageTitle
  )
  const fields = normalizeCmsContentModelFieldSettings(input.fields, [], locale)
  const createdAt = new Date().toISOString()

  return {
    id,
    name: nextName.baseValue,
    description: nextDescription.baseValue,
    defaultPageTitle: nextDefaultPageTitle.baseValue,
    defaultPageDescription: nextDefaultPageDescription.baseValue,
    defaultPagePathPrefix,
    schemaVersion: 1,
    migrationNotes: nextMigrationNotes.baseValue,
    lastSchemaChangeAt: createdAt,
    fields,
    allowedPresets,
    requiredPresets,
    starterPresets,
    recommendedPresets,
    maxSections,
    sectionPresetLimits,
    localization: normalizeCmsContentModelLocalizationSettings({
      name: nextName.localized,
      description: nextDescription.localized,
      pageTitle: nextDefaultPageTitle.localized,
      pageDescription: nextDefaultPageDescription.localized,
      migrationNotes: nextMigrationNotes.localized,
    }),
  }
}

/**
 * Updates one authored content model using the current authoring locale.
 */
export function updateCmsAuthoredContentModel(input: {
  model: CmsAuthoredContentModelSettings
  localeInput?: unknown
  name?: unknown
  description?: unknown
  defaultPageTitle?: unknown
  defaultPageDescription?: unknown
  defaultPagePathPrefix?: unknown
  migrationNotes?: unknown
  fields?: unknown
  allowedPresets?: unknown
  requiredPresets?: unknown
  starterPresets?: unknown
  recommendedPresets?: unknown
  maxSections?: unknown
  sectionPresetLimits?: unknown
}): CmsAuthoredContentModelSettings {
  const locale = resolveCmsLocale(input.localeInput)
  const allowedPresets = resolveSectionPresetList(
    input.allowedPresets,
    input.model.allowedPresets
  )
  const requiredPresets = resolveRequiredSectionPresetList(
    input.requiredPresets,
    allowedPresets,
    input.model.requiredPresets
  )
  const recommendedPresets = resolveRecommendedSectionPresetList(
    input.recommendedPresets,
    allowedPresets,
    [allowedPresets[0] ?? DEFAULT_SECTION_PRESET_ID]
  )
  const maxSections = resolveMaxSections(
    input.maxSections,
    requiredPresets.length,
    input.model.maxSections
  )
  const sectionPresetLimits = resolveSectionPresetLimitMap(
    input.sectionPresetLimits,
    allowedPresets,
    input.model.sectionPresetLimits
  )
  const starterPresets = applyStarterSequenceConstraints(resolveStarterSectionPresetList(
    input.starterPresets,
    allowedPresets,
    input.model.starterPresets.length > 0
      ? input.model.starterPresets
      : (recommendedPresets.length > 0 ? recommendedPresets : requiredPresets)
  ), maxSections, sectionPresetLimits)
  const nextName = applyCmsLocalizedTextUpdate({
    baseValue: input.model.name,
    localized: input.model.localization?.name,
    localeInput: locale,
    nextValue: String(input.name ?? '').trim() || input.model.name,
  })
  const nextDescription = applyCmsLocalizedTextUpdate({
    baseValue: input.model.description,
    localized: input.model.localization?.description,
    localeInput: locale,
    nextValue: String(input.description ?? '').trim(),
  })
  const nextDefaultPageTitle = applyCmsLocalizedTextUpdate({
    baseValue: input.model.defaultPageTitle,
    localized: input.model.localization?.pageTitle,
    localeInput: locale,
    nextValue: String(input.defaultPageTitle ?? '').trim() || input.model.defaultPageTitle,
  })
  const nextDefaultPageDescription = applyCmsLocalizedTextUpdate({
    baseValue: input.model.defaultPageDescription,
    localized: input.model.localization?.pageDescription,
    localeInput: locale,
    nextValue: String(input.defaultPageDescription ?? '').trim(),
  })
  const nextMigrationNotes = applyCmsLocalizedTextUpdate({
    baseValue: String(input.model.migrationNotes ?? '').trim(),
    localized: input.model.localization?.migrationNotes,
    localeInput: locale,
    nextValue: String(input.migrationNotes ?? '').trim(),
  })
  const defaultPagePathPrefix = resolvePagePathPrefix(
    input.defaultPagePathPrefix,
    input.model.defaultPagePathPrefix
  )
  const fields = normalizeCmsContentModelFieldSettings(
    input.fields,
    input.model.fields ?? [],
    locale
  )
  const currentSchemaVersion = resolveSchemaVersion(input.model.schemaVersion, 1)
  const schemaChanged = buildCmsContentModelSchemaSignature(input.model) !== buildCmsContentModelSchemaSignature({
    fields,
    allowedPresets,
    requiredPresets,
    starterPresets,
    recommendedPresets,
    maxSections,
    sectionPresetLimits,
  })
  const nextSchemaVersion = schemaChanged
    ? currentSchemaVersion + 1
    : currentSchemaVersion
  const nextLastSchemaChangeAt = schemaChanged
    ? new Date().toISOString()
    : resolveIsoTimestamp(input.model.lastSchemaChangeAt, null)

  return {
    ...input.model,
    name: nextName.baseValue,
    description: nextDescription.baseValue,
    defaultPageTitle: nextDefaultPageTitle.baseValue,
    defaultPageDescription: nextDefaultPageDescription.baseValue,
    defaultPagePathPrefix,
    schemaVersion: nextSchemaVersion,
    migrationNotes: nextMigrationNotes.baseValue,
    lastSchemaChangeAt: nextLastSchemaChangeAt,
    fields,
    allowedPresets,
    requiredPresets,
    starterPresets,
    recommendedPresets,
    maxSections,
    sectionPresetLimits,
    localization: normalizeCmsContentModelLocalizationSettings({
      name: nextName.localized,
      description: nextDescription.localized,
      pageTitle: nextDefaultPageTitle.localized,
      pageDescription: nextDefaultPageDescription.localized,
      migrationNotes: nextMigrationNotes.localized,
    }),
  }
}

/**
 * Resolves a content model id, falling back to the default model when unknown.
 */
export function resolveCmsContentModelId(
  value: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsContentModelId {
  const normalized = normalizeCmsContentModelId(value)
  if (getBuiltinContentModelDefinition(normalized)) {
    return normalized as CmsBuiltinContentModelId
  }

  if (authoredModels.some(model => model.id === normalized)) {
    return normalized as CmsAuthoredContentModelId
  }

  return DEFAULT_CONTENT_MODEL_ID
}

/**
 * Resolves a section preset id, falling back to a safe default when unknown.
 */
export function resolveCmsSectionPresetId(value: unknown): CmsSectionPresetId {
  const normalized = String(value ?? '').trim()
  return normalized in sectionPresetCatalog
    ? normalized as CmsSectionPresetId
    : DEFAULT_SECTION_PRESET_ID
}

/**
 * Returns all localized section preset options for authored-model editors.
 */
export function listAllCmsSectionPresetOptions(localeInput: unknown): CmsSectionPresetOption[] {
  const locale = resolveCmsLocale(localeInput)
  return ALL_SECTION_PRESET_IDS.map(presetId => {
    const preset = resolveCmsSectionPresetDefinition(locale, presetId)
    return {
      value: preset.id,
      label: preset.label,
      description: preset.description,
    }
  })
}

/**
 * Returns localized content model options for the page builder.
 */
export function listCmsContentModelOptions(
  localeInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsContentModelOption[] {
  const locale = resolveCmsLocale(localeInput)
  const builtinOptions = builtinContentModelCatalog.map(model => ({
    value: model.id,
    label: resolveLocalizedText(model.label, locale),
    description: resolveLocalizedText(model.description, locale),
  }))
  const authoredOptions = authoredModels.map(model => {
    const resolved = resolveAuthoredContentModelDefinition(locale, model)
    return {
      value: resolved.id,
      label: resolved.label,
      description: resolved.description,
    }
  })

  return [...builtinOptions, ...authoredOptions]
}

/**
 * Returns localized section preset options filtered by content model.
 */
export function listCmsSectionPresetOptions(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsSectionPresetOption[] {
  const locale = resolveCmsLocale(localeInput)
  const model = resolveCmsContentModelDefinition(locale, contentModelInput, authoredModels)

  return model.allowedPresets.map(presetId => {
    const preset = resolveCmsSectionPresetDefinition(locale, presetId)
    return {
      value: preset.id,
      label: preset.label,
      description: preset.description,
    }
  })
}

/**
 * Returns the resolved runtime contract for one section preset.
 */
export function getCmsSectionPresetDefinition(
  localeInput: unknown,
  presetInput: unknown
): CmsResolvedSectionPresetDefinition {
  return resolveCmsSectionPresetDefinition(localeInput, presetInput)
}

/**
 * Lists block types accepted by one section preset contract.
 */
export function getCmsSectionPresetAllowedBlockTypes(
  presetInput: unknown
): string[] {
  return [...resolveCmsSectionPresetDefinition('en', presetInput).allowedBlockTypes]
}

/**
 * Returns the block-count limits for one section preset contract.
 */
export function getCmsSectionPresetBlockLimits(
  presetInput: unknown
): {
  minBlocks: number
  maxBlocks: number | null
} {
  const preset = resolveCmsSectionPresetDefinition('en', presetInput)
  return {
    minBlocks: preset.minBlocks,
    maxBlocks: preset.maxBlocks,
  }
}

/**
 * Returns resolved section-level field definitions for one section preset.
 */
export function getCmsSectionPresetFieldDefinitions(
  localeInput: unknown,
  presetInput: unknown
): CmsContentModelFieldDefinition[] {
  return cloneValue(
    resolveCmsSectionPresetDefinition(localeInput, presetInput).fields
  )
}

/**
 * Builds section-level custom field defaults from one section preset contract.
 */
export function createCmsSectionCustomFieldsFromPreset(
  presetInput: unknown,
  localeInput: unknown
): Record<string, unknown> {
  return buildCmsContentModelCustomFieldDefaults(
    getCmsSectionPresetFieldDefinitions(localeInput, presetInput)
  )
}

/**
 * Normalizes section-level custom field values against one section preset schema.
 */
export function normalizeCmsSectionCustomFieldsForPreset(
  value: unknown,
  presetInput: unknown,
  localeInput: unknown
): Record<string, unknown> {
  return normalizeCmsPageCustomFieldValues(
    value,
    getCmsSectionPresetFieldDefinitions(localeInput, presetInput)
  )
}

/**
 * Checks whether one block type can be authored inside a section preset.
 */
export function isCmsBlockTypeAllowedForSectionPreset(
  presetInput: unknown,
  blockTypeInput: unknown
): boolean {
  const blockType = String(blockTypeInput ?? '').trim()
  if (!blockType) {
    return false
  }

  return getCmsSectionPresetAllowedBlockTypes(presetInput).includes(blockType)
}

/**
 * Checks whether one block preset can be authored inside a section preset.
 */
export function isCmsBlockPresetAllowedForSectionPreset(
  presetInput: unknown,
  presetIdInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): boolean {
  const resolvedPresetId = resolveCmsBlockPresetId(presetIdInput)
  if (resolvedPresetId === 'custom') {
    return true
  }

  const definition = getCmsBlockPresetDefinition(resolvedPresetId, authoredPresets)
  if (!definition) {
    return false
  }

  if (!isCmsBlockTypeAllowedForSectionPreset(presetInput, definition.type)) {
    return false
  }

  return definition.source === 'builtin'
    || definition.starterSectionPresets.length === 0
    || definition.starterSectionPresets.includes(resolveCmsSectionPresetId(presetInput))
}

/**
 * Returns resolved field definitions for one content model.
 */
export function getCmsContentModelFieldDefinitions(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsContentModelFieldDefinition[] {
  return cloneValue(
    resolveCmsContentModelDefinition(localeInput, contentModelInput, authoredModels).fields
  )
}

/**
 * Normalizes authored schema-field settings outside one full content-model payload.
 */
export function normalizeCmsContentModelFieldSettingsList(
  value: unknown,
  localeInput: unknown = 'en',
  fallback: CmsContentModelFieldSettings[] = []
): CmsContentModelFieldSettings[] {
  return normalizeCmsContentModelFieldSettings(value, fallback, localeInput)
}

/**
 * Builds a page-level custom field payload from the content-model defaults.
 */
export function createCmsPageCustomFieldsFromContentModel(
  contentModelInput: unknown,
  localeInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): Record<string, unknown> {
  return buildCmsContentModelCustomFieldDefaults(
    getCmsContentModelFieldDefinitions(localeInput, contentModelInput, authoredModels)
  )
}

/**
 * Normalizes page-level custom field values against one content-model schema.
 */
export function normalizeCmsPageCustomFieldsForContentModel(
  value: unknown,
  contentModelInput: unknown,
  localeInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): Record<string, unknown> {
  return normalizeCmsPageCustomFieldValues(
    value,
    getCmsContentModelFieldDefinitions(localeInput, contentModelInput, authoredModels)
  )
}

/**
 * Normalizes one field value against its schema definition.
 */
export function coerceCmsContentModelFieldValue(
  field: Pick<CmsContentModelFieldDefinition, 'id' | 'type' | 'options' | 'defaultValue' | 'repeatable' | 'fields'>,
  value: unknown
): CmsContentModelFieldValue {
  return normalizeCmsContentModelFieldValue(field, value, field.defaultValue)
}

function evaluateCmsContentModelFieldVisibilityRule(
  rule: CmsContentModelFieldVisibilityDefinition,
  targetValue: unknown,
  pageStatus: CmsPageSettings['status']
): boolean {
  switch (rule.operator) {
    case 'is-empty':
      return targetValue == null
        || (typeof targetValue === 'string' && targetValue.trim().length === 0)
        || (Array.isArray(targetValue) && targetValue.length === 0)
    case 'is-not-empty':
      return !evaluateCmsContentModelFieldVisibilityRule({ ...rule, operator: 'is-empty' }, targetValue, pageStatus)
    case 'is-true':
      return targetValue === true
    case 'is-false':
      return targetValue === false
    case 'contains':
      if (Array.isArray(targetValue)) {
        return targetValue.some(entry => String(entry ?? '').trim() === String(rule.value ?? '').trim())
      }
      return String(targetValue ?? '').includes(String(rule.value ?? ''))
    case 'not-equals':
      return String(targetValue ?? pageStatus ?? '').trim() !== String(rule.value ?? '').trim()
    case 'equals':
    default:
      return String(targetValue ?? pageStatus ?? '').trim() === String(rule.value ?? '').trim()
  }
}

export function isCmsContentModelFieldVisible(
  field: CmsContentModelFieldDefinition,
  fields: CmsContentModelFieldDefinition[],
  context: CmsContentModelFieldVisibilityContext,
  visitedFieldIds: Set<string> = new Set()
): boolean {
  if (!field.visibility) {
    return true
  }

  if (visitedFieldIds.has(field.id)) {
    return true
  }

  if (field.visibility.source === 'page-status') {
    return evaluateCmsContentModelFieldVisibilityRule(
      field.visibility,
      context.pageStatus,
      context.pageStatus
    )
  }

  const targetFieldId = field.visibility.fieldId
  if (!targetFieldId) {
    return true
  }

  const targetField = fields.find(entry => entry.id === targetFieldId)
  if (!targetField) {
    return true
  }

  const nextVisited = new Set(visitedFieldIds)
  nextVisited.add(field.id)
  if (!isCmsContentModelFieldVisible(targetField, fields, context, nextVisited)) {
    return false
  }

  const targetValue = coerceCmsContentModelFieldValue(
    targetField,
    context.customFields[targetField.id] ?? targetField.defaultValue
  )

  return evaluateCmsContentModelFieldVisibilityRule(
    field.visibility,
    targetValue,
    context.pageStatus
  )
}

export function filterCmsVisibleContentModelFields(
  fields: CmsContentModelFieldDefinition[],
  context: CmsContentModelFieldVisibilityContext
): CmsContentModelFieldDefinition[] {
  return fields.filter(field => isCmsContentModelFieldVisible(field, fields, context))
}

/**
 * Returns localized starter block preset options for a given section preset.
 */
export function listCmsSectionStarterPresetOptions(
  localeInput: unknown,
  sectionPresetInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): CmsSectionStarterPresetOption[] {
  const locale = resolveCmsLocale(localeInput)
  const sectionPresetId = resolveCmsSectionPresetId(sectionPresetInput)
  const defaultPresetId = getDefaultCmsBlockPresetIdForSectionPreset(sectionPresetId)
  const compatibleDefinitions = Array.from(new Map(
    getCmsSectionPresetAllowedBlockTypes(sectionPresetId)
      .flatMap(blockType => listCmsBlockPresetDefinitionsForType(
        blockType,
        locale,
        authoredPresets
      ))
      .filter(definition => isCmsBlockPresetAllowedForSectionPreset(
        sectionPresetId,
        definition.id,
        authoredPresets
      ))
      .map(definition => [definition.id, definition])
  ).values())

  const ordered = [
    ...compatibleDefinitions.filter(definition => definition.id === defaultPresetId),
    ...compatibleDefinitions.filter(definition => definition.id !== defaultPresetId),
  ]

  return [
    ...ordered.map(definition => ({
      value: definition.id,
      label: definition.name,
      description: definition.description,
      source: definition.source,
      category: definition.category,
      isDefault: definition.id === defaultPresetId,
    })),
    {
      value: 'custom',
      label: locale === 'pt-BR' ? 'Customizado' : 'Custom',
      description: locale === 'pt-BR'
        ? 'Secao inicializada sem preset de bloco.'
        : 'Section starts without a block preset.',
      source: 'custom',
      category: 'custom',
      isDefault: defaultPresetId === 'custom',
    },
  ]
}

/**
 * Checks whether a section preset is allowed by a given content model.
 */
export function isCmsSectionPresetAllowedForContentModel(
  contentModelInput: unknown,
  presetInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): boolean {
  const presetId = resolveCmsSectionPresetId(presetInput)
  const model = resolveCmsContentModelDefinition('en', contentModelInput, authoredModels)
  return model.allowedPresets.includes(presetId)
}

/**
 * Returns the localized label for a content model id.
 */
export function getCmsContentModelLabel(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): string {
  return resolveCmsContentModelDefinition(localeInput, contentModelInput, authoredModels).label
}

/**
 * Returns the localized description for a content model id.
 */
export function getCmsContentModelDescription(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): string {
  return resolveCmsContentModelDefinition(localeInput, contentModelInput, authoredModels).description
}

/**
 * Returns the schema version declared by one content model.
 */
export function getCmsContentModelSchemaVersion(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): number {
  return resolveCmsContentModelDefinition('en', contentModelInput, authoredModels).schemaVersion
}

/**
 * Returns localized migration notes for one content model.
 */
export function getCmsContentModelMigrationNotes(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): string {
  return resolveCmsContentModelDefinition(localeInput, contentModelInput, authoredModels).migrationNotes
}

/**
 * Returns the last schema-change timestamp recorded by one content model.
 */
export function getCmsContentModelLastSchemaChangeAt(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): string | null {
  return resolveCmsContentModelDefinition('en', contentModelInput, authoredModels).lastSchemaChangeAt
}

/**
 * Returns the localized default page title for a content model id.
 */
export function getCmsContentModelDefaultPageTitle(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): string {
  return resolveCmsContentModelDefinition(localeInput, contentModelInput, authoredModels).defaultPageTitle
}

/**
 * Returns the localized default page description for a content model id.
 */
export function getCmsContentModelDefaultPageDescription(
  localeInput: unknown,
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): string {
  return resolveCmsContentModelDefinition(localeInput, contentModelInput, authoredModels).defaultPageDescription
}

/**
 * Returns the default page path prefix for a content model id.
 */
export function getCmsContentModelDefaultPagePathPrefix(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): string {
  return resolveCmsContentModelDefinition('en', contentModelInput, authoredModels).defaultPagePathPrefix
}

/**
 * Resolves the default section preset for a content model.
 */
export function getDefaultCmsSectionPresetId(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsSectionPresetId {
  const model = resolveCmsContentModelDefinition('en', contentModelInput, authoredModels)
  return model.recommendedPresets[0] ?? DEFAULT_SECTION_PRESET_ID
}

/**
 * Lists required section presets for a given content model.
 */
export function getCmsRequiredSectionPresetIds(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsSectionPresetId[] {
  return [...resolveCmsContentModelDefinition('en', contentModelInput, authoredModels).requiredPresets]
}

/**
 * Lists starter section presets for a given content model scaffold.
 */
export function getCmsStarterSectionPresetIds(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsSectionPresetId[] {
  return [...resolveCmsContentModelDefinition('en', contentModelInput, authoredModels).starterPresets]
}

/**
 * Returns the max enabled section count allowed by a content model.
 */
export function getCmsContentModelMaxSections(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): number | null {
  return resolveCmsContentModelDefinition('en', contentModelInput, authoredModels).maxSections
}

/**
 * Returns the per-preset repetition limits declared by a content model.
 */
export function getCmsContentModelSectionPresetLimitMap(
  contentModelInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsSectionPresetLimitMap {
  return cloneValue(resolveCmsContentModelDefinition('en', contentModelInput, authoredModels).sectionPresetLimits)
}

/**
 * Resolves a landing block type from either explicit preset id or section identifier.
 */
export function resolveDefaultCmsBlockTypeForSection(
  sectionIdInput: unknown,
  presetIdInput?: unknown
): string {
  const presetId = String(presetIdInput ?? '').trim()
  if (presetId && presetId in sectionPresetCatalog) {
    return sectionPresetCatalog[presetId as CmsSectionPresetId].blockType
  }

  const normalized = normalizeSegment(String(sectionIdInput ?? ''), 'section')
  switch (normalized) {
    case 'header':
      return sectionPresetCatalog.header.blockType
    case 'hero':
      return sectionPresetCatalog.hero.blockType
    case 'stats':
      return sectionPresetCatalog.stats.blockType
    case 'metrics':
      return sectionPresetCatalog.metrics.blockType
    case 'features':
      return sectionPresetCatalog.features.blockType
    case 'benefits':
      return sectionPresetCatalog.benefits.blockType
    case 'installation':
      return sectionPresetCatalog.installation.blockType
    case 'cta':
      return sectionPresetCatalog.cta.blockType
    case 'footer':
      return sectionPresetCatalog.footer.blockType
    default:
      return sectionPresetCatalog.custom.blockType
  }
}

/**
 * Detects the most likely section preset from a persisted section payload.
 */
export function detectCmsSectionPresetId(input: {
  presetId?: unknown
  sectionId?: unknown
  blockType?: unknown
}): CmsSectionPresetId {
  const explicitPresetId = String(input.presetId ?? '').trim()
  if (explicitPresetId && explicitPresetId in sectionPresetCatalog) {
    return explicitPresetId as CmsSectionPresetId
  }

  const normalizedSectionId = normalizeSegment(String(input.sectionId ?? ''), '')
  if (normalizedSectionId && normalizedSectionId in sectionPresetCatalog) {
    return normalizedSectionId as CmsSectionPresetId
  }

  const blockType = String(input.blockType ?? '').trim()
  const matchedPreset = Object.values(sectionPresetCatalog).find(preset => preset.blockType === blockType)
  return matchedPreset?.id ?? 'custom'
}

/**
 * Detects the best content model for a persisted page payload.
 */
export function detectCmsContentModelIdForPage(
  page: Partial<CmsPageSettings>,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsContentModelId {
  const explicitModelId = normalizeCmsContentModelId(page.contentModelId)
  if (explicitModelId) {
    const isKnownBuiltin = Boolean(getBuiltinContentModelDefinition(explicitModelId))
    const isKnownAuthored = authoredModels.some(model => model.id === explicitModelId)
    if (isKnownBuiltin || isKnownAuthored) {
      return resolveCmsContentModelId(explicitModelId, authoredModels)
    }
  }

  const sectionPresetIds = new Set(
    Array.isArray(page.sections)
      ? page.sections.map(section => detectCmsSectionPresetId({
        presetId: section?.presetId,
        sectionId: section?.id,
        blockType: section?.blocks?.[0]?.type,
      }))
      : []
  )

  if (sectionPresetIds.has('metrics') || sectionPresetIds.has('benefits')) {
    return 'marketing-page'
  }

  if (sectionPresetIds.size <= 2 && sectionPresetIds.has('hero') && sectionPresetIds.has('footer')) {
    return 'blank-page'
  }

  return DEFAULT_CONTENT_MODEL_ID
}

/**
 * Creates a new section scaffold from a preset and guarantees unique ids within a page.
 */
export function createCmsPageSectionFromPreset(input: {
  presetId: unknown
  existingSections: CmsPageSectionSettings[]
  localeInput?: unknown
  starterPresetId?: unknown
  authoredPresets?: CmsAuthoredBlockPresetSettings[]
}): CmsPageSectionSettings {
  const presetId = resolveCmsSectionPresetId(input.presetId)
  const preset = sectionPresetCatalog[presetId]
  const occupiedSectionIds = new Set(
    input.existingSections.map(section => String(section.id ?? '').trim()).filter(Boolean)
  )
  const occupiedBlockIds = new Set(
    input.existingSections.flatMap(section => section.blocks.map(block => String(block.id ?? '').trim()).filter(Boolean))
  )

  const sectionId = createUniqueValue(
    normalizeSegment(preset.defaultSectionId, 'section'),
    occupiedSectionIds
  )
  const blockId = createUniqueValue(`${sectionId}-block-1`, occupiedBlockIds)
  const requestedStarterPresetId = String(input.starterPresetId ?? '').trim()
  const starterOptions = new Set(
    listCmsSectionStarterPresetOptions(
      input.localeInput,
      preset.id,
      input.authoredPresets ?? []
    ).map(option => option.value)
  )
  const resolvedRequestedStarterPresetId = requestedStarterPresetId
    ? resolveCmsBlockPresetId(requestedStarterPresetId)
    : null
  const blockPresetId = resolvedRequestedStarterPresetId && starterOptions.has(resolvedRequestedStarterPresetId)
    ? resolvedRequestedStarterPresetId
    : getDefaultCmsBlockPresetIdForSectionPreset(preset.id)
  const block = blockPresetId === 'custom'
    ? {
      id: blockId,
      type: preset.blockType,
      presetId: 'custom' as const,
      enabled: preset.defaultEnabled,
      props: {},
    }
    : createCmsPageBlockFromPreset({
      presetId: blockPresetId,
      blockId,
      enabled: preset.defaultEnabled,
      authoredPresets: input.authoredPresets,
    })

  return {
    id: sectionId,
    presetId,
    label: preset.defaultLabel.en,
    enabled: preset.defaultEnabled,
    customFields: createCmsSectionCustomFieldsFromPreset(presetId, input.localeInput ?? 'en'),
    localization: {
      label: createLocalizedTextRecord(preset.defaultLabel),
    },
    blocks: [
      block,
    ],
  }
}

/**
 * Creates an ordered section scaffold from the selected content model.
 */
export function createCmsPageSectionsFromContentModel(input: {
  contentModelId: unknown
  existingSections?: CmsPageSectionSettings[]
  localeInput?: unknown
  authoredModels?: CmsAuthoredContentModelSettings[]
  authoredPresets?: CmsAuthoredBlockPresetSettings[]
}): CmsPageSectionSettings[] {
  const starterPresetIds = getCmsStarterSectionPresetIds(
    input.contentModelId,
    input.authoredModels ?? []
  )
  const existingSections = Array.isArray(input.existingSections) ? input.existingSections : []

  return starterPresetIds.reduce<CmsPageSectionSettings[]>((sections, presetId) => {
    sections.push(createCmsPageSectionFromPreset({
      presetId,
      existingSections: sections,
      localeInput: input.localeInput,
      authoredPresets: input.authoredPresets,
    }))
    return sections
  }, [...existingSections])
}