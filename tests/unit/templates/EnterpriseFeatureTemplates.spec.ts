import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import EnterpriseCommandCenterTemplate from '../../../src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue'
import ApprovalQueueTemplate from '../../../src/templates/features/enterprise/ApprovalQueueTemplate.vue'
import AuditTimelineTemplate from '../../../src/templates/features/enterprise/AuditTimelineTemplate.vue'

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

describe('Enterprise feature templates', () => {
  it('emits command-center interaction contract events', async () => {
    const wrapper = shallowMount(EnterpriseCommandCenterTemplate, {
      ...globalMountOptions,
      props: {
        actions: [{ id: 'refresh', label: 'Refresh', icon: 'refresh' }],
        filters: [
          { id: 'all', label: 'All', count: 2 },
          { id: 'critical', label: 'Critical', count: 1 },
        ],
        alerts: [
          {
            id: 'alert-1',
            title: 'API latency spike',
            severity: 'danger',
            filterKeys: ['critical'],
          },
        ],
        activities: [
          {
            id: 'act-1',
            title: 'On-call acknowledged',
            filterKeys: ['critical'],
          },
        ],
        services: [
          {
            id: 'svc-1',
            name: 'Billing API',
            uptime: '99.95%',
            sla: '99.9%',
            filterKeys: ['critical'],
          },
        ],
      },
    })

    await wrapper.get('.ntk-template-enterprise-command__search input').setValue('latency')
    expect(wrapper.emitted('update:searchValue')).toEqual([['latency']])

    await wrapper.findAll('.ntk-template-enterprise-command__filter')[1]?.trigger('click')
    expect(wrapper.emitted('update:activeFilterId')?.at(-1)).toEqual(['critical'])

    await wrapper.get('q-btn-stub[aria-label="Refresh"]').trigger('click')
    expect(wrapper.emitted('action-click')).toEqual([['refresh']])

    await wrapper.get('.ntk-template-enterprise-command__alert').trigger('click')
    expect(wrapper.emitted('alert-click')).toEqual([['alert-1']])

    await wrapper.get('.ntk-template-enterprise-command__activity').trigger('click')
    expect(wrapper.emitted('activity-click')).toEqual([['act-1']])

    await wrapper.get('.ntk-template-enterprise-command__table tbody tr').trigger('click')
    expect(wrapper.emitted('service-click')).toEqual([['svc-1']])
  })

  it('emits approval queue decisions and bulk actions', async () => {
    const wrapper = shallowMount(ApprovalQueueTemplate, {
      ...globalMountOptions,
      props: {
        selectedIds: ['req-1'],
        items: [
          {
            id: 'req-1',
            title: 'Vendor contract increase',
            statusLabel: 'Pending',
            filterKeys: ['pending'],
          },
        ],
      },
    })

    await wrapper.get('.ntk-template-approval-queue__selection input').setValue(false)
    expect(wrapper.emitted('update:selectedIds')).toEqual([[[]]])

    await wrapper.get('q-btn-stub[label="Approve"]').trigger('click')
    expect(wrapper.emitted('decision-click')).toEqual([
      [{ itemId: 'req-1', decision: 'approve' }],
    ])

    await wrapper.get('q-btn-stub[label="Approve selected"]').trigger('click')
    expect(wrapper.emitted('bulk-decision-click')).toEqual([
      [{ itemIds: ['req-1'], decision: 'approve' }],
    ])
  })

  it('filters audit events and emits event-click contract', async () => {
    const wrapper = shallowMount(AuditTimelineTemplate, {
      ...globalMountOptions,
      props: {
        activeFilterId: 'security',
        searchValue: 'login',
        events: [
          {
            id: 'evt-1',
            title: 'Admin login',
            eventType: 'security',
            timestamp: '2026-03-26 09:30',
          },
          {
            id: 'evt-2',
            title: 'Template publish',
            eventType: 'release',
            timestamp: '2026-03-26 09:40',
          },
        ],
      },
    })

    expect(wrapper.findAll('.ntk-template-audit-timeline__event')).toHaveLength(1)
    expect(wrapper.text()).toContain('Admin login')
    expect(wrapper.text()).not.toContain('Template publish')

    await wrapper.get('.ntk-template-audit-timeline__event').trigger('click')
    expect(wrapper.emitted('event-click')).toEqual([['evt-1']])
  })
})