import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

function readRepoFile(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')
}

describe('template white-label audit', () => {
  it('keeps audited reference-system and cms files free from previously identified hardcoded colors', () => {
    const auditedFiles = [
      {
        label: 'ReferenceReportStatusBadge',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceReportStatusBadge.vue'),
        forbiddenSnippets: [
          'background: #fff7ed;',
          'color: #c2410c;',
          'background: #eff6ff;',
          'color: #1d4ed8;',
          'background: #ecfdf5;',
          'color: #047857;',
        ],
      },
      {
        label: 'ReferenceContextRailPanel',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceContextRailPanel.vue'),
        forbiddenSnippets: [
          '&--positive { background: #10b981;',
          '&--warning { background: #f59e0b;',
          '&--negative { background: #ef4444;',
          '&--info { background: #3b82f6;',
          '&--neutral { background: #94a3b8;',
        ],
      },
      {
        label: 'CmsMediaAssetPicker',
        source: readRepoFile('../../../src/templates/features/cms/authoring/CmsMediaAssetPicker.vue'),
        forbiddenSnippets: [
          'color="negative"',
          'text-color="white"',
          'color: #6b7280;',
          'border: 1px solid rgba(148, 163, 184, 0.24);',
          'background: rgba(15, 23, 42, 0.04);',
          'background: rgba(15, 23, 42, 0.06);',
        ],
      },
      {
        label: 'Template runtime chat fab icon',
        source: readRepoFile('../../../src/templates/runtime/router.ts'),
        forbiddenSnippets: [
          'color:#fff',
        ],
      },
      {
        label: 'Reference app bridge',
        source: readRepoFile('../../../src/templates/styles/reference-app-bridge.scss'),
        forbiddenSnippets: [
          '--ntk-template-layout-horizontal-bg: linear-gradient(90deg, #1f2937 0%, #334155 100%);',
          '--ntk-template-layout-drawer-bg: var(--ntk-drawer-bg, linear-gradient(180deg, #1f2937 0%, #334155 100%));',
          '--ntk-template-login-brand-bg: linear-gradient(160deg, #0f172a 0%, #1e293b 45%, #164e63 100%);',
          '--ntk-template-placeholder-bg: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);',
          '--ntk-template-profile-avatar-bg: linear-gradient(135deg, #334155 0%, #1e293b 100%);',
          '--ntk-template-not-found-bg: radial-gradient(circle at top, #0f172a 0%, #1e3a8a 45%, #172554 100%);',
        ],
      },
      {
        label: 'LoginTemplate',
        source: readRepoFile('../../../src/templates/features/auth/LoginTemplate.vue'),
        forbiddenSnippets: [
          'color="grey-7"',
          'linear-gradient(160deg, #0f172a 0%, #1e293b 45%, #164e63 100%)',
          'rgba(14, 165, 233, 0.16)',
          'rgba(20, 184, 166, 0.18)',
        ],
      },
      {
        label: 'PlaceholderTemplate',
        source: readRepoFile('../../../src/templates/pages/system/PlaceholderTemplate.vue'),
        forbiddenSnippets: [
          'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
          'rgba(59, 130, 246, 0.14)',
          'rgba(37, 99, 235, 0.12)',
        ],
      },
      {
        label: 'ErrorNotFoundTemplate',
        source: readRepoFile('../../../src/templates/pages/system/ErrorNotFoundTemplate.vue'),
        forbiddenSnippets: [
          'radial-gradient(circle at top, #0f172a 0%, #1e3a8a 45%, #172554 100%)',
          '#93c5fd',
          '#e2e8f0',
        ],
      },
      {
        label: 'WikiChatDrawerTemplate',
        source: readRepoFile('../../../src/templates/features/wiki/WikiChatDrawerTemplate.vue'),
        forbiddenSnippets: [
          'background: #ffffff;',
          'box-shadow: 0 18px 32px rgba(15, 23, 42, 0.15);',
          'background: linear-gradient(135deg, #1e293b 0%, #334155 100%);',
          'background: #0f766e;',
          'color: #ffffff;',
        ],
      },
      {
        label: 'WikiChatTemplate',
        source: readRepoFile('../../../src/templates/features/wiki/WikiChatTemplate.vue'),
        forbiddenSnippets: [
          'background: #ffffff;',
          'outline: 2px solid #0f766e;',
          'background: rgba(15, 118, 110, 0.1);',
          'background: #1e293b;',
          'background: #0f766e;',
        ],
      },
      {
        label: 'MainLayoutTemplate',
        source: readRepoFile('../../../src/templates/layouts/MainLayoutTemplate.vue'),
        forbiddenSnippets: [
          '--ntk-template-layout-nav-surface-start, #1e293b',
          '--ntk-template-layout-nav-surface-end, #334155',
          '--ntk-template-layout-horizontal-text, #ffffff',
          '--ntk-template-layout-nav-active-border: var(--ntk-primary, #10b981);',
        ],
      },
      {
        label: 'MenuLinkTemplate',
        source: readRepoFile('../../../src/templates/navigation/MenuLinkTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-layout-nav-active-border, var(--ntk-primary, #10b981))',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'var(--ntk-template-layout-nav-active-text, #ffffff)',
          'background: var(--ntk-primary, #10b981) !important;',
        ],
      },
      {
        label: 'HorizontalMenuLinkTemplate',
        source: readRepoFile('../../../src/templates/navigation/HorizontalMenuLinkTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-layout-horizontal-text, var(--ntk-text-on-dark, #ffffff))',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'var(--ntk-primary, #10b981)',
        ],
      },
      {
        label: 'RuntimeSettingsSurface',
        source: readRepoFile('../../../src/templates/runtime/RuntimeSettingsSurface.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-page-bg, #f8fafc)',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'var(--ntk-template-page-border, #e2e8f0)',
          'var(--ntk-template-page-title, #1e293b)',
        ],
      },
      {
        label: 'DashboardTemplate',
        source: readRepoFile('../../../src/templates/pages/dashboard/DashboardTemplate.vue'),
        forbiddenSnippets: [
          'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
          'linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)',
          'var(--ntk-template-page-accent-value, #10b981)',
          'var(--ntk-error, #ef4444)',
        ],
      },
      {
        label: 'WikiTemplate',
        source: readRepoFile('../../../src/templates/features/wiki/WikiTemplate.vue'),
        forbiddenSnippets: [
          '#e2e8f0',
          '#ffffff',
          'rgba(',
          '#0f766e',
        ],
      },
      {
        label: 'CrudListTemplate',
        source: readRepoFile('../../../src/templates/pages/crud/CrudListTemplate.vue'),
        forbiddenSnippets: [
          '#e2e8f0',
          '#ffffff',
          'rgba(',
          '#10b981',
        ],
      },
      {
        label: 'DashboardWorkspaceTemplate',
        source: readRepoFile('../../../src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-page-bg, #f8fafc)',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'var(--ntk-template-page-border, #e2e8f0)',
          'var(--ntk-template-page-title, #1e293b)',
          'var(--ntk-template-page-subtitle, #64748b)',
          'var(--ntk-template-page-chip-bg, #f1f5f9)',
          'var(--ntk-template-page-chip-text, #475569)',
        ],
      },
      {
        label: 'EnterpriseCommandCenterTemplate',
        source: readRepoFile('../../../src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue'),
        forbiddenSnippets: [
          ':color="action.color || \'primary\'"',
          'var(--ntk-template-page-bg, #f8fafc)',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'var(--ntk-template-page-border, #e2e8f0)',
          'var(--ntk-template-page-subtitle, #64748b)',
          'var(--ntk-primary, #512bd4)',
          'color-mix(in srgb, var(--ntk-primary, #512bd4) 5%, white)',
        ],
      },
      {
        label: 'ApprovalQueueTemplate',
        source: readRepoFile('../../../src/templates/features/enterprise/ApprovalQueueTemplate.vue'),
        forbiddenSnippets: [
          ':color="action.color || \'primary\'"',
          'color="positive"',
          'color="warning"',
          'color="negative"',
          'var(--ntk-template-page-bg, #f8fafc)',
          'var(--semantic-info-primary, #3b82f6)',
          'var(--semantic-success-primary, #22c55e)',
          'var(--semantic-warning-primary, #f59e0b)',
          'var(--semantic-error-primary, #ef4444)',
          'white)',
        ],
      },
      {
        label: 'AuditTimelineTemplate',
        source: readRepoFile('../../../src/templates/features/enterprise/AuditTimelineTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-page-bg, #f8fafc)',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'var(--ntk-template-page-border, #e2e8f0)',
          'var(--ntk-template-page-subtitle, #64748b)',
          'var(--ntk-primary, #512bd4)',
          'rgba(0, 0, 0, 0.1)',
          'var(--semantic-info-primary, #3b82f6)',
          'var(--semantic-success-primary, #22c55e)',
          'var(--semantic-warning-primary, #f59e0b)',
          'var(--semantic-error-primary, #ef4444)',
        ],
      },
      {
        label: 'ReferenceCatalogTemplate',
        source: readRepoFile('../../../src/templates/features/reference-system/ReferenceCatalogTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-reference-accent, #10b981)',
          'var(--ntk-primary-light, #5eead4)',
          'var(--ntk-reference-shell-chrome-border, rgba(148, 163, 184, 0.16))',
          'var(--ntk-reference-shell-chrome-bg, #ffffff)',
          'var(--ntk-reference-shell-glow, 0 18px 36px rgba(15, 23, 42, 0.08))',
          'var(--ntk-reference-panel-muted-bg, #f8fbff)',
          'var(--ntk-reference-badge-bg, rgba(16, 185, 129, 0.12))',
          'var(--ntk-reference-badge-text, #10b981)',
          'var(--ntk-reference-border, #dbe4f0)',
        ],
      },
      {
        label: 'UserMenuTemplate',
        source: readRepoFile('../../../src/templates/navigation/UserMenuTemplate.vue'),
        forbiddenSnippets: [
          'color="primary"',
          'var(--ntk-template-user-menu-border, rgba(148, 163, 184, 0.18))',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'var(--ntk-template-user-menu-shadow, 0 4px 20px rgba(0, 0, 0, 0.15))',
          'var(--ntk-template-user-menu-text, #0f172a)',
          'var(--ntk-template-user-menu-avatar-border, #ffffff)',
          'var(--ntk-template-user-menu-avatar-bg, var(--ntk-avatar-bg, #64748b))',
          'var(--ntk-template-user-menu-avatar-color, #ffffff)',
          'var(--ntk-template-user-menu-header-bg, rgba(0, 0, 0, 0.02))',
          'var(--ntk-template-user-menu-muted, #64748b)',
        ],
      },
      {
        label: 'ReferenceDocumentNavigatorPanel',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceDocumentNavigatorPanel.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-editor-panel-bg, #f3f4f6)',
          'var(--ntk-template-editor-toolbar-bg, #f8f9fb)',
          'var(--ntk-template-editor-border, #d1d5db)',
          'var(--ntk-template-editor-commandbar-bg, #ffffff)',
          'var(--ntk-template-editor-muted-text, #6b7280)',
          'var(--ntk-template-editor-muted-text, #9ca3af)',
          'var(--ntk-template-editor-button-hover-bg, #e5e7eb)',
          'var(--ntk-template-editor-accent-bg, #eff6ff)',
          'var(--ntk-template-editor-accent, #2563eb)',
          'var(--ntk-template-editor-info, #0284c7)',
          'var(--ntk-template-editor-warning, #d97706)',
        ],
      },
      {
        label: 'EditorWorkbenchTemplate',
        source: readRepoFile('../../../src/templates/pages/editor/EditorWorkbenchTemplate.vue'),
        forbiddenSnippets: [
          'color="primary"',
          'var(--ntk-template-editor-bg, #eef0f4)',
          'var(--ntk-template-editor-text, #1f2937)',
          'var(--ntk-template-editor-border, #d1d5db)',
          'rgba(15, 23, 42, 0.08)',
          'var(--ntk-template-editor-toolbar-bg, #f8f9fb)',
          'var(--ntk-template-editor-button-bg, #ffffff)',
          'var(--ntk-template-editor-button-text, #374151)',
          'var(--ntk-template-editor-accent-soft, #dbeafe)',
          'var(--ntk-template-editor-accent, #1e3a8a)',
          'var(--ntk-template-editor-stage-grid, rgba(148, 163, 184, 0.2))',
          'var(--ntk-template-editor-canvas-object-bg, rgba(255, 255, 255, 0.92))',
          'var(--ntk-template-editor-warning, #f59e0b)',
          'var(--ntk-template-editor-info, #0ea5e9)',
          'var(--ntk-template-editor-success, #22c55e)',
          'background: #ffffff;',
        ],
      },
      {
        label: 'ReferenceTopbarActions',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceTopbarActions.vue'),
        forbiddenSnippets: [
          ":color=\"notif.read ? 'grey-5' : 'primary'\"",
          'color-mix(in srgb, var(--ntk-reference-topbar-control-bg, #f1f5f9) 92%, transparent)',
          'var(--ntk-reference-topbar-control-text, #0f172a)',
          'var(--ntk-reference-topbar-control-border, #e2e8f0)',
          'var(--ntk-reference-topbar-control-muted, #94a3b8)',
          'var(--ntk-accent, #10b981)',
          'var(--ntk-reference-topbar-surface, #ffffff)',
          'rgba(15, 23, 42, 0.08)',
        ],
      },
      {
        label: 'ReferenceReportCatalogPanel',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceReportCatalogPanel.vue'),
        forbiddenSnippets: [
          'var(--ntk-reference-border, #dbe4f0)',
          'var(--ntk-reference-panel-bg, #ffffff)',
          'rgba(15, 23, 42, 0.06)',
          'var(--ntk-text-primary, #0f172a)',
          'var(--ntk-text-secondary, #64748b)',
          'var(--ntk-reference-badge-bg, #eff6ff)',
          'var(--ntk-reference-badge-text, #1d4ed8)',
          'var(--ntk-reference-panel-muted-bg, #f8fbff)',
          'var(--ntk-reference-accent, #2563eb)',
        ],
      },
      {
        label: 'ReferenceCatalogPreviewSurface',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceCatalogPreviewSurface.vue'),
        forbiddenSnippets: [
          'var(--ntk-reference-shell-chrome-border, rgba(148, 163, 184, 0.16))',
          'var(--ntk-reference-shell-chrome-bg, rgba(255, 255, 255, 0.9))',
          'rgba(15, 23, 42, 0.08)',
          'var(--ntk-text-secondary, #64748b)',
          'var(--ntk-text-primary, #0f172a)',
          'var(--ntk-reference-badge-bg, rgba(16, 185, 129, 0.12))',
          'var(--ntk-reference-badge-text, #10b981)',
          'var(--ntk-reference-panel-muted-bg, #eef2ff)',
          'var(--ntk-reference-border, #dbe4f0)',
          'var(--ntk-reference-panel-bg, #ffffff)',
          'rgba(15, 23, 42, 0.12)',
        ],
      },
      {
        label: 'ReferenceContextRailPanel',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceContextRailPanel.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-editor-panel-bg, #f3f4f6)',
          'var(--ntk-template-editor-button-border, #d1d5db)',
          'var(--ntk-template-editor-canvas-text, #6b7280)',
          'var(--ntk-template-editor-canvas-text, #374151)',
          'var(--ntk-primary, #2563eb)',
          'var(--ntk-template-editor-canvas-text, #9ca3af)',
        ],
      },
      {
        label: 'ReferenceDashboardCharts',
        source: readRepoFile('../../../src/templates/pages/dashboard/ReferenceDashboardCharts.vue'),
        forbiddenSnippets: [
          'background: donutBackground',
          'var(--ntk-template-page-border, #f1f5f9)',
          'var(--ntk-template-page-card-bg, #ffffff)',
          'rgba(0, 0, 0, 0.05)',
          'var(--ntk-template-page-text, #334155)',
          'var(--ntk-template-page-subtitle, #64748b)',
          'var(--ntk-template-page-border, #e2e8f0)',
          'var(--ntk-template-page-row-bg, #f8fafc)',
          'var(--ntk-template-page-subtitle-soft, #94a3b8)',
        ],
      },
      {
        label: 'ProfileTemplate',
        source: readRepoFile('../../../src/templates/pages/account/ProfileTemplate.vue'),
        forbiddenSnippets: [
          'text-white',
          ':color="roleTone"',
          'color="negative"',
          "return 'primary'",
          "return 'info'",
          "return 'grey-7'",
          'var(--ntk-template-page-bg, #f8fafc)',
          'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
          'var(--ntk-template-profile-avatar-border, #ffffff)',
          'rgba(30, 41, 59, 0.2)',
          'var(--ntk-template-page-title, #1e293b)',
          'var(--ntk-template-page-subtitle, #64748b)',
          'var(--ntk-template-page-border, #e2e8f0)',
        ],
      },
    ]

    for (const auditedFile of auditedFiles) {
      for (const snippet of auditedFile.forbiddenSnippets) {
        expect(
          auditedFile.source,
          `Unexpected legacy hardcoded styling in ${auditedFile.label}: ${snippet}`
        ).not.toContain(snippet)
      }
    }
  })

  it('keeps audited files token-driven instead of plain semantic literals', () => {
    const auditedSources = [
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceReportStatusBadge.vue'),
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceContextRailPanel.vue'),
      readRepoFile('../../../src/templates/features/cms/authoring/CmsMediaAssetPicker.vue'),
      readRepoFile('../../../src/templates/navigation/ThemeDotsSwitcher.vue'),
      readRepoFile('../../../src/templates/styles/reference-app-bridge.scss'),
      readRepoFile('../../../src/templates/features/auth/LoginTemplate.vue'),
      readRepoFile('../../../src/templates/features/wiki/WikiChatTemplate.vue'),
      readRepoFile('../../../src/templates/features/wiki/WikiChatDrawerTemplate.vue'),
      readRepoFile('../../../src/templates/layouts/MainLayoutTemplate.vue'),
      readRepoFile('../../../src/templates/navigation/MenuLinkTemplate.vue'),
      readRepoFile('../../../src/templates/navigation/HorizontalMenuLinkTemplate.vue'),
      readRepoFile('../../../src/templates/pages/dashboard/DashboardTemplate.vue'),
      readRepoFile('../../../src/templates/features/wiki/WikiTemplate.vue'),
      readRepoFile('../../../src/templates/pages/crud/CrudListTemplate.vue'),
      readRepoFile('../../../src/templates/pages/system/PlaceholderTemplate.vue'),
      readRepoFile('../../../src/templates/pages/system/ErrorNotFoundTemplate.vue'),
      readRepoFile('../../../src/templates/runtime/RuntimeSettingsSurface.vue'),
      readRepoFile('../../../src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue'),
      readRepoFile('../../../src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue'),
      readRepoFile('../../../src/templates/features/enterprise/ApprovalQueueTemplate.vue'),
      readRepoFile('../../../src/templates/features/enterprise/AuditTimelineTemplate.vue'),
      readRepoFile('../../../src/templates/features/reference-system/ReferenceCatalogTemplate.vue'),
      readRepoFile('../../../src/templates/navigation/UserMenuTemplate.vue'),
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceDocumentNavigatorPanel.vue'),
      readRepoFile('../../../src/templates/pages/editor/EditorWorkbenchTemplate.vue'),
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceTopbarActions.vue'),
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceReportCatalogPanel.vue'),
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceCatalogPreviewSurface.vue'),
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceContextRailPanel.vue'),
      readRepoFile('../../../src/templates/pages/dashboard/ReferenceDashboardCharts.vue'),
      readRepoFile('../../../src/templates/pages/account/ProfileTemplate.vue'),
    ]

    expect(auditedSources.every(source => source.includes('var(--'))).toBe(true)
  })
})
