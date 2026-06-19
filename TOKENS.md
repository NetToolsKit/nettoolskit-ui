# Design Tokens

Generated from `src/design-system/tokens/source.json`.
Do not edit by hand.

## Summary

| Group | Tokens | Description |
| --- | ---: | --- |
| `color` | 10 | Brand and compatibility colors. |
| `surface` | 10 | Default light-mode application surfaces. |
| `text` | 10 | Text hierarchy and aliases. |
| `border` | 6 | Border and input outline colors. |
| `feedback` | 15 | Semantic feedback colors using --ntk-* public aliases. |
| `gradient` | 7 | Reusable gradients expressed with token references. |
| `shadow` | 11 | Elevation shadows. |
| `radius` | 6 | Standard radius scale. |
| `spacing` | 7 | Base component spacing scale. |
| `typography` | 34 | Font families, sizes, weights, and line heights. |
| `motion` | 3 | Shared transition values. |

## Token Reference

Values are resolved. CSS values keep token references as CSS custom properties when a token points to another token.

### Color

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `color.primary` | `color` | `--ntk-primary` | `#0f766e` | `#0f766e` |
| `color.primaryDark` | `color` | `--ntk-primary-dark` | `#115e59` | `#115e59` |
| `color.primaryLight` | `color` | `--ntk-primary-light` | `#2dd4bf` | `#2dd4bf` |
| `color.primaryRgb` | `number` | `--ntk-primary-rgb` | `15, 118, 110` | `15, 118, 110` |
| `color.accent` | `color` | `--ntk-accent` | `#0f766e` | `var(--ntk-primary)` |
| `color.accentHover` | `color` | `--ntk-accent-hover` | `#115e59` | `var(--ntk-primary-dark)` |
| `color.secondary` | `color` | `--ntk-secondary` | `#0f766e` | `var(--ntk-accent)` |
| `color.secondaryDark` | `color` | `--ntk-secondary-dark` | `#115e59` | `var(--ntk-accent-hover)` |
| `color.secondaryLight` | `color` | `--ntk-secondary-light` | `#2dd4bf` | `var(--ntk-primary-light)` |
| `color.dark` | `color` | `--ntk-dark` | `#0f172a` | `#0f172a` |

### Surface

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `surface.bgPrimary` | `color` | `--ntk-bg-primary` | `#ffffff` | `#ffffff` |
| `surface.bgSecondary` | `color` | `--ntk-bg-secondary` | `#f8fafc` | `#f8fafc` |
| `surface.bgTertiary` | `color` | `--ntk-bg-tertiary` | `#f1f5f9` | `#f1f5f9` |
| `surface.bgCard` | `color` | `--ntk-bg-card` | `#ffffff` | `var(--ntk-bg-primary)` |
| `surface.bgElevated` | `color` | `--ntk-bg-elevated` | `#ffffff` | `var(--ntk-bg-primary)` |
| `surface.bgOverlay` | `color` | `--ntk-bg-overlay` | `rgba(0, 0, 0, 0.5)` | `rgba(0, 0, 0, 0.5)` |
| `surface.bgHover` | `color` | `--ntk-bg-hover` | `#f5f5f5` | `#f5f5f5` |
| `surface.bgActive` | `color` | `--ntk-bg-active` | `rgba(15, 118, 110, 0.08)` | `rgba(var(--ntk-primary-rgb), 0.08)` |
| `surface.bgLight` | `color` | `--ntk-bg-light` | `#f8fafc` | `var(--ntk-bg-secondary)` |
| `surface.darkPage` | `color` | `--ntk-dark-page` | `#f8fafc` | `var(--ntk-bg-secondary)` |

### Text

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `text.primary` | `color` | `--ntk-text-primary` | `#1e293b` | `#1e293b` |
| `text.secondary` | `color` | `--ntk-text-secondary` | `#64748b` | `#64748b` |
| `text.muted` | `color` | `--ntk-text-muted` | `#94a3b8` | `#94a3b8` |
| `text.inverse` | `color` | `--ntk-text-inverse` | `#ffffff` | `#ffffff` |
| `text.onPrimary` | `color` | `--ntk-text-on-primary` | `#ffffff` | `#ffffff` |
| `text.link` | `color` | `--ntk-text-link` | `#0f766e` | `var(--ntk-primary)` |
| `text.linkHover` | `color` | `--ntk-text-link-hover` | `#115e59` | `var(--ntk-primary-dark)` |
| `text.dark` | `color` | `--ntk-text-dark` | `#424242` | `#424242` |
| `text.light` | `color` | `--ntk-text-light` | `#757575` | `#757575` |
| `text.lighter` | `color` | `--ntk-text-lighter` | `#9e9e9e` | `#9e9e9e` |

### Border

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `border.color` | `color` | `--ntk-border-color` | `#e2e8f0` | `#e2e8f0` |
| `border.light` | `color` | `--ntk-border-light` | `#f1f5f9` | `#f1f5f9` |
| `border.dark` | `color` | `--ntk-border-dark` | `#cbd5e1` | `#cbd5e1` |
| `border.focus` | `color` | `--ntk-border-focus` | `#0f766e` | `var(--ntk-primary)` |
| `border.input` | `color` | `--ntk-border-input` | `rgba(0, 0, 0, 0.24)` | `rgba(0, 0, 0, 0.24)` |
| `border.inputHover` | `color` | `--ntk-border-input-hover` | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` |

### Feedback

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `feedback.success` | `color` | `--ntk-success` | `#10b981` | `#10b981` |
| `feedback.successLight` | `color` | `--ntk-success-light` | `#d1fae5` | `#d1fae5` |
| `feedback.successDark` | `color` | `--ntk-success-dark` | `#047857` | `#047857` |
| `feedback.warning` | `color` | `--ntk-warning` | `#f59e0b` | `#f59e0b` |
| `feedback.warningLight` | `color` | `--ntk-warning-light` | `#fef3c7` | `#fef3c7` |
| `feedback.warningDark` | `color` | `--ntk-warning-dark` | `#d97706` | `#d97706` |
| `feedback.error` | `color` | `--ntk-error` | `#ef4444` | `#ef4444` |
| `feedback.errorLight` | `color` | `--ntk-error-light` | `#fee2e2` | `#fee2e2` |
| `feedback.errorDark` | `color` | `--ntk-error-dark` | `#dc2626` | `#dc2626` |
| `feedback.info` | `color` | `--ntk-info` | `#14b8a6` | `#14b8a6` |
| `feedback.infoLight` | `color` | `--ntk-info-light` | `#ccfbf1` | `#ccfbf1` |
| `feedback.infoDark` | `color` | `--ntk-info-dark` | `#0f766e` | `#0f766e` |
| `feedback.positive` | `color` | `--ntk-positive` | `#10b981` | `var(--ntk-success)` |
| `feedback.negative` | `color` | `--ntk-negative` | `#ef4444` | `var(--ntk-error)` |
| `feedback.danger` | `color` | `--ntk-danger` | `#ef4444` | `var(--ntk-error)` |

### Gradient

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `gradient.primaryStart` | `color` | `--ntk-primary-gradient-start` | `#0f766e` | `var(--ntk-primary)` |
| `gradient.primaryEnd` | `color` | `--ntk-primary-gradient-end` | `#2dd4bf` | `var(--ntk-primary-light)` |
| `gradient.primary` | `gradient` | `--ntk-primary-gradient` | `linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)` | `linear-gradient(135deg, var(--ntk-primary-gradient-start) 0%, var(--ntk-primary-gradient-end) 100%)` |
| `gradient.primaryHover` | `gradient` | `--ntk-primary-gradient-hover` | `linear-gradient(135deg, #115e59 0%, #0f766e 100%)` | `linear-gradient(135deg, var(--ntk-primary-dark) 0%, var(--ntk-primary) 100%)` |
| `gradient.hero` | `gradient` | `--ntk-gradient-hero` | `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)` | `linear-gradient(135deg, var(--ntk-bg-primary) 0%, var(--ntk-bg-secondary) 100%)` |
| `gradient.loading` | `gradient` | `--ntk-gradient-loading` | `linear-gradient(90deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)` | `linear-gradient(90deg, var(--ntk-bg-secondary) 0%, var(--ntk-bg-tertiary) 50%, var(--ntk-bg-secondary) 100%)` |
| `gradient.accent` | `gradient` | `--ntk-gradient-accent` | `linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)` | `linear-gradient(135deg, var(--ntk-primary-gradient-start) 0%, var(--ntk-primary-gradient-end) 100%)` |

### Shadow

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `shadow.color` | `color` | `--ntk-shadow-color` | `#0f172a` | `#0f172a` |
| `shadow.sm` | `shadow` | `--ntk-shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` |
| `shadow.md` | `shadow` | `--ntk-shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` |
| `shadow.lg` | `shadow` | `--ntk-shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` |
| `shadow.xl` | `shadow` | `--ntk-shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` |
| `shadow.card` | `shadow` | `--ntk-shadow-card` | `0 4px 8px rgba(0, 0, 0, 0.15)` | `0 4px 8px rgba(0, 0, 0, 0.15)` |
| `shadow.cardHover` | `shadow` | `--ntk-shadow-card-hover` | `0 8px 16px rgba(0, 0, 0, 0.2)` | `0 8px 16px rgba(0, 0, 0, 0.2)` |
| `shadow.popup` | `shadow` | `--ntk-shadow-popup` | `0 8px 24px rgba(0, 0, 0, 0.25)` | `0 8px 24px rgba(0, 0, 0, 0.25)` |
| `shadow.focus` | `shadow` | `--ntk-shadow-focus` | `0 4px 8px rgba(15, 118, 110, 0.2)` | `0 4px 8px rgba(var(--ntk-primary-rgb), 0.2)` |
| `shadow.medium` | `shadow` | `--ntk-shadow-medium` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` | `var(--ntk-shadow-md)` |
| `shadow.large` | `shadow` | `--ntk-shadow-large` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | `var(--ntk-shadow-lg)` |

### Radius

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `radius.sm` | `dimension` | `--ntk-radius-sm` | `4px` | `4px` |
| `radius.md` | `dimension` | `--ntk-radius-md` | `8px` | `8px` |
| `radius.lg` | `dimension` | `--ntk-radius-lg` | `12px` | `12px` |
| `radius.xl` | `dimension` | `--ntk-radius-xl` | `16px` | `16px` |
| `radius.2xl` | `dimension` | `--ntk-radius-2xl` | `24px` | `24px` |
| `radius.full` | `dimension` | `--ntk-radius-full` | `9999px` | `9999px` |

### Spacing

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `spacing.xs` | `dimension` | `--ntk-spacing-xs` | `0.25rem` | `0.25rem` |
| `spacing.sm` | `dimension` | `--ntk-spacing-sm` | `0.5rem` | `0.5rem` |
| `spacing.md` | `dimension` | `--ntk-spacing-md` | `1rem` | `1rem` |
| `spacing.lg` | `dimension` | `--ntk-spacing-lg` | `1.5rem` | `1.5rem` |
| `spacing.xl` | `dimension` | `--ntk-spacing-xl` | `2rem` | `2rem` |
| `spacing.2xl` | `dimension` | `--ntk-spacing-2xl` | `3rem` | `3rem` |
| `spacing.3xl` | `dimension` | `--ntk-spacing-3xl` | `4rem` | `4rem` |

### Typography

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `typography.fontFamily.base` | `fontFamily` | `--ntk-font-family` | `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `typography.fontFamily.display` | `fontFamily` | `--ntk-font-family-display` | `'Sora', 'Plus Jakarta Sans', sans-serif` | `'Sora', 'Plus Jakarta Sans', sans-serif` |
| `typography.fontFamily.mono` | `fontFamily` | `--ntk-font-family-mono` | `'Fira Code', 'Consolas', 'Monaco', monospace` | `'Fira Code', 'Consolas', 'Monaco', monospace` |
| `typography.fontFamily.body` | `fontFamily` | `--ntk-font-body` | `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `var(--ntk-font-family)` |
| `typography.fontFamily.displayAlias` | `fontFamily` | `--ntk-font-display` | `'Sora', 'Plus Jakarta Sans', sans-serif` | `var(--ntk-font-family-display)` |
| `typography.fontSize.xs` | `dimension` | `--ntk-font-size-xs` | `0.75rem` | `0.75rem` |
| `typography.fontSize.sm` | `dimension` | `--ntk-font-size-sm` | `0.875rem` | `0.875rem` |
| `typography.fontSize.base` | `dimension` | `--ntk-font-size-base` | `1rem` | `1rem` |
| `typography.fontSize.lg` | `dimension` | `--ntk-font-size-lg` | `1.125rem` | `1.125rem` |
| `typography.fontSize.xl` | `dimension` | `--ntk-font-size-xl` | `1.25rem` | `1.25rem` |
| `typography.fontSize.2xl` | `dimension` | `--ntk-font-size-2xl` | `1.5rem` | `1.5rem` |
| `typography.fontSize.3xl` | `dimension` | `--ntk-font-size-3xl` | `1.875rem` | `1.875rem` |
| `typography.fontSize.4xl` | `dimension` | `--ntk-font-size-4xl` | `2.25rem` | `2.25rem` |
| `typography.fontSize.textXs` | `dimension` | `--ntk-text-xs` | `0.75rem` | `var(--ntk-font-size-xs)` |
| `typography.fontSize.textSm` | `dimension` | `--ntk-text-sm` | `0.875rem` | `var(--ntk-font-size-sm)` |
| `typography.fontSize.textBase` | `dimension` | `--ntk-text-base` | `1rem` | `var(--ntk-font-size-base)` |
| `typography.fontSize.textLg` | `dimension` | `--ntk-text-lg` | `1.125rem` | `var(--ntk-font-size-lg)` |
| `typography.fontSize.textXl` | `dimension` | `--ntk-text-xl` | `1.25rem` | `var(--ntk-font-size-xl)` |
| `typography.fontSize.text2xl` | `dimension` | `--ntk-text-2xl` | `1.5rem` | `var(--ntk-font-size-2xl)` |
| `typography.fontSize.text3xl` | `dimension` | `--ntk-text-3xl` | `1.875rem` | `var(--ntk-font-size-3xl)` |
| `typography.fontSize.text4xl` | `dimension` | `--ntk-text-4xl` | `2.25rem` | `var(--ntk-font-size-4xl)` |
| `typography.fontWeight.normal` | `fontWeight` | `--ntk-font-weight-normal` | `400` | `400` |
| `typography.fontWeight.medium` | `fontWeight` | `--ntk-font-weight-medium` | `500` | `500` |
| `typography.fontWeight.semibold` | `fontWeight` | `--ntk-font-weight-semibold` | `600` | `600` |
| `typography.fontWeight.bold` | `fontWeight` | `--ntk-font-weight-bold` | `700` | `700` |
| `typography.fontWeight.extrabold` | `fontWeight` | `--ntk-font-weight-extrabold` | `800` | `800` |
| `typography.fontWeight.normalAlias` | `fontWeight` | `--ntk-font-normal` | `400` | `var(--ntk-font-weight-normal)` |
| `typography.fontWeight.mediumAlias` | `fontWeight` | `--ntk-font-medium` | `500` | `var(--ntk-font-weight-medium)` |
| `typography.fontWeight.semiboldAlias` | `fontWeight` | `--ntk-font-semibold` | `600` | `var(--ntk-font-weight-semibold)` |
| `typography.fontWeight.boldAlias` | `fontWeight` | `--ntk-font-bold` | `700` | `var(--ntk-font-weight-bold)` |
| `typography.fontWeight.extraboldAlias` | `fontWeight` | `--ntk-font-extrabold` | `800` | `var(--ntk-font-weight-extrabold)` |
| `typography.lineHeight.tight` | `number` | `--ntk-line-height-tight` | `1.2` | `1.2` |
| `typography.lineHeight.normal` | `number` | `--ntk-line-height-normal` | `1.6` | `1.6` |
| `typography.lineHeight.relaxed` | `number` | `--ntk-line-height-relaxed` | `1.8` | `1.8` |

### Motion

| Token | Type | CSS variable | Value | CSS value |
| --- | --- | --- | --- | --- |
| `motion.fast` | `transition` | `--ntk-transition-fast` | `150ms ease-in-out` | `150ms ease-in-out` |
| `motion.base` | `transition` | `--ntk-transition-base` | `250ms ease-in-out` | `250ms ease-in-out` |
| `motion.slow` | `transition` | `--ntk-transition-slow` | `350ms ease-in-out` | `350ms ease-in-out` |