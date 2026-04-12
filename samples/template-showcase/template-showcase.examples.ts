import type { Component } from 'vue'

import TemplateShowcaseCrudProfilePlaceholderExample from './examples/crud-profile-placeholder/TemplateShowcaseCrudProfilePlaceholderExample.vue'
import TemplateShowcaseDashboardWorkspaceExample from './examples/dashboard-workspace/TemplateShowcaseDashboardWorkspaceExample.vue'
import TemplateShowcaseEditorWorkbenchExample from './examples/editor-workbench/TemplateShowcaseEditorWorkbenchExample.vue'
import TemplateShowcaseEnterpriseExample from './examples/enterprise/TemplateShowcaseEnterpriseExample.vue'
import TemplateShowcaseLayoutDashboardExample from './examples/layout-dashboard/TemplateShowcaseLayoutDashboardExample.vue'
import TemplateShowcaseReferenceSystemExample from './examples/reference-system/TemplateShowcaseReferenceSystemExample.vue'

export type TemplateShowcaseExampleId =
  | 'crud-profile-placeholder'
  | 'dashboard-workspace'
  | 'editor-workbench'
  | 'enterprise'
  | 'layout-dashboard'
  | 'reference-system'

export interface TemplateShowcaseExampleDefinition {
  id: TemplateShowcaseExampleId
  label: string
  summary: string
  surfaceTag: string
  templateAreas: string[]
  component: Component
}

export const templateShowcaseExampleRegistry: TemplateShowcaseExampleDefinition[] = [
  {
    id: 'layout-dashboard',
    label: 'Approved layout and dashboard shell',
    summary: 'Faithful baseline for the approved reference shell, menu chrome, KPI cards, and operational dashboard rhythm.',
    surfaceTag: 'Layout + Dashboard',
    templateAreas: ['layouts', 'pages'],
    component: TemplateShowcaseLayoutDashboardExample,
  },
  {
    id: 'dashboard-workspace',
    label: 'Operational workspace',
    summary: 'Search, filters, metrics, and kanban-ready workspace for active operations.',
    surfaceTag: 'Workspace',
    templateAreas: ['pages', 'features'],
    component: TemplateShowcaseDashboardWorkspaceExample,
  },
  {
    id: 'crud-profile-placeholder',
    label: 'CRUD, profile, and rollout states',
    summary: 'Registry and account flows paired with placeholder states for incremental delivery.',
    surfaceTag: 'CRUD + Profile',
    templateAreas: ['pages', 'features'],
    component: TemplateShowcaseCrudProfilePlaceholderExample,
  },
  {
    id: 'editor-workbench',
    label: 'Editor workbench',
    summary: 'Dense composition canvas with left widgets, top commands, and precision status rails.',
    surfaceTag: 'Workbench',
    templateAreas: ['features'],
    component: TemplateShowcaseEditorWorkbenchExample,
  },
  {
    id: 'enterprise',
    label: 'Enterprise command center',
    summary: 'KPI-heavy control room for alerts, approvals, audit, and platform services.',
    surfaceTag: 'Command Center',
    templateAreas: ['features', 'pages'],
    component: TemplateShowcaseEnterpriseExample,
  },
  {
    id: 'reference-system',
    label: 'Reference workspace',
    summary: 'Approved report manager and designer flow powered by the shared reference runtime.',
    surfaceTag: 'Reference System',
    templateAreas: ['features', 'samples'],
    component: TemplateShowcaseReferenceSystemExample,
  },
]

export function findTemplateShowcaseExample(exampleId: TemplateShowcaseExampleId): TemplateShowcaseExampleDefinition {
  const example = templateShowcaseExampleRegistry.find(entry => entry.id === exampleId)

  if (!example) {
    throw new Error(`Unknown template showcase example: ${exampleId}`)
  }

  return example
}
