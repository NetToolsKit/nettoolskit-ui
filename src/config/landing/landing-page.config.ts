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
      { label: 'Services', href: '#services' },
      { label: 'Stack', href: '#stack' },
      { label: 'Contact', href: '#contact' },
    ],
    ctaText: 'Open Portal',
    ctaLink: '#contact',
    ctaVariant: 'primary',
  },
  hero: {
    variant: 'gradient',
    layout: 'split',
    size: 'lg',
    badge: 'Studio + Engineering',
    title: 'We build product-driven, high-performance web platforms',
    subtitle:
      'Reusable components, clear architecture, and outcome-oriented delivery accelerate the development cycle.',
    image: '',
    imageAlt: 'Product engineering',
    primaryAction: {
      label: 'Start a project',
      href: '#contact',
    },
    secondaryAction: {
      label: 'View services',
      href: '#services',
    },
    codeTitle: 'Recommended flow',
    codeSnippet: `const deliveryFlow = [\n  'Discovery',\n  'Architecture',\n  'Build',\n  'QA',\n  'Rollout'\n]`,
  },
  stats: {
    title: 'Numbers that matter',
    subtitle: 'Indicators that guide product evolution.',
    columns: 4,
    items: [
      { id: 'projects', value: 120, suffix: '+', label: 'Projects delivered', icon: '📦' },
      { id: 'nps', value: 93, suffix: '%', label: 'Average satisfaction', icon: '⭐' },
      { id: 'support', value: '24/7', label: 'Continuous support', icon: '🛟' },
      { id: 'uptime', value: 99.9, suffix: '%', label: 'Availability', icon: '🚀' },
    ],
  },
  services: {
    title: 'Core services',
    subtitle: 'From strategy to platform operations.',
    columns: 3,
    items: [
      { id: 'strategy', title: 'Product strategy', description: 'Roadmap definition, discovery, and prioritization.' },
      { id: 'frontend', title: 'Frontend engineering', description: 'Modern, accessible, and scalable interfaces.' },
      { id: 'backend', title: 'Backend and integrations', description: 'APIs, workflows, and end-to-end observability.' },
      { id: 'cloud', title: 'Cloud and DevOps', description: 'Reliable environments, CI/CD, and continuous operations.' },
      { id: 'data', title: 'Data and analytics', description: 'Modeling, dashboards, and actionable indicators.' },
      { id: 'growth', title: 'Growth and experiments', description: 'Tests, hypotheses, and continuous conversion improvement.' },
    ],
  },
  stack: {
    title: 'Work stack',
    subtitle: 'Technologies used to deliver with predictability.',
    categories: [
      { id: 'frontend', label: 'Frontend', items: ['Vue', 'Quasar', 'TypeScript', 'Vitest'] },
      { id: 'backend', label: 'Backend', items: ['.NET', 'Node.js', 'PostgreSQL', 'Redis'] },
      { id: 'cloud', label: 'Cloud', items: ['Docker', 'Kubernetes', 'Azure', 'GitHub Actions'] },
      { id: 'data', label: 'Data', items: ['BigQuery', 'Power BI', 'Metabase', 'ClickHouse'] },
    ],
  },
  contact: {
    title: 'Let us talk about your project',
    subtitle: 'Share a few details and we will return with an initial plan.',
    showForm: true,
    submitLabel: 'Send brief',
    fields: [
      { id: 'name', label: 'Name', placeholder: 'Your name', required: true, type: 'text' },
      { id: 'email', label: 'Email', placeholder: 'you@company.com', required: true, type: 'email' },
      { id: 'company', label: 'Company', placeholder: 'Company name', type: 'text' },
      { id: 'message', label: 'Message', placeholder: 'Tell us the project goal', required: true, type: 'textarea' },
    ],
    channels: [
      { id: 'email', label: 'Email', value: 'contact@nettoolskit.com', href: 'mailto:contact@nettoolskit.com', icon: 'mail' },
      { id: 'whatsapp', label: 'WhatsApp', value: '+55 11 99999-0000', href: 'https://wa.me/5511999990000', external: true, icon: 'chat' },
      { id: 'location', label: 'Location', value: 'Sao Paulo, Brazil', icon: 'location_on' },
    ],
    portalAction: {
      label: 'Open client portal',
      href: '#contact',
      description: 'Already working with us? Open the portal to track deliveries and status.',
    },
  },
  cta: {
    title: 'Ready to accelerate your landing page?',
    subtitle: 'Use configuration plus dynamic components to reduce implementation time.',
    primaryCTA: {
      text: 'Start now',
      link: '#contact',
    },
    secondaryCTA: {
      text: 'Talk to the team',
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
        title: 'Navigation',
        links: [
          { label: 'Services', href: '#services' },
          { label: 'Stack', href: '#stack' },
          { label: 'Contact', href: '#contact' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', external: true },
          { label: 'Components', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/tree/main/src/components', external: true },
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
