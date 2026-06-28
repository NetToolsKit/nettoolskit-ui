// Emit the published entry declaration at the path the package `exports` map and
// `types` field reference: `.build/dist/index.d.ts`.
//
// The public API entry source lives at `src/index.ts`. With `rootDir: "."`,
// vue-tsc preserves the source tree under the out dir, so the real entry
// declaration is emitted at `.build/dist/src/index.d.ts` (and `./styles` resolves
// to `.build/dist/src/styles/index.d.ts`, matching package.json). To keep the
// root `"."` types path (`.build/dist/index.d.ts`) valid WITHOUT changing the
// published exports map, write a thin re-export shim that forwards to the real
// declaration. `.build/dist` is a generated, git-ignored artifact, so this shim
// is produced fresh on every build.

import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(here, '..', '.build', 'dist')
const realEntry = resolve(distDir, 'src', 'index.d.ts')
const shimPath = resolve(distDir, 'index.d.ts')

// Fail loudly if the real declaration was not emitted — that means the dts build
// changed shape and this shim would silently point at nothing.
await access(realEntry)

await mkdir(distDir, { recursive: true })
await writeFile(shimPath, "export * from './src/index'\n", 'utf8')

console.log('emit-dist-entry-dts: wrote .build/dist/index.d.ts -> ./src/index')