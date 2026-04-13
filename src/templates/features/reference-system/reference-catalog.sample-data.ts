import type { ReferenceSampleSurface } from '../../../whitelabel'
import type { TemplateMenuItem } from '../../navigation/menu-template.types'

import type {
  ReferenceCatalogArchitectureCard,
  ReferenceCatalogRuntimeLink,
  ReferenceCatalogStat,
} from './reference-system.types'

export const referenceSampleSurfaces: ReferenceSampleSurface[] = [
  {
    id: 'dashboard',
    title: 'Dashboard shell',
    subtitle: 'Reference layout preview',
    tag: 'layout',
    description: 'A reusable command surface with metrics, ranking and progress cards.',
    template: 'dashboard',
  },
  {
    id: 'workspace',
    title: 'Dashboard workspace',
    subtitle: 'Action panel and lanes',
    tag: 'workspace',
    description: 'Workspace template for filters, views, KPIs and lane-based operations.',
    template: 'workspace',
  },
  {
    id: 'cruds',
    title: 'CRUD list',
    subtitle: 'Reusable collection screens',
    tag: 'pages',
    description: 'Shared list patterns for tenant, account and registry flows.',
    template: 'cruds',
  },
  {
    id: 'profile',
    title: 'Profile page',
    subtitle: 'Account and role details',
    tag: 'pages',
    description: 'Typed profile surface for account data, access metadata and owner context.',
    template: 'profile',
  },
  {
    id: 'editor',
    title: 'Editor workbench',
    subtitle: 'Canvas-driven authoring shell',
    tag: 'editor',
    description: 'A reusable editor layout with rail, rulers, canvas and status bar.',
    template: 'editor',
  },
  {
    id: 'command-center',
    title: 'Command center',
    subtitle: 'Operations and alerting',
    tag: 'enterprise',
    description: 'Operational overview template for alerts, activities and service health.',
    template: 'command-center',
  },
  {
    id: 'login',
    title: 'Auth shell',
    subtitle: 'Split brand and form layout',
    tag: 'auth',
    description: 'Authentication template with reusable brand panel and form controls.',
    template: 'login',
  },
  {
    id: 'wiki',
    title: 'Wiki and assistant',
    subtitle: 'Knowledge templates',
    tag: 'knowledge',
    description: 'A reference-friendly knowledge and chat surface for support and docs.',
    template: 'wiki',
  },
]

export const referenceMenuItems: TemplateMenuItem[] = [
  { id: 'overview', text: 'Overview', caption: 'Approved system direction', icon: 'dashboard', groupId: 'system', groupLabel: 'System' },
  { id: 'samples', text: 'Sample Catalog', caption: 'Systems and screens', icon: 'view_quilt', groupId: 'system', groupLabel: 'System' },
  { id: 'presets', text: 'Whitelabel', caption: 'Parameterization architecture', icon: 'palette', groupId: 'system', groupLabel: 'System' },
  { id: 'dashboard', text: 'Dashboard', caption: 'Hero, metrics and ranking', icon: 'space_dashboard', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'workspace', text: 'Workspace', caption: 'Filters, views and lanes', icon: 'work', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'cruds', text: 'CRUD List', caption: 'Collections and actions', icon: 'table_rows', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'profile', text: 'Profile', caption: 'Account detail surface', icon: 'badge', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'editor', text: 'Editor', caption: 'Canvas and command bars', icon: 'edit_square', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'enterprise', text: 'Command Center', caption: 'Alerts and health', icon: 'monitoring', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'auth', text: 'Auth', caption: 'Brand and sign-in shell', icon: 'lock', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'knowledge', text: 'Knowledge', caption: 'Docs and assistant', icon: 'menu_book', groupId: 'screens', groupLabel: 'Screens' },
  { id: 'help', text: 'Template Showcase', caption: 'Shared template runtime', icon: 'dashboard_customize', stickyBottom: true },
  { id: 'back-home', text: 'Legacy Landing', caption: 'Old marketing runtime', icon: 'home', stickyBottom: true },
]

export const referencePresetCallouts = [
  {
    id: 'preset-night',
    title: 'Reference Night',
    description: 'High-contrast preview for operations-heavy demos and denser shell validation.',
    badge: 'recommended',
  },
  {
    id: 'preset-light',
    title: 'Reference Light',
    description: 'Editorial review mode for approval rounds, screenshots and stakeholder walkthroughs.',
    badge: 'approved',
  },
  {
    id: 'preset-graphite',
    title: 'Reference Graphite',
    description: 'Neutral enterprise baseline for regression checks and tenant parameterization.',
    badge: 'baseline',
  },
]

export const referenceHeroStats: ReferenceCatalogStat[] = [
  { id: 'templates', label: 'Reusable surfaces', value: '8' },
  { id: 'presets', label: 'Whitelabel presets', value: '3' },
  { id: 'runtimes', label: 'Runtime modes', value: '5' },
]

export const referenceArchitectureCards: ReferenceCatalogArchitectureCard[] = [
  {
    id: 'templates',
    title: 'Templates First',
    description: 'Every approved screen is represented by a typed, reusable template under `src/templates/**`.',
    icon: 'dashboard_customize',
    bullets: [
      'layout, page and feature contracts stay portable across demos',
      'screen previews reuse the same production-facing template surfaces',
      'catalog entries map directly to reusable implementation artifacts',
    ],
  },
  {
    id: 'components',
    title: 'Composable Building Blocks',
    description: 'Cards, selectors, workspace shells and preview frames stay isolated so hosts stay thin.',
    icon: 'extension',
    bullets: [
      'catalog host state lives in composables instead of page-local glue',
      'preview cards and live renderers stay independent from the landing host',
      'the same shell can back the catalog, report workspace and future demos',
    ],
  },
  {
    id: 'whitelabel',
    title: 'Whitelabel Runtime',
    description: 'Presets do not fork screens; they swap brand, palette, radius and surface tokens.',
    icon: 'tune',
    bullets: [
      'preset changes persist through the shared reference whitelabel runtime',
      'samples prove token-driven reuse before product-specific adoption',
      'legacy landing is no longer the canonical demo for theme validation',
    ],
  },
]

export const referenceRuntimeLinks: ReferenceCatalogRuntimeLink[] = [
  {
    id: 'original-reference',
    title: 'Open Original Reference',
    description: 'Open the original baseline directly in the approved shell without the showcase wrapper.',
    href: '/?original=1',
    icon: 'dashboard',
  },
  {
    id: 'report-workspace',
    title: 'Open Report Workspace',
    description: 'Jump into the report-manager and designer runtime backed by the shared reference shell.',
    href: '/?samples=1',
    icon: 'design_services',
  },
  {
    id: 'template-showcase',
    title: 'Open Template Showcase',
    description: 'Inspect the catalog of shared layouts, pages and feature templates.',
    href: '/?templates=1',
    icon: 'widgets',
  },
  {
    id: 'template-runtime',
    title: 'Open Template Runtime',
    description: 'Use the router-driven runtime that composes scaffolded template routes.',
    href: '/?template-runtime=1',
    icon: 'route',
  },
  {
    id: 'legacy-landing',
    title: 'Open Legacy Landing',
    description: 'Keep the old marketing landing reachable while the samples-first runtime stabilizes.',
    href: '/?landing=1',
    icon: 'public',
  },
]

export const referenceDashboardChips = [
  { id: 'chip-reference', text: 'Reference approved', icon: 'task_alt' },
  { id: 'chip-whitelabel', text: 'Whitelabel ready', icon: 'palette' },
]

export const referenceDashboardMetrics = [
  { id: 'metric-templates', label: 'Templates', value: '8', icon: 'widgets', tone: 'info' as const },
  { id: 'metric-screen-states', label: 'Screen states', value: '24', icon: 'grid_view', tone: 'success' as const },
  { id: 'metric-copy-sets', label: 'Copy sets', value: '2', icon: 'translate', tone: 'warning' as const },
  { id: 'metric-presets', label: 'Presets', value: '3', icon: 'palette', tone: 'danger' as const },
]

export const referenceDashboardActivities = [
  { id: 'activity-1', label: 'Layout parity locked', value: '100%', icon: 'lock', iconTone: 'green' as const },
  { id: 'activity-2', label: 'Reusable screens', value: '8', icon: 'dashboard', iconTone: 'blue' as const },
  { id: 'activity-3', label: 'Whitelabel tokens', value: 'parametric', icon: 'tune', iconTone: 'teal' as const },
]

export const referenceDashboardTopItems = [
  { id: 'top-1', name: 'Reference shell', value: 'Stable', secondaryValue: 'Main layout', barPercent: 96 },
  { id: 'top-2', name: 'Template library', value: 'Ready', secondaryValue: '8 surfaces', barPercent: 84 },
  { id: 'top-3', name: 'Samples runtime', value: 'Live', secondaryValue: '8 screens', barPercent: 72 },
]

export const referenceWorkspaceActions = [
  { id: 'refresh', label: 'Refresh', icon: 'refresh' },
  { id: 'export', label: 'Export config', icon: 'download', outline: true, unelevated: false },
]

export const referenceWorkspaceFilters = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'approved', label: 'Approved', count: 4 },
  { id: 'draft', label: 'Draft', count: 2 },
]

export const referenceWorkspaceViews = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'lane', label: 'Lane', icon: 'view_kanban' },
]

export const referenceWorkspaceMetrics = [
  { id: 'workspace-1', label: 'Open screens', value: 8, delta: '+2', icon: 'open_in_new', tone: 'info' as const },
  { id: 'workspace-2', label: 'Controls reused', value: 18, delta: '+5', icon: 'checklist', tone: 'success' as const },
  { id: 'workspace-3', label: 'Tokens exposed', value: 27, delta: 'stable', icon: 'token', tone: 'warning' as const },
]

export const referenceWorkspacePanels = [
  { id: 'panel-brand', title: 'Brand presets', value: 3, description: 'Switch tokens without rewriting screens.', icon: 'palette', tone: 'info' as const },
  { id: 'panel-layout', title: 'Layout shells', value: 2, description: 'Same shell contract across samples.', icon: 'view_sidebar', tone: 'success' as const },
  { id: 'panel-screens', title: 'Reference screens', value: 8, description: 'All reusable and demo-ready.', icon: 'view_quilt', tone: 'warning' as const },
]

export const referenceWorkspaceLanes = [
  {
    id: 'lane-baseline',
    title: 'Baseline',
    items: [
      { id: 'screen-dashboard', title: 'Dashboard shell', subtitle: 'Main layout and metrics', assignee: 'Reference', filterKeys: ['approved', 'all'] },
      { id: 'screen-login', title: 'Auth shell', subtitle: 'Brand + form split', assignee: 'Reference', filterKeys: ['approved', 'all'] },
    ],
  },
  {
    id: 'lane-surfaces',
    title: 'Reusable surfaces',
    items: [
      { id: 'screen-workspace', title: 'Workspace lanes', subtitle: 'Filter and view controls', badge: 'New', assignee: 'System', filterKeys: ['draft', 'all'] },
      { id: 'screen-editor', title: 'Editor workbench', subtitle: 'Canvas and status bars', assignee: 'System', filterKeys: ['approved', 'all'] },
      { id: 'screen-profile', title: 'Profile page', subtitle: 'Account detail surface', assignee: 'System', filterKeys: ['approved', 'all'] },
    ],
  },
  {
    id: 'lane-docs',
    title: 'Knowledge',
    items: [
      { id: 'screen-wiki', title: 'Wiki template', subtitle: 'Docs and assistant surfaces', assignee: 'Support', filterKeys: ['approved', 'all'] },
      { id: 'screen-enterprise', title: 'Command center', subtitle: 'Alerts and service health', assignee: 'Ops', filterKeys: ['draft', 'all'] },
    ],
  },
]

export const referenceCrudColumns = [
  { id: 'name', label: 'Screen', emphasize: true },
  { id: 'owner', label: 'Owner' },
  { id: 'state', label: 'State' },
]

export const referenceCrudRecords = [
  {
    id: 'record-dashboard',
    title: 'Dashboard shell',
    subtitle: 'Main reference layout',
    values: { name: 'Dashboard shell', owner: 'Design', state: 'Approved' },
    status: { value: 'approved', label: 'Approved', tone: 'success' as const },
    tags: ['layout', 'metric'],
    filterKeys: ['approved'],
  },
  {
    id: 'record-workspace',
    title: 'Workspace template',
    subtitle: 'Lane-based operations',
    values: { name: 'Workspace template', owner: 'Product', state: 'Draft' },
    status: { value: 'draft', label: 'Draft', tone: 'warning' as const },
    tags: ['workspace'],
    filterKeys: ['draft'],
  },
  {
    id: 'record-editor',
    title: 'Editor workbench',
    subtitle: 'Canvas-driven authoring',
    values: { name: 'Editor workbench', owner: 'Platform', state: 'Approved' },
    status: { value: 'approved', label: 'Approved', tone: 'success' as const },
    tags: ['editor', 'canvas'],
    filterKeys: ['approved'],
  },
]

export const referenceCrudFilters = [
  { id: 'all', label: 'All', count: 3 },
  { id: 'approved', label: 'Approved', count: 2 },
  { id: 'draft', label: 'Draft', count: 1 },
]

export const referenceCrudMetrics = [
  { id: 'crud-1', label: 'Approved screens', value: 2, icon: 'check_circle', tone: 'success' as const },
  { id: 'crud-2', label: 'Draft screens', value: 1, icon: 'schedule', tone: 'warning' as const },
]

export const referenceCrudRowActions = [
  { id: 'open', icon: 'visibility', ariaLabel: 'Open screen' },
  { id: 'duplicate', icon: 'content_copy', ariaLabel: 'Duplicate screen' },
]

export const referenceCrudBulkActions = [
  { id: 'promote', label: 'Promote selected', icon: 'publish' },
]

export const referenceProfile = {
  name: 'Reference Admin',
  email: 'reference@nettoolskit.dev',
  role: 'Platform Owner',
  initials: 'RA',
}

export const referenceProfileGroups = [
  {
    id: 'identity',
    title: 'Identity',
    fields: [
      { id: 'name', label: 'Name', value: 'Reference Admin' },
      { id: 'role', label: 'Role', value: 'Platform Owner' },
      { id: 'team', label: 'Team', value: 'Platform Design' },
    ],
  },
  {
    id: 'access',
    title: 'Access',
    fields: [
      { id: 'scope', label: 'Scope', value: 'Global' },
      { id: 'review', label: 'Last review', value: '2026-04-01' },
      { id: 'policy', label: 'Policy', value: 'Reference baseline' },
    ],
  },
]

export const referenceEditorTopbarActions = [
  { id: 'new', icon: 'note_add', ariaLabel: 'New canvas' },
  { id: 'save', icon: 'save', ariaLabel: 'Save canvas' },
  { id: 'preview', icon: 'visibility', ariaLabel: 'Preview canvas' },
]

export const referenceEditorQuickActions = [
  { id: 'undo', icon: 'undo', ariaLabel: 'Undo change' },
  { id: 'redo', icon: 'redo', ariaLabel: 'Redo change' },
  { id: 'align', icon: 'format_align_left', ariaLabel: 'Align objects' },
]

export const referenceEditorWidgetSections = [
  {
    id: 'layout',
    title: 'Layout',
    items: [
      { id: 'widget-card', label: 'Card', icon: 'crop_16_9' },
      { id: 'widget-banner', label: 'Banner', icon: 'campaign' },
      { id: 'widget-stack', label: 'Stack', icon: 'layers' },
      { id: 'widget-grid', label: 'Grid', icon: 'grid_view' },
    ],
  },
  {
    id: 'content',
    title: 'Content',
    items: [
      { id: 'widget-text', label: 'Text', icon: 'text_fields' },
      { id: 'widget-image', label: 'Image', icon: 'image' },
      { id: 'widget-table', label: 'Table', icon: 'table_chart' },
      { id: 'widget-chart', label: 'Chart', icon: 'show_chart' },
    ],
  },
]

export const referenceEditorCanvasColumns = [
  'TITLE',
  'STATE',
  'OWNER',
  'PRESET',
  'TYPE',
]

export const referenceEditorCanvasObjects = [
  { id: 'canvas-logo', label: 'Reference logo', subtitle: 'Brand lockup', x: 54, y: 58, width: 186, height: 88, locked: true },
  { id: 'canvas-title', label: 'Reference shell title', subtitle: 'Hero heading', x: 484, y: 58, width: 360, height: 78, tone: 'info' as const },
  { id: 'canvas-panel', label: 'Feature panel', subtitle: 'Reusable card surface', x: 54, y: 172, width: 1050, height: 116, tone: 'primary' as const },
  { id: 'canvas-footer', label: 'Footer strip', subtitle: 'Status and metadata', x: 54, y: 320, width: 1050, height: 72, tone: 'warning' as const },
]

export const referenceEditorRailActions = [
  { id: 'properties', icon: 'tune', ariaLabel: 'Properties rail' },
  { id: 'layers', icon: 'layers', ariaLabel: 'Layers rail' },
  { id: 'tokens', icon: 'palette', ariaLabel: 'Tokens rail' },
]

export const referenceEditorLeftStatusSegments = [
  { id: 'nodes', label: 'Nodes', value: 14 },
  { id: 'snap', label: 'Snap', value: 'On', tone: 'success' as const },
]

export const referenceEditorRightStatusSegments = [
  { id: 'viewport', label: 'Viewport', value: '1280px', tone: 'info' as const },
  { id: 'mode', label: 'Mode', value: 'Reference', tone: 'warning' as const },
]

export const referenceEnterpriseActions = [
  { id: 'refresh', label: 'Refresh', icon: 'refresh' },
  { id: 'ack', label: 'Acknowledge all', icon: 'done_all', outline: true, unelevated: false },
]

export const referenceEnterpriseFilters = [
  { id: 'all', label: 'All', count: 5 },
  { id: 'critical', label: 'Critical', count: 2 },
  { id: 'warning', label: 'Warning', count: 1 },
]

export const referenceEnterpriseKpis = [
  { id: 'kpi-uptime', label: 'Uptime', value: '99.95%', delta: '+0.04%', icon: 'monitor_heart', tone: 'success' as const },
  { id: 'kpi-alerts', label: 'Alerts', value: 3, delta: '-1', icon: 'notification_important', tone: 'warning' as const },
  { id: 'kpi-releases', label: 'Releases', value: 8, delta: '+2', icon: 'rocket_launch', tone: 'info' as const },
]

export const referenceEnterpriseAlerts = [
  { id: 'alert-1', title: 'Shell regression detected', summary: 'Spacing drift in comparison view.', service: 'Reference UI', timeLabel: '08:32', severity: 'warning' as const, filterKeys: ['warning'] },
  { id: 'alert-2', title: 'Template pack validated', summary: 'All reference screens passed checks.', service: 'Template Runtime', timeLabel: '09:10', severity: 'danger' as const, filterKeys: ['critical'] },
]

export const referenceEnterpriseActivities = [
  { id: 'act-1', title: 'Preset applied', description: 'Reference Light switched into the showcase.', owner: 'Design', timeLabel: '08:12', filterKeys: ['all'] },
  { id: 'act-2', title: 'Screens compared', description: 'All template samples matched the reference layout.', owner: 'QA', timeLabel: '09:01', filterKeys: ['critical'] },
]

export const referenceEnterpriseServices = [
  { id: 'svc-1', name: 'Reference shell', uptime: '99.99%', sla: '99.90%', owner: 'Platform', filterKeys: ['all'] },
  { id: 'svc-2', name: 'Template runtime', uptime: '99.97%', sla: '99.90%', owner: 'Design', filterKeys: ['warning'] },
  { id: 'svc-3', name: 'Whitelabel tokens', uptime: '99.95%', sla: '99.90%', owner: 'System', filterKeys: ['critical'] },
]

export const referenceLoginFeatures = [
  { id: 'login-1', text: 'Brand switch without screen duplication', icon: 'palette' },
  { id: 'login-2', text: 'Reusable form contracts and validation', icon: 'verified' },
  { id: 'login-3', text: 'Fast demo mode for stakeholder review', icon: 'speed' },
]

export const referenceWikiCategories = [
  {
    id: 'reference-guides',
    name: 'Reference guides',
    count: 4,
    expanded: true,
    children: [
      { id: 'layout-guide', name: 'Layout guide', count: 2 },
      { id: 'tokens-guide', name: 'Tokens guide', count: 2 },
    ],
  },
  {
    id: 'samples',
    name: 'Samples',
    count: 3,
    children: [
      { id: 'dashboard-guide', name: 'Dashboard sample', count: 1 },
      { id: 'editor-guide', name: 'Editor sample', count: 1 },
    ],
  },
]

export const referenceWikiDocuments = [
  { id: 'doc-1', name: 'Reference layout brief', category: 'Reference guides', categoryId: 'reference-guides', subCategory: 'Layout guide', subCategoryId: 'layout-guide', tags: ['shell', 'layout'], status: 'processed' as const, uploadDate: '2026-04-01' },
  { id: 'doc-2', name: 'Whitelabel token map', category: 'Reference guides', categoryId: 'reference-guides', subCategory: 'Tokens guide', subCategoryId: 'tokens-guide', tags: ['tokens', 'theme'], status: 'processed' as const, uploadDate: '2026-04-01' },
  { id: 'doc-3', name: 'Dashboard sample notes', category: 'Samples', categoryId: 'samples', subCategory: 'Dashboard sample', subCategoryId: 'dashboard-guide', tags: ['sample'], status: 'pending' as const, uploadDate: '2026-04-01' },
]

export const referenceWikiStatChips = [
  { id: 'wiki-total', label: 'docs', value: 3, icon: 'description', tone: 'info' as const },
  { id: 'wiki-processed', label: 'ready', value: 2, icon: 'check_circle', tone: 'success' as const },
  { id: 'wiki-pending', label: 'pending', value: 1, icon: 'schedule', tone: 'warning' as const },
]

export const referenceWikiConversations = [
  { id: 'conversation-1', title: 'Layout approval', updatedAt: '09:12', messageCount: 4 },
  { id: 'conversation-2', title: 'Token review', updatedAt: '08:40', messageCount: 2 },
]

export const referenceWikiMessages = [
  {
    id: 'message-1',
    role: 'assistant' as const,
    content: 'The approved reference direction is now represented by reusable template surfaces and whitelabel presets.',
    sources: [
      {
        documentName: 'Reference layout brief',
        chunkContent: 'Use reusable shell, samples and presets instead of a monolithic legacy runtime.',
        relevance: 0.98,
      },
    ],
  },
  {
    id: 'message-2',
    role: 'user' as const,
    content: 'Can we swap the visual tone without rewriting the screens?',
  },
  {
    id: 'message-3',
    role: 'assistant' as const,
    content: 'Yes. The same templates can be driven by a different preset and CSS token set.',
  },
]
