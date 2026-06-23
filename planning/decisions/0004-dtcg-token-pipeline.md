# ADR-0004: DTCG token pipeline as the source of visual truth

- Status: accepted
- Date: 2026-06-23
- Deciders: Frontend architecture, Design

## Context

Hardcoded colors/spacing and ad-hoc CSS variables cause drift across themes and
screens.

## Decision

All visual values come from DTCG tokens (`tokens/source.json` + `resolver.json`)
built into generated CSS/TS (`generated.css`, `generated.ts`, `generated/...`).
Runtime theming uses CSS custom properties: `[data-theme]` for named palettes and
`[data-color-scheme]` for light/dark. Features consume tokens/recipes, never raw
values.

## Consequences

- Positive: themes/white-label by swapping an attribute; no component edits.
- Trade-offs: new visual values require a token + regeneration.
- Enforcement: `tokens:check` drift gate; CSS governance forbids raw hex.

## Alternatives considered

- design.config.ts holding all values — rejected: not interoperable/validatable.