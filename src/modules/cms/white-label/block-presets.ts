/**
 * Block preset catalog for the CMS engine.
 * Presets provide localized starter content without coupling the builder to a backend.
 */
import { resolveCmsLocale } from './i18n'
import {
  applyCmsLocalizedPropsUpdate,
  applyCmsLocalizedTextUpdate,
  normalizeCmsLocalizedPropsRecord,
  normalizeCmsLocalizedTextRecord,
  normalizeCmsPageBlockLocalizationSettings,
  resolveCmsLocalizedProps,
  resolveCmsLocalizedText,
} from './localized-content'
import type {
  CmsAuthoredBlockPresetId,
  CmsAuthoredBlockPresetSettings,
  CmsBuiltinBlockPresetId,
  CmsBlockPresetId,
  CmsLocale,
  CmsPageBlockSettings,
  CmsSectionPresetId,
} from './types'

export interface CmsBlockPresetOption {
  value: CmsBlockPresetId
  label: string
  description: string
}

export interface CmsResolvedBlockPresetDefinition {
  id: CmsBlockPresetId
  source: 'builtin' | 'authored'
  type: string
  category: string
  name: string
  description: string
  props: Record<string, unknown>
  localizedProps?: Partial<Record<CmsLocale, Record<string, unknown>>>
  starterSectionPresets: CmsSectionPresetId[]
}

interface CmsLocalizedText {
  en: string
  'pt-BR': string
}

interface CmsBlockPresetDefinition {
  id: CmsBuiltinBlockPresetId
  type: string
  category: string
  name: CmsLocalizedText
  description: CmsLocalizedText
  props: Record<string, unknown>
  localizedProps?: Partial<Record<CmsLocale, Record<string, unknown>>>
}

const blockPresetCatalog: Readonly<Record<CmsBuiltinBlockPresetId, CmsBlockPresetDefinition>> = {
  'landing-header-docs': {
    id: 'landing-header-docs',
    type: 'landing.header',
    category: 'layout',
    name: {
      en: 'Header · Documentation',
      'pt-BR': 'Cabecalho · Documentacao',
    },
    description: {
      en: 'Header starter tuned for docs and developer navigation.',
      'pt-BR': 'Starter de cabecalho ajustado para docs e navegacao de desenvolvedor.',
    },
    props: {
      logoText: 'NTK',
      sticky: true,
      ctaText: 'Read docs',
      ctaLink: '#resources',
      ctaVariant: 'secondary',
      maxWidth: 1240,
      navItems: [
        { label: 'Features', href: '#features', external: false },
        { label: 'Components', href: '#components', external: false },
        { label: 'Installation', href: '#installation', external: false },
      ],
    },
    localizedProps: {
      'pt-BR': {
        ctaText: 'Ler docs',
        navItems: [
          { label: 'Features', href: '#features', external: false },
          { label: 'Componentes', href: '#components', external: false },
          { label: 'Instalacao', href: '#installation', external: false },
        ],
      },
    },
  },
  'landing-header-product': {
    id: 'landing-header-product',
    type: 'landing.header',
    category: 'layout',
    name: {
      en: 'Header · Product navigation',
      'pt-BR': 'Cabecalho · Navegacao de produto',
    },
    description: {
      en: 'Header starter with a stronger product CTA and broader navigation.',
      'pt-BR': 'Starter de cabecalho com CTA principal de produto e navegacao mais ampla.',
    },
    props: {
      logoText: 'NTK',
      sticky: true,
      ctaText: 'Test CMS',
      ctaLink: '?cms=1',
      ctaVariant: 'primary',
      maxWidth: 1280,
      navItems: [
        { label: 'Features', href: '#features', external: false },
        { label: 'Themes', href: '#themes', external: false },
        { label: 'Installation', href: '#installation', external: false },
      ],
    },
    localizedProps: {
      'pt-BR': {
        ctaText: 'Testar CMS',
        navItems: [
          { label: 'Features', href: '#features', external: false },
          { label: 'Temas', href: '#themes', external: false },
          { label: 'Instalacao', href: '#installation', external: false },
        ],
      },
    },
  },
  'landing-hero-product-launch': {
    id: 'landing-hero-product-launch',
    type: 'landing.hero',
    category: 'layout',
    name: {
      en: 'Hero · Product launch',
      'pt-BR': 'Hero · Lancamento de produto',
    },
    description: {
      en: 'Hero starter for product launches with dual CTA and media.',
      'pt-BR': 'Starter de hero para lancamentos com duas CTAs e midia.',
    },
    props: {
      badge: 'CMS ENGINE',
      title: 'Build page experiences faster',
      subtitle: 'Compose sections with reusable templates and publish-ready tokens.',
      primaryAction: { label: 'Start editing', href: '#installation', external: false },
      secondaryAction: { label: 'View GitHub', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', external: true },
      layout: 'split',
      size: 'lg',
      variant: 'default',
    },
    localizedProps: {
      'pt-BR': {
        badge: 'MOTOR CMS',
        title: 'Monte paginas mais rapido',
        subtitle: 'Componha secoes com templates reutilizaveis e tokens prontos para publicar.',
        primaryAction: { label: 'Comecar edicao', href: '#installation', external: false },
        secondaryAction: { label: 'Ver GitHub', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', external: true },
      },
    },
  },
  'landing-hero-video-showcase': {
    id: 'landing-hero-video-showcase',
    type: 'landing.hero',
    category: 'layout',
    name: {
      en: 'Hero · Video showcase',
      'pt-BR': 'Hero · Showcase em video',
    },
    description: {
      en: 'Hero starter focused on motion, media and cinematic reveal.',
      'pt-BR': 'Starter de hero focado em movimento, midia e reveal cinematico.',
    },
    props: {
      badge: 'LIVE PREVIEW',
      title: 'Show the product in motion',
      subtitle: 'Use video, parallax and reveal masks to stage a premium first impression.',
      primaryAction: { label: 'Watch preview', href: '#components', external: false },
      secondaryAction: { label: 'Open CMS', href: '?cms=1', external: false },
      layout: 'split',
      size: 'lg',
      variant: 'gradient',
      videoAutoplay: true,
      videoLoop: true,
      videoMuted: true,
      videoPlaysinline: true,
      revealOnScroll: true,
      revealMask: true,
      parallaxEnabled: true,
      parallaxStrength: 24,
    },
    localizedProps: {
      'pt-BR': {
        badge: 'PREVIEW AO VIVO',
        title: 'Mostre o produto em movimento',
        subtitle: 'Use video, parallax e reveal mask para uma primeira impressao premium.',
        primaryAction: { label: 'Ver preview', href: '#components', external: false },
        secondaryAction: { label: 'Abrir CMS', href: '?cms=1', external: false },
      },
    },
  },
  'landing-stats-proof-strip': {
    id: 'landing-stats-proof-strip',
    type: 'landing.stats',
    category: 'content',
    name: {
      en: 'Stats · Proof strip',
      'pt-BR': 'Metricas · Prova social',
    },
    description: {
      en: 'Compact KPI block for trust signals and adoption metrics.',
      'pt-BR': 'Bloco compacto de KPIs para sinais de confianca e adocao.',
    },
    props: {
      title: 'Trusted in production',
      subtitle: 'Surface the metrics that help a page convert.',
      variant: 'default',
      size: 'md',
      cardVariant: 'gradient',
      items: [
        { id: 'components', label: 'Components', value: '22+' },
        { id: 'composables', label: 'Composables', value: '11' },
        { id: 'themes', label: 'Themes', value: '4' },
      ],
    },
    localizedProps: {
      'pt-BR': {
        title: 'Confiavel em producao',
        subtitle: 'Mostre as metricas que ajudam a pagina a converter.',
        items: [
          { id: 'components', label: 'Componentes', value: '22+' },
          { id: 'composables', label: 'Composables', value: '11' },
          { id: 'themes', label: 'Temas', value: '4' },
        ],
      },
    },
  },
  'landing-stats-dashboard-kpis': {
    id: 'landing-stats-dashboard-kpis',
    type: 'landing.stats',
    category: 'content',
    name: {
      en: 'Stats · Dashboard KPIs',
      'pt-BR': 'Metricas · KPIs de dashboard',
    },
    description: {
      en: 'Metric strip focused on business and operational KPIs.',
      'pt-BR': 'Faixa de metricas focada em KPIs operacionais e de negocio.',
    },
    props: {
      title: 'Track what moves the funnel',
      subtitle: 'Connect activity, revenue and activation into one KPI strip.',
      variant: 'light',
      size: 'lg',
      cardVariant: 'outlined',
      items: [
        { id: 'pipeline', label: 'Pipeline', value: '$128k' },
        { id: 'activation', label: 'Activation', value: '67%' },
        { id: 'velocity', label: 'Velocity', value: '14d' },
      ],
    },
    localizedProps: {
      'pt-BR': {
        title: 'Acompanhe o que move o funil',
        subtitle: 'Conecte atividade, receita e ativacao em uma unica faixa de KPIs.',
        items: [
          { id: 'pipeline', label: 'Pipeline', value: '$128k' },
          { id: 'activation', label: 'Ativacao', value: '67%' },
          { id: 'velocity', label: 'Velocidade', value: '14d' },
        ],
      },
    },
  },
  'landing-features-component-library': {
    id: 'landing-features-component-library',
    type: 'landing.features',
    category: 'content',
    name: {
      en: 'Features · Component library',
      'pt-BR': 'Features · Biblioteca de componentes',
    },
    description: {
      en: 'Feature grid focused on reuse, DX and shipping speed.',
      'pt-BR': 'Grid de features focado em reuso, DX e velocidade de entrega.',
    },
    props: {
      title: 'Reusable UI building blocks',
      subtitle: 'Components, composables and shell primitives organized for production teams.',
      variant: 'default',
      size: 'lg',
      cardVariant: 'accent-left',
      iconStyle: 'gradient',
      cinematicCardsEnabled: true,
      cinematicCardsTilt: 8,
      cinematicCardsGlow: 0.4,
      cinematicCardsPerspective: 1200,
      items: [
        { id: 'components', title: 'Composable components', description: 'Shared UI blocks ready for multiple products.', icon: 'widgets' },
        { id: 'tokens', title: 'Token driven theming', description: 'Branding and layout decisions stay configurable.', icon: 'palette' },
        { id: 'cms', title: 'CMS engine ready', description: 'Author pages with structured sections and reusable blocks.', icon: 'view_quilt' },
      ],
    },
    localizedProps: {
      'pt-BR': {
        title: 'Blocos de UI reutilizaveis',
        subtitle: 'Componentes, composables e primitives de shell organizados para times de producao.',
        items: [
          { id: 'components', title: 'Componentes composables', description: 'Blocos compartilhados prontos para varios produtos.', icon: 'widgets' },
          { id: 'tokens', title: 'Tematizacao por tokens', description: 'Branding e layout continuam configuraveis.', icon: 'palette' },
          { id: 'cms', title: 'Motor CMS pronto', description: 'Autor paginas com secoes estruturadas e blocos reutilizaveis.', icon: 'view_quilt' },
        ],
      },
    },
  },
  'landing-features-enterprise-readiness': {
    id: 'landing-features-enterprise-readiness',
    type: 'landing.features',
    category: 'content',
    name: {
      en: 'Features · Enterprise readiness',
      'pt-BR': 'Features · Pronto para enterprise',
    },
    description: {
      en: 'Feature grid focused on governance, releases and operational rigor.',
      'pt-BR': 'Grid de features focado em governanca, releases e rigor operacional.',
    },
    props: {
      title: 'Engineered for enterprise delivery',
      subtitle: 'Governance, releases and validations stay inside the authoring engine.',
      variant: 'dark',
      size: 'lg',
      cardVariant: 'elevated',
      iconStyle: 'circle',
      items: [
        { id: 'workflow', title: 'Workflow aware', description: 'Roles, stages and audit trails remain explicit.', icon: 'rule' },
        { id: 'releases', title: 'Release orchestration', description: 'Draft, validate, schedule and publish without backend lock-in.', icon: 'rocket_launch' },
        { id: 'validation', title: 'Shared validation', description: 'Authoring and release gates use the same integrity engine.', icon: 'verified' },
      ],
    },
    localizedProps: {
      'pt-BR': {
        title: 'Projetado para entrega enterprise',
        subtitle: 'Governanca, releases e validacoes ficam dentro do motor de autoria.',
        items: [
          { id: 'workflow', title: 'Ciente de workflow', description: 'Papeis, estagios e auditoria permanecem explicitos.', icon: 'rule' },
          { id: 'releases', title: 'Orquestracao de release', description: 'Rascunhe, valide, agende e publique sem lock-in de backend.', icon: 'rocket_launch' },
          { id: 'validation', title: 'Validacao compartilhada', description: 'Autoria e gates de release usam o mesmo motor de integridade.', icon: 'verified' },
        ],
      },
    },
  },
  'landing-cta-installation-guide': {
    id: 'landing-cta-installation-guide',
    type: 'landing.cta',
    category: 'conversion',
    name: {
      en: 'CTA · Installation guide',
      'pt-BR': 'CTA · Guia de instalacao',
    },
    description: {
      en: 'CTA starter for setup, trial or onboarding actions.',
      'pt-BR': 'Starter de CTA para setup, trial ou onboarding.',
    },
    props: {
      title: 'Go from install to first page quickly',
      subtitle: 'Use the CMS engine, reusable presets and tokens from day one.',
      variant: 'default',
      layout: 'split',
      size: 'md',
      maxWidth: 1080,
      primaryCTA: { text: 'Install now', link: '#installation' },
      secondaryCTA: { text: 'Open CMS', link: '?cms=1' },
    },
    localizedProps: {
      'pt-BR': {
        title: 'Va da instalacao a primeira pagina rapidamente',
        subtitle: 'Use o motor CMS, presets reutilizaveis e tokens desde o primeiro dia.',
        primaryCTA: { text: 'Instalar agora', link: '#installation' },
        secondaryCTA: { text: 'Abrir CMS', link: '?cms=1' },
      },
    },
  },
  'landing-cta-final-prompt': {
    id: 'landing-cta-final-prompt',
    type: 'landing.cta',
    category: 'conversion',
    name: {
      en: 'CTA · Final prompt',
      'pt-BR': 'CTA · Chamada final',
    },
    description: {
      en: 'CTA starter ready for final conversion at the end of the page.',
      'pt-BR': 'Starter de CTA pronto para conversao final no fim da pagina.',
    },
    props: {
      title: 'Ship your next frontend faster',
      subtitle: 'Use schema-driven pages, reusable blocks and white-label tokens from day one.',
      variant: 'gradient',
      layout: 'centered',
      size: 'lg',
      maxWidth: 1120,
      primaryCTA: { text: 'Test CMS', link: '?cms=1' },
      secondaryCTA: { text: 'Read docs', link: '#resources' },
    },
    localizedProps: {
      'pt-BR': {
        title: 'Entregue seu proximo frontend mais rapido',
        subtitle: 'Use paginas orientadas por schema, blocos reutilizaveis e tokens white-label desde o primeiro dia.',
        primaryCTA: { text: 'Testar CMS', link: '?cms=1' },
        secondaryCTA: { text: 'Ler docs', link: '#resources' },
      },
    },
  },
  'landing-footer-docs': {
    id: 'landing-footer-docs',
    type: 'landing.footer',
    category: 'layout',
    name: {
      en: 'Footer · Documentation hub',
      'pt-BR': 'Rodape · Hub de documentacao',
    },
    description: {
      en: 'Footer starter centered on docs, components and ecosystem links.',
      'pt-BR': 'Starter de rodape centrado em docs, componentes e links do ecossistema.',
    },
    props: {
      variant: 'dark',
      brandName: 'NetToolsKit UI Vue',
      brandDescription: 'A comprehensive Vue 3 + Quasar component library with theme system, composables, and design tokens.',
      socialTitle: 'Follow',
      copyrightText: 'Built with Vue 3 + Quasar.',
      linkSections: [
        {
          title: 'Resources',
          links: [
            { label: 'Documentation', href: '#resources' },
            { label: 'Demo Page', href: '#hero' },
          ],
        },
        {
          title: 'Related',
          links: [
            { label: 'Copilot Instructions', href: 'https://github.com/ThiagoGuislotti/copilot-instructions' },
          ],
        },
      ],
      socialLinks: [
        { icon: 'github', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', label: 'GitHub' },
        { icon: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
      ],
    },
    localizedProps: {
      'pt-BR': {
        socialTitle: 'Acompanhe',
        brandDescription: 'Uma biblioteca completa de componentes Vue 3 + Quasar com tema, composables e design tokens.',
        copyrightText: 'Construido com Vue 3 + Quasar.',
        linkSections: [
          {
            title: 'Recursos',
            links: [
              { label: 'Documentacao', href: '#resources' },
              { label: 'Demo Page', href: '#hero' },
            ],
          },
          {
            title: 'Relacionados',
            links: [
              { label: 'Copilot Instructions', href: 'https://github.com/ThiagoGuislotti/copilot-instructions' },
            ],
          },
        ],
      },
    },
  },
  'landing-footer-product': {
    id: 'landing-footer-product',
    type: 'landing.footer',
    category: 'layout',
    name: {
      en: 'Footer · Product links',
      'pt-BR': 'Rodape · Links de produto',
    },
    description: {
      en: 'Footer starter for product positioning, support and navigation.',
      'pt-BR': 'Starter de rodape para posicionamento de produto, suporte e navegacao.',
    },
    props: {
      variant: 'dark',
      brandName: 'NetToolsKit UI Vue',
      brandDescription: 'Component primitives and CMS engine building blocks for enterprise frontend delivery.',
      socialTitle: 'Connect',
      copyrightText: 'All rights reserved.',
      linkSections: [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Themes', href: '#themes' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Installation', href: '#installation' },
            { label: 'GitHub', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue' },
          ],
        },
      ],
      socialLinks: [
        { icon: 'github', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', label: 'GitHub' },
      ],
    },
    localizedProps: {
      'pt-BR': {
        socialTitle: 'Conecte-se',
        brandDescription: 'Primitives de componentes e blocos de motor CMS para entrega enterprise de frontend.',
        copyrightText: 'Todos os direitos reservados.',
        linkSections: [
          {
            title: 'Produto',
            links: [
              { label: 'Features', href: '#features' },
              { label: 'Temas', href: '#themes' },
            ],
          },
          {
            title: 'Suporte',
            links: [
              { label: 'Instalacao', href: '#installation' },
              { label: 'GitHub', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue' },
            ],
          },
        ],
      },
    },
  },
}

const defaultPresetBySectionPreset: Record<CmsSectionPresetId, CmsBlockPresetId> = {
  header: 'landing-header-product',
  hero: 'landing-hero-product-launch',
  stats: 'landing-stats-proof-strip',
  metrics: 'landing-stats-dashboard-kpis',
  features: 'landing-features-component-library',
  benefits: 'landing-features-enterprise-readiness',
  installation: 'landing-cta-installation-guide',
  cta: 'landing-cta-final-prompt',
  footer: 'landing-footer-docs',
  custom: 'custom',
}

function resolveLocalizedText(text: CmsLocalizedText, locale: CmsLocale): string {
  return text[locale]
}

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

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isCmsAuthoredBlockPresetId(value: unknown): value is CmsAuthoredBlockPresetId {
  const normalized = String(value ?? '').trim()
  return normalized.startsWith('authored:') && normalized.length > 'authored:'.length
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

function resolveStarterSectionPresets(
  value: unknown,
  fallback: CmsSectionPresetId[] = []
): CmsSectionPresetId[] {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  const normalized = value
    .map(entry => String(entry ?? '').trim())
    .filter((entry, index, entries): entry is CmsSectionPresetId => (
      Boolean(entry)
      && (entry === 'header'
        || entry === 'hero'
        || entry === 'stats'
        || entry === 'metrics'
        || entry === 'features'
        || entry === 'benefits'
        || entry === 'installation'
        || entry === 'cta'
        || entry === 'footer'
        || entry === 'custom')
      && entries.indexOf(entry) === index
    ))

  return normalized.length > 0 ? normalized : [...fallback]
}

function resolveAuthoredPresetMetadata(
  locale: CmsLocale,
  preset: CmsAuthoredBlockPresetSettings
): {
  name: string
  description: string
  props: Record<string, unknown>
} {
  return {
    name: resolveCmsLocalizedText({
      baseValue: preset.name,
      localized: preset.localization?.name,
      localeInput: locale,
    }),
    description: resolveCmsLocalizedText({
      baseValue: preset.description,
      localized: preset.localization?.description,
      localeInput: locale,
    }),
    props: resolveCmsLocalizedProps({
      baseProps: preset.props,
      localized: preset.localization?.props,
      localeInput: locale,
    }),
  }
}

function resolveCmsBlockPresetDefinitionEntry(
  presetIdInput: unknown,
  localeInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): CmsResolvedBlockPresetDefinition | undefined {
  const locale = resolveCmsLocale(localeInput)
  const presetId = resolveCmsBlockPresetId(presetIdInput)
  if (presetId === 'custom') {
    return undefined
  }

  if (isCmsAuthoredBlockPresetId(presetId)) {
    const authoredPreset = authoredPresets.find(entry => entry.id === presetId)
    if (!authoredPreset) {
      return undefined
    }

    const resolved = resolveAuthoredPresetMetadata(locale, authoredPreset)
    return {
      id: authoredPreset.id,
      source: 'authored',
      type: authoredPreset.type,
      category: authoredPreset.category,
      name: resolved.name,
      description: resolved.description,
      props: resolved.props,
      localizedProps: authoredPreset.localization?.props,
      starterSectionPresets: authoredPreset.starterSectionPresets,
    }
  }

  const builtinPreset = blockPresetCatalog[presetId]
  if (!builtinPreset) {
    return undefined
  }

  return {
    id: builtinPreset.id,
    source: 'builtin',
    type: builtinPreset.type,
    category: builtinPreset.category,
    name: resolveLocalizedText(builtinPreset.name, locale),
    description: resolveLocalizedText(builtinPreset.description, locale),
    props: cloneValue(builtinPreset.props),
    localizedProps: builtinPreset.localizedProps,
    starterSectionPresets: [],
  }
}

/**
 * Resolves a block preset id, falling back to `custom`.
 */
export function resolveCmsBlockPresetId(value: unknown): CmsBlockPresetId {
  const normalized = String(value ?? '').trim()
  if (normalized === 'custom') {
    return 'custom'
  }

  if (isCmsAuthoredBlockPresetId(normalized)) {
    return normalized
  }

  return normalized in blockPresetCatalog
    ? normalized as CmsBuiltinBlockPresetId
    : 'custom'
}

/**
 * Returns the block preset definition when the id belongs to the built-in catalog.
 */
export function getCmsBlockPresetDefinition(
  presetIdInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): CmsResolvedBlockPresetDefinition | undefined {
  return resolveCmsBlockPresetDefinitionEntry(presetIdInput, 'en', authoredPresets)
}

/**
 * Checks whether a preset is compatible with a block type.
 */
export function isCmsBlockPresetAllowedForType(
  blockTypeInput: unknown,
  presetIdInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): boolean {
  const preset = getCmsBlockPresetDefinition(presetIdInput, authoredPresets)
  if (!preset) {
    return resolveCmsBlockPresetId(presetIdInput) === 'custom'
  }

  return preset.type === String(blockTypeInput ?? '').trim()
}

/**
 * Returns localized preset definitions compatible with one block type.
 */
export function listCmsBlockPresetDefinitionsForType(
  blockTypeInput: unknown,
  localeInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): CmsResolvedBlockPresetDefinition[] {
  const locale = resolveCmsLocale(localeInput)
  const blockType = String(blockTypeInput ?? '').trim()

  const builtinPresets = Object.values(blockPresetCatalog)
    .filter(preset => preset.type === blockType)
    .map(preset => resolveCmsBlockPresetDefinitionEntry(preset.id, locale, authoredPresets))
    .filter((preset): preset is CmsResolvedBlockPresetDefinition => preset !== undefined)

  const userPresets = authoredPresets
    .filter(preset => preset.type === blockType)
    .map(preset => resolveCmsBlockPresetDefinitionEntry(preset.id, locale, authoredPresets))
    .filter((preset): preset is CmsResolvedBlockPresetDefinition => preset !== undefined)

  return [...builtinPresets, ...userPresets]
}

/**
 * Lists localized block preset options for one block type.
 */
export function listCmsBlockPresetOptions(
  localeInput: unknown,
  blockTypeInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): CmsBlockPresetOption[] {
  const locale = resolveCmsLocale(localeInput)
  const blockType = String(blockTypeInput ?? '').trim()
  const presets = listCmsBlockPresetDefinitionsForType(blockType, locale, authoredPresets)
    .map(preset => ({
      value: preset.id,
      label: preset.name,
      description: preset.description,
    }))

  return [
    ...presets,
    {
      value: 'custom',
      label: locale === 'pt-BR' ? 'Customizado' : 'Custom',
      description: locale === 'pt-BR'
        ? 'Bloco vazio para autoria manual.'
        : 'Empty starter block for manual authoring.',
    },
  ]
}

/**
 * Resolves a localized preset label for previews and editor rows.
 */
export function getCmsBlockPresetLabel(
  localeInput: unknown,
  presetIdInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): string {
  const locale = resolveCmsLocale(localeInput)
  const presetId = resolveCmsBlockPresetId(presetIdInput)
  if (presetId === 'custom') {
    return locale === 'pt-BR' ? 'Customizado' : 'Custom'
  }

  return resolveCmsBlockPresetDefinitionEntry(presetId, locale, authoredPresets)?.name
    ?? (locale === 'pt-BR' ? 'Customizado' : 'Custom')
}

/**
 * Resolves a localized preset description for editor copy.
 */
export function getCmsBlockPresetDescription(
  localeInput: unknown,
  presetIdInput: unknown,
  authoredPresets: CmsAuthoredBlockPresetSettings[] = []
): string {
  const locale = resolveCmsLocale(localeInput)
  const presetId = resolveCmsBlockPresetId(presetIdInput)
  if (presetId === 'custom') {
    return locale === 'pt-BR'
      ? 'Bloco vazio para autoria manual.'
      : 'Empty starter block for manual authoring.'
  }

  return resolveCmsBlockPresetDefinitionEntry(presetId, locale, authoredPresets)?.description
    ?? (locale === 'pt-BR'
      ? 'Bloco vazio para autoria manual.'
      : 'Empty starter block for manual authoring.')
}

/**
 * Resolves the default block preset for a section preset.
 */
export function getDefaultCmsBlockPresetIdForSectionPreset(sectionPresetInput: unknown): CmsBlockPresetId {
  const sectionPresetId = String(sectionPresetInput ?? '').trim() as CmsSectionPresetId
  return defaultPresetBySectionPreset[sectionPresetId] ?? 'custom'
}

/**
 * Creates a localized block scaffold from one preset catalog entry.
 */
export function createCmsPageBlockFromPreset(input: {
  presetId: unknown
  blockId: string
  enabled?: boolean
  authoredPresets?: CmsAuthoredBlockPresetSettings[]
}): CmsPageBlockSettings {
  const presetId = resolveCmsBlockPresetId(input.presetId)
  const definition = getCmsBlockPresetDefinition(presetId, input.authoredPresets ?? [])

  if (!definition) {
    throw new Error(`Block preset "${String(input.presetId ?? '')}" is not registered.`)
  }

  return {
    id: input.blockId,
    type: definition.type,
    presetId,
    enabled: typeof input.enabled === 'boolean' ? input.enabled : true,
    props: cloneValue(definition.props),
    localization: normalizeCmsPageBlockLocalizationSettings(
      definition.localizedProps
        ? { props: cloneValue(definition.localizedProps) }
        : undefined
    ),
  }
}

/**
 * Normalizes block preset localization payloads from storage/import snapshots.
 */
export function normalizeCmsBlockPresetLocalizationSettings(
  value: unknown
): CmsAuthoredBlockPresetSettings['localization'] | undefined {
  if (!isObjectRecord(value)) {
    return undefined
  }

  const name = normalizeCmsLocalizedTextRecord(value.name)
  const description = normalizeCmsLocalizedTextRecord(value.description)
  const props = normalizeCmsLocalizedPropsRecord(value.props)

  if (!name && !description && !props) {
    return undefined
  }

  return {
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(props ? { props } : {}),
  }
}

/**
 * Creates the default authored preset collection for the CMS engine.
 */
export function createDefaultCmsAuthoredBlockPresets(): CmsAuthoredBlockPresetSettings[] {
  return []
}

/**
 * Normalizes authored preset payloads and falls back to safe defaults when malformed.
 */
export function normalizeCmsAuthoredBlockPresets(
  authoredPresets: unknown,
  defaults: CmsAuthoredBlockPresetSettings[] = []
): CmsAuthoredBlockPresetSettings[] {
  if (!Array.isArray(authoredPresets)) {
    return cloneValue(defaults)
  }

  const seenIds = new Set<string>()
  const normalized = authoredPresets
    .map<CmsAuthoredBlockPresetSettings | null>((rawPreset, index) => {
      if (!isObjectRecord(rawPreset)) {
        return null
      }

      const requestedId = String(rawPreset.id ?? '').trim()
      const baseId = requestedId.startsWith('authored:')
        ? requestedId
        : `authored:${normalizeSegment(String(rawPreset.name ?? rawPreset.type ?? ''), `preset-${index + 1}`)}`
      const id = createUniqueValue(baseId, seenIds) as CmsAuthoredBlockPresetId
      seenIds.add(id)

      return {
        id,
        name: String(rawPreset.name ?? '').trim() || `Preset ${index + 1}`,
        description: String(rawPreset.description ?? '').trim(),
        category: String(rawPreset.category ?? '').trim() || 'custom',
        type: String(rawPreset.type ?? '').trim() || 'landing.hero',
        sourcePresetId: resolveCmsBlockPresetId(rawPreset.sourcePresetId),
        sourceReusableBlockId: String(rawPreset.sourceReusableBlockId ?? '').trim() || undefined,
        starterSectionPresets: resolveStarterSectionPresets(rawPreset.starterSectionPresets),
        props: isObjectRecord(rawPreset.props)
          ? cloneValue(rawPreset.props)
          : {},
        localization: normalizeCmsBlockPresetLocalizationSettings(rawPreset.localization),
      } satisfies CmsAuthoredBlockPresetSettings
    })
    .filter((preset): preset is CmsAuthoredBlockPresetSettings => preset !== null)

  return normalized.length > 0 ? normalized : cloneValue(defaults)
}

/**
 * Creates a user-authored block preset from a live block instance.
 */
export function createCmsAuthoredBlockPresetFromBlock(input: {
  block: CmsPageBlockSettings
  existingPresets: CmsAuthoredBlockPresetSettings[]
  localeInput?: unknown
  displayName?: unknown
  name?: unknown
  description?: unknown
  category?: unknown
  starterSectionPresets?: unknown
  sourceReusableBlockId?: unknown
}): CmsAuthoredBlockPresetSettings {
  const locale = resolveCmsLocale(input.localeInput)
  const occupiedIds = new Set(
    input.existingPresets.map(preset => String(preset.id ?? '').trim()).filter(Boolean)
  )
  const normalizedName = String(input.name ?? '').trim()
  const fallbackName = String(input.displayName ?? input.block.type ?? 'Preset').trim() || 'Preset'
  const baseName = locale === 'en'
    ? (normalizedName || fallbackName)
    : fallbackName
  const id = createUniqueValue(
    `authored:${normalizeSegment(normalizedName || fallbackName, normalizeSegment(input.block.type, 'preset'))}`,
    occupiedIds
  ) as CmsAuthoredBlockPresetId

  const resolvedName = applyCmsLocalizedTextUpdate({
    baseValue: baseName,
    localized: undefined,
    localeInput: locale,
    nextValue: normalizedName || fallbackName,
  })
  const resolvedDescription = applyCmsLocalizedTextUpdate({
    baseValue: locale === 'en' ? String(input.description ?? '').trim() : '',
    localized: undefined,
    localeInput: locale,
    nextValue: String(input.description ?? '').trim(),
  })
  const visibleProps = resolveCmsLocalizedProps({
    baseProps: cloneValue(input.block.props ?? {}),
    localized: input.block.localization?.props,
    localeInput: locale,
  })
  const resolvedProps = applyCmsLocalizedPropsUpdate({
    baseProps: cloneValue(input.block.props ?? {}),
    localized: input.block.localization?.props,
    localeInput: locale,
    nextValue: visibleProps,
  })

  const mergedLocalization = normalizeCmsBlockPresetLocalizationSettings({
    name: resolvedName.localized,
    description: resolvedDescription.localized,
    props: locale === 'en'
      ? input.block.localization?.props
      : resolvedProps.localized,
  })

  return {
    id,
    name: resolvedName.baseValue,
    description: resolvedDescription.baseValue,
    category: String(input.category ?? '').trim() || 'custom',
    type: String(input.block.type ?? '').trim() || 'landing.hero',
    sourcePresetId: resolveCmsBlockPresetId(input.block.presetId),
    sourceReusableBlockId: String(input.sourceReusableBlockId ?? '').trim() || undefined,
    starterSectionPresets: resolveStarterSectionPresets(input.starterSectionPresets),
    props: resolvedProps.baseProps,
    localization: mergedLocalization,
  }
}

/**
 * Updates an authored preset using current locale metadata and an optional live block payload.
 */
export function updateCmsAuthoredBlockPreset(input: {
  preset: CmsAuthoredBlockPresetSettings
  block?: CmsPageBlockSettings | null
  localeInput?: unknown
  name?: unknown
  description?: unknown
  starterSectionPresets?: unknown
}): CmsAuthoredBlockPresetSettings {
  const locale = resolveCmsLocale(input.localeInput)
  const nextName = applyCmsLocalizedTextUpdate({
    baseValue: input.preset.name,
    localized: input.preset.localization?.name,
    localeInput: locale,
    nextValue: String(input.name ?? '').trim() || input.preset.name,
  })
  const nextDescription = applyCmsLocalizedTextUpdate({
    baseValue: input.preset.description,
    localized: input.preset.localization?.description,
    localeInput: locale,
    nextValue: String(input.description ?? '').trim(),
  })
  const visibleBlockProps = input.block
    ? resolveCmsLocalizedProps({
      baseProps: cloneValue(input.block.props ?? {}),
      localized: input.block.localization?.props,
      localeInput: locale,
    })
    : null
  const nextProps = input.block
    ? applyCmsLocalizedPropsUpdate({
      baseProps: input.preset.props,
      localized: input.preset.localization?.props,
      localeInput: locale,
      nextValue: visibleBlockProps ?? cloneValue(input.block.props ?? {}),
    })
    : {
      baseProps: cloneValue(input.preset.props),
      localized: input.preset.localization?.props,
    }

  return {
    ...input.preset,
    name: nextName.baseValue,
    description: nextDescription.baseValue,
    type: input.block
      ? String(input.block.type ?? '').trim() || input.preset.type
      : input.preset.type,
    sourcePresetId: input.block
      ? resolveCmsBlockPresetId(input.block.presetId)
      : input.preset.sourcePresetId,
    starterSectionPresets: resolveStarterSectionPresets(
      input.starterSectionPresets,
      input.preset.starterSectionPresets
    ),
    props: nextProps.baseProps,
    localization: normalizeCmsBlockPresetLocalizationSettings({
      name: nextName.localized,
      description: nextDescription.localized,
      props: nextProps.localized,
    }),
  }
}