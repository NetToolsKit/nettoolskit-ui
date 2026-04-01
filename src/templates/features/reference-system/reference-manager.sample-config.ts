import type { ReferenceManagerSampleConfig } from './reference-system.types'

export const referenceSampleManagerConfig: ReferenceManagerSampleConfig = {
  stats: [
    { id: 'reports', label: 'Approved reports', value: 48, icon: 'description', tone: 'info' },
    { id: 'tenants', label: 'Whitelabel presets', value: 3, icon: 'palette', tone: 'success' },
    { id: 'drafts', label: 'Drafts pending review', value: 7, icon: 'edit_note', tone: 'warning' },
  ],
  quickActions: [
    {
      id: 'create-report',
      label: 'Create report',
      description: 'Start from the approved layout baseline.',
      icon: 'note_add',
      tone: 'primary',
    },
    {
      id: 'duplicate-report',
      label: 'Duplicate selected',
      description: 'Create a branch-safe copy of the active report.',
      icon: 'content_copy',
      tone: 'info',
    },
    {
      id: 'publish-report',
      label: 'Send to review',
      description: 'Promote the selected draft to the review queue.',
      icon: 'publish',
      tone: 'success',
    },
  ],
}