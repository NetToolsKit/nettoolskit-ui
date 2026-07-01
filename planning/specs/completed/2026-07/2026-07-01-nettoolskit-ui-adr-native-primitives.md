# NetToolsKit UI ADR - Native Primitives Alignment - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-adr-native-primitives`
Phase: governance-alignment

## Objective

Bring the decision record up to date with the implemented reality: `Ds*`
primitives render native HTML elements (no Quasar wrappers), and Quasar
survives only as optional service adapters. Without this, ADR-0001 and
NTK-FE-STD-002 (§9/§10) mislead any generator/agent that treats them as
normative and would produce wrapper-era code.

## Scope

- `planning/decisions/0006-native-primitives.md`: the decision, consequences,
  enforcement gates, and explicit supersession scope (mechanism only — the
  closed `Ds*` contract half of ADR-0001 is restated and stays in force).
- `planning/decisions/0001-quasar-as-adapter.md`: Status → superseded by
  ADR-0006 (content untouched; ADRs are immutable).
- `planning/decisions/README.md`: index updated.

## Out of repo (operator follow-up)

`F:\Desenvolvimento\.docs\ui\NTK-FE-STD-002.md` (§9/§10 and the DsButton/QBtn
reference implementation) lives outside this repository and should be revised
to the native-primitives mechanism, or annotated to defer to ADR-0006, so the
master prompt stops generating wrapper-era components.

## Verification

Docs-only: `lint` (markdown untouched by eslint), `docs:check` (generated docs
unaffected), CI River docs stage.

## Acceptance

- ADR-0006 accepted and indexed; ADR-0001 marked superseded with the precise
  supersession scope.
- No source changes.

## Progress Checklist

Progress: 100% (3/3 checked)

- [x] ADR-0006 written (decision, consequences, enforcement, supersession scope)
- [x] ADR-0001 status + index updated
- [x] Operator follow-up for the external NTK-FE-STD-002 recorded