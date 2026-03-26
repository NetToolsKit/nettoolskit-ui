import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import DashboardWorkspaceTemplate from '../../../src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue'

const globalMountOptions = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': {
        template: '<div><slot /></div>',
      },
    },
  },
}

describe('DashboardWorkspaceTemplate', () => {
  it('emits control-panel and lane interaction events', async () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        actions: [
          {
            id: 'refresh',
            label: 'Refresh',
            icon: 'refresh',
          },
        ],
        filters: [
          { id: 'all', label: 'All', count: 2 },
          { id: 'urgent', label: 'Urgent', count: 1 },
        ],
        views: [
          { id: 'overview', label: 'Overview', icon: 'dashboard' },
          { id: 'pipeline', label: 'Pipeline', icon: 'view_kanban' },
        ],
        lanes: [
          {
            id: 'todo',
            title: 'To do',
            items: [
              { id: 'task-1', title: 'Prepare release notes', filterKeys: ['urgent'] },
              { id: 'task-2', title: 'Document API changes', filterKeys: ['all'] },
            ],
          },
        ],
      },
    })

    await wrapper.get('.ntk-template-dashboard-workspace__search-input').setValue('release')
    expect(wrapper.emitted('update:searchValue')).toEqual([['release']])

    await wrapper.findAll('.ntk-template-dashboard-workspace__filter')[1]?.trigger('click')
    expect(wrapper.emitted('update:activeFilterId')?.at(-1)).toEqual(['urgent'])

    await wrapper.findAll('.ntk-template-dashboard-workspace__view')[1]?.trigger('click')
    expect(wrapper.emitted('update:activeViewId')?.at(-1)).toEqual(['pipeline'])

    await wrapper.get('q-btn-stub[aria-label="Refresh"]').trigger('click')
    expect(wrapper.emitted('action-click')).toEqual([['refresh']])

    await wrapper.get('.ntk-template-dashboard-workspace__lane-item').trigger('click')
    expect(wrapper.emitted('lane-item-click')).toEqual([
      [{ laneId: 'todo', itemId: 'task-1' }],
    ])
  })

  it('filters lane items by active filter and search value', () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        activeFilterId: 'urgent',
        searchValue: 'migration',
        lanes: [
          {
            id: 'in-progress',
            title: 'In progress',
            items: [
              { id: 'task-1', title: 'Migration runbook', filterKeys: ['urgent'] },
              { id: 'task-2', title: 'Layout audit', filterKeys: ['backlog'] },
            ],
          },
        ],
      },
    })

    expect(wrapper.findAll('.ntk-template-dashboard-workspace__lane-item')).toHaveLength(1)
    expect(wrapper.text()).toContain('Migration runbook')
    expect(wrapper.text()).not.toContain('Layout audit')
  })
})