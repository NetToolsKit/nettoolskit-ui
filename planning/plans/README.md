# Plans

This folder stores execution plans for `nettoolskit-ui` workstreams.

## Structure

- `active/` - active execution plans, validation status and closeout notes.
- `completed/YYYY-MM/` - completed plans grouped by finalization month.

## Rules

- Active plans must include `Status:` and `Progress: NN% (X/Y checked)` near
  the top.
- The `## Progress Checklist` is the source of truth for percentage status.
- Plans consume one or more specs or explicitly state
  `Source Traceability: not required` for maintenance-only work.
- Plans must describe ordered tasks, target paths, validations, risks and
  closeout expectations.
- Completed plans must move to `planning/plans/completed/YYYY-MM/**`.
- Plan filenames must use a date prefix: `YYYY-MM-DD-descriptive-slug.md`.
