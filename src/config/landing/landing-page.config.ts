/**
 * Src/config/landing/landing page config module.
 */

export interface LandingNavLink {
  label: string
  href: string
  external?: boolean
}

export interface LandingAction {
  label: string
  href: string
  external?: boolean
}

export interface LandingHeaderConfig {
  logoText: string
  logoLetter?: string
  logoLink: string
  navItems: LandingNavLink[]
  ctaText: string
  ctaLink: string
  ctaVariant?: 'primary' | 'secondary' | 'outline'
}

export interface LandingHeroConfig {
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  layout?: 'centered' | 'split' | 'split-reverse'
  size?: 'sm' | 'md' | 'lg'
  badge?: string
  title: string
  subtitle: string
  image?: string
  imageAlt?: string
  primaryAction?: LandingAction
  secondaryAction?: LandingAction
  codeTitle?: string
  codeSnippet?: string
}

export interface LandingStatsItem {
  id: string
  value: number | string
  label: string
  icon?: string
  prefix?: string
  suffix?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

export interface LandingStatsConfig {
  title: string
  subtitle?: string
  items: LandingStatsItem[]
  columns?: number
}

export interface LandingServiceItem {
  id: string
  title: string
  description: string
  icon?: string
}

export interface LandingServicesConfig {
  title: string
  subtitle?: string
  items: LandingServiceItem[]
  columns?: number
}

export interface LandingStackCategory {
  id: string
  label: string
  items: string[]
}

export interface LandingStackConfig {
  title: string
  subtitle?: string
  categories: LandingStackCategory[]
}

export interface LandingContactField {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'textarea'
}

export interface LandingContactChannel {
  id: string
  label: string
  value: string
  href?: string
  external?: boolean
  icon?: string
}

export interface LandingContactPortalAction {
  label: string
  href: string
  external?: boolean
  description?: string
}

export interface LandingContactConfig {
  title: string
  subtitle?: string
  showForm?: boolean
  fields: LandingContactField[]
  channels: LandingContactChannel[]
  portalAction?: LandingContactPortalAction
  submitLabel?: string
}

export interface LandingCtaConfig {
  title: string
  subtitle?: string
  primaryCTA: {
    text: string
    link: string
  }
  secondaryCTA?: {
    text: string
    link: string
  }
}

export interface LandingFooterLinkItem {
  label: string
  href: string
  external?: boolean
}

export interface LandingFooterLinkSection {
  title: string
  links: LandingFooterLinkItem[]
}

export interface LandingFooterSocialItem {
  icon: string
  href: string
  label: string
}

export interface LandingFooterConfig {
  variant?: 'dark' | 'light'
  brandName: string
  brandDescription?: string
  linkSections: LandingFooterLinkSection[]
  socialTitle?: string
  socialLinks?: LandingFooterSocialItem[]
  copyrightText?: string
}

export interface LandingSectionsConfig {
  header: boolean
  hero: boolean
  stats: boolean
  services: boolean
  stack: boolean
  contact: boolean
  cta: boolean
  footer: boolean
}

export interface LandingPageConfig {
  sections: LandingSectionsConfig
  header: LandingHeaderConfig
  hero: LandingHeroConfig
  stats: LandingStatsConfig
  services: LandingServicesConfig
  stack: LandingStackConfig
  contact: LandingContactConfig
  cta: LandingCtaConfig
  footer: LandingFooterConfig
}

export type LandingCtaConfigOverrides = Omit<Partial<LandingCtaConfig>, 'primaryCTA' | 'secondaryCTA'> & {
  primaryCTA?: Partial<LandingCtaConfig['primaryCTA']>
  secondaryCTA?: LandingCtaConfig['secondaryCTA']
}

export interface LandingPageConfigOverrides {
  sections?: Partial<LandingSectionsConfig>
  header?: Partial<LandingHeaderConfig>
  hero?: Partial<LandingHeroConfig>
  stats?: Partial<LandingStatsConfig>
  services?: Partial<LandingServicesConfig>
  stack?: Partial<LandingStackConfig>
  contact?: Partial<LandingContactConfig>
  cta?: LandingCtaConfigOverrides
  footer?: Partial<LandingFooterConfig>
}

export const MGA_LABS_LANDING_PRESET: LandingPageConfig = {
  sections: {
    header: true,
    hero: true,
    stats: true,
    services: true,
    stack: true,
    contact: true,
    cta: true,
    footer: true,
  },
  header: {
    logoText: 'NetToolsKit Labs',
    logoLetter: 'N',
    logoLink: '#top',
    navItems: [
      { label: 'Servicos', href: '#services' },
      { label: 'Stack', href: '#stack' },
      { label: 'Contato', href: '#contact' },
    ],
    ctaText: 'Acessar Portal',
    ctaLink: '#contact',
    ctaVariant: 'primary',
  },
  hero: {
    variant: 'gradient',
    layout: 'split',
    size: 'lg',
    badge: 'Studio + Engenharia',
    title: 'Construimos plataformas web com foco em produto e performance',
    subtitle:
      'Componentes reutilizaveis, arquitetura clara e entregas orientadas a negocio para acelerar o ciclo de desenvolvimento.',
    image: '',
    imageAlt: 'Product engineering',
    primaryAction: {
      label: 'Iniciar projeto',
      href: '#contact',
    },
    secondaryAction: {
      label: 'Ver servicos',
      href: '#services',
    },
    codeTitle: 'Fluxo recomendado',
    codeSnippet: `const deliveryFlow = [\n  'Discovery',\n  'Arquitetura',\n  'Build',\n  'QA',\n  'Rollout'\n]`,
  },
  stats: {
    title: 'Numeros que importam',
    subtitle: 'Indicadores para orientar a evolucao do produto.',
    columns: 4,
    items: [
      { id: 'projects', value: 120, suffix: '+', label: 'Projetos entregues', icon: '📦' },
      { id: 'nps', value: 93, suffix: '%', label: 'Satisfacao media', icon: '⭐' },
      { id: 'support', value: '24/7', label: 'Suporte continuo', icon: '🛟' },
      { id: 'uptime', value: 99.9, suffix: '%', label: 'Disponibilidade', icon: '🚀' },
    ],
  },
  services: {
    title: 'Servicos principais',
    subtitle: 'Da estrategia ate a sustentacao da plataforma.',
    columns: 3,
    items: [
      { id: 'strategy', title: 'Estrategia de produto', description: 'Definicao de roadmap, descoberta e priorizacao.' },
      { id: 'frontend', title: 'Frontend engineering', description: 'Interfaces modernas, acessiveis e escalaveis.' },
      { id: 'backend', title: 'Backend e integracoes', description: 'APIs, workflows e observabilidade de ponta a ponta.' },
      { id: 'cloud', title: 'Cloud e DevOps', description: 'Ambientes confiaveis, CI/CD e operacao continua.' },
      { id: 'data', title: 'Dados e analytics', description: 'Modelagem, dashboards e indicadores acionaveis.' },
      { id: 'growth', title: 'Growth e experimentos', description: 'Testes, hipoteses e melhoria continua de conversao.' },
    ],
  },
  stack: {
    title: 'Stack de trabalho',
    subtitle: 'Tecnologias usadas para entregar com previsibilidade.',
    categories: [
      { id: 'frontend', label: 'Frontend', items: ['Vue', 'Quasar', 'TypeScript', 'Vitest'] },
      { id: 'backend', label: 'Backend', items: ['.NET', 'Node.js', 'PostgreSQL', 'Redis'] },
      { id: 'cloud', label: 'Cloud', items: ['Docker', 'Kubernetes', 'Azure', 'GitHub Actions'] },
      { id: 'data', label: 'Dados', items: ['BigQuery', 'Power BI', 'Metabase', 'ClickHouse'] },
    ],
  },
  contact: {
    title: 'Vamos conversar sobre seu projeto',
    subtitle: 'Preencha os dados e retornamos com um plano inicial.',
    showForm: true,
    submitLabel: 'Enviar briefing',
    fields: [
      { id: 'name', label: 'Nome', placeholder: 'Seu nome', required: true, type: 'text' },
      { id: 'email', label: 'Email', placeholder: 'voce@empresa.com', required: true, type: 'email' },
      { id: 'company', label: 'Empresa', placeholder: 'Nome da empresa', type: 'text' },
      { id: 'message', label: 'Mensagem', placeholder: 'Conte o objetivo do projeto', required: true, type: 'textarea' },
    ],
    channels: [
      { id: 'email', label: 'Email', value: 'contato@nettoolskit.com', href: 'mailto:contato@nettoolskit.com', icon: 'mail' },
      { id: 'whatsapp', label: 'WhatsApp', value: '+55 11 99999-0000', href: 'https://wa.me/5511999990000', external: true, icon: 'chat' },
      { id: 'location', label: 'Localizacao', value: 'Sao Paulo, Brasil', icon: 'location_on' },
    ],
    portalAction: {
      label: 'Acessar portal do cliente',
      href: '#contact',
      description: 'Ja possui projeto conosco? Entre no portal para acompanhar entregas e status.',
    },
  },
  cta: {
    title: 'Pronto para acelerar sua landing page?',
    subtitle: 'Use configuration plus dynamic components to reduce implementation time.',
    primaryCTA: {
      text: 'Comecar agora',
      link: '#contact',
    },
    secondaryCTA: {
      text: 'Falar com time',
      link: '#contact',
    },
  },
  footer: {
    variant: 'dark',
    brandName: 'NetToolsKit Labs',
    brandDescription: 'Outcome-oriented design system and components for product teams.',
    socialTitle: 'Social',
    socialLinks: [
      { icon: 'code', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', label: 'GitHub' },
      { icon: 'link', href: 'https://linkedin.com/in/thiagoguislotti', label: 'LinkedIn' },
    ],
    linkSections: [
      {
        title: 'Navegacao',
        links: [
          { label: 'Servicos', href: '#services' },
          { label: 'Stack', href: '#stack' },
          { label: 'Contato', href: '#contact' },
        ],
      },
      {
        title: 'Recursos',
        links: [
          { label: 'Documentacao', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', external: true },
          { label: 'Componentes', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/tree/main/src/components', external: true },
        ],
      },
    ],
    copyrightText: '© 2026 NetToolsKit Labs. All rights reserved.',
  },
}

/**
 * Handles merge landing config.
 */
function mergeLandingConfig(base: LandingPageConfig, partial: LandingPageConfigOverrides): LandingPageConfig {
  return {
    ...base,
    ...partial,
    sections: {
      ...base.sections,
      ...(partial.sections ?? {}),
    },
    header: {
      ...base.header,
      ...(partial.header ?? {}),
      navItems: partial.header?.navItems ?? base.header.navItems,
    },
    hero: {
      ...base.hero,
      ...(partial.hero ?? {}),
    },
    stats: {
      ...base.stats,
      ...(partial.stats ?? {}),
      items: partial.stats?.items ?? base.stats.items,
    },
    services: {
      ...base.services,
      ...(partial.services ?? {}),
      items: partial.services?.items ?? base.services.items,
    },
    stack: {
      ...base.stack,
      ...(partial.stack ?? {}),
      categories: partial.stack?.categories ?? base.stack.categories,
    },
    contact: {
      ...base.contact,
      ...(partial.contact ?? {}),
      fields: partial.contact?.fields ?? base.contact.fields,
      channels: partial.contact?.channels ?? base.contact.channels,
      portalAction: partial.contact?.portalAction ?? base.contact.portalAction,
    },
    cta: {
      ...base.cta,
      ...(partial.cta ?? {}),
      primaryCTA: {
        ...base.cta.primaryCTA,
        ...(partial.cta?.primaryCTA ?? {}),
      },
      secondaryCTA: partial.cta?.secondaryCTA ?? base.cta.secondaryCTA,
    },
    footer: {
      ...base.footer,
      ...(partial.footer ?? {}),
      linkSections: partial.footer?.linkSections ?? base.footer.linkSections,
      socialLinks: partial.footer?.socialLinks ?? base.footer.socialLinks,
    },
  }
}

/**
 * Creates landing page config.
 */
export function createLandingPageConfig(partial: LandingPageConfigOverrides = {}): LandingPageConfig {
  return mergeLandingConfig(MGA_LABS_LANDING_PRESET, partial)
}
