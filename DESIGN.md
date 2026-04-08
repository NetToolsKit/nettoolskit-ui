# NetToolsKit UI Design Baseline

Last updated: April 8, 2026

## Purpose
- define one reusable visual baseline for `src/**` templates, CMS authoring surfaces, and future enterprise modules
- keep `landing-page/**` as a consumer of the system, not the place where design rules originate
- avoid ad-hoc color packs and one-off page styling inside feature shells

## Baseline Direction
- restrained enterprise monochrome
- white and near-white surfaces
- black, near-black, and neutral gray hierarchy
- subtle borders before shadows
- minimal accent usage, reserved for focus, active state, and notification semantics
- fixed topbar, stable navigation, calm workspace surfaces

## Inspiration Sources
- VoltAgent design catalog: `https://github.com/VoltAgent/awesome-design-md/tree/main`
- Vercel design notes: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/vercel/DESIGN.md`
- Uber design notes: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/uber/DESIGN.md`
- Ollama design notes: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/ollama/DESIGN.md`

## What We Adopt
- from Vercel:
  - precision and restraint
  - neutral-first color system
  - fixed shell with little decorative noise
- from Uber:
  - operational clarity
  - direct black/white hierarchy
  - simple rounded controls without ornamental styling
- from Ollama:
  - pure grayscale discipline
  - soft neutral surfaces
  - borders and background shifts instead of loud color blocks

## What We Do Not Copy Literally
- no brand cloning
- no hard dependency on external fonts
- no decorative gradients inside CMS workbenches
- no isolated visual language in `landing-page/CmsApp.vue`

## Core Palette
- canvas: `#fafafa`
- card: `#ffffff`
- primary text: `#111111`
- secondary text: `#525252`
- muted text: `#737373`
- border: `#e5e5e5`
- border-strong: `#d4d4d4`
- active text/accent: `#111111`
- hover surface: `rgba(17, 17, 17, 0.05)`
- active surface: `rgba(17, 17, 17, 0.08)`
- focus ring: accessible blue only when needed

## Shell Rules
- header stays fixed
- drawer and header stay white by default
- page background stays flat `#fafafa` or theme-equivalent neutral
- search/input surfaces use near-white fills, not tinted brand colors
- sidebar active state must be readable without relying on saturated fills

## Component Rules
- cards, panes, and workbench rails use neutral borders and white card surfaces
- shadows stay light and secondary to borders
- tabs use neutral active fills, not blue selection slabs
- notification colors remain semantic, but the shell itself stays monochrome
- authoring controls must consume shared theme tokens from `src/modules/cms/white-label/**`

## Implementation Rules
- reusable design contracts live in `src/**`
- `landing-page/**` may compose the system, but must not own the default CMS design language
- new CMS/editor modules must consume shared templates and shared CSS variables
- avoid hardcoded color packs inside feature shells; define tokens once and reuse them

## Current Default
- CMS default preset: `enterpriseMinimal`
- authoring shell theme helper: `src/modules/cms/white-label/authoring/design-baseline.ts`
- authoring CSS surface: `src/templates/styles/cms-authoring-reference.css`

## Review Gate
- if a new screen needs unique colors, justify it as product semantics rather than aesthetic preference
- if a reusable module introduces hardcoded shell colors, move them into shared tokens before merge
- if a page can be expressed with an existing template surface, reuse it instead of creating a new page-local shell