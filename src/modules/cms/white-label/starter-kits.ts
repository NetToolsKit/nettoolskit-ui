/**
 * Guided starter-kit bundles for common landing-page authoring flows.
 * These bundles compose existing engine primitives instead of introducing a
 * parallel template system: page templates, reusable sections, reusable blocks,
 * authored block presets and schema-field presets.
 */
import {
  createCmsAuthoredBlockPresetFromBlock,
} from './block-presets'
import { normalizeCmsPageCustomFieldsForContentModel } from './content-models'
import { resolveCmsLocale } from './i18n'
import {
  createCmsPageFromTemplate,
  listCmsPageQuickStartOptions,
  listCmsPageTemplateOptions,
  type CmsPageTemplateId,
} from './page-templates'
import { createCmsReusableBlockFromBlock } from './reusable-blocks'
import { createCmsReusableSectionFromSection } from './reusable-sections'
import { createCmsAuthoredContentModelFieldPreset } from './schema-field-presets'
import type {
  CmsAuthoredBlockPresetSettings,
  CmsAuthoredContentModelFieldPresetSettings,
  CmsAuthoredContentModelSettings,
  CmsContentModelFieldSettings,
  CmsLocale,
  CmsPageBlockSettings,
  CmsPageSettings,
  CmsReusableBlockSettings,
  CmsReusableSectionSettings,
} from './types'

export type CmsStarterKitId =
  | 'starter-product-launch'
  | 'starter-growth-funnel'
  | 'starter-docs-hub'

export interface CmsStarterKitOption {
  value: CmsStarterKitId
  label: string
  description: string
  templateLabel: string
  contentModelLabel: string
  sectionCount: number
  reusableSectionCount: number
  reusableBlockCount: number
  blockPresetCount: number
  fieldPresetCount: number
}

export interface CmsStarterKitBundle {
  kitId: CmsStarterKitId
  templateId: CmsPageTemplateId
  page: CmsPageSettings
  reusableSections: CmsReusableSectionSettings[]
  reusableBlocks: CmsReusableBlockSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
  authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[]
}

interface CmsLocalizedText {
  en: string
  'pt-BR': string
}

interface CmsStarterKitReusableSeed {
  sectionPresetId: string
  name: CmsLocalizedText
  description: CmsLocalizedText
  category: string
}

interface CmsStarterKitFieldPresetSeed {
  name: CmsLocalizedText
  description: CmsLocalizedText
  category: string
  field: CmsContentModelFieldSettings
}

interface CmsStarterKitDefinition {
  id: CmsStarterKitId
  templateId: CmsPageTemplateId
  label: CmsLocalizedText
  description: CmsLocalizedText
  reusableSections: CmsStarterKitReusableSeed[]
  reusableBlocks: CmsStarterKitReusableSeed[]
  authoredBlockPresets: CmsStarterKitReusableSeed[]
  fieldPresets: CmsStarterKitFieldPresetSeed[]
}

interface CmsStarterKitSettingsContext {
  pages: CmsPageSettings[]
  reusableSections: CmsReusableSectionSettings[]
  reusableBlocks: CmsReusableBlockSettings[]
  authoredBlockPresets: CmsAuthoredBlockPresetSettings[]
  authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[]
  authoredContentModels: CmsAuthoredContentModelSettings[]
}

const starterKitCatalog: ReadonlyArray<CmsStarterKitDefinition> = [
  {
    id: 'starter-product-launch',
    templateId: 'landing-default',
    label: {
      en: 'Starter kit · Product launch',
      'pt-BR': 'Starter kit · Lancamento de produto',
    },
    description: {
      en: 'Seed a product-facing landing page plus reusable launch sections, block presets and schema fields.',
      'pt-BR': 'Semeia uma landing de produto com secoes reutilizaveis de lancamento, presets de bloco e campos de schema.',
    },
    reusableSections: [
      {
        sectionPresetId: 'hero',
        name: { en: 'Launch hero section', 'pt-BR': 'Secao hero de lancamento' },
        description: { en: 'Reusable hero tuned for launch messaging.', 'pt-BR': 'Hero reutilizavel ajustado para mensagens de lancamento.' },
        category: 'launch',
      },
      {
        sectionPresetId: 'installation',
        name: { en: 'Activation CTA section', 'pt-BR': 'Secao de CTA de ativacao' },
        description: { en: 'Reusable CTA focused on onboarding and first activation.', 'pt-BR': 'CTA reutilizavel focado em onboarding e primeira ativacao.' },
        category: 'launch',
      },
      {
        sectionPresetId: 'footer',
        name: { en: 'Launch footer section', 'pt-BR': 'Secao de rodape de lancamento' },
        description: { en: 'Footer links curated for launch campaigns.', 'pt-BR': 'Rodape com links curados para campanhas de lancamento.' },
        category: 'launch',
      },
    ],
    reusableBlocks: [
      {
        sectionPresetId: 'hero',
        name: { en: 'Launch hero block', 'pt-BR': 'Bloco hero de lancamento' },
        description: { en: 'Hero block ready for product launch copy and CTAs.', 'pt-BR': 'Bloco hero pronto para copy e CTAs de lancamento.' },
        category: 'launch',
      },
      {
        sectionPresetId: 'features',
        name: { en: 'Launch proof block', 'pt-BR': 'Bloco de prova de lancamento' },
        description: { en: 'Feature block centered on launch differentiators.', 'pt-BR': 'Bloco de features centrado em diferenciais de lancamento.' },
        category: 'launch',
      },
      {
        sectionPresetId: 'installation',
        name: { en: 'Activation CTA block', 'pt-BR': 'Bloco CTA de ativacao' },
        description: { en: 'CTA block tuned for onboarding or trial activation.', 'pt-BR': 'Bloco CTA ajustado para onboarding ou ativacao de trial.' },
        category: 'launch',
      },
    ],
    authoredBlockPresets: [
      {
        sectionPresetId: 'hero',
        name: { en: 'Preset · Product launch hero', 'pt-BR': 'Preset · Hero de lancamento de produto' },
        description: { en: 'Reusable authored preset for launch hero variants.', 'pt-BR': 'Preset reutilizavel para variacoes de hero de lancamento.' },
        category: 'launch',
      },
      {
        sectionPresetId: 'features',
        name: { en: 'Preset · Launch value strip', 'pt-BR': 'Preset · Faixa de valor de lancamento' },
        description: { en: 'Reusable authored preset for launch proof/value blocks.', 'pt-BR': 'Preset reutilizavel para blocos de prova e valor de lancamento.' },
        category: 'launch',
      },
      {
        sectionPresetId: 'installation',
        name: { en: 'Preset · Activation CTA', 'pt-BR': 'Preset · CTA de ativacao' },
        description: { en: 'Reusable authored preset for activation CTAs.', 'pt-BR': 'Preset reutilizavel para CTAs de ativacao.' },
        category: 'launch',
      },
    ],
    fieldPresets: [
      {
        name: { en: 'Launch date', 'pt-BR': 'Data de lancamento' },
        description: { en: 'Primary go-live date for the launch page.', 'pt-BR': 'Data principal de go-live para a pagina de lancamento.' },
        category: 'campaign',
        field: {
          id: 'launchdate',
          type: 'date',
          label: 'Launch date',
          description: 'Primary go-live date for this launch page.',
          placeholder: '',
          group: 'Campaign',
          order: 1,
          required: false,
          defaultValue: '',
          localization: {
            label: { 'pt-BR': 'Data de lancamento' },
            description: { 'pt-BR': 'Data principal de go-live desta pagina de lancamento.' },
            group: { 'pt-BR': 'Campanha' },
          },
        },
      },
      {
        name: { en: 'Hero asset', 'pt-BR': 'Asset do hero' },
        description: { en: 'Image or media asset used in the hero showcase.', 'pt-BR': 'Imagem ou asset de midia usado no showcase do hero.' },
        category: 'assets',
        field: {
          id: 'heroasset',
          type: 'media-asset',
          label: 'Hero asset',
          description: 'Visual asset used in the hero section.',
          placeholder: '',
          group: 'Assets',
          order: 2,
          required: false,
          defaultValue: '',
          mediaKinds: ['image', 'video'],
          localization: {
            label: { 'pt-BR': 'Asset do hero' },
            description: { 'pt-BR': 'Asset visual usado na secao hero.' },
            group: { 'pt-BR': 'Assets' },
          },
        },
      },
      {
        name: { en: 'Primary announcement', 'pt-BR': 'Anuncio principal' },
        description: { en: 'Short badge or announcement copy for launch messaging.', 'pt-BR': 'Copy curta de badge ou anuncio para mensagens de lancamento.' },
        category: 'copy',
        field: {
          id: 'primaryannouncement',
          type: 'text',
          label: 'Primary announcement',
          description: 'Short badge or announcement copy.',
          placeholder: 'Now live',
          group: 'Copy',
          order: 3,
          required: false,
          defaultValue: '',
          localization: {
            label: { 'pt-BR': 'Anuncio principal' },
            description: { 'pt-BR': 'Copy curta de badge ou anuncio.' },
            placeholder: { 'pt-BR': 'Ja disponivel' },
            group: { 'pt-BR': 'Copy' },
          },
        },
      },
    ],
  },
  {
    id: 'starter-growth-funnel',
    templateId: 'marketing',
    label: {
      en: 'Starter kit · Growth funnel',
      'pt-BR': 'Starter kit · Funil de crescimento',
    },
    description: {
      en: 'Seed a marketing funnel page with KPI sections, conversion presets and campaign-oriented schema fields.',
      'pt-BR': 'Semeia uma pagina de funil com KPIs, presets de conversao e campos de schema orientados a campanha.',
    },
    reusableSections: [
      {
        sectionPresetId: 'hero',
        name: { en: 'Growth hero section', 'pt-BR': 'Secao hero de crescimento' },
        description: { en: 'Hero section tuned for campaigns and acquisition copy.', 'pt-BR': 'Hero ajustado para campanhas e copy de aquisicao.' },
        category: 'growth',
      },
      {
        sectionPresetId: 'metrics',
        name: { en: 'Funnel KPI section', 'pt-BR': 'Secao de KPIs do funil' },
        description: { en: 'Reusable KPI section for conversion and pipeline metrics.', 'pt-BR': 'Secao reutilizavel de KPIs para conversao e pipeline.' },
        category: 'growth',
      },
      {
        sectionPresetId: 'cta',
        name: { en: 'Conversion CTA section', 'pt-BR': 'Secao de CTA de conversao' },
        description: { en: 'Reusable CTA section for lead capture and conversion.' , 'pt-BR': 'Secao reutilizavel de CTA para captura de leads e conversao.' },
        category: 'growth',
      },
    ],
    reusableBlocks: [
      {
        sectionPresetId: 'hero',
        name: { en: 'Growth hero block', 'pt-BR': 'Bloco hero de crescimento' },
        description: { en: 'Campaign hero block with stronger funnel framing.', 'pt-BR': 'Bloco hero de campanha com framing mais forte de funil.' },
        category: 'growth',
      },
      {
        sectionPresetId: 'metrics',
        name: { en: 'Growth KPI block', 'pt-BR': 'Bloco de KPIs de crescimento' },
        description: { en: 'Metric strip for funnel and revenue storytelling.', 'pt-BR': 'Faixa de metricas para narrativa de funil e receita.' },
        category: 'growth',
      },
      {
        sectionPresetId: 'cta',
        name: { en: 'Growth conversion block', 'pt-BR': 'Bloco de conversao de crescimento' },
        description: { en: 'CTA block for high-intent acquisition moments.', 'pt-BR': 'Bloco CTA para momentos de aquisicao de alta intencao.' },
        category: 'growth',
      },
    ],
    authoredBlockPresets: [
      {
        sectionPresetId: 'hero',
        name: { en: 'Preset · Growth hero', 'pt-BR': 'Preset · Hero de crescimento' },
        description: { en: 'Authored preset for campaign hero variants.', 'pt-BR': 'Preset autorado para variacoes de hero de campanha.' },
        category: 'growth',
      },
      {
        sectionPresetId: 'metrics',
        name: { en: 'Preset · KPI strip', 'pt-BR': 'Preset · Faixa de KPIs' },
        description: { en: 'Authored preset for funnel KPI strips.', 'pt-BR': 'Preset autorado para faixas de KPI do funil.' },
        category: 'growth',
      },
      {
        sectionPresetId: 'cta',
        name: { en: 'Preset · Conversion close', 'pt-BR': 'Preset · Fechamento de conversao' },
        description: { en: 'Authored preset for end-of-funnel CTAs.', 'pt-BR': 'Preset autorado para CTAs de fim de funil.' },
        category: 'growth',
      },
    ],
    fieldPresets: [
      {
        name: { en: 'Campaign code', 'pt-BR': 'Codigo da campanha' },
        description: { en: 'Internal campaign identifier used across landing variants.', 'pt-BR': 'Identificador interno de campanha usado entre variacoes da landing.' },
        category: 'campaign',
        field: {
          id: 'campaigncode',
          type: 'text',
          label: 'Campaign code',
          description: 'Internal campaign identifier.',
          placeholder: 'Q2-launch',
          group: 'Campaign',
          order: 1,
          required: false,
          defaultValue: '',
          localization: {
            label: { 'pt-BR': 'Codigo da campanha' },
            description: { 'pt-BR': 'Identificador interno da campanha.' },
            placeholder: { 'pt-BR': 'lancamento-q2' },
            group: { 'pt-BR': 'Campanha' },
          },
        },
      },
      {
        name: { en: 'Lead source', 'pt-BR': 'Origem do lead' },
        description: { en: 'Primary acquisition channel for this funnel page.', 'pt-BR': 'Canal primario de aquisicao para esta pagina de funil.' },
        category: 'campaign',
        field: {
          id: 'leadsource',
          type: 'select',
          label: 'Lead source',
          description: 'Primary acquisition channel for this campaign.',
          placeholder: '',
          group: 'Campaign',
          order: 2,
          required: false,
          defaultValue: 'paid',
          options: [
            { value: 'paid', label: 'Paid' },
            { value: 'organic', label: 'Organic' },
            { value: 'partner', label: 'Partner' },
          ],
          localization: {
            label: { 'pt-BR': 'Origem do lead' },
            description: { 'pt-BR': 'Canal primario de aquisicao desta campanha.' },
            group: { 'pt-BR': 'Campanha' },
          },
        },
      },
      {
        name: { en: 'Primary proof asset', 'pt-BR': 'Asset principal de prova' },
        description: { en: 'Main visual proof asset used for acquisition pages.', 'pt-BR': 'Asset visual principal de prova usado nas paginas de aquisicao.' },
        category: 'assets',
        field: {
          id: 'primaryproofasset',
          type: 'media-asset',
          label: 'Primary proof asset',
          description: 'Primary visual proof asset for the funnel.',
          placeholder: '',
          group: 'Assets',
          order: 3,
          required: false,
          defaultValue: '',
          mediaKinds: ['image'],
          localization: {
            label: { 'pt-BR': 'Asset principal de prova' },
            description: { 'pt-BR': 'Asset visual principal de prova para o funil.' },
            group: { 'pt-BR': 'Assets' },
          },
        },
      },
    ],
  },
  {
    id: 'starter-docs-hub',
    templateId: 'landing-default',
    label: {
      en: 'Starter kit · Docs hub',
      'pt-BR': 'Starter kit · Hub de documentacao',
    },
    description: {
      en: 'Seed a docs-oriented landing page with reusable navigation, documentation blocks and support schema fields.',
      'pt-BR': 'Semeia uma landing orientada a documentacao com navegacao reutilizavel, blocos de docs e campos de suporte.',
    },
    reusableSections: [
      {
        sectionPresetId: 'header',
        name: { en: 'Docs header section', 'pt-BR': 'Secao de cabecalho de docs' },
        description: { en: 'Header section focused on docs navigation.', 'pt-BR': 'Secao de cabecalho focada na navegacao de docs.' },
        category: 'docs',
      },
      {
        sectionPresetId: 'features',
        name: { en: 'Docs feature grid section', 'pt-BR': 'Secao grid de docs' },
        description: { en: 'Reusable docs grid for concepts, APIs and guides.', 'pt-BR': 'Grid reutilizavel de docs para conceitos, APIs e guias.' },
        category: 'docs',
      },
      {
        sectionPresetId: 'footer',
        name: { en: 'Docs footer section', 'pt-BR': 'Secao de rodape de docs' },
        description: { en: 'Footer section with docs and support links.', 'pt-BR': 'Secao de rodape com links de docs e suporte.' },
        category: 'docs',
      },
    ],
    reusableBlocks: [
      {
        sectionPresetId: 'header',
        name: { en: 'Docs header block', 'pt-BR': 'Bloco de cabecalho de docs' },
        description: { en: 'Navigation block for docs-oriented landings.', 'pt-BR': 'Bloco de navegacao para landings orientadas a docs.' },
        category: 'docs',
      },
      {
        sectionPresetId: 'features',
        name: { en: 'Docs feature block', 'pt-BR': 'Bloco de features de docs' },
        description: { en: 'Feature block used to stage guides, references and examples.', 'pt-BR': 'Bloco de features para guias, referencias e exemplos.' },
        category: 'docs',
      },
      {
        sectionPresetId: 'footer',
        name: { en: 'Docs footer block', 'pt-BR': 'Bloco de rodape de docs' },
        description: { en: 'Footer block for docs navigation and ecosystem links.', 'pt-BR': 'Bloco de rodape para navegacao de docs e links do ecossistema.' },
        category: 'docs',
      },
    ],
    authoredBlockPresets: [
      {
        sectionPresetId: 'header',
        name: { en: 'Preset · Docs navigation', 'pt-BR': 'Preset · Navegacao de docs' },
        description: { en: 'Authored preset for docs-oriented headers.', 'pt-BR': 'Preset autorado para cabecalhos orientados a docs.' },
        category: 'docs',
      },
      {
        sectionPresetId: 'features',
        name: { en: 'Preset · Docs library grid', 'pt-BR': 'Preset · Grid de biblioteca de docs' },
        description: { en: 'Authored preset for documentation feature grids.', 'pt-BR': 'Preset autorado para grids de documentacao.' },
        category: 'docs',
      },
      {
        sectionPresetId: 'footer',
        name: { en: 'Preset · Docs footer', 'pt-BR': 'Preset · Rodape de docs' },
        description: { en: 'Authored preset for documentation footer layouts.', 'pt-BR': 'Preset autorado para layouts de rodape de documentacao.' },
        category: 'docs',
      },
    ],
    fieldPresets: [
      {
        name: { en: 'Documentation root URL', 'pt-BR': 'URL raiz da documentacao' },
        description: { en: 'Root URL for the external or hosted documentation portal.', 'pt-BR': 'URL raiz do portal de documentacao externo ou hospedado.' },
        category: 'docs',
        field: {
          id: 'documentationrooturl',
          type: 'url',
          label: 'Documentation root URL',
          description: 'Primary root URL for the documentation portal.',
          placeholder: 'https://docs.example.com',
          group: 'Documentation',
          order: 1,
          required: false,
          defaultValue: '',
          localization: {
            label: { 'pt-BR': 'URL raiz da documentacao' },
            description: { 'pt-BR': 'URL raiz principal do portal de documentacao.' },
            placeholder: { 'pt-BR': 'https://docs.exemplo.com' },
            group: { 'pt-BR': 'Documentacao' },
          },
        },
      },
      {
        name: { en: 'Support URL', 'pt-BR': 'URL de suporte' },
        description: { en: 'Support or contact URL shown in docs landing blocks.', 'pt-BR': 'URL de suporte ou contato exibida nos blocos da landing de docs.' },
        category: 'docs',
        field: {
          id: 'supporturl',
          type: 'url',
          label: 'Support URL',
          description: 'Support or contact destination used in docs CTAs.',
          placeholder: 'https://support.example.com',
          group: 'Documentation',
          order: 2,
          required: false,
          defaultValue: '',
          localization: {
            label: { 'pt-BR': 'URL de suporte' },
            description: { 'pt-BR': 'Destino de suporte ou contato usado nos CTAs de docs.' },
            placeholder: { 'pt-BR': 'https://suporte.exemplo.com' },
            group: { 'pt-BR': 'Documentacao' },
          },
        },
      },
      {
        name: { en: 'Featured illustration', 'pt-BR': 'Ilustracao em destaque' },
        description: { en: 'Primary illustration used in documentation hero or overview blocks.', 'pt-BR': 'Ilustracao principal usada no hero ou nos blocos de overview da documentacao.' },
        category: 'assets',
        field: {
          id: 'featuredillustration',
          type: 'media-asset',
          label: 'Featured illustration',
          description: 'Primary docs illustration asset.',
          placeholder: '',
          group: 'Assets',
          order: 3,
          required: false,
          defaultValue: '',
          mediaKinds: ['image'],
          localization: {
            label: { 'pt-BR': 'Ilustracao em destaque' },
            description: { 'pt-BR': 'Asset principal de ilustracao de docs.' },
            group: { 'pt-BR': 'Assets' },
          },
        },
      },
    ],
  },
]

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

function resolveCmsStarterKitDefinition(kitIdInput: unknown): CmsStarterKitDefinition {
  const normalized = String(kitIdInput ?? '').trim()
  return starterKitCatalog.find(starterKit => starterKit.id === normalized) ?? starterKitCatalog[0]
}

function resolveSectionByPreset(page: CmsPageSettings, sectionPresetId: string) {
  return page.sections.find(section => section.presetId === sectionPresetId)
}

function resolvePrimaryBlockFromSection(section: CmsPageSettings['sections'][number] | undefined): CmsPageBlockSettings | null {
  if (!section || !Array.isArray(section.blocks) || section.blocks.length === 0) {
    return null
  }

  return section.blocks[0] ?? null
}

function buildStarterKitFieldPreset(
  seed: CmsStarterKitFieldPresetSeed,
  existingPresets: CmsAuthoredContentModelFieldPresetSettings[]
): CmsAuthoredContentModelFieldPresetSettings {
  const preset = createCmsAuthoredContentModelFieldPreset({
    field: cloneValue(seed.field),
    existingPresets,
    localeInput: 'en',
    name: seed.name.en,
    description: seed.description.en,
    category: seed.category,
  })

  return {
    ...preset,
    localization: {
      ...(preset.localization ?? {}),
      name: { 'pt-BR': seed.name['pt-BR'] },
      description: { 'pt-BR': seed.description['pt-BR'] },
    },
  }
}

/**
 * Lists built-in starter-kit bundles that accelerate common landing-page use cases.
 */
export function listCmsStarterKitOptions(
  localeInput: unknown,
  authoredModels: CmsAuthoredContentModelSettings[] = []
): CmsStarterKitOption[] {
  const locale = resolveCmsLocale(localeInput)
  const quickStartByTemplate = new Map(
    listCmsPageQuickStartOptions(locale, authoredModels).map(option => [option.value, option])
  )
  const templateLabelById = new Map(
    listCmsPageTemplateOptions(locale).map(option => [option.value, option.label])
  )

  return starterKitCatalog.map(starterKit => {
    const quickStart = quickStartByTemplate.get(starterKit.templateId)

    return {
      value: starterKit.id,
      label: resolveLocalizedText(starterKit.label, locale),
      description: resolveLocalizedText(starterKit.description, locale),
      templateLabel: templateLabelById.get(starterKit.templateId) ?? starterKit.templateId,
      contentModelLabel: quickStart?.contentModelLabel ?? '',
      sectionCount: quickStart?.sectionCount ?? 0,
      reusableSectionCount: starterKit.reusableSections.length,
      reusableBlockCount: starterKit.reusableBlocks.length,
      blockPresetCount: starterKit.authoredBlockPresets.length,
      fieldPresetCount: starterKit.fieldPresets.length,
    }
  })
}

/**
 * Creates one starter-kit bundle by composing existing engine primitives.
 */
export function createCmsStarterKitBundle(input: {
  kitId: unknown
  settings: CmsStarterKitSettingsContext
  localeInput?: unknown
}): CmsStarterKitBundle {
  const locale = resolveCmsLocale(input.localeInput)
  const starterKit = resolveCmsStarterKitDefinition(input.kitId)
  const page = createCmsPageFromTemplate({
    templateId: starterKit.templateId,
    existingPages: input.settings.pages,
    localeInput: locale,
  })

  page.customFields = normalizeCmsPageCustomFieldsForContentModel(
    page.customFields,
    page.contentModelId,
    locale,
    input.settings.authoredContentModels
  )

  const reusableSections: CmsReusableSectionSettings[] = []
  for (const seed of starterKit.reusableSections) {
    const section = resolveSectionByPreset(page, seed.sectionPresetId)
    if (!section) {
      continue
    }

    reusableSections.push(createCmsReusableSectionFromSection({
      page,
      section,
      existingSections: [...input.settings.reusableSections, ...reusableSections],
      name: resolveLocalizedText(seed.name, locale),
      description: resolveLocalizedText(seed.description, locale),
      category: seed.category,
    }))
  }

  const reusableBlocks: CmsReusableBlockSettings[] = []
  for (const seed of starterKit.reusableBlocks) {
    const block = resolvePrimaryBlockFromSection(resolveSectionByPreset(page, seed.sectionPresetId))
    if (!block) {
      continue
    }

    reusableBlocks.push(createCmsReusableBlockFromBlock({
      block,
      existingBlocks: [...input.settings.reusableBlocks, ...reusableBlocks],
      name: resolveLocalizedText(seed.name, locale),
      description: resolveLocalizedText(seed.description, locale),
      category: seed.category,
    }))
  }

  const authoredBlockPresets: CmsAuthoredBlockPresetSettings[] = []
  for (const seed of starterKit.authoredBlockPresets) {
    const block = resolvePrimaryBlockFromSection(resolveSectionByPreset(page, seed.sectionPresetId))
    if (!block) {
      continue
    }

    authoredBlockPresets.push(createCmsAuthoredBlockPresetFromBlock({
      block,
      existingPresets: [...input.settings.authoredBlockPresets, ...authoredBlockPresets],
      localeInput: locale,
      name: resolveLocalizedText(seed.name, locale),
      description: resolveLocalizedText(seed.description, locale),
      category: seed.category,
      starterSectionPresets: [seed.sectionPresetId],
    }))
  }

  const authoredContentModelFieldPresets: CmsAuthoredContentModelFieldPresetSettings[] = []
  for (const seed of starterKit.fieldPresets) {
    authoredContentModelFieldPresets.push(buildStarterKitFieldPreset(
      seed,
      [...input.settings.authoredContentModelFieldPresets, ...authoredContentModelFieldPresets]
    ))
  }

  return {
    kitId: starterKit.id,
    templateId: starterKit.templateId,
    page,
    reusableSections,
    reusableBlocks,
    authoredBlockPresets,
    authoredContentModelFieldPresets,
  }
}