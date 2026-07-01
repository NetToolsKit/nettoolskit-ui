# Component Recipes

Generated from `src/design-system/core/components/contracts.ts`, `src/design-system/core/components/button.ts`, `src/design-system/core/components/field.ts`, `src/design-system/core/components/card.ts`, `src/design-system/core/components/table.ts`, `src/design-system/core/components/page.ts`, `src/design-system/core/components/section.ts`, `src/design-system/core/components/page-header.ts`, `src/design-system/core/components/toolbar.ts`, `src/design-system/core/components/filter-bar.ts`, `src/design-system/core/components/form-layout.ts`, `src/design-system/core/components/dialog.ts`, `src/design-system/core/components/empty-state.ts`, `src/design-system/core/components/metric-grid.ts`, `src/design-system/core/components/state-block.ts`, `src/design-system/core/components/app-shell.ts`, `src/design-system/core/components/avatar.ts`, `src/design-system/core/components/badge.ts`, `src/design-system/core/components/banner.ts`, `src/design-system/core/components/breadcrumbs.ts`, `src/design-system/core/components/chip.ts`, `src/design-system/core/components/command-icon.ts`, `src/design-system/core/components/date-picker.ts`, `src/design-system/core/components/dock-layout.ts`, `src/design-system/core/components/dock-panel.ts`, `src/design-system/core/components/drawer.ts`, `src/design-system/core/components/footer.ts`, `src/design-system/core/components/header.ts`, `src/design-system/core/components/logo.ts`, `src/design-system/core/components/quick-access-toolbar.ts`, `src/design-system/core/components/ribbon-command.ts`, `src/design-system/core/components/ribbon-group.ts`, `src/design-system/core/components/ribbon.ts`, `src/design-system/core/components/sidebar.ts`, `src/design-system/core/components/skeleton.ts`, `src/design-system/core/components/status-bar.ts`, `src/design-system/core/components/steps.ts`, `src/design-system/core/components/tabs.ts`, `src/design-system/core/components/time-picker.ts`, `src/design-system/core/components/toast.ts`, `src/design-system/core/components/tooltip.ts`, `src/design-system/core/components/tree-explorer.ts`, `src/design-system/core/components/workspace-canvas.ts`.
Do not edit by hand.

## Shared Primitives

- Sizes: `sm`, `md`, `lg`.
- Intents: `neutral`, `primary`, `success`, `warning`, `danger`, `info`.

## Vue Wrappers

| Component | Contract | Source | Purpose |
| --- | --- | --- | --- |
| DsAppShell | `NtkAppShellContract` | `src/design-system/vue/components/DsAppShell.vue` | Native Vue wrapper for the App Shell primitive. |
| DsAvatar | `NtkAvatarContract` | `src/design-system/vue/components/DsAvatar.vue` | Native Vue wrapper for the Avatar primitive. |
| DsBadge | `NtkBadgeContract` | `src/design-system/vue/components/DsBadge.vue` | Native Vue wrapper for the Badge primitive. |
| DsBanner | `NtkBannerContract` | `src/design-system/vue/components/DsBanner.vue` | Native Vue wrapper for the Banner primitive. |
| DsBreadcrumbs | `NtkBreadcrumbsContract` | `src/design-system/vue/components/DsBreadcrumbs.vue` | Native Vue wrapper for the Breadcrumbs primitive. |
| DsButton | `NtkButtonContract` | `src/design-system/vue/components/DsButton.vue` | Native Vue button wrapper backed by the button contract and class recipe. |
| DsCard | `NtkCardContract` | `src/design-system/vue/components/DsCard.vue` | Native Vue card wrapper backed by the card contract and class recipe. |
| DsChip | `NtkChipContract` | `src/design-system/vue/components/DsChip.vue` | Native Vue wrapper for the Chip primitive. |
| DsCommandIcon | `NtkCommandIconContract` | `src/design-system/vue/components/DsCommandIcon.vue` | Native Vue wrapper for the Command Icon primitive. |
| DsCrudPage | `None` | `src/design-system/vue/components/DsCrudPage.vue` | Native Vue wrapper for the Crud Page primitive. |
| DsDatePicker | `NtkDatePickerContract` | `src/design-system/vue/components/DsDatePicker.vue` | Native Vue wrapper for the Date Picker primitive. |
| DsDialog | `NtkDialogContract` | `src/design-system/vue/components/DsDialog.vue` | Native dialog modal backed by the dialog contract and class recipe. |
| DsDockLayout | `NtkDockLayoutContract` | `src/design-system/vue/components/DsDockLayout.vue` | Native Vue wrapper for the Dock Layout primitive. |
| DsDockPanel | `NtkDockPanelContract` | `src/design-system/vue/components/DsDockPanel.vue` | Native Vue wrapper for the Dock Panel primitive. |
| DsDrawer | `NtkDrawerContract` | `src/design-system/vue/components/DsDrawer.vue` | Native Vue wrapper for the Drawer primitive. |
| DsEmptyState | `NtkEmptyStateContract` | `src/design-system/vue/components/DsEmptyState.vue` | Native Vue empty state backed by the empty state contract and class recipe. |
| DsFilterBar | `NtkFilterBarContract` | `src/design-system/vue/components/DsFilterBar.vue` | Native Vue filter bar backed by the filter bar contract and class recipe. |
| DsFooter | `NtkFooterContract` | `src/design-system/vue/components/DsFooter.vue` | Native Vue wrapper for the Footer primitive. |
| DsForm | `None` | `src/design-system/vue/components/DsForm.vue` | Native Vue wrapper for the Form primitive. |
| DsFormLayout | `NtkFormLayoutContract` | `src/design-system/vue/components/DsFormLayout.vue` | Native Vue form layout backed by the form layout contract and class recipe. |
| DsFormPage | `None` | `src/design-system/vue/components/DsFormPage.vue` | Native Vue wrapper for the Form Page primitive. |
| DsHeader | `NtkHeaderContract` | `src/design-system/vue/components/DsHeader.vue` | Native Vue wrapper for the Header primitive. |
| DsInput | `NtkFieldContract` | `src/design-system/vue/components/DsInput.vue` | Native Vue input wrapper backed by the field contract and class recipe. |
| DsLogo | `NtkLogoContract` | `src/design-system/vue/components/DsLogo.vue` | Native Vue wrapper for the Logo primitive. |
| DsMetricGrid | `NtkMetricGridContract` | `src/design-system/vue/components/DsMetricGrid.vue` | Native Vue metric grid backed by the metric grid contract and class recipe. |
| DsPage | `NtkPageContract` | `src/design-system/vue/components/DsPage.vue` | Native Vue page landmark backed by the page contract and class recipe. |
| DsPageHeader | `NtkPageHeaderContract` | `src/design-system/vue/components/DsPageHeader.vue` | Native Vue page header backed by the page header contract and class recipe. |
| DsQuickAccessToolbar | `NtkQuickAccessToolbarContract` | `src/design-system/vue/components/DsQuickAccessToolbar.vue` | Native Vue wrapper for the Quick Access Toolbar primitive. |
| DsRibbon | `NtkRibbonContract` | `src/design-system/vue/components/DsRibbon.vue` | Native Vue wrapper for the Ribbon primitive. |
| DsRibbonCommand | `NtkRibbonCommandContract` | `src/design-system/vue/components/DsRibbonCommand.vue` | Native Vue wrapper for the Ribbon Command primitive. |
| DsRibbonGroup | `NtkRibbonGroupContract` | `src/design-system/vue/components/DsRibbonGroup.vue` | Native Vue wrapper for the Ribbon Group primitive. |
| DsSection | `NtkSectionContract` | `src/design-system/vue/components/DsSection.vue` | Native Vue section landmark backed by the section contract and class recipe. |
| DsSelect | `NtkFieldContract` | `src/design-system/vue/components/DsSelect.vue` | Native Vue select wrapper backed by the field contract and class recipe. |
| DsSidebar | `NtkSidebarContract` | `src/design-system/vue/components/DsSidebar.vue` | Native Vue wrapper for the Sidebar primitive. |
| DsSkeleton | `NtkSkeletonContract` | `src/design-system/vue/components/DsSkeleton.vue` | Native Vue wrapper for the Skeleton primitive. |
| DsStateBlock | `NtkStateBlockContract` | `src/design-system/vue/components/DsStateBlock.vue` | Native Vue state block backed by the state block contract and class recipe. |
| DsStatusBar | `NtkStatusBarContract` | `src/design-system/vue/components/DsStatusBar.vue` | Native Vue wrapper for the Status Bar primitive. |
| DsSteps | `NtkStepsContract` | `src/design-system/vue/components/DsSteps.vue` | Native Vue wrapper for the Steps primitive. |
| DsTable | `NtkTableContract` | `src/design-system/vue/components/DsTable.vue` | Native Vue table wrapper backed by the table contract and class recipe. |
| DsTabs | `NtkTabsContract` | `src/design-system/vue/components/DsTabs.vue` | Native Vue wrapper for the Tabs primitive. |
| DsTimePicker | `NtkTimePickerContract` | `src/design-system/vue/components/DsTimePicker.vue` | Native Vue wrapper for the Time Picker primitive. |
| DsToast | `NtkToastContract` | `src/design-system/vue/components/DsToast.vue` | Native Vue wrapper for the Toast primitive. |
| DsToastHost | `None` | `src/design-system/vue/components/DsToastHost.vue` | Native Vue wrapper for the Toast Host primitive. |
| DsToolbar | `NtkToolbarContract` | `src/design-system/vue/components/DsToolbar.vue` | Native Vue command toolbar backed by the toolbar contract and class recipe. |
| DsTooltip | `NtkTooltipContract` | `src/design-system/vue/components/DsTooltip.vue` | Native Vue wrapper for the Tooltip primitive. |
| DsTreeExplorer | `NtkTreeExplorerContract` | `src/design-system/vue/components/DsTreeExplorer.vue` | Native Vue wrapper for the Tree Explorer primitive. |
| DsTreeExplorerNode | `None` | `src/design-system/vue/components/DsTreeExplorerNode.vue` | Native Vue wrapper for the Tree Explorer Node primitive. |
| DsWorkspaceCanvas | `NtkWorkspaceCanvasContract` | `src/design-system/vue/components/DsWorkspaceCanvas.vue` | Native Vue wrapper for the Workspace Canvas primitive. |

## Button

Action trigger recipe for command, navigation, and submit buttons.

Source: `src/design-system/core/components/button.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `solid`, size `md`, intent `primary`, density `comfortable` |
| Variants | `solid`, `soft`, `outline`, `ghost`, `link`, `plain` |
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
| `variant soft` | `ntk-button--variant-soft` |
| `variant outline` | `ntk-button--variant-outline` |
| `variant ghost` | `ntk-button--variant-ghost` |
| `variant link` | `ntk-button--variant-link` |
| `variant plain` | `ntk-button--variant-plain` |
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
| Defaults | variant `outlined`, size `md`, intent `neutral`, density `comfortable` |
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
| Variants | `default`, `soft`, `outlined`, `elevated`, `accent-left`, `accent-top` |
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
| `variant soft` | `ntk-card--variant-soft` |
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
| Defaults | variant `default`, size `md`, intent `neutral`, density `comfortable` |
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
| Defaults | variant `default`, size `md`, intent `neutral`, headingLevel `2` |
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
| Defaults | variant `default`, size `md`, intent `neutral`, headingLevel `1` |
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
| Defaults | variant `default`, size `md`, intent `neutral`, density `comfortable`, align `start` |
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
| Defaults | variant `default`, size `md`, intent `neutral`, density `comfortable` |
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
| Defaults | variant `stacked`, size `md`, intent `neutral`, density `comfortable`, columns `1` |
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
| Defaults | variant `default`, size `md`, intent `neutral`, density `comfortable`, columns `auto` |
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
| Defaults | state `loading`, variant `default`, size `md`, intent `neutral` |
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

## App Shell

App shell contract and class recipe.

Source: `src/design-system/core/components/app-shell.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `fixed` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `drawerOpen` | Yes | `boolean` | `NtkAppShellContract` |
| `variant` | Yes | `NtkAppShellVariant` | `NtkAppShellContract` |
| `size` | Yes | `NtkAppShellSize` | `NtkAppShellContract` |
| `intent` | Yes | `NtkAppShellIntent` | `NtkAppShellContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-app-shell` |
| `variant default` | `ntk-app-shell--variant-default` |
| `variant fixed` | `ntk-app-shell--variant-fixed` |
| `size sm` | `ntk-app-shell--size-sm` |
| `size md` | `ntk-app-shell--size-md` |
| `size lg` | `ntk-app-shell--size-lg` |
| `intent neutral` | `ntk-app-shell--intent-neutral` |
| `intent primary` | `ntk-app-shell--intent-primary` |
| `intent success` | `ntk-app-shell--intent-success` |
| `intent warning` | `ntk-app-shell--intent-warning` |
| `intent danger` | `ntk-app-shell--intent-danger` |
| `intent info` | `ntk-app-shell--intent-info` |

## Avatar

Avatar contract and class recipe.

Source: `src/design-system/core/components/avatar.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `soft`, size `md`, intent `neutral`, shape `circle` |
| Variants | `solid`, `soft`, `outline` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `name` | Yes | `string` | `NtkAvatarContract` |
| `src` | Yes | `string` | `NtkAvatarContract` |
| `icon` | Yes | `string` | `NtkAvatarContract` |
| `variant` | Yes | `NtkAvatarVariant` | `NtkAvatarContract` |
| `size` | Yes | `NtkAvatarSize` | `NtkAvatarContract` |
| `intent` | Yes | `NtkAvatarIntent` | `NtkAvatarContract` |
| `shape` | Yes | `NtkAvatarShape` | `NtkAvatarContract` |
| `status` | Yes | `NtkAvatarStatus` | `NtkAvatarContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-avatar` |
| `variant solid` | `ntk-avatar--variant-solid` |
| `variant soft` | `ntk-avatar--variant-soft` |
| `variant outline` | `ntk-avatar--variant-outline` |
| `size sm` | `ntk-avatar--size-sm` |
| `size md` | `ntk-avatar--size-md` |
| `size lg` | `ntk-avatar--size-lg` |
| `size xl` | `ntk-avatar--size-xl` |
| `intent neutral` | `ntk-avatar--intent-neutral` |
| `intent primary` | `ntk-avatar--intent-primary` |
| `intent success` | `ntk-avatar--intent-success` |
| `intent warning` | `ntk-avatar--intent-warning` |
| `intent danger` | `ntk-avatar--intent-danger` |
| `intent info` | `ntk-avatar--intent-info` |

## Badge

Badge contract and class recipe.

Source: `src/design-system/core/components/badge.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `solid`, size `md`, intent `neutral` |
| Variants | `solid`, `soft`, `outline` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `label` | Yes | `string` | `NtkBadgeContract` |
| `variant` | Yes | `NtkBadgeVariant` | `NtkBadgeContract` |
| `size` | Yes | `NtkBadgeSize` | `NtkBadgeContract` |
| `intent` | Yes | `NtkBadgeIntent` | `NtkBadgeContract` |
| `dot` | Yes | `boolean` | `NtkBadgeContract` |
| `leadingDot` | Yes | `boolean` | `NtkBadgeContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-badge` |
| `variant solid` | `ntk-badge--variant-solid` |
| `variant soft` | `ntk-badge--variant-soft` |
| `variant outline` | `ntk-badge--variant-outline` |
| `size sm` | `ntk-badge--size-sm` |
| `size md` | `ntk-badge--size-md` |
| `size lg` | `ntk-badge--size-lg` |
| `intent neutral` | `ntk-badge--intent-neutral` |
| `intent primary` | `ntk-badge--intent-primary` |
| `intent success` | `ntk-badge--intent-success` |
| `intent warning` | `ntk-badge--intent-warning` |
| `intent danger` | `ntk-badge--intent-danger` |
| `intent info` | `ntk-badge--intent-info` |

## Banner

Banner contract and class recipe.

Source: `src/design-system/core/components/banner.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `soft`, size `md`, intent `info` |
| Variants | `solid`, `soft`, `outline`, `accent` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkBannerContract` |
| `message` | Yes | `string` | `NtkBannerContract` |
| `icon` | Yes | `string` | `NtkBannerContract` |
| `variant` | Yes | `NtkBannerVariant` | `NtkBannerContract` |
| `size` | Yes | `NtkBannerSize` | `NtkBannerContract` |
| `intent` | Yes | `NtkBannerIntent` | `NtkBannerContract` |
| `dismissible` | Yes | `boolean` | `NtkBannerContract` |
| `dismissLabel` | Yes | `string` | `NtkBannerContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-banner` |
| `variant solid` | `ntk-banner--variant-solid` |
| `variant soft` | `ntk-banner--variant-soft` |
| `variant outline` | `ntk-banner--variant-outline` |
| `variant accent` | `ntk-banner--variant-accent` |
| `size sm` | `ntk-banner--size-sm` |
| `size md` | `ntk-banner--size-md` |
| `size lg` | `ntk-banner--size-lg` |
| `intent neutral` | `ntk-banner--intent-neutral` |
| `intent primary` | `ntk-banner--intent-primary` |
| `intent success` | `ntk-banner--intent-success` |
| `intent warning` | `ntk-banner--intent-warning` |
| `intent danger` | `ntk-banner--intent-danger` |
| `intent info` | `ntk-banner--intent-info` |

## Breadcrumbs

Breadcrumbs contract and class recipe.

Source: `src/design-system/core/components/breadcrumbs.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `subtle` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `items` | Yes | `readonly NtkBreadcrumbItem[]` | `NtkBreadcrumbsContract` |
| `variant` | Yes | `NtkBreadcrumbsVariant` | `NtkBreadcrumbsContract` |
| `size` | Yes | `NtkBreadcrumbsSize` | `NtkBreadcrumbsContract` |
| `intent` | Yes | `NtkBreadcrumbsIntent` | `NtkBreadcrumbsContract` |
| `separator` | Yes | `string` | `NtkBreadcrumbsContract` |
| `ariaLabel` | Yes | `string` | `NtkBreadcrumbsContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-breadcrumbs` |
| `variant default` | `ntk-breadcrumbs--variant-default` |
| `variant subtle` | `ntk-breadcrumbs--variant-subtle` |
| `size sm` | `ntk-breadcrumbs--size-sm` |
| `size md` | `ntk-breadcrumbs--size-md` |
| `size lg` | `ntk-breadcrumbs--size-lg` |
| `intent neutral` | `ntk-breadcrumbs--intent-neutral` |
| `intent primary` | `ntk-breadcrumbs--intent-primary` |
| `intent success` | `ntk-breadcrumbs--intent-success` |
| `intent warning` | `ntk-breadcrumbs--intent-warning` |
| `intent danger` | `ntk-breadcrumbs--intent-danger` |
| `intent info` | `ntk-breadcrumbs--intent-info` |

## Chip

Chip contract and class recipe.

Source: `src/design-system/core/components/chip.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `solid`, size `md`, intent `neutral` |
| Variants | `solid`, `soft`, `outline` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `clickable`, `selected`, `disabled` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `label` | Yes | `string` | `NtkChipContract` |
| `icon` | Yes | `string` | `NtkChipContract` |
| `variant` | Yes | `NtkChipVariant` | `NtkChipContract` |
| `size` | Yes | `NtkChipSize` | `NtkChipContract` |
| `intent` | Yes | `NtkChipIntent` | `NtkChipContract` |
| `clickable` | Yes | `boolean` | `NtkChipContract` |
| `selected` | Yes | `boolean` | `NtkChipContract` |
| `disabled` | Yes | `boolean` | `NtkChipContract` |
| `removable` | Yes | `boolean` | `NtkChipContract` |
| `removeLabel` | Yes | `string` | `NtkChipContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-chip` |
| `variant solid` | `ntk-chip--variant-solid` |
| `variant soft` | `ntk-chip--variant-soft` |
| `variant outline` | `ntk-chip--variant-outline` |
| `size sm` | `ntk-chip--size-sm` |
| `size md` | `ntk-chip--size-md` |
| `size lg` | `ntk-chip--size-lg` |
| `intent neutral` | `ntk-chip--intent-neutral` |
| `intent primary` | `ntk-chip--intent-primary` |
| `intent success` | `ntk-chip--intent-success` |
| `intent warning` | `ntk-chip--intent-warning` |
| `intent danger` | `ntk-chip--intent-danger` |
| `intent info` | `ntk-chip--intent-info` |
| `state clickable` | `ntk-chip--is-clickable` |
| `state selected` | `ntk-chip--is-selected` |
| `state disabled` | `ntk-chip--is-disabled` |

## Command Icon

Command icon contract and class recipe.

Source: `src/design-system/core/components/command-icon.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `line`, size `md`, intent `neutral` |
| Variants | `line` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `name` | No | `NtkCommandIconName` | `NtkCommandIconContract` |
| `variant` | Yes | `NtkCommandIconVariant` | `NtkCommandIconContract` |
| `size` | Yes | `NtkCommandIconSize` | `NtkCommandIconContract` |
| `intent` | Yes | `NtkCommandIconIntent` | `NtkCommandIconContract` |
| `label` | Yes | `string` | `NtkCommandIconContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-command-icon` |
| `variant line` | `ntk-command-icon--variant-line` |
| `size sm` | `ntk-command-icon--size-sm` |
| `size md` | `ntk-command-icon--size-md` |
| `size lg` | `ntk-command-icon--size-lg` |
| `intent neutral` | `ntk-command-icon--intent-neutral` |
| `intent primary` | `ntk-command-icon--intent-primary` |
| `intent success` | `ntk-command-icon--intent-success` |
| `intent warning` | `ntk-command-icon--intent-warning` |
| `intent danger` | `ntk-command-icon--intent-danger` |
| `intent info` | `ntk-command-icon--intent-info` |

## Date Picker

Date picker contract, class recipe, and pure date helpers.

Source: `src/design-system/core/components/date-picker.ts`.

| Setting | Values |
| --- | --- |
| Defaults | 0 `n`, 1 `t`, 2 `k`, 3 `F`, 4 `i`, 5 `e`, 6 `l`, 7 `d`, 8 `D`, 9 `e`, 10 `f`, 11 `a`, 12 `u`, 13 `l`, 14 `t`, 15 `s` |
| Variants | None |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `min` | Yes | `string \\| null` | `NtkDatePickerContract` |
| `max` | Yes | `string \\| null` | `NtkDatePickerContract` |
| `triggerLabel` | Yes | `string` | `NtkDatePickerContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `` |

## Dock Layout

Dock layout contract and class recipe.

Source: `src/design-system/core/components/dock-layout.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `bordered`, size `md`, intent `neutral`, leftSize `240`, rightSize `240`, topSize `160`, bottomSize `160`, minSize `120`, maxSize `480`, step `16` |
| Variants | `default`, `bordered` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `ariaLabel` | Yes | `string` | `NtkDockLayoutContract` |
| `variant` | Yes | `NtkDockLayoutVariant` | `NtkDockLayoutContract` |
| `size` | Yes | `NtkDockLayoutSize` | `NtkDockLayoutContract` |
| `intent` | Yes | `NtkDockLayoutIntent` | `NtkDockLayoutContract` |
| `leftSize` | Yes | `number` | `NtkDockLayoutContract` |
| `rightSize` | Yes | `number` | `NtkDockLayoutContract` |
| `topSize` | Yes | `number` | `NtkDockLayoutContract` |
| `bottomSize` | Yes | `number` | `NtkDockLayoutContract` |
| `minSize` | Yes | `number` | `NtkDockLayoutContract` |
| `maxSize` | Yes | `number` | `NtkDockLayoutContract` |
| `step` | Yes | `number` | `NtkDockLayoutContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-dock-layout` |
| `variant default` | `ntk-dock-layout--variant-default` |
| `variant bordered` | `ntk-dock-layout--variant-bordered` |
| `size sm` | `ntk-dock-layout--size-sm` |
| `size md` | `ntk-dock-layout--size-md` |
| `size lg` | `ntk-dock-layout--size-lg` |
| `intent neutral` | `ntk-dock-layout--intent-neutral` |
| `intent primary` | `ntk-dock-layout--intent-primary` |
| `intent success` | `ntk-dock-layout--intent-success` |
| `intent warning` | `ntk-dock-layout--intent-warning` |
| `intent danger` | `ntk-dock-layout--intent-danger` |
| `intent info` | `ntk-dock-layout--intent-info` |

## Dock Panel

Dock panel contract and class recipe.

Source: `src/design-system/core/components/dock-panel.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `bordered`, size `md`, intent `neutral`, density `comfortable` |
| Variants | `default`, `bordered` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `selected` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | No | `string` | `NtkDockPanelContract` |
| `variant` | Yes | `NtkDockPanelVariant` | `NtkDockPanelContract` |
| `size` | Yes | `NtkDockPanelSize` | `NtkDockPanelContract` |
| `intent` | Yes | `NtkDockPanelIntent` | `NtkDockPanelContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkDockPanelContract` |
| `collapsible` | Yes | `boolean` | `NtkDockPanelContract` |
| `closable` | Yes | `boolean` | `NtkDockPanelContract` |
| `collapsed` | Yes | `boolean` | `NtkDockPanelContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-dock-panel` |
| `variant default` | `ntk-dock-panel--variant-default` |
| `variant bordered` | `ntk-dock-panel--variant-bordered` |
| `size sm` | `ntk-dock-panel--size-sm` |
| `size md` | `ntk-dock-panel--size-md` |
| `size lg` | `ntk-dock-panel--size-lg` |
| `intent neutral` | `ntk-dock-panel--intent-neutral` |
| `intent primary` | `ntk-dock-panel--intent-primary` |
| `intent success` | `ntk-dock-panel--intent-success` |
| `intent warning` | `ntk-dock-panel--intent-warning` |
| `intent danger` | `ntk-dock-panel--intent-danger` |
| `intent info` | `ntk-dock-panel--intent-info` |
| `state selected` | `ntk-dock-panel--is-collapsed` |

## Drawer

Drawer (off-canvas navigation) contract and class recipe.

Source: `src/design-system/core/components/drawer.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `elevated` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `modelValue` | Yes | `boolean` | `NtkDrawerContract` |
| `side` | Yes | `NtkDrawerSide` | `NtkDrawerContract` |
| `title` | Yes | `string` | `NtkDrawerContract` |
| `ariaLabel` | Yes | `string` | `NtkDrawerContract` |
| `navLabel` | Yes | `string` | `NtkDrawerContract` |
| `persistent` | Yes | `boolean` | `NtkDrawerContract` |
| `closeLabel` | Yes | `string` | `NtkDrawerContract` |
| `hideClose` | Yes | `boolean` | `NtkDrawerContract` |
| `variant` | Yes | `NtkDrawerVariant` | `NtkDrawerContract` |
| `size` | Yes | `NtkDrawerSize` | `NtkDrawerContract` |
| `intent` | Yes | `NtkDrawerIntent` | `NtkDrawerContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-drawer` |
| `variant default` | `ntk-drawer--variant-default` |
| `variant elevated` | `ntk-drawer--variant-elevated` |
| `size sm` | `ntk-drawer--size-sm` |
| `size md` | `ntk-drawer--size-md` |
| `size lg` | `ntk-drawer--size-lg` |
| `intent neutral` | `ntk-drawer--intent-neutral` |
| `intent primary` | `ntk-drawer--intent-primary` |
| `intent success` | `ntk-drawer--intent-success` |
| `intent warning` | `ntk-drawer--intent-warning` |
| `intent danger` | `ntk-drawer--intent-danger` |
| `intent info` | `ntk-drawer--intent-info` |

## Footer

Footer contract and class recipe.

Source: `src/design-system/core/components/footer.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `elevated`, `transparent` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `variant` | Yes | `NtkFooterVariant` | `NtkFooterContract` |
| `size` | Yes | `NtkFooterSize` | `NtkFooterContract` |
| `intent` | Yes | `NtkFooterIntent` | `NtkFooterContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-footer` |
| `variant default` | `ntk-footer--variant-default` |
| `variant elevated` | `ntk-footer--variant-elevated` |
| `variant transparent` | `ntk-footer--variant-transparent` |
| `size sm` | `ntk-footer--size-sm` |
| `size md` | `ntk-footer--size-md` |
| `size lg` | `ntk-footer--size-lg` |
| `intent neutral` | `ntk-footer--intent-neutral` |
| `intent primary` | `ntk-footer--intent-primary` |
| `intent success` | `ntk-footer--intent-success` |
| `intent warning` | `ntk-footer--intent-warning` |
| `intent danger` | `ntk-footer--intent-danger` |
| `intent info` | `ntk-footer--intent-info` |

## Header

Header (top app bar) contract and class recipe.

Source: `src/design-system/core/components/header.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `elevated`, `transparent` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkHeaderContract` |
| `showMenu` | Yes | `boolean` | `NtkHeaderContract` |
| `menuLabel` | Yes | `string` | `NtkHeaderContract` |
| `variant` | Yes | `NtkHeaderVariant` | `NtkHeaderContract` |
| `size` | Yes | `NtkHeaderSize` | `NtkHeaderContract` |
| `intent` | Yes | `NtkHeaderIntent` | `NtkHeaderContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-header` |
| `variant default` | `ntk-header--variant-default` |
| `variant elevated` | `ntk-header--variant-elevated` |
| `variant transparent` | `ntk-header--variant-transparent` |
| `size sm` | `ntk-header--size-sm` |
| `size md` | `ntk-header--size-md` |
| `size lg` | `ntk-header--size-lg` |
| `intent neutral` | `ntk-header--intent-neutral` |
| `intent primary` | `ntk-header--intent-primary` |
| `intent success` | `ntk-header--intent-success` |
| `intent warning` | `ntk-header--intent-warning` |
| `intent danger` | `ntk-header--intent-danger` |
| `intent info` | `ntk-header--intent-info` |

## Logo

Logo contract and class recipe.

Source: `src/design-system/core/components/logo.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `gradient`, size `md`, intent `primary` |
| Variants | `gradient`, `solid`, `outline` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `clickable` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `mark` | Yes | `string` | `NtkLogoContract` |
| `text` | Yes | `string` | `NtkLogoContract` |
| `tagline` | Yes | `string` | `NtkLogoContract` |
| `showText` | Yes | `boolean` | `NtkLogoContract` |
| `showTagline` | Yes | `boolean` | `NtkLogoContract` |
| `variant` | Yes | `NtkLogoVariant` | `NtkLogoContract` |
| `size` | Yes | `NtkLogoSize` | `NtkLogoContract` |
| `intent` | Yes | `NtkLogoIntent` | `NtkLogoContract` |
| `href` | Yes | `string` | `NtkLogoContract` |
| `ariaLabel` | Yes | `string` | `NtkLogoContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-logo` |
| `variant gradient` | `ntk-logo--variant-gradient` |
| `variant solid` | `ntk-logo--variant-solid` |
| `variant outline` | `ntk-logo--variant-outline` |
| `size xs` | `ntk-logo--size-xs` |
| `size sm` | `ntk-logo--size-sm` |
| `size md` | `ntk-logo--size-md` |
| `size lg` | `ntk-logo--size-lg` |
| `size xl` | `ntk-logo--size-xl` |
| `intent neutral` | `ntk-logo--intent-neutral` |
| `intent primary` | `ntk-logo--intent-primary` |
| `intent success` | `ntk-logo--intent-success` |
| `intent warning` | `ntk-logo--intent-warning` |
| `intent danger` | `ntk-logo--intent-danger` |
| `intent info` | `ntk-logo--intent-info` |
| `state clickable` | `ntk-logo--is-clickable` |

## Quick Access Toolbar

Quick access toolbar contract and class recipe.

Source: `src/design-system/core/components/quick-access-toolbar.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `bordered`, size `md`, intent `neutral`, density `comfortable` |
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
| `items` | Yes | `readonly NtkQuickAccessItem[]` | `NtkQuickAccessToolbarContract` |
| `ariaLabel` | Yes | `string` | `NtkQuickAccessToolbarContract` |
| `variant` | Yes | `NtkQuickAccessToolbarVariant` | `NtkQuickAccessToolbarContract` |
| `size` | Yes | `NtkQuickAccessToolbarSize` | `NtkQuickAccessToolbarContract` |
| `intent` | Yes | `NtkQuickAccessToolbarIntent` | `NtkQuickAccessToolbarContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkQuickAccessToolbarContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-quick-access-toolbar` |
| `variant default` | `ntk-quick-access-toolbar--variant-default` |
| `variant bordered` | `ntk-quick-access-toolbar--variant-bordered` |
| `variant floating` | `ntk-quick-access-toolbar--variant-floating` |
| `size sm` | `ntk-quick-access-toolbar--size-sm` |
| `size md` | `ntk-quick-access-toolbar--size-md` |
| `size lg` | `ntk-quick-access-toolbar--size-lg` |
| `intent neutral` | `ntk-quick-access-toolbar--intent-neutral` |
| `intent primary` | `ntk-quick-access-toolbar--intent-primary` |
| `intent success` | `ntk-quick-access-toolbar--intent-success` |
| `intent warning` | `ntk-quick-access-toolbar--intent-warning` |
| `intent danger` | `ntk-quick-access-toolbar--intent-danger` |
| `intent info` | `ntk-quick-access-toolbar--intent-info` |

## Ribbon Command

Ribbon command contract and class recipe.

Source: `src/design-system/core/components/ribbon-command.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | `selected`, `disabled` |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `label` | No | `string` | `NtkRibbonCommandContract` |
| `icon` | No | `NtkCommandIconName` | `NtkRibbonCommandContract` |
| `variant` | Yes | `NtkRibbonCommandVariant` | `NtkRibbonCommandContract` |
| `size` | Yes | `NtkRibbonCommandSize` | `NtkRibbonCommandContract` |
| `intent` | Yes | `NtkRibbonCommandIntent` | `NtkRibbonCommandContract` |
| `selected` | Yes | `boolean` | `NtkRibbonCommandContract` |
| `disabled` | Yes | `boolean` | `NtkRibbonCommandContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-ribbon-command` |
| `variant default` | `ntk-ribbon-command--variant-default` |
| `size sm` | `ntk-ribbon-command--size-sm` |
| `size md` | `ntk-ribbon-command--size-md` |
| `size lg` | `ntk-ribbon-command--size-lg` |
| `intent neutral` | `ntk-ribbon-command--intent-neutral` |
| `intent primary` | `ntk-ribbon-command--intent-primary` |
| `intent success` | `ntk-ribbon-command--intent-success` |
| `intent warning` | `ntk-ribbon-command--intent-warning` |
| `intent danger` | `ntk-ribbon-command--intent-danger` |
| `intent info` | `ntk-ribbon-command--intent-info` |
| `state selected` | `ntk-ribbon-command--is-selected` |
| `state disabled` | `ntk-ribbon-command--is-disabled` |

## Ribbon Group

Ribbon group contract and class recipe.

Source: `src/design-system/core/components/ribbon-group.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral`, density `comfortable`, labelPosition `below` |
| Variants | `default` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `label` | No | `string` | `NtkRibbonGroupContract` |
| `variant` | Yes | `NtkRibbonGroupVariant` | `NtkRibbonGroupContract` |
| `size` | Yes | `NtkRibbonGroupSize` | `NtkRibbonGroupContract` |
| `intent` | Yes | `NtkRibbonGroupIntent` | `NtkRibbonGroupContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkRibbonGroupContract` |
| `labelPosition` | Yes | `NtkRibbonGroupLabelPosition` | `NtkRibbonGroupContract` |
| `separator` | Yes | `boolean` | `NtkRibbonGroupContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-ribbon-group` |
| `variant default` | `ntk-ribbon-group--variant-default` |
| `size sm` | `ntk-ribbon-group--size-sm` |
| `size md` | `ntk-ribbon-group--size-md` |
| `size lg` | `ntk-ribbon-group--size-lg` |
| `intent neutral` | `ntk-ribbon-group--intent-neutral` |
| `intent primary` | `ntk-ribbon-group--intent-primary` |
| `intent success` | `ntk-ribbon-group--intent-success` |
| `intent warning` | `ntk-ribbon-group--intent-warning` |
| `intent danger` | `ntk-ribbon-group--intent-danger` |
| `intent info` | `ntk-ribbon-group--intent-info` |

## Ribbon

Ribbon contract and class recipe.

Source: `src/design-system/core/components/ribbon.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `bordered`, size `md`, intent `neutral`, density `comfortable` |
| Variants | `default`, `bordered` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `tabs` | Yes | `readonly NtkRibbonTab[]` | `NtkRibbonContract` |
| `activeTab` | Yes | `string` | `NtkRibbonContract` |
| `ariaLabel` | Yes | `string` | `NtkRibbonContract` |
| `variant` | Yes | `NtkRibbonVariant` | `NtkRibbonContract` |
| `size` | Yes | `NtkRibbonSize` | `NtkRibbonContract` |
| `intent` | Yes | `NtkRibbonIntent` | `NtkRibbonContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkRibbonContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-ribbon` |
| `variant default` | `ntk-ribbon--variant-default` |
| `variant bordered` | `ntk-ribbon--variant-bordered` |
| `size sm` | `ntk-ribbon--size-sm` |
| `size md` | `ntk-ribbon--size-md` |
| `size lg` | `ntk-ribbon--size-lg` |
| `intent neutral` | `ntk-ribbon--intent-neutral` |
| `intent primary` | `ntk-ribbon--intent-primary` |
| `intent success` | `ntk-ribbon--intent-success` |
| `intent warning` | `ntk-ribbon--intent-warning` |
| `intent danger` | `ntk-ribbon--intent-danger` |
| `intent info` | `ntk-ribbon--intent-info` |

## Sidebar

Sidebar (side navigation) contract and class recipe.

Source: `src/design-system/core/components/sidebar.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral` |
| Variants | `default`, `elevated`, `transparent` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `ariaLabel` | Yes | `string` | `NtkSidebarContract` |
| `collapsed` | Yes | `boolean` | `NtkSidebarContract` |
| `variant` | Yes | `NtkSidebarVariant` | `NtkSidebarContract` |
| `size` | Yes | `NtkSidebarSize` | `NtkSidebarContract` |
| `intent` | Yes | `NtkSidebarIntent` | `NtkSidebarContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-sidebar` |
| `variant default` | `ntk-sidebar--variant-default` |
| `variant elevated` | `ntk-sidebar--variant-elevated` |
| `variant transparent` | `ntk-sidebar--variant-transparent` |
| `size sm` | `ntk-sidebar--size-sm` |
| `size md` | `ntk-sidebar--size-md` |
| `size lg` | `ntk-sidebar--size-lg` |
| `intent neutral` | `ntk-sidebar--intent-neutral` |
| `intent primary` | `ntk-sidebar--intent-primary` |
| `intent success` | `ntk-sidebar--intent-success` |
| `intent warning` | `ntk-sidebar--intent-warning` |
| `intent danger` | `ntk-sidebar--intent-danger` |
| `intent info` | `ntk-sidebar--intent-info` |

## Skeleton

Skeleton contract and class recipe.

Source: `src/design-system/core/components/skeleton.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `text`, size `md`, intent `neutral` |
| Variants | `text`, `block`, `circle` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `variant` | Yes | `NtkSkeletonVariant` | `NtkSkeletonContract` |
| `size` | Yes | `NtkSkeletonSize` | `NtkSkeletonContract` |
| `intent` | Yes | `NtkSkeletonIntent` | `NtkSkeletonContract` |
| `lines` | Yes | `number` | `NtkSkeletonContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-skeleton` |
| `variant text` | `ntk-skeleton--variant-text` |
| `variant block` | `ntk-skeleton--variant-block` |
| `variant circle` | `ntk-skeleton--variant-circle` |
| `size sm` | `ntk-skeleton--size-sm` |
| `size md` | `ntk-skeleton--size-md` |
| `size lg` | `ntk-skeleton--size-lg` |
| `intent neutral` | `ntk-skeleton--intent-neutral` |
| `intent primary` | `ntk-skeleton--intent-primary` |
| `intent success` | `ntk-skeleton--intent-success` |
| `intent warning` | `ntk-skeleton--intent-warning` |
| `intent danger` | `ntk-skeleton--intent-danger` |
| `intent info` | `ntk-skeleton--intent-info` |

## Status Bar

Status bar contract and class recipe.

Source: `src/design-system/core/components/status-bar.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `bordered`, size `md`, intent `neutral`, density `comfortable` |
| Variants | `default`, `bordered` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `segments` | Yes | `readonly NtkStatusBarSegment[]` | `NtkStatusBarContract` |
| `ariaLabel` | Yes | `string` | `NtkStatusBarContract` |
| `variant` | Yes | `NtkStatusBarVariant` | `NtkStatusBarContract` |
| `size` | Yes | `NtkStatusBarSize` | `NtkStatusBarContract` |
| `intent` | Yes | `NtkStatusBarIntent` | `NtkStatusBarContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkStatusBarContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-status-bar` |
| `variant default` | `ntk-status-bar--variant-default` |
| `variant bordered` | `ntk-status-bar--variant-bordered` |
| `size sm` | `ntk-status-bar--size-sm` |
| `size md` | `ntk-status-bar--size-md` |
| `size lg` | `ntk-status-bar--size-lg` |
| `intent neutral` | `ntk-status-bar--intent-neutral` |
| `intent primary` | `ntk-status-bar--intent-primary` |
| `intent success` | `ntk-status-bar--intent-success` |
| `intent warning` | `ntk-status-bar--intent-warning` |
| `intent danger` | `ntk-status-bar--intent-danger` |
| `intent info` | `ntk-status-bar--intent-info` |

## Steps

Steps (application stepper) contract and class recipe.

Source: `src/design-system/core/components/steps.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral`, orientation `horizontal` |
| Variants | `default`, `numbered`, `simple` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `steps` | Yes | `readonly NtkStepItem[]` | `NtkStepsContract` |
| `current` | Yes | `number` | `NtkStepsContract` |
| `orientation` | Yes | `NtkStepsOrientation` | `NtkStepsContract` |
| `variant` | Yes | `NtkStepsVariant` | `NtkStepsContract` |
| `size` | Yes | `NtkStepsSize` | `NtkStepsContract` |
| `intent` | Yes | `NtkStepsIntent` | `NtkStepsContract` |
| `clickable` | Yes | `boolean` | `NtkStepsContract` |
| `ariaLabel` | Yes | `string` | `NtkStepsContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-steps` |
| `variant default` | `ntk-steps--variant-default` |
| `variant numbered` | `ntk-steps--variant-numbered` |
| `variant simple` | `ntk-steps--variant-simple` |
| `size sm` | `ntk-steps--size-sm` |
| `size md` | `ntk-steps--size-md` |
| `size lg` | `ntk-steps--size-lg` |
| `intent neutral` | `ntk-steps--intent-neutral` |
| `intent primary` | `ntk-steps--intent-primary` |
| `intent success` | `ntk-steps--intent-success` |
| `intent warning` | `ntk-steps--intent-warning` |
| `intent danger` | `ntk-steps--intent-danger` |
| `intent info` | `ntk-steps--intent-info` |

## Tabs

Tabs contract and class recipe.

Source: `src/design-system/core/components/tabs.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `line`, size `md`, intent `primary` |
| Variants | `line`, `pill`, `enclosed` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `tabs` | Yes | `readonly NtkTabItem[]` | `NtkTabsContract` |
| `modelValue` | Yes | `string` | `NtkTabsContract` |
| `variant` | Yes | `NtkTabsVariant` | `NtkTabsContract` |
| `size` | Yes | `NtkTabsSize` | `NtkTabsContract` |
| `intent` | Yes | `NtkTabsIntent` | `NtkTabsContract` |
| `ariaLabel` | Yes | `string` | `NtkTabsContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-tabs` |
| `variant line` | `ntk-tabs--variant-line` |
| `variant pill` | `ntk-tabs--variant-pill` |
| `variant enclosed` | `ntk-tabs--variant-enclosed` |
| `size sm` | `ntk-tabs--size-sm` |
| `size md` | `ntk-tabs--size-md` |
| `size lg` | `ntk-tabs--size-lg` |
| `intent neutral` | `ntk-tabs--intent-neutral` |
| `intent primary` | `ntk-tabs--intent-primary` |
| `intent success` | `ntk-tabs--intent-success` |
| `intent warning` | `ntk-tabs--intent-warning` |
| `intent danger` | `ntk-tabs--intent-danger` |
| `intent info` | `ntk-tabs--intent-info` |

## Time Picker

Time picker contract, class recipe, and pure time helpers.

Source: `src/design-system/core/components/time-picker.ts`.

| Setting | Values |
| --- | --- |
| Defaults | step `5` |
| Variants | None |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `min` | Yes | `string \\| null` | `NtkTimePickerContract` |
| `max` | Yes | `string \\| null` | `NtkTimePickerContract` |
| `step` | Yes | `number` | `NtkTimePickerContract` |
| `triggerLabel` | Yes | `string` | `NtkTimePickerContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `` |

## Toast

Toast contract and class recipe.

Source: `src/design-system/core/components/toast.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `soft`, size `md`, intent `info` |
| Variants | `solid`, `soft`, `outline`, `accent` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `title` | Yes | `string` | `NtkToastContract` |
| `message` | Yes | `string` | `NtkToastContract` |
| `icon` | Yes | `string` | `NtkToastContract` |
| `variant` | Yes | `NtkToastVariant` | `NtkToastContract` |
| `size` | Yes | `NtkToastSize` | `NtkToastContract` |
| `intent` | Yes | `NtkToastIntent` | `NtkToastContract` |
| `dismissible` | Yes | `boolean` | `NtkToastContract` |
| `dismissLabel` | Yes | `string` | `NtkToastContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-toast` |
| `variant solid` | `ntk-toast--variant-solid` |
| `variant soft` | `ntk-toast--variant-soft` |
| `variant outline` | `ntk-toast--variant-outline` |
| `variant accent` | `ntk-toast--variant-accent` |
| `size sm` | `ntk-toast--size-sm` |
| `size md` | `ntk-toast--size-md` |
| `size lg` | `ntk-toast--size-lg` |
| `intent neutral` | `ntk-toast--intent-neutral` |
| `intent primary` | `ntk-toast--intent-primary` |
| `intent success` | `ntk-toast--intent-success` |
| `intent warning` | `ntk-toast--intent-warning` |
| `intent danger` | `ntk-toast--intent-danger` |
| `intent info` | `ntk-toast--intent-info` |

## Tooltip

Tooltip contract and class recipe.

Source: `src/design-system/core/components/tooltip.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `solid`, size `md`, intent `neutral`, position `top` |
| Variants | `solid`, `soft` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `text` | Yes | `string` | `NtkTooltipContract` |
| `position` | Yes | `NtkTooltipPosition` | `NtkTooltipContract` |
| `variant` | Yes | `NtkTooltipVariant` | `NtkTooltipContract` |
| `size` | Yes | `NtkTooltipSize` | `NtkTooltipContract` |
| `intent` | Yes | `NtkTooltipIntent` | `NtkTooltipContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-tooltip` |
| `variant solid` | `ntk-tooltip--variant-solid` |
| `variant soft` | `ntk-tooltip--variant-soft` |
| `size sm` | `ntk-tooltip--size-sm` |
| `size md` | `ntk-tooltip--size-md` |
| `size lg` | `ntk-tooltip--size-lg` |
| `intent neutral` | `ntk-tooltip--intent-neutral` |
| `intent primary` | `ntk-tooltip--intent-primary` |
| `intent success` | `ntk-tooltip--intent-success` |
| `intent warning` | `ntk-tooltip--intent-warning` |
| `intent danger` | `ntk-tooltip--intent-danger` |
| `intent info` | `ntk-tooltip--intent-info` |

## Tree Explorer

Tree explorer contract and class recipe.

Source: `src/design-system/core/components/tree-explorer.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `bordered`, size `md`, intent `neutral`, density `comfortable` |
| Variants | `default`, `bordered` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `nodes` | Yes | `readonly NtkTreeNode[]` | `NtkTreeExplorerContract` |
| `ariaLabel` | Yes | `string` | `NtkTreeExplorerContract` |
| `variant` | Yes | `NtkTreeExplorerVariant` | `NtkTreeExplorerContract` |
| `size` | Yes | `NtkTreeExplorerSize` | `NtkTreeExplorerContract` |
| `intent` | Yes | `NtkTreeExplorerIntent` | `NtkTreeExplorerContract` |
| `density` | Yes | `NtkComponentDensity` | `NtkTreeExplorerContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-tree-explorer` |
| `variant default` | `ntk-tree-explorer--variant-default` |
| `variant bordered` | `ntk-tree-explorer--variant-bordered` |
| `size sm` | `ntk-tree-explorer--size-sm` |
| `size md` | `ntk-tree-explorer--size-md` |
| `size lg` | `ntk-tree-explorer--size-lg` |
| `intent neutral` | `ntk-tree-explorer--intent-neutral` |
| `intent primary` | `ntk-tree-explorer--intent-primary` |
| `intent success` | `ntk-tree-explorer--intent-success` |
| `intent warning` | `ntk-tree-explorer--intent-warning` |
| `intent danger` | `ntk-tree-explorer--intent-danger` |
| `intent info` | `ntk-tree-explorer--intent-info` |

## Workspace Canvas

Workspace canvas contract and class recipe.

Source: `src/design-system/core/components/workspace-canvas.ts`.

| Setting | Values |
| --- | --- |
| Defaults | variant `default`, size `md`, intent `neutral`, surface `grid` |
| Variants | `default` |
| Sizes | `sm`, `md`, `lg` |
| Intents | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| States | None |

### Contract Props

| Prop | Optional | Type | Source |
| --- | --- | --- | --- |
| `id` | Yes | `string` | `base` |
| `testId` | Yes | `string` | `base` |
| `class` | Yes | `NtkClassValue` | `base` |
| `surface` | Yes | `NtkWorkspaceCanvasSurface` | `NtkWorkspaceCanvasContract` |
| `ariaLabel` | Yes | `string` | `NtkWorkspaceCanvasContract` |
| `variant` | Yes | `NtkWorkspaceCanvasVariant` | `NtkWorkspaceCanvasContract` |
| `size` | Yes | `NtkWorkspaceCanvasSize` | `NtkWorkspaceCanvasContract` |
| `intent` | Yes | `NtkWorkspaceCanvasIntent` | `NtkWorkspaceCanvasContract` |

### Class Map

| Slot | Class |
| --- | --- |
| `root` | `ntk-workspace-canvas` |
| `variant default` | `ntk-workspace-canvas--variant-default` |
| `size sm` | `ntk-workspace-canvas--size-sm` |
| `size md` | `ntk-workspace-canvas--size-md` |
| `size lg` | `ntk-workspace-canvas--size-lg` |
| `intent neutral` | `ntk-workspace-canvas--intent-neutral` |
| `intent primary` | `ntk-workspace-canvas--intent-primary` |
| `intent success` | `ntk-workspace-canvas--intent-success` |
| `intent warning` | `ntk-workspace-canvas--intent-warning` |
| `intent danger` | `ntk-workspace-canvas--intent-danger` |
| `intent info` | `ntk-workspace-canvas--intent-info` |