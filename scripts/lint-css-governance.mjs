import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))

export const DEFAULT_REPO_ROOT = path.resolve(scriptDirectory, '..')
export const DEFAULT_BASELINE_PATH = path.join(
  DEFAULT_REPO_ROOT,
  'tests/architecture/design-system-governance.baseline.json',
)

export const GOVERNANCE_METRICS = Object.freeze([
  'directQuasarTags',
  'quasarClassSelectors',
  'unmanagedDeepSelectors',
  'importantDeclarations',
  'rawHexColors',
])

export const SOURCE_EXTENSIONS = Object.freeze(['.css', '.scss', '.ts', '.vue'])

export const GOVERNANCE_POLICIES = Object.freeze({
  directQuasarTags: {
    label: 'direct q-* tags',
    pattern: /<\/?q-[a-z][\w-]*/g,
  },
  quasarClassSelectors: {
    label: 'Quasar class selectors',
    pattern: /(^|[^\w-])(?<value>\.q-[\w-]+)/g,
  },
  unmanagedDeepSelectors: {
    label: ':deep() selectors',
    pattern: /:deep\(/g,
  },
  importantDeclarations: {
    label: '!important declarations',
    pattern: /!important\b/g,
  },
  rawHexColors: {
    label: 'raw hex colors',
    pattern: /(^|[^\w-])(?<value>#[0-9a-fA-F]{3,8})(?![\w-])/g,
  },
})

function createEmptyMetrics() {
  return Object.fromEntries(GOVERNANCE_METRICS.map(metric => [metric, 0]))
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/')
}

function sortPaths(left, right) {
  return left.localeCompare(right)
}

function toAbsolutePath(repoRoot, maybeRelativePath) {
  return path.isAbsolute(maybeRelativePath)
    ? maybeRelativePath
    : path.join(repoRoot, maybeRelativePath)
}

function normalizeBaseline(baseline) {
  const metrics = createEmptyMetrics()

  for (const metric of GOVERNANCE_METRICS) {
    const value = baseline?.metrics?.[metric]
    metrics[metric] = Number.isFinite(value) ? value : 0
  }

  return {
    schemaVersion: baseline?.schemaVersion ?? 1,
    scannedRoots: Array.isArray(baseline?.scannedRoots) ? baseline.scannedRoots : [],
    scannedFiles: Number.isFinite(baseline?.scannedFiles) ? baseline.scannedFiles : 0,
    metrics,
  }
}

function createRegExp(pattern) {
  return new RegExp(pattern.source, pattern.flags)
}

function locateMatch(source, index) {
  let line = 1
  let column = 1

  for (let cursor = 0; cursor < index; cursor += 1) {
    if (source.charCodeAt(cursor) === 10) {
      line += 1
      column = 1
      continue
    }

    column += 1
  }

  return { line, column }
}

function toPolicyMatch(match, source, metric) {
  const matchedText = match[0]
  const value = match.groups?.value ?? matchedText
  const offset = matchedText.indexOf(value)
  const index = match.index + (offset >= 0 ? offset : 0)
  const location = locateMatch(source, index)

  return {
    metric,
    line: location.line,
    column: location.column,
    value,
  }
}

function collectPolicyMatches(source, metric) {
  const pattern = createRegExp(GOVERNANCE_POLICIES[metric].pattern)
  return [...source.matchAll(pattern)].map(match => toPolicyMatch(match, source, metric))
}

async function readGovernedFiles(repoRoot, relativeRoot, extensions) {
  const absoluteRoot = toAbsolutePath(repoRoot, relativeRoot)
  const files = []

  async function visit(absoluteDirectory) {
    const entries = await readdir(absoluteDirectory, { withFileTypes: true })

    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const absolutePath = path.join(absoluteDirectory, entry.name)

      if (entry.isDirectory()) {
        await visit(absolutePath)
        continue
      }

      if (entry.isFile() && extensions.has(path.extname(entry.name))) {
        files.push(normalizePath(path.relative(repoRoot, absolutePath)))
      }
    }
  }

  await visit(absoluteRoot)
  return files.sort(sortPaths)
}

export async function readGovernanceBaseline(baselinePath = DEFAULT_BASELINE_PATH) {
  const source = await readFile(baselinePath, 'utf8')
  return normalizeBaseline(JSON.parse(source))
}

export async function collectCssGovernanceMetrics(options = {}) {
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT)
  const extensions = new Set(options.sourceExtensions ?? SOURCE_EXTENSIONS)
  const scannedRoots = options.scannedRoots ?? []
  const files = options.files
    ? options.files.map(normalizePath).sort(sortPaths)
    : (await Promise.all(scannedRoots.map(root => readGovernedFiles(repoRoot, root, extensions))))
      .flat()
      .sort(sortPaths)
  const metrics = createEmptyMetrics()
  const samples = Object.fromEntries(GOVERNANCE_METRICS.map(metric => [metric, []]))

  for (const filePath of files) {
    const source = await readFile(path.join(repoRoot, filePath), 'utf8')

    for (const metric of GOVERNANCE_METRICS) {
      const matches = collectPolicyMatches(source, metric)
      metrics[metric] += matches.length

      for (const match of matches) {
        if (samples[metric].length >= 10) {
          break
        }

        samples[metric].push({
          filePath,
          line: match.line,
          column: match.column,
          value: match.value,
        })
      }
    }
  }

  return {
    scannedRoots: [...scannedRoots],
    scannedFiles: files.length,
    files,
    metrics,
    samples,
  }
}

export function compareCssGovernanceMetrics(current, baseline) {
  const normalizedBaseline = normalizeBaseline(baseline)
  const deltas = createEmptyMetrics()
  const exceededMetrics = []

  for (const metric of GOVERNANCE_METRICS) {
    deltas[metric] = current.metrics[metric] - normalizedBaseline.metrics[metric]

    if (deltas[metric] > 0) {
      exceededMetrics.push(metric)
    }
  }

  return {
    ok: exceededMetrics.length === 0,
    baseline: normalizedBaseline,
    deltas,
    exceededMetrics,
  }
}

export async function lintCssGovernance(options = {}) {
  const baseline = normalizeBaseline(
    options.baseline ?? await readGovernanceBaseline(options.baselinePath ?? DEFAULT_BASELINE_PATH),
  )
  const scannedRoots = options.scannedRoots ?? baseline.scannedRoots
  const current = await collectCssGovernanceMetrics({
    ...options,
    scannedRoots,
  })
  const comparison = compareCssGovernanceMetrics(current, baseline)

  return {
    ok: comparison.ok,
    scannedRoots: current.scannedRoots,
    scannedFiles: current.scannedFiles,
    metrics: current.metrics,
    baseline: {
      scannedFiles: comparison.baseline.scannedFiles,
      metrics: comparison.baseline.metrics,
    },
    deltas: comparison.deltas,
    exceededMetrics: comparison.exceededMetrics,
    samples: Object.fromEntries(
      comparison.exceededMetrics.map(metric => [metric, current.samples[metric]]),
    ),
  }
}

export function formatLintResult(result) {
  if (result.ok) {
    return `CSS governance lint passed (${result.scannedFiles} files scanned).`
  }

  const lines = ['CSS governance lint failed: policy counts exceeded the baseline.']

  for (const metric of result.exceededMetrics) {
    const policy = GOVERNANCE_POLICIES[metric]
    const current = result.metrics[metric]
    const allowed = result.baseline.metrics[metric]
    const delta = result.deltas[metric]

    lines.push(`- ${policy.label}: ${current} > ${allowed} (+${delta})`)

    for (const sample of result.samples[metric] ?? []) {
      lines.push(`  ${sample.filePath}:${sample.line}:${sample.column} ${sample.value}`)
    }
  }

  return lines.join('\n')
}

function readArgValue(argv, index, name) {
  const arg = argv[index]
  const inlinePrefix = `${name}=`

  if (arg.startsWith(inlinePrefix)) {
    return { value: arg.slice(inlinePrefix.length), nextIndex: index }
  }

  if (arg === name) {
    return { value: argv[index + 1], nextIndex: index + 1 }
  }

  return undefined
}

export function parseCliArgs(argv) {
  const args = {
    baselinePath: DEFAULT_BASELINE_PATH,
    format: 'text',
    help: false,
    repoRoot: DEFAULT_REPO_ROOT,
    scannedRoots: [],
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      args.help = true
      continue
    }

    const format = readArgValue(argv, index, '--format')
    if (format) {
      args.format = format.value
      index = format.nextIndex
      continue
    }

    const baseline = readArgValue(argv, index, '--baseline')
    if (baseline) {
      args.baselinePath = baseline.value
      index = baseline.nextIndex
      continue
    }

    const repoRoot = readArgValue(argv, index, '--repo-root')
    if (repoRoot) {
      args.repoRoot = repoRoot.value
      index = repoRoot.nextIndex
      continue
    }

    const root = readArgValue(argv, index, '--root')
    if (root) {
      args.scannedRoots.push(root.value)
      index = root.nextIndex
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!['json', 'text'].includes(args.format)) {
    throw new Error(`Unsupported format: ${args.format}`)
  }

  return args
}

function getUsage() {
  return [
    'Usage: node scripts/lint-css-governance.mjs [options]',
    '',
    'Options:',
    '  --format=text|json     Output format. Default: text.',
    '  --baseline <path>      Baseline JSON path.',
    '  --repo-root <path>     Repository root. Default: current script root.',
    '  --root <path>          Governed root to scan. Can be repeated.',
    '  --help                 Show this help.',
  ].join('\n')
}

export async function runCli(argv = process.argv.slice(2), io = {}) {
  const stdout = io.stdout ?? console.log
  const args = parseCliArgs(argv)

  if (args.help) {
    stdout(getUsage())
    return 0
  }

  const repoRoot = path.resolve(args.repoRoot)
  const baselinePath = path.resolve(repoRoot, args.baselinePath)
  const result = await lintCssGovernance({
    baselinePath,
    repoRoot,
    scannedRoots: args.scannedRoots.length > 0 ? args.scannedRoots : undefined,
  })

  if (args.format === 'json') {
    stdout(JSON.stringify(result, null, 2))
  } else {
    stdout(formatLintResult(result))
  }

  return result.ok ? 0 : 1
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ''

if (import.meta.url === invokedPath) {
  runCli().then(exitCode => {
    process.exitCode = exitCode
  }).catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}