/**
 * Layout Configuration
 * Standard layout settings for all projects.
 * Defines heights, shadows, breakpoints, and spacing.
 */

export interface HeaderConfig {
  /** Header height in pixels */
  height: number;
  /** Header shadow */
  shadow: string;
  /** Background color */
  background: string;
  /** Whether the header sticks to the top */
  sticky: boolean;
  /** Horizontal padding */
  paddingX: string;
}

export interface SidebarConfig {
  /** Expanded width in pixels */
  width: number;
  /** Minimized width in pixels */
  miniWidth: number;
  /** Collapse breakpoint */
  breakpoint: number;
}

export interface FooterConfig {
  /** Color variant */
  variant: 'dark' | 'light';
}

export interface ContainerConfig {
  /** Maximum width in pixels */
  maxWidth: number;
  /** Horizontal padding */
  paddingX: string;
}

export interface MobileConfig {
  /** Mobile breakpoint */
  breakpoint: number;
  /** Drawer side */
  drawerSide: 'left' | 'right';
  /** Drawer width */
  drawerWidth: number;
}

export interface LayoutConfig {
  header: HeaderConfig;
  sidebar: SidebarConfig;
  footer: FooterConfig;
  container: ContainerConfig;
  mobile: MobileConfig;
}

/**
 * Default layout configuration.
 * Used as the base for all projects.
 */
export const defaultLayoutConfig: LayoutConfig = {
  header: {
    height: 64,
    shadow: 'var(--ntk-layout-header-shadow, var(--ntk-template-layout-header-shadow, var(--ntk-shadow-sm)))',
    background: 'var(--ntk-layout-header-bg, var(--ntk-header-bg, var(--ntk-card-bg)))',
    sticky: false,
    paddingX: '20px',
  },
  sidebar: {
    width: 200,
    miniWidth: 64,
    breakpoint: 768,
  },
  footer: {
    variant: 'dark',
  },
  container: {
    maxWidth: 1200,
    paddingX: '20px',
  },
  mobile: {
    breakpoint: 768,
    drawerSide: 'right',
    drawerWidth: 280,
  },
};

/**
 * Layout configuration with a fixed header.
 * Used for landing pages that need a sticky header.
 */
export const stickyHeaderLayout: LayoutConfig = {
  ...defaultLayoutConfig,
  header: {
    ...defaultLayoutConfig.header,
    sticky: true,
    shadow: 'var(--ntk-layout-header-sticky-shadow, var(--ntk-shadow-md))',
  },
};

/**
 * Dashboard layout configuration.
 * Uses a more compact sidebar and header.
 */
export const dashboardLayout: LayoutConfig = {
  ...defaultLayoutConfig,
  header: {
    ...defaultLayoutConfig.header,
    height: 56,
  },
  sidebar: {
    width: 240,
    miniWidth: 72,
    breakpoint: 1024,
  },
};

/**
 * Available layout presets.
 */
export const layoutPresets = {
  default: defaultLayoutConfig,
  stickyHeader: stickyHeaderLayout,
  dashboard: dashboardLayout,
} as const;

export type LayoutPreset = keyof typeof layoutPresets;
