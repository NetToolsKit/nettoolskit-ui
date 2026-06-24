/**
 * Exhaustive recipe coverage for the usability-expansion component set.
 *
 * The recipes are the deterministic core of the design system, so the STANDARD
 * (NTK-FE-STD-001 §21.3) requires pinning their exact output. Each recipe is
 * checked two ways:
 *   1. Literal `toStrictEqual` pins for representative combinations (locks the
 *      concrete class strings and their order independent of the class maps).
 *   2. A full `variant × size × intent (× density/columns/...)` matrix loop that
 *      asserts every enum value resolves, in the exact documented order, with no
 *      missing or duplicated classes.
 */

import { describe, expect, it } from 'vitest'
import {
  ntkComponentIntents,
  ntkComponentSizes,
  ntkComponentDensities,
  // page header
  ntkPageHeaderVariants,
  ntkPageHeaderRecipeClassMap,
  resolveNtkPageHeaderRecipe,
  // toolbar
  ntkToolbarVariants,
  ntkToolbarAligns,
  ntkToolbarRecipeClassMap,
  ntkToolbarDensityClassMap,
  ntkToolbarAlignClassMap,
  resolveNtkToolbarRecipe,
  // filter bar
  ntkFilterBarVariants,
  ntkFilterBarRecipeClassMap,
  ntkFilterBarDensityClassMap,
  resolveNtkFilterBarRecipe,
  // form layout
  ntkFormLayoutVariants,
  ntkFormLayoutColumns,
  ntkFormLayoutRecipeClassMap,
  ntkFormLayoutDensityClassMap,
  ntkFormLayoutColumnsClassMap,
  resolveNtkFormLayoutRecipe,
  // dialog
  ntkDialogVariants,
  ntkDialogRecipeClassMap,
  resolveNtkDialogRecipe,
  // empty state
  ntkEmptyStateVariants,
  ntkEmptyStateRecipeClassMap,
  resolveNtkEmptyStateRecipe,
  // metric grid
  ntkMetricGridVariants,
  ntkMetricGridColumns,
  ntkMetricGridRecipeClassMap,
  ntkMetricGridDensityClassMap,
  ntkMetricGridColumnsClassMap,
  resolveNtkMetricGridRecipe,
  // state block
  ntkStateBlockVariants,
  ntkStateBlockStates,
  ntkStateBlockRecipeClassMap,
  ntkStateBlockStateClassMap,
  ntkStateBlockStateIntent,
  resolveNtkStateBlockRecipe,
} from '@/design-system/core'

const noDuplicates = (classes: readonly string[]): void => {
  expect(new Set(classes).size).toBe(classes.length)
}

describe('resolveNtkPageHeaderRecipe (exhaustive)', () => {
  it('pins concrete default and full-combination output', () => {
    expect(resolveNtkPageHeaderRecipe().classes).toStrictEqual([
      'ntk-page-header',
      'ntk-page-header--variant-default',
      'ntk-page-header--size-md',
      'ntk-page-header--intent-neutral',
    ])
    expect(resolveNtkPageHeaderRecipe({ variant: 'hero', size: 'lg', intent: 'primary', class: 'x' }).classes)
      .toStrictEqual([
        'ntk-page-header',
        'ntk-page-header--variant-hero',
        'ntk-page-header--size-lg',
        'ntk-page-header--intent-primary',
        'x',
      ])
  })

  it('resolves every variant × size × intent in order', () => {
    for (const variant of ntkPageHeaderVariants) {
      for (const size of ntkComponentSizes) {
        for (const intent of ntkComponentIntents) {
          const { classes } = resolveNtkPageHeaderRecipe({ variant, size, intent })
          expect(classes).toStrictEqual([
            ntkPageHeaderRecipeClassMap.root,
            ntkPageHeaderRecipeClassMap.variants[variant],
            ntkPageHeaderRecipeClassMap.sizes[size],
            ntkPageHeaderRecipeClassMap.intents[intent],
          ])
          noDuplicates(classes)
        }
      }
    }
  })
})

describe('resolveNtkDialogRecipe (exhaustive)', () => {
  it('pins concrete default and full-combination output', () => {
    expect(resolveNtkDialogRecipe().classes).toStrictEqual([
      'ntk-dialog',
      'ntk-dialog--variant-default',
      'ntk-dialog--size-md',
      'ntk-dialog--intent-neutral',
    ])
    expect(resolveNtkDialogRecipe({ variant: 'sheet', size: 'lg', intent: 'danger' }).classes).toStrictEqual([
      'ntk-dialog',
      'ntk-dialog--variant-sheet',
      'ntk-dialog--size-lg',
      'ntk-dialog--intent-danger',
    ])
  })

  it('resolves every variant × size × intent in order', () => {
    for (const variant of ntkDialogVariants) {
      for (const size of ntkComponentSizes) {
        for (const intent of ntkComponentIntents) {
          const { classes } = resolveNtkDialogRecipe({ variant, size, intent })
          expect(classes).toStrictEqual([
            ntkDialogRecipeClassMap.root,
            ntkDialogRecipeClassMap.variants[variant],
            ntkDialogRecipeClassMap.sizes[size],
            ntkDialogRecipeClassMap.intents[intent],
          ])
          noDuplicates(classes)
        }
      }
    }
  })
})

describe('resolveNtkEmptyStateRecipe (exhaustive)', () => {
  it('pins concrete default and full-combination output', () => {
    expect(resolveNtkEmptyStateRecipe().classes).toStrictEqual([
      'ntk-empty-state',
      'ntk-empty-state--variant-default',
      'ntk-empty-state--size-md',
      'ntk-empty-state--intent-neutral',
    ])
    expect(resolveNtkEmptyStateRecipe({ variant: 'bordered', size: 'sm', intent: 'info' }).classes).toStrictEqual([
      'ntk-empty-state',
      'ntk-empty-state--variant-bordered',
      'ntk-empty-state--size-sm',
      'ntk-empty-state--intent-info',
    ])
  })

  it('resolves every variant × size × intent in order', () => {
    for (const variant of ntkEmptyStateVariants) {
      for (const size of ntkComponentSizes) {
        for (const intent of ntkComponentIntents) {
          const { classes } = resolveNtkEmptyStateRecipe({ variant, size, intent })
          expect(classes).toStrictEqual([
            ntkEmptyStateRecipeClassMap.root,
            ntkEmptyStateRecipeClassMap.variants[variant],
            ntkEmptyStateRecipeClassMap.sizes[size],
            ntkEmptyStateRecipeClassMap.intents[intent],
          ])
          noDuplicates(classes)
        }
      }
    }
  })
})

describe('resolveNtkToolbarRecipe (exhaustive)', () => {
  it('pins concrete default and full-combination output', () => {
    expect(resolveNtkToolbarRecipe().classes).toStrictEqual([
      'ntk-toolbar',
      'ntk-toolbar--variant-default',
      'ntk-toolbar--size-md',
      'ntk-toolbar--intent-neutral',
      'ntk-toolbar--density-comfortable',
      'ntk-toolbar--align-start',
    ])
    expect(resolveNtkToolbarRecipe({ variant: 'floating', size: 'lg', intent: 'primary', density: 'compact', align: 'between', wrap: true }).classes)
      .toStrictEqual([
        'ntk-toolbar',
        'ntk-toolbar--variant-floating',
        'ntk-toolbar--size-lg',
        'ntk-toolbar--intent-primary',
        'ntk-toolbar--density-compact',
        'ntk-toolbar--align-between',
        'ntk-toolbar--is-wrap',
      ])
  })

  it('resolves every variant × size × intent × density × align (+wrap) in order', () => {
    for (const variant of ntkToolbarVariants) {
      for (const size of ntkComponentSizes) {
        for (const intent of ntkComponentIntents) {
          for (const density of ntkComponentDensities) {
            for (const align of ntkToolbarAligns) {
              for (const wrap of [false, true]) {
                const { classes } = resolveNtkToolbarRecipe({ variant, size, intent, density, align, wrap })
                expect(classes).toStrictEqual([
                  ntkToolbarRecipeClassMap.root,
                  ntkToolbarRecipeClassMap.variants[variant],
                  ntkToolbarRecipeClassMap.sizes[size],
                  ntkToolbarRecipeClassMap.intents[intent],
                  ntkToolbarDensityClassMap[density],
                  ntkToolbarAlignClassMap[align],
                  ...(wrap ? ['ntk-toolbar--is-wrap'] : []),
                ])
                noDuplicates(classes)
              }
            }
          }
        }
      }
    }
  })
})

describe('resolveNtkFilterBarRecipe (exhaustive)', () => {
  it('pins concrete default and full-combination output', () => {
    expect(resolveNtkFilterBarRecipe().classes).toStrictEqual([
      'ntk-filter-bar',
      'ntk-filter-bar--variant-default',
      'ntk-filter-bar--size-md',
      'ntk-filter-bar--intent-neutral',
      'ntk-filter-bar--density-comfortable',
    ])
    expect(resolveNtkFilterBarRecipe({ variant: 'inline', size: 'sm', intent: 'warning', density: 'spacious', loading: true }).classes)
      .toStrictEqual([
        'ntk-filter-bar',
        'ntk-filter-bar--variant-inline',
        'ntk-filter-bar--size-sm',
        'ntk-filter-bar--intent-warning',
        'ntk-filter-bar--is-loading',
        'ntk-filter-bar--density-spacious',
      ])
  })

  it('resolves every variant × size × intent × density (+loading) in order', () => {
    for (const variant of ntkFilterBarVariants) {
      for (const size of ntkComponentSizes) {
        for (const intent of ntkComponentIntents) {
          for (const density of ntkComponentDensities) {
            for (const loading of [false, true]) {
              const { classes } = resolveNtkFilterBarRecipe({ variant, size, intent, density, loading })
              expect(classes).toStrictEqual([
                ntkFilterBarRecipeClassMap.root,
                ntkFilterBarRecipeClassMap.variants[variant],
                ntkFilterBarRecipeClassMap.sizes[size],
                ntkFilterBarRecipeClassMap.intents[intent],
                ...(loading ? [ntkFilterBarRecipeClassMap.states.loading] : []),
                ntkFilterBarDensityClassMap[density],
              ])
              noDuplicates(classes)
            }
          }
        }
      }
    }
  })
})

describe('resolveNtkFormLayoutRecipe (exhaustive)', () => {
  it('pins concrete default and full-combination output', () => {
    expect(resolveNtkFormLayoutRecipe().classes).toStrictEqual([
      'ntk-form-layout',
      'ntk-form-layout--variant-stacked',
      'ntk-form-layout--size-md',
      'ntk-form-layout--intent-neutral',
      'ntk-form-layout--density-comfortable',
      'ntk-form-layout--cols-1',
    ])
    expect(resolveNtkFormLayoutRecipe({ variant: 'grid', size: 'lg', intent: 'success', density: 'compact', columns: 3 }).classes)
      .toStrictEqual([
        'ntk-form-layout',
        'ntk-form-layout--variant-grid',
        'ntk-form-layout--size-lg',
        'ntk-form-layout--intent-success',
        'ntk-form-layout--density-compact',
        'ntk-form-layout--cols-3',
      ])
  })

  it('resolves every variant × size × intent × density × columns in order', () => {
    for (const variant of ntkFormLayoutVariants) {
      for (const size of ntkComponentSizes) {
        for (const intent of ntkComponentIntents) {
          for (const density of ntkComponentDensities) {
            for (const columns of ntkFormLayoutColumns) {
              const { classes } = resolveNtkFormLayoutRecipe({ variant, size, intent, density, columns })
              expect(classes).toStrictEqual([
                ntkFormLayoutRecipeClassMap.root,
                ntkFormLayoutRecipeClassMap.variants[variant],
                ntkFormLayoutRecipeClassMap.sizes[size],
                ntkFormLayoutRecipeClassMap.intents[intent],
                ntkFormLayoutDensityClassMap[density],
                ntkFormLayoutColumnsClassMap[columns],
              ])
              noDuplicates(classes)
            }
          }
        }
      }
    }
  })
})

describe('resolveNtkMetricGridRecipe (exhaustive)', () => {
  it('pins concrete default and full-combination output', () => {
    expect(resolveNtkMetricGridRecipe().classes).toStrictEqual([
      'ntk-metric-grid',
      'ntk-metric-grid--variant-default',
      'ntk-metric-grid--size-md',
      'ntk-metric-grid--intent-neutral',
      'ntk-metric-grid--density-comfortable',
      'ntk-metric-grid--cols-auto',
    ])
    expect(resolveNtkMetricGridRecipe({ variant: 'bordered', size: 'sm', intent: 'info', density: 'spacious', columns: 4 }).classes)
      .toStrictEqual([
        'ntk-metric-grid',
        'ntk-metric-grid--variant-bordered',
        'ntk-metric-grid--size-sm',
        'ntk-metric-grid--intent-info',
        'ntk-metric-grid--density-spacious',
        'ntk-metric-grid--cols-4',
      ])
  })

  it('resolves every variant × size × intent × density × columns in order', () => {
    for (const variant of ntkMetricGridVariants) {
      for (const size of ntkComponentSizes) {
        for (const intent of ntkComponentIntents) {
          for (const density of ntkComponentDensities) {
            for (const columns of ntkMetricGridColumns) {
              const { classes } = resolveNtkMetricGridRecipe({ variant, size, intent, density, columns })
              expect(classes).toStrictEqual([
                ntkMetricGridRecipeClassMap.root,
                ntkMetricGridRecipeClassMap.variants[variant],
                ntkMetricGridRecipeClassMap.sizes[size],
                ntkMetricGridRecipeClassMap.intents[intent],
                ntkMetricGridDensityClassMap[density],
                ntkMetricGridColumnsClassMap[columns],
              ])
              noDuplicates(classes)
            }
          }
        }
      }
    }
  })
})

describe('resolveNtkStateBlockRecipe (exhaustive)', () => {
  it('pins concrete default and state-derived intent output', () => {
    expect(resolveNtkStateBlockRecipe().classes).toStrictEqual([
      'ntk-state-block',
      'ntk-state-block--variant-default',
      'ntk-state-block--size-md',
      'ntk-state-block--intent-neutral',
      'ntk-state-block--state-loading',
    ])
    expect(resolveNtkStateBlockRecipe({ state: 'error' }).classes).toStrictEqual([
      'ntk-state-block',
      'ntk-state-block--variant-default',
      'ntk-state-block--size-md',
      'ntk-state-block--intent-danger',
      'ntk-state-block--state-error',
    ])
  })

  it('derives intent from state for every variant × size × state', () => {
    for (const variant of ntkStateBlockVariants) {
      for (const size of ntkComponentSizes) {
        for (const state of ntkStateBlockStates) {
          const intent = ntkStateBlockStateIntent[state]
          const { classes, intent: resolvedIntent } = resolveNtkStateBlockRecipe({ variant, size, state })
          expect(resolvedIntent).toBe(intent)
          expect(classes).toStrictEqual([
            ntkStateBlockRecipeClassMap.root,
            ntkStateBlockRecipeClassMap.variants[variant],
            ntkStateBlockRecipeClassMap.sizes[size],
            ntkStateBlockRecipeClassMap.intents[intent],
            ntkStateBlockStateClassMap[state],
          ])
          noDuplicates(classes)
        }
      }
    }
  })

  it('lets an explicit intent override the state default across all states', () => {
    for (const state of ntkStateBlockStates) {
      for (const intent of ntkComponentIntents) {
        const { classes, intent: resolvedIntent } = resolveNtkStateBlockRecipe({ state, intent })
        expect(resolvedIntent).toBe(intent)
        expect(classes).toContain(ntkStateBlockRecipeClassMap.intents[intent])
        expect(classes).toContain(ntkStateBlockStateClassMap[state])
      }
    }
  })
})