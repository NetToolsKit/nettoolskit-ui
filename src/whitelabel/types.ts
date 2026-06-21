export interface ReferenceWhitelabelPalette {
  primary: string
  primaryDark: string
  primaryLight: string
  secondary: string
  accent: string
  background: string
  backgroundMuted: string
  surface: string
  surfaceAlt: string
  text: string
  textMuted: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ReferenceWhitelabelTypography {
  display: string
  body: string
}

export interface ReferenceWhitelabelBrand {
  name: string
  subtitle: string
  kicker: string
  description: string
  logoText: string
  logoUrl?: string
}

export interface ReferenceWhitelabelPreset {
  id: string
  label: string
  description: string
  brand: ReferenceWhitelabelBrand
  palette: ReferenceWhitelabelPalette
  typography: ReferenceWhitelabelTypography
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
    pill: string
  }
  shadow: {
    soft: string
    medium: string
    strong: string
  }
  gradients: {
    hero: string
    panel: string
    accent: string
  }
}

export interface ReferenceSampleSurface {
  id: string
  title: string
  subtitle: string
  tag: string
  description: string
  template: 'dashboard' | 'workspace' | 'cruds' | 'editor' | 'profile' | 'login' | 'command-center' | 'wiki'
}