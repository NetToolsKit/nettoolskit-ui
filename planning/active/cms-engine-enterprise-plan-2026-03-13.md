# CMS Engine Enterprise Plan

Date: 2026-03-13
Repository: `nettoolskit-ui-vue`
Status: In Progress

## Scope

This roadmap consolidates the previous phased planning into one enterprise plan for the CMS engine.

In scope:
- headless CMS engine capabilities
- schema-driven authoring
- reusable content lifecycle
- provider contracts for later backend integration
- review, release and governance surfaces
- enterprise-grade authoring hardening

Out of scope:
- application-specific RBAC enforcement
- backend job orchestration
- business-specific moderation workflows

## Completed Foundation

Delivered before this unified plan:
- Phases 1 through 9 completed
- white-label engine and theme/token system
- CMS builder for pages, blocks, media and releases
- content models, presets, starter kits and reusable content
- linked vs detached reuse flows
- domain import/export and schema packages
- preview, review, locale coverage and release checklists
- governance, review history and deprecation guidance
- E2E and visual regression baselines

## Enterprise Backlog

| # | Item | Scope | Status | Notes |
|---|------|-------|--------|-------|
| 105 | Replacement assistant for deprecated entities | engine helper + authoring actions + tests | Completed | Apply configured replacements across pages, reusable sections and reusable blocks with impact preview. |
| 106 | Nested object and repeatable group schema fields | engine contract + pages/blocks authoring + validation | Completed | Support enterprise content shapes beyond primitive field types. |
| 107 | Schema migration runner and upgrade report | migration metadata + safe upgrade preview | Completed | Move from passive schema versioning to guided content upgrades. |
| 113 | CMS authoring workspace fill behavior | workbench sizing + responsive stretch rules | Completed | Ensure the editing area consumes the full available workspace instead of leaving unused gutters or compressed inner surfaces. |
| 114 | CMS shell heading placement outside cards | workspace framing + hero/title consistency | Completed | Keep module title and description outside the editor card in every CMS surface. |
| 115 | CMS authoring chrome deduplication | top bar + left rail + right rail role cleanup | Completed | Preserve the three editing bars while removing duplicated actions and overlapping controls. |
| 116 | Preview launch in separate tab | preview routing + explicit external open behavior | Completed | Clicking preview must open the runtime preview in a new browser tab instead of only scrolling to the side panel. |
| 108 | Reusable content branching and variant flows | linked baseline + detached/variant authoring ergonomics | Pending | Support enterprise reuse without forcing one mutable source of truth. |
| 109 | Provider sync, conflict and version contracts | async provider adapters + optimistic concurrency hooks | Pending | Prepare the engine for real backend persistence with revision safety. |
| 110 | Accessibility and content QA gates | engine review helpers + release integration | Pending | Add author-facing a11y and content quality signals before publish. |
| 111 | Editor performance and virtualization hardening | large-library rendering + lazy authoring surfaces | Pending | Keep CMS authoring responsive as reusable libraries grow. |
| 112 | Enterprise regression and release criteria | full-suite hardening + final quality gates | Pending | Close the enterprise plan with regression and operational criteria. |

## Delivery Order

1. Item 108: reusable content branching and variant flows`r`n2. Item 109: provider sync, conflict and version contracts`r`n3. Item 110: accessibility and content QA gates`r`n4. Item 111: editor performance and virtualization hardening`r`n5. Item 112: enterprise regression and release criteria

## Practical Reading

- There is now one active enterprise roadmap.
- Previous planning files were consolidated and removed.
- The current execution target is item `108`.