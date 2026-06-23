# NetToolsKit UI Platform Governance Gates - Spec

Generated: 2026-06-23 America/Sao_Paulo
LastUpdated: 2026-06-23 America/Sao_Paulo
Status: active
Priority: high
Branch: `TBD`
Workstream ID: `nettoolskit-ui-platform-governance-gates`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md` (§22-§23, §27)
Related Specs:
- `planning/specs/active/2026-06-23-nettoolskit-ui-legacy-surface-elimination.md`
- `planning/specs/active/2026-06-21-nettoolskit-ui-library-a11y-browser-gates.md`
- `planning/specs/active/2026-06-23-nettoolskit-ui-security-supply-chain-hardening.md`

## Objective

Make the platform's engineering-first guarantees executable and enforced on
every change, not by convention. Today `npm run verify` is strong but the
architecture boundaries, public-API stability, per-layer coverage, and CI
triggers are partial. This spec closes those so "governed platform" is provable
on each PR.

## Normalized Request Summary

Gaps observed in the deep analysis: (1) layer boundaries (core has no Vue/DOM;
features use only the public API) are documented but not lint-enforced; (2) the
CI workflows trigger only on `workflow_dispatch`/`schedule`, not on PRs; (3) the
coverage gate covers `core/components` but not `core/schema` or the Vue layer;
(4) public-API semver/deprecation policy is implicit; (5) there is no ADR record
of platform decisions. This spec turns each into a deterministic gate.

## Design Intent

```txt
core      -> may not import vue / quasar / DOM / storage / http   (lint-enforced)
vue       -> may import core + adapters, not product/features
features  -> import ONLY the public API (no deep paths)           (lint-enforced)
every PR  -> verify gates + CodeQL + dependency-review + audit run automatically
public API change -> snapshot diff forces a semver + changelog decision
```

## Key Decisions

- Enforce import boundaries with an executable tool (ESLint `no-restricted-imports`
  / `import/no-restricted-paths`, or dependency-cruiser) wired into `verify`.
- Trigger `ci-tests` and `security` (CodeQL, dependency-review, audit) on
  `pull_request` to `main`, keeping the existing schedule as a fallback.
- Formalize the public-API contract: the existing `ds-public-api.spec.ts`
  snapshot is the gate; a documented deprecation lifecycle (`@deprecated` ->
  minor with warning -> removal in next major) governs changes.
- Extend coverage thresholds: `core/schema/**` to 100% (pure), keep
  `core/components/**` at 100%, add a Vue-layer floor (e.g. >=90%).
- Adopt ADRs under `planning/decisions/` with a template and index; backfill
  the load-bearing decisions (Quasar-as-adapter, schema-driven creation,
  legacy removal, token pipeline).
- Adopt Conventional Commits + a Keep-a-Changelog `CHANGELOG.md`, with release
  notes derived from history; publish from CI with provenance.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Import boundaries | eslint config, `package.json`, tests | Makes Clean Architecture enforceable | Stops core touching DOM/storage/http | Cheap static analysis | Boundary violations fail `verify` |
| CI on PR | `.github/workflows/**` | Native gates run per PR | CodeQL/dep-review/audit on PR | Bounded CI minutes | PR shows the gates running |
| API stability | `tests/**`, `docs/**` | Documented semver + deprecation | No silent breaking changes | Snapshot diff is instant | API change requires snapshot + changelog |
| Coverage governance | `tests/vitest.config.ts`, `package.json` | Locks core/schema + Vue floors | Asserts critical paths tested | Coverage run already gated | Thresholds enforced per layer in `verify` |
| ADRs | `planning/decisions/**` | Decisions are traceable | Records security/boundary rationale | Docs only | ADR template + index + backfilled records |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Rely on review to keep boundaries | Rejected | The standard requires deterministic guardrails, not culture. |
| Keep CI manual/scheduled only | Rejected | PRs can merge without native CodeQL/audit evidence. |
| Global single coverage threshold | Rejected | Per-layer floors reflect criticality (pure core = 100%). |
| Skip ADRs | Rejected | Platform decisions must be discoverable and revisable. |

## Risks

- Import-boundary rules can be noisy initially; introduce as error only after a
  baseline pass to avoid blocking unrelated work.
- CI-on-PR adds minutes; keep the heavy suite efficient (single-worker reuse).
- Strict coverage can block legitimate work; set floors at measured-safe levels.

## Acceptance Criteria

- An executable import-boundary check runs in `npm run verify` and fails on a
  core->Vue/DOM import or a feature deep-import.
- `pull_request` triggers exist for the test and security workflows.
- `core/schema/**` is at 100% coverage and a Vue-layer floor is enforced; all
  wired into `verify`.
- A documented API semver + deprecation policy references the snapshot gate, and
  `CHANGELOG.md` exists.
- `planning/decisions/` has an ADR template, an index, and the backfilled
  load-bearing decisions.
- `npm run verify` passes.

## Planning Readiness

Ready now. Recommended order: import boundaries -> coverage governance ->
CI-on-PR -> API/changelog policy -> ADRs. Independent of legacy removal but
strongly complementary (the import guard accelerates it).

## Recommended Specialist Focus

- Ops/DevOps engineer (CI workflows, release automation)
- Frontend architecture engineer (import boundaries, API policy)
- Test engineer (coverage governance)
- Docs/release engineer (ADRs, changelog)