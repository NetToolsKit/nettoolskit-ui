/**
 * Tests/unit/design-system/components/component recipes spec module.
 */

import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  ntkButtonRecipeClassMap,
  ntkButtonVariants,
  ntkCardRecipeClassMap,
  ntkComponentIntents,
  ntkComponentSizes,
  ntkFieldVariants,
  resolveNtkButtonRecipe,
  resolveNtkCardRecipe,
  resolveNtkFieldRecipe,
  type NtkButtonContract,
  type NtkButtonVariant,
  type NtkComponentIntent,
  type NtkComponentSize,
} from '@/design-system/core'
import {
  ntkVueCompatibilityAdapters,
  resolveNtkButtonVueCompatProps,
  resolveNtkCardVueCompatProps,
  resolveNtkFieldVueCompatProps,
} from '@/design-system/vue'

describe('design-system component recipes', () => {
  it('exposes typed button, field, size, and intent primitives', () => {
    expect(ntkButtonVariants).toEqual(['solid', 'outline', 'ghost', 'link'])
    expect(ntkFieldVariants).toEqual(['outlined', 'filled', 'plain'])
    expect(ntkComponentSizes).toEqual(['sm', 'md', 'lg'])
    expect(ntkComponentIntents).toEqual(['neutral', 'primary', 'success', 'warning', 'danger', 'info'])

    expectTypeOf<NtkButtonContract>().toMatchTypeOf<{
      variant?: NtkButtonVariant
      size?: NtkComponentSize
      intent?: NtkComponentIntent
    }>()
  })

  it('maps default button recipes to stable class names', () => {
    const recipe = resolveNtkButtonRecipe()

    expect(recipe.variant).toBe('solid')
    expect(recipe.size).toBe('md')
    expect(recipe.intent).toBe('primary')
    expect(recipe.className).toBe(
      'ntk-button ntk-button--variant-solid ntk-button--size-md ntk-button--intent-primary',
    )
  })

  it('maps button variants, sizes, intents, states, and extra classes', () => {
    const recipe = resolveNtkButtonRecipe({
      variant: 'outline',
      size: 'sm',
      intent: 'danger',
      disabled: true,
      loading: true,
      class: ['custom-class', { 'is-active': true, 'is-muted': false }, 'custom-class'],
    })

    expect(recipe.classes).toEqual([
      'ntk-button',
      'ntk-button--variant-outline',
      'ntk-button--size-sm',
      'ntk-button--intent-danger',
      'ntk-button--is-disabled',
      'ntk-button--is-loading',
      'custom-class',
      'is-active',
    ])
  })

  it('maps field recipes to typed variant, size, intent, and state classes', () => {
    const recipe = resolveNtkFieldRecipe({
      variant: 'filled',
      size: 'lg',
      intent: 'warning',
      invalid: true,
      readonly: true,
      required: true,
    })

    expect(recipe.classes).toEqual([
      'ntk-field',
      'ntk-field--variant-filled',
      'ntk-field--size-lg',
      'ntk-field--intent-warning',
      'ntk-field--is-invalid',
      'ntk-field--is-readonly',
      'ntk-field--is-required',
    ])
  })

  it('maps card recipes to compatibility variant names and interaction classes', () => {
    const recipe = resolveNtkCardRecipe({
      variant: 'accent-left',
      size: 'sm',
      intent: 'success',
      clickable: true,
      selected: true,
    })

    expect(ntkCardRecipeClassMap.variants['accent-left']).toBe('ntk-card--variant-accent-left')
    expect(recipe.classes).toEqual([
      'ntk-card',
      'ntk-card--variant-accent-left',
      'ntk-card--size-sm',
      'ntk-card--intent-success',
      'ntk-card--is-clickable',
      'ntk-card--is-selected',
    ])
  })

  it('keeps recipe-to-class maps explicit for future wrappers', () => {
    expect(ntkButtonRecipeClassMap.variants.ghost).toBe('ntk-button--variant-ghost')
    expect(ntkButtonRecipeClassMap.sizes.lg).toBe('ntk-button--size-lg')
    expect(ntkButtonRecipeClassMap.intents.info).toBe('ntk-button--intent-info')
  })

  it('maps button contracts into pure Vue compatibility props', () => {
    const props = resolveNtkButtonVueCompatProps({
      label: 'Open',
      variant: 'ghost',
      size: 'lg',
      intent: 'info',
      disabled: true,
      loading: true,
      iconRight: 'arrow_forward',
    })

    expect(props).toMatchObject({
      label: 'Open',
      size: 'lg',
      color: 'info',
      disable: true,
      loading: true,
      iconRight: 'arrow_forward',
      flat: true,
    })
    expect(props.class).toContain('ntk-button--variant-ghost')
    expect(props.class).toContain('ntk-button--intent-info')
  })

  it('maps field contracts into pure Vue compatibility props', () => {
    const props = resolveNtkFieldVueCompatProps({
      modelValue: 'hello',
      label: 'Name',
      variant: 'filled',
      size: 'sm',
      disabled: true,
      readonly: true,
      invalid: true,
    })

    expect(props).toMatchObject({
      modelValue: 'hello',
      label: 'Name',
      outlined: false,
      filled: true,
      dense: true,
      disable: true,
      readonly: true,
    })
    expect(props.class).toContain('ntk-field--is-invalid')
  })

  it('maps card contracts into pure Vue compatibility props', () => {
    const props = resolveNtkCardVueCompatProps({
      variant: 'accent-top',
      intent: 'danger',
      clickable: true,
    })

    expect(props).toMatchObject({
      variant: 'accent-top',
      accentColor: 'danger',
      clickable: true,
    })
    expect(props.class).toContain('ntk-card--variant-accent-top')
    expect(props.class).toContain('ntk-card--intent-danger')
  })

  it('exposes named Vue adapter hooks without importing existing components', () => {
    expect(ntkVueCompatibilityAdapters.button.componentName).toBe('NtkButton')
    expect(ntkVueCompatibilityAdapters.field.componentName).toBe('NtkInput')
    expect(ntkVueCompatibilityAdapters.card.componentName).toBe('NtkCard')
    expect(ntkVueCompatibilityAdapters.button.resolveRecipe({ variant: 'link' }).classes).toContain(
      'ntk-button--variant-link',
    )
  })
})