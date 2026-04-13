# Reference Source Truth Alignment Plan

Date: 2026-04-13
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`

## Goal

Treat `.temp/reference` as the source of truth for the single public sample runtime and remove the remaining local reinterpretations in avatar alignment, brand lockup, and menu behavior.

## Scope

1. Align the user menu avatar implementation with `.temp/reference/src/components/UserMenu.vue`.
2. Align the header brand lockup proportions and spacing with `.temp/reference/src/layouts/MainLayoutHorizontal.vue`.
3. Align the side and top menu behavior/states with `.temp/reference/src/components/MenuLink.vue` and `.temp/reference/src/components/HorizontalMenuLink.vue`.
4. Validate desktop and mobile against the reference runtime.

## Execution Slices

- [x] Replace avatar centering hacks with the same structure and styling model used by the reference.
- [x] Rework the sample logo lockup to match the reference header footprint while keeping neutral naming.
- [x] Tighten menu interactions and active/hover states to match the reference implementation.
- [x] Run type-check, targeted tests, and browser validation on desktop/mobile.

## Acceptance

- Avatar initials appear visually centered in both header and dropdown without manual optical drift hacks.
- The top-left logo area reads like the reference header in spacing and proportions.
- Menu items no longer leak visually on the left and the mini/normal behaviors match the reference.
- The sample remains a single public runtime at `/`.
