import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

function readRepoFile(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')
}

function readCssBlock(source: string, selector: string): string {
  const selectorIndex = source.indexOf(selector)

  if (selectorIndex < 0) {
    return ''
  }

  const blockStart = source.indexOf('{', selectorIndex)
  const blockEnd = source.indexOf('}', blockStart)

  if (blockStart < 0 || blockEnd < 0) {
    return ''
  }

  return source.slice(blockStart + 1, blockEnd)
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
          'var(--ntk-text-on-accent, #ffffff)',
        ],
      },
      {
        label: 'LoginTemplate',
        source: readRepoFile('../../../src/templates/features/auth/LoginTemplate.vue'),
        forbiddenSnippets: [
          ':color="submitColor"',
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
          "secondaryAction.color || 'grey-8'",
          "primaryAction.color || 'primary'",
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
          ":color=\"action.color || 'primary'\"",
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
          ":color=\"action.color || 'primary'\"",
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
          ':color="action.color"',
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
          ':color="action.color"',
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
          ":color=\"action.color || 'primary'\"",
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
          'var(--q-primary)',
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
      {
        label: 'ReferenceBrandLockup',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferenceBrandLockup.vue'),
        forbiddenSnippets: [
          'linear-gradient(135deg, #10b981 0%, #2dd4bf 100%)',
          'var(--ntk-text-light, #ffffff)',
          'rgba(2, 6, 23, 0.16)',
          'var(--ntk-template-layout-title-color, var(--ntk-text-primary, #0f172a))',
          'var(--ntk-template-layout-brand-subtitle, var(--ntk-text-secondary, #64748b))',
        ],
      },
      {
        label: 'ReferenceWorkspaceShell',
        source: readRepoFile('../../../src/templates/features/reference-system/ReferenceWorkspaceShell.vue'),
        forbiddenSnippets: [
          'var(--ntk-reference-page-bg, var(--ntk-template-layout-page-bg, #f8fafc))',
        ],
      },
      {
        label: 'ReferenceReportDesignerTemplate',
        source: readRepoFile('../../../src/templates/features/reference-system/ReferenceReportDesignerTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-reference-page-bg, #eef4ff)',
          'var(--ntk-template-editor-muted-text, #6b7280)',
          'var(--ntk-text-secondary, #64748b)',
          'var(--ntk-text-primary, #0f172a)',
        ],
      },
      {
        label: 'WikiChatDrawerTemplate secondary fallbacks',
        source: readRepoFile('../../../src/templates/features/wiki/WikiChatDrawerTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-text-on-accent, #ffffff)',
        ],
      },
      {
        label: 'AppBreadcrumbTemplate',
        source: readRepoFile('../../../src/templates/navigation/AppBreadcrumbTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-breadcrumb-bg, #f1f5f9)',
          'var(--ntk-template-breadcrumb-link-color, #64748b)',
          'var(--q-primary)',
          'var(--ntk-template-breadcrumb-current-color, #0f172a)',
          'var(--ntk-template-breadcrumb-sep-color, #cbd5e1)',
        ],
      },
      {
        label: 'AuthLayoutTemplate',
        source: readRepoFile('../../../src/templates/layouts/AuthLayoutTemplate.vue'),
        forbiddenSnippets: [
          'var(--ntk-template-auth-layout-bg, #f8fafc)',
        ],
      },
      {
        label: 'PlaceholderTemplate action tokenization',
        source: readRepoFile('../../../src/templates/pages/system/PlaceholderTemplate.vue'),
        forbiddenSnippets: [
          'color="primary"',
          "secondaryAction.color || 'grey-8'",
          "primaryAction.color || 'primary'",
        ],
      },
      {
        label: 'WikiChatTemplate runtime interactions',
        source: readRepoFile('../../../src/templates/features/wiki/WikiChatTemplate.vue'),
        forbiddenSnippets: [
          'color="primary"',
        ],
      },
      {
        label: 'RuntimeSettingsSurface action tokenization',
        source: readRepoFile('../../../src/templates/runtime/RuntimeSettingsSurface.vue'),
        forbiddenSnippets: [
          'color="primary"',
        ],
      },
      {
        label: 'ReferencePresetSelectorBar',
        source: readRepoFile('../../../src/templates/features/reference-system/components/ReferencePresetSelectorBar.vue'),
        forbiddenSnippets: [
          'color="primary"',
        ],
      },
      {
        label: 'CmsMediaAssetPicker token alias',
        source: readRepoFile('../../../src/templates/features/cms/authoring/CmsMediaAssetPicker.vue'),
        forbiddenSnippets: [
          'var(--q-primary)',
        ],
      },
      {
        label: 'cms-authoring-reference stylesheet',
        source: readRepoFile('../../../src/templates/styles/cms-authoring-reference.css'),
        forbiddenSnippets: [
          'var(--ntk-cms-page-bg, var(--ntk-template-layout-page-bg, #fafafa))',
          '--ntk-cms-bg-card: var(--ntk-cms-card-bg, #ffffff);',
          '--ntk-cms-shell-bg: var(--ntk-cms-page-bg, #fafafa);',
          '--ntk-cms-border-color: var(--ntk-cms-shell-border, #e5e5e5);',
          'box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);',
          'background: rgba(255, 255, 255, 0.62);',
          'background: rgba(255, 255, 255, 0.92);',
          'color-mix(in srgb, var(--ntk-cms-border-color) 75%, white)',
          'linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
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
      readRepoFile('../../../src/templates/features/reference-system/components/ReferenceBrandLockup.vue'),
      readRepoFile('../../../src/templates/features/reference-system/ReferenceWorkspaceShell.vue'),
      readRepoFile('../../../src/templates/features/reference-system/ReferenceReportDesignerTemplate.vue'),
      readRepoFile('../../../src/templates/navigation/AppBreadcrumbTemplate.vue'),
      readRepoFile('../../../src/templates/layouts/AuthLayoutTemplate.vue'),
      readRepoFile('../../../src/templates/features/reference-system/components/ReferencePresetSelectorBar.vue'),
      readRepoFile('../../../src/templates/styles/cms-authoring-reference.css'),
    ]

    expect(auditedSources.every(source => source.includes('var(--'))).toBe(true)
  })

  it('keeps dark preset aliases wired for structural surfaces and shared inputs', () => {
    const themesSource = readRepoFile('../../../src/styles/themes.css')
    const bridgeSource = readRepoFile('../../../src/templates/styles/reference-app-bridge.scss')

    for (const themeId of ['warp', 'resend']) {
      const themeBlock = readCssBlock(themesSource, `[data-theme='${themeId}']`)

      expect(themeBlock, `Missing CSS block for ${themeId}`).toContain('--ntk-dark-scheme: 1;')
    }

    for (const requiredAlias of [
      '--ntk-bg-primary: var(--ntk-shell-bg);',
      '--ntk-bg-card: var(--ntk-card-bg);',
      '--ntk-bg-elevated: var(--ntk-card-bg);',
      '--ntk-text-primary: var(--ntk-text-heading);',
      '--ntk-input-text: var(--ntk-text-heading);',
      '--ntk-input-placeholder: var(--ntk-text-muted);',
      '--ntk-input-bg:',
    ]) {
      expect(themesSource, `Missing shared theme alias ${requiredAlias}`).toContain(requiredAlias)
    }

    for (const requiredBridgeSnippet of [
      "background: var(--ntk-template-page-card-bg);",
      "color: var(--ntk-template-page-text);",
      "color: var(--ntk-input-text) !important;",
      "color: var(--ntk-input-placeholder) !important;",
    ]) {
      expect(bridgeSource, `Missing shared dark-surface guardrail ${requiredBridgeSnippet}`).toContain(requiredBridgeSnippet)
    }
  })

  it('keeps shell and navigation components bound to shared header, drawer, and horizontal-nav tokens', () => {
    const mainLayoutSource = readRepoFile('../../../src/templates/layouts/MainLayoutTemplate.vue')
    const menuLinkSource = readRepoFile('../../../src/templates/navigation/MenuLinkTemplate.vue')
    const horizontalMenuSource = readRepoFile('../../../src/templates/navigation/HorizontalMenuLinkTemplate.vue')
    const breadcrumbSource = readRepoFile('../../../src/templates/navigation/AppBreadcrumbTemplate.vue')

    for (const requiredLayoutSnippet of [
      '--ntk-template-layout-header-bg: var(--ntk-header-bg,',
      '--ntk-template-layout-header-text: var(--ntk-template-layout-title-color,',
      '--ntk-template-layout-horizontal-bg: var(--ntk-layout-horizontal-bg,',
      '--ntk-template-layout-horizontal-text: var(--ntk-layout-horizontal-text, var(--ntk-drawer-text,',
      '--ntk-template-layout-drawer-bg: var(--ntk-layout-drawer-bg,',
      '--ntk-template-layout-drawer-text: var(--ntk-layout-drawer-text, var(--ntk-drawer-text,',
      '--ntk-template-layout-nav-text: color-mix(in srgb, var(--ntk-template-layout-drawer-text) 82%, transparent);',
      '--ntk-template-layout-nav-active-bg: linear-gradient(',
      '--ntk-template-layout-nav-hover-bg: color-mix(in srgb, var(--ntk-template-layout-drawer-text) 8%, transparent);',
      '--ntk-template-layout-submenu-bg: var(--ntk-template-overlay-bg, var(--ntk-template-page-card-bg,',
      '--ntk-template-layout-submenu-border: var(--ntk-template-overlay-border, var(--ntk-template-layout-toolbar-border));',
      '--ntk-template-layout-submenu-text: var(--ntk-template-overlay-text, var(--ntk-template-page-title,',
      '--ntk-template-layout-submenu-shadow: var(--ntk-template-overlay-shadow, var(--ntk-shadow-soft));',
      '--ntk-template-layout-submenu-hover-bg: var(--ntk-template-overlay-hover-bg,',
      '--ntk-template-layout-submenu-active-bg: var(--ntk-template-overlay-active-bg,',
      '--ntk-template-layout-submenu-active-text: var(--ntk-layout-submenu-active-text, var(--ntk-template-layout-submenu-text));',
      'background: var(--ntk-template-layout-header-bg) !important;',
      'color: var(--ntk-template-layout-header-text) !important;',
      'background: var(--ntk-template-layout-horizontal-bg);',
      'color: var(--ntk-template-layout-horizontal-text);',
      'background: var(--ntk-template-layout-drawer-bg) !important;',
      'color: var(--ntk-template-layout-drawer-text) !important;',
      'font-family: var(--ntk-template-layout-title-font, var(--ntk-font-family-display, system-ui, sans-serif));',
      'font-family: var(--ntk-template-layout-group-font, var(--ntk-font-family-mono, ui-monospace, monospace));',
    ]) {
      expect(mainLayoutSource, `Missing shell token wiring in MainLayoutTemplate: ${requiredLayoutSnippet}`).toContain(requiredLayoutSnippet)
    }

    for (const requiredMenuSnippet of [
      '--ntk-template-menu-link-text: var(--ntk-template-layout-nav-text, var(--ntk-template-layout-drawer-text,',
      '--ntk-template-menu-link-active-border: var(--ntk-template-layout-nav-active-border,',
      '--ntk-template-menu-link-active-bg: var(--ntk-template-layout-nav-active-bg,',
      '--ntk-template-menu-link-active-text: var(--ntk-template-layout-nav-active-text,',
      '--ntk-template-menu-link-submenu-bg: var(--ntk-template-layout-submenu-bg, var(--ntk-template-overlay-bg,',
      '--ntk-template-menu-link-submenu-border: var(--ntk-template-layout-submenu-border, var(--ntk-template-overlay-border,',
      '--ntk-template-menu-link-submenu-text: var(--ntk-template-layout-submenu-text, var(--ntk-template-overlay-text,',
      '--ntk-template-menu-link-submenu-hover-bg: var(--ntk-template-layout-submenu-hover-bg, var(--ntk-template-overlay-hover-bg,',
      '--ntk-template-menu-link-submenu-active-text: var(--ntk-template-layout-submenu-active-text,',
      '--ntk-template-overlay-bg: var(--ntk-template-menu-link-submenu-bg);',
      '--ntk-template-overlay-border: var(--ntk-template-menu-link-submenu-border);',
      '--ntk-template-overlay-text: var(--ntk-template-menu-link-submenu-text);',
      'background: var(--ntk-template-layout-reference-nav-hover-bg, color-mix(in srgb, var(--ntk-template-layout-drawer-text, var(--ntk-template-page-text, var(--ntk-text-primary))) 5%, transparent));',
      'background: var(--ntk-template-layout-nav-hover-bg, color-mix(in srgb, var(--ntk-template-layout-drawer-text) 8%, transparent));',
    ]) {
      expect(menuLinkSource, `Missing drawer-nav token wiring in MenuLinkTemplate: ${requiredMenuSnippet}`).toContain(requiredMenuSnippet)
    }

    for (const requiredHorizontalSnippet of [
      'content-class="ntk-template-horizontal-link__submenu-popup"',
      '--ntk-template-horizontal-link-color: color-mix(in srgb, var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary))) 75%, transparent);',
      '--ntk-template-horizontal-link-hover-color: var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary)));',
      '--ntk-template-horizontal-link-hover-bg: color-mix(in srgb, var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary))) 8%, transparent);',
      '--ntk-template-horizontal-link-active-color: var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary)));',
      '--ntk-template-horizontal-link-active-border: var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary)));',
      '--ntk-template-horizontal-link-submenu-bg: var(--ntk-template-layout-submenu-bg, var(--ntk-template-overlay-bg,',
      '--ntk-template-horizontal-link-submenu-border: var(--ntk-template-layout-submenu-border, var(--ntk-template-overlay-border,',
      '--ntk-template-horizontal-link-submenu-text: var(--ntk-template-layout-submenu-text, var(--ntk-template-overlay-text,',
      '--ntk-template-horizontal-link-submenu-hover-bg: var(--ntk-template-layout-submenu-hover-bg,',
      '--ntk-template-horizontal-link-submenu-active-color: var(--ntk-template-layout-submenu-active-text,',
      '--ntk-template-overlay-bg: var(--ntk-template-horizontal-link-submenu-bg);',
      '--ntk-template-overlay-border: var(--ntk-template-horizontal-link-submenu-border);',
      '--ntk-template-overlay-text: var(--ntk-template-horizontal-link-submenu-text);',
    ]) {
      expect(horizontalMenuSource, `Missing horizontal-nav token wiring in HorizontalMenuLinkTemplate: ${requiredHorizontalSnippet}`).toContain(requiredHorizontalSnippet)
    }

    for (const requiredBreadcrumbSnippet of [
      '--ntk-template-breadcrumb-bg: var(--ntk-template-layout-header-breadcrumb-bg, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 8%, transparent));',
      '--ntk-template-breadcrumb-border: var(--ntk-template-layout-header-breadcrumb-border, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 14%, transparent));',
      '--ntk-template-breadcrumb-link-color: var(--ntk-template-layout-header-breadcrumb-link, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 82%, transparent));',
      '--ntk-template-breadcrumb-link-hover-color: var(--ntk-template-layout-header-breadcrumb-link-hover, var(--ntk-template-layout-header-text, var(--ntk-text-primary)));',
      '--ntk-template-breadcrumb-current-color: var(--ntk-template-layout-header-breadcrumb-current, var(--ntk-template-layout-header-text, var(--ntk-text-primary)));',
      '--ntk-template-breadcrumb-sep-color: var(--ntk-template-layout-header-breadcrumb-sep, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 44%, transparent));',
    ]) {
      expect(breadcrumbSource, `Missing header-shell token wiring in AppBreadcrumbTemplate: ${requiredBreadcrumbSnippet}`).toContain(requiredBreadcrumbSnippet)
    }
  })

  it('keeps Quasar overlay tokens and portal hooks wired through the shared theme bridge', () => {
    const themesSource = readRepoFile('../../../src/styles/themes.css')
    const bridgeSource = readRepoFile('../../../src/templates/styles/reference-app-bridge.scss')
    const menuLinkSource = readRepoFile('../../../src/templates/navigation/MenuLinkTemplate.vue')
    const topbarSource = readRepoFile('../../../src/templates/features/reference-system/components/ReferenceTopbarActions.vue')
    const presetSelectorSource = readRepoFile('../../../src/templates/features/reference-system/components/ReferencePresetSelectorBar.vue')
    const horizontalMenuSource = readRepoFile('../../../src/templates/navigation/HorizontalMenuLinkTemplate.vue')
    const cmsDrawerSource = readRepoFile('../../../src/templates/features/cms/authoring/CmsEntityUsageDrawer.vue')
    const cmsMediaAssetPickerSource = readRepoFile('../../../src/templates/features/cms/authoring/CmsMediaAssetPicker.vue')
    const cmsPreviewToolbarSource = readRepoFile('../../../src/templates/features/cms/authoring/CmsPreviewToolbar.vue')
    const cmsBlocksModuleSource = readRepoFile('../../../src/templates/features/cms/authoring/modules/CmsBlocksModuleSurface.vue')
    const cmsPagesModuleSource = readRepoFile('../../../src/templates/features/cms/authoring/modules/CmsPagesModuleSurface.vue')
    const cmsSettingsModuleSource = readRepoFile('../../../src/templates/features/cms/authoring/modules/CmsSettingsModuleSurface.vue')
    const cmsMediaModuleSource = readRepoFile('../../../src/templates/features/cms/authoring/modules/CmsMediaModuleSurface.vue')
    const cmsReleasesModuleSource = readRepoFile('../../../src/templates/features/cms/authoring/modules/CmsReleasesModuleSurface.vue')
    const cmsStylesSource = readRepoFile('../../../src/templates/styles/cms-authoring-reference.css')

    for (const requiredOverlayToken of [
      '--ntk-surface-overlay:',
      '--ntk-surface-dialog:',
      '--ntk-surface-menu:',
      '--ntk-text-popup:',
      '--ntk-border-popup:',
      '--ntk-popup-bg:',
    ]) {
      expect(themesSource, `Missing overlay token in themes.css: ${requiredOverlayToken}`).toContain(requiredOverlayToken)
    }

    for (const requiredBridgeSnippet of [
      'html[data-theme] {',
      '.q-dialog__backdrop {',
      ':is(.q-menu, .q-popup-proxy, .q-dialog__inner > div, .q-dialog__inner > section, .q-dialog__inner > article, .q-dialog__inner > .q-card, .q-dialog-plugin) {',
      ':is(.q-item, .q-item__section, .q-item__label, .q-toolbar__title, .q-dialog__title, .q-dialog__message, .q-banner__title, .q-banner__message, .q-field__native, .q-field__input, .q-select__dropdown-icon, .q-checkbox__label, .q-radio__label) {',
      ':is(.q-table__container, .q-table, .q-table__middle, .q-table__top, .q-table__bottom) {',
      '.q-tooltip {',
      'background: var(--ntk-template-overlay-bg) !important;',
      'color: var(--ntk-template-overlay-text) !important;',
      'border: 1px solid var(--ntk-template-overlay-border) !important;',
      'box-shadow: var(--ntk-template-overlay-shadow) !important;',
    ]) {
      expect(bridgeSource, `Missing Quasar overlay bridge snippet: ${requiredBridgeSnippet}`).toContain(requiredBridgeSnippet)
    }

    expect(menuLinkSource).toContain('class="ntk-template-menu-link__tooltip"')
    expect(topbarSource).toContain('popup-content-class="ntk-reference-topbar__preset-popup"')
    expect(topbarSource).toContain('class="ntk-reference-topbar__tooltip"')
    expect(presetSelectorSource).toContain('popup-content-class="ntk-reference-preset-selector-bar__popup"')
    expect(horizontalMenuSource).toContain('content-class="ntk-template-horizontal-link__submenu-popup"')
    expect(cmsDrawerSource).toContain('class="cms-usage-drawer-dialog"')
    expect(cmsMediaAssetPickerSource).toContain('popup-content-class="cms-media-asset-picker__popup"')
    expect(cmsPreviewToolbarSource).toContain('popup-content-class="cms-preview-toolbar__popup"')
    expect(cmsBlocksModuleSource).toContain('popup-content-class="cms-blocks-module-surface__popup"')
    expect(cmsPagesModuleSource).toContain('popup-content-class="cms-pages-module-surface__popup"')
    expect(cmsSettingsModuleSource).toContain('popup-content-class="cms-settings-module-surface__popup"')
    expect(cmsMediaModuleSource).toContain('popup-content-class="cms-media-module-surface__popup"')
    expect(cmsReleasesModuleSource).toContain('popup-content-class="cms-releases-module-surface__popup"')
    expect(cmsStylesSource).toContain('.cms-usage-drawer-dialog :deep(.q-dialog__inner)')
  })

  it('keeps tokens.scss as a generic dark fallback instead of a second preset source of truth', () => {
    const tokensSource = readRepoFile('../../../src/styles/tokens.scss')
    const darkFallbackBlock = readCssBlock(tokensSource, 'html.dark:not([data-theme]),')

    expect(darkFallbackBlock, 'Missing generic dark fallback block in tokens.scss').not.toBe('')
    expect(tokensSource).toContain("html.dark:not([data-theme]),")
    expect(tokensSource).toContain("html[data-theme='dark'],")
    expect(tokensSource).toContain('body.body--dark:not([data-theme])')

    for (const requiredFallbackToken of [
      '--ntk-bg-primary:',
      '--ntk-bg-secondary:',
      '--ntk-text-primary:',
      '--ntk-border-color:',
      '--ntk-input-bg:',
      '--ntk-template-page-bg:',
    ]) {
      expect(
        darkFallbackBlock,
        `Missing neutral fallback token in tokens.scss dark block: ${requiredFallbackToken}`
      ).toContain(requiredFallbackToken)
    }

    for (const presetOwnedToken of [
      '--ntk-dark-scheme:',
      '--ntk-shell-bg:',
      '--ntk-card-bg:',
      '--ntk-header-bg:',
      '--ntk-drawer-bg:',
      '--ntk-drawer-text:',
      '--ntk-nav-hover-bg:',
      '--ntk-nav-active-bg:',
      '--ntk-nav-active-border:',
      "[data-theme='warp']",
      "[data-theme='resend']",
    ]) {
      expect(
        darkFallbackBlock,
        `tokens.scss dark fallback should not redefine preset-owned theme tokens: ${presetOwnedToken}`
      ).not.toContain(presetOwnedToken)
    }
  })
})
