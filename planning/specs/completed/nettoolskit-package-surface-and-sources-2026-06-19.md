# NetToolsKit Package Surface And Sources - Spec

Date: 2026-06-19
Status: completed - archived
Priority: P0
Sequence: 01
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`

## Design Intent

Define the stable project surface before implementation begins: package naming, command naming, source authority, public exports, generated documentation ownership, and the rule for repository-specific behavior not covered by the source standard.

## Decisions

1. Package and workspace naming must use `nettoolskit`.
2. Repository-owned terminal commands may use the short prefix `ntk`.
3. The source standard drives this frontend workstream.
4. Existing useful repository features may remain when the source standard does not cover them, but they must be mapped into a spec, contract, adapter, policy, or documented exception.
5. Generated docs are outputs of executable sources, not the only truth.

## Target Paths

- `package.json`
- `index.ts`
- `README.md`
- `DESIGN.md`
- `planning/specs/**`
- future `sources.lock.yaml`
- future `src/design-system/**`

## Design Slice Matrix

| Slice | Target | Required Output |
|---|---|---|
| Package naming audit | `package.json`, exports, docs | All visible package naming uses `nettoolskit` where this workstream owns the package surface |
| Command naming policy | scripts and future CLI docs | Repository-owned CLI examples use `ntk` |
| Source lock | future `sources.lock.yaml` | Approved upstream source records with repository, commit, status, and decision |
| Public API policy | `index.ts`, package exports | Clear compatibility path for `Ntk*` and `Ds*` exports |
| Docs ownership | generated docs plan | `DESIGN.md`, `COMPONENTS.md`, `TOKENS.md`, and agent-facing docs generated or checked from source artifacts |

## Acceptance Criteria

1. Package naming audit is documented.
2. Command naming rule is documented.
3. Source standard and upstream source lock location are defined.
4. `Ntk*` compatibility strategy is explicit before `Ds*` work starts.
5. Public docs state which files are generated and which files are implementation sources.

## Risks

- Renaming package identifiers can break consumers if done before export compatibility exists.
- Short command names can collide with external tools; command scope must be documented.
- Keeping unmapped repository behavior without an exception record recreates residual drift.

## Planning Readiness

Ready for planning.

## Recommended Specialist

- Primary: `docs-release-engineer`
- Support: `dev-frontend-vue-quasar-engineer`
