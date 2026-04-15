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
    ]

    expect(auditedSources.every(source => source.includes('var(--'))).toBe(true)
  })
})
