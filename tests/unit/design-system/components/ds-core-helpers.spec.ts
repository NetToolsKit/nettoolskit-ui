/**
 * Coverage for the public `getNtk*Classes` / `getNtk*ClassName` helper exports
 * and the shared recipe primitives. These thin wrappers are part of the public
 * core surface (consumed by non-Vue adapters), so they are exercised directly to
 * keep the deterministic core at full coverage (STANDARD §21.2).
 */

import { describe, expect, it } from 'vitest'
import {
  getNtkAppShellClasses,
  getNtkAppShellClassName,
  getNtkButtonClasses,
  getNtkButtonClassName,
  getNtkCardClasses,
  getNtkCardClassName,
  getNtkChipClasses,
  getNtkChipClassName,
  getNtkDrawerClasses,
  getNtkDrawerClassName,
  getNtkFooterClasses,
  getNtkFooterClassName,
  getNtkHeaderClasses,
  getNtkHeaderClassName,
  getNtkSidebarClasses,
  getNtkSidebarClassName,
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
  getNtkLogoClasses,
  getNtkLogoClassName,
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
  getNtkTableAriaSort,
  getNtkTablePageInfo,
  nextNtkTableSort,
  getNtkToolbarClasses,
  getNtkToolbarClassName,
  getNtkDensityClass,
  ntkComponentDensities,
  normalizeNtkClasses,
  uniqueNtkClasses,
} from '@/design-system/core'

const helpers = [
  ['app-shell', getNtkAppShellClasses, getNtkAppShellClassName, 'ntk-app-shell'],
  ['header', getNtkHeaderClasses, getNtkHeaderClassName, 'ntk-header'],
  ['sidebar', getNtkSidebarClasses, getNtkSidebarClassName, 'ntk-sidebar'],
  ['footer', getNtkFooterClasses, getNtkFooterClassName, 'ntk-footer'],
  ['drawer', getNtkDrawerClasses, getNtkDrawerClassName, 'ntk-drawer'],
  ['button', getNtkButtonClasses, getNtkButtonClassName, 'ntk-button'],
  ['card', getNtkCardClasses, getNtkCardClassName, 'ntk-card'],
  ['chip', getNtkChipClasses, getNtkChipClassName, 'ntk-chip'],
  ['steps', getNtkStepsClasses, getNtkStepsClassName, 'ntk-steps'],
  ['dialog', getNtkDialogClasses, getNtkDialogClassName, 'ntk-dialog'],
  ['empty-state', getNtkEmptyStateClasses, getNtkEmptyStateClassName, 'ntk-empty-state'],
  ['field', getNtkFieldClasses, getNtkFieldClassName, 'ntk-field'],
  ['filter-bar', getNtkFilterBarClasses, getNtkFilterBarClassName, 'ntk-filter-bar'],
  ['form-layout', getNtkFormLayoutClasses, getNtkFormLayoutClassName, 'ntk-form-layout'],
  ['logo', getNtkLogoClasses, getNtkLogoClassName, 'ntk-logo'],
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

  it('getNtkDensityClass builds a root-scoped density class and defaults to comfortable', () => {
    // Default-parameter branch (called without an explicit density).
    expect(getNtkDensityClass('ntk-button')).toBe('ntk-button--density-comfortable')
    for (const density of ntkComponentDensities) {
      expect(getNtkDensityClass('ntk-field', density)).toBe(`ntk-field--density-${density}`)
    }
  })
})

describe('table sort + pagination helpers', () => {
  it('getNtkTableAriaSort maps the active column/direction to aria-sort', () => {
    expect(getNtkTableAriaSort(null, 'name')).toBe('none')
    expect(getNtkTableAriaSort({ field: 'name', direction: 'asc' }, 'email')).toBe('none')
    expect(getNtkTableAriaSort({ field: 'name', direction: 'asc' }, 'name')).toBe('ascending')
    expect(getNtkTableAriaSort({ field: 'name', direction: 'desc' }, 'name')).toBe('descending')
  })

  it('nextNtkTableSort cycles none -> asc -> desc -> none and restarts on a new column', () => {
    expect(nextNtkTableSort(null, 'name')).toEqual({ field: 'name', direction: 'asc' })
    expect(nextNtkTableSort({ field: 'email', direction: 'desc' }, 'name')).toEqual({ field: 'name', direction: 'asc' })
    expect(nextNtkTableSort({ field: 'name', direction: 'asc' }, 'name')).toEqual({ field: 'name', direction: 'desc' })
    expect(nextNtkTableSort({ field: 'name', direction: 'desc' }, 'name')).toBeNull()
  })

  it('getNtkTablePageInfo computes a clamped range in the middle of a result set', () => {
    expect(getNtkTablePageInfo({ page: 2, pageSize: 10, total: 25 })).toEqual({
      page: 2,
      pageSize: 10,
      total: 25,
      totalPages: 3,
      startRow: 11,
      endRow: 20,
      hasPrevious: true,
      hasNext: true,
      isEmpty: false,
    })
  })

  it('getNtkTablePageInfo clamps an over-range page to the last (partial) page', () => {
    expect(getNtkTablePageInfo({ page: 99, pageSize: 10, total: 25 })).toMatchObject({
      page: 3,
      startRow: 21,
      endRow: 25,
      hasPrevious: true,
      hasNext: false,
    })
  })

  it('getNtkTablePageInfo reports an empty, single-page state for zero rows', () => {
    expect(getNtkTablePageInfo({ page: 1, pageSize: 10, total: 0 })).toEqual({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 1,
      startRow: 0,
      endRow: 0,
      hasPrevious: false,
      hasNext: false,
      isEmpty: true,
    })
  })

  it('getNtkTablePageInfo defends against non-positive page/size and negative totals', () => {
    expect(getNtkTablePageInfo({ page: -2, pageSize: 0, total: -3 })).toEqual({
      page: 1,
      pageSize: 1,
      total: 0,
      totalPages: 1,
      startRow: 0,
      endRow: 0,
      hasPrevious: false,
      hasNext: false,
      isEmpty: true,
    })
  })
})