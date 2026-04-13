# Spec: Reference Source Truth Parity Audit

Date: 2026-04-13
Status: Active
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`

## Summary

The public sample runtime is visually close to `.temp/reference`, but it is still not a faithful implementation.
The biggest problem is not one isolated component. The sample still mixes repository-level theming, a reusable template abstraction, and a hand-curated sample shell instead of letting the reference layout drive the final runtime more directly.

This audit defines the concrete parity gaps that must be closed before the sample can be considered a true reference-derived product shell.

## Source of truth

- Reference runtime: `.temp/reference/src/layouts/MainLayoutHorizontal.vue`
- Reference user menu: `.temp/reference/src/components/UserMenu.vue`
- Reference lateral menu: `.temp/reference/src/components/MenuLink.vue`
- Reference horizontal menu: `.temp/reference/src/components/HorizontalMenuLink.vue`
- Reference header asset: `.temp/reference/src/assets/images/logo.png`
- Reference global styling baseline: `.temp/reference/src/css/app.scss`

## Key findings

### Gap 1 — Global styling contamination

The reference runs with:
- `body` background `#e8e8e8`
- `Inter` as the primary body font

The sample runtime currently renders with:
- transparent `body`
- `Plus Jakarta Sans` at the document level

This means the shell may look close in component screenshots while still feeling different as a product.
The mismatch is structural and comes from the host application's global CSS, not only from the shell components.

Acceptance:
- The sample runtime uses the same body background and body font baseline as the reference
- Visual parity is not dependent on component-local overrides alone

### Gap 2 — Brand lockup mismatch

The reference header uses the square mark asset directly in the toolbar footprint.
The sample has moved closer, but still treats branding as a sample-owned concern instead of a direct reference-owned concern.

Acceptance:
- The sample header brand area uses the same logo footprint, dimensions, and toolbar spacing contract as the reference
- No alternate text lockup or sample-specific interpretation remains in the public runtime

### Gap 3 — Header interaction contract mismatch

The reference header is simple:
- drawer toggle
- logo
- optional breadcrumb
- user menu

The sample still routes some of this through reusable slots and host-level indirection.
That abstraction is useful for the library, but it makes parity harder because header behavior is not anchored tightly enough to the reference shell.

Acceptance:
- The single public sample runtime follows the same header composition order and spacing as the reference
- Header controls do not depend on extra sample-only behavior

### Gap 4 — Menu behavior still derived, not copied from reference

The sample now approximates the reference menu behavior, but it still uses a generic template abstraction with conditional styles for `reference` and `vercel`.
This means the public sample can still diverge from the reference through generic code paths.

Acceptance:
- The public sample uses the reference menu behavior path only
- Active state, hover state, mini mode, label mode, and sticky bottom item match the reference implementation
- No visual leakage on the left edge remains

### Gap 5 — Runtime copy/data mismatch

Observed copy mismatches remain, for example:
- reference greeting: `Boa tarde, Guilherme Ferreira`
- sample greeting: `Bom dia, Guilherme Ferreira`

Even small copy differences make visual comparison noisy and hide real UI gaps.

Acceptance:
- The public sample uses reference-aligned copy and runtime state defaults where comparison matters
- Greeting icon/text and header chip defaults match the reference baseline

### Gap 6 — Document title and app identity mismatch

Reference title:
- `SMB Conecta`

Sample title:
- `NetToolsKit UI Vue - Original Reference`

This breaks the illusion of a real product parity pass and makes QA comparisons less trustworthy.

Acceptance:
- The public sample runtime exposes a product-like title aligned with the reference baseline
- Internal demo naming stays out of the browser chrome

## Root cause

The current sample is still built as:
1. a reusable template library in `src/templates`
2. a sample host in `samples`
3. a reference-inspired configuration layered on top

The reference itself is a concrete product shell, not a configurable showcase.

That means parity will keep drifting until the public sample runtime is treated as:
- a direct reference-derived implementation first
- a reusable template demonstration second

## Recommended direction

For the single public sample only:
- freeze the `reference` visual path as the only path
- remove or bypass sample-only abstractions that change header/menu contracts
- pull the reference global baseline into the sample host
- align runtime copy and browser title to the reference baseline

Keep the library reusable internally, but stop letting the public runtime depend on optional presentation branches.

## Acceptance criteria

- The sample and reference match on:
  - body background
  - body font
  - header height and spacing
  - logo footprint
  - avatar placement
  - drawer/menu states
  - default greeting/copy
  - browser title/product identity
- Desktop and mobile comparison can be done side by side without obvious product-shell mismatch
- Remaining differences are limited to neutral naming or intentionally documented placeholders

## Planning readiness

Ready for execution planning.

## Recommended specialist focus

- Primary: `dev-frontend-vue-quasar-engineer`
- Follow-up planning: `plan-active-work-planner`
