# NetToolsKit UI — DESIGN.md

Last updated: April 14, 2026

---

## 1. Visual Theme

### Philosophy
- **Enterprise-grade fintech precision** inspired by Revolut
- Clean, flat surfaces with subtle borders before shadows
- Fixed topbar, stable navigation, calm workspace surfaces
- Runtime **color-switchable accent system** inspired by Claude's accent picker
- Every component consumes shared CSS custom properties — **no hardcoded Quasar default colors**

### Inspiration Sources

| Role | Source | What we adopt |
|------|--------|---------------|
| **Primary base** | Revolut | Flat design, dark fintech precision, neutral-first hierarchy, `Inter` body font |
| **Secondary / accent picker** | Claude | Runtime-switchable accent color, warm editorial surfaces, ring-based elevation |
| **Dark examples** | Warp, Resend | Void-black shells, frosted glassy borders, high-contrast typography |
| **Purple examples** | Superhuman, Kraken | Deep purple surfaces, lavender/amethyst accents, restrained glow |
| **Monochrome discipline** | Vercel, Uber, Ollama | Grayscale restraint, borders over shadows, no decorative noise |

---

## 2. Color Palette

### 2.1 Theme-agnostic semantic colors (always active)

| Token | Hex | Usage |
|-------|-----|-------|
| `--ntk-semantic-success` | `#22c55e` | Positive feedback, completed states |
| `--ntk-semantic-warning` | `#f59e0b` | Attention, in-progress states |
| `--ntk-semantic-error` | `#ef4444` | Error, danger, cancelled states |
| `--ntk-semantic-info` | `#3b82f6` | Informational, pending states |
| `--ntk-semantic-neutral` | `#64748b` | Inactive, disabled, muted |

### 2.2 Switchable Themes

Each theme defines `--ntk-accent`, `--ntk-accent-hover`, surface and text tokens via `[data-theme]`.

#### Theme: **Revolut** (default)
| Token | Value | Notes |
|-------|-------|-------|
| `--ntk-accent` | `#0f766e` (teal-700) | Primary action, brand accent |
| `--ntk-accent-hover` | `#115e59` (teal-800) | Hover state |
| `--ntk-accent-soft` | `rgba(15,118,110,0.08)` | Subtle background tint |
| `--ntk-shell-bg` | `#f1f5f9` | Page canvas |
| `--ntk-card-bg` | `#ffffff` | Card/panel surfaces |
| `--ntk-header-bg` | `#ffffff` | Shell header |
| `--ntk-drawer-bg` | `#ffffff` | Side drawer |
| `--ntk-text-primary` | `#0f172a` | Headlines |
| `--ntk-text-secondary` | `#64748b` | Body copy, labels |
| `--ntk-border` | `#e2e8f0` | Card/chip/row borders |
| `--ntk-avatar-bg` | `#0f766e` | User avatar background |

#### Theme: **Claude** (warm terracotta)
| Token | Value | Notes |
|-------|-------|-------|
| `--ntk-accent` | `#c96442` | Terracotta brand |
| `--ntk-accent-hover` | `#b5593a` | Darker terracotta |
| `--ntk-accent-soft` | `rgba(201,100,66,0.08)` | Soft terracotta tint |
| `--ntk-shell-bg` | `#faf9f5` | Ivory page canvas |
| `--ntk-card-bg` | `#ffffff` | Card surfaces |
| `--ntk-header-bg` | `#ffffff` | Shell header |
| `--ntk-drawer-bg` | `#ffffff` | Side drawer |
| `--ntk-text-primary` | `#141413` | Near-black text |
| `--ntk-text-secondary` | `#5e5d59` | Olive gray |
| `--ntk-border` | `#e8e6dc` | Warm sand border |
| `--ntk-avatar-bg` | `#c96442` | Terracotta avatar |

#### Theme: **Warp** (dark minimal)
| Token | Value | Notes |
|-------|-------|-------|
| `--ntk-accent` | `#e2e2e2` | Near-white accent on dark |
| `--ntk-accent-hover` | `#ffffff` | Full white hover |
| `--ntk-accent-soft` | `rgba(255,255,255,0.06)` | Frosted soft |
| `--ntk-shell-bg` | `#0e0e0d` | Deep void canvas |
| `--ntk-card-bg` | `#1a1a19` | Dark card surface |
| `--ntk-header-bg` | `#141413` | Dark header |
| `--ntk-drawer-bg` | `#141413` | Dark drawer |
| `--ntk-text-primary` | `#faf9f6` | Warm parchment text |
| `--ntk-text-secondary` | `#a3a3a3` | Muted gray |
| `--ntk-border` | `rgba(226,226,226,0.12)` | Frosted border |
| `--ntk-avatar-bg` | `#353534` | Earth gray avatar |

#### Theme: **Resend** (dark vibrant)
| Token | Value | Notes |
|-------|-------|-------|
| `--ntk-accent` | `#ffffff` | Pure white accent |
| `--ntk-accent-hover` | `rgba(255,255,255,0.85)` | Slight translucent |
| `--ntk-accent-soft` | `rgba(255,255,255,0.06)` | Soft highlight |
| `--ntk-shell-bg` | `#000000` | Void black canvas |
| `--ntk-card-bg` | `#0a0a0a` | Near-black card |
| `--ntk-header-bg` | `#000000` | Black header |
| `--ntk-drawer-bg` | `#000000` | Black drawer |
| `--ntk-text-primary` | `#f0f0f0` | Near-white text |
| `--ntk-text-secondary` | `#a1a1a1` | Muted text |
| `--ntk-border` | `rgba(214,235,253,0.12)` | Frost border |
| `--ntk-avatar-bg` | `#262626` | Dark gray avatar |

#### Theme: **Superhuman** (purple glow)
| Token | Value | Notes |
|-------|-------|-------|
| `--ntk-accent` | `#714cb6` | Amethyst accent |
| `--ntk-accent-hover` | `#5f3fa0` | Deeper amethyst |
| `--ntk-accent-soft` | `rgba(113,76,182,0.08)` | Soft purple tint |
| `--ntk-shell-bg` | `#f5f3f0` | Warm cream canvas |
| `--ntk-card-bg` | `#ffffff` | White cards |
| `--ntk-header-bg` | `#ffffff` | White header |
| `--ntk-drawer-bg` | `#ffffff` | White drawer |
| `--ntk-text-primary` | `#1b1938` | Mysteria purple-black |
| `--ntk-text-secondary` | `#6b6b80` | Muted purple-gray |
| `--ntk-border` | `#dcd7d3` | Parchment border |
| `--ntk-avatar-bg` | `#714cb6` | Amethyst avatar |

#### Theme: **Kraken** (deep purple)
| Token | Value | Notes |
|-------|-------|-------|
| `--ntk-accent` | `#7132f5` | Kraken purple |
| `--ntk-accent-hover` | `#5b1ecf` | Deep purple |
| `--ntk-accent-soft` | `rgba(113,50,245,0.08)` | Soft purple |
| `--ntk-shell-bg` | `#f8f8fc` | Cool white canvas |
| `--ntk-card-bg` | `#ffffff` | White cards |
| `--ntk-header-bg` | `#ffffff` | White header |
| `--ntk-drawer-bg` | `#ffffff` | White drawer |
| `--ntk-text-primary` | `#101114` | Near-black |
| `--ntk-text-secondary` | `#686b82` | Cool gray |
| `--ntk-border` | `#e0e0ea` | Cool border |
| `--ntk-avatar-bg` | `#7132f5` | Purple avatar |

---

## 3. Typography

| Level | Font | Weight | Size |
|-------|------|--------|------|
| Display / Shell title | `Inter`, system sans-serif | 700 | 18–20px |
| Body | `Inter`, system sans-serif | 400–500 | 13–14px |
| Caption / label | `Inter`, system sans-serif | 500–600 | 11–12px |
| Monospace | `Fira Code`, `Consolas` | 400 | 13px |

---

## 4. Components

### Stat Cards
- Flat card with left icon, value + label right
- Icon background uses `--ntk-accent-soft` tint per semantic tone
- Border uses `--ntk-border`, radius `12px`

### Charts
- Donut chart: pure CSS `conic-gradient()` with callout labels
- Bar chart: horizontal bars with axis ticks grid
- Chart card border: `--ntk-border`, no drop shadow

### User Avatar
- Circle with `--ntk-avatar-bg` background, white text
- Small: `40px`, Large (menu): `64px`
- Border: `2px solid #ffffff`
- Never falls back to Quasar's `--q-secondary`

### Buttons
- **Primary**: `background: var(--ntk-accent)`, `color: white`
- **Flat/Ghost**: `color: var(--ntk-accent)`, transparent background
- **FAB**: `background: var(--ntk-accent)`, shadow uses accent tint
- **Toggle**: `color: var(--ntk-accent)` when active
- ⚠️ **NEVER** use Quasar `color="primary"`, `color="teal-8"`, etc. — always use CSS variable overrides

### Navigation
- Sidebar active: `--ntk-accent-soft` background + `--ntk-accent` left border
- Header text accent: `--ntk-accent`
- Bar fill / progress: `--ntk-accent`

---

## 5. Layout

- Fixed header (`50px`), white or theme `--ntk-header-bg`
- Collapsible side drawer (`250px` → `56px` mini)
- Page canvas: `--ntk-shell-bg`
- Content grid: `12px` gap, `12px` padding
- Dashboard: Hero → Metrics grid → Charts grid → Content 2-column

---

## 6. Depth & Elevation

| Level | Usage | Implementation |
|-------|-------|----------------|
| **Flat** | Cards, metrics, rows | `border: 1px solid var(--ntk-border)`, no shadow |
| **Subtle** | Hover, FAB resting | `box-shadow: 0 1px 3px rgba(0,0,0,0.05)` |
| **Popup** | User menu, dialogs | `box-shadow: 0 4px 20px rgba(0,0,0,0.15)` |
| **Focus** | Keyboard focus rings | `outline: 2px solid var(--ntk-accent)` |

---

## 7. Do's and Don'ts

### Do's
- Use `var(--ntk-accent)` for all brand/accent touches
- Use `var(--ntk-semantic-*)` for success/warning/error/info
- Use `var(--ntk-border)` for all neutral borders
- Use `var(--ntk-shell-bg)` / `var(--ntk-card-bg)` for surfaces
- Switch themes purely by changing `data-theme` attribute on root

### Don'ts
- Never use Quasar `color="primary"`, `color="teal-8"`, `color="positive"` etc.
- Never hardcode hex colors in component templates — define in scoped CSS with custom properties
- Never create theme-specific CSS files per component — consume the global tokens
- Never mix light-theme and dark-theme values in the same container

---

## 8. Responsive

| Breakpoint | Layout |
|------------|--------|
| `> 1180px` | Charts side-by-side, full metrics grid |
| `768–1180px` | Charts stack, metrics wrap 2-column |
| `< 768px` | Single column, drawer overlays, simplified charts |

---

## 9. Agent Prompt Guide

When generating or modifying UI components for this project:

1. **Color**: Always reference `var(--ntk-accent)` for brand actions. Use `var(--ntk-semantic-*)` for status. Never write Quasar `color=` props.
2. **Surface**: Use `var(--ntk-card-bg)` for cards, `var(--ntk-shell-bg)` for page backgrounds.
3. **Borders**: Use `var(--ntk-border)` — no hardcoded gray hex values.
4. **Avatar**: Use `var(--ntk-avatar-bg)` — not `var(--q-secondary)` or `color="teal"`.
5. **Theme switching**: Set `document.documentElement.dataset.theme` to one of: `revolut`, `claude`, `warp`, `resend`, `superhuman`, `kraken`.
6. **Token file locations**: `src/styles/themes.css` for theme palettes, `src/styles/tokens.scss` for base tokens, `src/templates/styles/reference-app-bridge.scss` for template mapping.