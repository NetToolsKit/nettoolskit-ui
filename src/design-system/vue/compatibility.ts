/**
 * Pure Vue compatibility adapters for future component wrappers.
 */

import {
  ntkButtonDefaults,
  ntkCardDefaults,
  ntkFieldDefaults,
  resolveNtkButtonRecipe,
  resolveNtkCardRecipe,
  resolveNtkFieldRecipe,
  type NtkButtonContract,
  type NtkButtonVariant,
  type NtkCardContract,
  type NtkCardIntent,
  type NtkFieldContract,
  type NtkFieldVariant,
} from '../core'

export interface NtkVueCompatButtonProps {
  readonly label?: string
  readonly size: string
  readonly color: string
  readonly disable?: boolean
  readonly loading?: boolean
  readonly icon?: string
  readonly iconRight?: string
  readonly type?: 'button' | 'submit' | 'reset'
  readonly flat?: boolean
  readonly outline?: boolean
  readonly unelevated?: boolean
  readonly class: readonly string[]
}

export interface NtkVueCompatFieldProps<TValue = unknown> {
  readonly modelValue?: TValue
  readonly name?: string
  readonly label?: string
  readonly placeholder?: string
  readonly outlined: boolean
  readonly filled: boolean
  readonly dense: boolean
  readonly disable?: boolean
  readonly readonly?: boolean
  readonly hint?: string
  readonly errorMessage?: string
  readonly class: readonly string[]
}

export interface NtkVueCompatCardProps {
  readonly variant: string
  readonly clickable?: boolean
  readonly accentColor?: Exclude<NtkCardIntent, 'neutral'>
  readonly class: readonly string[]
}

const ntkButtonVariantProps = {
  solid: { unelevated: true },
  soft: { flat: true, unelevated: true },
  outline: { outline: true },
  ghost: { flat: true },
  link: { flat: true, unelevated: true },
  plain: { flat: true },
} as const satisfies Record<NtkButtonVariant, Partial<NtkVueCompatButtonProps>>

const ntkFieldVariantProps = {
  outlined: { outlined: true, filled: false },
  filled: { outlined: false, filled: true },
  plain: { outlined: false, filled: false },
} as const satisfies Record<NtkFieldVariant, Pick<NtkVueCompatFieldProps, 'outlined' | 'filled'>>

const mapCardIntentToAccentColor = (
  intent: NtkCardIntent,
): Exclude<NtkCardIntent, 'neutral'> | undefined => {
  return intent === 'neutral' ? undefined : intent
}

export const resolveNtkButtonVueCompatProps = (
  contract: NtkButtonContract = {},
): NtkVueCompatButtonProps => {
  const recipe = resolveNtkButtonRecipe(contract)
  const variant = contract.variant ?? ntkButtonDefaults.variant

  return {
    label: contract.label,
    size: contract.size ?? ntkButtonDefaults.size,
    color: contract.intent ?? ntkButtonDefaults.intent,
    disable: contract.disabled,
    loading: contract.loading,
    icon: contract.icon,
    iconRight: contract.iconRight,
    type: contract.type,
    ...ntkButtonVariantProps[variant],
    class: recipe.classes,
  }
}

export const resolveNtkFieldVueCompatProps = <TValue = unknown>(
  contract: NtkFieldContract<TValue> = {},
): NtkVueCompatFieldProps<TValue> => {
  const recipe = resolveNtkFieldRecipe(contract)
  const variant = contract.variant ?? ntkFieldDefaults.variant

  return {
    modelValue: contract.modelValue,
    name: contract.name,
    label: contract.label,
    placeholder: contract.placeholder,
    ...ntkFieldVariantProps[variant],
    dense: contract.size === 'sm',
    disable: contract.disabled,
    readonly: contract.readonly,
    hint: contract.hint,
    errorMessage: contract.errorMessage,
    class: recipe.classes,
  }
}

export const resolveNtkCardVueCompatProps = (
  contract: NtkCardContract = {},
): NtkVueCompatCardProps => {
  const recipe = resolveNtkCardRecipe(contract)
  const intent = contract.intent ?? ntkCardDefaults.intent

  return {
    variant: contract.variant ?? ntkCardDefaults.variant,
    clickable: contract.clickable,
    accentColor: mapCardIntentToAccentColor(intent),
    class: recipe.classes,
  }
}

export const ntkVueCompatibilityAdapters = {
  button: {
    componentName: 'NtkButton',
    resolveProps: resolveNtkButtonVueCompatProps,
    resolveRecipe: resolveNtkButtonRecipe,
  },
  field: {
    componentName: 'NtkInput',
    resolveProps: resolveNtkFieldVueCompatProps,
    resolveRecipe: resolveNtkFieldRecipe,
  },
  card: {
    componentName: 'NtkCard',
    resolveProps: resolveNtkCardVueCompatProps,
    resolveRecipe: resolveNtkCardRecipe,
  },
} as const