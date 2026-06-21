/**
 * Spacing Configuration
 * 
 * Spacing scale, padding, margin, and gap utilities.
 * Defines consistent spacing system across the application.
 * 
 * ## Purpose
 * Centralize spacing system to ensure:
 * - Visual rhythm and consistency
 * - Predictable component spacing
 * - Scalable design system
 * - Easy maintenance and updates
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY spacing values (padding, margin, gap). Does NOT include:
 * - Border radius → see visual/effects.config.ts
 * - Layout structure → see layout/structure.config.ts
 * - Typography line heights → see visual/typography.config.ts
 * 
 * ## Usage
 * ```typescript
 * import { defaultSpacing } from '@/config/visual/spacing.config'
 * 
 * const padding = defaultSpacing.scale[4] // '16px'
 * const gap = defaultSpacing.component.gap.md // '12px'
 * ```
 * 
 * @module visual/spacing.config
 */

// ============================
// Spacing Interfaces
// ============================

/**
 * Spacing Scale
 * 
 * Base spacing values for consistent rhythm.
 * Follows 4px/8px grid system (common in Material Design and Tailwind).
 * 
 * @example
 * ```typescript
 * const scale: SpacingScale = {
 *   0: '0',
 *   1: '4px',
 *   2: '8px',
 *   3: '12px',
 *   4: '16px',
 *   // ... up to 96px or more
 * }
 * ```
 */
export interface SpacingScale {
  /** No spacing */
  0: string
  /** Extra extra small - 4px */
  1: string
  /** Extra small - 8px */
  2: string
  /** Small - 12px */
  3: string
  /** Medium - 16px (base) */
  4: string
  /** Large - 20px */
  5: string
  /** Extra large - 24px */
  6: string
  /** 2XL - 32px */
  8: string
  /** 3XL - 40px */
  10: string
  /** 4XL - 48px */
  12: string
  /** 5XL - 64px */
  16: string
  /** 6XL - 80px */
  20: string
  /** 7XL - 96px */
  24: string
}

/**
 * Component Spacing
 * 
 * Semantic spacing for common UI patterns.
 * Makes spacing intentions clear in code.
 */
export interface ComponentSpacing {
  /**
   * Gap between items (flexbox/grid)
   */
  gap: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  
  /**
   * Padding inside components
   */
  padding: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  
  /**
   * Margin between components
   */
  margin: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  
  /**
   * Section spacing (between major page sections)
   */
  section: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

/**
 * Spacing Configuration
 * 
 * Complete spacing system.
 */
export interface SpacingConfig {
  /**
   * Base spacing scale (0-24)
   */
  scale: SpacingScale
  
  /**
   * Semantic component spacing
   */
  component: ComponentSpacing
  
  /**
   * Container padding (horizontal)
   * Applied to main content containers
   */
  containerPadding: {
    mobile: string
    tablet: string
    desktop: string
  }
}

// ============================
// Default Spacing Scale
// ============================

/**
 * 4px Grid Spacing Scale
 * 
 * Standard 4px-based spacing scale.
 * Compatible with Material Design and Tailwind CSS.
 * 
 * Progression: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
 */
export const fourPxScale: SpacingScale = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}

/**
 * 8px Grid Spacing Scale
 * 
 * Alternative 8px-based spacing scale.
 * Provides more generous spacing (better for accessibility).
 * 
 * Progression: 0, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192
 */
export const eightPxScale: SpacingScale = {
  0: '0',
  1: '8px',
  2: '16px',
  3: '24px',
  4: '32px',
  5: '40px',
  6: '48px',
  8: '64px',
  10: '80px',
  12: '96px',
  16: '128px',
  20: '160px',
  24: '192px',
}

// ============================
// Spacing Configurations
// ============================

/**
 * Default Spacing Configuration
 * 
 * Balanced spacing for general use.
 * Uses 4px grid with moderate component spacing.
 */
export const defaultSpacing: SpacingConfig = {
  scale: fourPxScale,
  
  component: {
    gap: {
      xs: fourPxScale[1],  // 4px
      sm: fourPxScale[2],  // 8px
      md: fourPxScale[3],  // 12px
      lg: fourPxScale[4],  // 16px
      xl: fourPxScale[6],  // 24px
    },
    padding: {
      xs: fourPxScale[2],  // 8px
      sm: fourPxScale[3],  // 12px
      md: fourPxScale[4],  // 16px
      lg: fourPxScale[6],  // 24px
      xl: fourPxScale[8],  // 32px
    },
    margin: {
      xs: fourPxScale[2],  // 8px
      sm: fourPxScale[4],  // 16px
      md: fourPxScale[6],  // 24px
      lg: fourPxScale[8],  // 32px
      xl: fourPxScale[12], // 48px
    },
    section: {
      sm: fourPxScale[8],  // 32px
      md: fourPxScale[12], // 48px
      lg: fourPxScale[16], // 64px
      xl: fourPxScale[24], // 96px
    },
  },
  
  containerPadding: {
    mobile: fourPxScale[4],  // 16px
    tablet: fourPxScale[6],  // 24px
    desktop: fourPxScale[8], // 32px
  },
}

/**
 * Accessible Spacing Configuration
 * 
 * Generous spacing for better accessibility.
 * Uses 8px grid with larger component spacing.
 * Optimized for users with motor impairments or low vision.
 */
export const accessibleSpacing: SpacingConfig = {
  scale: eightPxScale,
  
  component: {
    gap: {
      xs: eightPxScale[1],  // 8px
      sm: eightPxScale[2],  // 16px
      md: eightPxScale[3],  // 24px
      lg: eightPxScale[4],  // 32px
      xl: eightPxScale[6],  // 48px
    },
    padding: {
      xs: eightPxScale[2],  // 16px
      sm: eightPxScale[3],  // 24px
      md: eightPxScale[4],  // 32px
      lg: eightPxScale[5],  // 40px
      xl: eightPxScale[6],  // 48px
    },
    margin: {
      xs: eightPxScale[2],  // 16px
      sm: eightPxScale[3],  // 24px
      md: eightPxScale[4],  // 32px
      lg: eightPxScale[6],  // 48px
      xl: eightPxScale[8],  // 64px
    },
    section: {
      sm: eightPxScale[6],  // 48px
      md: eightPxScale[8],  // 64px
      lg: eightPxScale[10], // 80px
      xl: eightPxScale[12], // 96px
    },
  },
  
  containerPadding: {
    mobile: eightPxScale[3],  // 24px
    tablet: eightPxScale[4],  // 32px
    desktop: eightPxScale[5], // 40px
  },
}

/**
 * Compact Spacing Configuration
 * 
 * Tighter spacing for data-dense interfaces.
 * Uses 4px grid with minimal component spacing.
 * Optimized for dashboards and admin interfaces.
 */
export const compactSpacing: SpacingConfig = {
  scale: fourPxScale,
  
  component: {
    gap: {
      xs: fourPxScale[1],  // 4px
      sm: fourPxScale[1],  // 4px
      md: fourPxScale[2],  // 8px
      lg: fourPxScale[3],  // 12px
      xl: fourPxScale[4],  // 16px
    },
    padding: {
      xs: fourPxScale[1],  // 4px
      sm: fourPxScale[2],  // 8px
      md: fourPxScale[3],  // 12px
      lg: fourPxScale[4],  // 16px
      xl: fourPxScale[6],  // 24px
    },
    margin: {
      xs: fourPxScale[2],  // 8px
      sm: fourPxScale[3],  // 12px
      md: fourPxScale[4],  // 16px
      lg: fourPxScale[6],  // 24px
      xl: fourPxScale[8],  // 32px
    },
    section: {
      sm: fourPxScale[6],  // 24px
      md: fourPxScale[8],  // 32px
      lg: fourPxScale[12], // 48px
      xl: fourPxScale[16], // 64px
    },
  },
  
  containerPadding: {
    mobile: fourPxScale[3],  // 12px
    tablet: fourPxScale[4],  // 16px
    desktop: fourPxScale[5], // 20px
  },
}

// ============================
// Spacing Registry
// ============================

/**
 * All Spacing Configurations
 * 
 * Registry for dynamic spacing configs.
 */
export const spacingConfigs = {
  default: defaultSpacing,
  accessible: accessibleSpacing,
  compact: compactSpacing,
} as const

export type SpacingConfigName = keyof typeof spacingConfigs

/**
 * Get Spacing Config by Name
 * 
 * Helper function to retrieve spacing configuration.
 * 
 * @param name - Configuration identifier
 * @returns Spacing configuration
 * 
 * @example
 * ```typescript
 * import { getSpacingConfig } from '@/config/visual/spacing.config'
 * 
 * const spacing = getSpacingConfig('accessible')
 * const gap = spacing.component.gap.md // '24px'
 * ```
 */
export function getSpacingConfig(name: SpacingConfigName): SpacingConfig {
  return spacingConfigs[name]
}

/**
 * Apply Spacing to CSS Variables
 * 
 * Creates CSS custom properties for spacing system.
 * Allows using spacing via `var(--ntk-spacing-4)` in CSS.
 * 
 * @param config - Spacing configuration
 * 
 * @example
 * ```typescript
 * import { applySpacing, defaultSpacing } from '@/config/visual/spacing.config'
 * 
 * // In app initialization
 * applySpacing(defaultSpacing)
 * 
 * // In CSS
 * .component {
 *   padding: var(--ntk-spacing-4); // 16px
 *   gap: var(--ntk-gap-md); // 12px
 * }
 * ```
 */
export function applySpacing(config: SpacingConfig): void {
  const root = document.documentElement
  
  // Apply scale
  Object.entries(config.scale).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-spacing-${key}`, value)
  })
  
  // Apply component spacing
  Object.entries(config.component.gap).forEach(([size, value]) => {
    root.style.setProperty(`--ntk-gap-${size}`, value)
  })
  
  Object.entries(config.component.padding).forEach(([size, value]) => {
    root.style.setProperty(`--ntk-padding-${size}`, value)
  })
  
  Object.entries(config.component.margin).forEach(([size, value]) => {
    root.style.setProperty(`--ntk-margin-${size}`, value)
  })
  
  Object.entries(config.component.section).forEach(([size, value]) => {
    root.style.setProperty(`--ntk-section-${size}`, value)
  })
  
  // Apply container padding
  Object.entries(config.containerPadding).forEach(([device, value]) => {
    root.style.setProperty(`--ntk-container-padding-${device}`, value)
  })
}

/**
 * Get Spacing Value
 * 
 * Returns spacing value from scale by numeric key.
 * 
 * @param scale - Spacing scale
 * @param level - Scale level (0-24)
 * @returns Spacing value
 * 
 * @example
 * ```typescript
 * import { getSpacingValue, fourPxScale } from '@/config/visual/spacing.config'
 * 
 * const spacing = getSpacingValue(fourPxScale, 4) // '16px'
 * ```
 */
export function getSpacingValue(scale: SpacingScale, level: keyof SpacingScale): string {
  return scale[level]
}