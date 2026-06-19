# Component Recipes

Generated from `src/design-system/core/components/contracts.ts`, `src/design-system/core/components/button.ts`, `src/design-system/core/components/field.ts`, `src/design-system/core/components/card.ts`.
Do not edit by hand.

## Shared Primitives

- Sizes: `sm`, `md`, `lg`.
- Intents: `neutral`, `primary`, `success`, `warning`, `danger`, `info`.

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