#!/usr/bin/env node
/**
 * Codemod: rewrite legacy `Ntk*`/`Base*` component references to their `Ds*`
 * equivalents for the 1:1 mappings (see docs/MIGRATION.md). Handles both import
 * specifiers and template tags via word-boundary replacement.
 *
 * Non-1:1 cases (Textarea, MultiSelect, Date/Time pickers, DataTable,
 * MetricCard/StatCard, NotificationCenter) are intentionally left untouched and
 * reported, because their props/usage differ and need manual migration.
 *
 * Usage:
 *   node scripts/codemod/ntk-to-ds.mjs [--dry] [paths...]
 *   node scripts/codemod/ntk-to-ds.mjs src samples
 *   node scripts/codemod/ntk-to-ds.mjs --dry "src/**\/*.{vue,ts}"
 *
 * With no paths, defaults to scanning `src` and `samples`.
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

// 1:1 mappings the codemod rewrites automatically.
const RENAME = new Map([
  // most specific first (does not matter for word-boundary, kept for clarity)
  ['NtkLandingHeader', 'DsHeader'],
  ['NtkAppSidebar', 'DsSidebar'],
  ['NtkAppShell', 'DsAppShell'],
  ['NtkButton', 'DsButton'], ['BaseButton', 'DsButton'],
  ['NtkCard', 'DsCard'], ['BaseCard', 'DsCard'],
  ['NtkChip', 'DsChip'], ['BaseChip', 'DsChip'],
  ['NtkInput', 'DsInput'], ['BaseInput', 'DsInput'],
  ['NtkSelect', 'DsSelect'], ['BaseSelect', 'DsSelect'],
  ['NtkSection', 'DsSection'], ['BaseSection', 'DsSection'],
  ['NtkLogo', 'DsLogo'], ['BaseLogo', 'DsLogo'],
  ['NtkSteps', 'DsSteps'], ['BaseSteps', 'DsSteps'],
  ['NtkHeader', 'DsHeader'], ['BaseHeader', 'DsHeader'],
  ['NtkFooter', 'DsFooter'], ['BaseFooter', 'DsFooter'],
  ['NtkSidebar', 'DsSidebar'], ['BaseSidebar', 'DsSidebar'],
])

// Left for manual migration — flagged, never rewritten.
const MANUAL = [
  'NtkTextarea', 'BaseTextarea', 'NtkMultiSelect', 'BaseMultiSelect',
  'NtkDatePicker', 'BaseDatePicker', 'NtkTimePicker', 'BaseTimePicker',
  'NtkDataTable', 'NtkSectionHeader', 'NtkMetricCard', 'MetricCard',
  'NtkStatCard', 'NtkMobileDrawer', 'NtkNotificationCenter',
]

const EXT = new Set(['.vue', '.ts'])

const args = process.argv.slice(2)
const dry = args.includes('--dry') || args.includes('--dry-run')
const inputs = args.filter((a) => !a.startsWith('--'))

function globToRegExp(glob) {
  const normalized = glob.replace(/\\/g, '/')
  let re = ''
  for (let i = 0; i < normalized.length; i += 1) {
    const c = normalized[i]
    if (c === '*') {
      if (normalized[i + 1] === '*') { re += '.*'; i += 1 } else { re += '[^/]*' }
    } else if (c === '{') {
      const end = normalized.indexOf('}', i)
      re += `(?:${normalized.slice(i + 1, end).split(',').join('|')})`
      i = end
    } else if ('.+^$()|[]'.includes(c)) {
      re += `\\${c}`
    } else {
      re += c
    }
  }
  return new RegExp(`^${re}$`)
}

async function walk(dir, out) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(full, out)
    else if (EXT.has(path.extname(entry.name))) out.push(full)
  }
}

async function collect(targets) {
  const files = []
  for (const target of targets) {
    if (target.includes('*')) {
      const re = globToRegExp(target)
      const base = process.cwd()
      const all = []
      await walk(base, all)
      for (const f of all) {
        if (re.test(path.relative(base, f).replace(/\\/g, '/'))) files.push(f)
      }
      continue
    }
    const info = await stat(target).catch(() => null)
    if (!info) { console.warn(`skip (not found): ${target}`); continue }
    if (info.isDirectory()) await walk(target, files)
    else if (EXT.has(path.extname(target))) files.push(target)
  }
  return [...new Set(files)]
}

function rewrite(source) {
  let next = source
  let count = 0
  for (const [from, to] of RENAME) {
    const re = new RegExp(`\\b${from}\\b`, 'g')
    next = next.replace(re, () => { count += 1; return to })
  }
  const manualHits = MANUAL.filter((name) => new RegExp(`\\b${name}\\b`).test(source))
  return { next, count, manualHits }
}

async function main() {
  const targets = inputs.length > 0 ? inputs : ['src', 'samples']
  const files = await collect(targets)
  let changed = 0
  let replacements = 0
  const manualReport = new Map()

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const { next, count, manualHits } = rewrite(source)
    if (manualHits.length > 0) manualReport.set(file, manualHits)
    if (count > 0 && next !== source) {
      replacements += count
      changed += 1
      if (!dry) await writeFile(file, next)
      console.log(`${dry ? '[dry] ' : ''}${file}: ${count} replacement(s)`)
    }
  }

  console.log(`\n${dry ? 'Would change' : 'Changed'} ${changed} file(s), ${replacements} replacement(s).`)
  if (manualReport.size > 0) {
    console.log('\nManual migration required (left untouched — see docs/MIGRATION.md):')
    for (const [file, names] of manualReport) console.log(`  ${file}: ${[...new Set(names)].join(', ')}`)
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1 })