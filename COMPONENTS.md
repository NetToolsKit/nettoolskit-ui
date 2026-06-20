# Component Recipes

Generated from `src/design-system/core/components/contracts.ts`, `src/design-system/core/components/button.ts`, `src/design-system/core/components/field.ts`, `src/design-system/core/components/card.ts`, `src/design-system/core/components/table.ts`, `src/design-system/core/components/page.ts`, `src/design-system/core/components/section.ts`.
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
| `disabled` | Yes | `boolean` | `NtkButtonContract` |
| `loading` | Yes | `boolean` | `NtkButtonContract` |
| `icon` | Yes | `string` | `NtkButtonContract` |
| `iconRight` | Yes | `string` | `NtkButtonContract` |
| `type` | Yes | `'button' \| 'submit' \| 'reset'` | `NtkButtonContract` |

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
| `selectable` | Yes | `boolean` | `NtkTableContract` |
| `emptyLabel` | Yes | `string` | `NtkTableContract` |
| `emptyValueLabel` | Yes | `string` | `NtkTableContract` |

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