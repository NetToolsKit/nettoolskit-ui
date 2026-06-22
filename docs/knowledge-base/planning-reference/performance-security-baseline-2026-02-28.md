# Performance and Security Baseline (2026-02-28)

## Commands Executed
- `npm run build:landing`
- `npm audit --json`
- `npm audit --omit=dev --json`
- `npm outdated --json`

## Security Snapshot
- Production dependencies (`npm audit --omit=dev`): `0` vulnerabilities.
- Full dependency tree (`npm audit`): `12` vulnerabilities (`3 high`, `9 moderate`), concentrated in dev tooling.

### Main High-Risk Chains (dev tooling)
1. `rollup` (`4.0.0 - 4.58.0`) - high advisory (path traversal write).
2. `minimatch` (multiple ranges) - high ReDoS advisories.
3. `editorconfig` -> `minimatch` chain (high via transitive dependency).

### Main Moderate Chains
1. `vitest`/`vite-node`/`@vitest/*` chain.
2. `esbuild` advisory through test toolchain.
3. `ajv` and `lodash` legacy transitive advisories.

## Performance Snapshot
- Build time: `~2.69s`.
- JS chunk sizes:
  - `vendor-quasar` ~`506.94 kB` (gzip `156.23 kB`) - near warning limit.
  - `cms` ~`139.11 kB` (gzip `31.38 kB`).
  - `vendor` ~`77.85 kB` (gzip `31.12 kB`).
- CSS chunk sizes:
  - `vendor-quasar` ~`198.41 kB` (gzip `34.97 kB`).

### Largest Landing/Brand Assets
- `landing-page/assets/composables-visual.png` ~`5.13 MB`
- `landing-page/assets/form-components.png` ~`4.83 MB`
- `landing-page/assets/hero-visual.png` ~`4.82 MB`
- `landing-page/public/hero-visual.png` ~`4.82 MB`
- `assets/9-brand-applications.png` ~`5.41 MB`
- `assets/6-backgrounds-and-versions.png` ~`5.21 MB`

## Priority Recommendations
1. **Security P1:** apply `npm audit fix` (non-breaking) and re-run CI security gates.
2. **Security P2:** evaluate controlled upgrade path for `vitest` ecosystem (major migration track).
3. **Performance P1:** convert heavy PNG hero/showcase assets to optimized WebP/AVIF and keep fallback only where required.
4. **Performance P1:** add `loading=\"lazy\"` for below-the-fold section images.
5. **Performance P2:** reduce Quasar runtime footprint by explicit component registration instead of global `Q*` registration.

## Remediation Update (2026-02-28)

### Security Remediation Applied
- Executed `npm audit fix`.
- Upgraded test toolchain to secure versions:
  - `vitest` -> `4.0.18`
  - `@vitest/ui` -> `4.0.18`
  - `@vitest/coverage-v8` -> `4.0.18`
- Current audit status:
  - `npm audit --omit=dev`: `0 vulnerabilities`
  - `npm audit`: `0 vulnerabilities`

### Performance Optimizations Applied
- Updated landing media loading hints:
  - Above-the-fold assets: `loading="eager"` + `fetchpriority="high"`.
  - Below-the-fold assets: `loading="lazy"` + `fetchpriority="low"`.
- Deferred below-the-fold section rendering using:
  - `.ntk-deferred-section { content-visibility: auto; contain-intrinsic-size: 900px; }`
- Replaced global Quasar `Q*` component registration with explicit component/directive registration in `landing-page/main.ts`.

### Post-remediation Build Snapshot
- Build time: `~2.17s`.
- JS chunk sizes:
  - `vendor-quasar` ~`480.71 kB` (gzip `147.11 kB`) - reduced from `506.94 kB`.
  - `cms` ~`139.11 kB` (gzip `31.38 kB`) - unchanged.
  - `vendor` ~`76.17 kB` (gzip `30.50 kB`) - reduced from `77.85 kB`.
- Remaining bottleneck:
  - Source PNG assets still ~`5 MB` each and should be optimized at file level.

## Media Optimization Update (2026-03-01)
- Created optimized `.webp` variants for landing assets while keeping original `.png` files:
  - `hero-visual.png` `4.82 MB` -> `hero-visual.webp` `0.08 MB` (~`98.3%` smaller)
  - `form-components.png` `4.83 MB` -> `form-components.webp` `0.08 MB` (~`98.4%` smaller)
  - `composables-visual.png` `5.13 MB` -> `composables-visual.webp` `0.14 MB` (~`97.3%` smaller)
  - `theme-preview.png` `44.1 KB` -> `theme-preview.webp` `40.7 KB` (~`7.7%` smaller)
- Updated landing components to `picture` + `source type="image/webp"` with PNG fallback:
  - Hero, Developer visuals, Themes preview/icons, Header logo and Footer logo.
- Original PNG assets were intentionally preserved in the repository for compatibility.