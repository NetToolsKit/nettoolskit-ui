# Component Recipes

Generated from `src/design-system/core/components/contracts.ts`, `src/design-system/core/components/button.ts`, `src/design-system/core/components/field.ts`, `src/design-system/core/components/card.ts`, `src/design-system/core/components/table.ts`, `src/design-system/core/components/page.ts`, `src/design-system/core/components/section.ts`, `src/design-system/core/components/page-header.ts`, `src/design-system/core/components/toolbar.ts`, `src/design-system/core/components/filter-bar.ts`, `src/design-system/core/components/form-layout.ts`, `src/design-system/core/components/dialog.ts`, `src/design-system/core/components/empty-state.ts`, `src/design-system/core/components/metric-grid.ts`, `src/design-system/core/components/state-block.ts`.
Do not edit by hand.

## Shared Primitives

- Sizes: `sm`, `md`, `lg`.
- Intents: `neutral`, `primary`, `success`, `warning`, `danger`, `info`.

## Vue Wrappers

| Component | Contract | Source | Purpose |
| --- | --- | --- | --- |
| DsButton | `NtkButtonContract` | `src/design-system/vue/components/DsButton.vue` | Native Vue button wrapper backed by the button contract and class recipe. |
| DsCard | `NtkCardContract` | `src/design-system/vue/components/DsCard.vue` | Native Vue card wrapper backed by the card contract and class recipe. |
| DsInput | `NtkFieldContract` | `src/design-system/vue/components/DsInput.vue` | Native Vue input wrapper backed by the field contract and class recipe. |
| DsSelect | `NtkFieldContract` | `src/design-system/vue/components/DsSelect.vue` | Native Vue select wrapper backed by the field contract and class recipe. |
| DsTable | `NtkTableContract` | `src/design-system/vue/components/DsTable.vue` | Native Vue table wrapper backed by the table contract and class recipe. |
| DsPage | `NtkPageContract` | `src/design-system/vue/components/DsPage.vue` | Native Vue page landmark backed by the page contract and class recipe. |
| DsSection | `NtkSectionContract` | `src/design-system/vue/components/DsSection.vue` | Native Vue section landmark backed by the section contract and class recipe. |
| DsPageHeader | `NtkPageHeaderContract` | `src/design-system/vue/components/DsPageHeader.vue` | Native Vue page header backed by the page header contract and class recipe. |
| DsToolbar | `NtkToolbarContract` | `src/design-system/vue/components/DsToolbar.vue` | Native Vue command toolbar backed by the toolbar contract and class recipe. |
| DsFilterBar | `NtkFilterBarContract` | `src/design-system/vue/components/DsFilterBar.vue` | Native Vue filter bar backed by the filter bar contract and class recipe. |
| DsFormLayout | `NtkFormLayoutContract` | `src/design-system/vue/components/DsFormLayout.vue` | Native Vue form layout backed by the form layout contract and class recipe. |
| DsDialog | `NtkDialogContract` | `src/design-system/vue/components/DsDialog.vue` | Native dialog modal backed by the dialog contract and class recipe. |
| DsEmptyState | `NtkEmptyStateContract` | `src/design-system/vue/components/DsEmptyState.vue` | Native Vue empty state backed by the empty state contract and class recipe. |
| DsMetricGrid | `NtkMetricGridContract` | `src/design-system/vue/components/DsMetricGrid.vue` | Native Vue metric grid backed by the metric grid contract and class recipe. |
| DsStateBlock | `NtkStateBlockContract` | `src/design-system/vue/components/DsStateBlock.vue` | Native Vue state block backed by the state block contract and class recipe. |

## Button

Action trigger recipe for command, navigation, and submit buttons.

Source: `src/design-system/core/components/button.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `solid`, size `md`, intent `primary` |
| Variants | `solid`, `outline`, `ghost`, `link` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `disabled`, `loading` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `label` | Yes | `string` | `NtkButtonContract` |
| `variant` | Yes | `NtkButtonVariant` | `NtkButtonContract` |
| `size` | Yes | `NtkButtonSize` | `NtkButtonContract` |
| `intent` | Yes | `NtkButtonIntent` | `NtkButtonContract` |
| `density` | Yes | `NtkButtonDensity` | `NtkButtonContract` |
| `disabled` | Yes | `boolean` | `NtkButtonContract` |
| `loading` | Yes | `boolean` | `NtkButtonContract` |
| `icon` | Yes | `string` | `NtkButtonContract` |
| `iconRight` | Yes | `string` | `NtkButtonContract` |
| `type` | Yes | `'button' \\| 'submit' \\| 'reset'` | `NtkButtonContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-button` |
| `variant solid` | `ntk-button--variant-solid` |
| `variant outline` | `ntk-button--variant-outline` |
| `variant ghost` | `ntk-button--variant-ghost` |
| `variant link` | `ntk-button--variant-link` |
| `size sm` | `ntk-button--size-sm` |
| `size md` | `ntk-button--size-md` |
| `size lg` | `ntk-button--size-lg` |
| `intent neutral` | `ntk-button--intent-neutral` |
| `intent primary` | `ntk-button--intent-primary` |
| `intent success` | `ntk-button--intent-success` |
| `intent warning` | `ntk-button--intent-warning` |
| `intent danger` | `ntk-button--intent-danger` |
| `intent info` | `ntk-button--intent-info` |
| `state disabled` | `ntk-button--is-disabled` |
| `state loading` | `ntk-button--is-loading` |

## Field

Input wrapper recipe for labels, validation states, and form density.

Source: `src/design-system/core/components/field.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `outlined`, size `md`, intent `neutral` |
| Variants | `outlined`, `filled`, `plain` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `disabled`, `invalid`, `readonly`, `required` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `modelValue` | Yes | `TValue` | `NtkFieldContract` |
| `name` | Yes | `string` | `NtkFieldContract` |
| `label` | Yes | `string` | `NtkFieldContract` |
| `placeholder` | Yes | `string` | `NtkFieldContract` |
| `variant` | Yes | `NtkFieldVariant` | `NtkFieldContract` |
| `size` | Yes | `NtkFieldSize` | `NtkFieldContract` |
| `intent` | Yes | `NtkFieldIntent` | `NtkFieldContract` |
| `density` | Yes | `NtkFieldDensity` | `NtkFieldContract` |
| `disabled` | Yes | `boolean` | `NtkFieldContract` |
| `readonly` | Yes | `boolean` | `NtkFieldContract` |
| `required` | Yes | `boolean` | `NtkFieldContract` |
| `invalid` | Yes | `boolean` | `NtkFieldContract` |
| `hint` | Yes | `string` | `NtkFieldContract` |
| `errorMessage` | Yes | `string` | `NtkFieldContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-field` |
| `variant outlined` | `ntk-field--variant-outlined` |
| `variant filled` | `ntk-field--variant-filled` |
| `variant plain` | `ntk-field--variant-plain` |
| `size sm` | `ntk-field--size-sm` |
| `size md` | `ntk-field--size-md` |
| `size lg` | `ntk-field--size-lg` |
| `intent neutral` | `ntk-field--intent-neutral` |
| `intent primary` | `ntk-field--intent-primary` |
| `intent success` | `ntk-field--intent-success` |
| `intent warning` | `ntk-field--intent-warning` |
| `intent danger` | `ntk-field--intent-danger` |
| `intent info` | `ntk-field--intent-info` |
| `state disabled` | `ntk-field--is-disabled` |
| `state invalid` | `ntk-field--is-invalid` |
| `state readonly` | `ntk-field--is-readonly` |
| `state required` | `ntk-field--is-required` |

## Card

Content container recipe for panels, selectable rows, and accent treatments.

Source: `src/design-system/core/components/card.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `outlined`, `elevated`, `accent-left`, `accent-top` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `clickable`, `selected` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkCardContract` |
| `subtitle` | Yes | `string` | `NtkCardContract` |
| `variant` | Yes | `NtkCardVariant` | `NtkCardContract` |
| `size` | Yes | `NtkCardSize` | `NtkCardContract` |
| `intent` | Yes | `NtkCardIntent` | `NtkCardContract` |
| `clickable` | Yes | `boolean` | `NtkCardContract` |
| `selected` | Yes | `boolean` | `NtkCardContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-card` |
| `variant default` | `ntk-card--variant-default` |
| `variant outlined` | `ntk-card--variant-outlined` |
| `variant elevated` | `ntk-card--variant-elevated` |
| `variant accent-left` | `ntk-card--variant-accent-left` |
| `variant accent-top` | `ntk-card--variant-accent-top` |
| `size sm` | `ntk-card--size-sm` |
| `size md` | `ntk-card--size-md` |
| `size lg` | `ntk-card--size-lg` |
| `intent neutral` | `ntk-card--intent-neutral` |
| `intent primary` | `ntk-card--intent-primary` |
| `intent success` | `ntk-card--intent-success` |
| `intent warning` | `ntk-card--intent-warning` |
| `intent danger` | `ntk-card--intent-danger` |
| `intent info` | `ntk-card--intent-info` |
| `state clickable` | `ntk-card--is-clickable` |
| `state selected` | `ntk-card--is-selected` |

## Table

Data table recipe for row lists, selectable records, and empty states.

Source: `src/design-system/core/components/table.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `bordered`, `striped` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `selected`, `clickable` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `caption` | Yes | `string` | `NtkTableContract` |
| `ariaLabel` | Yes | `string` | `NtkTableContract` |
| `columns` | Yes | `readonly NtkTableColumn[]` | `NtkTableContract` |
| `rows` | Yes | `readonly NtkTableRow[]` | `NtkTableContract` |
| `selectedKeys` | Yes | `readonly string[]` | `NtkTableContract` |
| `variant` | Yes | `NtkTableVariant` | `NtkTableContract` |
| `size` | Yes | `NtkTableSize` | `NtkTableContract` |
| `intent` | Yes | `NtkTableIntent` | `NtkTableContract` |
| `density` | Yes | `NtkTableDensity` | `NtkTableContract` |
| `selectable` | Yes | `boolean` | `NtkTableContract` |
| `emptyLabel` | Yes | `string` | `NtkTableContract` |
| `emptyValueLabel` | Yes | `string` | `NtkTableContract` |
| `sort` | Yes | `NtkTableSort \\| null` | `NtkTableContract` |
| `pagination` | Yes | `NtkTablePagination \\| null` | `NtkTableContract` |
| `loading` | Yes | `boolean` | `NtkTableContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-table` |
| `variant default` | `ntk-table--variant-default` |
| `variant bordered` | `ntk-table--variant-bordered` |
| `variant striped` | `ntk-table--variant-striped` |
| `size sm` | `ntk-table--size-sm` |
| `size md` | `ntk-table--size-md` |
| `size lg` | `ntk-table--size-lg` |
| `intent neutral` | `ntk-table--intent-neutral` |
| `intent primary` | `ntk-table--intent-primary` |
| `intent success` | `ntk-table--intent-success` |
| `intent warning` | `ntk-table--intent-warning` |
| `intent danger` | `ntk-table--intent-danger` |
| `intent info` | `ntk-table--intent-info` |
| `state selected` | `ntk-table--has-selection` |
| `state clickable` | `ntk-table--has-clickable-rows` |

## Page

Page landmark recipe for primary content layouts and page headers.

Source: `src/design-system/core/components/page.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `surface`, `dashboard` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkPageContract` |
| `subtitle` | Yes | `string` | `NtkPageContract` |
| `ariaLabel` | Yes | `string` | `NtkPageContract` |
| `variant` | Yes | `NtkPageVariant` | `NtkPageContract` |
| `size` | Yes | `NtkPageSize` | `NtkPageContract` |
| `intent` | Yes | `NtkPageIntent` | `NtkPageContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-page` |
| `variant default` | `ntk-page--variant-default` |
| `variant surface` | `ntk-page--variant-surface` |
| `variant dashboard` | `ntk-page--variant-dashboard` |
| `size sm` | `ntk-page--size-sm` |
| `size md` | `ntk-page--size-md` |
| `size lg` | `ntk-page--size-lg` |
| `intent neutral` | `ntk-page--intent-neutral` |
| `intent primary` | `ntk-page--intent-primary` |
| `intent success` | `ntk-page--intent-success` |
| `intent warning` | `ntk-page--intent-warning` |
| `intent danger` | `ntk-page--intent-danger` |
| `intent info` | `ntk-page--intent-info` |

## Section

Section landmark recipe for grouped content, headings, and nested layout bands.

Source: `src/design-system/core/components/section.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `surface`, `muted`, `accent` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkSectionContract` |
| `subtitle` | Yes | `string` | `NtkSectionContract` |
| `eyebrow` | Yes | `string` | `NtkSectionContract` |
| `ariaLabel` | Yes | `string` | `NtkSectionContract` |
| `headingLevel` | Yes | `NtkSectionHeadingLevel` | `NtkSectionContract` |
| `variant` | Yes | `NtkSectionVariant` | `NtkSectionContract` |
| `size` | Yes | `NtkSectionSize` | `NtkSectionContract` |
| `intent` | Yes | `NtkSectionIntent` | `NtkSectionContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-section` |
| `variant default` | `ntk-section--variant-default` |
| `variant surface` | `ntk-section--variant-surface` |
| `variant muted` | `ntk-section--variant-muted` |
| `variant accent` | `ntk-section--variant-accent` |
| `size sm` | `ntk-section--size-sm` |
| `size md` | `ntk-section--size-md` |
| `size lg` | `ntk-section--size-lg` |
| `intent neutral` | `ntk-section--intent-neutral` |
| `intent primary` | `ntk-section--intent-primary` |
| `intent success` | `ntk-section--intent-success` |
| `intent warning` | `ntk-section--intent-warning` |
| `intent danger` | `ntk-section--intent-danger` |
| `intent info` | `ntk-section--intent-info` |

## Page header

Page header recipe for titles, descriptions, breadcrumb, and action areas.

Source: `src/design-system/core/components/page-header.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `compact`, `hero` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkPageHeaderContract` |
| `description` | Yes | `string` | `NtkPageHeaderContract` |
| `eyebrow` | Yes | `string` | `NtkPageHeaderContract` |
| `ariaLabel` | Yes | `string` | `NtkPageHeaderContract` |
| `headingLevel` | Yes | `NtkPageHeaderHeadingLevel` | `NtkPageHeaderContract` |
| `variant` | Yes | `NtkPageHeaderVariant` | `NtkPageHeaderContract` |
| `size` | Yes | `NtkPageHeaderSize` | `NtkPageHeaderContract` |
| `intent` | Yes | `NtkPageHeaderIntent` | `NtkPageHeaderContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-page-header` |
| `variant default` | `ntk-page-header--variant-default` |
| `variant compact` | `ntk-page-header--variant-compact` |
| `variant hero` | `ntk-page-header--variant-hero` |
| `size sm` | `ntk-page-header--size-sm` |
| `size md` | `ntk-page-header--size-md` |
| `size lg` | `ntk-page-header--size-lg` |
| `intent neutral` | `ntk-page-header--intent-neutral` |
| `intent primary` | `ntk-page-header--intent-primary` |
| `intent success` | `ntk-page-header--intent-success` |
| `intent warning` | `ntk-page-header--intent-warning` |
| `intent danger` | `ntk-page-header--intent-danger` |
| `intent info` | `ntk-page-header--intent-info` |

## Toolbar

Command toolbar recipe for dense action rows with density and alignment.

Source: `src/design-system/core/components/toolbar.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `bordered`, `floating` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `ariaLabel` | Yes | `string` | `NtkToolbarContract` |
| `variant` | Yes | `NtkToolbarVariant` | `NtkToolbarContract` |
| `size` | Yes | `NtkToolbarSize` | `NtkToolbarContract` |
| `intent` | Yes | `NtkToolbarIntent` | `NtkToolbarContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkToolbarContract` |
| `align` | Yes | `NtkToolbarAlign` | `NtkToolbarContract` |
| `wrap` | Yes | `boolean` | `NtkToolbarContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-toolbar` |
| `variant default` | `ntk-toolbar--variant-default` |
| `variant bordered` | `ntk-toolbar--variant-bordered` |
| `variant floating` | `ntk-toolbar--variant-floating` |
| `size sm` | `ntk-toolbar--size-sm` |
| `size md` | `ntk-toolbar--size-md` |
| `size lg` | `ntk-toolbar--size-lg` |
| `intent neutral` | `ntk-toolbar--intent-neutral` |
| `intent primary` | `ntk-toolbar--intent-primary` |
| `intent success` | `ntk-toolbar--intent-success` |
| `intent warning` | `ntk-toolbar--intent-warning` |
| `intent danger` | `ntk-toolbar--intent-danger` |
| `intent info` | `ntk-toolbar--intent-info` |

## Filter bar

Filter bar recipe for search, filter controls, and apply/reset actions.

Source: `src/design-system/core/components/filter-bar.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `inline`, `stacked` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `loading` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `ariaLabel` | Yes | `string` | `NtkFilterBarContract` |
| `variant` | Yes | `NtkFilterBarVariant` | `NtkFilterBarContract` |
| `size` | Yes | `NtkFilterBarSize` | `NtkFilterBarContract` |
| `intent` | Yes | `NtkFilterBarIntent` | `NtkFilterBarContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkFilterBarContract` |
| `loading` | Yes | `boolean` | `NtkFilterBarContract` |
| `applyLabel` | Yes | `string` | `NtkFilterBarContract` |
| `resetLabel` | Yes | `string` | `NtkFilterBarContract` |
| `showActions` | Yes | `boolean` | `NtkFilterBarContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-filter-bar` |
| `variant default` | `ntk-filter-bar--variant-default` |
| `variant inline` | `ntk-filter-bar--variant-inline` |
| `variant stacked` | `ntk-filter-bar--variant-stacked` |
| `size sm` | `ntk-filter-bar--size-sm` |
| `size md` | `ntk-filter-bar--size-md` |
| `size lg` | `ntk-filter-bar--size-lg` |
| `intent neutral` | `ntk-filter-bar--intent-neutral` |
| `intent primary` | `ntk-filter-bar--intent-primary` |
| `intent success` | `ntk-filter-bar--intent-success` |
| `intent warning` | `ntk-filter-bar--intent-warning` |
| `intent danger` | `ntk-filter-bar--intent-danger` |
| `intent info` | `ntk-filter-bar--intent-info` |
| `state loading` | `ntk-filter-bar--is-loading` |

## Form layout

Form layout recipe for responsive label, field grouping, and column density.

Source: `src/design-system/core/components/form-layout.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `stacked`, size `md`, intent `neutral` |
| Variants | `stacked`, `grid`, `inline` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `ariaLabel` | Yes | `string` | `NtkFormLayoutContract` |
| `variant` | Yes | `NtkFormLayoutVariant` | `NtkFormLayoutContract` |
| `size` | Yes | `NtkFormLayoutSize` | `NtkFormLayoutContract` |
| `intent` | Yes | `NtkFormLayoutIntent` | `NtkFormLayoutContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkFormLayoutContract` |
| `columns` | Yes | `NtkFormLayoutColumnCount` | `NtkFormLayoutContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-form-layout` |
| `variant stacked` | `ntk-form-layout--variant-stacked` |
| `variant grid` | `ntk-form-layout--variant-grid` |
| `variant inline` | `ntk-form-layout--variant-inline` |
| `size sm` | `ntk-form-layout--size-sm` |
| `size md` | `ntk-form-layout--size-md` |
| `size lg` | `ntk-form-layout--size-lg` |
| `intent neutral` | `ntk-form-layout--intent-neutral` |
| `intent primary` | `ntk-form-layout--intent-primary` |
| `intent success` | `ntk-form-layout--intent-success` |
| `intent warning` | `ntk-form-layout--intent-warning` |
| `intent danger` | `ntk-form-layout--intent-danger` |
| `intent info` | `ntk-form-layout--intent-info` |

## Dialog

Accessible modal recipe for title, body, and action content surfaces.

Source: `src/design-system/core/components/dialog.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `sheet`, `fullscreen` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `modelValue` | Yes | `boolean` | `NtkDialogContract` |
| `title` | Yes | `string` | `NtkDialogContract` |
| `description` | Yes | `string` | `NtkDialogContract` |
| `ariaLabel` | Yes | `string` | `NtkDialogContract` |
| `variant` | Yes | `NtkDialogVariant` | `NtkDialogContract` |
| `size` | Yes | `NtkDialogSize` | `NtkDialogContract` |
| `intent` | Yes | `NtkDialogIntent` | `NtkDialogContract` |
| `persistent` | Yes | `boolean` | `NtkDialogContract` |
| `closeLabel` | Yes | `string` | `NtkDialogContract` |
| `hideClose` | Yes | `boolean` | `NtkDialogContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-dialog` |
| `variant default` | `ntk-dialog--variant-default` |
| `variant sheet` | `ntk-dialog--variant-sheet` |
| `variant fullscreen` | `ntk-dialog--variant-fullscreen` |
| `size sm` | `ntk-dialog--size-sm` |
| `size md` | `ntk-dialog--size-md` |
| `size lg` | `ntk-dialog--size-lg` |
| `intent neutral` | `ntk-dialog--intent-neutral` |
| `intent primary` | `ntk-dialog--intent-primary` |
| `intent success` | `ntk-dialog--intent-success` |
| `intent warning` | `ntk-dialog--intent-warning` |
| `intent danger` | `ntk-dialog--intent-danger` |
| `intent info` | `ntk-dialog--intent-info` |

## Empty state

Empty state recipe for empty, no-results, and error placeholders with actions.

Source: `src/design-system/core/components/empty-state.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `bordered`, `ghost` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkEmptyStateContract` |
| `description` | Yes | `string` | `NtkEmptyStateContract` |
| `icon` | Yes | `string` | `NtkEmptyStateContract` |
| `ariaLabel` | Yes | `string` | `NtkEmptyStateContract` |
| `variant` | Yes | `NtkEmptyStateVariant` | `NtkEmptyStateContract` |
| `size` | Yes | `NtkEmptyStateSize` | `NtkEmptyStateContract` |
| `intent` | Yes | `NtkEmptyStateIntent` | `NtkEmptyStateContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-empty-state` |
| `variant default` | `ntk-empty-state--variant-default` |
| `variant bordered` | `ntk-empty-state--variant-bordered` |
| `variant ghost` | `ntk-empty-state--variant-ghost` |
| `size sm` | `ntk-empty-state--size-sm` |
| `size md` | `ntk-empty-state--size-md` |
| `size lg` | `ntk-empty-state--size-lg` |
| `intent neutral` | `ntk-empty-state--intent-neutral` |
| `intent primary` | `ntk-empty-state--intent-primary` |
| `intent success` | `ntk-empty-state--intent-success` |
| `intent warning` | `ntk-empty-state--intent-warning` |
| `intent danger` | `ntk-empty-state--intent-danger` |
| `intent info` | `ntk-empty-state--intent-info` |

## Metric grid

Metric grid recipe for responsive metric cards and dashboard summaries.

Source: `src/design-system/core/components/metric-grid.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `bordered`, `plain` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `ariaLabel` | Yes | `string` | `NtkMetricGridContract` |
| `metrics` | Yes | `readonly NtkMetricItem[]` | `NtkMetricGridContract` |
| `variant` | Yes | `NtkMetricGridVariant` | `NtkMetricGridContract` |
| `size` | Yes | `NtkMetricGridSize` | `NtkMetricGridContract` |
| `intent` | Yes | `NtkMetricGridIntent` | `NtkMetricGridContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkMetricGridContract` |
| `columns` | Yes | `NtkMetricGridColumnCount` | `NtkMetricGridContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-metric-grid` |
| `variant default` | `ntk-metric-grid--variant-default` |
| `variant bordered` | `ntk-metric-grid--variant-bordered` |
| `variant plain` | `ntk-metric-grid--variant-plain` |
| `size sm` | `ntk-metric-grid--size-sm` |
| `size md` | `ntk-metric-grid--size-md` |
| `size lg` | `ntk-metric-grid--size-lg` |
| `intent neutral` | `ntk-metric-grid--intent-neutral` |
| `intent primary` | `ntk-metric-grid--intent-primary` |
| `intent success` | `ntk-metric-grid--intent-success` |
| `intent warning` | `ntk-metric-grid--intent-warning` |
| `intent danger` | `ntk-metric-grid--intent-danger` |
| `intent info` | `ntk-metric-grid--intent-info` |

## State block

State block recipe for loading, error, empty, success, and skeleton placeholders.

Source: `src/design-system/core/components/state-block.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `inline`, `overlay` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `state` | Yes | `NtkStateBlockState` | `NtkStateBlockContract` |
| `title` | Yes | `string` | `NtkStateBlockContract` |
| `description` | Yes | `string` | `NtkStateBlockContract` |
| `icon` | Yes | `string` | `NtkStateBlockContract` |
| `ariaLabel` | Yes | `string` | `NtkStateBlockContract` |
| `variant` | Yes | `NtkStateBlockVariant` | `NtkStateBlockContract` |
| `size` | Yes | `NtkStateBlockSize` | `NtkStateBlockContract` |
| `intent` | Yes | `NtkStateBlockIntent` | `NtkStateBlockContract` |
| `skeletonLines` | Yes | `number` | `NtkStateBlockContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-state-block` |
| `variant default` | `ntk-state-block--variant-default` |
| `variant inline` | `ntk-state-block--variant-inline` |
| `variant overlay` | `ntk-state-block--variant-overlay` |
| `size sm` | `ntk-state-block--size-sm` |
| `size md` | `ntk-state-block--size-md` |
| `size lg` | `ntk-state-block--size-lg` |
| `intent neutral` | `ntk-state-block--intent-neutral` |
| `intent primary` | `ntk-state-block--intent-primary` |
| `intent success` | `ntk-state-block--intent-success` |
| `intent warning` | `ntk-state-block--intent-warning` |
| `intent danger` | `ntk-state-block--intent-danger` |
| `intent info` | `ntk-state-block--intent-info` |