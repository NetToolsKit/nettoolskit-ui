import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

import {
  assertValidTokenSource,
  createTokenResolver,
  DEFAULT_GENERATED_TOKEN_CSS_OUTPUT_PATH,
  DEFAULT_GENERATED_TOKEN_DTS_OUTPUT_PATH,
  DEFAULT_GENERATED_TOKEN_TS_OUTPUT_PATH,
  DEFAULT_RESOLVER_OUTPUT_PATH,
  readTokenSource,
  resolveTokens,
} from './token-build.mjs'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))

export const DEFAULT_REPO_ROOT = path.resolve(scriptDirectory, '..')
export const DEFAULT_TOKEN_SOURCE_PATH = path.join(DEFAULT_REPO_ROOT, 'src/design-system/tokens/source.json')
export const DEFAULT_COMPONENT_SOURCE_PATHS = {
  contracts: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/contracts.ts'),
  button: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/button.ts'),
  field: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/field.ts'),
  card: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/card.ts'),
  table: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/table.ts'),
  page: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/page.ts'),
  section: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/section.ts'),
  pageHeader: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/page-header.ts'),
  toolbar: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/toolbar.ts'),
  filterBar: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/filter-bar.ts'),
  formLayout: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/form-layout.ts'),
  dialog: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/dialog.ts'),
  emptyState: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/empty-state.ts'),
  metricGrid: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/metric-grid.ts'),
  stateBlock: path.join(DEFAULT_REPO_ROOT, 'src/design-system/core/components/state-block.ts'),
}
export const DEFAULT_DOC_FILENAMES = {
  design: 'DESIGN.md',
  tokens: 'TOKENS.md',
  components: 'COMPONENTS.md',
}

const COMPONENT_CONFIGS = [
  {
    key: 'button',
    name: 'Button',
    contractName: 'NtkButtonContract',
    variantsExport: 'ntkButtonVariants',
    defaultsExport: 'ntkButtonDefaults',
    classMapExport: 'ntkButtonRecipeClassMap',
    purpose: 'Action trigger recipe for command, navigation, and submit buttons.',
  },
  {
    key: 'field',
    name: 'Field',
    contractName: 'NtkFieldContract',
    variantsExport: 'ntkFieldVariants',
    defaultsExport: 'ntkFieldDefaults',
    classMapExport: 'ntkFieldRecipeClassMap',
    purpose: 'Input wrapper recipe for labels, validation states, and form density.',
  },
  {
    key: 'card',
    name: 'Card',
    contractName: 'NtkCardContract',
    variantsExport: 'ntkCardVariants',
    defaultsExport: 'ntkCardDefaults',
    classMapExport: 'ntkCardRecipeClassMap',
    purpose: 'Content container recipe for panels, selectable rows, and accent treatments.',
  },
  {
    key: 'table',
    name: 'Table',
    contractName: 'NtkTableContract',
    variantsExport: 'ntkTableVariants',
    defaultsExport: 'ntkTableDefaults',
    classMapExport: 'ntkTableRecipeClassMap',
    purpose: 'Data table recipe for row lists, selectable records, and empty states.',
  },
  {
    key: 'page',
    name: 'Page',
    contractName: 'NtkPageContract',
    variantsExport: 'ntkPageVariants',
    defaultsExport: 'ntkPageDefaults',
    classMapExport: 'ntkPageRecipeClassMap',
    purpose: 'Page landmark recipe for primary content layouts and page headers.',
  },
  {
    key: 'section',
    name: 'Section',
    contractName: 'NtkSectionContract',
    variantsExport: 'ntkSectionVariants',
    defaultsExport: 'ntkSectionDefaults',
    classMapExport: 'ntkSectionRecipeClassMap',
    purpose: 'Section landmark recipe for grouped content, headings, and nested layout bands.',
  },
  {
    key: 'pageHeader',
    name: 'Page header',
    contractName: 'NtkPageHeaderContract',
    variantsExport: 'ntkPageHeaderVariants',
    defaultsExport: 'ntkPageHeaderDefaults',
    classMapExport: 'ntkPageHeaderRecipeClassMap',
    purpose: 'Page header recipe for titles, descriptions, breadcrumb, and action areas.',
  },
  {
    key: 'toolbar',
    name: 'Toolbar',
    contractName: 'NtkToolbarContract',
    variantsExport: 'ntkToolbarVariants',
    defaultsExport: 'ntkToolbarDefaults',
    classMapExport: 'ntkToolbarRecipeClassMap',
    purpose: 'Command toolbar recipe for dense action rows with density and alignment.',
  },
  {
    key: 'filterBar',
    name: 'Filter bar',
    contractName: 'NtkFilterBarContract',
    variantsExport: 'ntkFilterBarVariants',
    defaultsExport: 'ntkFilterBarDefaults',
    classMapExport: 'ntkFilterBarRecipeClassMap',
    purpose: 'Filter bar recipe for search, filter controls, and apply/reset actions.',
  },
  {
    key: 'formLayout',
    name: 'Form layout',
    contractName: 'NtkFormLayoutContract',
    variantsExport: 'ntkFormLayoutVariants',
    defaultsExport: 'ntkFormLayoutDefaults',
    classMapExport: 'ntkFormLayoutRecipeClassMap',
    purpose: 'Form layout recipe for responsive label, field grouping, and column density.',
  },
  {
    key: 'dialog',
    name: 'Dialog',
    contractName: 'NtkDialogContract',
    variantsExport: 'ntkDialogVariants',
    defaultsExport: 'ntkDialogDefaults',
    classMapExport: 'ntkDialogRecipeClassMap',
    purpose: 'Accessible modal recipe for title, body, and action content surfaces.',
  },
  {
    key: 'emptyState',
    name: 'Empty state',
    contractName: 'NtkEmptyStateContract',
    variantsExport: 'ntkEmptyStateVariants',
    defaultsExport: 'ntkEmptyStateDefaults',
    classMapExport: 'ntkEmptyStateRecipeClassMap',
    purpose: 'Empty state recipe for empty, no-results, and error placeholders with actions.',
  },
  {
    key: 'metricGrid',
    name: 'Metric grid',
    contractName: 'NtkMetricGridContract',
    variantsExport: 'ntkMetricGridVariants',
    defaultsExport: 'ntkMetricGridDefaults',
    classMapExport: 'ntkMetricGridRecipeClassMap',
    purpose: 'Metric grid recipe for responsive metric cards and dashboard summaries.',
  },
  {
    key: 'stateBlock',
    name: 'State block',
    contractName: 'NtkStateBlockContract',
    variantsExport: 'ntkStateBlockVariants',
    defaultsExport: 'ntkStateBlockDefaults',
    classMapExport: 'ntkStateBlockRecipeClassMap',
    purpose: 'State block recipe for loading, error, empty, success, and skeleton placeholders.',
  },
]
const VUE_WRAPPER_CONFIGS = [
  {
    name: 'DsButton',
    contractName: 'NtkButtonContract',
    sourcePath: 'src/design-system/vue/components/DsButton.vue',
    purpose: 'Native Vue button wrapper backed by the button contract and class recipe.',
  },
  {
    name: 'DsCard',
    contractName: 'NtkCardContract',
    sourcePath: 'src/design-system/vue/components/DsCard.vue',
    purpose: 'Native Vue card wrapper backed by the card contract and class recipe.',
  },
  {
    name: 'DsInput',
    contractName: 'NtkFieldContract',
    sourcePath: 'src/design-system/vue/components/DsInput.vue',
    purpose: 'Native Vue input wrapper backed by the field contract and class recipe.',
  },
  {
    name: 'DsSelect',
    contractName: 'NtkFieldContract',
    sourcePath: 'src/design-system/vue/components/DsSelect.vue',
    purpose: 'Native Vue select wrapper backed by the field contract and class recipe.',
  },
  {
    name: 'DsTable',
    contractName: 'NtkTableContract',
    sourcePath: 'src/design-system/vue/components/DsTable.vue',
    purpose: 'Native Vue table wrapper backed by the table contract and class recipe.',
  },
  {
    name: 'DsPage',
    contractName: 'NtkPageContract',
    sourcePath: 'src/design-system/vue/components/DsPage.vue',
    purpose: 'Native Vue page landmark backed by the page contract and class recipe.',
  },
  {
    name: 'DsSection',
    contractName: 'NtkSectionContract',
    sourcePath: 'src/design-system/vue/components/DsSection.vue',
    purpose: 'Native Vue section landmark backed by the section contract and class recipe.',
  },
  {
    name: 'DsPageHeader',
    contractName: 'NtkPageHeaderContract',
    sourcePath: 'src/design-system/vue/components/DsPageHeader.vue',
    purpose: 'Native Vue page header backed by the page header contract and class recipe.',
  },
  {
    name: 'DsToolbar',
    contractName: 'NtkToolbarContract',
    sourcePath: 'src/design-system/vue/components/DsToolbar.vue',
    purpose: 'Native Vue command toolbar backed by the toolbar contract and class recipe.',
  },
  {
    name: 'DsFilterBar',
    contractName: 'NtkFilterBarContract',
    sourcePath: 'src/design-system/vue/components/DsFilterBar.vue',
    purpose: 'Native Vue filter bar backed by the filter bar contract and class recipe.',
  },
  {
    name: 'DsFormLayout',
    contractName: 'NtkFormLayoutContract',
    sourcePath: 'src/design-system/vue/components/DsFormLayout.vue',
    purpose: 'Native Vue form layout backed by the form layout contract and class recipe.',
  },
  {
    name: 'DsDialog',
    contractName: 'NtkDialogContract',
    sourcePath: 'src/design-system/vue/components/DsDialog.vue',
    purpose: 'Native dialog modal backed by the dialog contract and class recipe.',
  },
  {
    name: 'DsEmptyState',
    contractName: 'NtkEmptyStateContract',
    sourcePath: 'src/design-system/vue/components/DsEmptyState.vue',
    purpose: 'Native Vue empty state backed by the empty state contract and class recipe.',
  },
  {
    name: 'DsMetricGrid',
    contractName: 'NtkMetricGridContract',
    sourcePath: 'src/design-system/vue/components/DsMetricGrid.vue',
    purpose: 'Native Vue metric grid backed by the metric grid contract and class recipe.',
  },
  {
    name: 'DsStateBlock',
    contractName: 'NtkStateBlockContract',
    sourcePath: 'src/design-system/vue/components/DsStateBlock.vue',
    purpose: 'Native Vue state block backed by the state block contract and class recipe.',
  },
]

const DOC_ORDER = ['design', 'tokens', 'components']
const FORBIDDEN_DOC_WORDS = [
  new RegExp(`\\b${'canon'}${'ical'}\\b`, 'i'),
  new RegExp(`\\b${'can'}\\u00f4nica\\b`, 'i'),
]

function normalizePathForMarkdown(value) {
  return value.split(path.sep).join('/')
}

function toRepoPath(filePath, repoRoot) {
  const relativePath = path.relative(repoRoot, filePath)

  if (relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
    return normalizePathForMarkdown(relativePath)
  }

  return path.basename(filePath)
}

function toDisplayPath(filePath, repoRoot) {
  return toRepoPath(filePath, repoRoot)
}

function code(value) {
  return `\`${String(value).replace(/\\/g, '\\\\').replace(/`/g, '\\`')}\``
}

function textCell(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

function codeCell(value) {
  return code(textCell(value))
}

function listCode(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 'None'
  }

  return values.map(value => code(value)).join(', ')
}

function titleCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_.]/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase())
}

function joinMarkdownLines(lines) {
  const normalizedLines = [...lines]

  while (normalizedLines.at(-1) === '') {
    normalizedLines.pop()
  }

  return normalizedLines.join('\n')
}

function getDefaultDocOutputPaths(repoRoot) {
  return Object.fromEntries(
    Object.entries(DEFAULT_DOC_FILENAMES).map(([key, filename]) => [key, path.join(repoRoot, 'docs', filename)]),
  )
}

export function getDesignSystemDocOutputPaths(options = {}) {
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT

  if (options.outputDirectory) {
    return Object.fromEntries(
      Object.entries(DEFAULT_DOC_FILENAMES).map(([key, filename]) => [key, path.join(options.outputDirectory, filename)]),
    )
  }

  return {
    ...getDefaultDocOutputPaths(repoRoot),
    ...(options.outputPaths ?? {}),
  }
}

function unwrapExpression(expression) {
  let current = expression

  while (current) {
    if (ts.isAsExpression(current) || ts.isParenthesizedExpression(current)) {
      current = current.expression
      continue
    }

    if (typeof ts.isSatisfiesExpression === 'function' && ts.isSatisfiesExpression(current)) {
      current = current.expression
      continue
    }

    return current
  }

  return expression
}

function propertyNameText(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text
  }

  return name.getText()
}

function literalValue(expression, sourceFile) {
  const node = unwrapExpression(expression)

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }

  if (ts.isNumericLiteral(node)) {
    return node.text
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(element => literalValue(element, sourceFile))
  }

  if (ts.isObjectLiteralExpression(node)) {
    const output = {}

    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property)) {
        output[propertyNameText(property.name)] = literalValue(property.initializer, sourceFile)
      }
    }

    return output
  }

  return node.getText(sourceFile)
}

function readExportedConst(sourceFile, exportName) {
  let found

  function visit(node) {
    if (found || !ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name)) {
      ts.forEachChild(node, visit)
      return
    }

    if (node.name.text === exportName && node.initializer) {
      found = literalValue(node.initializer, sourceFile)
      return
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  if (found === undefined) {
    throw new Error(`Unable to find exported const ${exportName}.`)
  }

  return found
}

function normalizeTypeText(value) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*\|\s*/g, ' | ')
    .replace(/\s*<\s*/g, '<')
    .replace(/\s*>\s*/g, '>')
    .trim()
}

function readInterfaceProperties(sourceFile, interfaceName) {
  let properties

  function visit(node) {
    if (properties || !ts.isInterfaceDeclaration(node) || node.name.text !== interfaceName) {
      ts.forEachChild(node, visit)
      return
    }

    properties = node.members
      .filter(ts.isPropertySignature)
      .map(member => ({
        name: propertyNameText(member.name),
        optional: Boolean(member.questionToken),
        type: member.type ? normalizeTypeText(member.type.getText(sourceFile)) : 'unknown',
      }))
  }

  visit(sourceFile)

  if (!properties) {
    throw new Error(`Unable to find interface ${interfaceName}.`)
  }

  return properties
}

function parseTsSource(sourceText, sourcePath) {
  return ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
}

function createComponentModel(config, sourceFile, sourcePath, repoRoot, shared) {
  return {
    key: config.key,
    name: config.name,
    sourcePath: toRepoPath(sourcePath, repoRoot),
    purpose: config.purpose,
    variants: readExportedConst(sourceFile, config.variantsExport),
    sizes: shared.sizes,
    intents: shared.intents,
    defaults: readExportedConst(sourceFile, config.defaultsExport),
    classMap: readExportedConst(sourceFile, config.classMapExport),
    contract: {
      name: config.contractName,
      baseProperties: shared.baseProperties,
      properties: readInterfaceProperties(sourceFile, config.contractName),
    },
  }
}

function groupTokensByTopLevel(tokens) {
  const groups = new Map()

  for (const token of tokens) {
    const groupName = token.pathSegments[0] ?? 'other'
    const groupTokens = groups.get(groupName) ?? []
    groupTokens.push(token)
    groups.set(groupName, groupTokens)
  }

  return groups
}

function getTokenGroupDescriptions(tokenSource) {
  return Object.fromEntries(
    Object.entries(tokenSource)
      .filter(([, value]) => value && typeof value === 'object' && !Array.isArray(value))
      .map(([key, value]) => [key, typeof value.$description === 'string' ? value.$description : '']),
  )
}

function countTokensByType(tokens) {
  const counts = new Map()

  for (const token of tokens) {
    counts.set(token.type, (counts.get(token.type) ?? 0) + 1)
  }

  return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right))
}

function flattenClassMap(classMap) {
  const rows = [{ slot: 'root', className: classMap.root }]
  const groupLabels = {
    variants: 'variant',
    sizes: 'size',
    intents: 'intent',
    states: 'state',
  }

  for (const [group, label] of Object.entries(groupLabels)) {
    for (const [key, className] of Object.entries(classMap[group] ?? {})) {
      rows.push({ slot: `${label} ${key}`, className })
    }
  }

  return rows
}

export async function readDesignSystemSources(options = {}) {
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT
  const tokenSourcePath = options.tokenSourcePath ?? DEFAULT_TOKEN_SOURCE_PATH
  const componentSourcePaths = {
    ...DEFAULT_COMPONENT_SOURCE_PATHS,
    ...(options.componentSourcePaths ?? {}),
  }
  const [tokenSource, contractsText, ...componentTexts] = await Promise.all([
    readTokenSource(tokenSourcePath),
    readFile(componentSourcePaths.contracts, 'utf8'),
    ...COMPONENT_CONFIGS.map(config => readFile(componentSourcePaths[config.key], 'utf8')),
  ])
  const contractsSourceFile = parseTsSource(contractsText, componentSourcePaths.contracts)
  const shared = {
    sizes: readExportedConst(contractsSourceFile, 'ntkComponentSizes'),
    intents: readExportedConst(contractsSourceFile, 'ntkComponentIntents'),
    baseProperties: readInterfaceProperties(contractsSourceFile, 'NtkComponentContractBase'),
  }
  const components = COMPONENT_CONFIGS.map((config, index) => {
    const sourcePath = componentSourcePaths[config.key]
    const sourceFile = parseTsSource(componentTexts[index], sourcePath)
    return createComponentModel(config, sourceFile, sourcePath, repoRoot, shared)
  })

  assertValidTokenSource(tokenSource)

  const tokens = resolveTokens(tokenSource)
  const sourcePaths = {
    tokenSource: toRepoPath(tokenSourcePath, repoRoot),
    tokenResolver: toRepoPath(DEFAULT_RESOLVER_OUTPUT_PATH, repoRoot),
    tokenCss: toRepoPath(DEFAULT_GENERATED_TOKEN_CSS_OUTPUT_PATH, repoRoot),
    tokenTs: toRepoPath(DEFAULT_GENERATED_TOKEN_TS_OUTPUT_PATH, repoRoot),
    tokenDts: toRepoPath(DEFAULT_GENERATED_TOKEN_DTS_OUTPUT_PATH, repoRoot),
    contracts: toRepoPath(componentSourcePaths.contracts, repoRoot),
    components: Object.fromEntries(
      COMPONENT_CONFIGS.map(config => [config.key, toRepoPath(componentSourcePaths[config.key], repoRoot)]),
    ),
  }

  return {
    repoRoot,
    sourcePaths,
    tokenSource,
    tokenResolver: createTokenResolver(tokenSource),
    tokens,
    tokenGroups: groupTokensByTopLevel(tokens),
    tokenGroupDescriptions: getTokenGroupDescriptions(tokenSource),
    tokenTypeCounts: countTokensByType(tokens),
    shared,
    components,
  }
}

function generateDesignOverviewDoc(model) {
  const lines = [
    '# NetToolsKit Design System',
    '',
    'Generated by `scripts/design-system-docs.mjs` from repository design-system sources.',
    'Do not edit by hand.',
    '',
    '## Source Artifacts',
    '',
    '| Area | Source |',
    '| --- | --- |',
    `| Tokens | ${code(model.sourcePaths.tokenSource)} |`,
    `| Token resolver | ${code(model.sourcePaths.tokenResolver)} |`,
    `| Token CSS output | ${code(model.sourcePaths.tokenCss)} |`,
    `| Token TypeScript output | ${code(model.sourcePaths.tokenTs)} |`,
    `| Token declaration output | ${code(model.sourcePaths.tokenDts)} |`,
    `| Shared component primitives | ${code(model.sourcePaths.contracts)} |`,
    ...model.components.map(component => `| ${component.name} recipe | ${code(component.sourcePath)} |`),
    '',
    '## Token Model',
    '',
    `- Total tokens: ${model.tokens.length}.`,
    `- Resolver entries: ${Object.keys(model.tokenResolver.tokens).length}.`,
    `- Token groups: ${[...model.tokenGroups.keys()].map(group => code(group)).join(', ')}.`,
    `- Token types: ${model.tokenTypeCounts.map(([type, count]) => `${code(type)} (${count})`).join(', ')}.`,
    '- Public CSS variables use the `--ntk-*` namespace.',
    '- Token references are resolved for documentation while CSS output keeps `var(--ntk-*)` links where possible.',
    '- `resolver.json` maps token paths, groups, types, references, and CSS variables for runtime adapters.',
    '',
    '## Component Recipe Model',
    '',
    '| Component | Default variant | Default size | Default intent | Variants | States |',
    '| --- | --- | --- | --- | --- | --- |',
    ...model.components.map(component => {
      const states = Object.keys(component.classMap.states ?? {})
      return [
        `| ${component.name}`,
        codeCell(component.defaults.variant),
        codeCell(component.defaults.size),
        codeCell(component.defaults.intent),
        listCode(component.variants),
        listCode(states),
      ].join(' | ') + ' |'
    }),
    '',
    '## Usage Rules',
    '',
    '- Use design tokens through `var(--ntk-*)` CSS custom properties in component styles.',
    '- Use recipe resolvers when wrappers need stable class names for variants, sizes, intents, and states.',
    '- Keep component defaults aligned with the exported recipe defaults.',
    '- Use `Ds*` Vue wrappers when a feature needs a rendered design-system primitive instead of a pure recipe.',
    '- Keep generated markdown synchronized with `node scripts/design-system-docs.mjs --check`.',
    '',
    '## Documentation Outputs',
    '',
    '| File | Contents |',
    '| --- | --- |',
    '| `docs/DESIGN.md` | System overview, sources, and usage rules. |',
    '| `docs/TOKENS.md` | Token groups and resolved CSS variable reference. |',
    '| `docs/COMPONENTS.md` | Component contracts, defaults, variants, and class maps. |',
    '',
  ]

  return joinMarkdownLines(lines)
}

function generateTokensDoc(model) {
  const lines = [
    '# Design Tokens',
    '',
    `Generated from ${code(model.sourcePaths.tokenSource)}.`,
    'Do not edit by hand.',
    '',
    '## Summary',
    '',
    '| Group | Tokens | Description |',
    '| --- | ---: | --- |',
  ]

  for (const [groupName, groupTokens] of model.tokenGroups.entries()) {
    lines.push(`| ${code(groupName)} | ${groupTokens.length} | ${textCell(model.tokenGroupDescriptions[groupName])} |`)
  }

  lines.push(
    '',
    `Resolver: ${code(model.sourcePaths.tokenResolver)}.`,
    '',
    '## Token Reference',
    '',
    'Values are resolved. CSS values keep token references as CSS custom properties when a token points to another token.',
    '',
  )

  for (const [groupName, groupTokens] of model.tokenGroups.entries()) {
    lines.push(
      `### ${titleCase(groupName)}`,
      '',
      '| Token | Type | CSS variable | Value | CSS value |',
      '| --- | --- | --- | --- | --- |',
    )

    for (const token of groupTokens) {
      lines.push([
        `| ${codeCell(token.path)}`,
        codeCell(token.type),
        codeCell(token.cssVariable),
        codeCell(token.value),
        codeCell(token.cssValue),
      ].join(' | ') + ' |')
    }

    lines.push('')
  }

  return joinMarkdownLines(lines)
}

function generateContractRows(component) {
  return [
    ...component.contract.baseProperties.map(property => ({ ...property, source: 'base' })),
    ...component.contract.properties.map(property => ({ ...property, source: component.contract.name })),
  ]
}

function generateComponentsDoc(model) {
  const lines = [
    '# Component Recipes',
    '',
    `Generated from ${[model.sourcePaths.contracts, ...model.components.map(component => component.sourcePath)].map(sourcePath => code(sourcePath)).join(', ')}.`,
    'Do not edit by hand.',
    '',
    '## Shared Primitives',
    '',
    `- Sizes: ${listCode(model.shared.sizes)}.`,
    `- Intents: ${listCode(model.shared.intents)}.`,
    '',
    '## Vue Wrappers',
    '',
    '| Component | Contract | Source | Purpose |',
    '| --- | --- | --- | --- |',
    ...VUE_WRAPPER_CONFIGS.map(wrapper => [
      `| ${wrapper.name}`,
      codeCell(wrapper.contractName),
      codeCell(wrapper.sourcePath),
      textCell(wrapper.purpose),
    ].join(' | ') + ' |'),
    '',
  ]

  for (const component of model.components) {
    const states = Object.keys(component.classMap.states ?? {})
    lines.push(
      `## ${component.name}`,
      '',
      component.purpose,
      '',
      `Source: ${code(component.sourcePath)}.`,
      '',
      '| Setting | Values |',
      '| --- | --- |',
      `| Defaults | variant ${code(component.defaults.variant)}, size ${code(component.defaults.size)}, intent ${code(component.defaults.intent)} |`,
      `| Variants | ${listCode(component.variants)} |`,
      `| Sizes | ${listCode(component.sizes)} |`,
      `| Intents | ${listCode(component.intents)} |`,
      `| States | ${listCode(states)} |`,
      '',
      '### Contract Props',
      '',
      '| Prop | Optional | Type | Source |',
      '| --- | --- | --- | --- |',
    )

    for (const property of generateContractRows(component)) {
      lines.push([
        `| ${codeCell(property.name)}`,
        property.optional ? 'Yes' : 'No',
        codeCell(property.type),
        codeCell(property.source),
      ].join(' | ') + ' |')
    }

    lines.push(
      '',
      '### Class Map',
      '',
      '| Slot | Class |',
      '| --- | --- |',
    )

    for (const row of flattenClassMap(component.classMap)) {
      lines.push(`| ${codeCell(row.slot)} | ${codeCell(row.className)} |`)
    }

    lines.push('')
  }

  return joinMarkdownLines(lines)
}

export function assertGeneratedDocsCompliant(docs) {
  const entries = typeof docs === 'string' ? [['document', docs]] : Object.entries(docs)

  for (const [name, content] of entries) {
    if (!/^[\x09\x0a\x0d\x20-\x7e]*$/.test(content)) {
      throw new Error(`${name} contains non-ASCII text.`)
    }

    for (const pattern of FORBIDDEN_DOC_WORDS) {
      if (pattern.test(content)) {
        throw new Error(`${name} contains a forbidden word.`)
      }
    }
  }
}

export async function generateDesignSystemDocs(options = {}) {
  const model = options.model ?? await readDesignSystemSources(options)
  const docs = {
    design: generateDesignOverviewDoc(model),
    tokens: generateTokensDoc(model),
    components: generateComponentsDoc(model),
  }

  assertGeneratedDocsCompliant(docs)

  return {
    docs,
    model,
  }
}

export async function writeDesignSystemDocs(options = {}) {
  const outputPaths = getDesignSystemDocOutputPaths(options)
  const { docs, model } = await generateDesignSystemDocs(options)

  await Promise.all(DOC_ORDER.map(async key => {
    await mkdir(path.dirname(outputPaths[key]), { recursive: true })
    await writeFile(outputPaths[key], docs[key], 'utf8')
  }))

  return {
    outputPaths,
    tokenCount: model.tokens.length,
    componentCount: model.components.length,
  }
}

async function readActualDoc(filePath) {
  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return undefined
    }

    throw error
  }
}

export async function checkDesignSystemDocs(options = {}) {
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT
  const outputPaths = getDesignSystemDocOutputPaths(options)
  const { docs, model } = await generateDesignSystemDocs(options)
  const actualDocs = await Promise.all(DOC_ORDER.map(key => readActualDoc(outputPaths[key])))
  const mismatches = []

  for (const [index, key] of DOC_ORDER.entries()) {
    if (actualDocs[index] !== docs[key]) {
      mismatches.push(toDisplayPath(outputPaths[key], repoRoot))
    }
  }

  return {
    ok: mismatches.length === 0,
    mismatches,
    tokenCount: model.tokens.length,
    componentCount: model.components.length,
  }
}

export function parseDesignSystemDocsCliArgs(argv) {
  const unknownArgs = argv.filter(arg => arg !== '--check')

  if (unknownArgs.length > 0) {
    throw new Error(`Unknown argument: ${unknownArgs.join(', ')}`)
  }

  return {
    check: argv.includes('--check'),
  }
}

async function runCli() {
  const args = parseDesignSystemDocsCliArgs(process.argv.slice(2))

  if (args.check) {
    const result = await checkDesignSystemDocs()

    if (!result.ok) {
      throw new Error(`Generated design-system docs are stale: ${result.mismatches.join(', ')}`)
    }

    console.log(`Design-system docs are up to date (${result.tokenCount} tokens, ${result.componentCount} components).`)
    return
  }

  const result = await writeDesignSystemDocs()
  console.log(`Generated design-system docs (${result.tokenCount} tokens, ${result.componentCount} components).`)

  for (const key of DOC_ORDER) {
    console.log(toDisplayPath(result.outputPaths[key], DEFAULT_REPO_ROOT))
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ''

if (import.meta.url === invokedPath) {
  runCli().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}