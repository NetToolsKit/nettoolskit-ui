/**
 * Brand Identity Configuration
 * 
 * Core brand information: name, logo, description, and visual identity.
 * Single source of truth for brand-specific metadata.
 * 
 * ## Purpose
 * Centralize brand identity information to ensure:
 * - Consistent branding across all touchpoints
 * - Easy brand switching in multi-tenant applications
 * - Single place to update brand information
 * - Separation of identity from navigation/content
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY brand identity data. Does NOT include:
 * - Navigation links → see navigation.config.ts
 * - Footer content/social links → see content.config.ts
 * - Brand colors → see colors/palette.config.ts
 * - Typography → see visual/typography.config.ts
 * 
 * ## Usage
 * ```typescript
 * import { sentinelaIdentity } from '@/config/brand/identity.config'
 * 
 * const app = {
 *   title: sentinelaIdentity.displayName,
 *   logo: sentinelaIdentity.logo.value,
 *   tagline: sentinelaIdentity.tagline
 * }
 * ```
 * 
 * @module brand/identity.config
 */

// ============================
// Identity Interfaces
// ============================

/**
 * Logo Configuration
 * 
 * Defines the logo representation and styling.
 * Supports letter-based, icon-based, or image-based logos.
 * 
 * @example
 * ```typescript
 * const logo: LogoConfig = {
 *   type: 'letter',
 *   value: 'S',
 *   alt: 'Sentinela Logo',
 *   size: 'md'
 * }
 * ```
 */
export interface LogoConfig {
  /**
   * Type of logo representation
   * - letter: Single character or initials
   * - icon: Icon name (Material Icons, Font Awesome, etc.)
   * - image: URL to image file
   */
  type: 'letter' | 'icon' | 'image'
  
  /**
   * Logo value
   * - For letter: The character(s) to display
   * - For icon: Icon class or name
   * - For image: URL to image file
   */
  value: string
  
  /**
   * Alternative text for accessibility
   * Used in img alt attribute and aria-label
   */
  alt: string
  
  /**
   * Logo size preset
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Brand Identity Configuration
 * 
 * Complete brand identity information.
 * Core metadata that defines the brand.
 */
export interface BrandIdentity {
  /**
   * Internal brand name (lowercase, no spaces)
   * Used as identifier in code
   * @example 'sentinela', 'platea', 'nettoolskit'
   */
  name: string
  
  /**
   * Display name shown to users
   * Proper capitalization and spacing
   * @example 'Sentinela', 'PlaTEA', 'NetToolsKit UI'
   */
  displayName: string
  
  /**
   * Short tagline or slogan
   * Optional descriptive subtitle
   * @example 'Sistema de Busca', 'Agenda Visual Assistida'
   */
  tagline?: string
  
  /**
   * Logo configuration
   */
  logo: LogoConfig
  
  /**
   * Brief brand description
   * 1-2 sentences explaining what the brand does
   */
  description: string
  
  /**
   * Primary website URL
   * Optional - for external references
   */
  url?: string
  
  /**
   * App version
   * Semantic versioning (major.minor.patch)
   * @example '1.0.0', '2.3.4'
   */
  version?: string
  
  /**
   * Copyright holder name
   * @example 'Sentinela Inc.', 'Thiago Guislotti'
   */
  copyright?: string
  
  /**
   * License type
   * @example 'MIT', 'Apache 2.0', 'Proprietary'
   */
  license?: string
}

// ============================
// Brand Identities
// ============================

/**
 * Sentinela Brand Identity
 * 
 * Professional search and monitoring system.
 * Corporate blue theme with clean, business-focused aesthetic.
 * 
 * **Target Audience**: Businesses, researchers, content creators
 * **Brand Personality**: Professional, reliable, efficient, trustworthy
 * **Visual Style**: Clean, corporate, modern
 */
export const sentinelaIdentity: BrandIdentity = {
  name: 'sentinela',
  displayName: 'Sentinela',
  tagline: 'Sistema de Busca',
  logo: {
    type: 'letter',
    value: 'S',
    alt: 'Sentinela Logo',
    size: 'md',
  },
  description: 'Sistema inteligente de busca e monitoramento de vídeos no YouTube. Encontre, organize e monitore conteúdo de forma eficiente.',
  url: 'https://sentinela.example.com',
  version: '1.0.0',
  copyright: 'Sentinela',
  license: 'Proprietary',
}

/**
 * PlaTEA Brand Identity
 * 
 * Visual agenda for neurodivergent individuals.
 * Warm, accessible design with focus on usability and clarity.
 * 
 * **Target Audience**: Neurodivergent individuals, caregivers, therapists
 * **Brand Personality**: Friendly, supportive, calm, accessible
 * **Visual Style**: Warm, soft, clear, high contrast
 */
export const plateaIdentity: BrandIdentity = {
  name: 'platea',
  displayName: 'PlaTEA',
  tagline: 'Agenda Visual Assistida',
  logo: {
    type: 'letter',
    value: 'P',
    alt: 'PlaTEA Logo',
    size: 'md',
  },
  description: 'Plataforma de agenda visual assistida para pessoas neurodivergentes. Organize sua rotina com clareza e acessibilidade.',
  url: 'https://platea.example.com',
  version: '1.0.0',
  copyright: 'PlaTEA',
  license: 'MIT',
}

/**
 * NetToolsKit UI Brand Identity
 * 
 * Vue 3 + Quasar component library.
 * Modern, developer-focused design system.
 * 
 * **Target Audience**: Developers, designers, product teams
 * **Brand Personality**: Modern, innovative, flexible, powerful
 * **Visual Style**: Tech-forward, vibrant, clean, systematic
 */
export const nettoolskitIdentity: BrandIdentity = {
  name: 'nettoolskit',
  displayName: 'NetToolsKit UI',
  tagline: 'Vue 3 + Quasar Component Library',
  logo: {
    type: 'letter',
    value: 'NTK',
    alt: 'NetToolsKit UI Logo',
    size: 'md',
  },
  description: 'Reusable Vue 3 + Quasar component library with a complete theme and design token system.',
  url: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
  version: '0.1.0',
  copyright: 'Thiago Guislotti',
  license: 'MIT',
}

// ============================
// Identity Registry
// ============================

/**
 * All Brand Identities
 * 
 * Registry for dynamic brand switching.
 * 
 * @example
 * ```typescript
 * import { identities } from '@/config/brand/identity.config'
 * 
 * const currentBrand = 'sentinela'
 * const brand = identities[currentBrand]
 * document.title = brand.displayName
 * ```
 */
export const identities = {
  sentinela: sentinelaIdentity,
  platea: plateaIdentity,
  nettoolskit: nettoolskitIdentity,
} as const

export type BrandName = keyof typeof identities

/**
 * Get Brand Identity by Name
 * 
 * Helper function to retrieve identity configuration.
 * Useful for dynamic brand switching in multi-tenant apps.
 * 
 * @param name - Brand identifier
 * @returns Brand identity configuration
 * 
 * @example
 * ```typescript
 * import { getBrandIdentity } from '@/config/brand/identity.config'
 * 
 * const brand = getBrandIdentity('sentinela')
 * console.log(brand.displayName) // 'Sentinela'
 * console.log(brand.tagline)     // 'Sistema de Busca'
 * ```
 */
export function getBrandIdentity(name: BrandName): BrandIdentity {
  return identities[name]
}

/**
 * Get Current Year for Copyright
 * 
 * Helper to generate copyright notice with current year.
 * 
 * @param brandName - Brand to generate copyright for
 * @returns Formatted copyright string
 * 
 * @example
 * ```typescript
 * getCopyrightNotice('sentinela')
 * // Returns: "© 2025 Sentinela. Todos os direitos reservados."
 * ```
 */
export function getCopyrightNotice(brandName: BrandName): string {
  const brand = identities[brandName]
  const year = new Date().getFullYear()
  const holder = brand.copyright || brand.displayName
  
  return `© ${year} ${holder}. Todos os direitos reservados.`
}
