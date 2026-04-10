<template>
  <div class="ntk-template-showcase">
    <header
      class="ntk-template-showcase__hero"
      data-template-surface="catalog"
    >
      <div>
        <p class="ntk-template-showcase__kicker">
          Template-first enterprise baseline
        </p>
        <h1 class="ntk-template-showcase__title">
          NetToolsKit Template Catalog Showcase
        </h1>
        <p class="ntk-template-showcase__subtitle">
          Visual regression preview for reusable layouts, pages, features and integration scaffolds.
        </p>
      </div>

      <div class="ntk-template-showcase__stats">
        <article class="ntk-template-showcase__stat">
          <span>Total templates</span>
          <strong>{{ templateCatalogRegistry.length }}</strong>
        </article>
        <article class="ntk-template-showcase__stat">
          <span>Ready templates</span>
          <strong>{{ readyTemplateCount }}</strong>
        </article>
      </div>
    </header>

    <section class="ntk-template-showcase__catalog-grid">
      <article
        v-for="item in templatesByArea"
        :key="item.area"
        class="ntk-template-showcase__catalog-card"
      >
        <strong>{{ item.area }}</strong>
        <span>{{ item.count }} entries</span>
      </article>
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="layout-dashboard"
    >
      <h2>Layout and Dashboard Templates</h2>
      <MainLayoutTemplate
        :menu-items="[]"
        app-name="Template Preview"
        user-name="Template Admin"
        user-initials="TA"
        :show-drawer="false"
        :show-breadcrumb="false"
        :persist-mode="false"
      >
        <DashboardTemplate
          title="Template operations dashboard"
          subtitle="Reusable dashboard shell with chips, metrics and ranked highlights."
          :chips="dashboardChips"
          :metrics="dashboardMetrics"
          :activities="dashboardActivities"
          :top-items="dashboardTopItems"
        />
      </MainLayoutTemplate>
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="auth-login"
    >
      <h2>Authentication Template</h2>
      <AuthLayoutTemplate class="ntk-template-showcase__auth-shell">
        <LoginTemplate
          v-model:email="loginEmail"
          v-model:password="loginPassword"
          :show-version="true"
          version-label="Template build 2026.03"
          :features="loginFeatures"
          @submit="handleLoginSubmit"
        />
      </AuthLayoutTemplate>
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="dashboard-workspace"
    >
      <h2>Dashboard Workspace Template</h2>
      <DashboardWorkspaceTemplate
        :actions="workspaceActions"
        :filters="workspaceFilters"
        :views="workspaceViews"
        :metrics="workspaceMetrics"
        :panels="workspacePanels"
        :lanes="workspaceLanes"
        :search-value="workspaceSearchValue"
        :active-filter-id="workspaceActiveFilterId"
        :active-view-id="workspaceActiveViewId"
        @update:search-value="workspaceSearchValue = $event"
        @update:active-filter-id="workspaceActiveFilterId = $event"
        @update:active-view-id="workspaceActiveViewId = $event"
      />
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="crud-profile-placeholder"
    >
      <h2>CRUD, Profile and Placeholder Templates</h2>
      <CrudListTemplate
        title="Tenant registry"
        subtitle="Reusable CRUD list with filter, search, bulk actions and table/cards view."
        :columns="crudColumns"
        :records="crudRecords"
        :filters="crudFilters"
        :metrics="crudMetrics"
        :row-actions="crudRowActions"
        :bulk-actions="crudBulkActions"
        :selected-ids="crudSelectedIds"
        :search-value="crudSearchValue"
        :active-filter-id="crudActiveFilterId"
        :view-mode="crudViewMode"
        @update:selected-ids="crudSelectedIds = $event"
        @update:search-value="crudSearchValue = $event"
        @update:active-filter-id="crudActiveFilterId = $event"
        @update:view-mode="crudViewMode = $event"
      />

      <div class="ntk-template-showcase__two-column">
        <ProfileTemplate
          :profile="profile"
          :groups="profileGroups"
          :show-logout-action="true"
        />
        <PlaceholderTemplate
          title="Governance workspace in rollout"
          subtitle="This module template is intentionally generic and tenant agnostic."
          description="Use this placeholder while preserving release quality gates and accessibility contracts."
          status-label="In progress"
          :hints="placeholderHints"
          :primary-action="placeholderPrimaryAction"
          :secondary-action="placeholderSecondaryAction"
        />
      </div>
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="editor-workbench"
    >
      <h2>Editor Workbench Template</h2>
      <EditorWorkbenchTemplate
        document-title="Bateladas Operations Report"
        document-subtitle="Enterprise editor shell with menus, command bars and report design canvas."
        :topbar-actions="editorTopbarActions"
        :quick-actions="editorQuickActions"
        :zoom-options="[50, 75, 100, 125, 150]"
        :zoom-value="editorZoomValue"
        :widget-sections="editorWidgetSections"
        :selected-widget-id="editorSelectedWidgetId"
        :canvas-columns="editorCanvasColumns"
        :canvas-objects="editorCanvasObjects"
        :rail-actions="editorRailActions"
        :left-status-segments="editorLeftStatusSegments"
        :right-status-segments="editorRightStatusSegments"
        @update:selected-widget-id="editorSelectedWidgetId = $event"
        @update:zoom-value="editorZoomValue = $event"
      />
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="enterprise"
    >
      <h2>Enterprise Feature Templates</h2>
      <EnterpriseCommandCenterTemplate
        :actions="enterpriseActions"
        :filters="enterpriseFilters"
        :kpis="enterpriseKpis"
        :alerts="enterpriseAlerts"
        :activities="enterpriseActivities"
        :services="enterpriseServices"
        :search-value="enterpriseSearchValue"
        :active-filter-id="enterpriseActiveFilterId"
        @update:search-value="enterpriseSearchValue = $event"
        @update:active-filter-id="enterpriseActiveFilterId = $event"
      />

      <div class="ntk-template-showcase__two-column">
        <ApprovalQueueTemplate
          :items="approvalItems"
          :selected-ids="approvalSelectedIds"
          :search-value="approvalSearchValue"
          :active-filter-id="approvalActiveFilterId"
          @update:selected-ids="approvalSelectedIds = $event"
          @update:search-value="approvalSearchValue = $event"
          @update:active-filter-id="approvalActiveFilterId = $event"
        />
        <AuditTimelineTemplate
          :events="auditEvents"
          :search-value="auditSearchValue"
          :active-filter-id="auditActiveFilterId"
          @update:search-value="auditSearchValue = $event"
          @update:active-filter-id="auditActiveFilterId = $event"
        />
      </div>
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="wiki"
    >
      <h2>Knowledge Base and Assistant Templates</h2>
      <WikiTemplate
        :categories="wikiCategories"
        :documents="wikiDocuments"
        :stat-chips="wikiStatChips"
      />
      <WikiChatTemplate
        :conversations="wikiConversations"
        :messages="wikiMessages"
        :active-conversation-id="activeConversationId"
        :show-delete-conversation-action="false"
        @update:active-conversation-id="activeConversationId = $event"
      />
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="reference-system"
    >
      <h2>Reference System Templates</h2>
      <div
        class="ntk-template-showcase__reference-shell"
        :style="referenceShowcaseStyleVars"
      >
        <ReferenceWorkspaceComposer
          mode="both"
          :report-groups="referenceSampleReportGroups"
          :selected-preset="referenceShowcasePreset"
          :search-value="referenceShowcaseSearchValue"
          :active-report-id="referenceShowcaseActiveReportId"
          :manager-stats="referenceSampleManagerConfig.stats"
          :manager-quick-actions="referenceSampleManagerConfig.quickActions"
          :document-tabs="referenceSampleDocumentTabs"
          :active-document-tab-id="referenceShowcaseActiveDocumentTabId"
          :designer-topbar-actions="referenceSampleDesignerConfig.topbarActions"
          :designer-quick-actions="referenceSampleDesignerConfig.quickActions"
          :widget-sections="referenceSampleDesignerConfig.widgetSections"
          :canvas-columns="referenceSampleDesignerConfig.canvasColumns"
          :canvas-objects="referenceSampleDesignerConfig.canvasObjects"
          :rail-actions="referenceSampleDesignerConfig.railActions"
          :left-status-segments="referenceSampleDesignerConfig.leftStatusSegments"
          :right-status-segments="referenceSampleDesignerConfig.rightStatusSegments"
          :zoom-options="referenceSampleDesignerConfig.zoomOptions"
          :zoom-value="referenceShowcaseZoomValue"
          @update:search-value="referenceShowcaseSearchValue = $event"
          @update:active-report-id="referenceShowcaseActiveReportId = $event"
          @report-select="referenceShowcaseActiveReportId = $event"
          @update:active-document-tab-id="referenceShowcaseActiveDocumentTabId = $event"
          @update:zoom-value="referenceShowcaseZoomValue = $event"
        />
      </div>
    </section>

    <section
      class="ntk-template-showcase__surface"
      data-template-surface="cms-authoring"
    >
      <h2>CMS Authoring Workspace Templates</h2>
      <p class="ntk-template-showcase__surface-note">
        Module surfaces (Settings, Blocks, Media, Pages, Releases) are orchestrated by CmsApp.vue.
        The workbench shell below is the reusable template that composes them.
      </p>
      <CmsAuthoringWorkbench>
        <template #header>
          <div class="ntk-template-showcase__cms-header">
            <span class="ntk-template-showcase__cms-module-badge">Settings</span>
            <span class="ntk-template-showcase__cms-module-badge">Blocks</span>
            <span class="ntk-template-showcase__cms-module-badge">Media</span>
            <span class="ntk-template-showcase__cms-module-badge">Pages</span>
            <span class="ntk-template-showcase__cms-module-badge">Releases</span>
          </div>
        </template>
        <template #workbench>
          <div class="ntk-template-showcase__cms-canvas">
            <p>CMS module surfaces mount here. Each surface is an independently reusable template extracted from the authoring monolith.</p>
            <div class="ntk-template-showcase__cms-surface-grid">
              <div
                v-for="surface in cmsSurfaces"
                :key="surface.id"
                class="ntk-template-showcase__cms-surface-card"
              >
                <strong>{{ surface.title }}</strong>
                <span>{{ surface.path }}</span>
              </div>
            </div>
          </div>
        </template>
        <template #status>
          <span class="ntk-template-showcase__cms-status">{{ cmsSurfaces.length }} module surfaces · ready</span>
        </template>
      </CmsAuthoringWorkbench>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { TEMPLATE_AREAS, getTemplateCatalogByArea, templateCatalogRegistry } from '../src/templates'
import { ApprovalQueueTemplate, AuditTimelineTemplate, EnterpriseCommandCenterTemplate } from '../src/templates/features/enterprise'
import CmsAuthoringWorkbench from '../src/templates/features/cms/authoring/CmsAuthoringWorkbench.vue'
import {
  ReferenceWorkspaceComposer,
  referenceSampleDesignerConfig,
  referenceSampleDocumentTabs,
  referenceSampleManagerConfig,
  referenceSampleReportGroups,
  useReferenceWorkspaceHost,
} from '../src/templates/features/reference-system'
import LoginTemplate from '../src/templates/features/auth/LoginTemplate.vue'
import WikiChatTemplate from '../src/templates/features/wiki/WikiChatTemplate.vue'
import WikiTemplate from '../src/templates/features/wiki/WikiTemplate.vue'
import AuthLayoutTemplate from '../src/templates/layouts/AuthLayoutTemplate.vue'
import MainLayoutTemplate from '../src/templates/layouts/MainLayoutTemplate.vue'
import DashboardTemplate from '../src/templates/pages/dashboard/DashboardTemplate.vue'
import DashboardWorkspaceTemplate from '../src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue'
import CrudListTemplate from '../src/templates/pages/crud/CrudListTemplate.vue'
import EditorWorkbenchTemplate from '../src/templates/pages/editor/EditorWorkbenchTemplate.vue'
import PlaceholderTemplate from '../src/templates/pages/system/PlaceholderTemplate.vue'
import ProfileTemplate from '../src/templates/pages/account/ProfileTemplate.vue'

const loginEmail = ref('operations@nettoolskit.dev')
const loginPassword = ref('TemplatePass!2026')

const workspaceSearchValue = ref('')
const workspaceActiveFilterId = ref('all')
const workspaceActiveViewId = ref('overview')

const crudSearchValue = ref('')
const crudActiveFilterId = ref('all')
const crudViewMode = ref<'table' | 'cards'>('table')
const crudSelectedIds = ref<string[]>(['tenant-acme'])

const enterpriseSearchValue = ref('')
const enterpriseActiveFilterId = ref('all')

const approvalSearchValue = ref('')
const approvalActiveFilterId = ref('all')
const approvalSelectedIds = ref<string[]>(['req-200'])

const auditSearchValue = ref('')
const auditActiveFilterId = ref('all')

const activeConversationId = ref<string | null>('conversation-release')
const editorSelectedWidgetId = ref<string | null>('widget-text')
const editorZoomValue = ref(100)
const {
  activeDocumentTabId: referenceShowcaseActiveDocumentTabId,
  activeReportId: referenceShowcaseActiveReportId,
  searchValue: referenceShowcaseSearchValue,
  selectedPreset: referenceShowcasePreset,
  whitelabelStyleVars: referenceShowcaseStyleVars,
  zoomValue: referenceShowcaseZoomValue,
} = useReferenceWorkspaceHost({
  initialReportId: referenceSampleReportGroups[0]?.items[0]?.id ?? '',
  initialDocumentTabId: referenceSampleDocumentTabs[0]?.id ?? 'layout',
  initialZoomValue: referenceSampleDesignerConfig.zoomOptions[2] ?? 100,
  initialPresetId: 'reference-light',
  persistPreset: false,
})

const templatesByArea = computed(() => {
  return TEMPLATE_AREAS.map(area => ({
    area,
    count: getTemplateCatalogByArea(area).length,
  }))
})

const readyTemplateCount = computed(() => {
  return templateCatalogRegistry.filter(entry => entry.status === 'ready').length
})

const dashboardChips = [
  { id: 'chip-release', text: 'Release ready', icon: 'task_alt' },
  { id: 'chip-template', text: 'Template-first', icon: 'layers' },
]

const dashboardMetrics = [
  { id: 'metric-users', label: 'Active users', value: '2.4k', icon: 'groups', tone: 'info' as const },
  { id: 'metric-sla', label: 'SLA', value: '99.95%', icon: 'speed', tone: 'success' as const },
  { id: 'metric-risk', label: 'Open risks', value: 3, icon: 'warning', tone: 'warning' as const },
  { id: 'metric-tickets', label: 'Critical incidents', value: 1, icon: 'priority_high', tone: 'danger' as const },
]

const dashboardActivities = [
  { id: 'activity-1', label: 'Deployments today', value: 9, icon: 'rocket_launch' },
  { id: 'activity-2', label: 'Approvals pending', value: 4, icon: 'approval' },
  { id: 'activity-3', label: 'Docs updated', value: 12, icon: 'description' },
]

const dashboardTopItems = [
  { id: 'top-1', name: 'CMS authoring shell', value: 'Healthy', secondaryValue: '1 issue', barPercent: 92 },
  { id: 'top-2', name: 'Template catalog', value: 'Stable', secondaryValue: '26 entries', barPercent: 78 },
  { id: 'top-3', name: 'Release validation', value: 'Passing', secondaryValue: '5 gates', barPercent: 55 },
]

const loginFeatures = [
  { id: 'lf-1', text: 'Enterprise SSO compatible', icon: 'shield' },
  { id: 'lf-2', text: 'Multi-tenant policy aware', icon: 'business' },
  { id: 'lf-3', text: 'Audit-friendly access logs', icon: 'history' },
]

const workspaceActions = [
  { id: 'refresh', label: 'Refresh', icon: 'refresh' },
  { id: 'export', label: 'Export view', icon: 'download', outline: true, unelevated: false },
]

const workspaceFilters = [
  { id: 'all', label: 'All', count: 7 },
  { id: 'urgent', label: 'Urgent', count: 2 },
  { id: 'review', label: 'Review', count: 3 },
]

const workspaceViews = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'pipeline', label: 'Pipeline', icon: 'view_kanban' },
]

const workspaceMetrics = [
  { id: 'wm-1', label: 'Tasks in progress', value: 18, delta: '+4', icon: 'task', tone: 'info' as const },
  { id: 'wm-2', label: 'Approvals due today', value: 6, delta: '-1', icon: 'schedule', tone: 'warning' as const },
  { id: 'wm-3', label: 'Release blockers', value: 1, delta: 'stable', icon: 'error', tone: 'danger' as const },
]

const workspacePanels = [
  { id: 'panel-risk', title: 'Risk register', value: 5, description: 'Open operational risks', icon: 'report_problem', tone: 'warning' as const },
  { id: 'panel-change', title: 'Change requests', value: 14, description: 'Ready for triage', icon: 'swap_horiz', tone: 'info' as const },
  { id: 'panel-compliance', title: 'Compliance checks', value: '98%', description: 'This week pass rate', icon: 'verified', tone: 'success' as const },
]

const workspaceLanes = [
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
]

const crudColumns = [
  { id: 'tenant', label: 'Tenant', emphasize: true },
  { id: 'owner', label: 'Owner' },
  { id: 'region', label: 'Region' },
]

const crudRecords = [
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
]

const crudFilters = [
  { id: 'all', label: 'All', count: 3 },
  { id: 'active', label: 'Active', count: 1 },
  { id: 'review', label: 'Review', count: 1 },
  { id: 'pending', label: 'Pending', count: 1 },
]

const crudMetrics = [
  { id: 'cm-1', label: 'Active tenants', value: 1, icon: 'apartment', tone: 'success' as const },
  { id: 'cm-2', label: 'Pending actions', value: 2, icon: 'pending_actions', tone: 'warning' as const },
]

const crudRowActions = [
  { id: 'edit', icon: 'edit', ariaLabel: 'Edit record' },
  { id: 'open', icon: 'visibility', ariaLabel: 'Open record' },
]

const crudBulkActions = [
  { id: 'archive', label: 'Archive selected', icon: 'archive' },
]

const profile = {
  name: 'Template Owner',
  email: 'owner@nettoolskit.dev',
  role: 'Platform Manager',
  initials: 'TO',
}

const profileGroups = [
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
]

const placeholderHints = [
  { id: 'hint-1', text: 'Template contracts are already in place.', icon: 'check_circle' },
  { id: 'hint-2', text: 'Use scaffolding templates for fast route and store bootstrap.', icon: 'bolt' },
]

const placeholderPrimaryAction = { id: 'primary-open', label: 'Open planning board', icon: 'open_in_new' }
const placeholderSecondaryAction = { id: 'secondary-docs', label: 'Read template docs', icon: 'description', outline: true, unelevated: false }

const editorTopbarActions = [
  { id: 'new', icon: 'note_add', ariaLabel: 'New file' },
  { id: 'open', icon: 'folder_open', ariaLabel: 'Open file' },
  { id: 'save', icon: 'save', ariaLabel: 'Save file' },
  { id: 'cut', icon: 'content_cut', ariaLabel: 'Cut' },
  { id: 'copy', icon: 'content_copy', ariaLabel: 'Copy' },
  { id: 'delete', icon: 'delete', ariaLabel: 'Delete' },
]

const editorQuickActions = [
  { id: 'undo', icon: 'undo', ariaLabel: 'Undo' },
  { id: 'redo', icon: 'redo', ariaLabel: 'Redo' },
  { id: 'duplicate', icon: 'content_copy', ariaLabel: 'Duplicate' },
]

const editorWidgetSections = [
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
]

const editorCanvasColumns = [
  'DATE',
  'ORDER #',
  'TYPE',
  'CLIENT',
  'OPERATOR',
  'PRODUCT',
  'QUANTITY',
]

const editorCanvasObjects = [
  { id: 'obj-logo', label: 'Brand logo', subtitle: 'Image block', x: 46, y: 52, width: 182, height: 102, locked: true },
  { id: 'obj-title', label: 'BATELADAS', subtitle: 'Main report title', x: 498, y: 54, width: 340, height: 86, tone: 'info' as const },
  { id: 'obj-header', label: 'Header row', subtitle: 'Bound dataset fields', x: 42, y: 184, width: 1200, height: 118, tone: 'primary' as const },
  { id: 'obj-metrics', label: 'KPI strip', subtitle: 'Operational icons and status', x: 42, y: 340, width: 820, height: 82, tone: 'warning' as const },
  { id: 'obj-footer', label: 'Footer line', subtitle: 'System ownership and disclaimers', x: 42, y: 444, width: 1200, height: 66 },
]

const editorRailActions = [
  { id: 'properties', icon: 'tune', ariaLabel: 'Properties' },
  { id: 'layers', icon: 'layers', ariaLabel: 'Layers' },
  { id: 'filters', icon: 'filter_list', ariaLabel: 'Filters' },
  { id: 'data', icon: 'dataset', ariaLabel: 'Data source' },
  { id: 'settings', icon: 'settings', ariaLabel: 'Settings' },
]

const editorLeftStatusSegments = [
  { id: 'row-groups', label: 'Row groups', value: 3 },
  { id: 'warnings', label: 'Warnings', value: 2, tone: 'warning' as const },
]

const editorRightStatusSegments = [
  { id: 'column-groups', label: 'Column groups', value: 4, tone: 'info' as const },
  { id: 'snap', label: 'Snap', value: 'On', tone: 'success' as const },
]

const enterpriseActions = [
  { id: 'refresh', label: 'Refresh', icon: 'refresh' },
  { id: 'ack-all', label: 'Acknowledge all', icon: 'done_all', outline: true, unelevated: false },
]

const enterpriseFilters = [
  { id: 'all', label: 'All', count: 6 },
  { id: 'critical', label: 'Critical', count: 2 },
  { id: 'warning', label: 'Warning', count: 2 },
]

const enterpriseKpis = [
  { id: 'ek-1', label: 'Global uptime', value: '99.95%', delta: '+0.03%', icon: 'monitor_heart', tone: 'success' as const },
  { id: 'ek-2', label: 'Incidents', value: 3, delta: '-1', icon: 'notification_important', tone: 'warning' as const },
  { id: 'ek-3', label: 'Approvals pending', value: 8, delta: '+2', icon: 'fact_check', tone: 'info' as const },
]

const enterpriseAlerts = [
  { id: 'ea-1', title: 'API latency increased', summary: 'P95 above SLA for 8 minutes.', service: 'Public API', timeLabel: '08:41', severity: 'danger' as const, filterKeys: ['critical'] },
  { id: 'ea-2', title: 'Queue backlog warning', summary: 'Approval queue processing delayed.', service: 'Workflow Engine', timeLabel: '08:55', severity: 'warning' as const, filterKeys: ['warning'] },
]

const enterpriseActivities = [
  { id: 'ev-1', title: 'Deployment approved', description: 'Template rollout for region EU-West.', owner: 'Release board', timeLabel: '08:12', filterKeys: ['all'] },
  { id: 'ev-2', title: 'Incident triage complete', description: 'On-call team archived resolved alert.', owner: 'SRE team', timeLabel: '08:47', filterKeys: ['critical'] },
]

const enterpriseServices = [
  { id: 'service-1', name: 'Reference + CMS API', uptime: '99.97%', sla: '99.90%', owner: 'Platform', filterKeys: ['all'] },
  { id: 'service-2', name: 'Workflow Engine', uptime: '99.89%', sla: '99.90%', owner: 'Operations', filterKeys: ['warning'] },
  { id: 'service-3', name: 'Notification Bus', uptime: '99.99%', sla: '99.90%', owner: 'Messaging', filterKeys: ['critical'] },
]

const approvalItems = [
  { id: 'req-200', title: 'Quarterly budget adjustment', summary: 'Increase cloud reserve by 12%.', requester: 'Finance', submittedAt: '2026-03-25', amount: '$38,000', statusLabel: 'Pending', tone: 'warning' as const, tags: ['budget', 'q2'], filterKeys: ['pending', 'urgent'] },
  { id: 'req-201', title: 'Vendor onboarding', summary: 'Security review complete, waiting final approval.', requester: 'Procurement', submittedAt: '2026-03-24', amount: '$9,500', statusLabel: 'Pending', tone: 'info' as const, tags: ['vendor'], filterKeys: ['pending'] },
]

const auditEvents = [
  { id: 'audit-1', title: 'Policy updated', description: 'Access policy switched to template baseline.', actor: 'Platform Admin', target: 'Identity policy', eventType: 'security', timestamp: '2026-03-26 08:15', tone: 'info' as const, filterKeys: ['security'] },
  { id: 'audit-2', title: 'Release published', description: 'Template pack promoted to production.', actor: 'Release Bot', target: 'Template registry', eventType: 'release', timestamp: '2026-03-26 09:02', tone: 'success' as const, filterKeys: ['release'] },
  { id: 'audit-3', title: 'Approval rejected', description: 'Budget increase requires new justification.', actor: 'Finance Lead', target: 'Request req-200', eventType: 'governance', timestamp: '2026-03-26 09:20', tone: 'warning' as const, filterKeys: ['governance'] },
]

const wikiCategories = [
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
]

const wikiDocuments = [
  { id: 'doc-1', name: 'Incident triage handbook', category: 'Runbooks', categoryId: 'runbooks', subCategory: 'Incident Response', subCategoryId: 'incident', tags: ['on-call', 'severity'], status: 'processed' as const, uploadDate: '2026-03-24' },
  { id: 'doc-2', name: 'Release checklist', category: 'Runbooks', categoryId: 'runbooks', subCategory: 'Release Management', subCategoryId: 'release', tags: ['release'], status: 'processed' as const, uploadDate: '2026-03-25' },
  { id: 'doc-3', name: 'Template governance policy', category: 'Governance', categoryId: 'governance', subCategory: 'Policy Baselines', subCategoryId: 'policy', tags: ['policy'], status: 'pending' as const, uploadDate: '2026-03-22' },
]

const wikiStatChips = [
  { id: 'ws-1', label: 'documents', value: 3, icon: 'description', tone: 'info' as const },
  { id: 'ws-2', label: 'processed', value: 2, icon: 'check_circle', tone: 'success' as const },
  { id: 'ws-3', label: 'pending', value: 1, icon: 'schedule', tone: 'warning' as const },
]

const wikiConversations = [
  { id: 'conversation-release', title: 'Release quality checks', updatedAt: '09:12', messageCount: 4 },
  { id: 'conversation-policy', title: 'Policy rollouts', updatedAt: '08:30', messageCount: 2 },
]

const wikiMessages = [
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
]

const cmsSurfaces = [
  { id: 'settings', title: 'CmsSettingsModuleSurface', path: 'authoring/modules/CmsSettingsModuleSurface.vue' },
  { id: 'blocks', title: 'CmsBlocksModuleSurface', path: 'authoring/modules/CmsBlocksModuleSurface.vue' },
  { id: 'media', title: 'CmsMediaModuleSurface', path: 'authoring/modules/CmsMediaModuleSurface.vue' },
  { id: 'pages', title: 'CmsPagesModuleSurface', path: 'authoring/modules/CmsPagesModuleSurface.vue' },
  { id: 'pages-preview', title: 'CmsPagesPreviewSurface', path: 'authoring/modules/CmsPagesPreviewSurface.vue' },
  { id: 'releases', title: 'CmsReleasesModuleSurface', path: 'authoring/modules/CmsReleasesModuleSurface.vue' },
]

function handleLoginSubmit(): void {
  // Showcase mode keeps auth actions no-op to preserve deterministic visual baselines.
}
</script>

<style scoped lang="scss">
.ntk-template-showcase {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background:
    radial-gradient(circle at 12% 8%, rgba(59, 130, 246, 0.18), transparent 42%),
    radial-gradient(circle at 88% 22%, rgba(14, 165, 233, 0.12), transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
}

.ntk-template-showcase__hero {
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(5px);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.ntk-template-showcase__kicker {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #1e40af;
}

.ntk-template-showcase__title {
  margin: 6px 0 0;
  font-size: clamp(28px, 4vw, 38px);
  line-height: 1.1;
  color: #0f172a;
}

.ntk-template-showcase__subtitle {
  margin: 10px 0 0;
  max-width: 760px;
  color: #334155;
}

.ntk-template-showcase__stats {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.ntk-template-showcase__stat {
  min-width: 140px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #eff6ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 12px;
}

.ntk-template-showcase__stat span {
  font-size: 12px;
  color: #1e3a8a;
}

.ntk-template-showcase__stat strong {
  font-size: 24px;
  color: #0f172a;
}

.ntk-template-showcase__catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.ntk-template-showcase__catalog-card {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.86);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ntk-template-showcase__catalog-card strong {
  text-transform: capitalize;
  color: #0f172a;
}

.ntk-template-showcase__catalog-card span {
  color: #475569;
  font-size: 12px;
}

.ntk-template-showcase__surface {
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ntk-template-showcase__surface > h2 {
  margin: 0;
  font-size: 16px;
  color: #0f172a;
}

.ntk-template-showcase__auth-shell {
  min-height: 620px;
}

.ntk-template-showcase__two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ntk-template-showcase__reference-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 18px;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .ntk-template-showcase__hero {
    flex-direction: column;
  }

  .ntk-template-showcase__stats {
    width: 100%;
  }
}

.ntk-template-showcase__surface-note {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.ntk-template-showcase__cms-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
}

.ntk-template-showcase__cms-module-badge {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #f8fafc;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
}

.ntk-template-showcase__cms-canvas {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #475569;
  font-size: 13px;
}

.ntk-template-showcase__cms-surface-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}

.ntk-template-showcase__cms-surface-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ntk-template-showcase__cms-surface-card strong {
  font-size: 13px;
  color: #0f172a;
}

.ntk-template-showcase__cms-surface-card span {
  font-size: 11px;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
}

.ntk-template-showcase__cms-status {
  font-size: 12px;
  color: #64748b;
  padding: 0 8px;
}

@media (max-width: 980px) {
  .ntk-template-showcase {
    padding: 12px;
  }

  .ntk-template-showcase__two-column {
    grid-template-columns: 1fr;
  }
}
</style>