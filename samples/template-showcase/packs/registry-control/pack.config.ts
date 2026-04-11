import type { TemplateVisualFamilyConfig } from '../../families/template-visual-families.types'
import { createPackVariant } from '../pack-helpers'

export const registryControlPackConfig: TemplateVisualFamilyConfig = {
  id: 'registry-control',
  label: 'Registry Control',
  kicker: 'records, account flows and empty states',
  description:
    'A curated operational registry sample that keeps CRUD, profile, and placeholder actions live while switching between a clean light admin pack and a premium dark control pack.',
  layout: 'contrast',
  exampleId: 'crud-profile-placeholder',
  metrics: [
    { id: 'registry-m1', label: 'Surface', value: 'CRUD, profile, and placeholder' },
    { id: 'registry-m2', label: 'Theme variants', value: 'Light and dark' },
    { id: 'registry-m3', label: 'Interaction', value: 'Bulk actions, profile logout, CTA states' },
  ],
  notes: [
    { id: 'registry-n1', label: 'Light mode', value: 'Clear admin posture with stronger scanability' },
    { id: 'registry-n2', label: 'Dark mode', value: 'Premium monochrome control room' },
    { id: 'registry-n3', label: 'Reuse', value: 'Three reusable surfaces kept functional together' },
  ],
  variants: [
    createPackVariant(
      'registry-control-light',
      'Light Theme',
      'light',
      'reference-light',
      'Clean admin review mode for operators scanning records and account states.',
      {
        label: 'Registry Control Light',
        description: 'Clear light admin shell for operational registries and account review.',
        brand: {
          name: 'Registry Control',
          subtitle: 'Light registry variant',
          kicker: 'operations registry',
          description: 'Light admin preset for records, account review, and empty-state guidance.',
          logoText: 'RC',
        },
        palette: {
          primary: '#0f766e',
          primaryDark: '#115e59',
          primaryLight: '#99f6e4',
          secondary: '#1f2937',
          accent: '#f97316',
          background: '#f7f8fb',
          backgroundMuted: '#eef2f7',
          surface: '#ffffff',
          surfaceAlt: '#f8fafc',
          text: '#1f2937',
          textMuted: '#667085',
          border: '#d7dee8',
          success: '#16a34a',
          warning: '#ea580c',
          error: '#dc2626',
          info: '#0f766e',
        },
        typography: {
          display: '"Space Grotesk", "Segoe UI", sans-serif',
          body: '"Inter", "Segoe UI", sans-serif',
        },
        radius: {
          sm: '12px',
          md: '18px',
          lg: '24px',
          xl: '32px',
          pill: '999px',
        },
        gradients: {
          hero: 'radial-gradient(circle at 16% 18%, rgba(15, 118, 110, 0.14), transparent 32%), radial-gradient(circle at 82% 10%, rgba(249, 115, 22, 0.12), transparent 24%), linear-gradient(180deg, #f7f8fb 0%, #eef2f7 100%)',
          panel: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 1) 100%)',
          accent: 'linear-gradient(135deg, #0f766e 0%, #f97316 100%)',
        },
      }
    ),
    createPackVariant(
      'registry-control-dark',
      'Dark Theme',
      'dark',
      'reference-graphite',
      'Premium dark registry mode with monochrome control surfaces and restrained emphasis.',
      {
        label: 'Registry Control Dark',
        description: 'Monochrome premium shell for admin review, registry triage, and governance screens.',
        brand: {
          name: 'Registry Control',
          subtitle: 'Dark registry variant',
          kicker: 'operations registry',
          description: 'Dark premium preset for registry review, account control, and governance states.',
          logoText: 'RC',
        },
        palette: {
          primary: '#ffffff',
          primaryDark: '#000000',
          primaryLight: '#f3f4f6',
          secondary: '#050505',
          accent: '#ffffff',
          background: '#050505',
          backgroundMuted: '#111111',
          surface: '#0d0d0d',
          surfaceAlt: '#161616',
          text: '#f8fafc',
          textMuted: '#b3b3b3',
          border: '#2a2a2a',
          success: '#86efac',
          warning: '#facc15',
          error: '#fca5a5',
          info: '#e5e7eb',
        },
        typography: {
          display: '"Space Grotesk", "Helvetica Neue", sans-serif',
          body: '"Inter", "Segoe UI", sans-serif',
        },
        radius: {
          sm: '999px',
          md: '999px',
          lg: '28px',
          xl: '40px',
          pill: '999px',
        },
        gradients: {
          hero: 'radial-gradient(circle at 16% 18%, rgba(255, 255, 255, 0.08), transparent 34%), linear-gradient(180deg, #050505 0%, #111111 100%)',
          panel: 'linear-gradient(180deg, rgba(13, 13, 13, 0.98) 0%, rgba(22, 22, 22, 1) 100%)',
          accent: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)',
        },
      }
    ),
  ],
}
