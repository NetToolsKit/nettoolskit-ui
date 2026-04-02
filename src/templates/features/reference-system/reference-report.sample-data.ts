import type { TemplateMenuItem } from '../../navigation/menu-template.types'
import type { ReferenceNotificationItem, ReferenceReportGroup } from './reference-system.types'

export const referenceSampleMenuItems: TemplateMenuItem[] = [
  {
    id: 'catalog',
    text: 'Report Catalog',
    caption: 'Browse and search reports',
    icon: 'folder_copy',
    groupId: 'workspace',
    groupLabel: 'Workspace',
  },
  {
    id: 'designer',
    text: 'Designer',
    caption: 'Visual report editor',
    icon: 'design_services',
    groupId: 'workspace',
    groupLabel: 'Workspace',
  },
  {
    id: 'scheduled',
    text: 'Scheduled Reports',
    caption: 'Delivery and automation',
    icon: 'schedule',
    groupId: 'workspace',
    groupLabel: 'Workspace',
  },
  {
    id: 'templates',
    text: 'Templates',
    caption: 'Reusable report layouts',
    icon: 'dashboard_customize',
    groupId: 'library',
    groupLabel: 'Library',
  },
  {
    id: 'assets',
    text: 'Assets',
    caption: 'Images, fonts and shared styles',
    icon: 'perm_media',
    groupId: 'library',
    groupLabel: 'Library',
  },
  {
    id: 'presets',
    text: 'Presets',
    caption: 'Whitelabel configurations',
    icon: 'tune',
    groupId: 'administration',
    groupLabel: 'Administration',
  },
  {
    id: 'permissions',
    text: 'Permissions',
    caption: 'Users and access control',
    icon: 'admin_panel_settings',
    groupId: 'administration',
    groupLabel: 'Administration',
  },
  {
    id: 'help',
    text: 'Help & Docs',
    caption: 'Guides and reference',
    icon: 'help_outline',
    stickyBottom: true,
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

export const referenceSampleNotifications: ReferenceNotificationItem[] = [
  {
    id: 'notif-1',
    icon: 'check_circle',
    title: 'Monthly Revenue Summary published',
    description: 'Finance team approved and published the report.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'notif-2',
    icon: 'schedule',
    title: 'Scheduled delivery completed',
    description: 'Quarterly Performance was sent to 12 recipients.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'notif-3',
    icon: 'edit',
    title: 'Product Sales Analysis updated',
    description: 'Product Analytics made changes to the report layout.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 'notif-4',
    icon: 'person_add',
    title: 'New collaborator added',
    description: 'HR Analytics was added to the Operations workspace.',
    time: 'Yesterday',
    read: true,
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