/**
 * Automated accessibility checks (axe-core) for the usability-expansion
 * components, per STANDARD NTK-FE-STD-001 §21.8.
 *
 * The STANDARD baseline is WCAG 2.2 AA, so axe is scoped to the WCAG A/AA tags;
 * this intentionally excludes best-practice-only rules (`region`,
 * `landmark-unique`, ...) that are noisy for an isolated component fragment.
 * `color-contrast` is disabled because jsdom cannot lay out elements — contrast
 * across light/dark/high-contrast is validated by the browser/visual gate. axe
 * also requires the node to be attached to the document, so every component is
 * mounted with `attachTo: document.body` and unmounted afterwards.
 */

import axe, { type RunOptions } from 'axe-core'
import { mount } from '@vue/test-utils'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, type Component } from 'vue'

import {
  DsDialog,
  DsEmptyState,
  DsFilterBar,
  DsFormLayout,
  DsMetricGrid,
  DsPageHeader,
  DsStateBlock,
  DsToolbar,
} from '@/design-system/vue'

const axeOptions: RunOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  },
  rules: {
    'color-contrast': { enabled: false },
  },
}

const expectNoViolations = async <C extends Component>(
  component: C,
  options: ComponentMountingOptions<C>,
): Promise<void> => {
  const wrapper = mount(component, { attachTo: document.body, ...options })
  try {
    await nextTick()
    const results = await axe.run(wrapper.element, axeOptions)
    const summary = results.violations
      .map((violation) => `${violation.id} (${violation.impact}): ${violation.help}`)
      .join('\n')
    expect(results.violations, summary).toEqual([])
  } finally {
    wrapper.unmount()
  }
}

describe('usability components accessibility (axe-core)', () => {
  it('DsPageHeader has no violations', async () => {
    await expectNoViolations(DsPageHeader, {
      props: { id: 'clients', title: 'Clients', description: 'Manage clients', eyebrow: 'Admin' },
      slots: { actions: '<button type="button">New</button>' },
    })
  })

  it('DsToolbar has no violations', async () => {
    await expectNoViolations(DsToolbar, {
      props: { ariaLabel: 'Actions' },
      slots: { default: '<button type="button">A</button>', end: '<button type="button">B</button>' },
    })
  })

  it('DsEmptyState has no violations', async () => {
    await expectNoViolations(DsEmptyState, {
      props: { title: 'No results', description: 'Try other filters', icon: '📭' },
      slots: { actions: '<button type="button">Reset</button>' },
    })
  })

  it('DsStateBlock (error) has no violations', async () => {
    await expectNoViolations(DsStateBlock, {
      props: { state: 'error', title: 'Failed to load', description: 'Try again later' },
    })
  })

  it('DsMetricGrid has no violations', async () => {
    await expectNoViolations(DsMetricGrid, {
      props: {
        ariaLabel: 'KPIs',
        metrics: [
          { id: 'a', label: 'Revenue', value: '12k', delta: '+4%', deltaDirection: 'up' },
          { id: 'b', label: 'Churn', value: '1.2%', delta: '-0.3%', deltaDirection: 'down' },
        ],
      },
    })
  })

  it('DsFilterBar has no violations', async () => {
    await expectNoViolations(DsFilterBar, {
      props: { ariaLabel: 'Customer filters' },
      slots: { search: '<label>Search<input type="search"></label>' },
    })
  })

  it('DsFormLayout has no violations', async () => {
    await expectNoViolations(DsFormLayout, {
      props: { legend: 'Profile', columns: 2, variant: 'grid' },
      slots: {
        default: '<label>Name<input type="text"></label>',
        actions: '<button type="submit">Save</button>',
      },
    })
  })

  it('DsDialog (open) has no violations', async () => {
    await expectNoViolations(DsDialog, {
      props: {
        id: 'confirm',
        modelValue: true,
        title: 'Confirm delete',
        description: 'This cannot be undone',
      },
      slots: { actions: '<button type="button">Confirm</button>' },
    })
  })
})