/**
 * Coverage for the public `getNtk*Classes` / `getNtk*ClassName` helper exports
 * and the shared recipe primitives. These thin wrappers are part of the public
 * core surface (consumed by non-Vue adapters), so they are exercised directly to
 * keep the deterministic core at full coverage (STANDARD §21.2).
 */

import { describe, expect, it } from 'vitest'
import {
  getNtkButtonClasses,
  getNtkButtonClassName,
  getNtkCardClasses,
  getNtkCardClassName,
  getNtkChipClasses,
  getNtkChipClassName,
  getNtkStepsClasses,
  getNtkStepsClassName,
  getNtkDialogClasses,
  getNtkDialogClassName,
  getNtkEmptyStateClasses,
  getNtkEmptyStateClassName,
  getNtkFieldClasses,
  getNtkFieldClassName,
  getNtkFilterBarClasses,
  getNtkFilterBarClassName,
  getNtkFormLayoutClasses,
  getNtkFormLayoutClassName,
  getNtkMetricGridClasses,
  getNtkMetricGridClassName,
  getNtkPageClasses,
  getNtkPageClassName,
  getNtkPageHeaderClasses,
  getNtkPageHeaderClassName,
  getNtkSectionClasses,
  getNtkSectionClassName,
  getNtkStateBlockClasses,
  getNtkStateBlockClassName,
  getNtkTableClasses,
  getNtkTableClassName,
  getNtkToolbarClasses,
  getNtkToolbarClassName,
  normalizeNtkClasses,
  uniqueNtkClasses,
} from '@/design-system/core'

const helpers = [
  ['button', getNtkButtonClasses, getNtkButtonClassName, 'ntk-button'],
  ['card', getNtkCardClasses, getNtkCardClassName, 'ntk-card'],
  ['chip', getNtkChipClasses, getNtkChipClassName, 'ntk-chip'],
  ['steps', getNtkStepsClasses, getNtkStepsClassName, 'ntk-steps'],
  ['dialog', getNtkDialogClasses, getNtkDialogClassName, 'ntk-dialog'],
  ['empty-state', getNtkEmptyStateClasses, getNtkEmptyStateClassName, 'ntk-empty-state'],
  ['field', getNtkFieldClasses, getNtkFieldClassName, 'ntk-field'],
  ['filter-bar', getNtkFilterBarClasses, getNtkFilterBarClassName, 'ntk-filter-bar'],
  ['form-layout', getNtkFormLayoutClasses, getNtkFormLayoutClassName, 'ntk-form-layout'],
  ['metric-grid', getNtkMetricGridClasses, getNtkMetricGridClassName, 'ntk-metric-grid'],
  ['page', getNtkPageClasses, getNtkPageClassName, 'ntk-page'],
  ['page-header', getNtkPageHeaderClasses, getNtkPageHeaderClassName, 'ntk-page-header'],
  ['section', getNtkSectionClasses, getNtkSectionClassName, 'ntk-section'],
  ['state-block', getNtkStateBlockClasses, getNtkStateBlockClassName, 'ntk-state-block'],
  ['table', getNtkTableClasses, getNtkTableClassName, 'ntk-table'],
  ['toolbar', getNtkToolbarClasses, getNtkToolbarClassName, 'ntk-toolbar'],
] as const

describe('getNtk* class helpers', () => {
  it.each(helpers)('%s helpers return a root-prefixed class list and matching className', (_name, getClasses, getClassName, root) => {
    const classes = getClasses()
    const className = getClassName()

    expect(classes[0]).toBe(root)
    expect(className).toBe(classes.join(' '))
    expect(className.startsWith(root)).toBe(true)
  })
})

describe('recipe primitives edge cases', () => {
  it('normalizeNtkClasses handles strings, arrays, dictionaries, and falsy input', () => {
    expect(normalizeNtkClasses('a  b')).toEqual(['a', 'b'])
    expect(normalizeNtkClasses(['a', ['b', 'c']])).toEqual(['a', 'b', 'c'])
    expect(normalizeNtkClasses({ a: true, b: false, c: 1 as unknown as boolean })).toEqual(['a', 'c'])
    expect(normalizeNtkClasses(undefined)).toEqual([])
    expect(normalizeNtkClasses(false)).toEqual([])
    expect(normalizeNtkClasses('')).toEqual([])
  })

  it('uniqueNtkClasses drops duplicates and falsy entries while preserving order', () => {
    expect(uniqueNtkClasses(['a', 'b', 'a', '', 'c'])).toEqual(['a', 'b', 'c'])
  })
})