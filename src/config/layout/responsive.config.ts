/**
 * Responsive Configuration
 * 
 * Breakpoints, mobile behavior, and responsive design patterns.
 * Defines how layouts adapt to different screen sizes.
 * 
 * ## Purpose
 * Centralize responsive design settings to ensure:
 * - Consistent breakpoints across components
 * - Mobile-first approach
 * - Device-specific optimizations
 * - Accessibility on all screen sizes
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY responsive behavior and breakpoints. Does NOT include:
 * - Layout structure (header, sidebar) → see structure.config.ts
 * - Visual styling → see colors/ and visual/ configs
 * - Content → see brand/content.config.ts
 * 
 * ## Usage
 * ```typescript
 * import { defaultResponsive } from '@/config/layout/responsive.config'
 * 
 * const isMobile = window.innerWidth <= defaultResponsive.breakpoints.mobile
 * const drawerWidth = defaultResponsive.mobile.drawerWidth
 * ```
 * 
 * @module layout/responsive.config
 */

// ============================
// Responsive Interfaces
// ============================

/**
 * Breakpoint Configuration
 * 
 * Screen width thresholds for responsive design.
 * Based on common device sizes and best practices.
 * 
 * @example
 * ```typescript
 * const breakpoints: Breakpoints = {
 *   xs: 0,      // Extra small (mobile portrait)
 *   sm: 600,    // Small (mobile landscape)
 *   md: 960,    // Medium (tablet)
 *   lg: 1280,   // Large (desktop)
 *   xl: 1920    // Extra large (large desktop)
 * }
 * ```
 */
export interface Breakpoints {
  /**
   * Extra small devices (mobile portrait)
   * @default 0
   */
  xs: number
  
  /**
   * Small devices (mobile landscape)
   * @default 600
   */
  sm: number
  
  /**
   * Medium devices (tablets)
   * @default 960
   */
  md: number
  
  /**
   * Large devices (desktop)
   * @default 1280
   */
  lg: number
  
  /**
   * Extra large devices (large desktop, 4K)
   * @default 1920
   */
  xl: number
}

/**
 * Mobile Configuration
 * 
 * Mobile-specific behavior and drawer settings.
 * 
 * @example
 * ```typescript
 * const mobile: MobileConfig = {
 *   breakpoint: 768,
 *   drawerSide: 'left',
 *   drawerWidth: 280,
 *   swipeAreaWidth: 20,
 *   overlay: true
 * }
 * ```
 */
export interface MobileConfig {
  /**
   * Breakpoint width (px) to consider as mobile
   * Components should switch to mobile layout below this width
   * @default 768
   */
  breakpoint: number
  
  /**
   * Side from which drawer/sidebar opens
   * @default 'left'
   */
  drawerSide: 'left' | 'right'
  
  /**
   * Width of drawer when open (px)
   * @default 280
   */
  drawerWidth: number
  
  /**
   * Width of swipe area to open drawer (px)
   * Edge area that triggers drawer open on swipe
   * @default 20
   */
  swipeAreaWidth?: number
  
  /**
   * Whether to show overlay behind drawer
   * @default true
   */
  overlay?: boolean
  
  /**
   * Whether drawer is persistent or can be closed
   * @default false
   */
  persistent?: boolean
}

/**
 * Tablet Configuration
 * 
 * Tablet-specific optimizations (hybrid mobile/desktop).
 */
export interface TabletConfig {
  /**
   * Minimum width to consider as tablet (px)
   * @default 600
   */
  minWidth: number
  
  /**
   * Maximum width to consider as tablet (px)
   * Above this is desktop
   * @default 1024
   */
  maxWidth: number
  
  /**
   * Whether to use mobile or desktop layout
   * 'auto' adapts based on orientation
   * @default 'auto'
   */
  layoutMode?: 'mobile' | 'desktop' | 'auto'
}

/**
 * Responsive Configuration
 * 
 * Complete responsive design system.
 */
export interface ResponsiveConfig {
  /**
   * Breakpoint definitions
   */
  breakpoints: Breakpoints
  
  /**
   * Mobile-specific settings
   */
  mobile: MobileConfig
  
  /**
   * Tablet-specific settings
   */
  tablet?: TabletConfig
  
  /**
   * Container max-width per breakpoint
   * Prevents content from being too wide on large screens
   */
  containerMaxWidth?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

// ============================
// Default Responsive Configs
// ============================

/**
 * Material Design Breakpoints
 * 
 * Standard Material Design 3 breakpoints.
 * Widely adopted and well-tested.
 * 
 * @see https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */
export const materialBreakpoints: Breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
}

/**
 * Bootstrap Breakpoints
 * 
 * Bootstrap 5 breakpoints for familiarity.
 * 
 * @see https://getbootstrap.com/docs/5.0/layout/breakpoints/
 */
export const bootstrapBreakpoints: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

/**
 * Tailwind Breakpoints
 * 
 * Tailwind CSS default breakpoints.
 * 
 * @see https://tailwindcss.com/docs/responsive-design
 */
export const tailwindBreakpoints: Breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

/**
 * Default Responsive Configuration
 * 
 * Mobile-first responsive design with Material Design breakpoints.
 * Suitable for most applications.
 */
export const defaultResponsive: ResponsiveConfig = {
  breakpoints: materialBreakpoints,
  mobile: {
    breakpoint: 768,
    drawerSide: 'left',
    drawerWidth: 280,
    swipeAreaWidth: 20,
    overlay: true,
    persistent: false,
  },
  tablet: {
    minWidth: 600,
    maxWidth: 1024,
    layoutMode: 'auto',
  },
  containerMaxWidth: {
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
}

/**
 * Accessible Responsive Configuration
 * 
 * Larger breakpoints and drawer for better accessibility.
 * Optimized for PlaTEA and users with accessibility needs.
 */
export const accessibleResponsive: ResponsiveConfig = {
  breakpoints: {
    xs: 0,
    sm: 640,    // Slightly larger mobile breakpoint
    md: 1024,   // Larger tablet breakpoint
    lg: 1440,   // Larger desktop breakpoint
    xl: 1920,
  },
  mobile: {
    breakpoint: 1024,  // Treat more devices as mobile (better touch support)
    drawerSide: 'left',
    drawerWidth: 320,  // Wider drawer for easier touch targets
    swipeAreaWidth: 30, // Wider swipe area
    overlay: true,
    persistent: false,
  },
  tablet: {
    minWidth: 640,
    maxWidth: 1200,
    layoutMode: 'mobile', // Prefer mobile layout (larger touch targets)
  },
  containerMaxWidth: {
    sm: 640,
    md: 1024,
    lg: 1440,
    xl: 1920,
  },
}

/**
 * Compact Responsive Configuration
 * 
 * Tighter breakpoints for dashboard/admin interfaces.
 * Optimized for desktop-first workflows.
 */
export const compactResponsive: ResponsiveConfig = {
  breakpoints: bootstrapBreakpoints, // Slightly tighter breakpoints
  mobile: {
    breakpoint: 576,  // Smaller mobile breakpoint
    drawerSide: 'left',
    drawerWidth: 240, // Narrower drawer
    swipeAreaWidth: 15,
    overlay: true,
    persistent: false,
  },
  tablet: {
    minWidth: 576,
    maxWidth: 992,
    layoutMode: 'desktop', // Prefer desktop layout (more content density)
  },
  containerMaxWidth: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140,
  },
}

// ============================
// Responsive Registry
// ============================

/**
 * All Responsive Configurations
 * 
 * Registry for dynamic responsive configs.
 */
export const responsiveConfigs = {
  default: defaultResponsive,
  accessible: accessibleResponsive,
  compact: compactResponsive,
} as const

export type ResponsiveConfigName = keyof typeof responsiveConfigs

/**
 * Get Responsive Config by Name
 * 
 * Helper function to retrieve responsive configuration.
 * 
 * @param name - Configuration identifier
 * @returns Responsive configuration
 * 
 * @example
 * ```typescript
 * import { getResponsiveConfig } from '@/config/layout/responsive.config'
 * 
 * const config = getResponsiveConfig('accessible')
 * const mobileBreakpoint = config.mobile.breakpoint
 * ```
 */
export function getResponsiveConfig(name: ResponsiveConfigName): ResponsiveConfig {
  return responsiveConfigs[name]
}

// ============================
// Responsive Utilities
// ============================

/**
 * Get Current Breakpoint
 * 
 * Determines which breakpoint matches current window width.
 * 
 * @param width - Window width in pixels
 * @param breakpoints - Breakpoint configuration
 * @returns Current breakpoint key
 * 
 * @example
 * ```typescript
 * import { getCurrentBreakpoint, materialBreakpoints } from '@/config/layout/responsive.config'
 * 
 * const bp = getCurrentBreakpoint(window.innerWidth, materialBreakpoints)
 * if (bp === 'xs' || bp === 'sm') {
 *   // Mobile layout
 * }
 * ```
 */
export function getCurrentBreakpoint(
  width: number,
  breakpoints: Breakpoints = materialBreakpoints
): keyof Breakpoints {
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return 'xs'
}

/**
 * Is Mobile Device
 * 
 * Checks if current width is considered mobile.
 * 
 * @param width - Window width in pixels
 * @param config - Responsive configuration
 * @returns True if mobile
 * 
 * @example
 * ```typescript
 * import { isMobileDevice, defaultResponsive } from '@/config/layout/responsive.config'
 * 
 * if (isMobileDevice(window.innerWidth, defaultResponsive)) {
 *   // Show mobile menu
 * }
 * ```
 */
export function isMobileDevice(
  width: number,
  config: ResponsiveConfig = defaultResponsive
): boolean {
  return width < config.mobile.breakpoint
}

/**
 * Is Tablet Device
 * 
 * Checks if current width is considered tablet.
 * 
 * @param width - Window width in pixels
 * @param config - Responsive configuration
 * @returns True if tablet
 */
export function isTabletDevice(
  width: number,
  config: ResponsiveConfig = defaultResponsive
): boolean {
  if (!config.tablet) return false
  return width >= config.tablet.minWidth && width <= config.tablet.maxWidth
}

/**
 * Is Desktop Device
 * 
 * Checks if current width is considered desktop.
 * 
 * @param width - Window width in pixels
 * @param config - Responsive configuration
 * @returns True if desktop
 */
export function isDesktopDevice(
  width: number,
  config: ResponsiveConfig = defaultResponsive
): boolean {
  if (!config.tablet) return width >= config.mobile.breakpoint
  return width > config.tablet.maxWidth
}

/**
 * Get Container Max Width
 * 
 * Returns appropriate container max-width for current breakpoint.
 * 
 * @param width - Window width in pixels
 * @param config - Responsive configuration
 * @returns Container max-width in pixels or undefined (full-width)
 * 
 * @example
 * ```typescript
 * import { getContainerMaxWidth, defaultResponsive } from '@/config/layout/responsive.config'
 * 
 * const maxWidth = getContainerMaxWidth(window.innerWidth, defaultResponsive)
 * containerElement.style.maxWidth = maxWidth ? `${maxWidth}px` : 'none'
 * ```
 */
export function getContainerMaxWidth(
  width: number,
  config: ResponsiveConfig = defaultResponsive
): number | undefined {
  if (!config.containerMaxWidth) return undefined
  
  const breakpoint = getCurrentBreakpoint(width, config.breakpoints)
  return config.containerMaxWidth[breakpoint]
}