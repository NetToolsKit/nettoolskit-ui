/**
 * Mount coverage for the usability-expansion Vue wrappers.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

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

describe('DsPageHeader', () => {
  it('renders a labelled heading, description, and slots', () => {
    const wrapper = mount(DsPageHeader, {
      props: { id: 'clients', title: 'Clients', description: 'Manage clients', eyebrow: 'Admin' },
      slots: { actions: '<button type="button">New</button>' },
    })

    const header = wrapper.get('header')
    const heading = wrapper.get('h1')
    expect(heading.attributes('id')).toBe('clients__title')
    expect(header.attributes('aria-labelledby')).toBe('clients__title')
    expect(wrapper.text()).toContain('Manage clients')
    expect(wrapper.text()).toContain('Admin')
    expect(wrapper.get('.ntk-page-header__actions').text()).toContain('New')
  })

  it('honors the heading level', () => {
    const wrapper = mount(DsPageHeader, { props: { title: 'Sub', headingLevel: 2 } })
    expect(wrapper.find('h2').exists()).toBe(true)
    expect(wrapper.find('h1').exists()).toBe(false)
  })
})

describe('DsToolbar', () => {
  it('exposes toolbar semantics and density classes', () => {
    const wrapper = mount(DsToolbar, {
      props: { ariaLabel: 'Actions', density: 'compact' },
      slots: { default: '<button type="button">A</button>', end: '<button type="button">B</button>' },
    })

    const toolbar = wrapper.get('[role="toolbar"]')
    expect(toolbar.attributes('aria-label')).toBe('Actions')
    expect(toolbar.classes()).toContain('ntk-toolbar--density-compact')
    expect(wrapper.text()).toContain('A')
    expect(wrapper.get('.ntk-toolbar__group--end').text()).toContain('B')
  })
})

describe('DsEmptyState', () => {
  it('renders status role, content, and actions', () => {
    const wrapper = mount(DsEmptyState, {
      props: { title: 'No results', description: 'Try other filters', icon: '📭', intent: 'info' },
      slots: { actions: '<button type="button">Reset</button>' },
    })

    const root = wrapper.get('[role="status"]')
    expect(root.classes()).toContain('ntk-empty-state--intent-info')
    expect(root.get('.ntk-empty-state__icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toContain('No results')
    expect(wrapper.text()).toContain('Try other filters')
    expect(wrapper.get('.ntk-empty-state__actions').text()).toContain('Reset')
  })
})

describe('DsStateBlock', () => {
  it('renders a busy loading spinner with a live region', () => {
    const wrapper = mount(DsStateBlock, { props: { state: 'loading', title: 'Loading' } })
    const root = wrapper.get('.ntk-state-block')
    expect(root.attributes('role')).toBe('status')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(root.attributes('aria-live')).toBe('polite')
    expect(wrapper.find('.ntk-state-block__spinner').exists()).toBe(true)
  })

  it('uses the alert role for errors', () => {
    const wrapper = mount(DsStateBlock, { props: { state: 'error', title: 'Failed' } })
    expect(wrapper.get('.ntk-state-block').attributes('role')).toBe('alert')
    expect(wrapper.get('.ntk-state-block').classes()).toContain('ntk-state-block--state-error')
  })

  it('renders the requested number of skeleton lines', () => {
    const wrapper = mount(DsStateBlock, { props: { state: 'skeleton', skeletonLines: 4 } })
    expect(wrapper.findAll('.ntk-state-block__skeleton-line')).toHaveLength(4)
    expect(wrapper.get('.ntk-state-block').attributes('aria-busy')).toBe('true')
  })
})

describe('DsMetricGrid', () => {
  it('renders metric items as a labelled list', () => {
    const wrapper = mount(DsMetricGrid, {
      props: {
        ariaLabel: 'KPIs',
        columns: 3,
        metrics: [
          { id: 'a', label: 'Revenue', value: '12k', delta: '+4%', deltaDirection: 'up' },
          { id: 'b', label: 'Churn', value: '1.2%', delta: '-0.3%', deltaDirection: 'down' },
        ],
      },
    })

    const grid = wrapper.get('[role="list"]')
    expect(grid.classes()).toContain('ntk-metric-grid--cols-3')
    const items = wrapper.findAll('[role="listitem"]')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('Revenue')
    expect(items[0].text()).toContain('12k')
    expect(items[0].get('.ntk-metric-grid__delta').classes()).toContain('ntk-metric-grid__delta--up')
  })
})

describe('DsFormLayout', () => {
  it('renders fields, legend, columns, and actions', () => {
    const wrapper = mount(DsFormLayout, {
      props: { legend: 'Profile', columns: 2, variant: 'grid' },
      slots: { default: '<input aria-label="name">', actions: '<button type="submit">Save</button>' },
    })

    expect(wrapper.get('.ntk-form-layout').classes()).toContain('ntk-form-layout--cols-2')
    expect(wrapper.get('.ntk-form-layout__legend').text()).toBe('Profile')
    expect(wrapper.get('.ntk-form-layout__fields').find('input').exists()).toBe(true)
    expect(wrapper.get('.ntk-form-layout__actions').text()).toContain('Save')
  })
})

describe('DsFilterBar', () => {
  it('emits apply on submit and reset on reset', async () => {
    const wrapper = mount(DsFilterBar, {
      props: { ariaLabel: 'Customer filters' },
      slots: { search: '<input aria-label="search">' },
    })

    const form = wrapper.get('form[role="search"]')
    expect(form.attributes('aria-label')).toBe('Customer filters')

    await form.trigger('submit')
    await form.trigger('reset')

    expect(wrapper.emitted('apply')).toHaveLength(1)
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('reflects the loading state', () => {
    const wrapper = mount(DsFilterBar, { props: { loading: true } })
    const form = wrapper.get('form')
    expect(form.attributes('aria-busy')).toBe('true')
    expect(form.classes()).toContain('ntk-filter-bar--is-loading')
  })
})

describe('DsDialog', () => {
  it('stays closed by default and does not emit close on mount', () => {
    const wrapper = mount(DsDialog, { props: { modelValue: false, title: 'Confirm' } })
    expect(wrapper.get('dialog').attributes('open')).toBeUndefined()
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('opens, labels, and closes through the close button', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'confirm', modelValue: false, title: 'Confirm delete', description: 'This cannot be undone' },
      attachTo: document.body,
    })

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    const dialog = wrapper.get('dialog')
    expect(dialog.attributes('open')).toBeDefined()
    expect(dialog.attributes('aria-labelledby')).toBe('confirm__title')
    expect(dialog.attributes('aria-describedby')).toBe('confirm__description')

    await wrapper.get('.ntk-dialog__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])

    wrapper.unmount()
  })

  it('restores focus to the opener when closed', async () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()

    const wrapper = mount(DsDialog, {
      props: { modelValue: false, title: 'Focus' },
      attachTo: document.body,
    })

    await wrapper.setProps({ modelValue: true })
    await nextTick()
    await wrapper.setProps({ modelValue: false })
    await nextTick()

    expect(document.activeElement).toBe(opener)

    wrapper.unmount()
    opener.remove()
  })

  it('requests close on Escape unless persistent', async () => {
    const wrapper = mount(DsDialog, { props: { modelValue: true, title: 'Esc' }, attachTo: document.body })
    await nextTick()

    await wrapper.get('dialog').trigger('cancel')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])

    wrapper.unmount()

    const persistent = mount(DsDialog, { props: { modelValue: true, title: 'Esc', persistent: true }, attachTo: document.body })
    await nextTick()
    await persistent.get('dialog').trigger('cancel')
    expect(persistent.emitted('update:modelValue')).toBeUndefined()
    persistent.unmount()
  })

  it('renders a header bar, scrollable body, and an always-present slim footer', async () => {
    const wrapper = mount(DsDialog, {
      props: { modelValue: true, title: 'Header bar' },
      slots: { default: '<p>Body content</p>' },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.get('.ntk-dialog__header').exists()).toBe(true)
    expect(wrapper.get('.ntk-dialog__body').text()).toContain('Body content')
    const footer = wrapper.get('.ntk-dialog__footer')
    expect(footer.exists()).toBe(true)
    expect(footer.classes()).not.toContain('ntk-dialog__footer--actions')
    wrapper.unmount()
  })

  it('grows the footer into an actions region when the actions slot is filled', async () => {
    const wrapper = mount(DsDialog, {
      props: { modelValue: true, title: 'With actions' },
      slots: { actions: '<button type="button">OK</button>' },
      attachTo: document.body,
    })
    await nextTick()

    const footer = wrapper.get('.ntk-dialog__footer')
    expect(footer.classes()).toContain('ntk-dialog__footer--actions')
    expect(footer.text()).toContain('OK')
    wrapper.unmount()
  })
})