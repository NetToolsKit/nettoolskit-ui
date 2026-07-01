/**
 * Bundle budget + optional-peer surface gate.
 *
 * Runs after `npm run build` (part of `verify`). Two deterministic checks
 * over the published entries in `.build/dist`:
 *
 * 1. Gzip size stays inside the budget below. Budgets are deliberate: when a
 *    legitimate surface growth trips the gate, raise the number in the same
 *    PR so the change is reviewed as part of the diff.
 * 2. Optional peers stay confined to their subpath entries: the root entries
 *    must never gain a static or dynamic dependency on `quasar` or
 *    `vue-router` (ADR-0006), otherwise apps without the optional peers stop
 *    bundling.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distFile = (name) => path.join(repoRoot, '.build', 'dist', name)

/** Gzip budgets in bytes (measured 2026-07-01 + ~15% headroom). */
const GZIP_BUDGETS = {
  'index.mjs': 102_400, // measured 87.1 KiB
  'index.js': 104_448, // measured 88.4 KiB
  'styles.mjs': 4_096, // measured 1.1 KiB
  'quasar.mjs': 6_144, // measured 2.2 KiB
  'router.mjs': 4_096, // measured 1.7 KiB
}

/** Per-entry list of package specifiers that must not appear as dependencies. */
const FORBIDDEN_DEPENDENCIES = {
  'index.mjs': ['quasar', 'vue-router'],
  'index.js': ['quasar', 'vue-router'],
  'styles.mjs': ['quasar', 'vue-router'],
  'quasar.mjs': ['vue-router'],
  'router.mjs': ['quasar'],
}

const kib = (bytes) => (bytes / 1024).toFixed(1)

let failed = false

for (const [file, budget] of Object.entries(GZIP_BUDGETS)) {
  let source
  try {
    source = await readFile(distFile(file), 'utf8')
  } catch {
    failed = true
    console.error(`${file}: missing — run \`npm run build\` before size:check.`)
    continue
  }

  const gzipBytes = gzipSync(Buffer.from(source)).length
  const overBudget = gzipBytes > budget
  if (overBudget) {
    failed = true
  }
  console.log(
    `${file}: ${kib(Buffer.byteLength(source))} KiB raw, ${kib(gzipBytes)} KiB gzip`
    + ` (budget ${kib(budget)} KiB)${overBudget ? ' — OVER BUDGET' : ''}`,
  )

  for (const dependency of FORBIDDEN_DEPENDENCIES[file] ?? []) {
    // Matches `from "dep"`, `require("dep")` and `import("dep")` including
    // subpaths (`dep/x`), in both output formats.
    const pattern = new RegExp(`(?:from\\s*|require\\(\\s*|import\\(\\s*)["']${dependency}(?:/[^"']*)?["']`)
    if (pattern.test(source)) {
      failed = true
      console.error(
        `${file}: forbidden dependency "${dependency}" — optional peers must stay`
        + ' in their subpath entries (see ADR-0006 and package.json exports).',
      )
    }
  }
}

if (failed) {
  process.exit(1)
}

console.log('Bundle budgets and optional-peer surface: OK.')