/**
 * Public API contract snapshots for every Ds* component.
 *
 * STANDARD NTK-FE-STD-001 §21.7 requires a snapshot of the public surface
 * (props / defaults / events) and that breaking changes are explicit. Any change
 * to a component's prop names, required-ness, defaulting, or emitted events makes
 * these snapshots fail, forcing an intentional `vitest -u` acknowledgement (and,
 * per the standard, a semver decision) before the public API can drift.
 */

import { describe, expect, it } from 'vitest'
import type { ComponentOptions } from 'vue'

import {
  DsButton,
  DsCard,
  DsDialog,
  DsEmptyState,
  DsFilterBar,
  DsFormLayout,
  DsInput,
  DsMetricGrid,
  DsPage,
  DsPageHeader,
  DsSection,
  DsSelect,
  DsStateBlock,
  DsTable,
  DsToolbar,
  DsForm,
  DsFormPage,
  DsCrudPage,
  DsChip,
} from '@/design-system/vue'

interface PropDescriptor {
  readonly required: boolean
  readonly hasDefault: boolean
}

interface ApiDescriptor {
  readonly name: string
  readonly props: Record<string, PropDescriptor>
  readonly emits: readonly string[]
}

const normalizeEmits = (emits: unknown): string[] => {
  if (!emits) {
    return []
  }
  if (Array.isArray(emits)) {
    return [...emits].sort()
  }
  return Object.keys(emits as Record<string, unknown>).sort()
}

const describeApi = (component: unknown): ApiDescriptor => {
  const options = component as ComponentOptions
  const rawProps = (options.props ?? {}) as Record<string, unknown>

  const props: Record<string, PropDescriptor> = {}
  for (const key of Object.keys(rawProps).sort()) {
    const def = rawProps[key]
    const propObject = def && typeof def === 'object' && !Array.isArray(def)
      ? (def as Record<string, unknown>)
      : {}
    props[key] = {
      required: Boolean(propObject.required),
      hasDefault: 'default' in propObject,
    }
  }

  return {
    name: options.name ?? '(anonymous)',
    props,
    emits: normalizeEmits((options as { emits?: unknown }).emits),
  }
}

const components: Record<string, unknown> = {
  DsButton,
  DsCard,
  DsDialog,
  DsEmptyState,
  DsFilterBar,
  DsFormLayout,
  DsInput,
  DsMetricGrid,
  DsPage,
  DsPageHeader,
  DsSection,
  DsSelect,
  DsStateBlock,
  DsTable,
  DsToolbar,
  DsForm,
  DsFormPage,
  DsCrudPage,
  DsChip,
}

describe('Ds* public API contract', () => {
  it('every component declares a stable name', () => {
    for (const [exportName, component] of Object.entries(components)) {
      expect(describeApi(component).name, `${exportName} should expose its component name`).toBe(exportName)
    }
  })

  for (const [exportName, component] of Object.entries(components)) {
    it(`pins the public props/events of ${exportName}`, () => {
      expect(describeApi(component)).toMatchSnapshot()
    })
  }
})