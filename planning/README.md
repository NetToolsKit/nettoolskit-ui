# NetToolsKit UI Planning

This folder tracks SDD coordination artifacts for `nettoolskit-ui`.

## SDD Flow

Use this source order:

```text
Requirements -> Use Cases -> Architecture -> UCP -> Specs -> Plans -> Implementation
```

Durable requirements, knowledge-base material, research references, screenshots,
audits and comparison reports belong outside `planning/**`. `planning/**`
contains coordination artifacts that help humans and agents execute work without
replacing durable source documents.

## Contents

| Path | Purpose |
| --- | --- |
| `plans/active/` | Active execution plans, implementation slices, validation state and closeout notes. |
| `plans/completed/` | Archived execution plans after implementation, validation, review, closeout and PR evidence are complete. |
| `specs/active/` | Active design-bearing specifications for architecture, workflow, contract or behavior decisions. |
| `specs/completed/` | Archived specifications after the related workstream is materially closed. |
| `ucps/parameters/` | Versioned UCP generation parameter files. |
| `ucps/active/` | Versioned official UCP pages for active milestones. |
| `ucps/completed/` | Versioned official UCP pages for completed milestones. |

## Artifact Roles

`UCP` is the human milestone and use-case sizing view.

`Spec` is the design decision artifact. It records architecture, alternatives,
risks, constraints and acceptance criteria. One milestone can have multiple
specs when the milestone has independent design boundaries.

`Plan` is the execution artifact. It orders slices, commits, PRs, validations,
release closeout and blockers. A plan references specs and UCPs; it does not
duplicate their design or estimation content.

## Rules

- Keep active plans under `planning/plans/active/**`.
- Keep completed plans under `planning/plans/completed/YYYY-MM/**`, where
  `YYYY-MM` is the finalization month.
- Keep active specs under `planning/specs/active/**`.
- Keep completed specs under `planning/specs/completed/YYYY-MM/**`, where
  `YYYY-MM` is the finalization month.
- Keep active UCP pages under `planning/ucps/active/**`.
- Keep completed UCP pages under `planning/ucps/completed/YYYY-MM/**`, where
  `YYYY-MM` is the finalization month.
- Keep analysis reports, comparisons and research references outside
  `planning/**`; publish durable records under `docs/knowledge-base/**`.
- Keep active plans checklist-backed with `Progress: NN% (X/Y checked)`.
- Keep `planning/plans/active/**` plans as `Status: active` unless they are
  explicitly blocked or ready for review.
- Keep `planning/plans/completed/YYYY-MM/**` plans as `Status: completed`.
- Record concrete target paths, risks, validation commands and evidence.
- State `Source Traceability: not required` when a maintenance-only plan has no
  requirements or use-case source impact.
- Do not mark a plan complete while validation, review, closeout, PR or release
  evidence remains open.
- Package naming for this repository must use `nettoolskit`.
- Repository-owned terminal commands may use `ntk`.

## Validation Baseline

When planning changes include frontend impact, validate with the relevant package
gates. Maintenance-only planning taxonomy changes require path inventory and
status review, not frontend builds.