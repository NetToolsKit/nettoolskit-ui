# NetToolsKit UI Planning Taxonomy Normalization - Plan

Generated: 2026-06-21 22:02 America/Sao_Paulo
LastUpdated: 2026-06-21 22:24 America/Sao_Paulo
Status: completed
Progress: 100% (5/5 checked)
Branch: `refactor/library-only-surface`
Source Traceability: not required
Reference: `C:\Users\tguis\Documents\Trabalho\Pessoal\Desenvolvimento\Projetos\nettoolskit-new\nettoolskit-agent\planning`

## Progress Checklist

- [x] Reference planning taxonomy has been inspected.
- [x] Root planning README reflects `ucps`, `specs`, and `plans` only.
- [x] Completed plans and specs are moved under month folders.
- [x] Research/reference artifacts are moved outside `planning/**`.
- [x] Structure validation and closeout are complete.

## Scope Summary

Normalize `planning/**` to match the Super Agent SDD taxonomy used by
`nettoolskit-agent`: UCP coordination pages under `planning/ucps/**`, design
specifications under `planning/specs/**`, and execution plans under
`planning/plans/**`.

This is maintenance-only. It does not change package code, frontend behavior,
CI/CD behavior, requirements, or active workstream acceptance criteria.

## Sub-Slice Matrix

| Slice | Targets | Validation | Commit checkpoint |
|---|---|---|---|
| README contract | `planning/README.md`, `planning/*/README.md` | Manual read and path inventory | `docs(planning): normalize planning taxonomy` |
| Completed plans | `planning/plans/completed/YYYY-MM/**`, legacy completed/archive roots | No legacy completed/archive root directories remain | Same checkpoint |
| Completed specs | `planning/specs/completed/YYYY-MM/**` | Completed specs are grouped by finalization month | Same checkpoint |
| References | `docs/knowledge-base/planning-reference/**`, `docs/knowledge-base/**` | No research/reference material remains under `planning/**` | Same checkpoint |
| Closeout | active maintenance plan | Plan moved to `planning/plans/completed/2026-06/**` after validation | Same checkpoint |

## Ordered Tasks

1. Compare local `planning/**` with the reference `nettoolskit-agent` layout.
2. Update planning README files to document the canonical taxonomy.
3. Move legacy root completed plans and archive files to
   `planning/plans/completed/YYYY-MM/**`.
4. Move completed specs to `planning/specs/completed/YYYY-MM/**`.
5. Move reference/research artifacts to `docs/knowledge-base/planning-reference/**`.
6. Create `planning/ucps/**` placeholders and README.
7. Validate the resulting tree and close this plan.

## Validation Checklist

- `git status --short --branch`
- `Get-ChildItem -Recurse -Depth 4 planning`
- legacy completed/archive/reference root directories have no tracked files remaining.
- active plans still include `Progress: NN% (X/Y checked)`.

## Validation Evidence

- Passed: `Get-ChildItem -Force planning` shows only `plans`, `specs`, `ucps` and `README.md`.
- Passed: completed plans are grouped under `planning/plans/completed/YYYY-MM/**`.
- Passed: completed specs are grouped under `planning/specs/completed/YYYY-MM/**`.
- Passed: reference artifacts are grouped under `docs/knowledge-base/planning-reference/**`.
- Passed: stale legacy planning path search returned no matches.
- Passed: every active plan now includes a `Progress: NN% (X/Y checked)` line.

## Closeout Expectations

- Keep all work in planning/docs paths.
- Do not alter source code, package scripts, CI workflows, or specs unrelated to
  taxonomy location.
- Commit message suggestion: `docs(planning): normalize planning taxonomy`.