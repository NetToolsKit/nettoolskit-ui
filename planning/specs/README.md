# Specs

This folder stores design specifications for work that affects frontend
platform structure, visual contracts, migration policy, testing or governance.

## Structure

- `active/` - current specs ready for execution planning.
- `completed/YYYY-MM/` - closed specs with implementation or closeout evidence,
  grouped by finalization month.

## Rules

- Specs define intent, decisions, boundaries, risks and acceptance criteria.
- Specs do not track progress percentages; plans do that.
- Each broad frontend workstream should have one sequence spec plus focused
  stage specs.
- Every spec must state the priority, sequence context, target paths,
  validation evidence and likely specialist.
- Completed specs must move to `planning/specs/completed/YYYY-MM/**`.
- Package naming must use `nettoolskit`.
- Repository-owned terminal commands may use `ntk`.