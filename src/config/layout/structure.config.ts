/**
 * Layout Configuration
 * Configurações padronizadas de layout para todos os projetos
 * Define alturas, sombras, breakpoints e espaçamentos
 */

export interface HeaderConfig {
  /** Altura do header em pixels */
  height: number;
  /** Sombra do header */
  shadow: string;
  /** Cor de fundo */
  background: string;
  /** Header fixo no topo */
  sticky: boolean;
  /** Padding horizontal */
  paddingX: string;
}

export interface SidebarConfig {
  /** Largura expandida em pixels */
  width: number;
  /** Largura minimizada em pixels */
  miniWidth: number;
  /** Breakpoint para colapsar */
  breakpoint: number;
}

export interface FooterConfig {
  /** Variante de cor */
  variant: 'dark' | 'light';
}

export interface ContainerConfig {
  /** Largura máxima em pixels */
  maxWidth: number;
  /** Padding horizontal */
  paddingX: string;
}

export interface MobileConfig {
  /** Breakpoint para mobile */
  breakpoint: number;
  /** Lado do drawer */
  drawerSide: 'left' | 'right';
  /** Largura do drawer */
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
 * Configuração padrão de layout
 * Usado como base para todos os projetos
 */
export const defaultLayoutConfig: LayoutConfig = {
  header: {
    height: 64,
    shadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    background: '#ffffff',
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
 * Configuração de layout com header fixo
 * Para landing pages que precisam de header sticky
 */
export const stickyHeaderLayout: LayoutConfig = {
  ...defaultLayoutConfig,
  header: {
    ...defaultLayoutConfig.header,
    sticky: true,
    shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
};

/**
 * Configuração de layout para dashboards
 * Com sidebar e header mais compacto
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
 * Presets de layout disponíveis
 */
export const layoutPresets = {
  default: defaultLayoutConfig,
  stickyHeader: stickyHeaderLayout,
  dashboard: dashboardLayout,
} as const;

export type LayoutPreset = keyof typeof layoutPresets;
