/**
 * NetToolsKit Brand Preset
 * 
 * Complete brand configuration for NetToolsKit UI library.
 * Modern, developer-focused, innovative aesthetic.
 * 
 * ## Purpose
 * One-stop import for all NetToolsKit configurations:
 * - Purple color palette (creativity, innovation)
 * - JetBrains Mono display font (developer aesthetic)
 * - Standard spacing and responsive behavior
 * - Open source and community-focused content
 * 
 * ## Usage
 * ```typescript
 * import { nettoolskitPreset, applyNettoolskitPreset } from '@/config/presets/nettoolskit.preset'
 * 
 * // Apply entire preset at app initialization
 * applyNettoolskitPreset()
 * 
 * // Or use individual configs
 * const colors = nettoolskitPreset.colors.palette
 * const nav = nettoolskitPreset.brand.navigation
 * ```
 * 
 * @module presets/nettoolskit.preset
 */

// Colors
import { nettoolskitPalette, type BrandPalette } from '../../src/config/colors/palette.config'
import { semanticColors, type SemanticColors } from '../../src/config/colors/semantic.config'
import { lightThemeColors, darkThemeColors, type ThemeColorPalette } from '../../src/config/colors/theme-mode.config'

// Visual
import { nettoolskitTypography, applyTypography, type TypographyConfig } from '../../src/config/visual/typography.config'
import { nettoolskitEffects, applyEffects, type EffectsConfig } from '../../src/config/visual/effects.config'
import { defaultSpacing, applySpacing, type SpacingConfig } from '../../src/config/visual/spacing.config'

// Layout
import { dashboardLayout, type LayoutConfig } from '../../src/config/layout/structure.config'
import { defaultResponsive, type ResponsiveConfig } from '../../src/config/layout/responsive.config'

// Brand
import { nettoolskitIdentity, type BrandIdentity } from '../../src/config/brand/identity.config'
import { nettoolskitNavigation, type BrandNavigation } from '../../src/config/brand/navigation.config'
import { nettoolskitContent, type BrandContent } from '../../src/config/brand/content.config'

// ============================
// NetToolsKit Preset
// ============================

/**
 * Complete Brand Preset Interface
 * Aggregates all brand configurations
 */
export interface BrandPreset {
  colors: {
    palette: BrandPalette
    semantic: SemanticColors
    themes: {
      light: ThemeColorPalette
      dark: ThemeColorPalette
    }
  }
  visual: {
    typography: TypographyConfig
    effects: EffectsConfig
    spacing: SpacingConfig
  }
  layout: {
    structure: LayoutConfig
    responsive: ResponsiveConfig
  }
  brand: {
    identity: BrandIdentity
    navigation: BrandNavigation
    content: BrandContent
  }
}

/**
 * NetToolsKit Complete Preset
 * 
 * Modern component library with developer-focused aesthetic.
 * 
 * **Brand Personality**:
 * - Modern and innovative
 * - Developer-friendly
 * - Flexible and powerful
 * - Open source and collaborative
 * 
 * **Target Audience**:
 * - Frontend developers
 * - UI/UX designers
 * - Product teams
 * - Open source contributors
 * 
 * **Visual Style**:
 * - Rich purple palette (creativity, innovation, tech)
 * - Cool gray secondary colors
 * - **JetBrains Mono** for display font (developer aesthetic)
 * - Standard Inter for body text (readability)
 * - Purple-tinted shadows for depth
 * - Standard 16px base size and 4px spacing
 * - Dashboard-optimized layout (compact header, wider sidebar)
 * 
 * **Developer Features**:
 * - Code-friendly monospace font for headings
 * - Dark mode optimized
 * - Component showcase layout
 * - GitHub integration
 * - Documentation-first approach
 * 
 * @example
 * ```typescript
 * import { nettoolskitPreset } from '@/config/presets/nettoolskit.preset'
 * 
 * // Access specific configs
 * const primaryColor = nettoolskitPreset.colors.palette.primary[500] // #512BD4
 * const displayFont = nettoolskitPreset.visual.typography.fonts.display // 'JetBrains Mono'
 * const githubUrl = nettoolskitPreset.brand.content.social.find(s => s.platform === 'GitHub')?.url
 * ```
 */
export const nettoolskitPreset: BrandPreset = {
  colors: {
    palette: nettoolskitPalette,
    semantic: semanticColors,
    themes: {
      light: lightThemeColors,
      dark: darkThemeColors,
    },
  },
  
  visual: {
    typography: nettoolskitTypography,  // JetBrains Mono display + Inter body
    effects: nettoolskitEffects,        // Purple-tinted shadows
    spacing: defaultSpacing,            // Standard 4px grid
  },
  
  layout: {
    structure: dashboardLayout,         // Compact header, wider sidebar
    responsive: defaultResponsive,      // Standard breakpoints
  },
  
  brand: {
    identity: nettoolskitIdentity,
    navigation: nettoolskitNavigation,
    content: nettoolskitContent,
  },
}

// ============================
// Apply Functions
// ============================

/**
 * Apply NetToolsKit Preset
 * 
 * Applies all NetToolsKit configurations to the application.
 * Optimized for component library showcase and documentation.
 * 
 * **What it does**:
 * 1. Applies typography with JetBrains Mono for headings
 * 2. Applies visual effects with purple-tinted shadows
 * 3. Applies standard spacing system
 * 4. Sets up dashboard layout (compact header, wider sidebar)
 * 5. Adds syntax highlighting support for code examples
 * 6. Configures dark mode as default (developer preference)
 * 
 * @param mode - Theme mode ('light' or 'dark')
 * @param options - Additional options
 * 
 * @example
 * ```typescript
 * import { applyNettoolskitPreset } from '@/config/presets/nettoolskit.preset'
 * 
 * // In main.ts or app initialization
 * applyNettoolskitPreset('dark', {
 *   enableCodeHighlight: true,
 *   enableHotReload: import.meta.env.DEV
 * })
 * ```
 */
export function applyNettoolskitPreset(
  mode: 'light' | 'dark' = 'dark', // Default to dark for developers
  options: {
    enableCodeHighlight?: boolean
    enableHotReload?: boolean
  } = {}
): void {
  // Apply visual configs
  applyTypography(nettoolskitPreset.visual.typography)
  applyEffects(nettoolskitPreset.visual.effects)
  applySpacing(nettoolskitPreset.visual.spacing)
  
  // Apply theme colors
  const themeColors = mode === 'light' 
    ? nettoolskitPreset.colors.themes.light 
    : nettoolskitPreset.colors.themes.dark
  
  // Apply theme colors as CSS variables
  const root = document.documentElement
  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, String(value))
  })
  
  // Apply semantic colors
  Object.entries(nettoolskitPreset.colors.semantic).forEach(([key, value]) => {
    root.style.setProperty(`--semantic-${key}`, String(value))
  })
  
  // Set document title
  if (nettoolskitPreset.brand.identity.displayName) {
    document.title = `${nettoolskitPreset.brand.identity.displayName} - ${nettoolskitPreset.brand.identity.tagline}`
  }
  
  // Add brand class for brand-specific styling
  root.classList.add('brand-nettoolskit')
  
  // Add theme class
  root.classList.toggle('theme-dark', mode === 'dark')
  root.classList.toggle('theme-light', mode === 'light')
  
  // Developer features
  
  // Enable code highlighting (if requested)
  if (options.enableCodeHighlight) {
    root.classList.add('code-highlight-enabled')
    // Load Prism.js or similar if needed
  }
  
  // Hot reload indicator (if in dev mode)
  if (options.enableHotReload) {
    root.classList.add('hot-reload-enabled')
  }
  
  // Add developer metadata
  document.documentElement.lang = 'en' // NetToolsKit is English-first
  
  // Set meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', nettoolskitPreset.brand.identity.description)
  
  // Add keywords for component library
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.setAttribute('name', 'keywords')
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.setAttribute('content', 'vue3, quasar, components, ui library, design system, typescript')
  
  // Add Open Graph meta for GitHub/social sharing
  const ogMetas = [
    { property: 'og:title', content: nettoolskitPreset.brand.identity.displayName },
    { property: 'og:description', content: nettoolskitPreset.brand.identity.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: nettoolskitPreset.brand.identity.url || '' },
  ]
  
  ogMetas.forEach(({ property, content }) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  })
}

/**
 * Get NetToolsKit Config by Category
 * 
 * Helper to retrieve specific configuration category.
 * 
 * @param category - Configuration category
 * @returns Configuration object
 * 
 * @example
 * ```typescript
 * import { getNettoolskitConfig } from '@/config/presets/nettoolskit.preset'
 * 
 * const typography = getNettoolskitConfig('typography')
 * const navigation = getNettoolskitConfig('navigation')
 * ```
 */
export function getNettoolskitConfig(
  category: 'palette' | 'semantic' | 'lightTheme' | 'darkTheme' | 
            'typography' | 'effects' | 'spacing' | 
            'structure' | 'responsive' | 
            'identity' | 'navigation' | 'content'
): any {
  switch (category) {
    // Colors
    case 'palette':
      return nettoolskitPreset.colors.palette
    case 'semantic':
      return nettoolskitPreset.colors.semantic
    case 'lightTheme':
      return nettoolskitPreset.colors.themes.light
    case 'darkTheme':
      return nettoolskitPreset.colors.themes.dark
    
    // Visual
    case 'typography':
      return nettoolskitPreset.visual.typography
    case 'effects':
      return nettoolskitPreset.visual.effects
    case 'spacing':
      return nettoolskitPreset.visual.spacing
    
    // Layout
    case 'structure':
      return nettoolskitPreset.layout.structure
    case 'responsive':
      return nettoolskitPreset.layout.responsive
    
    // Brand
    case 'identity':
      return nettoolskitPreset.brand.identity
    case 'navigation':
      return nettoolskitPreset.brand.navigation
    case 'content':
      return nettoolskitPreset.brand.content
    
    default:
      throw new Error(`Unknown config category: ${category}`)
  }
}

/**
 * Enable Developer Features
 * 
 * Dynamically enables developer-specific features.
 * Useful for component playground or documentation mode.
 * 
 * @param features - Features to enable
 * 
 * @example
 * ```typescript
 * import { enableDeveloperFeatures } from '@/config/presets/nettoolskit.preset'
 * 
 * // Enable component grid and prop inspector
 * enableDeveloperFeatures({
 *   componentGrid: true,
 *   propInspector: true,
 *   codePreview: true
 * })
 * ```
 */
export function enableDeveloperFeatures(features: {
  componentGrid?: boolean
  propInspector?: boolean
  codePreview?: boolean
  performanceMonitor?: boolean
}): void {
  const root = document.documentElement
  
  if (features.componentGrid !== undefined) {
    root.classList.toggle('component-grid-enabled', features.componentGrid)
  }
  
  if (features.propInspector !== undefined) {
    root.classList.toggle('prop-inspector-enabled', features.propInspector)
  }
  
  if (features.codePreview !== undefined) {
    root.classList.toggle('code-preview-enabled', features.codePreview)
  }
  
  if (features.performanceMonitor !== undefined) {
    root.classList.toggle('performance-monitor-enabled', features.performanceMonitor)
  }
}

/**
 * Get Component Documentation URL
 * 
 * Generates URL to component documentation on GitHub.
 * 
 * @param componentName - Component name (e.g., 'BaseButton')
 * @returns GitHub documentation URL
 * 
 * @example
 * ```typescript
 * import { getComponentDocUrl } from '@/config/presets/nettoolskit.preset'
 * 
 * const url = getComponentDocUrl('BaseButton')
 * // 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/tree/main/src/components/ui/BaseButton.vue'
 * ```
 */
export function getComponentDocUrl(componentName: string): string {
  const baseUrl = nettoolskitPreset.brand.content.social.find(
    (s: { platform?: string; url?: string }) => s.platform === 'GitHub'
  )?.url || ''
  return `${baseUrl}/tree/main/src/components/${componentName}.vue`
}

// Export default preset
export default nettoolskitPreset
