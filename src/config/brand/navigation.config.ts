/**
 * Brand Navigation Configuration
 * 
 * Navigation links, menus, and call-to-action buttons.
 * Defines site structure and user journey.
 * 
 * ## Purpose
 * Centralize navigation structure to ensure:
 * - Consistent navigation across pages
 * - Easy menu restructuring
 * - Single source of truth for links
 * - Support for multi-level navigation
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY navigation structure. Does NOT include:
 * - Brand identity (logo, name) → see identity.config.ts
 * - Footer content (social links) → see content.config.ts
 * - Visual styling → see colors/ and visual/ configs
 * 
 * ## Usage
 * ```typescript
 * import { sentinelaNavigation } from '@/config/brand/navigation.config'
 * 
 * const menu = sentinelaNavigation.header.map(item => ({
 *   label: item.label,
 *   to: item.href
 * }))
 * ```
 * 
 * @module brand/navigation.config
 */

// ============================
// Navigation Interfaces
// ============================

/**
 * Navigation Link
 * 
 * Represents a single clickable navigation item.
 * 
 * @example
 * ```typescript
 * const link: NavLink = {
 *   label: 'Componentes',
 *   href: '#components',
 *   icon: 'mdi-view-dashboard',
 *   external: false
 * }
 * ```
 */
export interface NavLink {
  /**
   * Display text for the link
   */
  label: string
  
  /**
   * Target URL or route path
   * Can be relative (#section) or absolute (https://...)
   */
  href: string
  
  /**
   * Optional icon identifier
   * Material Icons, Font Awesome, or custom icon name
   */
  icon?: string
  
  /**
   * Whether link opens in new tab
   * @default false
   */
  external?: boolean
  
  /**
   * Optional badge text (e.g., "New", "Beta")
   */
  badge?: string
  
  /**
   * Optional child links for dropdown menus
   */
  children?: NavLink[]
}

/**
 * Call-to-Action Button
 * 
 * Primary action button configuration.
 * 
 * @example
 * ```typescript
 * const cta: CTAButton = {
 *   text: 'Get Started',
 *   href: '/signup',
 *   variant: 'primary',
 *   icon: 'mdi-rocket-launch'
 * }
 * ```
 */
export interface CTAButton {
  /**
   * Button text
   */
  text: string
  
  /**
   * Target URL
   */
  href: string
  
  /**
   * Visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  
  /**
   * Optional icon
   */
  icon?: string
  
  /**
   * Whether to open in new tab
   * @default false
   */
  external?: boolean
}

/**
 * Brand Navigation Configuration
 * 
 * Complete navigation structure for a brand.
 */
export interface BrandNavigation {
  /**
   * Header/top navigation links
   * Main site navigation menu
   */
  header: NavLink[]
  
  /**
   * Primary call-to-action button
   * Shown in header/hero sections
   */
  primaryCTA: CTAButton
  
  /**
   * Optional secondary CTA
   */
  secondaryCTA?: CTAButton
  
  /**
   * Mobile navigation links
   * Can be different from header for mobile optimization
   * If not provided, uses header links
   */
  mobile?: NavLink[]
}

// ============================
// Brand Navigation Configs
// ============================

/**
 * Sentinela Navigation
 * 
 * Corporate website structure with product focus.
 * Clear path to product features and sign-up.
 */
export const sentinelaNavigation: BrandNavigation = {
  header: [
    {
      label: 'Funcionalidades',
      href: '#funcionalidades',
      icon: 'mdi-feature-search',
    },
    {
      label: 'Planos',
      href: '#planos',
      icon: 'mdi-currency-usd',
    },
    {
      label: 'Contato',
      href: '#contato',
      icon: 'mdi-email',
    },
    {
      label: 'Documentação',
      href: '/docs',
      icon: 'mdi-book-open-variant',
      external: true,
    },
  ],
  primaryCTA: {
    text: 'Começar Agora',
    href: '/search',
    variant: 'primary',
    icon: 'mdi-arrow-right',
  },
  secondaryCTA: {
    text: 'Ver Demo',
    href: '#demo',
    variant: 'outline',
    icon: 'mdi-play-circle-outline',
  },
}

/**
 * PlaTEA Navigation
 * 
 * Accessible website structure with focus on usability.
 * Clear, simple navigation optimized for neurodivergent users.
 */
export const plateaNavigation: BrandNavigation = {
  header: [
    {
      label: 'Funcionalidades',
      href: '#funcionalidades',
      icon: 'mdi-view-dashboard',
    },
    {
      label: 'Planos',
      href: '#planos',
      icon: 'mdi-wallet',
    },
    {
      label: 'Acessibilidade',
      href: '/acessibilidade',
      icon: 'mdi-human',
    },
    {
      label: 'Contato',
      href: '#contato',
      icon: 'mdi-message',
    },
  ],
  primaryCTA: {
    text: 'Começar Grátis',
    href: '/app',
    variant: 'primary',
    icon: 'mdi-calendar-check',
  },
  secondaryCTA: {
    text: 'Ver Tutorial',
    href: '#tutorial',
    variant: 'outline',
    icon: 'mdi-school',
  },
}

/**
 * NetToolsKit Navigation
 * 
 * Developer-focused documentation structure.
 * Quick access to components, themes, and installation.
 */
export const nettoolskitNavigation: BrandNavigation = {
  header: [
    {
      label: 'Componentes',
      href: '#components',
      icon: 'mdi-puzzle',
      children: [
        { label: 'Layout', href: '#layout', icon: 'mdi-page-layout-header' },
        { label: 'Form', href: '#form', icon: 'mdi-form-textbox' },
        { label: 'UI', href: '#ui', icon: 'mdi-palette' },
      ],
    },
    {
      label: 'Temas',
      href: '#themes',
      icon: 'mdi-palette-swatch',
    },
    {
      label: 'Instalação',
      href: '#installation',
      icon: 'mdi-download',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
      icon: 'mdi-github',
      external: true,
    },
  ],
  primaryCTA: {
    text: 'View on GitHub',
    href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
    variant: 'primary',
    icon: 'mdi-github',
    external: true,
  },
  secondaryCTA: {
    text: 'Live Demo',
    href: '/demo',
    variant: 'outline',
    icon: 'mdi-television-play',
  },
}

// ============================
// Navigation Registry
// ============================

/**
 * All Navigation Configurations
 * 
 * Registry for dynamic brand navigation.
 */
export const navigations = {
  sentinela: sentinelaNavigation,
  platea: plateaNavigation,
  nettoolskit: nettoolskitNavigation,
} as const

export type NavigationName = keyof typeof navigations

/**
 * Get Navigation by Name
 * 
 * Helper function to retrieve navigation configuration.
 * 
 * @param name - Brand identifier
 * @returns Brand navigation configuration
 * 
 * @example
 * ```typescript
 * import { getNavigation } from '@/config/brand/navigation.config'
 * 
 * const nav = getNavigation('sentinela')
 * const menuItems = nav.header
 * const ctaButton = nav.primaryCTA
 * ```
 */
export function getNavigation(name: NavigationName): BrandNavigation {
  return navigations[name]
}

/**
 * Flatten Navigation Links
 * 
 * Converts hierarchical navigation (with children) into flat list.
 * Useful for sitemap generation or breadcrumbs.
 * 
 * @param links - Navigation links to flatten
 * @returns Flat array of all links including nested children
 * 
 * @example
 * ```typescript
 * import { flattenNavLinks, nettoolskitNavigation } from '@/config/brand/navigation.config'
 * 
 * const allLinks = flattenNavLinks(nettoolskitNavigation.header)
 * // Returns all links including children of 'Componentes'
 * ```
 */
export function flattenNavLinks(links: NavLink[]): NavLink[] {
  const flattened: NavLink[] = []
  
  for (const link of links) {
    // Add parent link (without children to avoid circular reference)
    const { children, ...linkWithoutChildren } = link
    flattened.push(linkWithoutChildren)
    
    // Recursively add children
    if (children && children.length > 0) {
      flattened.push(...flattenNavLinks(children))
    }
  }
  
  return flattened
}
