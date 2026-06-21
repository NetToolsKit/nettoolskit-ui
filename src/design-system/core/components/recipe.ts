/**
 * Primitive helpers for mapping typed component recipes to CSS classes.
 */

export type NtkClassDictionary = Record<string, boolean | null | undefined>
export type NtkClassValue =
  | string
  | NtkClassDictionary
  | readonly NtkClassValue[]
  | false
  | null
  | undefined

export const ntkRecipeStates = [
  'disabled',
  'loading',
  'invalid',
  'readonly',
  'required',
  'clickable',
  'selected',
] as const

export type NtkRecipeState = (typeof ntkRecipeStates)[number]

export interface NtkRecipeClassMap<
  TVariant extends string,
  TSize extends string,
  TIntent extends string,
> {
  readonly root: string
  readonly variants: Record<TVariant, string>
  readonly sizes: Record<TSize, string>
  readonly intents: Record<TIntent, string>
  readonly states?: Partial<Record<NtkRecipeState, string>>
}

export interface NtkRecipeDefaults<
  TVariant extends string,
  TSize extends string,
  TIntent extends string,
> {
  readonly variant: TVariant
  readonly size: TSize
  readonly intent: TIntent
}

export type NtkRecipeOptions<
  TVariant extends string,
  TSize extends string,
  TIntent extends string,
> = Partial<NtkRecipeDefaults<TVariant, TSize, TIntent>>
  & Partial<Record<NtkRecipeState, boolean>>
  & {
    readonly class?: NtkClassValue
  }

export interface NtkResolvedRecipe<
  TVariant extends string,
  TSize extends string,
  TIntent extends string,
> extends NtkRecipeDefaults<TVariant, TSize, TIntent> {
  readonly classes: readonly string[]
  readonly className: string
}

export const normalizeNtkClasses = (value: NtkClassValue): string[] => {
  if (!value) {
    return []
  }

  if (typeof value === 'string') {
    return value.trim().split(/\s+/).filter(Boolean)
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeNtkClasses(entry))
  }

  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([className]) => className)
}

export const uniqueNtkClasses = (classes: readonly string[]): string[] => {
  const uniqueClasses = new Set<string>()

  classes.forEach((className) => {
    if (className) {
      uniqueClasses.add(className)
    }
  })

  return Array.from(uniqueClasses)
}

export const resolveNtkRecipe = <
  TVariant extends string,
  TSize extends string,
  TIntent extends string,
>(
  classMap: NtkRecipeClassMap<TVariant, TSize, TIntent>,
  defaults: NtkRecipeDefaults<TVariant, TSize, TIntent>,
  options: NtkRecipeOptions<TVariant, TSize, TIntent> = {},
): NtkResolvedRecipe<TVariant, TSize, TIntent> => {
  const variant = options.variant ?? defaults.variant
  const size = options.size ?? defaults.size
  const intent = options.intent ?? defaults.intent
  const stateClasses = ntkRecipeStates
    .filter((state) => options[state])
    .map((state) => classMap.states?.[state])
    .filter((className): className is string => Boolean(className))

  const classes = uniqueNtkClasses([
    classMap.root,
    classMap.variants[variant],
    classMap.sizes[size],
    classMap.intents[intent],
    ...stateClasses,
    ...normalizeNtkClasses(options.class),
  ])

  return {
    variant,
    size,
    intent,
    classes,
    className: classes.join(' '),
  }
}