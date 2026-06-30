import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))

export const DEFAULT_REPO_ROOT = path.resolve(scriptDirectory, '..')
export const DEFAULT_MANIFEST_PATH = path.join(
  DEFAULT_REPO_ROOT,
  'planning/architecture/layers.json',
)

const SOURCE_EXTENSIONS = Object.freeze(['.ts', '.tsx', '.vue', '.mts'])
const RESOLVE_EXTENSIONS = Object.freeze(['', '.ts', '.tsx', '.vue', '.mts', '.js', '.mjs'])

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/')
}

// Convert a glob (supporting ** and *) into an anchored RegExp over POSIX paths.
function globToRegExp(glob) {
  let pattern = ''
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index]
    if (char === '*') {
      if (glob[index + 1] === '*') {
        // ** matches across path segments; consume an optional trailing slash.
        pattern += '.*'
        index += 1
        if (glob[index + 1] === '/') index += 1
      } else {
        pattern += '[^/]*'
      }
      continue
    }
    pattern += char.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp(`^${pattern}$`)
}

export function loadManifestModel(manifest) {
  const layers = Object.entries(manifest.layers).map(([id, layer]) => ({
    id,
    label: layer.label ?? id,
    globs: layer.globs ?? [],
    matchers: (layer.globs ?? []).map(globToRegExp),
  }))
  return { layers, rules: manifest.rules?.edges ?? [] }
}

// The directory portion of a glob before its first wildcard, e.g.
// 'src/design-system/vue/components/Ds*.vue' -> 'src/design-system/vue/components'.
export function globScanRoot(glob) {
  const firstWildcard = glob.search(/[*?[]/)
  const literal = firstWildcard === -1 ? glob : glob.slice(0, firstWildcard)
  const slash = literal.lastIndexOf('/')
  return slash === -1 ? '' : literal.slice(0, slash)
}

// First glob match across all layers wins, in manifest declaration order, so a
// composite (DsCrudPage.vue) listed before the generic Ds*.vue resolves to L1.
export function classifyPath(relativePath, model) {
  const normalized = normalizePath(relativePath)
  for (const layer of model.layers) {
    for (const matcher of layer.matchers) {
      if (matcher.test(normalized)) return layer.id
    }
  }
  return null
}

const IMPORT_PATTERNS = [
  /\bimport\s+[^'"]*?from\s*['"]([^'"]+)['"]/g,
  /\bexport\s+[^'"]*?from\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bimport\s+['"]([^'"]+)['"]/g,
]

export function extractImportSpecifiers(source) {
  // Strip <style> blocks so CSS @import noise does not count as a JS import.
  const code = source.replace(/<style[\s\S]*?<\/style>/gi, '')
  const specifiers = new Set()
  for (const pattern of IMPORT_PATTERNS) {
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(code)) !== null) {
      specifiers.add(match[1])
    }
  }
  return [...specifiers]
}

async function pathExists(absolutePath) {
  try {
    await stat(absolutePath)
    return true
  } catch {
    return false
  }
}

// Resolve a relative import specifier to a repo-relative file path (best effort:
// tries known source extensions and index files). Bare specifiers return null.
async function resolveRelativeImport(repoRoot, fromRelative, specifier) {
  if (!specifier.startsWith('.')) return null
  const fromDir = path.dirname(path.join(repoRoot, fromRelative))
  const base = path.resolve(fromDir, specifier)
  for (const extension of RESOLVE_EXTENSIONS) {
    const candidate = base + extension
    if (await pathExists(candidate) && (await stat(candidate)).isFile()) {
      return normalizePath(path.relative(repoRoot, candidate))
    }
  }
  for (const extension of RESOLVE_EXTENSIONS.filter(Boolean)) {
    const candidate = path.join(base, `index${extension}`)
    if (await pathExists(candidate)) {
      return normalizePath(path.relative(repoRoot, candidate))
    }
  }
  return null
}

async function collectSourceFiles(repoRoot, model) {
  const roots = new Set()
  for (const layer of model.layers) {
    for (const glob of layer.globs) {
      const root = globScanRoot(glob)
      if (root) roots.add(root)
    }
  }
  // Drop roots that are nested under another scanned root to avoid double-visits.
  const rootList = [...roots].sort()
  const topRoots = rootList.filter(root => !rootList.some(other => other !== root && root.startsWith(`${other}/`)))
  const files = []
  async function visit(relativeDir) {
    const absolute = path.join(repoRoot, relativeDir)
    let entries
    try {
      entries = await readdir(absolute, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = normalizePath(path.join(relativeDir, entry.name))
      if (entry.isDirectory()) {
        await visit(relative)
      } else if (entry.isFile() && SOURCE_EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(relative)
      }
    }
  }
  for (const root of topRoots) {
    await visit(root)
  }
  return [...new Set(files)].sort()
}

export async function checkLayers(options = {}) {
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT)
  const manifestPath = options.manifestPath ?? DEFAULT_MANIFEST_PATH
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const model = loadManifestModel(manifest)
  const rulesByLayer = new Map()
  for (const rule of model.rules) {
    rulesByLayer.set(rule.from, rule)
  }

  const files = options.files ?? await collectSourceFiles(repoRoot, model)
  const violations = []

  for (const file of files) {
    const fromLayer = classifyPath(file, model)
    if (!fromLayer) continue
    const rule = rulesByLayer.get(fromLayer)
    if (!rule) continue

    const source = await readFile(path.join(repoRoot, file), 'utf8')
    for (const specifier of extractImportSpecifiers(source)) {
      // Bare-module bans (e.g. core importing the `vue` framework).
      if (!specifier.startsWith('.')) {
        const bareRoot = specifier.replace(/^(@[^/]+\/[^/]+|[^/]+).*$/, '$1')
        if ((rule.forbidBareModules ?? []).includes(bareRoot)) {
          violations.push({ file, fromLayer, specifier, target: bareRoot, why: `forbidden module (${rule.id})` })
        }
        continue
      }
      const target = await resolveRelativeImport(repoRoot, file, specifier)
      if (!target) continue
      // Path-prefix bans (e.g. core reaching into src/design-system/vue/).
      const prefixHit = (rule.forbidPathPrefixes ?? []).find(prefix => target.startsWith(prefix))
      if (prefixHit) {
        violations.push({ file, fromLayer, specifier, target, why: `forbidden path prefix '${prefixHit}' (${rule.id})` })
        continue
      }
      // Layer-direction bans (e.g. L0 importing an L1 composite).
      const targetLayer = classifyPath(target, model)
      if (targetLayer && (rule.forbidImportsOf ?? []).includes(targetLayer)) {
        violations.push({ file, fromLayer, specifier, target, targetLayer, why: `${fromLayer} must not import ${targetLayer} (${rule.id})` })
      }
    }
  }

  return { ok: violations.length === 0, scannedFiles: files.length, violations }
}

export function formatResult(result) {
  if (result.ok) {
    return `Layer-boundary check passed (${result.scannedFiles} files scanned, 0 wrong-direction dependencies).`
  }
  const lines = [`Layer-boundary check failed: ${result.violations.length} wrong-direction dependency(ies).`]
  for (const violation of result.violations) {
    lines.push(`- ${violation.file}: imports '${violation.specifier}' -> ${violation.why}`)
  }
  return lines.join('\n')
}

export async function runCli(argv = process.argv.slice(2), io = {}) {
  const stdout = io.stdout ?? console.log
  const stderr = io.stderr ?? console.error
  const enforce = argv.includes('--check')
  const json = argv.includes('--format=json') || argv.includes('--json')

  const result = await checkLayers()

  if (json) {
    stdout(JSON.stringify(result, null, 2))
  } else {
    stdout(formatResult(result))
  }

  if (!result.ok && !enforce) {
    stderr('check-layers: advisory mode (no --check) — not failing the build.')
    return 0
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