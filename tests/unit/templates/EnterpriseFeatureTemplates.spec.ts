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

describe('EnterpriseCommandCenterTemplate', () => {
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
          { id: 'alert-1', title: 'API latency spike', severity: 'danger', filterKeys: ['critical'] },
        ],
        activities: [
          { id: 'act-1', title: 'On-call acknowledged', filterKeys: ['critical'] },
        ],
        services: [
          { id: 'svc-1', name: 'Billing API', uptime: '99.95%', sla: '99.9%', filterKeys: ['critical'] },
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

  it('renders title, subtitle and KPI cards with tone and delta', () => {
    const wrapper = shallowMount(EnterpriseCommandCenterTemplate, {
      ...globalMountOptions,
      props: {
        title: 'Operations Hub',
        subtitle: 'Real-time visibility',
        kpis: [
          { id: 'k1', label: 'Uptime', value: '99.9%', icon: 'check_circle', tone: 'success' },
          { id: 'k2', label: 'Incidents', value: 4, icon: 'warning', tone: 'danger', delta: '+2 today' },
        ],
      },
    })

    expect(wrapper.find('h1').text()).toBe('Operations Hub')
    const kpis = wrapper.findAll('.ntk-template-enterprise-command__kpi')
    expect(kpis).toHaveLength(2)
    expect(kpis[0]?.classes()).toContain('ntk-template-enterprise-command__kpi--success')
    expect(kpis[0]?.text()).toContain('Uptime')
    expect(kpis[1]?.classes()).toContain('ntk-template-enterprise-command__kpi--danger')
    expect(kpis[1]?.text()).toContain('+2 today')
  })

  it('filters alerts by activeFilterId using filterKeys', () => {
    const wrapper = shallowMount(EnterpriseCommandCenterTemplate, {
      ...globalMountOptions,
      props: {
        activeFilterId: 'critical',
        filters: [
          { id: 'all', label: 'All', count: 2 },
          { id: 'critical', label: 'Critical', count: 1 },
        ],
        alerts: [
          { id: 'a1', title: 'Critical outage', severity: 'danger', filterKeys: ['critical'] },
          { id: 'a2', title: 'Minor blip', severity: 'neutral', filterKeys: ['warning'] },
        ],
      },
    })

    const alerts = wrapper.findAll('.ntk-template-enterprise-command__alert')
    expect(alerts).toHaveLength(1)
    expect(wrapper.text()).toContain('Critical outage')
    expect(wrapper.text()).not.toContain('Minor blip')
  })

  it('renders empty alert placeholder and service table rows', () => {
    const wrapper = shallowMount(EnterpriseCommandCenterTemplate, {
      ...globalMountOptions,
      props: {
        emptyAlertsLabel: 'All clear.',
        alerts: [],
        services: [
          { id: 's1', name: 'Auth Service', uptime: '99.99%', sla: '99.9%', owner: 'Platform team' },
        ],
      },
    })

    expect(wrapper.find('.ntk-template-enterprise-command__empty').text()).toBe('All clear.')
    const rows = wrapper.findAll('.ntk-template-enterprise-command__table tbody tr')
    expect(rows).toHaveLength(1)
    expect(rows[0]?.text()).toContain('Auth Service')
    expect(rows[0]?.text()).toContain('99.99%')
    expect(rows[0]?.text()).toContain('Platform team')
  })
})

describe('ApprovalQueueTemplate', () => {
  it('emits approval queue decisions and bulk actions', async () => {
    const wrapper = shallowMount(ApprovalQueueTemplate, {
      ...globalMountOptions,
      props: {
        selectedIds: ['req-1'],
        items: [
          { id: 'req-1', title: 'Vendor contract increase', statusLabel: 'Pending', filterKeys: ['pending'] },
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

  it('renders item meta fields, tags, and status tone class', () => {
    const wrapper = shallowMount(ApprovalQueueTemplate, {
      ...globalMountOptions,
      props: {
        title: 'Budget Approvals',
        items: [
          {
            id: 'r1',
            title: 'Cloud infra upgrade',
            statusLabel: 'Approved',
            tone: 'success',
            summary: 'Increase cloud budget by 20%',
            requester: 'João Silva',
            submittedAt: '2026-03-20',
            amount: '$12,000',
            tags: ['infra', 'cloud'],
          },
        ],
      },
    })

    expect(wrapper.find('h1').text()).toBe('Budget Approvals')
    const item = wrapper.find('.ntk-template-approval-queue__item')
    expect(item.find('.ntk-template-approval-queue__summary').text()).toContain('Increase cloud budget')
    expect(item.find('.ntk-template-approval-queue__meta').text()).toContain('João Silva')
    expect(item.find('.ntk-template-approval-queue__meta').text()).toContain('$12,000')
    expect(item.find('.ntk-template-approval-queue__status').classes()).toContain('ntk-template-approval-queue__status--success')

    const tags = wrapper.findAll('.ntk-template-approval-queue__tag')
    expect(tags).toHaveLength(2)
    expect(tags[0]?.text()).toBe('infra')
  })

  it('emits open-item and renders empty state', async () => {
    const wrapper = shallowMount(ApprovalQueueTemplate, {
      ...globalMountOptions,
      props: {
        emptyTitle: 'Nothing to review',
        emptySubtitle: 'You are all caught up.',
        items: [{ id: 'r1', title: 'Purchase order' }],
      },
    })

    await wrapper.get('q-btn-stub[label="Open"]').trigger('click')
    expect(wrapper.emitted('open-item')).toEqual([['r1']])

    const wrapperEmpty = shallowMount(ApprovalQueueTemplate, {
      ...globalMountOptions,
      props: { emptyTitle: 'Nothing to review', items: [] },
    })
    expect(wrapperEmpty.find('.ntk-template-approval-queue__empty').text()).toContain('Nothing to review')
  })
})

describe('AuditTimelineTemplate', () => {
  it('filters audit events and emits event-click contract', async () => {
    const wrapper = shallowMount(AuditTimelineTemplate, {
      ...globalMountOptions,
      props: {
        activeFilterId: 'security',
        searchValue: 'login',
        events: [
          { id: 'evt-1', title: 'Admin login', eventType: 'security', timestamp: '2026-03-26 09:30' },
          { id: 'evt-2', title: 'Template publish', eventType: 'release', timestamp: '2026-03-26 09:40' },
        ],
      },
    })

    expect(wrapper.findAll('.ntk-template-audit-timeline__event')).toHaveLength(1)
    expect(wrapper.text()).toContain('Admin login')
    expect(wrapper.text()).not.toContain('Template publish')

    await wrapper.get('.ntk-template-audit-timeline__event').trigger('click')
    expect(wrapper.emitted('event-click')).toEqual([['evt-1']])
  })

  it('renders event details with actor, target, description and tone class', () => {
    const wrapper = shallowMount(AuditTimelineTemplate, {
      ...globalMountOptions,
      props: {
        title: 'Security Audit',
        events: [
          {
            id: 'e1',
            title: 'Role assignment changed',
            eventType: 'access',
            timestamp: '2026-03-28 14:00',
            actor: 'admin@corp.com',
            target: 'user@corp.com',
            description: 'Promoted to admin role',
            tone: 'danger',
          },
        ],
      },
    })

    expect(wrapper.find('h1').text()).toBe('Security Audit')
    const event = wrapper.find('.ntk-template-audit-timeline__event')
    expect(event.classes()).toContain('ntk-template-audit-timeline__event--danger')
    expect(event.text()).toContain('admin@corp.com')
    expect(event.text()).toContain('user@corp.com')
    expect(event.text()).toContain('Promoted to admin role')
  })

  it('emits toolbar events and renders empty state', async () => {
    const wrapper = shallowMount(AuditTimelineTemplate, {
      ...globalMountOptions,
      props: {
        filters: [
          { id: 'all', label: 'All', count: 3 },
          { id: 'access', label: 'Access', count: 1 },
        ],
        emptyTitle: 'No events found',
        events: [],
      },
    })

    await wrapper.get('.ntk-template-audit-timeline__search input').setValue('breach')
    expect(wrapper.emitted('update:searchValue')).toEqual([['breach']])

    await wrapper.findAll('.ntk-template-audit-timeline__filter')[1]?.trigger('click')
    expect(wrapper.emitted('update:activeFilterId')?.at(-1)).toEqual(['access'])

    expect(wrapper.find('.ntk-template-audit-timeline__empty').text()).toContain('No events found')
  })
})