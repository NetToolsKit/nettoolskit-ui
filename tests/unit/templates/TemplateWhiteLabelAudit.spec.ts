import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

function readRepoFile(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')
}

function listRepoFiles(relativeDirectory: string): string[] {
  const absoluteDirectory = fileURLToPath(new URL(relativeDirectory, import.meta.url))
  const entries = readdirSync(absoluteDirectory)

  return entries.flatMap((entry) => {
    const childRelativePath = `${relativeDirectory}/${entry}`
    const childAbsolutePath = fileURLToPath(new URL(childRelativePath, import.meta.url))
    const stats = statSync(childAbsolutePath)

    if (stats.isDirectory()) {
      return listRepoFiles(childRelativePath)
    }

    return childRelativePath
  })
}

function toDisplayPath(relativePath: string): string {
  return relativePath.replace(/^\.\.\/\.\.\/\.\.\//, '')
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

type ColorGuardrailViolation = {
  file: string
  line: number
  rule: string
  source: string
}

const scannedColorGuardrailRoots = [
  '../../../src/templates',
  '../../../src/components/layout',
  '../../../src/components/ui',
  '../../../src/components/form',
  '../../../src/components/builders',
  '../../../src/composables',
  '../../../src/config',
  '../../../src/modules',
  '../../../src/styles',
]

const colorGuardrailFilePattern = /\.(?:vue|ts|scss|css)$/
const quasarPaletteNamePattern = /\b(?:primary|secondary|accent|positive|negative|warning|info|dark|grey-[0-9]|white|black)\b/
const quasarPaletteClassPattern = /(?<![\w-])(?:bg|text)-(?:primary|secondary|accent|positive|negative|warning|info|dark|grey-[0-9]|white|black)\b/
const cssNamedColorPattern = /\b(?:white|black)\b/
const fixedColorLiteralPattern = /#[0-9a-fA-F]{3,8}\b|(?<![a-z-])(?:rgba?|hsla?)\((?!\s*var\(--)[^)]+\)/g
const cssColorDeclarationPattern = /\b(?:background(?:-color)?|color|border(?:-color)?|outline(?:-color)?)\s*:\s*([^;]+)/
const objectColorLiteralPattern = /\b(?:color|textColor|bgColor|background|backgroundColor|borderColor|badgeColor|avatarColor)\s*:\s*(['"`])([^'"`]+)\1/
const quasarColorAttributePattern = /(?:^|\s):?(?:color|text-color|bg-color)\s*=\s*(?:"([^"]+)"|'([^']+)')/g
const dynamicQuasarUtilityClassPattern = /`(?:bg|text)-\$\{[^}]+}`/

const centralizedColorSourceFiles = new Set([
  'src/config/colors/palette.config.ts',
  'src/config/colors/semantic.config.ts',
  'src/config/colors/theme-mode.config.ts',
  'src/config/presets/nettoolskit.preset.ts',
  'src/config/theme/theme.config.ts',
  'src/config/theme/theme.plugin.ts',
  'src/config/visual/effects.config.ts',
  'src/modules/cms/white-label/theme-presets.ts',
  'src/modules/cms/white-label/authoring/design-baseline.ts',
  'src/styles/index.ts',
  'src/styles/quasar-variables.scss',
  'src/styles/themes.css',
  'src/styles/tokens.scss',
])

const colorLiteralAllowlist = [
  {
    file: 'src/components/ui/NtkCreditCard.vue',
    source: 'rgba(var(--ntk-primary-rgb), 0.15)',
    reason: 'RGB channels are tokenized through --ntk-primary-rgb.',
  },
]

const quasarPaletteClassAllowlist = [
  {
    file: 'src/templates/styles/reference-app-bridge.scss',
    source: '.q-notification.bg-positive',
    reason: 'Bridge selectors remap Quasar notification classes to theme tokens.',
  },
  {
    file: 'src/templates/styles/reference-app-bridge.scss',
    source: '.q-notification.bg-negative',
    reason: 'Bridge selectors remap Quasar notification classes to theme tokens.',
  },
  {
    file: 'src/templates/styles/reference-app-bridge.scss',
    source: '.q-notification.bg-warning',
    reason: 'Bridge selectors remap Quasar notification classes to theme tokens.',
  },
  {
    file: 'src/templates/styles/reference-app-bridge.scss',
    source: '.q-notification.bg-info',
    reason: 'Bridge selectors remap Quasar notification classes to theme tokens.',
  },
  {
    file: 'src/templates/styles/reference-app-bridge.scss',
    source: '.text-primary',
    reason: 'Bridge selectors remap Quasar text color classes to theme tokens.',
  },
  {
    file: 'src/templates/styles/reference-app-bridge.scss',
    source: '.q-btn.text-primary',
    reason: 'Bridge selectors remap Quasar action classes to theme tokens.',
  },
  {
    file: 'src/templates/styles/reference-app-bridge.scss',
    source: '.bg-primary',
    reason: 'Bridge selectors remap Quasar action classes to theme tokens.',
  },
  {
    file: 'src/components/layout/NtkAppShell.vue',
    source: "'text-primary': 'var(--ntk-text-primary)'",
    reason: 'Shell aliases resolve legacy color names to white-label tokens before style application.',
  },
  {
    file: 'src/components/layout/NtkAppShell.vue',
    source: "'text-secondary': 'var(--ntk-text-secondary)'",
    reason: 'Shell aliases resolve legacy color names to white-label tokens before style application.',
  },
]

function isAllowedViolation(
  file: string,
  source: string,
  allowlist: Array<{ file: string; source: string }>
): boolean {
  return allowlist.some(entry => entry.file === file && source.includes(entry.source))
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
}

function lineForOffset(source: string, offset: number): number {
  return source.slice(0, offset).split(/\r?\n/).length
}

function lineAt(source: string, line: number): string {
  return source.split(/\r?\n/)[line - 1]?.trim() ?? ''
}

function isCentralizedColorSource(file: string): boolean {
  return centralizedColorSourceFiles.has(file)
}

function isSafeColorExpression(value: string): boolean {
  const normalized = value.trim()

  return normalized === 'transparent'
    || normalized.startsWith('var(--')
    || normalized.startsWith('color-mix(')
    || normalized.startsWith('linear-gradient(')
    || normalized.startsWith('radial-gradient(')
}

function hasFixedColorLiteral(value: string): boolean {
  fixedColorLiteralPattern.lastIndex = 0
  return fixedColorLiteralPattern.test(value)
}

function pushViolation(
  violations: ColorGuardrailViolation[],
  file: string,
  line: number,
  rule: string,
  source: string
): void {
  violations.push({
    file,
    line,
    rule,
    source: source.trim().replace(/\s+/g, ' '),
  })
}

function scanTemplateColorGuardrails(): ColorGuardrailViolation[] {
  const files = scannedColorGuardrailRoots
    .flatMap(root => listRepoFiles(root))
    .filter(file => colorGuardrailFilePattern.test(file))

  const violations: ColorGuardrailViolation[] = []

  for (const relativePath of files) {
    const displayPath = toDisplayPath(relativePath)
    const rawSource = readRepoFile(relativePath)
    const searchableSource = stripComments(rawSource)
    const lines = searchableSource.split(/\r?\n/)
    const isCentralSource = isCentralizedColorSource(displayPath)

    lines.forEach((line, lineIndex) => {
      const source = line.trim()

      if (!source) {
        return
      }

      if (/theme\.value\.(?:colors|gradients)/.test(source)) {
        pushViolation(violations, displayPath, lineIndex + 1, 'legacy theme.value colors/gradients', source)
      }

      if (
        /\b:?(?:color|text-color|bg-color)\s*=/.test(source)
        && quasarPaletteNamePattern.test(source)
      ) {
        pushViolation(violations, displayPath, lineIndex + 1, 'direct Quasar palette prop', source)
      }

      if (
        quasarPaletteClassPattern.test(source)
        && !isAllowedViolation(displayPath, source, quasarPaletteClassAllowlist)
      ) {
        pushViolation(violations, displayPath, lineIndex + 1, 'direct Quasar palette class', source)
      }

      if (
        dynamicQuasarUtilityClassPattern.test(source)
        && !isAllowedViolation(displayPath, source, quasarPaletteClassAllowlist)
      ) {
        pushViolation(violations, displayPath, lineIndex + 1, 'dynamic Quasar palette utility class', source)
      }

      const objectColorLiteralMatch = source.match(objectColorLiteralPattern)
      if (objectColorLiteralMatch) {
        const value = objectColorLiteralMatch[2]

        if (
          !isSafeColorExpression(value)
          && (
            quasarPaletteNamePattern.test(value)
            || cssNamedColorPattern.test(value)
            || hasFixedColorLiteral(value)
          )
          && !isCentralSource
          && !isAllowedViolation(displayPath, source, colorLiteralAllowlist)
        ) {
          pushViolation(violations, displayPath, lineIndex + 1, `non-tokenized object color ${value}`, source)
        }
      }

      const cssColorDeclarationMatch = source.match(cssColorDeclarationPattern)
      if (cssColorDeclarationMatch) {
        const value = cssColorDeclarationMatch[1]?.trim() ?? ''

        if (
          !isSafeColorExpression(value)
          && cssNamedColorPattern.test(value)
          && !isCentralSource
          && !isAllowedViolation(displayPath, source, colorLiteralAllowlist)
        ) {
          pushViolation(violations, displayPath, lineIndex + 1, `named CSS color ${value}`, source)
        }
      }

      for (const [literal] of source.matchAll(fixedColorLiteralPattern)) {
        if (isCentralSource || isAllowedViolation(displayPath, source, colorLiteralAllowlist)) {
          continue
        }

        pushViolation(violations, displayPath, lineIndex + 1, `fixed color literal ${literal}`, source)
      }
    })

    for (const match of searchableSource.matchAll(quasarColorAttributePattern)) {
      const value = (match[1] ?? match[2] ?? '').trim()
      const line = lineForOffset(searchableSource, match.index ?? 0)
      const source = lineAt(searchableSource, line)

      if (
        quasarPaletteNamePattern.test(value)
        && !isAllowedViolation(displayPath, source, quasarPaletteClassAllowlist)
      ) {
        pushViolation(violations, displayPath, line, 'direct Quasar palette prop', source)
      }
    }
  }

  return violations
}

describe('template white-label audit', () => {
  it('keeps public chrome components on white-label tokens instead of Quasar palette names', () => {
    const auditedFiles = [
      {
        label: 'NtkLandingComposer',
        source: readRepoFile('../../../src/components/layout/NtkLandingComposer.vue'),
        forbiddenSnippets: ['color="primary"'],
        requiredSnippets: [
          'class="ntk-landing-composer__action ntk-landing-composer__action--primary"',
          'background: var(--ntk-button-primary-bg, var(--ntk-primary))',
        ],
      },
      {
        label: 'NtkContactSection',
        source: readRepoFile('../../../src/components/layout/NtkContactSection.vue'),
        forbiddenSnippets: ['color="primary"'],
        requiredSnippets: [
          'class="ntk-contact__submit ntk-contact__action--primary"',
          'background: var(--ntk-button-primary-bg, var(--ntk-primary))',
        ],
      },
      {
        label: 'NtkTechStack',
        source: readRepoFile('../../../src/components/layout/NtkTechStack.vue'),
        forbiddenSnippets: ['color="primary"', 'text-color="primary"'],
        requiredSnippets: [
          'class="ntk-tech-stack__chip"',
          'color: var(--ntk-tech-stack-chip-text, var(--ntk-primary))',
        ],
      },
      {
        label: 'NtkAppSidebar',
        source: readRepoFile('../../../src/components/builders/NtkAppSidebar.vue'),
        forbiddenSnippets: [
          "userProfile.avatarColor || 'primary'",
          'text-color="white"',
          "item.badgeColor || 'primary'",
          'color: white;',
        ],
        requiredSnippets: [
          'class="sidebar-profile__avatar"',
          'class="menu-badge"',
          '--ntk-sidebar-avatar-bg',
          '--ntk-sidebar-badge-bg',
        ],
      },
      {
        label: 'NtkNotificationCenter',
        source: readRepoFile('../../../src/components/builders/NtkNotificationCenter.vue'),
        forbiddenSnippets: [
          'color="error"',
          'text-color="white"',
          'color="grey-5"',
          'class="text-grey-6"',
          'const colors = {',
          "success: 'positive'",
          "error: 'negative'",
        ],
        requiredSnippets: [
          'class="notification-unread-badge"',
          'class="notification-avatar"',
          'class="notification-empty__icon"',
          'class="notification-empty__text"',
        ],
      },
      {
        label: 'NtkSidebar',
        source: readRepoFile('../../../src/components/layout/NtkSidebar.vue'),
        forbiddenSnippets: [
          ':color="item.badgeColor',
          '<q-badge',
          '`bg-${props.bgColor}`',
          '`text-${props.textColor}`',
          "default: 'white'",
          "default: 'grey-8'",
        ],
        requiredSnippets: [
          ':style="drawerStyle"',
          'class="ntk-sidebar__badge"',
          '--ntk-sidebar-bg-resolved',
          '--ntk-sidebar-text-resolved',
          '--ntk-sidebar-item-active-text-resolved',
          '--ntk-sidebar-badge-bg',
        ],
      },
      {
        label: 'NtkPricingCard',
        source: readRepoFile('../../../src/components/ui/NtkPricingCard.vue'),
        forbiddenSnippets: [
          ':color="feature.disabled',
          "'grey-5' : 'positive'",
          'color="positive"',
          'color="grey-5"',
        ],
        requiredSnippets: [
          'class="pricing-card__feature-icon"',
          "pricing-card__feature-icon--disabled",
          "pricing-card__feature-icon--enabled",
          '--ntk-pricing-feature-icon-success',
          '--ntk-pricing-feature-icon-muted',
        ],
      },
    ]

    for (const { label, source, forbiddenSnippets, requiredSnippets } of auditedFiles) {
      for (const forbiddenSnippet of forbiddenSnippets) {
        expect(source, `${label} leaked a fixed Quasar palette value: ${forbiddenSnippet}`).not.toContain(forbiddenSnippet)
      }

      for (const requiredSnippet of requiredSnippets) {
        expect(source, `${label} is missing white-label token wiring: ${requiredSnippet}`).toContain(requiredSnippet)
      }
    }
  })

  it('keeps shared UI component defaults on CSS variable white-label tokens', () => {
    const auditedFiles = [
      {
        label: 'NtkFeatureCard',
        source: readRepoFile('../../../src/components/ui/NtkFeatureCard.vue'),
        requiredSnippets: [
          "background: 'var(--ntk-primary-gradient)'",
          "color: 'var(--ntk-text-on-accent)'",
        ],
      },
      {
        label: 'NtkSteps',
        source: readRepoFile('../../../src/components/ui/NtkSteps.vue'),
        requiredSnippets: [
          "background: 'var(--ntk-primary-gradient)'",
          'var(--ntk-primary-dark, var(--ntk-primary))',
        ],
      },
      {
        label: 'NtkStatCard',
        source: readRepoFile('../../../src/components/ui/NtkStatCard.vue'),
        requiredSnippets: [
          "background: 'var(--ntk-primary-gradient)'",
          "return { color: 'var(--ntk-primary)' };",
        ],
      },
      {
        label: 'NtkCreditCard',
        source: readRepoFile('../../../src/components/ui/NtkCreditCard.vue'),
        requiredSnippets: [
          "color: resolveTokenColor(props.amountColor) || 'var(--ntk-primary)'",
        ],
      },
      {
        label: 'NtkCTASection',
        source: readRepoFile('../../../src/components/layout/NtkCTASection.vue'),
        requiredSnippets: [
          "styles.background = 'var(--ntk-primary-gradient)'",
          "color: 'var(--ntk-primary)'",
          "color: 'var(--ntk-text-on-accent)'",
        ],
      },
      {
        label: 'NtkMobileDrawer',
        source: readRepoFile('../../../src/components/layout/NtkMobileDrawer.vue'),
        requiredSnippets: [
          "background: 'var(--ntk-primary-gradient)'",
          'color: var(--ntk-text-on-accent);',
        ],
      },
    ]

    for (const { label, source, requiredSnippets } of auditedFiles) {
      for (const forbiddenSnippet of [
        'useTheme',
        'theme.value.colors',
        'theme.value.gradients',
        "color: 'white'",
        'color: "white"',
      ]) {
        expect(source, `${label} leaked legacy theme styling: ${forbiddenSnippet}`).not.toContain(forbiddenSnippet)
      }

      for (const requiredSnippet of requiredSnippets) {
        expect(source, `${label} is missing white-label token wiring: ${requiredSnippet}`).toContain(requiredSnippet)
      }
    }
  })

  it('keeps Quasar Sass fallbacks aligned with the default Revolut preset', () => {
    const quasarVariablesSource = readRepoFile('../../../src/styles/quasar-variables.scss')

    expect(quasarVariablesSource).toContain('$primary: #0f766e !default;')
    expect(quasarVariablesSource).toContain('$accent: #0f766e !default;')
    expect(quasarVariablesSource).toContain('$info: #14b8a6 !default;')
    expect(quasarVariablesSource).not.toContain('$primary: #512BD4 !default;')
    expect(quasarVariablesSource).not.toContain('$accent: #f8fafc !default;')
  })

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
        label: 'Theme configuration adapter',
        source: readRepoFile('../../../src/config/theme/theme.config.ts'),
        forbiddenSnippets: [
          "background: '#FFFFFF'",
          "success: '#22c55e'",
          "warning: '#eab308'",
          "error: '#ef4444'",
        ],
      },
      {
        label: 'BaseDatePicker form wrapper',
        source: readRepoFile('../../../src/components/form/BaseDatePicker.vue'),
        forbiddenSnippets: [
          'color="primary"',
          'color="grey-7"',
          'text-color="primary"',
          'text-color="white"',
        ],
      },
      {
        label: 'BaseTimePicker form wrapper',
        source: readRepoFile('../../../src/components/form/BaseTimePicker.vue'),
        forbiddenSnippets: [
          'color="primary"',
          'color="grey-7"',
          'text-color="primary"',
          'text-color="white"',
        ],
      },
      {
        label: 'NtkDatePicker form wrapper',
        source: readRepoFile('../../../src/components/form/NtkDatePicker.vue'),
        forbiddenSnippets: [
          'color="primary"',
          'color="grey-7"',
          'text-color="primary"',
          'text-color="white"',
        ],
      },
      {
        label: 'NtkTimePicker form wrapper',
        source: readRepoFile('../../../src/components/form/NtkTimePicker.vue'),
        forbiddenSnippets: [
          'color="primary"',
          'color="grey-7"',
          'text-color="primary"',
          'text-color="white"',
        ],
      },
      {
        label: 'NtkSelect form wrapper',
        source: readRepoFile('../../../src/components/form/NtkSelect.vue'),
        forbiddenSnippets: [
          'color="primary"',
          'color="grey-7"',
          'text-color="primary"',
          'text-color="white"',
        ],
      },
      {
        label: 'OriginalReferenceApp sample',
        source: readRepoFile('../../../samples/original-reference/OriginalReferenceApp.vue'),
        forbiddenSnippets: [
          'var(--ntk-shell-bg, #f1f5f9)',
          'var(--ntk-header-bg, #ffffff)',
          'var(--ntk-accent, #0f766e)',
          'var(--ntk-text-heading, #1f2937)',
          'var(--ntk-border, rgba(0, 0, 0, 0.12))',
          'var(--ntk-border-strong, rgba(0, 0, 0, 0.21))',
          'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
          'var(--ntk-nav-hover-bg, rgba(0, 0, 0, 0.05))',
          'var(--ntk-nav-active-bg, rgba(255, 255, 255, 0.15))',
          'var(--ntk-nav-active-border, rgba(255, 255, 255, 0.8))',
          '--ntk-template-user-menu-header-bg: rgba(0, 0, 0, 0.02);',
          '--ntk-template-user-menu-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);',
          'var(--ntk-avatar-bg, #0f766e)',
          'var(--ntk-avatar-border, #ffffff)',
          'var(--ntk-avatar-color, #ffffff)',
          'var(--ntk-text-on-accent, #ffffff)',
          'var(--ntk-fab-shadow, rgba(15, 118, 110, 0.3))',
          'var(--ntk-fab-shadow-hover, rgba(15, 118, 110, 0.4))',
          'var(--ntk-text-muted, #64748b)',
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

  it('scans templates, shared Vue components, and modules for non-tokenized color regressions', () => {
    const violations = scanTemplateColorGuardrails()

    expect(
      violations,
      violations
        .map(violation => `${violation.file}:${violation.line} ${violation.rule} -> ${violation.source}`)
        .join('\n')
    ).toEqual([])
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

  it('routes dashboard, workspace, CRUD, and chart tonal states through shared semantic tokens', () => {
    const dashboardSource = readRepoFile('../../../src/templates/pages/dashboard/DashboardTemplate.vue')
    const dashboardWorkspaceSource = readRepoFile('../../../src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue')
    const crudSource = readRepoFile('../../../src/templates/pages/crud/CrudListTemplate.vue')
    const chartsSource = readRepoFile('../../../src/templates/pages/dashboard/ReferenceDashboardCharts.vue')

    for (const requiredDashboardSnippet of [
      '--ntk-template-dashboard-tone-neutral-bg: var(--ntk-template-semantic-neutral-emphasis-bg);',
      '--ntk-template-dashboard-tone-accent-bg: var(--ntk-template-semantic-accent-emphasis-bg);',
      '--ntk-template-dashboard-tone-info-bg: var(--ntk-template-semantic-info-emphasis-bg);',
      '--ntk-template-dashboard-tone-success-bg: var(--ntk-template-semantic-success-emphasis-bg);',
      '--ntk-template-dashboard-tone-warning-bg: var(--ntk-template-semantic-warning-emphasis-bg);',
      '--ntk-template-dashboard-tone-danger-bg: var(--ntk-template-semantic-danger-emphasis-bg);',
      '--ntk-template-dashboard-top-stat-label: var(--ntk-template-page-chip-text, var(--ntk-template-dashboard-subtitle));',
    ]) {
      expect(dashboardSource, `Missing shared semantic token wiring in DashboardTemplate: ${requiredDashboardSnippet}`).toContain(requiredDashboardSnippet)
    }

    for (const forbiddenDashboardSnippet of [
      '--ntk-template-dashboard-tone-accent-text: color-mix(',
      '--ntk-template-dashboard-tone-info-text: color-mix(',
      '--ntk-template-dashboard-tone-success-text: color-mix(',
      '--ntk-template-dashboard-tone-warning-text: color-mix(',
      '--ntk-template-dashboard-tone-danger-text: color-mix(',
    ]) {
      expect(dashboardSource, `DashboardTemplate still contains legacy local tone math: ${forbiddenDashboardSnippet}`).not.toContain(forbiddenDashboardSnippet)
    }

    for (const requiredWorkspaceSnippet of [
      '--ntk-template-dashboard-workspace-filter-active-bg: var(--ntk-template-semantic-accent-emphasis-bg);',
      '--ntk-template-dashboard-workspace-tone-neutral-bg: var(--ntk-template-semantic-neutral-emphasis-bg);',
      '--ntk-template-dashboard-workspace-tone-accent-bg: var(--ntk-template-semantic-accent-emphasis-bg);',
      '--ntk-template-dashboard-workspace-tone-info-bg: var(--ntk-template-semantic-info-emphasis-bg);',
      '--ntk-template-dashboard-workspace-tone-success-bg: var(--ntk-template-semantic-success-emphasis-bg);',
      '--ntk-template-dashboard-workspace-tone-warning-bg: var(--ntk-template-semantic-warning-emphasis-bg);',
      '--ntk-template-dashboard-workspace-tone-danger-bg: var(--ntk-template-semantic-danger-emphasis-bg);',
    ]) {
      expect(dashboardWorkspaceSource, `Missing shared semantic token wiring in DashboardWorkspaceTemplate: ${requiredWorkspaceSnippet}`).toContain(requiredWorkspaceSnippet)
    }

    for (const forbiddenWorkspaceSnippet of [
      '--ntk-template-dashboard-workspace-tone-accent-text: color-mix(',
      '--ntk-template-dashboard-workspace-tone-info-text: color-mix(',
      '--ntk-template-dashboard-workspace-tone-success-text: color-mix(',
      '--ntk-template-dashboard-workspace-tone-warning-text: color-mix(',
      '--ntk-template-dashboard-workspace-tone-danger-text: color-mix(',
    ]) {
      expect(dashboardWorkspaceSource, `DashboardWorkspaceTemplate still contains legacy local tone math: ${forbiddenWorkspaceSnippet}`).not.toContain(forbiddenWorkspaceSnippet)
    }

    for (const requiredCrudSnippet of [
      '--ntk-template-crud-list-filter-active-bg: var(--ntk-template-semantic-accent-emphasis-bg);',
      '--ntk-template-crud-list-tone-neutral-bg: var(--ntk-template-semantic-neutral-emphasis-bg);',
      '--ntk-template-crud-list-tone-accent-bg: var(--ntk-template-semantic-accent-emphasis-bg);',
      '--ntk-template-crud-list-tone-info-bg: var(--ntk-template-semantic-info-emphasis-bg);',
      '--ntk-template-crud-list-tone-success-bg: var(--ntk-template-semantic-success-emphasis-bg);',
      '--ntk-template-crud-list-tone-warning-bg: var(--ntk-template-semantic-warning-emphasis-bg);',
      '--ntk-template-crud-list-tone-danger-bg: var(--ntk-template-semantic-danger-emphasis-bg);',
      '--ntk-template-crud-list-bulk-bg: var(--ntk-template-crud-list-tone-info-bg);',
    ]) {
      expect(crudSource, `Missing shared semantic token wiring in CrudListTemplate: ${requiredCrudSnippet}`).toContain(requiredCrudSnippet)
    }

    for (const forbiddenCrudSnippet of [
      '--ntk-template-crud-list-filter-active-bg: color-mix(',
      '--ntk-template-crud-list-info-soft: color-mix(',
      '--ntk-template-crud-list-success-soft: color-mix(',
      '--ntk-template-crud-list-warning-soft: color-mix(',
      '--ntk-template-crud-list-danger-soft: color-mix(',
    ]) {
      expect(crudSource, `CrudListTemplate still contains legacy local chip math: ${forbiddenCrudSnippet}`).not.toContain(forbiddenCrudSnippet)
    }

    for (const requiredChartSnippet of [
      '--ntk-reference-dashboard-callout-line:',
      '--ntk-reference-dashboard-chart-guide:',
      '--ntk-reference-dashboard-chart-tick:',
      'background: var(--ntk-reference-dashboard-callout-line);',
      'color: var(--ntk-reference-dashboard-chart-tick);',
    ]) {
      expect(chartsSource, `Missing shared chart contrast token wiring in ReferenceDashboardCharts: ${requiredChartSnippet}`).toContain(requiredChartSnippet)
    }

    for (const forbiddenChartSnippet of [
      'var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-primary))) 44%,',
      'var(--ntk-template-page-subtitle, var(--ntk-text-secondary, var(--ntk-text-primary))) 12%,',
    ]) {
      expect(chartsSource, `ReferenceDashboardCharts still contains weak local guide math: ${forbiddenChartSnippet}`).not.toContain(forbiddenChartSnippet)
    }
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
    const userMenuSource = readRepoFile('../../../src/templates/navigation/UserMenuTemplate.vue')

    for (const requiredLayoutSnippet of [
      '--ntk-template-layout-header-bg: var(--ntk-template-shell-header-bg);',
      '--ntk-template-layout-header-text: var(--ntk-template-shell-header-text);',
      '--ntk-template-layout-header-action-text: var(--ntk-template-shell-header-action-text);',
      '--ntk-template-layout-header-action-hover-bg: var(--ntk-template-shell-header-action-hover-bg);',
      '--ntk-template-layout-header-breadcrumb-bg: var(--ntk-template-shell-breadcrumb-bg);',
      '--ntk-template-layout-horizontal-bg: var(--ntk-template-shell-horizontal-bg);',
      '--ntk-template-layout-horizontal-text: var(--ntk-template-shell-horizontal-text);',
      '--ntk-template-layout-drawer-bg: var(--ntk-template-shell-drawer-bg);',
      '--ntk-template-layout-drawer-text: var(--ntk-template-shell-drawer-text);',
      '--ntk-template-layout-nav-text: var(--ntk-template-shell-nav-text);',
      '--ntk-template-layout-nav-active-bg: var(--ntk-template-shell-nav-active-bg);',
      '--ntk-template-layout-nav-hover-bg: var(--ntk-template-shell-nav-hover-bg);',
      '--ntk-template-layout-submenu-bg: var(--ntk-template-shell-submenu-bg);',
      '--ntk-template-layout-submenu-border: var(--ntk-template-shell-submenu-border);',
      '--ntk-template-layout-submenu-text: var(--ntk-template-shell-submenu-text);',
      '--ntk-template-layout-submenu-shadow: var(--ntk-template-shell-submenu-shadow);',
      '--ntk-template-layout-submenu-hover-bg: var(--ntk-template-shell-submenu-hover-bg);',
      '--ntk-template-layout-submenu-active-bg: var(--ntk-template-shell-submenu-active-bg);',
      '--ntk-template-layout-submenu-active-text: var(--ntk-template-shell-submenu-active-text);',
      'background: var(--ntk-template-layout-header-bg) !important;',
      'color: var(--ntk-template-layout-header-text) !important;',
      'background: var(--ntk-template-layout-horizontal-bg);',
      'color: var(--ntk-template-layout-horizontal-text);',
      'background: var(--ntk-template-layout-drawer-bg) !important;',
      'color: var(--ntk-template-layout-drawer-text) !important;',
      'background: var(--ntk-template-layout-header-action-hover-bg);',
      'outline: 2px solid var(--ntk-template-layout-header-action-focus-ring);',
      'font-family: var(--ntk-template-layout-title-font, var(--ntk-font-family-display, system-ui, sans-serif));',
      'font-family: var(--ntk-template-layout-group-font, var(--ntk-font-family-mono, ui-monospace, monospace));',
    ]) {
      expect(mainLayoutSource, `Missing shell token wiring in MainLayoutTemplate: ${requiredLayoutSnippet}`).toContain(requiredLayoutSnippet)
    }

    for (const requiredMenuSnippet of [
      '--ntk-template-menu-link-text-resolved: var(--ntk-template-menu-link-color, var(--ntk-template-layout-nav-text, var(--ntk-template-layout-drawer-text,',
      '--ntk-template-menu-link-hover-bg-resolved: var(--ntk-template-menu-link-hover-bg, var(--ntk-template-layout-nav-hover-bg,',
      '--ntk-template-menu-link-active-border-resolved: var(--ntk-template-menu-link-active-border, var(--ntk-template-layout-nav-active-border,',
      '--ntk-template-menu-link-active-text-resolved: var(--ntk-template-menu-link-active-text, var(--ntk-template-layout-nav-active-text,',
      '--ntk-template-menu-link-caption-resolved: var(--ntk-template-menu-link-caption,',
      '--ntk-template-menu-link-submenu-bg-resolved: var(--ntk-template-menu-link-submenu-bg, var(--ntk-template-layout-submenu-bg, var(--ntk-template-overlay-bg,',
      '--ntk-template-menu-link-submenu-border-resolved: var(--ntk-template-menu-link-submenu-border, var(--ntk-template-layout-submenu-border,',
      '--ntk-template-menu-link-submenu-text-resolved: var(--ntk-template-menu-link-submenu-text, var(--ntk-template-layout-submenu-text,',
      '--ntk-template-menu-link-submenu-hover-bg-resolved: var(--ntk-template-menu-link-submenu-hover-bg, var(--ntk-template-layout-submenu-hover-bg,',
      '--ntk-template-menu-link-submenu-active-text-resolved: var(--ntk-template-menu-link-submenu-active-text, var(--ntk-template-layout-submenu-active-text,',
      '--ntk-template-menu-link-reference-hover-bg-resolved: var(--ntk-template-menu-link-reference-hover-bg,',
      '--ntk-template-overlay-bg: var(--ntk-template-menu-link-submenu-bg-resolved);',
      '--ntk-template-overlay-border: var(--ntk-template-menu-link-submenu-border-resolved);',
      '--ntk-template-overlay-text: var(--ntk-template-menu-link-submenu-text-resolved);',
      'background: var(--ntk-template-menu-link-reference-hover-bg-resolved);',
      'background: var(--ntk-template-menu-link-hover-bg-resolved);',
    ]) {
      expect(menuLinkSource, `Missing drawer-nav token wiring in MenuLinkTemplate: ${requiredMenuSnippet}`).toContain(requiredMenuSnippet)
    }

    for (const requiredHorizontalSnippet of [
      'content-class="ntk-template-horizontal-link__submenu-popup"',
      '--ntk-template-horizontal-link-color-resolved: var(--ntk-template-horizontal-link-color,',
      '--ntk-template-horizontal-link-hover-color-resolved: var(--ntk-template-horizontal-link-hover-color,',
      '--ntk-template-horizontal-link-hover-bg-resolved: var(--ntk-template-horizontal-link-hover-bg,',
      '--ntk-template-horizontal-link-active-color-resolved: var(--ntk-template-horizontal-link-active-color,',
      '--ntk-template-horizontal-link-active-border-resolved: var(--ntk-template-horizontal-link-active-border,',
      '--ntk-template-horizontal-link-submenu-bg-resolved: var(--ntk-template-horizontal-link-submenu-bg,',
      '--ntk-template-horizontal-link-submenu-border-resolved: var(--ntk-template-horizontal-link-submenu-border,',
      '--ntk-template-horizontal-link-submenu-text-resolved: var(--ntk-template-horizontal-link-submenu-text,',
      '--ntk-template-horizontal-link-submenu-hover-bg-resolved: var(--ntk-template-horizontal-link-submenu-hover-bg,',
      '--ntk-template-horizontal-link-submenu-active-color-resolved: var(--ntk-template-horizontal-link-submenu-active-color,',
      '--ntk-template-overlay-bg: var(--ntk-template-horizontal-link-submenu-bg-resolved);',
      '--ntk-template-overlay-border: var(--ntk-template-horizontal-link-submenu-border-resolved);',
      '--ntk-template-overlay-text: var(--ntk-template-horizontal-link-submenu-text-resolved);',
    ]) {
      expect(horizontalMenuSource, `Missing horizontal-nav token wiring in HorizontalMenuLinkTemplate: ${requiredHorizontalSnippet}`).toContain(requiredHorizontalSnippet)
    }

    for (const requiredBreadcrumbSnippet of [
      '--ntk-template-breadcrumb-surface-resolved: var(--ntk-template-layout-header-breadcrumb-bg, var(--ntk-template-breadcrumb-bg, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 8%, transparent)));',
      '--ntk-template-breadcrumb-border-color-resolved: var(--ntk-template-layout-header-breadcrumb-border, var(--ntk-template-breadcrumb-border, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 14%, transparent)));',
      '--ntk-template-breadcrumb-link-text-resolved: var(--ntk-template-layout-header-breadcrumb-link, var(--ntk-template-breadcrumb-link-color, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 82%, transparent)));',
      '--ntk-template-breadcrumb-link-hover-text-resolved: var(--ntk-template-layout-header-breadcrumb-link-hover, var(--ntk-template-breadcrumb-link-hover-color, var(--ntk-template-layout-header-text, var(--ntk-text-primary))));',
      '--ntk-template-breadcrumb-current-text-resolved: var(--ntk-template-layout-header-breadcrumb-current, var(--ntk-template-breadcrumb-current-color, var(--ntk-template-layout-header-text, var(--ntk-text-primary))));',
      '--ntk-template-breadcrumb-separator-text-resolved: var(--ntk-template-layout-header-breadcrumb-sep, var(--ntk-template-breadcrumb-sep-color, color-mix(in srgb, var(--ntk-template-layout-header-text, var(--ntk-text-primary)) 44%, transparent)));',
      '--ntk-template-breadcrumb-link-hover-bg-resolved: var(--ntk-template-layout-header-breadcrumb-hover-bg, var(--ntk-template-breadcrumb-hover-bg, color-mix(in srgb, var(--ntk-template-breadcrumb-current-text-resolved) 8%, transparent)));',
      '--ntk-template-breadcrumb-radius-resolved: var(--ntk-template-layout-header-breadcrumb-radius, var(--ntk-template-breadcrumb-radius, 20px));',
    ]) {
      expect(breadcrumbSource, `Missing header-shell token wiring in AppBreadcrumbTemplate: ${requiredBreadcrumbSnippet}`).toContain(requiredBreadcrumbSnippet)
    }

    for (const requiredUserMenuSnippet of [
      'class="ntk-template-user-menu__trigger"',
      '--ntk-template-user-menu-surface-resolved: var(--ntk-template-user-menu-surface, var(--ntk-template-page-card-bg, var(--ntk-bg-card)));',
      '--ntk-template-user-menu-trigger-color: var(--ntk-template-layout-header-action-text, var(--ntk-template-shell-header-action-text, var(--ntk-template-layout-header-text, var(--ntk-text-primary))));',
      '--ntk-template-user-menu-trigger-hover-bg: var(--ntk-template-layout-header-action-hover-bg, var(--ntk-template-shell-header-action-hover-bg, color-mix(in srgb, var(--ntk-template-user-menu-trigger-color) 10%, transparent)));',
      '--ntk-template-user-menu-trigger-focus-ring: var(--ntk-template-layout-header-action-focus-ring, var(--ntk-template-shell-header-action-focus-ring, var(--ntk-border-focus, var(--ntk-accent))));',
      'background: var(--ntk-template-user-menu-trigger-hover-bg) !important;',
    ]) {
      expect(userMenuSource, `Missing header-action token wiring in UserMenuTemplate: ${requiredUserMenuSnippet}`).toContain(requiredUserMenuSnippet)
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
      "body[data-ntk-template-theme='true'] {",
      '.q-dialog__backdrop {',
      ':is(.q-menu, .q-popup-proxy, .q-dialog__inner > div, .q-dialog__inner > section, .q-dialog__inner > article, .q-dialog__inner > .q-card, .q-dialog-plugin) {',
      ':is(.q-item, .q-item__section, .q-item__label, .q-toolbar__title, .q-dialog__title, .q-dialog__message, .q-banner__title, .q-banner__message, .q-field__native, .q-field__input, .q-select__dropdown-icon, .q-checkbox__label, .q-radio__label) {',
      ':is(.q-table__container, .q-table, .q-table__middle, .q-table__top, .q-table__bottom) {',
      '.q-tooltip {',
      "body[data-ntk-template-theme='true'] :is(.q-field--filled, .q-field--outlined, .q-field--standout, .q-field--standard) .q-field__control {",
      "body[data-ntk-template-theme='true'] :is(.q-table__container, .q-table, .q-table__middle, .q-table__top, .q-table__bottom) {",
      "body[data-ntk-template-theme='true'] .q-notification {",
      "body[data-ntk-template-theme='true'] .text-primary,",
      "body[data-ntk-template-theme='true'] .bg-primary {",
      'background: var(--ntk-template-overlay-bg) !important;',
      'color: var(--ntk-template-overlay-text) !important;',
      'border: 1px solid var(--ntk-template-overlay-border) !important;',
      'box-shadow: var(--ntk-template-overlay-shadow) !important;',
    ]) {
      expect(bridgeSource, `Missing Quasar overlay bridge snippet: ${requiredBridgeSnippet}`).toContain(requiredBridgeSnippet)
    }

    for (const forbiddenGlobalBridgeSnippet of [
      'html[data-theme] {',
      'html[data-theme] :is(.q-field',
      'html[data-theme] :is(.q-table',
      'html[data-theme] .q-notification',
      '[data-theme] .text-primary',
      '[data-theme] .bg-primary',
      '[data-theme] .q-toggle__inner--truthy',
      '[data-theme] .q-checkbox__inner--truthy',
    ]) {
      expect(bridgeSource, `Quasar bridge override must stay template-scoped: ${forbiddenGlobalBridgeSnippet}`).not.toContain(forbiddenGlobalBridgeSnippet)
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

  it('keeps wiki and reference dark-contrast fixes routed through stable tokens', () => {
    const wikiSource = readRepoFile('../../../src/templates/features/wiki/WikiTemplate.vue')
    const wikiChatSource = readRepoFile('../../../src/templates/features/wiki/WikiChatTemplate.vue')
    const wikiChatDrawerSource = readRepoFile('../../../src/templates/features/wiki/WikiChatDrawerTemplate.vue')
    const topbarSource = readRepoFile('../../../src/templates/features/reference-system/components/ReferenceTopbarActions.vue')
    const catalogPanelSource = readRepoFile('../../../src/templates/features/reference-system/components/ReferenceReportCatalogPanel.vue')
    const presetSelectorSource = readRepoFile('../../../src/templates/features/reference-system/components/ReferencePresetSelectorBar.vue')
    const contextRailSource = readRepoFile('../../../src/templates/features/reference-system/components/ReferenceContextRailPanel.vue')
    const reportManagerSource = readRepoFile('../../../src/templates/features/reference-system/ReferenceReportManagerTemplate.vue')

    expect(wikiSource).toContain('--ntk-template-wiki-chip-info-bg: var(--semantic-info-bg')
    expect(wikiSource).toContain('--ntk-template-wiki-chip-danger-bg: var(--semantic-error-bg')
    expect(wikiSource).toContain('--ntk-template-wiki-tree-active-bg: var(--ntk-template-wiki-filter-active-bg);')
    expect(wikiSource).toContain('--ntk-template-wiki-filter-active-bg: var(--ntk-template-semantic-accent-emphasis-bg);')
    expect(wikiSource).toContain('--ntk-template-wiki-filter-active-text: var(--ntk-template-semantic-accent-emphasis-text);')
    expect(wikiSource).toContain('border-color: var(--ntk-template-wiki-filter-active-border);')

    expect(wikiChatSource).toContain('--ntk-template-wiki-chat-danger-text: var(--semantic-error-text')
    expect(wikiChatSource).toContain('--ntk-template-wiki-chat-send-disabled-bg: var(--ntk-template-wiki-chat-row-bg);')
    expect(wikiChatSource).toContain('box-shadow: inset 0 0 0 1px var(--ntk-template-wiki-chat-send-disabled-border);')

    expect(wikiChatDrawerSource).not.toMatch(/--(ntk-template-wiki-chat-drawer-[\w-]+):\s*var\(\s*--\1\s*,/m)
    expect(wikiChatDrawerSource).toContain('--ntk-template-wiki-chat-drawer-send-disabled-bg: var(')
    expect(wikiChatDrawerSource).toContain('--ntk-template-wiki-chat-drawer-send-disabled-border: var(')

    expect(topbarSource).toContain('--ntk-reference-topbar-popup-hover-bg:')
    expect(topbarSource).toContain('background: var(--ntk-reference-topbar-popup-hover-bg);')
    expect(topbarSource).toContain('color: var(--ntk-reference-topbar-popup-accent-text);')
    expect(topbarSource).not.toContain('background: color-mix(in srgb, var(--ntk-primary, var(--ntk-accent)) 10%, var(--ntk-template-popup-bg, var(--ntk-bg-card)));')

    expect(catalogPanelSource).toContain('--ntk-reference-catalog-panel-accent-soft-text: var(--ntk-reference-catalog-panel-text);')
    expect(catalogPanelSource).toContain('border: 1px solid var(--ntk-reference-catalog-panel-accent-soft-border);')

    expect(presetSelectorSource).toContain('--ntk-reference-preset-selector-bar-popup-hover-bg:')
    expect(presetSelectorSource).toContain('background: var(--ntk-reference-preset-selector-bar-popup-hover-bg);')

    expect(contextRailSource).toContain('--ntk-reference-context-rail-tone-info: var(--semantic-info-text')
    expect(contextRailSource).toContain('&--neutral { background: var(--ntk-reference-context-rail-tone-neutral); }')

    expect(reportManagerSource).toContain('--ntk-reference-manager-on-accent: var(--ntk-reference-on-accent, var(--ntk-text-on-primary, var(--ntk-text-on-accent, var(--ntk-text-inverse))));')
    expect(reportManagerSource).not.toContain('--ntk-reference-manager-on-accent: var(--ntk-reference-on-accent, var(--ntk-template-page-card-bg')
    expect(reportManagerSource).not.toContain('--ntk-reference-manager-on-accent: var(--ntk-reference-on-accent, var(--ntk-bg-')
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
