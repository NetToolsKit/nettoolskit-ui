export const templateShowcaseDashboardSample = {
  greetingIcon: '🌤️',
  title: 'Boa tarde, Guilherme Ferreira',
  subtitle: 'Sexta-Feira, 10 De Abril',
  chips: [
    { id: 'chip-clients', text: '247 clientes', icon: 'people' },
    { id: 'chip-orders', text: '18 pedidos hoje', icon: 'shopping_cart' },
  ],
  metrics: [
    { id: 'metric-total-orders', label: 'Total Pedidos', value: 1847, icon: 'shopping_cart', tone: 'neutral' as const },
    { id: 'metric-pending-orders', label: 'Pendentes', value: 34, icon: 'inbox', tone: 'info' as const },
    { id: 'metric-progress-orders', label: 'Em Progresso', value: 52, icon: 'pending_actions', tone: 'warning' as const },
    { id: 'metric-completed-orders', label: 'Concluidos', value: 1680, icon: 'task_alt', tone: 'success' as const },
    { id: 'metric-cancelled-orders', label: 'Cancelados', value: 81, icon: 'cancel', tone: 'danger' as const },
  ],
  statusSegments: [
    { id: 'status-pending', label: 'Pendentes', value: 34, color: '#3b82f6' },
    { id: 'status-progress', label: 'Em Progresso', value: 52, color: '#f59e0b' },
    { id: 'status-completed', label: 'Concluidos', value: 1680, color: '#10b981' },
    { id: 'status-cancelled', label: 'Cancelados', value: 81, color: '#64748b' },
  ],
  categorySeries: [
    { id: 'category-electronics', label: 'Eletronicos', value: 523, color: '#3b82f6' },
    { id: 'category-food', label: 'Alimentos', value: 412, color: '#f97316' },
    { id: 'category-fashion', label: 'Vestuario', value: 287, color: '#eab308' },
    { id: 'category-hygiene', label: 'Higiene', value: 198, color: '#22c55e' },
  ],
  activities: [
    { id: 'activity-today', label: 'Pedidos hoje', value: 18, icon: 'today', iconTone: 'blue' as const },
    { id: 'activity-week', label: 'Pedidos na semana', value: 87, icon: 'date_range', iconTone: 'indigo' as const },
    { id: 'activity-month', label: 'Pedidos no mes', value: 342, icon: 'calendar_month', iconTone: 'violet' as const },
    { id: 'activity-revenue', label: 'Faturamento do mes', value: 'R$ 156.780', icon: 'attach_money', iconTone: 'green' as const },
    { id: 'activity-clients', label: 'Novos clientes no mes', value: 23, icon: 'person_add', iconTone: 'amber' as const },
  ],
  topItems: [
    {
      id: 'top-client-1',
      name: 'Distribuidora Alfa Ltda',
      avatar: 'DL',
      value: 45,
      secondaryValue: 'R$ 32.500',
      barPercent: 100,
    },
    {
      id: 'top-client-2',
      name: 'Comercio Beta Sa',
      avatar: 'CS',
      value: 38,
      secondaryValue: 'R$ 28.900',
      barPercent: 84,
    },
    {
      id: 'top-client-3',
      name: 'Industria Gamma Me',
      avatar: 'IM',
      value: 32,
      secondaryValue: 'R$ 24.100',
      barPercent: 71,
    },
    {
      id: 'top-client-4',
      name: 'Atacado Delta Eireli',
      avatar: 'AE',
      value: 27,
      secondaryValue: 'R$ 19.800',
      barPercent: 60,
    },
    {
      id: 'top-client-5',
      name: 'Varejo Epsilon Ltda',
      avatar: 'VL',
      value: 21,
      secondaryValue: 'R$ 15.600',
      barPercent: 47,
    },
  ],
}

export const templateShowcaseLoginSample = {
  initialEmail: 'operations@nettoolskit.dev',
  initialPassword: 'TemplatePass!2026',
  versionLabel: 'Template build 2026.03',
  features: [
    { id: 'lf-1', text: 'Enterprise SSO compatible', icon: 'shield' },
    { id: 'lf-2', text: 'Multi-tenant policy aware', icon: 'business' },
    { id: 'lf-3', text: 'Audit-friendly access logs', icon: 'history' },
  ],
}

export const templateShowcaseWorkspaceSample = {
  initialSearchValue: '',
  initialFilterId: 'all',
  initialViewId: 'overview',
  actions: [
    { id: 'refresh', label: 'Refresh', icon: 'refresh' },
    { id: 'export', label: 'Export view', icon: 'download', outline: true, unelevated: false },
  ],
  filters: [
    { id: 'all', label: 'All', count: 7 },
    { id: 'urgent', label: 'Urgent', count: 2 },
    { id: 'review', label: 'Review', count: 3 },
  ],
  views: [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'pipeline', label: 'Pipeline', icon: 'view_kanban' },
  ],
  metrics: [
    { id: 'wm-1', label: 'Tasks in progress', value: 18, delta: '+4', icon: 'task', tone: 'info' as const },
    { id: 'wm-2', label: 'Approvals due today', value: 6, delta: '-1', icon: 'schedule', tone: 'warning' as const },
    { id: 'wm-3', label: 'Release blockers', value: 1, delta: 'stable', icon: 'error', tone: 'danger' as const },
  ],
  panels: [
    { id: 'panel-risk', title: 'Risk register', value: 5, description: 'Open operational risks', icon: 'report_problem', tone: 'warning' as const },
    { id: 'panel-change', title: 'Change requests', value: 14, description: 'Ready for triage', icon: 'swap_horiz', tone: 'info' as const },
    { id: 'panel-compliance', title: 'Compliance checks', value: '98%', description: 'This week pass rate', icon: 'verified', tone: 'success' as const },
  ],
  lanes: [
    {
      id: 'lane-backlog',
      title: 'Backlog',
      items: [
        { id: 'task-1', title: 'Review dashboard theming', subtitle: 'Design guild', assignee: 'Ana', filterKeys: ['review'] },
        { id: 'task-2', title: 'Prepare release checklist', subtitle: 'Platform team', assignee: 'Leo', filterKeys: ['all'] },
      ],
    },
    {
      id: 'lane-active',
      title: 'In progress',
      items: [
        { id: 'task-3', title: 'Close accessibility findings', subtitle: 'WCAG sweep', badge: 'Urgent', assignee: 'Mia', filterKeys: ['urgent'] },
        { id: 'task-4', title: 'Validate CRUD template states', subtitle: 'Unit + visual', assignee: 'Noah', filterKeys: ['review'] },
      ],
    },
    {
      id: 'lane-done',
      title: 'Done',
      items: [
        { id: 'task-5', title: 'Scaffolding templates completed', subtitle: 'Router/Menu/Store/Notify', assignee: 'Ops', filterKeys: ['all'] },
      ],
    },
  ],
}

export const templateShowcaseCrudSample = {
  initialSearchValue: '',
  initialFilterId: 'all',
  initialViewMode: 'table' as const,
  initialSelectedIds: ['tenant-acme'],
  title: 'Tenant registry',
  subtitle: 'Reusable CRUD list with filter, search, bulk actions and table/cards view.',
  columns: [
    { id: 'tenant', label: 'Tenant', emphasize: true },
    { id: 'owner', label: 'Owner' },
    { id: 'region', label: 'Region' },
  ],
  records: [
    {
      id: 'tenant-acme',
      title: 'Acme Corp',
      subtitle: 'Production workspace',
      values: { tenant: 'Acme Corp', owner: 'Ana Costa', region: 'US-East' },
      status: { value: 'active', label: 'Active', tone: 'success' as const },
      tags: ['enterprise', 'priority'],
      filterKeys: ['active'],
    },
    {
      id: 'tenant-beta',
      title: 'Beta Industries',
      subtitle: 'Staging workspace',
      values: { tenant: 'Beta Industries', owner: 'Bruno Lima', region: 'EU-West' },
      status: { value: 'review', label: 'Needs review', tone: 'warning' as const },
      tags: ['review'],
      filterKeys: ['review'],
    },
    {
      id: 'tenant-gamma',
      title: 'Gamma Systems',
      subtitle: 'Migration in progress',
      values: { tenant: 'Gamma Systems', owner: 'Marta Melo', region: 'SA-East' },
      status: { value: 'pending', label: 'Pending', tone: 'info' as const },
      tags: ['migration'],
      filterKeys: ['pending'],
    },
  ],
  filters: [
    { id: 'all', label: 'All', count: 3 },
    { id: 'active', label: 'Active', count: 1 },
    { id: 'review', label: 'Review', count: 1 },
    { id: 'pending', label: 'Pending', count: 1 },
  ],
  metrics: [
    { id: 'cm-1', label: 'Active tenants', value: 1, icon: 'apartment', tone: 'success' as const },
    { id: 'cm-2', label: 'Pending actions', value: 2, icon: 'pending_actions', tone: 'warning' as const },
  ],
  rowActions: [
    { id: 'edit', icon: 'edit', ariaLabel: 'Edit record' },
    { id: 'open', icon: 'visibility', ariaLabel: 'Open record' },
  ],
  bulkActions: [
    { id: 'archive', label: 'Archive selected', icon: 'archive' },
  ],
}

export const templateShowcaseProfileSample = {
  profile: {
    name: 'Template Owner',
    email: 'owner@nettoolskit.dev',
    role: 'Platform Manager',
    initials: 'TO',
  },
  groups: [
    {
      id: 'identity',
      title: 'Identity',
      fields: [
        { id: 'name', label: 'Name', value: 'Template Owner' },
        { id: 'role', label: 'Role', value: 'Platform Manager' },
        { id: 'department', label: 'Department', value: 'Engineering' },
      ],
    },
    {
      id: 'access',
      title: 'Access',
      fields: [
        { id: 'scope', label: 'Scope', value: 'Global' },
        { id: 'policy', label: 'Policy', value: 'Enterprise default' },
        { id: 'last-review', label: 'Last review', value: '2026-03-25' },
      ],
    },
  ],
}

export const templateShowcasePlaceholderSample = {
  title: 'Governance workspace in rollout',
  subtitle: 'This module template is intentionally generic and tenant agnostic.',
  description: 'Use this placeholder while preserving release quality gates and accessibility contracts.',
  statusLabel: 'In progress',
  hints: [
    { id: 'hint-1', text: 'Template contracts are already in place.', icon: 'check_circle' },
    { id: 'hint-2', text: 'Use scaffolding templates for fast route and store bootstrap.', icon: 'bolt' },
  ],
  primaryAction: { id: 'primary-open', label: 'Open planning board', icon: 'open_in_new' },
  secondaryAction: { id: 'secondary-docs', label: 'Read template docs', icon: 'description', outline: true, unelevated: false },
}

export const templateShowcaseEditorSample = {
  initialSelectedWidgetId: 'widget-text',
  initialZoomValue: 100,
  zoomOptions: [50, 75, 100, 125, 150],
  documentTitle: 'Bateladas Operations Report',
  documentSubtitle: 'Enterprise editor shell with menus, command bars and report design canvas.',
  topbarActions: [
    { id: 'new', icon: 'note_add', ariaLabel: 'New file' },
    { id: 'open', icon: 'folder_open', ariaLabel: 'Open file' },
    { id: 'save', icon: 'save', ariaLabel: 'Save file' },
    { id: 'cut', icon: 'content_cut', ariaLabel: 'Cut' },
    { id: 'copy', icon: 'content_copy', ariaLabel: 'Copy' },
    { id: 'delete', icon: 'delete', ariaLabel: 'Delete' },
  ],
  quickActions: [
    { id: 'undo', icon: 'undo', ariaLabel: 'Undo' },
    { id: 'redo', icon: 'redo', ariaLabel: 'Redo' },
    { id: 'duplicate', icon: 'content_copy', ariaLabel: 'Duplicate' },
  ],
  widgetSections: [
    {
      id: 'basic',
      title: 'Basic items',
      items: [
        { id: 'widget-text', label: 'Text', icon: 'text_fields' },
        { id: 'widget-image', label: 'Image', icon: 'image' },
        { id: 'widget-line', label: 'Line', icon: 'show_chart' },
        { id: 'widget-rect', label: 'Rectangle', icon: 'crop_16_9' },
      ],
    },
    {
      id: 'comparison',
      title: 'Comparison',
      items: [
        { id: 'widget-column', label: 'Column', icon: 'bar_chart' },
        { id: 'widget-stacked', label: 'Stacked', icon: 'stacked_bar_chart' },
        { id: 'widget-range', label: 'Range', icon: 'equalizer' },
        { id: 'widget-kpi', label: 'KPI', icon: 'query_stats' },
      ],
    },
    {
      id: 'regions',
      title: 'Data regions',
      items: [
        { id: 'widget-table', label: 'Table', icon: 'table_chart' },
        { id: 'widget-list', label: 'List', icon: 'view_list' },
        { id: 'widget-matrix', label: 'Matrix', icon: 'grid_view' },
        { id: 'widget-map', label: 'Map', icon: 'public' },
      ],
    },
  ],
  canvasColumns: [
    'DATE',
    'ORDER #',
    'TYPE',
    'CLIENT',
    'OPERATOR',
    'PRODUCT',
    'QUANTITY',
  ],
  canvasObjects: [
    { id: 'obj-logo', label: 'Brand logo', subtitle: 'Image block', x: 46, y: 52, width: 182, height: 102, locked: true },
    { id: 'obj-title', label: 'BATELADAS', subtitle: 'Main report title', x: 498, y: 54, width: 340, height: 86, tone: 'info' as const },
    { id: 'obj-header', label: 'Header row', subtitle: 'Bound dataset fields', x: 42, y: 184, width: 1200, height: 118, tone: 'primary' as const },
    { id: 'obj-metrics', label: 'KPI strip', subtitle: 'Operational icons and status', x: 42, y: 340, width: 820, height: 82, tone: 'warning' as const },
    { id: 'obj-footer', label: 'Footer line', subtitle: 'System ownership and disclaimers', x: 42, y: 444, width: 1200, height: 66 },
  ],
  railActions: [
    { id: 'properties', icon: 'tune', ariaLabel: 'Properties' },
    { id: 'layers', icon: 'layers', ariaLabel: 'Layers' },
    { id: 'filters', icon: 'filter_list', ariaLabel: 'Filters' },
    { id: 'data', icon: 'dataset', ariaLabel: 'Data source' },
    { id: 'settings', icon: 'settings', ariaLabel: 'Settings' },
  ],
  leftStatusSegments: [
    { id: 'row-groups', label: 'Row groups', value: 3 },
    { id: 'warnings', label: 'Warnings', value: 2, tone: 'warning' as const },
  ],
  rightStatusSegments: [
    { id: 'column-groups', label: 'Column groups', value: 4, tone: 'info' as const },
    { id: 'snap', label: 'Snap', value: 'On', tone: 'success' as const },
  ],
}

export const templateShowcaseEnterpriseSample = {
  initialSearchValue: '',
  initialFilterId: 'all',
  actions: [
    { id: 'refresh', label: 'Refresh', icon: 'refresh' },
    { id: 'ack-all', label: 'Acknowledge all', icon: 'done_all', outline: true, unelevated: false },
  ],
  filters: [
    { id: 'all', label: 'All', count: 6 },
    { id: 'critical', label: 'Critical', count: 2 },
    { id: 'warning', label: 'Warning', count: 2 },
  ],
  kpis: [
    { id: 'ek-1', label: 'Global uptime', value: '99.95%', delta: '+0.03%', icon: 'monitor_heart', tone: 'success' as const },
    { id: 'ek-2', label: 'Incidents', value: 3, delta: '-1', icon: 'notification_important', tone: 'warning' as const },
    { id: 'ek-3', label: 'Approvals pending', value: 8, delta: '+2', icon: 'fact_check', tone: 'info' as const },
  ],
  alerts: [
    { id: 'ea-1', title: 'API latency increased', summary: 'P95 above SLA for 8 minutes.', service: 'Public API', timeLabel: '08:41', severity: 'danger' as const, filterKeys: ['critical'] },
    { id: 'ea-2', title: 'Queue backlog warning', summary: 'Approval queue processing delayed.', service: 'Workflow Engine', timeLabel: '08:55', severity: 'warning' as const, filterKeys: ['warning'] },
  ],
  activities: [
    { id: 'ev-1', title: 'Deployment approved', description: 'Template rollout for region EU-West.', owner: 'Release board', timeLabel: '08:12', filterKeys: ['all'] },
    { id: 'ev-2', title: 'Incident triage complete', description: 'On-call team archived resolved alert.', owner: 'SRE team', timeLabel: '08:47', filterKeys: ['critical'] },
  ],
  services: [
    { id: 'service-1', name: 'Reference + CMS API', uptime: '99.97%', sla: '99.90%', owner: 'Platform', filterKeys: ['all'] },
    { id: 'service-2', name: 'Workflow Engine', uptime: '99.89%', sla: '99.90%', owner: 'Operations', filterKeys: ['warning'] },
    { id: 'service-3', name: 'Notification Bus', uptime: '99.99%', sla: '99.90%', owner: 'Messaging', filterKeys: ['critical'] },
  ],
}

export const templateShowcaseApprovalQueueSample = {
  initialSearchValue: '',
  initialFilterId: 'all',
  initialSelectedIds: ['req-200'],
  items: [
    { id: 'req-200', title: 'Quarterly budget adjustment', summary: 'Increase cloud reserve by 12%.', requester: 'Finance', submittedAt: '2026-03-25', amount: '$38,000', statusLabel: 'Pending', tone: 'warning' as const, tags: ['budget', 'q2'], filterKeys: ['pending', 'urgent'] },
    { id: 'req-201', title: 'Vendor onboarding', summary: 'Security review complete, waiting final approval.', requester: 'Procurement', submittedAt: '2026-03-24', amount: '$9,500', statusLabel: 'Pending', tone: 'info' as const, tags: ['vendor'], filterKeys: ['pending'] },
  ],
}

export const templateShowcaseAuditSample = {
  initialSearchValue: '',
  initialFilterId: 'all',
  events: [
    { id: 'audit-1', title: 'Policy updated', description: 'Access policy switched to template baseline.', actor: 'Platform Admin', target: 'Identity policy', eventType: 'security', timestamp: '2026-03-26 08:15', tone: 'info' as const, filterKeys: ['security'] },
    { id: 'audit-2', title: 'Release published', description: 'Template pack promoted to production.', actor: 'Release Bot', target: 'Template registry', eventType: 'release', timestamp: '2026-03-26 09:02', tone: 'success' as const, filterKeys: ['release'] },
    { id: 'audit-3', title: 'Approval rejected', description: 'Budget increase requires new justification.', actor: 'Finance Lead', target: 'Request req-200', eventType: 'governance', timestamp: '2026-03-26 09:20', tone: 'warning' as const, filterKeys: ['governance'] },
  ],
}

export const templateShowcaseKnowledgeSample = {
  initialConversationId: 'conversation-release',
  categories: [
    {
      id: 'runbooks',
      name: 'Runbooks',
      count: 4,
      expanded: true,
      children: [
        { id: 'incident', name: 'Incident Response', count: 2 },
        { id: 'release', name: 'Release Management', count: 2 },
      ],
    },
    {
      id: 'governance',
      name: 'Governance',
      count: 2,
      children: [
        { id: 'audit', name: 'Audit Controls', count: 1 },
        { id: 'policy', name: 'Policy Baselines', count: 1 },
      ],
    },
  ],
  documents: [
    { id: 'doc-1', name: 'Incident triage handbook', category: 'Runbooks', categoryId: 'runbooks', subCategory: 'Incident Response', subCategoryId: 'incident', tags: ['on-call', 'severity'], status: 'processed' as const, uploadDate: '2026-03-24' },
    { id: 'doc-2', name: 'Release checklist', category: 'Runbooks', categoryId: 'runbooks', subCategory: 'Release Management', subCategoryId: 'release', tags: ['release'], status: 'processed' as const, uploadDate: '2026-03-25' },
    { id: 'doc-3', name: 'Template governance policy', category: 'Governance', categoryId: 'governance', subCategory: 'Policy Baselines', subCategoryId: 'policy', tags: ['policy'], status: 'pending' as const, uploadDate: '2026-03-22' },
  ],
  statChips: [
    { id: 'ws-1', label: 'documents', value: 3, icon: 'description', tone: 'info' as const },
    { id: 'ws-2', label: 'processed', value: 2, icon: 'check_circle', tone: 'success' as const },
    { id: 'ws-3', label: 'pending', value: 1, icon: 'schedule', tone: 'warning' as const },
  ],
  conversations: [
    { id: 'conversation-release', title: 'Release quality checks', updatedAt: '09:12', messageCount: 4 },
    { id: 'conversation-policy', title: 'Policy rollouts', updatedAt: '08:30', messageCount: 2 },
  ],
  messages: [
    {
      id: 'message-1',
      role: 'assistant' as const,
      content: 'Template validation summary: lint, type-check, template tests and build are passing.',
      sources: [
        {
          documentName: 'Release checklist',
          chunkContent: 'Validate lint, type-check, targeted tests, smoke tests and production build.',
          relevance: 0.98,
        },
      ],
    },
    {
      id: 'message-2',
      role: 'user' as const,
      content: 'Any blockers left before release closeout?',
    },
    {
      id: 'message-3',
      role: 'assistant' as const,
      content: 'No blockers detected. Remaining step is commit and changelog sync for Item 124.',
    },
  ],
}

export const templateShowcaseCmsSample = {
  surfaces: [
    { id: 'settings', title: 'CmsSettingsModuleSurface', path: 'authoring/modules/CmsSettingsModuleSurface.vue' },
    { id: 'blocks', title: 'CmsBlocksModuleSurface', path: 'authoring/modules/CmsBlocksModuleSurface.vue' },
    { id: 'media', title: 'CmsMediaModuleSurface', path: 'authoring/modules/CmsMediaModuleSurface.vue' },
    { id: 'pages', title: 'CmsPagesModuleSurface', path: 'authoring/modules/CmsPagesModuleSurface.vue' },
    { id: 'pages-preview', title: 'CmsPagesPreviewSurface', path: 'authoring/modules/CmsPagesPreviewSurface.vue' },
    { id: 'releases', title: 'CmsReleasesModuleSurface', path: 'authoring/modules/CmsReleasesModuleSurface.vue' },
  ],
}
