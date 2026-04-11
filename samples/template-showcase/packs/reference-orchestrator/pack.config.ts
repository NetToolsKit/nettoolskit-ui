import type { TemplateVisualFamilyConfig } from '../../families/template-visual-families.types'
import { createPackVariant } from '../pack-helpers'

export const referenceOrchestratorPackConfig: TemplateVisualFamilyConfig = {
  id: 'reference-orchestrator',
  label: 'Reference Orchestrator',
  kicker: 'manager and designer in one flow',
  description:
    'The approved report manager and designer flow presented as one reusable system, with a light review pack and a dark execution pack.',
  kind: 'variation',
  sortOrder: 2,
  layout: 'mosaic',
  exampleId: 'reference-system',
  metrics: [
    { id: 'orchestrator-m1', label: 'Surface', value: 'Manager + designer composition' },
    { id: 'orchestrator-m2', label: 'Theme variants', value: 'Light and dark' },
    { id: 'orchestrator-m3', label: 'Interaction', value: 'Reports, tabs, canvas, rail actions' },
  ],
  notes: [
    { id: 'orchestrator-n1', label: 'Light mode', value: 'Review-oriented orchestration for approvals and QA' },
    { id: 'orchestrator-n2', label: 'Dark mode', value: 'Graphite orchestration for live authoring and delivery' },
    { id: 'orchestrator-n3', label: 'Architecture', value: 'Consumes shared reference-system runtime from src' },
  ],
  variants: [
    createPackVariant(
      'reference-orchestrator-light',
      'Light Theme',
      'light',
      'reference-light',
      'Light orchestration shell for side-by-side walkthroughs and approved-flow reviews.',
      {
        label: 'Reference Orchestrator Light',
        description: 'Review-oriented light shell for the approved report manager and designer system.',
        brand: {
          name: 'Reference Orchestrator',
          subtitle: 'Light review variant',
          kicker: 'reference orchestration',
          description: 'Light orchestration preset for guided approvals and side-by-side report review.',
          logoText: 'RO',
        },
        palette: {
          primary: '#0f766e',
          primaryDark: '#115e59',
          primaryLight: '#67e8f9',
          secondary: '#134e4a',
          accent: '#0ea5e9',
          background: '#eef7f7',
          backgroundMuted: '#deeff1',
          surface: '#ffffff',
          surfaceAlt: '#f4fbfb',
          text: '#12303b',
          textMuted: '#5c7382',
          border: '#c7dde0',
          success: '#16a34a',
          warning: '#d97706',
          error: '#dc2626',
          info: '#0284c7',
        },
        typography: {
          display: '"IBM Plex Sans", "Space Grotesk", sans-serif',
          body: '"IBM Plex Sans", "Inter", sans-serif',
        },
        radius: {
          sm: '12px',
          md: '18px',
          lg: '24px',
          xl: '34px',
          pill: '999px',
        },
        gradients: {
          hero: 'radial-gradient(circle at 14% 16%, rgba(14, 165, 233, 0.14), transparent 30%), radial-gradient(circle at 84% 8%, rgba(15, 118, 110, 0.14), transparent 26%), linear-gradient(180deg, #eef7f7 0%, #deeff1 100%)',
          panel: 'linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(244, 251, 251, 1) 100%)',
          accent: 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)',
        },
      }
    ),
    createPackVariant(
      'reference-orchestrator-dark',
      'Dark Theme',
      'dark',
      'reference-graphite',
      'Graphite orchestration shell for active report design, validation, and handoff.',
      {
        label: 'Reference Orchestrator Dark',
        description: 'Dark orchestration shell for active report management and designer workflows.',
        brand: {
          name: 'Reference Orchestrator',
          subtitle: 'Dark execution variant',
          kicker: 'reference orchestration',
          description: 'Graphite orchestration preset for report execution, inspection, and delivery.',
          logoText: 'RO',
        },
        palette: {
          primary: '#38bdf8',
          primaryDark: '#0f3f57',
          primaryLight: '#bae6fd',
          secondary: '#06121a',
          accent: '#34d399',
          background: '#09111b',
          backgroundMuted: '#13202e',
          surface: '#101923',
          surfaceAlt: '#162433',
          text: '#e2edf7',
          textMuted: '#93a8bc',
          border: '#24374d',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#fb7185',
          info: '#38bdf8',
        },
        gradients: {
          hero: 'radial-gradient(circle at 10% 14%, rgba(56, 189, 248, 0.18), transparent 30%), radial-gradient(circle at 82% 12%, rgba(52, 211, 153, 0.14), transparent 26%), linear-gradient(180deg, #09111b 0%, #13202e 100%)',
          panel: 'linear-gradient(180deg, rgba(16, 25, 35, 0.98) 0%, rgba(22, 36, 51, 1) 100%)',
          accent: 'linear-gradient(135deg, #38bdf8 0%, #34d399 100%)',
        },
      }
    ),
  ],
}
