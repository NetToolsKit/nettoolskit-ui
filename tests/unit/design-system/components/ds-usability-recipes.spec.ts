/**
 * Contract/recipe coverage for the usability-expansion component set.
 */

import { describe, expect, it } from 'vitest'
import {
  ntkComponentDensities,
  ntkDialogDefaults,
  ntkDialogVariants,
  ntkEmptyStateVariants,
  ntkFilterBarVariants,
  ntkFormLayoutColumns,
  ntkFormLayoutVariants,
  ntkMetricGridColumns,
  ntkMetricGridVariants,
  ntkPageHeaderDefaults,
  ntkPageHeaderVariants,
  ntkStateBlockStates,
  ntkStateBlockVariants,
  ntkToolbarAligns,
  ntkToolbarVariants,
  resolveNtkDialogRecipe,
  resolveNtkEmptyStateRecipe,
  resolveNtkFilterBarRecipe,
  resolveNtkFormLayoutRecipe,
  resolveNtkMetricGridRecipe,
  resolveNtkPageHeaderRecipe,
  resolveNtkStateBlockRecipe,
  resolveNtkToolbarRecipe,
} from '@/design-system/core'

describe('usability-expansion recipe vocabularies', () => {
  it('exposes the expected closed enums', () => {
    expect(ntkComponentDensities).toEqual(['compact', 'comfortable', 'spacious'])
    expect(ntkPageHeaderVariants).toEqual(['default', 'compact', 'hero'])
    expect(ntkToolbarVariants).toEqual(['default', 'bordered', 'floating'])
    expect(ntkToolbarAligns).toEqual(['start', 'center', 'end', 'between'])
    expect(ntkFilterBarVariants).toEqual(['default', 'inline', 'stacked'])
    expect(ntkFormLayoutVariants).toEqual(['stacked', 'grid', 'inline'])
    expect(ntkFormLayoutColumns).toEqual([1, 2, 3, 4])
    expect(ntkDialogVariants).toEqual(['default', 'sheet', 'fullscreen'])
    expect(ntkEmptyStateVariants).toEqual(['default', 'bordered', 'ghost'])
    expect(ntkMetricGridVariants).toEqual(['default', 'bordered', 'plain'])
    expect(ntkMetricGridColumns).toEqual(['auto', 2, 3, 4])
    expect(ntkStateBlockStates).toEqual(['loading', 'error', 'empty', 'success', 'skeleton'])
    expect(ntkStateBlockVariants).toEqual(['default', 'inline', 'overlay'])
  })
})

describe('resolveNtkPageHeaderRecipe', () => {
  it('applies defaults and variant/size/intent classes', () => {
    expect(ntkPageHeaderDefaults.variant).toBe('default')
    expect(ntkPageHeaderDefaults.headingLevel).toBe(1)

    const { classes } = resolveNtkPageHeaderRecipe({ variant: 'hero', size: 'lg', intent: 'primary', class: 'x' })
    expect(classes).toEqual(expect.arrayContaining([
      'ntk-page-header',
      'ntk-page-header--variant-hero',
      'ntk-page-header--size-lg',
      'ntk-page-header--intent-primary',
      'x',
    ]))
  })
})

describe('resolveNtkToolbarRecipe', () => {
  it('adds density, align, and wrap modifiers', () => {
    const recipe = resolveNtkToolbarRecipe({ density: 'compact', align: 'between', wrap: true })
    expect(recipe.density).toBe('compact')
    expect(recipe.align).toBe('between')
    expect(recipe.classes).toEqual(expect.arrayContaining([
      'ntk-toolbar',
      'ntk-toolbar--density-compact',
      'ntk-toolbar--align-between',
      'ntk-toolbar--is-wrap',
    ]))
  })

  it('defaults to comfortable density and start align', () => {
    const recipe = resolveNtkToolbarRecipe()
    expect(recipe.classes).toContain('ntk-toolbar--density-comfortable')
    expect(recipe.classes).toContain('ntk-toolbar--align-start')
    expect(recipe.classes).not.toContain('ntk-toolbar--is-wrap')
  })
})

describe('resolveNtkFilterBarRecipe', () => {
  it('reflects loading state and density', () => {
    const { classes } = resolveNtkFilterBarRecipe({ loading: true, density: 'spacious' })
    expect(classes).toEqual(expect.arrayContaining([
      'ntk-filter-bar',
      'ntk-filter-bar--is-loading',
      'ntk-filter-bar--density-spacious',
    ]))
  })
})

describe('resolveNtkFormLayoutRecipe', () => {
  it('maps columns and density to modifier classes', () => {
    const recipe = resolveNtkFormLayoutRecipe({ variant: 'grid', columns: 3, density: 'compact' })
    expect(recipe.columns).toBe(3)
    expect(recipe.classes).toEqual(expect.arrayContaining([
      'ntk-form-layout--variant-grid',
      'ntk-form-layout--cols-3',
      'ntk-form-layout--density-compact',
    ]))
  })
})

describe('resolveNtkDialogRecipe', () => {
  it('applies size variants', () => {
    expect(ntkDialogDefaults.size).toBe('md')
    const { classes } = resolveNtkDialogRecipe({ variant: 'sheet', size: 'lg' })
    expect(classes).toEqual(expect.arrayContaining([
      'ntk-dialog',
      'ntk-dialog--variant-sheet',
      'ntk-dialog--size-lg',
    ]))
  })
})

describe('resolveNtkEmptyStateRecipe', () => {
  it('applies variant and intent classes', () => {
    const { classes } = resolveNtkEmptyStateRecipe({ variant: 'bordered', intent: 'info' })
    expect(classes).toEqual(expect.arrayContaining([
      'ntk-empty-state--variant-bordered',
      'ntk-empty-state--intent-info',
    ]))
  })
})

describe('resolveNtkMetricGridRecipe', () => {
  it('supports auto and fixed column counts', () => {
    expect(resolveNtkMetricGridRecipe().classes).toContain('ntk-metric-grid--cols-auto')
    expect(resolveNtkMetricGridRecipe({ columns: 4 }).classes).toContain('ntk-metric-grid--cols-4')
  })
})

describe('resolveNtkStateBlockRecipe', () => {
  it('derives the default intent from the state', () => {
    const error = resolveNtkStateBlockRecipe({ state: 'error' })
    expect(error.intent).toBe('danger')
    expect(error.classes).toEqual(expect.arrayContaining([
      'ntk-state-block--state-error',
      'ntk-state-block--intent-danger',
    ]))

    const success = resolveNtkStateBlockRecipe({ state: 'success' })
    expect(success.intent).toBe('success')
    expect(success.classes).toContain('ntk-state-block--state-success')
  })

  it('lets an explicit intent override the state default', () => {
    const recipe = resolveNtkStateBlockRecipe({ state: 'error', intent: 'neutral' })
    expect(recipe.intent).toBe('neutral')
    expect(recipe.classes).toContain('ntk-state-block--intent-neutral')
  })
})