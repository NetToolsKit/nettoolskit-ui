# README and Frontend Standard (Super Agent)

This repository uses a unified standard for documentation and frontend delivery quality.

## Scope

Applies to:
- `README.md` at repository root
- all domain README files (for example `planning/README.md`, `samples/README.md`)
- frontend-oriented implementation slices (Vue/TS/SCSS)

## README Minimum Contract

Every README must include, at minimum:
1. purpose/scope of the folder or module
2. structure or key artifacts
3. rules and quality gates
4. validation commands (when applicable)
5. links to canonical references

Additional sections are allowed, but the minimum contract is mandatory.

## Frontend Quality Contract

Every frontend slice must:
1. follow template-first architecture when visual changes are involved
2. keep implementation typed and documented (clear interfaces/contracts)
3. keep accessibility hooks (`role`, `aria-*`, keyboard points) explicit
4. avoid unmanaged hardcoded style values when tokens exist
5. pass quality checks:
   - `npm run lint`
   - `npm run type-check`
   - target tests for changed surfaces

## Super Agent Execution Checklist

Before closing a slice:
1. verify README contract was updated if architecture/process changed
2. verify frontend quality contract was satisfied
3. verify planning/checklists are aligned with delivered changes
4. record pending items explicitly (if any)
