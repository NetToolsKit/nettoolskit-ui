import {
  isControlledCssVariableValue,
  type ControlledCssVariableAssignment,
  type CssVariableName,
  type ResolvedTokenMap,
} from '../../theme'

export const quasarCssVariableSources = {
  '--q-primary': ['--ntk-primary', '--ntk-accent'],
  '--q-secondary': ['--ntk-secondary', '--ntk-accent', '--ntk-primary', '--ntk-text-muted', '--ntk-text-secondary'],
  '--q-accent': ['--ntk-accent-hover', '--ntk-accent', '--ntk-primary-dark'],
  '--q-dark': ['--ntk-dark', '--ntk-bg-card', '--ntk-card-bg', '--ntk-bg-secondary'],
  '--q-dark-page': ['--ntk-dark-page', '--ntk-shell-bg', '--ntk-bg-primary'],
  '--q-positive': ['--ntk-success', '--ntk-positive'],
  '--q-warning': ['--ntk-warning'],
  '--q-negative': ['--ntk-error', '--ntk-negative'],
  '--q-info': ['--ntk-info'],
} as const

export type QuasarCssVariableName = keyof typeof quasarCssVariableSources
export type QuasarCssVariableAssignment = ControlledCssVariableAssignment<QuasarCssVariableName>

interface ResolvedTokenValue {
  source: CssVariableName
  value: string
}

function resolveFirstTokenValue(
  tokens: ResolvedTokenMap,
  sources: readonly CssVariableName[],
): ResolvedTokenValue | null {
  for (const source of sources) {
    const value = tokens[source]
    if (isControlledCssVariableValue(value)) {
      return {
        source,
        value: value.trim(),
      }
    }
  }

  return null
}

export function createQuasarCssVariableAssignments(
  tokens: ResolvedTokenMap,
): QuasarCssVariableAssignment[] {
  const assignments: QuasarCssVariableAssignment[] = []

  for (const [name, sources] of Object.entries(quasarCssVariableSources)) {
    const resolved = resolveFirstTokenValue(tokens, sources)
    if (!resolved) {
      continue
    }

    assignments.push({
      name: name as QuasarCssVariableName,
      value: resolved.value,
      source: resolved.source,
    })
  }

  return assignments
}

export function createQuasarCssVariableAssignmentMap(
  tokens: ResolvedTokenMap,
): Partial<Record<QuasarCssVariableName, string>> {
  return Object.fromEntries(
    createQuasarCssVariableAssignments(tokens).map(assignment => [assignment.name, assignment.value]),
  ) as Partial<Record<QuasarCssVariableName, string>>
}