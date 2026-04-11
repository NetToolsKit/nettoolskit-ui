import type { TemplateVisualFamilyConfig } from '../../families/template-visual-families.types'
import { createPackVariant } from '../pack-helpers'

export const operationsWorkspacePackConfig: TemplateVisualFamilyConfig = {
  id: 'operations-workspace',
  label: 'Operations Workspace',
  kicker: 'search, filters and lane actions',
  description:
    'A curated workspace sample focused on active operations, rendered once in a lighter product-led pack and once in a darker command-center pack.',
  kind: 'variation',
  sortOrder: 1,
  layout: 'spotlight',
  exampleId: 'dashboard-workspace',
  metrics: [
    { id: 'workspace-m1', label: 'Surface', value: 'Workspace board and filters' },
    { id: 'workspace-m2', label: 'Theme variants', value: 'Light and dark' },
    { id: 'workspace-m3', label: 'Interaction', value: 'Search, filters, lanes, actions' },
  ],
  notes: [
    { id: 'workspace-n1', label: 'Light mode', value: 'Modular product board with stronger segmentation' },
    { id: 'workspace-n2', label: 'Dark mode', value: 'Dense command-shell with luminous operational cues' },
    { id: 'workspace-n3', label: 'Reuse', value: 'Same workspace component under different tokens' },
  ],
  variants: [
    createPackVariant(
      'operations-workspace-light',
      'Light Theme',
      'light',
      'reference-light',
      'Bright product-oriented workspace for reviews, snapshots, and guided walkthroughs.',
      {
        label: 'Operations Workspace Light',
        description: 'Bright modular shell for collaborative product and operations dashboards.',
        brand: {
          name: 'Operations Workspace',
          subtitle: 'Light operations variant',
          kicker: 'workspace light pack',
          description: 'Modular light workspace aimed at guided triage and collaborative review.',
          logoText: 'OW',
        },
        palette: {
          primary: '#2563eb',
          primaryDark: '#1d4ed8',
          primaryLight: '#93c5fd',
          secondary: '#0f172a',
          accent: '#ec4899',
          background: '#eef4ff',
          backgroundMuted: '#dde9ff',
          surface: '#ffffff',
          surfaceAlt: '#f5f8ff',
          text: '#0f172a',
          textMuted: '#475569',
          border: '#cbd7f5',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
          info: '#2563eb',
        },
        typography: {
          display: '"Space Grotesk", "Avenir Next", sans-serif',
          body: '"Inter", "Segoe UI", sans-serif',
        },
        radius: {
          sm: '14px',
          md: '22px',
          lg: '28px',
          xl: '38px',
          pill: '999px',
        },
        gradients: {
          hero: 'radial-gradient(circle at 12% 14%, rgba(37, 99, 235, 0.18), transparent 32%), radial-gradient(circle at 86% 12%, rgba(236, 72, 153, 0.18), transparent 26%), linear-gradient(180deg, #eef4ff 0%, #dde9ff 100%)',
          panel: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 255, 1) 100%)',
          accent: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 48%, #ec4899 100%)',
        },
      }
    ),
    createPackVariant(
      'operations-workspace-dark',
      'Dark Theme',
      'dark',
      'reference-night',
      'High-signal workspace for dense monitoring and active command flows.',
      {
        label: 'Operations Workspace Dark',
        description: 'Dark-first command shell with dense cards and operational emphasis.',
        brand: {
          name: 'Operations Workspace',
          subtitle: 'Dark operations variant',
          kicker: 'workspace dark pack',
          description: 'Command-center workspace for filters, queues, and lane-driven operations.',
          logoText: 'OW',
        },
        palette: {
          primary: '#22c55e',
          primaryDark: '#0b3b2e',
          primaryLight: '#86efac',
          secondary: '#04070a',
          accent: '#2dd4bf',
          background: '#02050a',
          backgroundMuted: '#07111d',
          surface: '#08111b',
          surfaceAlt: '#0f1b2b',
          text: '#e5fff1',
          textMuted: '#8aa9a0',
          border: '#163124',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#f87171',
          info: '#22d3ee',
        },
        gradients: {
          hero: 'radial-gradient(circle at 12% 16%, rgba(34, 197, 94, 0.24), transparent 34%), radial-gradient(circle at 84% 10%, rgba(45, 212, 191, 0.2), transparent 28%), linear-gradient(180deg, #02050a 0%, #07111d 100%)',
          panel: 'linear-gradient(180deg, rgba(8, 17, 27, 0.98) 0%, rgba(15, 27, 43, 0.98) 100%)',
          accent: 'linear-gradient(135deg, #22c55e 0%, #2dd4bf 100%)',
        },
      }
    ),
  ],
}
