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

  it('renders title, subtitle, and hero chips', () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        title: 'Sprint Board',
        subtitle: 'Current sprint overview',
        chips: [{ id: 'c1', text: '12 tasks', icon: 'task' }],
      },
    })

    expect(wrapper.find('.ntk-template-dashboard-workspace__title').text()).toBe('Sprint Board')
    expect(wrapper.find('.ntk-template-dashboard-workspace__subtitle').text()).toContain('Current sprint overview')
    expect(wrapper.find('.ntk-template-dashboard-workspace__chips').exists()).toBe(true)
    expect(wrapper.text()).toContain('12 tasks')
  })

  it('renders panel cards and emits panel-click', async () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        panels: [
          { id: 'p1', title: 'Backlog', value: 24, description: 'Not started', icon: 'inbox', tone: 'neutral' },
          { id: 'p2', title: 'Blocked', value: 3, icon: 'block', tone: 'danger' },
        ],
      },
    })

    const panels = wrapper.findAll('.ntk-template-dashboard-workspace__panel')
    expect(panels).toHaveLength(2)
    expect(panels[0]?.text()).toContain('Backlog')
    expect(panels[0]?.text()).toContain('24')
    expect(panels[0]?.text()).toContain('Not started')
    expect(panels[1]?.classes()).toContain('ntk-template-dashboard-workspace__panel--danger')

    await panels[0]?.trigger('click')
    expect(wrapper.emitted('panel-click')).toEqual([['p1']])
  })

  it('renders explicit metrics with tone and delta', () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        metrics: [
          { id: 'm1', label: 'Completed', value: 18, icon: 'check_circle', tone: 'success', delta: '+3 this week' },
          { id: 'm2', label: 'Overdue', value: 2, icon: 'warning', tone: 'danger' },
        ],
      },
    })

    const metrics = wrapper.findAll('.ntk-template-dashboard-workspace__metric')
    expect(metrics).toHaveLength(2)
    expect(metrics[0]?.classes()).toContain('ntk-template-dashboard-workspace__metric--success')
    expect(metrics[0]?.text()).toContain('18')
    expect(metrics[0]?.text()).toContain('+3 this week')
    expect(metrics[1]?.classes()).toContain('ntk-template-dashboard-workspace__metric--danger')
  })

  it('renders lane item subtitle, badge, and assignee', () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        lanes: [
          {
            id: 'todo',
            title: 'To do',
            items: [
              {
                id: 'task-1',
                title: 'Deploy hotfix',
                subtitle: 'Priority: critical',
                badge: 'P0',
                assignee: 'Ana L.',
              },
            ],
          },
        ],
      },
    })

    const item = wrapper.find('.ntk-template-dashboard-workspace__lane-item')
    expect(item.find('.ntk-template-dashboard-workspace__lane-item-subtitle').text()).toBe('Priority: critical')
    expect(item.find('.ntk-template-dashboard-workspace__lane-badge').text()).toBe('P0')
    expect(item.find('.ntk-template-dashboard-workspace__lane-assignee').text()).toBe('Ana L.')
  })

  it('renders empty lane placeholder when lane has no items', () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        emptyLaneLabel: 'Nothing here yet',
        lanes: [{ id: 'done', title: 'Done', items: [] }],
      },
    })

    expect(wrapper.find('.ntk-template-dashboard-workspace__lane-empty').text()).toBe('Nothing here yet')
    expect(wrapper.findAll('.ntk-template-dashboard-workspace__lane-item')).toHaveLength(0)
  })

  it('renders multiple lanes with correct titles', () => {
    const wrapper = shallowMount(DashboardWorkspaceTemplate, {
      ...globalMountOptions,
      props: {
        lanes: [
          { id: 'todo', title: 'To do', items: [{ id: 't1', title: 'Task A' }] },
          { id: 'doing', title: 'In progress', items: [{ id: 't2', title: 'Task B' }] },
          { id: 'done', title: 'Done', items: [{ id: 't3', title: 'Task C' }] },
        ],
      },
    })

    const lanes = wrapper.findAll('.ntk-template-dashboard-workspace__lane')
    expect(lanes).toHaveLength(3)
    expect(lanes[0]?.text()).toContain('To do')
    expect(lanes[1]?.text()).toContain('In progress')
    expect(lanes[2]?.text()).toContain('Done')
  })
})