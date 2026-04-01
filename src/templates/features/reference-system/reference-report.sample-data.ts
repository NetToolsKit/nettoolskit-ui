import type { TemplateMenuItem } from '../../navigation/menu-template.types'
import type { ReferenceReportGroup } from './reference-system.types'

export const referenceSampleMenuItems: TemplateMenuItem[] = [
  {
    id: 'catalog',
    text: 'Report Catalog',
    caption: 'Explorer and quick actions',
    icon: 'folder_copy',
    groupId: 'workspace',
    groupLabel: 'Workspace',
  },
  {
    id: 'designer',
    text: 'Designer',
    caption: 'Approved editor layout',
    icon: 'design_services',
    groupId: 'workspace',
    groupLabel: 'Workspace',
  },
  {
    id: 'back-home',
    text: 'Back to landing',
    caption: 'Public site',
    icon: 'home',
    stickyBottom: true,
  },
]

export const referenceSampleReportGroups: ReferenceReportGroup[] = [
  {
    id: 'sales',
    title: 'Sales & Revenue',
    items: [
      {
        id: 'monthly-revenue-summary',
        fileName: 'monthly-revenue-summary.rdl',
        title: 'Monthly Revenue Summary',
        description: 'Consolidated revenue report with product line and regional breakdowns.',
        category: 'Sales',
        owner: 'Finance',
        updatedAt: '2026-03-26 08:33',
        status: 'published',
        tags: ['rdl', 'revenue', 'monthly'],
        favorite: true,
      },
      {
        id: 'quarterly-performance',
        fileName: 'quarterly-performance.rdl',
        title: 'Quarterly Performance',
        description: 'Quarter-over-quarter comparison of targets, actuals and variance.',
        category: 'Sales',
        owner: 'Sales Ops',
        updatedAt: '2026-03-26 08:24',
        status: 'review',
        tags: ['rdl', 'quarterly', 'kpi'],
      },
      {
        id: 'product-sales-analysis',
        fileName: 'product-sales-analysis.rdl',
        title: 'Product Sales Analysis',
        description: 'Detailed product-level sales with category grouping and trend lines.',
        category: 'Sales',
        owner: 'Product Analytics',
        updatedAt: '2026-03-26 07:58',
        status: 'draft',
        tags: ['analytics', 'product'],
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    items: [
      {
        id: 'daily-activity-report',
        fileName: 'daily-activity-report.rdl',
        title: 'Daily Activity Report',
        description: 'Daily operational summary with throughput metrics and team assignments.',
        category: 'Operations',
        owner: 'Operations',
        updatedAt: '2026-03-25 18:05',
        status: 'published',
        tags: ['daily', 'operations'],
      },
      {
        id: 'workforce-utilization',
        fileName: 'workforce-utilization.rdl',
        title: 'Workforce Utilization',
        description: 'Capacity and utilization report with allocation breakdowns per team.',
        category: 'Operations',
        owner: 'HR Analytics',
        updatedAt: '2026-03-25 16:44',
        status: 'review',
        tags: ['hr', 'capacity'],
      },
    ],
  },
]

export function findReferenceReportById(
  groups: ReferenceReportGroup[],
  reportId: string | null | undefined
) {
  for (const group of groups) {
    const match = group.items.find(item => item.id === reportId)
    if (match) {
      return match
    }
  }

  return groups[0]?.items[0] ?? null
}