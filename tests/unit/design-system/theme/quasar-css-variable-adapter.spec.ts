import { describe, expect, it } from 'vitest'

import {
  createQuasarCssVariableAssignmentMap,
  createQuasarCssVariableAssignments,
} from '../../../../src/design-system/adapters/quasar'
import {
  designTokenValues,
} from '../../../../src/design-system/tokens'

describe('Quasar CSS variable adapter', () => {
  it('emits controlled Quasar assignments from resolved design tokens', () => {
    const assignments = createQuasarCssVariableAssignments({
      '--ntk-primary': '#0f766e',
      '--ntk-accent': '#14b8a6',
      '--ntk-accent-hover': '#115e59',
      '--ntk-success': '#10b981',
      '--ntk-warning': '#f59e0b',
      '--ntk-error': '#ef4444',
      '--ntk-info': '#0284c7',
      '--ntk-dark': '#1a1a19',
      '--ntk-dark-page': '#0e0e0d',
    })

    expect(assignments).toEqual([
      { name: '--q-primary', value: '#0f766e', source: '--ntk-primary' },
      { name: '--q-secondary', value: '#14b8a6', source: '--ntk-accent' },
      { name: '--q-accent', value: '#115e59', source: '--ntk-accent-hover' },
      { name: '--q-dark', value: '#1a1a19', source: '--ntk-dark' },
      { name: '--q-dark-page', value: '#0e0e0d', source: '--ntk-dark-page' },
      { name: '--q-positive', value: '#10b981', source: '--ntk-success' },
      { name: '--q-warning', value: '#f59e0b', source: '--ntk-warning' },
      { name: '--q-negative', value: '#ef4444', source: '--ntk-error' },
      { name: '--q-info', value: '#0284c7', source: '--ntk-info' },
    ])
  })

  it('prefers explicit secondary and falls back past unsafe source values', () => {
    const assignmentMap = createQuasarCssVariableAssignmentMap({
      '--ntk-primary': '#0f766e',
      '--ntk-secondary': '#c96442',
      '--ntk-accent-hover': 'red; background: blue',
      '--ntk-accent': '#14b8a6',
    })

    expect(assignmentMap['--q-primary']).toBe('#0f766e')
    expect(assignmentMap['--q-secondary']).toBe('#c96442')
    expect(assignmentMap['--q-accent']).toBe('#14b8a6')
  })

  it('does not read or mutate DOM styles', () => {
    const root = document.documentElement
    root.style.setProperty('--q-primary', '#ffffff')

    const assignments = createQuasarCssVariableAssignments({
      '--ntk-primary': '#0f766e',
      '--q-primary': '#ef4444',
    })

    expect(assignments).toEqual([
      { name: '--q-primary', value: '#0f766e', source: '--ntk-primary' },
      { name: '--q-secondary', value: '#0f766e', source: '--ntk-primary' },
    ])
    expect(root.style.getPropertyValue('--q-primary')).toBe('#ffffff')
  })

  it('accepts values sourced from the generated token map', () => {
    const assignmentMap = createQuasarCssVariableAssignmentMap({
      '--ntk-primary': designTokenValues['color.primary'],
      '--ntk-success': designTokenValues['feedback.success'],
      '--ntk-warning': designTokenValues['feedback.warning'],
      '--ntk-error': designTokenValues['feedback.error'],
      '--ntk-info': designTokenValues['feedback.info'],
    })

    expect(assignmentMap).toMatchObject({
      '--q-primary': '#0f766e',
      '--q-positive': '#10b981',
      '--q-warning': '#f59e0b',
      '--q-negative': '#ef4444',
      '--q-info': '#14b8a6',
    })
  })
})