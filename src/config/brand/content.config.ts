/**
 * Brand Content Configuration
 * 
 * Footer content, social links, contact information, and copyright notices.
 * Manages textual content and external links for brand presence.
 * 
 * ## Purpose
 * Centralize brand content to ensure:
 * - Consistent messaging across pages
 * - Single source for contact information
 * - Easy updates to social media links
 * - Unified copyright management
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY textual content and external links. Does NOT include:
 * - Navigation structure → see navigation.config.ts
 * - Brand identity (logo, name, tagline) → see identity.config.ts
 * - Visual styling → see colors/ and visual/ configs
 * 
 * ## Usage
 * ```typescript
 * import { sentinelaContent } from '@/config/brand/content.config'
 * 
 * const social = sentinelaContent.social.map(link => ({
 *   icon: link.icon,
 *   url: link.url
 * }))
 * ```
 * 
 * @module brand/content.config
 */

// ============================
// Content Interfaces
// ============================

/**
 * Social Media Link
 * 
 * External link to social media profile.
 * 
 * @example
 * ```typescript
 * const link: SocialLink = {
 *   platform: 'LinkedIn',
 *   url: 'https://linkedin.com/company/example',
 *   icon: 'mdi-linkedin',
 *   username: '@example'
 * }
 * ```
 */
export interface SocialLink {
  /**
   * Platform name (e.g., 'LinkedIn', 'GitHub', 'Twitter')
   */
  platform: string
  
  /**
   * Full URL to profile
   */
  url: string
  
  /**
   * Icon identifier (Material Design Icons preferred)
   */
  icon: string
  
  /**
   * Optional username/handle for display
   */
  username?: string
  
  /**
   * Optional aria-label for accessibility
   * If not provided, uses platform name
   */
  ariaLabel?: string
}

/**
 * Contact Information
 * 
 * Ways to reach the organization.
 * 
 * @example
 * ```typescript
 * const contact: ContactInfo = {
 *   email: 'contact@example.com',
 *   phone: '+55 (11) 99999-9999',
 *   whatsapp: '+5511999999999'
 * }
 * ```
 */
export interface ContactInfo {
  /**
   * Primary contact email
   */
  email?: string
  
  /**
   * Phone number (formatted for display)
   */
  phone?: string
  
  /**
   * WhatsApp number (raw format for links)
   */
  whatsapp?: string
  
  /**
   * Physical address (multiline string)
   */
  address?: string
  
  /**
   * Support/help URL
   */
  supportUrl?: string
}

/**
 * Footer Section
 * 
 * Grouped links for footer organization.
 * 
 * @example
 * ```typescript
 * const section: FooterSection = {
 *   title: 'Produto',
 *   links: [
 *     { label: 'Funcionalidades', href: '#features' },
 *     { label: 'Preços', href: '#pricing' }
 *   ]
 * }
 * ```
 */
export interface FooterSection {
  /**
   * Section heading
   */
  title: string
  
  /**
   * Links in this section
   */
  links: Array<{
    label: string
    href: string
    external?: boolean
  }>
}

/**
 * Brand Content Configuration
 * 
 * Complete content structure for a brand.
 */
export interface BrandContent {
  /**
   * Footer description/tagline
   * Short text displayed in footer (1-2 sentences)
   */
  footerDescription: string
  
  /**
   * Grouped footer links
   * Organized in columns/sections
   */
  footerSections?: FooterSection[]
  
  /**
   * Social media links
   */
  social: SocialLink[]
  
  /**
   * Contact information
   */
  contact: ContactInfo
  
  /**
   * Copyright text
   * If not provided, auto-generated from brand identity
   */
  copyright?: string
  
  /**
   * Privacy policy URL
   */
  privacyPolicyUrl?: string
  
  /**
   * Terms of service URL
   */
  termsOfServiceUrl?: string
}

// ============================
// Brand Content Configs
// ============================

/**
 * Sentinela Content
 * 
 * Corporate content with professional tone.
 * Focus on business benefits and support channels.
 */
export const sentinelaContent: BrandContent = {
  footerDescription:
    'Sentinela é um sistema de busca profissional que ajuda empresas e pesquisadores a encontrar informações relevantes com rapidez e precisão.',
  
  footerSections: [
    {
      title: 'Produto',
      links: [
        { label: 'Funcionalidades', href: '#funcionalidades' },
        { label: 'Planos', href: '#planos' },
        { label: 'Integrações', href: '/integrations' },
        { label: 'API', href: '/api-docs', external: true },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Carreira', href: '/careers' },
        { label: 'Contato', href: '#contato' },
      ],
    },
    {
      title: 'Suporte',
      links: [
        { label: 'Documentação', href: '/docs', external: true },
        { label: 'FAQ', href: '/faq' },
        { label: 'Status', href: 'https://status.sentinela.com', external: true },
        { label: 'Contato', href: 'mailto:support@sentinela.com' },
      ],
    },
  ],
  
  social: [
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/company/sentinela',
      icon: 'mdi-linkedin',
      username: '@sentinela',
      ariaLabel: 'Siga-nos no LinkedIn',
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/sentinela',
      icon: 'mdi-twitter',
      username: '@sentinela',
      ariaLabel: 'Siga-nos no Twitter',
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/sentinela',
      icon: 'mdi-github',
      username: '@sentinela',
      ariaLabel: 'Veja nosso código no GitHub',
    },
  ],
  
  contact: {
    email: 'contato@sentinela.com',
    phone: '+55 (11) 3000-0000',
    whatsapp: '+5511999999999',
    supportUrl: '/support',
  },
  
  privacyPolicyUrl: '/privacy',
  termsOfServiceUrl: '/terms',
}

/**
 * PlaTEA Content
 * 
 * Friendly, supportive content for accessibility-focused audience.
 * Emphasis on help resources and community.
 */
export const plateaContent: BrandContent = {
  footerDescription:
    'PlaTEA é uma agenda visual assistida que facilita o planejamento e organização do dia a dia de forma acessível e inclusiva.',
  
  footerSections: [
    {
      title: 'Funcionalidades',
      links: [
        { label: 'Agenda Visual', href: '#agenda' },
        { label: 'Modo Acessível', href: '/acessibilidade' },
        { label: 'Rotinas', href: '#rotinas' },
        { label: 'Lembretes', href: '#lembretes' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Tutorial', href: '#tutorial' },
        { label: 'Dicas de Uso', href: '/dicas' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Suporte', href: '/suporte' },
      ],
    },
    {
      title: 'Sobre',
      links: [
        { label: 'Nossa História', href: '/sobre' },
        { label: 'Depoimentos', href: '#depoimentos' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contato', href: '#contato' },
      ],
    },
  ],
  
  social: [
    {
      platform: 'Instagram',
      url: 'https://instagram.com/platea.app',
      icon: 'mdi-instagram',
      username: '@platea.app',
      ariaLabel: 'Siga-nos no Instagram',
    },
    {
      platform: 'Facebook',
      url: 'https://facebook.com/plateaapp',
      icon: 'mdi-facebook',
      username: '@plateaapp',
      ariaLabel: 'Curta nossa página no Facebook',
    },
    {
      platform: 'YouTube',
      url: 'https://youtube.com/@platea',
      icon: 'mdi-youtube',
      username: '@platea',
      ariaLabel: 'Veja nossos tutoriais no YouTube',
    },
  ],
  
  contact: {
    email: 'contato@platea.app',
    whatsapp: '+5511988888888',
    supportUrl: '/suporte',
  },
  
  privacyPolicyUrl: '/privacidade',
  termsOfServiceUrl: '/termos',
}

/**
 * NetToolsKit Content
 * 
 * Developer-focused content with technical resources.
 * Emphasis on open source and community contribution.
 */
export const nettoolskitContent: BrandContent = {
  footerDescription:
    'NetToolsKit UI é uma biblioteca moderna de componentes Vue 3 + Quasar, desenvolvida para criar interfaces de usuário rápidas e acessíveis.',
  
  footerSections: [
    {
      title: 'Documentação',
      links: [
        { label: 'Getting Started', href: '#installation' },
        { label: 'Components', href: '#components' },
        { label: 'Themes', href: '#themes' },
        { label: 'API Reference', href: '/api', external: true },
      ],
    },
    {
      title: 'Comunidade',
      links: [
        { label: 'GitHub', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', external: true },
        { label: 'Issues', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/issues', external: true },
        { label: 'Discussions', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/discussions', external: true },
        { label: 'Contributing', href: '/CONTRIBUTING.md', external: true },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Changelog', href: '/CHANGELOG.md', external: true },
        { label: 'Examples', href: '/samples' },
        { label: 'Playground', href: '/playground' },
        { label: 'npm Package', href: 'https://www.npmjs.com/package/@nettoolskit/ui', external: true },
      ],
    },
  ],
  
  social: [
    {
      platform: 'GitHub',
      url: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
      icon: 'mdi-github',
      username: '@ThiagoGuislotti',
      ariaLabel: 'View source code on GitHub',
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/nettoolskit',
      icon: 'mdi-twitter',
      username: '@nettoolskit',
      ariaLabel: 'Follow us on Twitter',
    },
    {
      platform: 'npm',
      url: 'https://www.npmjs.com/package/@nettoolskit/ui',
      icon: 'mdi-npm',
      username: '@nettoolskit/ui',
      ariaLabel: 'View package on npm',
    },
  ],
  
  contact: {
    email: 'thiagoguislotti@gmail.com',
    supportUrl: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/issues',
  },
  
  privacyPolicyUrl: '/privacy',
  termsOfServiceUrl: '/license',
}

// ============================
// Content Registry
// ============================

/**
 * All Content Configurations
 * 
 * Registry for dynamic brand content.
 */
export const contents = {
  sentinela: sentinelaContent,
  platea: plateaContent,
  nettoolskit: nettoolskitContent,
} as const

export type ContentName = keyof typeof contents

/**
 * Get Content by Name
 * 
 * Helper function to retrieve content configuration.
 * 
 * @param name - Brand identifier
 * @returns Brand content configuration
 * 
 * @example
 * ```typescript
 * import { getContent } from '@/config/brand/content.config'
 * 
 * const content = getContent('sentinela')
 * const socialLinks = content.social
 * const contactEmail = content.contact.email
 * ```
 */
export function getContent(name: ContentName): BrandContent {
  return contents[name]
}

/**
 * Format Phone Number for Display
 * 
 * Formats phone number with appropriate spacing and formatting.
 * 
 * @param phone - Raw phone number
 * @returns Formatted phone string
 * 
 * @example
 * ```typescript
 * formatPhone('+5511999999999') // '+55 (11) 99999-9999'
 * ```
 */
export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Brazilian phone format: +55 (11) 99999-9999
  if (cleaned.startsWith('55') && cleaned.length === 13) {
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/)
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`
    }
  }
  
  // Fallback: return as-is
  return phone
}

/**
 * Get WhatsApp Link
 * 
 * Generates WhatsApp click-to-chat URL.
 * 
 * @param whatsapp - WhatsApp number (raw format)
 * @param message - Optional pre-filled message
 * @returns WhatsApp URL
 * 
 * @example
 * ```typescript
 * getWhatsAppLink('+5511999999999', 'Olá! Gostaria de mais informações.')
 * // 'https://wa.me/5511999999999?text=Olá!%20Gostaria...'
 * ```
 */
export function getWhatsAppLink(whatsapp: string, message?: string): string {
  const cleaned = whatsapp.replace(/\D/g, '')
  let url = `https://wa.me/${cleaned}`
  
  if (message) {
    url += `?text=${encodeURIComponent(message)}`
  }
  
  return url
}

/**
 * Get Social Link by Platform
 * 
 * Find social link by platform name (case-insensitive).
 * 
 * @param content - Brand content configuration
 * @param platform - Platform name (e.g., 'LinkedIn', 'GitHub')
 * @returns Social link or undefined
 * 
 * @example
 * ```typescript
 * import { sentinelaContent, getSocialLinkByPlatform } from '@/config/brand/content.config'
 * 
 * const linkedin = getSocialLinkByPlatform(sentinelaContent, 'LinkedIn')
 * if (linkedin) {
 *   console.log(linkedin.url)
 * }
 * ```
 */
export function getSocialLinkByPlatform(
  content: BrandContent,
  platform: string
): SocialLink | undefined {
  const normalized = platform.toLowerCase()
  return content.social.find(link => link.platform.toLowerCase() === normalized)
}